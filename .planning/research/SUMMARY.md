# Project Research Summary

**Project:** SA Career Guide
**Domain:** Career guidance / edtech PWA — South Africa (Grade 10-12 students)
**Researched:** 2026-03-25
**Confidence:** MEDIUM-HIGH

## Executive Summary

The SA Career Guide is a mobile-first progressive web app targeting South African high school students who need free, low-data-cost access to career discovery, APS calculation, and bursary funding information. The recommended approach is a fully static-data SPA (React 19 + Vite 8 + Tailwind v4) served from Vercel's Cape Town CDN, with no server-side rendering and no forced authentication. All core features — RIASEC quiz, career discovery, APS calculator, bursary search — run entirely on static JSON served from `public/data/`, keeping the initial bundle under 50KB gzipped. Supabase is present as an optional background layer for anonymous analytics and opt-in result saving, but the app must function 100% without any Supabase call succeeding.

The dominant architectural constraint is data cost, not complexity. SA prepaid data costs make a 2MB page load economically harmful to the target user. This single constraint drives every technology choice: Tailwind v4 over component libraries (zero JS runtime), Fuse.js over Algolia (offline-capable), inline SVG maps over Leaflet (no tile downloads), index-only JSON plus per-career lazy fetches (never bundle 200 career records), and Cache-First service worker caching only for previously-visited pages (never precache the full data directory at install). The 7-day build timeline enforces ruthless scope discipline — the core discovery loop (quiz → results → career detail → bursary) is v1; province map, study library, and optional auth are v1.x or v2.

The top risks are scope explosion in the study library (content creation is unbounded), province map SVG complexity (deceptively hard on a solo timeline), and RIASEC scoring errors (bad matches destroy trust). All three are time-bomb features that look fast but consume days. The architecture research provides a validated 7-phase build order that sequences around these risks: foundation and PWA configuration in Phase 0, pure-logic quiz in Phase 1, data architecture decisions before any UI in Phase 2, and the study library as an independent parallel track with a hard 4-hour content time-box.

---

## Key Findings

### Recommended Stack

The stack is a lean, offline-capable SPA built on React 19 + Vite 8 + TypeScript. Tailwind CSS v4 (Vite plugin, no PostCSS config) handles all styling with zero JS runtime cost. React Router v7 in library mode provides route-based code splitting. Zustand v5 with `persist` middleware handles quiz and APS state in localStorage — quiz progress survives accidental navigation on mobile. TanStack Query v5 manages all JSON data fetching with stale-while-revalidate semantics; `vite-plugin-pwa` with Workbox generates the service worker. Supabase JS v2 is dynamically imported only when the auth modal opens, so it never appears in the critical path.

All version combinations are verified against the npm registry. Two version constraints matter most: `vite-plugin-pwa 1.x` is required for Vite 8 compatibility (do not use v0.x), and `@tailwindcss/vite 4.2.2` must match the installed `tailwindcss` version exactly.

**Core technologies:**
- **React 19 + Vite 8**: SPA framework + build tool — fastest HMR, native ESM, smallest bundles; Next.js SSR overhead is unnecessary for a static-data PWA
- **Tailwind CSS v4**: Utility-first CSS via Vite plugin — zero JS runtime, ~35% smaller output than v3, eliminates PostCSS config
- **React Router v7 (library mode)**: Client-side routing — per-route code splitting keeps shell under 20KB gzipped
- **Zustand v5 + persist**: Global state for quiz and APS — 1KB, localStorage persistence, no boilerplate
- **TanStack Query v5**: Lazy JSON fetching — loads career/bursary/subject data only when the route mounts
- **vite-plugin-pwa + Workbox**: Service worker — tiered caching, offline support, auto-update with `skipWaiting()`
- **Fuse.js v7**: Client-side fuzzy search — 24KB, offline-capable, sufficient for 200-record index
- **Supabase JS v2 (optional)**: Anonymous analytics + opt-in result saving — dynamically imported, never in critical path
- **Vercel + cpt1 region**: Deployment — Cape Town region must be set in `vercel.json` before first deploy

