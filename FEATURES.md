# Prospect SA — Feature Reference

A developer-oriented guide to every feature in the app: what it does, how users interact with it, how it works technically, and where the code lives. Read `CODEBASE_MAP.md` for file-level descriptions; this document focuses on product behaviour.

---

## 1. Home / Landing Page

### What it is
The public marketing page. It introduces Prospect SA, showcases the three product pillars (Career Guide, School Assist, Community Tools), and funnels visitors into the app. No account required.

### How it works (user flow)
1. User arrives at `/` (or `?page=home`). A full-screen `LoadingScreen` plays a brief morphing-text animation ("Discover → Plan → Elevate → Succeed → Prospect SA") and then fades out.
2. The landing page renders with a sticky pill nav (`AnimatedNav`) fixed at the top. The nav auto-collapses into a menu icon when the user scrolls down and re-expands when they scroll back up 80px.
3. Sections scroll past in order: animated hero with typing effect → three-card features grid → logo cloud marquee → six-card Career Guide section → "How It Works" three-step explainer → five-image Discovery Grid → Lamp/Mandela quote section → footer with full link tree.
4. A "How it works" floating button (bottom-right) opens a four-step `TutorialDialog` (Radix Dialog) that walks through the three product areas.
5. Clicking any feature card, nav item, or footer link calls `setPage(target)` — the state-based router — switching the view without a full page load.

### How it works (technical)
- The entire landing page is one conditional render block inside `App.tsx` (`{page === 'home' && ...}`).
- `AnimatedNav` tracks scroll position using `motion`'s `useScroll` + `useMotionValueEvent`. Collapse threshold is 150px scroll-down; re-expand requires scrolling back up at least 80px from the collapse point.
- `LoadingScreen` is an eager (non-lazy) import so it renders before any other chunk loads. It calls `onComplete()` when its animation finishes, which sets `isAssetsLoaded = true` and unmounts itself via `AnimatePresence`.
- The `TutorialDialog` is self-contained state (`step` 0–3, `open` boolean) with no persistence — it resets every page load.
- All marketing section components (`FeaturesSection`, `CareerGuideSection`, `HowItWorks`, `DiscoveryGrid`, `LampSection`, `Footer`) are defined inline in `App.tsx`; they are not split into separate files.
- Images in `DiscoveryGrid` use `<picture>` with WebP source + JPG fallback; the first image uses `fetchPriority="high"` and `loading="eager"`, the rest are lazy.
- Auth state from `App.tsx` is passed down to `AnimatedNav` and `FeaturesSection` so auth-gated links (Dashboard, Study Library) redirect to `auth` if no real user exists, and to the actual page if one does.

### Where the code is
- `src/App.tsx` — entire landing page, nav, tutorial dialog, all marketing sections
- `src/components/marketing/animated-hero.tsx` — typing-animation hero
- `src/components/marketing/logo-cloud-2.tsx` — marquee logo strip
- `src/components/shell/LoadingScreen.tsx` — intro animation

---

## 2. Career Guide

All Career Guide pages use `careerPageProps` (`guestMode: true`), meaning the `withAuth` HOC fabricates an anonymous user rather than requiring login. Users can browse everything without an account; bookmarks and quiz saves require a real session to persist to Supabase (they fall back to localStorage for anonymous users).

---

### 2.1 RIASEC Quiz

#### What it is
A 42-question psychometric assessment based on Holland's RIASEC model (Realistic, Investigative, Artistic, Social, Enterprising, Conventional). It produces a scored personality profile and surfaces up to 15 matching careers ranked by compatibility.

#### How it works (user flow)
1. User lands on the quiz page. Questions are shown one at a time with a progress bar.
2. Each question is rated on a five-point Likert scale: Strongly Dislike / Dislike / Neutral / Like / Strongly Like. Selecting an answer automatically advances to the next question after 300ms.
3. Questions can be skipped. A "Skipped (n)" badge appears once any question is skipped; clicking it opens `SkippedQuestionsPanel` — a slide-in list of skipped questions with jump-to links.
4. On the last question, "Finish Quiz" becomes available. If there are skipped questions, a modal warns the user and offers "Go Back & Answer" or "View Results".
5. Results page shows: RIASEC profile description, animated bar chart of all six dimension scores, grid of top 15 career matches (with compatibility percentage, job demand, salary range, education path), subject recommendations grouped by Essential / Recommended / Useful, and "What's Next?" CTAs (Explore Careers, Find Bursaries, Study Resources, Share Results, Retake).
6. "Share Results" encodes the RIASEC top codes and percentages as a base64 JSON string appended to the URL, which the user can copy to clipboard.

#### How it works (technical)
- `QuizPage` uses `quizResults === null` to toggle between two sub-components: `QuizPhase` and `ResultsPhase`.
- `answers` state is an array of `{ questionId, value }` objects. Selecting a value upserts (replaces if same questionId exists) and then calls `setTimeout(advance, 300)`.
- `computeQuizResults(answers)` in `src/data/quizScoringLogic.ts` converts the answer array into RIASEC percentage scores, derives the top codes, finds career matches from `allCareersComplete`, computes a `compatibilityScore` for each, and generates subject recommendations.
- On completion, `saveQuizResultsToSupabase` fires-and-forgets a call to `saveQuizResults` (from `quizService`) which writes to localStorage key `prospect_quiz_results_v2`. If the user is authenticated, Supabase sync will push this on the next background sync cycle.
- `SkippedQuestionsPanel` is a slide-in overlay (fixed position, z-50) with a backdrop; it receives the skipped question objects and calls `onSelectQuestion(index)` to jump the parent's `currentQuestionIndex`.

