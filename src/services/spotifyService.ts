
import axios from 'axios';

// Spotify API response interfaces
interface SpotifyArtist {
  id: string;
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  release_date: string;
  total_tracks: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  popularity: number;
  album: SpotifyAlbum;
  duration_ms: number;
}

export interface SpotifyArtistData {
  artist: SpotifyArtist;
  topTracks?: SpotifyTrack[];
  albums?: SpotifyAlbum[];
}

// Spotify API service
class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Get an access token using client credentials flow
   */
  private async getAccessToken(): Promise<string> {
    // Check if we already have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
        },
        data: 'grant_type=client_credentials'
      });

      this.accessToken = response.data.access_token;
      // Set expiration time (subtracting 60 seconds as a buffer)
      this.tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Spotify access token:', error);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  /**
   * Search for an artist by name
   */
  async searchArtist(name: string): Promise<SpotifyArtist | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.artists.items.length > 0) {
        return response.data.artists.items[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error searching Spotify artist:', error);
      return null;
    }
  }

  /**
   * Get an artist by Spotify ID
   */
  async getArtist(id: string): Promise<SpotifyArtist | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${id}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Spotify artist:', error);
      return null;
    }
  }

  /**
   * Get top tracks for an artist
   */
  async getArtistTopTracks(id: string, market = 'US'): Promise<SpotifyTrack[] | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.tracks;
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      return null;
    }
  }

  /**
   * Get albums for an artist
   */
  async getArtistAlbums(id: string, limit = 10): Promise<SpotifyAlbum[] | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${id}/albums?limit=${limit}&include_groups=album,single`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.items;
    } catch (error) {
      console.error('Error fetching artist albums:', error);
      return null;
    }
  }

  /**
   * Get comprehensive artist data (artist details, top tracks, albums)
   */
  async getFullArtistData(artistName: string): Promise<SpotifyArtistData | null> {
    try {
      // First search for the artist
      const artist = await this.searchArtist(artistName);
      
      if (!artist) {
        return null;
      }
      
      // Get top tracks and albums in parallel
      const [topTracks, albums] = await Promise.all([
        this.getArtistTopTracks(artist.id),
        this.getArtistAlbums(artist.id)
      ]);
      
      return {
        artist,
        topTracks: topTracks || undefined,
        albums: albums || undefined
      };
    } catch (error) {
      console.error('Error getting full artist data:', error);
      return null;
    }
  }
  
  /**
   * Get an artist's image URL (largest available)
   */
  async getArtistImageUrl(artistName: string): Promise<string | null> {
    try {
      const artist = await this.searchArtist(artistName);
      
      if (artist && artist.images && artist.images.length > 0) {
        // Return the largest image (typically the first one)
        return artist.images[0].url;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artist image:', error);
      return null;
    }
  }
}

// Create and export a singleton instance with environment variables
// Note: In a real app, you would store these in environment variables
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';

export const spotifyService = new SpotifyService(clientId, clientSecret);

export default spotifyService;
