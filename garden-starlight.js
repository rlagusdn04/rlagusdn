// 별빛 온실 게임 - 기본 인터랙션 (프론트엔드 더미)

const NUM_INITIAL_PLOTS = 5;
const MAX_PLOTS = 16;
let plots = [];
let seeds = 3;
let stars = 100;
let ranking = [];

// 폰트 적용
if (document.body) document.body.style.fontFamily = "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif'";

const SEED_TYPES = [
  { name: '연두새싹', class: 'seed-type1' },
  { name: '노랑꽃씨', class: 'seed-type2' },
  { name: '보라꽃씨', class: 'seed-type3' },
  { name: '하늘꽃씨', class: 'seed-type4' }
];

// 배경 빛(반딧불이/주황빛) 효과
const glowContainer = document.createElement('div');
glowContainer.className = 'background-glows';
document.body.appendChild(glowContainer);

function randomBetween(a, b) { return Math.random() * (b - a) + a; }

function spawnGlow(isNight) {
  const dot = document.createElement('div');
  dot.className = 'glow-dot';
  const size = randomBetween(18, 38);
  dot.style.width = dot.style.height = size + 'px';
  dot.style.left = randomBetween(5, 95) + '%';
  dot.style.top = randomBetween(10, 80) + '%';
  dot.style.opacity = 0;
  dot.style.transform = 'scale(0.7)';
  if (isNight) {
    dot.style.background = 'rgba(255,255,255,0.85)';
    dot.style.boxShadow = '0 0 16px 8px #fff8';
  } else {
    dot.style.background = 'rgba(255, 200, 80, 0.7)';
    dot.style.boxShadow = '0 0 18px 8px #ffd58088';
  }
  glowContainer.appendChild(dot);
  setTimeout(() => {
    dot.style.opacity = 1;
    dot.style.transform = 'scale(1.1)';
  }, 30);
  setTimeout(() => {
    dot.style.opacity = 0;
    dot.style.transform = 'scale(0.7)';
    setTimeout(() => dot.remove(), 1200);
  }, randomBetween(1800, 3500));
}

setInterval(() => {
  const isNight = document.body.classList.contains('night');
  if (glowContainer.childElementCount < (isNight ? 10 : 7)) {
    spawnGlow(isNight);
  }
}, 600);

function clearGlows() {
  while (glowContainer.firstChild) glowContainer.removeChild(glowContainer.firstChild);
}
document.getElementById('theme-toggle').addEventListener('click', clearGlows);

function updateInventory() {
  document.getElementById('inventory-seeds').textContent = `씨앗: ${seeds}`;
  document.getElementById('inventory-stars').textContent = `별가루: ${stars}`;
}

function getCurrentUserName() {
  // Firebase Auth 연동이 없으므로 window.currentUser/window.anonymousUser 활용
  if (window.currentUser && window.currentUser.displayName) {
    return window.currentUser.displayName;
  } else if (window.currentUser && window.currentUser.email) {
    return window.currentUser.email.split('@')[0];
  } else if (window.anonymousUser && window.anonymousUser.name) {
    return window.anonymousUser.name;
  } else {
    return 'Guest';
  }
}

function ensureUserInRanking() {
  const name = getCurrentUserName();
  let me = ranking.find(r => r.name === name);
  if (!me) {
    me = { name, amount: 0 };
    ranking.push(me);
    updateRanking();
  }
}

function updateRanking() {
  const list = document.getElementById('starlight-ranking-list');
  list.innerHTML = '';
  ranking.sort((a, b) => b.amount - a.amount);
  ranking.forEach((r) => {
    const li = document.createElement('li');
    li.textContent = `${r.name} (${r.amount})`;
    list.appendChild(li);
  });
}

