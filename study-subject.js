auth.onAuthStateChanged(async user => {
    if(!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject') || localStorage.getItem('currentSubject') || "Unknown";
    localStorage.setItem('currentSubject', subject);

    document.querySelector('.subject-title').textContent = subject;

    const questionsList = document.querySelector('.questions-list');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    // Fetch questions from Firebase
    const snapshot = await db.collection('pastQuestions')
                             .where('subject','==',subject)
                             .orderBy('id','asc')
                             .get();
    const totalQuestions = snapshot.size;

    // Fetch user's progress
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const completedQuestions = (userData.completedQuestions && userData.completedQuestions[subject]) || [];

    function updateProgress() {
        const percent = totalQuestions === 0 ? 0 : Math.round((completedQuestions.length / totalQuestions) * 100);
        progressFill.style.width = percent + "%";
        progressText.textContent = percent + "% Completed";
    }

    snapshot.forEach(doc => {
        const q = doc.data();
        const card = document.createElement('div');
        card.className = "question-card";
        if(completedQuestions.includes(q.id)) card.classList.add('completed');
        card.innerHTML = `<strong>Q${q.id}:</strong> ${q.question}`;
        card.onclick = async () => {
            if(card.classList.contains('completed')){
                card.classList.remove('completed');
                const idx = completedQuestions.indexOf(q.id);
                if(idx > -1) completedQuestions.splice(idx,1);
            } else {
                card.classList.add('completed');
                completedQuestions.push(q.id);
            }

            // Save progress
            const update = {};
            update[`completedQuestions.${subject}`] = completedQuestions;
            await db.collection('users').doc(user.uid).update(update);

            updateProgress();
        };
        questionsList.appendChild(card);
    });

    // Initial progress
    updateProgress();
});