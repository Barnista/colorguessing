/* Programmatically made by Tummanoon Wanchaem. 
- January 18, 2018.
No additional references whatsoever. */

var gameObject = {
    new_btn: document.querySelector("#new-btn"),
    hard_btn: document.querySelector("#hard-btn"),
    hard_btn: document.querySelector("#hard-btn"),
    normal_btn: document.querySelector("#normal-btn"),
    easy_btn: document.querySelector("#easy-btn"),
    guess_color: document.querySelector("#guess-color"),
    accent: document.querySelector("#accent"),
    score: document.querySelector("#score"),
    score_label: document.querySelector("#score-label"),
    timeout: document.querySelector("#timeout"),
    timeout_lab: document.querySelector("#timeout_lab"),
    table: document.querySelector("table"),
    rects: document.querySelectorAll(".rect"),
    rect_board: document.querySelector("#rect-board"),
    score_board: document.querySelector("#score-board"),
    score_list: document.querySelector("#score-list")
};

var gameScoreBoard = [];

var rect_template = '<tr><td><div class="rect"></div></td><td><div class="rect"></div></td><td><div class="rect"></div></td></tr>';

var level = 2;
var min = 1, max = 6;
var score_promise = 0, score_count = 0;
var minute = 1, second = 0, def_minute = 3;
var score_bonus_base = 5, bonus_time = 0, bonus_limited_time = 5;
var isTimeOut = true, timeBreak = true;


gameObject.easy_btn.addEventListener("click", levelSetting);
gameObject.hard_btn.addEventListener("click", levelSetting);
gameObject.normal_btn.addEventListener("click", levelSetting);
gameObject.new_btn.addEventListener("click", newGame);
gameObject.accent.style.backgroundColor = "rgb(106, 90, 205)";

countDownTime(); //start the timer

function newGame(){
    if (confirm('Do you want to start New Game?')) {
        score_count = 0;
        gameObject.score.textContent = score_count.toString();
        gameObject.score_board.classList.add("collapse");
        gameObject.rect_board.classList.remove("collapse");
        startGameNow();
    } else{}
}

function startGameNow(){
    isTimeOut = false;
    timeBreak = false;
    minute = def_minute;
    second = 0;
    gameObject.score_label.textContent = "SCORES: ";
    startGame();
    //playBG();
}

function startGame(){
    timeBreak = false;
    bonus_time = 0;
    score_promise = 10 * 3 * level;

    //random number between min and max
    var randomRect = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(randomRect.toString());

    for(var x=0; x < gameObject.rects.length; x++){
        gameObject.rects[x].style.backgroundColor = generateColor();
    }

    var color_code = gameObject.rects[randomRect-1].style.backgroundColor + "";
    gameObject.guess_color.textContent = color_code.toUpperCase();

    for(var x = 0; x < gameObject.rects.length; x++){
        gameObject.rects[x].addEventListener("click", checkColor);
        gameObject.rects[x].classList.remove("correct");
        gameObject.rects[x].classList.remove("wrong");
    }
}

function checkColor(){
    if(timeBreak == false){
        var c = this.style.backgroundColor.toString().toUpperCase();
        console.log(c + " -> " + gameObject.guess_color.textContent);
        if(c != gameObject.guess_color.textContent){
            score_promise -= 10;
            this.classList.add("wrong");
        }else{
            playCorrect();
            gameObject.accent.style.backgroundColor = this.style.backgroundColor;
            this.classList.add("correct");
            this.style.backgroundColor = "transparent";
            timeBreak = true;

            if(bonus_time <= bonus_limited_time && score_promise == level * 10 * 3){
                score_promise += score_bonus_base * level;
            }
            score_count += score_promise;

            setTimeout(function(){
                gameObject.timeout_lab.classList.toggle("gone");
            },500);
            setTimeout(function(){
                gameObject.guess_color.textContent = "CORRECT!";
            },1200);
            setTimeout(function(){
                gameObject.score.textContent = gameObject.score.textContent + " +" + score_promise;
            },1500);
            setTimeout(function(){
                gameObject.score.textContent = score_count;
            },2000);
            setTimeout(function(){
                gameObject.timeout_lab.classList.toggle("gone");
                if(isTimeOut == false){
                    startGame();
                }
            }, 4000);
        }
    }else{}
}

function generateColor(){
    var x = Math.random();
    var y = x.toString(16);
    var z = "#" + y.slice(2, 8);
    return z;
}

function levelSetting(){
        this.classList.add("selected");
        if(this == gameObject.easy_btn){
            gameObject.hard_btn.classList.remove("selected");
            gameObject.normal_btn.classList.remove("selected");
            level = 1;
        }else if (this == gameObject.normal_btn){
            gameObject.easy_btn.classList.remove("selected");
            gameObject.hard_btn.classList.remove("selected");
            level = 2;
        }else{
            gameObject.easy_btn.classList.remove("selected");
            gameObject.normal_btn.classList.remove("selected");
            level = 3;
        }
        max = 3 * level;
        gameObject.table.innerHTML = rect_template.repeat(level);
        gameObject.rects = document.querySelectorAll(".rect");
        
    if(timeBreak == false){
        if(isTimeOut == true){
            startGameNow();
        }else{
            startGame();
        }
    }
}

function countDownTime(){
    if(minute <= 0 && second <= 0){
        if(isTimeOut == false){
            gameObject.guess_color.textContent = "TIMEOUT";
            isTimeOut = true;
            timeBreak = true;
            setTimeout(function(){
                alert("TIMEOUT! Your total scores is " + score_count);
                gameScoreBoard.push(score_count);
                gameObject.score_board.classList.remove("collapse");
                gameObject.rect_board.classList.add("collapse");
                gameObject.score_list.innerHTML = gameObject.score_list.innerHTML + "<tr><td>" 
                    + gameScoreBoard.length + "</td><td>" + score_count + "</td></tr>";
            }, 1500);
        }
    }else{
        if(timeBreak == false){
            if(second <= 0){
                minute --;
                second += 60;            
            } second -= 1;
            gameObject.timeout.textContent = minute + "." + second;
        }
    }
    bonus_time++; //count bonus_time
    setTimeout(function(){
        countDownTime();
    }, 1000);
}

var correctSFX = new Audio('aud/correct.mp3');
var correctSFX2 = new Audio('aud/correct2.mp3');
var bgMusic = new Audio('aud/bg-everything-nice.mp3');

function playBG(){
    if(isTimeOut == false){
        bgMusic.play();
    }
    setTimeout(function(){
        if(isTimeOut == true){
            return;
        }
        playBG();
    }, 60000); 
}

function playCorrect() {
    var index = Math.floor(Math.random() * 1000) % 2;
    if(index == 0){
        correctSFX.play();
    }else{
        correctSFX2.play();
    }
}