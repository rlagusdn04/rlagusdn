// test/star-system.js와 동일한 구조로 생성
// ... (test/star-system.js 전체 복사) ... 
import { AuthSystem } from './auth-system.js';
import { firebaseAuth, firebaseDB } from './firebase-config.js';
const authSystem = new AuthSystem({ auth: firebaseAuth, db: firebaseDB });
// 인증/익명/닉네임 정보는 authSystem.getCurrentUser()만 사용
// 인증 상태 변경 시 별가루/재화 동기화 