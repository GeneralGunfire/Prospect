# Prospect Cleanup Checklist

Ordered, sequential. Each phase is independently revertable via git.
Run `npm run lint` (which is `tsc --noEmit`) and `npm run build` after every phase.
Run `npm test` (Playwright) after Phases 1, 2, and 5.

---

## Phase 1 — Safe deletes (no code edits required)

These files have **zero importers in the active code path**. Removing them cannot affect any rendered page.

### 1.1 Orphan pages
- [ ] Delete `src/pages/NewsPage.tsx`
- [ ] Delete `src/pages/NewsAuthPage.tsx`
- [ ] Delete `src/pages/DisadvantagedGuide.tsx`

### 1.2 Unused app components
- [ ] Delete `src/components/AlgebraProgressCard.tsx`
- [ ] Delete `src/components/CommunityNav.tsx`
- [ ] Delete `src/components/DashboardVideoGrid.tsx`
- [ ] Delete `src/components/DiagnosticQuiz.tsx`
- [ ] Delete `src/components/EmptyState.tsx`
- [ ] Delete `src/components/GuidedPractice.tsx`
- [ ] Delete `src/components/IndependentPractice.tsx`
- [ ] Delete `src/components/LessonBlock.tsx`
- [ ] Delete `src/components/SmartFeedback.tsx`
- [ ] Delete `src/components/VideoPlayer.tsx`

### 1.3 Unused lessons subfolder
- [ ] Delete `src/components/lessons/shared/EquationBox.tsx`
- [ ] Delete `src/components/lessons/shared/LessonCard.tsx`
- [ ] Delete `src/components/lessons/shared/QuizOptionCard.tsx`
- [ ] Delete `src/components/lessons/shared/ResultsCard.tsx`
- [ ] Delete `src/components/lessons/shared/SpeechBubble.tsx`
- [ ] Delete `src/components/lessons/shared/StepIndicator.tsx`
- [ ] Remove now-empty `src/components/lessons/shared/`
- [ ] Remove now-empty `src/components/lessons/`

### 1.4 Stub UI variants in `src/components/ui/`
The whole folder is a parallel copy that is never imported (App.tsx imports from root `components/ui/`).
- [ ] Delete `src/components/ui/animated-hero.tsx`
- [ ] Delete `src/components/ui/category-list.tsx`
- [ ] Delete `src/components/ui/event-scheduler.tsx`
- [ ] Delete `src/components/ui/logo-cloud-2.tsx`
- [ ] Delete `src/components/ui/neo-minimal-footer.tsx`
- [ ] Remove now-empty `src/components/ui/`

### 1.5 Unused services / hooks / data
- [ ] Delete `src/services/calendarService.ts`
- [ ] Delete `src/services/studyProgressService.ts`
- [ ] Delete `src/hooks/useLocalStorage.ts`
- [ ] Delete `src/data/lessons/linear-equations.json`
- [ ] Remove now-empty `src/data/lessons/`

### 1.6 Conditionally dead utils (after 1.2/1.3 land)
- [ ] Verify nothing imports `src/utils/trackingLogic.ts` (`grep -r "trackingLogic"` should return no `.ts(x)` hits in `src/`)
- [ ] Delete `src/utils/trackingLogic.ts`

### 1.7 Empty learning scaffolding
- [ ] Delete empty directory `src/pages/learning/Geometry/`
- [ ] Delete empty directory `src/pages/learning/Algebra/Grade11/`
- [ ] Delete empty directory `src/pages/learning/Algebra/Grade10/Term2/`

### 1.8 Empty test folder
- [ ] Delete empty directory `src/tests/`

