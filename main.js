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
image.src = "/rlagusdn.github.io/assets/ditto.png";

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

// --- Fractal 스타일 그라데이션 배경 ---
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
    [255, 99, 132], [54, 162, 235], [255, 206, 86],
    [75, 192, 192], [153, 102, 255], [255, 159, 64]
  ];
  const blobs = Array.from({length: 6}).map((_,i)=>({
    x: Math.random()*w, y: Math.random()*h,
    r: 320+Math.random()*120,
    dx: (Math.random()-0.5)*0.3, dy: (Math.random()-0.5)*0.3,
    color: colors[i]
  }));
  function drawFractalBg() {
    bgCtx.clearRect(0,0,w,h);
    blobs.forEach((b,i)=>{
      b.x += b.dx; b.y += b.dy;
      if(b.x<0||b.x>w) b.dx*=-1;
      if(b.y<0||b.y>h) b.dy*=-1;
      const grad = bgCtx.createRadialGradient(b.x, b.y, b.r*0.2, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.45)`);
      grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
      bgCtx.beginPath();
      bgCtx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      bgCtx.fillStyle = grad;
      bgCtx.fill();
    });
    requestAnimationFrame(drawFractalBg);
  }
  requestAnimationFrame(drawFractalBg);
})();
// --- 사이드바 홈 옆 미니멀 시간 표시 ---
(function(){
  function updateSidebarTimeMinimal() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    h = h < 10 ? '0'+h : h;
    m = m < 10 ? '0'+m : m;
    const el = document.getElementById('sidebar-time-minimal');
    if (el) el.textContent = `${h}:${m}`;
  }
  setInterval(updateSidebarTimeMinimal, 1000);
  updateSidebarTimeMinimal();
})();