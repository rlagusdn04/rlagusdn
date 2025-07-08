// Music Player Logic
const musicList = [
  { title: 'Heart', src: 'Music/Heart.mp3' },
  { title: 'ame', src: 'Music/ame.mp3' },
  { title: 'La nuit', src: 'Music/La nuit.mp3' },
  { title: 'Time to Start Another Day', src: 'Music/Time to Start Another Day.mp3' },
  { title: 'Triste', src: 'Music/Triste.mp3' },
  { title: 'watercity', src: 'Music/watercity.mp3' }
];

let currentMusicIdx = 3; // Default to 'Time to Start Another Day'

// 전역 변수 선언
let playPauseBtn = document.getElementById('play-pause-btn');
let volumeSlider = document.getElementById('volume-slider');
let musicTitle = document.getElementById('music-title');
let audioPlayer = document.getElementById('audio-player');
let volumeValue = document.getElementById('volume-value');

document.addEventListener('DOMContentLoaded', function() {
  // 요소 할당
  playPauseBtn = document.getElementById('play-pause-btn');
  volumeSlider = document.getElementById('volume-slider');
  musicTitle = document.getElementById('music-title');
  audioPlayer = document.getElementById('audio-player');
  volumeValue = document.getElementById('volume-value');

  // 이벤트 바인딩 (모두 null 체크)
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
  if (musicTitle) musicTitle.addEventListener('click', () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * musicList.length);
    } while (nextIdx === currentMusicIdx && musicList.length > 1);
    currentMusicIdx = nextIdx;
    updateMusicInfo();
    if (audioPlayer) audioPlayer.play();
  });
  if (audioPlayer && playPauseBtn) {
    audioPlayer.addEventListener('play', () => {
      playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>';
    });
    audioPlayer.addEventListener('pause', () => {
      playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause icon
    });
  }
  updateMusicInfo();
  updateVolume();
});

function updateMusicInfo() {
  if (!musicTitle || !audioPlayer) return;
  musicTitle.textContent = musicList[currentMusicIdx].title;
  audioPlayer.src = musicList[currentMusicIdx].src;
}

function togglePlayPause() {
  if (!audioPlayer || !playPauseBtn) return;
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>'; // Play icon
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause icon
  }
}

function updateVolume() {
  if (!audioPlayer || !volumeSlider || !volumeValue) return;
  audioPlayer.volume = volumeSlider.value;
  volumeValue.textContent = Math.round(volumeSlider.value * 100) + '%';
}

// Smooth scrolling for navigation links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
if (anchorLinks && anchorLinks.length > 0) {
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Language Toggle Logic
const langToggleButton = document.getElementById('lang-toggle-btn');
const aboutContentEn = document.getElementById('about-content-en');
const aboutContentKo = document.getElementById('about-content-ko');

if (langToggleButton && aboutContentEn && aboutContentKo) {
  langToggleButton.addEventListener('click', () => {
    if (aboutContentEn.classList.contains('hidden')) {
      // Currently showing Korean, switch to English
      aboutContentEn.classList.remove('hidden');
      aboutContentKo.classList.add('hidden');
      langToggleButton.textContent = '한/영';
    } else {
      // Currently showing English, switch to Korean
      aboutContentEn.classList.add('hidden');
      aboutContentKo.classList.remove('hidden');
      langToggleButton.textContent = 'Eng/Kor';
    }
  });

  // Initial language setup on page load
  document.addEventListener('DOMContentLoaded', () => {
    aboutContentEn.classList.remove('hidden');
    aboutContentKo.classList.add('hidden');
    langToggleButton.textContent = '한/영';
  });
}

// Mosaic Animation Logic
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  function startMosaicAnimation() {
    const originalText = heroTitle.dataset.originalText;
    heroTitle.innerHTML = originalText.split('').map(char => `<span>${char}</span>`).join('');
    const spans = heroTitle.querySelectorAll('span');

    let intervalId;

    function applyMosaic() {
      const numToMask = Math.floor(Math.random() * 6) + 1; // 1 to 6 characters
      const indicesToMask = new Set();

      while (indicesToMask.size < numToMask) {
        const randomIndex = Math.floor(Math.random() * originalText.length);
        if (originalText[randomIndex] !== ' ') { // Don't mask spaces
          indicesToMask.add(randomIndex);
        }
      }

      spans.forEach((span, index) => {
        if (indicesToMask.has(index)) {
          span.classList.add('mosaic');
        } else {
          span.classList.remove('mosaic');
        }
      });

      setTimeout(() => {
        spans.forEach(span => span.classList.remove('mosaic'));
      }, 1500); // 1.5초 후 원래대로 돌아옴
    }

    intervalId = setInterval(applyMosaic, 3000); // 3초마다 애니메이션 실행
  }
  document.addEventListener('DOMContentLoaded', startMosaicAnimation);
}