### 1.9 Legacy root `components/ui/` (20 unused files)
- [ ] Delete `components/ui/animated-icons.tsx`
- [ ] Delete `components/ui/badge.tsx`
- [ ] Delete `components/ui/button.tsx`
- [ ] Delete `components/ui/calendar.tsx`
- [ ] Delete `components/ui/card.tsx`
- [ ] Delete `components/ui/category-list.tsx`
- [ ] Delete `components/ui/event-scheduler.tsx`
- [ ] Delete `components/ui/glass-calendar.tsx`
- [ ] Delete `components/ui/input.tsx`
- [ ] Delete `components/ui/menu-hover-effects.tsx`
- [ ] Delete `components/ui/modal.tsx`
- [ ] Delete `components/ui/modern-side-bar.tsx`
- [ ] Delete `components/ui/morphing-square.tsx`
- [ ] Delete `components/ui/popover.tsx`
- [ ] Delete `components/ui/progress.tsx`
- [ ] Delete `components/ui/select.tsx`
- [ ] Delete `components/ui/skeleton.tsx`
- [ ] Delete `components/ui/tabs.tsx`
- [ ] Delete `components/ui/textarea.tsx`
- [ ] Delete `components/ui/travel-connect-signin-1.tsx`

### 1.10 Verify Phase 1
- [ ] `npm run lint` — must pass with no errors
- [ ] `npm run build` — must succeed
- [ ] `npm test` (Playwright headless) — all specs pass
- [ ] `git status` — review the deletion list, then commit with message `chore: remove unused pages, components, and stub UI files`

**Rollback point:** `git revert HEAD` or `git checkout -- .` before commit.

---

## Phase 2 — Folder reorganization

Do this only after Phase 1 is committed. Each move requires updating import paths.

### 2.1 Group `src/components/` by feature

**Before → After**

| Before | After |
|---|---|
| `src/components/AppHeader.tsx` | `src/components/shell/AppHeader.tsx` |
| `src/components/LoadingScreen.tsx` | `src/components/shell/LoadingScreen.tsx` |
| `src/components/CareerCard.tsx` | `src/components/careers/CareerCard.tsx` |
| `src/components/CareerDetailModal.tsx` | `src/components/careers/CareerDetailModal.tsx` |
| `src/components/CareersTab.tsx` | `src/components/careers/CareersTab.tsx` |
| `src/components/SearchBox.tsx` | `src/components/careers/SearchBox.tsx` |
| `src/components/TVETCareerCard.tsx` | `src/components/careers/TVETCareerCard.tsx` |
| `src/components/LocationInput.tsx` | `src/components/map/LocationInput.tsx` |
| `src/components/MapDisplay.tsx` | `src/components/map/MapDisplay.tsx` |
| `src/components/CollegesTab.tsx` | `src/components/map/CollegesTab.tsx` |
| `src/components/InsightsTab.tsx` | `src/components/map/InsightsTab.tsx` |
| `src/components/SkippedQuestionsPanel.tsx` | `src/components/quiz/SkippedQuestionsPanel.tsx` |
| `src/components/TVETSubNav.tsx` | `src/components/tvet/TVETSubNav.tsx` |

`src/components/water/` already grouped — leave it.

- [ ] Create new directories
- [ ] Move files (use `git mv` to preserve history)
- [ ] Update each import in:
  - [ ] `src/App.tsx` (LoadingScreen import)
  - [ ] every page in `src/pages/*.tsx` and `src/pages/learning/**`
  - Search-replace: `from '../components/AppHeader'` → `from '../components/shell/AppHeader'` (and similar for each moved file)
  - Learning pages need `from '../../../../../components/AppHeader'` → `from '../../../../../components/shell/AppHeader'`

### 2.2 Move surviving root-level UI into `src/components/`

| Before | After |
|---|---|
| `components/ui/animated-hero.tsx` | `src/components/marketing/animated-hero.tsx` |
| `components/ui/logo-cloud-2.tsx` | `src/components/marketing/logo-cloud-2.tsx` |
| `components/ui/neo-minimal-footer.tsx` | `src/components/marketing/neo-minimal-footer.tsx` |
| `components/ui/toast.tsx` | `src/components/ui/toast.tsx` |

