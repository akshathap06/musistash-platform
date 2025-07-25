import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtistProfileCard from '@/components/ui/ArtistProfileCard';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Music, Loader2, RefreshCw } from 'lucide-react';

const BrowseArtists = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [approvedProfiles, setApprovedProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load approved profiles with refresh capability
  const loadProfiles = useCallback(async (showLoading = true, isAutoRefresh = false) => {
      try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
        console.log('Loading approved profiles...');
        const profiles = await artistProfileService.getApprovedProfiles();
        console.log('Loaded approved profiles:', profiles);
        setApprovedProfiles(profiles || []);
      setLastRefresh(new Date());
      
      // Show toast notification for manual refresh
      if (!isAutoRefresh && !showLoading) {
        toast({
          title: "Data Updated",
          description: `Refreshed ${profiles?.length || 0} artist profiles`,
          duration: 2000,
        });
      }
      } catch (error) {
        console.error('Error loading approved profiles:', error);
        setApprovedProfiles([]);
      
      if (!isAutoRefresh) {
        toast({
          title: "Error",
          description: "Failed to refresh artist data",
          variant: "destructive",
          duration: 3000,
        });
      }
      } finally {
        setIsLoading(false);
      setIsRefreshing(false);
      }
  }, [toast]);
    
  // Initial load
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadProfiles(false, true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadProfiles]);

  // Refresh function for manual refresh
  const handleRefresh = () => {
    loadProfiles(false);
  };

  // Use approved profiles directly (they already have the correct structure)
  const allArtists = approvedProfiles;

  console.log('All artists (approved profiles only):', allArtists);
  console.log('Approved profiles:', approvedProfiles);

  // Get all unique genres
  const allGenres = ['all', ...new Set(allArtists.flatMap(artist => artist.genre || []))];

  // Filter artists based on search and genre
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = artist.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         artist.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedGenre === 'all') return matchesSearch;
    
    return matchesSearch && artist.genre && artist.genre.includes(selectedGenre);
  });

  // Handle follow change to refresh data
  const handleFollowChange = useCallback((artistId: string, isFollowing: boolean) => {
    // Refresh profiles after follow/unfollow to get updated follower counts
    setTimeout(() => {
      loadProfiles(false);
    }, 500);
  }, [loadProfiles]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Browse <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Artists</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Discover emerging artists already using MusiStash to connect with fans and fund their projects.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 max-w-4xl mx-auto">
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
                  size="sm"
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

          {/* Refresh and Status Section */}
          <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              {isRefreshing && (
                <span className="flex items-center gap-1 text-blue-400">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Updating...
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-white/20 text-gray-300 hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-3 animate-spin" />
                <h3 className="text-lg font-semibold text-white mb-2">Loading artists...</h3>
                <p className="text-gray-400">Please wait while we fetch the latest artist profiles.</p>
              </div>
            ) : filteredArtists.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">No artists found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredArtists.map((artist) => (
                <div key={artist.id}>
                  <ArtistProfileCard 
                    artist={artist} 
                    showFollowButton={true}
                    onFollowChange={handleFollowChange}
                    className="w-full"
                  />
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