#### Where the code is
- `src/pages/careers/QuizPage.tsx`
- `src/data/quizQuestions.ts` — 42 questions
- `src/data/quizScoringLogic.ts` — scoring algorithm
- `src/services/quizService.ts` — localStorage persistence
- `src/components/quiz/SkippedQuestionsPanel.tsx`

---

### 2.2 Career Browser

#### What it is
A searchable, filterable grid of 400+ South African careers, each openable as a full detail modal with salary data, study paths, APS requirements, job demand, RIASEC codes, and related careers.

#### How it works (user flow)
1. Page opens showing all 400+ careers in a four-column grid (fewer on mobile). A sticky search bar and "Filters" button sit below the app header.
2. User types in the search box (searches title, description, keywords). Filter panel expands to reveal: Career Category pills, RIASEC letter buttons (R/I/A/S/E/C), Job Demand level (high/medium/low), and an entry salary range slider (R0–R100k).
3. Results update in real time via `useMemo`. Initial render shows 25 careers; "Load More (n more)" appends 25 at a time.
4. Clicking a career card opens `CareerDetailModal` — an animated modal showing the full career profile: day-in-the-life, study path, providers, salary range, job demand, RIASEC badges, and up to 5 related careers (computed by RIASEC distance).
5. From the modal, users can bookmark the career (heart icon) or navigate to the Study Library / Bursaries pages. Clicking a related career replaces the modal content without closing it.

#### How it works (technical)
- `allCareersComplete` (400+ items from `src/data/careers400Final.ts`) is the data source — a bundled TypeScript array, no network fetch required.
- Filtering is done entirely client-side with a chained `useMemo`. The salary range slider filters by `career.salary.entryLevel`. RIASEC filtering checks `career.riasecMatch[code] > 50`.
- `displayCount` state controls the slice of the filtered array shown. "Load More" increments it by 25.
- `findSimilarCareers(careerId, allCareersComplete)` in `careersService.ts` ranks all careers by RIASEC code distance and category similarity, returning the top 5.
- Bookmarks are loaded from `getUserBookmarks(user.id)` on mount (reads localStorage, falls back to Supabase). Saves call `saveBookmark` / `removeBookmark` from `bookmarkService`, which hit localStorage immediately and queue a Supabase push.

#### Where the code is
- `src/pages/careers/CareersPageNew.tsx`
- `src/data/careers400Final.ts` + `src/data/batches/` — career catalogue
- `src/components/careers/CareerCard.tsx` — grid card
- `src/components/careers/CareerDetailModal.tsx` — detail modal
- `src/lib/careersService.ts` — `findSimilarCareers`
- `src/services/bookmarkService.ts` — save/remove bookmarks

---

### 2.3 Bursaries

#### What it is
A searchable list of 200+ verified bursaries and scholarships available to South African students, with category/field/income filters, bookmarking, and a full detail view per bursary. Includes a persistent NSFAS information banner.

#### How it works (user flow)
1. Page shows all bursaries as large cards with provider name, deadline badge, star rating, field tags, and minimum marks.
2. User searches by name, provider, category, or description. Filter panel offers: Category pills, Field of Study pills (first 6 fields shown), and Income Level (R0–200k / R200k–R350k / R350k–R450k / No limit).
3. Clicking a bursary card or "View Details" writes the bursary ID to `sessionStorage('selectedBursaryId')` and navigates to page `'bursary'` (`BursaryDetailPage`).
4. From the detail page, users see eligibility checklist, application steps, required documents, and contact details.
5. Bookmark toggle saves/removes the bursary from the user's saved list.
6. Scrolling to the bottom reveals an NSFAS section with a direct link to `nsfas.org.za` and a summary of what NSFAS covers.

#### How it works (technical)
- Data source is the static `bursaries` array from `src/data/bursaries.ts` — no fetch.
- Income filtering matches on the `requirements.maxIncome` string field using includes-based heuristics (e.g., checks for "200", "350", etc.).
- Navigation to the detail page passes the ID via `sessionStorage` rather than a URL parameter, since the router is state-based.
- Bookmarks follow the same pattern as Career Browser: load on mount via `getUserBookmarks`, write via `saveBookmark`/`removeBookmark`.

#### Where the code is
- `src/pages/careers/BursariesPage.tsx`
- `src/pages/careers/BursaryDetailPage.tsx`
- `src/data/bursaries.ts`
- `src/services/bookmarkService.ts`

---

### 2.4 Interactive Job Map

#### What it is
A two-step interactive map that lets users pick their location, then explore universities, TVET colleges, and job market insights for their province using a Leaflet map and data panels.

#### How it works (user flow)
1. Step 1 — Location: User enters a city via autocomplete text input, uses browser geolocation ("Use my location"), or selects a province manually. The `LocationInput` component resolves the entry to `{ lat, lng, label, province }`.
2. Step 2 — Exploring: A Leaflet map renders centered on the user's coordinates (zoom 9). Below the map, two tabs provide:
   - **Colleges tab**: Lists universities and TVET colleges in the province (with sub-tabs). Markers for each institution appear on the map.
   - **Insights tab**: Province statistics — career count, average salary, industry breakdown pie-equivalent, top employers, and education institution counts.
3. A `SearchBox` above the tabs filters careers and cities by name. A "Change" button returns to Step 1.

