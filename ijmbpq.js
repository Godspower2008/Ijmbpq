// --- Load Dashboard ---
auth.onAuthStateChanged(async user => {
if(!user) return;

await loadDashboard(user.uid);
await loadTopScholars();

});

async function loadDashboard(userId) {
try {
const doc = await db.collection('users').doc(userId).get();
if (!doc.exists) return;

    const data = doc.data();

    // Greeting
    document.getElementById('userGreet').textContent =
    `Welcome back, ${data.displayName || "Scholar"}!`;

    // Continue last session
    const continueCard = document.querySelector('.continue-card');
    const continueText = continueCard.querySelector('p');
    const continueBtn = continueCard.querySelector('button');

    if (data.lastSession) {
        continueText.textContent =
        `You were solving ${data.lastSession.subject} – ${data.lastSession.paper}.`;

        continueBtn.onclick = () => {
            window.location.href = data.lastSession.url || "#";
        };

        continueCard.style.display = "block";
    } else {
        continueCard.style.display = "none";
    }

    // Metrics
    const metricCards = document.querySelectorAll('.metric-card .value');

    metricCards[0].textContent = (data.streak || 0) + " Days";
    metricCards[1].textContent = (data.avgAccuracy || 0) + "%";
    metricCards[2].textContent = "#" + (data.rank || "-");

    // Subject Progress with Animation
    document.querySelectorAll('.subject-card').forEach(card => {

        const subject = card.querySelector('h3').textContent;

        const progress =
        (data.progress && data.progress[subject]) || 0;

        const fill = card.querySelector('.progress-fill');

        card.querySelector('small').textContent =
        progress + "% Completed";

        // Animation
        fill.style.width = "0%";

        setTimeout(() => {
            fill.style.transition = "width 1.2s ease";
            fill.style.width = progress + "%";
        }, 100);

    });

} catch(err) {
    console.error("Error loading dashboard:", err);
}

}

// --- Load Top Scholars ---
async function loadTopScholars() {

try {

    const sidebar = document.querySelector('.sidebar-card');

    if(!sidebar) return;

    sidebar.querySelectorAll('.rank-item')
    .forEach(el => el.remove());

    const snapshot = await db.collection('topScholars')
    .orderBy('points', 'desc')
    .limit(5)
    .get();

    snapshot.forEach((doc, index) => {

        const data = doc.data();

        const medal =
        index === 0 ? "🥇" :
        index === 1 ? "🥈" :
        index === 2 ? "🥉" : "🏅";

        const div = document.createElement('div');

        div.className = "rank-item";

        div.innerHTML =
        `<span>${medal} ${data.name}</span>
         <b>${data.points} pts</b>`;

        sidebar.appendChild(div);

    });

} catch(err) {
    console.error("Error loading top scholars:", err);
}

}