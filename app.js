const navigationHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); position: sticky; top: 0; z-index: 1000;">
        <div class="logo" style="font-weight: 800; font-size: 1.4rem; color: #f8fafc; letter-spacing: 1px;">IJMB<span style="color: #6366f1;">PRO</span></div>
        <div class="nav-links" style="display: flex; gap: 20px; align-items: center;">
            <a href="ijmbpq.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.85rem;">Dashboard</a>
            <a href="subject-physics.html" style="color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 0.85rem;">Archives</a>
            <button onclick="logout()" style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; font-size: 0.75rem;">LOGOUT</button>
        </div>
    </nav>
`;

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('global-header');
    if (header) header.innerHTML = navigationHTML;
});

function logout() {
    if(confirm("Logout from portal?")) {
        firebase.auth().signOut().then(() => { window.location.href = "landing.html"; });
    }
}