import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Users, Star, Sparkles, CheckCircle } from 'lucide-react';
import { artistProfileService } from '@/services/artistProfileService';
import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];

const RotatingArtistShowcase = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      console.error('Error loading artists:', err);
      setError('Failed to load artists');
    } finally {
      setIsLoading(false);
    }
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
      <section className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Featured Artists
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Discover the amazing artists on our platform
            </p>
          </div>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || artists.length === 0) {
    return (
      <section className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Featured Artists
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Discover the amazing artists on our platform
            </p>
          </div>
          <div className="text-center py-16">
            <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">
              {error || 'No active artists found at the moment'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentArtist = artists[currentIndex];

  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Featured Artists
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Discover the amazing artists on our platform
          </p>
        </div>

        {/* Main Artist Showcase */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevArtist}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextArtist}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Artist Card */}
          <div className="group relative max-w-4xl mx-auto">
            <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <Card className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Artist Image and Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20">
                      <img 
                        src={currentArtist.profile_photo || '/placeholder.svg'}
                        alt={currentArtist.artist_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {currentArtist.is_verified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {currentArtist.artist_name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                    {currentArtist.genre.map((genre, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-500/20 text-blue-200 border-blue-500/30"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                    {currentArtist.biography || 'An amazing artist on the Musi$tash platform'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to={`/artist/${currentArtist.id}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
                        View Profile
                      </Button>
                    </Link>
                    <Link to="/artists">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Explore All Artists
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Artist Stats */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">Followers</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.floor(Math.random() * 1000) + 100}
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Music className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">Projects</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.floor(Math.random() * 5) + 1}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">Success Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.floor(Math.random() * 30) + 70}%
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">Trending</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      +{Math.floor(Math.random() * 200) + 50}%
                    </div>
                    <p className="text-gray-300 text-sm">this month</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {artists.map((_, index) => (
              <button
                key={index}
                onClick={() => goToArtist(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Artist Counter */}
          <div className="text-center mt-4">
            <p className="text-gray-400">
              {currentIndex + 1} of {artists.length} artists
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RotatingArtistShowcase; 