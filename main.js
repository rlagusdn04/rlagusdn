const canvas = document.getElementById('mouseCanvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let spriteImage = new Image();
spriteImage.src = "assets/ditto.png";

// === 애니메이션 클래스
class Animation {
  constructor(frames, speed) {
    this.frames = frames;
    this.speed = speed;
    this.current = 0;
    this.timer = 0;
    this.playing = true;
  }

  update(dt) {
    if (!this.playing) return;
    this.timer += dt;
    if (this.timer > this.speed) {
      this.timer = 0;
      this.current++;
      if (this.current >= this.frames.length) {
        this.current = 0;
        this.playing = false; // 클릭 애니메이션 1번만 재생
      }
    }
  }

  getFrame() {
    return this.frames[this.current];
  }

  reset() {
    this.current = 0;
    this.timer = 0;
    this.playing = true;
  }
}

let idleAnim, levelUpAnim, currentAnim;
let lastTime = 0;

spriteImage.onload = () => {
  const idleFrames = [
    { sx: 0, sy: 0, sw: 128, sh: 128 },
    { sx: 128, sy: 0, sw: 128, sh: 128 },
    { sx: 256, sy: 0, sw: 128, sh: 128 }
  ];

  const levelUpFrames = [
    { sx: 0, sy: 256, sw: 128, sh: 128 },
    { sx: 128, sy: 256, sw: 128, sh: 128 },
    { sx: 256, sy: 256, sw: 128, sh: 128 }
  ];

  idleAnim = new Animation(idleFrames, 200);
  levelUpAnim = new Animation(levelUpFrames, 100);
  currentAnim = idleAnim;

  requestAnimationFrame(loop);
};

document.addEventListener('click', () => {
  levelUpAnim.reset();
  currentAnim = levelUpAnim;
});

function loop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentAnim.update(dt);
  const frame = currentAnim.getFrame();

  const drawX = mouseX - frame.sw / 2;
  const drawY = mouseY - frame.sh / 2;

  ctx.drawImage(
    spriteImage,
    frame.sx, frame.sy, frame.sw, frame.sh,
    drawX, drawY, frame.sw, frame.sh
  );

  if (!currentAnim.playing && currentAnim === levelUpAnim) {
    currentAnim = idleAnim; // 다시 idle로
  }

  requestAnimationFrame(loop);
}
