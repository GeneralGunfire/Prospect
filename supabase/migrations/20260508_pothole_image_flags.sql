-- ── Pothole Image Fake-Report Flags ──────────────────────────────────────────
-- Allows users to flag a pothole's photo as fake/misleading.
-- One flag per user per pothole. Pothole gains image_flag_count column.

-- 1. Add image_flag_count to potholes
ALTER TABLE potholes
  ADD COLUMN IF NOT EXISTS image_flag_count INT NOT NULL DEFAULT 0;

-- 2. Create the image flags table
CREATE TABLE IF NOT EXISTS pothole_image_flags (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pothole_id  UUID        NOT NULL REFERENCES potholes(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      VARCHAR(50) NOT NULL DEFAULT 'looks_fake'
                CHECK (reason IN ('looks_fake', 'wrong_location', 'not_a_pothole', 'duplicate_image', 'other')),
  flagged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pothole_id, user_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_image_flags_pothole ON pothole_image_flags(pothole_id);
CREATE INDEX IF NOT EXISTS idx_image_flags_user    ON pothole_image_flags(user_id);

-- 4. RLS: public read, authenticated insert
ALTER TABLE pothole_image_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read image flags"
  ON pothole_image_flags FOR SELECT USING (true);

CREATE POLICY "Authenticated insert image flags"
  ON pothole_image_flags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also allow anon insert (for the anon key used by the app)
CREATE POLICY "Anon insert image flags"
  ON pothole_image_flags FOR INSERT
  WITH CHECK (true);

-- 5. Function: flag image and increment counter atomically
CREATE OR REPLACE FUNCTION flag_pothole_image(
  p_pothole_id UUID,
  p_user_id    UUID,
  p_reason     VARCHAR DEFAULT 'looks_fake'
)
RETURNS TABLE(success BOOLEAN, image_flag_count INT, error TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_count INT;
BEGIN
  -- Insert flag (unique constraint raises if duplicate)
  INSERT INTO pothole_image_flags (pothole_id, user_id, reason)
  VALUES (p_pothole_id, p_user_id, p_reason);

  -- Increment counter
  UPDATE potholes
  SET image_flag_count = image_flag_count + 1
  WHERE id = p_pothole_id
  RETURNING image_flag_count INTO new_count;

  RETURN QUERY SELECT true, new_count, NULL::TEXT;
EXCEPTION
  WHEN unique_violation THEN
    RETURN QUERY SELECT false, 0, 'already_flagged'::TEXT;
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, 0, SQLERRM;
END;
$$;
