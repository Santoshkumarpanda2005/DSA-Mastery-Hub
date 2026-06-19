# 🚀 DSA Master Hub

An intelligent, fully-automated LeetCode tracking platform designed to help you master Data Structures and Algorithms. 

This project consists of three main components that work together to seamlessly intercept your LeetCode submissions, analyze your code using Google's Gemini AI, and visualize your progress on a beautiful web dashboard.

## **Live Demo**

The application is deployed and accessible at:

**🌐 Website: https://dsa-mastery-hub1.onrender.com/**

## 🌟 Ecosystem Overview

1. **[Chrome Extension](./leetcode-tracker-extension/)**
   - Automatically intercepts successful LeetCode submissions directly from your browser.
   - Extracts problem details (Title, Difficulty, Topics, Execution Time, Memory).
   - Sends the data silently to the backend—no manual data entry required!

2. **[Node.js Backend](./leetcode-tracker-backend/)**
   - Built with Express and MongoDB.
   - Handles authentication and user profiles.
   - Integrates with **Google Gemini AI** to automatically calculate the **Time and Space Complexity (Big O)** of your submitted code and suggest 3 related problems to practice next.

3. **[React Frontend](./leetcode-tracker-frontend/)**
   - A stunning, dark-mode optimized React/Vite dashboard.
   - Visualizes your total solved problems, recent activity, and provides a radar chart of your skill profile across different topics (e.g., Arrays, Trees, Dynamic Programming).

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose, Google Generative AI SDK, JSON Web Tokens (JWT)
- **Extension:** Manifest V3, Vanilla JavaScript, Chrome APIs

## 🚀 Quick Start

To run this project locally, you will need to start both the backend and frontend servers, and load the extension into your browser.

**1. Start the Backend:**
```bash
cd leetcode-tracker-backend
npm install
node server.js
```

**2. Start the Frontend:**
```bash
cd leetcode-tracker-frontend
npm install
npm run dev
```

**3. Load the Extension:**
- Open Chrome and navigate to `chrome://extensions/`
- Enable **Developer mode**
- Click **Load unpacked** and select the `leetcode-tracker-extension` folder.
