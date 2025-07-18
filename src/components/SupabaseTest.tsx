import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabaseService';
import { followingService } from '@/services/followingService';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Loader2, Users, Heart } from 'lucide-react';

const SupabaseTest = () => {
  const { user, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testResults, setTestResults] = useState<any>({});
  const [followTestResults, setFollowTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus('connected');
      setTestResults({
        connection: '✅ Connected to Supabase',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      setConnectionStatus('error');
      setTestResults({
        connection: '❌ Failed to connect to Supabase',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  const testFollowFunctionality = async () => {
    if (!user || !isAuthenticated) {
      setFollowTestResults({
        error: 'User not authenticated'
      });
      return;
    }

    setIsLoading(true);
    try {
      const results: any = {};

      // Test 1: Get following count
      const followingCount = await followingService.getFollowingCount(user.id);
      results.followingCount = followingCount;

      // Test 2: Get recent following
      const recentFollowing = await followingService.getRecentFollowing(user.id);
      results.recentFollowing = recentFollowing;

      // Test 3: Get user profile to test follower count
      const userProfile = await supabaseService.getArtistProfileByUserId(user.id);
      if (userProfile) {
        const followerCount = await followingService.getFollowerCount(userProfile.id);
        results.followerCount = followerCount;
        results.userProfile = userProfile;
      }

      // Test 4: Test follow/unfollow with a mock artist (if we have approved profiles)
      const approvedProfiles = await supabaseService.getApprovedArtistProfiles();
      if (approvedProfiles.length > 0) {
        const testArtist = approvedProfiles[0];
        
        // Check if already following
        const isFollowing = await followingService.isFollowing(user.id, testArtist.id);
        results.testArtist = {
          id: testArtist.id,
          name: testArtist.artist_name,
          isFollowing
        };

        // Test follow (if not already following)
        if (!isFollowing) {
          const followSuccess = await followingService.followArtist(
            user.id,
            { name: user.name, avatar: user.avatar },
            testArtist.id,
            { name: testArtist.artist_name, avatar: testArtist.profile_photo || '/placeholder.svg' }
          );
          results.followTest = followSuccess ? '✅ Follow successful' : '❌ Follow failed';
        } else {
          results.followTest = 'ℹ️ Already following test artist';
        }
      }

      setFollowTestResults(results);
    } catch (error) {
      console.error('Follow functionality test failed:', error);
      setFollowTestResults({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Supabase Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}>
                {connectionStatus === 'testing' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                {connectionStatus === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                {connectionStatus === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                {connectionStatus === 'testing' ? 'Testing...' : connectionStatus === 'connected' ? 'Connected' : 'Error'}
              </Badge>
              <Button variant="outline" size="sm" onClick={testConnection}>
                Retest Connection
              </Button>
            </div>
            
            {testResults.connection && (
              <div className="text-sm space-y-1">
                <p>{testResults.connection}</p>
                {testResults.error && (
                  <p className="text-red-500">Error: {testResults.error}</p>
                )}
                <p className="text-gray-500">Last tested: {testResults.timestamp}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Follow Functionality Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={testFollowFunctionality} 
                disabled={isLoading || !isAuthenticated}
                className="flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Test Follow Functionality
              </Button>
              {!isAuthenticated && (
                <Badge variant="secondary">Login required</Badge>
              )}
            </div>
            
            {followTestResults.error && (
              <div className="text-red-500 text-sm">
                Error: {followTestResults.error}
              </div>
            )}
            
            {followTestResults.followingCount !== undefined && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Following Count: {followTestResults.followingCount}</span>
                </div>
                
                {followTestResults.followerCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Follower Count: {followTestResults.followerCount}</span>
                  </div>
                )}
                
                {followTestResults.recentFollowing && followTestResults.recentFollowing.length > 0 && (
                  <div>
                    <p className="font-medium">Recent Following:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {followTestResults.recentFollowing.map((follow: any, index: number) => (
                        <li key={index}>
                          {follow.artistName || 'Unknown Artist'} 
                          <span className="text-gray-500 text-xs ml-2">
                            ({new Date(follow.followedAt).toLocaleDateString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {followTestResults.followTest && (
                  <div className="text-green-600">
                    {followTestResults.followTest}
                  </div>
                )}
                
                {followTestResults.testArtist && (
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium">Test Artist:</p>
                    <p>Name: {followTestResults.testArtist.name}</p>
                    <p>Following: {followTestResults.testArtist.isFollowing ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTest; 