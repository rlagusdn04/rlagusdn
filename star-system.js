// 필요한 곳에서 동적 import 사용 예시:
// await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ getDoc, setDoc, doc, serverTimestamp, collection, query, orderBy, onSnapshot }) => { ... });

// 별가루/유저 관리 시스템 (Firestore users/{uid} 기반)
export class StarSystem {
  constructor({ auth, db }) {
    this.auth = auth; // firebaseAuth
    this.db = db;     // firebaseDB
    this.user = null; // 현재 로그인 유저
    // 인증 상태 변화 감지 (onAuthStateChanged 등에서 setUser 호출 필요)
  }

  // 인증된 유저 정보 설정
  setUser(user) {
    this.user = user;
  }

  // Firestore users/{uid} 문서 참조 반환
  getUserRef() {
    if (!this.user || !this.user.uid) throw new Error('로그인 필요');
    return [this.db, 'users', this.user.uid];
  }

  // 별가루 잔고 읽기
  async getCurrentUserStars() {
    const [db, col, uid] = this.getUserRef();
    const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const snap = await getDoc(doc(db, col, uid));
    const data = snap.exists() ? snap.data() : {};
    return (typeof data.stars === 'number') ? data.stars : 0;
  }

  // 별가루 잔고 저장
  async setCurrentUserStars(newStars) {
    const [db, col, uid] = this.getUserRef();
    const { setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    newStars = Math.max(0, Number(newStars) || 0);
    await setDoc(doc(db, col, uid), {
      stars: newStars,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return newStars;
  }

  // 유저 프로필 읽기 (userName, email, stars 등)
  async getUserProfile() {
    const [db, col, uid] = this.getUserRef();
    const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const snap = await getDoc(doc(db, col, uid));
    return snap.exists() ? snap.data() : null;
  }

  // 유저 프로필 저장 (userName, email 등)
  async setUserProfile(profile) {
    const [db, col, uid] = this.getUserRef();
    const { setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    await setDoc(doc(db, col, uid), {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  // 유저 프로필 필수 필드 보정/동기화 (최초 가입/로그인 시)
  async syncUserProfile() {
    const [db, col, uid] = this.getUserRef();
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(db, col, uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let changed = false;
    // userName 보정
    let userName = data.userName;
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      userName = this.user.displayName || this.user.email?.split('@')[0] || `사용자${uid.slice(-4)}`;
      changed = true;
    }
    // stars 보정
    let stars = (typeof data.stars === 'number') ? data.stars : 500; // 첫 가입 500
    if (typeof data.stars !== 'number') changed = true;
    // Firestore에 필드 보정
    if (changed) {
      await setDoc(userRef, {
        userName,
        stars,
        email: this.user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    return { userName, stars };
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