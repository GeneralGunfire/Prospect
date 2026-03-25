# SA Career Guide

## What This Is

A free, no-login web app for South African high school students (Grade 10–12) to discover careers matched to their interests and report card marks, get a full roadmap to achieve those careers, and study the subjects they need to get there. Built in 7 days as a solo project, deployed on Vercel (Cape Town region) to minimize SA latency.

## Core Value

A student with a matric report card and 10 minutes must be able to discover a realistic career path, see exactly what to study and where, find bursary funding, and understand what demand exists for that career in their province — all for free, no login required.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Career Discovery**
- [ ] RIASEC interest quiz that outputs career matches
- [ ] APS calculator from report card mark input
- [ ] Career eligibility matching based on subjects and APS score
- [ ] Career deep-dive pages (matric requirements, NQF levels, universities, TVET colleges, bursaries, salaries, day-in-the-life, matric alternatives)

**Study Library**
- [ ] Grade 10/11/12 subject content for all 13 matric subjects
- [ ] Career skills content: coding basics, electrical theory, plumbing fundamentals, business/entrepreneurship
- [ ] Each topic includes explanation, worked examples, practice questions, YouTube links, career relevance
- [ ] Grade 9/10 subject selector tool

**SA Job Market**
- [ ] Interactive SA province map — click province to see local jobs, colleges, salaries
- [ ] Job demand heatmap by province
- [ ] SA job market gaps and in-demand careers display

**Bursaries & Funding**
- [ ] 200+ bursary database with eligibility checker
- [ ] NSFAS eligibility checker
- [ ] Bursary results filterable by career/field

**Comparison & Sharing**
- [ ] Career comparison tool (side-by-side, ≥2 careers)
- [ ] Shareable parent summary via WhatsApp-friendly URL
- [ ] Anonymous quiz analytics tracked to Supabase

**Platform**
- [ ] Data saver mode (≤50KB initial load)
- [ ] PWA with offline support
- [ ] Optional Supabase auth to save results and track study progress

### Out of Scope

- Paid features or paywalls — free always, no exceptions
- Mobile-native app (React Native/Flutter) — PWA covers mobile
- School admin dashboards — direct-to-student only
- AI-generated career advice — static, curated data only (trust, accuracy)
- Real-time job listings scraping — static SA job market data sufficient for v1
- University application workflow — discovery only, not application management

## Context

**Target users:** SA Grade 10–12 students, particularly those who cannot access paid tools like Yenza. Many are on low-data connections (data saver mode is critical). Some are considering TVET/trade paths that competitors ignore entirely.

**Competitive landscape:**
- Yenza — paywalled, school-only
- Gradesmatch — application-focused, not discovery
- NCAP — government, outdated
- Reslocate — generic, not SA-specific enough

**Our edge:** 100% free + no login + Grade 10–12 study library (nobody has this) + TVET pathways + interactive province map + data saver mode + WhatsApp shareable results.

**Data architecture:**
- Career data → static JSON files (200+ careers)
- Study content → static JSON files (per subject, per grade)
- Universities → static JSON (26 public SA universities)
- TVET colleges → static JSON (50 colleges with campuses + provinces)
- Bursaries → static JSON (200+ bursaries)
- User accounts + saved results → Supabase
- Anonymous quiz analytics → Supabase

**Existing data:** The repo already contains partial bursary data (245 bursaries), career JSONs (ai-ml-engineer, solar-panel-installer), TVET and university indexes from a prior quick-01 task.

## Constraints

- **Timeline**: 7-day solo build — scope must be ruthlessly prioritized
- **Tech Stack**: React + Tailwind CSS + Supabase + Vercel (already decided)
- **Hosting**: Vercel cpt1 (Cape Town) region for SA latency
- **Performance**: Data saver mode must keep initial load under 50KB
- **Auth**: Supabase optional auth only — no forced login gate
- **Data**: Static JSON for all reference data; Supabase only for user state and analytics

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React + Tailwind CSS | Standard 2025 stack, fast to build, good PWA support | — Pending |
| Supabase for auth/analytics | Free tier, SA-compatible, row-level security built-in | — Pending |
| Vercel cpt1 deployment | Lowest SA latency for target users | — Pending |
| Static JSON for career/study data | No CMS overhead, fast loads, version-controllable | — Pending |
| No forced login | SA students distrust sign-up friction; core value is frictionless access | — Pending |
| RIASEC quiz as entry point | Industry-standard interest profiling, well understood | — Pending |
| TVET pathways as first-class feature | Competitors ignore TVET; large underserved segment in SA | — Pending |

---
*Last updated: 2026-03-25 after initialization*
