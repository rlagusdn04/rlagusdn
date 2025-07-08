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
const audioPlayer = document.getElementById('audio-player');
const musicTitle = document.getElementById('music-title');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');

function updateMusicInfo() {
  musicTitle.textContent = musicList[currentMusicIdx].title;
  audioPlayer.src = musicList[currentMusicIdx].src;
}

function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>'; // Play icon
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause icon
  }
}

function updateVolume() {
  audioPlayer.volume = volumeSlider.value;
  volumeValue.textContent = Math.round(volumeSlider.value * 100) + '%';
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
volumeSlider.addEventListener('input', updateVolume);

// Initial setup
updateMusicInfo();
updateVolume();

// Auto-play on user interaction (if allowed by browser)
document.addEventListener('DOMContentLoaded', () => {
  // 사용자 상호작용 후 자동 재생 시도
  const tryAutoplay = () => {
    audioPlayer.play().catch(error => {
      console.log('Autoplay prevented:', error);
    });
  };
  
  // 페이지 로드 시 한 번 시도
  tryAutoplay();
  
  // 사용자 상호작용 시 재생 시도
  document.addEventListener('click', tryAutoplay, { once: true });
  document.addEventListener('keydown', tryAutoplay, { once: true });
});

// Shuffle music on title click
musicTitle.addEventListener('click', () => {
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * musicList.length);
  } while (nextIdx === currentMusicIdx && musicList.length > 1);
  currentMusicIdx = nextIdx;
  updateMusicInfo();
  audioPlayer.play();
});

// Update play/pause button icon when audio state changes
audioPlayer.addEventListener('play', () => {
  playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause icon
});

audioPlayer.addEventListener('pause', () => {
  playPauseBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>'; // Play icon
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Language Toggle Logic
const langToggleButton = document.getElementById('lang-toggle-btn');
const aboutContentEn = document.getElementById('about-content-en');
const aboutContentKo = document.getElementById('about-content-ko');

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
  // Ensure English content is visible and Korean is hidden by default
  aboutContentEn.classList.remove('hidden');
  aboutContentKo.classList.add('hidden');
  langToggleButton.textContent = '한/영'; // Set initial button text
});

