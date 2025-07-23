-- Test query to see what projects exist in the database
SELECT 
  id,
  title,
  artist_id,
  project_type,
  status,
  created_at
FROM projects 
ORDER BY created_at DESC 
LIMIT 10; 