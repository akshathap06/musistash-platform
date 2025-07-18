
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

  // Load following state
  useEffect(() => {
    const loadFollowingState = async () => {
      if (!user || !isAuthenticated || !showFollowButton || user.id === artist.id) return;
      
      try {
        const following = await followingService.isFollowing(user.id, artist.id);
        setIsFollowing(following);
      } catch (error) {
        console.error('Error loading following state:', error);
      }
    };

    loadFollowingState();
  }, [user, isAuthenticated, artist.id, showFollowButton]);

  const handleFollow = async () => {
    if (!user || !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (user.id === artist.id) return;

    setIsLoading(true);
    try {
      const newFollowingState = !isFollowing;
      
      if (newFollowingState) {
        const success = await followingService.followArtist(
          user.id,
          { name: user.name, avatar: user.avatar },
          artist.id,
          { name: artist.name, avatar: artist.avatar }
        );
        
        if (success) {
          setIsFollowing(true);
          onFollowChange?.(artist.id, true);
        }
      } else {
        const success = await followingService.unfollowArtist(user.id, artist.id);
        
        if (success) {
          setIsFollowing(false);
          onFollowChange?.(artist.id, false);
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing artist:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <div className="text-2xl font-semibold text-white">{followers.toLocaleString()}</div>
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
                className={`w-full ${isFollowing ? "text-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                onClick={handleFollow}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (isFollowing ? "Following" : "Follow")}
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
