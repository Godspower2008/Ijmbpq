// Standard Exam
function startStandardExam(subjects){
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', 180); // 3 hours
    localStorage.setItem('numQuestions', 30);
    window.location.href='exam-questions.html';
}

// Custom Exam
document.addEventListener('DOMContentLoaded', () => {
    const subjectCards = document.querySelectorAll('.custom-subjects .subject-card');
    const timeSlider = document.getElementById('examTimeSlider');
    const timeLabel = document.getElementById('timeLabel');
    const questionsSlider = document.getElementById('numQuestionsSlider');
    const questionsLabel = document.getElementById('questionsLabel');

    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const selected = document.querySelectorAll('.custom-subjects .subject-card.selected');
            if(selected.length > 3) card.classList.remove('selected'); // max 3
        });
    });

    timeSlider.addEventListener('input', () => timeLabel.textContent = timeSlider.value);
    questionsSlider.addEventListener('input', () => questionsLabel.textContent = questionsSlider.value);
});

// Start Custom Exam
function startCustomExam(){
    const subjects = Array.from(document.querySelectorAll('.custom-subjects .subject-card.selected'))
                          .map(c => c.dataset.subject);
    if(subjects.length === 0){
        alert("Select at least 1 subject");
        return;
    }
    const time = parseInt(document.getElementById('examTimeSlider').value) * 60; // convert to minutes
    const questions = parseInt(document.getElementById('numQuestionsSlider').value);
    localStorage.setItem('examSubjects', JSON.stringify(subjects));
    localStorage.setItem('examTime', time);
    localStorage.setItem('numQuestions', questions);
    window.location.href='exam-questions.html';
}