#### How it works (technical)
- Province is derived from `userLocation.province`; if the user typed a city, `getProvinceFromCoords` in `mapData.ts` reverse-maps coordinates to a province string.
- `mapMarkers` is a `useMemo` that calls `getUniversitiesByProvince(province)` + `getTVETCollegesByProvince(province)` (from `mapService.ts`, pure functions over static `mapData.ts` arrays) and converts them to `MapMarker[]` via `createUniversityMarkers` / `createTVETMarkers`.
- `MapDisplay` is a react-leaflet component with a `MapContainer`, `TileLayer` (OpenStreetMap), and marker clusters. It accepts `activeLayers` to toggle demand-hotspot and college marker sets.
- `InsightsTab` calls `getIndustryBreakdown(province)`, `getTopEmployersByProvince(province)`, `getAverageSalaryByProvince(province)`, etc. — all pure functions over `mapData.ts` constants.
- All map data is static (bundled). No Supabase calls are made from this page.

#### Where the code is
- `src/pages/careers/MapPage.tsx`
- `src/components/map/LocationInput.tsx`
- `src/components/map/MapDisplay.tsx`
- `src/components/map/CollegesTab.tsx`
- `src/components/map/InsightsTab.tsx`
- `src/components/careers/SearchBox.tsx`
- `src/services/mapService.ts` — province data helpers
- `src/data/mapData.ts` — SA geographic constants

---

### 2.5 Grade 10 Subject Selector

#### What it is
A tool specifically for Grade 10 students to explore career paths based on the subjects they choose. Selecting subjects instantly surfaces matching careers, university minimum marks per subject, available TVET pathways, and an APS score guide.

#### How it works (user flow)
1. User sees a sidebar checklist of nine core Grade 10 subjects (Mathematics, Physical Sciences, Life Sciences, Accounting, Business Studies, Economics, CAT, EGD, English Home Language).
2. Toggling subjects updates three result sections in real time (all `useMemo`-driven):
   - **Matching Careers** — up to 10 career cards derived from `subjectCareerMapping.ts`. Clicking a card navigates to the Career Browser.
   - **University Requirements** — per-subject minimum marks for different degree types (sourced from `universityRequirements.ts`).
   - **TVET Pathways** — up to 6 TVET career options relevant to the selected subjects. Clicking navigates to the TVET Careers page.
3. An **APS Score Guide** panel is always shown at the bottom, explaining the points-to-grade conversion scale.
4. If no subjects are selected, an empty state prompts the user to take the quiz or visit the Study Library.

#### How it works (technical)
- `getTopMatchingCareers(selectedSubjects, 10)` in `subjectCareerMapping.ts` returns career names scored by subject overlap; the result is joined against the lighter `careers` array (not `allCareersComplete`) for the card display.
- `getSubjectRequirements(subject)` returns `{ degreeType, minMark, description }[]` from `universityRequirements.ts`.
- `getTopTVETCareers(selectedSubjects, 6)` in `tvetCareers.ts` filters and ranks the 70+ TVET career objects.
- No Supabase calls; all computation is synchronous over bundled data.

#### Where the code is
- `src/pages/careers/Grade10SubjectSelectorPage.tsx`
- `src/data/subjectCareerMapping.ts`
- `src/data/universityRequirements.ts`
- `src/data/tvetCareers.ts`
- `src/data/careers.ts` — lightweight career shape used here

---

### 2.6 TVET Pathway

#### What it is
A five-section area dedicated to Technical and Vocational Education and Training. It covers an overview/advocacy page, a TVET-specific career browser, a searchable college directory, NSFAS/bursary funding information, and a per-trade entry requirements selector.

#### How it works (user flow)
A persistent sub-nav (`TVETSubNav` pill bar) sits below the app header on all TVET pages, letting users jump between:

1. **Overview** (`tvet`) — Dark hero with "Technical Skills. Real Jobs. Real Futures." headline. Six benefit cards (faster, job-ready, lower entry, high demand, multiple pathways, growing industry). TVET vs University comparison table. CTA to Find Colleges and Funding Support.
2. **Careers** (`tvet-careers`) — Grid of TVET-specific careers using `TVETCareerCard`, drawn from `allCareersFullData` / `tvetCareers` data.
3. **Colleges** (`tvet-colleges`) — Searchable list of all 50 public TVET colleges, each showing location, contact details, and specializations. Data from `tvetColleges.ts`.
4. **Funding** (`tvet-funding`) — NSFAS eligibility explainer, bursary options available to TVET students, and application guidance.
5. **Requirements** (`tvet-requirements`) — Dropdown selector where users pick a trade; a requirements card appears showing minimum grade, recommended subjects, and apprenticeship details.

#### How it works (technical)
- `TVETSubNav` is a presentational component receiving `currentPage` and `onNavigate` props; it highlights the active tab.
- All five TVET pages are separate lazy-loaded components registered in `App.tsx` as distinct page keys (`tvet`, `tvet-careers`, `tvet-colleges`, `tvet-funding`, `tvet-requirements`).
- All data is static (bundled arrays). No Supabase calls.
- All pages use `withAuth` with `guestMode: true` (no login required).

#### Where the code is
- `src/pages/tvet/TVETPage.tsx`
- `src/pages/tvet/TVETCareersPage.tsx`
- `src/pages/tvet/TVETCollegesPage.tsx`
- `src/pages/tvet/TVETFundingPage.tsx`
- `src/pages/tvet/TVETRequirementsPage.tsx`
- `src/components/tvet/TVETSubNav.tsx`
- `src/data/tvetCareers.ts`, `src/data/tvetColleges.ts`, `src/data/careersFullData.ts`

---

## 3. School Assist

