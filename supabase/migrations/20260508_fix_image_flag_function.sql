-- Fix: ambiguous column reference in flag_pothole_image function
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
  INSERT INTO pothole_image_flags (pothole_id, user_id, reason)
  VALUES (p_pothole_id, p_user_id, p_reason);

  UPDATE potholes p
  SET image_flag_count = p.image_flag_count + 1
  WHERE p.id = p_pothole_id;

  SELECT p.image_flag_count INTO new_count
  FROM potholes p
  WHERE p.id = p_pothole_id;

  RETURN QUERY SELECT true, new_count, NULL::TEXT;
EXCEPTION
  WHEN unique_violation THEN
    RETURN QUERY SELECT false, 0, 'already_flagged'::TEXT;
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, 0, SQLERRM;
END;
$$;
