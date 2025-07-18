-- Add missing columns to artist_profiles table
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS musical_style TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS influences TEXT DEFAULT '';

-- Update existing rows to have default values
UPDATE artist_profiles 
SET 
  career_highlights = '[]' WHERE career_highlights IS NULL,
  musical_style = '' WHERE musical_style IS NULL,
  influences = '' WHERE influences IS NULL; 