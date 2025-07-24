-- Optimize artist_profiles table performance
-- This script adds indexes and optimizes the table structure to prevent timeouts

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_status ON artist_profiles(status);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_created_at ON artist_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_updated_at ON artist_profiles(updated_at);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_artist_name ON artist_profiles(artist_name);

-- Add composite index for status and created_at (commonly used together)
CREATE INDEX IF NOT EXISTS idx_artist_profiles_status_created_at ON artist_profiles(status, created_at);

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_artist_profiles_email ON artist_profiles(email);

-- Optimize the table by vacuuming and analyzing
VACUUM ANALYZE artist_profiles;

-- Check current table size and statistics
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'artist_profiles'
ORDER BY attname;

-- Show current indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'artist_profiles'; 