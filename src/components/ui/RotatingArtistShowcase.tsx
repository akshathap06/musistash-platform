import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { supabaseService } from '@/services/supabaseService';
import ArtistProfileCard from './ArtistProfileCard';
import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];

const RotatingArtistShowcase = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artistStats, setArtistStats] = useState<{[key: string]: {followers: number, projects: number}}>({});

  useEffect(() => {
    loadActiveArtists();
  }, []);

  useEffect(() => {
    // Auto-rotate every 5 seconds
    const interval = setInterval(() => {
      if (artists.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % artists.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [artists.length]);

  const loadActiveArtists = async () => {
    try {
      setIsLoading(true);
      const allProfiles = await artistProfileService.getAllProfiles();
      console.log('All profiles loaded:', allProfiles.map(p => ({ name: p.artist_name, status: p.status, verified: p.is_verified })));
      
      // Filter for approved artists (include both verified and non-verified)
      const activeArtists = allProfiles.filter(
        profile => profile.status === 'approved'
      );
      
      console.log('Active artists after filtering:', activeArtists.map(p => ({ name: p.artist_name, status: p.status, verified: p.is_verified })));
      
      setArtists(activeArtists);
      
      // Load real stats for each artist
      await loadArtistStats(activeArtists);
    } catch (err) {
      console.error('Error loading artists:', err);
      setError('Failed to load artists');
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtistStats = async (artistList: ArtistProfile[]) => {
    const stats: {[key: string]: {followers: number, projects: number}} = {};
    
    for (const artist of artistList) {
      try {
        // Get follower count
        const followers = await followingService.getFollowerCount(artist.id);
        
        // Get project count
        const projects = await supabaseService.getProjectsByArtist(artist.id);
        const projectCount = projects?.length || 0;
        
        stats[artist.id] = {
          followers: followers || 0,
          projects: projectCount
        };
      } catch (error) {
        console.error(`Error loading stats for artist ${artist.id}:`, error);
        stats[artist.id] = { followers: 0, projects: 0 };
      }
    }
    
    setArtistStats(stats);
  };

  const nextArtist = () => {
    if (artists.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % artists.length);
    }
  };

  const prevArtist = () => {
    if (artists.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length);
    }
  };

  const goToArtist = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || artists.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-400 text-base">
          {error || 'No active artists found at the moment'}
        </p>
      </div>
    );
  }

  const currentArtist = artists[currentIndex];
  const currentStats = artistStats[currentArtist.id] || { followers: 0, projects: 0 };

  return (
    <div className="relative max-w-md mx-auto">
      <ArtistProfileCard 
        artist={currentArtist}
        showFollowButton={true}
        className="w-full"
      />
      {/* Navigation arrows - moved further outside */}
      <button 
        onClick={prevArtist} 
        className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-2 md:p-3 hover:bg-black/80 focus:outline-none shadow-lg transition-all"
      >
        <ChevronLeft className="h-5 w-5 md:h-7 md:w-7 text-white" />
      </button>
      <button 
        onClick={nextArtist} 
        className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-2 md:p-3 hover:bg-black/80 focus:outline-none shadow-lg transition-all"
      >
        <ChevronRight className="h-5 w-5 md:h-7 md:w-7 text-white" />
      </button>
      <div className="flex justify-center mt-4">
        <span className="text-xs text-gray-400">{currentIndex + 1} of {artists.length} artists</span>
      </div>
    </div>
  );
};

export default RotatingArtistShowcase; 