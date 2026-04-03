import { supabase } from '../lib/supabase';

/**
 * Uses the user_bookmarks table (created by dashboardService) with bookmark_type column.
 */

export interface UserBookmark {
  id: string;
  user_id: string;
  bookmark_type: 'career' | 'bursary';
  item_id: string;
  created_at: string;
}

export interface BookmarkState {
  careers: string[];
  bursaries: string[];
}

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
          bookmark_type: itemType,
          item_id: itemId,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,bookmark_type,item_id' }
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
        bookmark_type: itemType,
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

export async function getUserBookmarks(userId: string): Promise<BookmarkState> {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('bookmark_type, item_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return { careers: [], bursaries: [] };
    }

    const bookmarks: BookmarkState = { careers: [], bursaries: [] };

    if (data) {
      data.forEach((bookmark) => {
        if (bookmark.bookmark_type === 'career') {
          bookmarks.careers.push(bookmark.item_id);
        } else if (bookmark.bookmark_type === 'bursary') {
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
        bookmark_type: itemType,
        item_id: itemId,
      })
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking bookmark:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error checking bookmark:', err);
    return false;
  }
}
