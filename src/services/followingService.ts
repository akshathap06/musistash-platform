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
  private followingKey = 'user_following';
  private followersKey = 'user_followers';

  // Get all artists that a user is following
  getUserFollowing(userId: string): FollowData[] {
    const stored = localStorage.getItem(this.followingKey);
    if (!stored) return [];
    
    const allFollowing: Record<string, FollowData[]> = JSON.parse(stored);
    return allFollowing[userId] || [];
  }

  // Get all users following a specific artist
  getArtistFollowers(artistId: string): FollowerData[] {
    const stored = localStorage.getItem(this.followersKey);
    if (!stored) return [];
    
    const allFollowers: Record<string, FollowerData[]> = JSON.parse(stored);
    return allFollowers[artistId] || [];
  }

  // Follow an artist
  followArtist(userId: string, userData: { name: string; avatar: string }, artistId: string, artistData: { name: string; avatar: string }): boolean {
    try {
      // Add to user's following list
      const following = this.getUserFollowing(userId);
      const newFollow: FollowData = {
        userId,
        artistId,
        followedAt: new Date().toISOString(),
        artistName: artistData.name,
        artistAvatar: artistData.avatar
      };
      
      // Check if already following
      if (following.some(f => f.artistId === artistId)) {
        return false; // Already following
      }
      
      following.push(newFollow);
      
      const allFollowing: Record<string, FollowData[]> = {};
      const storedFollowing = localStorage.getItem(this.followingKey);
      if (storedFollowing) {
        Object.assign(allFollowing, JSON.parse(storedFollowing));
      }
      allFollowing[userId] = following;
      localStorage.setItem(this.followingKey, JSON.stringify(allFollowing));

      // Add to artist's followers list
      const followers = this.getArtistFollowers(artistId);
      const newFollower: FollowerData = {
        followerId: userId,
        followerName: userData.name,
        followerAvatar: userData.avatar,
        followedAt: new Date().toISOString()
      };
      
      followers.push(newFollower);
      
      const allFollowers: Record<string, FollowerData[]> = {};
      const storedFollowers = localStorage.getItem(this.followersKey);
      if (storedFollowers) {
        Object.assign(allFollowers, JSON.parse(storedFollowers));
      }
      allFollowers[artistId] = followers;
      localStorage.setItem(this.followersKey, JSON.stringify(allFollowers));

      return true;
    } catch (error) {
      console.error('Error following artist:', error);
      return false;
    }
  }

  // Unfollow an artist
  unfollowArtist(userId: string, artistId: string): boolean {
    try {
      // Remove from user's following list
      const following = this.getUserFollowing(userId);
      const updatedFollowing = following.filter(f => f.artistId !== artistId);
      
      const allFollowing: Record<string, FollowData[]> = {};
      const storedFollowing = localStorage.getItem(this.followingKey);
      if (storedFollowing) {
        Object.assign(allFollowing, JSON.parse(storedFollowing));
      }
      allFollowing[userId] = updatedFollowing;
      localStorage.setItem(this.followingKey, JSON.stringify(allFollowing));

      // Remove from artist's followers list
      const followers = this.getArtistFollowers(artistId);
      const updatedFollowers = followers.filter(f => f.followerId !== userId);
      
      const allFollowers: Record<string, FollowerData[]> = {};
      const storedFollowers = localStorage.getItem(this.followersKey);
      if (storedFollowers) {
        Object.assign(allFollowers, JSON.parse(storedFollowers));
      }
      allFollowers[artistId] = updatedFollowers;
      localStorage.setItem(this.followersKey, JSON.stringify(allFollowers));

      return true;
    } catch (error) {
      console.error('Error unfollowing artist:', error);
      return false;
    }
  }

  // Check if user is following an artist
  isFollowing(userId: string, artistId: string): boolean {
    const following = this.getUserFollowing(userId);
    return following.some(f => f.artistId === artistId);
  }

  // Get follower count for an artist
  getFollowerCount(artistId: string): number {
    const followers = this.getArtistFollowers(artistId);
    return followers.length;
  }

  // Get following count for a user
  getFollowingCount(userId: string): number {
    const following = this.getUserFollowing(userId);
    return following.length;
  }

  // Get recent followers for an artist (last 5)
  getRecentFollowers(artistId: string): FollowerData[] {
    const followers = this.getArtistFollowers(artistId);
    return followers
      .sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime())
      .slice(0, 5);
  }

  // Get recent following for a user (last 5)
  getRecentFollowing(userId: string): FollowData[] {
    const following = this.getUserFollowing(userId);
    return following
      .sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime())
      .slice(0, 5);
  }
}

export const followingService = new FollowingService(); 