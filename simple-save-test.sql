-- Test simple update to see if the database is working
-- Replace the UUID with your actual profile ID

-- First, let's see what's in the profile
SELECT 
    id,
    artist_name,
    bio,
    biography,
    genre,
    location,
    musical_style,
    influences,
    career_highlights,
    social_links,
    updated_at
FROM artist_profiles 
WHERE id = '7981c3f1-58c0-4be3-b7fd-4f5476c99857';

-- Try a simple update with just basic fields
UPDATE artist_profiles 
SET 
    artist_name = 'Drake',
    bio = 'Test bio update',
    biography = 'Test biography update',
    genre = ARRAY['rap', 'hip-hop'],
    location = 'Toronto, Canada',
    musical_style = 'Hip-Hop, R&B',
    influences = 'Drake, 21 Savage',
    updated_at = NOW()
WHERE id = '7981c3f1-58c0-4be3-b7fd-4f5476c99857';

-- Check if the update worked
SELECT 
    id,
    artist_name,
    bio,
    biography,
    genre,
    location,
    musical_style,
    influences,
    updated_at
FROM artist_profiles 
WHERE id = '7981c3f1-58c0-4be3-b7fd-4f5476c99857'; 