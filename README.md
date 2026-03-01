# IJMB Pro-Archive Portal 📚

Welcome to the **IJMB Pro-Archive**, a high-performance, mobile-responsive web portal designed to provide Nigerian A-Level students with solved theory and objective past questions.

## 🚀 Quick Access
To view the website locally on your computer:
1. **[Click here to open the Homepage](index.html)**
2. Alternatively, right-click `index.html` and select **"Open with Google Chrome"** (or any modern browser).

---

## 📂 Project Structure
This repository contains the core templates for the IJMB portal:

* `index.html` - The main dashboard and subject selection area.
* `subject-physics.html` - The archive listing sorted by year and paper type.
* `physics-2024-theory.html` - The specialized study mode for theory questions.
* `images/` - (Folder) Stores all diagrams for science and math solutions.

---

## 🛠 Features for Students
* **Study Mode:** Toggle-based solutions to encourage active recall.
* **Marking Scheme:** Step-by-step mark distribution (e.g., [2 Marks] for definitions).
* **Math Support:** High-quality rendering of complex formulas using MathJax.
* **Dark Aesthetic:** Designed for long study hours and reduced eye strain.

---

## 📝 How to Add New Questions
To add a new theory question, open the relevant paper file and use this structure:

```html
<div class="q-box">
    <p><strong>Question X:</strong> Your question text here.</p>
    <div class="ans-content">
        <p><span class="mark">[X Marks]</span> <strong>Step 1:</strong> Solution text.</p>
    </div>
</div>