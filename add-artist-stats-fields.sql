-- Add new artist stats fields to artist_profiles table
-- This migration adds fields for monthly listeners, future releases, and enhanced music links

ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS monthly_listeners INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_streams BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS future_releases JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS spotify_artist_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS spotify_embed_urls JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS youtube_channel_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR(255),
ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(255),
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS musical_style TEXT,
ADD COLUMN IF NOT EXISTS influences TEXT,
ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS verified_status BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN artist_profiles.monthly_listeners IS 'Number of monthly listeners on streaming platforms';
COMMENT ON COLUMN artist_profiles.total_streams IS 'Total streams across all platforms';
COMMENT ON COLUMN artist_profiles.future_releases IS 'JSON array of upcoming releases with dates and descriptions';
COMMENT ON COLUMN artist_profiles.spotify_artist_id IS 'Spotify artist ID for API integration';
COMMENT ON COLUMN artist_profiles.spotify_embed_urls IS 'JSON array of Spotify track/album embed URLs';
COMMENT ON COLUMN artist_profiles.youtube_channel_id IS 'YouTube channel ID';
COMMENT ON COLUMN artist_profiles.instagram_handle IS 'Instagram handle without @';
COMMENT ON COLUMN artist_profiles.twitter_handle IS 'Twitter handle without @';
COMMENT ON COLUMN artist_profiles.website_url IS 'Official website URL';
COMMENT ON COLUMN artist_profiles.career_highlights IS 'JSON array of career achievements';
COMMENT ON COLUMN artist_profiles.musical_style IS 'Description of musical style';
COMMENT ON COLUMN artist_profiles.influences IS 'Musical influences';
COMMENT ON COLUMN artist_profiles.success_rate IS 'Success rate percentage based on project performance';
COMMENT ON COLUMN artist_profiles.verified_status IS 'Whether the artist is verified';

-- Create index for better performance on stats queries
CREATE INDEX IF NOT EXISTS idx_artist_profiles_monthly_listeners ON artist_profiles(monthly_listeners DESC);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_total_streams ON artist_profiles(total_streams DESC);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_success_rate ON artist_profiles(success_rate DESC); 