-- Fix Database Schema Issues - Run this in Supabase SQL Editor
-- This fixes the missing columns causing errors

-- Fix uploaded_tracks table - add missing columns
ALTER TABLE uploaded_tracks 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS filename VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
ADD COLUMN IF NOT EXISTS analysis_quality VARCHAR(50) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS libraries_used JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS analysis_json JSONB;

-- Fix artist_profiles table - add missing columns
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS artist_id UUID,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_artist_id ON uploaded_tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_created_at ON uploaded_tracks(created_at);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_artist_id ON artist_profiles(artist_id);

-- Update existing records to have proper timestamps
UPDATE uploaded_tracks 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

UPDATE artist_profiles 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

-- Verify the fixes
SELECT 'uploaded_tracks columns:' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'uploaded_tracks' 
AND column_name IN ('created_at', 'updated_at', 'filename', 'file_size_bytes', 'analysis_quality', 'libraries_used', 'analysis_json')
ORDER BY column_name;

SELECT 'artist_profiles columns:' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'artist_profiles' 
AND column_name IN ('artist_id', 'created_at', 'updated_at')
ORDER BY column_name; 