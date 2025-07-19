-- Add 'pending' status to projects table constraint
-- This allows projects to be submitted for admin approval

-- Drop the existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new constraint with 'pending' status included
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('draft', 'pending', 'active', 'funded', 'completed', 'cancelled'));

-- Add a comment to document the change
COMMENT ON CONSTRAINT projects_status_check ON projects IS 
'Updated to include pending status for admin approval workflow';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'status'; 