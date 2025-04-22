const quizBtn = document.getElementById("start-quiz-btn");
const quizContainer = document.getElementById("quiz-container");
const restartQuiz = document.getElementById("reset-quiz");
document.getElementById("timer").classList.add('hidden');

let currentQuestion = 0;
let currentScore = 0;
let initialTime = 5;
let totalTime = initialTime * 60;

let data;

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
  })
  .catch(error => console.error('Error fetching JSON:', error));

let timerInterval;

quizBtn.addEventListener("click", () => {
    quizContainer.style.display = "block";
    quizBtn.style.display = "none";
    
    addData(data[currentQuestion]);
    totalTime = initialTime * 60;
    timerInterval = setInterval(setTime, 1000);
    document.getElementById("timer").classList.remove('hidden');
});

const addData = (question) => {
    const questionsContainer = document.getElementById("questions-container");

    const innerDiv = document.createElement('div');
    innerDiv.classList.add("question-wrap")
    questionsContainer.innerHTML = '';

    innerDiv.innerHTML = `
        <h3 class="question">${question.question}</h3>
        <span id="error-message" class="error-msg mb-2 d-none text-danger">*Selected wrong answer</span>
        <span id="success-message" class="success-msg mb-2 d-none text-success">*Selected correct answer</span>
        <ul class="options">
        ${question.options.map((option) => {
        return (
            `<li class="option"><button class="btn answer-btn" data-id=${option.id} onClick="handleAnswerClick(${option.id})">${option.option}</button></li>`
        );
    }).join(' ')}
        </ul>
        <div class="next-question" id="next"><button class="btn-primary" onClick="handleNext()">Next Question</button></div>
        `;

    questionsContainer.appendChild(innerDiv);
}

const handleAnswerClick = (id) => {
    const question = data[currentQuestion];
    const answers = document.querySelectorAll(".answer-btn");
    const nextBtn = document.getElementById("next");

    answers.forEach((button) => {
        const optionId = button.getAttribute("data-id");
        button.disabled=true;

        if (optionId == question.correctAnswer) {
            button.classList.add('correct');
            button.parentElement.classList.add('correct');
        } else {
            button.classList.add('incorrect');
            button.parentElement.classList.add('incorrect');
        }
    })

    if (id == question.correctAnswer) {
        currentScore += 1;
        document.getElementById("success-message").classList.remove("d-none");
    } else {
        document.getElementById("error-message").classList.remove("d-none");
    }

    nextBtn.style.display = "block";
};

const handleNext = () => {
    const nextBtn = document.getElementById("next");
    document.getElementById("error-message").classList.remove("d-none");
    document.getElementById("success-message").classList.remove("d-none");
    nextBtn.style.display = "none";
    currentQuestion += 1;

    if(currentQuestion < data.length) {
        addData(data[currentQuestion]);
    } else {
        showScore();
    }
};

const showScore = () => {
    clearInterval(timerInterval);
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.style.display = "none";
    const scoreDiv = document.getElementById("score-div");
    scoreDiv.innerHTML = `<h2>Quiz Completed!</h2><h3>Your Score: <strong>${currentScore}/${data.length}</strong></h3>`;
    scoreDiv.style.display = "block";
    restartQuiz.style.display="block";
};


restartQuiz.addEventListener("click", () => {
    const scoreDiv = document.getElementById("score-div");

    currentScore = 0;
    currentQuestion = 0;
    clearInterval(timerInterval);
    totalTime = initialTime * 60; 

    quizContainer.style.display = "none";
    quizBtn.style.display = "block";
    scoreDiv.style.display = "none";
    restartQuiz.style.display="none";
    document.getElementById("timer").classList.add('hidden');
    document.getElementById("timer").classList.remove('danger');
});

function setTime() {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    const minutesSpan = document.getElementById("minutes");
    const secondsSpan = document.getElementById("seconds");

    seconds = seconds < 10 ? '0' +seconds : seconds;

    minutesSpan.innerText = minutes;
    secondsSpan.innerText = seconds;

    if(minutes < 2) {
        document.getElementById("timer").classList.add('danger');
    }

    totalTime--;

    if(totalTime < 0) {
        showScore();
        return;
    }
}