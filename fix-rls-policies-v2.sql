-- Fix RLS Policies for MusiStash Platform - Version 2
-- This script will temporarily disable RLS to get the app working

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'artist_profiles', 'follow_relationships', 'projects', 'investments');

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view public user data" ON users;
DROP POLICY IF EXISTS "Users can edit own artist profile" ON artist_profiles;
DROP POLICY IF EXISTS "Users can create own artist profile" ON artist_profiles;
DROP POLICY IF EXISTS "Artist profiles are viewable by everyone" ON artist_profiles;
DROP POLICY IF EXISTS "Users can manage own follow relationships" ON follow_relationships;
DROP POLICY IF EXISTS "Users can view follow relationships" ON follow_relationships;
DROP POLICY IF EXISTS "Artists can manage own projects" ON projects;
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Users can view own investments" ON investments;
DROP POLICY IF EXISTS "Users can create own investments" ON investments;
DROP POLICY IF EXISTS "Users can view all data" ON users;
DROP POLICY IF EXISTS "Users can insert data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Artist profiles can be created by anyone" ON artist_profiles;
DROP POLICY IF EXISTS "Artist profiles can be updated by anyone" ON artist_profiles;
DROP POLICY IF EXISTS "Follow relationships are viewable by everyone" ON follow_relationships;
DROP POLICY IF EXISTS "Follow relationships can be managed by anyone" ON follow_relationships;
DROP POLICY IF EXISTS "Projects can be managed by anyone" ON projects;
DROP POLICY IF EXISTS "Investments are viewable by everyone" ON investments;
DROP POLICY IF EXISTS "Investments can be created by anyone" ON investments;

-- TEMPORARILY DISABLE RLS ON ALL TABLES FOR TESTING
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE follow_relationships DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'artist_profiles', 'follow_relationships', 'projects', 'investments');

-- Test insert to make sure it works
-- (This will be commented out to avoid creating test data)
-- INSERT INTO artist_profiles (user_id, artist_name, email, bio, genre, location) 
-- VALUES ('bbcef6f9-cfbd-4fec-80df-e5b2a742862c', 'Test Artist', 'test@example.com', 'Test bio', ARRAY['pop'], 'Test City');

-- Show current table status
SELECT 
    table_name,
    row_security
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'artist_profiles', 'follow_relationships', 'projects', 'investments'); 