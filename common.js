// --- Firebase Init ---
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com",
    projectId: "ijmb-portal"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Auth State & Redirect ---
auth.onAuthStateChanged(user => {
    if(!user){
        window.location.href = "landing.html";
    }
});

// --- Logout ---
function logout(){
    if(firebase && firebase.auth){
        firebase.auth().signOut();
    }
    window.location.href = "landing.html";
}

// --- Hamburger Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger && navLinks){
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }
});

// --- Go Back Helper ---
function goBack(defaultPage = 'dashboard.html') {
    if(history.length > 1){
        history.back();
    } else {
        window.location.href = defaultPage;
    }
}

// --- Go to Subjects Helper ---
function goToSubjects() {
    window.location.href = "/Ijmbpq/subjects.html";
}

// --- Load Dashboard Data ---
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