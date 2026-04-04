import { supabase } from '../lib/supabase';

/**
 * Bookmark service with localStorage fallback for non-authenticated users.
 * Uses Supabase when authenticated, falls back to localStorage.
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

// localStorage keys
const CAREER_BOOKMARKS_KEY = 'prospect_career_bookmarks';
const BURSARY_BOOKMARKS_KEY = 'prospect_bursary_bookmarks';

function getLocalBookmarks(itemType: 'career' | 'bursary'): string[] {
  const key = itemType === 'career' ? CAREER_BOOKMARKS_KEY : BURSARY_BOOKMARKS_KEY;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

function setLocalBookmarks(itemType: 'career' | 'bursary', items: string[]): void {
  const key = itemType === 'career' ? CAREER_BOOKMARKS_KEY : BURSARY_BOOKMARKS_KEY;
  localStorage.setItem(key, JSON.stringify(items));
}

async function isUserAuthenticated(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getUser();
    return !!data?.user;
  } catch {
    return false;
  }
}

export async function saveBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
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
        console.error('Error saving bookmark to DB:', error);
        // Fall back to localStorage
        const bookmarks = getLocalBookmarks(itemType);
        if (!bookmarks.includes(itemId)) {
          bookmarks.push(itemId);
          setLocalBookmarks(itemType, bookmarks);
        }
        return true;
      }
      return true;
    } catch (err) {
      console.error('Error saving bookmark:', err);
      // Fall back to localStorage
      const bookmarks = getLocalBookmarks(itemType);
      if (!bookmarks.includes(itemId)) {
        bookmarks.push(itemId);
        setLocalBookmarks(itemType, bookmarks);
      }
      return true;
    }
  } else {
    // No auth - use localStorage
    const bookmarks = getLocalBookmarks(itemType);
    if (!bookmarks.includes(itemId)) {
      bookmarks.push(itemId);
      setLocalBookmarks(itemType, bookmarks);
    }
    return true;
  }
}

export async function removeBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
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
        console.error('Error removing bookmark from DB:', error);
        // Fall back to localStorage
        const bookmarks = getLocalBookmarks(itemType);
        const filtered = bookmarks.filter(id => id !== itemId);
        setLocalBookmarks(itemType, filtered);
        return true;
      }
      return true;
    } catch (err) {
      console.error('Error removing bookmark:', err);
      // Fall back to localStorage
      const bookmarks = getLocalBookmarks(itemType);
      const filtered = bookmarks.filter(id => id !== itemId);
      setLocalBookmarks(itemType, filtered);
      return true;
    }
  } else {
    // No auth - use localStorage
    const bookmarks = getLocalBookmarks(itemType);
    const filtered = bookmarks.filter(id => id !== itemId);
    setLocalBookmarks(itemType, filtered);
    return true;
  }
}

export async function getUserBookmarks(userId: string): Promise<BookmarkState> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('bookmark_type, item_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching bookmarks from DB:', error);
        // Fall back to localStorage
        return {
          careers: getLocalBookmarks('career'),
          bursaries: getLocalBookmarks('bursary'),
        };
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
      // Fall back to localStorage
      return {
        careers: getLocalBookmarks('career'),
        bursaries: getLocalBookmarks('bursary'),
      };
    }
  } else {
    // No auth - use localStorage
    return {
      careers: getLocalBookmarks('career'),
      bursaries: getLocalBookmarks('bursary'),
    };
  }
}

export async function isBookmarked(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
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
        console.error('Error checking bookmark in DB:', error);
        // Fall back to localStorage
        const bookmarks = getLocalBookmarks(itemType);
        return bookmarks.includes(itemId);
      }

      return !!data;
    } catch (err) {
      console.error('Error checking bookmark:', err);
      // Fall back to localStorage
      const bookmarks = getLocalBookmarks(itemType);
      return bookmarks.includes(itemId);
    }
  } else {
    // No auth - use localStorage
    const bookmarks = getLocalBookmarks(itemType);
    return bookmarks.includes(itemId);
  }
}
