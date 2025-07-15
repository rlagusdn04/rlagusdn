//import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const quiz = [
  {
    question: "추억을 떠올리는 감각은?",
    options: ["냄새", "소리", "촉각(온도, 질감)", "미각"],
    answer: ["촉각", "소리"]
  },
  {
    question: "가장 그리운 시절은?",
    options: ["걱정 없던 어린 시절", "자각 없이 지나간 어느 때", "후회가 많던 순간들", "지금 이 무렵"],
    answer: ["자각 없이 지나간 어느 때", "지금 이 무렵"]
  },
  {
    question: "당신이 누군가를 만날 때, 가장 중요하게 여기는 것은?",
    options: ["그 사람과 지적인 대화를 나눌 수 있는가", "감정적으로 서로를 완전히 이해할 수 있는가", "서로가 서로를 자유롭게 둘 수 있는가", "함께할 수 있는 미래를 상상할 수 있는가"],
    answer: ["함께할 수 있는 미래를 상상할 수 있는가"]
  },
  {
    question: "당신이 누군가를 만날 때, 가장 중요하게 여기는 것은?",
    options: ["그 사람과 지적인 대화를 나눌 수 있는가", "감정적으로 서로를 완전히 이해할 수 있는가", "서로가 서로를 자유롭게 둘 수 있는가", "함께할 수 있는 미래를 상상할 수 있는가"],
    answer: ["함께할 수 있는 미래를 상상할 수 있는가"]
  },
  {
    question: "좋아하는 날씨는?",
    options: ["맑음", "비", "눈", "흐림"],
    answer: ["맑음"]
  },
  {
    question: "선호하는 시간의 체감은?",
    options: ["여유로움", "뿌듯함", "자유로움", "일상적임"],
    answer: ["여유로움", "자유로움"]
  },
  {
    question: "편한 대화 상대는?",
    options: [
      "서로의 침묵도 편안한 사람",
      "활기차고 즐거운 분위기의 사람",
      "무슨 생각인지 알기 어려운 사람",
      "익숙하고 반복되는 이야기의 사람",
    ],
    answer: ["서로의 침묵도 편안한 사람", "무슨 생각인지 알기 어려운 사람"]
  },
  {
    question: "사람들이 당신을 볼 때 가장 자주 말하는 평가는?",
    options: ["깊이 있고 생각이 많은 사람", "따뜻하고 편안한 사람", "특이하고 독창적인 사람", "성실하고 책임감 있는 사람"],
    answer: ["깊이 있고 생각이 많은 사람", "특이하고 독창적인 사람"]
  },
  {
    question: "지쳤을 때 찾는 것은?",
    options: ["위로해줄 누군가", "치유받는 장소", "즐거움, 쾌락", "혼자만의 시간"],
    answer: ["혼자만의 시간", "치유받는 장소"]
  },
  {
    question: "지금 가장 필요한 감정은?",
    options: ["위로", "자극", "안정", "몰입"],
    answer: ["안정", "몰입"]
  },
  {
    question: "기억을 선명하게 만드는 것은?",
    options: ["감각", "사진", "익숙한 장소", "꿈"],
    answer: ["꿈", "감각"]
  },
  {
    question: "가장 좋아하는 계절은?",
    options: ["봄", "여름", "가을", "겨울"],
    answer: ["가을", "봄"]
  },
  {
    question: "당신의 이상적인 휴식은?",
    options: ["자연 속에서의 시간", "도시의 소음 속에서의 시간", "조용한 방 안에서의 시간", "사람들과의 소통"],
    answer: ["자연 속에서의 시간", "조용한 방 안에서의 시간"]
  },
  {
    question: "당신이 자주 가는 장소는?",
    options: ["노래방", "카페", "운동 시설", "도서관"],
    answer: ["노래방", "카페", "운동 시설", "도서관"]
  },
  {
    question: "글을 쓴다면",
    options: ["일기", "시", "소설", "편지"],
    answer: ["일기", "편지"]
  },
  {
    question: "당신은 '자기 자신'을 어떤 시선으로 바라보나요?",
    options: ["변화하는 존재, 스스로가 계속 바뀜", "타인과 함께 있을 때 진정한 내가 드러남", "독립적인 자아, 주변의 환경에 영향받지 않음", "바뀌고 싶지 않은 확고한 존재"],
    answer: ["변화하는 존재, 스스로가 계속 바뀜"]
  },
  {
    question: "누군가를 처음 만났을 때, 당신이 가장 먼저 보는 건?",
    options: ["대화가 통할 것 같은가", "감정 코드가 맞는가", "서로 간섭하지 않을 수 있는가", "함께 미래가 그려지는가"],
    answer: ["함께 미래가 그려지는가"]
  },
  {
    question: '사람들이 당신을 어떻게 묘사할 때 "맞아, 그게 나야" 싶나요?',
    options: ['생각이 깊고 진지한 사람', '따뜻하고 편안한 사람', '독특하고 톡톡 튀는 사람', '믿을 만하고 성실한 사람'],
    answer: ['생각이 깊고 진지한 사람']
  },
  {
    question: "자기 자신을 어떻게 느끼나요?",
    options: ["계속 바뀌는 유동적인 사람", "타인과 함께 있을 때 더 나다워짐", "혼자서도 흔들림 없는 독립형", "변화는 어렵고, 한 번 정해진 틀을 지키는 편"],
    answer: ["한 번 정해진 틀은 지키는 편", "혼자서도 흔들림 없는 독립형"]
  },
  {
    question: "누군가 당신을 오해했을 때 보이는 반응은?",
    options: ["아니 그건 오해야! 바로 잡고 싶다", "일단 그 사람이 불편하지 않게 조심함", "해명은 생략. 알아서 판단하시길", "지금은 말 안 해도, 나중에 천천히 풀자"],
    answer: ["해명은 생략. 알아서 판단하시길", "지금은 말 안 해도, 나중에 천천히 풀자"]
  },
  {
    question: "어떤 대화를 가장 좋아하나요?",
    options: ["인생관, 가치관 얘기하는 깊은 대화", "감정을 나누고 서로 위로하는 대화", "새로운 생각을 던져주는 대화", "현실 문제를 같이 풀어가는 대화"],
    answer: ["인생관, 가치관 얘기하는 깊은 대화", "새로운 생각을 던져주는 대화"]
  },
  {
    question: "감정이 복잡할 때 당신은?",
    options: ["글이나 메모로 정리하면서 푸는 편", "누군가에게 털어놓아야 마음이 풀림", "그냥 잊어버리거나 흘려보낸다", "조용히 혼자만의 공간으로 숨는다"],
    answer: ["글이나 메모로 정리하면서 푸는 편"]
  },
  {
    question: "다른 사람과 갈등이 생겼을 때 당신은?",
    options: ["말로 정확히 정리하고 풀고 싶음", "감정적 상처를 피하고 싶은 마음이 큼", "그냥 거리를 둔다, 굳이 맞설 필요는 없음", "상황이 가라앉을 때까지 기다리는 편"],
    answer: ["감정적 상처를 피하고 싶은 마음이 큼"]
  },
  {
    question: "당신이 스트레스를 푸는 가장 대표적인 방법은?",
    options: ["생각을 정리하며 혼자만의 시간 갖기", "누군가와 이야기 나누기", "전혀 다른 일에 집중하며 머리 식히기", "일을 마무리하거나 정리하며 안정감 찾기"],
    answer: ["생각을 정리하며 혼자만의 시간 갖기", "전혀 다른 일에 집중하며 머리 식히기"]
  },
  {
    question: "누군가와 오래 관계를 유지할 수 있는 이유는?",
    options: ["서로의 가치관이 잘 맞아서", "감정적으로 소통이 잘 돼서", "기대 없이 자유로워서", "책임감 있게 챙기는 모습 때문"],
    answer: ["기대 없이 자유로워서"]
  },
  {
    question: "운동을 할 때 당신의 태도는?",
    options: ["몸을 움직일 때가 즐겁고 일과이다.", "가끔 하면 좋지만 필수까진 아니다", "몸을 쓰지않는 편이 익숙하다", "그냥 싫다"],
    answer: ["몸을 움직일 때가 즐겁고 일과이다.", "가끔 하면 좋지만 필수까진 아니다"]
  },
  {
    question: "하루 중 가장 편안하다고 느끼는 시간대는?",
    options: ["이른 아침", "해가 지기 전", "깊은 밤, 모두가 잠든 시간", "여유로운 오후"],
    answer: ["깊은 밤, 모두가 잠든 시간", "여유로운 오후"]
  },
  {
    question: "무언가를 원할 때, 당신은?",
    options: ["계획을 세우고 어떻게든 이룬다", "하고 싶다는 감정이 먼저고, 방법은 나중", "욕심이 생겨도 곧 식는다", "원한다기보다 주어지는 걸 받아들이는 편"],
    answer: ["욕심이 생겨도 곧 식는다", "원한다기보다 주어지는 걸 받아들이는 편"]
  },
  {
    question: "선택의 갈림길에 섰을 때 당신은?",
    options: ["이성적으로 나아보이는 쪽을 따른다", "익숙한 방향을 따라간다", "낯선 길을 일부러 고른다", "그냥 그 순간 가장 편한 쪽으로 걷는다"],
    answer: ["그냥 그 순간 가장 편한 쪽으로 걷는다"]
  },
  {
    question: "당신의 욕심은 어떤가요?",
    options: ["안 보이는 곳에서 꽤 많은 편", "크지 않지만 꽤 의외의 부분을 포기 못 함", "거의 없다고 말할 수 있다", "많은 편인 듯하다"],
    answer: ["거의 없다고 말할 수 있다", "크지 않지만 꽤 의외의 부분을 포기 못 함"]
  },
  {
    question: "길을 걷다 문득 두 갈래 길이 나왔다. 당신은?",
    options: ["목적지에 가까운 쪽을 택한다", "더 예뻐 보이는 길을 택한다", "잘 안 닦인, 낯선 길로 향한다", "그냥 발이 먼저 가는 쪽으로 걷는다"],
    answer: ["그냥 발이 먼저 가는 쪽으로 걷는다", "목적지에 가까운 쪽을 택한다"]
  },
  {
    question: "평소에 자신에게 더 많이 하는 말은?",
    options: ["좀 더 잘할 수 있어", "이 정도면 괜찮지", "왜 꼭 이렇게 해야 하지?", "다 지나갈 거야"],
    answer: ["이 정도면 괜찮지"]
  },
  {
    question: "당신은 '변화'에 대해 어떻게 느끼나요?",
    options: ["긍정적인 편이라면 받아들인다", "때로 두렵지만 필요하다고 생각한다", "가급적이면 익숙한 걸 유지하고 싶다", "자주 바꾸며 나를 실험해본다"],
    answer: ["긍정적인 편이라면 받아들인다"]
  },
  {
    question: "당신이 좋아하는 공간의 느낌은?",
    options: ["밝고 환기 잘 되는 곳", "조용하고 감정이 머무는 곳", "뭔가 다채롭고 물건이 많은 곳", "정돈되고 목적이 분명한 곳"],
    answer: ["조용하고 감정이 머무는 곳"]
  },
  {
    question: "새로운 것을 시작할 때, 당신은?",
    options: ["먼저 배우고 나서 움직인다", "일단 시작하고 나서 배운다", "남들이 안 하는 방식을 찾아본다", "확신이 생길 때까지 망설인다"],
    answer: ["일단 시작하고 나서 배운다", "확신이 생길 때까지 망설인다"]
  },
  {
    question: "어떤 일이 반복해서 떠오를 때, 당신은?",
    options: ["내가 뭘 잘못했는지 끝없이 분석한다", "주변에 털어놓으며 공감을 얻는다", "그 일이 지금의 나를 규정하는 것 같아 괴롭다", "기억에 관한 감정을 감추려 한다"],
    answer: ["내가 뭘 잘못했는지 끝없이 분석한다", "기억에 관한 감정을 감추려 한다"]
  },
  {
    question: "다음 중 당신을 가장 불편하게 만드는 말은?",
    options: ["\"그건 틀렸어.\"", "\"넌 혼자야.\"", "\"이건 아무 의미 없어.\"", "\"그냥 네가 그 정도인 거야.\""],
    answer: ["\"그냥 네가 그 정도인 거야.\""]
  },
  {
    question: "당신이 가장 오래 붙잡고 있는 과거의 감정은?",
    options: ["실망시켰다는 죄책감", "버려졌다는 느낌", "실패했다는 수치심", "무의미했다는 공허함"],
    answer: ["실망시켰다는 죄책감", "무의미했다는 공허함"]
  },
  {
    question: "당신을 가장 집중하게 하는 환경은?",
    options: ["적막", "잔잔한 음악", "사람들의 웅성거림", "자연의 소리"],
    answer: ["잔잔한 음악", "자연의 소리"]
  },
  {
    question: "당신이 믿는 변화의 방식은?",
    options: ["시간", "관계", "결단", "우연"],
    answer: ["시간", "관계", "결단", "우연"]
  },
  {
    question: "최근 가장 자주 떠오른 단어는?",
    options: ["시작", "끝", "기다림", "도망"],
    answer: ["기다림", "시작"]
  },
  {
    question: "자주 되돌아보는 순간은?",
    options: ["실패", "결말", "시작", "성장"],
    answer: ["결말", "실패"]
  },
  {
    question: "당신이 무너지는 순간의 이유는?",
    options: ["무시", "고독", "지겨움", "과거"],
    answer: ["지겨움"]
  },
  {
    question: "당신이 가장 견디기 힘든 상태는?",
    options: ["무관심", "수치심", "불확실", "거절"],
    answer: ["불확실"]
  },
  {
    question: "가장 자주 되뇌이는 문장은?",
    options: ["아직은 시작이야", "그땐 그랬지", "어쩔 수 없지", "열심히 하자"],
    answer: ["어쩔 수 없지", "그땐 그랬지"]
  },
  {
    question: "당신의 무의식을 가장 잘 표현하는 단어는?",
    options: ["갈망", "숨김", "기억", "충동"],
    answer: ["기억", "숨김"]
  },
  {
    question: "화분은?",
    options: ["돌봄", "성장", "기다림", "책임"],
    answer: ["책임", "돌봄"]
  },
  {
    question: "누군가에게 편지를 남긴다면 가장 담고 싶은 것은?",
    options: ["감사/사과", "고백", "기억", "감정"],
    answer: ["기억", "고백"]
  },
  {
    question: "당신을 가장 오래 머무르게 하는 것은?",
    options: ["낯익은 냄새", "잊지 못한 말", "따뜻한 손길", "멈춰 있는 시간"],
    answer: ["멈춰 있는 시간"]
  },
  {
    question: "당신을 가장 잘 설명하는 풍경은?",
    options: ["비 그친 뒤의 거리", "책상 위의 먼지", "햇살 들이치는 창가", "늦은 밤 전등 불빛"],
    answer: ["책상 위의 먼지", "늦은 밤 전등 불빛"]
  },
  {
    question: "좋아하는 자연환경은?",
    options: ["호수", "초원", "바다", "산"],
    answer: ["호수", "초원"]
  },
  {
    question: "어디서 살고 싶나요?",
    options: ["빌딩 가득한 도시", "한가한 시골", "바닷가 마을", "숲속 오두막"],
    answer: ["한가한 시골", "바닷가 마을"]
  },
  {
    question: "좋아하는 컨텐츠는?",
    options: ["책", "영화", "드라마", "숏폼"],
    answer: ["책"]
  },
  {
    question: "어떤 장르가 끌리나요?",
    options: ["로맨스", "판타지", "스릴러", "다큐"],
    answer: ["판타지"]
  },
  {
    question: "당신의 책상은 어떤 모습인가요?",
    options: ["책, 노트, 포스트잇에 빼곡한 글자들", "화장품, 거울 등 자신을 꾸밀 물건들", "간식거리와 음료들로 가득", "이것저것 쌓인 여타 잡동사니"],
    answer: ["책, 노트, 포스트잇에 빼곡한 글자들"]
  },
  {
    question: "이 중 선호하는 것은?",
    options: ["커피", "주류", "음료", "물"],
    answer: ["커피", "음료", "물"]
  },
  {
    question: "무언가 집중해야하는 새벽 시간 하나를 챙긴다면?",
    options: ["함께할 사람", "카페인", "알코올", "음악"],
    answer: ["카페인", "음악"]
  }
];

