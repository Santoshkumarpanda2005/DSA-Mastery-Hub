# LeetCode Tracker with AI Complexity Analysis

A complete, full-stack project consisting of a Chrome Extension and a Node.js Backend. This system automatically intercepts successful LeetCode submissions, captures your exact code, and uses the Gemini AI to analyze the Time (Big-O) and Space complexity before permanently saving it to a MongoDB Cloud database.

---

## 🏗 Architecture Overview

The system is split into two independent parts that communicate with each other:

1. **The Chrome Extension (`leetcode-tracker-extension/`)**: 
   Runs in your browser. It uses advanced Network Interception to capture your code the moment you click "Submit" on LeetCode. It waits for the LeetCode server to reply with "Accepted", and then instantly packages your code, runtime, and memory usage into a JSON payload and fires it off to your backend.
   
2. **The Node.js Backend (`leetcode-tracker-backend/`)**:
   An Express server running in the cloud (Render). It receives the payload from your extension, sends your code to Google's Gemini AI for a Big-O analysis, and then saves the final, enriched data structure into your MongoDB database.

---

## 📂 File-by-File Breakdown

### Part 1: The Chrome Extension (`leetcode-tracker-extension/`)

This extension uses a Manifest V3 architecture. Instead of relying on fragile "DOM Scraping" (trying to read the visual HTML of the page, which breaks whenever LeetCode updates their UI), it intercepts the actual invisible API requests LeetCode's website makes to its own servers.

#### `manifest.json`
The configuration file that tells Chrome how to load the extension.
- **Key Feature**: We request `host_permissions` for `https://leetcode.com/*` (to inject our scripts) and `https://leetcode-tracker-api-h7cp.onrender.com/*` (to allow sending data to your backend).
- **Key Feature**: We inject `inject.js` directly into the `"MAIN"` world of the browser so it can intercept LeetCode's network requests.

#### `inject.js` (The Brain of the Extension)
This file is injected directly into LeetCode's page environment.
- **How it works**: It overrides the browser's native `window.fetch` function.
- Every time LeetCode tries to make a network request, this script intercepts it.
- **Step 1**: If it sees a POST request to `/submit/`, it secretly copies the exact code and language you submitted and saves it in memory.
- **Step 2**: If it sees a GET request to `/check/` (which LeetCode uses to see if your code passed), it clones the response. If the response says `"status_msg": "Accepted"`, it grabs the runtime and memory, combines it with your code from Step 1, and sends a `LEETCODE_ACCEPTED` message to `content.js`.

#### `content.js` (The Bridge)
This script runs in the background of the LeetCode tab.
- **How it works**: It listens for the `LEETCODE_ACCEPTED` message sent by `inject.js`.
- It also uses simple DOM selectors to grab the Problem Title (via the URL slug) and the Difficulty tags.
- It packages all of this together into one clean JSON object and passes it to `background.js`.

#### `background.js` (The Sender)
The service worker of the extension.
- **How it works**: It cannot interact with the webpage directly, but it receives the final JSON package from `content.js`.
- It executes a standard `fetch()` request to `POST` this data directly to your Render backend API.

---

### Part 2: The Backend (`leetcode-tracker-backend/`)

The backend follows a clean, modern **MVC (Model-View-Controller)** pattern.

#### `server.js` (The Entry Point)
The absolute minimum code needed to start the server.
- It loads your `.env` variables.
- It connects to your MongoDB Cloud database using Mongoose.
- It mounts the Express router so any requests to `/api/activity` are handled by `activityRoutes.js`.

#### `routes/activityRoutes.js` (The Traffic Cop)
Very simple file that defines the API endpoints.
- `GET /` routes to the `getActivity` controller function.
- `POST /` routes to the `trackActivity` controller function.

#### `controllers/activityController.js` (The Heavy Lifter)
This file does all the actual work when data arrives.
- **`trackActivity`**: Receives the POST payload from your Chrome extension. It takes `data.code` and constructs a precise prompt for the **Gemini 2.5 Flash API**. It asks Gemini to return a strict JSON object with `timeComplexity` and `spaceComplexity`. It merges the AI's response with your LeetCode data, and uses the Mongoose model to save it to MongoDB.
- **`getActivity`**: A simple function that queries MongoDB for all your saved submissions and returns them to your browser so you can view your data.

#### `models/activityModel.js` (The Database Schema)
Defines exactly what your data looks like in MongoDB.
- Uses Mongoose to define a strict schema ensuring every submission has a `problemName`, `code`, `timeComplexity`, etc. It also automatically adds `createdAt` and `updatedAt` timestamps.

#### `.env` (The Secrets)
Holds your secret keys that should never be pushed to public GitHub repositories:
- `GEMINI_API_KEY`: Gives the backend permission to use Google's AI.
- `MONGODB_URI`: The connection string containing the password to your Cloud Database.

---

## 🚀 How Data Flows (The Complete Journey)

1. You click "Submit" on LeetCode.
2. `inject.js` intercepts the request and saves your code in memory.
3. LeetCode's server responds with "Accepted".
4. `inject.js` intercepts that response, grabs the runtime, and sends everything to `content.js`.
5. `content.js` adds the Problem Name and Difficulty, then sends it to `background.js`.
6. `background.js` POSTs the data to `https://leetcode-tracker-api-h7cp.onrender.com/api/activity`.
7. Your Render server (`activityController.js`) receives it.
8. The server asks Gemini AI for the Big-O complexity of the code.
9. The server merges the AI response with your data and saves it permanently to MongoDB Atlas!
