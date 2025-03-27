
import SpotifyArtistService from './artistService';
import SpotifyRecommendationsService from './recommendationsService';
import { SpotifyArtistData, SpotifyArtist } from './spotifyTypes';

class SpotifyService {
  private artistService: SpotifyArtistService;
  private recommendationsService: SpotifyRecommendationsService;

  constructor(clientId: string, clientSecret: string) {
    this.artistService = new SpotifyArtistService(clientId, clientSecret);
    this.recommendationsService = new SpotifyRecommendationsService(clientId, clientSecret);
  }

  /**
   * Get comprehensive artist data (artist details, top tracks, albums)
   */
  async getFullArtistData(artistName: string): Promise<SpotifyArtistData | null> {
    try {
      const artist = await this.artistService.searchArtist(artistName);
      
      if (!artist) {
        return null;
      }
      
      const [topTracks, albums] = await Promise.all([
        this.artistService.getArtistTopTracks(artist.id),
        this.artistService.getArtistAlbums(artist.id)
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
      const artist = await this.artistService.searchArtist(artistName);
      
      if (artist && artist.images && artist.images.length > 0) {
        return artist.images[0].url;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artist image:', error);
      return null;
    }
  }

  /**
   * Search for an artist by name
   */
  async searchArtist(name: string): Promise<SpotifyArtist | null> {
    return this.artistService.searchArtist(name);
  }

  /**
   * Get artist by ID
   */
  async getArtist(id: string): Promise<SpotifyArtist | null> {
    return this.artistService.getArtist(id);
  }

  /**
   * Get artist top tracks
   */
  async getArtistTopTracks(id: string, market = 'US') {
    return this.artistService.getArtistTopTracks(id, market);
  }

  /**
   * Get artist albums
   */
  async getArtistAlbums(id: string, limit = 10) {
    return this.artistService.getArtistAlbums(id, limit);
  }

  /**
   * Get artist recommendations
   */
  async getArtistRecommendations(id: string, limit = 5) {
    return this.recommendationsService.getArtistRecommendations(id, limit);
  }
}

// Create and export a singleton instance with Spotify API credentials
const clientId = 'efef3f967a0a451ab781c423e5f363b3';
const clientSecret = '21b94bd9b83e4ddb9828867b2cce5f23';

export const spotifyService = new SpotifyService(clientId, clientSecret);

export default spotifyService;
