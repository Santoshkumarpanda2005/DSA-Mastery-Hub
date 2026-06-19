# Frontend & Authentication Overhaul

This plan outlines the addition of a secure frontend dashboard and a robust JWT authentication system to your LeetCode Tracker.

## User Review Required

> [!WARNING]
> **Backend Language Discrepancy:** The requirements you pasted mention "Backend: Python (Django or FastAPI)". However, our current, fully-functioning backend with the Gemini AI integration is built in **Node.js (Express)**! 
> 
> **I strongly recommend keeping our existing Node.js backend** and simply adding the JWT Authentication and bcrypt password hashing to it, rather than throwing it away and rewriting everything in Python. This plan assumes we will stick with Node.js.

## Open Questions

> [!IMPORTANT]
> 1. **Frontend Framework:** Your requirements mention HTML/CSS/JS "(or React)". Because we are building a dynamic, secure Dashboard with JWT tokens, I highly recommend using **React (via Vite)** to make managing the dashboard state and token storage easy. Are you okay with using React?
> 2. **Extension Updates:** Once we add authentication, the Chrome Extension will also need to "Log In" so it gets a JWT token to send data to the backend. This means we will need to build a small popup UI for the extension where you type your password. Does this sound good?

## Proposed Changes

---

### 1. Backend Authentication Upgrades (`leetcode-tracker-backend/`)

We will install `bcryptjs` and `jsonwebtoken` to our Node.js server.

#### [MODIFY] [User.js](file:///d:/Project%20for%20fun/leetcode-tracker-backend/models/User.js)
Update the schema to handle secure authentication.
- Add `password` (String, required) to store the bcrypt hashed password.
- Remove the "auto-creation" logic from the activity tracker since users must now explicitly register.

#### [NEW] [authController.js](file:///d:/Project%20for%20fun/leetcode-tracker-backend/controllers/authController.js) & `authRoutes.js`
- `POST /api/auth/register`: Takes `leetcodeUsername` and `password`. Hashes the password with bcrypt, saves the User, and returns a JWT.
- `POST /api/auth/login`: Verifies the password using bcrypt and returns a JWT.

#### [NEW] [authMiddleware.js](file:///d:/Project%20for%20fun/leetcode-tracker-backend/middleware/authMiddleware.js)
- Middleware function that intercepts requests to `/api/activity`.
- Checks for a valid JWT token in the `Authorization: Bearer <token>` header.
- If valid, it attaches the `userId` to the request so we know exactly whose data to save or retrieve.

#### [MODIFY] [activityController.js](file:///d:/Project%20for%20fun/leetcode-tracker-backend/controllers/activityController.js)
- Update `trackActivity` to use the `userId` from the JWT token instead of guessing it.
- Update `getActivity` to strictly return data *only* for the logged-in user.

---

### 2. The New Frontend Web App (`leetcode-tracker-frontend/`)

We will create a brand new React application.

#### Features & Pages:
1. **Login & Registration Page**: Forms to register or log in using LeetCode username and password. Stores the JWT token in `localStorage`.
2. **Dashboard (Protected Route)**: Only accessible if a valid JWT exists.
   - **Activity Feed**: Displays a clean table of all solved problems.
   - **Skill Profile**: Visualizes the user's competency in Arrays, Trees, DP, etc.
   - **AI Recommendations**: Displays the Gemini AI's recommended next steps.

---

### 3. Chrome Extension Updates (`leetcode-tracker-extension/`)

#### [NEW] `popup.html` & `popup.js`
- A tiny UI when you click the extension icon.
- Allows you to log in with your username and password.
- Saves the JWT token in Chrome's secure `chrome.storage.local`.

#### [MODIFY] `background.js`
- Retrieves the JWT token from storage and attaches it to the `Authorization` header whenever it sends a solved problem to the backend.

## Verification Plan
1. Send a POST request to `/api/auth/register` and verify a hashed password is saved in MongoDB.
2. Attempt to hit `/api/activity` without a token and ensure it is blocked (401 Unauthorized).
3. Log into the React Frontend, receive a token, and verify the Dashboard successfully loads the user's private data.
