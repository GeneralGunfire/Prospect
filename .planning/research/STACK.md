# Stack Research

**Domain:** Career guidance / edtech PWA — South Africa
**Researched:** 2026-03-25
**Confidence:** HIGH (core versions verified via npm registry and official docs)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI framework | Industry standard, concurrent features in v19 improve perceived performance; vast ecosystem; PWA patterns well-documented |
| Vite | 8.0.2 | Build tool + dev server | Fastest HMR; native ESM; produces the smallest, tree-shaken bundles for Rollup-based output; no Webpack overhead |
| Tailwind CSS v4 | 4.2.2 | Utility-first CSS | v4 uses a Vite plugin (not PostCSS config); CSS-first config; ~35% smaller compiled CSS than v3; zero JS runtime |
| React Router | 7.13.2 | Client-side routing | Library mode (not framework mode) keeps bundle lean; nested routes enable per-route code splitting; industry-standard API |
| Zustand | 5.0.12 | Global state (quiz, APS, filters) | ~1KB; no boilerplate; `persist` middleware stores quiz state in localStorage with zero extra deps; survives page reload |
| Supabase JS | 2.100.0 | Optional auth + anonymous analytics | Isomorphic SDK; `signInAnonymously()` for analytics without forced login; row-level security built in; free tier sufficient |
| vite-plugin-pwa | 1.2.0 | PWA manifest + service worker | Workbox-powered; `generateSW` mode handles precaching of static JSON data; auto-updates; works with Vite 8 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| workbox-window | 7.4.0 | Service worker lifecycle control | Register SW, show "Update available" prompt, handle offline fallback UI |
| @vite-pwa/assets-generator | 1.0.2 | Generate PWA icons from single source | Run once at project setup; generates all required icon sizes for manifest |
| idb | 8.0.3 | IndexedDB wrapper | Cache quiz state and viewed career data offline; used by service worker for runtime caching of JSON files |
| @supabase/supabase-js | 2.100.0 | Auth + analytics backend | Only initialised if user opts in (auth) or on quiz completion (anonymous analytics event) |
| Fuse.js | 7.1.0 | Client-side fuzzy search | Career search, bursary search — no server round-trip; works offline; ~24KB; good enough for 200–500 records |
| lucide-react | 1.6.0 | Icon set | Tree-shakeable SVG icons; ~1–2KB per icon imported; no webfont dependency (critical for data saver mode) |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Conditional className composition | Combine for `cn()` utility; prevents Tailwind class conflicts in reusable components |
| react-helmet-async | 3.0.0 | `<head>` management per route | OG tags for WhatsApp link previews; per-career page title/description for sharing |
| @tanstack/react-query | 5.95.2 | Async data fetching + caching | Lazy-load JSON chunks (bursaries, subject content) only when route visited; stale-while-revalidate; devtools included |
| rollup-plugin-visualizer | 7.0.1 | Bundle size analysis | Use in CI or locally to enforce ≤50KB initial chunk; outputs treemap HTML |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vite 8 | Build + HMR | `vite build --mode production` outputs hashed chunks ready for Vercel CDN |
| @tailwindcss/vite | 4.2.2 | Tailwind v4 Vite plugin | Replaces `postcss.config.js`; import with `@import "tailwindcss"` in CSS entry |
| Vercel CLI | latest | Deploy + preview | `vercel --region cpt1` pins serverless functions to Cape Town; static assets served from CDN globally |
| ESLint + eslint-plugin-react-hooks | — | Lint | Catches stale closure bugs in quiz/APS state |
| Vitest | — | Unit tests | Same Vite config; test APS calculator logic, RIASEC scoring algorithm |

---

## Installation

```bash
# Create project
npm create vite@latest sa-career-guide -- --template react-ts
cd sa-career-guide

# Core UI
npm install tailwindcss @tailwindcss/vite react-router

# State management
npm install zustand @supabase/supabase-js

# PWA
npm install vite-plugin-pwa workbox-window

# Data / search / caching
npm install @tanstack/react-query idb fuse.js

# UI utilities
npm install lucide-react clsx tailwind-merge react-helmet-async

# Dev dependencies
npm install -D rollup-plugin-visualizer @vite-pwa/assets-generator vitest
```

---

## SA-Specific Considerations

