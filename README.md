# IJMB Pro-Archive Portal 📚

A high-performance web portal for IJMB students featuring cloud-synced theory solutions, marking schemes, and real-time search.

## 🚀 Quick Access
* **[View Student Dashboard](index.html)** - Start here to browse subjects.
* **[Admin Control Panel](admin.html)** - 🔐 Private: Use this to upload new questions and solutions to Firebase.

---

## 🛠 Project Structure
* `index.html` - The main entry point for students.
* `admin.html` - Secure interface connected to **Firebase Realtime Database**.
* `app.js` - The "Global Brain" handling navigation, search, and shared UI components.
* `subject-physics.html` - Example subject page using the **Live Viewer** script.

---

## 🧪 Adding Theory Content
When using the Admin Panel, follow these tips for high-quality theory answers:

1. **Marking Schemes:** Always include mark distribution using the `[X Marks]` format.
2. **Mathematical Formulas:** Use LaTeX syntax for equations, e.g., `$$PV = nRT$$`.
3. **Diagrams:** Since IJMB theory is visual, include images by pasting a link in the solution box:
   `<img src="your-image-url.png" style="width:100%; border-radius:10px;">`

---

## 📡 Database Management
This project is powered by **Firebase**. 
- **Database:** Realtime Database (JSON format).
- **Authentication:** Email/Password login required for `admin.html`.
- **Hosting:** Can be hosted on GitHub Pages or Firebase Hosting.

---

## ⚠️ Security Reminder
The `admin.html` file is your "backdoor." Ensure your Firebase Security Rules are set to only allow **Authenticated Users** to write data, while allowing **Public** read access for students.