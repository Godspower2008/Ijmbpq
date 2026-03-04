// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com"
};


// study.js

window.addEventListener('load', () => {
    // Animate progress bars
    document.querySelectorAll(".progress-fill").forEach(bar => {
        const progress = bar.dataset.progress || 0;
        bar.style.width = progress + "%";
    });
});