// Book List Logic
const toggleBookListBtn = document.getElementById('toggle-book-list');
const bookList = document.getElementById('book-list');
if (toggleBookListBtn && bookList) {
  toggleBookListBtn.addEventListener('click', () => {
    bookList.classList.toggle('hidden');
    if (bookList.classList.contains('hidden')) {
      toggleBookListBtn.textContent = '도서 리스트 보기';
    } else {
      toggleBookListBtn.textContent = '도서 리스트 숨기기';
    }
  });
}

// Daily Menu Roulette Logic
const menuItems = [
  '삼겹살', '치킨', '라면', '초밥', '김치찌개', '떡볶이', '족발', '라멘', '리조또', '제육볶음', '감자탕', '갈비탕', '갈비', '돈까스', '냉면', '햄버거', '피자', '파스타', '우동', '생선구이', '게장', '백반', '국밥', '칼국수', '편의점', '카레', '덮밥', '알밥', '치마덮', '샐러드', '포케'
];
const rouletteDisplay = document.getElementById('roulette-display');
const spinRouletteBtn = document.getElementById('spin-roulette');
if (spinRouletteBtn && rouletteDisplay) {
  spinRouletteBtn.addEventListener('click', () => {
    spinRouletteBtn.disabled = true;
    let spinCount = 0;
    const totalSpins = 30;
    const minDelay = 30; // 가장 빠를 때 딜레이(ms)
    const maxDelay = 300; // 가장 느릴 때 딜레이(ms)
    const slowDownRatio = 0.7; // 느려지는 구간을 더 길게

    function customEase(t) {
      // 느려지는 구간을 더 길게: t가 slowDownRatio 이상일 때 더 급격히 느려짐
      if (t < (1 - slowDownRatio)) {
        // 초반: 빠르게 가속
        return 2 * t * t;
      } else {
        // 후반: 더 천천히 감속
        const slowT = (t - (1 - slowDownRatio)) / slowDownRatio;
        return 1 - Math.pow(1 - slowT, 2);
      }
    }

    function spinRoulette() {
      const randomIndex = Math.floor(Math.random() * menuItems.length);
      rouletteDisplay.textContent = menuItems[randomIndex];
      spinCount++;

      if (spinCount > totalSpins / 2) {
        rouletteDisplay.style.transition = 'all 0.5s cubic-bezier(.4,0,.2,1)';
      } else {
        rouletteDisplay.style.transition = 'none';
      }

      if (spinCount < totalSpins) {
        const t = spinCount / totalSpins;
        const delay = minDelay + (maxDelay - minDelay) * customEase(t);
        setTimeout(spinRoulette, delay);
      } else {
        spinRouletteBtn.disabled = false;
        const finalIndex = Math.floor(Math.random() * menuItems.length);
        rouletteDisplay.textContent = menuItems[finalIndex];
        // 빛나는 효과
        rouletteDisplay.classList.add('roulette-flash');
        setTimeout(() => {
          rouletteDisplay.classList.remove('roulette-flash');
        }, 400);
      }
    }

    spinRoulette();
  });
}

// Project Navigation Logic
const projectGrid = document.querySelector('.project-grid');
const prevBtn = document.getElementById('prev-project');
const nextBtn = document.getElementById('next-project');

function updateNavButtons() {
  if (!projectGrid || !prevBtn || !nextBtn) return;
  if (projectGrid.scrollLeft <= 0) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  if (projectGrid.scrollLeft >= projectGrid.scrollWidth - projectGrid.clientWidth) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

if (prevBtn && projectGrid) {
  prevBtn.addEventListener('click', () => {
    const card = projectGrid.querySelector('.project-card');
    const cardWidth = card ? card.offsetWidth : 450;
    const gap = 32;
    const scrollDistance = cardWidth + gap;
    projectGrid.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth'
    });
  });
}
if (nextBtn && projectGrid) {
  nextBtn.addEventListener('click', () => {
    const card = projectGrid.querySelector('.project-card');
    const cardWidth = card ? card.offsetWidth : 450;
    const gap = 32;
    const scrollDistance = cardWidth + gap;
    projectGrid.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
  });
}
if (projectGrid) {
  projectGrid.addEventListener('scroll', updateNavButtons);
  document.addEventListener('DOMContentLoaded', updateNavButtons);
}

