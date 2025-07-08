// Contact 1:1 채팅 기능
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  getDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { AuthSystem } from './auth-system.js';
import { firebaseAuth, firebaseDB } from './firebase-config.js';
const authSystem = new AuthSystem({ auth: firebaseAuth, db: firebaseDB });

// Contact 채팅 관련 DOM 요소들
const contactChatMessages = document.getElementById('contact-chat-messages');
const contactChatInput = document.getElementById('contact-chat-input');
const contactChatSend = document.getElementById('contact-chat-send');
const devStatus = document.getElementById('dev-status');

let contactUnsubscribeMessages = null;
const DEV_UID = 'XXuJ2w1h84Ry5lrF9UUHGOTawhp2';
let selectedTargetUID = null;

// 페이지 로드 시 익명 인증 자동 실행
const auth = getAuth();
if (!auth.currentUser) {
  signInAnonymously(auth)
    .then(() => {
      console.log("익명 인증 성공");
    })
    .catch((error) => {
      console.error("익명 인증 실패:", error);
    });
}

// Dev 계정용 채팅방 선택 UI 생성
function renderDevChatSelector(userList) {
  let selector = document.getElementById('dev-chat-selector');
  if (!selector) {
    selector = document.createElement('select');
    selector.id = 'dev-chat-selector';
    selector.style.margin = '0.5em 0 1em 0';
    selector.style.fontSize = '1.1em';
    selector.style.borderRadius = '1em';
    selector.style.padding = '0.3em 1em';
    selector.style.background = '#23243a';
    selector.style.color = '#fff';
    selector.style.border = '1.5px solid #7ecbff';
    contactChatMessages.parentElement.insertBefore(selector, contactChatMessages);
  }
  selector.innerHTML = '';
  userList.forEach(uid => {
    const option = document.createElement('option');
    option.value = uid;
    option.textContent = `유저: ${uid}`;
    selector.appendChild(option);
  });
  selector.onchange = () => {
    selectedTargetUID = selector.value;
    updateContactChatUI();
  };
  if (userList.length > 0) {
    selectedTargetUID = userList[0];
  }
}

// 최근 메시지에서 상대방 UID 목록 추출 (Dev 계정용)
async function fetchRecentUserUIDsForDev() {
  // contact-messages 전체에서 최근 메시지 30개를 가져와서, 상대방 UID 추출
  const q = query(collection(window.firebaseDB, 'contact-messages'), orderBy('timestamp', 'desc'), limit(30));
  const snapshot = await getDocs(q);
  const uids = new Set();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.userId && data.userId !== DEV_UID && data.userId !== 'ANON_DEV') {
      uids.add(data.userId);
    }
  });
  return Array.from(uids);
}

