// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Auth Check
auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "landing.html";
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click', ()=>{
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

// Logout
function logout(){
    auth.signOut();
    window.location.href="landing.html";
}

// Animate progress bars
window.addEventListener('load', () => {
    document.querySelectorAll(".progress-fill").forEach(bar=>{
        bar.style.width = bar.dataset.progress + "%";
    });
});

// Back button
function goBack() {
    if (history.length > 1) history.back();
    else window.location.href = 'dashboard.html';
}