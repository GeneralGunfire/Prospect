# Phase 2 — Master Task Breakdown
> Working directory: `landingpage/`
> Caveman rule: one file or feature per execution. Commit after each phase.

---

## STORAGE AUDIT (current state)

| Data Type | localStorage | Supabase Sync | Status |
|-----------|-------------|---------------|--------|
| Quiz results | ✅ `prospect_quiz_results_v2` | ✅ background sync | Working |
| Career bookmarks | ✅ `prospect_career_bookmarks_v2` | ✅ background sync | Working |
| Bursary bookmarks | ✅ `prospect_bursary_bookmarks_v2` | ✅ background sync | Working |
| Study progress | ❌ not in localStorage | ✅ Supabase only | Offline broken |
| Calendar events | ❌ not persisted at all | ✅ Supabase only | No offline |
| Learning path progress | ❌ does not exist yet | ❌ does not exist yet | NEW |

---

## PHASE 1 — Storage Layer

### Task 1.1 — Storage Audit Doc
- **File**: `docs/STORAGE_AUDIT.md` (create)
- **Complexity**: Low
- **Depends on**: Nothing
- **Success**: Doc written, storage gaps identified

### Task 1.2 — Storage Strategy Config
- **File**: `src/config/storageStrategy.ts` (create)
- **Changes**: Define CACHE_KEYS, sync rules, conflict resolution policy
- **Complexity**: Low
- **Depends on**: 1.1
- **Success**: All cache keys centralised, rules documented in code

### Task 1.3 — localStorage Helpers
- **File**: `src/services/storageService.ts` (create)
- **Changes**: Generic `storage.get/set/remove/clear`, plus `studyProgressStorage` and `calendarStorage` helpers
- **Complexity**: Medium
- **Depends on**: 1.2
- **Success**: Data persists across page refresh; TypeScript compiles

### Task 1.4 — Supabase Sync Layer
- **File**: `src/services/supabaseSync.ts` (create)
- **Changes**: `syncUserDataOnLogin()`, `startBackgroundSync()`, `pushDirtyDataToSupabase()`
- **Supabase tables needed**: `study_progress`, `calendar_events` (SQL in file header)
- **Complexity**: High
- **Depends on**: 1.3
- **Success**: Login pulls Supabase → localStorage; background sync pushes every 5 min

### Task 1.5 — Migration Script
- **File**: `src/utils/migrationScript.ts` (create)
- **Changes**: `runMigrations()` called in `App.tsx` on mount; migrates old key names
- **Files affected**: `App.tsx` (+1 line call)
- **Complexity**: Low
- **Depends on**: 1.3
- **Success**: Old localStorage keys auto-migrated to v2 keys on first load

---

## PHASE 2 — Demo Learning Feature (Algebra)

### Task 2.1 — Data Structure
- **File**: `src/data/demoLearningPath.ts` (create)
- **Changes**: Full `algebraLearningPath` object — 4 topics, concept blocks, practice questions, diagnostic questions
- **Complexity**: Medium
- **Depends on**: Nothing
- **Success**: TypeScript compiles, all 4 topics have complete data

### Task 2.2 — Diagnostic Quiz Component
- **File**: `src/components/DiagnosticQuiz.tsx` (create)
- **Changes**: 2–3 MC questions, score → level (strong/medium/weak), saves to `studyProgressStorage`
- **Depends on**: 2.1, 1.3
- **Success**: Level detected, stored in localStorage, Supabase sync if logged in

### Task 2.3 — Lesson Components
- **Files**: `src/components/LessonBlock.tsx`, `GuidedPractice.tsx`, `IndependentPractice.tsx` (create)
- **Complexity**: High
- **Depends on**: 2.1
- **Success**: Full lesson flow renders, hints after 3 wrong, feedback tracked

### Task 2.4 — Tracking Logic
- **File**: `src/utils/trackingLogic.ts` (create)
- **Changes**: `calculateTopicStatus()` → mastered / needs-practice / struggling
- **Complexity**: Low
- **Depends on**: 2.3
- **Success**: Status computed from accuracy + hints used

### Task 2.5 — Smart Feedback Component
- **File**: `src/components/SmartFeedback.tsx` (create)
- **Changes**: Narrative feedback based on which questions wrong + hints used
- **Complexity**: Medium
- **Depends on**: 2.4
- **Success**: Shows "You understand X, struggling with Y, recommended: Z"

### Task 2.6 — Algebra Progress Card
- **File**: `src/components/AlgebraProgressCard.tsx` (create)
- **Changes**: Progress bar, topic list with status icons, last activity time, next recommended
- **Complexity**: Medium
- **Depends on**: 2.4
- **Success**: Card renders correct status for each topic