// 프로필 이미지 1분마다 교체 + 클릭 시 수동 변경
const profileImage = document.querySelector('.profile-image');
const profileImages = [
  'assets/profiles/0.jpg',
  'assets/profiles/1.jpg',
  'assets/profiles/2.jpg',
  'assets/profiles/3.jpg',
  'assets/profiles/4.jpg',
  'assets/profiles/5.jpg',
  'assets/profiles/6.jpg',
  'assets/profiles/7.jpg',
  'assets/profiles/8.jpg',
  'assets/profiles/9.jpg',
  'assets/profiles/10.PNG',
  'assets/profiles/11.jpg',
  'assets/profiles/12.PNG',
  'assets/profiles/13.PNG',
  'assets/profiles/14.PNG',
  'assets/profiles/15.PNG',
  'assets/profiles/16.PNG',
  'assets/profiles/17.PNG',
  'assets/profiles/18.jpg',
  'assets/profiles/19.jpg',
  'assets/profiles/20.PNG',
  'assets/profiles/21.jpg',
  'assets/profiles/22.jpg'
];
let currentProfileIdx = 0;

function showNextProfileImage() {
  if (!profileImage) return;
  currentProfileIdx = (currentProfileIdx + 1) % profileImages.length;
  profileImage.src = profileImages[currentProfileIdx];
}

// 자동 변경 (1분마다)
setInterval(showNextProfileImage, 60000);

// 클릭 시 수동 변경
profileImage.addEventListener('click', showNextProfileImage);

// 슬롯머신 이모티콘 배열 복구
const slotEmojis = ['🫨','😡','😮‍💨','🤗','🤔','🤭','🥺'];
function getRandomSlot() {
  return slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
}

// === star-system, auth-system 연동 ===
import { StarSystem } from './star-system.js';
import { AuthSystem } from './auth-system.js';
import { firebaseAuth, firebaseDB } from './firebase-config.js';

const starSystem = new StarSystem({ auth: firebaseAuth, db: firebaseDB });
const authSystem = new AuthSystem({ auth: firebaseAuth, db: firebaseDB });

