// ── Cache Keys ────────────────────────────────────────────────────────────────
// All localStorage keys in one place — change here, changes everywhere

export const CACHE_KEYS = {
  // Career Guide (already working — do not change these keys)
  QUIZ_RESULTS:       'prospect_quiz_results_v2',
  SAVED_CAREERS:      'prospect_career_bookmarks_v2',
  SAVED_BURSARIES:    'prospect_bursary_bookmarks_v2',

  // School Assist (new — localStorage-first layer added in Phase 1)
  STUDY_PROGRESS:     'prospect_study_progress_v2',
  CALENDAR_EVENTS:    'prospect_calendar_events_v2',
  LEARNING_PATHS:     'prospect_learning_paths_v2',
} as const

export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]

// ── Sync Rules ────────────────────────────────────────────────────────────────
// Rule 1: localStorage is the primary source — always read/write there first
// Rule 2: Supabase sync only runs when a user is logged in
// Rule 3: Sync happens:
//   - On login  → pull Supabase → merge into localStorage (Supabase wins)
//   - On write  → write localStorage first, then push to Supabase in background
//   - Every 5m  → background push of any dirty data if navigator.onLine
// Rule 4: Conflict resolution → Supabase wins for authenticated users
//   (rationale: user may have used the app on another device)

export const SYNC_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// ── Supabase Table Names ──────────────────────────────────────────────────────
export const SUPABASE_TABLES = {
  STUDY_PROGRESS:   'study_progress',
  CALENDAR_EVENTS:  'calendar_events',
  LEARNING_PROGRESS: 'learning_progress',
} as const
