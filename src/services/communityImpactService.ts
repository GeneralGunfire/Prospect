import { supabase } from '../lib/supabase';

export type SubmissionType = 'school' | 'college' | 'job' | 'service';
export type VerificationStatus = 'unverified' | 'verified';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  user_id: string | null;
  submitted_by: string;
  submitted_email: string;
  submission_type: SubmissionType;
  name: string;
  description: string | null;
  category: string | null;
  province: string;
  city: string;
  website_url: string | null;
  verification_status: VerificationStatus;
  approval_status: ApprovalStatus;
  submitted_at: string;
}

export interface NewSubmission {
  user_id: string | null;
  submitted_by: string;
  submitted_email: string;
  submission_type: SubmissionType;
  name: string;
  description: string;
  category: string;
  province: string;
  city: string;
  website_url: string;
}

export interface SubmissionFilters {
  type?: SubmissionType | 'all';
  province?: string;
}

export async function fetchSubmissions(filters?: SubmissionFilters): Promise<Submission[]> {
  try {
    let query = supabase
      .from('community_submissions')
      .select('*')
      .in('approval_status', ['approved', 'pending'])
      .order('submitted_at', { ascending: false })
      .limit(50);

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('submission_type', filters.type);
    }
    if (filters?.province && filters.province !== 'all') {
      query = query.eq('province', filters.province);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Submission[]) ?? [];
  } catch {
    return [];
  }
}

export async function createSubmission(data: NewSubmission): Promise<Submission> {
  const payload = {
    ...data,
    verification_status: 'unverified' as VerificationStatus,
    approval_status: 'pending' as ApprovalStatus,
    submitted_at: new Date().toISOString(),
    description: data.description || null,
    category: data.category || null,
    website_url: data.website_url || null,
    user_id: data.user_id || null,
  };

  const { data: inserted, error } = await supabase
    .from('community_submissions')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted as Submission;
}

export async function checkDuplicate(name: string, city: string, type: SubmissionType): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('community_submissions')
      .select('id')
      .ilike('name', name.trim())
      .ilike('city', city.trim())
      .eq('submission_type', type)
      .limit(1);

    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function getUserSubmissions(email: string, userId?: string): Promise<Submission[]> {
  try {
    let query = supabase
      .from('community_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (userId && userId !== 'guest') {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('submitted_email', email.toLowerCase().trim());
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Submission[]) ?? [];
  } catch {
    return [];
  }
}

export function getSubmissionStats(submissions: Submission[]) {
  return {
    total: submissions.length,
    school: submissions.filter(s => s.submission_type === 'school').length,
    college: submissions.filter(s => s.submission_type === 'college').length,
    job: submissions.filter(s => s.submission_type === 'job').length,
    service: submissions.filter(s => s.submission_type === 'service').length,
  };
}
