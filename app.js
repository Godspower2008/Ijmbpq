// Centralized Horizontal Navigation
const navigationHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(99, 102, 241, 0.2); position: sticky; top: 0; z-index: 1000;">
        <div class="logo" style="font-weight: 800; font-size: 1.4rem; color: #f8fafc; letter-spacing: 1px;">IJMB<span style="color: #6366f1;">PRO</span></div>
        <div class="nav-links" style="display: flex; gap: 20px; align-items: center;">
            <a href="ijmbpq.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Dashboard</a>
            <a href="subject-physics.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Physics</a>
            <a href="chemistry-2024-theory.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Chemistry</a>
            <a href="admin.html" style="background: #6366f1; color: white; padding: 8px 18px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 0.85rem; transition: 0.3s;">ADMIN</a>
        </div>
    </nav>
`;

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('global-header');
    if (header) header.innerHTML = navigationHTML;
    
    // Auto-active link highlight
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if(window.location.href.includes(link.getAttribute('href'))) {
            link.style.color = "#6366f1";
        }
    });
});