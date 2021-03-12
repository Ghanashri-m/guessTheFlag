/* Global variables */

var SCORE;
var RAND_QUES;
var NUMS;
var TotalFlags = [];
var countries = [];
let questionColl = [];
let optionColl = [];
let answerColl = [];

/*************************** */

const scoreBoard = document.querySelector('.score-board');
const scoreVal = document.getElementById('score');
const questionBox = document.querySelector('.question-box');
const optionBox = document.querySelector('.option-wrapper');
const playBtn = document.querySelector('.play-btn');
const exitBtn = document.querySelector('.exit-btn');

(function getFlags() {
    document.getElementById('play').innerText = 'Loading . . .';
    playBtn.disabled = true;
    fetch('https://holidayapi.com/v1/countries?pretty&key=79e5bf2c-fc4a-488a-991c-9100a8954f59')
    .then((response) => { 
      return response.json();
    })
    .then((data) => {
      var flags = []
      data.countries.map((country) => {
        flags.push({country: country.name, flag: country.flag});
      })
      var res = flags.sort(function() {
        return 0.5 - Math.random();
      });
      TotalFlags = res.slice(flags,20);
      TotalFlags.map((item) => {
        countries.push(item.country);
        questionColl.push(item.flag);
      })
      populateOptions();
      populateAnswers();
      playBtn.disabled = false;
      document.getElementById('play').innerText = 'PLAY';
    })
  })();

  function populateOptions() {
    TotalFlags.map((item) => {
      const options =  [item.country];
      for (var i = 0; i < 3; i++) {
        options.push(getRandomExcept(countries, item.country));
      }
      options.sort(() => Math.random() - 0.5);
      optionColl.push({options: options})
    })
  };

  function populateAnswers() {
    optionColl.map((item, index) => {
      answerColl.push(item.options.indexOf(countries[index]));
    })
  }

/******************************* */

const optionsBtns = document.querySelectorAll('.option-text'); // for all 4 option's text

const optionsSelection = document.querySelectorAll('#opt-btn');

/********************************* */


function playSetup(){
    SCORE = 0;
    RAND_QUES = -1;
    playBtn.style.display = "block";
    questionBox.style.display = "none";
    optionBox.style.display = "none";
    exitBtn.style.display = "none";
    scoreBoard.style.display = "none";
    NUMS = numArray(0, 19); // for 7 total questions
    
}


function startGame(){
    scoreVal.innerHTML = SCORE;
    questionBox.style.display = "block";
    optionBox.style.display = "flex";
    exitBtn.style.display = "block";
    scoreBoard.style.display = "block";
    question.quizPlay();
}

playBtn.addEventListener('click', function(){
    this.style.display = "none";
    startGame();
})

exitBtn.addEventListener('click', function(){
    playSetup();
})

let quizQuestion = function(question, optionList, correctAns){
    this.question = question;
    this.optionList = optionList;
    this.correctAns = correctAns;
}

let question = new quizQuestion(questionColl, optionColl, answerColl);

/****************************** */

/************ generate unique random numbers for unique questions */


function numArray(start, end){
    let numsList = [];
    for(let i = start; i <= end; i++){
        numsList.push(i);
    }
    return numsList;
}

function randValueGen(min, max){
    let temp = Math.random() * (max - min + 1);
    let result = Math.floor(temp) + min;
    return result;
}


/***************************** */

quizQuestion.prototype.quizPlay = function(){
    
    // To check if the questions are available or not

    if(NUMS.length === 0){
        document.getElementById('question_Image').src = "";
        document.getElementById('question').innerHTML = "You have completed the game.";
        optionBox.style.display = "none";
        return;
    }
    
    
    let randIndex = randValueGen(0, NUMS.length - 1);
    RAND_QUES = NUMS[randIndex];

    NUMS.splice(randIndex, 1);

    // for random question dispay in the question box
    document.getElementById('question_Image').src = this.question[RAND_QUES];
    document.getElementById('question').innerHTML = "Guess the Flag ...";

    // for displaying the options for the above question
    this.optionList[RAND_QUES].options.forEach(function(option, idx){
        optionsBtns[idx].innerHTML = option.includes(',') ? option.split(',')[0] : option;
    })
}

optionsSelection.forEach(function(optionSelected, index){
    /*
    optionSelected.addEventListener('click', function(){
        console.log(`${optionSelected} ${index}`);
    })
    */

    optionSelected.addEventListener('click', function(){

        // answer selected by user
        let userAns = parseInt(this.textContent) - 1; // as our indexing starts from 0

        // for preventing user to click multiple times and on multiple options

        optionsSelection.forEach(function(option){
            option.disabled = true;
        })

        question.checkAnswer(userAns);
    })

})

quizQuestion.prototype.checkAnswer = function(userAns){
    optionsSelection[userAns].style.background = "white";
    optionsSelection[userAns].style.color = "black";

    // correct answer from our data collection
    let correctAns = question.correctAns[RAND_QUES];
    if(userAns === correctAns){
        correctAnsUpdate();
    } else {
        incorrectAnsUpdate();
    }
} 

// for correct answer update 
function correctAnsUpdate(){
    document.getElementById('question').style.color = "gold";
    document.getElementById('question').innerHTML = "Correct!";
    SCORE++;
    scoreVal.innerHTML = SCORE;
    
    setTimeout(contdPlay, 1000);
}

// for incorrect answer update 
function incorrectAnsUpdate(){
    document.getElementById('question').style.color = "red";
    document.getElementById('question').innerHTML = "Incorrect!";

    setTimeout(contdPlay, 1000);
}

// for continuous play

function contdPlay(){
    
    optionsSelection.forEach(function(option){
        option.disabled = false; // re-enabling our disabled buttons
        option.style.background = "black";
        option.style.color = "white";
    })

    document.getElementById('question').style.color = "black"; // to make question color white again in case the previous answer was answered incorrectly

    question.quizPlay();
}

var getRandomExcept = function(elements, exceptElement){
  if(elements.length <= 0){
      return null;
  }else if(typeof exceptElement !== 'undefined' && elements.length == 1){
      if(elements[0] === exceptElement) return null;
  }

  var n = Math.floor(Math.random() * elements.length);

  if(elements[n] === exceptElement){
      // make one random trip around elements but stop (<elements.length) before the exceptElement
      n = (n + Math.floor(Math.random() * elements.length)) % elements.length;
  }
  return elements[n];
};

playSetup();