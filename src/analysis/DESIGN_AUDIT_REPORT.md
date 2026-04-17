# Prospect — Design Audit Report
> Audited: 2026-04-16 | Auditor: Claude

---

## 1. Color Audit

### Hex Codes Found Across Codebase (by frequency)

| Hex | Count | What It Is | Status |
|---|---|---|---|
| `#1e293b` | 256 | Navy (primary brand) | ✅ Keep — main brand color |
| `#64748b` | 134 | Slate-500 (secondary text) | ✅ Keep |
| `#1B5E20` | 82 | Dark forest green (legacy) | ❌ Remove — predates rebrand |
| `#475569` | 59 | Slate-600 | ✅ Keep |
| `#3b82f6` | 51 | Blue-500 | ⚠️ Consolidate — only use as Career Guide accent |
| `#ef4444` | 46 | Red-500 | ✅ Keep — danger/error only |
| `#1E3A5F` | 46 | Prospect blue (brand) | ✅ Keep — primary brand blue |
| `#e2e8f0` | 29 | Border gray | ✅ Keep |
| `#22c55e` | 27 | Green-500 | ❌ Remove — not in palette |
| `#10b981` | 19 | Emerald-500 | ⚠️ Community section only |
| `#3B5A7F` | 15 | Prospect blue accent | ✅ Keep — nav active, focus rings |
| `#94a3b8` | 13 | Slate-400 | ✅ Keep — muted text |
| `#f59e0b` / `#F9A825` | 24 | Amber / Gold | ⚠️ Two near-identical values — consolidate to `#F9A825` |
| `#a855f7` / `#8b5cf6` / `#7c3aed` | 24 | Purple family | ❌ Remove — not in brand palette |
| `#f97316` | 10 | Orange-500 | ❌ Remove — not in palette |
| `#0ea5e9` | 4 | Sky-500 | ❌ Remove — consolidate to blue-500 |
| `#10B981` | 12 | Emerald (dup case) | ❌ Consolidate — same as `#10b981` above |

### Color System Problems
- **40+ distinct hex values** used across the site — should be fewer than 12
- **3 shades of green** (`#1B5E20`, `#22c55e`, `#10b981`) used interchangeably — one was the old brand colour before the blue rebrand
- **2 amber values** (`#f59e0b` vs `#F9A825`) doing the same job
- **Purple appears 24 times** with no design rationale — remove entirely
- **CSS variables defined in `index.css`** but ignored in many page files that use raw hex instead

### Tailwind Color Classes Audit
- `bg-green-*` appears 35+ times — mostly legacy, should be `bg-blue-*` or `bg-slate-*`
- `bg-blue-*` appears 45+ times — primary accent, acceptable but needs thinning
- `bg-purple-*` appears 13+ times — remove all
- `bg-amber-*` / `bg-yellow-*` mixed — consolidate to `bg-amber-*` only
- `text-indigo-*` (16 uses) vs `text-blue-*` (29 uses) — pick one for School Assist accent

---

## 2. Font Audit

| Font | Source | Status |
|---|---|---|
| **Inter** | Google Fonts (imported in `index.css`) | ✅ Only font — good |
| System fallback | `ui-sans-serif, system-ui, sans-serif` | ✅ Correct fallback |

**No font inconsistencies found.** Inter is loaded correctly with optical sizing (`opsz`) for weights 400–800. The issue is weight usage: some pages use `font-bold` (700) for headings that should be `font-black` (900) to match the brand's editorial style.

---

## 3. Button Style Audit

Currently there are **7+ distinct button patterns** in use with no consistency:

| Pattern | Example Location | Count | Status |
|---|---|---|---|
| `bg-navy text-white rounded-xl` | AppHeader Sign In | ~20 | ✅ Primary CTA — keep |
| `bg-[#1e293b] text-white` | Multiple pages | ~15 | ❌ Use token not raw hex |
| `prospect-btn-primary` class | index.css | ~3 | ⚠️ Rarely used, should be standard |
| `bg-blue-600 text-white rounded-xl` | AuthPage, ImpactAuthPage | ~10 | ⚠️ Should use navy for consistency |
| `bg-amber-400 text-navy` | Quiz results | ~3 | ⚠️ Gold accent — acceptable, limit to 1–2 uses |
| `border-2 border-navy` | Outlined buttons | ~8 | ✅ Secondary — keep pattern |
| `text-slate-500 hover:bg-slate-100` | Ghost/tertiary | ~30+ | ✅ Nav/filter use — keep |
| `bg-gradient-to-r from-X to-Y` | Landing page CTAs | ~5 | ❌ Remove gradients from buttons |

