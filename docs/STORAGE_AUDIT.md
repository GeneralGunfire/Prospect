# Storage Audit — Prospect

## Current State (as of Phase 2 audit)

### What already works ✅

| Service | localStorage key | Supabase table | Pattern |
|---------|-----------------|----------------|---------|
| Quiz results | `prospect_quiz_results_v2` | `quiz_results` | localStorage-first, background sync |
| Career bookmarks | `prospect_career_bookmarks_v2` | `user_bookmarks` | localStorage-first, background sync |
| Bursary bookmarks | `prospect_bursary_bookmarks_v2` | `user_bookmarks` | localStorage-first, background sync |

### What is broken / missing ❌

| Data | Problem | Fix |
|------|---------|-----|
| Study progress | Supabase-only — offline users lose all progress | Add localStorage layer to `studyProgressService.ts` |
| Calendar events | Supabase-only (`study_events` table) — no offline, fails for guests | Add localStorage layer; `calendarStorageService.ts` |
| Learning path progress | Does not exist at all | New: `storageService.ts` + `demoLearningPath.ts` |

---

## Data That Needs to Persist

| Data | localStorage key | Supabase table | Priority |
|------|-----------------|----------------|----------|
| Quiz results | `prospect_quiz_results_v2` | `quiz_results` | ✅ Done |
| Saved careers | `prospect_career_bookmarks_v2` | `user_bookmarks` | ✅ Done |
| Saved bursaries | `prospect_bursary_bookmarks_v2` | `user_bookmarks` | ✅ Done |
| Study progress | `prospect_study_progress_v2` | `study_progress` | 🔧 Fix needed |
| Calendar events | `prospect_calendar_events_v2` | `calendar_events` | 🔧 Fix needed |
| Learning paths | `prospect_learning_paths_v2` | `learning_progress` | 🆕 New |

---

## Sync Strategy (all services must follow this)

1. **Read**: Return localStorage immediately — zero loading state
2. **Write**: Write to localStorage immediately — instant feedback
3. **Sync**: Background setTimeout(0) push to Supabase (non-blocking)
4. **On login**: Pull from Supabase → merge into localStorage (Supabase wins on conflict)
5. **Conflict**: Supabase is source of truth for authenticated users

---

## Supabase Tables Needed

```sql
-- New table needed for calendar user events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,  -- YYYY-MM-DD
  category TEXT NOT NULL CHECK (category IN ('exam', 'deadline', 'holiday', 'other')),
  color TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own calendar events" ON calendar_events
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- New table for learning path progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not-started', 'in-progress', 'mastered', 'needs-practice', 'struggling')),
  score INT,
  hints_used INT DEFAULT 0,
  attempts INT DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, path_id, topic_id)
);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own learning progress" ON learning_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```
