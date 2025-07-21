-- Add missing columns to artist_profiles table
-- These columns are referenced in the code but don't exist in the database

ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS career_highlights text[] DEFAULT '{}';
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS musical_style text DEFAULT '';
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS influences text DEFAULT '';
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS location text DEFAULT '';
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN artist_profiles.career_highlights IS 'Array of career highlights and achievements';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Description of the artist''s musical style';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences and inspirations';
COMMENT ON COLUMN artist_profiles.location IS 'Artist location/city';
COMMENT ON COLUMN artist_profiles.social_links IS 'JSON object containing social media links'; 