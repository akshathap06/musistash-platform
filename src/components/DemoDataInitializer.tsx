import { useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';

const DemoDataInitializer = () => {
  useEffect(() => {
    const initializeDemoData = async () => {
      try {
        console.log('DemoDataInitializer: Starting demo data initialization...');
        
        // Test follow table access first
        console.log('DemoDataInitializer: Testing follow table access...');
        const followTableAccess = await supabaseService.testFollowTableAccess();
        console.log('DemoDataInitializer: Follow table access test result:', followTableAccess);
        
        if (!followTableAccess) {
          console.error('DemoDataInitializer: WARNING - Follow table access failed!');
          console.error('DemoDataInitializer: Please check RLS settings on follow_relationships table in Supabase dashboard');
        }
        
        // Check if demo artists already exist and are approved
        const approvedProfiles = await supabaseService.getApprovedArtistProfiles();
        const demoArtistNames = ['Aria Luna', 'Nexus Rhythm', 'Echo Horizon'];
        const existingDemoArtists = approvedProfiles.filter(profile => 
          demoArtistNames.includes(profile.artist_name)
        );
        
        if (existingDemoArtists.length === demoArtistNames.length) {
          console.log('DemoDataInitializer: Demo artists already exist and are approved, skipping creation');
        } else {
          // Create demo artists only if they don't exist
          await supabaseService.createDemoArtists();
          console.log('DemoDataInitializer: Demo artists created');
        }
        
        // Populate demo artist mappings
        await supabaseService.populateDemoArtistMappings();
        console.log('DemoDataInitializer: Demo artist mappings populated');
        
        // Then create demo projects (depends on artists existing)
        await supabaseService.createDemoProjects();
        console.log('DemoDataInitializer: Demo projects created');
        
        console.log('DemoDataInitializer: Demo data initialization complete');
      } catch (error) {
        console.error('DemoDataInitializer: Error initializing demo data:', error);
      }
    };

    // Initialize demo data when component mounts
    initializeDemoData();
  }, []);

  // This component doesn't render anything
  return null;
};

export default DemoDataInitializer; 