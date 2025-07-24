-- Fix database timeout issues for artist_profiles table
-- This script optimizes the table structure and adds better performance settings

-- First, let's check if there are any long-running transactions
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND query LIKE '%artist_profiles%';

-- Kill any long-running queries (be careful with this in production)
-- SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
-- WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
-- AND query LIKE '%artist_profiles%';

-- Add missing indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artist_profiles_user_id_status ON artist_profiles(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artist_profiles_email_status ON artist_profiles(email, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artist_profiles_updated_at ON artist_profiles(updated_at DESC);

-- Add partial indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artist_profiles_pending ON artist_profiles(id) WHERE status = 'pending';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artist_profiles_approved ON artist_profiles(id) WHERE status = 'approved';

-- Optimize table storage
ALTER TABLE artist_profiles SET (fillfactor = 90);

-- Update table statistics
ANALYZE artist_profiles;

-- Check table size and bloat
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats 
WHERE tablename = 'artist_profiles'
ORDER BY attname;

-- Show current table size
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE tablename = 'artist_profiles';

-- Check for any locks on the table
SELECT 
    locktype,
    database,
    relation::regclass,
    page,
    tuple,
    virtualxid,
    transactionid,
    classid,
    objid,
    objsubid,
    virtualtransaction,
    pid,
    mode,
    granted
FROM pg_locks 
WHERE relation = 'artist_profiles'::regclass;

-- Set better timeout settings for this session (if you have permission)
-- SET statement_timeout = '30s';
-- SET lock_timeout = '10s'; 