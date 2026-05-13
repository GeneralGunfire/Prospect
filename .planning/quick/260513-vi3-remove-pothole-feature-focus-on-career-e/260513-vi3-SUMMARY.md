---
phase: 260513-vi3
plan: 01
type: quick-task
subsystem: community
tags: [refactor, cleanup, pothole, routing]
key-files:
  deleted:
    - src/pages/community/PotholeMapPage.tsx
    - src/pages/community/FlagPotholePage.tsx
    - src/pages/community/MyContributionsPage.tsx
    - src/services/potholeService.ts
    - src/hooks/usePotholeValidation.ts
    - src/data/saLocations.ts
    - src/utils/suspiciousPatterns.ts
  modified:
    - src/lib/withAuth.tsx
    - src/App.tsx
    - src/components/shell/AppHeader.tsx
    - src/pages/auth/ImpactAuthPage.tsx
decisions:
  - Community nav item redirected from pothole-map to community-impact
  - Construction and Users lucide-react imports removed as no longer used
metrics:
  completed: 2026-05-13
---

# Phase 260513-vi3 Plan 01: Remove Pothole Feature Summary

Removed the pothole reporting feature entirely; Community surface area now points to community-impact hub with water, tax, cost-of-living, and civics tools remaining.

## Tasks Completed

| # | Task | Status |
|---|------|--------|
| 1 | Delete pothole source files and update routing/types | Done |
| 2 | Purge pothole references from AppHeader and ImpactAuthPage | Done |

## Files Deleted (7)

- `src/pages/community/PotholeMapPage.tsx`
- `src/pages/community/FlagPotholePage.tsx`
- `src/pages/community/MyContributionsPage.tsx`
- `src/services/potholeService.ts`
- `src/hooks/usePotholeValidation.ts`
- `src/data/saLocations.ts` (only used by pothole files)
- `src/utils/suspiciousPatterns.ts` (only used by pothole files)

No Playwright pothole test files were found — nothing to delete.

## Files Patched (4)

- `src/lib/withAuth.tsx` — removed `'pothole-map' | 'flag-pothole' | 'my-pothole-contributions'` from AppPage union
- `src/App.tsx` — removed 3 lazy imports, changed Community nav from `pothole-map` to `community-impact`, updated two description strings, removed footer Pothole Map link, deleted 3 route render blocks
- `src/components/shell/AppHeader.tsx` — removed Pothole Map entry from COMMUNITY_NAV, updated doc comment, removed unused `Construction` import
- `src/pages/auth/ImpactAuthPage.tsx` — removed pothole features array entry, removed unused `Users` import

## Incidental Cleanup

- Removed `Construction` from lucide-react import in AppHeader.tsx (no other usages)
- Removed `Users` from lucide-react import in ImpactAuthPage.tsx (no other usages)

## Build Result

`npm run build` passed with 0 TypeScript errors. Only pre-existing chunk size warnings present (not errors).

## Commit

`2e6828b` — refactor: remove pothole feature, focus on career+education+civic awareness

## Self-Check: PASSED

- All 7 source files deleted from disk
- `src/lib/withAuth.tsx` AppPage union has no pothole members
- `src/App.tsx` has no pothole imports, routes, nav, or footer entries
- `src/components/shell/AppHeader.tsx` COMMUNITY_NAV has no Pothole Map entry
- `src/pages/auth/ImpactAuthPage.tsx` features array has no pothole entry
- Repo-wide grep for `pothole|Pothole` in `src/` returns zero matches
- Build passed cleanly
- Commit `2e6828b` exists on disk
