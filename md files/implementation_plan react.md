# Goal: Enhance Dashboard with Profile, Forgot Password, and Per-Problem Details

This plan outlines the steps to add a "Forgot Password" flow, create a User Profile section, and redesign the dashboard so that AI Recommendations and code details are tied specifically to each LeetCode problem you solve.

## User Review Required

> [!IMPORTANT]  
> **Forgot Password Flow:** Since we don't have an email server (like SendGrid) connected to your Render backend to actually send a password reset email, I propose a "Security Verification" approach. To reset their password, the user will need to provide their **Email** AND their **LeetCode Username** to prove their identity, and then they can immediately type a new password. Does this sound good?

> [!NOTE]  
> **Recommendations Restructure:** Currently, your AI recommendations are a single global list. To attach recommendations to *each specific problem*, I will modify the MongoDB `ActivityLog` schema to save the 3 recommendations directly inside the activity record. This means your old activities might not have recommendations attached, but all new ones will!

## Proposed Changes

---

### Backend Components

#### [MODIFY] `models/ActivityLog.js`
- Add a new field: `recommendations: [{ type: String }]` to store the 3 AI-recommended problems specifically generated for this code submission.

#### [MODIFY] `controllers/activityController.js`
- Update the `trackActivity` function to save the Gemini-generated `recommendedProblems` directly into the new `ActivityLog` document instead of the global `Recommendation` collection.
- Update `getActivity` to return user statistics (total problems solved, total time spent) to power the new Profile section.

#### [MODIFY] `routes/authRoutes.js` & `controllers/authController.js`
- Create a new `POST /api/auth/forgot-password` endpoint.
- It will verify the provided `email` and `leetcodeUsername`. If they match the database, it will immediately hash and update the user's password to a new one provided in the request.

---

### Frontend Components

#### [MODIFY] `src/pages/Login.jsx`
- Add a "Forgot Password?" button below the login form.
- Create a "Forgot Password" view where the user enters their Email, LeetCode Username, and a New Password to regain access.

#### [MODIFY] `src/pages/Dashboard.jsx`
- **User Profile:** Add a new "Profile Summary" card at the top showing the user's LeetCode Username, Total Problems Solved, and Total Time Spent coding.
- **Activity Click:** Make the rows in the Activity Log table clickable.
- **Details Modal:** Create a sleek pop-up Modal (or side panel) that opens when an activity is clicked. It will display:
  - The exact Code submitted.
  - Runtime, Memory, Time Complexity, and Space Complexity.
  - The 3 AI Recommendations generated specifically for *that* problem.
- **Remove Global Recommendations:** Remove the old "AI Recommended Next Steps" panel from the main dashboard, as recommendations now live inside the Activity Modal.

## Verification Plan

### Automated/Manual Verification
1. Open the Login page, click "Forgot Password", input credentials, and verify the password changes successfully in MongoDB.
2. Log into the Dashboard and verify the new Profile stats load correctly.
3. Submit a new LeetCode problem via the Chrome Extension to generate per-problem recommendations.
4. Click the problem in the Activity Log and verify the Modal opens with the code and recommendations displayed beautifully.
