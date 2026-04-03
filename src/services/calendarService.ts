import { supabase } from '../lib/supabase';

export interface StudyEvent {
  id: string;
  userId: string;
  subject: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationHours: number;
  color?: string;
  notes?: string;
}

export interface SchoolCalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  eventType: 'term' | 'holiday' | 'exam_week' | 'public_holiday';
  name: string;
  description?: string;
  year: number;
}

export async function createStudyEvent(event: Omit<StudyEvent, 'id' | 'userId'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('study_events')
      .insert([{
        user_id: user.id,
        subject: event.subject,
        event_date: event.eventDate,
        start_time: event.startTime,
        duration_hours: event.durationHours,
        color: event.color,
        notes: event.notes
      }])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating study event:', error);
    return { data: null, error };
  }
}

export async function getStudyEvents(startDate: string, endDate: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('study_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting study events:', error);
    return [];
  }
}

export async function updateStudyEvent(id: string, updates: Partial<StudyEvent>) {
  try {
    const { error } = await supabase
      .from('study_events')
      .update({
        subject: updates.subject,
        event_date: updates.eventDate,
        start_time: updates.startTime,
        duration_hours: updates.durationHours,
        color: updates.color,
        notes: updates.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating study event:', error);
    return { error };
  }
}

export async function deleteStudyEvent(id: string) {
  try {
    const { error } = await supabase
      .from('study_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting study event:', error);
    return { error };
  }
}

export async function getSchoolCalendarEvents(year: number) {
  try {
    const { data, error } = await supabase
      .from('school_calendar')
      .select('*')
      .eq('year', year)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting school calendar:', error);
    return [];
  }
}

export function getEventTypeColor(eventType: string): string {
  const colors: Record<string, string> = {
    'term': '#10b981',
    'holiday': '#3b82f6',
    'exam_week': '#ef4444',
    'public_holiday': '#f59e0b'
  };
  return colors[eventType] || '#6b7280';
}
