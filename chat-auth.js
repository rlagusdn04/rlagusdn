// Firebase 인증 및 채팅 기능
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  getDocs,
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM 요소들
const authModal = document.getElementById('auth-modal');
const anonymousModal = document.getElementById('anonymous-modal');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const anonymousBtn = document.getElementById('anonymous-btn');
const changeNameBtn = document.getElementById('change-name-btn');
const closeModalBtn = document.getElementById('close-modal');
const closeAnonymousModalBtn = document.getElementById('close-anonymous-modal');
const userStatus = document.getElementById('user-status');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

// 모달 탭 요소들
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// 폼 요소들
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginSubmit = document.getElementById('login-submit');
const loginError = document.getElementById('login-error');

const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupUsername = document.getElementById('signup-username');
const signupSubmit = document.getElementById('signup-submit');
const signupError = document.getElementById('signup-error');

// 익명 사용자 관련 요소들
const anonymousName = document.getElementById('anonymous-name');
const anonymousSubmit = document.getElementById('anonymous-submit');
const anonymousError = document.getElementById('anonymous-error');

// 프로필 설정 관련 요소들
const profileBtn = document.getElementById('profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileModalBtn = document.getElementById('close-profile-modal');
const profileUsername = document.getElementById('profile-username');
const profileSubmit = document.getElementById('profile-submit');
const profileError = document.getElementById('profile-error');

let currentUser = null;
let anonymousUser = null;
let unsubscribeMessages = null;

// 전역 변수로 설정 (Contact 채팅에서 접근 가능하도록)
window.currentUser = currentUser;
window.anonymousUser = anonymousUser;

// 익명 사용자 정보를 로컬 스토리지에서 불러오기
function loadAnonymousUser() {
  // localStorage 제거: 항상 false 반환
  return false;
}

// 익명 사용자 정보를 로컬 스토리지에 저장
function saveAnonymousUser() {
  // localStorage 제거: 아무 동작 안 함
}

// 랜덤 UID 생성
function generateRandomUID() {
  return 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// 인증 상태 모니터링
function initializeAuthStateListener() {
  if (window.firebaseAuth) {
    onAuthStateChanged(window.firebaseAuth, (user) => {
      console.log('인증 상태 변경:', user ? '로그인됨' : '로그아웃됨');
      currentUser = user;
      window.currentUser = currentUser; // 전역 변수 업데이트
      
      if (user) {
        // 로그인된 경우 익명 정보 초기화
        anonymousUser = null;
        window.anonymousUser = anonymousUser;
        // [신규 회원] 기본 별가루 500개 지급
        (async () => {
          const { getDoc, setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
          const userRef = doc(window.firebaseDB, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            // 신규 회원: 기본 별가루 500개 지급
            await setDoc(userRef, { stars: 500, lastAttendance: new Date() }, { merge: true });
            if (window.updateStarBalanceUI) window.updateStarBalanceUI();
            alert('회원가입 축하! 별가루 500개가 지급되었습니다.');
          } else {
            // [출석 체크] 마지막 출석일과 오늘 날짜 비교 (유저별로 Firestore에 저장)
            const data = userSnap.data();
            let lastAttendance = null;
            if (data.lastAttendance) {
              if (typeof data.lastAttendance === 'object' && data.lastAttendance.seconds) {
                lastAttendance = new Date(data.lastAttendance.seconds * 1000);
              } else {
                lastAttendance = new Date(data.lastAttendance);
              }
            }
            const today = new Date();
            if (!lastAttendance || lastAttendance.toDateString() !== today.toDateString()) {
              // 오늘 첫 로그인(출석): 별가루 100개 지급 (유저별 1일 1회)
              const newStars = (typeof data.stars === 'number' ? data.stars : 0) + 100;
              await setDoc(userRef, { stars: newStars, lastAttendance: today }, { merge: true });
              if (window.updateStarBalanceUI) window.updateStarBalanceUI();
              alert('출석체크! 별가루 100개가 지급되었습니다.');
            }
          }
        })();
      } else {
        // 로그아웃된 경우 익명 정보 복원 시도(이제 없음)
        loadAnonymousUser();
        window.anonymousUser = anonymousUser;
      }
      
      updateUI().then(() => {
        // 별가루 잔고 UI도 동기화
        if (window.updateStarBalanceUI) window.updateStarBalanceUI();
        if (user || anonymousUser) {
          // 로그인된 경우 또는 익명 사용자일 때 채팅 메시지 구독
          console.log('채팅 메시지 구독 시작');
          subscribeToMessages();
        } else {
          // 둘 다 아닌 경우 구독 해제
          console.log('채팅 메시지 구독 해제');
          if (unsubscribeMessages) {
            unsubscribeMessages();
            unsubscribeMessages = null;
          }
        }
      });
    });
  } else {
    console.error('Firebase Auth가 초기화되지 않았습니다.');
    // 1초 후 다시 시도
    setTimeout(initializeAuthStateListener, 1000);
  }
}

// Firebase 로드 완료 후 인증 상태 리스너 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuthStateListener);
} else {
  initializeAuthStateListener();
}

// UI 업데이트
async function updateUI() {
  if (currentUser) {
    // 로그인된 사용자
    try {
      const userDoc = await getDoc(doc(window.firebaseDB, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userName = userDoc.data().userName;
        userStatus.textContent = `${userName}님 환영합니다!`;
      } else {
        userStatus.textContent = `${currentUser.email}님 환영합니다!`;
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      userStatus.textContent = `${currentUser.email}님 환영합니다!`;
    }
    
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    anonymousBtn.classList.add('hidden');
    changeNameBtn.classList.add('hidden');
    profileBtn.classList.remove('hidden');
    chatInput.disabled = false;
    sendBtn.disabled = false;
  } else if (anonymousUser) {
    // 익명 사용자
    userStatus.textContent = `${anonymousUser.name} (익명)`;
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    anonymousBtn.classList.add('hidden');
    changeNameBtn.classList.remove('hidden');
    profileBtn.classList.add('hidden');
    chatInput.disabled = false;
    sendBtn.disabled = false;
  } else {
    // 로그인하지 않은 사용자
    userStatus.textContent = '익명으로 채팅하기';
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    anonymousBtn.classList.remove('hidden');
    changeNameBtn.classList.add('hidden');
    profileBtn.classList.add('hidden');
    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    // 환영 메시지 표시
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <p>안녕하세요! 익명으로 실시간 채팅에 참여해보세요.</p>
        <p>로그인하거나 익명으로 참여할 수 있습니다.</p>
      </div>
    `;
  }
  
  // Contact 채팅 UI 업데이트
  if (window.updateContactChatUI) {
    window.updateContactChatUI();
  }
}

// 모달 관련 이벤트
loginBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

anonymousBtn.addEventListener('click', () => {
  anonymousModal.classList.remove('hidden');
});

changeNameBtn.addEventListener('click', () => {
  if (anonymousUser) {
    anonymousName.value = anonymousUser.name;
  }
  anonymousModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  authModal.classList.add('hidden');
  clearErrors();
});

closeAnonymousModalBtn.addEventListener('click', () => {
  anonymousModal.classList.add('hidden');
  clearErrors();
});

// 프로필 설정 관련 이벤트
profileBtn.addEventListener('click', async () => {
  if (currentUser) {
    try {
      const userDoc = await getDoc(doc(window.firebaseDB, 'users', currentUser.uid));
      if (userDoc.exists()) {
        profileUsername.value = userDoc.data().userName || '';
      } else {
        profileUsername.value = '';
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      profileUsername.value = '';
    }
  }
  profileModal.classList.remove('hidden');
});

closeProfileModalBtn.addEventListener('click', () => {
  profileModal.classList.add('hidden');
  clearErrors();
});

// 모달 외부 클릭 시 닫기
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
    clearErrors();
  }
});

anonymousModal.addEventListener('click', (e) => {
  if (e.target === anonymousModal) {
    anonymousModal.classList.add('hidden');
    clearErrors();
  }
});

profileModal.addEventListener('click', (e) => {
  if (e.target === profileModal) {
    profileModal.classList.add('hidden');
    clearErrors();
  }
});

anonymousModal.addEventListener('click', (e) => {
  if (e.target === anonymousModal) {
    anonymousModal.classList.add('hidden');
    clearErrors();
  }
});

// 익명 사용자 이름 설정
anonymousSubmit.addEventListener('click', () => {
  const name = anonymousName.value.trim();
  
  if (!name) {
    showError(anonymousError, '사용자명을 입력해주세요.');
    return;
  }
  
  if (name.length < 2) {
    showError(anonymousError, '사용자명은 2자 이상이어야 합니다.');
    return;
  }
  
  // DEV 모드 분기
  if (name === 'USER_13') {
    anonymousUser = {
      uid: 'ANON_DEV',
      name: 'DEV',
      isAnonymous: true,
      isDev: true
    };
  } else {
    // 익명 사용자 정보 생성
    anonymousUser = {
      uid: generateRandomUID(),
      name: name,
      isAnonymous: true,
      isDev: false
    };
  }
  
  window.anonymousUser = anonymousUser; // 전역 변수 업데이트
  anonymousModal.classList.add('hidden');
  clearForm(anonymousName);
  updateUI();
});

// 프로필 설정 저장
profileSubmit.addEventListener('click', async () => {
  const username = profileUsername.value.trim();
  
  if (!username) {
    showError(profileError, '사용자명을 입력해주세요.');
    return;
  }
  
  if (username.length > 20) {
    showError(profileError, '사용자명은 20자 이하여야 합니다.');
    return;
  }
  
  if (!currentUser) {
    showError(profileError, '로그인이 필요합니다.');
    return;
  }
  
  try {
    profileSubmit.disabled = true;
    profileSubmit.textContent = '저장 중...';
    
    // 사용자 정보 업데이트
    await setDoc(doc(window.firebaseDB, 'users', currentUser.uid), {
      userName: username,
      email: currentUser.email,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    profileModal.classList.add('hidden');
    clearForm(profileUsername);
    updateUI();
    
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    showError(profileError, '프로필 업데이트에 실패했습니다: ' + error.message);
  } finally {
    profileSubmit.disabled = false;
    profileSubmit.textContent = '저장';
  }
});

// 탭 전환
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // 탭 활성화
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // 폼 전환
    if (targetTab === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
    }
    
    clearErrors();
  });
});

// 로그인 폼 제출
loginSubmit.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  if (!email || !password) {
    showError(loginError, '이메일과 비밀번호를 입력해주세요.');
    return;
  }
  
  try {
    loginSubmit.disabled = true;
    loginSubmit.textContent = '로그인 중...';
    
    await signInWithEmailAndPassword(window.firebaseAuth, email, password);
    
    authModal.classList.add('hidden');
    clearForm(loginEmail, loginPassword);
  } catch (error) {
    console.error('로그인 오류:', error);
    showError(loginError, getErrorMessage(error.code));
  } finally {
    loginSubmit.disabled = false;
    loginSubmit.textContent = '로그인';
  }
});

// 회원가입 폼 제출
signupSubmit.addEventListener('click', async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const username = signupUsername.value.trim();
  
  if (!email || !password || !username) {
    showError(signupError, '모든 필드를 입력해주세요.');
    return;
  }
  
  if (password.length < 6) {
    showError(signupError, '비밀번호는 6자 이상이어야 합니다.');
    return;
  }
  
  try {
    signupSubmit.disabled = true;
    signupSubmit.textContent = '회원가입 중...';
    
    const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
    
    // 사용자 이름을 Firestore에 저장
    await setDoc(doc(window.firebaseDB, 'users', userCredential.user.uid), {
      userName: username,
      email: email,
      createdAt: serverTimestamp(),
      stars: 0
    });
    
    authModal.classList.add('hidden');
    clearForm(signupEmail, signupPassword, signupUsername);
  } catch (error) {
    console.error('회원가입 오류:', error);
    showError(signupError, getErrorMessage(error.code));
  } finally {
    signupSubmit.disabled = false;
    signupSubmit.textContent = '회원가입';
  }
});

// 로그아웃
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(window.firebaseAuth);
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
});

// 채팅 메시지 전송
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 테스트 메시지 전송 (디버깅용)
window.sendTestMessage = async () => {
  console.log('테스트 메시지 전송 시작');
  
  if (!window.firebaseDB) {
    console.error('Firebase DB가 없습니다!');
    return;
  }
  
  try {
    const testMessage = {
      text: '테스트 메시지 - ' + new Date().toLocaleTimeString(),
      userId: 'test_user',
      userName: '테스트 사용자',
      isAnonymous: true,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(window.firebaseDB, 'messages'), testMessage);
    console.log('테스트 메시지 전송 완료:', docRef.id);
  } catch (error) {
    console.error('테스트 메시지 전송 실패:', error);
    console.error('에러 코드:', error.code);
    console.error('에러 메시지:', error.message);
  }
};

// Firebase 연결 테스트 (디버깅용)
window.testFirebaseConnection = async () => {
  console.log('Firebase 연결 테스트 시작');
  
  if (!window.firebaseDB) {
    console.error('Firebase DB가 없습니다!');
    return false;
  }
  
  try {
    // 간단한 읽기 테스트
    const testQuery = query(collection(window.firebaseDB, 'messages'), limit(1));
    const snapshot = await getDocs(testQuery);
    console.log('Firebase 읽기 테스트 성공:', snapshot.docs.length, '개 문서');
    return true;
  } catch (error) {
    console.error('Firebase 연결 테스트 실패:', error);
    console.error('에러 코드:', error.code);
    console.error('에러 메시지:', error.message);
    return false;
  }
};

async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message || (!currentUser && !anonymousUser)) {
    console.log('메시지 전송 조건 불충족:', { message, currentUser: !!currentUser, anonymousUser: !!anonymousUser });
    return;
  }
  
  // Firebase 연결 확인
  if (!window.firebaseDB) {
    console.error('Firebase DB가 초기화되지 않았습니다!');
    alert('Firebase 연결에 문제가 있습니다. 페이지를 새로고침해주세요.');
    return;
  }
  
  // 중복 전송 방지
  if (sendBtn.disabled) {
    console.log('이미 전송 중입니다.');
    return;
  }
  
  try {
    sendBtn.disabled = true;
    chatInput.disabled = true;
    
    const messageData = {
      text: message,
      timestamp: serverTimestamp()
    };
    
    if (currentUser) {
      // 로그인된 사용자
      messageData.userId = currentUser.uid;
      messageData.userEmail = currentUser.email;
      
      // 저장된 사용자 이름 가져오기
      try {
        const userDoc = await getDoc(doc(window.firebaseDB, 'users', currentUser.uid));
        if (userDoc.exists()) {
          messageData.userName = userDoc.data().userName;
        } else {
          messageData.userName = currentUser.email; // 폴백
        }
      } catch (error) {
        console.error('사용자 이름 가져오기 오류:', error);
        messageData.userName = currentUser.email; // 폴백
      }
      
      messageData.isAnonymous = false;
    } else {
      // 익명 사용자
      messageData.userId = anonymousUser.uid;
      messageData.userName = anonymousUser.name;
      messageData.isAnonymous = true;
    }
    
    console.log('메시지 전송 시작:', messageData);
    
    // 메시지 전송
    const docRef = await addDoc(collection(window.firebaseDB, 'messages'), messageData);
    
    console.log('메시지 전송 완료, 문서 ID:', docRef.id);
    
    // 입력창 비우기
    chatInput.value = '';
    
  } catch (error) {
    console.error('메시지 전송 오류:', error);
    alert('메시지 전송에 실패했습니다: ' + error.message);
  } finally {
    sendBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus(); // 포커스 복원
  }
}

// 실시간 메시지 구독
function subscribeToMessages() {
  console.log('메시지 구독 시작...');
  
  // Firebase 연결 확인
  if (!window.firebaseDB) {
    console.error('Firebase DB가 초기화되지 않았습니다!');
    alert('Firebase 연결에 문제가 있습니다. 페이지를 새로고침해주세요.');
    return;
  }
  
  // 기존 구독이 있다면 해제
  if (unsubscribeMessages) {
    console.log('기존 구독 해제');
    unsubscribeMessages();
    unsubscribeMessages = null;
  }
  
  try {
    // 간단한 쿼리로 시작 (정렬 없이)
    const messagesQuery = query(
      collection(window.firebaseDB, 'messages'),
      limit(50)
    );
    
    console.log('Firestore 쿼리 생성 완료');
    
    unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      console.log('새 메시지 수신:', snapshot.docs.length, '개');
      
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
      displayMessages(messages);
    }, (error) => {
      console.error('메시지 구독 오류:', error);
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);
      
      // 에러 발생 시 구독 해제
      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }
      
      // 구체적인 에러 메시지 표시
      let errorMessage = '채팅 연결에 문제가 발생했습니다.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Firestore 보안 규칙에 문제가 있습니다. 관리자에게 문의하세요.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firebase 서비스에 연결할 수 없습니다. 네트워크를 확인해주세요.';
      }
      
      alert(errorMessage + '\n페이지를 새로고침해주세요.');
    });
    
    console.log('메시지 구독 설정 완료');
  } catch (error) {
    console.error('메시지 구독 설정 오류:', error);
    alert('채팅 연결 설정에 실패했습니다: ' + error.message);
  }
}

// 메시지 표시
function displayMessages(messages) {
  console.log('메시지 표시:', messages.length, '개');
  
  chatMessages.innerHTML = '';
  
  if (messages.length === 0) {
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <p>아직 메시지가 없습니다. 첫 번째 메시지를 보내보세요!</p>
      </div>
    `;
    return;
  }
  
  messages.forEach(message => {
    const messageElement = document.createElement('div');
    const currentUserId = currentUser?.uid || anonymousUser?.uid;
    messageElement.className = `message ${message.userId === currentUserId ? 'own' : 'other'}`;
    
    // 타임스탬프 처리 개선
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
    
    chatMessages.appendChild(messageElement);
  });
  
  // 스크롤을 맨 아래로
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

// 유틸리티 함수들
function showError(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
}

function clearErrors() {
  loginError.classList.add('hidden');
  signupError.classList.add('hidden');
  anonymousError.classList.add('hidden');
  profileError.classList.add('hidden');
}

function clearForm(...inputs) {
  inputs.forEach(input => input.value = '');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '잘못된 비밀번호입니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호가 너무 약합니다.',
    'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
    'auth/too-many-requests': '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
  };
  
  return errorMessages[errorCode] || '오류가 발생했습니다. 다시 시도해주세요.';
} 