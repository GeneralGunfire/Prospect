import { supabase } from '../lib/supabase';

/* ============================================================================
   SUPABASE SETUP: Run these SQL commands in your Supabase SQL editor once

-- Table: user_bookmarks
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmark_type TEXT NOT NULL CHECK (bookmark_type IN ('career', 'bursary')),
  item_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, bookmark_type, item_id)
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_can_view_own_bookmarks"
  ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_create_own_bookmarks"
  ON user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_bookmarks"
  ON user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Table: aps_marks
CREATE TABLE IF NOT EXISTS aps_marks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  marks_json JSONB NOT NULL DEFAULT '[]',
  calculated_aps INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE aps_marks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_can_view_own_aps_marks"
  ON aps_marks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_aps_marks"
  ON aps_marks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_aps_marks"
  ON aps_marks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table: study_progress
CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  subject TEXT,
  grade INTEGER,
  term INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  quiz_score INTEGER,
  test_score INTEGER,
  completed_at TIMESTAMP,
  UNIQUE(user_id, topic_id)
);

ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_can_view_own_progress"
  ON study_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_progress"
  ON study_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_progress"
  ON study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure quiz_results table has RLS (if not already set)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_can_view_own_quiz_results"
  ON quiz_results FOR SELECT USING (auth.uid() = user_id);

============================================================================ */

export interface SubjectMark {
  subject: string;
  mark: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  bookmark_type: 'career' | 'bursary';
  item_id: string;
  title?: string;
  created_at: string;
}

export interface APSData {
  id: string;
  user_id: string;
  marks_json: SubjectMark[];
  calculated_aps: number | null;
  updated_at: string;
}

export interface StudyProgress {
  id: string;
  user_id: string;
  topic_id: string;
  subject?: string;
  grade?: number;
  term?: number;
  completed: boolean;
  completion_percentage: number;
  quiz_score?: number;
  test_score?: number;
  completed_at?: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  riasec_scores: Record<string, number>;
  top_codes: string[];
  career_matches: any[];
  subject_recommendations: any;
  created_at: string;
  updated_at: string;
}

export interface RecentActivity {
  id: string;
  type: 'quiz' | 'bookmark_career' | 'bookmark_bursary' | 'aps_marks' | 'lesson_complete';
  title: string;
  timestamp: string;
  icon: string;
}

// ============================================================================
// BOOKMARK FUNCTIONS
// ============================================================================

export async function saveBookmark(
  userId: string,
  type: 'career' | 'bursary',
  itemId: string,
  title?: string
): Promise<Bookmark | null> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .upsert(
      {
        user_id: userId,
        bookmark_type: type,
        item_id: itemId,
        title,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,bookmark_type,item_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving bookmark:', error);
    return null;
  }

  return data as Bookmark;
}

export async function removeBookmark(
  userId: string,
  type: 'career' | 'bursary',
  itemId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .match({
      user_id: userId,
      bookmark_type: type,
      item_id: itemId,
    });

  if (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }

  return true;
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }

  return (data || []) as Bookmark[];
}

// ============================================================================
// APS MARKS FUNCTIONS
// ============================================================================

function calculateAPS(marks: SubjectMark[]): number {
  const toPoints = (mark: number) => {
    if (mark >= 80) return 7;
    if (mark >= 70) return 6;
    if (mark >= 60) return 5;
    if (mark >= 50) return 4;
    if (mark >= 40) return 3;
    if (mark >= 30) return 2;
    return 1;
  };

  return marks.reduce((total, m) => total + toPoints(m.mark), 0);
}

export async function saveAPSMarks(
  userId: string,
  marks: SubjectMark[]
): Promise<APSData | null> {
  const calculated_aps = calculateAPS(marks);

  const { data, error } = await supabase
    .from('aps_marks')
    .upsert(
      {
        user_id: userId,
        marks_json: marks,
        calculated_aps,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving APS marks:', error);
    return null;
  }

  return data as APSData;
}

export async function getAPSMarks(userId: string): Promise<APSData | null> {
  const { data, error } = await supabase
    .from('aps_marks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows, which is expected for new users
    console.error('Error fetching APS marks:', error);
  }

  return (data as APSData) || null;
}

// ============================================================================
// STUDY PROGRESS FUNCTIONS
// ============================================================================

export async function markLessonComplete(
  userId: string,
  topicId: string,
  quizScore?: number,
  testScore?: number
): Promise<StudyProgress | null> {
  const { data, error } = await supabase
    .from('study_progress')
    .upsert(
      {
        user_id: userId,
        topic_id: topicId,
        completed: true,
        completion_percentage: 100,
        quiz_score,
        test_score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,topic_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error marking lesson complete:', error);
    return null;
  }

  return data as StudyProgress;
}

export async function getStudyProgress(userId: string): Promise<StudyProgress[]> {
  const { data, error } = await supabase
    .from('study_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching study progress:', error);
    return [];
  }

  return (data || []) as StudyProgress[];
}

// ============================================================================
// QUIZ RESULTS FUNCTIONS
// ============================================================================

export async function getQuizResults(userId: string): Promise<QuizResult | null> {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows, which is expected for users who haven't taken quiz
    console.error('Error fetching quiz results:', error);
  }

  return (data as QuizResult) || null;
}

// ============================================================================
// RECENT ACTIVITY FUNCTION
// ============================================================================

export async function getRecentActivity(userId: string): Promise<RecentActivity[]> {
  const activities: RecentActivity[] = [];

  // Fetch from all tables with their timestamps
  const [quizRes, bookmarksRes, apsRes, progressRes] = await Promise.all([
    supabase
      .from('quiz_results')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('user_bookmarks')
      .select('id, bookmark_type, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('aps_marks')
      .select('id, updated_at')
      .eq('user_id', userId)
      .limit(1),
    supabase
      .from('study_progress')
      .select('id, topic_id, completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(2),
  ]);

  // Quiz
  if (quizRes.data && quizRes.data.length > 0) {
    activities.push({
      id: quizRes.data[0].id,
      type: 'quiz',
      title: 'Completed Quiz',
      timestamp: quizRes.data[0].created_at,
      icon: 'Star',
    });
  }

  // Bookmarks
  if (bookmarksRes.data) {
    bookmarksRes.data.forEach(bm => {
      const typeLabel = bm.bookmark_type === 'career' ? 'Saved' : 'Saved Bursary';
      activities.push({
        id: bm.id,
        type: bm.bookmark_type === 'career' ? 'bookmark_career' : 'bookmark_bursary',
        title: `${typeLabel} ${bm.title || bm.bookmark_type}`,
        timestamp: bm.created_at,
        icon: bm.bookmark_type === 'career' ? 'Briefcase' : 'Wallet',
      });
    });
  }

  // APS Marks
  if (apsRes.data && apsRes.data.length > 0) {
    activities.push({
      id: apsRes.data[0].id,
      type: 'aps_marks',
      title: 'Updated APS Marks',
      timestamp: apsRes.data[0].updated_at,
      icon: 'GraduationCap',
    });
  }

  // Study Progress
  if (progressRes.data) {
    progressRes.data.forEach(progress => {
      activities.push({
        id: progress.id,
        type: 'lesson_complete',
        title: `Completed Lesson (${progress.topic_id})`,
        timestamp: progress.completed_at || new Date().toISOString(),
        icon: 'BookOpen',
      });
    });
  }

  // Sort by timestamp and return top 5
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}
