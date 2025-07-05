// Firebase 설정 및 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
const analytics = getAnalytics(app);

// 전역으로 내보내기
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseAnalytics = analytics; 