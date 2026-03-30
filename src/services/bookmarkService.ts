import { supabase } from '../lib/supabase';

/**
 * SUPABASE SETUP: Run this SQL in your Supabase SQL Editor
 *
 * CREATE TABLE user_bookmarks (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   item_type TEXT NOT NULL CHECK (item_type IN ('career', 'bursary')),
 *   item_id TEXT NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   UNIQUE(user_id, item_type, item_id)
 * );
 *
 * CREATE INDEX idx_user_bookmarks ON user_bookmarks(user_id, item_type);
 *
 * ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
 *   FOR SELECT
 *   TO authenticated
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own bookmarks" ON user_bookmarks
 *   FOR INSERT
 *   TO authenticated
 *   WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can delete own bookmarks" ON user_bookmarks
 *   FOR DELETE
 *   TO authenticated
 *   USING (auth.uid() = user_id);
 */

export interface UserBookmark {
  id: string;
  user_id: string;
  item_type: 'career' | 'bursary';
  item_id: string;
  created_at: string;
}

export interface BookmarkState {
  careers: string[]; // Array of career IDs
  bursaries: string[]; // Array of bursary IDs
}

/**
 * Save a bookmark for a user
 * @param userId - The user's ID
 * @param itemType - 'career' or 'bursary'
 * @param itemId - The ID of the career or bursary
 * @returns true if successful, false if failed
 */
export async function saveBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_bookmarks')
      .upsert(
        {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,item_type,item_id' }
      );

    if (error) {
      console.error('Error saving bookmark:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving bookmark:', err);
    return false;
  }
}

/**
 * Remove a bookmark for a user
 * @param userId - The user's ID
 * @param itemType - 'career' or 'bursary'
 * @param itemId - The ID of the career or bursary
 * @returns true if successful, false if failed
 */
export async function removeBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .match({
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      });

    if (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error removing bookmark:', err);
    return false;
  }
}

/**
 * Get all bookmarks for a user, organized by type
 * @param userId - The user's ID
 * @returns Object with careers and bursaries arrays
 */
export async function getUserBookmarks(userId: string): Promise<BookmarkState> {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('item_type, item_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return { careers: [], bursaries: [] };
    }

    const bookmarks: BookmarkState = {
      careers: [],
      bursaries: [],
    };

    if (data) {
      data.forEach((bookmark) => {
        if (bookmark.item_type === 'career') {
          bookmarks.careers.push(bookmark.item_id);
        } else if (bookmark.item_type === 'bursary') {
          bookmarks.bursaries.push(bookmark.item_id);
        }
      });
    }

    return bookmarks;
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    return { careers: [], bursaries: [] };
  }
}

/**
 * Check if a specific item is bookmarked
 * @param userId - The user's ID
 * @param itemType - 'career' or 'bursary'
 * @param itemId - The ID of the career or bursary
 * @returns true if bookmarked, false otherwise
 */
export async function isBookmarked(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .match({
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      })
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is expected
      console.error('Error checking bookmark:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error checking bookmark:', err);
    return false;
  }
}
