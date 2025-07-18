import { supabaseService } from './supabaseService';
import { artistProfileService } from './artistProfileService';

export interface FollowData {
  userId: string;
  artistId: string;
  followedAt: string;
  artistName: string;
  artistAvatar: string;
}

export interface FollowerData {
  followerId: string;
  followerName: string;
  followerAvatar: string;
  followedAt: string;
}

class FollowingService {
  // Get all artists that a user is following
  async getUserFollowing(userId: string): Promise<FollowData[]> {
    try {
      const following = await supabaseService.getFollowing(userId);
      const followData: FollowData[] = [];
      
      for (const follow of following) {
        // Try to get artist profile details
        let artistName = '';
        let artistAvatar = '/placeholder.svg';
        
        try {
          const profile = await artistProfileService.getProfileById(follow.artist_id);
          if (profile) {
            artistName = profile.artist_name;
            artistAvatar = profile.profile_photo || '/placeholder.svg';
          }
        } catch (error) {
          console.error('Error fetching artist profile:', error);
        }
        
        followData.push({
          userId: follow.follower_id,
          artistId: follow.artist_id,
          followedAt: follow.followed_at,
          artistName,
          artistAvatar
        });
      }
      
      return followData;
    } catch (error) {
      console.error('Error getting user following:', error);
      return [];
    }
  }

  // Get all users following a specific artist
  async getArtistFollowers(artistId: string): Promise<FollowerData[]> {
    try {
      const followers = await supabaseService.getFollowers(artistId);
      const followerData: FollowerData[] = [];
      
      for (const follower of followers) {
        // Try to get user details
        let followerName = '';
        let followerAvatar = '/placeholder.svg';
        
        try {
          const user = await supabaseService.getUserById(follower.follower_id);
          if (user) {
            followerName = user.name;
            followerAvatar = user.avatar || '/placeholder.svg';
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
        
        followerData.push({
          followerId: follower.follower_id,
          followerName,
          followerAvatar,
          followedAt: follower.followed_at
        });
      }
      
      return followerData;
    } catch (error) {
      console.error('Error getting artist followers:', error);
      return [];
    }
  }

  // Follow an artist
  async followArtist(userId: string, userData: { name: string; avatar: string }, artistId: string, artistData: { name: string; avatar: string }): Promise<boolean> {
    try {
      console.log('FollowingService: Attempting to follow artist via Supabase');
      const result = await supabaseService.followArtist(userId, artistId);
      
      if (result) {
        console.log('FollowingService: Supabase follow successful');
        return true;
      }
      
      // Fallback to localStorage if Supabase fails
      console.log('FollowingService: Supabase failed, using localStorage fallback');
      return this.followArtistLocal(userId, artistId);
    } catch (error) {
      console.error('Error following artist:', error);
      // Fallback to localStorage
      return this.followArtistLocal(userId, artistId);
    }
  }

  // LocalStorage fallback for following
  private followArtistLocal(userId: string, artistId: string): boolean {
    try {
      const storageKey = 'musistash_follow_relationships';
      const existing = localStorage.getItem(storageKey);
      const relationships = existing ? JSON.parse(existing) : [];
      
      // Check if already following
      const alreadyFollowing = relationships.some((rel: any) => 
        rel.follower_id === userId && rel.artist_id === artistId
      );
      
      if (alreadyFollowing) {
        console.log('FollowingService: Already following in localStorage');
        return false;
      }
      
      // Add new relationship
      relationships.push({
        follower_id: userId,
        artist_id: artistId,
        followed_at: new Date().toISOString()
      });
      
      localStorage.setItem(storageKey, JSON.stringify(relationships));
      console.log('FollowingService: Follow relationship saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error in localStorage follow:', error);
      return false;
    }
  }

  // Unfollow an artist
  async unfollowArtist(userId: string, artistId: string): Promise<boolean> {
    try {
      console.log('FollowingService: Attempting to unfollow artist via Supabase');
      const result = await supabaseService.unfollowArtist(userId, artistId);
      
      if (result) {
        console.log('FollowingService: Supabase unfollow successful');
        return true;
      }
      
      // Fallback to localStorage if Supabase fails
      console.log('FollowingService: Supabase failed, using localStorage fallback');
      return this.unfollowArtistLocal(userId, artistId);
    } catch (error) {
      console.error('Error unfollowing artist:', error);
      // Fallback to localStorage
      return this.unfollowArtistLocal(userId, artistId);
    }
  }

  // LocalStorage fallback for unfollowing
  private unfollowArtistLocal(userId: string, artistId: string): boolean {
    try {
      const storageKey = 'musistash_follow_relationships';
      const existing = localStorage.getItem(storageKey);
      const relationships = existing ? JSON.parse(existing) : [];
      
      // Remove relationship
      const updatedRelationships = relationships.filter((rel: any) => 
        !(rel.follower_id === userId && rel.artist_id === artistId)
      );
      
      localStorage.setItem(storageKey, JSON.stringify(updatedRelationships));
      console.log('FollowingService: Unfollow relationship saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error in localStorage unfollow:', error);
      return false;
    }
  }

  // Check if user is following an artist
  async isFollowing(userId: string, artistId: string): Promise<boolean> {
    try {
      console.log('FollowingService: Checking follow status via Supabase');
      const result = await supabaseService.isFollowing(userId, artistId);
      
      if (result !== undefined) {
        console.log('FollowingService: Supabase follow check successful:', result);
        return result;
      }
      
      // Fallback to localStorage if Supabase fails
      console.log('FollowingService: Supabase failed, using localStorage fallback');
      return this.isFollowingLocal(userId, artistId);
    } catch (error) {
      console.error('Error checking follow status:', error);
      // Fallback to localStorage
      return this.isFollowingLocal(userId, artistId);
    }
  }

  // LocalStorage fallback for checking follow status
  private isFollowingLocal(userId: string, artistId: string): boolean {
    try {
      const storageKey = 'musistash_follow_relationships';
      const existing = localStorage.getItem(storageKey);
      const relationships = existing ? JSON.parse(existing) : [];
      
      const isFollowing = relationships.some((rel: any) => 
        rel.follower_id === userId && rel.artist_id === artistId
      );
      
      console.log('FollowingService: localStorage follow check result:', isFollowing);
      return isFollowing;
    } catch (error) {
      console.error('Error in localStorage follow check:', error);
      return false;
    }
  }

  // Get follower count for an artist
  async getFollowerCount(artistId: string): Promise<number> {
    try {
      const count = await supabaseService.getFollowerCount(artistId);
      return count;
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  }

  // Get following count for a user
  async getFollowingCount(userId: string): Promise<number> {
    try {
      const count = await supabaseService.getFollowingCount(userId);
      return count;
    } catch (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
  }

  // Get recent followers for an artist (last 5)
  async getRecentFollowers(artistId: string): Promise<FollowerData[]> {
    try {
      const followers = await this.getArtistFollowers(artistId);
      return followers
        .sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent followers:', error);
      return [];
    }
  }

  // Get recent following for a user (last 5)
  async getRecentFollowing(userId: string): Promise<FollowData[]> {
    try {
      const following = await this.getUserFollowing(userId);
      return following
        .sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent following:', error);
      return [];
    }
  }
}

export const followingService = new FollowingService(); 