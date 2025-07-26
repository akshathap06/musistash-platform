-- Fix Database Schema Issues
-- This migration fixes missing columns that are causing errors

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

-- Add comments for documentation
COMMENT ON COLUMN uploaded_tracks.created_at IS 'Timestamp when the track was uploaded and analyzed';
COMMENT ON COLUMN uploaded_tracks.updated_at IS 'Timestamp when the track analysis was last updated';
COMMENT ON COLUMN uploaded_tracks.filename IS 'Original filename of the uploaded track';
COMMENT ON COLUMN uploaded_tracks.file_size_bytes IS 'Size of the uploaded file in bytes';
COMMENT ON COLUMN uploaded_tracks.analysis_quality IS 'Quality level of the analysis (basic, enhanced, ai_enhanced)';
COMMENT ON COLUMN uploaded_tracks.libraries_used IS 'JSON array of libraries used for analysis';
COMMENT ON COLUMN uploaded_tracks.analysis_json IS 'Complete analysis results as JSON';

COMMENT ON COLUMN artist_profiles.artist_id IS 'Unique identifier for the artist';
COMMENT ON COLUMN artist_profiles.created_at IS 'Timestamp when the profile was created';
COMMENT ON COLUMN artist_profiles.updated_at IS 'Timestamp when the profile was last updated';

-- Update existing records to have proper timestamps
UPDATE uploaded_tracks 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

UPDATE artist_profiles 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL; 