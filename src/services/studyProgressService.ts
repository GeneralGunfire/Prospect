import { supabase } from '../lib/supabase';

/**
 * SUPABASE SETUP: Run this SQL in your Supabase SQL Editor
 *
 * CREATE TABLE study_progress (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   topic_id TEXT NOT NULL,
 *   subject TEXT NOT NULL,
 *   grade INT NOT NULL,
 *   term INT NOT NULL,
 *   completed BOOLEAN DEFAULT FALSE,
 *   score INT,
 *   quiz_score INT,
 *   test_score INT,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW(),
 *   UNIQUE(user_id, topic_id)
 * );
 *
 * CREATE INDEX idx_study_progress_user ON study_progress(user_id);
 *
 * ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view own study progress" ON study_progress
 *   FOR SELECT
 *   TO authenticated
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own study progress" ON study_progress
 *   FOR INSERT
 *   TO authenticated
 *   WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can update own study progress" ON study_progress
 *   FOR UPDATE
 *   TO authenticated
 *   USING (auth.uid() = user_id);
 */

export interface StudyProgress {
  id: string;
  user_id: string;
  topic_id: string;
  subject: string;
  grade: number;
  term: number;
  completed: boolean;
  score?: number;
  quiz_score?: number;
  test_score?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Save or update progress for a study topic
 * @param userId - The user's ID
 * @param topicId - The topic ID
 * @param subject - Subject name
 * @param grade - Grade level
 * @param term - Term number
 * @param completed - Whether the topic is completed
 * @param score - Overall score (optional)
 * @param quizScore - Quiz score (optional)
 * @param testScore - Test score (optional)
 * @returns true if successful, false if failed
 */
export async function saveProgress(
  userId: string,
  topicId: string,
  subject: string,
  grade: number,
  term: number,
  completed: boolean,
  score?: number,
  quizScore?: number,
  testScore?: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('study_progress')
      .upsert(
        {
          user_id: userId,
          topic_id: topicId,
          subject,
          grade,
          term,
          completed,
          score,
          quiz_score: quizScore,
          test_score: testScore,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      );

    if (error) {
      console.error('Error saving progress:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving progress:', err);
    return false;
  }
}

/**
 * Get progress for a specific subject
 * @param userId - The user's ID
 * @param subject - Subject name
 * @returns Array of study progress records for the subject
 */
export async function getProgress(userId: string, subject: string): Promise<StudyProgress[]> {
  try {
    const { data, error } = await supabase
      .from('study_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }

    return (data as StudyProgress[]) || [];
  } catch (err) {
    console.error('Error fetching progress:', err);
    return [];
  }
}

/**
 * Get all completed lessons for a user
 * @param userId - The user's ID
 * @returns Count of completed lessons
 */
export async function getCompletedLessons(userId: string): Promise<StudyProgress[]> {
  try {
    const { data, error } = await supabase
      .from('study_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed lessons:', error);
      return [];
    }

    return (data as StudyProgress[]) || [];
  } catch (err) {
    console.error('Error fetching completed lessons:', err);
    return [];
  }
}

/**
 * Mark a topic as complete with scores
 * @param userId - The user's ID
 * @param topicId - The topic ID
 * @param quizScore - Quiz score (optional)
 * @param testScore - Test score (optional)
 * @returns true if successful, false if failed
 */
export async function markTopicComplete(
  userId: string,
  topicId: string,
  quizScore?: number,
  testScore?: number
): Promise<boolean> {
  try {
    const { data: existingProgress, error: fetchError } = await supabase
      .from('study_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing progress:', fetchError);
      return false;
    }

    if (!existingProgress) {
      // If no existing record, we can't mark as complete without more info
      console.error('No existing progress record found for topic:', topicId);
      return false;
    }

    const { error } = await supabase
      .from('study_progress')
      .update({
        completed: true,
        quiz_score: quizScore,
        test_score: testScore,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    if (error) {
      console.error('Error marking topic complete:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error marking topic complete:', err);
    return false;
  }
}