School Assist pages use `protectedPageProps` — they require a real authenticated user. Unauthenticated visitors are redirected to the Auth page. All user data (study progress, calendar events, learning paths) is stored primarily in localStorage and synced to Supabase in the background.

---

### 3.1 Dashboard

#### What it is
The central hub for authenticated students. It aggregates study progress, upcoming deadlines, saved careers and bursaries, quiz results, and learning paths into a single overview page with quick-access CTAs.

#### How it works (user flow)
1. User lands on the dashboard after login. The page shows:
   - **Upcoming Deadlines** — hardcoded key SA academic dates (UCT applications, NSFAS, Matric finals, etc.) sorted by proximity, with urgency styling (red ≤14 days, amber ≤60 days, blue otherwise).
   - **Study Progress** — reads from Supabase `study_progress` table; shows mastery levels per subject/topic.
   - **Learning Paths** — progress rings for demo algebra learning path from `demoLearningPath.ts` + real paths from `learningPathStorage`.
   - **Saved Careers / Bursaries** — loaded via `getUserBookmarks`; shows cards with remove option.
   - **Quiz Results** — loads the latest RIASEC result via `getQuizResults` from `dashboardService`; shows top codes and matched careers.
   - **Unanswered Questions** — fetches questions the user submitted (via School Assist search) that have not yet been answered; shows status badges and delete option.
2. A search bar at the top of the page navigates to `school-assist` (the Q&A search).
3. Quick-action buttons link to Study Library, Calendar, School Assist chat, Career Quiz, and Bursaries.

#### How it works (technical)
- On mount, the dashboard fires multiple parallel data loads: `supabase.from('study_progress').select(...)`, `learningPathStorage.getAll()`, `getUserBookmarks(user.id)`, `getUserQuestions(user.id)`, `getQuizResults(user.id)`.
- `daysUntil(iso)` calculates countdown from today; `urgencyStyle(days)` returns colour tokens for the deadline timeline display.
- The `StudyProgressRow` type maps to the Supabase `study_progress` table schema (subject, grade, topic, mastery_level, last_accessed).
- Deleting a question calls `deleteQuestion(id)` from `unansweredQuestionService` which writes to the `user_unanswered_questions` Supabase table.

#### Where the code is
- `src/pages/school/DashboardPage.tsx`
- `src/services/dashboardService.ts`
- `src/services/storageService.ts` — learning path & progress storage
- `src/services/bookmarkService.ts`
- `src/services/unansweredQuestionService.ts`
- `src/data/demoLearningPath.ts`

---

### 3.2 Study Library

#### What it is
A four-step drill-down into curriculum-aligned study content for Grades 10–12 CAPS subjects. Users navigate: Subject → Grade → Term → Content. Study progress is tracked per lesson.

#### How it works (user flow)
1. **Subject step**: Searchable grid of subject cards with colour-coded icons (Algebra = blue calculator, Life Sciences = green flask, Accounting = amber calculator, etc.). Subjects with active content modules are indicated.
2. **Grade step**: Radio/card selection for Grades 10, 11, 12.
3. **Term step**: Cards for Terms 1–4 of the academic year.
4. **Content step**: Lists topic modules available for the selected subject/grade/term combination. Each topic shows a lesson count, estimated time, and a progress indicator (not started / in progress / complete). Clicking a topic opens the lesson content inline or navigates to a dedicated lesson page (for the two interactive Algebra lessons).
5. `markLessonComplete(userId, subject, grade, topic)` is called when the user finishes a lesson, updating localStorage and queuing a Supabase sync.
6. Breadcrumb navigation at the top and a back chevron allow navigating back up the drill-down.

#### How it works (technical)
- `step` state cycles through `'subject' | 'grade' | 'term' | 'content'`. Each step renders a different motion-animated section.
- Subject list comes from `src/data/subjects.ts`. The `subjectsWithContent` set hardcodes which subject IDs have active modules (`algebra`, `geometry`, `phys-sci`, `accounting`).
- Topic modules for each subject/grade/term combination are imported from `src/data/studyLibrary/index.ts` (barrel export). The content format is TypeScript objects with explanations, examples, and Q&A arrays.
- `getStudyProgress(userId, subject, grade)` and `markLessonComplete` live in `dashboardService.ts`. They read/write localStorage via `studyProgressStorage` and push to Supabase `study_progress` table on next sync.
- Two deep interactive lessons (`LinearEquations`, `SimultaneousEquations`) are separate lazy-loaded pages (`learning-algebra-g10-t1-linear-equations`, `learning-algebra-g10-t1-simultaneous`) navigated to from the content step.

#### Where the code is
- `src/pages/school/StudyLibraryPage.tsx`
- `src/data/studyLibrary/` — CAPS content modules
- `src/data/subjects.ts`
- `src/services/dashboardService.ts` — `getStudyProgress`, `markLessonComplete`
- `src/pages/learning/Algebra/Grade10/Term1/LinearEquations.tsx`
- `src/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations.tsx`

---

### 3.3 School Assist Search

#### What it is
A keyword search engine over the CAPS study content and a Q&A index. Users can search for topics or ask specific questions. If nothing matches, they can submit their question to be answered later.

#### How it works (user flow)
1. Two modes selectable via toggle: **Topic Search** and **Question Search**.
2. User types a query and submits (Enter or search button). Results appear as cards.
   - **Topic results**: Matched topic titles with subject/grade/term tags and an excerpt. Clicking navigates to the Study Library at the relevant topic.
   - **Question results**: Matched Q&A pairs shown as expandable cards (click to reveal the full answer).
