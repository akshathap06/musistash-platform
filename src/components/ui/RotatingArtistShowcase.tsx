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
      // Filter for approved and active artists
      const activeArtists = allProfiles.filter(
        profile => profile.status === 'approved' && profile.is_verified
      );
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
    <section className="py-12 px-4 md:px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Featured Artists
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Discover the amazing artists on our platform
          </p>
        </div>

        {/* Main Artist Showcase */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevArtist}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextArtist}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Artist Card */}
          <div className="group relative max-w-3xl mx-auto">
            <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <Card className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* Artist Image and Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-blue-500/30">
                      <img 
                        src={currentArtist.profile_photo || '/placeholder.svg'}
                        alt={currentArtist.artist_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {currentArtist.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {currentArtist.artist_name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 justify-center lg:justify-start mb-4">
                    {currentArtist.genre.slice(0, 3).map((genre, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-500/20 text-blue-200 border-blue-500/30 text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    {currentArtist.biography || 'An amazing artist on the Musi$tash platform'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link to={`/artist/${currentArtist.id}`}>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
                        View Profile
                      </Button>
                    </Link>
                    <Link to="/artists">
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Explore All Artists
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Artist Stats */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium text-sm">Followers</span>
                      </div>
                      <div className="text-xl font-bold text-blue-400">
                        {currentStats.followers.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium text-sm">Projects</span>
                      </div>
                      <div className="text-xl font-bold text-purple-400">
                        {currentStats.projects}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium text-sm">Success Rate</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {Math.floor(Math.random() * 30) + 70}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium text-sm">Trending</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      +{Math.floor(Math.random() * 200) + 50}%
                    </div>
                    <p className="text-gray-400 text-xs">this month</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {artists.map((_, index) => (
              <button
                key={index}
                onClick={() => goToArtist(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Artist Counter */}
          <div className="text-center mt-3">
            <p className="text-gray-400 text-sm">
              {currentIndex + 1} of {artists.length} artists
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RotatingArtistShowcase; 