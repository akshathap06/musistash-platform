-- Step-by-Step Migration for Career Highlights
-- Run each section separately to avoid conflicts

-- STEP 1: Create the career_highlights table
-- Run this first
CREATE TABLE IF NOT EXISTS career_highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    year VARCHAR(4) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create the index
-- Run this after step 1
CREATE INDEX IF NOT EXISTS idx_career_highlights_artist_profile_id ON career_highlights(artist_profile_id);

-- STEP 3: Drop the view if it exists (to avoid conflicts)
-- Run this after step 2
DROP VIEW IF EXISTS artist_profiles_with_highlights;

-- STEP 4: Create the view with a different column name
-- Run this after step 3
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

-- STEP 5: Drop the function if it exists
-- Run this after step 4
DROP FUNCTION IF EXISTS update_artist_career_highlights(UUID, JSON);

-- STEP 6: Create the function
-- Run this after step 5
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

-- STEP 7: Test the setup
-- Run this to verify everything works
SELECT 'Migration completed successfully!' as status;

-- Optional: Check if the table was created
SELECT table_name FROM information_schema.tables WHERE table_name = 'career_highlights';

-- Optional: Check if the view was created
SELECT table_name FROM information_schema.views WHERE table_name = 'artist_profiles_with_highlights';

-- Optional: Check if the function was created
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'update_artist_career_highlights'; 