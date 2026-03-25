# Architecture Research

**Domain:** Static-data edtech PWA — career guidance web app
**Researched:** 2026-03-25
**Confidence:** HIGH (derived from existing data schemas + established React/Vite/Supabase patterns)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser / PWA Shell                         │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Quiz Flow   │  │  Career      │  │  Study       │  │  Bursary │ │
│  │  (RIASEC +   │  │  Discovery   │  │  Library     │  │  Finder  │ │
│  │   APS Calc)  │  │  & Deep Dive │  │              │  │          │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬─────┘ │
│         │                 │                  │               │       │
│  ┌──────▼─────────────────▼──────────────────▼───────────────▼─────┐ │
│  │                    React Router (SPA routing)                    │ │
│  └──────────────────────────────┬──────────────────────────────────┘ │
│                                 │                                     │
│  ┌──────────────────────────────▼──────────────────────────────────┐ │
│  │              Global State (React Context + localStorage)         │ │
│  │    quizState | apsState | savedCareers | dataSaverMode           │ │
│  └──────────────────────────────┬──────────────────────────────────┘ │
│                                 │                                     │
│  ┌───────────────┬──────────────▼──────────────┬────────────────┐    │
│  │  Static JSON  │   Data Access Layer          │  Supabase SDK  │    │
│  │  (public/)    │   (hooks + loaders)          │  (optional)    │    │
│  │               │                              │                │    │
│  │  careers/     │  useCareer(id)               │  analytics     │    │
│  │  bursaries/   │  useCareerList(filters)      │  saved results │    │
│  │  subjects/    │  useBursaries(filters)       │  auth (opt)    │    │
│  │  universities/│  useSubject(subject, grade)  │                │    │
│  │  tvet/        │  useRIASECMatch(codes)        │                │    │
│  └───────────────┴─────────────────────────────┴────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
         │                                              │
         ▼                                              ▼
   Vercel CDN                                    Supabase (cloud)
   (Cape Town cpt1)                              - auth.users
   - static assets                               - quiz_events (analytics)
   - JSON files                                  - saved_careers
   - PWA manifest                                - study_progress
   - service worker
