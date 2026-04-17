# Prospect Design System
> Single source of truth for all visual decisions. Every component, page, and future feature should reference this spec.

---

## Color Palette

### Primary Brand Colors
| Token | Hex | Tailwind Equiv | Use |
|---|---|---|---|
| `--color-navy` | `#1e293b` | `slate-800` | Primary text, buttons, logo, header |
| `--color-prospect-green` | `#1E3A5F` | — (custom) | Brand identity, primary CTAs |
| `--color-prospect-blue-accent` | `#3B5A7F` | — (custom) | Active nav states, links, focus rings |
| `--color-prospect-gold` | `#F9A825` | `amber-400` | Accent highlight, quiz results, badges |
| `--color-secondary` | `#64748b` | `slate-500` | Secondary text, subheadings, meta |

### Neutral Shades
| Token | Hex | Use |
|---|---|---|
| White | `#ffffff` | Backgrounds, card surfaces |
| Light | `#f8fafc` (`slate-50`) | Page backgrounds, input fills |
| Border | `#e2e8f0` (`slate-200`) | Dividers, card borders, input borders |

### Accent Colors (Semantic / Section)
| Color | Hex | Where Used |
|---|---|---|
| Career Guide accent | `#3b82f6` (blue-500) | Career Guide section, quiz, career browser |
| School Assist accent | `#6366f1` (indigo-500) | School Assist section, dashboard, library |
| Community accent | `#10b981` (emerald-500) | Community Impact section only |
| Danger | `#ef4444` (red-500) | Errors, logout, destructive actions |

### What to STOP using
These are currently scattered across the codebase and should be removed:
- `#1B5E20` (dark green) — legacy, replace with `#1E3A5F`
- `#F9A825` as a background — only use as text/icon accent
- `#a855f7`, `#8b5cf6`, `#7c3aed` (purple) — not in brand palette, remove
- `#f97316` (orange) — not in palette, remove
- `#0ea5e9` (sky blue) — too similar to blue-500, consolidate

---

## Typography

**Single font:** Inter (already loaded via Google Fonts in `index.css`)  
No display font needed — Inter's weight range (400–800) is sufficient.

### Type Scale
| Role | Size | Weight | Class |
|---|---|---|---|
| Hero heading | 56–72px | 900 (Black) | `text-6xl font-black` |
| Section heading | 36–48px | 800 (ExtraBold) | `text-4xl font-extrabold` |
| Card heading | 20–24px | 700 (Bold) | `text-xl font-bold` |
| Body | 16px | 400 (Regular) | `text-base` |
| Body small | 14px | 400–500 | `text-sm` |
| Label / Nav | 11–12px | 700 | `text-xs font-bold uppercase tracking-wider` |
| Caption | 11px | 500 | `text-[11px] font-medium` |

### Letter Spacing Rules
- Headings: `-0.02em` (tighter, more editorial)
- Labels / nav: `tracking-wider` or `tracking-widest` + `uppercase`
- Body: default (0)

---

## Spacing (8px Grid)

All spacing should be multiples of 8px (Tailwind's `2` = 8px).

| Use | Value | Tailwind |
|---|---|---|
| Tight (between icon + label) | 4px | `gap-1` |
| Component internal | 8px | `gap-2 / p-2` |
| Card internal padding | 24px | `p-6` |
| Between cards | 16–24px | `gap-4 / gap-6` |
| Section vertical padding | 80–128px | `py-20 / py-32` |
| Page horizontal padding | 16px mobile, 32px desktop | `px-4 md:px-8` |
| Max content width | 1280px | `max-w-7xl mx-auto` |

---

## Shadows

Three levels only:

| Level | CSS | Tailwind | Use |
|---|---|---|---|
| Subtle | `0 1px 3px rgba(0,0,0,0.06)` | `shadow-sm` | Cards, inputs, nav bar |
| Medium | `0 4px 16px rgba(0,0,0,0.08)` | `shadow-md` | Elevated cards, modals |
| Prominent | `0 16px 40px rgba(0,0,0,0.12)` | `shadow-xl` | Drawers, dropdowns, hero elements |

Do NOT use `shadow-2xl` or coloured shadows (e.g. `shadow-blue-200`) — they cause visual inconsistency.

---

## Border Radius

One primary radius: **`rounded-2xl` (16px)**  
Secondary for small elements: **`rounded-lg` (8px)**  
Pill for badges/tags: **`rounded-full`**

| Element | Radius |
|---|---|
| Cards | `rounded-2xl` |
| Buttons | `rounded-xl` |
| Input fields | `rounded-xl` |
| Modals / drawers | `rounded-3xl` (top edge only for drawers) |
| Icons / avatars | `rounded-xl` (square) or `rounded-full` (circular) |
| Tags / badges | `rounded-full` |
| Nav items | `rounded-lg` |

---

## Button Styles

### Primary
```
bg-navy text-white font-black text-xs uppercase tracking-widest
px-6 py-3 rounded-xl hover:bg-[#2d3f54] transition-all shadow-sm
```
Use for: main CTAs, form submits

### Secondary (Outlined)
```
border-2 border-navy text-navy font-bold text-xs uppercase tracking-widest
px-6 py-3 rounded-xl hover:bg-navy/5 transition-all
```
Use for: secondary actions, back buttons

### Tertiary (Ghost)
```
text-slate-500 font-semibold text-xs uppercase tracking-wide
px-4 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all
```
Use for: nav items, filter toggles, less prominent actions

### Danger
```
text-red-500 font-semibold text-xs uppercase tracking-wide
px-4 py-2 rounded-xl hover:bg-red-50 transition-all
```
Use for: logout, delete, destructive actions

### Active State (all buttons)
- Scale down slightly: `active:scale-95`
- Reduce opacity: `disabled:opacity-50 disabled:cursor-not-allowed`

---

## Card Styles

### Standard Card
```
bg-white rounded-2xl border border-slate-100 shadow-sm p-6
hover:shadow-md transition-shadow duration-200
```

### Feature Card (landing page sections)
```
bg-white rounded-2xl border border-slate-100 shadow-sm p-6
group hover:border-blue-200 hover:shadow-md transition-all duration-200
```

### Dark Card (Community section, hero accents)
```
bg-navy text-white rounded-3xl p-8 shadow-xl
```

### Stat / Metric Card
```
bg-slate-50 rounded-2xl border border-slate-100 p-5
```

---

## Iconography

Library: **Lucide React** (already installed)  
Sizes:
- Nav icons: `w-3.5 h-3.5`
- Card icons: `w-5 h-5`
- Hero / section icons: `w-8 h-8`
- In buttons: `w-4 h-4`

Icon containers (when placed in a coloured background):
```
w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center
```

---

## Animation Principles

Library: **Framer Motion** (`motion/react`)  
Rules:
- Entrance: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}`
- Hover scale: `whileHover={{ scale: 1.02 }}` — max 2% scale, never more
- Page transitions: fade + slight Y lift only
- No bounce, no spring on content (only on drawers/modals)
- Always respect `prefers-reduced-motion` (already handled in `index.css`)

---

## Section Structure Pattern

Every landing page section should follow this structure:
```
<section className="py-24 px-4">
  <div className="max-w-7xl mx-auto">
    {/* Eyebrow label */}
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3">
      Section Label
    </p>
    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-black text-navy mb-4" style={{ letterSpacing: '-0.02em' }}>
      Section Heading
    </h2>
    {/* Subtext */}
    <p className="text-base text-slate-500 max-w-xl mb-12">
      Supporting description.
    </p>
    {/* Content */}
  </div>
</section>
```
