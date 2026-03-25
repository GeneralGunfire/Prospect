# Pitfalls Research

**Domain:** Career guidance / edtech web app (SA-specific, 7-day solo build)
**Researched:** 2026-03-25
**Confidence:** MEDIUM-HIGH (Vercel + MDN verified; Supabase from training data + known docs patterns)

---

## Critical Pitfalls

### Pitfall 1: Vercel Functions Default to Washington DC, Not Cape Town

**Severity:** HIGH — every Supabase call adds 200-300ms unnecessary latency for SA users if not addressed.

**What goes wrong:**
Vercel Functions default to `iad1` (Washington DC) for ALL new projects — even if the project's CDN PoP serves from Cape Town. This means any serverless API calls (Supabase auth, analytics writes) route through the US before hitting the Supabase instance, adding 200-300ms of cross-Atlantic latency on every request.

**Why it happens:**
Vercel's documentation states: "Vercel Functions default to running in the Washington, D.C., USA (iad1) region for all new projects." Developers assume CDN region = function region. They are separate concerns. Static assets use the closest CDN PoP; functions execute in the configured compute region.

**How to avoid:**
Add to `vercel.json` before first deployment:
```json
{
  "regions": ["cpt1"]
}
```
Also ensure the Supabase project is provisioned in the `af-south-1` region (Cape Town) for co-location. Function region and database region must match.

**Warning signs:**
- Supabase auth calls taking 400ms+ in production from SA
- No `vercel.json` in root of project
- Dashboard project settings showing `iad1` as function region

**Phase to address:** Phase 1 (project scaffold) — set this before writing any code.

---

### Pitfall 2: Precaching All JSON at PWA Install Destroys Data-Saver Goal

**Severity:** HIGH — directly contradicts the ≤50KB initial load requirement.

**What goes wrong:**
Developers reach for "cache everything at install" as the obvious offline strategy. With 200+ career records, 245 bursaries, 13 subjects × 3 grades of study content, and university/TVET indexes, precaching all static JSON at service worker install time would push the first-visit download to 3-10MB. This is catastrophic for users on prepaid data (SA average prepaid data cost is among the highest globally as a percentage of income).

**Why it happens:**
PWA tutorials use precaching because it's simple. `vite-plugin-pwa` with Workbox makes it easy to glob `public/data/**/*.json` into the precache manifest — and then every JSON file downloads on install. The ≤50KB constraint is forgotten under deadline pressure.

**How to avoid:**
Use a tiered caching strategy:
- **Precache only:** App shell (HTML, CSS, JS bundles) — target <50KB
- **Cache-on-demand (Cache-First):** Individual career/bursary JSON files when first accessed by the user
- **Network-First:** Supabase API calls (auth state, analytics writes)
- **Never precache:** Full careers index, all bursaries, all study content

Implement `navigator.storage.estimate()` guard: if quota < 50MB, skip runtime caching of large JSON files.

**Warning signs:**
- Lighthouse shows "Precache manifest" with >20 entries
- Service worker install size exceeds 500KB
- `vite-plugin-pwa` config includes a glob for the entire `public/data/` directory

**Phase to address:** Phase 1 (PWA scaffold) — set caching strategy before adding any data files.

---

### Pitfall 3: Study Content Generation Becomes an Infinite Rabbit Hole

**Severity:** HIGH — this single feature can consume days 4-7 entirely if not scope-capped.

**What goes wrong:**
13 subjects × 3 grades = 39 subject-grade combinations. Each combination needs topics, explanations, worked examples, practice questions, and YouTube links. If each topic requires 30-60 minutes of content curation, the math is brutal: 39 combinations × 5 topics average × 45 minutes = 146 hours of content work. The app never ships.

**Why it happens:**
"Grade 10-12 study library" sounds like a feature, not a project. Each topic feels incomplete without examples. Examples need practice questions. Practice questions need answer keys. The scope expands unboundedly because there is always "one more thing" to add.

