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

// 낚시 게임 모듈 (star-system.js 필요)
// 사용 전: import { StarSystem } from './star-system.js';

class FishingGame {
  constructor(starSystem) {
    this.starSystem = starSystem;
    this.inventory = [];
    this.isLoading = false;
  }

  // Firestore 인벤토리 동기화
  async loadInventory() {
    try {
      const profile = await this.starSystem.getUserProfile();
      this.inventory = Array.isArray(profile?.inventory) ? profile.inventory : [];
      this.updateInventoryUI();
    } catch (e) {
      alert('인벤토리 불러오기 실패: ' + e.message);
    }
  }

  async saveInventory() {
    try {
      await this.starSystem.setUserProfile({ inventory: this.inventory });
    } catch (e) {
      alert('인벤토리 저장 실패: ' + e.message);
    }
  }

  // 낚시 시도
  async fish() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const COST = 30;
      let stars = await this.starSystem.getCurrentUserStars();
      if (stars < COST) {
        alert('별가루가 부족합니다!');
        return;
      }
      // 물고기 랜덤 결정
      const FISH_TYPES = [
        { name: '붕어', rarity: '일반', multiplier: 1 },
        { name: '잉어', rarity: '일반', multiplier: 1.2 },
        { name: '송사리', rarity: '일반', multiplier: 0.8 },
        { name: '황금잉어', rarity: '희귀', multiplier: 2 },
        { name: '비단잉어', rarity: '희귀', multiplier: 1.7 },
        { name: '전설의 물고기', rarity: '전설', multiplier: 5 }
      ];
      let fishType;
      let roll = Math.random();
      if (roll < 0.02) fishType = FISH_TYPES[5]; // 전설
      else if (roll < 0.10) fishType = FISH_TYPES[3 + Math.floor(Math.random()*2)]; // 희귀
      else fishType = FISH_TYPES[Math.floor(Math.random()*3)]; // 일반
      // 크기 결정
      let size = Math.round(10 + Math.random() * 90); // 10~100
      // 인벤토리 추가
      const fish = { ...fishType, size, caughtAt: Date.now() };
      this.inventory.push(fish);
      await this.saveInventory();
      // 별가루 차감
      await this.starSystem.setCurrentUserStars(stars - COST);
      this.updateInventoryUI();
      alert(`${fishType.name}(${fishType.rarity}) ${size}cm를 낚았습니다!`);
    } catch (e) {
      alert('낚시에 실패했습니다: ' + e.message);
    } finally {
      this.isLoading = false;
    }
  }

  // 인벤토리 판매
  async sellAll() {
    if (this.inventory.length === 0) {
      alert('판매할 물고기가 없습니다!');
      return;
    }
    try {
      let total = 0;
      this.inventory.forEach(f => { total += Math.round(f.size * f.multiplier); });
      let stars = await this.starSystem.getCurrentUserStars();
      await this.starSystem.setCurrentUserStars(stars + total);
      this.inventory = [];
      await this.saveInventory();
      this.updateInventoryUI();
      alert(`모든 물고기를 판매해 ${total} 별가루를 얻었습니다!`);
    } catch (e) {
      alert('판매 실패: ' + e.message);
    }
  }

  // 인벤토리 UI 갱신 (예시)
  updateInventoryUI() {
    const invBox = document.getElementById('fishing-inventory');
    if (!invBox) return;
    invBox.innerHTML = this.inventory.length === 0
      ? '<div>인벤토리가 비었습니다.</div>'
      : this.inventory.map(f => `<div>${f.name} (${f.rarity}) - ${f.size}cm</div>`).join('');
  }
}

// 전역 등록 (필요시)
window.FishingGame = FishingGame;

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
    alert('로그인한 유저만 별가루 기능을 사용할 수 있습니다.');
    return Promise.resolve(0);
  }
}

function setCurrentUserStars(newStars) {
  if (window.firebaseAuth && window.firebaseDB && window.firebaseAuth.currentUser) {
    const { uid } = window.firebaseAuth.currentUser;
    newStars = Math.max(0, Number(newStars) || 0); // 음수 및 NaN 방지
    return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ setDoc, doc }) =>
      setDoc(doc(window.firebaseDB, 'users', uid), { stars: newStars }, { merge: true })
    ).then(() => {
      if (window.updateStarBalance) window.updateStarBalance();
    });
  } else {
    alert('로그인한 유저만 별가루 기능을 사용할 수 있습니다.');
    return Promise.resolve();
  }
}

function updateMyStars(stars) {
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    alert('로그인한 유저만 별가루 기능을 사용할 수 있습니다.');
    return;
  }
  document.getElementById('fishing-stars').textContent = `별가루: ${stars}`;
  setCurrentUserStars(stars);
  if (window.updateUnifiedRanking) window.updateUnifiedRanking();
  if (typeof window.updateUserStars === 'function') window.updateUserStars(stars);
  if (window.updateStarBalance) window.updateStarBalance();
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
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; // 삭제

// 예시: 로그인 상태 변화 감지 시 동적 import 사용
function bindFishingAuthEvents() {
  import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(window.firebaseAuth, (user) => {
      if (!user) {
        alert('로그인한 유저만 별가루 기능을 사용할 수 있습니다.');
        return;
      }

      // 별가루 관련 임시 변수 동기화 및 UI 초기화
      getCurrentUserStars().then(stars => {
        window.fishingStars = stars;
        updateMyStars(stars);
        updateFishCounts();
        updateStarBalance();
      });

      // 버튼 바인딩, UI 초기화 등도 여기서만!
      if (castBtn) {
        castBtn.addEventListener('click', () => {
          if (fishing) return;
          startFishing();
        });
      }
      if (catchBtn) {
        catchBtn.addEventListener('click', () => {
          if (!fishing) return;
          fishing = false;
          clearTimeout(fishTimeout);
          if (!fishData) {
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
      }

      // 기타 UI 초기화
      resetUI();
      updateFishCounts();

      // 기부 버튼 바인딩도 여기서!
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

      // 판매/업그레이드 버튼 바인딩도 여기서!
      const sellFishBtn = document.getElementById('sell-fish');
      if (sellFishBtn) {
        sellFishBtn.onclick = () => {
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
      }
      const upgradeRodBtn = document.getElementById('upgrade-rod');
      if (upgradeRodBtn) {
        upgradeRodBtn.onclick = () => {
          rodLevel++;
          alert(`낚싯대가 레벨 ${rodLevel}로 업그레이드 되었습니다! (더 큰 물고기 확률 증가)`);
        };
      }
    });
  });
}

// addEventListener, onclick 등 null 체크 예시
const sellBtn = document.getElementById('sell-fish');
if (sellBtn) {
  sellBtn.onclick = () => {
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
}

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