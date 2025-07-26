-- Create favorite_venues table
CREATE TABLE IF NOT EXISTS favorite_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  venue_phone TEXT,
  venue_website TEXT,
  venue_rating DECIMAL(3,2),
  venue_total_ratings INTEGER,
  venue_types TEXT[],
  venue_location TEXT,
  venue_estimated_capacity TEXT,
  venue_booking_difficulty TEXT,
  venue_genre_suitability INTEGER,
  venue_booking_approach TEXT,
  venue_description TEXT,
  venue_booking_requirements TEXT[],
  venue_amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of user and venue
  UNIQUE(user_id, venue_id)
);

-- Enable RLS
ALTER TABLE favorite_venues ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own favorite venues" ON favorite_venues
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite venues" ON favorite_venues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorite venues" ON favorite_venues
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite venues" ON favorite_venues
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorite_venues_user_id ON favorite_venues(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_venues_created_at ON favorite_venues(created_at DESC); 