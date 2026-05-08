# Prospect Migration Guide

Step-by-step companion to `CLEANUP_CHECKLIST.md`. Each step has a verification command and an explicit rollback point.

> **Stack reminder:** Vite + React + TypeScript SPA. No file-based router. The `master` branch deploys to Vercel from the `landingpage/` directory.

---

## Pre-flight

```bash
cd C:/test/landingpage
git status                        # working tree must be clean
git checkout -b chore/cleanup-phase1
npm install                       # baseline deps
npm run lint && npm run build     # baseline must pass
npm test                          # baseline Playwright
```

If any of those fail before you start, stop and fix the baseline first.

---

## Step 1: Phase 1 — Safe deletes

**Goal:** remove all files identified as unused (no importer in active code path).

### 1a. Delete the file list

Run the companion `cleanup.sh` script (it only does `rm` operations and only on confirmed-unused files):

```bash
bash docs/cleanup.sh
```

Or, if you prefer to do it interactively, work through `CLEANUP_CHECKLIST.md` § Phase 1 step by step.

### 1b. Verify nothing broken

```bash
npm run lint                      # tsc --noEmit; must report 0 errors
npm run build                     # vite build; must succeed
npm test                          # all Playwright specs green
```

If `tsc` errors, the most likely cause is a forgotten import. Run:

```bash
git diff --stat                   # see what was deleted
```

and check whether any *active* file still imports a deleted module. The audit identified all such cases — none should exist — but if one slips through, the error message will name the file and the import to fix.

### 1c. Commit

```bash
git add -A
git commit -m "chore: remove unused pages, components, and stub UI files

Removes 50+ orphan files identified by codebase audit:
- 3 pages never wired into App.tsx (NewsPage, NewsAuthPage, DisadvantagedGuide)
- 10 unused app components (AlgebraProgressCard, DashboardVideoGrid, GuidedPractice, etc.)
- 6 unused lessons/shared/* components
- 5 stub variants in src/components/ui/
- 20 unused root components/ui/* shadcn-style scaffolding
- 2 unused services (calendarService, studyProgressService)
- 1 unused hook (useLocalStorage)
- 1 orphan JSON (src/data/lessons/linear-equations.json)
- 1 conditionally dead util (trackingLogic)
- 5 empty directories"
```

**Rollback:** `git reset --hard HEAD~1`

---

## Step 2: Phase 2 — Folder reorganization

**Goal:** group `src/components/` by feature; move surviving root-level UI into `src/`.

### 2a. Create new directories

```bash
mkdir -p src/components/shell
mkdir -p src/components/careers
mkdir -p src/components/map
mkdir -p src/components/quiz
mkdir -p src/components/tvet
mkdir -p src/components/marketing
mkdir -p src/components/ui
```

### 2b. Move app components (use `git mv` for history)

```bash
git mv src/components/AppHeader.tsx          src/components/shell/AppHeader.tsx
git mv src/components/LoadingScreen.tsx      src/components/shell/LoadingScreen.tsx

git mv src/components/CareerCard.tsx         src/components/careers/CareerCard.tsx
git mv src/components/CareerDetailModal.tsx  src/components/careers/CareerDetailModal.tsx
git mv src/components/CareersTab.tsx         src/components/careers/CareersTab.tsx
git mv src/components/SearchBox.tsx          src/components/careers/SearchBox.tsx
git mv src/components/TVETCareerCard.tsx     src/components/careers/TVETCareerCard.tsx

git mv src/components/LocationInput.tsx      src/components/map/LocationInput.tsx
git mv src/components/MapDisplay.tsx         src/components/map/MapDisplay.tsx
git mv src/components/CollegesTab.tsx        src/components/map/CollegesTab.tsx
git mv src/components/InsightsTab.tsx        src/components/map/InsightsTab.tsx

git mv src/components/SkippedQuestionsPanel.tsx src/components/quiz/SkippedQuestionsPanel.tsx
git mv src/components/TVETSubNav.tsx         src/components/tvet/TVETSubNav.tsx
```

### 2c. Move root-level UI into `src/components/`

```bash
git mv components/ui/animated-hero.tsx       src/components/marketing/animated-hero.tsx
git mv components/ui/logo-cloud-2.tsx        src/components/marketing/logo-cloud-2.tsx
git mv components/ui/neo-minimal-footer.tsx  src/components/marketing/neo-minimal-footer.tsx
git mv components/ui/toast.tsx               src/components/ui/toast.tsx
```

### 2d. Search-replace import patterns

These are the only patterns that need updating. Use a global find-replace in your editor or run the `sed` commands below (PowerShell uses `(Get-Content ... | ForEach-Object { $_ -replace ... } | Set-Content ...)`).

