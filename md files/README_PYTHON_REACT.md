# LeetCode AI Tracker (Full Stack Edition) 🚀

A comprehensive, intelligent platform that automatically intercepts your LeetCode submissions, analyzes the code complexity using Google's Gemini AI, and tracks your progress across a custom React Dashboard.

---

## 🏗 Architecture Overview

The system has been upgraded to a modern, robust full-stack architecture consisting of three main components:

1. **Python FastAPI Backend (`leetcode-tracker-backend-python/`)**
   - Built with the lightning-fast FastAPI framework.
   - Secure User Registration and Login using `bcrypt` password hashing and `JWT` tokens.
   - Connects asynchronously to MongoDB Atlas using `motor`.
   - Uses the `google-generativeai` SDK to evaluate your exact code, calculate Time (Big-O) & Space complexity, and generate 3 personalized problem recommendations.

2. **React Vite Frontend (`leetcode-tracker-frontend/`)**
   - A stunning, dark-mode web application built with React and styled with TailwindCSS.
   - Features a protected Dashboard that visualizes your Skill Profile progress (e.g., Arrays, Hash Tables, DP).
   - Displays a comprehensive table of all your historical submissions and runtimes.

3. **Chrome Extension (`leetcode-tracker-extension/`)**
   - A custom Manifest V3 extension that injects into LeetCode's environment.
   - Features a popup UI for you to log in securely.
   - Silently intercepts the `/submit/` network requests, grabs your code, attaches your secret JWT token, and fires the payload to the Python backend.

---

## 🛠 Prerequisites

Before running the project locally, ensure you have the following installed:
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)
- A Google Gemini API Key
- A MongoDB Atlas Connection String

---

## 🚀 How to Run Locally

Because this is a decoupled full-stack app, you will need to run the Backend and the Frontend in two separate terminals.

### Step 1: Start the Python Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd "d:/Project for fun/leetcode-tracker-backend-python"
   ```
2. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn motor passlib[bcrypt] python-jose[cryptography] google-generativeai pydantic pydantic-settings python-dotenv
   ```
3. Make sure your `.env` file is present in this folder with `GEMINI_API_KEY`, `MONGODB_URI`, and `SECRET_KEY`.
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   *(The backend will now be running on `http://127.0.0.1:8000`)*

### Step 2: Start the React Frontend
1. Open a **new** terminal and navigate to the frontend folder:
   ```bash
   cd "d:/Project for fun/leetcode-tracker-frontend"
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Look at the terminal output and click the `http://localhost:5173/` link to open your Dashboard.
4. Create an account and log in!

### Step 3: Connect the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Ensure **Developer mode** is enabled (top right).
3. Click the **Reload** button if the extension is already loaded, otherwise click **Load unpacked** and select the `leetcode-tracker-extension` folder.
4. Click the new puzzle piece icon in your Chrome toolbar and pin the LeetCode Tracker.
5. Click the icon to open the popup, log in with the exact same Email and Password you used on the React Dashboard.
6. Go to LeetCode, solve a problem, and watch it instantly appear on your React Dashboard!
