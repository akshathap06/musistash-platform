-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Allow anyone to create a new user (for registration)
CREATE POLICY "Allow user creation" ON users
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Allow public read access to user profiles (for browsing)
CREATE POLICY "Public read access to users" ON users
    FOR SELECT USING (true);

-- Artist profiles policies
-- Allow users to create their own artist profile
CREATE POLICY "Users can create own artist profile" ON artist_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to read all approved artist profiles
CREATE POLICY "Public read access to approved artist profiles" ON artist_profiles
    FOR SELECT USING (status = 'approved');

-- Allow users to read their own artist profile (even if not approved)
CREATE POLICY "Users can read own artist profile" ON artist_profiles
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow users to update their own artist profile
CREATE POLICY "Users can update own artist profile" ON artist_profiles
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow admins to update any artist profile (for approval/rejection)
CREATE POLICY "Admins can update any artist profile" ON artist_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Follow relationships policies
-- Allow users to create follow relationships
CREATE POLICY "Users can create follow relationships" ON follow_relationships
    FOR INSERT WITH CHECK (auth.uid()::text = follower_id);

-- Allow users to read follow relationships
CREATE POLICY "Public read access to follow relationships" ON follow_relationships
    FOR SELECT USING (true);

-- Allow users to delete their own follow relationships (unfollow)
CREATE POLICY "Users can delete own follow relationships" ON follow_relationships
    FOR DELETE USING (auth.uid()::text = follower_id);

-- Projects policies
-- Allow users to create projects for their own artist profile
CREATE POLICY "Users can create projects for own profile" ON projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM artist_profiles 
            WHERE artist_profiles.user_id = auth.uid()::text 
            AND artist_profiles.id = projects.artist_profile_id
        )
    );

-- Allow public read access to projects
CREATE POLICY "Public read access to projects" ON projects
    FOR SELECT USING (true);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM artist_profiles 
            WHERE artist_profiles.user_id = auth.uid()::text 
            AND artist_profiles.id = projects.artist_profile_id
        )
    );

-- Investments policies
-- Allow users to create investments
CREATE POLICY "Users can create investments" ON investments
    FOR INSERT WITH CHECK (auth.uid()::text = investor_id);

-- Allow users to read their own investments
CREATE POLICY "Users can read own investments" ON investments
    FOR SELECT USING (auth.uid()::text = investor_id);

-- Allow project owners to read investments in their projects
CREATE POLICY "Project owners can read project investments" ON investments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            JOIN artist_profiles ON projects.artist_profile_id = artist_profiles.id
            WHERE projects.id = investments.project_id 
            AND artist_profiles.user_id = auth.uid()::text
        )
    );

-- Allow public read access to investment amounts (for project pages)
CREATE POLICY "Public read access to investment amounts" ON investments
    FOR SELECT USING (true); 