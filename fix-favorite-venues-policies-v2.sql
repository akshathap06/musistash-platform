-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can insert their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can update their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can delete their own favorite venues" ON favorite_venues;

-- Temporarily disable RLS to test
ALTER TABLE favorite_venues DISABLE ROW LEVEL SECURITY;

-- Let's test if we can insert without RLS first
-- (We'll re-enable it after testing)

-- Check the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'favorite_venues'
ORDER BY ordinal_position; 