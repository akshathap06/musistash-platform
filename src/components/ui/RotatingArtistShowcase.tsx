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
            <Card className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-0 border border-gray-700/50 overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
              {/* Banner Image with Artist Name Overlay */}
              {currentArtist.banner_photo && (
                <div className="w-full h-40 md:h-56 bg-gray-800 relative flex flex-col items-center justify-center">
                  <img
                    src={currentArtist.banner_photo}
                    alt={currentArtist.artist_name + ' banner'}
                    className="w-full h-full object-cover object-center"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  {/* Overlay for darkening the banner for text contrast */}
                  <div className="absolute inset-0 bg-black/40" />
                  {/* Artist Name and Empowerment Message Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg shadow-black mb-1" style={{textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)'}}>
                      {currentArtist.artist_name}
                    </h3>
                    <span className="block text-sm md:text-base text-blue-200 bg-blue-500/20 rounded-full px-4 py-1 font-semibold mt-1 drop-shadow-md shadow-black" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
                      Empowering Artists to Own Their Future
                    </span>
                  </div>
                </div>
              )}
              {/* Profile and Info Section (below banner) */}
              <div className="flex flex-row items-end justify-center w-full px-8 pt-8 pb-4 z-10">
                {/* Artist Image and Genres */}
                <div className="flex flex-col items-center justify-end mr-8">
                  <div className="relative inline-block mb-2">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gray-800 flex items-center justify-center">
                      {currentArtist.profile_photo ? (
                        <img
                          src={currentArtist.profile_photo}
                          alt={currentArtist.artist_name}
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="Artist Placeholder"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {currentArtist.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-2 mb-2">
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
                </div>
                {/* Artist Info */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-200 text-base mb-5 leading-relaxed max-w-xl">
                    {currentArtist.biography || currentArtist.bio || 'This artist is building their future with MusiStash. Support their journey.'}
                  </p>
                  <div className="flex flex-row flex-wrap gap-3 justify-center items-center mt-2">
                    <Link to={`/artist/${currentArtist.id}`}><Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">View Profile</Button></Link>
                    {/* Social Buttons */}
                    {currentArtist.social_links && (
                      <>
                        {currentArtist.social_links.spotify && (
                          <a href={currentArtist.social_links.spotify} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                              </svg>
                              Spotify
                            </Button>
                          </a>
                        )}
                        {currentArtist.social_links.youtube && (
                          <a href={currentArtist.social_links.youtube} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              YouTube
                            </Button>
                          </a>
                        )}
                        {currentArtist.social_links.instagram && (
                          <a href={currentArtist.social_links.instagram} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-transparent">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                              Instagram
                            </Button>
                          </a>
                        )}
                      </>
                    )}
                    <Link to={`/artist/${currentArtist.id}#projects`}><Button size="sm" variant="outline" className="border-blue-500 text-blue-400">View Projects</Button></Link>
                    <Link to={`/artist/${currentArtist.id}#investment`}><Button size="sm" variant="outline" className="border-yellow-500 text-yellow-400">Investment Insights</Button></Link>
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