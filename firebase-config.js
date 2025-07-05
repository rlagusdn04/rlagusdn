// Firebase 설정 및 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCX4UnbgXgNmp222eBwklrTOR_1Rpt5wRY",
  authDomain: "mydev-8fbc7.firebaseapp.com",
  projectId: "mydev-8fbc7",
  storageBucket: "mydev-8fbc7.firebasestorage.app",
  messagingSenderId: "427584699133",
  appId: "1:427584699133:web:0283abe93ceb68f2761c94",
  measurementId: "G-JCTXPS0LSH"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore 설정 (성능 최적화)
const firestoreSettings = {
  cacheSizeBytes: 50 * 1024 * 1024, // 50MB 캐시
  experimentalForceLongPolling: true, // 긴 폴링 사용
  useFetchStreams: false // fetch streams 비활성화
};

// Firestore 설정 적용
db.settings(firestoreSettings);

const analytics = getAnalytics(app);

// 전역으로 내보내기
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseAnalytics = analytics;

// Firebase 초기화 확인
console.log('Firebase 초기화 완료:');
console.log('- Auth:', !!auth);
console.log('- Firestore:', !!db);
console.log('- Analytics:', !!analytics);

// Firebase 연결 상태 확인 함수
function checkFirebaseConnection() {
  console.log('Firebase 연결 상태 확인:');
  console.log('- Auth 객체:', !!window.firebaseAuth);
  console.log('- DB 객체:', !!window.firebaseDB);
  
  if (!window.firebaseAuth || !window.firebaseDB) {
    console.error('Firebase 객체가 초기화되지 않았습니다!');
    return false;
  }
  
  return true;
} 