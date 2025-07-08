# Developer Portfolio with Real-time Chat

개발자 포트폴리오 웹사이트와 실시간 채팅 기능이 포함된 프로젝트입니다.

## 🚀 Features

### Portfolio Features
- **반응형 디자인** - 모든 디바이스에서 최적화
- **인터랙티브 애니메이션** - Fractal 배경, 마우스 추적 애니메이션
- **음악 플레이어** - 배경 음악 재생 및 컨트롤
- **프로젝트 갤러리** - 프로젝트 카드 형태로 표시
- **다국어 지원** - 한국어/영어 전환
- **프로필 이미지** - 자동 변경 및 클릭 시 수동 변경
- **도서 리스트** - 토글 가능한 도서 목록
- **유사도 테스트** - 별도 페이지로 이동
- **메뉴 룰렛** - 랜덤 메뉴 추천

### Real-time Chat Features
- **Firebase 기반 실시간 채팅**
- **이메일/비밀번호 로그인/회원가입**
- **익명 채팅** - 로그인 없이 임시 사용자명으로 참여
- **실시간 메시지 동기화**
- **사용자 구분** - 로그인 사용자 vs 익명 사용자
- **로컬 스토리지** - 익명 사용자 정보 저장

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: GitHub Pages
- **Animation**: Canvas API, CSS Animations
- **Real-time**: Firebase Realtime Database

## 📁 Project Structure

```
mydev/
├── index.html          # 메인 페이지
├── style.css           # 스타일시트
├── main.js             # 메인 JavaScript
├── firebase-config.js  # Firebase 설정
├── chat-auth.js        # 채팅 및 인증 기능
├── fractal-bg.js       # Fractal 배경 애니메이션
├── mouse-animation.js  # 마우스 추적 애니메이션
├── Utest.html          # 유사도 테스트 페이지
├── Utest.js            # 유사도 테스트 로직
├── assets/             # 이미지 파일들
│   ├── profile.jpg
│   ├── ditto.png
│   └── profiles/       # 프로필 이미지들
└── Music/              # 음악 파일들
```

## 🚀 Deployment

이 프로젝트는 GitHub Pages를 통해 자동 배포됩니다.

### 배포 URL
- **Live Site**: https://[username].github.io/[repository-name]/

### 배포 과정
1. `main` 브랜치에 푸시
2. GitHub Actions가 자동으로 빌드 및 배포
3. `mydev/` 폴더의 내용이 웹사이트 루트로 배포

## 🔧 Setup

### 로컬 개발
1. 레포지토리 클론
```bash
git clone https://github.com/[username]/[repository-name].git
cd [repository-name]
```

2. 로컬 서버 실행 (예: Live Server VS Code 확장)

### Firebase 설정
1. Firebase 프로젝트 생성
2. Authentication 및 Firestore 활성화
3. `firebase-config.js`에서 설정 정보 업데이트

## 📱 Usage

### 채팅 사용법
1. **익명 참여**: "익명 참여" 버튼 → 사용자명 입력
2. **로그인**: "로그인" 버튼 → 이메일/비밀번호 입력
3. **메시지 전송**: Enter 키 또는 "전송" 버튼
4. **이름 변경**: 익명 사용자일 때 "이름 변경" 버튼

### 기타 기능
- **음악 제어**: 재생/일시정지, 볼륨 조절
- **언어 전환**: "한/영" 버튼으로 한국어/영어 전환
- **프로필 이미지**: 클릭 시 수동 변경
- **메뉴 룰렛**: "Click" 버튼으로 랜덤 메뉴 추천

## 🔒 Security

- Firebase 보안 규칙 설정
- XSS 방지를 위한 HTML 이스케이프
- 입력값 검증 및 에러 처리

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hyunwoo Kim**
- GitHub: [@rlagusdn04](https://github.com/rlagusdn04)
- Contact: [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfi7yeiuG8aclcmjbJfaC9IQCEMG7pgETjJegav4-szazgNuw/viewform?usp=header) 