// === 인증/익명/닉네임 UI 연동 ===
document.addEventListener('DOMContentLoaded', () => {
  // 버튼/모달 요소
  const loginBtn = document.getElementById('login-btn-contents');
  const anonymousBtn = document.getElementById('anonymous-btn-contents');
  const authModal = document.getElementById('auth-modal');
  const anonymousModal = document.getElementById('anonymous-modal');
  const profileModal = document.getElementById('profile-modal');
  const closeModal = document.getElementById('close-modal');
  const closeAnonymousModal = document.getElementById('close-anonymous-modal');
  const closeProfileModal = document.getElementById('close-profile-modal');
  const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
  const signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginSubmit = document.getElementById('login-submit');
  const loginError = document.getElementById('login-error');
  const signupEmail = document.getElementById('signup-email');
  const signupPassword = document.getElementById('signup-password');
  const signupUsername = document.getElementById('signup-username');
  const signupSubmit = document.getElementById('signup-submit');
  const signupError = document.getElementById('signup-error');
  const anonymousName = document.getElementById('anonymous-name');
  const anonymousSubmit = document.getElementById('anonymous-submit');
  const anonymousError = document.getElementById('anonymous-error');
  const profileUsername = document.getElementById('profile-username');
  const profileSubmit = document.getElementById('profile-submit');
  const profileError = document.getElementById('profile-error');

  // 모달 열기/닫기
  if (loginBtn && authModal) loginBtn.onclick = () => { authModal.classList.remove('hidden'); };
  if (anonymousBtn && anonymousModal) anonymousBtn.onclick = () => { anonymousModal.classList.remove('hidden'); };
  if (closeModal && authModal) closeModal.onclick = () => { authModal.classList.add('hidden'); clearErrors(); };
  if (closeAnonymousModal && anonymousModal) closeAnonymousModal.onclick = () => { anonymousModal.classList.add('hidden'); clearErrors(); };
  if (closeProfileModal && profileModal) closeProfileModal.onclick = () => { profileModal.classList.add('hidden'); clearErrors(); };

  // 탭 전환
  if (loginTab && signupTab && loginForm && signupForm) {
    loginTab.onclick = () => {
      loginTab.classList.add('active'); signupTab.classList.remove('active');
      loginForm.classList.remove('hidden'); signupForm.classList.add('hidden'); clearErrors();
    };
    signupTab.onclick = () => {
      signupTab.classList.add('active'); loginTab.classList.remove('active');
      signupForm.classList.remove('hidden'); loginForm.classList.add('hidden'); clearErrors();
    };
  }

  // 로그인
  if (loginSubmit) loginSubmit.onclick = async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) return showError(loginError, '이메일과 비밀번호를 입력하세요.');
    try {
      loginSubmit.disabled = true;
      await authSystem.loginWithEmail(email, password);
      authModal.classList.add('hidden');
      clearForm(loginEmail, loginPassword);
    } catch (e) {
      showError(loginError, e.message);
    } finally {
      loginSubmit.disabled = false;
    }
  };

  // 회원가입
  if (signupSubmit) signupSubmit.onclick = async () => {
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    const username = signupUsername.value.trim();
    if (!email || !password || !username) return showError(signupError, '모든 필드를 입력하세요.');
    if (password.length < 6) return showError(signupError, '비밀번호는 6자 이상이어야 합니다.');
    try {
      signupSubmit.disabled = true;
      await authSystem.signupWithEmail(email, password, username);
      authModal.classList.add('hidden');
      clearForm(signupEmail, signupPassword, signupUsername);
    } catch (e) {
      showError(signupError, e.message);
    } finally {
      signupSubmit.disabled = false;
    }
  };

  // 익명 참여
  if (anonymousSubmit) anonymousSubmit.onclick = async () => {
    const name = anonymousName.value.trim();
    if (!name) return showError(anonymousError, '사용자명을 입력하세요.');
    if (name.length < 2) return showError(anonymousError, '사용자명은 2자 이상이어야 합니다.');
    try {
      anonymousSubmit.disabled = true;
      await authSystem.joinAnonymously(name);
      anonymousModal.classList.add('hidden');
      clearForm(anonymousName);
    } catch (e) {
      showError(anonymousError, e.message);
    } finally {
      anonymousSubmit.disabled = false;
    }
  };

  // 닉네임 변경(프로필)
  if (profileSubmit) profileSubmit.onclick = async () => {
    const username = profileUsername.value.trim();
    if (!username) return showError(profileError, '사용자명을 입력하세요.');
    if (username.length > 20) return showError(profileError, '사용자명은 20자 이하여야 합니다.');
    try {
      profileSubmit.disabled = true;
      await authSystem.updateUserName(username);
      profileModal.classList.add('hidden');
      clearForm(profileUsername);
    } catch (e) {
      showError(profileError, e.message);
    } finally {
      profileSubmit.disabled = false;
    }
  };

  // 인증 상태 변경 시 UI 동기화 및 starSystem/chat/contact-chat에 상태 전달
  authSystem.onAuthStateChanged(user => {
    // 버튼 노출/숨김
    if (loginBtn) loginBtn.style.display = user ? 'none' : '';
    if (anonymousBtn) anonymousBtn.style.display = user ? 'none' : '';
    // 미니게임/기부/랭킹 등 UI 활성/비활성 처리(예시)
    // ... (여기서 starSystem, chat, contact-chat에 user 전달) ...
  });

  // 유틸
  function showError(el, msg) { if (el) { el.textContent = msg; el.classList.remove('hidden'); } }
  function clearErrors() {
    [loginError, signupError, anonymousError, profileError].forEach(e => { if (e) e.classList.add('hidden'); });
  }
  function clearForm(...inputs) { inputs.forEach(i => { if (i) i.value = ''; }); }
});

// === UI 연동 예시 ===
// (슬롯머신, 기부, 랭킹 등 기존 Firestore 접근 코드 제거 후 아래처럼 starSystem 메서드만 호출)
// 예시: document.getElementById('slot-btn').onclick = () => starSystem.playSlot(...)
// 인증 상태는 authSystem.user로 확인, UI 활성/비활성 처리

// 슬롯머신 플레이 함수 리팩토링
async function playSlotMachine() {
  const user = window.firebaseAuth && window.firebaseAuth.currentUser;
  if (!user) {
    alert('로그인한 유저만 별가루 기능을 사용할 수 있습니다.');
    return;
  }
  let stars = await starSystem.getCurrentUserStars();
  if (stars < 100) {
    alert('별가루가 100개 이상 있어야 슬롯머신을 돌릴 수 있습니다.');
    return;
  }
  stars -= 100;
  const slots = [getRandomSlot(), getRandomSlot(), getRandomSlot()];
  const counts = {};
  slots.forEach(e => counts[e] = (counts[e]||0)+1);
  let maxMatch = Math.max(...Object.values(counts));
  // 보상 로직: 1개 일치=0, 2개=100, 3개=200
  let reward = 0;
  if (maxMatch === 2) reward = 100;
  else if (maxMatch === 3) reward = 200;
  stars += reward;
  await starSystem.setCurrentUserStars(stars);
  document.getElementById('slot-result').textContent = `결과: ${slots.join(' ')} | 일치: ${maxMatch}개   보상: ${reward} 별가루`;
  document.getElementById('slot-balance').textContent = `별가루: ${stars}`;
  if (window.updateStarBalanceUI) window.updateStarBalanceUI();
}

