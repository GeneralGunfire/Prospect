import { supabase } from '../lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UnansweredQuestion {
  id: string;
  question: string;
  subject?: string;
  grade?: number;
  details?: string;
  status: 'pending' | 'answered' | 'marked_resolved';
  answer_text?: string;
  answered_at?: string;
  created_at: string;
}

export interface SubmitQuestionData {
  userId: string;
  question: string;
  subject?: string;
  grade?: number;
  details?: string;
}

// ── Functions ─────────────────────────────────────────────────────────────────

/**
 * Insert a new unanswered question into the user_unanswered_questions table.
 */
export async function submitQuestion(
  data: SubmitQuestionData
): Promise<UnansweredQuestion | null> {
  const { userId, question, subject, grade, details } = data;

  const { data: inserted, error } = await supabase
    .from('user_unanswered_questions')
    .insert({
      user_id: userId,
      question,
      subject: subject ?? null,
      grade: grade ?? null,
      details: details ?? null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting question:', error);
    return null;
  }

  return inserted as UnansweredQuestion;
}

/**
 * Fetch all questions submitted by a user, newest first.
 */
export async function getUserQuestions(
  userId: string
): Promise<UnansweredQuestion[]> {
  const { data, error } = await supabase
    .from('user_unanswered_questions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user questions:', error);
    return [];
  }

  return (data ?? []) as UnansweredQuestion[];
}

/**
 * Delete a question only if its status is 'pending'.
 * Returns true on success, false otherwise.
 */
export async function deleteQuestion(
  questionId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('user_unanswered_questions')
    .delete()
    .match({ id: questionId, user_id: userId, status: 'pending' });

  if (error) {
    console.error('Error deleting question:', error);
    return false;
  }

  return true;
}

/**
 * Mark a question as resolved by the user.
 */
export async function markResolved(questionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_unanswered_questions')
    .update({ status: 'marked_resolved' })
    .eq('id', questionId);

  if (error) {
    console.error('Error marking question as resolved:', error);
    return false;
  }

  return true;
}
