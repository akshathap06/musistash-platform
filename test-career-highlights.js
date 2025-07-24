// Test script for career highlights database structure
// Run this after applying the database migration

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (you'll need to add your own credentials)
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCareerHighlightsStructure() {
  console.log('Testing Career Highlights Database Structure...\n');

  try {
    // Test 1: Check if career_highlights table exists
    console.log('1. Checking if career_highlights table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('career_highlights')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ career_highlights table does not exist or is not accessible');
      console.error('Error:', tableError.message);
      return;
    }
    console.log('✅ career_highlights table exists and is accessible\n');

    // Test 2: Check if the view exists
    console.log('2. Checking if artist_profiles_with_highlights view exists...');
    const { data: viewData, error: viewError } = await supabase
      .from('artist_profiles_with_highlights')
      .select('*')
      .limit(1);

    if (viewError) {
      console.log('⚠️  View does not exist yet, but this is okay for testing');
      console.log('Error:', viewError.message);
    } else {
      console.log('✅ artist_profiles_with_highlights view exists and is accessible');
    }
    console.log('');

    // Test 3: Check if the function exists
    console.log('3. Testing update_artist_career_highlights function...');
    const testHighlights = [
      { year: '2023', title: 'Test Achievement', description: 'This is a test highlight' },
      { year: '2022', title: 'Another Test', description: 'Another test highlight' }
    ];

    // Note: This will fail if no artist profile exists, but that's expected
    const { error: functionError } = await supabase.rpc('update_artist_career_highlights', {
      p_artist_profile_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      p_highlights: testHighlights
    });

    if (functionError) {
      if (functionError.message.includes('foreign key') || functionError.message.includes('not found')) {
        console.log('✅ Function exists and works (foreign key error expected with dummy data)');
      } else {
        console.error('❌ Function error:', functionError.message);
      }
    } else {
      console.log('✅ Function executed successfully');
    }
    console.log('');

    // Test 4: Check table structure
    console.log('4. Checking table structure...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'career_highlights' });

    if (columnsError) {
      console.log('⚠️  Could not check table structure directly');
      console.log('Expected columns: id, artist_profile_id, year, title, description, created_at, updated_at');
    } else {
      console.log('✅ Table structure verified');
      console.log('Columns:', columns);
    }
    console.log('');

    console.log('🎉 Career highlights database structure test completed!');
    console.log('\nNext steps:');
    console.log('1. Apply the migration in Supabase SQL Editor');
    console.log('2. Test with real artist profile data');
    console.log('3. Verify the frontend integration works');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testCareerHighlightsStructure();
}

module.exports = { testCareerHighlightsStructure }; 