const canvas = document.getElementById('mouseCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const image = new Image();
image.src = "../assets/ditto.png";

let isMouseDown = false;
class Animation {
  constructor(frames, speed) {
    this.frames = frames;
    this.speed = speed;
    this.current = 0;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
    if (this.timer > this.speed) {
      this.timer = 0;
      this.current = (this.current + 1) % this.frames.length;
      if (isMouseDown && currentAnim === levelUpAnim) {
        isFlipped = !isFlipped;
      }
    }
  }

  getFrame() {
    return this.frames[this.current];
  }

  reset() {
    this.current = 0;
    this.timer = 0;
  }
}

let idleAnim, levelUpAnim, currentAnim;
let lastTime = 0;
const SCALE = 0.25; // 128x128 → 32x32 크기
let isFlipped = false;

image.onload = () => {
  const idleFrames = [
    { sx: 0, sy: 0, sw: 128, sh: 128 },
    { sx: 128, sy: 0, sw: 128, sh: 128 },
    { sx: 256, sy: 0, sw: 128, sh: 128 }
  ];

  const levelUpFrames = [
    { sx: 0, sy: 128*8, sw: 128, sh: 128 },
    { sx: 128, sy: 128*8, sw: 128, sh: 128 },
    { sx: 256, sy: 128*8, sw: 128, sh: 128 },
    { sx: 128*3, sy: 128*8, sw: 128, sh: 128 },
    { sx: 128*4, sy: 128*8, sw: 128, sh: 128 },
    { sx: 128*5, sy: 128*8, sw: 128, sh: 128 },
    { sx: 128*6, sy: 128*8, sw: 128, sh: 128 }
  ];

  idleAnim = new Animation(idleFrames, 200);
  levelUpAnim = new Animation(levelUpFrames, 100);
  currentAnim = idleAnim;

  requestAnimationFrame(loop);
};

document.addEventListener('mousedown', () => {
  levelUpAnim.reset();
  currentAnim = levelUpAnim;
  isMouseDown = true;
  isFlipped = !isFlipped;
});

document.addEventListener('mouseup', () => {
  idleAnim.reset();
  currentAnim = idleAnim;
  isMouseDown = false;
});

function loop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentAnim.update(dt);
  const frame = currentAnim.getFrame();

  const w = frame.sw * SCALE;
  const h = frame.sh * SCALE;
  let x = mouseX - w / 2;
  let y = mouseY - h / 2;

  ctx.save();
  if (isFlipped) {
    ctx.translate(mouseX, mouseY);
    ctx.scale(-1, 1);
    ctx.drawImage(
      image,
      frame.sx, frame.sy, frame.sw, frame.sh,
      -w / 2, -h / 2, w, h
    );
  } else {
    ctx.drawImage(
      image,
      frame.sx, frame.sy, frame.sw, frame.sh,
      x, y, w, h
    );
  }
  ctx.restore();

  requestAnimationFrame(loop);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Handle visibility change to pause animation when the tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    currentAnim.reset();
  } else {
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
});

