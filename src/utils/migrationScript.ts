import { CACHE_KEYS } from '../config/storageStrategy'
import { storage } from '../services/storageService'

// ── Migration runner ──────────────────────────────────────────────────────────
// Called once on App mount. Safe to run every time — each migration checks
// whether it needs to run before doing anything.

const MIGRATION_VERSION_KEY = 'prospect_migration_v'
const CURRENT_VERSION = 2

export function runMigrations(): void {
  if (typeof window === 'undefined') return

  const completed = parseInt(localStorage.getItem(MIGRATION_VERSION_KEY) ?? '0', 10)
  if (completed >= CURRENT_VERSION) return

  if (completed < 1) migration1()
  if (completed < 2) migration2()

  localStorage.setItem(MIGRATION_VERSION_KEY, String(CURRENT_VERSION))
}

// ── Migration 1: rename old study progress key ────────────────────────────────
// Old key: 'study_progress' → new key: 'prospect_study_progress_v2'
function migration1(): void {
  const oldKey = 'study_progress'
  const old = localStorage.getItem(oldKey)
  if (old) {
    try {
      // Only migrate if new key doesn't already have data
      if (!localStorage.getItem(CACHE_KEYS.STUDY_PROGRESS)) {
        localStorage.setItem(CACHE_KEYS.STUDY_PROGRESS, old)
      }
      localStorage.removeItem(oldKey)
    } catch {
      // ignore
    }
  }
}

// ── Migration 2: rename old calendar events key ───────────────────────────────
// Old key: 'calendar_events' → new key: 'prospect_calendar_events_v2'
function migration2(): void {
  const oldKey = 'calendar_events'
  const old = localStorage.getItem(oldKey)
  if (old) {
    try {
      if (!localStorage.getItem(CACHE_KEYS.CALENDAR_EVENTS)) {
        // Old format was study_events array — wrap as UserCalendarEvent array if possible
        const parsed = JSON.parse(old)
        if (Array.isArray(parsed)) {
          storage.set(CACHE_KEYS.CALENDAR_EVENTS, parsed)
        }
      }
      localStorage.removeItem(oldKey)
    } catch {
      // ignore
    }
  }
}
