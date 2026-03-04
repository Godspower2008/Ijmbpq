// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com"
};

// Standard Exam
function startStandardExam(subjects){
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', 180);
    localStorage.setItem('numQuestions', 30);
    window.location.href='exam-questions.html';
}

// Custom Exam
const subjectCards = document.querySelectorAll('.custom-subjects .subject-card');
subjectCards.forEach(card=>{
    card.addEventListener('click', ()=>{
        card.classList.toggle('selected');
        const selected = document.querySelectorAll('.custom-subjects .subject-card.selected');
        if(selected.length>3) card.classList.remove('selected'); // max 3
    });
});

const timeSlider = document.getElementById('examTimeSlider');
const timeLabel = document.getElementById('timeLabel');
timeSlider.addEventListener('input', ()=>timeLabel.textContent = timeSlider.value);

const questionsSlider = document.getElementById('numQuestionsSlider');
const questionsLabel = document.getElementById('questionsLabel');
questionsSlider.addEventListener('input', ()=>questionsLabel.textContent = questionsSlider.value);

function startCustomExam(){
    const subjects = Array.from(document.querySelectorAll('.subject-card.selected')).map(c=>c.dataset.subject);
    if(subjects.length===0){ alert("Select at least 1 subject"); return; }
    const time = parseInt(timeSlider.value)*60;
    const questions = parseInt(questionsSlider.value);
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', time);
    localStorage.setItem('numQuestions', questions);
    window.location.href='exam-questions.html';
}
