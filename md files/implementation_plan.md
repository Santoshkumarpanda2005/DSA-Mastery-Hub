# LeetCode Tracker Extension & AI Backend

This plan outlines the development of a Chrome extension that tracks a user's LeetCode activity and a backend server that analyzes the solved code using the Gemini API to determine its time and space complexity.

## User Review Required

> [!WARNING]
> The backend requires a Gemini API key to evaluate the Big-O time and space complexity of the code. We will need to set this up as an environment variable in the backend.

## Open Questions

> [!IMPORTANT]
> 1. **Database:** Should the backend store the tracking data in a simple JSON file, SQLite, or a specific database like MongoDB? (I will use a simple JSON file or SQLite by default if none is specified).
> 2. **Code Extraction:** LeetCode's DOM structure can be tricky for extracting the exact written code. The extension will use DOM selectors to pull the code from the Monaco editor lines. Are you okay with this approach?
> 3. **UI/Popup:** Do you want a simple popup UI when clicking the extension icon to show the last tracked problem or stats?

## Proposed Changes

---

### Chrome Extension

The extension will be placed in `leetcode-tracker-extension/`.

#### [NEW] [manifest.json](file:///d:/Project%20for%20fun/leetcode-tracker-extension/manifest.json)
Standard Manifest V3 configuration with permissions for `storage`, `tabs`, `activeTab`, and `https://leetcode.com/*`. It will register `background.js` as the service worker and `content.js` for the LeetCode problems pages.

#### [NEW] [background.js](file:///d:/Project%20for%20fun/leetcode-tracker-extension/background.js)
Will track session time via tabs and listen for messages from `content.js`. When a problem is solved, it will use `fetch` to send the payload to the backend server.

#### [NEW] [content.js](file:///d:/Project%20for%20fun/leetcode-tracker-extension/content.js)
The core logic that runs on the LeetCode problem page.
- Extracts Problem Title, Difficulty, and Tags.
- Detects the "Run" and "Submit" button clicks to track attempts.
- Observes the DOM for the "Accepted", "Runtime", and "Memory" indicators.
- Extracts the solution code from the LeetCode code editor.
- Sends the payload (including the code) to the `background.js`.

---

### Backend API

The backend will be placed in `leetcode-tracker-backend/`.

#### [NEW] [package.json](file:///d:/Project%20for%20fun/leetcode-tracker-backend/package.json)
Node.js dependencies including `express`, `cors`, `dotenv`, and `@google/genai` for the Gemini API.

#### [NEW] [server.js](file:///d:/Project%20for%20fun/leetcode-tracker-backend/server.js)
An Express server listening on port 5000. It will expose a `POST /api/activity` endpoint.
- Receives the problem metadata and the solved code.
- Calls the Gemini API with a prompt to determine `timeComplexity` and `spaceComplexity`.
- Merges the AI response with the original data.
- Saves the final enriched data to a local database/file.

#### [NEW] [.env](file:///d:/Project%20for%20fun/leetcode-tracker-backend/.env)
Will store your `GEMINI_API_KEY`.

## Verification Plan

### Automated Tests
None planned for the initial prototype.

### Manual Verification
1. Load the unpacked extension in Chrome via `chrome://extensions/`.
2. Start the backend Node server.
3. Navigate to a LeetCode problem, write a solution, and hit "Submit".
4. Check the backend logs to ensure it receives the payload, successfully calls Gemini, and logs the Time and Space complexity along with the rest of the tracked data.
