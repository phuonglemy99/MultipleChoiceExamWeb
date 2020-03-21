let lstButton = document.getElementsByTagName('button');
let lstForm = document.querySelectorAll("#user-exam form");
let lstLi = document.getElementsByClassName('exam-item');

for(let i = 0; i < lstButton.length; i++)
{
    lstButton[i].addEventListener('click', function(){
        window.location.replace('/exams/' + lstForm[i].firstChild.id + '/delete');
    });

    lstLi[i].addEventListener('click', function(e){
        if (e.target !== this)
            return;
        window.location.replace('/exams/' + lstForm[i].firstChild.id + '/edit');
    });   

}