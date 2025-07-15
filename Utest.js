// 유사도(성향) 테스트 모듈 (star-system.js 필요)
// 사용 전: import { StarSystem } from './star-system.js';

class UTest {
  constructor(starSystem, quizData) {
    this.starSystem = starSystem;
    this.quiz = quizData;
    this.quizShuffled = [];
    this.current = 0;
    this.score = 0;
    this.isLoading = false;
  }

  // 퀴즈 시작
  startQuiz() {
    this.quizShuffled = this.shuffle([...this.quiz]).slice(0, 10);
    this.current = 0;
    this.score = 0;
    this.showQuestion();
  }

  // Fisher-Yates shuffle
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 질문 표시
  showQuestion() {
    if (this.current >= this.quizShuffled.length) {
      this.showResult();
      return;
    }
    const q = this.quizShuffled[this.current];
    const qBox = document.getElementById('utest-question');
    const optBox = document.getElementById('utest-options');
    const progBox = document.getElementById('utest-progress');
    if (!qBox || !optBox || !progBox) return;
    qBox.textContent = q.question;
    progBox.textContent = `${this.current + 1} / ${this.quizShuffled.length}`;
    optBox.innerHTML = '';
    q.options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.className = 'utest-btn';
      btn.onclick = () => {
        if (Array.isArray(q.answer) && q.answer.includes(option)) {
          this.score++;
        }
        this.current++;
        this.showQuestion();
      };
      optBox.appendChild(btn);
    });
  }

  // 결과 표시
  async showResult() {
    const percent = Math.round((this.score / this.quizShuffled.length) * 100);
    const resultBox = document.getElementById('utest-result');
    if (!resultBox) return;
    let resultMsg = '으으음 ...';
    if (percent <= 20) resultMsg = '저희 서로 배울 점이 있겠네요.';
    else if (percent <= 40) resultMsg = '딱 평균이네요!';
    else if (percent <= 60) resultMsg = '으으음 ...';
    else if (percent <= 80) resultMsg = '오 ..?';
    else if (percent <= 90) resultMsg = '어라 ?';
    else if (percent <= 100) resultMsg = '이럴 순 없는거야.';
    resultBox.innerHTML = `<div style="font-size:1.2em; font-weight:bold; margin-bottom:8px;">${resultMsg}</div><div>유사도: ${percent}%</div>`;
    // 100% 달성 시 별가루 보상
    if (percent === 100) {
      try {
        let stars = await this.starSystem.getCurrentUserStars();
        await this.starSystem.setCurrentUserStars(stars + 1000);
        resultBox.innerHTML += `<div style="color:#2a6fa1; margin-top:8px;">축하합니다! 유사도 100% 달성으로 별가루 1000개를 획득했습니다.</div>`;
      } catch (e) {
        resultBox.innerHTML += `<div style="color:#d9534f; margin-top:8px;">별가루 지급 오류: ${e.message}</div>`;
      }
    }
    // 다시하기 버튼
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '다시하기';
    retryBtn.className = 'utest-btn';
    retryBtn.onclick = () => this.startQuiz();
    resultBox.appendChild(retryBtn);
  }
}

// 전역 등록 (필요시)
window.UTest = UTest;