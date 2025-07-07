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
  const counts = { common: 0, rare: 0, legend: 0 };
  (window.fishingAlbum || []).forEach(f => counts[f.rarity] = (counts[f.rarity] || 0) + 1);
  document.getElementById('fish-counts').textContent = `일반: ${counts.common} / 희귀: ${counts.rare} / 전설: ${counts.legend}`;
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
  if (window.updateMyStars) window.updateMyStars(window.fishingStars);
  alert(`모든 물고기를 판매해 ${stars} 별가루를 얻었습니다!`);
};
document.getElementById('upgrade-rod').onclick = () => {
  rodLevel++;
  alert(`낚싯대가 레벨 ${rodLevel}로 업그레이드 되었습니다! (더 큰 물고기 확률 증가)`);
};
document.getElementById('donate-fish').onclick = () => {
  let album = window.fishingAlbum || [];
  let donate = 0;
  album.forEach(f => { donate += Math.round(f.size * f.multiplier * 0.5); });
  window.fishingAlbum = [];
  updateFishCounts();
  alert(`모든 물고기를 기부해 ${donate} 별가루를 사회에 환원했습니다! (별가루는 증가하지 않음)`);
};

function catchFish() {
  if (!fishData) return;
  const reward = Math.round(fishData.size * fishData.multiplier);
  window.fishingStars += reward;
  window.fishingAlbum.push(fishData);
  const userName = (window.currentUser && window.currentUser.displayName) || (window.currentUser && window.currentUser.email) || (window.anonymousUser && window.anonymousUser.name) || 'Guest';
  let userRank = window.fishingRanking.find(r => r.name === userName);
  if (!userRank) {
    userRank = { name: userName, stars: 0, fish: 0, maxSize: 0 };
    window.fishingRanking.push(userRank);
  }
  userRank.stars += reward;
  userRank.fish += 1;
  if (fishData.size > userRank.maxSize) userRank.maxSize = fishData.size;
  catchResult.innerHTML = `<span style="color:${fishData.color}; font-weight:600;">${fishData.name}</span> (${fishData.size}cm) 잡음!`;
  fishingReward.textContent = `보상: +${reward} 별가루`;
  if (window.updateUnifiedRanking) window.updateUnifiedRanking();
  updateFishCounts();
  setTimeout(resetUI, 2000);
}

castBtn.addEventListener('click', () => {
  if (fishing) return;
  startFishing();
});
catchBtn.addEventListener('click', () => {
  if (!fishing) return;
  fishing = false;
  clearTimeout(fishTimeout);
  catchFish();
});

resetUI();
updateFishCounts(); 