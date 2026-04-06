# Roadmap: SA Career Guide

## Overview

Seven phases deliver a free, no-login career guidance PWA for South African Grade 10-12 students. Phase 0 locks in infrastructure decisions that cannot be changed cheaply. Phase 1 builds the quiz engine — the product entry point — with zero external data dependencies. Phase 2 finalises the JSON schemas before any display layer is built. Phases 3 and 4 deliver the core discovery loop: quiz → career results → career detail → bursary funding. Phases 5 and 6 are future-phase stubs for the study library and PWA/polish work deferred to post-launch validation.

## Phases

**Phase Numbering:**
- Integer phases (0, 1, 2, ...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 0: Foundation and Configuration** - Project scaffold, Vercel region, PWA shell, data directory, AppContext, mobile layout
- [ ] **Phase 1: Quiz Engine** - RIASEC interest quiz, APS calculator, NSFAS checker, shareable result URL
- [ ] **Phase 2: Data Architecture** - Finalise all JSON schemas and TypeScript interfaces before any display layer
- [ ] **Phase 3: Career Discovery** - Career results list with RIASEC + APS filtering, fuzzy search, province dropdown
- [ ] **Phase 4: Career Detail and Bursary Finder** - Full career detail pages, eligibility badges, bursary list, WhatsApp sharing
- [ ] **Phase 5: Study Library** - [v2 stub] Subject content viewer, grade/topic navigation, YouTube embeds
- [ ] **Phase 6: PWA, Polish, and Deploy** - [v2 stub] Service worker, Supabase analytics, optional auth, offline support

## Phase Details

### Phase 0: Foundation and Configuration
**Goal**: The project infrastructure is locked in and every subsequent phase builds on a stable base with zero cheap decisions left unmade
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01, PLAT-02, PLAT-03, PLAT-04
**Success Criteria** (what must be TRUE):
  1. App shell loads in a browser under 50KB gzipped with no career data pre-bundled
  2. User can toggle data saver mode and the preference persists after a page reload
  3. Every page is usable on a 320px-wide phone screen without horizontal scrolling
  4. Vercel deployment targets the Cape Town (`cpt1`) region as confirmed in `vercel.json`
**Plans**: TBD

Plans:
- [ ] 00-01: Vite + React + TypeScript + Tailwind v4 scaffold with React Router routes stubbed
- [ ] 00-02: AppContext (dataSaverMode, province), mobile layout, data directory structure, loaders.ts

### Phase 1: Quiz Engine
**Goal**: A student can complete the RIASEC quiz and APS calculator, receive a personalised result, and share it with a parent via WhatsApp
**Depends on**: Phase 0
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05
**Success Criteria** (what must be TRUE):
  1. User can complete 42 RIASEC questions and receive a top-3 type code result (e.g., "RIC")
  2. User can enter per-subject marks and see a calculated APS score with subject prerequisite validation
  3. User can see career matches ranked by RIASEC alignment and APS eligibility after completing both inputs
  4. User can check NSFAS eligibility by entering household income and receive a rule-based yes/no result
  5. The shareable quiz result URL is under 200 characters and opens correctly on a fresh browser tab
**Plans**: TBD

Plans:
- [ ] 01-01: RIASEC state machine (pure TypeScript), 42-question quiz UI, Zustand persist, top-3 code output
- [ ] 01-02: APS calculator (per-subject mark entry, aggregate APS, subject prerequisite validation), NSFAS checker, shareable URL

### Phase 2: Data Architecture
**Goal**: All JSON schemas are finalised and TypeScript interfaces are defined so no schema rework is needed when display components are built
**Depends on**: Phase 0
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
**Success Criteria** (what must be TRUE):
  1. `_master-index.json` covers 200+ careers with all required fields (id, title, category, pathway, riasec, aps_min, subjects_required)
  2. At least two individual career JSON files contain full detail including `subjects_required[]` array with mandatory flags
  3. University JSON covers all 26 public SA universities and TVET JSON covers all 50 colleges with their provinces
  4. Bursary JSON covers 200+ entries and every record has a valid `url` field pointing to an official source
  5. TypeScript interfaces in `src/data/types.ts` match all four JSON schemas with no `any` types
**Plans**: TBD

Plans:
- [ ] 02-01: Schema design — TypeScript interfaces for Career, University, TVET, Bursary; audit existing JSON against new schema
- [ ] 02-02: Data migration — update `_master-index.json`, expand university and TVET JSONs, audit bursary URLs

### Phase 3: Career Discovery
**Goal**: A student who has completed the quiz can browse, search, and filter career matches to find careers relevant to their interests, marks, and province
**Depends on**: Phase 1, Phase 2
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04
**Success Criteria** (what must be TRUE):
  1. User can see a career results list pre-filtered by their RIASEC type codes from the quiz
  2. User can filter the career list by APS eligibility status (eligible / within reach / not yet) and see only matching careers
  3. User can type a career name or field into a search box and see fuzzy-matched results within 300ms
  4. User can select a province from a dropdown and the career list updates to show careers with demand in that province
**Plans**: TBD

Plans:
- [ ] 03-01: Career list UI with RIASEC + APS filter chips, TanStack Query data loading from master index
- [ ] 03-02: Fuse.js fuzzy search integration, province dropdown filter, URL param persistence for all filters

### Phase 4: Career Detail and Bursary Finder
**Goal**: A student can read a complete career detail page, understand exactly what they need to qualify, and find bursaries to fund that path — completing the core discovery loop
**Depends on**: Phase 3
**Requirements**: DETA-01, DETA-02, DETA-03, BURS-01, BURS-02, BURS-03
**Success Criteria** (what must be TRUE):
  1. User can view a career detail page showing matric requirements, APS threshold, university and TVET pathways, salary ranges, and linked bursaries
  2. User sees an eligibility badge (Eligible / X APS short / Missing subject) derived from their APS score and subjects entered in the quiz
  3. User can tap a WhatsApp share button and the resulting URL is under 200 characters and includes OG preview metadata
  4. User can browse the bursary list (200+ entries) and filter by career field or SA province
  5. NSFAS eligibility check result is visible alongside the bursary list without requiring any additional input
**Plans**: TBD

Plans:
- [ ] 04-01: Career detail page (overview, eligibility badge, matric requirements, university/TVET pathways, salary)
- [ ] 04-02: Bursary cross-reference on career detail, WhatsApp share button + OG tags, bursary list page with field + province filters

### Phase 5: Study Library
**Goal** [v2]: Students can navigate grade-specific subject content and access study materials directly linked to career relevance
**Depends on**: Phase 4
**Requirements**: STUD-01, STUD-02, STUD-03, STUD-04
**Success Criteria** (what must be TRUE):
  1. User can navigate to a subject by grade (10/11/12) and select a topic
  2. Each topic displays an explanation, worked example, practice questions, YouTube link, and career relevance tags
  3. YouTube embeds are hidden in data saver mode and topic text content still displays in full
  4. Career skills content (coding, electrical, plumbing, business) is accessible from the study library
**Plans**: TBD

### Phase 6: PWA, Polish, and Deploy
**Goal** [v2]: The app works offline for previously-visited pages, anonymous analytics are captured, and optional account saving is available
**Depends on**: Phase 5
**Requirements**: PWA-01, PWA-02, PWA-03, AUTH-01, AUTH-02, AUTH-03, PROV-01, PROV-02, TOOL-01, TOOL-02
**Success Criteria** (what must be TRUE):
  1. Previously-visited career and subject pages load without a network connection
  2. An offline banner appears when connectivity is lost; cached pages remain accessible
  3. A new-version notification appears when a service worker update is available (no silent reload)
  4. Anonymous quiz events are logged to Supabase without blocking UI rendering
  5. User can optionally create an account to save quiz results and career matches across devices
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Foundation and Configuration | 0/2 | Not started | - |
| 1. Quiz Engine | 0/2 | Not started | - |
| 2. Data Architecture | 0/2 | Not started | - |
| 3. Career Discovery | 0/2 | Not started | - |
| 4. Career Detail and Bursary Finder | 0/2 | Not started | - |
| 5. Study Library | 0/TBD | Not started (v2) | - |
| 6. PWA, Polish, and Deploy | 0/TBD | Not started (v2) | - |
