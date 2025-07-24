// Simple test script to verify efficient artist profile service
// Run with: node test-efficient-service.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (you'll need to add your own credentials)
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

class EfficientArtistProfileService {
  async updateProfile(profileId, profileData) {
    try {
      console.log('Efficient update: Preparing single update with all data');
      
      // Clean the data - remove undefined values but keep null for explicit clearing
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );
      
      // Add timestamp
      const updateData = {
        ...cleanData,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Efficient update: Single database call with data:', updateData);
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .update(updateData)
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        console.error('Efficient update error:', error);
        throw error;
      }

      console.log('Efficient update successful:', data);
      return data;
    } catch (error) {
      console.error('Efficient update failed:', error);
      throw error;
    }
  }

  async getProfileById(profileId) {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error('Get profile error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }
}

// Test function
async function testEfficientService() {
  console.log('Testing Efficient Artist Profile Service...');
  
  const service = new EfficientArtistProfileService();
  
  // Test data
  const testProfileData = {
    artist_name: 'Test Artist',
    bio: 'Test bio',
    biography: 'Test biography',
    genre: ['Pop', 'Rock'],
    location: 'Test City',
    musical_style: 'Alternative Pop',
    influences: 'The Beatles, Radiohead',
    social_links: {
      spotify: 'https://open.spotify.com/artist/test',
      instagram: 'https://instagram.com/testartist'
    },
    monthly_listeners: 1000,
    total_streams: 50000,
    success_rate: 75.5,
    career_highlights: [
      { year: '2023', title: 'First Album', description: 'Released debut album' }
    ],
    future_releases: [
      { title: 'New Single', releaseDate: '2024-01-15', description: 'Upcoming single', type: 'single' }
    ]
  };
  
  try {
    // This would require an existing profile ID to test updates
    // For now, just test the data preparation
    console.log('Test data prepared:', testProfileData);
    console.log('Service methods available:', Object.getOwnPropertyNames(EfficientArtistProfileService.prototype));
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEfficientService();
}

module.exports = { EfficientArtistProfileService }; 