| Find | Replace | Affected files |
|---|---|---|
| `from '../components/AppHeader'` | `from '../components/shell/AppHeader'` | every `src/pages/*.tsx` |
| `from '../../../../../components/AppHeader'` | `from '../../../../../components/shell/AppHeader'` | learning pages |
| `from '../components/LoadingScreen'` | `from './components/shell/LoadingScreen'` | `src/App.tsx` only (path level changes from `..` to `.`) |
| `from '../components/CareerCard'` | `from '../components/careers/CareerCard'` | `src/pages/CareersPageNew.tsx` |
| `from '../components/CareerDetailModal'` | `from '../components/careers/CareerDetailModal'` | `CareersPageNew`, `MapPage`, `TVETCareersPage` |
| `from '../components/CareersTab'` | `from '../components/careers/CareersTab'` | `MapPage` |
| `from '../components/SearchBox'` | `from '../components/careers/SearchBox'` | `MapPage` |
| `from '../components/TVETCareerCard'` | `from '../components/careers/TVETCareerCard'` | `TVETCareersPage` |
| `from '../components/LocationInput'` | `from '../components/map/LocationInput'` | `MapPage` |
| `from '../components/MapDisplay'` | `from '../components/map/MapDisplay'` | `MapPage` |
| `from '../components/CollegesTab'` | `from '../components/map/CollegesTab'` | `MapPage` |
| `from '../components/InsightsTab'` | `from '../components/map/InsightsTab'` | `MapPage` |
| `from '../components/SkippedQuestionsPanel'` | `from '../components/quiz/SkippedQuestionsPanel'` | `QuizPage` |
| `from '../components/TVETSubNav'` | `from '../components/tvet/TVETSubNav'` | `TVETPage`, `TVETCareersPage`, `TVETCollegesPage`, `TVETFundingPage`, `TVETRequirementsPage` |
| `from '../components/ui/animated-hero'` | `from './components/marketing/animated-hero'` | `src/App.tsx` |
| `from '../components/ui/logo-cloud-2'` | `from './components/marketing/logo-cloud-2'` | `src/App.tsx` |
| `from '../components/ui/neo-minimal-footer'` | `from './components/marketing/neo-minimal-footer'` | `src/App.tsx` |
| `from '../components/ui/toast'` | `from './components/ui/toast'` | `src/main.tsx` |

PowerShell example for one such replacement:

```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx src |
  ForEach-Object {
    (Get-Content $_.FullName) -replace
      [regex]::Escape("from '../components/AppHeader'"),
      "from '../components/shell/AppHeader'" |
      Set-Content $_.FullName
  }
```

### 2e. Resolve the `@/lib/utils` alias

After moving `toast.tsx` into `src/components/ui/`, decide:

**Option A — keep alias, retarget to `src/`** (recommended; least churn):

```bash
git mv lib/utils.ts src/lib/utils.ts
```

Edit `vite.config.ts`:
```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),  // was '.'
  },
},
```

Edit `tsconfig.json`:
```json
"paths": {
  "@/*": ["./src/*"]              // was ["./*"]
}
```

`toast.tsx` keeps its `import { cn } from "@/lib/utils";` line untouched.

**Option B — drop alias entirely:**
Edit `src/components/ui/toast.tsx` to use a relative import:
```ts
import { cn } from "../../lib/utils";
```
Then move `lib/utils.ts` into `src/lib/utils.ts`, and delete the alias config in `vite.config.ts` and `tsconfig.json`.

### 2f. Move scrapers out of root `lib/`

```bash
git mv lib/scrapers     scripts/scrapers
git mv lib/supabase-water.ts scripts/supabase-water.ts
```

Update `package.json`:
```json
"scrape:water":       "tsx scripts/scrapers/water-scraper-manager.ts",
"scrape:water:local": "tsx --env-file=.env.local scripts/scrapers/water-scraper-manager.ts"
```

The relative import `from '../supabase-water.js'` inside `scripts/scrapers/water-scraper-manager.ts` is unaffected because both files moved together.

### 2g. Remove now-empty root directories

```bash
rmdir lib
rmdir components/ui
rmdir components
```

### 2h. Verify Phase 2

```bash
npm run lint                       # tsc must pass
npm run build                      # vite must succeed
npm run dev                        # then visit http://localhost:3000 and click through home, auth, quiz, careers, dashboard, water-dashboard
npm test                           # Playwright
```

If `npm run dev` fails to resolve `@/lib/utils`, recheck the alias config in 2e.

### 2i. Commit

```bash
git add -A
git commit -m "refactor: group components by feature, move root UI into src/

- src/components/{shell,careers,map,quiz,tvet,marketing,ui}/
- moved 4 surviving root components/ui files into src/components/
- relocated lib/scrapers + lib/supabase-water.ts to scripts/
- repointed @/lib/utils alias from project root to src/"
```

**Rollback:** `git reset --hard HEAD~1`

---

## Step 3: Phase 3 — Drop dead route literals

```bash
# Edit src/lib/withAuth.tsx, line 8.
# Remove these four literals from the AppPage union:
#   | 'demo-learning'
#   | 'disadvantaged-guide'
#   | 'news'
#   | 'news-auth'
```

