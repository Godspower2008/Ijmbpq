// 1. Centralized Horizontal Navigation HTML
const navigationHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(99, 102, 241, 0.2); position: sticky; top: 0; z-index: 1000;">
        <div class="logo" style="font-weight: 800; font-size: 1.4rem; color: #f8fafc;">IJMB<span style="color: #6366f1;">PRO</span></div>
        <div class="nav-links" style="display: flex; gap: 20px; align-items: center;">
            <a href="ijmbpq.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Dashboard</a>
            <a href="subject-physics.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Physics</a>
            <a href="chemistry-2024-theory.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Chemistry</a>
            <a href="admin.html" style="background: #6366f1; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.8rem;">Admin</a>
        </div>
    </nav>
`;

// 2. Inject Navigation into Header
document.addEventListener("DOMContentLoaded", () => {
    const headerElement = document.getElementById('global-header');
    if (headerElement) {
        headerElement.innerHTML = navigationHTML;
    }
});