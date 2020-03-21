const btnComplete = document.getElementById('btn-complete');
const btnAddExam = document.getElementById('btn-addQuestion');
const txtValue = document.getElementById('text-value');

// question information
const questionText = document.getElementById('text-question');
const answer1 = document.getElementById('answer-1');
const answer2 = document.getElementById('answer-2');
const answer3 = document.getElementById('answer-3');
const answer4 = document.getElementById('answer-4');
const trueAnswer = document.getElementById('true-answer');

// basic information
const titleExam = document.getElementById('title-exam');
const subjectExam = document.getElementById('subject-exam');
const typeExam = document.getElementById('type-exam');
const dateExam = document.getElementById('date-exam');


function generateObjecQuestion(question, trueAnswer,  ...a){
    return { question, trueAnswer, answer: [...a]};
}

let question_details = {
    "questions": []
};

btnAddExam.addEventListener('click', function(){
    question_details['questions'].push(generateObjecQuestion(questionText.value,
                                                                trueAnswer.value, answer1.value, answer2.value, 
                                                                answer3.value, answer4.value));
    questionText.value = "";
    answer1.value = "";
    answer2.value = "";
    answer3.value = "";
    answer4.value = "";
})


btnComplete.addEventListener('click', function(){
    question_details["title"] = titleExam.value;
    question_details["subject"] = subjectExam.value;
    question_details["type"] = typeExam.value;
    question_details["date"] = dateExam.value;

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/users/addExam/add');
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(question_details));

    window.location.replace("/");
});