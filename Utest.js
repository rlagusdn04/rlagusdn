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
    answer: ["깊이 있고 생각이 많은 사람"]
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
    options: ["날씨", "사진", "익숙한 장소", "꿈"],
    answer: ["꿈", "날씨"]
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
    answer: ""
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
    answer: ["계속 바뀌는 유동적인 사람"]
  },
  {
    question: "누군가 당신을 오해했을 때 보이는 반응은?",
    options: ["아니 그건 오해야! 바로 잡고 싶다", "일단 그 사람이 불편하지 않게 조심함", "해명은 생략. 알아서 판단하시길", "지금은 말 안 해도, 나중에 천천히 풀자"],
    answer: ["해명은 생략. 알아서 판단하시길"]
  },
  {
    question: "어떤 대화를 가장 좋아하나요?",
    options: ["인생관, 가치관 얘기하는 깊은 대화", "감정 나누고 서로 위로하는 대화", "새로운 생각을 던져주는 대화", "현실 문제를 같이 풀어가는 대화"],
    answer: ["인생관, 가치관 얘기하는 깊은 대화"]
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
    answer: ["생각을 정리하며 혼자만의 시간 갖기"]
  },
  {
    question: "누군가와 오래 관계를 유지할 수 있는 이유는?",
    options: ["서로의 가치관이 잘 맞아서", "감정적으로 소통이 잘 돼서", "기대 없이 자유로워서", "책임감 있게 챙기는 모습 때문"],
    answer: ["기대 없이 자유로워서"]
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
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("retry-btn").onclick = function() {
    document.getElementById("result-box").style.display = "none";
    document.getElementById("main-container").classList.remove("result-mode");
    document.getElementById("question-box").style.display = "block";
    startQuiz();
  };
  document.getElementById("go-title-btn").onclick = function() {
    window.location.href = "index.html";
  };
});

// 퀴즈 시작
startQuiz();