**Key problem:** Auth pages (`AuthPage.tsx`, `ImpactAuthPage.tsx`) use `bg-blue-600` while the rest of the app uses `bg-navy` (`#1e293b`). Makes the auth pages feel like a different product.

---

## 4. Card Component Audit

| Card Type | Locations | Border Radius | Padding | Shadow | Status |
|---|---|---|---|---|---|
| Career cards | CareersPageNew, Dashboard | `rounded-2xl` | `p-5–p-6` | `shadow-sm` | ✅ Consistent |
| Bursary cards | BursariesPage | `rounded-2xl` | `p-5` | `shadow-sm` | ✅ OK |
| TVET cards | TVETPage | `rounded-2xl` | `p-6` | `shadow-sm` | ✅ OK |
| Landing feature cards | App.tsx | `rounded-2xl` | `p-6` | `shadow-sm` | ✅ OK |
| Dashboard stat cards | DashboardPage | `rounded-xl` | `p-4` | none | ⚠️ Inconsistent radius |
| Library subject cards | StudyLibraryPage | `rounded-2xl` | `p-4` | `shadow-sm` | ⚠️ Flat/plain — needs colour |
| Quiz result cards | QuizPage results | `rounded-2xl` | `p-6` | `shadow-md` | ✅ OK |

**Inconsistencies:**
- Dashboard uses `rounded-xl` where everything else uses `rounded-2xl`
- Library subject cards have no colour differentiation — all look identical
- Some landing page cards have gradient borders, some have solid borders, some have no border

---

## 5. Performance Audit

### Bundle Size
```
JS bundle:  1,911 KB minified  /  490 KB gzip   ❌ CRITICAL — way too large
CSS bundle:   180 KB minified  /  30 KB gzip    ⚠️ Large — mostly Tailwind utilities
```
**Target:** JS < 500 KB gzip. Currently 490 KB gzip (just within tolerance but will grow).

### Image Sizes (Public folder)
| File | Size | Status |
|---|---|---|
| `engineer.jpg` | **4.7 MB** | ❌ Critical — compress to <200 KB |
| `nurse.jpg` | **1.7 MB** | ❌ Critical — compress to <150 KB |
| `electrician.jpg` | **1.6 MB** | ❌ Critical — compress to <150 KB |
| `teacher.jpg` | **1.1 MB** | ❌ Compress to <100 KB |
| `students.jpg` | **837 KB** | ❌ Compress to <100 KB |
| `logo.png` | 321 KB | ⚠️ Replace with SVG (already have `logo.svg`) |

All images should be converted to **WebP format** and served at appropriate dimensions. Total image weight: **9.5 MB** — this is the single biggest performance problem.

### Bundle Bloat — Duplicate Data Files
The `data/` directory has 7 career data files, most are duplicates:

| File | Lines | Actually Imported By |
|---|---|---|
| `careers400Final.ts` | — | `CareersPageNew.tsx` ✅ (main) |
| `careersFullAudited.ts` | 33 | `careers400Final.ts` (re-exports) |
| `careersFullData.ts` | 1,754 | `TVETCareersPage.tsx` |
| `careers400.ts` | 1,305 | `CareersPage.tsx` (old page) |
| `careersFullDataExpanded.ts` | 762 | Nothing ❌ |
| `careers400_complete.ts` | 307 | Nothing ❌ |
| `careers400_expanded.ts` | 25 | Nothing ❌ |
| `careers_audited.ts` | 36 | Nothing ❌ |

**4 data files (2,130 lines) imported by nothing** — delete them. This alone likely saves ~200 KB of bundle.

### Code Splitting — Not Implemented
The app ships as **one monolithic chunk**. Every page loads on first visit even if the user never visits it. Recommended lazy loading:
```ts
const QuizPage = lazy(() => import('./pages/QuizPage'));
const StudyLibraryPage = lazy(() => import('./pages/StudyLibraryPage'));
// etc. for all pages
```
This could reduce initial load JS by 60–70%.

### Animation Bottlenecks
- `InteractiveBackground` in `App.tsx` renders SVG blobs with CSS animations at all times — even on pages where it's not visible. Check if it re-renders on every route change.
- `QuizPage` has large `AnimatePresence` wrappers around every question — acceptable.
- No virtualization on `CareersPageNew` — rendering 400 cards simultaneously is a perf risk on low-end devices.

