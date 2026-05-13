# Prospect — Full Website Overview

**Last updated:** 2026-04-18  
**Repo:** `c:/test/landingpage/` (submodule inside the main `c:/test` repo)  
**Live stack:** React 18 + TypeScript + Tailwind CSS v4 + Supabase + Vite + Vercel

---

## What is Prospect?

Prospect is a free South African career guidance web app for Grade 10–12 students. The pitch: a student with their matric report card and 10 minutes can discover a realistic career path, see exactly what to study and where, find bursary funding, and understand job demand in their province — all for free, no login required (login is optional to save progress).

---

## How Navigation Works

There is **no React Router**. All navigation is state-based:

1. `App.tsx` holds a `page` state variable (type `AppPage`).
2. Every component that needs to navigate calls `onNavigate(page)` — a prop passed down from `App.tsx`.
3. `App.tsx` renders the correct page component based on `page` state.
4. All pages are `React.lazy` + `Suspense` (code-split, loaded on demand).
5. Protected pages are wrapped in the `withAuth` HOC — if no Supabase session exists, the HOC redirects to `auth`.

---

## App Flow (User Journey)

```
Landing page (home)
  └─ Sign Up / Log In → AuthPage → Dashboard
  └─ (or browse public pages without login)

Dashboard
  ├─ Start Quiz → QuizPage → career matches
  ├─ Study Library → StudyLibraryPage
  ├─ Careers → CareersPageNew
  ├─ Bursaries → BursariesPage
  ├─ Map → MapPage
  ├─ TVET Hub → TVETPage → (careers / colleges / funding / requirements)
  ├─ Calendar → CalendarPageNew
  ├─ School Assist → SchoolAssistPage (AI tutor)
  └─ Community Impact → ImpactAuthPage → CommunityImpactPage
```

---

## Every Page — What It Does

### `home` (inline in App.tsx)
The public landing page. Contains:
- Animated hero section (`animated-hero.tsx`)
- Logo/partner strip (`logo-cloud-2.tsx`)
- Feature category grid (`category-list.tsx`)
- Job images grid
- Footer (`neo-minimal-footer.tsx`)
No auth required.

### `auth` — AuthPage.tsx
Standard email/password sign in and sign up. Uses Supabase auth helpers from `src/lib/auth.ts`. On success → navigates to `dashboard`.

### `dashboard` — DashboardPage.tsx *(auth required)*
The daily-focus home screen once logged in. Shows:
- 4 stat cards: Topics Mastered, Days to Deadline, Active Subjects, Study Streak (with color-accent left borders)
- Quick-action buttons to all main features
- Upcoming deadlines panel
- Video grid of learning resources (`DashboardVideoGrid.tsx`)
- Algebra learning progress card if demo path is active (`AlgebraProgressCard.tsx`)

### `quiz` — QuizPage.tsx *(auth required)*
RIASEC interest quiz:
- 42 questions, stacked full-width answer buttons
- Sticky progress bar at top
- Scoring via `src/data/quizScoringLogic.ts` → outputs top-3 RIASEC type code (e.g. "RIC")
- Matches careers by RIASEC code
- Results saved to localStorage (`prospect_quiz_results_v2`) and synced to Supabase
- Results are shareable (used by careers filtering)

### `subject-selector` — Grade10SubjectSelectorPage.tsx *(auth required)*
Students pick their Grade 10–12 subjects → app shows career suggestions mapped to those subjects. Data from `src/data/subjectCareerMapping.ts`.

### `library` — StudyLibraryPage.tsx *(auth required)*
Study content browser:
- All 13 matric subjects across Grades 10–12
- Each topic has: explanation, worked examples, practice questions, YouTube link, career relevance tags
- Career skills content: coding, electrical, plumbing, business
- Search bar (input-base class)
- Subject cards with color-accent left borders per subject
- YouTube embeds (hidden in data saver mode)
- Progress tracked via `studyProgressService.ts` → localStorage + Supabase
- Sub-components in `src/components/StudyLibrary/`: TopicViewer, TopicQuiz, PracticeExam, ConceptExplanation, WorkedExample, GuidedPractice, IndependentPractice, subject-specific Visualizations

### `careers` — CareersPageNew.tsx *(auth required)*
Browse 400+ SA careers:
- Filter by RIASEC code, APS score, demand, province
- Fuzzy search
- Bookmark careers (saved to localStorage + Supabase)
- Career cards (`CareerCard.tsx`) with category emoji icons, RIASEC badges, salary, demand badge
- Career detail modal (`CareerDetailModal.tsx`) — full detail: matric requirements, universities, TVET options, salary, bursaries
- Pagination with `data-load-more-btn`
- Data from `src/data/careers400Final.ts` (400+ careers)

