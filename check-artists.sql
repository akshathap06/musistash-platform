-- Check what artist profiles exist in the database
SELECT 
  id,
  artist_name,
  user_id,
  status,
  created_at
FROM artist_profiles 
ORDER BY created_at DESC 
LIMIT 10; 