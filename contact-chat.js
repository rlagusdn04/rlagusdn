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
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Contact 채팅 관련 DOM 요소들
const contactChatMessages = document.getElementById('contact-chat-messages');
const contactChatInput = document.getElementById('contact-chat-input');
const contactChatSend = document.getElementById('contact-chat-send');
const devStatus = document.getElementById('dev-status');

let contactUnsubscribeMessages = null;

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
    
    const messageData = {
      text: message,
      timestamp: serverTimestamp(),
      type: 'contact' // Contact 채팅임을 표시
    };
    
    if (window.currentUser) {
      // 로그인된 사용자
      messageData.userId = window.currentUser.uid;
      messageData.userEmail = window.currentUser.email;
      
      // 저장된 사용자 이름 가져오기
      try {
        const userDoc = await getDoc(doc(window.firebaseDB, 'users', window.currentUser.uid));
        if (userDoc.exists()) {
          messageData.userName = userDoc.data().userName;
        } else {
          messageData.userName = window.currentUser.email; // 폴백
        }
      } catch (error) {
        console.error('사용자 이름 가져오기 오류:', error);
        messageData.userName = window.currentUser.email; // 폴백
      }
      
      messageData.isAnonymous = false;
    } else {
      // 익명 사용자
      messageData.userId = window.anonymousUser.uid;
      messageData.userName = window.anonymousUser.name;
      messageData.isAnonymous = true;
    }
    
    console.log('Contact 메시지 전송 시작:', messageData);
    
    // Contact 메시지를 별도 컬렉션에 저장
    const docRef = await addDoc(collection(window.firebaseDB, 'contact-messages'), messageData);
    
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
  
  try {
    // Contact 메시지 쿼리
    const contactMessagesQuery = query(
      collection(window.firebaseDB, 'contact-messages'),
      limit(50)
    );
    
    console.log('Contact Firestore 쿼리 생성 완료');
    
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
function updateContactChatUI() {
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