// Mosaic Animation Logic
function startMosaicAnimation() {
  const heroTitle = document.querySelector('.hero-title');

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

// Call the animation function when the DOM is loaded
document.addEventListener('DOMContentLoaded', startMosaicAnimation);

// Book List Logic
const toggleBookListBtn = document.getElementById('toggle-book-list');
const bookList = document.getElementById('book-list');

toggleBookListBtn.addEventListener('click', () => {
  bookList.classList.toggle('hidden');
  if (bookList.classList.contains('hidden')) {
    toggleBookListBtn.textContent = '도서 리스트 보기';
  } else {
    toggleBookListBtn.textContent = '도서 리스트 숨기기';
  }
});

// Daily Menu Roulette Logic
const menuItems = [
  '삼겹살', '치킨', '라면', '초밥', '김치찌개', '떡볶이', '족발', '라멘', '리조또', '제육볶음', '감자탕', '갈비탕', '갈비', '돈까스', '냉면', '햄버거', '피자', '파스타', '우동', '생선구이', '게장', '백반', '국밥', '칼국수', '편의점', '카레', '덮밥', '알밥', '치마덮', '샐러드', '포케'
];
const rouletteDisplay = document.getElementById('roulette-display');
const spinRouletteBtn = document.getElementById('spin-roulette');

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

// Project Navigation Logic
const projectGrid = document.querySelector('.project-grid');
const prevBtn = document.getElementById('prev-project');
const nextBtn = document.getElementById('next-project');

function updateNavButtons() {
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

prevBtn.addEventListener('click', () => {
  const card = projectGrid.querySelector('.project-card');
  const cardWidth = card ? card.offsetWidth : 450;
  const gap = 32; // gap: 2rem = 32px
  const scrollDistance = cardWidth + gap;
  projectGrid.scrollBy({
    left: -scrollDistance,
    behavior: 'smooth'
  });
});

nextBtn.addEventListener('click', () => {
  const card = projectGrid.querySelector('.project-card');
  const cardWidth = card ? card.offsetWidth : 450;
  const gap = 32; // gap: 2rem = 32px
  const scrollDistance = cardWidth + gap;
  projectGrid.scrollBy({
    left: scrollDistance,
    behavior: 'smooth'
  });
});

projectGrid.addEventListener('scroll', updateNavButtons);

// Initial button state
document.addEventListener('DOMContentLoaded', updateNavButtons);

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

// === 별가루(스타) 시스템 연동 ===
import { StarSystem } from './star-system.js';
import { firebaseAuth, firebaseDB } from './firebase-config.js';

// 별가루 잔고 표시용 UI가 없으면 생성
function ensureStarBalanceUI() {
  let el = document.getElementById('star-balance');
  if (!el) {
    el = document.createElement('div');
    el.id = 'star-balance';
    el.style.position = 'fixed';
    el.style.top = '16px';
    el.style.right = '16px';
    el.style.background = 'rgba(0,0,0,0.7)';
    el.style.color = '#ffd700';
    el.style.padding = '8px 16px';
    el.style.borderRadius = '16px';
    el.style.zIndex = '1000';
    el.style.fontWeight = 'bold';
    el.textContent = '별가루: 0';
    document.body.appendChild(el);
  }
  return el;
}

const starBalanceEl = ensureStarBalanceUI();

// StarSystem 인스턴스 생성 및 초기화
const starSystem = new StarSystem({ auth: firebaseAuth, db: firebaseDB });

// 출석 보상 지급 시 알림 및 잔고 UI 업데이트
starSystem.onAttendanceRewarded = (reward, totalStars) => {
  alert(`출석 보상! 별가루 +${reward} 지급\n현재 별가루: ${totalStars}`);
  starBalanceEl.textContent = `별가루: ${totalStars}`;
};

// 별가루 잔고가 바뀔 때마다 UI 업데이트 (추후 슬롯, 낚시 등과 연동)
starSystem.onStarsChanged = (stars) => {
  starBalanceEl.textContent = `별가루: ${stars}`;
};

// === 인증 상태에 따라 미니게임/기부 UI 활성/비활성 ===
function updateGameUIAuthState() {
  const slotBtn = document.getElementById('slot-spin-btn');
  const slotResult = document.getElementById('slot-result');
  const fishingBtn = document.getElementById('fishing-btn');
  const sellFishBtn = document.getElementById('sell-fish-btn');
  const fishingResult = document.getElementById('fishing-result');
  const donateBtn = document.getElementById('donate-btn');
  const donateAmount = document.getElementById('donate-amount');
  const donateResult = document.getElementById('donate-result');

  const isAuthed = !!starSystem.user;

  // 슬롯머신
  if (slotBtn) {
    slotBtn.disabled = !isAuthed;
    if (!isAuthed && slotResult) slotResult.textContent = '로그인 또는 익명 참여 후 이용 가능합니다.';
    else if (slotResult && slotResult.textContent === '로그인 또는 익명 참여 후 이용 가능합니다.') slotResult.textContent = '';
  }
  // 낚시
  if (fishingBtn) {
    fishingBtn.disabled = !isAuthed;
    if (!isAuthed && fishingResult) fishingResult.textContent = '로그인 또는 익명 참여 후 이용 가능합니다.';
    else if (fishingResult && fishingResult.textContent === '로그인 또는 익명 참여 후 이용 가능합니다.') fishingResult.textContent = '';
  }
  if (sellFishBtn) sellFishBtn.disabled = !isAuthed;
  // 기부
  if (donateBtn) donateBtn.disabled = !isAuthed;
  if (donateAmount) donateAmount.disabled = !isAuthed;
  if (!isAuthed && donateResult) donateResult.textContent = '로그인 또는 익명 참여 후 이용 가능합니다.';
  else if (donateResult && donateResult.textContent === '로그인 또는 익명 참여 후 이용 가능합니다.') donateResult.textContent = '';
}

// 인증 상태 변경 시마다 UI 동기화
starSystem._origInitAuthListener = starSystem.initAuthListener;
starSystem.initAuthListener = function() {
  this._origInitAuthListener();
  // 인증 상태 변경 감지 시 UI 동기화
  import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(this.auth, () => {
      updateGameUIAuthState();
    });
  });
};
// 페이지 로드시 1회 동기화
updateGameUIAuthState();

