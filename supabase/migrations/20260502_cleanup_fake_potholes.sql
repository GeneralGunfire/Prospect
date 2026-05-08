-- ── Fake Pothole Cleanup ──────────────────────────────────────────────────────
-- Run in Supabase SQL Editor to remove obvious test/fake reports.
-- Safe: only deletes rows matching clearly fake patterns.

-- 1. Delete reports with spam/test descriptions
DELETE FROM potholes
WHERE
  -- Common test keywords (case-insensitive)
  description ILIKE '%test%'
  OR description ILIKE '%asdf%'
  OR description ILIKE '%qwerty%'
  OR description ILIKE '%hello%'
  OR description ILIKE '%lol%'
  OR description ILIKE '%fake%'
  OR description ILIKE '%dummy%'
  OR description ILIKE '%placeholder%'
  OR description ILIKE '%foo bar%'
  OR description ILIKE '%blah%'
  -- Pure numbers or single repeated characters
  OR description ~ '^[0-9\s]+$'
  OR description ~ '^(.)\1+$'
  -- Very short descriptions that are nonsense
  OR (LENGTH(TRIM(description)) < 4 AND description IS NOT NULL AND description != '')
;

-- 2. Delete reports where address is clearly fake/test
DELETE FROM potholes
WHERE
  address ILIKE '%test%'
  OR address ILIKE '%fake%'
  OR address ILIKE '%asdf%'
  OR address ILIKE '%unknown%'
  OR TRIM(address) = ''
  OR address IS NULL
;

-- 3. Delete duplicate reports (same address, same severity, created within 1 minute)
DELETE FROM potholes
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY address, severity
        ORDER BY created_at ASC
      ) AS rn
    FROM potholes
    WHERE created_at > NOW() - INTERVAL '7 days'
  ) ranked
  WHERE rn > 1
);

-- 4. Delete reports with coordinates 0,0 AND no description AND no image
DELETE FROM potholes
WHERE
  latitude = 0
  AND longitude = 0
  AND (description IS NULL OR TRIM(description) = '')
  AND image_url IS NULL
  AND flag_count <= 1
;

-- 5. Show what's left (run SELECT first to preview before DELETE if preferred)
SELECT
  id,
  address,
  province,
  municipality,
  severity,
  description,
  flag_count,
  created_at
FROM potholes
ORDER BY created_at DESC
LIMIT 50;
