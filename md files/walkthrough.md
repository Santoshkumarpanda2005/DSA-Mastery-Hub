# LeetCode Tracker - Completed! 🎉

I have successfully created both the Chrome Extension and the Backend for tracking your LeetCode problem solving, along with the AI integration for Big-O notation analysis.

## What was built

1. **Chrome Extension (`leetcode-tracker-extension/`)**:
   - `manifest.json`: Configuration allowing tabs, scripting, and cross-origin fetching to localhost.
   - `background.js`: Listens for messages from the content script and forwards them to the Node backend.
   - `content.js`: Monitors LeetCode DOM changes to extract problem name, difficulty, tags, run times, memory usage, and extracts the code editor text.

2. **Backend Server (`leetcode-tracker-backend/`)**:
   - `server.js`: Express server that handles the `POST /api/activity` endpoint.
   - It takes the received code and sends a prompt to the `gemini-2.5-flash` model to analyze the time and space complexity.
   - The combined data is saved to a local `database.json` file.

## How to use and verify

> [!IMPORTANT]
> **API Key Required**: You must add your Gemini API Key to the `leetcode-tracker-backend/.env` file before the AI complexity analysis will work.
> Example:
> `GEMINI_API_KEY=AIzaSy...`

### Step 1: Start the Backend
1. Open a new terminal in VS Code.
2. Navigate to the backend directory:
   ```bash
   cd "d:/Project for fun/leetcode-tracker-backend"
   ```
3. Start the server:
   ```bash
   node server.js
   ```

### Step 2: Install the Chrome Extension
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top right corner).
3. Click **Load unpacked**.
4. Select the `d:/Project for fun/leetcode-tracker-extension` folder.

### Step 3: Test on LeetCode
1. Go to any [LeetCode Problem](https://leetcode.com/problems/two-sum/).
2. Write a solution and click **Submit**.
3. Once the result shows "Accepted", check your backend terminal. You should see it receive the problem data, call the AI, and save the result!
4. Check the `database.json` in your backend folder to see the logged JSON data.
