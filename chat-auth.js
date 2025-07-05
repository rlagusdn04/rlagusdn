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
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const closeModalBtn = document.getElementById('close-modal');
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

let currentUser = null;
let unsubscribeMessages = null;

// 인증 상태 모니터링
onAuthStateChanged(window.firebaseAuth, (user) => {
  currentUser = user;
  updateUI();
  
  if (user) {
    // 로그인된 경우 채팅 메시지 구독
    subscribeToMessages();
  } else {
    // 로그아웃된 경우 구독 해제
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
  }
});

// UI 업데이트
function updateUI() {
  if (currentUser) {
    userStatus.textContent = `${currentUser.email}님 환영합니다!`;
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    chatInput.disabled = false;
    sendBtn.disabled = false;
    
    // 환영 메시지 제거
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }
  } else {
    userStatus.textContent = '로그인이 필요합니다';
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    // 채팅 메시지 초기화
    chatMessages.innerHTML = '<div class="welcome-message"><p>안녕하세요! 실시간 채팅에 참여하려면 로그인해주세요.</p></div>';
  }
}

// 모달 관련 이벤트
loginBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  authModal.classList.add('hidden');
  clearErrors();
});

// 모달 외부 클릭 시 닫기
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
    clearErrors();
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
    
    // 사용자 정보를 Firestore에 저장 (선택사항)
    // await addDoc(collection(window.firebaseDB, 'users'), {
    //   uid: userCredential.user.uid,
    //   email: email,
    //   username: username,
    //   createdAt: serverTimestamp()
    // });
    
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
  
  if (!message || !currentUser) return;
  
  try {
    sendBtn.disabled = true;
    
    await addDoc(collection(window.firebaseDB, 'messages'), {
      text: message,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      timestamp: serverTimestamp()
    });
    
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
    messageElement.className = `message ${message.userId === currentUser?.uid ? 'own' : 'other'}`;
    
    const timestamp = message.timestamp ? 
      new Date(message.timestamp.toDate()).toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '';
    
    messageElement.innerHTML = `
      <div class="message-header">${message.userEmail}</div>
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