3. If no results appear after a search, a "Submit Your Question" form slides in. User picks subject, grade, and writes the question. On submit, it is written to the `user_unanswered_questions` Supabase table via `submitQuestion`.
4. Submitted questions become visible in the Dashboard with status `pending` → `answered` → `marked_resolved`.

#### How it works (technical)
- `searchTopics(query)` and `searchQuestion(query)` are called from `schoolAssistService.ts`. Both use a **Levenshtein-distance fuzzy matcher** (`levenshteinDistance`, `fuzzyMatch`) to handle typos and partial matches across topic titles and Q&A entry text.
- The search corpus is the full `studyLibrary` dataset (topics + their embedded Q&A pairs), all in-memory.
- Auth state is loaded directly with `supabase.auth.getSession()` on mount (this page does not use `withAuth`; it is rendered without protected props).
- `submitQuestion` calls Supabase `user_unanswered_questions` insert with the form data and the user's ID.

#### Where the code is
- `src/pages/school/SchoolAssistPage.tsx`
- `src/services/schoolAssistService.ts` — fuzzy search engine
- `src/services/unansweredQuestionService.ts` — submit question

---

### 3.4 AI Chat (School Assist Chat)

#### What it is
A conversational chat interface powered by Google Gemini (`@google/genai`). Students can ask academic questions in natural language. The page also includes a hardcoded Q&A database for common questions (subjects, APS, university admission) that is matched before hitting the AI.

#### How it works (user flow)
1. Page opens with a welcome screen and suggested prompt chips ("Choose subjects", "Calculate APS", "NSFAS funding", etc.).
2. User types a message in the auto-resizing textarea (or uses the microphone input for voice). Sending the message adds it to the chat history.
3. The bot first checks `QA_DATABASE` (an in-page array of `{ keywords, answer }` objects) for a keyword match. If found, the pre-written answer is returned immediately without an API call.
4. If no keyword match, a streaming call is made to Gemini with the full conversation history as context. The bot response streams in token by token.
5. Additional UI affordances: attachment button (file picker), calculator widget toggle, refresh (clears conversation), and back navigation to School Assist search.

#### How it works (technical)
- Chat state is `Message[]` (role `'bot' | 'user'`, text, timestamp) in local component state — messages are not persisted between sessions.
- `QA_DATABASE` is a const array defined inline in the page component; keyword matching is a simple `every` check against `message.toLowerCase()`.
- Gemini is accessed via `@google/genai`. The API key is injected at build time from `process.env.GEMINI_API_KEY` (defined in `vite.config.ts`).
- `useAutoResizeTextarea` is a local hook that watches `textarea.scrollHeight` and adjusts the element height dynamically, clamped between `minHeight` and `maxHeight`.
- This page does **not** use `withAuth`; it reads auth state independently with `supabase.auth.getSession()`.

#### Where the code is
- `src/pages/school/SchoolAssistChatPage.tsx`

---

### 3.5 Calendar

#### What it is
A full-year academic calendar for the current school year (2026). Shows SA school terms, holidays, and hardcoded key deadlines (university applications, matric exams, NSFAS). Users can add their own events with categories and dates.

#### How it works (user flow)
1. Page opens on a year-view grid showing all 12 months. Each day cell can contain event dots colour-coded by category: exam (dark), deadline (slate), holiday (grey), other (light).
2. Hardcoded term blocks are highlighted on the grid. A "Terms" section below lists all four terms with start/end dates, week count, and holiday periods.
3. An "Upcoming Deadlines" list shows the next 5 hardcoded academic deadlines with urgency badges (same logic as the Dashboard).
4. Users can add events via an "Add Event" form: title, date, time (optional), category (exam / deadline / holiday / other). Events are stored locally.
5. Events can be deleted from the event list. Filter by category is available.
6. Toggle between year-view and month-view layouts via tab buttons.

#### How it works (technical)
- User events are stored in `calendarStorage` (from `storageService.ts`), which writes to localStorage key `prospect_calendar_events_v2`.
- On login, `syncUserDataOnLogin` in `supabaseSync.ts` pulls `calendar_events` from Supabase and merges into localStorage (Supabase wins on conflict). Every 5 minutes, `startBackgroundSync` pushes dirty calendar events back to Supabase.
- `TERMS` and hardcoded `DEADLINES` are defined as constants inside the page file.
- Calendar grid generation is handled by `useMemo` — for each month, generate a 6-row × 7-column day grid and overlay events from both the hardcoded deadline list and user events.
- The page does not use `withAuth`; it receives `onNavigate` and `onSignOut` props directly.

#### Where the code is
- `src/pages/school/CalendarPageNew.tsx`
- `src/services/storageService.ts` — `calendarStorage`
- `src/services/supabaseSync.ts` — background sync

---

## 4. Community Tools

Most Community pages use `careerPageProps` (guest mode allowed) except for flag-pothole submission and water dashboard, which require authentication (`protectedPageProps`).

---

### 4.1 Community Impact Map

#### What it is
A crowdsourced directory of educational opportunities and support services across South Africa. Community members can submit schools, colleges, job/learnership openings, and support services; all submissions are displayed to anyone.

#### How it works (user flow)
1. Page opens on a **Discover** tab listing all approved/unverified submissions. Users filter by type (School / College / Job / Service) and province using filter chips.
2. Each submission card shows name, category, province/city, description, and a `StatusBadge` (Verified / Pending / Unverified).
3. **Add tab**: Three-step flow:
   - Step 1: Pick a type (School, College, Job/Learnership, Support Service).
   - Step 2: Fill in name, category (from `CATEGORIES[type]`), province, city, description, website, submitter name, and email.
   - Before insert, `checkDuplicate` queries Supabase for the same name+province combination and warns the user.
   - Step 3: Success screen.
