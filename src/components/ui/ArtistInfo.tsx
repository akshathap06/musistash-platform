
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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

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
    const loadFollowingState = async () => {
    if (!user || !isAuthenticated) return;

    console.log('Loading following state for user:', user.id, 'artist:', artist.id);

    try {
      let realArtistId = artist.id;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!uuidRegex.test(artist.id)) {
        console.log('Converting mock artist ID for follow check:', artist.id);
        try {
          // Try to get demo artist user ID first
          realArtistId = await supabaseService.getDemoArtistUserId(artist.name);
          
          if (!realArtistId) {
            // Fallback to creating artist user if not found
            realArtistId = await supabaseService.getOrCreateArtistUser(artist.id, {
              name: artist.name,
              bio: artist.bio,
              avatar: artist.avatar
            });
          }
          
          console.log('Converted to real artist ID for follow check:', realArtistId);
        } catch (error) {
          console.error('Failed to convert artist ID for follow check:', error);
          setIsFollowing(false);
          return;
        }
      }
      
      // Check follow status with real UUID
      const following = await followingService.isFollowing(user.id, realArtistId);
      console.log('Following state loaded:', following);
        setIsFollowing(following);
      } catch (error) {
        console.error('Error loading following state:', error);
      setIsFollowing(false);
      }
    };

  const loadFollowerCount = async () => {
    try {
      let realArtistId = artist.id;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!uuidRegex.test(artist.id)) {
        console.log('Converting mock artist ID for follower count:', artist.id);
        try {
          // Try to get demo artist user ID first
          realArtistId = await supabaseService.getDemoArtistUserId(artist.name);
          
          if (!realArtistId) {
            // Fallback to creating artist user if not found
            realArtistId = await supabaseService.getOrCreateArtistUser(artist.id, {
              name: artist.name,
              bio: artist.bio,
              avatar: artist.avatar
            });
          }
          
          console.log('Converted to real artist ID for follower count:', realArtistId);
        } catch (error) {
          console.error('Failed to convert artist ID for follower count:', error);
          setActualFollowers(artist.followers);
          return;
        }
      }
      const count = await followingService.getFollowerCount(realArtistId);
      setActualFollowers(count);
    } catch (error) {
      console.error('Error loading follower count:', error);
      setActualFollowers(artist.followers);
    }
  };

  useEffect(() => {
    loadFollowingState();
    loadFollowerCount();
  }, [user, isAuthenticated, artist.id, showFollowButton]);

  // Reset following state when artist changes
  useEffect(() => {
    setIsFollowing(false);
    setActualFollowers(null);
  }, [artist.id]);

  const handleFollow = async () => {
    if (!user || !isAuthenticated) return;

    console.log('Follow button clicked. Current state:', isFollowing);
    console.log('User ID:', user.id, 'Artist ID:', artist.id);
    console.log('User object:', user);
    console.log('Artist object:', artist);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    console.log('User ID is valid UUID:', uuidRegex.test(user.id));
    console.log('Artist ID is valid UUID:', uuidRegex.test(artist.id));
    console.log('User ID length:', user.id.length);
    console.log('Artist ID length:', artist.id.length);

    try {
      // Test Supabase table access
      const tableAccessTest = await supabaseService.testFollowTableAccess();
      console.log('ArtistInfo: Supabase table access test result:', tableAccessTest);

      // Check RLS status
      await supabaseService.checkRLSStatus();

      // Run simple follow test
      await supabaseService.simpleFollowTest();

      // Run comprehensive table test
      await supabaseService.comprehensiveTableTest();

      // Direct follow test
      console.log('=== DIRECT FOLLOW TEST ===');
      let realArtistId = artist.id;
      
      if (!uuidRegex.test(artist.id)) {
        console.log('Converting mock artist ID for direct test:', artist.id);
        console.log('Artist name for lookup:', artist.name);
        
        try {
          // Try to get demo artist user ID first
          realArtistId = await supabaseService.getDemoArtistUserId(artist.name);
          console.log('getDemoArtistUserId result:', realArtistId);
          
          if (!realArtistId) {
            console.log('Demo artist user ID not found, trying fallback...');
            // Fallback to creating artist user if not found
            realArtistId = await supabaseService.getOrCreateArtistUser(artist.id, {
              name: artist.name,
              bio: artist.bio,
              avatar: artist.avatar
            });
            console.log('getOrCreateArtistUser result:', realArtistId);
          }
          
          console.log('Final converted to real artist ID for direct test:', realArtistId);
        } catch (error) {
          console.error('Failed to convert artist ID for direct test:', error);
          return;
        }
      } else {
        console.log('Artist ID is already a valid UUID:', realArtistId);
      }

      const directTestData = {
        follower_id: user.id,
        artist_id: realArtistId,
        followed_at: new Date().toISOString()
      };
      console.log('Direct test data:', directTestData);

      try {
        const { data, error } = await supabase
          .from('follow_relationships')
          .insert(directTestData)
          .select()
          .single();

        if (error) {
          console.log('❌ DIRECT FOLLOW TEST FAILED:', error);
          console.log('Error code:', error.code);
          console.log('Error message:', error.message);
          console.log('Error details:', error.details);
          console.log('Error hint:', error.hint);
        } else {
          console.log('✅ DIRECT FOLLOW TEST SUCCESS:', data);
          
          // Clean up the test data
          await supabase
            .from('follow_relationships')
            .delete()
            .eq('id', data.id);
          console.log('✅ Test data cleaned up');
        }
      } catch (directError) {
        console.log('❌ DIRECT FOLLOW TEST FAILED:', directError);
      }

      // Set optimistic UI update
      const newFollowingState = !isFollowing;
      console.log('Setting new following state to:', newFollowingState);
      setIsFollowing(newFollowingState);

      // Attempt to follow/unfollow artist
      console.log('Attempting to follow artist...');
      let result = false;

      if (newFollowingState) {
        result = await followingService.followArtist(user.id, { name: user.name, avatar: user.avatar }, realArtistId, { name: artist.name, avatar: artist.avatar });
      } else {
        result = await followingService.unfollowArtist(user.id, realArtistId);
      }

      console.log('Follow operation result:', result);

      // Update follower count
      await loadFollowerCount();

      // Show notification
      toast({
        title: newFollowingState ? 'Following!' : 'Unfollowed',
        description: newFollowingState ? `You're now following ${artist.name}` : `You've unfollowed ${artist.name}`,
      });

      // Test the mappings
      console.log('=== TESTING DEMO ARTIST MAPPINGS ===');
      const testMappings = await supabaseService.getDemoArtistUserIds();
      console.log('Demo artist mappings:', testMappings);

    } catch (error) {
      console.error('Error in handleFollow:', error);
      // Revert optimistic update
      setIsFollowing(isFollowing);
      toast({
        title: 'Error',
        description: 'Failed to update follow status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Use actual follower count if available, otherwise fallback to artist followers
  const displayFollowers = actualFollowers !== null ? actualFollowers : followers;

  return (
    <div className={`flex ${expanded ? 'flex-col items-center text-center' : 'items-center'} animate-fade-in`}>
      <Avatar className={`${expanded ? 'h-20 w-20 mb-3 ring-2 ring-blue-500/20' : 'h-10 w-10 mr-3'} border-2 border-blue-500/20`}>
        <AvatarImage src={imageUrl} alt={artist.name} className="object-cover" />
        <AvatarFallback className="bg-gray-800 text-blue-400">{initials}</AvatarFallback>
      </Avatar>
      
      <div className={expanded ? 'space-y-3 max-w-md text-center w-full' : 'text-center flex-1'}>
        <div className={`flex items-center ${expanded ? 'justify-center' : 'justify-center'}`}>
          <Link to={`/artist/${artist.id}`}>
            <h3 className={`font-medium text-white hover:text-blue-400 transition-colors ${expanded ? 'text-xl' : ''}`}>
              {artist.name}
            </h3>
          </Link>
          {artist.verified && (
            <CheckCircle className={`text-blue-500 ml-1 ${expanded ? 'h-4 w-4' : 'h-4 w-4'}`} />
          )}
        </div>
        
        {expanded && (
          <>
            <p className="text-gray-400 break-words overflow-hidden text-sm line-clamp-3">{artist.bio}</p>
            
            <div className="flex flex-wrap gap-1 justify-center">
              {genres.slice(0, 3).map((genre, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="capitalize bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
                <div className="text-lg font-semibold text-white">{displayFollowers.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Followers</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
                <div className="text-lg font-semibold text-white">
                  {spotifyArtist ? `${spotifyArtist.popularity}%` : `${artist.successRate}%`}
                </div>
                <div className="text-gray-400 text-xs">
                  {spotifyArtist ? 'Popularity' : 'Success Rate'}
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {showFollowButton && (!user || user.id !== artist.id) && (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                size="sm"
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
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
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
