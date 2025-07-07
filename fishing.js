// Pretendard 폰트 적용
if (document.body) document.body.style.fontFamily = "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif'";

const floatEl = document.getElementById('float');
const fishAnim = document.getElementById('fish-anim');
const castBtn = document.getElementById('cast-btn');
const catchBtn = document.getElementById('catch-btn');
const catchResult = document.getElementById('catch-result');
const fishingReward = document.getElementById('fishing-reward');
const themeToggle = document.getElementById('theme-toggle');

// 낮/밤 테마 전환
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('day')) {
      body.classList.remove('day');
      body.classList.add('night');
      themeToggle.textContent = '🌙';
    } else {
      body.classList.remove('night');
      body.classList.add('day');
      themeToggle.textContent = '🌞';
    }
  });
}

// 낚시/정원 통합 재화 (별가루)
window.fishingStars = window.fishingStars || 0;
window.fishingAlbum = window.fishingAlbum || [];
window.fishingRanking = window.fishingRanking || [];

const FISH_TYPES = [
  { name: '붕어', rarity: 'common', multiplier: 1, color: '#b7e5c9' },
  { name: '잉어', rarity: 'common', multiplier: 1.2, color: '#b7e6f9' },
  { name: '송사리', rarity: 'common', multiplier: 0.8, color: '#eafbe7' },
  { name: '황금잉어', rarity: 'rare', multiplier: 2.5, color: '#f9e6b7' },
  { name: '비단잉어', rarity: 'rare', multiplier: 2, color: '#e6b7f9' },
  { name: '전설의 물고기', rarity: 'legend', multiplier: 5, color: '#ffd700' }
];

let fishing = false;
let fishTimeout = null;
let fishData = null;

function resetUI() {
  floatEl.style.display = 'none';
  fishAnim.style.display = 'none';
  fishAnim.className = 'fish-anim';
  catchBtn.classList.add('hidden');
  castBtn.disabled = false;
  catchResult.textContent = '';
  fishingReward.textContent = '';
}

function startFishing() {
  resetUI();
  fishing = true;
  floatEl.style.display = 'block';
  castBtn.disabled = true;
  catchResult.textContent = '기다리는 중...';
  // 랜덤 시간(1.5~15초) 후 물고기 등장
  const wait = Math.random() * 13.5 + 1.5;
  fishTimeout = setTimeout(() => {
    showFish(wait);
  }, wait * 1000);
}

function showFish(waitSec) {
  // 물고기 등급/크기 결정
  let fishType;
  let rarityRoll = Math.random();
  if (waitSec >= 10 && Math.random() < 0.5) {
    // 10초 이상 기다리면 전설/희귀 확률 증가
    fishType = rarityRoll < 0.2 ? FISH_TYPES[5] : (rarityRoll < 0.5 ? FISH_TYPES[3] : FISH_TYPES[1]);
  } else if (rarityRoll < 0.03) {
    fishType = FISH_TYPES[5]; // 전설
  } else if (rarityRoll < 0.15) {
    fishType = FISH_TYPES[3 + Math.floor(Math.random() * 2)]; // 희귀
  } else {
    fishType = FISH_TYPES[Math.floor(Math.random() * 3)]; // 일반
  }
  // 크기 결정
  let minSize = 10, maxSize = 100;
  if (fishType.rarity === 'legend') minSize = 80, maxSize = 150;
  else if (fishType.rarity === 'rare') minSize = 40, maxSize = 120;
  else if (waitSec >= 10) minSize = 50;
  const size = Math.round(Math.random() * (maxSize - minSize) + minSize);
  fishData = { ...fishType, size };
  // 찌 애니메이션
  floatEl.style.top = '44%';
  setTimeout(() => {
    floatEl.style.top = '40%';
  }, 400);
  // 물고기 애니메이션
  fishAnim.className = 'fish-anim ' + fishType.rarity + (size >= 100 ? ' big' : '');
  fishAnim.style.display = 'block';
  catchBtn.classList.remove('hidden');
  catchResult.textContent = '물고기가 나타났어요! 낚아채기!';
}

// 물고기 등급별 수량 표시
function updateFishCounts() {
  const counts = { common: 0, rare: 0, epic: 0, legend: 0 };
  (window.fishingAlbum || []).forEach(f => counts[f.rarity] = (counts[f.rarity] || 0) + 1);
  document.getElementById('fish-counts').innerHTML =
    `<span style='color:#fff'>●</span> ${counts.common} ` +
    `<span style='color:#4ac6ff'>●</span> ${counts.rare} ` +
    `<span style='color:#b97fff'>●</span> ${counts.epic} ` +
    `<span style='color:#ffb84a'>●</span> ${counts.legend}`;
}

