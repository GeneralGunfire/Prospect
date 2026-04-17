# Prospect — Codebase Reference

## Stack
- React 18 + TypeScript
- Tailwind CSS v4 (use `bg-linear-to-r` not `bg-gradient-to-r`)
- Framer Motion via `motion/react`
- Supabase (auth + DB)
- Vite (build tool)
- Playwright (tests)

## Env Variables (`.env.local`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
GEMINI_API_KEY=        # used by SchoolAssistPage AI tutor
```

---

## Routing

No React Router. All navigation is state-based via `onNavigate(page: AppPage)` passed as a prop.

`AppPage` type lives in `src/lib/withAuth.tsx`:
```
'home' | 'auth' | 'dashboard' | 'quiz' | 'subject-selector' | 'library'
| 'careers' | 'bursaries' | 'bursary' | 'disadvantaged-guide' | 'map'
| 'tvet' | 'tvet-careers' | 'tvet-colleges' | 'tvet-funding' | 'tvet-requirements'
| 'calendar' | 'school-assist' | 'impact-auth' | 'demo-learning'
```

`src/App.tsx` holds a `page` state and renders the matching component. All pages are `React.lazy` + `Suspense`.

---

## Auth

`src/lib/withAuth.tsx` — HOC that wraps every protected page. Reads Supabase session. If no user → redirects to `auth`. Passes `{ user, onNavigate }` as `AuthedProps`.

`src/lib/auth.ts` — sign in / sign up / sign out helpers wrapping Supabase.

`src/pages/AuthPage.tsx` — login/signup UI for main app.

`src/pages/ImpactAuthPage.tsx` — separate login for Community Impact section. Same color scheme as AuthPage (slate/dark).

---

## Pages

| Page key | File | Auth required | Notes |
|---|---|---|---|
| `home` | `App.tsx` (inline) | No | Landing page with hero, features, footer |
| `auth` | `AuthPage.tsx` | No | Sign in / sign up |
| `dashboard` | `DashboardPage.tsx` | Yes | Stats, quick actions, upcoming deadlines, video grid |
| `quiz` | `QuizPage.tsx` | Yes | RIASEC quiz → career matches |
| `subject-selector` | `Grade10SubjectSelectorPage.tsx` | Yes | Pick subjects → career suggestions |
| `library` | `StudyLibraryPage.tsx` | Yes | Study content by subject/topic |
| `careers` | `CareersPageNew.tsx` | Yes | Browse 400+ careers, filter, bookmark |
| `bursaries` | `BursariesPage.tsx` | Yes | Browse bursaries, filter, bookmark |
| `bursary` | `BursaryDetailPage.tsx` | Yes | Single bursary detail |
| `disadvantaged-guide` | `DisadvantagedGuide.tsx` | Yes | Guide for disadvantaged applicants |
| `map` | `MapPage.tsx` | Yes | SA map with universities/TVET/careers by province |
| `tvet` | `TVETPage.tsx` | Yes | TVET hub/landing |
| `tvet-careers` | `TVETCareersPage.tsx` | Yes | Browse TVET careers |
| `tvet-colleges` | `TVETCollegesPage.tsx` | Yes | Browse TVET colleges |
| `tvet-funding` | `TVETFundingPage.tsx` | Yes | TVET funding info |
| `tvet-requirements` | `TVETRequirementsPage.tsx` | Yes | TVET entry requirements |
| `calendar` | `CalendarPageNew.tsx` | Yes | School calendar, deadlines, user events |
| `school-assist` | `SchoolAssistPage.tsx` | Yes | AI tutor (Gemini API) |
| `impact-auth` | `ImpactAuthPage.tsx` | No | Community Impact login |
| `demo-learning` | `DemoLearningPage.tsx` | Yes | Algebra learning path demo |

---

## Components

### App-level (in `src/components/`)
| File | Used by | Purpose |
|---|---|---|
| `AppHeader.tsx` | Most pages | Top nav bar with logo + links |
| `LoadingScreen.tsx` | `App.tsx` | 2600ms loading screen on first load |
| `CareerCard.tsx` | `CareersPageNew`, `Grade10SubjectSelectorPage` | Career card tile |
| `CareerDetailModal.tsx` | `CareersPageNew` | Full career detail in a modal |
| `EmptyState.tsx` | Various | Empty list placeholder |
| `DashboardVideoGrid.tsx` | `DashboardPage` | Video grid for learning resources |
| `VideoPlayer.tsx` | `App.tsx` | Video player modal |
| `AlgebraProgressCard.tsx` | `DashboardPage` | Shows algebra learning progress if active |
| `TVETCareerCard.tsx` | `TVETCareersPage` | TVET career tile |
| `TVETSubNav.tsx` | `TVETPage` | TVET sub-navigation tabs |
| `SearchBox.tsx` | `MapPage` | Career search on map |
| `LocationInput.tsx` | `MapPage` | Province/location selector |
| `MapDisplay.tsx` | `MapPage` | Renders the SA map |
| `CareersTab.tsx` | `MapPage` | Careers panel inside map |
| `CollegesTab.tsx` | `MapPage` | Colleges panel inside map |
| `InsightsTab.tsx` | `MapPage` | Job market insights panel inside map |

### Study Library (in `src/components/StudyLibrary/`)
All used by `StudyLibraryPage.tsx`:
- `TopicViewer.tsx` — main topic reading view
- `TopicQuiz.tsx` — per-topic quiz
- `PracticeExam.tsx` / `PracticeQuestion.tsx` — practice exam
- `ConceptExplanation.tsx` — concept breakdown
- `WorkedExample.tsx` — step-by-step examples
- `GuidedPractice.tsx` / `IndependentPractice.tsx` — practice modes
- `Visualization.tsx` / `Visualizations.tsx` — generic visualization wrapper
- `AccountingVisualizations.tsx`, `EconomicsVisualizations.tsx`, `PhysicsVisualizations.tsx`, `LifeSciencesVisualizations.tsx`, `EnglishVisualizations.tsx`, `EGDVisualizations.tsx` — subject-specific charts/diagrams
- `index.ts` — re-exports all

### Demo Learning (used by `DemoLearningPage.tsx`)
- `DiagnosticQuiz.tsx`
- `LessonBlock.tsx`
- `SmartFeedback.tsx`
- `SkippedQuestionsPanel.tsx`

### Root-level UI (in `components/ui/` — used directly by `App.tsx` homepage)
- `animated-hero.tsx` — hero animation section
- `logo-cloud-2.tsx` — partner logo strip
- `category-list.tsx` — feature category grid
- `neo-minimal-footer.tsx` — homepage footer
- `event-scheduler.tsx` — (used by homepage sections)

---

## Data Files (`src/data/`)

| File | What it contains | Used by |
|---|---|---|
| `careersTypes.ts` | `CareerFull` interface | Everything careers-related |
| `careers400Final.ts` | 400+ SA careers (final export `allCareersComplete`) | `CareersPageNew`, `SearchBox`, `mapService` |
| `careersFullAudited.ts` | Same 400+ careers (source for `careers400Final`) | `careers400Final` imports from here |
| `careersFullData.ts` | Separate TVET-focused career set (`allCareersFullData`) | `TVETCareersPage` |
| `careers.ts` | Older smaller `Career` interface + small career list | `CareerCard`, `Grade10SubjectSelectorPage` |
| `bursaries.ts` | Bursary list (verified 2025) | `BursariesPage`, `BursaryDetailPage` |
| `tvetCareers.ts` | 70+ TVET careers | `careersFullData`, `TVETCareersPage` |
| `tvetColleges.ts` | SA TVET college list | `TVETCollegesPage`, `mapData` |
| `quizQuestions.ts` | RIASEC quiz questions | `QuizPage` |
| `quizScoringLogic.ts` | Scoring + career matching logic | `QuizPage` |
| `subjects.ts` | Grade 10–12 subjects list | `Grade10SubjectSelectorPage` |
| `subjectCareerMapping.ts` | Subject → career suggestions map | `Grade10SubjectSelectorPage` |
| `universityRequirements.ts` | Minimum marks per degree type | `StudyLibraryPage`, `DisadvantagedGuide` |
| `mapData.ts` | Provinces, universities, hotspots for map | `MapPage`, `mapService` |
| `demoLearningPath.ts` | Algebra learning path structure + types | `DemoLearningPage`, `AlgebraProgressCard`, study components |
| `studyLibrary/` (folder) | 20+ topic files (Maths, Science, Accounting, etc.) | `StudyLibraryPage` via `studyLibrary/index.ts` |

---

## Services (`src/services/`)

All services use a **localStorage-first** pattern. Supabase sync only runs when user is logged in.

| File | What it does |
|---|---|
| `storageService.ts` | Main localStorage CRUD. Exports: `storage`, `studyProgressStorage`, `calendarStorage`, `learningPathStorage` |
| `bookmarkService.ts` | Save/remove/get career + bursary bookmarks. Reads localStorage, syncs to Supabase |
| `quizService.ts` | Save/get quiz results. localStorage + Supabase |
| `studyProgressService.ts` | Save/get lesson completion per subject |
| `calendarService.ts` | Save/get user-created calendar events via Supabase |
| `dashboardService.ts` | Dashboard aggregation (bookmarks, APS, study progress) |
| `mapService.ts` | Filter careers/colleges/demand by province from static data |
| `supabaseSync.ts` | On-login sync: pulls Supabase → localStorage. Background sync interval. |

---

## Lib (`src/lib/`)

| File | Purpose |
|---|---|
| `supabase.ts` | Creates Supabase client from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| `auth.ts` | signIn / signUp / signOut wrappers |
| `withAuth.tsx` | HOC + `AppPage` type + `AuthedProps` interface |
| `careersService.ts` | `findSimilarCareers()` — Supabase query for related careers |

---

## Config & Utils

| File | Purpose |
|---|---|
| `src/config/storageStrategy.ts` | All `localStorage` key names (`CACHE_KEYS`). Single source of truth. |
| `src/hooks/useLocalStorage.ts` | React hook for localStorage state |
| `src/utils/migrationScript.ts` | Runs on app load — migrates old localStorage key formats |
| `src/utils/trackingLogic.ts` | Learning path status helpers (`getStatusIcon`, `getStatusColor`, `calculateTopicStatus`) |
| `lib/utils.ts` (root) | `cn()` utility (clsx + tailwind-merge). Required by `components/ui/button.tsx` |

---

## Storage Keys (localStorage)

Defined in `src/config/storageStrategy.ts`:
```
prospect_quiz_results_v2
prospect_career_bookmarks_v2
prospect_bursary_bookmarks_v2
prospect_study_progress_v2
prospect_calendar_events_v2
prospect_learning_paths_v2
```

---

## Calendar Page (`CalendarPageNew.tsx`)

Color token system:
```
deadline → red-50 / red-200 / red-700
school   → blue-50 / blue-200 / blue-700
holiday  → teal-50 / teal-200 / teal-700
personal → emerald-50 / emerald-200 / emerald-700
exam     → red-50 / red-200 / red-700 (same as deadline)
```

Primary interactive color: `indigo-600` (selected day, active tabs, CTAs).

Features: 12 SA deadlines with countdown, term strips, public holidays, user event creation (persisted via `calendarStorage`), right-side panel on desktop, filter toggles, keyboard nav (←→ months, Esc closes).

---

## Tests (`tests/`)

| File | Status | What it tests |
|---|---|---|
| `phase2.spec.ts` | **Active / passing** | Careers pagination (`data-career-card`, `data-load-more-btn`), calendar grid |
| `auth.spec.ts` | May be stale | Auth flow |
| `features.spec.ts` | May be stale | General features |
| `prospect.spec.ts` | May be stale | General app |
| `map.spec.ts` | Failing (map needs location) | Map feature |
| `dashboard-learning.spec.ts` | May be stale | Dashboard |
| `calendar-debug.spec.ts` | Debug/temp | Calendar |
| `calendar-verify.spec.ts` | Debug/temp | Calendar |
| `three-priorities.spec.ts` | Debug/temp | Three main priorities |

Run tests: `npx playwright test tests/phase2.spec.ts`

Bypass auth in tests: append `?page=PAGENAME&__test_mode=true` to URL. Add `await page.waitForTimeout(3500)` to skip the 2600ms loading screen.

---

## Build

```bash
npm run dev      # dev server
npm run build    # production build to dist/
```

Chunks (via `vite.config.ts` manualChunks):
- `vendor-react` — react, react-dom
- `vendor-motion` — motion/react
- `vendor-supabase` — @supabase/supabase-js
- `vendor-lucide` — lucide-react

Main bundle: ~259 kB. All pages are lazy-loaded.
