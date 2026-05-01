---
name: Prospect SA
description: Career guidance and civic education platform for South African high school students.
colors:
  deep-navy: "#1E3A5F"
  deep-navy-dark: "#152a45"
  mid-navy: "#3B5A7F"
  surface-navy: "#1e293b"
  gold: "#F9A825"
  canvas: "#ffffff"
  pale-surface: "#f8fafc"
  text-primary: "#1e293b"
  text-secondary: "#64748b"
  text-tertiary: "#94a3b8"
  border-subtle: "#e2e8f0"
  on-surface-variant: "#475569"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
  info: "#3b82f6"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  btn: "8px"
  card: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.deep-navy-dark}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.btn}"
    padding: "10px 22px"
  button-accent:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.surface-navy}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "16px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "10px 12px"
---

# Design System: Prospect SA

## 1. Overview

**Creative North Star: "The Trusted Older Sibling"**

Prospect SA is built for a specific moment: a 16-year-old in a small town with a prepaid SIM card, sitting in the library during break, trying to figure out what to do with their life. The interface serves that moment. It is not a showcase, not a marketing canvas, not a startup dashboard. Every pixel exists to deliver information clearly and fast, under real-world constraints: small screens, bright sunlight, limited data, limited confidence.

The aesthetic is restrained and purposeful. Deep navy anchors trust. Gold marks the one moment that matters most (the primary action). White space is generous because information is dense and the user needs room to think. Typography is the primary design tool: Inter at extreme weights (900 for headings, 400 for body) creates hierarchy through contrast, not decorative elements. Cards exist where they earn their place; not as a reflexive layout pattern.

This system explicitly rejects government portal aesthetics (table-heavy, link-heavy, inaccessible), corporate HR site polish (formal, intimidating, impersonal), SaaS dashboard over-engineering (too many metrics, wrong emotional register), and edtech boredom (passive grey, no agency). It also rejects the visual anti-patterns that make AI-generated UI recognizable: gradient text, side-stripe accent borders, glassmorphism as decor, hero-metric templates.

**Key Characteristics:**
- Deep navy on white as the primary surface relationship
- Gold used sparingly as a single call-to-action signal (never decorative)
- Inter at 900 weight creates display hierarchy without a second typeface
- Touch targets minimum 44px; minimum font size 16px on inputs
- Motion is entrance-only: fade-up and scale-in at 0.3-0.4s ease-out. No looping, no bounce

## 2. Colors: The Deep Waters Palette

A two-pole palette: deep navy authority at one end, warm white canvas at the other. Gold is the signal flare between them.

### Primary
- **Deep Prospect Navy** (`#1E3A5F`): The principal brand color. Used on primary buttons, heavy section backgrounds (auth panels, hero dark cards), and nav active states. This color communicates trust and stability without corporate coldness.
- **Prospect Navy Dark** (`#152a45`): Hover state for primary navy elements only. Not used as a standalone surface color.

### Secondary
- **Mid Navy** (`#3B5A7F`): Secondary interactive states, focus rings, selected badge backgrounds. Lighter than Deep Prospect Navy, it provides visual breathing room in button groups and chip selections.
- **Surface Navy** (`#1e293b`): Body text color and the darkest neutral surface. Not the same as Deep Prospect Navy (warmer undertone; less chromatic).

### Tertiary
- **Prospect Gold** (`#F9A825`): The only warm color in the system. Used exclusively on primary CTA buttons where only one clear next action should exist on the page. When in doubt, do not use gold. Its power comes from restraint.

### Neutral
- **Canvas** (`#ffffff`): Card backgrounds, input fields, modal surfaces.
- **Pale Surface** (`#f8fafc`): Page-level background. Barely distinguishable from white — provides subtle contrast for card lift.
- **Text Primary** (`#1e293b`): All body copy, headings on light backgrounds.
- **Text Secondary** (`#64748b`): Supporting text, captions, field hints.
- **Text Tertiary** (`#94a3b8`): Placeholder text, disabled labels, metadata.
- **Border Subtle** (`#e2e8f0`): All card borders, input outlines, dividers.
- **On-Surface Variant** (`#475569`): Secondary interactive text, icon fills on light surfaces.

### Semantic
- **Success** (`#10b981`): Positive status only.
- **Warning** (`#f59e0b`): Caution states and time-sensitive alerts.
- **Error** (`#ef4444`): Form errors and destructive actions only.
- **Info** (`#3b82f6`): Informational callouts, link highlights.

### Named Rules
**The One Gold Rule.** Gold appears on one element per screen: the primary call-to-action. If there are two CTAs on the same page, only one may be gold. The second is navy ghost. Gold used as decoration (borders, backgrounds, icons) immediately loses its signal value.

