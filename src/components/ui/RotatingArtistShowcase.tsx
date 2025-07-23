import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Users, Star, Sparkles, CheckCircle } from 'lucide-react';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { supabaseService } from '@/services/supabaseService';
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
      <section className="py-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Featured Artists
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Discover the amazing artists on our platform
            </p>
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || artists.length === 0) {
    return (
      <section className="py-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Featured Artists
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Discover the amazing artists on our platform
            </p>
          </div>
          <div className="text-center py-8">
            <Music className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-400 text-base">
              {error || 'No active artists found at the moment'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentArtist = artists[currentIndex];
  const currentStats = artistStats[currentArtist.id] || { followers: 0, projects: 0 };

  return (
    <section className="py-8 px-2 md:py-12 md:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4">Featured Artists</h2>
        <p className="text-gray-400 text-center mb-4 md:mb-8 text-sm md:text-base">Discover the amazing artists on our platform</p>
        <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/40 mb-4 md:mb-8 relative">
          <div className="relative w-full h-32 md:h-56 overflow-hidden">
            <img src={currentArtist.banner_photo || '/assets/placeholder.svg'} alt="Artist Banner" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center">
              <h3 className="text-2xl md:text-5xl font-extrabold text-white drop-shadow mb-1 md:mb-2 text-center">{currentArtist.artist_name}</h3>
              <p className="text-xs md:text-lg text-blue-200 font-semibold text-center mb-0 md:mb-2">Empowering Artists to Own Their Future</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-end px-2 md:px-8 py-4 md:py-8">
            {/* Avatar and genres: below bio on mobile, left of bio on desktop */}
            <div className="flex flex-col items-center mb-2 md:mb-0 md:mr-8 md:-mt-12 md:relative md:z-10">
              <img src={currentArtist.profile_photo || '/assets/logo-cricle.png'} alt={currentArtist.artist_name} className="rounded-full border-4 border-gray-900 shadow-md w-16 h-16 md:w-28 md:h-28 object-cover mb-2" />
              {currentArtist.is_verified && <CheckCircle className="text-blue-500 ml-1 mt-1 h-4 w-4" />}
              <div className="flex flex-wrap gap-2 justify-center mt-2 mb-2 md:mb-0">
                {currentArtist.genre && currentArtist.genre.slice(0, 3).map((g, i) => (
                  <Badge key={i} variant="secondary" className="capitalize bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs">{g}</Badge>
                ))}
              </div>
            </div>
            {/* Bio and buttons: above avatar on mobile, right of avatar on desktop */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-3 line-clamp-4 md:line-clamp-none min-h-[4.5em] md:min-h-0">{currentArtist.bio}</p>
              <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-3">
                <Link to={`/artist/${currentArtist.id}`}><Button size="sm" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">View Profile</Button></Link>
                <Button size="sm" variant="outline" className="w-full md:w-auto border-blue-500 text-blue-300 hover:bg-blue-500/20">View Projects</Button>
              </div>
            </div>
          </div>
          {/* Navigation arrows: outside on mobile, closer in on desktop */}
          <button onClick={prevArtist} className="absolute -left-5 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-2 md:p-3 hover:bg-black/80 focus:outline-none shadow-lg"><ChevronLeft className="h-5 w-5 md:h-7 md:w-7 text-white" /></button>
          <button onClick={nextArtist} className="absolute -right-5 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-2 md:p-3 hover:bg-black/80 focus:outline-none shadow-lg"><ChevronRight className="h-5 w-5 md:h-7 md:w-7 text-white" /></button>
        </div>
        <div className="flex justify-center mt-2 md:mt-4">
          <span className="text-xs text-gray-400">{currentIndex + 1} of {artists.length} artists</span>
        </div>
      </div>
    </section>
  );
};

export default RotatingArtistShowcase; 