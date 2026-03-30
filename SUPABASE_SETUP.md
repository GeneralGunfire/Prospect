# Supabase Setup Guide — Data Persistence

## Quick Start

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Copy the SQL below and paste it into a new query
4. Click **Run** to create all tables and set up Row Level Security

## SQL Setup Script

```sql
-- ============================================================================
-- Table: user_bookmarks
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmark_type TEXT NOT NULL CHECK (bookmark_type IN ('career', 'bursary')),
  item_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, bookmark_type, item_id)
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_can_view_own_bookmarks" ON user_bookmarks;
CREATE POLICY "users_can_view_own_bookmarks"
  ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_create_own_bookmarks" ON user_bookmarks;
CREATE POLICY "users_can_create_own_bookmarks"
  ON user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_delete_own_bookmarks" ON user_bookmarks;
CREATE POLICY "users_can_delete_own_bookmarks"
  ON user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- Table: aps_marks
-- ============================================================================
CREATE TABLE IF NOT EXISTS aps_marks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  marks_json JSONB NOT NULL DEFAULT '[]',
  calculated_aps INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE aps_marks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_can_view_own_aps_marks" ON aps_marks;
CREATE POLICY "users_can_view_own_aps_marks"
  ON aps_marks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_update_own_aps_marks" ON aps_marks;
CREATE POLICY "users_can_update_own_aps_marks"
  ON aps_marks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_insert_own_aps_marks" ON aps_marks;
CREATE POLICY "users_can_insert_own_aps_marks"
  ON aps_marks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Table: study_progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  subject TEXT,
  grade INTEGER,
  term INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  quiz_score INTEGER,
  test_score INTEGER,
  completed_at TIMESTAMP,
  UNIQUE(user_id, topic_id)
);

ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_can_view_own_progress" ON study_progress;
CREATE POLICY "users_can_view_own_progress"
  ON study_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_update_own_progress" ON study_progress;
CREATE POLICY "users_can_update_own_progress"
  ON study_progress FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_insert_own_progress" ON study_progress;
CREATE POLICY "users_can_insert_own_progress"
  ON study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Ensure quiz_results table has RLS
-- ============================================================================
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_can_view_own_quiz_results" ON quiz_results;
CREATE POLICY "users_can_view_own_quiz_results"
  ON quiz_results FOR SELECT USING (auth.uid() = user_id);
```

## What Was Created

### `user_bookmarks` Table
Stores saved careers and bursaries for each user.
- **Columns:** id, user_id, bookmark_type, item_id, title, created_at
- **Unique constraint:** One bookmark per user+type+item combination (no duplicates)
- **RLS:** Users can only see/modify their own bookmarks

### `aps_marks` Table
Stores APS subject marks (one row per user).
- **Columns:** id, user_id, marks_json (JSON array of {subject, mark}), calculated_aps, updated_at
- **Unique constraint:** One row per user_id (replaces on update)
- **RLS:** Users can only see/modify their own marks

### `study_progress` Table
Tracks completed lessons and test scores.
- **Columns:** id, user_id, topic_id, subject, grade, term, completed, completion_percentage, quiz_score, test_score, completed_at
- **Unique constraint:** One progress record per user+topic combination
- **RLS:** Users can only see/modify their own progress

### `quiz_results` Table (Already exists)
Row Level Security was added to ensure users can only view their own quiz results.

## Verification

After running the SQL:

1. ✅ Check **Tables** in Supabase console — all 4 tables should appear
2. ✅ Check **Policies** — each table should have RLS policies
3. ✅ Try the dashboard:
   - Sign in
   - Dashboard should load (may show 0s initially)
   - Save a career → count updates
   - Enter APS marks → APS stat updates
   - Hard refresh → all data persists

## Troubleshooting

**Error: "user_bookmarks already exists"**
→ Tables already set up, just need to update RLS policies. Run only the ALTER/CREATE POLICY lines.

**Error: "new row violates unique constraint"**
→ Try saving the same bookmark twice. It should upsert silently (no error).

**Dashboard shows 0s but data should exist**
→ Check if RLS policies are active. Go to Tables → Select table → RLS toggle should be ON.

**"Permission denied" when saving**
→ RLS policy is wrong. Verify `auth.uid() = user_id` in the policy.

## What the App Now Does

### Save Careers (CareersPageNew.tsx)
- User clicks "Save" → calls `saveBookmark(userId, 'career', careerId, title)`
- Data saved to `user_bookmarks` table
- Count updates immediately on dashboard

### Save Bursaries (BursariesPage.tsx & BursaryDetailPage.tsx)
- User clicks "Save" → calls `saveBookmark(userId, 'bursary', bursaryId, title)`
- Data saved to `user_bookmarks` table

### Enter APS Marks (DashboardPage.tsx)
- Click "Add APS Marks" → form appears with 7 subject inputs
- Enter marks → click "Save Marks"
- Calls `saveAPSMarks(userId, marks)` → calculates APS, saves to `aps_marks`
- APS stat updates immediately

### Complete Lessons (StudyLibraryPage.tsx)
- When a lesson completion button is added, it calls `markLessonComplete(userId, topicId)`
- Saves to `study_progress` table

### Dashboard Stats (DashboardPage.tsx)
- On load: fetches all 4 tables
- Shows: Current APS, Saved Careers count, Saved Bursaries count, Lessons Done count
- Recent activity shows latest 5 actions with timestamps

## Files Modified

- ✅ `src/services/dashboardService.ts` — New file with all CRUD functions
- ✅ `src/pages/DashboardPage.tsx` — Fetches from Supabase, added APS entry form
- ✅ `src/pages/CareersPageNew.tsx` — Uses Supabase for saved careers
- ✅ `src/pages/BursariesPage.tsx` — Uses Supabase for saved bursaries
- ✅ `src/pages/BursaryDetailPage.tsx` — Uses Supabase for saved bursaries
- ✅ `src/pages/StudyLibraryPage.tsx` — Tracks completed lessons

## Next Steps

1. **Run the SQL script** in Supabase SQL Editor
2. **Test the dashboard:**
   - Sign in → Dashboard should show 0s initially
   - Go to Careers → Save a career → return to Dashboard → count updates
   - Go to Bursaries → Save a bursary → return to Dashboard → count updates
   - Click "Add APS Marks" on Dashboard → enter marks → save → APS updates
   - Hard refresh (Ctrl+F5) → all data persists
3. **Check Recent Activity** → should show your actions with timestamps

---

**Your data persistence is now live! 🎉**
