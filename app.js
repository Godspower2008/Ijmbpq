// Centralized Horizontal Navigation HTML
const navigationHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(99, 102, 241, 0.2); position: sticky; top: 0; z-index: 1000;">
        <div class="logo" style="font-weight: 800; font-size: 1.4rem; color: #f8fafc; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">IJMB<span style="color: #6366f1;">PRO</span></div>
        <div class="nav-links" style="display: flex; gap: 20px; align-items: center;">
            <a href="ijmbpq.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;">Dashboard</a>
            <a href="subject-physics.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;">Physics</a>
            <a href="chemistry-2024-theory.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;">Chemistry</a>
            <a href="admin.html" style="background: #6366f1; color: white; padding: 8px 18px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s;">ADMIN</a>
        </div>
    </nav>
`;

// Inject the Navigation into any page with a <header id="global-header">
document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('global-header');
    if (header) {
        header.innerHTML = navigationHTML;
    }

    // Optional: Highlight the active page link
    const links = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.split('/').pop();
    
    links.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.style.color = "#6366f1";
        }
    });
});