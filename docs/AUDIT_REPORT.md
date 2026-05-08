# Prospect Codebase Audit Report

**Project:** Prospect SA (`C:\test\landingpage`)
**Stack:** Vite 6 + React 19 + TypeScript 5.8 + Tailwind 4 + Supabase
**Routing:** State-based (`useState<AppPage>` in `src/App.tsx`) — NOT file-based
**Audit date:** 2026-05-08

---

## 1. Executive Summary

| Metric | Count |
|---|---|
| Total source files (`.ts`, `.tsx`, `.css`, `.json`, `.js`) under `landingpage/` | ~190 |
| Files under `src/` | 156 |
| Files in legacy root `components/ui/` | 24 (only **4** referenced) |
| Pages declared in `src/pages/` | 30 (3 unused) |
| Routes registered in `App.tsx` (`AppPage` union) | 32 declared, 28 wired |
| Components in `src/components/` (excluding subdirs) | 24 (≈ 9 unused) |
| Lesson sub-components in `src/components/lessons/shared/` | 6 (all unused) |
| Career data variants in `src/data/` | 4 (`careers.ts`, `careers400Final.ts`, `careersFullData.ts`, `careersFullAudited.ts`) — all *technically* in use |
| Empty directories | 4 (`src/tests/`, `src/data/lessons/` minus 1 file, `Algebra/Grade10/Term2/`, `Algebra/Grade11/`, `Geometry/`) |
| Hard `any` casts | 17 occurrences across 11 files (acceptable) |
| `TODO` / `FIXME` comments in `src/` | 0 |
| Dependencies in `package.json` | 28 runtime + 9 dev |
| Suspected unused runtime deps | 5 (`@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `class-variance-authority`, `react-day-picker`) |

**Headline findings**

1. **Two parallel `components/ui/` folders exist.** The root `landingpage/components/ui/` (24 files) is the *real* one — App.tsx and main.tsx import from it via relative path `../components/ui/...`. The `src/components/ui/` folder (5 files) contains divergent, smaller stub variants that are never imported. **Delete the entire `src/components/ui/` folder.**
2. **20 of 24 root `components/ui/` files are dead.** Only `animated-hero.tsx`, `logo-cloud-2.tsx`, `neo-minimal-footer.tsx`, and `toast.tsx` are imported. The rest (button, card, badge, calendar, popover, select, etc.) are scaffolding from a prior shadcn-style setup that never got wired in.
3. **Three full pages are orphaned:** `NewsPage.tsx`, `NewsAuthPage.tsx`, `DisadvantagedGuide.tsx`. App.tsx even has a comment `// NewsPage removed — SA News feature discontinued`. Their route literals still live in the `AppPage` union type.
4. **Nine components are exported but never rendered:** `CommunityNav`, `DashboardVideoGrid`, `VideoPlayer`, `EmptyState`, `GuidedPractice`, `IndependentPractice`, `DiagnosticQuiz`, `SmartFeedback`, `LessonBlock`, `AlgebraProgressCard`. These were built for a learning-path feature whose UI is now inlined inside `LinearEquations.tsx` / `SimultaneousEquations.tsx`.
5. **The entire `src/components/lessons/shared/` folder is unused** (6 files: EquationBox, LessonCard, QuizOptionCard, ResultsCard, SpeechBubble, StepIndicator).
6. **2 unused services:** `calendarService.ts`, `studyProgressService.ts` (replaced by `storageService.ts` + `dashboardService.ts`).
7. **1 unused hook:** `useLocalStorage.ts` (replaced by direct `localStorage` calls in `services/storageService`).
8. **1 unused JSON data file:** `src/data/lessons/linear-equations.json`.
9. **5 empty directories.**
10. **Folder structure is genuinely confusing:** there are two "lib" roots, two "components" roots, deeply nested page routes mixing alongside flat ones, and root-level files (`index.html`, `lib/`, `components/`) that visually compete with `src/`.

---

## 2. Route / Page Map

App uses state-based routing: `const [page, setPage] = useState<Page>('home')`. The `Page` type is `AppPage` from `src/lib/withAuth.tsx`. Test mode and Supabase session restoration both pull `?page=<id>` from the URL.

| URL trigger (`page === ...`) | Component | File | Status | Notes |
|---|---|---|---|---|
| `home` | inline `App` body | `src/App.tsx` | working | Public landing |
| `auth` | `AuthPage` | `src/pages/AuthPage.tsx` | working | Email/password sign-in |
| `dashboard` | `DashboardPage` | `src/pages/DashboardPage.tsx` | working | Protected (`withAuth`) |
| `quiz` | `QuizPage` | `src/pages/QuizPage.tsx` | working | RIASEC quiz, guest mode |
| `subject-selector` | `Grade10SubjectSelectorPage` | `src/pages/Grade10SubjectSelectorPage.tsx` | working | Guest mode |
| `library` | `StudyLibraryPage` | `src/pages/StudyLibraryPage.tsx` | working | Protected |
| `careers` | `CareersPageNew` | `src/pages/CareersPageNew.tsx` | working | Guest mode |
| `bursaries` | `BursariesPage` | `src/pages/BursariesPage.tsx` | working | Guest mode |
| `bursary` | `BursaryDetailPage` | `src/pages/BursaryDetailPage.tsx` | working | Guest mode |
| `map` | `MapPage` | `src/pages/MapPage.tsx` | working | Guest mode, Leaflet |
| `tvet` | `TVETPage` | `src/pages/TVETPage.tsx` | working | Guest mode |
| `tvet-careers` | `TVETCareersPage` | `src/pages/TVETCareersPage.tsx` | working | Guest mode |
| `tvet-colleges` | `TVETCollegesPage` | `src/pages/TVETCollegesPage.tsx` | working | Guest mode |
| `tvet-funding` | `TVETFundingPage` | `src/pages/TVETFundingPage.tsx` | working | Guest mode |
| `tvet-requirements` | `TVETRequirementsPage` | `src/pages/TVETRequirementsPage.tsx` | working | Guest mode |
| `calendar` | `CalendarPageNew` | `src/pages/CalendarPageNew.tsx` | working | Protected |
| `school-assist` | `SchoolAssistPage` | `src/pages/SchoolAssistPage.tsx` | working | Public |
| `school-assist-chat` | `SchoolAssistChatPage` | `src/pages/SchoolAssistChatPage.tsx` | working | Public |
| `impact-auth` | `ImpactAuthPage` | `src/pages/ImpactAuthPage.tsx` | working | Public auth gate |
| `learning-algebra-g10-t1-linear-equations` | `LinearEquationsPage` | `src/pages/learning/Algebra/Grade10/Term1/LinearEquations.tsx` | working | Protected |
| `learning-algebra-g10-t1-simultaneous` | `SimultaneousEquationsPage` | `src/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations.tsx` | working | Protected |
| `community-impact` | `CommunityImpactPage` | `src/pages/CommunityImpactPage.tsx` | working | Guest mode |
| `pothole-map` | `PotholeMapPage` | `src/pages/PotholeMapPage.tsx` | working | Guest mode |
| `flag-pothole` | `FlagPotholePage` | `src/pages/FlagPotholePage.tsx` | working | Protected |
| `my-pothole-contributions` | `MyContributionsPage` | `src/pages/MyContributionsPage.tsx` | working | Protected |
| `water-dashboard` | `WaterDashboardPage` | `src/pages/WaterDashboardPage.tsx` | working | Protected |
| `tax-budget` | `TaxBudgetPage` | `src/pages/TaxBudgetPage.tsx` | working | Guest mode |
| `cost-of-living` | `CostOfLivingPage` | `src/pages/CostOfLivingPage.tsx` | working | Guest mode |
| `civics` | `CivicsPage` | `src/pages/CivicsPage.tsx` | working | Guest mode |
| **`news`** | (none — declared but no `page === 'news'` branch) | `src/pages/NewsPage.tsx` | **ORPHAN** | Page file exists, route literal exists, never rendered. App.tsx says feature discontinued. |
| **`news-auth`** | (none) | `src/pages/NewsAuthPage.tsx` | **ORPHAN** | Same |
| **`disadvantaged-guide`** | (none) | `src/pages/DisadvantagedGuide.tsx` | **ORPHAN** | Page file exists, route literal exists, never rendered |
| **`demo-learning`** | (none) | (no file) | **DEAD ROUTE** | Literal in `AppPage` union with no page or branch |

---

## 3. Complete File Inventory

### 3.1 `src/` — pages

| File | Type | Status | Imports it (App.tsx unless noted) |
|---|---|---|---|
| `pages/AuthPage.tsx` | page | in-use | App.tsx |
| `pages/BursariesPage.tsx` | page | in-use | App.tsx |
| `pages/BursaryDetailPage.tsx` | page | in-use | App.tsx |
| `pages/CalendarPageNew.tsx` | page | in-use | App.tsx |
| `pages/CareersPageNew.tsx` | page | in-use | App.tsx |
| `pages/CivicsPage.tsx` | page | in-use | App.tsx |
| `pages/CommunityImpactPage.tsx` | page | in-use | App.tsx |
| `pages/CostOfLivingPage.tsx` | page | in-use | App.tsx |
| `pages/DashboardPage.tsx` | page | in-use | App.tsx |
| `pages/DisadvantagedGuide.tsx` | page | **UNUSED** | (none) — orphan |
| `pages/FlagPotholePage.tsx` | page | in-use | App.tsx |
| `pages/Grade10SubjectSelectorPage.tsx` | page | in-use | App.tsx |
| `pages/ImpactAuthPage.tsx` | page | in-use | App.tsx |
| `pages/MapPage.tsx` | page | in-use | App.tsx |
| `pages/MyContributionsPage.tsx` | page | in-use | App.tsx |
| `pages/NewsAuthPage.tsx` | page | **UNUSED** | (none) — orphan, feature removed |
| `pages/NewsPage.tsx` | page | **UNUSED** | (none) — orphan, feature removed |
| `pages/PotholeMapPage.tsx` | page | in-use | App.tsx |
| `pages/QuizPage.tsx` | page | in-use | App.tsx |
| `pages/SchoolAssistChatPage.tsx` | page | in-use | App.tsx |
| `pages/SchoolAssistPage.tsx` | page | in-use | App.tsx |
| `pages/StudyLibraryPage.tsx` | page | in-use | App.tsx |
| `pages/TVETCareersPage.tsx` | page | in-use | App.tsx |
| `pages/TVETCollegesPage.tsx` | page | in-use | App.tsx |
| `pages/TVETFundingPage.tsx` | page | in-use | App.tsx |
| `pages/TVETPage.tsx` | page | in-use | App.tsx |
| `pages/TVETRequirementsPage.tsx` | page | in-use | App.tsx |
| `pages/TaxBudgetPage.tsx` | page | in-use | App.tsx |
| `pages/WaterDashboardPage.tsx` | page | in-use | App.tsx |
| `pages/learning/Algebra/Grade10/Term1/LinearEquations.tsx` | page | in-use | App.tsx |
| `pages/learning/Algebra/Grade10/Term1/SimultaneousEquations.tsx` | page | in-use | App.tsx |

### 3.2 `src/components/`

| File | Type | Status | Used by |
|---|---|---|---|
| `AlgebraProgressCard.tsx` | component | **UNUSED** | (only referenced in `CODEBASE.md` docs) |
| `AppHeader.tsx` | component | in-use | every page that uses `withAuth` (~20+ files) |
| `CareerCard.tsx` | component | in-use | `CareersPageNew` |
| `CareerDetailModal.tsx` | component | in-use | `CareersPageNew`, `MapPage`, `TVETCareersPage` |
| `CareersTab.tsx` | component | in-use | `MapPage` (referenced via `import` only — verify rendering) |
| `CollegesTab.tsx` | component | in-use | `MapPage` |
| `CommunityNav.tsx` | component | **UNUSED** | (defined but no JSX consumer) |
| `DashboardVideoGrid.tsx` | component | **UNUSED** | (DashboardPage no longer imports it) |
| `DiagnosticQuiz.tsx` | component | **UNUSED** | (no JSX consumer) |
| `EmptyState.tsx` | component | **UNUSED** | (`WaterDashboardPage` defines its own local copy) |
| `GuidedPractice.tsx` | component | **UNUSED** | (replaced by inline `GuidedPracticeModule` in `LinearEquations.tsx` / `SimultaneousEquations.tsx`) |
| `IndependentPractice.tsx` | component | **UNUSED** | (no JSX consumer) |
| `InsightsTab.tsx` | component | in-use | `MapPage` |
| `LessonBlock.tsx` | component | **UNUSED** | (no JSX consumer) |
| `LoadingScreen.tsx` | component | in-use | `App.tsx` |
| `LocationInput.tsx` | component | in-use | `MapPage` |
| `MapDisplay.tsx` | component | in-use | `MapPage` |
| `SearchBox.tsx` | component | in-use | `MapPage` |
| `SkippedQuestionsPanel.tsx` | component | in-use | `QuizPage` |
| `SmartFeedback.tsx` | component | **UNUSED** | (no JSX consumer) |
| `TVETCareerCard.tsx` | component | in-use | `TVETCareersPage` |
| `TVETSubNav.tsx` | component | in-use | TVET pages |
| `VideoPlayer.tsx` | component | **UNUSED** | (no JSX consumer) |
| `lessons/shared/EquationBox.tsx` | component | **UNUSED** | (entire folder unused) |
| `lessons/shared/LessonCard.tsx` | component | **UNUSED** | |
| `lessons/shared/QuizOptionCard.tsx` | component | **UNUSED** | |
| `lessons/shared/ResultsCard.tsx` | component | **UNUSED** | |
| `lessons/shared/SpeechBubble.tsx` | component | **UNUSED** | |
| `lessons/shared/StepIndicator.tsx` | component | **UNUSED** | |
| `ui/animated-hero.tsx` | component | **UNUSED** | (App.tsx imports root version, not this one) |
| `ui/category-list.tsx` | component | **UNUSED** | |
| `ui/event-scheduler.tsx` | component | **UNUSED** (3-line stub) | |
| `ui/logo-cloud-2.tsx` | component | **UNUSED** (15-line stub) | |
| `ui/neo-minimal-footer.tsx` | component | **UNUSED** | |
| `water/DamTrendsChart.tsx` | component | in-use | `WaterDashboardPage` |
| `water/PreparednessSection.tsx` | component | in-use | `WaterDashboardPage` |
| `water/ResearchSection.tsx` | component | in-use | `WaterDashboardPage` |
| `water/RestrictionLevelGuide.tsx` | component | in-use | `WaterDashboardPage` |

### 3.3 `src/services/`

| File | Status | Used by |
|---|---|---|
| `bookmarkService.ts` | in-use | `CareersPageNew`, `BursariesPage`, `BursaryDetailPage`, `TVETCareersPage`, `DashboardPage` |
| `calendarService.ts` | **UNUSED** | (replaced by `storageService.calendarStorage`) |
| `communityImpactService.ts` | in-use | `CommunityImpactPage` |
| `dashboardService.ts` | in-use | `DashboardPage`, `StudyLibraryPage` |
| `mapService.ts` | in-use | `MapPage`, `CareersTab`, `CollegesTab`, `InsightsTab` |
| `potholeService.ts` | in-use | `PotholeMapPage`, `FlagPotholePage`, `MyContributionsPage`, `usePotholeValidation` |
| `quizService.ts` | in-use | `QuizPage` |
| `schoolAssistService.ts` | in-use | `SchoolAssistPage`, `AppHeader` |
| `storageService.ts` | in-use | `App` (indirectly), `DashboardPage`, `CalendarPageNew`, `AlgebraProgressCard` |
| `studyProgressService.ts` | **UNUSED** | (replaced by `storageService.studyProgressStorage`) |
| `supabaseSync.ts` | in-use | `App.tsx` |
| `unansweredQuestionService.ts` | in-use | `SchoolAssistPage`, `DashboardPage` |
| `waterService.ts` | in-use | `WaterDashboardPage` and water/* components |

### 3.4 `src/data/`

| File | Status | Notes |
|---|---|---|
| `bursaries.ts` | in-use | `BursariesPage`, `BursaryDetailPage`, `DashboardPage`, `mapService` |
| `careers.ts` | **partially redundant** | small `Career` interface + array. Used by `Grade10SubjectSelectorPage` and `DashboardPage`. Different schema from `CareerFull`. Recommend keeping but renaming to `careersLite.ts` for clarity. |
| `careers400Final.ts` | in-use | Aggregator — imports `careersFullAudited` + 22 batches → `allCareersComplete`. Imported by `CareersPageNew`, `mapService`, `SearchBox`. |
| `careersFullAudited.ts` | in-use | 15 hand-curated tier-1 careers. Imported only by `careers400Final.ts`. |
| `careersFullData.ts` | in-use | Separate dataset (1,754 lines) used **only** by `TVETCareersPage`. Schema-compatible with `CareerFull` but a different data source. **Likely should be merged with `careers400Final` after audit.** |
| `careersTypes.ts` | in-use | Shared types |
| `demoLearningPath.ts` | in-use | `DashboardPage`, `AlgebraProgressCard` (which is itself unused), and several unused components |
| `mapData.ts` | in-use | `MapPage`, `mapService`, `LocationInput`, `MapDisplay`, `SearchBox` |
| `quizQuestions.ts`, `quizScoringLogic.ts` | in-use | `QuizPage` |
| `saLocations.ts` | in-use | `FlagPotholePage`, `PotholeMapPage` |
| `subjects.ts`, `subjectCareerMapping.ts`, `tvetCareers.ts`, `tvetColleges.ts`, `universityRequirements.ts` | in-use | `Grade10SubjectSelectorPage`, `TVETCollegesPage` |
| `lessons/linear-equations.json` | **UNUSED** | Standalone JSON, no `import`. |
| `studyLibrary/index.ts` + 22 topic files | in-use | `schoolAssistService` imports `index.ts` (which re-exports the rest) |
| `batches/batch_*.ts` (22 files) | in-use | All 22 imported by `careers400Final.ts` |

### 3.5 `src/lib/`, `src/hooks/`, `src/utils/`, `src/config/`

| File | Status | Used by |
|---|---|---|
| `lib/auth.ts` | in-use | `App.tsx`, `AuthPage`, `ImpactAuthPage`, `NewsAuthPage` (orphan), `withAuth` |
| `lib/careersService.ts` | in-use | `CareersPageNew` |
| `lib/supabase.ts` | in-use | every service + several pages |
| `lib/withAuth.tsx` | in-use | every protected page |
| `hooks/useLocalStorage.ts` | **UNUSED** | (no consumers; storage handled by `services/storageService`) |
| `hooks/usePotholeValidation.ts` | in-use | `FlagPotholePage` |
| `utils/migrationScript.ts` | in-use | `App.tsx` |
| `utils/suspiciousPatterns.ts` | in-use | `usePotholeValidation` |
| `utils/trackingLogic.ts` | in-use | `AlgebraProgressCard` (unused), `IndependentPractice` (unused), `DiagnosticQuiz` (unused) → effectively only used by other unused files. Becomes dead-by-association. |
| `config/storageStrategy.ts` | in-use | `lib/auth`, `services/storageService`, `services/supabaseSync`, `utils/migrationScript` |

### 3.6 Root-level (`landingpage/lib/`, `landingpage/components/`)

| File | Status | Used by |
|---|---|---|
| `lib/utils.ts` (`cn` helper) | in-use (transitively) | every `components/ui/*.tsx` that uses `@/lib/utils` |
| `lib/supabase-water.ts` | in-use (CLI) | `lib/scrapers/water-scraper-manager.ts` (run via `npm run scrape:water`) |
| `lib/scrapers/scraper-config.ts` | in-use (CLI) | scraper sources |
| `lib/scrapers/water-scraper-manager.ts` | in-use (CLI) | npm script entry |
| `lib/scrapers/sources/cape-town.ts` | in-use (CLI) | scraper-manager |
| `lib/scrapers/sources/dws-dams.ts` | in-use (CLI) | scraper-manager |
| `lib/scrapers/sources/ethekwini.ts` | in-use (CLI) | scraper-manager |
| `lib/scrapers/sources/jhb-water.ts` | in-use (CLI) | scraper-manager |
| `lib/scrapers/sources/nmdm.ts` | in-use (CLI) | scraper-manager |
| `lib/scrapers/sources/rand-water.ts` | in-use (CLI) | scraper-manager |
| `components/ui/animated-hero.tsx` | in-use | `src/App.tsx` |
| `components/ui/logo-cloud-2.tsx` | in-use | `src/App.tsx` |
| `components/ui/neo-minimal-footer.tsx` | in-use | `src/App.tsx` |
| `components/ui/toast.tsx` | in-use | `src/main.tsx` (`ToastProvider`) |
| `components/ui/animated-icons.tsx` | **UNUSED** | (no importer) |
| `components/ui/badge.tsx` | **UNUSED** | |
| `components/ui/button.tsx` | **UNUSED** (only referenced by other unused files: `modal.tsx`, `event-scheduler.tsx`, `calendar.tsx`) |
| `components/ui/calendar.tsx` | **UNUSED** | |
| `components/ui/card.tsx` | **UNUSED** | |
| `components/ui/category-list.tsx` | **UNUSED** | |
| `components/ui/event-scheduler.tsx` | **UNUSED** | |
| `components/ui/glass-calendar.tsx` | **UNUSED** | |
| `components/ui/input.tsx` | **UNUSED** | |
| `components/ui/menu-hover-effects.tsx` | **UNUSED** | |
| `components/ui/modal.tsx` | **UNUSED** | |
| `components/ui/modern-side-bar.tsx` | **UNUSED** | |
| `components/ui/morphing-square.tsx` | **UNUSED** | |
| `components/ui/popover.tsx` | **UNUSED** | |
| `components/ui/progress.tsx` | **UNUSED** | |
| `components/ui/select.tsx` | **UNUSED** | |
| `components/ui/skeleton.tsx` | **UNUSED** | |
| `components/ui/tabs.tsx` | **UNUSED** | |
| `components/ui/textarea.tsx` | **UNUSED** | |
| `components/ui/travel-connect-signin-1.tsx` | **UNUSED** | |

---

## 4. Broken Code Findings

| File | Issue | Severity | Fix |
|---|---|---|---|
| `src/App.tsx` (line 62) | Comment marker `// NewsPage removed — SA News feature discontinued` but `news` and `news-auth` still appear in `AppPage` union, and the page files still exist. | low | Remove `news`, `news-auth`, `disadvantaged-guide`, `demo-learning` from `AppPage` union; delete the three orphan page files. |
| `src/lib/withAuth.tsx` (line 8) | `AppPage` union still contains `news`, `news-auth`, `disadvantaged-guide`, `demo-learning` with no rendering branch. | low | Same as above. |
| `src/components/ui/event-scheduler.tsx` | 3-line file — appears to be a placeholder/stub. Never imported. | medium | Delete (entire `src/components/ui/` folder is dead). |
| `src/components/ui/logo-cloud-2.tsx` | 15-line stub variant of the real `components/ui/logo-cloud-2.tsx`. Never imported. | medium | Delete. |
| `components/ui/event-scheduler.tsx` (root) | Imports six other shadcn-style siblings (`button`, `calendar`, `card`, `input`, `popover`, `select`) — all unused entry chain. | low | Delete entire chain. |
| `components/ui/modal.tsx` (root) | Imports `./button` — both unused. | low | Delete chain. |
| `components/ui/calendar.tsx` (root) | Imports `react-day-picker` (large dep). Never used. | low | Delete; remove `react-day-picker` from `package.json`. |
| `src/data/lessons/linear-equations.json` | JSON file with no consumer. Possibly intended for future content loader that was inlined into `LinearEquations.tsx`. | low | Delete or move to `public/data/` if needed at runtime. |
| `src/utils/trackingLogic.ts` | Functions imported only by unused components (`AlgebraProgressCard`, `IndependentPractice`, `DiagnosticQuiz`). After deleting those, this file becomes dead. | low | Delete in Phase 1 cleanup once consumers are gone. |
| `CODEBASE.md` | Documentation references `DashboardVideoGrid` as used by `DashboardPage`, `AlgebraProgressCard` as used by `DashboardPage`, `EmptyState` as a component, and `studyProgressService` / `calendarService`. None of those statements reflect current code. | low | Regenerate after cleanup. |
| `src/data/careersFullData.ts` | 1,754-line career dataset used **only** by `TVETCareersPage`. Significant overlap (?) with `careers400Final.ts`. | medium | Audit for duplication; likely consolidate into one source-of-truth. Out of scope for cleanup-only phase. |
| Repeated `as any` casts (17 across 11 files) | Used mostly to coerce Supabase rows / mock test users. Acceptable but worth a TS strict pass. | low | Defer. |

No imports of non-existent modules were detected.

---

## 5. Unused Files Summary (safe-to-delete)

### Pages (3)
- `src/pages/NewsPage.tsx`
- `src/pages/NewsAuthPage.tsx`
- `src/pages/DisadvantagedGuide.tsx`

### Components (10 root + 6 lessons + 5 stubs)
- `src/components/AlgebraProgressCard.tsx`
- `src/components/CommunityNav.tsx`
- `src/components/DashboardVideoGrid.tsx`
- `src/components/DiagnosticQuiz.tsx`
- `src/components/EmptyState.tsx`
- `src/components/GuidedPractice.tsx`
- `src/components/IndependentPractice.tsx`
- `src/components/LessonBlock.tsx`
- `src/components/SmartFeedback.tsx`
- `src/components/VideoPlayer.tsx`
- `src/components/lessons/shared/EquationBox.tsx`
- `src/components/lessons/shared/LessonCard.tsx`
- `src/components/lessons/shared/QuizOptionCard.tsx`
- `src/components/lessons/shared/ResultsCard.tsx`
- `src/components/lessons/shared/SpeechBubble.tsx`
- `src/components/lessons/shared/StepIndicator.tsx`
- `src/components/ui/animated-hero.tsx`
- `src/components/ui/category-list.tsx`
- `src/components/ui/event-scheduler.tsx`
- `src/components/ui/logo-cloud-2.tsx`
- `src/components/ui/neo-minimal-footer.tsx`

### Services / hooks / utils (3)
- `src/services/calendarService.ts`
- `src/services/studyProgressService.ts`
- `src/hooks/useLocalStorage.ts`

### Data (1)
- `src/data/lessons/linear-equations.json`

### Root-level legacy UI (20 of 24)
All except `animated-hero.tsx`, `logo-cloud-2.tsx`, `neo-minimal-footer.tsx`, `toast.tsx`:
`animated-icons.tsx`, `badge.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `category-list.tsx`, `event-scheduler.tsx`, `glass-calendar.tsx`, `input.tsx`, `menu-hover-effects.tsx`, `modal.tsx`, `modern-side-bar.tsx`, `morphing-square.tsx`, `popover.tsx`, `progress.tsx`, `select.tsx`, `skeleton.tsx`, `tabs.tsx`, `textarea.tsx`, `travel-connect-signin-1.tsx`.

### Empty directories (4)
- `src/tests/`
- `src/pages/learning/Algebra/Grade10/Term2/`
- `src/pages/learning/Algebra/Grade11/`
- `src/pages/learning/Geometry/`

### Conditionally dead (after the above cleanup)
- `src/utils/trackingLogic.ts` — only consumers are deleted in this pass.

---

## 6. Dependency Audit (`package.json`)

### Runtime dependencies (28)

| Package | Status | Used in |
|---|---|---|
| `@google/genai` | **UNUSED** in source. (`process.env.GEMINI_API_KEY` is wired in `vite.config.ts`, but no import of `@google/genai` exists in `src/`.) | nowhere |
| `@radix-ui/react-dialog` | in-use | `App.tsx` (`TutorialDialog`) |
| `@radix-ui/react-icons` | in-use | `App.tsx` (`Cross2Icon`) |
| `@radix-ui/react-popover` | **UNUSED** | only `components/ui/popover.tsx` (itself dead) |
| `@radix-ui/react-select` | **UNUSED** | only `components/ui/select.tsx` (dead) |
| `@radix-ui/react-slot` | **UNUSED** | only `components/ui/button.tsx` (dead) |
| `@supabase/supabase-js` | in-use | `lib/supabase.ts`, `lib/auth.ts`, etc. |
| `@tailwindcss/vite` | in-use | `vite.config.ts` |
| `@types/leaflet` | in-use (types) | `MapDisplay.tsx` |
| `@vitejs/plugin-react` | in-use | `vite.config.ts` |
| `cheerio` | in-use (CLI) | scrapers |
| `class-variance-authority` | **UNUSED** | only `components/ui/badge.tsx`, `button.tsx`, `card.tsx`, `morphing-square.tsx` (all dead) |
| `clsx` | in-use (transitively) | `lib/utils.ts` (`cn`) — but `cn` itself is only used by dead UI files. **Becomes unused after Phase 1.** |
| `date-fns` | **UNUSED** | only `components/ui/event-scheduler.tsx` and `glass-calendar.tsx` (both dead) |
| `dotenv` | in-use (CLI) | `lib/supabase-water.ts` |
| `express` | **UNUSED** | no source file imports it |
| `leaflet` | in-use | `MapDisplay.tsx` |
| `lucide-react` | in-use | many |
| `motion` | in-use | many |
| `react` | in-use | core |
| `react-day-picker` | **UNUSED** | only `components/ui/calendar.tsx` (dead) |
| `react-dom` | in-use | core |
| `react-leaflet` | in-use | `MapDisplay.tsx` |
| `tailwind-merge` | in-use (transitively) | `lib/utils.ts` (`cn`) — same caveat as `clsx` |
| `vite` | in-use (and duplicated in `devDependencies`) | build |

> **Note on the `cn` helper.** Once the dead `components/ui/*.tsx` files are removed, nothing in the active code uses `lib/utils.ts`. At that point `clsx`, `tailwind-merge`, and `lib/utils.ts` itself can also be removed — unless you intend to bring back a real shadcn/ui setup.

### Dev dependencies (9)

| Package | Status |
|---|---|
| `@playwright/test` | in-use (`tests/*.spec.ts`) |
| `@types/express` | unused (express itself unused) |
| `@types/node` | in-use |
| `@types/react`, `@types/react-dom` | in-use |
| `autoprefixer` | unused (Tailwind 4 + Vite plugin handles this; no `postcss.config`) |
| `sharp` | unused in source — likely image-build helper, but no script references it |
| `tailwindcss` | in-use |
| `tsx` | in-use (`scrape:water` script) |
| `typescript` | in-use |
| `vite` (duplicated under devDeps) | in-use; remove from one place |

### Recommended `package.json` removals
**Safe in Phase 4 (after Phase 1 cleanup):** `@google/genai`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `class-variance-authority`, `date-fns`, `express`, `react-day-picker`, `@types/express`, `autoprefixer`, `sharp`. Possibly `clsx`, `tailwind-merge` (reassess).
**Deduplicate:** `vite` is listed in both `dependencies` and `devDependencies` — keep it only in `devDependencies`.

---

## 7. Folder Structure Issues

### 7.1 Two parallel "lib" roots
```
landingpage/
├── lib/                    ← maps to @/lib/* (vite alias)
│   ├── utils.ts            ← @/lib/utils (used by dead components/ui)
│   ├── supabase-water.ts   ← scraper-only
│   └── scrapers/           ← scraper-only
└── src/lib/                ← runtime app lib
    ├── auth.ts
    ├── careersService.ts
    ├── supabase.ts
    └── withAuth.tsx
```
**Problem:** `@/lib/utils` and `src/lib/...` are unrelated, and the alias can confuse new contributors.
**Proposed:** rename root `lib/` → `scripts/` (it's effectively build-time scrapers + the legacy `cn` helper). Move `lib/utils.ts` into `src/lib/utils.ts` if/when `cn` survives Phase 1.

### 7.2 Two parallel "components" roots
```
landingpage/
├── components/ui/          ← legacy shadcn-style scaffolding (24 files, 4 used)
└── src/components/         ← real app components
    ├── (24 flat components)
    ├── lessons/shared/     ← all unused
    ├── ui/                 ← 5 stub variants, all unused
    └── water/              ← used by WaterDashboardPage
```
**Problem:** newcomers don't know which `components/` to extend. App.tsx uses both with no obvious convention.
**Proposed (Phase 2):**
- Delete `src/components/ui/` (all dead).
- Delete the 20 unused root `components/ui/*.tsx` files.
- Move the 4 surviving root files into `src/components/marketing/` (or `src/components/landing/`):
  - `animated-hero.tsx`, `logo-cloud-2.tsx`, `neo-minimal-footer.tsx`
  - And `toast.tsx` into `src/components/ui/toast.tsx` (re-establish a real `ui/` for shared primitives later)
- Delete the now-empty root `components/` and `lib/` (after relocating utils + scrapers).

### 7.3 Flat `src/components/` mixing unrelated concerns
24 components at one level, mixing:
- App-shell (`AppHeader`, `LoadingScreen`, `CommunityNav`)
- Career feature (`CareerCard`, `CareerDetailModal`, `CareersTab`, `TVETCareerCard`, `SearchBox`)
- Map feature (`LocationInput`, `MapDisplay`, `CollegesTab`, `InsightsTab`)
- Quiz feature (`SkippedQuestionsPanel`, `DiagnosticQuiz`, `SmartFeedback`)
- Learning feature (`AlgebraProgressCard`, `LessonBlock`, `GuidedPractice`, `IndependentPractice`, `DashboardVideoGrid`, `VideoPlayer`)
- TVET (`TVETSubNav`)
- Generic (`EmptyState`)
- Water (already in subfolder — good)

**Proposed (Phase 2):**
```
src/components/
├── shell/                  AppHeader, LoadingScreen, EmptyState
├── careers/                CareerCard, CareerDetailModal, CareersTab, TVETCareerCard, SearchBox
├── map/                    LocationInput, MapDisplay, CollegesTab, InsightsTab
├── quiz/                   SkippedQuestionsPanel
├── tvet/                   TVETSubNav
├── water/                  (already grouped — keep)
├── marketing/              animated-hero, logo-cloud-2, neo-minimal-footer  (moved from root /components/ui)
└── ui/                     toast (and future shared primitives)
```

### 7.4 Flat `src/pages/` with 30 files plus a deeply-nested `learning/` tree
```
src/pages/
├── (29 flat pages)
└── learning/Algebra/Grade10/Term1/  (only branch with content)
```
**Problem:** the deep nesting is a 5-level path for a single file (`pages/learning/Algebra/Grade10/Term1/LinearEquations.tsx`). Empty siblings (`Term2/`, `Grade11/`, `Geometry/`) signal abandoned scaffolding.

**Proposed (Phase 2):**
```
src/pages/
├── careers/                AuthPage, CareersPageNew, BursariesPage, BursaryDetailPage,
│                           QuizPage, MapPage, Grade10SubjectSelectorPage
├── tvet/                   TVETPage, TVETCareersPage, TVETCollegesPage,
│                           TVETFundingPage, TVETRequirementsPage
├── school/                 DashboardPage, StudyLibraryPage, CalendarPageNew,
│                           SchoolAssistPage, SchoolAssistChatPage
├── community/              CommunityImpactPage, ImpactAuthPage, PotholeMapPage,
│                           FlagPotholePage, MyContributionsPage,
│                           WaterDashboardPage, TaxBudgetPage, CostOfLivingPage, CivicsPage
├── auth/                   AuthPage  (or keep at top level)
└── learning/               (delete empty Geometry, Grade11, Term2)
    └── algebra-g10-t1/
        ├── LinearEquations.tsx
        └── SimultaneousEquations.tsx
```
This collapses the 5-level path to 2 levels and removes the implication that 30+ algebra/geometry pages are coming "soon".

### 7.5 `src/data/` mixing aggregator + raw data
```
src/data/
├── careers.ts                    (small Career)
├── careers400Final.ts            (aggregator)
├── careersFullAudited.ts         (raw)
├── careersFullData.ts            (raw, separate dataset)
├── careersTypes.ts               (types)
├── batches/batch_*.ts            (22 raw batches)
├── lessons/linear-equations.json (orphan)
├── studyLibrary/*                (good — already grouped)
└── (rest of one-off files)
```
**Proposed:**
```
src/data/
├── careers/
│   ├── types.ts                  (was careersTypes)
│   ├── audited.ts                (was careersFullAudited)
│   ├── full.ts                   (was careersFullData)
│   ├── lite.ts                   (was careers, renamed for clarity)
│   ├── index.ts                  (was careers400Final, the aggregator)
│   └── batches/                  (unchanged)
├── studyLibrary/                 (unchanged)
├── tvet/                         tvetCareers.ts, tvetColleges.ts
├── universities/                 universityRequirements.ts, subjectCareerMapping.ts
├── locations/                    saLocations.ts, mapData.ts
├── quiz/                         quizQuestions.ts, quizScoringLogic.ts
├── subjects.ts
├── bursaries.ts
└── demoLearningPath.ts           (or delete after consumers pruned)
```

### 7.6 Test directories
- `landingpage/tests/` — 10 Playwright specs (in-use).
- `landingpage/src/tests/` — empty.
- `landingpage/test-results/`, `landingpage/playwright-report/` — generated, gitignored (good).

**Proposed:** delete empty `src/tests/`.

### 7.7 `c:\test\` root vs `c:\test\landingpage\`
The repo has files at `c:\test\` (parent) **and** `c:\test\landingpage\` (the actual app). Files at the parent (`PROSPECT-OVERVIEW.md`, `civicsSectionData.txt`, `filestructure.txt`, a separate `src/`, `tests/`, `vite.config.ts`, `vercel.json`) are shadow copies / ancestor scaffolding from before the project was moved into `landingpage/`. **Vercel deploys from `landingpage/` — confirm via the `vercel.json` at the parent and the `master` branch root.**

**Proposed:** out of scope for Phase 1 (don't touch parent). Document the situation in `MIGRATION_GUIDE.md` so future moves know the parent directory is legacy.

---

## 8. Risk & Tight-Coupling Notes

- `App.tsx` is a 859-line file containing routing, layout, animated nav, tutorial dialog, and 5 home-page sections. **Refactor target** for Phase 6 (out of cleanup scope).
- Auth flow is split across `App.tsx` (top-level session handling) and `withAuth.tsx` (per-page guard) — both implement test-mode bypass independently. Single source of truth would help.
- `careersFullData.ts` (1,754 lines) and `careers400Final.ts` (649 lines) define overlapping career datasets with no documented divergence. `TVETCareersPage` reads only the former; everything else reads the latter. **High refactor priority** but out of scope here.
- Deeply-nested learning route (`pages/learning/Algebra/Grade10/Term1/...`) couples URL design to filesystem, but App.tsx routing is state-based — there's no real reason for the depth. The scaffolding implies future content that's been there for months.
