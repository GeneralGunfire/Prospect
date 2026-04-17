// Supabase sync layer for School Assist data
// Follows the same pattern as bookmarkService.ts:
//   - localStorage is primary (instant reads/writes)
//   - Supabase is secondary (background sync, wins on conflict at login)

import { SUPABASE_TABLES, SYNC_INTERVAL_MS } from '../config/storageStrategy'
import {
  studyProgressStorage,
  calendarStorage,
  learningPathStorage,
  type StudyProgress,
  type UserCalendarEvent,
} from './storageService'

let syncIntervalId: ReturnType<typeof setInterval> | null = null

// ── On Login: pull from Supabase → merge into localStorage ───────────────────

export async function syncUserDataOnLogin(userId: string): Promise<void> {
  if (!userId) return
  try {
    const { supabase } = await import('../lib/supabase')

    const [progressResult, eventsResult, learningResult] = await Promise.allSettled([
      supabase
        .from(SUPABASE_TABLES.STUDY_PROGRESS)
        .select('*')
        .eq('user_id', userId),
      supabase
        .from(SUPABASE_TABLES.CALENDAR_EVENTS)
        .select('*')
        .eq('user_id', userId),
      supabase
        .from(SUPABASE_TABLES.LEARNING_PROGRESS)
        .select('*')
        .eq('user_id', userId),
    ])

    // Merge study progress — Supabase wins
    if (progressResult.status === 'fulfilled' && progressResult.value.data) {
      for (const row of progressResult.value.data) {
        studyProgressStorage.saveProgress(row.topic_id, {
          subjectId: row.subject,
          status: row.status ?? 'in-progress',
          score: row.score ?? 0,
          hintsUsed: row.hints_used ?? 0,
          attempts: row.attempts ?? 0,
          diagnosticLevel: row.diagnostic_level,
        })
      }
    }

    // Merge calendar events — Supabase wins
    if (eventsResult.status === 'fulfilled' && eventsResult.value.data) {
      for (const row of eventsResult.value.data) {
        const event: UserCalendarEvent = {
          id: row.id,
          eventName: row.event_name,
          eventDate: row.event_date,
          category: row.category,
          color: row.color,
          notes: row.notes,
          createdAt: row.created_at,
        }
        calendarStorage.saveEvent(event)
      }
    }

    // Merge learning path progress — Supabase wins
    if (learningResult.status === 'fulfilled' && learningResult.value.data) {
      for (const row of learningResult.value.data) {
        const progress: StudyProgress = {
          topicId: row.topic_id,
          subjectId: row.subject ?? '',
          status: row.status,
          score: row.score ?? 0,
          hintsUsed: row.hints_used ?? 0,
          attempts: row.attempts ?? 0,
          lastActivity: row.last_activity,
        }
        learningPathStorage.saveTopicProgress(row.path_id, row.topic_id, progress)
      }
    }
  } catch {
    // Supabase unavailable — localStorage is already the source of truth
  }
}

// ── Background sync: push dirty localStorage data to Supabase ────────────────

async function pushDirtyDataToSupabase(userId: string): Promise<void> {
  if (!userId || !navigator.onLine) return
  try {
    const { supabase } = await import('../lib/supabase')

    // Push study progress
    const allProgress = studyProgressStorage.getAllProgress()
    for (const progress of Object.values(allProgress)) {
      supabase
        .from(SUPABASE_TABLES.STUDY_PROGRESS)
        .upsert({
          user_id: userId,
          topic_id: progress.topicId,
          subject: progress.subjectId,
          status: progress.status,
          score: progress.score,
          hints_used: progress.hintsUsed,
          attempts: progress.attempts,
          diagnostic_level: progress.diagnosticLevel,
          last_activity: progress.lastActivity,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,topic_id' })
        .catch(() => {})
    }

    // Push calendar events
    const events = calendarStorage.getEvents()
    for (const event of events) {
      supabase
        .from(SUPABASE_TABLES.CALENDAR_EVENTS)
        .upsert({
          id: event.id,
          user_id: userId,
          event_name: event.eventName,
          event_date: event.eventDate,
          category: event.category,
          color: event.color,
          notes: event.notes,
          created_at: event.createdAt,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .catch(() => {})
    }
  } catch {
    // Fail silently — will retry on next interval
  }
}

// ── Push a single progress update immediately (called after user action) ──────

export async function pushProgress(
  userId: string,
  pathId: string,
  topicId: string,
  progress: StudyProgress
): Promise<void> {
  if (!userId) return
  try {
    const { supabase } = await import('../lib/supabase')
    setTimeout(() => {
      supabase
        .from(SUPABASE_TABLES.LEARNING_PROGRESS)
        .upsert({
          user_id: userId,
          path_id: pathId,
          topic_id: topicId,
          status: progress.status,
          score: progress.score,
          hints_used: progress.hintsUsed,
          attempts: progress.attempts,
          last_activity: progress.lastActivity,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,path_id,topic_id' })
        .catch(() => {})
    }, 0)
  } catch {
    // localStorage already saved — this is best-effort
  }
}

// ── Push a single calendar event immediately ──────────────────────────────────

export async function pushCalendarEvent(
  userId: string,
  event: UserCalendarEvent
): Promise<void> {
  if (!userId) return
  try {
    const { supabase } = await import('../lib/supabase')
    setTimeout(() => {
      supabase
        .from(SUPABASE_TABLES.CALENDAR_EVENTS)
        .upsert({
          id: event.id,
          user_id: userId,
          event_name: event.eventName,
          event_date: event.eventDate,
          category: event.category,
          color: event.color,
          notes: event.notes,
          created_at: event.createdAt,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .catch(() => {})
    }, 0)
  } catch {
    // Best-effort
  }
}

// ── Delete a calendar event from Supabase ────────────────────────────────────

export async function deleteCalendarEvent(userId: string, eventId: string): Promise<void> {
  if (!userId) return
  try {
    const { supabase } = await import('../lib/supabase')
    setTimeout(() => {
      supabase
        .from(SUPABASE_TABLES.CALENDAR_EVENTS)
        .delete()
        .match({ id: eventId, user_id: userId })
        .catch(() => {})
    }, 0)
  } catch {
    // Best-effort
  }
}

// ── Background sync interval ──────────────────────────────────────────────────

export function startBackgroundSync(userId: string): void {
  if (syncIntervalId) clearInterval(syncIntervalId)
  syncIntervalId = setInterval(() => {
    if (navigator.onLine && userId) {
      pushDirtyDataToSupabase(userId)
    }
  }, SYNC_INTERVAL_MS)
}

export function stopBackgroundSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId)
    syncIntervalId = null
  }
}
