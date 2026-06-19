# ⚙️ DSA Mastery Hub - API Backend

The central nervous system of the DSA Mastery Hub. This Node.js/Express server acts as the bridge between the Chrome Extension, the MongoDB database, and the Frontend Dashboard.

## 🧠 AI Integration
This backend features a direct integration with **Google's Gemini AI**. When the Chrome extension POSTs a new successful LeetCode submission to the `/api/activity` route, the backend prompts Gemini to analyze the user's raw code. 
Gemini automatically calculates the **Time Complexity**, **Space Complexity**, and provides 3 targeted follow-up problem recommendations based on the current problem's topics.

## 🚀 Features
- **JWT Authentication:** Secure user registration, login, and protected routes.
- **Activity Tracking:** Deduplicates and logs user submissions. Resubmissions of the same problem accumulate time and attempts without creating messy duplicate records.
- **Skill Profiling:** Automatically builds a skill profile (e.g., Arrays: 5 pts, Trees: 2 pts) based on the topics of the problems the user solves.

## 🛠️ Environment Variables
Create a `.env` file in the root of this folder with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

## 🏃 Running the Server
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start the Server:**
   ```bash
   node server.js
   ```
   The API will be available at `http://localhost:5000`.