### Data Saver Mode (≤50KB Initial Load)

The 50KB initial load constraint is the single most important architectural constraint for SA users on prepaid data. Key measures:

1. **Route-based code splitting** — React Router v7 + dynamic `import()` gives each route its own chunk. The shell (App + Router + nav) targets ≤20KB gzipped.
2. **JSON data never in the initial bundle** — All career, bursary, and study content JSON is lazy-loaded via `@tanstack/react-query` only when the relevant route mounts.
3. **Tailwind v4** — No runtime JS; compiled CSS is purged to only used classes. Expected: ≤10KB gzipped for the stylesheet.
4. **Icon tree-shaking** — Import only what is used: `import { Search } from 'lucide-react'`, not the full icon set.
5. **rollup-plugin-visualizer** — Add to `vite.config.ts` and inspect the treemap before every release. Fail the build if initial chunk exceeds threshold.
6. **No large map library in initial chunk** — The province map SVG is a route-gated lazy import (see Architecture section on map choice below).

### Mobile-First, Low-RAM Devices

- Avoid virtual list libraries for 200-career lists — simple windowed pagination (slice + page state) is lighter and simpler.
- Avoid animation libraries (Framer Motion ~50KB) — use Tailwind's `transition-` utilities only.
- Avoid heavy chart libraries (Chart.js, Recharts ~170KB) — for job demand heatmaps, use an inline SVG province map with colour fills (see Map section below).

### WhatsApp URL Sharing

WhatsApp previews link cards using OpenGraph meta tags. Requirements:
- `react-helmet-async` injects `og:title`, `og:description`, `og:image` per career page.
- Career page URLs must be human-readable (`/career/software-engineer`, not `/career/123`) for visible trust in WhatsApp chat.
- OG image: a static 1200×630 PNG per category (not per career) stored on Vercel CDN — avoids dynamic image generation overhead.
- `og:url` must include `https://` — Vercel cpt1 handles this automatically.

### Vercel Cape Town Deployment

- Region code: `cpt1` (af-south-1, Cape Town) — confirmed in Vercel region list.
- Set in `vercel.json`:
  ```json
  {
    "regions": ["cpt1"]
  }
  ```
- Static assets (JSON, images, icons) are served from Vercel's global CDN (126 PoPs), so static file latency is low regardless of region. The `cpt1` pin matters for Vercel Serverless Functions (Supabase auth calls, analytics writes).
- For a primarily-static PWA, the CDN covers most SA users adequately even if they're not in Cape Town.

---

## Map: SA Province SVG

The interactive province map is a deliberate stack decision because library choices differ significantly in bundle cost.

**Recommended: Inline SVG with React event handlers**

Use a hand-crafted or sourced SVG of SA's 9 provinces. Attach React `onClick` / `onMouseEnter` handlers directly to `<path>` elements. Fill colours via Tailwind or inline style based on heatmap data.

- Bundle cost: ~15–25KB for the SVG itself (province paths); zero library dependency.
- Full offline support — SVG is part of the JS bundle or statically imported.
- Full control over styling, tooltips, accessibility labels.
- Source: `@amcharts/amcharts5-geodata` has SA province SVG paths (MIT licensed portion) or use simplemaps.com free tier; alternatively a custom minimal SVG is ~8KB.

**Avoid:** `react-leaflet` (depends on Leaflet.js ~150KB + CSS + tile images — requires network, incompatible with data saver mode). `d3-geo` is powerful but adds ~70KB for projection math not needed for a fixed SVG map.

---

## RIASEC Quiz: State Management Pattern

```
Store: Zustand (quizStore)
  - answers: Record<questionId, 'R'|'I'|'A'|'S'|'E'|'C'>
  - currentQuestion: number
  - scores: { R: number, I: number, A: number, S: number, E: number, C: number }
  - persist: localStorage (survives refresh, page navigation)

Scoring: Pure function, runs client-side on quiz completion
Input: answers map
Output: sorted RIASEC scores → career match array filtered from static JSON
```

Zustand `persist` middleware with `localStorage` means:
- Quiz progress survives accidental navigation (critical on mobile).
- Results page can be shared via URL param (`/results?code=IAS`) for WhatsApp sharing without Supabase auth.
- No server round-trip for quiz logic.