// Contact 채팅 메시지 전송
async function sendContactMessage() {
  const message = contactChatInput.value.trim();
  
  if (!message || (!window.currentUser && !window.anonymousUser)) {
    console.log('Contact 메시지 전송 조건 불충족:', { message, currentUser: !!window.currentUser, anonymousUser: !!window.anonymousUser });
    return;
  }
  
  // Firebase 연결 확인
  if (!window.firebaseDB) {
    console.error('Firebase DB가 초기화되지 않았습니다!');
    alert('Firebase 연결에 문제가 있습니다. 페이지를 새로고침해주세요.');
    return;
  }
  
  // 중복 전송 방지
  if (contactChatSend.disabled) {
    console.log('이미 전송 중입니다.');
    return;
  }
  
  try {
    contactChatSend.disabled = true;
    contactChatInput.disabled = true;

    // chatId 생성: 항상 [본인 UID, 'ANON_DEV'].sort().join('_')
    let myUID, myName, isAnonymous, isDev;
    if (window.currentUser) {
      myUID = window.currentUser.uid;
      isAnonymous = false;
      isDev = false;
      // 저장된 사용자 이름 가져오기
      try {
        const userDoc = await getDoc(doc(window.firebaseDB, 'users', window.currentUser.uid));
        if (userDoc.exists()) {
          myName = userDoc.data().userName;
        } else {
          myName = window.currentUser.email; // 폴백
        }
      } catch (error) {
        console.error('사용자 이름 가져오기 오류:', error);
        myName = window.currentUser.email; // 폴백
      }
    } else {
      myUID = window.anonymousUser.uid;
      myName = window.anonymousUser.name;
      isAnonymous = true;
      isDev = window.anonymousUser.isDev;
    }
    let chatId;
    if (window.currentUser && window.currentUser.uid === DEV_UID) {
      if (!selectedTargetUID) {
        alert('대화할 유저를 선택하세요.');
        contactChatSend.disabled = false;
        contactChatInput.disabled = false;
        return;
      }
      chatId = [selectedTargetUID, 'ANON_DEV'].sort().join('_');
    } else {
      chatId = [myUID, 'ANON_DEV'].sort().join('_');
    }

    const messageData = {
      text: message,
      timestamp: serverTimestamp(),
      type: 'contact',
      userId: myUID,
      userName: myName,
      isAnonymous: isAnonymous,
      isDev: isDev || false
    };

    console.log('Contact 메시지 전송 시작:', messageData, 'chatId:', chatId);

    // Contact 메시지를 chatId별 하위 컬렉션에 저장
    const docRef = await addDoc(collection(window.firebaseDB, 'contact-messages', chatId, 'messages'), messageData);

    console.log('Contact 메시지 전송 완료, 문서 ID:', docRef.id);

    // 입력창 비우기
    contactChatInput.value = '';
    
  } catch (error) {
    console.error('Contact 메시지 전송 오류:', error);
    alert('메시지 전송에 실패했습니다: ' + error.message);
  } finally {
    contactChatSend.disabled = false;
    contactChatInput.disabled = false;
    contactChatInput.focus(); // 포커스 복원
  }
}

// Contact 채팅 메시지 구독
function subscribeToContactMessages() {
  console.log('Contact 메시지 구독 시작...');
  
  // Firebase 연결 확인
  if (!window.firebaseDB) {
    console.error('Firebase DB가 초기화되지 않았습니다!');
    return;
  }
  
  // 기존 구독이 있다면 해제
  if (contactUnsubscribeMessages) {
    console.log('기존 Contact 구독 해제');
    contactUnsubscribeMessages();
    contactUnsubscribeMessages = null;
  }
  
  // chatId 생성: 항상 [본인 UID, 'ANON_DEV'].sort().join('_')
  let myUID, isDev;
  if (window.currentUser) {
    myUID = window.currentUser.uid;
    isDev = false;
  } else if (window.anonymousUser) {
    myUID = window.anonymousUser.uid;
    isDev = window.anonymousUser.isDev;
  } else {
    return;
  }
  let chatId;
  if (window.currentUser && window.currentUser.uid === DEV_UID) {
    if (!selectedTargetUID) {
      alert('대화할 유저를 선택하세요.');
      return;
    }
    chatId = [selectedTargetUID, 'ANON_DEV'].sort().join('_');
  } else {
    chatId = [myUID, 'ANON_DEV'].sort().join('_');
  }

  try {
    // Contact 메시지 쿼리 (chatId별 하위 컬렉션)
    const contactMessagesQuery = query(
      collection(window.firebaseDB, 'contact-messages', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    
    console.log('Contact Firestore 쿼리 생성 완료', chatId);
    
    contactUnsubscribeMessages = onSnapshot(contactMessagesQuery, (snapshot) => {
      console.log('새 Contact 메시지 수신:', snapshot.docs.length, '개');
      
      const messages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
        });
      });
      
      // 클라이언트에서 시간순 정렬
      messages.sort((a, b) => a.timestamp - b.timestamp);
      displayContactMessages(messages);
    }, (error) => {
      console.error('Contact 메시지 구독 오류:', error);
      
      // 에러 발생 시 구독 해제
      if (contactUnsubscribeMessages) {
        contactUnsubscribeMessages();
        contactUnsubscribeMessages = null;
      }
    });
    
    console.log('Contact 메시지 구독 설정 완료');
  } catch (error) {
    console.error('Contact 메시지 구독 설정 오류:', error);
  }
}

