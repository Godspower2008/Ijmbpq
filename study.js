// Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
    authDomain: "ijmb-portal.firebaseapp.com"
};


// Animate progress bars
window.addEventListener('load', () => {
    document.querySelectorAll(".progress-fill").forEach(bar=>{
        bar.style.width = bar.dataset.progress + "%";
    });
});