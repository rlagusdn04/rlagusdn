// Firebase App 및 서비스 초기화 (가장 먼저 로드되어야 함)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

(function initFirebase() {
  if (window.firebaseApp && window.firebaseAuth && window.firebaseDB) {
    console.log("Firebase 이미 초기화됨");
    return;
  }
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyCX4UnbgXgNmp222eBwklrTOR_1Rpt5wRY",
      authDomain: "mydev-8fbc7.firebaseapp.com",
      databaseURL: "https://mydev-8fbc7-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "mydev-8fbc7",
      storageBucket: "mydev-8fbc7.firebasestorage.app",
      messagingSenderId: "427584699133",
      appId: "1:427584699133:web:0283abe93ceb68f2761c94",
      measurementId: "G-JCTXPS0LSH"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const analytics = getAnalytics(app);
    window.firebaseApp = app;
    window.firebaseAuth = auth;
    window.firebaseDB = db;
    window.firebaseAnalytics = analytics;
    console.log("Firebase 초기화 완료:");
    console.log("- Auth:", !!auth);
    console.log("- Firestore:", !!db);
    console.log("- Analytics:", !!analytics);
  } catch (e) {
    console.error("Firebase 초기화 실패:", e);
    alert("Firebase 초기화에 실패했습니다. 콘솔을 확인하세요.");
  }
})();