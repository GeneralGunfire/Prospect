import { supabase } from '../lib/supabase';

/**
 * Quiz service with localStorage fallback for non-authenticated users.
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

const QUIZ_RESULTS_KEY = 'prospect_quiz_results';

function getLocalQuizResults(): QuizResult[] {
  const stored = localStorage.getItem(QUIZ_RESULTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setLocalQuizResults(results: QuizResult[]): void {
  localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
}

async function isUserAuthenticated(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getUser();
    return !!data?.user;
  } catch {
    return false;
  }
}

/**
 * Save quiz results for a user
 * @param userId - The user's ID
 * @param riasecScores - Object with RIASEC scores
 * @param topCareers - Array of top career IDs
 * @param apsScore - APS score (optional)
 * @param matricSubjects - Array of matric subjects (optional)
 * @param subjectRecommendations - Career recommendations by subject (optional)
 * @returns true if successful, false if failed
 */
export async function saveQuizResults(
  userId: string,
  riasecScores: Record<string, number>,
  topCareers: string[],
  apsScore?: number,
  matricSubjects?: string[],
  subjectRecommendations?: Record<string, string[]>
): Promise<boolean> {
  const isAuth = await isUserAuthenticated();

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

  if (isAuth) {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          riasec_scores: riasecScores,
          top_careers: topCareers,
          aps_score: apsScore,
          matric_subjects: matricSubjects,
          subject_recommendations: subjectRecommendations,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving quiz results to DB:', error);
        // Fall back to localStorage
        const results = getLocalQuizResults();
        results.unshift(result);
        setLocalQuizResults(results);
        return true;
      }
      return true;
    } catch (err) {
      console.error('Error saving quiz results:', err);
      // Fall back to localStorage
      const results = getLocalQuizResults();
      results.unshift(result);
      setLocalQuizResults(results);
      return true;
    }
  } else {
    // No auth - use localStorage
    const results = getLocalQuizResults();
    results.unshift(result);
    setLocalQuizResults(results);
    return true;
  }
}

/**
 * Get all quiz results for a user (quiz history)
 * @param userId - The user's ID
 * @returns Array of quiz results ordered by creation date (newest first)
 */
export async function getQuizHistory(userId: string): Promise<QuizResult[]> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quiz history from DB:', error);
        return getLocalQuizResults();
      }

      return (data as QuizResult[]) || [];
    } catch (err) {
      console.error('Error fetching quiz history:', err);
      return getLocalQuizResults();
    }
  } else {
    // No auth - use localStorage
    return getLocalQuizResults();
  }
}

/**
 * Get the most recent quiz result for a user
 * @param userId - The user's ID
 * @returns The most recent quiz result, or null if none found
 */
export async function getLatestQuizResult(userId: string): Promise<QuizResult | null> {
  const isAuth = await isUserAuthenticated();

  if (isAuth) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest quiz result from DB:', error);
        const localResults = getLocalQuizResults();
        return localResults.length > 0 ? localResults[0] : null;
      }

      return (data as QuizResult) || null;
    } catch (err) {
      console.error('Error fetching latest quiz result:', err);
      const localResults = getLocalQuizResults();
      return localResults.length > 0 ? localResults[0] : null;
    }
  } else {
    // No auth - use localStorage
    const results = getLocalQuizResults();
    return results.length > 0 ? results[0] : null;
  }
}
