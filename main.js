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
  audioPlayer.play().catch(error => {
    console.log('Autoplay prevented:', error);
  });
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
  '삼겹살', '치킨', '라면', '초밥', '김치찌개', '떡볶이', '족발', '라멘', '리조또', '제육볶음', '감자탕', '갈비탕', '갈비', '돈까스', '냉면', '햄버거', '피자', '파스타', '우동', '생선구이', '게장', '백반'
];
const rouletteDisplay = document.getElementById('roulette-display');
const spinRouletteBtn = document.getElementById('spin-roulette');

spinRouletteBtn.addEventListener('click', () => {
  spinRouletteBtn.disabled = true;
  let spinCount = 0;
  const totalSpins = 30; // Number of times to change the display
  const spinInterval = 50; // Milliseconds between changes

  const intervalId = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * menuItems.length);
    rouletteDisplay.textContent = menuItems[randomIndex];
    spinCount++;

    if (spinCount >= totalSpins) {
      clearInterval(intervalId);
      spinRouletteBtn.disabled = false;
      // Final selection (optional, can just be the last random one)
      const finalIndex = Math.floor(Math.random() * menuItems.length);
      rouletteDisplay.textContent = menuItems[finalIndex];
    }
  }, spinInterval);
});
