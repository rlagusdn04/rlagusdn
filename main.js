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
image.src = "assets/ditto.png";

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

let idleAnim, currentAnim;
let lastTime = 0;
const SCALE = 0.25; // 128 * 0.25 = 32 크기로 축소 (4배 축소)

image.onload = () => {
  const idleFrames = [
    { sx: 0, sy: 0, sw: 128, sh: 128 },
    { sx: 128, sy: 0, sw: 128, sh: 128 },
    { sx: 256, sy: 0, sw: 128, sh: 128 }
  ];

  idleAnim = new Animation(idleFrames, 200);
  currentAnim = idleAnim;

  requestAnimationFrame(loop);
};

document.addEventListener('mousedown', () => {
  // 눌러도 변화 없음. 계속 idle 애니메이션 재생
});

document.addEventListener('mouseup', () => {
  // 마찬가지, idle 유지
});

function loop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentAnim.update(dt);
  const frame = currentAnim.getFrame();
  const x = mouseX - (frame.sw * SCALE) / 2;
  const y = mouseY - (frame.sh * SCALE) / 2;

  ctx.drawImage(
    image,
    frame.sx, frame.sy, frame.sw, frame.sh,
    x, y, frame.sw * SCALE, frame.sh * SCALE
  );

  requestAnimationFrame(loop);
}
