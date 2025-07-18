-- Add new fields to artist_profiles table for enhanced profile information
-- Run this in your Supabase SQL Editor

-- Add career_highlights column (JSONB to store array of career highlights)
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]'::jsonb;

-- Add musical_style column
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS musical_style TEXT;

-- Add influences column
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS influences TEXT;

-- Add banner_photo column if it doesn't exist
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS banner_photo TEXT DEFAULT '/placeholder.svg';

-- Update existing profiles to have default values
UPDATE artist_profiles 
SET 
  career_highlights = '[]'::jsonb,
  musical_style = COALESCE(musical_style, ''),
  influences = COALESCE(influences, ''),
  banner_photo = COALESCE(banner_photo, '/placeholder.svg')
WHERE career_highlights IS NULL 
   OR musical_style IS NULL 
   OR influences IS NULL 
   OR banner_photo IS NULL;

-- Add comments to document the new fields
COMMENT ON COLUMN artist_profiles.career_highlights IS 'Array of career highlights with year, title, and description';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Artist''s primary musical style/genre';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences and inspirations';
COMMENT ON COLUMN artist_profiles.banner_photo IS 'Banner image for the artist profile'; 