import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { 
  Play, 
  Youtube, 
  Instagram, 
  ExternalLink, 
  Brain, 
  Users, 
  BarChart3, 
  Star, 
  TrendingUp,
  CheckCircle,
  Heart,
  Music,
  Target,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { followingService } from '@/services/followingService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];

interface ArtistProfileCardProps {
  artist: ArtistProfile;
  showFollowButton?: boolean;
  onFollowChange?: (artistId: string, isFollowing: boolean) => void;
  className?: string;
}

// Helper function to format large numbers
const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const ArtistProfileCard: React.FC<ArtistProfileCardProps> = ({ 
  artist, 
  showFollowButton = true,
  onFollowChange,
  className = ""
}) => {
  console.log('ArtistProfileCard rendering with artist:', artist.artist_name);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const bio = artist.bio || "No biography available for this artist.";
  const displayBio = showFullBio ? bio : bio.slice(0, 120) + (bio.length > 120 ? '...' : '');
  
  // Load real data from profile
  useEffect(() => {
    const loadArtistData = async () => {
      try {
        setIsLoadingData(true);
        // Data is already available in the artist profile
        setIsLoadingData(false);
      } catch (error) {
        console.error('Error loading artist data:', error);
        setIsLoadingData(false);
      }
    };

    loadArtistData();
  }, [artist.id]);

  // Get real stats from artist profile data
  const getRealStats = () => {
    // Use data directly from artist profile (stored in Supabase)
    const monthlyListeners = artist.monthly_listeners || 0;
    const totalStreams = artist.total_streams || 0;
    const popularity = artist.success_rate || 75; // Use success_rate as popularity
    
    // Use Spotify followers from spotify_data if available, otherwise use a default
    let spotifyFollowers = 0;
    if (artist.spotify_data && typeof artist.spotify_data === 'object') {
      spotifyFollowers = artist.spotify_data.followers || artist.spotify_data.total_followers || 0;
    }
    
    return {
      monthlyListeners,
      totalStreams,
      popularity,
      followers: spotifyFollowers,
    };
  };

  const stats = getRealStats();
  
  // AI-generated similarity score (mock for now)
  const similarityScore = Math.floor(Math.random() * 30) + 70;

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow artists",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Optimistic update
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    
    try {
      
      if (newFollowingState) {
        await followingService.followArtist(
          user!.id, 
          { name: user!.name || 'User', avatar: user!.avatar || '' }, 
          artist.id, 
          { name: artist.artist_name, avatar: artist.profile_photo || '' }
        );
        toast({
          title: "Following",
          description: `You're now following ${artist.artist_name}`,
        });
      } else {
        await followingService.unfollowArtist(user!.id, artist.id);
        toast({
          title: "Unfollowed",
          description: `You've unfollowed ${artist.artist_name}`,
        });
      }
      
      if (onFollowChange) {
        onFollowChange(artist.id, newFollowingState);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      // Revert optimistic update
      setIsFollowing(!newFollowingState);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800 ${className}`}>
      {/* Gradient Header */}
      <div className="relative h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
        {/* DEBUG: Updated Component */}
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
            UPDATED
          </div>
        </div>
        {/* AI Score Badge */}
        <div className="absolute top-2 right-2 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg flex items-center gap-1">
                <Target className="w-3 h-3" />
                {similarityScore}%
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div className="font-medium">AI Similarity Score</div>
                <div>Based on musical style, audience, and market position</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>



      {/* Content */}
      <div className="p-4 pt-2">
        {/* Artist Photo and Name - Horizontal Layout */}
        <div className="flex items-center gap-3 mb-3">
          {/* Artist Photo */}
          <div className="w-16 h-16 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
            {artist.profile_photo ? (
              <img 
                src={artist.profile_photo} 
                alt={artist.artist_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          {/* Artist Name and Genres */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 truncate">{artist.artist_name}</h3>
            <div className="flex flex-wrap gap-1">
              {artist.genre && artist.genre.slice(0, 2).map((genre, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Monthly Listeners */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-2 text-white">
            <div className="flex items-center gap-1 mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">Monthly</span>
            </div>
            <div className="text-sm font-bold">
              {isLoadingData ? (
                <div className="animate-pulse bg-white/20 rounded h-4 w-12"></div>
              ) : (
                formatLargeNumber(stats.monthlyListeners)
              )}
            </div>
            <div className="text-xs opacity-90">Listeners</div>
          </div>

          {/* Total Streams */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 text-white">
            <div className="flex items-center gap-1 mb-1">
              <BarChart2 className="w-3 h-3" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <div className="text-sm font-bold">
              {isLoadingData ? (
                <div className="animate-pulse bg-white/20 rounded h-4 w-12"></div>
              ) : (
                formatLargeNumber(stats.totalStreams)
              )}
            </div>
            <div className="text-xs opacity-90">Streams</div>
          </div>

          {/* Popularity Score */}
          <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-lg p-2 text-white">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3" />
              <span className="text-xs font-medium">Popularity</span>
            </div>
            <div className="text-sm font-bold">
              {isLoadingData ? (
                <div className="animate-pulse bg-white/20 rounded h-4 w-8"></div>
              ) : (
                `${stats.popularity}%`
              )}
            </div>
            <div className="text-xs opacity-90">Score</div>
          </div>

          {/* Spotify Followers */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-2 text-white">
            <div className="flex items-center gap-1 mb-1">
              <Heart className="w-3 h-3" />
              <span className="text-xs font-medium">Spotify</span>
            </div>
            <div className="text-sm font-bold">
              {isLoadingData ? (
                <div className="animate-pulse bg-white/20 rounded h-4 w-12"></div>
              ) : (
                formatLargeNumber(stats.followers)
              )}
            </div>
            <div className="text-xs opacity-90">Followers</div>
          </div>
        </div>

        {/* Bio - Compact */}
        <div className="mb-3">
          <p className="text-xs text-gray-300 leading-relaxed">
            {artist.biography ? (
              artist.biography.length > 80 ? (
                <>
                  {artist.biography.substring(0, 80)}...
                  <button className="text-blue-400 hover:text-blue-300 ml-1">Read More</button>
                </>
              ) : (
                artist.biography
              )
            ) : (
              "Emerging artist with unique sound and growing fanbase."
            )}
          </p>
        </div>

        {/* Similarity Match */}
        <div className="flex items-center gap-1 mb-3 text-xs text-gray-400">
          <Sparkles className="w-3 h-3" />
          <span>Sounds like: The Weeknd, Post Malone</span>
        </div>

        {/* Action Buttons Row - Compact */}
        <div className="space-y-2">
          {/* Primary Action Row */}
          <div className="flex gap-2 justify-center">
            {/* Spotify */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white p-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <Play className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Play on Spotify</TooltipContent>
            </Tooltip>

            {/* YouTube */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <Youtube className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Watch on YouTube</TooltipContent>
            </Tooltip>

            {/* Instagram */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <Instagram className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Follow on Instagram</TooltipContent>
            </Tooltip>

            {/* AI Analysis */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/analyze-artist/${artist.artist_name}`}>
                  <Button 
                    size="sm" 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-0 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Brain className="w-3 h-3" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Analyze with AI</TooltipContent>
            </Tooltip>
          </div>

          {/* Secondary Action Row */}
          <div className="flex gap-2 justify-center">
            {/* View Profile */}
            <Link to={`/artist/${artist.id}`} className="flex-1">
              <Button 
                size="sm" 
                variant="outline"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 shadow-lg hover:shadow-xl transition-all text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </Link>

            {/* Follow Button */}
            {showFollowButton && (!user || user.id !== artist.id) && (
              <Button 
                size="sm" 
                variant={isFollowing ? "outline" : "default"}
                className={`flex-1 shadow-lg hover:shadow-xl transition-all text-xs ${
                  isFollowing 
                    ? "border-gray-500 text-gray-400 bg-gray-800/50 hover:bg-gray-700/50" 
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
                onClick={handleFollow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Heart className={`w-3 h-3 mr-1 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileCard; 