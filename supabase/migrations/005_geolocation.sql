-- Geolocation for distance feature
-- Date: 2025-12-05

-- Add latitude and longitude columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ;

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_profiles_location
ON profiles (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Function to calculate distance between two points (Haversine formula)
-- Returns distance in kilometers
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lng1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lng2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
DECLARE
  earth_radius DOUBLE PRECISION := 6371; -- km
  dlat DOUBLE PRECISION;
  dlng DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
BEGIN
  -- Return NULL if any coordinate is NULL
  IF lat1 IS NULL OR lng1 IS NULL OR lat2 IS NULL OR lng2 IS NULL THEN
    RETURN NULL;
  END IF;

  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);

  a := sin(dlat/2) * sin(dlat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlng/2) * sin(dlng/2);

  c := 2 * atan2(sqrt(a), sqrt(1-a));

  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get profiles with distance from a point
CREATE OR REPLACE FUNCTION get_profiles_with_distance(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  max_distance_km DOUBLE PRECISION DEFAULT 100
)
RETURNS TABLE (
  profile_id UUID,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    calculate_distance(user_lat, user_lng, p.latitude, p.longitude) as dist
  FROM profiles p
  WHERE p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND calculate_distance(user_lat, user_lng, p.latitude, p.longitude) <= max_distance_km
  ORDER BY dist;
END;
$$ LANGUAGE plpgsql STABLE;
