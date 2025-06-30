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
const SCALE = 0.625; // 128 -> 80 크기 비율

image.onload = () => {
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

let mouseDown = false;

document.addEventListener('mousedown', () => {
  mouseDown = true;
  levelUpAnim.reset();
  currentAnim = levelUpAnim;
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
  currentAnim = idleAnim;
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
