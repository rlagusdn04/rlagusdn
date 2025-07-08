// 별가루(스타) 시스템 통합 모듈
// 출석, 슬롯머신, 낚시, 기부, 랭킹, Firestore 동기화, 인증 체크 등 모든 별가루 관련 로직을 이 파일에서 관리합니다.

// Firebase 관련 객체는 외부에서 주입(import)받아 사용합니다.
// 예시: import { firebaseAuth, firebaseDB } from './firebase-config.js';

export class StarSystem {
  constructor({ auth, db }) {
    this.auth = auth; // firebaseAuth
    this.db = db;     // firebaseDB
    this.user = null; // 현재 로그인 유저
    this.stars = 0;   // 별가루 잔고
    this.lastAttendance = null; // 출석 정보
    this.inventory = []; // 낚시 등 아이템 인벤토리
    this.donation = 0; // 누적 기부
    this.userName = ''; // 사용자 이름
    this.onAttendanceRewarded = null; // 출석 보상 지급 콜백
    // ... 기타 상태
  }

  // 인증 상태 감지 및 초기화
  initAuthListener() {
    if (!this.auth) throw new Error('Firebase Auth 인스턴스가 필요합니다.');
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(this.auth, async (user) => {
        this.user = user;
        if (user) {
          // Firestore에서 사용자 정보 동기화 및 필드 보정
          await this.syncUserProfile();
          // 출석 보상 지급
          await this.handleAttendanceReward();
        }
      });
    });
  }

  // Firestore users/{uid}에 userName, stars, lastAttendance 필드가 항상 존재하도록 보정
  async syncUserProfile() {
    if (!this.user || !this.db) return;
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let changed = false;
    // userName 보정
    let userName = data.userName;
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      userName = this.user.displayName || this.user.email?.split('@')[0] || `사용자${this.user.uid.slice(-4)}`;
      changed = true;
    }
    // stars 보정
    let stars = (typeof data.stars === 'number') ? data.stars : 500; // 첫 가입 500
    if (typeof data.stars !== 'number') changed = true;
    // lastAttendance 보정
    let today = new Date();
    today.setHours(0,0,0,0);
    let lastAttendance = data.lastAttendance ? new Date(data.lastAttendance.seconds ? data.lastAttendance.seconds * 1000 : data.lastAttendance) : null;
    if (!lastAttendance) changed = true;
    // Firestore에 필드 보정
    if (changed) {
      await setDoc(userRef, {
        userName,
        stars,
        lastAttendance: lastAttendance || today,
        email: this.user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    this.stars = stars;
    this.lastAttendance = lastAttendance || today;
    this.userName = userName;
  }

  // 출석 보상 지급 (오늘 첫 출석이면 100 별가루, 첫 가입시 500 별가루는 syncUserProfile에서 처리)
  async handleAttendanceReward() {
    if (!this.user || !this.db) return;
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let today = new Date();
    today.setHours(0,0,0,0);
    let lastAttendance = data.lastAttendance ? new Date(data.lastAttendance.seconds ? data.lastAttendance.seconds * 1000 : data.lastAttendance) : null;
    let stars = (typeof data.stars === 'number') ? data.stars : 500;
    // 오늘 첫 출석이면 100 별가루 지급
    let reward = 0;
    if (!lastAttendance || lastAttendance < today) {
      stars += 100;
      reward = 100;
      await setDoc(userRef, {
        stars,
        lastAttendance: today,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    this.stars = stars;
    this.lastAttendance = today;
    if (reward > 0 && typeof this.onAttendanceRewarded === 'function') {
      this.onAttendanceRewarded(reward, stars);
    }
  }

  // 별가루 잔고 Firestore에서 불러오기/저장
  async fetchStars() {
    // Firestore users/{uid}에서 stars 필드 읽기
  }
  async setStars(newStars) {
    // Firestore users/{uid}에 stars 필드 저장
  }

  // 슬롯머신 플레이
  /**
   * @param {Object} opts
   * @param {number} opts.betAmount - 슬롯머신 1회당 소모 별가루(예: 100)
   * @returns {Promise<{result: number[], matchCount: number, reward: number, stars: number}>}
   */
  async playSlot({ betAmount = 100 } = {}) {
    if (!this.user || !this.db) throw new Error('로그인 필요');
    if (typeof betAmount !== 'number' || betAmount <= 0) throw new Error('베팅 금액 오류');
    // 별가루 잔고 확인
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let stars = (typeof data.stars === 'number') ? data.stars : 0;
    if (stars < betAmount) throw new Error('별가루 부족');
    // 슬롯 결과(0~4 중 3개)
    const result = [0,0,0].map(() => Math.floor(Math.random()*5));
    // 일치 개수 계산
    const counts = {};
    result.forEach(n => { counts[n] = (counts[n]||0)+1; });
    const matchCount = Math.max(...Object.values(counts));
    // 보상 계산
    let reward = 0;
    if (matchCount === 2) reward = 100;
    else if (matchCount === 3) reward = 200;
    // 별가루 차감/지급
    stars = stars - betAmount + reward;
    await setDoc(userRef, {
      stars,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    this.stars = stars;
    if (typeof this.onStarsChanged === 'function') this.onStarsChanged(stars);
    return { result, matchCount, reward, stars };
  }

  /**
   * 낚시 플레이
   * @param {Object} opts
   * @param {number} opts.toolLevel - 낚싯대 레벨(기본 1)
   * @returns {Promise<{fish: object, stars: number, inventory: object[]}>}
   */
  async playFishing({ toolLevel = 1 } = {}) {
    if (!this.user || !this.db) throw new Error('로그인 필요');
    const FISH_TYPES = [
      { name: '붕어', rarity: 'common', multiplier: 1 },
      { name: '잉어', rarity: 'common', multiplier: 1.2 },
      { name: '송사리', rarity: 'common', multiplier: 0.8 },
      { name: '황금잉어', rarity: 'rare', multiplier: 2.5 },
      { name: '비단잉어', rarity: 'rare', multiplier: 2 },
      { name: '전설의 물고기', rarity: 'legend', multiplier: 5 }
    ];
    const COST = 50 * toolLevel;
    // Firestore에서 별가루/인벤토리 불러오기
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let stars = (typeof data.stars === 'number') ? data.stars : 0;
    let inventory = Array.isArray(data.inventory) ? data.inventory : [];
    if (stars < COST) throw new Error('별가루 부족');
    // 랜덤 대기시간/확률로 물고기 결정
    let rarityRoll = Math.random();
    let fishType;
    if (toolLevel >= 3 && Math.random() < 0.2) {
      // 고레벨 낚싯대 전설/희귀 확률 증가
      fishType = rarityRoll < 0.2 ? FISH_TYPES[5] : (rarityRoll < 0.5 ? FISH_TYPES[3] : FISH_TYPES[1]);
    } else if (rarityRoll < 0.03) {
      fishType = FISH_TYPES[5]; // 전설
    } else if (rarityRoll < 0.15) {
      fishType = FISH_TYPES[3 + Math.floor(Math.random() * 2)]; // 희귀
    } else {
      fishType = FISH_TYPES[Math.floor(Math.random() * 3)]; // 일반
    }
    // 크기 결정
    let minSize = 10, maxSize = 100;
    if (fishType.rarity === 'legend') minSize = 80, maxSize = 150;
    else if (fishType.rarity === 'rare') minSize = 40, maxSize = 120;
    const size = Math.round(Math.random() * (maxSize - minSize) + minSize);
    const fish = { ...fishType, size, caughtAt: Date.now() };
    // 인벤토리 추가
    inventory.push(fish);
    // 별가루 차감
    stars -= COST;
    await setDoc(userRef, {
      stars,
      inventory,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    this.stars = stars;
    this.inventory = inventory;
    if (typeof this.onStarsChanged === 'function') this.onStarsChanged(stars);
    return { fish, stars, inventory };
  }

  /**
   * 인벤토리(물고기) 판매
   * @returns {Promise<{earned: number, stars: number, inventory: object[]}>}
   */
  async sellItems() {
    if (!this.user || !this.db) throw new Error('로그인 필요');
    const { getDoc, setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userRef = doc(this.db, 'users', this.user.uid);
    const snap = await getDoc(userRef);
    let data = snap.exists() ? snap.data() : {};
    let stars = (typeof data.stars === 'number') ? data.stars : 0;
    let inventory = Array.isArray(data.inventory) ? data.inventory : [];
    let earned = 0;
    inventory.forEach(f => { earned += Math.round(f.size * f.multiplier); });
    stars += earned;
    inventory = [];
    await setDoc(userRef, {
      stars,
      inventory,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    this.stars = stars;
    this.inventory = inventory;
    if (typeof this.onStarsChanged === 'function') this.onStarsChanged(stars);
    return { earned, stars, inventory };
  }

  /**
   * 별가루 기부
   * @param {number} amount - 기부할 별가루
   * @returns {Promise<{amount: number, totalDonation: number, stars: number}>}
   */
  async donateStars(amount) {
    if (!this.user || !this.db) throw new Error('로그인 필요');
    if (typeof amount !== 'number' || amount <= 0) throw new Error('기부 금액 오류');
    const { getDoc, setDoc, doc, serverTimestamp, increment } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    // 별가루 차감
    const userRef = doc(this.db, 'users', this.user.uid);
    const userSnap = await getDoc(userRef);
    let userData = userSnap.exists() ? userSnap.data() : {};
    let stars = (typeof userData.stars === 'number') ? userData.stars : 0;
    if (stars < amount) throw new Error('별가루 부족');
    stars -= amount;
    await setDoc(userRef, { stars, updatedAt: serverTimestamp() }, { merge: true });
    this.stars = stars;
    if (typeof this.onStarsChanged === 'function') this.onStarsChanged(stars);
    // donation-ranking/{uid}에 누적 합산
    const rankRef = doc(this.db, 'donation-ranking', this.user.uid);
    const rankSnap = await getDoc(rankRef);
    let prevDonation = (rankSnap.exists() && typeof rankSnap.data().stars === 'number') ? rankSnap.data().stars : 0;
    let totalDonation = prevDonation + amount;
    await setDoc(rankRef, {
      stars: totalDonation,
      userName: this.userName,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    this.donation = totalDonation;
    return { amount, totalDonation, stars };
  }

  /**
   * 기부 랭킹 실시간 구독
   * @param {Object} opts
   * @param {number} opts.limit - 상위 몇 명까지 (기본 10)
   * @param {function} opts.onUpdate - 랭킹 데이터 변경 시 호출될 콜백 (users 배열)
   * @returns {function} unsubscribe 함수
   */
  fetchRanking({ limit = 10, onUpdate }) {
    if (!this.db) throw new Error('Firestore DB 필요');
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ collection, query, orderBy, limit: qLimit, onSnapshot }) => {
      const q = query(
        collection(this.db, 'donation-ranking'),
        orderBy('stars', 'desc'),
        qLimit(limit)
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        const users = [];
        snap.forEach(doc => {
          const data = doc.data();
          users.push({
            uid: doc.id,
            userName: data.userName,
            stars: data.stars
          });
        });
        if (typeof onUpdate === 'function') onUpdate(users);
      });
      this._rankingUnsub = unsubscribe;
    });
    // 구독 해제 함수 반환
    return () => {
      if (this._rankingUnsub) this._rankingUnsub();
    };
  }

  // UI 업데이트 함수 (별도 바인딩)
  onStarsChanged(callback) {
    // 별가루 잔고 변경 시 호출될 콜백 등록
  }
  // ... 기타 UI/이벤트 바인딩 함수
}

// 싱글턴 인스턴스 생성 예시 (필요시)
// export const starSystem = new StarSystem({ auth: firebaseAuth, db: firebaseDB }); 