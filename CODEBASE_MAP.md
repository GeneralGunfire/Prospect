# Codebase Map — Prospect SA

A complete, file-by-file map of the `landingpage` project for new developers. The product is **Prospect**, a free South African platform for career discovery (RIASEC quiz, 400+ careers, bursaries, TVET pathways), school assistance (Grades 10–12 study library, calendar, AI-style chat), and civic tools (pothole flagging, water dashboard, tax/budget, cost of living, civics).

## 1. Stack & High-Level Architecture

- **Build tool**: Vite 6 (NOT Next.js, no SSR, no file-system router)
- **Framework**: React 19 + TypeScript (strict bundler module resolution, JSX = `react-jsx`)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite` plugin (config-less; theme in `src/index.css` `@theme` block)
- **Routing**: **State-based** — single `page` state in `src/App.tsx` swaps lazy-loaded page components inside an `<AnimatePresence>`. URL `?page=<name>` is read once on mount.
- **Animation**: `motion` (v12, the framer-motion successor)
- **Auth & DB**: Supabase (`@supabase/supabase-js`) — email/password, RLS-protected tables. Sessions are persisted to localStorage with a custom restore layer.
- **Maps**: Leaflet + react-leaflet
- **AI**: `@google/genai` (Gemini) used in School Assist chat
- **Tests**: Playwright (Chromium only), sequential; tests bypass auth using `?__test_mode=true` query param recognised by `App.tsx` and `withAuth`.
- **Server-side scrapers**: `lib/scrapers/*` run with `tsx` (Node) — scrape water-utility websites and write into Supabase. Not part of the browser bundle.

Path alias: `@/*` → repo root (`vite.config.ts` + `tsconfig.json`).

---

## 2. Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts. Scripts: `dev` (vite on port 3000, host 0.0.0.0), `build`, `preview`, `lint` (`tsc --noEmit`), `test` / `test:ui` / `test:debug` / `test:headed` (Playwright), `scrape:water` / `scrape:water:local` (run water scrapers via `tsx`). Notable deps: react 19, motion 12, @supabase/supabase-js, react-leaflet 5, react-day-picker 9, @google/genai, @radix-ui/react-* (dialog, popover, select, slot, icons), lucide-react, class-variance-authority, clsx, tailwind-merge, cheerio (server scraping), express (likely scraper-side). |
| `vite.config.ts` | Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`. Defines `process.env.GEMINI_API_KEY` from env. Alias `@` → repo root. Dev server port 3000 with optional HMR disable via `DISABLE_HMR=true`. Manual chunks: `vendor-react`, `vendor-motion`, `vendor-supabase`, `vendor-lucide`. |
| `tsconfig.json` | ES2022 target, `moduleResolution: bundler`, `jsx: react-jsx`, `noEmit: true`, `allowImportingTsExtensions: true`, `experimentalDecorators: true`, types include `vite/client`. Path alias `@/*` → `./*`. |
| `playwright.config.ts` | Test dir `./tests`, Chromium-only project, **`fullyParallel: false`** (auth tests share state), 30s timeout, baseURL `http://localhost:3000`, screenshots only on failure, trace on first retry. Auto-runs `npm run dev` via `webServer` (`reuseExistingServer: true`). |
| `index.html` | App shell. SEO meta tags (title, description, Open Graph, Twitter Card), JSON-LD WebSite schema with SearchAction targeting `?page=careers&q=...`. Mounts `<div id="root">` and loads `/src/main.tsx`. Theme color `#0f172a` (slate-900), favicon `/logo-icon.svg`. |
| `README.md` | Top-level project README. |
| `CODEBASE.md` | Pre-existing in-repo codebase notes. |
| `DESIGN.json` | Design tokens / system reference (JSON). |
| `supabase-migration-careers.sql`, `supabase-migration-community.sql`, `supabase-migration-potholes.sql` | One-shot SQL scripts to provision Supabase tables (schema for careers, community submissions, potholes). |

There is **no separate `tailwind.config.js`** — Tailwind 4 config lives inline as `@theme { ... }` inside `src/index.css`, plus the Vite plugin auto-detects content. There is no PostCSS config beyond `autoprefixer` (devDependency) which Vite/Tailwind handle.

---

## 3. Entry Point & Top-Level App

### `src/main.tsx`
React entry point. Creates root, wraps `<App />` in `<StrictMode>` and `<ToastProvider>` (from `components/ui/toast`), imports `./index.css` so Tailwind is loaded.

### `src/index.css`
Imports Inter from Google Fonts and Tailwind. Defines the design system via `@theme { --color-primary: #1e293b; --color-success, --color-warning, ... }` so Tailwind utilities like `bg-primary` resolve to the project palette.

### `src/App.tsx` — Routing, Auth Flow, Marketing Landing Page

This single file holds:

1. **State router**. `const [page, setPage] = useState<Page>('home')` where `Page = AppPage` (union imported from `lib/withAuth`). All pages are conditionally rendered as `{page === 'auth' && <AuthPage … />}` etc., wrapped in `<PageTransition>` (motion fade + slide). Almost every page is `lazy()`-imported and rendered inside a `<Suspense>` with a spinner fallback. `LoadingScreen` (eager import) covers initial asset preload.

2. **Auth bootstrap (`useEffect` on mount)**:
   - Reads `?__test_mode=true` (and other markers) — if present, fabricates a mock `User` so Playwright tests can deep-link via `?page=…&__test_mode=true`.
   - Otherwise calls `supabase.auth.getSession()`. If a session exists: sets user, calls `syncUserDataOnLogin(userId)` and `startBackgroundSync(userId)` from `services/supabaseSync`, then navigates to `?page=<param>` or `dashboard`.
   - If no Supabase session, falls back to `restoreSessionFromStorage()` (custom localStorage refresh-token flow in `lib/auth.ts`).
   - Subscribes to `supabase.auth.onAuthStateChange` to keep `user` in sync; on sign-out, calls `stopBackgroundSync()` and resets to `home`.

3. **Migrations**. Calls `runMigrations()` from `utils/migrationScript.ts` once on mount.

4. **Landing page** (only rendered when `page === 'home'`):
   - `AnimatedNav` — sticky pill nav that collapses on scroll-down and re-expands when scrolled up; mobile drawer with `AnimatePresence`. Items: Career Guide → `quiz`, School Assist → `dashboard` or `auth`, Community → `community-impact`.
   - `TutorialDialog` — 4-step Radix Dialog "How it works" (intro to Career Guide, School Assist, Community).
   - `<AnimatedHero>` (`components/marketing/animated-hero`) — typing-animation hero.
   - `FeaturesSection` — three-card grid (Community, School Assist, Careers).
   - `<LogoCloud>` (`components/marketing/logo-cloud-2`).
   - `CareerGuideSection` — six career-tool cards (Quiz, Browser, TVET, Bursaries, Map, APS).
   - `HowItWorks` — three-step numbered explainer.
   - `DiscoveryGrid` — five career-image tiles (engineer/nurse/teacher/electrician/students) using `<picture>` with WebP+JPG fallback.
   - `LampSection` — Aceternity-style lamp glow with Mandela quote.
   - `Footer` — three link sections + socials.

5. **Page props pattern**:
   - `protectedPageProps = { onNavigateAuth: () => setPage('home'), onSignOut, onNavigate }` — used for pages requiring real auth.
   - `careerPageProps = { onNavigateAuth: () => setPage('auth'), onSignOut, onNavigate, guestMode: true }` — used for pages that may be browsed by guests; `withAuth` HOC produces a synthetic anonymous user.

The full set of routes (the `Page` union) is declared in `src/lib/withAuth.tsx` as the `AppPage` type — adding a new page requires (a) adding the key to that type, (b) lazy-importing in `App.tsx`, (c) adding a conditional render block.

---

## 4. `src/lib/` — Core Library Layer

### `src/lib/supabase.ts`
Creates the singleton Supabase client from `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Throws on missing env. Configured with `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`. Exports `supabase`.

### `src/lib/auth.ts`
Email/password auth helpers wrapping Supabase Auth + custom localStorage layer. Exports:
- `signUp(email, password, fullName)` — sign up (no email confirmation), auto sign-in, store session locally. Maps known error strings to friendly messages.
- `signIn(email, password)` — login + local store.
- `signOut()` — clears local + Supabase session.
- `sendPasswordReset(email)` — Supabase reset email; redirect to `/auth?mode=reset`.
- `restoreSessionFromStorage()` — reads stored access/refresh tokens; if expired, refreshes via `supabase.auth.refreshSession`; calls `supabase.auth.setSession` to restore client.
- `getCurrentUserFromStorage()`, `getAuthTokensFromStorage()` — synchronous reads from localStorage.
- `getPasswordStrength(password)` — returns `{ score, label: 'weak'|'medium'|'strong', checks }`.
- Internal helpers: `storeSessionLocally`, `clearSessionLocally`, `isTokenExpired`.
- `interface AuthError`.
Storage keys come from `config/storageStrategy.ts` (`AUTH_SESSION`, `AUTH_ACCESS_TOKEN`, `AUTH_REFRESH_TOKEN`, `AUTH_USER`, `AUTH_LAST_LOGIN`).

### `src/lib/withAuth.tsx`
The auth HOC and the central `AppPage` type union of all valid `page` values. Exports:
- `type AppPage` — every page name supported by the router.
- `interface AuthedProps { user, onSignOut, onNavigate }` — what protected pages receive.
- `withAuth(Component)` — wraps a page so it:
  1. Honors test mode (Playwright global / sessionStorage / localStorage / `?__test_mode=true`) by injecting a mock `User`.
  2. Honors a `__test_mock_session__` localStorage key (used by some tests).
  3. Falls back to `getCurrentUserFromStorage()` for instant rendering while Supabase resolves.
  4. If `guestMode: true`, fabricates an anonymous guest user instead of redirecting.
  5. Otherwise calls `props.onNavigateAuth()`.
   Returns `null` while resolving (the App-level `LoadingScreen` covers the gap).

### `src/lib/utils.ts`
Single helper `cn(...inputs)` = `twMerge(clsx(inputs))`. Used by every UI component to compose Tailwind classes.

### `src/lib/careersService.ts`
Career-data fetch & filter layer over Supabase + a 24h localStorage cache (`prospect_sa_careers_cache` / `_time`). Exports:
- `interface CareerFilter` (searchQuery, category, riasecCodes, demandLevel, salary range).
- `fetchAllCareers()`, `fetchCareerById(id)`, `searchCareers(filters)` — Supabase reads, with client-side filtering for complex predicates (RIASEC, salary, fuzzy text).
- `saveCareersCache(careers)`, `getCareersCache()` — 24h cache.
- `findSimilarCareers(careerId, allCareers)` — RIASEC-distance + category similarity, top 5.

Note: most pages today read careers from the static datasets (`data/careers400Final.ts`, `data/careersFullData.ts`) rather than Supabase; this service exists for the Supabase-backed view.

---

## 5. `src/services/` — Data Services (Supabase + localStorage)

The services follow a consistent **localStorage-first** pattern: every write hits localStorage immediately, and a background push to Supabase reconciles for authenticated users. Storage keys and Supabase table names are centralized in `src/config/storageStrategy.ts`.

| File | Role |
|------|------|
| `bookmarkService.ts` | Saved careers and saved bursaries. Local keys `prospect_career_bookmarks_v2`, `prospect_bursary_bookmarks_v2`. `BookmarkState`, `saveBookmark`, `removeBookmark`, `getUserBookmarks`. Includes embedded SQL setup comments for the `user_bookmarks`, `aps_marks`, `study_progress` tables. |
| `communityImpactService.ts` | Community Impact Map submissions (school / college / job / service). Types: `Submission`, `NewSubmission`, `SubmissionFilters`, `SubmissionType`, `VerificationStatus`, `ApprovalStatus`. Exports `fetchSubmissions`, `createSubmission`, `checkDuplicate`, `getUserSubmissions`, `getSubmissionStats`. Reads `community_submissions` table. |
| `dashboardService.ts` | School Assist dashboard reads. Aggregates career-related data from `careers400Final` + `mapData` + `bursaries`, plus `getStudyProgress`, `markLessonComplete` for the Study Library. |
| `mapService.ts` | Pure data helpers over `careers400Final`, `mapData`, `bursaries`. Functions: `getCareersByProvince`, `getCareersByCity`, `getHighDemandCareers`, `getUniversitiesByProvince`, `getTVETCollegesByProvince`, `getIndustryBreakdown`, `getTopEmployersByProvince`, `countCareersInProvince`, `countCollegesInProvince`, `getAverageSalaryByProvince`, `createUniversityMarkers`, `createTVETMarkers`. Exports `MapMarker`. No Supabase calls. |
| `potholeService.ts` | Pothole CRUD against the `potholes` table. Types `Pothole`, `PotholeSeverity`, `PotholeStatus`, `CreatePotholeData`, `PotholeFilters`, `ImageFlagReason`. Functions: `createPothole`, `uploadPotholeImage`, `getAllPotholes`, `getUserReportedPotholes`, `getUserFlaggedPotholes`, `flagPothole`, `markPotholeAsFixed`, `hasUserFlaggedPothole`, `flagPotholeImage`, `hasUserFlaggedImage`. Includes Supabase Storage uploads. |
| `quizService.ts` | RIASEC quiz results — localStorage-first. Local key `prospect_quiz_results_v2`. Exports `QuizResult`, `saveQuizResults`, `getUserQuizResults`, `getLatestQuizResult`. |
| `schoolAssistService.ts` | Search engine for the Study Library + the Q&A index. Includes a custom **Levenshtein-distance** fuzzy matcher (`levenshteinDistance`, `fuzzyMatch`) and `TopicResult` / `QuestionResult` types. Backs the School Assist landing/search pages. |
| `storageService.ts` | Generic localStorage CRUD with `studyProgressStorage`, `calendarStorage`, `learningPathStorage` modules. Exports `StudyProgress`, `UserCalendarEvent`, `LearningPathProgress`, plus a generic `storage.get/set` helper. Cache keys come from `config/storageStrategy.CACHE_KEYS`. |
| `supabaseSync.ts` | Background sync between localStorage (primary) and Supabase (secondary). Exports `syncUserDataOnLogin(userId)` (pulls study_progress, calendar_events, learning_progress and merges into local stores — Supabase wins on conflict), `startBackgroundSync(userId)` and `stopBackgroundSync()` (5-min `setInterval` push of dirty data). Uses dynamic `import('../lib/supabase')` to keep initial bundle thin. |
| `unansweredQuestionService.ts` | "Ask a question" feature — writes to `user_unanswered_questions` table. Types `UnansweredQuestion`, `SubmitQuestionData`. Exports `submitQuestion`, plus accessors for status (`pending`, `answered`, `marked_resolved`). |
| `waterService.ts` | Water dashboard data. Types `WaterAlert`, `DamLevel`, `MaintenanceSchedule`, `WaterRestriction`, `WaterNewsItem`. Reads provincial alerts and dam levels from Supabase tables (populated by the `lib/scrapers/*` cron-run scrapers) and falls back to `public/data/water/latest.json`. |

---

## 6. `src/config/`

### `src/config/storageStrategy.ts`
Single source of truth for storage policy. Exports:
- `CACHE_KEYS` — every localStorage key (`QUIZ_RESULTS`, `SAVED_CAREERS`, `SAVED_BURSARIES`, `STUDY_PROGRESS`, `CALENDAR_EVENTS`, `LEARNING_PATHS`, plus all 5 `AUTH_*` keys), all suffixed `_v2`.
- `SYNC_INTERVAL_MS` — 5 minutes.
- `SUPABASE_TABLES` — `study_progress`, `calendar_events`, `learning_progress`.
- `type CacheKey`.
- A long inline comment documenting the four sync rules: localStorage primary; Supabase only when logged in; sync on login (Supabase wins) / on write (push background) / every 5 min if online; Supabase wins on conflict for authenticated users.

---

## 7. `src/data/` — Static Datasets

These are large TypeScript const arrays bundled into the app (no fetch needed). Replace the database for most read paths.

| File | Contents |
|------|----------|
| `careersTypes.ts` | Canonical `interface CareerFull` — id, title, category, description, dayInTheLife, riasecMatch (R/I/A/S/E/C numeric scores), matricRequirements, studyPath, providers, salary, jobLocations, jobDemand, etc. |
| `careers.ts` | Lightweight `interface Career` and `careers[]` — older/simpler shape used by `Grade10SubjectSelectorPage`. |
| `careersFullData.ts` | Initial 20-ish detailed careers (`careersFullData`, `allCareersFullData`). Used by the TVET careers page. |
| `careersFullAudited.ts` | Audited career database (`careerDatabase: CareerFull[]`), top demand tier. |
| `careers400Final.ts` | Master 400+ career catalogue (`allCareersComplete`) — composed by importing `careerDatabase` from `careersFullAudited` plus every batch in `data/batches/`. **The primary data source for Careers, Map, and Dashboard.** |
| `bursaries.ts` | Verified bursary list (200+) with eligibility, deadlines, contacts. Includes `Requirement` interface. |
| `quizQuestions.ts` | RIASEC quiz items — 42 questions, each tagged `R`/`I`/`A`/`S`/`E`/`C`, optional `careerExamples`. |
| `quizScoringLogic.ts` | `computeQuizResults` — converts user answers into RIASEC vector and `CareerMatch[]`. |
| `subjects.ts` | Grade 10 subject list (Core / Elective). |
| `subjectCareerMapping.ts` | Map of subject → recommended careers for the Grade 10 selector. |
| `tvetCareers.ts` | 70+ TVET (vocational) careers with `getTopTVETCareers`. |
| `tvetColleges.ts` | All public TVET colleges with location, contact, specializations. |
| `universityRequirements.ts` | Subject → minimum mark for degree types; `apsScoreGuide`. |
| `mapData.ts` | SA geographic data — `PROVINCES`, `MAJOR_CITIES`, `UNIVERSITIES`, `TVET_COLLEGES`, `COST_OF_LIVING`, `PROVINCE_JOB_DEMAND`, `INDUSTRY_BREAKDOWN`, `TOP_EMPLOYERS`. Helpers `getProvinceFromCoords`, `getNearestCity`. Backbone for Map page and Insights tab. |
| `saLocations.ts` | Province → city → suburb tree (`SA_LOCATIONS`, `SA_PROVINCES`, `getCities`, `getSuburbs`). Used by the Flag Pothole form. |
| `demoLearningPath.ts` | Sample learning path data and `TopicStatus`/`DiagnosticQuestion` types for the school dashboard. |

### `src/data/batches/` — Career Catalog Shards
Each file exports a `*Careers: CareerFull[]` array imported by `careers400Final.ts`. Splitting keeps individual files small and reviewable. Files:
- `batch_agriculture2.ts`
- `batch_business.ts`, `batch_business2.ts`, `batch_business3.ts`
- `batch_creative2.ts`, `batch_education_creative.ts`, `batch_education2.ts`
- `batch_digital.ts`, `batch_digital2.ts`
- `batch_engineering.ts`, `batch_engineering2.ts`
- `batch_healthcare.ts`, `batch_healthcare2.ts`, `batch_healthcare3.ts`, `batch_healthcare4.ts`
- `batch_legal_finance.ts`
- `batch_media_comms.ts`
- `batch_public_services.ts`, `batch_public_services2.ts`
- `batch_trades.ts`, `batch_trades2.ts`, `batch_trades3.ts`

### `src/data/studyLibrary/` — CAPS Curriculum Content
Topic modules used by Study Library and `schoolAssistService` search.
- `index.ts` — barrel that aggregates every topic into `grade10Term1AllTopics` (and other groupings) imported by services and pages.

Maths/Sciences (Grade 10):
- `algebraicExpressions.ts`, `equationsAndInequalities.ts`, `numberPatterns.ts`, `functions.ts`, `mathematicalModelling.ts`
- `wavesSoundLight.ts`, `atomsSubatomicParticles.ts`, `classificationOfMatter.ts`, `periodicTableTrends.ts`, `chemicalBonding.ts`

Life Sciences:
- `biodiversityAndClassification.ts`, `fiveKingdoms.ts`, `taxonomyAndBinomialNomenclature.ts`, `speciesConcept.ts`

Accounting:
- `introductionToAccounting.ts`, `accountingEquation.ts`, `doubleEntrySystem.ts`, `remainingTopics.ts` (re-exports `sourceDocuments`, `journalsInAccounting`, `generalLedgerTopics`)

Economics & Business:
- `businessStudiesTopics.ts` (`businessEnvironment`, `businessSectors`, `businessStakeholders`, `businessOperations`)
- `economicsTopics.ts` (`economicProblem`, `productionPossibilityCurve`, `economicSystems`, `circularFlowModel`, `factorsOfProduction`)

Other CAPS subjects:
- `catAndEgdTopics.ts`, `egdTopics.ts`, `englishTopics.ts`

---

## 8. `src/hooks/`

### `src/hooks/usePotholeValidation.ts`
Validation gate for the Flag Pothole form. Detects spam/gibberish (`SPAM_KEYWORDS`, `POTHOLE_KEYWORDS`, `GIBBERISH_PATTERN`, `ALL_CAPS_PATTERN`, `PROVINCE_CITY_MAP` from `utils/suspiciousPatterns.ts`), enforces rate limits via two localStorage keys (`prospect_pothole_report_times`, `prospect_pothole_locations`), and returns a `useMemo`-d validation result. Also exports `recordSubmission(province, city, suburb, street)` to be called after a successful submit.

---

## 9. `src/utils/`

### `src/utils/migrationScript.ts`
Idempotent runner invoked by `App.tsx` on every mount. Tracks completion in `prospect_migration_v` and runs versioned migrations (currently 2). Migration 1 renames the legacy `study_progress` localStorage key to `prospect_study_progress_v2`; Migration 2 covers further key renames.

### `src/utils/suspiciousPatterns.ts`
Pure constants used by `usePotholeValidation`: `SPAM_KEYWORDS`, `POTHOLE_KEYWORDS`, `GIBBERISH_PATTERN`, `ALL_CAPS_PATTERN`, `PROVINCE_CITY_MAP` (province → list of valid city names for sanity check).

---

## 10. `src/components/`

### `src/components/StudyLibrary/`
Empty directory (no `.tsx` files at the time of writing) — appears to be reserved for future Study Library widgets; current Study Library UI is inlined in `pages/school/StudyLibraryPage.tsx`.

### `src/components/careers/`
- **`CareerCard.tsx`** — Card showing one career with RIASEC color-coded badges (R/I/A/S/E/C). Accepts both legacy `Career` and `CareerFull`. Props: `career`, `onCardClick`.
- **`CareerDetailModal.tsx`** — Animated modal (motion + lucide icons) showing full career detail: study path, salary, demand, providers, related careers, bookmark toggle.
- **`CareersTab.tsx`** — Province-scoped career grid with sort/filter (`'all'|'high'|'salary'|'tvet'`). Used inside the Map page.
- **`SearchBox.tsx`** — Autocomplete combo box that searches `allCareersComplete` and `MAJOR_CITIES`.
- **`TVETCareerCard.tsx`** — Card variant for TVET-only careers.

### `src/components/map/`
- **`CollegesTab.tsx`** — Universities & TVET colleges by province (sub-tabs).
- **`InsightsTab.tsx`** — Province statistics: career count, avg salary, industry breakdown, top employers, education landscape.
- **`LocationInput.tsx`** — Lets the user pick a city via autocomplete, geolocation API, or manual entry. Returns `UserLocation { lat, lng, label, province }`.
- **`MapDisplay.tsx`** — Leaflet map (`MapContainer` + `TileLayer` + `FeatureGroup` + `Marker` + `Popup`) with custom icons for user, careers, universities, TVET, job hotspots; uses `PROVINCES` and `getProvinceFromCoords` from `data/mapData`.

### `src/components/marketing/`
- **`animated-hero.tsx`** — Hero with a typing animation cycling through `['now', 'future', 'life', 'path']`. Exports `Hero`. Calls `onNavigate(page)` from primary CTA.
- **`logo-cloud-2.tsx`** — Marquee-style logo cloud. Exports `LogoCloud`. Defines internal `Logo` type.
- **`neo-minimal-footer.tsx`** — Alternative dark/grid-textured footer with social icons. Exports `NeoMinimalFooter`. Note: `App.tsx` uses its own inline `Footer` component on the home page — `NeoMinimalFooter` is imported but currently unused in the main layout.

### `src/components/quiz/`
- **`SkippedQuestionsPanel.tsx`** — Slide-in panel listing quiz questions the user skipped, with click-to-jump. Used in `QuizPage`.

### `src/components/shell/`
- **`AppHeader.tsx`** — The persistent app header used on every signed-in page. Animated collapse-on-scroll, mobile drawer, auth/user menu (sign out), navigation across all `AppPage` values. Knows about Career, School, and Community sections via `mode` prop. Handles search, "How it works" help, and account state.
- **`LoadingScreen.tsx`** — Full-screen morphing-text intro that cycles through `['Discover', 'Plan', 'Elevate', 'Succeed', 'Prospect SA']`. Calls `onComplete()` when done — `App.tsx` uses this to gate first paint.

### `src/components/tvet/`
- **`TVETSubNav.tsx`** — Pill sub-nav for the TVET section: Overview / Careers / Colleges / Funding / Requirements. Takes `currentPage` and `onNavigate`.

### `src/components/ui/`
- **`toast.tsx`** — In-house toast system. Exports `<ToastProvider>` (mounted in `main.tsx`) and a global `toast` object (`toast.success/error/warning/info`) that dispatches via a module-level `externalAdd` ref. Variants: `success | error | warning | info`. Uses `cn()` for class composition.

### `src/components/water/`
- **`DamTrendsChart.tsx`** — Visualizes dam-level trends with rising/falling/stable indicators. Critical threshold = 20%. Consumes `DamLevel[]` from `waterService`.
- **`PreparednessSection.tsx`** — Categorized water-preparedness tips (storage, conservation, health, emergency).
- **`ResearchSection.tsx`** — Filterable list of `WaterNewsItem`s by type (historical / policy / research / breaking_alert / all).
- **`RestrictionLevelGuide.tsx`** — Explains numeric restriction levels (do/don't lists). Consumes `WaterRestriction[]`.

---

## 11. `src/pages/`

All page components are lazy-loaded by `src/App.tsx`. Most are wrapped with `withAuth(...)` (or its `guestMode` variant) so they receive `{ user, onSignOut, onNavigate }` directly.

### `src/pages/auth/`
- **`AuthPage.tsx`** — Combined login / signup / forgot-password screen. Modes `'login' | 'signup' | 'forgot'`. Uses `signIn`, `signUp`, `sendPasswordReset`, `getPasswordStrength` from `lib/auth`. On success calls `onAuthSuccess(user)` (App.tsx then navigates to `dashboard`).
- **`ImpactAuthPage.tsx`** — Auth screen themed for the Community Impact section. Modes `'login' | 'signup'`.

### `src/pages/careers/`
- **`QuizPage.tsx`** — RIASEC quiz UI. Reads `quizQuestions`, computes via `computeQuizResults`, persists with `saveQuizResults`. Includes `SkippedQuestionsPanel`. Final screen shows top career matches and shareable copy.
- **`CareersPageNew.tsx`** — Browse 400+ careers (`allCareersComplete`). Search, category filter, opens `CareerDetailModal`. Bookmark integration via `bookmarkService`. Uses `findSimilarCareers` for related careers.
- **`BursariesPage.tsx`** — Search and filter bursaries (category, field, income, citizenship). Bookmark toggle.
- **`BursaryDetailPage.tsx`** — Single bursary detail page; reads `selectedBursaryId` from `sessionStorage`. Displays eligibility checklist, application steps, contacts.
- **`Grade10SubjectSelectorPage.tsx`** — Helps Grade 10 students pick subjects. Inputs subjects → outputs recommended careers (`getTopMatchingCareers` from `subjectCareerMapping`), university requirements (`getSubjectRequirements`, `apsScoreGuide`), and TVET options (`getTopTVETCareers`).
- **`MapPage.tsx`** — Interactive Leaflet map. Composes `LocationInput` → `MapDisplay` + tabs (`CareersTab`, `CollegesTab`, `InsightsTab`) + `SearchBox` + `CareerDetailModal`. Detects province from coords and pulls relevant data via `mapService`.

### `src/pages/community/`
- **`CommunityImpactPage.tsx`** — Community Impact Map: lists submissions (school/college/job/service), filters by type/province, lets users `createSubmission` (with duplicate check) and view stats.
- **`PotholeMapPage.tsx`** — Map of all flagged potholes; filter by province / needs-fixing-only; flag a pothole again, mark as fixed, flag suspicious image.
- **`FlagPotholePage.tsx`** — Form to report a new pothole: severity radio, address (province → city → suburb chained from `saLocations`), optional photo upload. Uses `usePotholeValidation` to gate submission.
- **`MyContributionsPage.tsx`** — Shows the user's reported potholes and the ones they've flagged.
- **`WaterDashboardPage.tsx`** — Province-level water dashboard composing `PreparednessSection`, `ResearchSection`, `RestrictionLevelGuide`, `DamTrendsChart`. Calls `getWaterDataByProvince` from `waterService`.
- **`TaxBudgetPage.tsx`** — SA personal-income-tax calculator using 2026 SARS brackets, plus budget/explainer cards for spending categories.
- **`CostOfLivingPage.tsx`** — Province-level cost-of-living: petrol 95/93, electricity, basket, water. Includes trend indicators.
- **`CivicsPage.tsx`** — Civics explainer (e.g., ID, voter, IEC processes — references `IdCard`, `Landmark` icons). Step-by-step UI with filters and share buttons.

### `src/pages/learning/Algebra/Grade10/Term1/`
- **`LinearEquations.tsx`** — Standalone interactive lesson for Grade 10 Term 1 linear equations. Heavily commented for pedagogical clarity. Uses `useState`, `useRef`, canvas-style refs.
- **`SimultaneousEquations.tsx`** — Companion lesson on simultaneous equations.

These two are the only "deep" learning lessons currently routed at the top level (`learning-algebra-g10-t1-linear-equations`, `learning-algebra-g10-t1-simultaneous`). Other curriculum content lives as data modules in `src/data/studyLibrary/` and is rendered inside `StudyLibraryPage`.

### `src/pages/school/`
- **`DashboardPage.tsx`** — School Assist dashboard. Aggregates study progress, calendar events, learning paths, recommended careers. Heavy UI: progress rings, streaks, upcoming events, suggestions, search, send-question.
- **`StudyLibraryPage.tsx`** — 4-step wizard: subject → grade → term → content. Reads `subjects` and uses `getStudyProgress`, `markLessonComplete`. Color-coded subject icons.
- **`CalendarPageNew.tsx`** — Year/month calendar with categories `exam | deadline | holiday | other`, add/delete events. Backed by `storageService.calendarStorage` + `supabaseSync`.
- **`SchoolAssistPage.tsx`** — Search landing for the Q&A engine. Calls into `schoolAssistService` (Levenshtein fuzzy match across topic titles and Q&A entries).
- **`SchoolAssistChatPage.tsx`** — Conversational chat UI backed by Gemini (`@google/genai`). Has microphone input, attachments, calculator widget, refresh, etc.

### `src/pages/tvet/`
- **`TVETPage.tsx`** — Overview / hero for the TVET pathway. Wraps `TVETSubNav`.
- **`TVETCareersPage.tsx`** — TVET-specific career browser using `allCareersFullData` and `TVETCareerCard`.
- **`TVETCollegesPage.tsx`** — Searchable list of all 50 public TVET colleges (`tvetColleges`).
- **`TVETFundingPage.tsx`** — NSFAS and bursary information for TVET students.
- **`TVETRequirementsPage.tsx`** — Per-trade entry requirements selector.

---

## 12. `tests/` — Playwright

All tests run against the dev server at port 3000 (auto-started by `playwright.config.ts`), Chromium, sequential. Most tests bypass auth using `?__test_mode=true` (recognised by `App.tsx` and `withAuth`). Some older tests still hard-code `localhost:5173` (Vite's old default) — those will fail unless that server is also up; mark them as outdated when reviewing.

| File | Purpose |
|------|---------|
| `README.md` | Full guide to the map test suite, geolocation mocking, debugging, CI patterns. |
| `auth.spec.ts` | Sign-up, sign-in, validation, password-strength on `AuthPage`. Uses helper `goToAuth(page)`. |
| `calendar-debug.spec.ts` | Captures console errors while loading `CalendarPageNew`. Uses `localhost:5173`. |
| `calendar-verify.spec.ts` | Smoke test: calendar renders without blank screen, looks for `[data-testid="year-calendar"]`. Uses `localhost:5173`. |
| `dashboard-learning.spec.ts` | Verifies `DashboardPage` renders stats and sections in test mode. Uses `localhost:5173`. |
| `features.spec.ts` | Top-level feature smoke tests. Clears localStorage between tests. |
| `map.spec.ts` | Full `MapPage` coverage: location input, autocomplete, geolocation, tabs, search, layer toggles, insights, careers tab, colleges tab. (See `tests/README.md`.) |
| `phase2.spec.ts` | Phase 2 — careers pagination behaviour (initial 25, load more). |
| `phase3.spec.ts` | Phase 3 — dashboard structure verification. |
| `prospect.spec.ts` | Broad smoke coverage with `waitForAppReady` helper. |
| `three-priorities.spec.ts` | Mocks Supabase session and exercises the three top user journeys. |

---

## 13. `public/` — Static Assets (served as-is from `/`)

```
public/
├── data/
│   ├── civics-procedures.json   # Static civics-page content
│   ├── cost-of-living.json      # Static fallback for cost-of-living page
│   ├── news/latest.json         # News fallback (SA News feature is now removed)
│   └── water/latest.json        # Water dashboard fallback when Supabase data is missing
├── images/
│   ├── electrician.{jpg,webp}
│   ├── engineer.{jpg,webp}
│   ├── nurse.{jpg,webp}
│   ├── students.{jpg,webp}
│   ├── teacher.{jpg,webp}        # Used by DiscoveryGrid in App.tsx
│   ├── logo.png
│   └── sa-flag.jpg
├── thumbnails/video1-poster.png  # Poster frame for the bursaries video
├── videos/
│   ├── Bursaries.mp4
│   └── video1.mp4
├── logo.svg
├── logo-icon.svg                 # Favicon (referenced from index.html)
├── robots.txt
└── sitemap.xml
```

WebP variants are used by `<picture>` elements in `App.tsx` for the discovery grid; JPG fallbacks exist for older browsers.

---

## 14. `lib/` (root, NOT `src/lib`) — Server-Side Tooling

Run via `tsx` against Node, NOT bundled into the browser app. Used for the water-data scraping pipeline that populates Supabase.

- **`lib/supabase-water.ts`** — Service-role Supabase client and helpers (`insertWaterOutage`, `upsertDamLevel`, `logScraperRun`). Loads `.env.local` via `dotenv`.
- **`lib/scrapers/scraper-config.ts`** — Per-source config (URL, province, timeout) for each utility (`rand_water`, `jhb_water`, etc.).
- **`lib/scrapers/water-scraper-manager.ts`** — Orchestrator. Imports each `scrapers/sources/*` and runs them, then writes results via `supabase-water`.
- **`lib/scrapers/sources/`** — One scraper per provider, each exporting a `scrapeXxx()` function. Files: `cape-town.ts`, `dws-dams.ts`, `ethekwini.ts`, `jhb-water.ts`, `nmdm.ts`, `rand-water.ts`. Use `cheerio` to parse HTML.

Run with `npm run scrape:water` (or `scrape:water:local` to load `.env.local`). Designed to be invoked from a cron / scheduled job.

---

## 15. `supabase/` — Database Migrations

`supabase/migrations/` contains versioned SQL files applied via the Supabase CLI:
- `20260502_water_tables.sql` — Creates water alerts / dam levels / restrictions tables.
- `20260502_water_rls_fix.sql` — Tightens RLS policies on the water tables.
- `20260502_cleanup_fake_potholes.sql` — Maintenance: removes test/spam potholes.
- `20260508_pothole_image_flags.sql` — Adds `image_flag_count` and the image-flag table.
- `20260508_fix_image_flag_function.sql` — Patches the SQL function used by `flagPotholeImage`.

The three top-level `supabase-migration-*.sql` files are older one-shot bootstrap scripts (careers, community, potholes) kept around for reference.

---

## 16. Build / Generated Output (don't edit)

- `dist/` — `vite build` output.
- `playwright-report/` — Last Playwright HTML report.
- `test-results/` — Per-test artifacts (screenshots, traces) from failed runs.
- `node_modules/` — installed packages.
- `docs/` — Project docs (markdown).

---

## 17. Quick Reference: How to Add a New Page

1. Create the page component under `src/pages/<area>/MyNewPage.tsx`. If it needs auth, default-export a `withAuth(...)`-wrapped component.
2. Add `'my-new-page'` to the `AppPage` union in `src/lib/withAuth.tsx`.
3. In `src/App.tsx`:
   - Lazy-import: `const MyNewPage = lazy(() => import('./pages/<area>/MyNewPage'));`
   - Add a render block: `{page === 'my-new-page' && <PageTransition pageKey="my-new-page"><MyNewPage {...protectedPageProps} /></PageTransition>}`
4. Add a navigation entry where appropriate (`AnimatedNav`, `FeaturesSection`, `Footer`, or `AppHeader`).
5. If the page persists user data, add a key to `CACHE_KEYS` in `src/config/storageStrategy.ts` and a Supabase table to `SUPABASE_TABLES`. Wire it into `services/supabaseSync.ts` so it pulls on login and pushes in the background.
6. Per `MEMORY.md`: add a Playwright test in `tests/` that uses `?page=my-new-page&__test_mode=true` and run `npm test` before committing.
