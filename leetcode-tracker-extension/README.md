# 🧩 DSA Mastery Hub - Chrome Extension

This extension runs silently in the background while you solve problems on LeetCode. It listens for successful submissions and automatically beams your stats to the DSA Mastery Hub backend.

## 🔍 How it Works

Because LeetCode is a highly dynamic Single Page Application (SPA), traditional web scraping doesn't work reliably. 

1. **`inject.js`:** This script is injected directly into the page's MAIN world. It intercepts the raw `fetch` network requests made by LeetCode to capture your actual code payload and the "SUCCESS" response from the auto-grader.
2. **`content.js`:** This script lives in the isolated extension world. It waits for messages from `inject.js`. Once a problem is accepted, it parses the DOM (or queries LeetCode's GraphQL API as a fallback) to grab the Problem Title, Difficulty, and Topics.
3. **`background.js`:** The service worker receives the finalized payload from `content.js` and fires a POST request to your backend server to save the data permanently.

## 🛠️ Installation (Developer Mode)

1. Open Google Chrome.
2. Type `chrome://extensions/` in the URL bar.
3. Turn on **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select this exact folder (`leetcode-tracker-extension`).
5. Pin the extension to your toolbar, click on it, and click "Open Dashboard" to view your stats!

*Note: If you make changes to the code, click the "Reload" icon on the extension card and physically refresh your LeetCode browser tab to apply the updates.*
