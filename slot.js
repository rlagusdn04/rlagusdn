// 슬롯머신(룰렛) 게임 모듈 (star-system.js 필요)
// 사용 전: import { StarSystem } from './star-system.js';

class SlotMachine {
  constructor(starSystem) {
    this.starSystem = starSystem;
    this.isLoading = false;
    this.slotEmojis = ['🫨','😡','😮‍💨','🤗','🤔','🤭','🥺'];
  }

  // 슬롯머신 플레이
  async play() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const COST = 50;
      let stars = await this.starSystem.getCurrentUserStars();
      if (stars < COST) {
        alert('별가루가 부족합니다!');
        return { result: [], match: 0, reward: 0, stars };
      }
      // 슬롯 결과(이모티콘 3개)
      const result = [0,0,0].map(() => this.slotEmojis[Math.floor(Math.random()*this.slotEmojis.length)]);
      // 일치 개수 계산
      const counts = {};
      result.forEach(e => { counts[e] = (counts[e]||0)+1; });
      const match = Math.max(...Object.values(counts));
      // 보상 계산
      let reward = 0;
      if (match === 2) reward = 100;
      else if (match === 3) reward = 300;
      stars = stars - COST + reward;
      await this.starSystem.setCurrentUserStars(stars);
      return { result, match, reward, stars };
    } catch (e) {
      alert('슬롯머신 오류: ' + e.message);
      return { result: [], match: 0, reward: 0, stars: 0 };
    } finally {
      this.isLoading = false;
    }
  }
}

// 전역 등록 (필요시)
window.SlotMachine = SlotMachine; 