### Task 2.7 — Dashboard Integration
- **File**: `src/pages/DashboardPage.tsx` (update)
- **Changes**: Add "Study Progress" card — shows only if user has learning activity; links to DemoLearningPage
- **Complexity**: Low
- **Depends on**: 2.6
- **Success**: Card visible when study data exists, hidden otherwise

### Task 2.8 — Study Library Navigation
- **File**: `src/pages/StudyLibraryPage.tsx` (update)
- **Changes**: Mathematics → navigate to `DemoLearningPage.tsx`
- **Files affected**: `App.tsx` (add route), `StudyLibraryPage.tsx` (+navigate call)
- **Complexity**: Low
- **Depends on**: 2.1
- **Success**: Click Mathematics → Algebra learning path page loads

---

## PHASE 3 — Dashboard Redesign

### Task 3.1 — Restructure Sections
- **File**: `src/pages/DashboardPage.tsx` (update)
- **Changes**: 4 sections — Quick Stats / Study Progress / Learning Resources / Saved Items
- **Complexity**: Medium
- **Depends on**: 2.7
- **Success**: All 4 sections render with clear visual separation

### Task 3.2 — Visual Hierarchy
- **File**: `src/pages/DashboardPage.tsx` (update)
- **Changes**: Consistent `<Card>`, `py-8` section spacing, `text-sm font-bold uppercase tracking-wider` headers, navy + blue accents
- **Complexity**: Low
- **Depends on**: 3.1
- **Success**: Dashboard looks polished, hierarchy clear

### Task 3.3 — Empty States
- **File**: `src/components/EmptyState.tsx` (create)
- **Changes**: Reusable empty state component with headline + CTAs
- **Files affected**: `DashboardPage.tsx` (use EmptyState for careers + bursaries)
- **Complexity**: Low
- **Depends on**: 3.1
- **Success**: Empty state shows with correct CTA links when no saved data

---

## PHASE 4 — Calendar Overhaul

### Task 4.1 — Redesign Hero Section
- **File**: `src/pages/CalendarPage.tsx` (update — use CalendarPageNew.tsx as base if better)
- **Changes**: Dark navy hero, "ACADEMIC YEAR 2026 — Stay Ahead of the Game", calendar icon watermark
- **Complexity**: Low
- **Depends on**: Nothing
- **Success**: Hero renders with navy bg, correct copy, no blue gradient

### Task 4.2 — User Event Modal
- **File**: `src/components/UserEventModal.tsx` (create)
- **Changes**: Form — name, date, category (Exam/Deadline/Holiday/Other), color tag
- **Complexity**: Medium
- **Depends on**: 4.5
- **Success**: Modal opens, form submits, event appears on calendar

### Task 4.3 — Calendar Visual Design
- **File**: `src/pages/CalendarPage.tsx` (update)
- **Changes**: Month nav with arrows, color-coded events (Exam=red, Deadline=orange, Holiday=green, User=blue), hover effects, selected date highlight
- **Complexity**: Medium
- **Depends on**: Nothing
- **Success**: All event types have correct colors, month navigation works

### Task 4.4 — Calendar Views (Tabs)
- **File**: `src/pages/CalendarPage.tsx` (update)
- **Changes**: 3 tabs — Calendar (month) / Terms (Term 1–4) / Deadlines (sorted list)
- **Complexity**: Medium
- **Depends on**: 4.3
- **Success**: All 3 tabs switch correctly, data correct in each view

### Task 4.5 — Calendar Storage Service
- **File**: `src/services/calendarStorageService.ts` (create)
- **Changes**: `addEvent`, `getEvents`, `deleteEvent`, `updateEvent` — localStorage-first
- **Complexity**: Low
- **Depends on**: 1.3
- **Success**: Events persist on refresh; Supabase sync when logged in

---

## PHASE 5 — Landing Page Polish

### Task 5.1 — "How Prospect Works" Section
- **File**: `src/pages/` or landing page component (identify exact file first)
- **Changes**: Icons above headings, gradient cards, hover scale effect
- **Complexity**: Medium
- **Depends on**: Nothing
- **Success**: 4 cards have icons, gradient backgrounds, hover animation

### Task 5.2 — Fix Button Colors
- **File**: Landing page component
- **Changes**: All primary CTAs → navy (`bg-[#0a2342]`), secondary → outlined navy
- **Complexity**: Low
- **Depends on**: Nothing
- **Success**: No `bg-blue-500` or `bg-green-500` on primary CTAs