**How to avoid:**
- **Cap strictly at MVP skeleton:** 1-2 topics per subject per grade with 1 worked example and 3 practice questions each. Stub the rest with "Coming soon" placeholders.
- **Time-box content generation to 4 hours maximum** across the entire study library for v1.
- **Separate data from feature:** build the study viewer component first with one subject as proof-of-concept, then add content incrementally post-launch.
- **Use YouTube embeds** instead of writing explanations — link to verified Khan Academy SA / OpenStax videos.

**Warning signs:**
- Day 3 and you are still writing study content
- A single subject has >5 topics in the JSON
- You are writing worked examples from scratch instead of curating links

**Phase to address:** Phase 2 (data scaffold) — stub structure before building viewer. Phase 4 (study library) — hard time budget.

---

### Pitfall 4: Province Map SVG Complexity Spiral

**Severity:** HIGH — interactive SVG maps are deceptively complex and kill solo build timelines.

**What goes wrong:**
An interactive SA province map sounds like a weekend project. In reality: sourcing a legally usable SVG with correct province boundaries, making it responsive, adding hover/click states, connecting it to filtered data, handling mobile touch events, and making it accessible (screen reader province names, keyboard navigation) takes 2-3 full days. The map becomes the centerpiece that blocks everything else.

**Why it happens:**
Maps feel like a one-file addition ("just drop in an SVG"). But province click → filtered careers/colleges/bursaries requires a data join layer, loading states, and URL state management. Mobile rendering of SVGs at small viewports requires separate handling. Many free SA SVG maps have topology errors or missing island territories.

**How to avoid:**
- **Use a pre-built React component** for SA maps (e.g. `react-south-africa-map` or `react-simple-maps` with a pre-validated SA TopoJSON from Stats SA).
- **Degrade to a province dropdown** for the MVP: `<select>` with 9 provinces triggers the same filter as clicking the map. Build the map as progressive enhancement.
- **Do not make the map an entry point** — it's a secondary discovery surface. Users arrive via RIASEC or APS, not via province.
- **Timebox map feature to 4 hours.** If not done in 4 hours, ship the dropdown, mark map as v2.

**Warning signs:**
- You are debugging SVG viewBox issues on day 2
- The map is the first feature you built
- Province click requires a complex data join you haven't designed yet

**Phase to address:** Phase 3 (career discovery) — treat map as enhancement, not foundation.

---

### Pitfall 5: Loading All Career JSON at App Start Causes Filter Lag

**Severity:** HIGH — with 200+ careers, naive approaches produce perceptible lag on mid-range Android.

**What goes wrong:**
`fetch('/data/careers/all-careers.json')` at app startup loads a file that will grow to 500KB-2MB as career records fill out. Parsing 200+ complex JSON objects on the main thread, then filtering/sorting them on every keystroke, produces 200-400ms lag on a mid-range Android device (Snapdragon 680 class — common in SA).

**Why it happens:**
During development on a MacBook Pro, filtering 200 objects is instant. The developer never notices the problem until testing on actual hardware. JSON parse cost is invisible in dev tools because the dataset is small during development.

**How to avoid:**
- **Never load all careers in one monolithic JSON file.** Use an index file (`careers-index.json`) with only: `id`, `title`, `category`, `riasec_codes`, `aps_min`, `subjects_required[]` — the fields needed for filtering. Keep full career details in per-career files loaded on demand.
- **Index file target:** <30KB for 200 careers (150 bytes per entry average).
- **Client-side search:** Use `fuse.js` with the index only, not full career objects.
- **Pre-build filter indexes:** Generate a separate `riasec-index.json` keyed by RIASEC code during build, so filtering is O(1) lookup not O(n) scan.

**Warning signs:**
- A single `careers.json` file exists with all career data
- Filter results take >200ms on first invocation
- The career index file exceeds 100KB

