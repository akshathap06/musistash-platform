-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    role VARCHAR(50) DEFAULT 'listener' CHECK (role IN ('artist', 'listener', 'developer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist profiles table
CREATE TABLE artist_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_photo TEXT DEFAULT '/placeholder.svg',
    banner_photo TEXT DEFAULT '/placeholder.svg',
    bio TEXT,
    genre TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id)
);

-- Follow relationships table
CREATE TABLE follow_relationships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, artist_id)
);

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    banner_image TEXT DEFAULT '/placeholder.svg',
    project_type VARCHAR(50) DEFAULT 'album' CHECK (project_type IN ('album', 'single', 'ep', 'mixtape')),
    genre TEXT[] DEFAULT '{}',
    funding_goal DECIMAL(10,2) NOT NULL,
    min_investment DECIMAL(10,2) NOT NULL,
    max_investment DECIMAL(10,2) NOT NULL,
    expected_roi DECIMAL(5,2) NOT NULL,
    project_duration VARCHAR(100) NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'funded', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    investment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_artist_profiles_user_id ON artist_profiles(user_id);
CREATE INDEX idx_artist_profiles_status ON artist_profiles(status);
CREATE INDEX idx_follow_relationships_follower_id ON follow_relationships(follower_id);
CREATE INDEX idx_follow_relationships_artist_id ON follow_relationships(artist_id);
CREATE INDEX idx_projects_artist_id ON projects(artist_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_project_id ON investments(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (using proper UUID generation)
INSERT INTO users (name, email, role) VALUES (
    'Akshat Thapliyal',
    'akshathapliyal27@gmail.com',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data and public user data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can view public user data" ON users FOR SELECT USING (true);

-- Artist profiles can be viewed by everyone, but only edited by the owner or admin
CREATE POLICY "Artist profiles are viewable by everyone" ON artist_profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own artist profile" ON artist_profiles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own artist profile" ON artist_profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Follow relationships
CREATE POLICY "Users can view follow relationships" ON follow_relationships FOR SELECT USING (true);
CREATE POLICY "Users can manage own follow relationships" ON follow_relationships FOR ALL USING (auth.uid()::text = follower_id::text);

-- Projects
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Artists can manage own projects" ON projects FOR ALL USING (
    EXISTS (
        SELECT 1 FROM artist_profiles 
        WHERE artist_profiles.id = projects.artist_id 
        AND artist_profiles.user_id::text = auth.uid()::text
    )
);

-- Investments
CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own investments" ON investments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text); 