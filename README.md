# 🚀 PDA Simulator

An interactive **Pushdown Automaton (PDA) simulator** built using React that allows users to define, visualize, and simulate PDAs step-by-step.

---

## 📌 Overview

This project is designed to help understand how **Pushdown Automata recognize context-free languages**.
Users can create their own PDA or use predefined examples and observe how the stack and transitions change during execution.

---

## ✨ Features

### 🧠 Core Functionality

* Define **states (Q)**, **input alphabet (Σ)**, and **stack alphabet (Γ)**
* Add and edit **transition functions**
* Support for **ε (epsilon) transitions**
* Perform **step-by-step simulation**
* Supports:

  * **Acceptance by final state**
  * **Acceptance by empty stack**

---

### 📊 Visualization

* Interactive **state diagram** using graph visualization
* **Stack visualization** (push/pop operations clearly shown)
* **Input tape** with current symbol highlighting
* **Active state and transition highlighting**

---

### ⚡ Simulation Controls

* Start simulation
* Step forward
* Auto-run mode
* Reset simulation

---

### 🧪 Predefined Examples

* aⁿbⁿ language
* Balanced parentheses
* Palindromes
* Equal number of a’s and b’s
* More examples included

---

### 📝 Additional Features

* Example input suggestions (valid/invalid)
* Simulation logs showing step-by-step configurations
* Clean and modern UI

---

## 🛠️ Tech Stack

* **React (TypeScript)**
* **Vite**
* **React Flow** (for diagram visualization)
* **Tailwind CSS**
* **Lucide Icons**

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone <your-repo-link>
cd pda-simulator
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 📷 Usage

1. Load a sample PDA or define your own
2. Enter an input string
3. Start simulation
4. Observe:

   * Current state
   * Stack changes
   * Applied transitions
5. Check whether the string is accepted or rejected

---

## 🎯 Learning Outcomes

* Understanding of **Pushdown Automata**
* Visualization of **stack operations**
* Insight into **context-free language recognition**
* Hands-on interaction with automata theory concepts

---

## 👩‍💻 Author

**Khushi Roy**

---

## 📌 Future Improvements

* Support for full **nondeterministic PDA branching**
* Export/import PDA definitions as JSON
* More complex language examples
* Performance optimization for large inputs

---

## ⭐ Acknowledgement

This project was built as part of an academic assignment to better understand theoretical computer science concepts through visualization.

---