// Contact 메시지 표시
function displayContactMessages(messages) {
  console.log('Contact 메시지 표시:', messages.length, '개');
  
  contactChatMessages.innerHTML = '';
  
  if (messages.length === 0) {
    contactChatMessages.innerHTML = `
      <div class="welcome-message">
        <p>안녕하세요! 개발자와 1:1 채팅을 시작해보세요.</p>
        <p>로그인하거나 익명으로 참여할 수 있습니다.</p>
      </div>
    `;
    return;
  }
  
  messages.forEach(message => {
    const messageElement = document.createElement('div');
    const currentUserId = window.currentUser?.uid || window.anonymousUser?.uid;
    messageElement.className = `message ${message.userId === currentUserId ? 'own' : 'other'}`;
    
    // 타임스탬프 처리
    let timestamp = '';
    if (message.timestamp) {
      try {
        const date = message.timestamp instanceof Date ? message.timestamp : message.timestamp.toDate();
        timestamp = date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (error) {
        console.error('타임스탬프 변환 오류:', error);
        timestamp = '방금 전';
      }
    }
    
    const displayName = message.isAnonymous ? 
      `${escapeHtml(message.userName)} (익명)` : 
      escapeHtml(message.userName);
    
    messageElement.innerHTML = `
      <div class="message-header">${displayName}</div>
      <div class="message-content">${escapeHtml(message.text)}</div>
      <div class="message-time">${timestamp}</div>
    `;
    
    contactChatMessages.appendChild(messageElement);
  });
  
  // 스크롤을 맨 아래로
  setTimeout(() => {
    contactChatMessages.scrollTop = contactChatMessages.scrollHeight;
  }, 100);
}

// Contact 채팅 UI 업데이트
async function updateContactChatUI() {
  if (window.currentUser && window.currentUser.uid === DEV_UID) {
    // Dev 계정: 최근 유저 목록 드롭다운 표시
    const userList = await fetchRecentUserUIDsForDev();
    renderDevChatSelector(userList);
    if (!selectedTargetUID) return;
  } else {
    // 기존 동작
    const selector = document.getElementById('dev-chat-selector');
    if (selector) selector.remove();
  }
  if (window.currentUser || window.anonymousUser) {
    // 로그인된 사용자 또는 익명 사용자
    contactChatInput.disabled = false;
    contactChatSend.disabled = false;
    // Contact 메시지 구독 시작
    subscribeToContactMessages();
  } else {
    // 로그인하지 않은 사용자
    contactChatInput.disabled = true;
    contactChatSend.disabled = true;
    // 환영 메시지 표시
    contactChatMessages.innerHTML = `
      <div class="welcome-message">
        <p>안녕하세요! 개발자와 1:1 채팅을 시작해보세요.</p>
        <p>로그인하거나 익명으로 참여할 수 있습니다.</p>
      </div>
    `;
    // 구독 해제
    if (contactUnsubscribeMessages) {
      contactUnsubscribeMessages();
      contactUnsubscribeMessages = null;
    }
  }
}

// 이벤트 리스너 등록
contactChatSend.addEventListener('click', sendContactMessage);
contactChatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendContactMessage();
  }
});

// 전역 함수로 등록 (chat-auth.js에서 호출할 수 있도록)
window.updateContactChatUI = updateContactChatUI;

// 유틸리티 함수
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 초기 UI 상태 설정
  updateContactChatUI();
  
  // 전역 사용자 상태 변경 감지 (chat-auth.js에서 호출)
  const originalUpdateUI = window.updateUI;
  if (originalUpdateUI) {
    window.updateUI = async function() {
      await originalUpdateUI();
      updateContactChatUI();
    };
  }
});

console.log('Contact 채팅 시스템 초기화 완료'); 