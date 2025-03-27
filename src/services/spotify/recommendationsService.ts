
import axios from 'axios';
import SpotifyBase from './spotifyBase';
import { SpotifyArtist } from './spotifyTypes';

class SpotifyRecommendationsService extends SpotifyBase {
  /**
   * Get artist recommendations based on an artist ID
   */
  async getArtistRecommendations(id: string, limit = 5): Promise<SpotifyArtist[] | null> {
    try {
      const token = await this.getAccessToken();
      
      // We need to get the artist's top tracks to use as seeds
      const topTracksResponse = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const topTracks = topTracksResponse.data.tracks;
      
      if (!topTracks || topTracks.length === 0) {
        return null;
      }
      
      const trackSeeds = topTracks.slice(0, 5).map((track: any) => track.id).join(',');
      
      const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${id}&seed_tracks=${trackSeeds}&limit=${limit}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const uniqueArtists: {[key: string]: SpotifyArtist} = {};
      
      response.data.tracks.forEach((track: any) => {
        track.artists.forEach((artist: any) => {
          if (artist.id !== id && !uniqueArtists[artist.id]) {
            uniqueArtists[artist.id] = artist;
          }
        });
      });
      
      return Object.values(uniqueArtists).slice(0, limit);
    } catch (error) {
      console.error('Error getting artist recommendations:', error);
      return null;
    }
  }
}

export default SpotifyRecommendationsService;