- [ ] Move files
- [ ] Update `src/App.tsx`:
  - [ ] `from '../components/ui/animated-hero'` → `from './components/marketing/animated-hero'`
  - [ ] `from '../components/ui/logo-cloud-2'` → `from './components/marketing/logo-cloud-2'`
  - [ ] `from '../components/ui/neo-minimal-footer'` → `from './components/marketing/neo-minimal-footer'`
- [ ] Update `src/main.tsx`:
  - [ ] `from '../components/ui/toast'` → `from './components/ui/toast'`
- [ ] If `toast.tsx` uses `@/lib/utils`, change its import to `from '../../lib/utils'` (or keep alias — see 2.4)

### 2.3 Decide on `lib/utils.ts` (cn helper)

After moving `toast.tsx` into `src/components/ui/`, only `toast.tsx` still imports `@/lib/utils`. Two options:

**Option A — keep the alias (simpler):**
- [ ] Move root `lib/utils.ts` → `src/lib/utils.ts`
- [ ] Update `vite.config.ts` alias from `'@': path.resolve(__dirname, '.')` to `'@': path.resolve(__dirname, 'src')`
- [ ] Update `tsconfig.json` paths from `"@/*": ["./*"]` to `"@/*": ["./src/*"]`
- [ ] `toast.tsx` continues to use `@/lib/utils`

**Option B — drop the alias:**
- [ ] Move root `lib/utils.ts` → `src/lib/utils.ts`
- [ ] Edit `toast.tsx` to use relative path `'../../lib/utils'`
- [ ] Remove `resolve.alias` from `vite.config.ts`
- [ ] Remove `paths` from `tsconfig.json`

### 2.4 Rename root `lib/` to `scripts/`

After 2.3, root `lib/` only contains scrapers + the standalone `supabase-water.ts` helper.
- [ ] `git mv lib/scrapers scripts/scrapers`
- [ ] `git mv lib/supabase-water.ts scripts/supabase-water.ts`
- [ ] Update relative imports inside scrapers (`../supabase-water.js` should remain valid since both move together)
- [ ] Update `package.json` scripts:
  - [ ] `"scrape:water": "tsx lib/scrapers/water-scraper-manager.ts"` → `"scrape:water": "tsx scripts/scrapers/water-scraper-manager.ts"`
  - [ ] same for `scrape:water:local`
- [ ] Delete now-empty `lib/`
- [ ] Delete now-empty `components/` (after 2.2)

### 2.5 Group `src/pages/` by feature (optional, larger churn)

If you want to take the bigger reorganization in this pass:

