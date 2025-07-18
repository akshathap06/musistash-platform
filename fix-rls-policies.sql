-- Fix RLS Policies for MusiStash Platform
-- This script updates the RLS policies to work with the current authentication system

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'artist_profiles', 'follow_relationships', 'projects', 'investments');

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can edit own artist profile" ON artist_profiles;
DROP POLICY IF EXISTS "Users can create own artist profile" ON artist_profiles;
DROP POLICY IF EXISTS "Users can manage own follow relationships" ON follow_relationships;
DROP POLICY IF EXISTS "Artists can manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can view own investments" ON investments;
DROP POLICY IF EXISTS "Users can create own investments" ON investments;

-- Create new policies that work without auth.uid()
-- Users table policies
CREATE POLICY "Users can view all data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

-- Artist profiles policies - allow all operations for now
CREATE POLICY "Artist profiles are viewable by everyone" ON artist_profiles FOR SELECT USING (true);
CREATE POLICY "Artist profiles can be created by anyone" ON artist_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Artist profiles can be updated by anyone" ON artist_profiles FOR UPDATE USING (true);

-- Follow relationships policies
CREATE POLICY "Follow relationships are viewable by everyone" ON follow_relationships FOR SELECT USING (true);
CREATE POLICY "Follow relationships can be managed by anyone" ON follow_relationships FOR ALL USING (true);

-- Projects policies
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Projects can be managed by anyone" ON projects FOR ALL USING (true);

-- Investments policies
CREATE POLICY "Investments are viewable by everyone" ON investments FOR SELECT USING (true);
CREATE POLICY "Investments can be created by anyone" ON investments FOR INSERT WITH CHECK (true);

-- Verify the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'artist_profiles', 'follow_relationships', 'projects', 'investments')
ORDER BY tablename, policyname; 