// 판매/업그레이드/기부 버튼 기능(더미)
let rodLevel = 1;
document.getElementById('sell-fish').onclick = () => {
  let album = window.fishingAlbum || [];
  let stars = 0;
  album.forEach(f => { stars += Math.round(f.size * f.multiplier); });
  window.fishingStars += stars;
  window.fishingAlbum = [];
  updateFishCounts();
  updateMyStars(window.fishingStars);
  if (window.updateUnifiedRanking) window.updateUnifiedRanking();
  alert(`모든 물고기를 판매해 ${stars} 별가루를 얻었습니다!`);
};
document.getElementById('upgrade-rod').onclick = () => {
  rodLevel++;
  alert(`낚싯대가 레벨 ${rodLevel}로 업그레이드 되었습니다! (더 큰 물고기 확률 증가)`);
};

// 별가루 Firestore 연동 함수
function getCurrentUserStars() {
  if (window.firebaseAuth && window.firebaseDB && window.firebaseAuth.currentUser) {
    const { uid } = window.firebaseAuth.currentUser;
    return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ getDoc, doc }) =>
      getDoc(doc(window.firebaseDB, 'users', uid)).then(snap => {
        const data = snap.data();
        return (data && typeof data.stars === 'number') ? data.stars : 0;
      })
    );
  } else {
    // 익명 유저는 별가루 기능 제한
    return Promise.resolve(0);
  }
}

function setCurrentUserStars(newStars) {
  if (window.firebaseAuth && window.firebaseDB && window.firebaseAuth.currentUser) {
    const { uid } = window.firebaseAuth.currentUser;
    return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ setDoc, doc }) =>
      setDoc(doc(window.firebaseDB, 'users', uid), { stars: newStars }, { merge: true })
    );
  } else {
    // 익명 유저는 별가루 기능 제한
    return Promise.resolve();
  }
}

// updateMyStars 함수 Firestore만 사용
function updateMyStars(stars) {
  document.getElementById('fishing-stars').textContent = `별가루: ${stars}`;
  setCurrentUserStars(stars);
  if (window.updateUnifiedRanking) window.updateUnifiedRanking();
  if (typeof window.updateUserStars === 'function') window.updateUserStars(stars);
}
window.updateMyStars = updateMyStars;

// 별가루 잔고 UI 동기화 함수 Firestore만 사용
async function updateStarBalance() {
  const el = document.getElementById('star-balance');
  if (!el) return;
  const stars = await getCurrentUserStars();
  el.textContent = `별가루 잔고: ${stars}`;
}
window.updateStarBalance = updateStarBalance;

// 별가루 상태 동기화(초기화)
document.addEventListener('DOMContentLoaded', async () => {
  const stars = await getCurrentUserStars();
  updateMyStars(stars);
  updateFishCounts();
  updateStarBalance();
});

// 찌 이펙트 함수
function floatEffect(type) {
  const floatEl = document.getElementById('float');
  if (!floatEl) return;
  floatEl.classList.remove('float-success', 'float-fail');
  void floatEl.offsetWidth; // reflow
  if (type === 'success') {
    floatEl.classList.add('float-success');
  } else if (type === 'fail') {
    floatEl.classList.add('float-fail');
  }
}

function catchFish() {
  if (!fishData) return;
  window.fishingAlbum.push(fishData); // 별가루 증가 X
  catchResult.innerHTML = `<span style="color:${fishData.color}; font-weight:600;">${fishData.name}</span> (${fishData.size}cm) 잡음!`;
  fishingReward.textContent = `보상: +${Math.round(fishData.size * fishData.multiplier)} 별가루`;
  updateFishCounts();
  setTimeout(resetUI, 2000);
  floatEffect('success');
}

castBtn.addEventListener('click', () => {
  if (fishing) return;
  startFishing();
});
catchBtn.addEventListener('click', () => {
  if (!fishing) return;
  fishing = false;
  clearTimeout(fishTimeout);
  if (!fishData) {
    // 실패 처리
    document.getElementById('catch-result').textContent = '실패!';
    floatEffect('fail');
    setTimeout(() => {
      document.getElementById('catch-result').textContent = '';
      floatEffect();
    }, 1200);
    return;
  }
  floatEffect('success');
  catchFish();
});

resetUI();
updateFishCounts();

// 기부하기 버튼 동작
const donateBtn = document.getElementById('donate-btn');
if (donateBtn) {
  donateBtn.onclick = function() {
    const input = document.getElementById('donate-amount');
    let amount = parseInt(input.value, 10);
    if (isNaN(amount) || amount <= 0) {
      alert('기부할 별가루 수를 올바르게 입력하세요.');
      return;
    }
    if ((window.fishingStars || 0) < amount) {
      alert('별가루가 부족합니다.');
      return;
    }
    window.fishingStars -= amount;
    window.updateMyStars(window.fishingStars);
    alert(`별가루 ${amount}개를 기부했습니다!`);
    input.value = '';
  };
} 