---

## APS Calculator: State Management Pattern

```
Store: Zustand (apsStore)
  - subjects: Record<subjectId, { mark: number, level: number }>
  - aps: number (derived, recomputed on each mark change)
  - persist: localStorage

Logic: Pure function
Input: mark per subject (0–100)
Output: APS score (7-point scale per subject) + total
```

APS calculation is entirely client-side. No library needed — a pure TypeScript function of ~20 lines. Store in `lib/aps.ts`, test with Vitest.

---

## Supabase Auth: Optional Login Pattern

```
Pattern: Anonymous-first
1. App loads → no Supabase call
2. User completes quiz → write anonymous event to analytics table (no auth required, RLS allows anon inserts)
3. User clicks "Save my results" → Supabase signInWithOtp (email magic link) or signInWithOAuth (Google)
4. On sign-in → upsert saved results row linked to user ID
```

Key config:
- Enable "Anonymous sign-ins" in Supabase dashboard (GA since 2024).
- Use `supabase.auth.signInAnonymously()` for analytics — this gives a stable UUID per browser session without email.
- RLS policy: `analytics` table accepts inserts from `anon` role; `saved_results` table requires authenticated user.
- Never import `@supabase/supabase-js` in the critical path — dynamic import it only when auth flow begins.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Build tool | Vite 8 | Next.js 15 | Next.js SSR/RSC overhead unnecessary for a static-data PWA; adds ~60KB runtime; forces Node server |
| CSS | Tailwind CSS v4 | Tailwind CSS v3 | v3 requires PostCSS config; v4 is leaner and uses Vite plugin — simpler setup |
| CSS | Tailwind CSS v4 | CSS Modules | Tailwind is faster to prototype; no context switching; v4's JIT purging keeps output small |
| State | Zustand | Redux Toolkit | RTK is ~15KB heavier; boilerplate overhead unacceptable for 7-day timeline |
| State | Zustand | Jotai | Both valid; Zustand's `persist` middleware is simpler for localStorage quiz state; Jotai better for fine-grained atom updates |
| State | Zustand | React Context + useReducer | Causes full subtree re-renders; no built-in persistence; insufficient for quiz state |
| Routing | React Router v7 | TanStack Router | TanStack Router has excellent type-safety but is heavier and overkill for this app's routing needs |
| Search | Fuse.js | Algolia | Algolia requires network, account, and costs money; Fuse.js is offline-capable and free |
| Search | Fuse.js | Lunr.js | Lunr.js index is pre-built and larger; Fuse.js is simpler for 200-record datasets |
| Map | Inline SVG | react-leaflet | Leaflet requires tile images (network-dependent), ~150KB JS, incompatible with offline/data-saver goals |
| Map | Inline SVG | d3-geo | d3-geo adds ~70KB for projection math not needed for a fixed choropleth map |
| Icons | lucide-react | react-icons | react-icons includes multiple icon families — tree-shaking is unreliable; larger footprint |
| Icons | lucide-react | Font Awesome | Webfont-based — adds network round-trip; render-blocking; worst choice for data-saver mode |
| Analytics | Supabase | Vercel Analytics | Vercel Analytics is good for page views but cannot store custom quiz events; Supabase gives structured event storage |
| PWA | vite-plugin-pwa | Manual service worker | Manual SW requires deep Workbox knowledge; vite-plugin-pwa handles precaching, update lifecycle, and manifest generation |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js | SSR runtime unnecessary; forces Vercel Function for every page; adds ~60KB JS runtime; complicates PWA offline | Vite + React Router (SPA mode) |
| Framer Motion | ~50KB gzipped; pure luxury for data-saver users; CSS transitions are sufficient | Tailwind `transition-` + `animate-` utilities |
| Chart.js / Recharts | ~120–170KB; used for one heatmap screen; overkill | Inline SVG province map with CSS colour fills |
| react-leaflet / Leaflet | Requires tile map downloads; ~150KB JS; no offline without complex tile caching | Inline SVG with React event handlers |
| MUI / Ant Design / Chakra | ~100–300KB component libraries; Tailwind v4 makes them redundant; style conflicts | Tailwind v4 + headless components where needed |
| Firebase | No Cape Town region; pricing unpredictable; Supabase is already chosen and is a better fit | Supabase |
| SWR | Overlaps with TanStack Query; TanStack Query has better devtools, mutation support, and prefetch API | @tanstack/react-query |
| React Query v3 | End of life; use v5 (TanStack Query v5) | @tanstack/react-query v5 |
| Tailwind CSS v3 | v4 is the current release; PostCSS config required in v3 is eliminated in v4 | Tailwind CSS v4 with @tailwindcss/vite |
| Create React App (CRA) | Unmaintained; Webpack-based; no code splitting without ejecting | Vite |
| Redux / Redux Toolkit | 15KB overhead; 7-day timeline can't absorb boilerplate; Zustand is sufficient | Zustand |
| Prisma / Drizzle | No server-side ORM needed — Supabase client talks directly to Postgres via REST/RPC | @supabase/supabase-js |

