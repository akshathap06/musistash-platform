import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Play, Pause, ExternalLink, Music } from 'lucide-react';
import { BACKEND_URL } from '@/config/api';

interface Track {
  id: string;
  name: string;
  album: string;
  album_art: string | null;
  preview_url: string | null;
  external_url: string;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
}

interface SimilarArtist {
  name: string;
  spotify_id: string;
  image: string | null;
  popularity: number;
  genres: string[];
  tracks: Track[];
}

interface SimilarArtistsDisplayProps {
  geminiInsights: any;
  isLoading?: boolean;
}

const SimilarArtistsDisplay: React.FC<SimilarArtistsDisplayProps> = ({ 
  geminiInsights, 
  isLoading = false 
}) => {
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Format duration from milliseconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause for preview tracks
  const handlePlayPause = (trackId: string, previewUrl: string) => {
    if (currentlyPlaying === trackId) {
      // Pause current track
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing audio
      if (audio) {
        audio.pause();
      }
      
      // Play new track
      const newAudio = new Audio(previewUrl);
      newAudio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
        setAudio(null);
      });
      
      newAudio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      setAudio(newAudio);
      setCurrentlyPlaying(trackId);
    }
  };

  // Fetch similar artists data when Gemini insights change
  useEffect(() => {
    const fetchSimilarArtists = async () => {
      if (!geminiInsights?.similar_artists) return;
      
      const primaryMatches = geminiInsights.similar_artists.primary_matches || [];
      const secondaryMatches = geminiInsights.similar_artists.secondary_matches || [];
      
      // Combine primary and secondary matches
      const allArtists = [...primaryMatches, ...secondaryMatches];
      
      if (allArtists.length === 0) return;
      
      setLoading(true);
      
      try {
        const artistNames = allArtists.join(',');
        const response = await fetch(`${BACKEND_URL}/api/agent/similar-artists-samples?artist_names=${encodeURIComponent(artistNames)}`);
        
        if (response.ok) {
          const data = await response.json();
          setSimilarArtists(data.similar_artists || []);
        } else {
          console.error('Failed to fetch similar artists:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching similar artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarArtists();
  }, [geminiInsights]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

  if (isLoading || loading) {
    return (
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🎤 Similar Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 mb-4">Analyzing sound similarity to find matches...</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0f1216] rounded-lg p-4 animate-pulse">
                <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!geminiInsights?.similar_artists || similarArtists.length === 0) {
    return (
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🎤 Similar Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">
            {geminiInsights?.similar_artists?.reasoning || "No similar artists found for this track."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#181c24] border-purple-700">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          🎤 Similar Artists
        </CardTitle>
        {geminiInsights.similar_artists.reasoning && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {geminiInsights.similar_artists.reasoning}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Matches */}
        {geminiInsights.similar_artists.primary_matches && (
          <div>
            <h4 className="text-green-400 font-semibold mb-3">Primary Matches</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarArtists
                .filter(artist => 
                  geminiInsights.similar_artists.primary_matches.includes(artist.name)
                )
                .map((artist) => (
                  <ArtistCard 
                    key={artist.spotify_id} 
                    artist={artist} 
                    onPlayPause={handlePlayPause}
                    currentlyPlaying={currentlyPlaying}
                    badgeColor="bg-green-500/20 text-green-400 border-green-500/30"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Secondary Matches */}
        {geminiInsights.similar_artists.secondary_matches && (
          <div>
            <h4 className="text-blue-400 font-semibold mb-3">Secondary Matches</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarArtists
                .filter(artist => 
                  geminiInsights.similar_artists.secondary_matches.includes(artist.name)
                )
                .map((artist) => (
                  <ArtistCard 
                    key={artist.spotify_id} 
                    artist={artist} 
                    onPlayPause={handlePlayPause}
                    currentlyPlaying={currentlyPlaying}
                    badgeColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
                  />
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ArtistCardProps {
  artist: SimilarArtist;
  onPlayPause: (trackId: string, previewUrl: string) => void;
  currentlyPlaying: string | null;
  badgeColor: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  artist, 
  onPlayPause, 
  currentlyPlaying, 
  badgeColor 
}) => {
  // Format duration from milliseconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0f1216] rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
      {/* Artist Header */}
      <div className="flex items-center gap-3 mb-3">
        {artist.image ? (
          <img 
            src={artist.image} 
            alt={artist.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h5 className="text-white font-semibold text-sm">{artist.name}</h5>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={badgeColor}>
              {artist.popularity}% popular
            </Badge>
            {artist.genres.slice(0, 1).map((genre, idx) => (
              <span key={idx} className="text-xs text-gray-400">{genre}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-2">
        {artist.tracks.map((track) => (
          <div key={track.id} className="bg-[#181c24] rounded p-2 flex items-center gap-2">
            {track.album_art ? (
              <img 
                src={track.album_art} 
                alt={track.album}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                <Music className="w-4 h-4 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{track.name}</div>
              <div className="text-gray-400 text-xs truncate">{track.album}</div>
            </div>
            
            <div className="flex items-center gap-1">
              {track.explicit && (
                <span className="text-xs text-gray-500 bg-gray-700 px-1 rounded">E</span>
              )}
              <span className="text-xs text-gray-400">{formatDuration(track.duration_ms)}</span>
              
              {track.preview_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={() => onPlayPause(track.id, track.preview_url!)}
                >
                  {currentlyPlaying === track.id ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                onClick={() => window.open(track.external_url, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarArtistsDisplay; 