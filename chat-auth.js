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
  serverTimestamp 
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

let currentUser = null;
let anonymousUser = null;
let unsubscribeMessages = null;

// 익명 사용자 정보를 로컬 스토리지에서 불러오기
function loadAnonymousUser() {
  const saved = localStorage.getItem('anonymousUser');
  if (saved) {
    anonymousUser = JSON.parse(saved);
    return true;
  }
  return false;
}

// 익명 사용자 정보를 로컬 스토리지에 저장
function saveAnonymousUser() {
  if (anonymousUser) {
    localStorage.setItem('anonymousUser', JSON.stringify(anonymousUser));
  }
}

// 랜덤 UID 생성
function generateRandomUID() {
  return 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// 인증 상태 모니터링
onAuthStateChanged(window.firebaseAuth, (user) => {
  currentUser = user;
  
  if (user) {
    // 로그인된 경우 익명 사용자 정보 초기화
    anonymousUser = null;
    localStorage.removeItem('anonymousUser');
  } else {
    // 로그아웃된 경우 익명 사용자 정보 복원
    loadAnonymousUser();
  }
  
  updateUI();
  
  if (user || anonymousUser) {
    // 로그인된 경우 또는 익명 사용자인 경우 채팅 메시지 구독
    subscribeToMessages();
  } else {
    // 둘 다 아닌 경우 구독 해제
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
  }
});

// UI 업데이트
function updateUI() {
  if (currentUser) {
    // 로그인된 사용자
    userStatus.textContent = `${currentUser.email}님 환영합니다!`;
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    anonymousBtn.classList.add('hidden');
    changeNameBtn.classList.add('hidden');
    chatInput.disabled = false;
    sendBtn.disabled = false;
  } else if (anonymousUser) {
    // 익명 사용자
    userStatus.textContent = `${anonymousUser.name} (익명)`;
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    anonymousBtn.classList.add('hidden');
    changeNameBtn.classList.remove('hidden');
    chatInput.disabled = false;
    sendBtn.disabled = false;
  } else {
    // 로그인하지 않은 사용자
    userStatus.textContent = '익명으로 채팅하기';
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    anonymousBtn.classList.remove('hidden');
    changeNameBtn.classList.add('hidden');
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
  
  // 익명 사용자 정보 생성
  anonymousUser = {
    uid: generateRandomUID(),
    name: name,
    isAnonymous: true
  };
  
  saveAnonymousUser();
  anonymousModal.classList.add('hidden');
  clearForm(anonymousName);
  updateUI();
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

async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message || (!currentUser && !anonymousUser)) return;
  
  try {
    sendBtn.disabled = true;
    
    const messageData = {
      text: message,
      timestamp: serverTimestamp()
    };
    
    if (currentUser) {
      // 로그인된 사용자
      messageData.userId = currentUser.uid;
      messageData.userEmail = currentUser.email;
      messageData.userName = currentUser.email;
      messageData.isAnonymous = false;
    } else {
      // 익명 사용자
      messageData.userId = anonymousUser.uid;
      messageData.userName = anonymousUser.name;
      messageData.isAnonymous = true;
    }
    
    await addDoc(collection(window.firebaseDB, 'messages'), messageData);
    
    chatInput.value = '';
  } catch (error) {
    console.error('메시지 전송 오류:', error);
    alert('메시지 전송에 실패했습니다.');
  } finally {
    sendBtn.disabled = false;
  }
}

// 실시간 메시지 구독
function subscribeToMessages() {
  const messagesQuery = query(
    collection(window.firebaseDB, 'messages'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    // 시간순으로 정렬 (최신 메시지가 아래에)
    messages.reverse();
    displayMessages(messages);
  }, (error) => {
    console.error('메시지 구독 오류:', error);
  });
}

// 메시지 표시
function displayMessages(messages) {
  chatMessages.innerHTML = '';
  
  messages.forEach(message => {
    const messageElement = document.createElement('div');
    const currentUserId = currentUser?.uid || anonymousUser?.uid;
    messageElement.className = `message ${message.userId === currentUserId ? 'own' : 'other'}`;
    
    const timestamp = message.timestamp ? 
      new Date(message.timestamp.toDate()).toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '';
    
    const displayName = message.isAnonymous ? 
      `${message.userName} (익명)` : 
      message.userName;
    
    messageElement.innerHTML = `
      <div class="message-header">${displayName}</div>
      <div class="message-content">${escapeHtml(message.text)}</div>
      <div class="message-time">${timestamp}</div>
    `;
    
    chatMessages.appendChild(messageElement);
  });
  
  // 스크롤을 맨 아래로
  chatMessages.scrollTop = chatMessages.scrollHeight;
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