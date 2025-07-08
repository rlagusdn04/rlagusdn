// 필요한 곳에서 동적 import 사용 예시:
// await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ getDoc, setDoc, doc, serverTimestamp, collection, query, orderBy, onSnapshot }) => { ... });

export class StarSystem {
  constructor({ auth, db }) {
    this.auth = auth;
    this.db = db;
    this.user = null;
    this.unsubscribeRanking = null;
    this._initAuthListener();
  }

  _initAuthListener() {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  async getCurrentUserStars() {
    if (!this.user) return 0;
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    return snap.exists() && snap.data().stars ? snap.data().stars : 0;
  }

  async setCurrentUserStars(stars) {
    if (!this.user) return;
    const userRef = doc(this.db, 'users', this.user.uid);
    await setDoc(userRef, { stars }, { merge: true });
  }

  /**
   * 슬롯머신 플레이
   * @returns {Promise<{result: string[], matchCount: number, reward: number, stars: number}>}
   */
  async playSlot() {
    if (!this.user || !this.db) throw new Error('로그인 필요');
    // 이모티콘 슬롯 배열
    const slotEmojis = ['🫨','😡','😮‍💨','🤗','🤔','🤭','🥺'];
    const COST = 50;
    // 별가루 잔고 확인
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let stars = (typeof data.stars === 'number') ? data.stars : 0;
    if (stars < COST) throw new Error('별가루 부족');
    // 슬롯 결과(이모티콘 3개)
    const result = [0,0,0].map(() => slotEmojis[Math.floor(Math.random()*slotEmojis.length)]);
    // 일치 개수 계산
    const counts = {};
    result.forEach(e => { counts[e] = (counts[e]||0)+1; });
    const matchCount = Math.max(...Object.values(counts));
    // 보상 계산
    let reward = 0;
    if (matchCount === 2) reward = 100;
    else if (matchCount === 3) reward = 300;
    // 별가루 차감/지급
    stars = stars - COST + reward;
    await setDoc(userRef, {
      stars,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    this.stars = stars;
    if (typeof this.onStarsChanged === 'function') this.onStarsChanged(stars);
    // UI 이벤트
    document.dispatchEvent(new CustomEvent('slotPlayed', { detail: { result, matchCount, reward, stars } }));
    return { result, matchCount, reward, stars };
  }

  async donate(amount) {
    if (!this.user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const currentStars = await this.getCurrentUserStars();
    if (currentStars < amount) {
      alert('보유한 별가루가 부족합니다.');
      return;
    }

    await this.setCurrentUserStars(currentStars - amount);

    const rankingRef = doc(this.db, 'donation-ranking', this.user.uid);
    const rankingSnap = await getDoc(rankingRef);
    const currentDonation = rankingSnap.exists() ? rankingSnap.data().donation : 0;

    await setDoc(rankingRef, {
      userName: this.user.displayName || '익명',
      donation: currentDonation + amount,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    alert(`${amount}개의 별가루를 기부했습니다!`);
    document.dispatchEvent(new Event('donationMade'));
  }

  subscribeToRanking(callback) {
    const q = query(collection(this.db, 'donation-ranking'), orderBy('donation', 'desc'));
    this.unsubscribeRanking = onSnapshot(q, (snapshot) => {
      const ranking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(ranking);
    });
  }

  unsubscribeFromRanking() {
    if (this.unsubscribeRanking) {
      this.unsubscribeRanking();
    }
  }
}