import { getDoc, setDoc, doc, serverTimestamp, collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

  async playSlot() {
    if (!this.user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const currentStars = await this.getCurrentUserStars();
    if (currentStars < 100) {
      alert('별가루가 부족합니다.');
      return;
    }
    await this.setCurrentUserStars(currentStars - 100);

    const emojis = ['🌟', '💎', '💖', '🍀', '🔔', '🎁'];
    const result = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const counts = result.reduce((acc, emoji) => ({ ...acc, [emoji]: (acc[emoji] || 0) + 1 }), {});
    const maxCount = Math.max(...Object.values(counts));
    let reward = 0;
    if (maxCount === 2) reward = 200;
    if (maxCount === 3) reward = 500;

    if (reward > 0) {
      await this.setCurrentUserStars(await this.getCurrentUserStars() + reward);
    }

    // UI 업데이트 로직은 main.js에서 처리
    document.dispatchEvent(new CustomEvent('slotPlayed', { detail: { result, reward } }));
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