// --- Fractal 스타일 그라데이션 배경 (파스텔톤, 블러, 참고 사이트 느낌) ---
(function(){
  const bgCanvas = document.getElementById('bgFractal');
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  function resizeBg() {
    w = window.innerWidth;
    h = window.innerHeight;
    bgCanvas.width = w;
    bgCanvas.height = h;
  }
  window.addEventListener('resize', resizeBg);
  resizeBg();
  const colors = [
    [255, 220, 230], [210, 240, 255], [255, 255, 210],
    [220, 255, 230], [255, 230, 210], [230, 220, 255]
  ];
  const blobs = Array.from({length: 7}).map((_,i)=>({
    x: Math.random()*w, y: Math.random()*h,
    r: 220+Math.random()*180,
    dx: (Math.random()-0.5)*0.2, dy: (Math.random()-0.5)*0.2,
    color: colors[i%colors.length],
    alpha: 0.32 + Math.random()*0.18
  }));
  function drawFractalBg() {
    bgCtx.clearRect(0,0,w,h);
    blobs.forEach((b,i)=>{
      b.x += b.dx; b.y += b.dy;
      if(b.x<0||b.x>w) b.dx*=-1;
      if(b.y<0||b.y>h) b.dy*=-1;
      const grad = bgCtx.createRadialGradient(b.x, b.y, b.r*0.2, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.alpha})`);
      grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
      bgCtx.beginPath();
      bgCtx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      bgCtx.fillStyle = grad;
      bgCtx.filter = 'blur(32px)';
      bgCtx.fill();
      bgCtx.filter = 'none';
    });
    requestAnimationFrame(drawFractalBg);
  }
  requestAnimationFrame(drawFractalBg);
})();

// --- 사이드바 홈 옆 미니멀 시간 표시 ---
(function(){
  function updateSidebarTimeModern() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ampm = h < 12 ? 'AM' : 'PM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const pad = n => n < 10 ? '0'+n : n;
    const timeStr = `${ampm} ${h12}:${pad(m)}:${pad(s)}`;
    const el = document.getElementById('sidebar-time-minimal') || document.getElementById('sidebar-time-modern');
    if (el) el.textContent = timeStr;
  }
  setInterval(updateSidebarTimeModern, 1000);
  updateSidebarTimeModern();
})();

(function(){
  const section = document.getElementById('content-section');
  if (!section) return;
  const cards = section.querySelectorAll('.content-card');
  let autoScroll = true;
  let scrollSpeed = 0.5; // px/frame
  function animateScroll() {
    if (autoScroll) {
      section.scrollLeft += scrollSpeed;
      if (section.scrollLeft + section.offsetWidth >= section.scrollWidth - 2) {
        section.scrollTo({left: 0, behavior: 'auto'});
      }
    }
    requestAnimationFrame(animateScroll);
  }
  animateScroll();
  section.addEventListener('mousedown', ()=>{autoScroll=false;});
  section.addEventListener('touchstart', ()=>{autoScroll=false;});
  section.addEventListener('mouseup', ()=>{autoScroll=true;});
  section.addEventListener('mouseleave', ()=>{autoScroll=true;});
  section.addEventListener('touchend', ()=>{autoScroll=true;});
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const nextIdx = (idx + 1) % cards.length;
      const nextCard = cards[nextIdx];
      nextCard.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
    });
  });
})();

const quiz = [
  {
    question: "추억을 떠올리는 감각은?",
    options: ["냄새", "소리", "촉각(온도, 질감)", "미각"],
    answer: ["촉각", "소리"]
  },
  {
    question: "가장 그리운 시절은?",
    options: ["걱정 없던 어린 시절", "자각 없이 지나간 어느 때", "후회가 많던 순간들", "지금 이 무렵"],
    answer: ["자각 없이 지나간 어느 때", "지금 이 무렵"]
  },
  {
    question: "좋아하는 날씨는?",
    options: ["맑음", "비", "눈", "흐림"],
    answer: ["맑음"]
  },
  {
    question: "선호하는 시간의 체감은?",
    options: ["여유로움", "뿌듯함", "자유로움", "일상적임"],
    answer: ["여유로움", "자유로움"]
  },
  {
    question: "편한 대화 상대는?",
    options: [
      "서로의 침묵도 편안한 사람",
      "활기차고 즐거운 분위기의 사람",
      "무슨 생각인지 알기 어려운 사람",
      "익숙하고 반복되는 이야기의 사람",
    ],
    answer: ["서로의 침묵도 편안한 사람", "무슨 생각인지 알기 어려운 사람"]
  },
  {
    question: "당신이 가장 좋아하는 빛은?",
    options: ["햇빛", "달빛", "형광등 불빛", "촛불, 모닥불"],
    answer: ["햇빛", "달빛"]
  },
  {
    question: "지쳤을 때 찾는 것은?",
    options: ["위로해줄 누군가", "치유받는 장소", "즐거움, 쾌락", "혼자만의 시간"],
    answer: ["혼자만의 시간", "치유받는 장소"]
  },
  {
    question: "지금 가장 필요한 감정은?",
    options: ["위로", "자극", "안정", "몰입"],
    answer: ["안정", "몰입"]
  },
  {
    question: "기억을 선명하게 만드는 것은?",
    options: ["날씨", "사진", "익숙한 장소", "꿈"],
    answer: ["꿈", "날씨"]
  },
  {
    question: "가장 좋아하는 계절은?",
    options: ["봄", "여름", "가을", "겨울"],
    answer: ["가을", "봄"]
  },
  {
    question: "당신의 이상적인 휴식은?",
    options: ["자연 속에서의 시간", "도시의 소음 속에서의 시간", "조용한 방 안에서의 시간", "사람들과의 소통"],
    answer: ["자연 속에서의 시간", "조용한 방 안에서의 시간"]
  },
  {
    question: "당신이 자주 가는 장소는?",
    options: ["노래방", "카페", "운동 시설", "도서관"],
    answer: ""
  },
  {
    question: "글을 쓴다면",
    options: ["일기", "시", "소설", "편지"],
    answer: ["일기", "편지"]
  }


];

// Fisher-Yates shuffle 함수 추가
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let current = 0;
let score = 0;
let quizShuffled = [];

function startQuiz() {
  quizShuffled = shuffle([...quiz]).slice(0, 10);
  current = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (current >= quizShuffled.length) {
    document.getElementById("main-container").classList.add("result-mode");
    document.getElementById("result-box").style.display = "flex";
    document.getElementById("question-box").style.display = "none";
    const percent = Math.round((score / quizShuffled.length) * 100);
    document.getElementById("result-score").textContent = `유사도: ${percent}%`;
    return;
  }
  document.getElementById("question-box").style.display = "block";
  document.getElementById("progress").textContent = `${current+1} / ${quizShuffled.length}`;

  const q = quizShuffled[current];
  document.getElementById("question-text").textContent = q.question;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";

    btn.onclick = () => {
      if (Array.isArray(q.answer) && q.answer.includes(option)) {
        score++;
      }
      current++;
      showQuestion();
    };

    container.appendChild(btn);
  });
}

// 결과창 버튼 이벤트
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("retry-btn").onclick = function() {
    document.getElementById("result-box").style.display = "none";
    document.getElementById("main-container").classList.remove("result-mode");
    document.getElementById("question-box").style.display = "block";
    startQuiz();
  };
  document.getElementById("go-title-btn").onclick = function() {
    window.location.href = "index.html";
  };
});

// 퀴즈 시작
startQuiz();

// 메뉴 버튼/사이드바 동작
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  if (sidebar.classList.contains('open')) {
    menuBtn.style.display = 'none';
  }
});
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && e.target !== menuBtn) {
    sidebar.classList.remove('open');
    menuBtn.style.display = 'block';
  }
});
sidebar.addEventListener('click', (e) => {
  e.stopPropagation();
});

// 시계: 시/분/초까지 표시, 사이드바와 화면에 각각 표시
function updateTime() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();
  h = h < 10 ? '0'+h : h;
  m = m < 10 ? '0'+m : m;
  s = s < 10 ? '0'+s : s;
  document.getElementById('current-time').textContent = `${h}:${m}:${s}`;
  document.getElementById('sidebar-time').textContent = `${h}:${m}:${s}`;
}
setInterval(updateTime, 1000);
updateTime();

// 음악 셔플/재생/볼륨 기능
const musicList = [
  {title: 'Heart', src: '../Music/Heart.mp3'},
  {title: 'ame', src: '../Music/ame.mp3'},
  {title: 'La nuit', src: '../Music/La nuit.mp3'},
  {title: 'Time to Start Another Day', src: '../Music/Time to Start Another Day.mp3'},
  {title: 'Triste', src: '../Music/Triste.mp3'},
  {title: 'watercity', src: '../Music/watercity.mp3'}
];
let currentMusicIdx = 0;
const sidebarAudio = document.getElementById('sidebar-audio-player');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarVolDown = document.getElementById('sidebar-vol-down');
const sidebarVolUp = document.getElementById('sidebar-vol-up');
const sidebarVolValue = document.getElementById('sidebar-vol-value');
const sidebarMusicTitle = document.getElementById('sidebar-music-title');
sidebarAudio.volume = 0.5;
let isPlaying = false;
function updateToggleBtn() {
  sidebarToggleBtn.textContent = '';
  sidebarToggleBtn.style.background = isPlaying ? '#222' : '#bbb';
}
function updateVolValue() {
  sidebarVolValue.textContent = Math.round(sidebarAudio.volume * 100) + '%';
}
function updateMusicInfo() {
  sidebarMusicTitle.textContent = musicList[currentMusicIdx].title;
  sidebarAudio.src = musicList[currentMusicIdx].src;
}
sidebarToggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    sidebarAudio.pause();
  } else {
    sidebarAudio.play();
  }
});
sidebarAudio.addEventListener('play', () => {
  isPlaying = true;
  updateToggleBtn();
});
sidebarAudio.addEventListener('pause', () => {
  isPlaying = false;
  updateToggleBtn();
});
sidebarVolDown.addEventListener('click', () => {
  sidebarAudio.volume = Math.max(0, Math.round((sidebarAudio.volume - 0.1)*10)/10);
  updateVolValue();
});
sidebarVolUp.addEventListener('click', () => {
  sidebarAudio.volume = Math.min(1, Math.round((sidebarAudio.volume + 0.1)*10)/10);
  updateVolValue();
});
sidebarMusicTitle.addEventListener('click', () => {
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * musicList.length);
  } while (nextIdx === currentMusicIdx && musicList.length > 1);
  currentMusicIdx = nextIdx;
  updateMusicInfo();
  sidebarAudio.play();
});
updateToggleBtn();
updateVolValue();
updateMusicInfo();