function createPlot(index) {
  const plot = document.createElement('div');
  plot.className = 'starlight-plot';
  plot.dataset.index = index;
  plot.dataset.state = plots[index]?.state || 'empty';
  plot.addEventListener('click', () => {
    // 이미 씨앗이 심긴 땅에는 씨앗을 다시 심을 수 없음
    if (plot.dataset.state !== 'empty') return;
    if (seeds > 0) {
      // 씨앗 종류 랜덤
      const seedType = SEED_TYPES[Math.floor(Math.random() * SEED_TYPES.length)];
      plots[index] = { state: 'planted', seed: seedType.class };
      seeds--;
      renderPlots();
      updateInventory();
    }
  });
  return plot;
}

function renderPlots() {
  const garden = document.getElementById('starlight-garden');
  garden.innerHTML = '';
  plots.forEach((plotObj, i) => {
    let state, seedClass;
    if (typeof plotObj === 'string') {
      state = plotObj;
      seedClass = '';
    } else {
      state = plotObj.state;
      seedClass = plotObj.seed;
    }
    const plot = document.createElement('div');
    plot.className = 'starlight-plot';
    plot.dataset.index = i;
    plot.dataset.state = state;
    plot.addEventListener('click', () => {
      if (plot.dataset.state !== 'empty') return;
      if (seeds > 0) {
        const seedType = SEED_TYPES[Math.floor(Math.random() * SEED_TYPES.length)];
        plots[i] = { state: 'planted', seed: seedType.class };
        seeds--;
        renderPlots();
        updateInventory();
      }
    });
    if (state === 'empty') {
      // nothing
    } else if (state === 'planted') {
      const seedling = document.createElement('div');
      seedling.className = 'seedling ' + seedClass;
      plot.appendChild(seedling);
      // 성장 애니메이션 후 grown으로 변경
      setTimeout(() => {
        if (plots[i] && plots[i].state === 'planted') {
          plots[i].state = 'grown';
          renderPlots();
        }
      }, 3000);
    } else if (state === 'grown') {
      const seedling = document.createElement('div');
      seedling.className = 'seedling ' + seedClass + ' shake';
      plot.appendChild(seedling);
      const harvestBtn = document.createElement('button');
      harvestBtn.className = 'harvest';
      harvestBtn.textContent = '수확';
      harvestBtn.onclick = (e) => {
        e.stopPropagation();
        plots[i] = 'empty';
        stars += 20;
        renderPlots();
        updateInventory();
      };
      plot.appendChild(harvestBtn);
    }
    garden.appendChild(plot);
  });
  arrangePlotsCircle();
}

function arrangePlotsCircle() {
  // 원형 배치
  const garden = document.getElementById('starlight-garden');
  const n = plots.length;
  const radius = 180 + Math.max(0, n - 6) * 18;
  const centerX = 320, centerY = 220;
  Array.from(garden.children).forEach((plot, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    plot.style.position = 'absolute';
    plot.style.left = `${centerX + radius * Math.cos(angle) - 55}px`;
    plot.style.top = `${centerY + radius * Math.sin(angle) - 55}px`;
  });
  garden.style.position = 'relative';
  garden.style.minHeight = '440px';
}

document.getElementById('buy-seed').onclick = () => {
  if (stars >= 10) {
    seeds++;
    stars -= 10;
    updateInventory();
  }
};
document.getElementById('buy-plot').onclick = () => {
  if (stars >= 100 && plots.length < MAX_PLOTS) {
    plots.push('empty');
    stars -= 100;
    renderPlots();
    updateInventory();
  }
};
document.getElementById('donate-stars').onclick = () => {
  if (stars >= 10) {
    stars -= 10;
    // 내 이름은 "You"로 가정
    let me = ranking.find(r => r.name === 'You');
    if (!me) {
      me = { name: 'You', amount: 0 };
      ranking.push(me);
    }
    me.amount += 10;
    ranking.sort((a, b) => b.amount - a.amount);
    updateInventory();
    updateRanking();
  }
};

function initGame() {
  plots = Array(NUM_INITIAL_PLOTS).fill('empty');
  updateInventory();
  ensureUserInRanking();
  updateRanking();
  renderPlots();
}

document.addEventListener('DOMContentLoaded', initGame); 