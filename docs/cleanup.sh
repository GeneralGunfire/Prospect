#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Prospect codebase cleanup — Phase 1 (safe deletes only)
#
# This script deletes files identified by the audit as having ZERO importers
# in the active code path. It does NOT move or rename anything; that is
# Phase 2 in MIGRATION_GUIDE.md and must be done by hand (with import-path
# updates).
#
# Run from repo root (C:/test/landingpage). Re-runnable: missing files are
# tolerated. After running:
#
#   npm run lint && npm run build && npm test
#
# then commit. See CLEANUP_CHECKLIST.md and MIGRATION_GUIDE.md for the
# full multi-phase plan.
# ─────────────────────────────────────────────────────────────────────────────

set -u   # fail on use of undefined var; do NOT use -e — we tolerate missing files

# Resolve script directory and move up to repo root (landingpage/).
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${HERE}/.." && pwd)"
cd "${ROOT}"

echo "Cleanup running in: ${ROOT}"
echo

# Helper: rm -f with a friendly log line; tolerates already-missing files.
del() {
    if [ -e "$1" ]; then
        rm -f "$1"
        echo "  removed  $1"
    else
        echo "  skipped  $1  (already gone)"
    fi
}

# Helper: rmdir if empty; tolerates non-empty / missing dirs.
del_dir_if_empty() {
    if [ -d "$1" ]; then
        if [ -z "$(ls -A "$1")" ]; then
            rmdir "$1"
            echo "  rmdir    $1"
        else
            echo "  keep     $1  (not empty)"
        fi
    else
        echo "  skipped  $1  (already gone)"
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
echo "[1/9] Orphan pages (declared in AppPage union but never rendered)"
# ─────────────────────────────────────────────────────────────────────────────
# App.tsx has the comment '// NewsPage removed — SA News feature discontinued'
# but the page files were left behind. DisadvantagedGuide.tsx is similarly
# orphaned: no `page === 'disadvantaged-guide'` branch exists in App.tsx.
del "src/pages/NewsPage.tsx"
del "src/pages/NewsAuthPage.tsx"
del "src/pages/DisadvantagedGuide.tsx"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[2/9] Unused app components (defined but never rendered)"
# ─────────────────────────────────────────────────────────────────────────────
# Verified by `grep -rn "<ComponentName"` returning no JSX consumers.
# Most are remnants of an earlier learning-path UI that is now inlined inside
# pages/learning/Algebra/Grade10/Term1/{LinearEquations,SimultaneousEquations}.tsx.
del "src/components/AlgebraProgressCard.tsx"
del "src/components/CommunityNav.tsx"
del "src/components/DashboardVideoGrid.tsx"
del "src/components/DiagnosticQuiz.tsx"
del "src/components/EmptyState.tsx"          # WaterDashboardPage defines its own local EmptyState
del "src/components/GuidedPractice.tsx"      # replaced by inline GuidedPracticeModule in lesson pages
del "src/components/IndependentPractice.tsx"
del "src/components/LessonBlock.tsx"
del "src/components/SmartFeedback.tsx"
del "src/components/VideoPlayer.tsx"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[3/9] Unused lessons/shared/* (entire subfolder)"
# ─────────────────────────────────────────────────────────────────────────────
del "src/components/lessons/shared/EquationBox.tsx"
del "src/components/lessons/shared/LessonCard.tsx"
del "src/components/lessons/shared/QuizOptionCard.tsx"
del "src/components/lessons/shared/ResultsCard.tsx"
del "src/components/lessons/shared/SpeechBubble.tsx"
del "src/components/lessons/shared/StepIndicator.tsx"
del_dir_if_empty "src/components/lessons/shared"
del_dir_if_empty "src/components/lessons"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[4/9] Stub UI variants in src/components/ui/"
# ─────────────────────────────────────────────────────────────────────────────
# These are NOT the ones App.tsx uses. App.tsx imports from root /components/ui/
# (../components/ui/...). The src/components/ui/ folder contains divergent,
# smaller stub variants that are never imported.
del "src/components/ui/animated-hero.tsx"
del "src/components/ui/category-list.tsx"
del "src/components/ui/event-scheduler.tsx"
del "src/components/ui/logo-cloud-2.tsx"
del "src/components/ui/neo-minimal-footer.tsx"
del_dir_if_empty "src/components/ui"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[5/9] Unused services / hooks"
# ─────────────────────────────────────────────────────────────────────────────
# Replaced by services/storageService.ts (calendarStorage, studyProgressStorage).
del "src/services/calendarService.ts"
del "src/services/studyProgressService.ts"
# No consumers anywhere; localStorage is accessed directly via storageService.
del "src/hooks/useLocalStorage.ts"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[6/9] Orphan data file"
# ─────────────────────────────────────────────────────────────────────────────
# Linear-equation lesson content is hardcoded inside LinearEquations.tsx;
# this JSON file has no `import` referencing it.
del "src/data/lessons/linear-equations.json"
del_dir_if_empty "src/data/lessons"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[7/9] Conditionally dead util (after [2] and [3] above)"
# ─────────────────────────────────────────────────────────────────────────────
# trackingLogic.ts is only imported by AlgebraProgressCard, IndependentPractice,
# and DiagnosticQuiz — all deleted in step [2]. Now safe to remove.
del "src/utils/trackingLogic.ts"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[8/9] Empty learning scaffolding directories"
# ─────────────────────────────────────────────────────────────────────────────
# Empty placeholders — no .ts files inside, just abandoned scaffolding.
del_dir_if_empty "src/pages/learning/Algebra/Grade10/Term2"
del_dir_if_empty "src/pages/learning/Algebra/Grade11"
del_dir_if_empty "src/pages/learning/Geometry"
del_dir_if_empty "src/tests"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "[9/9] Legacy root /components/ui/ — 20 unused shadcn-style files"
# ─────────────────────────────────────────────────────────────────────────────
# The root components/ui/ folder has 24 files. App.tsx and main.tsx import only
# 4 of them (animated-hero, logo-cloud-2, neo-minimal-footer, toast).
# The other 20 are leftover scaffolding from a shadcn/ui setup that was never
# wired in. Removing them also lets us drop several unused dependencies in
# Phase 4 (date-fns, react-day-picker, @radix-ui/react-popover, etc.).
del "components/ui/animated-icons.tsx"
del "components/ui/badge.tsx"
del "components/ui/button.tsx"
del "components/ui/calendar.tsx"
del "components/ui/card.tsx"
del "components/ui/category-list.tsx"
del "components/ui/event-scheduler.tsx"
del "components/ui/glass-calendar.tsx"
del "components/ui/input.tsx"
del "components/ui/menu-hover-effects.tsx"
del "components/ui/modal.tsx"
del "components/ui/modern-side-bar.tsx"
del "components/ui/morphing-square.tsx"
del "components/ui/popover.tsx"
del "components/ui/progress.tsx"
del "components/ui/select.tsx"
del "components/ui/skeleton.tsx"
del "components/ui/tabs.tsx"
del "components/ui/textarea.tsx"
del "components/ui/travel-connect-signin-1.tsx"

# ─────────────────────────────────────────────────────────────────────────────
echo
echo "Done. Next steps:"
echo
echo "  1) npm run lint          # tsc --noEmit must pass"
echo "  2) npm run build         # vite build must succeed"
echo "  3) npm test              # Playwright specs must pass"
echo "  4) git status            # review the deletion list"
echo "  5) git add -A && git commit -m \"chore: remove unused pages, components, and stub UI files\""
echo
echo "Then proceed to Phase 2 in CLEANUP_CHECKLIST.md (folder reorganization)."
echo "Phase 2 requires editing imports and is NOT done by this script."