After:
```ts
export type AppPage = 'home' | 'auth' | 'dashboard' | 'quiz' | 'subject-selector'
  | 'library' | 'careers' | 'bursaries' | 'bursary' | 'map'
  | 'tvet' | 'tvet-careers' | 'tvet-colleges' | 'tvet-funding' | 'tvet-requirements'
  | 'calendar' | 'school-assist' | 'school-assist-chat' | 'impact-auth'
  | 'learning-algebra-g10-t1-linear-equations' | 'learning-algebra-g10-t1-simultaneous'
  | 'community-impact' | 'pothole-map' | 'flag-pothole' | 'my-pothole-contributions'
  | 'water-dashboard' | 'tax-budget' | 'cost-of-living' | 'civics';
```

Verify nothing references the removed literals:
```bash
grep -rn "'demo-learning'\|'disadvantaged-guide'\|'news'\|'news-auth'" src/
```
should return zero hits.

```bash
npm run lint && npm run build && npm test
git commit -am "refactor: drop dead route literals from AppPage union"
```

---

## Step 4: Phase 4 — Package removals

Confirm each is unused, then remove:

```bash
# definitely safe
npm uninstall @google/genai @radix-ui/react-popover @radix-ui/react-select \
              @radix-ui/react-slot class-variance-authority date-fns express \
              react-day-picker @types/express autoprefixer sharp
```

Edit `package.json`: remove the duplicated `"vite": "^6.2.0"` line under `dependencies` (keep the one in `devDependencies`).

```bash
rm -rf node_modules package-lock.json
npm install
npm run lint && npm run build && npm test
git add package.json package-lock.json
git commit -m "chore: remove unused dependencies and dedupe vite"
```

If you decided to drop the `cn` helper too:
```bash
npm uninstall clsx tailwind-merge
rm src/lib/utils.ts
# also rewrite src/components/ui/toast.tsx to drop its `cn(...)` call
```

---

## Step 5: Phase 5 — Final verification

```bash
rm -rf dist node_modules
npm install
npm run lint
npm run build
npm run preview
```

Open `http://localhost:4173` and exercise each route. Use `?__test_mode=true` for protected pages:

```
http://localhost:4173/?page=home
http://localhost:4173/?page=auth
http://localhost:4173/?page=quiz
http://localhost:4173/?page=careers
http://localhost:4173/?page=bursaries
http://localhost:4173/?page=map
http://localhost:4173/?page=tvet
http://localhost:4173/?page=tvet-careers
http://localhost:4173/?page=tvet-colleges
http://localhost:4173/?page=tvet-funding
http://localhost:4173/?page=tvet-requirements
http://localhost:4173/?page=dashboard&__test_mode=true
http://localhost:4173/?page=library&__test_mode=true
http://localhost:4173/?page=calendar&__test_mode=true
http://localhost:4173/?page=school-assist
http://localhost:4173/?page=school-assist-chat
http://localhost:4173/?page=community-impact
http://localhost:4173/?page=pothole-map
http://localhost:4173/?page=water-dashboard&__test_mode=true
http://localhost:4173/?page=tax-budget
http://localhost:4173/?page=cost-of-living
http://localhost:4173/?page=civics
http://localhost:4173/?page=learning-algebra-g10-t1-linear-equations&__test_mode=true
http://localhost:4173/?page=learning-algebra-g10-t1-simultaneous&__test_mode=true
```

Then run the Playwright suite once more:
```bash
npm test
```

---

## Rollback strategy summary

Each phase is one commit. To roll back exactly N phases:

```bash
git log --oneline -10               # find the commit before the phase you want to undo
git reset --hard <sha>              # local hard-reset
# if already pushed, prefer git revert <sha> to keep history forward-only
```

For the `node_modules` side of Phase 4, `git checkout package.json package-lock.json && npm install` restores the dependency graph.

---

## Out-of-scope notes (future work)

These came up during the audit but are intentionally **not** part of this cleanup:

1. **Consolidate `careersFullData.ts` (1,754 lines) and `careers400Final.ts` (649 lines).** They serve different pages with different schemas; merging them is a feature-level refactor that needs product input.
2. **Split `App.tsx` (859 lines).** It currently contains the router, top-bar nav, tutorial dialog, and 5 home-page sections. Each section should move to its own file under `src/components/marketing/` or `src/components/home/`.
3. **Unify auth bootstrap** between `App.tsx` and `withAuth.tsx`. Both implement test-mode bypass independently.
4. **The shadow project at `C:\test\` (parent of `landingpage/`)** contains older shadow copies (`PROSPECT-OVERVIEW.md`, parallel `src/`, `tests/`, `vite.config.ts`, `vercel.json`). Vercel deploys from `landingpage/`, so the parent is dead weight — but archive/delete is out of scope here because it touches the deployment side of `vercel.json`. Verify with the Vercel dashboard before touching anything outside `landingpage/`.
