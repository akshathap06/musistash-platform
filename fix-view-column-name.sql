-- Fix the view column name to match frontend expectations
-- The frontend expects 'career_highlights' but the view uses 'career_highlights_new'

-- Drop the existing view
DROP VIEW IF EXISTS artist_profiles_with_highlights;

-- Recreate the view with the correct column name
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
    -- Use the correct column name that frontend expects
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
    ) as career_highlights
FROM artist_profiles ap
LEFT JOIN career_highlights ch ON ap.id = ch.artist_profile_id
GROUP BY ap.id, ap.user_id, ap.artist_name, ap.email, ap.profile_photo, ap.banner_photo, 
         ap.bio, ap.biography, ap.genre, ap.location, ap.social_links, ap.musical_style, 
         ap.influences, ap.is_verified, ap.status, ap.created_at, ap.updated_at, 
         ap.monthly_listeners, ap.total_streams, ap.success_rate, ap.spotify_artist_id, 
         ap.spotify_embed_urls, ap.youtube_channel_id, ap.instagram_handle, ap.twitter_handle, 
         ap.website_url, ap.future_releases, ap.spotify_profile_url, ap.spotify_data;

-- Test the view
SELECT 'View fixed successfully!' as status;

-- Verify the view has the correct column name
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'artist_profiles_with_highlights' 
AND column_name = 'career_highlights'; 