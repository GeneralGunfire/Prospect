/**
 * Bookmark service - localStorage-first with optional Supabase sync
 * Prioritizes offline-first UX and instant feedback
 */

export interface BookmarkState {
  careers: string[];
  bursaries: string[];
}

// localStorage keys
const CAREER_BOOKMARKS_KEY = 'prospect_career_bookmarks_v2';
const BURSARY_BOOKMARKS_KEY = 'prospect_bursary_bookmarks_v2';

/**
 * Get local bookmarks from localStorage (instant, synchronous)
 */
function getLocalBookmarks(itemType: 'career' | 'bursary'): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = itemType === 'career' ? CAREER_BOOKMARKS_KEY : BURSARY_BOOKMARKS_KEY;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Error reading bookmarks from localStorage:', err);
    return [];
  }
}

/**
 * Save bookmarks to localStorage (instant, synchronous)
 */
function setLocalBookmarks(itemType: 'career' | 'bursary', items: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    const key = itemType === 'career' ? CAREER_BOOKMARKS_KEY : BURSARY_BOOKMARKS_KEY;
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn('Error saving bookmarks to localStorage:', err);
  }
}

/**
 * Save a bookmark (adds to localStorage immediately, syncs to Supabase async)
 */
export async function saveBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    // Add to localStorage immediately - INSTANT FEEDBACK
    const bookmarks = getLocalBookmarks(itemType);
    if (!bookmarks.includes(itemId)) {
      bookmarks.push(itemId);
      setLocalBookmarks(itemType, bookmarks);
    }

    // Optional: Try to sync to Supabase in background (non-blocking)
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        // Non-blocking, setTimeout(0) to run after rendering
        setTimeout(() => {
          supabase
            .from('user_bookmarks')
            .upsert(
              {
                user_id: userId,
                bookmark_type: itemType,
                item_id: itemId,
                created_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,bookmark_type,item_id' }
            )
            .catch((error) => {
              console.debug('Supabase bookmark sync failed (will use localStorage):', error?.message);
            });
        }, 0);
      } catch (err) {
        // Supabase sync failed, but localStorage save succeeded
        console.debug('Supabase unavailable, using localStorage only');
      }
    }

    return true;
  } catch (err) {
    console.error('Error saving bookmark:', err);
    return false;
  }
}

/**
 * Remove a bookmark (removes from localStorage immediately)
 */
export async function removeBookmark(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    // Remove from localStorage immediately - INSTANT FEEDBACK
    const bookmarks = getLocalBookmarks(itemType);
    const filtered = bookmarks.filter(id => id !== itemId);
    setLocalBookmarks(itemType, filtered);

    // Optional: Try to sync removal to Supabase in background
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        setTimeout(() => {
          supabase
            .from('user_bookmarks')
            .delete()
            .match({
              user_id: userId,
              bookmark_type: itemType,
              item_id: itemId,
            })
            .catch((error) => {
              console.debug('Supabase removal sync failed (will use localStorage):', error?.message);
            });
        }, 0);
      } catch (err) {
        console.debug('Supabase unavailable, using localStorage only');
      }
    }

    return true;
  } catch (err) {
    console.error('Error removing bookmark:', err);
    return false;
  }
}

/**
 * Get all bookmarks for a user (returns localStorage immediately)
 */
export async function getUserBookmarks(userId: string): Promise<BookmarkState> {
  try {
    // Return from localStorage immediately - NO LOADING STATE NEEDED
    const localState: BookmarkState = {
      careers: getLocalBookmarks('career'),
      bursaries: getLocalBookmarks('bursary'),
    };

    // Optional: Try to fetch and sync from Supabase in background
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('user_bookmarks')
              .select('bookmark_type, item_id')
              .eq('user_id', userId)
              .then((result) => {
                // Add timeout to prevent hanging
                return Promise.race([
                  Promise.resolve(result),
                  new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Supabase timeout')), 5000)
                  ),
                ]);
              });

            if (!error && data) {
              const careersFromDb: string[] = [];
              const bursariesFromDb: string[] = [];

              (data as any[]).forEach((bookmark: any) => {
                if (bookmark.bookmark_type === 'career') {
                  careersFromDb.push(bookmark.item_id);
                } else if (bookmark.bookmark_type === 'bursary') {
                  bursariesFromDb.push(bookmark.item_id);
                }
              });

              // Update localStorage with Supabase data if different
              if (JSON.stringify(careersFromDb) !== JSON.stringify(localState.careers)) {
                setLocalBookmarks('career', careersFromDb);
              }
              if (JSON.stringify(bursariesFromDb) !== JSON.stringify(localState.bursaries)) {
                setLocalBookmarks('bursary', bursariesFromDb);
              }
            }
          } catch (err: any) {
            console.debug('Supabase sync failed:', err?.message, '(localStorage is primary source)');
          }
        }, 0);
      } catch (err) {
        console.debug('Supabase unavailable, using localStorage only');
      }
    }

    return localState;
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    return { careers: [], bursaries: [] };
  }
}

/**
 * Check if an item is bookmarked (instant check from localStorage)
 */
export async function isBookmarked(
  userId: string,
  itemType: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  try {
    const bookmarks = getLocalBookmarks(itemType);
    return bookmarks.includes(itemId);
  } catch (err) {
    console.error('Error checking bookmark:', err);
    return false;
  }
}

/**
 * Clear all bookmarks (for testing/reset)
 */
export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CAREER_BOOKMARKS_KEY);
    localStorage.removeItem(BURSARY_BOOKMARKS_KEY);
  } catch (err) {
    console.error('Error clearing bookmarks:', err);
  }
}

/**
 * Get bookmark stats
 */
export function getBookmarkStats(): { careers: number; bursaries: number } {
  return {
    careers: getLocalBookmarks('career').length,
    bursaries: getLocalBookmarks('bursary').length,
  };
}
