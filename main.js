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
            nameHighlight.innerText = originalName.split('')
                .map((letter, index) => {
                    if(index < iteration) {
                        return originalName[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)]
                })
                .join('');
            
            if(iteration >= originalName.length){
                clearInterval(intervalId);
                nameHighlight.classList.remove('animating');
                nameHighlight.innerText = originalName; // Ensure final name is correct
                setTimeout(() => {
                    nameHighlight.classList.add('mosaic');
                }, 500);
            }
            
            iteration += 1 / 10;
        }, 100);
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

    let lastTime = 0;
    const SCALE = 0.25; 

    image.onload = () => {
      requestAnimationFrame(loop);
    };

    function loop(timestamp) {
      const dt = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = 128 * SCALE;
      const h = 128 * SCALE;
      let x = mouseX - w / 2;
      let y = mouseY - h / 2;

      ctx.drawImage(image, x, y, w, h);

      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
});