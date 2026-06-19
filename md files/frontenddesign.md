# DSA Mastery Hub: Frontend Overhaul (Mocked Backend Data)

As requested, we will focus **exclusively on the React frontend**. For any features where a backend endpoint does not currently exist (like the Roadmap or AI Generation), we will use beautiful **mock data** so that the UI is 100% complete and ready for you to wire up to your backend later.

## User Review Required

> [!IMPORTANT]  
> **Mock Data Implementation**
> - **Real Data:** Dashboard Activity, Skill Profile (basic), and Per-Problem Recommendations.
> - **Mock Data:** Weakness Detection logic, Interview Readiness Scores, Weekly Roadmap Timelines, and the AI Question Generator output.
> 
> Does this split sound good?

> [!WARNING]  
> **Routing Architecture**
> We are migrating from a single-page app to a multi-page app. I will install `react-router-dom` and restructure your `App.jsx` to include a Sidebar. 
> I will also install `recharts` for the radar and gauge visualizations.

---

## Proposed Changes

### 1. New Dependencies
- **Frontend:** Install `react-router-dom` (Sidebar navigation), `recharts` (Radar charts and Analytics), and ensure `lucide-react` is updated.

### 2. Frontend Layout & Routing

#### [MODIFY] `src/App.jsx`
- Wrap the application in `<BrowserRouter>`.
- Create a persistent **Sidebar Layout** (Dashboard, Analytics, Practice, Roadmap).

### 3. New Frontend Pages (FR-1 to FR-8)

#### [MODIFY] `src/pages/Dashboard.jsx` (Overview - FR-1 & FR-2)
- Focus purely on Activity Tracking and Profile Stats. 
- Refine the table to emphasize Topic, Time Spent, Attempts, and visually highlighted Submission Results.

#### [NEW] `src/pages/Analytics.jsx` (Skill Profile & Weakness - FR-3 & FR-4)
- **Skill Profile:** Build a massive Recharts Radar Chart visualizing the user's real scores in Arrays, Trees, Graphs, DP, etc.
- **Weakness Detection (Mocked):** Build a dedicated panel that highlights low-performing topics and error-prone concepts.

#### [NEW] `src/pages/Practice.jsx` (Recommendations & Readiness - FR-5 & FR-6)
- **Recommendations:** A targeted list of problems based on the Weakness Detection engine.
- **Interview Readiness Profile (Mocked):** A visual card displaying "Readiness Score: 78/100" and "Coding Round Probability: 81%" using circular gauge components from Recharts.

#### [NEW] `src/pages/Roadmap.jsx` (Roadmap & Gen AI - FR-7 & FR-8)
- **Personalized Roadmap (Mocked):** A beautiful vertical timeline UI outlining specific study topics week by week.
- **AI Practice Studio (Mocked):** An interactive interface where the user inputs a prompt, and the UI dynamically renders a highly detailed mock generated DSA question.

## Verification Plan
1. Install new npm packages (`react-router-dom`, `recharts`).
2. Build the new routing structure in `App.jsx`.
3. Build the 4 new Pages with beautifully styled Tailwind components and Recharts.
4. Verify the Sidebar navigation works smoothly and the mock data accurately portrays the final intended user journey.