**What NOT to use:** Next.js (SSR overhead), Framer Motion (50KB), Chart.js/Recharts (170KB), Leaflet (tile downloads break offline), any component library (MUI/Chakra add 100-300KB), Redux (15KB overhead vs Zustand's 1KB).

### Expected Features

The core product loop is: discover a career (via RIASEC quiz or search) → understand the path (career detail with matric requirements, APS, university/TVET options) → find funding (bursary list with NSFAS checker). Every v1 feature serves this loop. Anything outside the loop is v1.x or later.

Competitors (Yenza, Gradesmatch, NCAP, Reslocate) all have meaningful weaknesses: Yenza paywalls career content, Gradesmatch focuses on application workflows rather than discovery, NCAP is outdated, and none offer TVET as a first-class pathway. The clearest differentiators are: 100% free with no login, TVET pathways as equals to university paths, WhatsApp-shareable results, and data saver mode — none of which competitors provide.

**Must have (table stakes for v1 — 7-day launch):**
- RIASEC interest quiz (42 Likert questions, 6 type scores, top-3 code output)
- Career results list (filtered by RIASEC codes + APS eligibility)
- Career detail page (matric requirements, APS threshold, university and TVET pathways, salary, bursaries)
- APS calculator (per-subject mark entry, aggregate APS + subject prerequisite validation)
- Bursary listing with basic filter (245 bursaries already in repo — display + field/province filter)
- NSFAS eligibility checker (rule-based: household income < R350K, SA citizen, first-time student)
- WhatsApp-shareable result URL (compact URL params, tested under 200 chars)
- Mobile-responsive + data saver mode (50KB initial load, auto-detect slow connections)

**Should have (v1.x after validation):**
- Province map (SVG choropleth — province dropdown ships first; map is progressive enhancement, time-boxed to 4 hours)
- Career comparison tool (2-column layout, no new data needed)
- PWA / offline support (service worker with tiered caching strategy)
- Bursary eligibility deep filter (by province, APS threshold — only after bursary traffic is meaningful)
- Subject selector for Grade 9/10 (reverse lookup: subject combo → career paths)
- Study library — first 2-3 subjects (viewer component built; content time-boxed to 4 hours for v1 skeleton)

**Defer to v2+:**
- Full study library (13 subjects × 3 grades) — content creation is a multi-week project
- Optional Supabase auth (save results across devices) — only needed when return users emerge
- Multilingual content (Zulu, Xhosa, Afrikaans, etc.) — requires professional translation
- Anonymous quiz analytics dashboard — only useful after sufficient traffic
- School/teacher admin dashboard — doubles the product surface area
- AI-generated advice — hallucination risk on high-stakes decisions is unacceptable

### Architecture Approach

The app is a feature-first SPA with a strict static-data contract: all JSON lives in `public/data/` served as CDN assets and is never bundled. The data access layer (`src/data/loaders.ts`) is the only place `fetch()` is called; all components consume typed hooks. The project structure separates `src/routes/` (URL-mapped route files), `src/features/` (collocated feature components + hooks + logic), and `src/lib/` (infrastructure singletons). The RIASEC quiz is implemented as a pure TypeScript state machine (`quiz.machine.ts`) with zero React dependency — independently testable and bug-resistant for the most critical user flow.

Two React Contexts are used: `AppContext` (slow-changing globals: dataSaverMode, auth user, province) and `QuizContext` (fast-changing quiz session state). This split prevents quiz answer updates from re-rendering the entire app tree 42 times per session. URL params are the primary inter-feature communication mechanism: quiz results flow to career discovery via `/quiz/results?r=RIC&aps=32`; province filter flows from map to career list via `?province=Gauteng`. No feature component imports another feature's internals.

**Major components:**
1. **Quiz Flow** (RIASEC + APS) — pure TS state machine; emits `{riasecCodes, apsScore}` to URL; self-contained
2. **Career Discovery** — reads `_master-index.json` only; never fetches full career JSON until navigation
3. **Career Detail** — fetches single `careers/{pathway}/{id}.json` on mount; cross-references bursaries
4. **Bursary Finder** — reads entire `bursaries.json` once (~120KB) via centralised `useBursaries()` hook
5. **Province Map** — inline SVG with React event handlers; propagates filter via URL param; degradable to `<select>` dropdown
6. **Study Library** — fetches single subject-grade JSON per navigation; YouTube embeds skipped in data saver mode
7. **Supabase Layer** — fire-and-forget analytics writes; optional auth; never blocks UI rendering
8. **PWA Shell / Service Worker** — Workbox tiered cache: precache app shell + master index; Cache-First for visited career/subject pages; never precache full data directory

### Critical Pitfalls

1. **Vercel defaults to Washington DC (iad1) — set `cpt1` before first deploy** — Add `"regions": ["cpt1"]` to `vercel.json` at project scaffold. No code change fixes a wrong region after data shows 300ms latency from SA.

2. **Precaching all JSON at PWA install violates the 50KB constraint** — Configure Workbox to precache only the app shell and `_master-index.json` + `bursaries.json`. Exclude the entire `public/data/` directory from the precache glob. Use Cache-First runtime caching only for pages the user actually visits.

3. **Study library content creation is unbounded — time-box to 4 hours** — The feature architecture (viewer, navigation, JSON schema) can be built in one day. Content for v1 must be capped at 1-2 topics per subject with a YouTube embed, not hand-written explanations. Every hour past the time-box is an hour not shipping the core product.

4. **RIASEC scoring errors destroy trust — validate the algorithm** — Use exactly 42 Likert-scale items (6 per type). Store all 6 type scores separately. Match careers by top-3 code ordered combination, not just primary type. Present 5-8 results, not 1. A student who gets wrong career matches does not come back.

5. **Province map SVG is 2-3 days of work, not 2-3 hours** — Ship the province `<select>` dropdown first. Build the SVG map only as progressive enhancement after core discovery works. Hard time-box at 4 hours; if not done, mark as v2.

6. **APS eligibility check must validate subject prerequisites, not just aggregate APS** — Career JSON schema must include `subjects_required[{subject, min_level, mandatory}]`. An "eligible" badge that ignores maths prerequisites for medicine-type careers damages credibility on first use.

7. **Supabase free tier pauses after 7 days of inactivity** — All Supabase calls must be wrapped in try/catch with graceful degradation. Add a Vercel cron job that pings Supabase daily. The app must be fully usable with Supabase completely blocked.

---

## Implications for Roadmap

Based on the dependency graph in ARCHITECTURE.md and the pitfall-to-phase mapping in PITFALLS.md, the following 7-phase structure is recommended. The architecture research already defines this order; the roadmap should follow it precisely.

### Phase 0: Foundation and Configuration
**Rationale:** Infrastructure decisions made here cannot be changed cheaply. Vercel region, PWA cache strategy, data directory structure, TypeScript schema, and AppContext all affect every subsequent phase. Building anything before this is locked in is a debt multiplier.
**Delivers:** Working Vite + React + TypeScript + Tailwind v4 project; React Router routes stubbed; `public/data/` directory structure with existing JSON migrated; `src/data/loaders.ts` with typed fetch wrappers; AppContext (dataSaverMode, province); Layout with mobile nav; `vercel.json` with `cpt1` region; PWA manifest and service worker scaffold with correct cache tiers.
**Addresses:** Mobile-responsive design (Tailwind mobile-first), data saver mode (AppContext), PWA infrastructure
**Avoids:** Pitfall 1 (Vercel region), Pitfall 2 (precache overload), Pitfall 8 (service worker update loop)

### Phase 1: Quiz Engine (RIASEC + APS)
**Rationale:** The quiz is the product entry point and has zero external data dependencies — it can be built and validated before any JSON data is complete. The state machine pattern must be established here; retrofitting later is the most expensive architectural fix possible. This phase also unblocks Phase 2 because career filtering requires RIASEC codes.
**Delivers:** Complete RIASEC quiz (42 questions, 6 type scores, Zustand persist), APS calculator (per-subject marks, aggregate APS, subject prerequisite validation), shareable `/quiz/results?r=RIC&aps=32` URL, NSFAS eligibility checker
**Addresses:** RIASEC quiz (P1), APS calculator (P1), career eligibility matching (P1), NSFAS checker (P1), WhatsApp-shareable URL structure
**Avoids:** Pitfall 6 (RIASEC normalization), Pitfall 7 (APS subject prerequisites), Anti-Pattern 2 (useState for quiz steps)
**Stack:** Zustand v5 + persist, pure TS state machine, React Router v7 URL params

### Phase 2: Data Architecture
**Rationale:** The career JSON schema must be finalised before any display layer is built. A schema change after Phase 3 means updating every career record and every component that renders them. This is the highest-leverage design decision in the project.
**Delivers:** Finalised `_master-index.json` schema (id, title, category, pathway, riasec, aps_min, subjects_required, demandLevel), validated `careers/{pathway}/{id}.json` schema with subject prerequisites, `bursaries.json` schema audit (all records have official `url`), `job-gaps.json` province demand matrix structure, TypeScript interfaces in `src/data/types.ts`
**Addresses:** Career JSON schema (required by all career features), bursary schema (P1)
**Avoids:** Pitfall 5 (monolithic careers JSON), Pitfall 7 (APS prerequisite schema), Pitfall 10 (bursary false precision), Anti-Pattern 1 (bundled JSON)

### Phase 3: Career Discovery
**Rationale:** Requires Phase 1 (RIASEC codes) and Phase 2 (validated index schema). The master index feeds the filtered career list; the career list links to career detail. This phase delivers the first complete user journey from quiz to career.
**Delivers:** Career list filtered by RIASEC codes + APS eligibility, `useCareerSearch` hook with Fuse.js, career card grid with filter UI, province dropdown filter (not SVG map — map is progressive enhancement), career comparison tool stub
**Addresses:** Career results list (P1), career discovery (P1), province filter (P2 dropdown first)
**Avoids:** Pitfall 4 (province map spiral — ship dropdown, defer SVG), Pitfall 5 (performance at 200+ records)
**Stack:** Fuse.js v7, TanStack Query v5, React Router v7 URL params for filters

### Phase 4: Career Detail and Bursary Finder
**Rationale:** Career detail depends on the career index (Phase 3) for navigation links. Bursary finder can be built in parallel but is grouped here because career detail cross-references bursary data. This phase completes the core discovery loop.
**Delivers:** Full career detail page (overview, matric requirements, APS eligibility check with subject prerequisites, university and TVET pathways, salary, bursary cross-reference, WhatsApp share button), bursary list with field + province filter, NSFAS checker UI
**Addresses:** Career detail page (P1), TVET pathways (P1), bursary listing + basic filter (P1), WhatsApp share (P1)
**Avoids:** Pitfall 10 (bursary "potentially eligible" copy, not "eligible"), Pitfall 11 (WhatsApp URL under 200 chars), Anti-Pattern 5 (duplicate bursary fetches via centralised `useBursaries()`)
**Stack:** TanStack Query v5, react-helmet-async (OG tags), WhatsApp deep link, module-level fetch cache

### Phase 5: Study Library (Parallel Track)
**Rationale:** The study library has no dependency on career phases — it can be built in parallel from Phase 3 onwards. It is grouped here rather than earlier because content creation is the bottleneck and should follow, not precede, the core discovery loop being validated. HARD CONSTRAINT: 4-hour time-box on content creation for v1.
**Delivers:** Subject navigation grid, grade selector, topic viewer (explanation + YouTube embed + practice questions), `useSubjectContent` lazy fetch hook, data saver mode compliance (YouTube embeds skipped), 1-2 topics per subject as proof-of-concept skeleton
**Addresses:** Study library first 2-3 subjects (P2)
**Avoids:** Pitfall 3 (study content rabbit hole — 4-hour content budget, viewer architecture built separately from content)
**Stack:** TanStack Query v5 lazy fetching, conditional YouTube iframe (dataSaverMode check)

### Phase 6: PWA, Polish, and Deploy
**Rationale:** PWA service worker and Supabase analytics are correctness concerns, not feature concerns. They must be finalised after all features are stable so the precache manifest is correct and the analytics schema matches what the app actually emits.
**Delivers:** Workbox service worker (tiered caching, `skipWaiting()`, versioned cache names, update notification UI), Supabase anonymous analytics (quiz_events table, fire-and-forget), optional auth + saved results (dynamically imported Supabase SDK), offline banners, error boundaries, data saver auto-detect (`navigator.connection.effectiveType`), Vercel deploy with `cpt1` region verified, rollup-plugin-visualizer bundle size audit
**Addresses:** PWA / offline support (P2), optional Supabase auth (P3 scope, MVP subset), data saver polish
**Avoids:** Pitfall 2 (precache strategy verification), Pitfall 8 (service worker update loop), Pitfall 9 (Supabase free tier pause — keep-alive cron), Pitfall 1 (Vercel region final verification)
**Stack:** vite-plugin-pwa 1.x + Workbox, Supabase JS v2 (dynamic import), workbox-window for update UI

### Phase Ordering Rationale

- **Data architecture before display (Phases 2 before 3-4):** Schema changes after UI is built are the most expensive rework. The architecture research is unambiguous on this ordering.
- **Quiz before career discovery (Phase 1 before Phase 3):** Career filtering requires RIASEC codes as input. This is a hard dependency.
- **Province dropdown before province map (within Phase 3):** The map is a scope trap that can consume an entire sprint. The dropdown delivers the same functional value in 2 hours vs. 2 days for the SVG map.
- **Study library as parallel track (Phase 5):** It has no dependencies on career phases, so it blocks nothing and can be time-boxed independently without delaying the core loop.
- **PWA last (Phase 6):** Service worker precache manifest must be generated from a stable build. Building it earlier means re-generating it every time routes or data files change.
- **Supabase deferred to Phase 6:** Keeping Supabase out of the critical path for five phases proves the "enhancement, not dependency" architecture holds. This is also the pitfall mitigation for free tier pauses and connection failures.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Data Architecture):** The existing career JSON schemas in the repo (confirmed via ARCHITECTURE.md sources) may need schema migration for `subjects_required[]` arrays. Audit actual records before estimating data migration effort.
- **Phase 5 (Study Library):** Content sourcing strategy (Khan Academy embed rights, OpenStax licensing, CAPS alignment) was not researched in depth. Verify before building content structure.
- **Phase 6 (Supabase analytics schema):** Supabase free tier 500MB limit and current pause behavior should be verified against live pricing page before implementing analytics at scale.