### Unused CSS
- `index.css` defines `.calm-gradient`, `.calm-header-gradient`, `.review-gradient` — these appear to be from a previous theme and may be unused.
- `--color-calm-blue`, `--color-calm-dark-blue`, `--color-calm-bg`, `--color-calm-footer` CSS variables — leftover from old theme.

---

## 6. Design Inconsistency Summary

### Pages That Need the Most Attention

| Page | Problem | Priority |
|---|---|---|
| **Landing Page** | 3 product sections use different color systems (blue, indigo, emerald) — no unifying visual thread | High |
| **Auth Page** | Uses `bg-blue-600` for buttons while rest of app uses `bg-navy` | Medium |
| **Study Library** | Subject cards are identical gray boxes — no visual differentiation between subjects | High |
| **Dashboard** | Sparse layout, stat cards have no shadow/border, no visual hierarchy | High |
| **TVET Hub** | Generic blue hero with no personality or visual interest | Medium |
| **Quiz Results** | Well-structured but gold/amber colour not consistent with career mode's blue palette | Low |

### Global Issues
1. **Raw hex vs CSS tokens** — `#1e293b` is hardcoded in `style={{}}` props 256 times instead of using `bg-navy` or the CSS variable `--color-navy`
2. **Three levels of "active blue"** — `blue-500`, `blue-600`, `prospect-blue-accent (#3B5A7F)` all used for active/selected states
3. **Border radius fragmentation** — `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` used interchangeably on same element types
4. **No consistent hover state** — some cards lift (`hover:shadow-md`), some highlight (`hover:border-blue-200`), some do both, some do nothing

---

## 7. Color Scheme Proposal

### Current Palette (too many colors)
```
Navy:    #1e293b  — main brand
Blue:    #1E3A5F  — brand blue
Accent:  #3B5A7F  — blue accent
Gold:    #F9A825  — highlight
Green:   #1B5E20  — LEGACY, remove
Purple:  various  — remove
Orange:  various  — remove
```

### Proposed Simplified Palette (4 core + semantic)

```
─── Core ───────────────────────────────────────
Navy       #1e293b    Primary text, buttons, logo
Brand Blue #1E3A5F    Brand identity, gradient starts
Accent     #3B5A7F    Active states, links, focus
Gold       #F9A825    Highlights, badges, quiz results

─── Neutrals ───────────────────────────────────
Surface    #ffffff    Card backgrounds
Off-white  #f8fafc    Page background
Border     #e2e8f0    All borders/dividers
Muted      #64748b    Secondary text
Subtle     #94a3b8    Placeholder, disabled text

─── Semantic (section identifiers only) ────────
Career     #3b82f6    Career Guide sections/accents
School     #6366f1    School Assist sections/accents
Community  #10b981    Community sections/accents
Danger     #ef4444    Errors, destructive actions

─── REMOVE entirely ────────────────────────────
#1B5E20  (legacy green)
#22c55e  (green-500, not in brand)
Purple family (#a855f7, #8b5cf6, #7c3aed)
Orange (#f97316)
Sky (#0ea5e9)
```

### Pages That Need Re-coloring
| Page | Current Problem | Fix |
|---|---|---|
| All pages with `style={{ backgroundColor: '#1e293b' }}` | Inline hex | Replace with `className="bg-navy"` |
| Auth + ImpactAuthPage | `bg-blue-600` buttons | Change to `bg-navy` |
| Landing page "How It Works" cards | Green icon containers | Change to `bg-blue-50` with `text-blue-600` |
| Study Library cards | No colour | Add subject-specific color accent (top border or icon bg) |
| Dashboard stat cards | Plain white, no border | Add `border border-slate-100 shadow-sm` |

---

## Priority Action List

### Immediate (Performance)
1. **Compress all 5 landing page images** — saves 9+ MB, biggest single win
2. **Delete 4 unused data files** — saves ~200 KB bundle
3. **Add `React.lazy()` to all pages** — reduces initial JS by ~60%

### Short Term (Design Consistency)
4. **Replace all `style={{ backgroundColor: '#1e293b' }}` with `className="bg-navy"`**
5. **Remove all purple and orange classes** from non-Community pages
6. **Standardize Auth page buttons** from `bg-blue-600` to `bg-navy`
7. **Add colour to Study Library subject cards** (accent top border per subject)
8. **Fix Dashboard card styling** — add borders and shadows to stat blocks

### Medium Term (Visual Quality)
9. **Redesign TVET hero** — replace generic blue with textured/typographic treatment
10. **Unify landing page section design** — consistent eyebrow → heading → subtext → grid pattern
11. **Add visual hierarchy to Dashboard** — group saved items, add empty states
