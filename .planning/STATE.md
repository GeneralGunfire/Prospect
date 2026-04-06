# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-25)

**Core value:** A student with a matric report card and 10 minutes must be able to discover a realistic career path, see exactly what to study and where, find bursary funding, and understand what demand exists for that career in their province — all for free, no login required.
**Current focus:** Phase 0 — Foundation and Configuration

## Current Position

Phase: 0 of 7 (Foundation and Configuration)
Plan: 0 of 2 in current phase
Status: Ready to plan
Last activity: 2026-03-25 — Roadmap created; all 24 v1 requirements mapped across Phases 0-4; Phases 5-6 stubbed for v2

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Phase 0 must lock in Vercel `cpt1` region and PWA cache tiers before any feature work — infrastructure decisions are not reversible cheaply
- [Roadmap]: Phase 2 (Data Architecture) runs before Phase 3 (Career Discovery) — schema changes after UI is built are the most expensive rework in this project
- [Roadmap]: Province SVG map deferred to v2 (PROV-01, PROV-02); province dropdown (DISC-04) ships in Phase 3
- [Research]: NSFAS R350K income threshold must be verified against current NSFAS website before Phase 1 — thresholds change annually
- [Research]: Study library content licensing (Khan Academy, OpenStax) must be verified before Phase 5 content creation

### Pending Todos

None yet.

### Blockers/Concerns

- [Research flag] Phase 2: Existing career JSONs may need schema migration for `subjects_required[]` arrays — audit actual records before estimating data migration effort
- [Research flag] Phase 5: Content sourcing and licensing for SA CAPS curriculum not yet verified
- [Research flag] Phase 6: Supabase free tier pause behaviour and 500MB limit should be verified at supabase.com/pricing before implementation

## Session Continuity

Last session: 2026-03-25
Stopped at: Roadmap created — ROADMAP.md and STATE.md written; REQUIREMENTS.md traceability section already populated
Resume file: None
