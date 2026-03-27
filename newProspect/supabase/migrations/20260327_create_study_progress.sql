-- Create study_progress table for tracking lesson completion
create table if not exists public.study_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id text not null,
  grade integer not null,
  term integer not null,
  topic_id text not null,
  quiz_score integer,
  test_score integer,
  completed_at timestamp with time zone,
  last_accessed timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  -- Unique constraint to prevent duplicate progress per user/subject/topic
  unique(user_id, subject_id, grade, term, topic_id)
);

-- Create index for faster queries
create index if not exists idx_study_progress_user_id on public.study_progress(user_id);
create index if not exists idx_study_progress_subject_grade_term on public.study_progress(subject_id, grade, term);
create index if not exists idx_study_progress_user_subject on public.study_progress(user_id, subject_id, grade, term);

-- Enable RLS
alter table public.study_progress enable row level security;

-- Create RLS policies
create policy "Users can view their own study progress"
  on public.study_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study progress"
  on public.study_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study progress"
  on public.study_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own study progress"
  on public.study_progress for delete
  using (auth.uid() = user_id);
