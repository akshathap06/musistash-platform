
import axios from 'axios';

// Interface for combined artist stats
export interface ArtistStats {
  name: string;
  mbid?: string; // MusicBrainz ID
  image?: string;
  listeners?: number;
  playcount?: number;
  followers?: {
    total: number;
    history?: { date: string; count: number }[];
  };
  monthlyListeners?: number;
  trackStats?: {
    name: string;
    playcount: number;
    listeners: number;
  }[];
  albums?: {
    name: string;
    releaseDate: string;
    tracks: number;
  }[];
  stats?: {
    category: string;
    value: number | string;
    change?: number;
  }[];
}

// Get MusicBrainz artist info
export const getMusicBrainzArtist = async (name: string) => {
  try {
    const response = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(name)}&fmt=json`,
      {
        headers: {
          'User-Agent': 'MusiStash/1.0.0 (info@musistash.com)'
        }
      }
    );
    
    if (response.data.artists && response.data.artists.length > 0) {
      return response.data.artists[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching MusicBrainz data:', error);
    return null;
  }
};

// Get Last.fm artist info
export const getLastFmArtist = async (name: string) => {
  try {
    // Note: In a production app, this API key should be stored securely
    const API_KEY = '1a11aeb9b81ad4133702fc7f57845d35';
    
    const response = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(name)}&api_key=${API_KEY}&format=json`
    );
    
    if (response.data && response.data.artist) {
      return response.data.artist;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return null;
  }
};

// Simulate Songstats API (as it's not publicly available without authentication)
export const simulateSongstatsData = (artistName: string) => {
  // This is mock data - in a real application you would call the actual Songstats API
  return {
    name: artistName,
    monthlyListeners: Math.floor(Math.random() * 10000000) + 500000,
    followers: {
      total: Math.floor(Math.random() * 5000000) + 100000,
      history: [
        { date: '2023-01', count: Math.floor(Math.random() * 3000000) + 100000 },
        { date: '2023-02', count: Math.floor(Math.random() * 3500000) + 100000 },
        { date: '2023-03', count: Math.floor(Math.random() * 4000000) + 100000 },
        { date: '2023-04', count: Math.floor(Math.random() * 4500000) + 100000 },
        { date: '2023-05', count: Math.floor(Math.random() * 5000000) + 100000 },
      ]
    },
    tracks: [
      { name: 'Top Hit 1', streams: Math.floor(Math.random() * 100000000) + 10000000 },
      { name: 'Popular Song 2', streams: Math.floor(Math.random() * 80000000) + 8000000 },
      { name: 'Classic Track 3', streams: Math.floor(Math.random() * 60000000) + 6000000 },
    ]
  };
};

// Combine data from all sources
export const getArtistStats = async (artistName: string): Promise<ArtistStats | null> => {
  try {
    // Get data from MusicBrainz
    const mbArtist = await getMusicBrainzArtist(artistName);
    
    // Get data from Last.fm
    const lastFmArtist = await getLastFmArtist(artistName);
    
    // Get simulated Songstats data (would be real API call in production)
    const songstatsData = simulateSongstatsData(artistName);
    
    if (!mbArtist && !lastFmArtist && !songstatsData) {
      return null;
    }
    
    // Find the extralarge image URL if available
    const imageObject = lastFmArtist?.image?.find(img => img.size === 'extralarge');
    const imageUrl = imageObject ? imageObject["#text"] : undefined;
    
    // Combine all data sources
    const combinedData: ArtistStats = {
      name: artistName,
      mbid: mbArtist?.id,
      image: imageUrl,
      listeners: parseInt(lastFmArtist?.stats?.listeners || '0'),
      playcount: parseInt(lastFmArtist?.stats?.playcount || '0'),
      followers: songstatsData.followers,
      monthlyListeners: songstatsData.monthlyListeners,
      trackStats: lastFmArtist?.toptracks?.track?.map(track => ({
        name: track.name,
        playcount: track.playcount,
        listeners: track.listeners
      })) || [],
      stats: [
        { 
          category: 'Monthly Listeners', 
          value: songstatsData.monthlyListeners.toLocaleString(), 
          change: 5.3 
        },
        { 
          category: 'Total Plays', 
          value: parseInt(lastFmArtist?.stats?.playcount || '0').toLocaleString(), 
          change: 8.7 
        },
        { 
          category: 'Followers', 
          value: songstatsData.followers.total.toLocaleString(), 
          change: 3.2 
        },
        { 
          category: 'Engagement Rate', 
          value: `${(Math.random() * 5 + 1).toFixed(1)}%`, 
          change: 0.5 
        }
      ]
    };
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching artist stats:', error);
    return null;
  }
};