---

## Stack Patterns by Variant

**If offline is more important than fresh data (school with no WiFi):**
- Enable Workbox `NetworkFirst` for JSON data requests with 3s timeout, then fall back to cache.
- Pre-cache the top 20 most-popular careers (known at build time) using `generateSW` with `additionalManifestEntries`.
- Store last-viewed career in IndexedDB (via `idb`) for instant offline access.

**If user is in data saver mode (user preference or network detection):**
- Detect via `navigator.connection.saveData === true` or `connection.effectiveType === '2g'`.
- Skip loading province map component entirely (`if (saveData) return <TextProvinceList />`).
- Defer Supabase analytics write to next session when on WiFi.
- Use `<img loading="lazy">` with blur-up placeholder for any career imagery.

**If user opts into saving results (Supabase auth):**
- Dynamically import `@supabase/supabase-js` at the moment auth modal opens.
- Use Supabase magic link (email OTP) as primary auth — no Google/Apple account required (important for students without these accounts).
- Store: RIASEC code, APS score, subject marks, saved careers — all in one user row.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| vite-plugin-pwa 1.2.0 | Vite 8.x | v1.x of the plugin required for Vite 8 compatibility; do not use v0.x |
| @tailwindcss/vite 4.2.2 | Vite 8.x, Tailwind 4.2.2 | Must match Tailwind version exactly — both are in the `tailwindcss` monorepo |
| React 19.2.4 | React Router 7.x | React Router 7 supports React 18 and 19; use React 19 for concurrent features |
| @tanstack/react-query 5.95.2 | React 18+ | Requires React 18 or 19; v4 API is incompatible — do not mix |
| Zustand 5.0.12 | React 18+ | Zustand v5 drops legacy `subscribeWithSelector` import path — use `zustand/middleware` |
| @supabase/supabase-js 2.100.0 | Node 18+ / browser | v2 is stable long-term; v3 not yet released as of this research |
| workbox-window 7.4.0 | vite-plugin-pwa 1.x | Workbox 7.x is the version bundled by vite-plugin-pwa 1.x; do not separately install Workbox 6.x |

---

## Sources

- npm registry — version verification for: `vite`, `react`, `react-router`, `tailwindcss`, `@tailwindcss/vite`, `zustand`, `@supabase/supabase-js`, `vite-plugin-pwa`, `workbox-window`, `idb`, `fuse.js`, `lucide-react`, `clsx`, `tailwind-merge`, `react-helmet-async`, `@tanstack/react-query`, `rollup-plugin-visualizer` — HIGH confidence (live registry)
- https://tailwindcss.com/docs/installation — Tailwind v4 installation with Vite plugin confirmed — HIGH confidence
- https://reactrouter.com/start/library/installation — React Router 7.13.2 library mode confirmed — HIGH confidence
- https://vercel.com/docs/edge-network/regions — `cpt1` (Cape Town, af-south-1) region confirmed — HIGH confidence
- Training knowledge (verified against npm versions) — Zustand persist middleware, Supabase anonymous auth, Workbox strategies, PWA manifest requirements — MEDIUM confidence (versions verified, API patterns from training)
- Training knowledge (unverified via external source) — vite-plugin-pwa `generateSW` vs `injectManifest` tradeoffs, IndexedDB offline caching patterns — LOW confidence, flag for phase-specific validation

---

*Stack research for: SA Career Guide — React + Tailwind + Supabase PWA*
*Researched: 2026-03-25*
