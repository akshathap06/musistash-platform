
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '@/lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { SpotifyArtist } from '@/services/spotify/spotifyTypes';
import { followingService } from '@/services/followingService';
import { useAuth } from '@/hooks/useAuth';
import { supabaseService } from '@/services/supabaseService';

interface ArtistInfoProps {
  artist: Artist;
  spotifyArtist?: SpotifyArtist | null;
  expanded?: boolean;
  spotifyImage?: string;
  showFollowButton?: boolean;
  onFollowChange?: (artistId: string, isFollowing: boolean) => void;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ 
  artist, 
  spotifyArtist,
  expanded = false,
  spotifyImage,
  showFollowButton = false,
  onFollowChange
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actualFollowers, setActualFollowers] = useState<number | null>(null);

  const initials = artist.name
    .split(' ')
    .map(n => n[0])
    .join('');

  // Use Spotify image if available, otherwise fallback to artist avatar
  const imageUrl = spotifyImage || artist.avatar;

  // Use Spotify genres if available, otherwise fallback to artist genres
  const genres = spotifyArtist?.genres || artist.genres;

  // Use Spotify followers if available, otherwise fallback to artist followers
  const followers = spotifyArtist?.followers?.total || artist.followers;

  // Load following state and actual follower count
  useEffect(() => {
    const loadFollowingState = async () => {
      if (!user || !isAuthenticated || !showFollowButton || user.id === artist.id) return;
      
      try {
        console.log('Loading following state for user:', user.id, 'artist:', artist.id);
        
        // First sync localStorage with Supabase
        await followingService.syncWithSupabase(user.id);
        
        const following = await followingService.isFollowing(user.id, artist.id);
        console.log('Following state loaded:', following);
        setIsFollowing(following);
      } catch (error) {
        console.error('Error loading following state:', error);
      }
    };

    const loadFollowerCount = async () => {
      try {
        const count = await followingService.getFollowerCount(artist.id);
        setActualFollowers(count);
      } catch (error) {
        console.error('Error loading follower count:', error);
      }
    };

    loadFollowingState();
    loadFollowerCount();
  }, [user, isAuthenticated, artist.id, showFollowButton]);

  // Reset following state when artist changes
  useEffect(() => {
    setIsFollowing(false);
    setActualFollowers(null);
  }, [artist.id]);

  const handleFollow = async () => {
    if (!user || !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (user.id === artist.id) return;

    console.log('Follow button clicked. Current state:', isFollowing);
    console.log('User ID:', user.id, 'Artist ID:', artist.id);

    setIsLoading(true);
    
    // Test Supabase table access first
    try {
      const tableAccess = await supabaseService.testFollowTableAccess();
      console.log('ArtistInfo: Supabase table access test result:', tableAccess);
    } catch (error) {
      console.error('ArtistInfo: Table access test failed:', error);
    }
    
    // Optimistically update the UI state
    const newFollowingState = !isFollowing;
    console.log('Setting new following state to:', newFollowingState);
    setIsFollowing(newFollowingState);
    
    try {
      if (newFollowingState) {
        console.log('Attempting to follow artist...');
        const success = await followingService.followArtist(
          user.id,
          { name: user.name, avatar: user.avatar },
          artist.id,
          { name: artist.name, avatar: artist.avatar }
        );
        
        console.log('Follow operation result:', success);
        
        if (success) {
          // Update follower count immediately
          setActualFollowers(prev => (prev || 0) + 1);
          onFollowChange?.(artist.id, true);
        } else {
          // Revert if the operation failed
          console.log('Follow operation failed, reverting state');
          setIsFollowing(false);
        }
      } else {
        console.log('Attempting to unfollow artist...');
        const success = await followingService.unfollowArtist(user.id, artist.id);
        
        console.log('Unfollow operation result:', success);
        
        if (success) {
          // Update follower count immediately
          setActualFollowers(prev => Math.max(0, (prev || 0) - 1));
          onFollowChange?.(artist.id, false);
        } else {
          // Revert if the operation failed
          console.log('Unfollow operation failed, reverting state');
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing artist:', error);
      // Revert on error
      setIsFollowing(!newFollowingState);
    } finally {
      setIsLoading(false);
    }
  };

  // Use actual follower count if available, otherwise fallback to artist followers
  const displayFollowers = actualFollowers !== null ? actualFollowers : followers;

  return (
    <div className={`flex ${expanded ? 'flex-col items-center text-center' : 'items-center'} animate-fade-in`}>
      <Avatar className={`${expanded ? 'h-24 w-24 mb-4 ring-2 ring-blue-500/20' : 'h-10 w-10 mr-3'} border-2 border-blue-500/20`}>
        <AvatarImage src={imageUrl} alt={artist.name} className="object-cover" />
        <AvatarFallback className="bg-gray-800 text-blue-400">{initials}</AvatarFallback>
      </Avatar>
      
      <div className={expanded ? 'space-y-4 max-w-md text-center w-full' : 'text-center flex-1'}>
        <div className={`flex items-center ${expanded ? 'justify-center' : 'justify-center'}`}>
          <Link to={`/artist/${artist.id}`}>
            <h3 className={`font-medium text-white hover:text-blue-400 transition-colors ${expanded ? 'text-2xl' : ''}`}>
              {artist.name}
            </h3>
          </Link>
          {artist.verified && (
            <CheckCircle className={`text-blue-500 ml-1 ${expanded ? 'h-5 w-5' : 'h-4 w-4'}`} />
          )}
        </div>
        
        {expanded && (
          <>
            <p className="text-gray-400 break-words overflow-hidden">{artist.bio}</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.slice(0, 4).map((genre, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="capitalize bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <div className="text-2xl font-semibold text-white">{displayFollowers.toLocaleString()}</div>
                <div className="text-gray-400">Followers</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <div className="text-2xl font-semibold text-white">
                  {spotifyArtist ? `${spotifyArtist.popularity}%` : `${artist.successRate}%`}
                </div>
                <div className="text-gray-400">
                  {spotifyArtist ? 'Popularity' : 'Success Rate'}
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {showFollowButton && (!user || user.id !== artist.id) && (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                className={`w-full transition-all duration-200 ${
                  isFollowing 
                    ? "border-gray-500 text-gray-400 bg-gray-800/50 hover:bg-gray-700/50" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                onClick={handleFollow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  isFollowing ? "Following" : "Follow"
                )}
              </Button>
            )}
          </>
        )}
        
        {!expanded && (
          <div className="text-sm text-gray-400 text-center">
            {genres.slice(0, 2).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistInfo;
