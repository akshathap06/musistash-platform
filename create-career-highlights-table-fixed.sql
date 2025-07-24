-- Create separate table for career highlights to avoid database issues
-- This will store career highlights as individual records instead of a large JSONB array
-- FIXED VERSION: Handles existing career_highlights columns properly

-- Step 1: Create career_highlights table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS career_highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    year VARCHAR(4) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create index for better performance (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_career_highlights_artist_profile_id ON career_highlights(artist_profile_id);

-- Step 3: Add comment for documentation
COMMENT ON TABLE career_highlights IS 'Individual career highlights for artists, stored separately to avoid JSONB size issues';

-- Step 4: Create a view to easily get career highlights as JSON for the frontend
-- Drop the view first if it exists to avoid conflicts
DROP VIEW IF EXISTS artist_profiles_with_highlights;

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
    ) as career_highlights_json
FROM artist_profiles ap
LEFT JOIN career_highlights ch ON ap.id = ch.artist_profile_id
GROUP BY ap.id;

-- Step 5: Add comment for the view
COMMENT ON VIEW artist_profiles_with_highlights IS 'Artist profiles with career highlights aggregated as JSON array';

-- Step 6: Create function to update career highlights for an artist
-- Drop the function first if it exists to avoid conflicts
DROP FUNCTION IF EXISTS update_artist_career_highlights(UUID, JSON);

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

-- Step 7: Add comment for the function
COMMENT ON FUNCTION update_artist_career_highlights IS 'Function to update career highlights for an artist profile';

-- Step 8: Optional: Migrate existing career highlights data from JSONB column
-- Uncomment the following section if you want to migrate existing data
/*
-- Check if there's existing career_highlights data in the artist_profiles table
DO $$
BEGIN
    -- Only run if the career_highlights column exists and has data
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'artist_profiles' 
        AND column_name = 'career_highlights'
    ) THEN
        -- Insert existing career highlights into the new table
        INSERT INTO career_highlights (artist_profile_id, year, title, description)
        SELECT 
            id as artist_profile_id,
            (highlight->>'year')::VARCHAR(4) as year,
            (highlight->>'title')::VARCHAR(255) as title,
            (highlight->>'description')::TEXT as description
        FROM artist_profiles,
             json_array_elements(career_highlights) as highlight
        WHERE career_highlights IS NOT NULL 
          AND career_highlights != '[]'::jsonb
          AND json_array_length(career_highlights) > 0;
        
        RAISE NOTICE 'Migrated existing career highlights data';
    END IF;
END $$;
*/ 