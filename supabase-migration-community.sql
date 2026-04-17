-- Community Impact: community_submissions table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS community_submissions (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by        TEXT          NOT NULL DEFAULT 'Anonymous',
  submitted_email     TEXT          NOT NULL,
  submission_type     TEXT          NOT NULL CHECK (submission_type IN ('school', 'college', 'job', 'service')),
  name                TEXT          NOT NULL,
  description         TEXT,
  category            TEXT,
  province            TEXT          NOT NULL,
  city                TEXT          NOT NULL,
  website_url         TEXT,
  verification_status TEXT          NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified')),
  approval_status     TEXT          NOT NULL DEFAULT 'pending'    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  submitted_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  verified_at         TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_community_type     ON community_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_community_province ON community_submissions(province);
CREATE INDEX IF NOT EXISTS idx_community_status   ON community_submissions(approval_status);
CREATE INDEX IF NOT EXISTS idx_community_email    ON community_submissions(submitted_email);
CREATE INDEX IF NOT EXISTS idx_community_user     ON community_submissions(user_id);

-- Row Level Security
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read pending + approved submissions
CREATE POLICY "public_read" ON community_submissions
  FOR SELECT USING (approval_status IN ('pending', 'approved'));

-- Anyone can insert (anon or authenticated)
CREATE POLICY "public_insert" ON community_submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated users can update their own submissions
CREATE POLICY "owner_update" ON community_submissions
  FOR UPDATE USING (auth.uid() = user_id);
