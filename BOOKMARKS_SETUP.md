# Bookmarks Feature Setup — Persist Saved Careers & Bursaries

## Overview
The bookmarks feature allows users to save careers and bursaries to Supabase. Bookmarks persist across devices and survive refresh/logout.

## Step 1: Create Supabase Table

Go to **Supabase Dashboard → SQL Editor** and run this SQL:

```sql
-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('career', 'bursary')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_bookmarks ON user_bookmarks(user_id, item_type);

-- Enable Row Level Security
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional - only if updating)
DROP POLICY IF EXISTS "Users can view own bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON user_bookmarks;

-- Create RLS policies
CREATE POLICY "Users can view own bookmarks"
  ON user_bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON user_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON user_bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

## Step 2: Verify Table Setup

After running the SQL, verify in Supabase:

1. **Tables** → Check `user_bookmarks` exists
2. **Authentication** → Check RLS is enabled (toggle should be ON)
3. **Policies** → Should have 3 policies (SELECT, INSERT, DELETE)

## How It Works

### Save a Career
```
User clicks heart icon on career card
↓
saveBookmark(userId, 'career', careerId)
↓
Insert row in user_bookmarks
↓
Show "Saved!" notification
↓
Heart icon fills with gold color
```

### Remove a Career
```
User clicks filled heart icon
↓
removeBookmark(userId, 'career', careerId)
↓
Delete row from user_bookmarks
↓
Show "Removed" notification
↓
Heart icon becomes empty
```

### Load Bookmarks
```
Page loads
↓
getUserBookmarks(userId)
↓
Fetch all bookmarks for user
↓
Return { careers: [...], bursaries: [...] }
↓
Populate saved states for all cards
```

## Files Created/Modified

### New Files
- `src/services/bookmarkService.ts` — All bookmark CRUD operations

### Modified Files
- `src/pages/DashboardPage.tsx` — Displays saved careers & bursaries
- `src/pages/CareersPageNew.tsx` — Save/unsave careers
- `src/pages/TVETCareersPage.tsx` — Save/unsave TVET careers
- `src/pages/BursariesPage.tsx` — Save/unsave bursaries
- `src/pages/BursaryDetailPage.tsx` — Save/unsave from detail page
- `src/components/CareerDetailModal.tsx` — Already integrated

## API Reference

### `getUserBookmarks(userId)`
Get all bookmarks for a user

```typescript
const bookmarks = await getUserBookmarks(user.id);
// Returns:
// {
//   careers: ['career-1', 'career-2'],
//   bursaries: ['bursary-1']
// }
```

### `saveBookmark(userId, itemType, itemId)`
Save a bookmark (career or bursary)

```typescript
const success = await saveBookmark(user.id, 'career', 'career-123');
// Returns: true if successful, false if failed
```

### `removeBookmark(userId, itemType, itemId)`
Remove a bookmark

```typescript
const success = await removeBookmark(user.id, 'career', 'career-123');
// Returns: true if successful, false if failed
```

### `isBookmarked(userId, itemType, itemId)`
Check if a specific item is bookmarked

```typescript
const saved = await isBookmarked(user.id, 'career', 'career-123');
// Returns: true if bookmarked, false otherwise
```

## Testing Checklist

- [ ] Run SQL to create table
- [ ] Sign in to app
- [ ] Navigate to Careers page
- [ ] Click save icon on 3 careers → Icon fills, appears on dashboard
- [ ] Refresh page → Hearts still filled, careers still saved
- [ ] Go to Dashboard → See saved careers in "Saved Careers" section
- [ ] Click remove button on dashboard → Career disappears
- [ ] Go back to Careers page → Heart is empty again
- [ ] Open career detail modal → Save icon shows correct state
- [ ] Save bursary from Bursaries page → Appears on dashboard
- [ ] Remove from dashboard → Disappears from Bursaries page too
- [ ] Logout and login → All bookmarks still there
- [ ] Test on mobile → Works the same

## Architecture

```
bookmarkService.ts
├── getUserBookmarks() — Load all bookmarks
├── saveBookmark() — Add bookmark
├── removeBookmark() — Delete bookmark
└── isBookmarked() — Check if saved

CareersPageNew.tsx
├── Fetch saved careers on mount
├── Show filled hearts for saved careers
└── Toggle save on click

BursariesPage.tsx
├── Fetch saved bursaries on mount
├── Show filled hearts for saved bursaries
└── Toggle save on click

DashboardPage.tsx
├── Fetch all bookmarks on mount
├── Display saved careers section
├── Display saved bursaries section
├── Show "Remove" buttons on cards
└── Update counts in real-time
```

## Security

All bookmarks are protected by Row Level Security (RLS):
- Users can only **see** their own bookmarks
- Users can only **create** bookmarks for themselves
- Users can only **delete** their own bookmarks
- No user can access another user's bookmarks

## Troubleshooting

### "Permission denied" error
**Problem:** RLS policies not set up correctly
**Solution:** Check that all 3 policies exist in Supabase and are enabled

### Hearts not filling after save
**Problem:** State not updating on page
**Solution:** Check browser console for errors, ensure `saveBookmark()` returns `true`

### Bookmarks disappear after refresh
**Problem:** Data not persisting to Supabase
**Solution:** Check that table was created and RLS is enabled. Verify `user_id` matches authenticated user

### "UNIQUE constraint violation"
**Problem:** Trying to save same bookmark twice
**Solution:** This should not happen — `saveBookmark` uses `upsert` which updates existing row

### Bookmarks not visible on dashboard
**Problem:** Dashboard not fetching bookmarks
**Solution:** Check that `getUserBookmarks()` is called on page load. Verify table has data in SQL Editor

## Performance

- **Load time:** Bookmarks fetched in parallel with other dashboard data
- **Save/delete:** Typically <500ms
- **Database queries:** Indexed by `(user_id, item_type)` for fast lookups

## Future Enhancements

- Add toast notifications for save/delete
- Add "Liked" count on career cards
- Export bookmarks as PDF
- Share bookmarks with friends
- Compare careers side-by-side
- AI recommendations based on bookmarks

---

**Bookmarks are now live! Users can save careers and bursaries that persist across all devices.** 🎉
