// 인증/익명/닉네임 관리 전용 모듈
// Firebase Auth, Firestore를 외부에서 주입받아 사용
// 예시: import { firebaseAuth, firebaseDB } from './firebase-config.js';

export class AuthSystem {
  constructor({ auth, db }) {
    this.auth = auth; // firebaseAuth
    this.db = db;     // firebaseDB
    this.user = null; // 현재 로그인 유저
    this.anonymousUser = null; // 익명 참여 정보
    this.userName = '';
    this._listeners = [];
    this._initAuthListener();
  }

  _initAuthListener() {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(this.auth, async (user) => {
        this.user = user;
        if (user) {
          // Firestore에서 userName 동기화
          const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
          const userRef = doc(this.db, 'users', user.uid);
          const snap = await getDoc(userRef);
          this.userName = snap.exists() && snap.data().userName ? snap.data().userName : (user.email?.split('@')[0] || '익명');
          this.anonymousUser = null;
        } else {
          // 익명 정보 localStorage에서 복원
          const saved = localStorage.getItem('anonymousUser');
          if (saved) {
            this.anonymousUser = JSON.parse(saved);
            this.userName = this.anonymousUser.name;
          } else {
            this.anonymousUser = null;
            this.userName = '';
          }
        }
        this._listeners.forEach(cb => cb(this.getCurrentUser()));
      });
    });
  }

  // 인증 상태 감지 및 콜백 등록
  onAuthStateChanged(callback) {
    this._listeners.push(callback);
    // 즉시 1회 호출
    callback(this.getCurrentUser());
  }

  // 현재 사용자 정보 반환
  getCurrentUser() {
    if (this.user) {
      return { uid: this.user.uid, email: this.user.email, userName: this.userName, isAnonymous: false };
    } else if (this.anonymousUser) {
      return { uid: this.anonymousUser.uid, userName: this.anonymousUser.name, isAnonymous: true };
    } else {
      return null;
    }
  }

  // 이메일/비밀번호 회원가입
  async signupWithEmail(email, password, userName) {
    const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    const { setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.db, 'users', userCredential.user.uid), {
      userName,
      email,
      stars: 500,
      lastAttendance: new Date(),
      inventory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    // 상태 갱신은 onAuthStateChanged에서 자동 처리
  }

  // 이메일/비밀번호 로그인
  async loginWithEmail(email, password) {
    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    await signInWithEmailAndPassword(this.auth, email, password);
    // 상태 갱신은 onAuthStateChanged에서 자동 처리
  }

  // 익명 참여(닉네임 입력)
  async joinAnonymously(name) {
    const uid = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    this.anonymousUser = { uid, name, isAnonymous: true };
    localStorage.setItem('anonymousUser', JSON.stringify(this.anonymousUser));
    this.user = null;
    this.userName = name;
    // Firestore에 익명 사용자 정보 저장 (필수 필드 포함)
    const { setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    await setDoc(doc(this.db, 'users', uid), {
      userName: name,
      email: null,
      stars: 500,
      lastAttendance: new Date(),
      inventory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    this._listeners.forEach(cb => cb(this.getCurrentUser()));
  }

  // 닉네임 변경/저장
  async updateUserName(newName) {
    if (this.user) {
      const { setDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      await setDoc(doc(this.db, 'users', this.user.uid), {
        userName: newName,
        updatedAt: serverTimestamp()
      }, { merge: true });
      this.userName = newName;
    } else if (this.anonymousUser) {
      this.anonymousUser.name = newName;
      this.userName = newName;
      localStorage.setItem('anonymousUser', JSON.stringify(this.anonymousUser));
    }
    this._listeners.forEach(cb => cb(this.getCurrentUser()));
  }

  // 로그아웃
  async logout() {
    if (this.user) {
      const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      await signOut(this.auth);
    } else if (this.anonymousUser) {
      localStorage.removeItem('anonymousUser');
      this.anonymousUser = null;
      this.userName = '';
      this._listeners.forEach(cb => cb(this.getCurrentUser()));
    }
  }
}

// 싱글턴 인스턴스 예시 (필요시)
// export const authSystem = new AuthSystem({ auth: firebaseAuth, db: firebaseDB }); 