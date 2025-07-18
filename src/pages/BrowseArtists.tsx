import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { artists } from '@/lib/mockData';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, Music, Loader2 } from 'lucide-react';

const BrowseArtists = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [approvedProfiles, setApprovedProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Load approved profiles
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        console.log('Loading approved profiles...');
        const profiles = await artistProfileService.getApprovedProfiles();
        console.log('Loaded approved profiles:', profiles);
        setApprovedProfiles(profiles || []);
      } catch (error) {
        console.error('Error loading approved profiles:', error);
        setApprovedProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, []);

  // Combine mock artists with approved profiles
  const allArtists = [
    ...artists,
    ...approvedProfiles.map(profile => ({
      id: profile.id,
      name: profile.artist_name,
      avatar: profile.profile_photo,
      bio: profile.bio,
      genres: profile.genre,
      followers: 0, // Default for new profiles
      verified: profile.is_verified,
      successRate: 75 // Default for new profiles
    }))
  ];

  console.log('All artists:', allArtists);
  console.log('Mock artists:', artists);
  console.log('Approved profiles:', approvedProfiles);

  // Get all unique genres
  const allGenres = ['all', ...new Set(allArtists.flatMap(artist => artist.genres))];

  // Filter artists based on search and genre
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         artist.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedGenre === 'all') return matchesSearch;
    
    return matchesSearch && artist.genres.includes(selectedGenre);
  });



  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Browse <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Artists</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover emerging artists already using MusiStash to connect with fans and fund their projects.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {allGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-white/20 text-gray-300 hover:bg-white/10"
                  }
                >
                  {genre === 'all' ? 'All Genres' : genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-16">
                <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white mb-2">Loading artists...</h3>
                <p className="text-gray-400">Please wait while we fetch the latest artist profiles.</p>
              </div>
            ) : filteredArtists.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No artists found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredArtists.map((artist) => (
                <div key={artist.id} className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <ArtistInfo 
                    artist={artist} 
                    expanded={true} 
                    showFollowButton={true}
                  />
                  <div className="mt-4">
                    <Link to={`/artist/${artist.id}`}>
                      <Button variant="outline" className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/20">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseArtists; 