**The No-Gradient-Text Rule.** Text gradient (`background-clip: text`) is absolutely prohibited. Prospect carries its brand through weight contrast and color purity, not decorative effects. One solid color; emphasis through weight.

## 3. Typography

**Display Font:** Inter (variable, Google Fonts, 400-800)
**Body Font:** Inter (same family)
**Label Font:** Inter 600, uppercase, tracked

**Character:** Inter at extreme weight contrast (900 display, 400 body) creates hierarchy without a second typeface. The variable font means every weight is available without loading multiple files — important for the data-constrained user base. Negative letter-spacing on headings tightens display text to feel purposeful, not airy.

### Hierarchy
- **Display** (900 weight, 3rem, line-height 1.1, -0.025em tracking): Page heroes and section titles only. One per screen maximum.
- **Headline** (800 weight, 2.25rem, line-height 1.2, -0.02em tracking): Major section headers, card group titles.
- **Title** (700 weight, 1.5rem, line-height 1.3, -0.015em tracking): Card headings, modal titles, subsection labels.
- **Body** (400 weight, 1rem, line-height 1.6): All paragraph copy. Maximum line length 65ch on desktop.
- **Small** (400 weight, 0.875rem, line-height 1.5): Supporting detail text, captions, metadata.
- **Label** (600 weight, 0.75rem, line-height 1.4, 0.05em tracking, uppercase): Badges, category tags, section eyebrows, button text on small controls. Minimum 12px; never smaller.

### Named Rules
**The Single-Family Rule.** Prospect uses one typeface. Adding a second font adds a request, adds render delay, and adds complexity for zero gain. Inter's weight range is the range we need. No display serifs, no mono accents, no script highlights.

**The Weight-is-Hierarchy Rule.** Size alone is insufficient to establish hierarchy. Every level change must pair a size reduction with a weight reduction. A 1.5rem/700 title must not sit next to a 1.25rem/700 label — the weight match destroys the hierarchy signal.

## 4. Elevation

This system is flat by default with responsive lift. Surfaces rest at zero elevation on the canvas background (`#f8fafc`). Elevation is earned by interaction state, not by the component type. A card at rest is flat. The same card when hovered or selected gains a shadow. Modals and dropdowns carry ambient shadows because their job is to assert a new layer.

### Shadow Vocabulary
- **Surface Raised** (`0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`): Hover state on interactive cards and buttons. The minimum signal that something is pressable.
- **Surface Elevated** (`0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)`): Dropdowns, tooltips, popover panels. Asserts layer separation.
- **Shadow Lg** (`0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`): Modals and full-screen sheets only.

### Named Rules
**The Flat-By-Default Rule.** Cards, list items, and containers are flat at rest. Shadows appear only on hover, focus, or when a component is in a physically higher layer (modal, dropdown, popover). Ambient shadows on resting cards are prohibited; they create visual noise and lose their meaning.

## 5. Components

### Buttons
Tactile and clear. Shape is consistently gently rounded (8px). Primary buttons carry the only warm color in the system. No gradient fills.

- **Shape:** Gently curved (8px radius). Never sharp, never pill-shaped for standard actions.
- **Primary:** Deep Prospect Navy (`#1E3A5F`) background, white text, 12px 24px padding, 600 weight. Hover: darkens to `#152a45`, 150ms ease-out.
- **Primary CTA (Gold variant):** Prospect Gold (`#F9A825`) background, Surface Navy (`#1e293b`) text. One per page maximum. Same shape/padding as primary.
- **Ghost:** Transparent background, Deep Navy text, 1px border `#e2e8f0`. Hover: `#f8fafc` background.
- **Focus ring:** 2px `#3B5A7F` at 2px offset. All buttons, all states.
- **Minimum height:** 44px always. 48px for touch-primary contexts.

### Chips and Filter Pills
Used on search/filter interfaces (career browser, civics browser, bursary finder).

- **Style:** White background, `#e2e8f0` border, 1rem/600 text, 8px 12px padding, pill shape (9999px).
- **Selected state:** Deep Navy background, white text, no border.
- **Category chips (colored):** Subject-specific backgrounds at 10% opacity with matching text (blue-50/blue-700, teal-50/teal-700, etc.). Never full-saturation fills.

### Cards
Cards appear on career listings, bursary results, civics procedures, news articles.

- **Corner Style:** Gently curved (12px radius).
- **Background:** White (`#ffffff`) on pale-surface page background.
- **Shadow Strategy:** Flat at rest. `surface-raised` shadow on hover (150ms ease-out). Interactive cards must show the hover transition.
- **Border:** 1px `#e2e8f0` always. The border and the white card together provide contrast against the `#f8fafc` page.
- **Internal Padding:** 16px standard; 20px for content-heavy cards.
- **Nested cards:** Never. A card inside a card is always a sign the component needs rethinking.

