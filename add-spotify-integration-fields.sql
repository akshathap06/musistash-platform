-- Add Spotify integration fields to artist_profiles table
-- This migration adds fields for automatic Spotify data import

ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS spotify_profile_url TEXT,
ADD COLUMN IF NOT EXISTS spotify_data JSONB;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_artist_profiles_spotify_url ON artist_profiles(spotify_profile_url);

-- Add comment to document the new fields
COMMENT ON COLUMN artist_profiles.spotify_profile_url IS 'Full Spotify artist profile URL for automatic data import';
COMMENT ON COLUMN artist_profiles.spotify_data IS 'JSON object containing imported Spotify data (followers, popularity, genres, top tracks)'; 