### `bursaries` — BursariesPage.tsx *(auth required)*
Browse 245+ verified SA bursaries:
- Filter by career field and province
- Bookmark bursaries
- Data from `src/data/bursaries.ts` (verified 2025)
- Links to `bursary` detail page

### `bursary` — BursaryDetailPage.tsx *(auth required)*
Single bursary full detail: eligibility, amounts, application dates, official link.

### `disadvantaged-guide` — DisadvantagedGuide.tsx *(auth required)*
Guide specifically for disadvantaged applicants. Covers NSFAS, fee waivers, alternative pathways. References `universityRequirements.ts`.

### `map` — MapPage.tsx *(auth required)*
Interactive SA province map:
- Click a province → see universities, TVET colleges, career demand in that province
- Three tabs inside map: Careers, Colleges, Insights
- Search box and location selector
- Data from `src/data/mapData.ts` + `src/services/mapService.ts`

### `tvet` — TVETPage.tsx *(auth required)*
TVET hub landing with sub-navigation (`TVETSubNav.tsx`) to four sub-pages:
- `tvet-careers` — 70+ TVET trade careers (`TVETCareersPage.tsx`, data: `src/data/careersFullData.ts`)
- `tvet-colleges` — all 50 SA TVET colleges with provinces (`TVETCollegesPage.tsx`, data: `src/data/tvetColleges.ts`)
- `tvet-funding` — funding and bursaries for TVET (`TVETFundingPage.tsx`)
- `tvet-requirements` — entry requirements per college/programme (`TVETRequirementsPage.tsx`)

### `calendar` — CalendarPageNew.tsx *(auth required)*
School calendar with:
- 12 SA academic deadlines with countdown timers
- Term strips (Term 1–4)
- SA public holidays
- User-created personal events (persisted via `calendarStorage` → Supabase)
- Filter toggles: deadlines / school / holidays / personal / exams
- Right-side "Coming Up" panel on desktop
- Color system: deadline=red, school=blue, holiday=teal, personal=emerald
- Keyboard nav: ←→ months, Esc closes
- Primary interactive color: indigo-600

### `school-assist` — SchoolAssistPage.tsx *(auth required)*
AI tutor powered by Gemini API (`GEMINI_API_KEY` env var). Students can ask questions about matric subjects and get AI-generated explanations.

### `impact-auth` — ImpactAuthPage.tsx *(no auth required)*
Separate login portal for the Community Impact section. Same Supabase auth, different UI (slate/dark theme).

### `demo-learning` — DemoLearningPage.tsx *(auth required)*
Algebra learning path demo. Shows a structured lesson flow: DiagnosticQuiz → LessonBlock → SmartFeedback → SkippedQuestionsPanel. Progress tracked in `learningPathStorage`.

### `community-impact` — CommunityImpactPage.tsx *(auth via ImpactAuthPage)*
Community impact stats and dashboard. Standalone header, not inside school nav. Clean stat cards.

---

## Data Architecture

All reference data is **static TypeScript/JSON files** in `src/data/`. No CMS, no external API calls for data. Fast loads, version-controlled.

| What | File | Records |
|------|------|---------|
| 400+ careers (main) | `careers400Final.ts` | 400+ |
| TVET-focused careers | `careersFullData.ts` | 70+ |
| Bursaries | `bursaries.ts` | 245+ |
| TVET colleges | `tvetColleges.ts` | 50 |
| RIASEC quiz questions | `quizQuestions.ts` | 42 |
| Quiz scoring + matching | `quizScoringLogic.ts` | — |
| Subject → career map | `subjectCareerMapping.ts` | — |
| SA provinces + universities + map | `mapData.ts` | — |
| Study content | `studyLibrary/` folder | 20+ topic files |
| Algebra learning path | `demoLearningPath.ts` | — |

**User state** (quiz results, bookmarks, study progress, calendar events, saved careers) lives in **localStorage first**, synced to **Supabase** when the user is logged in.

---

## Auth & Storage Flow

```
User action (bookmark / quiz result / calendar event)
  → saved to localStorage immediately (instant, works offline)
  → if logged in: synced to Supabase in background
  → on next login: supabaseSync.ts pulls Supabase → localStorage
```

localStorage keys (from `src/config/storageStrategy.ts`):
- `prospect_quiz_results_v2`
- `prospect_career_bookmarks_v2`
- `prospect_bursary_bookmarks_v2`
- `prospect_study_progress_v2`
- `prospect_calendar_events_v2`
- `prospect_learning_paths_v2`

---

## Component Library (`src/components/ui/`)

Built during the UI redesign (commit `fc63b2e`). All use Tailwind v4 design tokens.

