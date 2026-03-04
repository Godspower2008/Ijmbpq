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
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger && navLinks){
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });
}

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