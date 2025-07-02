document.addEventListener('DOMContentLoaded', () => {

    // Name Animation
    const nameHighlight = document.getElementById('name-highlight');
    const originalName = '김현우';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let intervalId = null;

    function runRouletteAnimation() {
        let iteration = 0;
        clearInterval(intervalId);

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
                setTimeout(() => {
                    nameHighlight.classList.add('mosaic');
                }, 500); // 모자이크 효과 전에 잠시 대기
            }
            
            iteration += 1 / 3;
        }, 40);
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
        audioPlayer.play();
        toggleBtn.textContent = '❚❚';
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

    // Initial setup
    updateMusicInfo();
    updateVolumeDisplay();
    audioPlayer.volume = 0.5;
});