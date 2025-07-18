-- Fix Database Schema for MusiStash Platform
-- Run this in your Supabase SQL Editor to add missing fields

-- Add missing fields to artist_profiles table
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]'::jsonb;

ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS musical_style TEXT DEFAULT '';

ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS influences TEXT DEFAULT '';

-- Update existing profiles to have default values
UPDATE artist_profiles 
SET 
  career_highlights = COALESCE(career_highlights, '[]'::jsonb),
  musical_style = COALESCE(musical_style, ''),
  influences = COALESCE(influences, '')
WHERE career_highlights IS NULL 
   OR musical_style IS NULL 
   OR influences IS NULL;

-- Add comments to document the new fields
COMMENT ON COLUMN artist_profiles.career_highlights IS 'Array of career highlights with year, title, and description';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Artist''s primary musical style/genre';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences and inspirations';

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'artist_profiles' 
ORDER BY ordinal_position; 