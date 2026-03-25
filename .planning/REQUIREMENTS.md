# Requirements: SA Career Guide

**Defined:** 2026-03-25
**Core Value:** A student with a matric report card and 10 minutes must be able to discover a realistic career path, see exactly what to study and where, find bursary funding, and understand what demand exists for that career in their province — all for free, no login required.

## v1 Requirements

Requirements for the 7-day launch. Core loop: RIASEC quiz → career matches → career detail → bursary funding.

### Quiz Engine

- [ ] **QUIZ-01**: User can complete a 42-question RIASEC interest quiz and receive a top-3 RIASEC type code result
- [ ] **QUIZ-02**: User can enter per-subject report card marks to calculate an APS score
- [ ] **QUIZ-03**: User can see personalised career matches ranked by RIASEC alignment and APS eligibility
- [ ] **QUIZ-04**: User can check NSFAS eligibility by entering household income (rule-based: < R350K, SA citizen, first-time student)
- [ ] **QUIZ-05**: User can share quiz results via a WhatsApp-compatible URL under 200 characters

### Data Architecture

- [ ] **DATA-01**: Career master index JSON (`_master-index.json`) covers 200+ careers with id, title, category, pathway, RIASEC codes, APS minimum, and subjects required
- [ ] **DATA-02**: Individual career JSON files contain full detail: matric requirements, NQF level, qualifications, universities[], tvet_colleges[], bursaries[], salary ranges (entry/mid/senior), demand by province, day-in-the-life, matric alternatives
- [ ] **DATA-03**: University JSON covers all 26 public SA universities with province, programs, and application URL
- [ ] **DATA-04**: TVET college JSON covers 50 colleges with campuses, provinces, and NQF-level programs
- [ ] **DATA-05**: Bursary JSON covers 200+ bursaries with field, province, eligibility criteria, income threshold, and official URL

### Career Discovery

- [ ] **DISC-01**: User can browse a career results list filtered by their RIASEC type codes
- [ ] **DISC-02**: User can filter career results by APS eligibility (eligible / within reach / not yet)
- [ ] **DISC-03**: User can search careers by name or field using fuzzy search
- [ ] **DISC-04**: User can filter career results by SA province via a dropdown (not SVG map — that is v1.x)

### Career Detail

- [ ] **DETA-01**: User can view a full career detail page showing matric subject requirements, APS threshold, university and TVET pathways, salary ranges, and linked bursaries
- [ ] **DETA-02**: User's APS score and subjects are cross-checked against career prerequisites with an eligibility badge (eligible / X APS short / missing subject)
- [ ] **DETA-03**: User can share a career page via WhatsApp using a URL under 200 characters with OG preview metadata

### Bursary Finder

- [ ] **BURS-01**: User can browse the full bursary list (200+ entries) filtered by career field
- [ ] **BURS-02**: User can filter bursaries by SA province
- [ ] **BURS-03**: User can see NSFAS eligibility check result alongside the bursary list

### Platform

- [ ] **PLAT-01**: App shell loads under 50KB gzipped on first visit with no career data pre-bundled
- [ ] **PLAT-02**: User can toggle data saver mode (strips images, skips YouTube embeds, reduces payload) with preference persisted in localStorage
- [ ] **PLAT-03**: All pages are mobile-responsive and usable on a 320px-wide phone screen
- [ ] **PLAT-04**: App is deployed to Vercel with Cape Town region (`cpt1`) set in `vercel.json` before first deploy

## v2 Requirements

Deferred to post-launch validation. Add when core loop has real users.

### Province Map

- **PROV-01**: User can click an SA province on an interactive SVG choropleth map to filter careers, colleges, and job demand data
- **PROV-02**: Job demand heatmap displayed by province with intensity shading

### Career Tools

- **TOOL-01**: User can compare 2+ careers side-by-side in a structured layout
- **TOOL-02**: Grade 9/10 student can select a subject combination and see which career pathways it unlocks or closes

### Study Library

- **STUD-01**: User can navigate Grade 10/11/12 subject content by subject, grade, and topic
- **STUD-02**: Each study topic displays: explanation, worked examples, practice questions, YouTube link, and career relevance tags
- **STUD-03**: YouTube embeds are hidden in data saver mode; topic content still displays
- **STUD-04**: Career skills content available: coding basics, electrical theory, plumbing fundamentals, business/entrepreneurship

### PWA

- **PWA-01**: App works offline for previously-visited career and subject pages via Workbox service worker
- **PWA-02**: App displays an offline banner when connectivity is lost; previously cached pages remain accessible
- **PWA-03**: Service worker update notification shown when a new version is available (no silent reload)

### Optional Accounts

- **AUTH-01**: User can optionally create a Supabase account to save quiz results and career matches across devices
- **AUTH-02**: User can optionally track study topic completion with scores via Supabase
- **AUTH-03**: Anonymous quiz events (RIASEC result, APS score, top match) are logged to Supabase for internal analytics (fire-and-forget, never blocks UI)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Paid features / paywalls | Core value is 100% free — any paywall recreates the Yenza problem |
| Native mobile app (iOS/Android) | PWA covers mobile; app store approval takes weeks; 7-day timeline |
| School / teacher admin dashboards | Doubles product surface area; destroys no-login philosophy |
| AI-generated career advice / chatbot | Hallucinations on high-stakes decisions destroy trust; static curated data is safer |
| Real-time job listings scraping | Fragile, legally risky, maintenance-heavy; static SA DHET labour data is sufficient |
| University application workflow | Separate product (Gradesmatch's entire business); link out to institution portals instead |
| Social features (profiles, forums, comments) | Moderation burden; content risk with minors; POPIA complexity; WhatsApp sharing covers social proof |
| Multilingual content (Zulu, Xhosa, Afrikaans) | Requires professional translation; English-only for v1 |
| Public anonymous analytics dashboard | POPIA considerations; internal Supabase analysis only; blog post for aggregates |
| SVG province map in v1 | 2–3 days of work disguised as 2–3 hours; province dropdown ships first |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| QUIZ-01 | Phase 1 | Pending |
| QUIZ-02 | Phase 1 | Pending |
| QUIZ-03 | Phase 1 | Pending |
| QUIZ-04 | Phase 1 | Pending |
| QUIZ-05 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| DATA-04 | Phase 2 | Pending |
| DATA-05 | Phase 2 | Pending |
| DISC-01 | Phase 3 | Pending |
| DISC-02 | Phase 3 | Pending |
| DISC-03 | Phase 3 | Pending |
| DISC-04 | Phase 3 | Pending |
| DETA-01 | Phase 4 | Pending |
| DETA-02 | Phase 4 | Pending |
| DETA-03 | Phase 4 | Pending |
| BURS-01 | Phase 4 | Pending |
| BURS-02 | Phase 4 | Pending |
| BURS-03 | Phase 4 | Pending |
| PLAT-01 | Phase 0 | Pending |
| PLAT-02 | Phase 0 | Pending |
| PLAT-03 | Phase 0 | Pending |
| PLAT-04 | Phase 0 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after initial definition*
