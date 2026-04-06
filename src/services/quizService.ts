/**
 * Quiz Results Service - localStorage-first
 * Prioritizes instant, reliable data persistence
 */

export interface QuizResult {
  id: string;
  user_id: string;
  riasec_scores: Record<string, number>;
  top_careers: string[];
  aps_score?: number;
  matric_subjects?: string[];
  subject_recommendations?: Record<string, string[]>;
  created_at: string;
}

const QUIZ_RESULTS_KEY = 'prospect_quiz_results_v2';

/**
 * Get local quiz results from localStorage (instant)
 */
function getLocalQuizResults(): QuizResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(QUIZ_RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Error reading quiz results from localStorage:', err);
    return [];
  }
}

/**
 * Save quiz results to localStorage (instant)
 */
function setLocalQuizResults(results: QuizResult[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
  } catch (err) {
    console.warn('Error saving quiz results to localStorage:', err);
  }
}

/**
 * Save quiz results for a user
 * Stores immediately in localStorage, optionally syncs to Supabase
 */
export async function saveQuizResults(
  userId: string,
  riasecScores: Record<string, number>,
  topCareers: string[],
  apsScore?: number,
  matricSubjects?: string[],
  subjectRecommendations?: Record<string, string[]>
): Promise<boolean> {
  try {
    const result: QuizResult = {
      id: `local_${Date.now()}`,
      user_id: userId,
      riasec_scores: riasecScores,
      top_careers: topCareers,
      aps_score: apsScore,
      matric_subjects: matricSubjects,
      subject_recommendations: subjectRecommendations,
      created_at: new Date().toISOString(),
    };

    // Add to localStorage immediately - INSTANT FEEDBACK
    const results = getLocalQuizResults();
    results.unshift(result);
    setLocalQuizResults(results);

    // Optional: Try to sync to Supabase in background (non-blocking)
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        setTimeout(() => {
          supabase
            .from('quiz_results')
            .insert({
              user_id: userId,
              riasec_scores: riasecScores,
              top_careers: topCareers,
              aps_score: apsScore,
              matric_subjects: matricSubjects,
              subject_recommendations: subjectRecommendations,
              created_at: new Date().toISOString(),
            })
            .catch((error) => {
              console.debug('Supabase quiz sync failed (will use localStorage):', error?.message);
            });
        }, 0);
      } catch (err) {
        console.debug('Supabase unavailable, using localStorage only');
      }
    }

    return true;
  } catch (err) {
    console.error('Error saving quiz results:', err);
    return false;
  }
}

/**
 * Get all quiz results for a user (quiz history)
 * Returns localStorage immediately
 */
export async function getQuizHistory(userId: string): Promise<QuizResult[]> {
  try {
    // Return from localStorage immediately - NO LOADING
    const localResults = getLocalQuizResults();

    // Optional: Try to fetch from Supabase in background
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        setTimeout(async () => {
          try {
            const { data, error } = await Promise.race([
              supabase
                .from('quiz_results')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Supabase timeout')), 5000)
              ),
            ]) as any;

            if (!error && data) {
              setLocalQuizResults(data as QuizResult[]);
            }
          } catch (err: any) {
            console.debug('Supabase history sync failed:', err?.message);
          }
        }, 0);
      } catch (err) {
        console.debug('Supabase unavailable, using localStorage only');
      }
    }

    return localResults;
  } catch (err) {
    console.error('Error fetching quiz history:', err);
    return getLocalQuizResults();
  }
}

/**
 * Get the most recent quiz result for a user
 * Returns from localStorage immediately
 */
export async function getLatestQuizResult(userId: string): Promise<QuizResult | null> {
  try {
    const results = getLocalQuizResults();
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Error fetching latest quiz result:', err);
    return null;
  }
}

/**
 * Clear all quiz results (for testing)
 */
export function clearAllQuizResults(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(QUIZ_RESULTS_KEY);
  } catch (err) {
    console.error('Error clearing quiz results:', err);
  }
}

/**
 * Get quiz stats
 */
export function getQuizStats(): { totalAttempts: number; lastAttempt: string | null } {
  const results = getLocalQuizResults();
  return {
    totalAttempts: results.length,
    lastAttempt: results.length > 0 ? results[0].created_at : null,
  };
}