```

### Component Responsibilities

| Component | Responsibility | Boundary Rule |
|-----------|---------------|---------------|
| Quiz Flow (RIASEC + APS) | Multi-step form state machine, scoring, result matching | Self-contained; emits `{riasecCodes, apsScore}` to parent — no direct data fetches |
| Career Discovery | Filter/search UI over master index, province map | Reads only `_master-index.json`; never fetches full career detail until user navigates to detail |
| Career Detail | Full career deep-dive page | Fetches single `careers/{pathway}/{id}.json` on mount |
| Study Library | Subject → grade → topic navigation tree | Fetches single subject JSON per navigation; never prefetches all subjects |
| Bursary Finder | Filter/search UI + NSFAS checker | Reads entire `bursaries.json` (single fetch, ~120KB) |
| Province Map | Interactive SVG map, click-to-filter careers | Receives province filter event, propagates to Career Discovery via URL param |
| Supabase Layer | Auth (optional), analytics writes, saved results reads/writes | Never blocks UI — all Supabase calls are fire-and-forget or background |
| PWA Shell / Service Worker | Cache strategy, offline fallback, manifest | Separate service worker file; not part of component tree |

---

## Recommended Project Structure

```
C:/SaCareerGuide/
├── public/
│   ├── data/                        # Static JSON served as files (NOT bundled)
│   │   ├── careers/
│   │   │   ├── _master-index.json   # 161 careers, index fields only (~40KB)
│   │   │   ├── university/          # Full career detail files
│   │   │   │   └── {id}.json        # ~15–25KB each
│   │   │   ├── tvet/
│   │   │   │   └── {id}.json
│   │   │   └── emerging/
│   │   │       └── {id}.json
│   │   ├── bursaries/
│   │   │   └── bursaries.json       # All 245 bursaries (~120KB)
│   │   ├── subjects/
│   │   │   └── {subject}-{grade}.json  # e.g. maths-grade-10.json (~80KB)
│   │   ├── universities/
│   │   │   └── universities.json    # 26 universities, summary data
│   │   ├── tvet-colleges/
│   │   │   └── tvet-colleges.json   # 50 colleges with provinces
│   │   └── market/
│   │       └── job-gaps.json        # Province × sector demand matrix
│   ├── icons/                       # PWA icons (192, 512px)
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker (Workbox or hand-rolled)
│
├── src/
│   ├── main.tsx                     # Entry point, router, context providers
│   ├── App.tsx                      # Root layout, nav, outlet
│   │
│   ├── routes/                      # One file per route — maps to URL structure
│   │   ├── index.tsx                # / — landing page (no data fetch)
│   │   ├── quiz.tsx                 # /quiz — RIASEC + APS entry
│   │   ├── quiz-results.tsx         # /quiz/results?r=RIC&aps=32
│   │   ├── careers.tsx              # /careers — discovery + filter
│   │   ├── career-detail.tsx        # /careers/:pathway/:id
│   │   ├── study.tsx                # /study — library root
│   │   ├── study-subject.tsx        # /study/:subject/:grade
│   │   ├── bursaries.tsx            # /bursaries
│   │   ├── province.tsx             # /province/:province (or query param)
│   │   ├── compare.tsx              # /compare?ids=a,b,c
│   │   └── saved.tsx                # /saved — auth-gated or localStorage
│   │
│   ├── features/                    # Feature modules (collocated logic)
│   │   ├── quiz/
│   │   │   ├── QuizShell.tsx        # Step routing, progress bar
│   │   │   ├── RiasecStep.tsx       # 42-question RIASEC
│   │   │   ├── ApsStep.tsx          # Subject mark entry
│   │   │   ├── ResultsView.tsx      # Career matches rendered
│   │   │   ├── quiz.machine.ts      # State machine (pure TS, no deps)
│   │   │   ├── aps.calculator.ts    # Mark → APS point lookup table
│   │   │   └── riasec.matcher.ts    # Score → top 3 RIASEC codes
│   │   │
│   │   ├── careers/
│   │   │   ├── CareerCard.tsx
│   │   │   ├── CareerGrid.tsx
│   │   │   ├── CareerFilters.tsx
│   │   │   ├── CareerDetail.tsx
│   │   │   ├── CareerCompare.tsx
│   │   │   └── useCareerSearch.ts   # filter + sort logic over index
│   │   │
│   │   ├── study/
│   │   │   ├── SubjectNav.tsx
│   │   │   ├── GradeSelector.tsx
│   │   │   ├── TopicList.tsx
│   │   │   ├── TopicViewer.tsx
│   │   │   └── useSubjectContent.ts # Fetches subject-grade JSON lazily
│   │   │
│   │   ├── bursaries/
│   │   │   ├── BursaryList.tsx
│   │   │   ├── BursaryFilters.tsx
│   │   │   ├── NsfasChecker.tsx
│   │   │   └── useBursaries.ts
│   │   │
│   │   ├── map/
│   │   │   ├── ProvinceMap.tsx      # SVG map, click dispatch
│   │   │   ├── sa-provinces.svg     # Inline or imported SVG paths
│   │   │   └── useProvinceData.ts   # job-gaps.json → province demand
│   │   │
│   │   └── sharing/
│   │       ├── ShareButton.tsx      # WhatsApp + copy URL
│   │       └── url.encoder.ts       # Compact param encoding/decoding
│   │
│   ├── data/                        # Data access layer (all JSON fetches)
│   │   ├── loaders.ts               # fetch() wrappers with error handling
│   │   ├── cache.ts                 # In-memory module-level cache (Map)
│   │   ├── types.ts                 # TypeScript interfaces for all JSON schemas
│   │   └── index.ts                 # Re-exports all data hooks
│   │
│   ├── hooks/                       # App-wide reusable hooks
│   │   ├── useDataSaver.ts          # Reads/sets data saver preference
│   │   ├── useSupabase.ts           # Supabase client singleton
│   │   └── useLocalStorage.ts       # Type-safe localStorage wrapper
│   │
│   ├── context/
│   │   ├── AppContext.tsx           # dataSaverMode, province filter, auth user
│   │   └── QuizContext.tsx          # Active quiz session state
│   │
│   ├── components/                  # Shared UI primitives
│   │   ├── ui/                      # Tailwind-composed atomics
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Skeleton.tsx         # Loading states
│   │   │   └── ProgressBar.tsx
│   │   ├── Layout.tsx               # Page shell, mobile nav
│   │   ├── DataSaverBanner.tsx
│   │   ├── OfflineBanner.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client init (singleton)
│   │   ├── analytics.ts             # Thin wrapper — fire-and-forget events
│   │   └── constants.ts             # RIASEC descriptions, APS tables, provinces list
│   │
│   └── styles/
│       └── globals.css              # Tailwind base + custom SA color tokens
│
├── vite.config.ts                   # Vite + PWA plugin config
├── tailwind.config.ts
└── tsconfig.json
```

### Structure Rationale

- **`public/data/`:** JSON files served as static assets from Vercel's CDN — no bundling overhead, individually cacheable, supports dynamic `fetch()` with cache headers. This is the key pattern for the 50KB initial load constraint.
- **`src/features/`:** Feature-first grouping (not type-first). Each feature owns its components, hooks, and logic. The quiz feature is entirely self-contained — the state machine `quiz.machine.ts` is pure TypeScript with zero React dependency, making it independently testable.
- **`src/data/`:** Centralised data access layer isolates all `fetch()` calls behind typed hooks. Components never call `fetch()` directly. The `cache.ts` module-level Map prevents duplicate fetches on remount (React Strict Mode double-invoke, navigation back).
- **`src/routes/`:** Flat route files matching the URL structure directly. React Router v6 loaders can be added here without touching feature components.
- **`src/lib/`:** Infrastructure singletons. Supabase client is created once and imported everywhere — never constructed in components.

---

## Architectural Patterns

### Pattern 1: Index-First Data Loading

**What:** Serve a lightweight master index (`_master-index.json`) containing only list-view fields (id, title, category, pathway, riasec, demandLevel, emerging). Load full career detail JSON only when the user navigates to a career page.

**When to use:** Any time you have a collection of 50+ items where users browse a list and drill into individual items. The 161 careers at ~20KB each = 3.2MB if loaded at once. The index contains the same 161 entries at ~40KB total.

**Trade-offs:** Adds a network round-trip on career page load (covered by service worker cache after first visit). Worth it to stay under 50KB initial.

**Example:**
```typescript
// src/data/loaders.ts
const _cache = new Map<string, unknown>();

