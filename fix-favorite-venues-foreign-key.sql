-- Fix the foreign key constraint in favorite_venues table
-- The table is referencing auth.users but should reference public.users

-- First, drop the existing foreign key constraint
ALTER TABLE favorite_venues DROP CONSTRAINT IF EXISTS favorite_venues_user_id_fkey;

-- Now add the correct foreign key constraint to public.users
ALTER TABLE favorite_venues 
ADD CONSTRAINT favorite_venues_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

-- Verify the constraint was created correctly
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='favorite_venues'; 