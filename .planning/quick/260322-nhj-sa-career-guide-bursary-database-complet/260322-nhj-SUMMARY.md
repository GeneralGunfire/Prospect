---
phase: quick
plan: 260322-nhj
subsystem: data
tags: [bursaries, database, audit, gap-fill, v2-schema]
dependency_graph:
  requires: [data/bursaries/bursaries.json, data/careers/_master-index.json]
  provides: [data/bursaries/bursaries.json, data/bursaries/BURSARY-REVIEW.md]
  affects: [career matching, bursary recommendations]
tech_stack:
  added: []
  patterns: [v2-bursary-schema, careerIds-cross-reference]
key_files:
  modified:
    - data/bursaries/bursaries.json
    - data/bursaries/BURSARY-REVIEW.md
decisions:
  - Added thuthuka as distinct entry from saica-thuthuka (need-based variant with income threshold R350k)
  - Omitted petroleum-engineer, criminologist, international-relations-officer from careerIds — no matching slugs in master index
  - Used public-administrator as nearest match for DIRCO's international relations focus
metrics:
  duration: ~45 minutes
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_modified: 2
  bursaries_added: 26
  total_bursaries: 245
---

# Quick Task 260322-nhj: SA Career Guide Bursary Database Completion

Gap-fill audit of bursaries.json: 26 missing bursaries added across 10 SA funding categories to reach 245 total entries, plus updated BURSARY-REVIEW.md audit document.

## What Was Done

### Task 1: Audit and Gap-Fill (bursaries.json)

Starting from 219 bursaries (already in v2 schema from prior task run), compared against the user's target list of ~50 bursaries across 10 categories. Found 24 already present (skipped) and added 26 genuinely missing entries.

**26 new bursaries added:**

| Category | New Entries |
|----------|-------------|
| Government/Public Sector | nsfas-disability, saps, dirco, sa-weather-service, csir, dsi-innovation |
| Mining/Resources | exxaro, vedanta-zinc, master-drilling |
| Energy/Utilities | ipp-office |
| Banking/Finance | pic |
| Technology/ICT | ioco, bbd |
| Healthcare/Pharma | solidarity-health |
| Construction/Built Environment | afrisam, lafarge-sa, sapoa, sacap |
| Agriculture/Food | clover, bayer-crop-science, sabi |
| SETA | cathsseta, pseta, services-seta |
| NGO/Foundation | thuthuka, cfa-institute |

Final bursaries.json: **245 entries**, zero duplicates, zero invalid careerIds, all 15 schema fields present on every entry.

### Task 2: BURSARY-REVIEW.md Audit Document

Updated audit document covering all 6 required sections:
1. Summary — totals: 245 total, 219 prior, 26 added, 24 skipped
2. Category Breakdown — 10 categories with target vs actual counts
3. New Additions — table of all 26 new entries
4. Skipped — 24 entries that already existed with reasons
5. Career ID Flags — 3 unmappable desired careers, 83 career slugs with zero bursary coverage
6. Schema Validation — all 245 entries PASS 15-field check

## Verification Results

```
Total: 245
Duplicates: 0
Invalid careerIds: 0
Schema issues: 0
Missing review sections: 0
OVERALL: PASS
```

## Deviations from Plan

None — plan executed exactly as written. All 26 target bursaries that were missing were added; all bursaries that already existed were correctly skipped.

## Commits

- `ac96e58` — feat(quick-01): add 26 missing bursaries to reach 245 total entries
- `adf2d17` — feat(quick-01): create BURSARY-REVIEW.md audit document

## Self-Check

- [x] data/bursaries/bursaries.json — 245 entries, v2 schema, all validations pass
- [x] data/bursaries/BURSARY-REVIEW.md — 6 required sections present
- [x] Commits ac96e58 and adf2d17 exist in git log
