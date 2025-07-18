-- Add biography field to artist_profiles table
-- Run this in your Supabase SQL Editor

-- Add biography column
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS biography TEXT;

-- Update existing profiles to have default biography
UPDATE artist_profiles 
SET biography = COALESCE(biography, '')
WHERE biography IS NULL;

-- Add comment to document the new field
COMMENT ON COLUMN artist_profiles.biography IS 'Artist''s biography and background information'; 