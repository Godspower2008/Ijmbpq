// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com",
    projectId: "ijmb-portal"
};
// Load Dashboard Data
async function loadDashboard(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) return;

        const data = doc.data();

        // Greeting
        document.getElementById('userGreet').textContent = `Welcome back, ${data.displayName}!`;

        // Continue last session
        const continueCard = document.querySelector('.continue-card p');
        if (data.lastSession) {
            continueCard.textContent = `You were solving ${data.lastSession.subject} – ${data.lastSession.paper}.`;
            document.querySelector('.continue-card button').onclick = () => {
                window.location.href = data.lastSession.url;
            };
        } else {
            document.querySelector('.continue-card').style.display = 'none';
        }

        // Metrics
        const metricCards = document.querySelectorAll('.metric-card .value');
        metricCards[0].textContent = data.streak + " Days";
        metricCards[1].textContent = data.avgAccuracy + "%";
        metricCards[2].textContent = "#" + data.rank;

        // Subject Progress
        document.querySelectorAll('.subject-card').forEach(card => {
            const subject = card.querySelector('h3').textContent;
            const progress = data.progress[subject] || 0;
            const fill = card.querySelector('.progress-fill');
            fill.style.width = progress + "%";
            card.querySelector('small').textContent = progress + "% Completed";
        });
    } catch(err) {
        console.error("Error loading dashboard:", err);
    }
}
