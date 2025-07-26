-- First, let's drop the existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can insert their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can update their own favorite venues" ON favorite_venues;
DROP POLICY IF EXISTS "Users can delete their own favorite venues" ON favorite_venues;

-- Now create the policies with proper auth.uid() checks
CREATE POLICY "Users can view their own favorite venues" ON favorite_venues
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own favorite venues" ON favorite_venues
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own favorite venues" ON favorite_venues
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own favorite venues" ON favorite_venues
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Let's also check the current policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'favorite_venues'; 