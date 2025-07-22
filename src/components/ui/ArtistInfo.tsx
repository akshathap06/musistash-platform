
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

interface ConnectLinksProps {
  socialLinks: {
    youtube?: string;
    spotify?: string;
    instagram?: string;
  };
  className?: string;
}

const ConnectLinks: React.FC<ConnectLinksProps> = ({ socialLinks, className }) => {
  if (!socialLinks) return null;
  
  const hasAnyLinks = socialLinks.youtube || socialLinks.spotify || socialLinks.instagram;
  if (!hasAnyLinks) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className || ''}`}>
      {socialLinks.youtube && (
        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </Button>
        </a>
      )}
      {socialLinks.spotify && (
        <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </Button>
        </a>
      )}
      {socialLinks.instagram && (
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-transparent">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </Button>
        </a>
      )}
    </div>
  );
};

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
            {/* Connect Section */}
            {artist.social_links && (
              <div className="w-full">
                <h4 className="text-sm font-medium text-gray-300 mb-2 text-center">Connect</h4>
                <ConnectLinks socialLinks={artist.social_links} />
              </div>
            )}
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
              <div className="w-full mt-3 space-y-2">
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
                <Link to={`/artist/${artist.id}`} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/20">
                    View Profile
                  </Button>
                </Link>
              </div>
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
