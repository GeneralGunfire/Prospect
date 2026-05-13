# Prospect SA — Product

## Product Purpose
Free South African platform for career discovery, matric study resources, and civic guidance. Helps Grade 10–12 students make informed decisions about their academic and career paths — choosing subjects, finding funding, understanding their options.

## Users
South African high school students (Grade 10–12), primarily mobile. Many are first-generation university students. No prior knowledge of career paths assumed. They arrive with anxiety about their futures, not technical sophistication.

## Register
product — the design serves the product. The exception is the landing page (App.tsx home page) which is brand/marketing.

## Brand Tone
Direct, warm, South African. Not corporate, not patronizing. Information density matters — students are researching, not browsing. Premium feel signals legitimacy and trustworthiness to users who may distrust free tools.

## Color Strategy
Restrained. White surface, `#0f172a` / `#1e293b` for primary actions and headings, slate grays for secondary text, blue-600 (`#2563eb`) for interactive accents only where meaningful. No decorative color. The nav bar is the single dark element — it anchors everything.

## Anti-references
- Generic SaaS dashboard aesthetic (shadows on every card, rounded everything, gradients)
- AI-generated feel: icon before every label, identical card grids, hero metrics
- Overdesigned student tools that feel condescending

## Typography Strategy
Inter, editorial weight. Headlines: font-black (900), letter-spacing -0.025em to -0.03em. Section labels: 10–11px, uppercase, tracking-[0.2em], slate-400. Body: 14–15px, slate-600, line-height 1.6. Tight hierarchy — 3 sizes max per screen.

## Layout Principles
- Pages breathe. 48–64px vertical section gaps. Not 24px.
- No nested cards. Surfaces are flat or use a single border-bottom as separator.
- Lists over grids when content has different lengths.
- Max content width 680px for reading content, 1024px for data grids.

## Pages
- Home (landing) — marketing, brand register
- Auth — sign in / register
- Dashboard — student progress hub
- Library — subject browser → lessons
- Calendar — academic term & deadline tracker
- School Assist Chat — AI guidance chat
- Career Quiz — RIASEC personality quiz
- Careers — career browser
- TVET — vocational pathways
- Bursaries — funding finder
- Map — job demand by province
- Pothole Map, Water Dashboard, Tax/Budget, Cost of Living, Civics — community tools
