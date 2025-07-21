-- Add missing columns to artist_profiles table
-- These columns are referenced in the code but don't exist in the database

ALTER TABLE artist_profiles ADD COLUMN career_highlights text[] DEFAULT '{}';
ALTER TABLE artist_profiles ADD COLUMN musical_style text DEFAULT '';
ALTER TABLE artist_profiles ADD COLUMN influences text DEFAULT '';

-- Add comments for documentation
COMMENT ON COLUMN artist_profiles.career_highlights IS 'Array of career highlights and achievements';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Description of the artist''s musical style';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences and inspirations'; 