// Fractal Background Animation
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
