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
let playerName = "player9";

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
  const gameoverContainerEl = document.querySelector(".gameoverContainer");
  if (gameoverContainerEl) {
    document.body.removeChild(gameoverContainerEl);
  }
  if (backBtn) {
    document.body.removeChild(questionPageContainer);
    //backBtn = false;
  }
  if (questionBox) {
    questionBox = document.querySelector(".question-box");
    document.body.removeChild(questionBox);
    //questionBox = false;
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
// API Service Method
function getQuestionFromApi2(onQuestionReceived) {
  fetch("https://opentdb.com/api.php?amount=2&type=multiple")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      questionsApi = data.results;
      currentQuestion = questionsApi[0].question;
      currentAnswers = questionsApi[0].incorrect_answers;
      currentCorrectAnswer = questionsApi[0].correct_answer;
      const randomIndex = Math.floor(Math.random() * 4);
      currentAnswers.splice(randomIndex, 0, currentCorrectAnswer);
      onQuestionReceived();
    });
  // stop waiting screen

  // show wait screen
}

// Alternative Version of getQuestionFromApi
function getQuestionFromApiAsync() {
  return fetch("https://opentdb.com/api.php?amount=2&type=multiple").then(
    (response) => {
      return response.json();
    }
  );
}

// API Service Method
function getQuestionFromApi_Alt(onQuestionReceived) {
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
  loadNextQuestion("start");
}

function loadNextQuestion(value) {
  if (value !== "start") {
    removeQuestion();
  }
  getQuestionFromApi2(getQuestionPage);
  // getQuestionFromApiAsync().then((result) => {
  //   getQuestionPage();
  // });
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

function evaluateAnswer(answerButton) {
  let gameOver = false;
  const answerBtns = document.querySelectorAll(".answerbtn");
  if (currentCorrectAnswer === answerButton.innerText) {
    updateScore(1);
    answerButton.classList.add("success");
    answerButton.classList.remove("fail");
    answerBtns.forEach(function (item) {
      item.onclick = null;
      if (item.innerText !== currentCorrectAnswer) {
        item.classList.add("answered");
        item.classList.remove("success");
      }
    });
  } else {
    gameOver = true;
    updateScore(0);
    answerButton.classList.add("fail");
    answerButton.classList.remove("success");
    answerBtns.forEach(function (item) {
      item.onclick = null;
      if (item.innerText == currentCorrectAnswer) {
        item.classList.remove("fail");
        item.classList.add("success");
      }
      item.classList.add("answered");
    });
  }
  // backContainer.innerHTML += nextBtnString;
  if (gameOver) {
    updateLocalStorage(score);
    const gameOverEl = document.createElement("div");
    gameOverEl.innerHTML = `<p class="gameover"> GAMEOVER
  </p>`;
    gameOverEl.classList.add("gameoverContainer");
    document.body.appendChild(gameOverEl);
  } else {
    const nextBtnElement = document.createElement("button");
    nextBtnElement.innerHTML = "next question";
    nextBtnElement.classList.add("button");
    nextBtnElement.classList.add("next");
    backContainer.appendChild(nextBtnElement);
    nextBtnElement.addEventListener("click", loadNextQuestion);
  }
}

function updateScore(value) {
  score += value;
  const scoreEl = document.getElementById("score");
  scoreEl.innerText = `Score: ${score}`;
}

function getLocalStorage() {
  return localStorage.getItem("highscores")
    ? JSON.parse(localStorage.getItem("highscores"))
    : new Object();
}

function updateLocalStorage(value) {
  let highscorelist = getLocalStorage();
  highscorelist[playerName] = value;
  localStorage.setItem("highscores", JSON.stringify(highscorelist));
}
