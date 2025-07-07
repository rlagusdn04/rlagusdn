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

window.updateUnifiedRanking = function() {
  // 합산 랭킹 영역이 있으면 갱신
  const rankingBox = document.getElementById('unified-ranking-list');
  if (!rankingBox) return;
  // 정원/낚시 랭킹 데이터 합산
  const gardenRanking = (window.ranking || []).map(r => ({
    name: r.name,
    stars: r.amount || 0,
    fish: 0,
    maxSize: 0
  }));
  const fishingRanking = (window.fishingRanking || []);
  // 닉네임 기준 합산
  const allNames = new Set([
    ...gardenRanking.map(r => r.name),
    ...fishingRanking.map(r => r.name)
  ]);
  const unified = Array.from(allNames).map(name => {
    const g = gardenRanking.find(r => r.name === name) || { stars: 0 };
    const f = fishingRanking.find(r => r.name === name) || { stars: 0, fish: 0, maxSize: 0 };
    return {
      name,
      stars: (g.stars || 0) + (f.stars || 0),
      fish: f.fish || 0,
      maxSize: f.maxSize || 0
    };
  });
  unified.sort((a, b) => b.stars - a.stars);
  rankingBox.innerHTML = '';
  unified.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.name} - 별가루: ${u.stars} / 물고기: ${u.fish} / 최대크기: ${u.maxSize}cm`;
    rankingBox.appendChild(li);
  });
};

import { collection, query, orderBy, onSnapshot, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function getCurrentUserInfo() {
  if (window.currentUser) {
    return { uid: window.currentUser.uid, name: window.currentUser.displayName || window.currentUser.email.split('@')[0] };
  } else if (window.anonymousUser) {
    return { uid: window.anonymousUser.uid, name: window.anonymousUser.name };
  }
  // localStorage 기반 익명 유저 생성/유지
  let uid = localStorage.getItem('anon-uid');
  let name = localStorage.getItem('anon-name');
  if (!uid) {
    uid = 'anon-' + Math.random().toString(36).slice(2, 12);
    localStorage.setItem('anon-uid', uid);
  }
  if (!name) {
    name = 'Guest-' + Math.floor(Math.random() * 10000);
    localStorage.setItem('anon-name', name);
  }
  return { uid, name };
}

// 별가루 획득/소비 시 Firestore에 업데이트
window.updateMyStars = async function(newStars) {
  const { uid, name } = getCurrentUserInfo();
  try {
    await setDoc(doc(window.firebaseDB, 'unified-ranking', uid), { name, stars: newStars }, { merge: true });
  } catch (err) {
    console.error('Firestore setDoc error:', err);
    alert('별가루 랭킹 저장 중 오류가 발생했습니다. 콘솔을 확인하세요.');
  }
};

// 실시간 별가루 랭킹 구독
function subscribeUnifiedRanking() {
  const q = query(collection(window.firebaseDB, 'unified-ranking'), orderBy('stars', 'desc'));
  try {
    onSnapshot(q, (snapshot) => {
      const ranking = [];
      snapshot.forEach(doc => ranking.push(doc.data()));
      const rankingBox = document.getElementById('unified-ranking-list');
      if (!rankingBox) return;
      rankingBox.innerHTML = '';
      ranking.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.name} - 별가루: ${u.stars}`;
        rankingBox.appendChild(li);
      });
    }, (err) => {
      console.error('Firestore onSnapshot error:', err);
      alert('합산 랭킹 구독 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    });
  } catch (err) {
    console.error('Firestore subscribeUnifiedRanking error:', err);
    alert('합산 랭킹 구독 중 오류가 발생했습니다. 콘솔을 확인하세요.');
  }
}

document.addEventListener('DOMContentLoaded', subscribeUnifiedRanking);