4. **My Contributions tab**: Shows only the current user's submissions (calls `getUserSubmissions(user.id)`).
5. Stats bar across the top of the page shows total counts per type via `getSubmissionStats()`.

#### How it works (technical)
- `fetchSubmissions(filters)` queries the Supabase `community_submissions` table with province + type filters. `createSubmission(data)` inserts a new row.
- `checkDuplicate(name, province)` does a Supabase `.ilike` query before allowing insert.
- The page uses `withAuth` with `guestMode: true`, so anonymous users can browse and filter; the "Add" tab requires a real user session to submit (the user id is stored with the submission).
- Verification status is managed server-side and reflected in the `StatusBadge`.

#### Where the code is
- `src/pages/community/CommunityImpactPage.tsx`
- `src/services/communityImpactService.ts`

---

### 4.2 Pothole Map & Reporting

#### What it is
A three-page system for crowdsourcing road pothole reports: a browsable list/map of reported potholes, a reporting form with validation, and a personal contributions view.

#### How it works (user flow)

**Pothole Map** (`pothole-map`):
1. All potholes are loaded from Supabase on mount. The list can be filtered by province and "Needs Fixing Only" toggle.
2. Each pothole card shows: address, severity badge (low/medium/high), status badge (Reported / Needs Fixing / Fixed), flag count, date reported, and optional photo.
3. Authenticated users can:
   - **Flag** a pothole (confirm it still needs fixing). `flagPothole` increments the `flag_count` and marks `needs_fixing = true`. Users can only flag once (checked via `hasUserFlaggedPothole`).
   - **Mark as Fixed** — confirms a `status = 'fixed'` update via `markPotholeAsFixed`.
   - **Flag Image** — report a suspicious/fake photo via `flagPotholeImage`. A dropdown offers reasons: "looks_fake" / "inappropriate" / "wrong_location". Checks `hasUserFlaggedImage` to prevent repeat flags.
4. "Report a Pothole" button navigates to `flag-pothole`.

**Flag Pothole Form** (`flag-pothole`):
1. Form fields: severity radio (Low/Medium/High), address (province → city → suburb chained dropdowns from `saLocations.ts`), street name text input, description, optional photo upload.
2. `usePotholeValidation` runs on every field change. It detects spam keywords, gibberish patterns, all-caps abuse, and enforces rate limiting: max 3 reports per hour and no duplicate location (same province+city+suburb) within 24 hours — both checked against localStorage.
3. On valid submit: `createPothole` inserts to Supabase `potholes` table. If a photo was selected, `uploadPotholeImage` pushes it to Supabase Storage and attaches the URL.
4. After success, `recordSubmission(province, city, suburb, street)` updates the rate-limit localStorage keys.

**My Contributions** (`my-pothole-contributions`):
1. Shows `getUserReportedPotholes(user.id)` (potholes the user filed) and `getUserFlaggedPotholes(user.id)` (potholes the user has flagged) in separate sections.

#### How it works (technical)
- `getAllPotholes(filters)` queries the Supabase `potholes` table with optional province / needs_fixing filters. Results are client-side filtered further by `streetSearch` state.
- Spam detection in `usePotholeValidation` uses regex patterns from `src/utils/suspiciousPatterns.ts`. Rate-limit data is stored at `prospect_pothole_report_times` and `prospect_pothole_locations` localStorage keys.
- Image uploads go to Supabase Storage bucket; the returned public URL is stored on the `potholes` row.
- `image_flag_count` is incremented by a Supabase SQL function defined in `supabase/migrations/20260508_fix_image_flag_function.sql`.

#### Where the code is
- `src/pages/community/PotholeMapPage.tsx`
- `src/pages/community/FlagPotholePage.tsx`
- `src/pages/community/MyContributionsPage.tsx`
- `src/services/potholeService.ts`
- `src/hooks/usePotholeValidation.ts`
- `src/utils/suspiciousPatterns.ts`
- `src/data/saLocations.ts`

---

### 4.3 Water Dashboard

#### What it is
A province-level water utility dashboard showing live alerts, dam levels, water restrictions, maintenance schedules, preparedness tips, and historical/policy news. Data is scraped from utility websites by a server-side cron pipeline and stored in Supabase.