| Component | Variants / Notes |
|-----------|-----------------|
| Button | 6 variants, 3 sizes (36/44/56px), loading spinner, icon support |
| Card | 4 variants, interactive hover, CardHeader with icon/title/action |
| Input | Label above, error state, icon left/right, 16px font (no iOS zoom), 44px height |
| Badge | 7 variants (success/warning/error/info/neutral/primary/accent) + dot |
| Progress | value/max/label, 3 sizes, 4 colors |
| Skeleton | shimmer loading placeholder |
| Tabs | controlled/uncontrolled, underline active, keyboard nav |
| Modal | `<dialog>` element, full-screen mobile, focus managed |
| Toast | `toast.success/error/warning/info()` API, bottom-right, 4s auto-dismiss |

Design tokens defined in `src/index.css` `@theme` block: full color palette, typography scale (`.text-h1` through `.text-tiny`), card accent borders (`.card-accent-blue/teal/amber/...`), safe-area utilities.

---

## Services

All in `src/services/`. All use localStorage-first pattern.

| Service | What it does |
|---------|-------------|
| `storageService.ts` | Core localStorage CRUD — exports `storage`, `studyProgressStorage`, `calendarStorage`, `learningPathStorage` |
| `bookmarkService.ts` | Save/remove/get career + bursary bookmarks. Supabase sync |
| `quizService.ts` | Save/get RIASEC quiz results. Supabase sync |
| `studyProgressService.ts` | Track lesson completion per subject/topic |
| `calendarService.ts` | User calendar events → Supabase |
| `dashboardService.ts` | Aggregates bookmarks + APS + study stats for Dashboard |
| `mapService.ts` | Filters careers/colleges/demand by province from static data |
| `supabaseSync.ts` | On-login pull from Supabase → localStorage. Background sync interval |

---

## Build & Performance

```bash
npm run dev      # Vite dev server
npm run build    # Production build → dist/
```

Vite manual chunks:
- `vendor-react` — react, react-dom
- `vendor-motion` — motion/react (Framer Motion)
- `vendor-supabase` — @supabase/supabase-js
- `vendor-lucide` — lucide-react

Main bundle: ~259 kB. Every page is lazy-loaded (code split). First load only downloads the landing page.

---

## Testing

Playwright tests in `landingpage/tests/`. Run: `npx playwright test tests/phase2.spec.ts`

Bypass auth in tests: append `?page=PAGENAME&__test_mode=true` to URL. Add `await page.waitForTimeout(3500)` to skip the 2600ms loading animation.

| Test file | Status |
|-----------|--------|
| `phase2.spec.ts` | **Passing** — careers pagination, calendar grid |
| `auth.spec.ts` | May be stale |
| `features.spec.ts` | May be stale |
| `prospect.spec.ts` | May be stale |
| `map.spec.ts` | Failing (needs location permission) |
| `dashboard-learning.spec.ts` | May be stale |

---

## Current State (as of 2026-04-18)

### What's done and working
- Full landing page (hero, features, footer)
- Auth (sign in / sign up / sign out via Supabase)
- Dashboard with stats, quick actions, video grid
- RIASEC quiz (42 questions → career matches)
- Grade 10 subject selector → career suggestions
- Study Library (13 subjects, 20+ topic files, visualizations, practice)
- Careers browser (400+ careers, filter, search, bookmarks, detail modal)
- Bursaries browser (245+ entries, filter, bookmarks, detail page)
- Disadvantaged applicants guide
- SA province map with universities/TVET/careers
- Full TVET section (hub + careers + colleges + funding + requirements)
- School calendar (deadlines, terms, holidays, user events, countdown)
- AI tutor (Gemini API)
- Community Impact section (separate auth)
- Demo algebra learning path
- Design token system + full component library (Button, Card, Input, Badge, Progress, Skeleton, Tabs, Modal, Toast)
- localStorage-first storage with Supabase background sync

### What's not done (from GSD roadmap — separate SA Career Guide project in c:/test/src)
The GSD roadmap in `.planning/` is for a *separate* SA Career Guide app in `c:/test/src/` (a different product). That project is at Phase 0 complete, Phase 1 not started.

### Known issues
- `map.spec.ts` Playwright test failing (needs browser location permission)
- Several test files may be stale (auth, features, prospect, dashboard-learning)
- NSFAS R350K income threshold should be verified annually (changes each year)

---

## Env Variables Required

```
VITE_SUPABASE_URL=        # Supabase project URL
VITE_SUPABASE_ANON_KEY=   # Supabase anon key
GEMINI_API_KEY=            # Google Gemini (for SchoolAssistPage AI tutor)
```
