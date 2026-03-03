# IJMB Pro-Archive (Official 2026 Edition)

A premium, high-ticket theoretical portal designed for IJMB candidates. This platform provides professional marking schemes, visual solutions, and a real-time competitive leaderboard to gamify the learning experience.

---

## 🚀 Key Features
* **Authentication & Security:** Premium login system with email verification and compulsory data collection (Name/Combination).
* **Dynamic Theory Archives:** Automated science archives for Physics, Chemistry, and Biology using MathJax for high-fidelity formula rendering.
* **Admin Control Center:** A secure `admin.html` page to upload new questions and marking schemes directly to the Firebase database.
* **Leaderboard System:** Real-time ranking of students based on their "Points Earned" by solving theoretical questions.

---

## 📂 Master File Directory
| File Name | Purpose |
| :--- | :--- |
| `landing.html` | **The Gate:** High-converting sales page + Signup/Login modal. |
| `ijmbpq.html` | **The Hub:** Main student dashboard and global leaderboard. |
| `admin.html` | **The Controller:** Secret page for uploading theoretical content. |
| `subject-[name].html` | **The Vaults:** Subject-specific archives (Physics, Math, etc.). |
| `app.js` | **The Brain:** Handles sidebar navigation and global search logic. |

---

## 🛠 Setup & Configuration
1.  **Firebase Connection:** All files are linked to the `ijmb-portal` project.
2.  **Database Rules:** Ensure your Firebase Realtime Database rules allow reading for authenticated users:
    ```json
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```
3.  **Content Management:** Use `admin.html` to push new content. Do not manually edit the JSON in Firebase to avoid formatting errors.

---

## ⚖️ Pricing Model
The platform is designed to be sold as a premium service (e.g., ₦15,000/session).
* **Free Tier:** Landing page access.
* **Premium Tier:** Full access to solved archives and the Leaderboard.

---

## 📞 Technical Support
For database resets or student verification issues, contact the system administrator via the link in `contact.html`.