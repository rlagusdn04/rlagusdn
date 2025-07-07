// 별빛 온실 게임 - 기본 인터랙션 (프론트엔드 더미)

const NUM_INITIAL_PLOTS = 5;
const MAX_PLOTS = 16;
let plots = [];
let seeds = 3;
let stars = 100;
let ranking = [
  { name: 'Alice', amount: 5000 },
  { name: 'Bob', amount: 3200 },
  { name: 'Carol', amount: 2100 }
];

function updateInventory() {
  document.getElementById('inventory-seeds').textContent = `씨앗: ${seeds}`;
  document.getElementById('inventory-stars').textContent = `별가루: ${stars}`;
}

function updateRanking() {
  const list = document.getElementById('starlight-ranking-list');
  list.innerHTML = '';
  ranking.slice(0, 5).forEach((r, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}위: ${r.name} (${r.amount})`;
    list.appendChild(li);
  });
}

function createPlot(index) {
  const plot = document.createElement('div');
  plot.className = 'starlight-plot';
  plot.dataset.index = index;
  plot.dataset.state = 'empty';
  plot.addEventListener('click', () => {
    if (plot.dataset.state === 'empty' && seeds > 0) {
      plot.dataset.state = 'planted';
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
  plots.forEach((state, i) => {
    const plot = createPlot(i);
    if (state === 'empty') {
      // nothing
    } else if (state === 'planted') {
      const seedling = document.createElement('div');
      seedling.className = 'seedling';
      plot.appendChild(seedling);
      // 수확 버튼 (3초 후 활성화)
      setTimeout(() => {
        if (plot.dataset.state === 'planted') {
          plot.dataset.state = 'grown';
          renderPlots();
        }
      }, 3000);
    } else if (state === 'grown') {
      const seedling = document.createElement('div');
      seedling.className = 'seedling';
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
  updateRanking();
  renderPlots();
}

document.addEventListener('DOMContentLoaded', initGame); 