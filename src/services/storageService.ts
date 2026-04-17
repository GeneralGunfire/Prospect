import { CACHE_KEYS } from '../config/storageStrategy'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StudyProgress {
  topicId: string
  subjectId: string
  status: 'not-started' | 'in-progress' | 'mastered' | 'needs-practice' | 'struggling'
  score: number
  hintsUsed: number
  attempts: number
  diagnosticLevel?: 'strong' | 'medium' | 'weak'
  lastActivity: string // ISO date
}

export interface UserCalendarEvent {
  id: string
  eventName: string
  eventDate: string // YYYY-MM-DD
  category: 'exam' | 'deadline' | 'holiday' | 'other'
  color?: string
  notes?: string
  createdAt: string
}

export interface LearningPathProgress {
  pathId: string
  topicStatuses: Record<string, StudyProgress>
  lastActivity: string
}

// ── Generic storage helpers ───────────────────────────────────────────────────

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded — fail silently
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

// ── Study progress storage ────────────────────────────────────────────────────

function getAllProgress(): Record<string, StudyProgress> {
  return storage.get<Record<string, StudyProgress>>(CACHE_KEYS.STUDY_PROGRESS) ?? {}
}

export const studyProgressStorage = {
  saveProgress(topicId: string, data: Omit<StudyProgress, 'topicId' | 'lastActivity'>): void {
    const all = getAllProgress()
    all[topicId] = { ...data, topicId, lastActivity: new Date().toISOString() }
    storage.set(CACHE_KEYS.STUDY_PROGRESS, all)
  },

  getProgress(topicId: string): StudyProgress | null {
    return getAllProgress()[topicId] ?? null
  },

  getProgressBySubject(subjectId: string): StudyProgress[] {
    return Object.values(getAllProgress()).filter(p => p.subjectId === subjectId)
  },

  getAllProgress(): Record<string, StudyProgress> {
    return getAllProgress()
  },

  clearProgress(): void {
    storage.remove(CACHE_KEYS.STUDY_PROGRESS)
  },
}

// ── Calendar event storage ────────────────────────────────────────────────────

function getAllEvents(): UserCalendarEvent[] {
  return storage.get<UserCalendarEvent[]>(CACHE_KEYS.CALENDAR_EVENTS) ?? []
}

export const calendarStorage = {
  saveEvent(event: UserCalendarEvent): void {
    const events = getAllEvents()
    const existing = events.findIndex(e => e.id === event.id)
    if (existing >= 0) {
      events[existing] = event
    } else {
      events.push(event)
    }
    storage.set(CACHE_KEYS.CALENDAR_EVENTS, events)
  },

  getEvents(): UserCalendarEvent[] {
    return getAllEvents()
  },

  deleteEvent(eventId: string): void {
    const events = getAllEvents().filter(e => e.id !== eventId)
    storage.set(CACHE_KEYS.CALENDAR_EVENTS, events)
  },

  updateEvent(eventId: string, updates: Partial<UserCalendarEvent>): void {
    const events = getAllEvents().map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    )
    storage.set(CACHE_KEYS.CALENDAR_EVENTS, events)
  },

  clearEvents(): void {
    storage.remove(CACHE_KEYS.CALENDAR_EVENTS)
  },
}

// ── Learning path storage ─────────────────────────────────────────────────────

function getAllPaths(): Record<string, LearningPathProgress> {
  return storage.get<Record<string, LearningPathProgress>>(CACHE_KEYS.LEARNING_PATHS) ?? {}
}

export const learningPathStorage = {
  saveTopicProgress(pathId: string, topicId: string, progress: StudyProgress): void {
    const all = getAllPaths()
    if (!all[pathId]) {
      all[pathId] = { pathId, topicStatuses: {}, lastActivity: new Date().toISOString() }
    }
    all[pathId].topicStatuses[topicId] = progress
    all[pathId].lastActivity = new Date().toISOString()
    storage.set(CACHE_KEYS.LEARNING_PATHS, all)
  },

  getPathProgress(pathId: string): LearningPathProgress | null {
    return getAllPaths()[pathId] ?? null
  },

  getTopicProgress(pathId: string, topicId: string): StudyProgress | null {
    return getAllPaths()[pathId]?.topicStatuses[topicId] ?? null
  },

  clearPath(pathId: string): void {
    const all = getAllPaths()
    delete all[pathId]
    storage.set(CACHE_KEYS.LEARNING_PATHS, all)
  },
}
