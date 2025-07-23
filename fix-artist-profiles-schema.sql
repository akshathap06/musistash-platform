-- Comprehensive fix for artist_profiles table schema
-- This migration adds all missing columns that the frontend expects

-- Add missing biography column
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS biography TEXT;

-- Add Spotify integration fields
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS spotify_profile_url TEXT,
ADD COLUMN IF NOT EXISTS spotify_data JSONB;

-- Add new stats fields
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS monthly_listeners INTEGER,
ADD COLUMN IF NOT EXISTS total_streams INTEGER,
ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS spotify_artist_id TEXT,
ADD COLUMN IF NOT EXISTS spotify_embed_urls TEXT[],
ADD COLUMN IF NOT EXISTS youtube_channel_id TEXT,
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS future_releases JSONB;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artist_profiles_spotify_url ON artist_profiles(spotify_profile_url);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_spotify_id ON artist_profiles(spotify_artist_id);

-- Add comments to document the new fields
COMMENT ON COLUMN artist_profiles.biography IS 'Detailed artist biography';
COMMENT ON COLUMN artist_profiles.spotify_profile_url IS 'Full Spotify artist profile URL for automatic data import';
COMMENT ON COLUMN artist_profiles.spotify_data IS 'JSON object containing imported Spotify data (followers, popularity, genres, top tracks)';
COMMENT ON COLUMN artist_profiles.monthly_listeners IS 'Monthly listener count';
COMMENT ON COLUMN artist_profiles.total_streams IS 'Total stream count';
COMMENT ON COLUMN artist_profiles.success_rate IS 'Success rate percentage (0-100)';
COMMENT ON COLUMN artist_profiles.spotify_artist_id IS 'Spotify artist ID';
COMMENT ON COLUMN artist_profiles.spotify_embed_urls IS 'Array of Spotify track/album URLs for embedding';
COMMENT ON COLUMN artist_profiles.youtube_channel_id IS 'YouTube channel ID';
COMMENT ON COLUMN artist_profiles.instagram_handle IS 'Instagram handle';
COMMENT ON COLUMN artist_profiles.twitter_handle IS 'Twitter/X handle';
COMMENT ON COLUMN artist_profiles.website_url IS 'Artist website URL';
COMMENT ON COLUMN artist_profiles.future_releases IS 'JSON array of upcoming releases';

-- Verify the migration worked
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'artist_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 