// Fisher-Yates shuffle 함수 추가
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let current = 0;
let score = 0;
let quizShuffled = [];

function startQuiz() {
  quizShuffled = shuffle([...quiz]).slice(0, 10);
  current = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (current >= quizShuffled.length) {
    document.getElementById("main-container").classList.add("result-mode");
    document.getElementById("result-box").style.display = "flex";
    document.getElementById("question-box").style.display = "none";
    const percent = Math.round((score / quizShuffled.length) * 100);
    document.getElementById("result-score").textContent = `유사도: ${percent}%`;
    let resultMsg = "으으음 ...";
    if (percent <= 20) resultMsg = "저희 서로 배울 점이 있겠네요.";
    else if (percent <= 40) resultMsg = "딱 평균이네요!";
    else if (percent <= 60) resultMsg = "으으음 ...";
    else if (percent <= 80) resultMsg = "오 ..?";
    else if (percent <= 90) resultMsg = "어라 ?";
    else if (percent <= 100) resultMsg = "이럴 순 없는거야.";
    document.getElementById("result-title").textContent = resultMsg;
    // 100%일 때 별가루 1000개 지급
    // if(percent === 100) {
    //   if (window.firebaseAuth && window.firebaseAuth.currentUser && window.updateUserStars) {
    //     // Firestore에만 지급
    //     getCurrentUserStars().then(stars => {
    //       window.updateUserStars(stars + 1000);
    //       alert('축하합니다! 유사도 100% 달성으로 별가루 1000개를 획득했습니다.');
    //     });
    //   } else {
    //     alert('로그인한 유저만 별가루를 획득할 수 있습니다.');
    //   }
    // }
    return;
  }
  document.getElementById("question-box").style.display = "block";
  document.getElementById("progress").textContent = `${current+1} / ${quizShuffled.length}`;

  const q = quizShuffled[current];
  document.getElementById("question-text").textContent = q.question;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "utest-btn";

    btn.onclick = () => {
      if (Array.isArray(q.answer) && q.answer.includes(option)) {
        score++;
      }
      current++;
      showQuestion();
    };

    container.appendChild(btn);
  });
}

// 결과창 버튼 이벤트
document.addEventListener('DOMContentLoaded', () => {
  // onAuthStateChanged(window.firebaseAuth, (user) => {
  //   if (!user) {
  //     // 로그인 안내 또는 별가루 기능 제한
  //     return;
  //   }
  //   // 별가루 관련 함수/이벤트/UI 초기화는 여기서만!
  //   // 퀴즈 시작, 버튼 바인딩 등
  //   document.getElementById("retry-btn").onclick = function() {
  //     document.getElementById("result-box").style.display = "none";
  //     document.getElementById("main-container").classList.remove("result-mode");
  //     document.getElementById("question-box").style.display = "block";
  //     startQuiz();
  //   };
  //   document.getElementById("go-title-btn").onclick = function() {
  //     window.location.href = "index.html";
  //   };
  // 퀴즈 시작
  startQuiz();
  // });
});