const btnComplete = document.getElementById('btn-complete');
const btnAddExam = document.getElementById('btn-addQuestion');
const btnLoadContent = document.getElementById('btn-loadContent');
const examId = document.getElementById('examId');
// question information
const questionText = document.getElementById('text-question');
const answer1 = document.getElementById('answer-1');
const answer2 = document.getElementById('answer-2');
const answer3 = document.getElementById('answer-3');
const answer4 = document.getElementById('answer-4');
const trueAnswer = document.getElementById('true-answer');

function generateObjecQuestion(question, trueAnswer,  ...a){
    return { question, trueAnswer, answer: [...a]};
}

let old_question = [];
let count = 0;

let question_details = {
    "questions": []
};

function loadContent(q){
    questionText.value = q['question'];
    answer1.value = q['answer'][0];
    answer2.value = q['answer'][1];
    answer3.value = q['answer'][2];
    answer4.value = q['answer'][3];
    trueAnswer.value = q['trueAnswer'];
}

btnLoadContent.addEventListener('click', function(event){
    console.log(`/exams/${examId.value}/content`);
    fetch(`/exams/${examId.value}/content`)
    .then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        question_details["title"] = data['title'];
        question_details["subject"] = data['subject'];
        question_details["type"] = data['type'];
        question_details["date"] = data['data'];
        old_question = data['questions'];
        loadContent(old_question[count]);
    })
    .catch(function(error){
        console.log(error);
    })
})


btnAddExam.addEventListener('click', function(){
    count++;
    question_details['questions'].push(generateObjecQuestion(questionText.value,
                                                                trueAnswer.value, answer1.value, answer2.value, 
                                                                answer3.value, answer4.value));
    if(count >= old_question.length){
        btnComplete.style.display = 'block';
        return;
    }   
    loadContent(old_question[count])
})


btnComplete.addEventListener('click', function(){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/exams/'+ examId.value +'/update');
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(question_details));

    window.location.replace("/");
});