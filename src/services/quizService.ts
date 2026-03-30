import { supabase } from '../lib/supabase';

/**
 * SUPABASE SETUP: Run this SQL in your Supabase SQL Editor
 *
 * CREATE TABLE quiz_results (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   riasec_scores JSONB NOT NULL,
 *   top_careers JSONB NOT NULL,
 *   aps_score INT,
 *   matric_subjects JSONB,
 *   subject_recommendations JSONB,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
 *
 * ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view own quiz results" ON quiz_results
 *   FOR SELECT
 *   TO authenticated
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own quiz results" ON quiz_results
 *   FOR INSERT
 *   TO authenticated
 *   WITH CHECK (auth.uid() = user_id);
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
      console.error('Error saving quiz results:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving quiz results:', err);
    return false;
  }
}

/**
 * Get all quiz results for a user (quiz history)
 * @param userId - The user's ID
 * @returns Array of quiz results ordered by creation date (newest first)
 */
export async function getQuizHistory(userId: string): Promise<QuizResult[]> {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }

    return (data as QuizResult[]) || [];
  } catch (err) {
    console.error('Error fetching quiz history:', err);
    return [];
  }
}

/**
 * Get the most recent quiz result for a user
 * @param userId - The user's ID
 * @returns The most recent quiz result, or null if none found
 */
export async function getLatestQuizResult(userId: string): Promise<QuizResult | null> {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is expected
      console.error('Error fetching latest quiz result:', error);
      return null;
    }

    return (data as QuizResult) || null;
  } catch (err) {
    console.error('Error fetching latest quiz result:', err);
    return null;
  }
}
