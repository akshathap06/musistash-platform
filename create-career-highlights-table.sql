-- Create separate table for career highlights to avoid database issues
-- This will store career highlights as individual records instead of a large JSONB array

-- Create career_highlights table
CREATE TABLE IF NOT EXISTS career_highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    year VARCHAR(4) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_career_highlights_artist_profile_id ON career_highlights(artist_profile_id);

-- Add comment for documentation
COMMENT ON TABLE career_highlights IS 'Individual career highlights for artists, stored separately to avoid JSONB size issues';

-- Create a view to easily get career highlights as JSON for the frontend
CREATE OR REPLACE VIEW artist_profiles_with_highlights AS
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

-- Add comment for the view
COMMENT ON VIEW artist_profiles_with_highlights IS 'Artist profiles with career highlights aggregated as JSON array';

-- Function to update career highlights for an artist
CREATE OR REPLACE FUNCTION update_artist_career_highlights(
    p_artist_profile_id UUID,
    p_highlights JSON
)
RETURNS VOID AS $$
DECLARE
    highlight JSON;
BEGIN
    -- Delete existing highlights for this artist
    DELETE FROM career_highlights WHERE artist_profile_id = p_artist_profile_id;
    
    -- Insert new highlights
    FOR highlight IN SELECT * FROM json_array_elements(p_highlights)
    LOOP
        INSERT INTO career_highlights (
            artist_profile_id,
            year,
            title,
            description
        ) VALUES (
            p_artist_profile_id,
            (highlight->>'year')::VARCHAR(4),
            (highlight->>'title')::VARCHAR(255),
            (highlight->>'description')::TEXT
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Add comment for the function
COMMENT ON FUNCTION update_artist_career_highlights IS 'Function to update career highlights for an artist profile'; 