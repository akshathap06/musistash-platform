-- Fix the project_type constraint to include 'live_show'
-- First, drop the existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_type_check;

-- Add the new constraint that includes 'live_show'
ALTER TABLE projects ADD CONSTRAINT projects_project_type_check 
CHECK (project_type IN ('album', 'single', 'ep', 'mixtape', 'live_show'));

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'project_type'; 