# 🎨 DSA Mastery Hub - Frontend Dashboard

The beautiful, responsive, user-facing dashboard for the DSA Mastery Hub ecosystem. Built with React, Vite, and Tailwind CSS, it visualizes the LeetCode data collected by the Chrome extension.

## ✨ Features

- **Auth System:** Secure JWT-based Login and Registration.
- **Dynamic Profile:** Update your personal info, links, and avatar.
- **Analytics Dashboard:** 
  - Radar charts visualizing your skill levels across different algorithm topics.
  - Counters for Total Solved, Easy, Medium, and Hard problems.
  - A timeline of your recent activity and AI-generated complexity analysis.
- **Dark Mode:** Built-in theme toggling for late-night coding sessions.

## 🛠️ Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   By default, the API URLs are pointed to the production Render backend (`https://dsa-mastery-hub.onrender.com`). If you want to test locally, update the `axios` calls in the pages to point to `http://localhost:5000`.

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` in your browser.

## 📦 Build for Production
```bash
npm run build
```
This will generate a `dist` folder ready to be deployed to Vercel, Netlify, or Render.
