let display = document.querySelector('#timer');
let time = 60 * 90;

const btnExit   = document.getElementById('btnExit');
const btnSubmit = document.getElementById('btnSubmit');
const btnRun = document.getElementById('runTimer');
const examId = document.getElementById('examId');
const curQuestion = document.getElementById('curQues');
const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");
const answer4 = document.getElementById("answer4");


const lstQuestion = document.getElementsByClassName('lst-question')[0];
const question = document.getElementsByClassName('question')[0];

let ar = [];
let answer_array = [];
let question_array = [];

btnExit.addEventListener('click', function(){
    window.location.replace('/');
})

answer1.addEventListener('click', function(){
    let index = parseInt(curQuestion.value) - 1;
    answer_array[index] = 'A';
    if (index + 1 < question_array.length) ar[index + 1].click();
});

answer2.addEventListener('click', function(){
    let index = parseInt(curQuestion.value) - 1;
    answer_array[index] = 'B';
    if (index + 1 < question_array.length) ar[index + 1].click();
});

answer3.addEventListener('click', function(){
    let index = parseInt(curQuestion.value) - 1;
    answer_array[index] = 'C';
    if (index + 1 < question_array.length) ar[index + 1].click();
});

answer4.addEventListener('click', function(){
    let index = parseInt(curQuestion.value) - 1;
    answer_array[index] = 'D';
    if (index + 1 < question_array.length) ar[index + 1].click();
});

function startTimer(duration,display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;


        if (--timer < 0) {
            window.location.replace('/');
        }
    }, 1000);
}

btnRun.addEventListener('click', () => {
    startTimer(time,display);
    btnSubmit.style.display = 'block';
    btnRun.style.display = 'none';

    fetch(`/exams/${examId.value}/content`)
        .then((resp) => resp.json())
        .then(function(data){
            question_array = data['questions'];
            for(let i = 1; i < question_array.length + 1; i++)
            {
                let d = document.createElement('div');
                d.classList.add('subQuestion');
                d.innerHTML = "" + i;
                lstQuestion.appendChild(d);
            }

            ar = document.getElementsByClassName('subQuestion');
            for(let i = 0; i < question_array.length; i++){
                let d = ar[i];
                d.addEventListener('click', function(){
                    curQuestion.value = d.innerHTML;
                    let q = question_array[parseInt(curQuestion.value) - 1];
                    question.innerHTML = q['question'];
                    answer1.childNodes[1].innerHTML    =   q['answer'][0];
                    answer2.childNodes[1].innerHTML    =   q['answer'][1];
                    answer3.childNodes[1].innerHTML    =   q['answer'][2];
                    answer4.childNodes[1].innerHTML    =   q['answer'][3];
        
                });
            }
            ar[0].click();
            answer_array = Array.apply(null, Array(question_array.length)).map(function () {});
        })
        .catch(function(error){
            console.log(error);
        })
    
});

btnSubmit.addEventListener('click', function(){
    let score = 0;
    for(let i = 0; i < question_array.length; i++)
        if ( answer_array[i] === question_array[i]['trueAnswer'])    
            score++;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/users/exam/updateScore');
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({score}));
    window.location.replace('/');
});