-- Create view without column conflicts
-- This avoids the "career_highlights specified more than once" error

-- First, drop the view if it exists
DROP VIEW IF EXISTS artist_profiles_with_highlights;

-- Create the view with a different column name to avoid conflicts
CREATE VIEW artist_profiles_with_highlights AS
SELECT 
    ap.id,
    ap.user_id,
    ap.artist_name,
    ap.email,
    ap.profile_photo,
    ap.banner_photo,
    ap.bio,
    ap.biography,
    ap.genre,
    ap.location,
    ap.social_links,
    ap.musical_style,
    ap.influences,
    ap.is_verified,
    ap.status,
    ap.created_at,
    ap.updated_at,
    ap.approved_at,
    ap.approved_by,
    ap.monthly_listeners,
    ap.total_streams,
    ap.success_rate,
    ap.spotify_artist_id,
    ap.spotify_embed_urls,
    ap.youtube_channel_id,
    ap.instagram_handle,
    ap.twitter_handle,
    ap.website_url,
    ap.future_releases,
    ap.spotify_profile_url,
    ap.spotify_data,
    -- Use a different name for the new career highlights to avoid conflict
    COALESCE(
        json_agg(
            json_build_object(
                'id', ch.id,
                'year', ch.year,
                'title', ch.title,
                'description', ch.description
            ) ORDER BY ch.year DESC, ch.created_at DESC
        ) FILTER (WHERE ch.id IS NOT NULL),
        '[]'::json
    ) as career_highlights_new
FROM artist_profiles ap
LEFT JOIN career_highlights ch ON ap.id = ch.artist_profile_id
GROUP BY ap.id, ap.user_id, ap.artist_name, ap.email, ap.profile_photo, ap.banner_photo, 
         ap.bio, ap.biography, ap.genre, ap.location, ap.social_links, ap.musical_style, 
         ap.influences, ap.is_verified, ap.status, ap.created_at, ap.updated_at, 
         ap.approved_at, ap.approved_by, ap.monthly_listeners, ap.total_streams, 
         ap.success_rate, ap.spotify_artist_id, ap.spotify_embed_urls, ap.youtube_channel_id, 
         ap.instagram_handle, ap.twitter_handle, ap.website_url, ap.future_releases, 
         ap.spotify_profile_url, ap.spotify_data;

-- Test the view
SELECT 'View created successfully!' as status;

-- Verify the view exists
SELECT table_name FROM information_schema.views WHERE table_name = 'artist_profiles_with_highlights'; 