Phases with standard patterns (skip research-phase):
- **Phase 0 (Foundation):** Vite + React + Tailwind v4 + React Router setup is a well-documented, stable pattern. Stack versions are npm-verified.
- **Phase 1 (Quiz Engine):** RIASEC quiz state machine + Zustand persist is a standard pattern with high-confidence documentation in STACK.md and ARCHITECTURE.md.
- **Phase 3 (Career Discovery):** Index-first data loading + Fuse.js client search is a well-documented pattern. Architecture research includes working code examples.
- **Phase 4 (Career Detail + Bursary):** React Router dynamic routes + TanStack Query per-item fetch is standard. WhatsApp URL pattern is fully specified.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core versions verified against npm registry. Tailwind v4, React Router v7, vite-plugin-pwa v1.x compatibility confirmed. `cpt1` Vercel region confirmed against live docs. |
| Features | MEDIUM | SA educational context (APS, NSC, NSFAS, TVET) is MEDIUM-HIGH confidence from domain knowledge. Competitor feature analysis is LOW confidence — based on training data from mid-2025, may be outdated. Core feature set derived from PROJECT.md is solid. |
| Architecture | HIGH | Derived from existing data schemas in the repo (confirmed by git history in ARCHITECTURE.md sources) and established React/Vite/Supabase patterns. Build order dependency graph is logically sound. |
| Pitfalls | MEDIUM-HIGH | Vercel region default and MDN service worker behavior verified. Supabase free tier pause behavior is from training data (Aug 2025 cutoff) — verify current limits before Phase 6. SA data cost figures are approximate. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Competitor feature verification:** The competitor analysis (Yenza, Gradesmatch, NCAP, Reslocate features) is LOW confidence and based on training data. Before using for competitive positioning, verify against live sites.
- **NSFAS income threshold:** R350,000 household income figure should be verified against the current NSFAS website before building the eligibility checker, as thresholds change annually.
- **Study library content licensing:** Khan Academy embeds and OpenStax content licensing for SA curriculum (CAPS) alignment needs verification. Do not build content structure assuming free embed rights.
- **Supabase free tier current limits:** 500MB database limit and 7-day pause behavior should be verified at supabase.com/pricing — limits may have changed since training data cutoff (Aug 2025).
- **vite-plugin-pwa `generateSW` vs `injectManifest` tradeoffs:** STACK.md flags this as LOW confidence. Validate with the vite-plugin-pwa documentation before Phase 6 implementation.

