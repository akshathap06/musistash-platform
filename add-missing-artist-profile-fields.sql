-- Add missing fields to artist_profiles table
-- This migration adds all the fields that are in the ArtistProfileManager form but missing from the database

-- Add biography field (detailed biography)
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS biography TEXT;

-- Add career highlights as JSONB array
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]';

-- Add musical style and influences
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS musical_style TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS influences TEXT;

-- Add stats fields
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS monthly_listeners INTEGER DEFAULT 0;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS total_streams INTEGER DEFAULT 0;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 0;

-- Add future releases as JSONB array
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS future_releases JSONB DEFAULT '[]';

-- Add Spotify integration fields
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS spotify_artist_id TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS spotify_embed_urls TEXT[] DEFAULT '{}';
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS spotify_profile_url TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS spotify_data JSONB DEFAULT '{}';

-- Add social media handle fields (separate from social_links JSONB)
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS twitter_handle TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS youtube_channel_id TEXT;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add verification status
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Update existing records to have default values
UPDATE artist_profiles SET 
    biography = COALESCE(biography, ''),
    career_highlights = COALESCE(career_highlights, '[]'),
    musical_style = COALESCE(musical_style, ''),
    influences = COALESCE(influences, ''),
    monthly_listeners = COALESCE(monthly_listeners, 0),
    total_streams = COALESCE(total_streams, 0),
    success_rate = COALESCE(success_rate, 0),
    future_releases = COALESCE(future_releases, '[]'),
    spotify_artist_id = COALESCE(spotify_artist_id, ''),
    spotify_embed_urls = COALESCE(spotify_embed_urls, '{}'),
    spotify_profile_url = COALESCE(spotify_profile_url, ''),
    spotify_data = COALESCE(spotify_data, '{}'),
    instagram_handle = COALESCE(instagram_handle, ''),
    twitter_handle = COALESCE(twitter_handle, ''),
    youtube_channel_id = COALESCE(youtube_channel_id, ''),
    website_url = COALESCE(website_url, ''),
    is_verified = COALESCE(is_verified, FALSE);

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_artist_profiles_spotify_artist_id ON artist_profiles(spotify_artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_instagram_handle ON artist_profiles(instagram_handle);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_twitter_handle ON artist_profiles(twitter_handle);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_youtube_channel_id ON artist_profiles(youtube_channel_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_verified ON artist_profiles(is_verified);

-- Add comments to document the new fields
COMMENT ON COLUMN artist_profiles.biography IS 'Detailed biography displayed in the About section';
COMMENT ON COLUMN artist_profiles.career_highlights IS 'Array of career achievements and milestones';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Artist''s musical style and genre preferences';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences and inspirations';
COMMENT ON COLUMN artist_profiles.monthly_listeners IS 'Monthly listener count from streaming platforms';
COMMENT ON COLUMN artist_profiles.total_streams IS 'Total stream count across all platforms';
COMMENT ON COLUMN artist_profiles.success_rate IS 'Success rate percentage (0-100)';
COMMENT ON COLUMN artist_profiles.future_releases IS 'Array of upcoming music releases';
COMMENT ON COLUMN artist_profiles.spotify_artist_id IS 'Spotify artist ID for integration';
COMMENT ON COLUMN artist_profiles.spotify_embed_urls IS 'Array of Spotify embed URLs for music';
COMMENT ON COLUMN artist_profiles.spotify_profile_url IS 'Full Spotify artist profile URL';
COMMENT ON COLUMN artist_profiles.spotify_data IS 'Cached Spotify data including followers, popularity, etc.';
COMMENT ON COLUMN artist_profiles.instagram_handle IS 'Instagram username without @';
COMMENT ON COLUMN artist_profiles.twitter_handle IS 'Twitter username without @';
COMMENT ON COLUMN artist_profiles.youtube_channel_id IS 'YouTube channel ID';
COMMENT ON COLUMN artist_profiles.website_url IS 'Artist''s official website URL';
COMMENT ON COLUMN artist_profiles.is_verified IS 'Whether the artist profile is verified';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'artist_profiles' 
ORDER BY ordinal_position; 