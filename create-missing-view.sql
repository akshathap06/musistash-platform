-- Create the missing artist_profiles_with_highlights view
-- Run this in Supabase SQL Editor

-- First, drop the view if it exists to avoid conflicts
DROP VIEW IF EXISTS artist_profiles_with_highlights;

-- Create the view that aggregates career highlights as JSON
CREATE VIEW artist_profiles_with_highlights AS
SELECT 
    ap.*,
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
GROUP BY ap.id;

-- Add comment for documentation
COMMENT ON VIEW artist_profiles_with_highlights IS 'Artist profiles with career highlights aggregated as JSON array';

-- Test the view
SELECT 'View created successfully!' as status;

-- Verify the view exists
SELECT table_name FROM information_schema.views WHERE table_name = 'artist_profiles_with_highlights'; 