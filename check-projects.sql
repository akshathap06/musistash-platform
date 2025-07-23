-- Check what projects exist in the database
SELECT 
  id,
  title,
  artist_id,
  project_type,
  status,
  created_at,
  banner_image
FROM projects 
ORDER BY created_at DESC 
LIMIT 10; 