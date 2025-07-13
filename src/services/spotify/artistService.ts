
import axios from 'axios';
import SpotifyBase from './spotifyBase';
import { SpotifyArtist, SpotifyTrack, SpotifyAlbum, SpotifyArtistData } from './spotifyTypes';

class SpotifyArtistService extends SpotifyBase {
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
}

export default SpotifyArtistService;
