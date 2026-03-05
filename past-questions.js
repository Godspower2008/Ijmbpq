auth.onAuthStateChanged(async user => {
    if(!user) return;

    const subject = localStorage.getItem('currentSubject');
    if(!subject) {
        alert("No subject selected.");
        window.location.href = "study.html";
        return;
    }

    document.getElementById('subjectTitle').textContent = subject;

    try {
        const snapshot = await db.collection('pastQuestions')
                                 .where('subject', '==', subject)
                                 .orderBy('year', 'desc')
                                 .get();

        const container = document.getElementById('questionsList');
        container.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'question-card';
            div.innerHTML = `
                <h3>${data.year} ${data.type}</h3>
                <small>${data.description || "No description available"}</small>
            `;
            div.onclick = () => {
                // Open the question PDF or page
                window.open(data.url, "_blank");
            };
            container.appendChild(div);
        });

        if(snapshot.empty){
            container.innerHTML = '<p>No past questions found for this subject.</p>';
        }
    } catch(err){
        console.error("Error loading past questions:", err);
        document.getElementById('questionsList').innerHTML = '<p>Failed to load questions.</p>';
    }
});