export async function fetchJSON<T>(path: string): Promise<T> {
  if (_cache.has(path)) return _cache.get(path) as T;
  const res = await fetch(`/data/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const data = await res.json();
  _cache.set(path, data);
  return data;
}

// Usage in feature hook
export function useCareer(pathway: string, id: string) {
  const [career, setCareer] = useState<Career | null>(null);
  useEffect(() => {
    fetchJSON<Career>(`careers/${pathway}/${id}.json`).then(setCareer);
  }, [pathway, id]);
  return career;
}
```

### Pattern 2: Pure State Machine for Quiz

**What:** Implement the RIASEC + APS quiz as a pure TypeScript state machine with no React or side-effect dependencies. The machine is a function of `(state, event) => state`. React components call it and render based on state.

**When to use:** Multi-step flows with branching logic, validation, and back/forward navigation. The quiz has 42 RIASEC questions, then an optional APS step, then scoring and matching — a state machine prevents "which step am I on?" bugs.

**Trade-offs:** Slightly more upfront code than ad-hoc `useState` management, but eliminates the entire class of "can I go back?", "what's valid here?", "did scoring run?" bugs. Well worth it for a 7-day build (bugs in quiz = blocked users = bounced).

**Example:**
```typescript
// src/features/quiz/quiz.machine.ts
export type QuizStep =
  | { step: 'riasec'; questionIndex: number; answers: RiasecAnswers }
  | { step: 'aps'; answers: RiasecAnswers; marks: SubjectMarks }
  | { step: 'results'; riasecCodes: string[]; apsScore: number };

export type QuizEvent =
  | { type: 'ANSWER_RIASEC'; questionIndex: number; value: 1 | 2 | 3 | 4 | 5 }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SUBMIT_MARKS'; marks: SubjectMarks }
  | { type: 'SKIP_APS' };

export function quizReducer(state: QuizStep, event: QuizEvent): QuizStep {
  // Pure transition logic — no side effects
  // ...
}
```

### Pattern 3: URL as State for Sharing

**What:** Encode quiz results, APS score, and active filters into URL search params so any state worth sharing can be reconstructed from the URL alone. Keep params compact (3-char RIASEC code, integer APS) for WhatsApp link previews.

**When to use:** Any user-visible state that should survive refresh, be shareable, or be bookmarkable. Quiz results, career filters, province selection, career comparison list.

**Trade-offs:** Requires URL ↔ state sync discipline. Mitigate by centralising encode/decode in `src/features/sharing/url.encoder.ts`.

**Example:**
```
/quiz/results?r=RIC&aps=32&top=software-developer,data-analyst,electrician
/careers?province=Gauteng&demand=high&path=tvet
/compare?ids=nurse,doctor,pharmacist
```

### Pattern 4: Supabase as Background Layer

**What:** All Supabase calls (analytics writes, saved results, auth) are fire-and-forget from the UI perspective. The app works 100% without Supabase. Auth enhances it (saves persist across devices) but never blocks core functionality.

**When to use:** Any feature where Supabase adds value but its failure must not degrade the experience. Analytics especially — a failed analytics write must be invisible to the user.

**Trade-offs:** Analytics may be incomplete if calls fail. Acceptable: data is directional signal, not audited record.

**Example:**
```typescript
// src/lib/analytics.ts
export function trackQuizComplete(payload: QuizResult): void {
  // Intentionally not awaited — fire and forget
  supabase.from('quiz_events').insert({
    riasec_codes: payload.riasecCodes,
    aps_score: payload.apsScore,
    created_at: new Date().toISOString(),
  }).then(() => {}).catch(() => {}); // Swallow errors silently
}
```

### Pattern 5: Data Saver Mode as Progressive Enhancement

**What:** Data Saver Mode is a user-toggled flag stored in localStorage. When active: lazy-load thumbnails are replaced with text-only, study content images are skipped, the province map SVG is replaced with a text dropdown, and subject content is not prefetched. When off: normal experience.

**When to use:** The context is mobile users on prepaid data in SA. A student on 50MB data cannot afford a 3MB career page.

**Trade-offs:** Requires every data-heavy component to read `dataSaverMode` from context. Establish this convention early (Phase 1) or retrofitting is painful.

---

## Data Flow

### Quiz Flow

```
User answers RIASEC question
    ↓
QuizContext.dispatch({ type: 'ANSWER_RIASEC', ... })
    ↓
quizReducer(state, event) → new state  [pure function]
    ↓
QuizShell re-renders next question / APS step
    ↓
On completion: scoreRIASEC(answers) → ['R','I','C']
              computeAPS(marks) → 32
    ↓
Navigate to /quiz/results?r=RIC&aps=32
    ↓                                       ↓
Fetch _master-index.json               trackQuizComplete() [Supabase, async]
    ↓
filterByRIASEC(['R','I','C']) → top matches
filterByAPS(32) → eligible subset
    ↓
ResultsView renders career cards
    ↓
User taps career → /careers/university/software-developer
    ↓
Fetch careers/university/software-developer.json
```

### Career Detail Flow

```
Route: /careers/:pathway/:id
    ↓
useCareer(pathway, id)
    ↓
fetchJSON(`careers/${pathway}/${id}.json`)   ← cache check first
    ↓
Render: overview | matric requirements | APS eligibility check
                 | universities | TVET alternative
                 | bursaries (filter bursaries.json by careerIds)
                 | salary range | jobDemand by province
    ↓
Province map highlights byProvince demand levels
    ↓
Share button → encodeURL({careerId, riasecCodes, aps}) → WhatsApp link
```

### Study Library Flow

```
/study → Subject grid (static, no fetch needed — list is in constants.ts)
    ↓
User selects Maths → Grade 10
    ↓
Navigate to /study/mathematics/grade-10
    ↓
useSubjectContent('mathematics', 'grade-10')
    ↓
fetchJSON('subjects/mathematics-grade-10.json')   ← 80KB, cached after first load
    ↓
Render topic list → user taps topic
    ↓
Render: explanation | worked examples | practice questions | YouTube embed
        (YouTube embed skipped if dataSaverMode)
```

### Supabase State Flow

```
Optional: User taps "Save results"
    ↓
Check auth state (useSupabase hook)
    ↓ (not logged in)                          ↓ (logged in)
Prompt: "Sign in to save across devices"   Write to saved_careers table
    ↓ (decline)                                 ↓
Save to localStorage instead               Sync localStorage → Supabase
    ↓
UI shows saved indicator regardless of backend state
```

### PWA / Offline Flow

```
First visit (online):
    ↓
Service worker installed
    ↓
Precache: app shell (HTML, CSS, JS bundle) + _master-index.json + bursaries.json
    ↓
Runtime cache (on first fetch): individual career JSONs, subject JSONs

Subsequent visit (offline):
    ↓
Service worker intercepts fetch
    ↓
App shell → from precache (instant)
_master-index.json → from precache (career list works offline)
/careers/:id → from runtime cache IF previously visited
             → OfflineBanner + "Visit this page online first" IF not cached
Study content → from runtime cache IF previously visited
Supabase calls → swallowed, no-op offline
```

---

## Suggested Build Order (Dependency Graph)

This order minimises blocked work and ensures each phase ships a working product slice.

```
Phase 0: Foundation (Day 1)
    ├── Vite + React + TypeScript + Tailwind setup
    ├── React Router v6 structure (all routes stubbed)
    ├── public/data/ directory — move existing JSON files
    ├── src/data/loaders.ts + types.ts (fetch wrappers, TypeScript types)
    ├── AppContext (dataSaverMode, province) — used by everything
    └── Layout.tsx + mobile nav (every page needs this)

Phase 1: Quiz (Day 2) — No external data dependency
    ├── quiz.machine.ts (pure TS — testable standalone)
    ├── aps.calculator.ts (APS lookup table — pure TS)
    ├── riasec.matcher.ts (score → codes — pure TS)
    ├── QuizShell → RiasecStep → ApsStep → ResultsView
    └── URL encoding for shareable results
    → UNBLOCKS: Career Discovery (needs RIASEC codes to filter)

Phase 2: Career Discovery (Day 3) — Needs: Phase 0 loaders + _master-index.json
    ├── useCareerSearch hook (filter/sort over index)
    ├── CareerGrid + CareerCard + CareerFilters
    ├── APS eligibility check (reuses aps.calculator.ts from Phase 1)
    └── ProvinceMap SVG (filter propagation via URL)
    → UNBLOCKS: Career Detail (needs index to link to)

Phase 3: Career Detail (Day 4) — Needs: Phase 2 Career Discovery
    ├── useCareer hook (per-file fetch)
    ├── CareerDetail full page (all sections)
    ├── Bursary cross-reference (filter bursaries.json by careerIds)
    └── ShareButton + WhatsApp URL generation
    → UNBLOCKS: Compare tool

Phase 4: Study Library (Day 5) — Parallel to Phase 3
    ├── SubjectNav + GradeSelector (static constants, no fetch)
    ├── useSubjectContent hook
    └── TopicViewer (explanation, examples, questions, YouTube embed)
    → Independent track — no dependency on Career phases

Phase 5: Bursary Finder + Market (Day 6) — Needs: Phase 0 loaders
    ├── useBursaries hook
    ├── BursaryList + BursaryFilters + NsfasChecker
    ├── Job demand heatmap (job-gaps.json)
    └── Career Compare tool (uses existing CareerDetail components)

Phase 6: PWA + Polish (Day 7)
    ├── Service worker (Workbox) + manifest.json
    ├── Supabase analytics (quiz_events table)
    ├── Optional auth + saved_careers
    ├── Data Saver Mode polish (verify all components respect flag)
    ├── OfflineBanner + ErrorBoundary
    └── Vercel deploy + cpt1 region config
```

**Critical dependency:** The quiz state machine (Phase 1) must be complete before Career Discovery (Phase 2) because the results page feeds the career list. Everything else can be built in parallel tracks.

---

## Scaling Considerations

| Scale | Architecture Notes |
|-------|-------------------|
| 0–10K users | Current architecture handles this with zero changes. Vercel CDN + static JSON absorbs all read load. Supabase free tier handles analytics writes. |
| 10K–100K users | Supabase analytics table needs index on `created_at`. Consider Supabase Edge Functions if bursary eligibility logic becomes complex. No architecture change needed. |
| 100K+ users | Consider pre-building a search index (Fuse.js index JSON) for career search. PWA precache strategy may need revision as JSON files grow. Supabase Pro tier for analytics volume. Still no backend needed for read path. |

**First bottleneck:** Supabase free tier write limits on quiz_events (500MB database). Mitigate by batching analytics or sampling (1 in 5 events).

**Second bottleneck:** JSON file size as career database grows. The `_master-index.json` stays small (index fields only). Individual career files grow with content but remain individually cacheable.

---

## Anti-Patterns

### Anti-Pattern 1: Bundling JSON Data

**What people do:** Import career JSON directly in JS (`import careers from './data/careers.json'`) so webpack/Vite bundles it.

**Why it's wrong:** 161 careers × ~20KB each = 3.2MB added to the JS bundle. This breaks the 50KB initial load requirement completely. Bundled JSON also can't be independently cached by the CDN.

**Do this instead:** Put all JSON in `public/data/` and fetch via `fetch('/data/careers/_master-index.json')`. The CDN serves and caches each file independently. The bundle stays small.

### Anti-Pattern 2: useState for Quiz Steps

**What people do:** `const [step, setStep] = useState(0)` with a pile of `if (step === 3 && hasAPS)` conditions spread across components.

**Why it's wrong:** The quiz has conditional branching (skip APS, go back, validate before advance). Ad-hoc state becomes unmaintainable by step 4. Back-navigation especially breaks.

**Do this instead:** A pure `quizReducer(state, event) => state` function. All step logic lives in one place. React components just call dispatch and render based on state shape.

### Anti-Pattern 3: Blocking Auth Gate

**What people do:** Wrap quiz results or career deep dives behind a login wall because "we want user accounts."

**Why it's wrong:** The core value proposition is frictionless access. A login gate on the quiz result page will cause massive bounce among SA students who distrust sign-up. Competitors who do this (Yenza) are explicitly called out in the PROJECT.md as the thing to beat.

**Do this instead:** Allow full access without login. Show a non-blocking "Save your results? Sign in" prompt after results are shown. localStorage preserves results locally. Supabase auth is opt-in enhancement only.

### Anti-Pattern 4: One Giant Context

**What people do:** Put all state (quiz, auth, filters, data saver, saved careers, current province) into a single `AppContext`.

**Why it's wrong:** Any context update re-renders all consumers. A RIASEC answer update (fires 42 times per quiz) will re-render the entire app tree including the Layout nav and DataSaverBanner on every keypress.

**Do this instead:** Two contexts: `AppContext` (slow-changing global: dataSaverMode, auth user, province) and `QuizContext` (fast-changing quiz session state, only consumed by quiz components).

### Anti-Pattern 5: Fetching All Bursaries Per Career

**What people do:** On each career detail page, fetch all 245 bursaries and filter client-side — but also fetch them independently in the bursary section component.

**Why it's wrong:** Multiple components trigger the same 120KB fetch. Even with a cache, the first few renders on a slow connection may trigger simultaneous fetches.

**Do this instead:** Centralise bursary fetching in `useBursaries()` which uses the module-level cache in `loaders.ts`. The second caller gets the cached promise (or result), never triggering a second network request.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Supabase | `@supabase/supabase-js` client singleton in `src/lib/supabase.ts` | Initialise with `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`. Anon key is safe to expose — row-level security enforces per-user data access. |
| Vercel | Static deploy — `vercel.json` sets `"regions": ["cpt1"]` and cache headers for `public/data/` (`Cache-Control: public, max-age=86400, stale-while-revalidate=604800`) | Cape Town region is critical for SA latency. Without explicit config, Vercel defaults to US-East. |
| YouTube | `<iframe>` embeds in study content — skipped when dataSaverMode is true | No API key needed for embed-only. Title and thumbnail link suffice in data saver mode. |
| WhatsApp | `https://wa.me/?text=${encodeURIComponent(url)}` — no API or token needed | Ensure URLs stay under 200 chars for WhatsApp preview reliability. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Quiz → Career Discovery | URL params (`/quiz/results?r=RIC&aps=32`) | Quiz never imports career components. Decoupled via navigation. |
| Career Discovery → Career Detail | React Router `<Link to="/careers/university/ai-ml-engineer">` | Master index supplies pathway + id for the link; detail page fetches its own data. |
| Province Map → Career Filters | URL search param `?province=Gauteng` | Map component updates URL; Career Discovery reads URL. No direct component coupling. |
| Data Layer → Supabase | Only `src/lib/analytics.ts` and `src/hooks/useSupabase.ts` touch Supabase SDK | All other components import from `src/data/` only. No Supabase imports in feature components. |
| AppContext → Feature Components | React Context via `useContext(AppContext)` | Read-only for feature components. Only the Settings toggle writes to context. |

---

## PWA / Service Worker Strategy

### Cache Tiers

| Asset | Strategy | Rationale |
|-------|----------|-----------|
| HTML shell + JS/CSS bundle | Precache on install | App shell must load offline. Updates via service worker version bump. |
| `_master-index.json` + `bursaries.json` | Precache on install | Core list views work offline immediately. |
| Individual career JSONs (`careers/{pathway}/{id}.json`) | Cache on first fetch (Cache First) | After first visit, career pages load offline. No prefetch — 3.2MB is too large. |
| Subject content JSONs | Cache on first fetch (Cache First) | After first study session, content available offline. |
| `job-gaps.json`, `universities.json`, `tvet-colleges.json` | Cache on first fetch | Supplementary data, offline after first view. |
| Supabase API calls | Network Only, fail silently | Never cache auth or analytics calls. Offline = no-op. |
| YouTube iframes | Network Only | Skip entirely in offline mode (OfflineBanner for study page). |

### Service Worker Implementation

Use `vite-plugin-pwa` with Workbox. Configure `generateSW` mode (simpler than `injectManifest` for this use case). The plugin handles precache manifest generation from Vite's build output automatically.

```typescript
// vite.config.ts (key section)
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html}'],
    runtimeCaching: [
      {
        urlPattern: /^\/data\/careers\//,
        handler: 'CacheFirst',
        options: { cacheName: 'career-data', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } },
      },
      {
        urlPattern: /^\/data\/subjects\//,
        handler: 'CacheFirst',
        options: { cacheName: 'subject-data', expiration: { maxEntries: 40, maxAgeSeconds: 604800 } },
      },
    ],
  },
  manifest: { name: 'SA Career Guide', short_name: 'CareerGuide', theme_color: '#1a6b3c' },
})
```

---

## Sources

- Existing project data schemas confirmed by `git show HEAD:data/careers/university/ai-ml-engineer.json` — career JSON structure (id, title, riasec, matric, qualifications, salary, jobDemand)
- Existing bursary schema confirmed by `git show HEAD:data/bursaries/bursaries.json` — 245 entries with careerIds, coverage booleans, incomeThreshold
- Master index confirmed: 161 careers, 41 categories, all 6 RIASEC codes (R,I,A,S,E,C)
- PROJECT.md: constraints (50KB initial load, optional auth, no forced login, Vercel cpt1, 7-day timeline)
- Vite PWA plugin: https://vite-pwa-org.netlify.app/guide/ (confidence: HIGH based on training data, architecture stable)
- React Router v6 data loading patterns: https://reactrouter.com/en/main (confidence: HIGH)
- Supabase anon key + RLS pattern: https://supabase.com/docs/guides/auth/row-level-security (confidence: HIGH)
- Workbox cache strategies: https://developer.chrome.com/docs/workbox/caching-strategies-overview (confidence: HIGH)

---

*Architecture research for: SA Career Guide — React + Tailwind + Supabase career guidance PWA*
*Researched: 2026-03-25*
