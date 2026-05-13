# Prospect SA — Design System

## Color Palette
- `#0f172a` — nav bar background, primary CTAs
- `#1e293b` (slate-900) — headings, high-emphasis text
- `#334155` (slate-700) — body text, secondary emphasis
- `#64748b` (slate-500) — secondary text, captions
- `#94a3b8` (slate-400) — labels, placeholders, dividers
- `#e2e8f0` (slate-200) — borders, separators
- `#f8fafc` (slate-50) — page background, alternating rows
- `#ffffff` — card surfaces, inputs
- `#2563eb` (blue-600) — interactive accent, links, active states

## Typography
Font: Inter (Google Fonts, variable optical size 14–32)
- H1: 28–40px, font-black (900), tracking -0.025em
- H2: 22–28px, font-black (900), tracking -0.02em
- H3: 16–18px, font-bold (700), tracking -0.01em
- Section label: 10–11px, font-black (900), uppercase, tracking-[0.2em], slate-400
- Body: 14–15px, font-normal (400), line-height 1.6, slate-600
- Caption: 12px, font-medium (500), slate-400

## Elevation
No box-shadows on cards. Use borders instead.
- `border border-slate-200` — standard card/surface
- `border-b border-slate-100` — list item separator
- Background tint (`bg-slate-50`) as the only "elevation"

## Spacing Scale
- Intra-component: 8px, 12px, 16px
- Section gap: 48px, 64px
- Page padding: 24px (mobile), 32px (tablet), 48px (desktop)
- Content max-width: 680px reading, 1024px data

## Components
- **Buttons primary**: bg-slate-900, text-white, rounded-lg (8px), px-5 py-2.5, font-bold text-sm uppercase tracking-wider
- **Buttons secondary**: border border-slate-200, text-slate-700, rounded-lg, same sizing
- **Inputs**: border border-slate-200, rounded-lg, px-3 py-2.5, focus: border-slate-400 ring-1 ring-slate-900/10
- **Tags/badges**: rounded-full, px-2.5 py-0.5, text-xs font-bold
- **Section labels**: `<p class="label">TEXT</p>` — 10px, uppercase, tracking-[0.2em], slate-400

## Radius
- Buttons: 8px (rounded-lg)
- Cards: 12px (rounded-xl) — used sparingly
- Inputs: 8px
- Tags: rounded-full
- Modal/drawer: 16px top corners only

## Do Not
- No `rounded-2xl` or `rounded-3xl` on cards — too bubbly
- No `shadow-xl`, `shadow-2xl` on page content
- No gradient backgrounds outside the landing page hero/lamp sections
- No side-stripe border accents (banned globally)
- No icon before every menu label on desktop
