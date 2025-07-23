-- Check if the specific project exists
SELECT 
  p.id,
  p.title,
  p.artist_id,
  p.project_type,
  p.status,
  p.banner_image,
  ap.artist_name,
  ap.profile_photo
FROM projects p
LEFT JOIN artist_profiles ap ON p.artist_id = ap.id
WHERE p.id = '45b4e834-0d43-4feb-9280-b1184bc2a943'; 