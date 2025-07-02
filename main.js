document.addEventListener('DOMContentLoaded', () => {

    // Name Animation
    const nameHighlight = document.getElementById('name-highlight');
    const originalName = '김현우';
    const chars = '가나다라마바사아자차카타파하';
    let intervalId = null;

    function runRouletteAnimation() {
        let iteration = 0;
        clearInterval(intervalId);
        nameHighlight.classList.add('animating');

        intervalId = setInterval(() => {
            let displayedText = '';
            for (let i = 0; i < originalName.length; i++) {
                if (i < iteration) {
                    displayedText += originalName[i];
                } else {
                    displayedText += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            nameHighlight.innerText = displayedText;
            
            if(iteration >= originalName.length){
                clearInterval(intervalId);
                nameHighlight.classList.remove('animating');
                nameHighlight.innerText = originalName; // Ensure final name is correct
                setTimeout(() => {
                    nameHighlight.classList.add('mosaic');
                }, 500);
            }
            
            iteration += 1 / 10; // Slower animation
        }, 100); // Slower interval
    }

    runRouletteAnimation();

    // Sidebar
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Sidebar Time Display
    const sidebarTimeDisplay = document.getElementById('sidebar-time-display');

    function updateSidebarTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        sidebarTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateSidebarTime, 1000);
    updateSidebarTime();

    // Music Player
    const musicList = [
        {title: 'ame', src: '../Music/ame.mp3'},
        {title: 'Heart', src: '../Music/Heart.mp3'},
        {title: 'La nuit', src: '../Music/La nuit.mp3'},
        {title: 'Time to Start Another Day', src: '../Music/Time to Start Another Day.mp3'},
        {title: 'Triste', src: '../Music/Triste.mp3'},
        {title: 'watercity', src: '../Music/watercity.mp3'}
    ];

    let currentMusicIdx = 3; 
    const audioPlayer = document.getElementById('sidebar-audio-player');
    const musicTitle = document.getElementById('sidebar-music-title');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const volDownBtn = document.getElementById('sidebar-vol-down');
    const volUpBtn = document.getElementById('sidebar-vol-up');
    const volValue = document.getElementById('sidebar-vol-value');

    function updateMusicInfo() {
        musicTitle.textContent = musicList[currentMusicIdx].title;
        audioPlayer.src = musicList[currentMusicIdx].src;
    }

    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            toggleBtn.textContent = '❚❚';
        } else {
            audioPlayer.pause();
            toggleBtn.textContent = '▶';
        }
    }

    function updateVolumeDisplay() {
        volValue.textContent = `${Math.round(audioPlayer.volume * 100)}%`;
    }

    musicTitle.addEventListener('click', () => {
        currentMusicIdx = (currentMusicIdx + 1) % musicList.length;
        updateMusicInfo();
        if (toggleBtn.textContent === '❚❚') {
            audioPlayer.play();
        }
    });

    toggleBtn.addEventListener('click', togglePlay);

    volDownBtn.addEventListener('click', () => {
        audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
        updateVolumeDisplay();
    });

    volUpBtn.addEventListener('click', () => {
        audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
        updateVolumeDisplay();
    });

    updateMusicInfo();
    updateVolumeDisplay();
    audioPlayer.volume = 0.5;

    // Mouse Icon Animation
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

    image.onload = () => {
        console.log("Ditto image loaded successfully.");
        requestAnimationFrame(loop);
    };

    image.onerror = () => {
        console.error("Failed to load Ditto image at: " + image.src);
    };

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
    const SCALE = 0.25; 
    let isFlipped = false;

    // Initialize animations after image loads
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

      if (currentAnim && image.complete && image.naturalHeight !== 0) {
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
      }

      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Fractal Background Animation
    const bgCanvas = document.getElementById('background-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let width, height;
    let lastScrollY = window.scrollY;

    function setupBgCanvas() {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
        bgCtx.clearRect(0, 0, width, height);
        drawFractal(); // Initial draw
    }

    function drawBranch(x, y, len, angle, branchWidth, currentScrollY) {
        bgCtx.beginPath();
        bgCtx.save();
        
        const hue = 180 + (currentScrollY / 10); // Hue changes with scroll
        const gradient = bgCtx.createLinearGradient(0, 0, 0, -len);
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue + 40}, 100%, 70%)`);

        bgCtx.strokeStyle = gradient;
        bgCtx.lineWidth = branchWidth;
        bgCtx.translate(x, y);
        bgCtx.rotate(angle * Math.PI / 180);
        bgCtx.moveTo(0, 0);
        bgCtx.lineTo(0, -len);
        bgCtx.stroke();

        if (len < 8) {
            bgCtx.restore();
            return;
        }

        // Wave effect based on scroll
        const wave = Math.sin(currentScrollY * 0.005) * (len * 0.1);

        drawBranch(0, -len, len * 0.85, angle + wave, branchWidth * 0.8, currentScrollY);
        drawBranch(0, -len, len * 0.85, angle - wave, branchWidth * 0.8, currentScrollY);

        bgCtx.restore();
    }

    function drawFractal() {
        const currentScrollY = window.scrollY;
        bgCtx.clearRect(0, 0, width, height);
        
        // Draw multiple branches from the bottom to make it wider
        const initialLength = height / 8; // Shorter branches
        const branches = 7; // More branches for wider spread
        for (let i = 0; i < branches; i++) {
            const startX = (width / (branches + 1)) * (i + 1);
            drawBranch(startX, height, initialLength, -90, 8, currentScrollY);
        }
    }

    window.addEventListener('scroll', () => {
        // Only redraw if scroll position has changed significantly to avoid excessive redraws
        if (Math.abs(window.scrollY - lastScrollY) > 5) {
            requestAnimationFrame(drawFractal);
            lastScrollY = window.scrollY;
        }
    });

    window.addEventListener('resize', setupBgCanvas);

    setupBgCanvas();
    drawFractal(); // Initial draw

    // Scroll Animation (Intersection Observer)
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once it's animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});