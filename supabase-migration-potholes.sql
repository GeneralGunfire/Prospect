-- Pothole Reporting System
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS potholes (
  id                UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  latitude          FLOAT         NOT NULL DEFAULT 0,
  longitude         FLOAT         NOT NULL DEFAULT 0,
  address           TEXT          NOT NULL,
  street_name       VARCHAR(255),
  province          VARCHAR(50)   NOT NULL,
  municipality      VARCHAR(100),
  description       TEXT,
  image_url         VARCHAR(500),
  severity          VARCHAR(20)   NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  flag_count        INT           NOT NULL DEFAULT 1,
  status            VARCHAR(20)   NOT NULL DEFAULT 'needs_attention' CHECK (status IN ('needs_attention', 'reported', 'fixed')),
  needs_fixing      BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  fixed_at          TIMESTAMPTZ,
  fixed_by_user_id  UUID          REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pothole_flags (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pothole_id  UUID        NOT NULL REFERENCES potholes(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flagged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pothole_id, user_id)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_potholes_status       ON potholes(status);
CREATE INDEX IF NOT EXISTS idx_potholes_needs_fixing ON potholes(needs_fixing);
CREATE INDEX IF NOT EXISTS idx_potholes_province     ON potholes(province);
CREATE INDEX IF NOT EXISTS idx_potholes_street_name  ON potholes(street_name);
CREATE INDEX IF NOT EXISTS idx_potholes_created_at   ON potholes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_potholes_user_id      ON potholes(user_id);
CREATE INDEX IF NOT EXISTS idx_pothole_flags_user    ON pothole_flags(user_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE potholes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pothole_flags ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can view all potholes
CREATE POLICY "Anyone can view potholes"
  ON potholes FOR SELECT
  USING (true);

-- Authenticated users can insert potholes
CREATE POLICY "Authenticated users can insert potholes"
  ON potholes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own potholes (for mark-as-fixed)
CREATE POLICY "Users can update potholes"
  ON potholes FOR UPDATE
  TO authenticated
  USING (true);

-- Anyone can view flags
CREATE POLICY "Anyone can view flags"
  ON pothole_flags FOR SELECT
  USING (true);

-- Authenticated users can insert flags
CREATE POLICY "Authenticated users can flag potholes"
  ON pothole_flags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Run this separately in Supabase Dashboard → Storage → New bucket
-- Bucket name: potholes
-- Public: true (so images are publicly accessible)
--
-- Or run via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('potholes', 'potholes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view pothole images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'potholes');

CREATE POLICY "Authenticated users can upload pothole images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'potholes');
