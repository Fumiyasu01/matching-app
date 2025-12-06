-- Security Enhancements Migration
-- Date: 2025-12-05

-- 1. Add message content length constraint
ALTER TABLE messages
ADD CONSTRAINT message_content_length
CHECK (length(content) <= 5000);

-- 2. Prevent self-swipe
ALTER TABLE swipes
ADD CONSTRAINT no_self_swipe
CHECK (swiper_id != swiped_id);

-- 3. Create function to validate text array length
CREATE OR REPLACE FUNCTION validate_text_array(arr TEXT[], max_items INT, max_length INT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow empty arrays
  IF arr IS NULL OR array_length(arr, 1) IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Check array size
  IF array_length(arr, 1) > max_items THEN
    RETURN FALSE;
  END IF;

  -- Check individual item length
  RETURN NOT EXISTS (
    SELECT 1 FROM unnest(arr) AS elem WHERE length(elem) > max_length
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Add constraints for skills and interests arrays
ALTER TABLE profiles
ADD CONSTRAINT valid_skills
CHECK (validate_text_array(skills, 20, 50));

ALTER TABLE profiles
ADD CONSTRAINT valid_interests
CHECK (validate_text_array(interests, 20, 50));

-- 5. Add rate limiting function for swipes (100 per day)
CREATE OR REPLACE FUNCTION check_swipe_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  swipe_count INT;
BEGIN
  SELECT COUNT(*) INTO swipe_count
  FROM swipes
  WHERE swiper_id = NEW.swiper_id
    AND created_at > NOW() - INTERVAL '24 hours';

  IF swipe_count >= 100 THEN
    RAISE EXCEPTION 'Daily swipe limit exceeded (100 per day)';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS enforce_swipe_rate_limit ON swipes;
CREATE TRIGGER enforce_swipe_rate_limit
  BEFORE INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION check_swipe_rate_limit();

-- 6. Update check_and_create_match function to validate swiper
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  -- Validate that the swiper is the current authenticated user
  IF NEW.swiper_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized swipe action';
  END IF;

  IF NEW.action = 'like' THEN
    -- Check for mutual like
    SELECT EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND action = 'like'
    ) INTO mutual_like;

    IF mutual_like THEN
      -- Create match with ordered IDs
      IF NEW.swiper_id < NEW.swiped_id THEN
        smaller_id := NEW.swiper_id;
        larger_id := NEW.swiped_id;
      ELSE
        smaller_id := NEW.swiped_id;
        larger_id := NEW.swiper_id;
      END IF;

      -- Insert match (ignore if already exists)
      INSERT INTO matches (user1_id, user2_id)
      VALUES (smaller_id, larger_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add rate limiting for messages (50 per hour per conversation)
CREATE OR REPLACE FUNCTION check_message_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  message_count INT;
BEGIN
  SELECT COUNT(*) INTO message_count
  FROM messages
  WHERE match_id = NEW.match_id
    AND sender_id = NEW.sender_id
    AND created_at > NOW() - INTERVAL '1 hour';

  IF message_count >= 50 THEN
    RAISE EXCEPTION 'Message rate limit exceeded (50 per hour per conversation)';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_message_rate_limit ON messages;
CREATE TRIGGER enforce_message_rate_limit
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_rate_limit();
