// Firebase Realtime Database 설정 (대안)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, off, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCX4UnbgXgNmp222eBwklrTOR_1Rpt5wRY",
  authDomain: "mydev-8fbc7.firebaseapp.com",
  projectId: "mydev-8fbc7",
  storageBucket: "mydev-8fbc7.firebasestorage.app",
  messagingSenderId: "427584699133",
  appId: "1:427584699133:web:0283abe93ceb68f2761c94",
  measurementId: "G-JCTXPS0LSH",
  databaseURL: "https://mydev-8fbc7-default-rtdb.firebaseio.com" // Realtime Database URL
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// 전역으로 내보내기
window.firebaseAuth = auth;
window.firebaseDB = database; // Realtime Database
window.firebaseAnalytics = analytics;

console.log('Firebase Realtime Database 초기화 완료'); 