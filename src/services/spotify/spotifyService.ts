
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

  /**
   * Compare two artists and get similarity score
   */
  async compareArtists(artist1Name: string, artist2Name: string): Promise<{
    artist1: SpotifyArtist | null;
    artist2: SpotifyArtist | null;
    similarityScore: number;
  }> {
    try {
      const [artist1, artist2] = await Promise.all([
        this.searchArtist(artist1Name),
        this.searchArtist(artist2Name)
      ]);
      
      if (!artist1 || !artist2) {
        return {
          artist1,
          artist2,
          similarityScore: 0
        };
      }
      
      // Calculate similarity score based on genres overlap and popularity
      let similarityScore = 0;
      
      // Genre similarity (up to 50 points)
      const artist1Genres = new Set(artist1.genres);
      let genreOverlap = 0;
      
      for (const genre of artist2.genres) {
        if (artist1Genres.has(genre)) {
          genreOverlap++;
        }
      }
      
      if (artist1.genres.length > 0 && artist2.genres.length > 0) {
        const maxPossibleOverlap = Math.max(artist1.genres.length, artist2.genres.length);
        similarityScore += 50 * (genreOverlap / maxPossibleOverlap);
      }
      
      // Popularity similarity (up to 50 points)
      const popularityDiff = Math.abs(artist1.popularity - artist2.popularity);
      similarityScore += 50 * (1 - (popularityDiff / 100));
      
      return {
        artist1,
        artist2,
        similarityScore: Math.round(similarityScore)
      };
    } catch (error) {
      console.error('Error comparing artists:', error);
      return {
        artist1: null,
        artist2: null,
        similarityScore: 0
      };
    }
  }
}

// Create and export a singleton instance with Spotify API credentials
const clientId = 'efef3f967a0a451ab781c423e5f363b3';
const clientSecret = '21b94bd9b83e4ddb9828867b2cce5f23';

export const spotifyService = new SpotifyService(clientId, clientSecret);

export default spotifyService;
