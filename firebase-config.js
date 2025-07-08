// Firebase App 및 서비스 초기화 (가장 먼저 로드되어야 함)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

(function initFirebase() {
  if (window.firebaseApp && window.firebaseAuth && window.firebaseDB) {
    console.log("Firebase 이미 초기화됨");
    return;
  }
  try {
    const firebaseConfig = {
      // TODO: 실제 프로젝트의 Firebase 설정으로 교체
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    window.firebaseApp = app;
    window.firebaseAuth = auth;
    window.firebaseDB = db;
    console.log("Firebase 초기화 완료:");
    console.log("- Auth:", !!auth);
    console.log("- Firestore:", !!db);
  } catch (e) {
    console.error("Firebase 초기화 실패:", e);
    alert("Firebase 초기화에 실패했습니다. 콘솔을 확인하세요.");
  }
})();

// 전역으로 내보내기
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseAnalytics = analytics;

// 모듈로 내보내기
export { auth as firebaseAuth, db as firebaseDB, analytics as firebaseAnalytics };

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