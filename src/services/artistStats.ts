
import { API_ENDPOINTS } from '@/config/api';

export interface ArtistStats {
  id: string;
  name: string;
  monthlyListeners: number;
  popularity: number;
  followers: number;
  genres: string[];
  topTracks: string[];
}

export const fetchArtistStats = async (artistId: string): Promise<ArtistStats> => {
  try {
    const response = await fetch(API_ENDPOINTS.artistStats(artistId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch artist stats: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist stats:', error);
    throw error;
  }
};

export const analyzeArtist = async (name: string, compareArtist?: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.analyzeArtist(name, compareArtist));
    
    if (!response.ok) {
      throw new Error(`Failed to analyze artist: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing artist:', error);
    throw error;
  }
};
