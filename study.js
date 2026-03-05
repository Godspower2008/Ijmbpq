// Wait for auth and page load
auth.onAuthStateChanged(async user => {
    if(!user) return;
    await loadStudyData(user.uid);
});

// Load user's study progress
async function loadStudyData(userId){
    try {
        const doc = await db.collection('users').doc(userId).get();
        if(!doc.exists) return;

        const data = doc.data();

        // Greeting
        document.getElementById('userGreet').textContent = `Welcome back, ${data.displayName || "Scholar"}!`;

        // Update progress bars
        document.querySelectorAll('.subject-card').forEach(card => {
            const subject = card.dataset.subject;
            const progress = (data.progress && data.progress[subject]) || 0;
            const fill = card.querySelector('.progress-fill');
            const small = card.querySelector('small');

            fill.style.width = "0%";
            setTimeout(()=>{
                fill.style.transition = "width 1s ease";
                fill.style.width = progress + "%";
            }, 100);

            small.textContent = progress + "% Completed";

            // Clicking card could go to the past questions page for that subject
            card.onclick = () => {
                localStorage.setItem('currentSubject', subject);
                window.location.href = 'past-questions.html';
            };
        });
    } catch(err){
        console.error("Error loading study data:", err);
    }
}