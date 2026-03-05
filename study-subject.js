auth.onAuthStateChanged(async user => {
    if(!user) return;

    const subject = localStorage.getItem('currentSubject') || "Physics";
    document.querySelector('.subject-title').textContent = subject;

    const questionsList = document.querySelector('.questions-list');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    // Load questions from Firebase Realtime Database
    const snapshot = await db.ref('questions/' + subject).get();
    const questions = snapshot.val() || {};
    const questionIds = Object.keys(questions);

    // Load user's completed questions
    const userSnapshot = await db.ref('users/' + user.uid + '/completedQuestions/' + subject).get();
    const completedQuestions = userSnapshot.val() || [];

    function updateProgress() {
        const percent = questionIds.length === 0 ? 0 : Math.round((completedQuestions.length / questionIds.length) * 100);
        progressFill.style.width = percent + "%";
        progressText.textContent = percent + "% Completed";
    }

    questionIds.forEach(id => {
        const q = questions[id];
        const card = document.createElement('div');
        card.className = "question-card";
        if(completedQuestions.includes(id)) card.classList.add('completed');

        card.innerHTML = `<strong>Q:</strong> ${q.text}<br><em>Marks: ${q.marks}</em>
                          <details><summary>Solution</summary>${q.solution}</details>`;

        card.onclick = async () => {
            if(card.classList.contains('completed')){
                card.classList.remove('completed');
                const idx = completedQuestions.indexOf(id);
                if(idx > -1) completedQuestions.splice(idx,1);
            } else {
                card.classList.add('completed');
                completedQuestions.push(id);
            }
            await db.ref('users/' + user.uid + '/completedQuestions/' + subject).set(completedQuestions);
            updateProgress();
        };
        questionsList.appendChild(card);
    });

    updateProgress();
});