// === 슬롯머신, 낚시, 기부 카드 UI 연동 ===
document.addEventListener('DOMContentLoaded', () => {
  // 슬롯머신
  const slotBtn = document.getElementById('slot-spin-btn');
  const slotResult = document.getElementById('slot-result');
  if (slotBtn && slotResult) {
    slotBtn.onclick = async () => {
      slotBtn.disabled = true;
      slotResult.textContent = '돌리는 중...';
      try {
        const { result, matchCount, reward, stars } = await starSystem.playSlot({ betAmount: 100 });
        const emoji = ['🍒','🍋','🍊','🍇','⭐️'];
        slotResult.innerHTML =
          `<span style='font-size:1.5em;'>${result.map(n=>emoji[n]).join(' ')}</span><br>` +
          (matchCount === 3 ? '🎉 3개 일치! +200 별가루' :
           matchCount === 2 ? '✨ 2개 일치! +100 별가루' :
           '꽝!') +
          `<br>잔고: ${stars}`;
      } catch(e) {
        slotResult.textContent = e.message;
      } finally {
        slotBtn.disabled = false;
      }
    };
  }

  // 낚시
  const fishingBtn = document.getElementById('fishing-btn');
  const sellFishBtn = document.getElementById('sell-fish-btn');
  const fishingResult = document.getElementById('fishing-result');
  const fishingInventory = document.getElementById('fishing-inventory');
  function renderInventory(inv) {
    if (!inv || inv.length === 0) {
      fishingInventory.textContent = '인벤토리: (비어있음)';
      return;
    }
    fishingInventory.innerHTML = '인벤토리:<br>' + inv.map(f =>
      `<span style='color:${f.rarity==='legend'?'#ffd700':f.rarity==='rare'?'#b97fff':'#4ac6ff'};'>${f.name}</span> (${f.size}cm)`
    ).join(', ');
  }
  if (fishingBtn && fishingResult && fishingInventory) {
    fishingBtn.onclick = async () => {
      fishingBtn.disabled = true;
      fishingResult.textContent = '낚시 중...';
      try {
        const { fish, stars, inventory } = await starSystem.playFishing({ toolLevel: 1 });
        fishingResult.innerHTML = `<span style='color:${fish.rarity==='legend'?'#ffd700':fish.rarity==='rare'?'#b97fff':'#4ac6ff'}; font-weight:600;'>${fish.name}</span> (${fish.size}cm) 잡음!<br>잔고: ${stars}`;
        renderInventory(inventory);
      } catch(e) {
        fishingResult.textContent = e.message;
      } finally {
        fishingBtn.disabled = false;
      }
    };
    // 페이지 로드시 인벤토리 표시
    renderInventory(starSystem.inventory);
  }
  if (sellFishBtn && fishingResult && fishingInventory) {
    sellFishBtn.onclick = async () => {
      sellFishBtn.disabled = true;
      fishingResult.textContent = '판매 중...';
      try {
        const { earned, stars, inventory } = await starSystem.sellItems();
        fishingResult.innerHTML = `모든 물고기 판매! +${earned} 별가루<br>잔고: ${stars}`;
        renderInventory(inventory);
      } catch(e) {
        fishingResult.textContent = e.message;
      } finally {
        sellFishBtn.disabled = false;
      }
    };
  }

  // 기부
  const donateBtn = document.getElementById('donate-btn');
  const donateAmount = document.getElementById('donate-amount');
  const donateResult = document.getElementById('donate-result');
  const donationRanking = document.getElementById('donation-ranking');
  if (donateBtn && donateAmount && donateResult) {
    donateBtn.onclick = async () => {
      donateBtn.disabled = true;
      donateResult.textContent = '기부 중...';
      try {
        const amount = parseInt(donateAmount.value, 10);
        if (isNaN(amount) || amount <= 0) throw new Error('기부할 별가루를 올바르게 입력하세요.');
        const { amount: donated, totalDonation, stars } = await starSystem.donateStars(amount);
        donateResult.innerHTML = `별가루 ${donated}개 기부 완료!<br>누적 기부: ${totalDonation}<br>잔고: ${stars}`;
        donateAmount.value = '';
      } catch(e) {
        donateResult.textContent = e.message;
      } finally {
        donateBtn.disabled = false;
      }
    };
  }
  // 기부 랭킹 실시간 표시
  if (donationRanking) {
    starSystem.fetchRanking({
      limit: 10,
      onUpdate: (users) => {
        donationRanking.innerHTML = users.map((u,i) =>
          `<span style='font-weight:bold;'>${i+1}위</span> <span style='color:#ffd700;'>${u.userName||'익명'}</span> - <span style='color:#4ac6ff;'>${u.stars} 별가루</span>`
        ).join('<br>');
      }
    });
  }

  // Contents 섹션 로그인/익명 참여 버튼 연동
  const loginBtnContents = document.getElementById('login-btn-contents');
  const anonymousBtnContents = document.getElementById('anonymous-btn-contents');
  const authModal = document.getElementById('auth-modal');
  const anonymousModal = document.getElementById('anonymous-modal');
  if (loginBtnContents && authModal) {
    loginBtnContents.onclick = () => {
      authModal.classList.remove('hidden');
    };
  }
  if (anonymousBtnContents && anonymousModal) {
    anonymousBtnContents.onclick = () => {
      anonymousModal.classList.remove('hidden');
    };
  }
  // 로그인/익명 상태에 따라 버튼 숨김/노출
  function updateAuthBtns() {
    const isAuthed = !!starSystem.user;
    if (loginBtnContents) loginBtnContents.style.display = isAuthed ? 'none' : '';
    if (anonymousBtnContents) anonymousBtnContents.style.display = isAuthed ? 'none' : '';
  }
  // 인증 상태 변경 시마다 동기화
  import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(starSystem.auth, () => {
      updateAuthBtns();
    });
  });
  // 페이지 로드시 1회 동기화
  updateAuthBtns();
});