#### How it works (user flow)
1. On mount, user's previously selected province is restored from `localStorage('water_dashboard_province')`. Province can be changed via a dropdown.
2. Six tabs:
   - **Alerts** — Active water outage and disruption alerts with urgency badges (Critical / High / Medium / Low), affected areas, and source links.
   - **Dam Levels** — Table of major dams with current percentage full, trend indicator (rising/stable/falling, rendered by `DamTrendsChart`), and a critical threshold marker at 20%.
   - **Restrictions** — Current water restriction levels per area with a `RestrictionLevelGuide` component explaining what each numeric level means in practice (do/don't lists).
   - **Maintenance** — Scheduled maintenance windows with affected areas and expected duration.
   - **Preparedness** — Tips rendered by `PreparednessSection`: storage, conservation, health, emergency categories.
   - **History** — News and research items rendered by `ResearchSection`, filterable by type (historical / policy / research / breaking alert).
3. A "Refresh" button re-fetches data from Supabase.
4. A "Last updated" label shows when the scraper last ran.

#### How it works (technical)
- `getWaterDataByProvince(province)` in `waterService.ts` queries Supabase tables (`water_alerts`, `dam_levels`, `water_restrictions`, `maintenance_schedules`) with a province filter. Falls back to `public/data/water/latest.json` if Supabase returns nothing.
- `getWaterNews()` fetches from the `water_news_items` table (or the JSON fallback).
- The Supabase tables are populated by the server-side scraper pipeline in `lib/scrapers/`. Each source (`cape-town.ts`, `dws-dams.ts`, `ethekwini.ts`, `jhb-water.ts`, etc.) exports a `scrapeXxx()` function using `cheerio` to parse the utility's HTML. The manager (`water-scraper-manager.ts`) orchestrates all sources and writes via `lib/supabase-water.ts`. This pipeline is run via `npm run scrape:water` on a scheduled cron job — it is not part of the browser bundle.
- `DamTrendsChart` visualises a `DamLevel[]` array with rising/falling/stable colour coding and a red critical line at 20%.

#### Where the code is
- `src/pages/community/WaterDashboardPage.tsx`
- `src/services/waterService.ts`
- `src/components/water/DamTrendsChart.tsx`
- `src/components/water/PreparednessSection.tsx`
- `src/components/water/ResearchSection.tsx`
- `src/components/water/RestrictionLevelGuide.tsx`
- `lib/scrapers/` — server-side scraper pipeline
- `public/data/water/latest.json` — static fallback
- `supabase/migrations/20260502_water_tables.sql`

---

### 4.4 Tax & Budget Calculator

#### What it is
A personal finance tool that calculates South African income tax using 2026 SARS brackets, then estimates a monthly budget breakdown based on gross salary, province, and living situation.

#### How it works (user flow)
1. **Income section**: User enters monthly gross salary. The tool calculates annual tax using the 2026 brackets, subtracts the primary rebate (R17,235), adds UIF at 1%, and displays: annual tax, effective tax rate, monthly take-home, and monthly UIF.
2. **Budget section**: User selects province and living situation (alone / shared / family). The tool looks up estimated rent, food, transport, utilities, and other costs from hardcoded province × situation lookup tables, then shows a budget breakdown with remaining amount.
3. **Accordion sections** — each category (Tax, Budget, Explainer) can be collapsed/expanded independently via `SectionCard` components.

#### How it works (technical)
- `calculateAnnualTax(annualIncome)` uses the `TAX_BRACKETS_2026` array: it finds the bracket via `.reverse().find()` and computes `base + (income - bracketMin) * rate / 100`, then subtracts `PRIMARY_REBATE`.
- Budget estimates (`RENT_ESTIMATES`, `FOOD_ESTIMATES`, `TRANSPORT_ESTIMATES`) are hardcoded per-province/situation lookup tables defined at the top of the page file.
- All computation is synchronous client-side. No Supabase calls. No data persistence.
- Uses `guestMode: true` — no login required.

#### Where the code is
- `src/pages/community/TaxBudgetPage.tsx`

---

### 4.5 Cost of Living

#### What it is
A province-level comparison of key living costs: 95/93 petrol prices, electricity tariffs, basic food basket cost, and monthly water charges. Trend indicators show whether costs are rising, stable, or falling.

#### How it works (user flow)
1. User selects a province from a dropdown. Cost cards appear for petrol, electricity, food basket, and water.
2. Each card shows a current value and a trend indicator (up/down/stable arrow).
3. No user input beyond province selection.

#### How it works (technical)
- Data source is `public/data/cost-of-living.json` (a static JSON file), fetched on mount via `fetch('/data/cost-of-living.json')`. There is also a `COST_OF_LIVING` constant in `src/data/mapData.ts` used by the Map Insights tab.
- Uses `guestMode: true`.

#### Where the code is
- `src/pages/community/CostOfLivingPage.tsx`
- `public/data/cost-of-living.json`

---

### 4.6 Civics Guide

#### What it is
A step-by-step procedural guide for common South African civic processes — obtaining a Smart ID card, registering to vote, applying for an IEC procedure, accessing government services, etc. Each procedure includes required documents, step-by-step instructions, contacts, FAQs, and common mistakes.

#### How it works (user flow)
1. A searchable list of civic procedures is shown, grouped by category (Identity, Voting, Government Services, etc.) and filterable by subcategory and difficulty (Easy / Medium / Hard).
2. Clicking a procedure opens a detail view with:
   - Overview and eligibility criteria.
   - Numbered steps, each expandable to show tips, documents needed, and forms.
   - Required documents list.
   - Contact organisations with phone, email, website, and hours.
   - Common mistakes to avoid.
   - FAQs toggle.
   - A "Share" button copies the procedure name to clipboard.
3. Breadcrumb navigation returns to the list.

#### How it works (technical)
- Data is loaded from `public/data/civics-procedures.json` via `fetch` on mount. The `Procedure` interface (id, title, category, subcategory, eligibility, steps, forms, contacts, faq, etc.) maps directly to this JSON structure.
- Filtering is client-side `useMemo` over the loaded `procedures` array.
- `searchQuery` filters against title, category, subcategory, and overview fields.
- Uses `guestMode: true`.

#### Where the code is
- `src/pages/community/CivicsPage.tsx`
- `public/data/civics-procedures.json`

---

## 5. Auth & Accounts

### What it is
Email/password authentication backed by Supabase Auth. No third-party OAuth. The auth UI is a single combined page handling sign-in, sign-up, and password reset.

### How it works (user flow)

**Sign Up:**
1. User navigates to `auth` page (via "Sign in / Register" links throughout the app, or automatic redirect from protected pages).
2. Enters full name, email, password. A live `getPasswordStrength` indicator shows weak/medium/strong as they type.
3. On submit, `signUp(email, password, fullName)` creates the Supabase user (no email confirmation required), signs in immediately, stores session to localStorage, and calls `onAuthSuccess(user)` in `App.tsx` which sets `user` state and navigates to `dashboard`.

**Sign In:**
1. User enters email and password. `signIn(email, password)` calls Supabase, stores tokens to localStorage, and returns the user.
2. Known Supabase error strings are mapped to friendly messages (e.g., "Invalid login credentials" → "Email or password is incorrect").

**Password Reset:**
1. "Forgot password" link switches the form to `mode='forgot'`.
2. `sendPasswordReset(email)` sends a Supabase reset email with a redirect to `/auth?mode=reset`.

**Session Restore:**
On every app load, `App.tsx` calls `supabase.auth.getSession()`. If no active Supabase session is found, it falls back to `restoreSessionFromStorage()` in `lib/auth.ts` which reads stored access/refresh tokens from localStorage, checks expiry, refreshes via Supabase if needed, and calls `supabase.auth.setSession()` to restore the client session without requiring a re-login.

**Sign Out:**
`handleSignOut` in `App.tsx` calls `supabase.auth.signOut()`, clears local session via `clearSessionLocally`, stops the background sync interval, and resets `page` to `'home'`.

**Community Impact Auth:**
A separate `ImpactAuthPage` exists for the Community Impact section — it is themed differently but uses the same underlying `signIn`/`signUp` functions.

**Guest / Test modes:**
- Career pages pass `guestMode: true` to `withAuth`, which fabricates an anonymous `User` object so unauthenticated visitors can browse without being redirected.
- Playwright tests inject `?__test_mode=true` in the URL; `App.tsx` and `withAuth` both detect this flag and fabricate a synthetic authenticated user without any Supabase call.

### How it works (technical)
- `src/lib/auth.ts` wraps Supabase Auth with localStorage mirroring. Keys: `AUTH_SESSION`, `AUTH_ACCESS_TOKEN`, `AUTH_REFRESH_TOKEN`, `AUTH_USER`, `AUTH_LAST_LOGIN` (all `_v2` suffixed, defined in `storageStrategy.ts`).
- `isTokenExpired(token)` decodes the JWT exp claim without a library, using `atob` on the payload segment.
- `getPasswordStrength(password)` checks length (≥8), uppercase, lowercase, number, special character — returns score 0–5 and a label.

### Where the code is
- `src/pages/auth/AuthPage.tsx`
- `src/pages/auth/ImpactAuthPage.tsx`
- `src/lib/auth.ts`
- `src/lib/withAuth.tsx`
- `src/lib/supabase.ts`
- `src/config/storageStrategy.ts`

---

## 6. Data Persistence — How User Data Is Saved and Synced

Prospect SA uses a **localStorage-primary, Supabase-secondary** persistence model. This ensures the app works instantly without waiting for network responses and remains functional in poor-connectivity environments.

### Storage keys (all `_v2` suffix)
Defined centrally in `src/config/storageStrategy.ts`:

| Key | Data |
|-----|------|
| `prospect_quiz_results_v2` | Latest RIASEC scores and career matches |
| `prospect_career_bookmarks_v2` | Saved career IDs |
| `prospect_bursary_bookmarks_v2` | Saved bursary IDs |
| `prospect_study_progress_v2` | Per-topic mastery levels |
| `prospect_calendar_events_v2` | User-created calendar events |
| `prospect_learning_paths_v2` | Learning path progress |
| `AUTH_SESSION / ACCESS_TOKEN / REFRESH_TOKEN / USER / LAST_LOGIN` | Auth session |

### Sync rules
1. **Write → localStorage first.** Every write (bookmark, quiz result, study progress, calendar event) hits localStorage synchronously before any Supabase call.
2. **Login sync (Supabase wins).** On successful authentication, `syncUserDataOnLogin(userId)` pulls each data type from Supabase and merges into localStorage. Supabase wins on conflict (newer timestamp or Supabase record takes precedence).
3. **Background sync every 5 minutes.** `startBackgroundSync(userId)` sets a `setInterval` at `SYNC_INTERVAL_MS` (300,000ms). On each tick it reads "dirty" (locally changed) records from localStorage and pushes them to the appropriate Supabase tables.
4. **On sign-out.** `stopBackgroundSync()` clears the interval. Session keys are removed from localStorage by `clearSessionLocally`.

### Supabase tables involved in sync
- `study_progress` — per-user, per-topic mastery
- `calendar_events` — user-created school calendar events
- `learning_progress` — learning path progress
- `user_bookmarks` — saved careers and bursaries (managed by `bookmarkService`)
- `user_unanswered_questions` — questions submitted via School Assist search

### Migration
On every app mount, `runMigrations()` (`src/utils/migrationScript.ts`) checks a `prospect_migration_v` localStorage key and runs any outstanding versioned migrations (currently 2). Migration 1 renames the legacy `study_progress` key to the `_v2` naming convention; Migration 2 handles further key renames. This is idempotent and runs in under a millisecond.

### Where the code is
- `src/services/supabaseSync.ts` — login sync and background push
- `src/services/storageService.ts` — localStorage CRUD helpers
- `src/config/storageStrategy.ts` — all keys and sync constants
- `src/utils/migrationScript.ts` — versioned key migrations
- `src/services/bookmarkService.ts` — bookmark-specific sync
- `src/services/quizService.ts` — quiz result persistence
