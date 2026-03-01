// 1. Centralized Navigation HTML
const navigationHTML = `
    <div class="logo">IJMB.PRO</div>
    <a href="index.html" class="nav-item">Dashboard</a>
    <a href="subject-physics.html" class="nav-item">Physics Archive</a>
    <a href="economics-2024-theory.html" class="nav-item">Economics Archive</a>
    <div style="margin-top: 20px; padding: 10px;">
        <input type="text" id="globalSearch" placeholder="Search topics..." 
        style="width:100%; padding:8px; border-radius:5px; border:1px solid #444; background:#0f172a; color:white;">
    </div>
`;

// 2. Inject Navigation into Sidebar
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('aside');
    if (sidebar) {
        sidebar.innerHTML = navigationHTML;
    }

    // 3. Search Logic
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            let query = e.target.value.toLowerCase();
            let cards = document.querySelectorAll('.card, .q-wrapper, .year-row');
            
            cards.forEach(card => {
                let text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? "block" : "none";
            });
        });
    }
});