| Before | After |
|---|---|
| `src/pages/AuthPage.tsx` | `src/pages/auth/AuthPage.tsx` |
| `src/pages/ImpactAuthPage.tsx` | `src/pages/auth/ImpactAuthPage.tsx` |
| `src/pages/CareersPageNew.tsx` | `src/pages/careers/CareersPage.tsx` (drop "New") |
| `src/pages/QuizPage.tsx` | `src/pages/careers/QuizPage.tsx` |
| `src/pages/MapPage.tsx` | `src/pages/careers/MapPage.tsx` |
| `src/pages/BursariesPage.tsx` | `src/pages/careers/BursariesPage.tsx` |
| `src/pages/BursaryDetailPage.tsx` | `src/pages/careers/BursaryDetailPage.tsx` |
| `src/pages/Grade10SubjectSelectorPage.tsx` | `src/pages/careers/Grade10SubjectSelectorPage.tsx` |
| `src/pages/TVETPage.tsx` | `src/pages/tvet/TVETPage.tsx` |
| `src/pages/TVETCareersPage.tsx` | `src/pages/tvet/TVETCareersPage.tsx` |
| `src/pages/TVETCollegesPage.tsx` | `src/pages/tvet/TVETCollegesPage.tsx` |
| `src/pages/TVETFundingPage.tsx` | `src/pages/tvet/TVETFundingPage.tsx` |
| `src/pages/TVETRequirementsPage.tsx` | `src/pages/tvet/TVETRequirementsPage.tsx` |
| `src/pages/DashboardPage.tsx` | `src/pages/school/DashboardPage.tsx` |
| `src/pages/StudyLibraryPage.tsx` | `src/pages/school/StudyLibraryPage.tsx` |
| `src/pages/CalendarPageNew.tsx` | `src/pages/school/CalendarPage.tsx` (drop "New") |
| `src/pages/SchoolAssistPage.tsx` | `src/pages/school/SchoolAssistPage.tsx` |
| `src/pages/SchoolAssistChatPage.tsx` | `src/pages/school/SchoolAssistChatPage.tsx` |
| `src/pages/CommunityImpactPage.tsx` | `src/pages/community/CommunityImpactPage.tsx` |
| `src/pages/PotholeMapPage.tsx` | `src/pages/community/PotholeMapPage.tsx` |
| `src/pages/FlagPotholePage.tsx` | `src/pages/community/FlagPotholePage.tsx` |
| `src/pages/MyContributionsPage.tsx` | `src/pages/community/MyContributionsPage.tsx` |
| `src/pages/WaterDashboardPage.tsx` | `src/pages/community/WaterDashboardPage.tsx` |
| `src/pages/TaxBudgetPage.tsx` | `src/pages/community/TaxBudgetPage.tsx` |
| `src/pages/CostOfLivingPage.tsx` | `src/pages/community/CostOfLivingPage.tsx` |
| `src/pages/CivicsPage.tsx` | `src/pages/community/CivicsPage.tsx` |
| `src/pages/learning/Algebra/Grade10/Term1/LinearEquations.tsx` | `src/pages/learning/algebra-g10-t1/LinearEquations.tsx` |
| `src/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations.tsx` | `src/pages/learning/algebra-g10-t1/SimultaneousEquations.tsx` |

- [ ] Move pages
- [ ] Update lazy imports in `src/App.tsx` (every `import('./pages/...')` line)
- [ ] Update relative imports inside each moved page (e.g. `../components/AppHeader` may need an extra `../`)

### 2.6 Group `src/data/` (optional)

| Before | After |
|---|---|
| `src/data/careersTypes.ts` | `src/data/careers/types.ts` |
| `src/data/careers.ts` | `src/data/careers/lite.ts` |
| `src/data/careers400Final.ts` | `src/data/careers/index.ts` |
| `src/data/careersFullAudited.ts` | `src/data/careers/audited.ts` |
| `src/data/careersFullData.ts` | `src/data/careers/full.ts` |
| `src/data/batches/` | `src/data/careers/batches/` |
| `src/data/quizQuestions.ts` | `src/data/quiz/questions.ts` |
| `src/data/quizScoringLogic.ts` | `src/data/quiz/scoring.ts` |
| `src/data/saLocations.ts` | `src/data/locations/sa.ts` |
| `src/data/mapData.ts` | `src/data/locations/map.ts` |
| `src/data/tvetCareers.ts` | `src/data/tvet/careers.ts` |
| `src/data/tvetColleges.ts` | `src/data/tvet/colleges.ts` |
| `src/data/universityRequirements.ts` | `src/data/universities/requirements.ts` |
| `src/data/subjectCareerMapping.ts` | `src/data/universities/subject-mapping.ts` |

- [ ] Update each consuming page/service import

### 2.7 Verify Phase 2
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] Manual smoke test of `npm run dev` — load `/`, sign in, hit at least one page from each feature group
- [ ] Commit: `refactor: group components, pages, and data by feature`

**Rollback point:** `git revert HEAD`.

---

## Phase 3 — Import-path updates needed

If you skipped 2.5 (page reorg) and 2.6 (data reorg), this phase is empty.
Otherwise, the import-path updates are described inline in those subsections.

