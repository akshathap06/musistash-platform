
// Spotify API response interfaces
export interface SpotifyArtist {
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

export interface SpotifyAlbum {
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

export interface SpotifyTrack {
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