### Task 5.3 — Typography Standardisation
- **File**: Landing page component
- **Changes**: Eyebrow = `text-xs font-black uppercase tracking-widest text-blue-600`, Heading = `text-4xl font-black`, Body = `text-base text-slate-600`
- **Complexity**: Low
- **Depends on**: Nothing
- **Success**: All 3 feature sections (Career Guide, TVET, School Assist) use identical type scale

---

## PHASE 6 — Code Cleanup

### Task 6.1 — Delete Unused Data Files
- **Files to delete** (verify not imported first):
  - `src/data/careersFullDataExpanded.ts`
  - `src/data/careers400_complete.ts`
  - `src/data/careers400_expanded.ts`
  - `src/data/careers_audited.ts`
  - `src/data/careers400.ts` (if superseded by `careers400Final.ts`)
- **Complexity**: Low
- **Success**: `npm run build` still passes after deletions

### Task 6.2 — Remove Console Logs
- **Files**: All `src/` — remove `console.log`, keep `console.warn`/`console.error` in auth + Supabase only
- **Complexity**: Low
- **Success**: No `console.log` in production code

### Task 6.3 — Bundle Size Check
- **Command**: `npm run build` → check `dist/` gzip sizes
- **Target**: < 350 KB gzip
- **Action if over**: lazy-load heavy pages with `React.lazy()`
- **Complexity**: Medium

---

## PHASE 7 — Playwright Tests

### Task 7.1 — Setup
- **Files**: `src/tests/playwright.config.ts`, `package.json` (`test:e2e` script)
- **Install**: `npm install -D @playwright/test`

### Task 7.2 — Core Tests
- **File**: `src/tests/core.spec.ts`
- **Tests**: Landing loads, nav works, quiz starts, career browser loads

### Task 7.3 — Auth Tests
- **File**: `src/tests/auth.spec.ts`
- **Tests**: Sign up, login, redirect to dashboard

### Task 7.4 — Dashboard Tests
- **File**: `src/tests/dashboard.spec.ts`
- **Tests**: Stat cards, study progress card, empty states, calendar page, library page

### Task 7.5 — Learning Feature Tests
- **File**: `src/tests/learning.spec.ts`
- **Tests**: Algebra path loads, diagnostic quiz, lesson renders after diagnostic

---

## PHASE 8 — SEO

### Task 8.1 — Meta Tags
- **File**: `index.html` + per-page `<Helmet>` or `<head>` updates
- **Changes**: title, description, keywords, OG tags for /, /quiz, /careers, /tvet, /bursaries

### Task 8.2 — Structured Data
- **File**: `index.html`
- **Changes**: JSON-LD for EducationalOrganization

### Task 8.3 — Sitemap + robots.txt
- **Files**: `public/sitemap.xml`, `public/robots.txt` (create)

### Task 8.4 — Image alt + dimensions
- **Files**: All components with `<img>` tags
- **Changes**: Add `alt`, `width`, `height` attributes

### Task 8.5 — Canonical Tags
- **Files**: `index.html` + per-page
- **Changes**: `<link rel="canonical">` on each key page

---

## PHASE 9 — Deployment

### Task 9.1 — Pre-deploy checks
- `npm run lint && npm run build && npm run test:e2e`

### Task 9.2 — Env vars
- Verify `.env.production`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Task 9.3 — Vercel
- Confirm Vercel project connected to repo
- Confirm env vars set in Vercel dashboard
- Push to `main` → auto-deploy

### Task 9.4 — Lighthouse
- Run against production URL
- Targets: Performance > 80, Accessibility > 90, SEO > 90

---

## DEPENDENCY ORDER

```
Phase 0 (planning)
  → Phase 1 (storage — foundation for all data persistence)
    → Phase 2 (learning feature — needs storage)
      → Phase 3 (dashboard — needs learning card)
  → Phase 4 (calendar — needs calendar storage service from Phase 1)
  → Phase 5 (landing page — independent)
  → Phase 6 (cleanup — after all features built)
    → Phase 7 (tests — after cleanup)
      → Phase 8 (SEO — after tests pass)
        → Phase 9 (deploy — last)
```

---

## EXECUTION LOG

| Phase | Status | Bundle Before | Bundle After | Tests |
|-------|--------|--------------|--------------|-------|
| 0 | ✅ Planning | - | - | - |
| 1 | ⏳ | - | - | - |
| 2 | ⏳ | - | - | - |
| 3 | ⏳ | - | - | - |
| 4 | ⏳ | - | - | - |
| 5 | ⏳ | - | - | - |
| 6 | ⏳ | - | - | - |
| 7 | ⏳ | - | - | - |
| 8 | ⏳ | - | - | - |
| 9 | ⏳ | - | - | - |
