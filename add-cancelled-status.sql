-- Migration to add 'cancelled' status to projects table
-- This updates the existing database constraint to allow 'cancelled' status

-- First, drop the existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new constraint that includes 'cancelled'
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('draft', 'active', 'funded', 'completed', 'cancelled'));

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'status'; 