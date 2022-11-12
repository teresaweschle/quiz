let startBtn = document.querySelector(".start");
let scoreBtn = document.querySelector(".highscore");
let btnContainer = document.querySelector(".btn-container");
let backBtn = false;
let backContainer;
let questionPageContainer;
let questionBox;
let questionsApi;
let currentQuestion;
let currentAnswers;
let currentCorrectAnswer;
let score = 0;

//setup data from api for the first question
var request = new XMLHttpRequest();
request.open("GET", "https://opentdb.com/api.php?amount=2&type=multiple");
request.send();
request.onload = () => {
  questionsApi = JSON.parse(request.response).results;
};

//event listeners

startBtn.addEventListener("click", function () {
  startGame();
});

//functions
function showStartPage() {
  removeQuestion();
  addStartBtns();
}
function removeQuestion() {
  if (backBtn) {
    document.body.removeChild(questionPageContainer);
  }
  if (questionBox) {
    questionBox = document.querySelector(".question-box");
    document.body.removeChild(questionBox);
  }
}
// add and remove buttons
function removeStartBtns() {
  //btnContainer.removeChild(startBtn);
  // btnContainer.removeChild(scoreBtn);
  document.body.removeChild(btnContainer);
}

function addStartBtns() {
  document.body.innerHTML += `<div class="btn-container">
  <button class="button start">
    play <i class="fa fa-solid fa-play"></i>
  </button>
  <button class="button highscore">
    highscores <i class="fa fa-solid fa-trophy"></i>
  </button>
</div>`;
  startBtn = document.querySelector(".start");
  scoreBtn = document.querySelector(".highscore");
  btnContainer = document.querySelector(".btn-container");
  startBtn.addEventListener("click", startGame);
}

function showBtn(btn) {
  btn.classList.remove("hide-btn");
}
function SwitchBtn(btn) {
  btn.classList.toggle("hide-btn");
}
// start game
function getQuestionFromApi2(onQuestionReceived) {
  fetch("https://opentdb.com/api.php?amount=2&type=multiple").then(
    (response) => {
      console.log(response.body);
      const data = JSON.parse(response);
      questionsApi = data.results;
      currentQuestion = questionsApi[0].question;
      currentAnswers = questionsApi[0].incorrect_answers;
      currentCorrectAnswer = questionsApi[0].correct_answer;
      currentAnswers.push(currentCorrectAnswer);
      onQuestionReceived();
      // stop waiting screen
    }
  );
  // show wait screen
}

function getQuestionFromApi(onQuestionReceived) {
  var request = new XMLHttpRequest();
  request.open("GET", "https://opentdb.com/api.php?amount=2&type=multiple");
  request.onload = (e) => {
    questionsApi = JSON.parse(request.response).results;
    currentQuestion = questionsApi[0].question;
    currentAnswers = questionsApi[0].incorrect_answers;
    currentCorrectAnswer = questionsApi[0].correct_answer;
    currentAnswers.push(currentCorrectAnswer);
    onQuestionReceived();
  };
  request.send();
}

function addQuestion() {
  let answersHTML = "";
  currentAnswers.forEach(function (item) {
    answer = `<button class="button answerbtn" onclick="evaluateAnswer(this)">
    ${item}
  </button>`;
    answersHTML += answer;
  });
  document.body.innerHTML += ` <div class="question-box">
  <article class="question">
    <p class="question-title">${currentQuestion}</p>
    <div class="question-answer">
    ${answersHTML}
    </div>
  </article>
</div>`;
  questionBox = document.querySelector(".question-box");
}

function startGame() {
  score = 0;
  removeStartBtns();
  loadNextQuestion();
}

function loadNextQuestion() {
  getQuestionFromApi2(getQuestionPage);
  // removeQuestion();
  // addButtonsStuffTeresa();
}

function getQuestionPage() {
  addQuestion();
  document.body.innerHTML += `<div class="questionPageContainer">
  <div class="btn-container back-container">
  <button class="button back">
    back <i class="fa fa-solid fa-play"></i>
  </button>
</div>
<span id="score">Score: ${score}</span>
</div>
`;
  questionPageContainer = document.querySelector(".questionPageContainer");
  backBtn = document.querySelector(".back");
  backContainer = document.querySelector(".back-container");
  backBtn.addEventListener("click", showStartPage);
}

function evaluateAnswer(answer) {
  answerBtns = document.querySelectorAll(".answerbtn");
  if (currentCorrectAnswer === answer.innerText) {
    updateScore(1);
    answer.classList.add("success");
    answer.classList.remove("fail");
    answerBtns.forEach(function (item) {
      if (item.innerText !== currentCorrectAnswer) {
        item.classList.add("answered");
        item.classList.remove("success");
      }
    });
  } else {
    updateScore(0);
    answer.classList.add("fail");
    answer.classList.remove("success");
    answerBtns.forEach(function (item) {
      if (item.innerText == currentCorrectAnswer) {
        item.classList.remove("fail");
        item.classList.add("success");
      }
      item.classList.add("answered");
    });
  }
  //wait = setInterval(loadNextQuestion(), 10000);
}

function updateScore(value) {
  score += value;
  const scoreEl = document.getElementById("score");
  scoreEl.innerText = `Score: ${score}`;
}
