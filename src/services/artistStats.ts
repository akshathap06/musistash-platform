
import axios from 'axios';
import spotifyService from './spotify';

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
  popularityAnalysis?: {
    overall_popularity_score: number;
    breakdown: {
      spotify_followers_score: number;
      spotify_popularity_score: number;
      google_trends_score: number;
      billboard_score: number;
    };
    methodology: string;
  };
}

// Use local backend for development
const API_BASE_URL = 'http://localhost:8000';

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

// Get Spotify artist info
export const getSpotifyArtistInfo = async (name: string) => {
  try {
    const artistData = await spotifyService.getFullArtistData(name);
    return artistData;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return null;
  }
};

// Get ListenBrainz artist stats
export const getListenBrainzArtist = async (artistName: string, userToken: string) => {
  try {
    // Search for the artist MBID using MusicBrainz
    const mbSearch = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`
    );
    if (!mbSearch.data.artists || mbSearch.data.artists.length === 0) return null;
    const mbid = mbSearch.data.artists[0].id;
    // Fetch ListenBrainz stats for the artist using the MBID
    const response = await axios.get(
      `https://api.listenbrainz.org/1/artist/${mbid}/listens`,
      {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ListenBrainz data:', error);
    return null;
  }
};

// Update getArtistStats to use the live Render backend
export const getArtistStats = async (artistName: string): Promise<ArtistStats | null> => {
  try {
    console.log('Fetching artist stats for:', artistName);
    console.log('Using API URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/artist-stats/${encodeURIComponent(artistName)}`);
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    
    // Parse Spotify
    const spotify = data.spotify;
    // Parse Last.fm
    const lastfm = data.lastfm;
    // Parse ListenBrainz
    const listenbrainz = data.listenbrainz;
    // Parse Billboard
    const billboard = data.billboard;
    
    // Followers from Spotify
    const followers = spotify?.followers || 0;
    
    // Monthly listeners: Use smart popularity analysis if available
    const monthlyListeners = data.popularity_analysis?.estimated_monthly_listeners || 
      (lastfm?.stats?.listeners ? parseInt(lastfm.stats.listeners) : Math.floor(followers * 0.15));
    
    // Total plays from Last.fm (playcount)
    const playcount = lastfm?.stats?.playcount ? parseInt(lastfm.stats.playcount) : 0;
    
    // Get popularity breakdown for additional insights
    const popularityBreakdown = data.popularity_analysis?.breakdown || null;
    const overallPopularityScore = data.popularity_analysis?.overall_popularity_score || null;
    
    // Engagement rate: playcount / followers * 100
    let engagementRate = null;
    if (playcount && followers) {
      engagementRate = ((playcount / followers) * 100).toFixed(2) + '%';
    }
    
    // ListenBrainz listens count (if available)
    let listenBrainzListens = null;
    if (listenbrainz && listenbrainz.payload && listenbrainz.payload.count) {
      listenBrainzListens = listenbrainz.payload.count;
    }
    
    // Compose combined stats
    const combinedData: ArtistStats = {
      name: spotify?.name || artistName,
      mbid: lastfm?.mbid || undefined,
      image: spotify?.image_url || undefined,
      listeners: monthlyListeners,
      playcount: playcount,
      followers: { total: followers, history: [] },
      monthlyListeners: monthlyListeners,
      trackStats: lastfm?.toptracks?.track?.map((track: any) => ({
        name: track.name,
        playcount: track.playcount,
        listeners: track.listeners
      })) || [],
      albums: [],
      stats: [
        { category: 'Total Plays', value: playcount.toLocaleString() },
        { category: 'Followers', value: followers.toLocaleString() },
        { category: 'Engagement Rate', value: engagementRate || 'N/A' },
        listenBrainzListens !== null ? { category: 'ListenBrainz Listens', value: listenBrainzListens.toLocaleString() } : undefined,
        billboard ? { category: 'Billboard Chart', value: `#${billboard.rank}: ${billboard.title}` } : undefined
      ].filter(Boolean)
    };
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching artist stats:', error);
    return null;
  }
};

// Process raw artist stats data from backend into ArtistStats format
export const processRawArtistStats = (rawData: any, artistName: string): ArtistStats | null => {
  if (!rawData) return null;
  
  try {
    // Parse Spotify data
    const spotify = rawData.spotify;
    // Parse Last.fm data
    const lastfm = rawData.lastfm;
    // Parse ListenBrainz data
    const listenbrainz = rawData.listenbrainz;
    // Parse Billboard data
    const billboard = rawData.billboard;
    
    // Extract followers from Spotify
    const followers = spotify?.followers || 0;
    
    // Extract monthly listeners: Use smart popularity analysis if available
    const monthlyListeners = rawData.popularity_analysis?.estimated_monthly_listeners || 
      (lastfm?.stats?.listeners ? parseInt(lastfm.stats.listeners) : Math.floor(followers * 0.15));
    
    // Get popularity breakdown for additional insights
    const popularityBreakdown = rawData.popularity_analysis?.breakdown || null;
    const overallPopularityScore = rawData.popularity_analysis?.overall_popularity_score || null;
    
    // Extract total plays from Last.fm
    const playcount = lastfm?.stats?.playcount ? parseInt(lastfm.stats.playcount) : 0;
    
    // Calculate engagement rate
    let engagementRate = null;
    if (playcount && followers) {
      engagementRate = ((playcount / followers) * 100).toFixed(2) + '%';
    }
    
    // Extract ListenBrainz listens count
    let listenBrainzListens = null;
    if (listenbrainz && listenbrainz.payload && listenbrainz.payload.count) {
      listenBrainzListens = listenbrainz.payload.count;
    }
    
    // Compose combined stats
    const combinedData: ArtistStats = {
      name: spotify?.name || artistName,
      mbid: lastfm?.mbid || undefined,
      image: spotify?.image_url || undefined,
      listeners: monthlyListeners,
      playcount: playcount,
      followers: { total: followers, history: [] },
      monthlyListeners: monthlyListeners,
      trackStats: lastfm?.toptracks?.track?.map((track: any) => ({
        name: track.name,
        playcount: track.playcount,
        listeners: track.listeners
      })) || [],
      albums: [],
      popularityAnalysis: rawData.popularity_analysis ? {
        overall_popularity_score: rawData.popularity_analysis.overall_popularity_score,
        breakdown: rawData.popularity_analysis.breakdown,
        methodology: rawData.popularity_analysis.methodology
      } : undefined,
      stats: [
        { category: 'Total Plays', value: playcount.toLocaleString() },
        { category: 'Followers', value: followers.toLocaleString() },
        { category: 'Engagement Rate', value: engagementRate || 'N/A' },
        overallPopularityScore ? { category: 'Popularity Score', value: `${overallPopularityScore}/100` } : undefined,
        popularityBreakdown?.spotify_popularity_score ? { category: 'Spotify Popularity', value: `${popularityBreakdown.spotify_popularity_score}/100` } : undefined,
        popularityBreakdown?.google_trends_score ? { category: 'Search Trends', value: `${popularityBreakdown.google_trends_score}/100` } : undefined,
        popularityBreakdown?.billboard_score ? { category: 'Chart Performance', value: `${popularityBreakdown.billboard_score}/100` } : undefined,
        listenBrainzListens !== null ? { category: 'ListenBrainz Listens', value: listenBrainzListens.toLocaleString() } : undefined,
        billboard ? { category: 'Billboard Chart', value: `#${billboard.rank}: ${billboard.title}` } : undefined
      ].filter(Boolean)
    };
    
    return combinedData;
  } catch (error) {
    console.error('Error processing raw artist stats:', error);
    return null;
  }
};