**Phase to address:** Phase 2 (data architecture) — establish index/detail split before building any UI.

---

### Pitfall 6: RIASEC Score Normalization Produces Nonsensical Matches

**Severity:** HIGH — bad matches destroy trust. A student gets "Marine Biologist" when they answered "I like fixing engines."

**What goes wrong:**
RIASEC quizzes are deceptively simple to implement wrong. Common mistakes:
1. **Raw score matching:** Taking the top-scoring type and matching careers that have that type anywhere. This produces careers matched on a secondary or tertiary type that the student scored low on.
2. **Three-letter code ordering:** Holland's model requires matching the THREE highest-scoring types in ranked order. "RIA" and "AIR" are different career clusters and must not be treated as equivalent.
3. **Insufficient questions:** Fewer than 42 questions (6 per type) produces statistically unreliable type differentiation — students get tied scores between adjacent types.
4. **Forced-choice vs. Likert confusion:** Forced-choice (A or B) and Likert scale (1-5 agreement) produce different score distributions. Mixing item formats breaks the score comparability.

**How to avoid:**
- Use exactly 42 Likert-scale items (6 per RIASEC type), adapted from validated instruments in the public domain (Holland's SDS items are widely documented).
- Compute all 6 type scores. Match careers by their Holland code (primary + secondary type minimum match, not just primary).
- Present top 5-8 career matches, not top 1, to account for borderline scores.
- Allow the student to re-take the quiz without penalty (no login barrier).
- Store raw scores per type in localStorage so the recommendation page can re-render without network.

**Warning signs:**
- Quiz has fewer than 36 questions
- Matching logic uses only the single highest-scoring RIASEC type
- Career records only have one RIASEC code in the data schema

**Phase to address:** Phase 3 (career discovery) — quiz logic must be validated before career matching is built.

---

### Pitfall 7: APS Calculator Ignores Subject-Specific Requirements

**Severity:** HIGH — an APS score that passes the general cutoff but fails subject prerequisites causes false positives that damage credibility.

**What goes wrong:**
APS (Admission Point Score) calculators often implement only the aggregate score. A student calculates APS=32 and sees "eligible for Medicine." In reality, Medicine requires Mathematics (not Mathematical Literacy) at 70%+, Physical Science at 60%+, and English at 50%+. The aggregate APS check is necessary but not sufficient. Students follow recommendations into careers they cannot access.

**Why it happens:**
The APS aggregate calculation is simple (7-point scale conversion × number of subjects). The subject-specific prerequisite check requires per-career subject requirements in the data schema and per-student subject-grade mapping — a harder data join that's easy to skip.

**How to avoid:**
- Career JSON schema must include `subjects_required: [{ subject: "Mathematics", min_level: 5, mandatory: true }]` — not just `aps_min`.
- APS calculator collects subject + level per subject (not just overall average).
- Eligibility check runs TWO validations: aggregate APS >= minimum AND all mandatory subjects met.
- Display red "subject prerequisite not met" flags specifically, not just a green/red overall pass.

**Warning signs:**
- Career JSON only has an `aps_min` field with no subject requirements
- APS calculator collects total marks without per-subject breakdown
- Eligibility shows "Eligible" without checking subject prerequisites

**Phase to address:** Phase 2 (data architecture) — schema must include subject prerequisites. Phase 3 (calculator) — validation logic.

---

### Pitfall 8: Service Worker Update Loop Breaks After Deployment

**Severity:** MEDIUM-HIGH — users get stale data or a broken app after you push a fix.

**What goes wrong:**
When you deploy an update, the new service worker enters "waiting" state and does NOT activate until all tabs running the old service worker are closed. On mobile, users rarely close tabs. This means:
- Users run the old service worker for days after deployment
- A data fix you push doesn't reach users
- In the worst case, a broken service worker is cached and the app is unusable until the user manually clears site data

**Why it happens:**
The browser's service worker lifecycle is designed for stability but the default behavior is unintuitive. `skipWaiting()` fixes the activation delay but can cause race conditions if the new SW and old SW serve different cached assets simultaneously.

**How to avoid:**
- Use `skipWaiting()` + `clients.claim()` in the service worker install event. This aggressively activates the new SW.
- Add an update notification UI: "New version available — tap to refresh." This respects user agency.
- Version the cache name (e.g. `cache-v1`, `cache-v2`) and delete old caches in the activate event.
- Test the update flow explicitly: build → deploy → build again → deploy → verify new content appears.

**Warning signs:**
- No `skipWaiting()` in service worker
- Cache names are not versioned
- You have never tested the "deploy an update" flow end-to-end

**Phase to address:** Phase 1 (PWA scaffold) — build update flow before first real deployment.

---

### Pitfall 9: Supabase Free Tier Pauses After 1 Week of Inactivity

**Severity:** MEDIUM — the database pauses if not accessed for 7 days on the free plan, causing cold-start failures.

**What goes wrong:**
Supabase free tier projects pause automatically after 7 days of inactivity. When a paused project receives a request, it takes 30-60 seconds to resume. For a student who opens the app after a week of no traffic, their first auth or analytics write fails with a timeout error.

**Why it happens:**
This is a documented Supabase free tier behavior. Developers test during active development (no pauses) and discover the problem only after launch when traffic drops on weekends.

**How to avoid:**
- **Architecture choice:** Keep Supabase out of the critical path. Core feature (career discovery, quiz, study library) must work without any Supabase call. Supabase is only for: optional auth saves + anonymous analytics.
- **Analytics writes:** Queue analytics events in localStorage, batch-write to Supabase when online. If write fails, retry silently — don't block the user.
- **Keep-alive strategy:** A scheduled Vercel cron (free tier: 2 crons) that pings Supabase daily prevents auto-pause.
- **Error handling:** All Supabase calls must be wrapped in try/catch with graceful degradation. Never show a loading spinner that can hang indefinitely.

**Warning signs:**
- App shows blank screen or loading spinner when Supabase is slow to respond
- Career pages require a Supabase call to render
- No localStorage fallback for analytics queue

**Phase to address:** Phase 1 (architecture decisions) — establish "Supabase is enhancement, not dependency" rule.

---

### Pitfall 10: Bursary Eligibility Filter Creates False Precision

**Severity:** MEDIUM — showing "eligible" for a bursary the student cannot actually get damages credibility.

**What goes wrong:**
Bursary eligibility checkers typically filter by: field of study, income bracket, race (some bursaries are historically targeted), province, academic performance. Implementing all these filters requires detailed data per bursary AND requires collecting detailed personal data from the user. Without the data, filters show false positives. With the data collection, it becomes a registration form — killing the no-login value proposition.

**Why it happens:**
Developers build the filter UI before auditing whether the data schema supports accurate filtering. They add "filter by eligibility" to the UI, but the bursary data only has `field` and `amount` — not income thresholds or province restrictions.

**How to avoid:**
- **MVP filter set:** field of study + province only (provably correct with available data).
- **Never show "eligible" — show "potentially eligible."** Explicit copy: "This bursary may apply to you — verify at [bursary URL]."
- **Always show the official bursary URL.** The authoritative eligibility source is the bursary provider, not this app.
- **No income/race collection without explicit informed consent** — do not build those filters for v1.

**Warning signs:**
- UI shows "You are eligible" without caveats
- Bursary records don't have a direct `url` field to the official source
- Filter UI asks for income bracket without explanation

**Phase to address:** Phase 4 (bursaries feature) — set filter scope during data design.

---

### Pitfall 11: WhatsApp Share URL Breaks on Long Query Strings

**Severity:** MEDIUM — the "share with parent" feature fails silently for career recommendations with many parameters.

**What goes wrong:**
WhatsApp truncates URLs that exceed ~2000 characters. A career recommendation URL encoding RIASEC scores, APS, subjects, and 5 career IDs in query parameters can easily exceed this limit. The user taps "Share on WhatsApp," the link opens to a 404 or truncated state.

**Why it happens:**
Query string sharing is the simplest approach and works fine in browser. WhatsApp's URL handling has character limits that are not standardized or documented.

**How to avoid:**
- Store recommendation state in Supabase (or localStorage) and share a short ID: `/share/abc123` resolves to the stored state.
- Keep URL parameters minimal: only career IDs (5 chars each × 5 careers = 25 chars).
- Test WhatsApp sharing with real devices before launch — do not rely on desktop browser URL bar tests.

**Warning signs:**
- Share URL contains RIASEC scores, APS, and subject list as query parameters
- URL length exceeds 200 characters
- Share feature was never tested on actual WhatsApp on Android

**Phase to address:** Phase 3 (sharing feature) — design URL scheme before implementing share button.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Single monolithic `careers.json` | Fast to prototype | Filter lag on mid-range Android; can't lazy-load individual careers | Never — split at design time |
| Inline RIASEC scoring logic in component | Saves file creation | Logic entangled with UI, hard to test, breaks when quiz format changes | Never — extract to pure function immediately |
| Hardcoded province names as strings | Fast to write | Typos cause silent filter failures; no central source of truth | Never — use a `PROVINCES` constant |
| No `error.tsx` / `error.jsx` boundary | Faster initial build | One Supabase timeout crashes the entire app | Never — add boundaries before connecting to Supabase |
| CSS Tailwind classes on SVG map elements | Fast styling | SVG CSS scoping is different from HTML; classes apply inconsistently cross-browser | Acceptable in MVP if map is non-critical |
| Copy/paste career JSON schema per career | Fast to populate | Schema drift between career records breaks type expectations | Never — define schema once, validate on build |
| `localStorage` for all user state | Avoids Supabase | State lost when user clears browser data; no cross-device sync | Acceptable for MVP; upgrade post-launch |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vercel | Deploying without `vercel.json` — functions run in `iad1` (Washington DC) | Set `"regions": ["cpt1"]` in `vercel.json` before first deployment |
| Supabase | Using Supabase as a required dependency for page render | Treat Supabase as enhancement only; all pages must render without it |
| Supabase RLS | Forgetting Row Level Security on anonymous analytics table — any user can read/write all rows | Enable RLS immediately; write-only policy for anon role on analytics tables |
| Supabase free tier | Database pauses after 7 days inactivity; no warning to end user | Keep-alive cron + graceful degradation for all Supabase calls |
| Supabase free tier | 500MB database limit — hit if storing full quiz sessions with all answer data | Store only aggregated results (top 3 career IDs + 6 type scores), not raw answers |
| vite-plugin-pwa | Globbing `public/**` into precache manifest downloads all data files on install | Exclude all `/data/**` from precache; use runtime caching only |
| Vercel + PWA | Service worker served with wrong Cache-Control headers — SW can be cached by CDN and never update | Set `Cache-Control: no-cache` on `sw.js` in `vercel.json` headers config |
| React Router + PWA | SPA routing breaks when user navigates to `/career/123` offline — service worker doesn't know how to serve it | Configure SW with navigate fallback to `index.html` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Monolithic careers JSON fetch | 2-3s blank screen before any content | Index-only JSON (<30KB) on start; per-career JSON on navigation | With 50+ detailed career records (500KB+) |
| Full-text search on unindexed JSON | Keystroke lag in career search input | Fuse.js with only index fields (title, category, tags) | With >100 career records and description fields included in search |
| SVG province map re-rendering on every filter change | Map flicker / 300ms repaint | Memoize province SVG component; only re-render data overlay | Every time filter state changes |
| Supabase connection on low-data 2G | 10s+ timeouts with no feedback | Queue writes to localStorage; flush when connection confirmed | On any Supabase call without timeout + retry |
| Tailwind JIT full scan in production build | Build times >2min | Ensure `content` paths in `tailwind.config.js` are specific | If `content: ['**/*']` glob is used |
| All 245 bursaries rendered in DOM | List scroll lag on Android | Virtualize list (react-virtual or windowing) for >50 items | With >50 bursaries visible in filtered result without virtualization |
| Image loading on career pages | LCP >4s on slow connection | Use `loading="lazy"`, WebP with fallback, max 50KB per image | Any image >100KB without lazy loading |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Supabase anon key in client code without RLS | Any user can read/write all rows in all tables | Enable RLS on every table — anon key is safe only when RLS is enforced |
| No RLS on quiz analytics table | Competitors can dump all quiz data; students' interests exposed in aggregate | Write-only policy for anon role: `INSERT` allowed, no `SELECT` |
| Province/career filter built from URL params without validation | XSS if filter value is reflected into DOM without sanitization | Validate all URL params against allowlists (9 provinces, known career IDs) |
| Storing student name + marks in Supabase analytics | PII collection without privacy policy = legal exposure | Store only anonymous session ID + career match results; no names, no marks |
| No HTTPS enforcement on service worker scope | Service workers require HTTPS; mixed content blocks registration | Vercel enforces HTTPS by default — do not use custom domains without SSL |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Quiz with no progress indicator | Students abandon 42-question quiz after question 10 | Show "Question X of 42" + visual progress bar at all times |
| Career page opens to wall of text | Students close immediately — they need to scan, not read | Lead with: salary range, APS minimum, key subjects, one-line description. Details below fold |
| Forcing sign-up to save quiz results | SA students distrust sign-up forms; most will not have email accounts they check | Use localStorage save by default; offer account as upgrade for cross-device sync |
| Bursary list without open/close dates | Students apply for closed bursaries; trust is broken | Show application window prominently; grey out / label "Applications closed" |
| Province map as primary navigation | Mobile users can't accurately tap small provinces (Gauteng is tiny) | Map is secondary; province dropdown is primary navigation for mobile |
| Data saver toggle buried in settings | Low-data users don't find it; load 3MB of images on first visit | Auto-detect with `navigator.connection.effectiveType`; prompt on slow connections |
| Study library with no progress tracking | Students can't see what they've studied | Use localStorage progress markers (topic completion checkboxes) — no login required |

---

## "Looks Done But Isn't" Checklist

- [ ] **RIASEC quiz:** Quiz renders and submits — but does it store scores per type (R, I, A, S, E, C) separately, not as a single total? Verify with 6 score values in localStorage.
- [ ] **APS calculator:** Calculator produces a number — but does it also collect per-subject marks and validate subject prerequisites per career? Check that "eligible" means both APS and subjects pass.
- [ ] **PWA offline:** App installs as PWA — but does it work offline on a real Android device with airplane mode? Test on an actual low-end phone, not Chrome DevTools offline simulation.
- [ ] **Province filter:** Province map/dropdown shows careers — but are TVET colleges and bursaries also filterable by province? Verify all three data types respond to province filter.
- [ ] **Bursary search:** Bursary list displays — but does every bursary have an official source URL? Check for records with `url: null` or placeholder URLs.
- [ ] **Vercel region:** App is deployed — but are functions running in `cpt1`? Check Vercel Dashboard > Project > Settings > Functions > Function Regions.
- [ ] **Service worker update:** App caches correctly — but does a new deployment reach users without requiring them to clear browser data? Deploy → navigate to app → force refresh → verify new content.
- [ ] **WhatsApp share:** Share button opens WhatsApp — but does the URL resolve correctly when opened on a different device? Test with a second phone receiving the link.
- [ ] **Data saver mode:** Initial load bundle is small on a fast connection — but is it also <50KB on a 2G connection profile? Measure in Chrome DevTools with "Slow 3G" throttling and service worker disabled.
- [ ] **Supabase auth optional:** Auth flow works when logged in — but does every feature work completely when NOT logged in? Test in incognito with Supabase blocked in network tab.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Functions deployed to wrong region | LOW | Update `vercel.json`, redeploy — takes 2 minutes |
| Monolithic careers JSON (performance) | HIGH | Split into index + per-career files; update all fetch calls; rebuild — 4-6 hours |
| Precached all JSON in SW | MEDIUM | Update `vite-plugin-pwa` config to exclude data dir; increment cache version; redeploy — 2 hours |
| RIASEC scoring logic is wrong | HIGH | Fix scoring algorithm; all existing localStorage scores are invalid; notify users to retake — 1 day |
| Study library scope consumed sprint | HIGH | Stub remaining content with "Coming soon"; ship with 3 subjects complete; finish post-launch |
| Province map spiral | MEDIUM | Drop SVG map; replace with `<select>` dropdown; label map as v2 — 1 hour |
| Supabase project paused mid-launch | LOW | Upgrade to Pro ($25/mo) or implement keep-alive cron — 30 minutes |
| WhatsApp URL truncation | MEDIUM | Implement short URL redirect via Supabase edge function; update all share buttons — 3 hours |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Vercel default region (iad1) | Phase 1: Project scaffold | `vercel.json` has `"regions": ["cpt1"]`; dashboard confirms |
| Precaching all JSON in SW | Phase 1: PWA scaffold | Lighthouse audit: precache manifest size <200KB |
| Study content rabbit hole | Phase 2: Data architecture (time-boxed); Phase 4: Study library | Total study JSON files <500KB; max 2 topics per subject for v1 |
| Province map complexity | Phase 3: Career discovery | Map built only after province dropdown ships; time-boxed to 4h |
| Monolithic careers JSON | Phase 2: Data architecture | `careers-index.json` <30KB; individual career files load on demand |
| RIASEC score normalization | Phase 3: Quiz implementation | 42 questions; 6 separate type scores; top-3 code matching |
| APS subject prerequisites | Phase 2: Data schema + Phase 3: Calculator | Career schema has `subjects_required[]`; eligibility checks both APS and subjects |
| Service worker update loop | Phase 1: PWA scaffold | `skipWaiting()` present; cache versioned; update notification UI |
| Supabase free tier pause | Phase 1: Architecture decisions | All Supabase calls wrapped in try/catch; keep-alive cron configured |
| Bursary false precision | Phase 4: Bursaries feature | All bursaries have `url`; UI shows "potentially eligible" not "eligible" |
| WhatsApp URL truncation | Phase 3: Sharing feature | Share URL <200 chars; tested on real Android WhatsApp |

---

## Sources

- Vercel regions documentation: https://vercel.com/docs/edge-network/regions (verified 2026-03-25, cpt1 region confirmed)
- Vercel function region configuration: https://vercel.com/docs/functions/configuring-functions/region (verified 2026-03-25, `iad1` default confirmed)
- MDN: Offline and background operation guide (verified 2026-03-25, service worker timeout limits)
- MDN: Storage quotas and eviction criteria (verified 2026-03-25, Chrome 60% disk limit)
- Supabase free tier behavior: training data (cutoff Aug 2025) — free tier pause after 7 days is documented behavior; verify current limits at supabase.com/pricing
- RIASEC/Holland occupational codes: Holland (1997) "Making Vocational Choices" — standard 6-type model, public domain instrument structure
- SA data costs: GSMA Mobile Economy Sub-Saharan Africa reports — SA prepaid data among highest cost as % of income in the region
- Service worker precaching pitfalls: training data synthesis from workbox-precaching documentation patterns

---

*Pitfalls research for: SA Career Guide — career guidance / edtech web app*
*Researched: 2026-03-25*