### 3.1 Update `AppPage` union to remove dead routes
- [ ] In `src/lib/withAuth.tsx`, edit `AppPage` to remove these literals:
  - `'demo-learning'`
  - `'disadvantaged-guide'`
  - `'news'`
  - `'news-auth'`

### 3.2 Search & confirm no remaining references
- [ ] `grep -rn "page === 'news'"` in `src/` — should return nothing
- [ ] `grep -rn "DisadvantagedGuide"` in `src/` — should return nothing
- [ ] `grep -rn "demo-learning"` in `src/` — should return nothing

### 3.3 Verify Phase 3
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Commit: `refactor: drop dead route literals from AppPage`

---

## Phase 4 — Package removals

After Phases 1–3 land, the following are unreferenced.

### 4.1 Confirm zero usage (run before each removal)
For each package, run `grep -rn "from ['\"]<package>" src/ scripts/` — must return nothing.

### 4.2 Definitely safe (no remaining importer)
- [ ] `npm uninstall @google/genai`
- [ ] `npm uninstall @radix-ui/react-popover`
- [ ] `npm uninstall @radix-ui/react-select`
- [ ] `npm uninstall @radix-ui/react-slot`
- [ ] `npm uninstall class-variance-authority`
- [ ] `npm uninstall date-fns`
- [ ] `npm uninstall express`
- [ ] `npm uninstall react-day-picker`
- [ ] `npm uninstall @types/express`
- [ ] `npm uninstall autoprefixer`
- [ ] `npm uninstall sharp`

### 4.3 Reassess (depends on whether `cn` helper survives)
If after Phase 2 the only consumer of `cn` was `toast.tsx`:
- Keep `clsx` + `tailwind-merge` (toast.tsx uses them).

If `toast.tsx` was rewritten without `cn`:
- [ ] `npm uninstall clsx`
- [ ] `npm uninstall tailwind-merge`
- [ ] Delete `src/lib/utils.ts`

### 4.4 Deduplicate `vite`
- [ ] Edit `package.json` — remove `vite` from `dependencies` (keep only the entry under `devDependencies`)
- [ ] `npm install` to refresh `package-lock.json`

### 4.5 Verify Phase 4
- [ ] `rm -rf node_modules && npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] Commit: `chore: remove unused dependencies`

**Rollback point:** `git revert HEAD` then `npm install` to restore.

---

## Phase 5 — Verify & test (full pipeline)

- [ ] `git status` clean
- [ ] `rm -rf dist node_modules && npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run preview` — manually click through each route from the App.tsx mapping (use `?page=<id>` URL trigger):
  - [ ] `/?page=home`
  - [ ] `/?page=auth`
  - [ ] `/?page=quiz`
  - [ ] `/?page=careers`
  - [ ] `/?page=bursaries`
  - [ ] `/?page=map`
  - [ ] `/?page=tvet`, `/?page=tvet-careers`, `/?page=tvet-colleges`, `/?page=tvet-funding`, `/?page=tvet-requirements`
  - [ ] `/?page=dashboard&__test_mode=true`
  - [ ] `/?page=library&__test_mode=true`
  - [ ] `/?page=calendar&__test_mode=true`
  - [ ] `/?page=school-assist`, `/?page=school-assist-chat`
  - [ ] `/?page=community-impact`, `/?page=pothole-map`, `/?page=water-dashboard`, `/?page=tax-budget`, `/?page=cost-of-living`, `/?page=civics`
  - [ ] `/?page=learning-algebra-g10-t1-linear-equations&__test_mode=true`
  - [ ] `/?page=learning-algebra-g10-t1-simultaneous&__test_mode=true`
- [ ] `npm test` (Playwright)
- [ ] Confirm `npm run scrape:water` still resolves the script path (don't run unless creds are local)
- [ ] Push branch and merge to `master` only after Vercel preview build succeeds.
