// Wait for DOM + Auth
auth.onAuthStateChanged(async user => {
    if(!user) return;

    const subjects = ["Mathematics","Physics","Chemistry","Biology","Economics"];
    const subjectsList = document.querySelector('.subjects-list');

    // Fetch user progress from Firestore
    const doc = await db.collection('users').doc(user.uid).get();
    const data = doc.exists ? doc.data() : {};

    subjects.forEach(sub => {
        const progress = data.progress && data.progress[sub] ? data.progress[sub] : 0;

        const card = document.createElement('div');
        card.className = "subject-card";
        card.innerHTML = `
            <h3>${sub}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width:0%"></div>
            </div>
            <small>${progress}% Completed</small>
        `;
        card.onclick = () => {
            localStorage.setItem('currentSubject', sub);
            window.location.href = `study-subject.html?subject=${sub}`;
        };
        subjectsList.appendChild(card);

        // Animate progress
        setTimeout(() => {
            card.querySelector('.progress-fill').style.width = progress + "%";
        }, 100);
    });
});