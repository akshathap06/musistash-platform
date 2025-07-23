-- Copy and paste these commands into your Supabase SQL Editor
-- This will update the projects table to support the new project structure

-- First, drop the existing constraint for project_type to include 'live_show'
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_type_check;

-- Add the new constraint that includes 'live_show'
ALTER TABLE projects ADD CONSTRAINT projects_project_type_check 
CHECK (project_type IN ('album', 'single', 'ep', 'mixtape', 'live_show'));

-- Add new columns for the updated project structure
ALTER TABLE projects ADD COLUMN IF NOT EXISTS number_of_songs INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_duration INTEGER; -- in minutes
ALTER TABLE projects ADD COLUMN IF NOT EXISTS youtube_links TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS spotify_link TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mp3_files TEXT[]; -- URLs to uploaded files
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ticket_sale_link TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_location TEXT;

-- Make the old investment-related fields optional (nullable) instead of required
ALTER TABLE projects ALTER COLUMN funding_goal DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN min_investment DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN max_investment DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN expected_roi DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN project_duration DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN deadline DROP NOT NULL;

-- Set default values for existing records to maintain compatibility
UPDATE projects SET 
  funding_goal = 0,
  min_investment = 0,
  max_investment = 0,
  expected_roi = 0,
  project_duration = 'TBD',
  deadline = '2025-12-31'
WHERE funding_goal IS NULL;

-- Add comments to document the new structure
COMMENT ON COLUMN projects.number_of_songs IS 'Number of songs for album/EP/mixtape projects';
COMMENT ON COLUMN projects.total_duration IS 'Total duration in minutes for album/EP/mixtape projects';
COMMENT ON COLUMN projects.youtube_links IS 'Array of YouTube video URLs';
COMMENT ON COLUMN projects.spotify_link IS 'Spotify album/track link';
COMMENT ON COLUMN projects.mp3_files IS 'Array of MP3 file URLs';
COMMENT ON COLUMN projects.ticket_sale_link IS 'Link to ticket sales for live shows';
COMMENT ON COLUMN projects.show_date IS 'Date of live show';
COMMENT ON COLUMN projects.show_location IS 'Location of live show';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position; 