-- Simple database optimization for artist_profiles table
-- This script works in Supabase SQL Editor without transaction issues

-- Add basic indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_status ON artist_profiles(status);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_email ON artist_profiles(email);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_created_at ON artist_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_updated_at ON artist_profiles(updated_at);

-- Add composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_status ON artist_profiles(user_id, status);

-- Update table statistics for better query planning
ANALYZE artist_profiles;

-- Check current table size
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE tablename = 'artist_profiles';

-- Show current indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'artist_profiles'
ORDER BY indexname; 