### Inputs and Fields
- **Style:** White background, 1px `#e2e8f0` border, 8px radius.
- **Font size:** 16px minimum — prevents iOS auto-zoom. Non-negotiable.
- **Minimum height:** 44px.
- **Focus:** Border shifts to `#3B5A7F`; adds `ring-1 ring-prospect-blue-accent/50` (1px inset glow). Never an outline on the field label.
- **Error state:** Border `#ef4444`, error text below the field in `#ef4444` at 0.875rem.
- **Disabled:** `#f8fafc` background, `#94a3b8` text, `not-allowed` cursor.
- **Placeholder:** `#94a3b8` — must meet 3:1 contrast against white at minimum.

### Navigation (App Header)
- **Style:** White background with `border-b border-slate-200`, `max-w-3xl` content constraint, sticky top-0. Fixed height approximately 56px.
- **Nav items:** Horizontal pill tabs on desktop. Text: 0.875rem/600. Active: Deep Navy background, white text, 8px radius pill. Inactive: transparent background, Text Secondary.
- **Mobile:** Bottom sheet or horizontal scroll. Touch targets 48px height.
- **Back navigation:** Left-chevron button in the header, not a browser back. 32px minimum target.

### Badge and Status Tags
- **Shape:** Pill (9999px radius), 0.75rem/600/uppercase/tracked.
- **Semantic variants:** success (green-50/green-700), warning (yellow-50/yellow-800), error (red-50/red-700), info (blue-50/blue-700), neutral (slate-100/slate-600).
- **Demand badges** (for careers): high = green, medium = yellow, low = red. Always paired with a text label — color alone is never the only signal.

### Accordion Cards (Civics, FAQ sections)
- **Closed state:** White card, 12px radius, 1px slate-200 border, left-padded icon + title + right chevron.
- **Open state:** Keeps border, background shifts to the section's associated tint (blue-50, amber-50, etc.). Content fades in over 200ms with height animation.
- **Chevron:** Rotates 180 degrees on open. 200ms ease-out.

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Prospect Navy (`#1E3A5F`) as the primary action color. It is the brand.
- **Do** reserve gold (`#F9A825`) for the single most important CTA on each screen. One per screen.
- **Do** use Inter at weight 900 for display text and 400 for body. The contrast between them is the hierarchy.
- **Do** maintain a minimum touch target of 44px height on all interactive elements.
- **Do** set all form inputs to `font-size: 16px` minimum to prevent iOS zoom.
- **Do** use `prefers-reduced-motion` to disable all animations for users who need it.
- **Do** animate entrance-only: fade-up, scale-in. 0.25-0.4s, ease-out. No looping animations except loading spinners.
- **Do** use full card borders (`1px #e2e8f0`) rather than colored side stripes to differentiate cards.
- **Do** test all text on its background at WCAG AA (4.5:1 for body, 3:1 for large text).
- **Do** use semantic status colors (success/warning/error/info) consistently; never invent new semantic colors.

### Don't:
- **Don't** use border-left greater than 1px as a colored accent stripe on cards, list items, or callouts. The `.card-accent-*` utility classes in the existing codebase are a legacy anti-pattern. Replace with background tints or full borders.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). The `.text-gradient` utility in index.css is prohibited in new components. Use a single solid color; use weight for emphasis.
- **Don't** use glassmorphism (`backdrop-filter: blur`) as decoration. The `.glass-card` utility exists in the codebase but should only appear on modal overlays when a blurred-background effect genuinely serves the UX.
- **Don't** look like a government department website: avoid table-dominated layouts, link-list navigation, and gray-on-white information density without visual hierarchy.
- **Don't** look like a corporate recruitment portal: no formal photography, no "submit your CV" language, no serif-heavy polished headers. This is for a 16-year-old, not an HR manager.
- **Don't** look like a SaaS analytics dashboard: no KPI boxes with big numbers as the dominant layout unit, no dark sidebar navigation, no "your score this week" hero metrics.
- **Don't** use identical card grids with icon + heading + body paragraph repeated without differentiation. If every card looks the same, they all disappear.
- **Don't** reach for a modal as the first interaction pattern. Try inline expansion, page navigation, or drawer slides first.
- **Don't** use color alone to convey meaning. Every color-coded status (demand level, difficulty badge) must have a text label.
- **Don't** animate CSS layout properties (height, width, margin, padding). Animate transform and opacity only.
- **Don't** add heavy decorative imagery or background illustrations that cost bandwidth and add no informational value.
