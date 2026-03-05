// exam.js

// ============================
// START STANDARD EXAM
// ============================
function startStandardExam(subjects){

    // Save exam settings
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', 180); // 3 hours
    localStorage.setItem('numQuestions', 30);

    // Go to exam page
    window.location.href = 'exam-questions.html';
}


// ============================
// PAGE INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {

    const subjectCards = document.querySelectorAll('.custom-subjects .subject-card');
    const timeSlider = document.getElementById('examTimeSlider');
    const timeLabel = document.getElementById('timeLabel');
    const questionsSlider = document.getElementById('numQuestionsSlider');
    const questionsLabel = document.getElementById('questionsLabel');


    // ============================
    // SUBJECT SELECTION
    // ============================
    subjectCards.forEach(card => {

        card.addEventListener('click', () => {

            card.classList.toggle('selected');

            const selected = document.querySelectorAll('.custom-subjects .subject-card.selected');

            // Maximum 3 subjects
            if(selected.length > 3){
                card.classList.remove('selected');
            }

        });

    });


    // ============================
    // SLIDER LABELS UPDATE
    // ============================
    if(timeSlider && timeLabel){

        timeLabel.textContent = timeSlider.value;

        timeSlider.addEventListener('input', () => {
            timeLabel.textContent = timeSlider.value;
        });

    }

    if(questionsSlider && questionsLabel){

        questionsLabel.textContent = questionsSlider.value;

        questionsSlider.addEventListener('input', () => {
            questionsLabel.textContent = questionsSlider.value;
        });

    }

});


// ============================
// START CUSTOM EXAM
// ============================
function startCustomExam(){

    const selectedCards = document.querySelectorAll('.custom-subjects .subject-card.selected');

    const subjects = Array.from(selectedCards).map(card => card.dataset.subject);

    if(subjects.length === 0){
        alert("Select at least 1 subject");
        return;
    }

    const time = parseInt(document.getElementById('examTimeSlider').value) * 60;
    const questions = parseInt(document.getElementById('numQuestionsSlider').value);

    // Save settings
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', time);
    localStorage.setItem('numQuestions', questions);

    // Redirect
    window.location.href = 'exam-questions.html';
}