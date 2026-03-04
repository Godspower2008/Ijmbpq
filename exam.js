// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Auth Check
auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "landing.html";
});

// Logout
function logout(){ 
    auth.signOut(); 
    window.location.href="landing.html"; 
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
});

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

// Back button
function goBack() {
    if (history.length > 1) history.back();
    else window.location.href = 'dashboard.html';
}