---

## Sources

### Primary (HIGH confidence)
- npm registry — version verification for all core packages (React, Vite, Tailwind, React Router, Zustand, TanStack Query, vite-plugin-pwa, Fuse.js, Supabase JS, lucide-react, workbox-window)
- https://vercel.com/docs/edge-network/regions — `cpt1` Cape Town region confirmed
- https://vercel.com/docs/functions/configuring-functions/region — `iad1` default confirmed
- https://tailwindcss.com/docs/installation — Tailwind v4 Vite plugin installation confirmed
- https://reactrouter.com/start/library/installation — React Router 7.13.2 library mode confirmed
- Existing project schemas (git history, ARCHITECTURE.md) — `_master-index.json` (161 careers), `bursaries.json` (245 entries) structures confirmed

### Secondary (MEDIUM confidence)
- MDN: Offline and background operation guide — service worker timeout limits and update lifecycle
- MDN: Storage quotas and eviction criteria — Chrome 60% disk limit for PWA cache
- PROJECT.md (primary specification) — SA-specific constraints, timeline, audience
- Training knowledge: SA educational context (APS, NSC, NSFAS, NQF, TVET) — MEDIUM confidence, key thresholds (NSFAS R350K) need annual verification

### Tertiary (LOW confidence)
- Training knowledge: Yenza, Gradesmatch, NCAP, Reslocate feature sets — may be outdated, verify against live sites
- Training knowledge: SA mobile data pricing (R149-R349/GB prepaid) — approximate, verify against current operator pricing
- Training knowledge: vite-plugin-pwa `generateSW` vs `injectManifest` tradeoffs — flag for Phase 6 validation

---
*Research completed: 2026-03-25*
*Ready for roadmap: yes*