// DOMContentLoaded 시 별가루 UI 동기화
async function updateSlotBalanceUI() {
  const el = document.getElementById('slot-balance');
  if (!el) return;
  const stars = await starSystem.getCurrentUserStars();
  el.textContent = `별가루: ${stars}`;
}

document.addEventListener('DOMContentLoaded', () => {
  authSystem.onAuthStateChanged((user) => {
    if (!user) {
      // 로그인 안내 또는 별가루 기능 제한
      return;
    }
    // 별가루 관련 함수/이벤트/UI 초기화는 여기서만!
    // 슬롯머신 UI, 버튼 바인딩, 기부 버튼 바인딩, 별가루 잔고 UI 등
    const slotUi = document.getElementById('slot-ui');
    if (slotUi) {
      slotUi.innerHTML = `
        <button id="slot-btn" class="btn primary-btn" style="margin-bottom:8px;">슬롯 돌리기 (-100)</button>
        <div id="slot-result" style="font-size:2em; margin-bottom:8px;">결과: -</div>
        <div id="slot-balance" style="font-size:1em; font-weight:600;">별가루: -</div>
      `;
      document.getElementById('slot-btn').onclick = () => starSystem.playSlot();
      updateSlotBalanceUI();
    }
    // 기부 버튼 바인딩
    setupDonateUI();
    // 별가루 잔고 UI 동기화
    updateStarBalanceUI();
    // 기부 랭킹 구독
    subscribeDonationRanking();
  });
});

// updateUserStars 함수 Firestore만 사용하도록 수정
window.updateUserStars = async function(newStars) {
  await starSystem.setCurrentUserStars(newStars);
  await updateSlotBalanceUI();
};

// 별가루 잔고 UI 동기화 함수도 Firestore만 사용
async function updateStarBalanceUI() {
  const el = document.getElementById('star-balance');
  if (!el) return;
  const stars = await starSystem.getCurrentUserStars();
  el.textContent = `별가루 잔고: ${stars}`;
}
window.updateStarBalanceUI = updateStarBalanceUI;

// 기부 버튼 동작도 Firestore만 사용
function setupDonateUI() {
  const donateBtn = document.getElementById('donate-btn');
  if (donateBtn) {
    donateBtn.onclick = async function() {
      const user = window.firebaseAuth && window.firebaseAuth.currentUser;
      if (!user) {
        alert('로그인 후 기부할 수 있습니다.');
        return;
      }
      const { uid, displayName, email } = user;
      const { getDoc, setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      const userDoc = await getDoc(doc(window.firebaseDB, 'users', uid));
      const userData = userDoc.data();
      const stars = (userData && typeof userData.stars === 'number') ? userData.stars : 0;
      if (stars <= 0) {
        alert('기부할 별가루가 없습니다.');
        return;
      }
      const name = userData.userName || displayName || (email ? email.split('@')[0] : '익명');
      await setDoc(doc(window.firebaseDB, 'donation-ranking', uid), {
        userName: name,
        stars: stars,
        updatedAt: new Date()
      }, { merge: true });
      await starSystem.setCurrentUserStars(0);
      alert(`별가루 ${stars}개를 전액 기부했습니다!`);
      await updateStarBalanceUI();
    };
  }
}

// 별가루 변동 시 잔고 UI 자동 갱신
const prevUpdateUserStars = window.updateUserStars;
window.updateUserStars = async function(newStars) {
  if (prevUpdateUserStars) await prevUpdateUserStars(newStars);
  await updateStarBalanceUI();
};

// 기부 랭킹 실시간 구독 함수 추가
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function subscribeDonationRanking() {
  if (!window.firebaseDB) return;
  const q = query(collection(window.firebaseDB, 'donation-ranking'), orderBy('stars', 'desc'));
  onSnapshot(q, (snapshot) => {
    const ranking = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (typeof data.stars === 'number') ranking.push(data);
    });
    const rankingBox = document.getElementById('donation-ranking-list');
    if (!rankingBox) return;
    rankingBox.innerHTML = '';
    ranking.forEach((u, i) => {
      const li = document.createElement('li');
      li.textContent = `${i+1}위: ${u.userName || u.name || '익명'} - 기부: ${u.stars}`;
      rankingBox.appendChild(li);
    });
  });
}


