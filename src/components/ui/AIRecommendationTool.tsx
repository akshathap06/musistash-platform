import React, { useState } from 'react';
import axios from 'axios';
import { Search, Music, BarChart2, Disc, Volume2, ListMusic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  popularity: number;
  genres: string[];
}

interface TrackFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  valence: number;
}

interface ArtistStats {
  artist: SpotifyArtist;
  features: TrackFeatures;
  topTracks: any[];
}

interface ComparisonData {
  searchedArtist: ArtistStats | null;
  comparisonArtist: ArtistStats | null;
  resonanceScore?: number;
  originalQuery?: string;
}

const AIRecommendationTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    searchedArtist: null,
    comparisonArtist: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const getSpotifyToken = async () => {
    return "SIMULATED_TOKEN";
  };

  const findCorrectArtistName = async (query: string): Promise<{ name: string, id: string, corrected: boolean }> => {
    try {
      const commonMisspellings: { [key: string]: string } = {
        'jucieee wrlds': 'Juice WRLD',
        'jucie world': 'Juice WRLD',
        'juiceworld': 'Juice WRLD',
        'beylonce': 'Beyoncé',
        'beonce': 'Beyoncé',
        'tayler swift': 'Taylor Swift',
        'ariana grand': 'Ariana Grande',
        'weeknd': 'The Weeknd',
        'ed sheran': 'Ed Sheeran'
      };
      
      const lowercaseQuery = query.toLowerCase();
      
      if (lowercaseQuery in commonMisspellings) {
        const correctedName = commonMisspellings[lowercaseQuery];
        return {
          name: correctedName,
          id: 'spotify-' + Math.random().toString(36).substring(7),
          corrected: true
        };
      }
      
      const formattedName = query.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return {
        name: formattedName,
        id: 'spotify-' + Math.random().toString(36).substring(7),
        corrected: formattedName.toLowerCase() !== query.toLowerCase()
      };
    } catch (error) {
      console.error('Error finding correct artist name:', error);
      return {
        name: query,
        id: 'unknown-' + Math.random().toString(36).substring(7),
        corrected: false
      };
    }
  };

  const searchArtist = async (query: string) => {
    try {
      const { name: correctedName, id, corrected } = await findCorrectArtistName(query);
      
      const mockArtistResponse = {
        id: id,
        name: correctedName,
        images: [{ url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&h=300" }],
        followers: { total: Math.floor(Math.random() * 10000000) },
        popularity: Math.floor(Math.random() * 100),
        genres: ["pop", "dance pop", "electropop"]
      };
      
      if (corrected) {
        toast({
          title: "Artist name corrected",
          description: `Showing results for "${correctedName}" instead of "${query}"`,
        });
      }
      
      return {
        artist: mockArtistResponse,
        corrected,
        originalQuery: query
      };
    } catch (error) {
      console.error('Error searching for artist:', error);
      throw error;
    }
  };

  const getArtistTopTracks = async (artistId: string) => {
    return Array(5).fill(null).map((_, i) => ({
      id: `track-${i}`,
      name: `Top Track ${i + 1}`,
      popularity: Math.floor(Math.random() * 100)
    }));
  };

  const getTrackFeatures = async () => {
    return {
      acousticness: Math.random(),
      danceability: Math.random(),
      energy: Math.random(),
      instrumentalness: Math.random(),
      liveness: Math.random(),
      speechiness: Math.random(),
      valence: Math.random()
    };
  };

  const getBillboardArtist = async () => {
    const mockBillboardArtists = [
      "Taylor Swift", "Drake", "The Weeknd", "Billie Eilish", "Post Malone"
    ];
    
    const selectedArtist = mockBillboardArtists[Math.floor(Math.random() * mockBillboardArtists.length)];
    
    const mockArtistResponse = {
      id: "billboard-artist",
      name: selectedArtist,
      images: [{ url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300" }],
      followers: { total: Math.floor(Math.random() * 50000000) },
      popularity: Math.floor(Math.random() * 20) + 80,
      genres: ["pop", "r&b", "hip hop"]
    };
    
    return mockArtistResponse;
  };

  const calculateResonanceScore = (artist1Features: TrackFeatures, artist2Features: TrackFeatures): number => {
    const weights = {
      danceability: 0.2,
      energy: 0.2,
      acousticness: 0.15,
      instrumentalness: 0.1,
      speechiness: 0.15,
      valence: 0.2
    };
    
    let totalDifference = 0;
    let totalWeight = 0;
    
    for (const [feature, weight] of Object.entries(weights)) {
      if (feature in artist1Features && feature in artist2Features) {
        const featureValue1 = artist1Features[feature as keyof TrackFeatures];
        const featureValue2 = artist2Features[feature as keyof TrackFeatures];
        
        const difference = Math.abs(featureValue1 - featureValue2);
        totalDifference += difference * weight;
        totalWeight += weight;
      }
    }
    
    const normalizedDifference = totalDifference / totalWeight;
    
    const similarityScore = Math.round((1 - normalizedDifference) * 100);
    
    return Math.min(100, Math.max(0, similarityScore));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const { artist: searchedArtist, corrected, originalQuery } = await searchArtist(searchQuery);
      
      const billboardArtist = await getBillboardArtist();
      
      const searchedArtistTopTracks = await getArtistTopTracks(searchedArtist.id);
      const billboardArtistTopTracks = await getArtistTopTracks(billboardArtist.id);
      
      const searchedArtistFeatures = await getTrackFeatures();
      const billboardArtistFeatures = await getTrackFeatures();
      
      const resonanceScore = calculateResonanceScore(searchedArtistFeatures, billboardArtistFeatures);
      
      setComparisonData({
        searchedArtist: {
          artist: searchedArtist,
          features: searchedArtistFeatures,
          topTracks: searchedArtistTopTracks
        },
        comparisonArtist: {
          artist: billboardArtist,
          features: billboardArtistFeatures,
          topTracks: billboardArtistTopTracks
        },
        resonanceScore,
        originalQuery: corrected ? originalQuery : undefined
      });
      
      toast({
        title: "Analysis Complete",
        description: `Successfully compared ${searchedArtist.name} with ${billboardArtist.name}`,
      });
    } catch (error) {
      console.error('Error during artist search:', error);
      toast({
        title: "Error",
        description: "Failed to analyze artist data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = (searchedFeatures: TrackFeatures, comparisonFeatures: TrackFeatures) => {
    if (!searchedFeatures || !comparisonFeatures) return [];

    return [
      {
        name: 'Danceability',
        [comparisonData.searchedArtist?.artist.name || 'Artist']: searchedFeatures.danceability * 100,
        [comparisonData.comparisonArtist?.artist.name || 'Billboard Artist']: comparisonFeatures.danceability * 100,
      },
      {
        name: 'Energy',
        [comparisonData.searchedArtist?.artist.name || 'Artist']: searchedFeatures.energy * 100,
        [comparisonData.comparisonArtist?.artist.name || 'Billboard Artist']: comparisonFeatures.energy * 100,
      },
      {
        name: 'Acousticness',
        [comparisonData.searchedArtist?.artist.name || 'Artist']: searchedFeatures.acousticness * 100,
        [comparisonData.comparisonArtist?.artist.name || 'Billboard Artist']: comparisonFeatures.acousticness * 100,
      },
      {
        name: 'Valence',
        [comparisonData.searchedArtist?.artist.name || 'Artist']: searchedFeatures.valence * 100,
        [comparisonData.comparisonArtist?.artist.name || 'Billboard Artist']: comparisonFeatures.valence * 100,
      },
      {
        name: 'Speechiness',
        [comparisonData.searchedArtist?.artist.name || 'Artist']: searchedFeatures.speechiness * 100,
        [comparisonData.comparisonArtist?.artist.name || 'Billboard Artist']: comparisonFeatures.speechiness * 100,
      }
    ];
  };

  const getResonanceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getResonanceScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional Match';
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Unique Sound';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter an artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </form>

      {isLoading && (
        <div className="text-center py-12 animate-pulse">
          <div className="text-xl font-semibold mb-2">Analyzing artist profile</div>
          <div className="text-muted-foreground">
            Our AI is comparing sound signatures and market data with Billboard artists...
          </div>
        </div>
      )}

      {!isLoading && hasSearched && !comparisonData.searchedArtist && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              We couldn't find any matches for "{searchQuery}". Please try another artist name.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && comparisonData.searchedArtist && comparisonData.comparisonArtist && (
        <div className="space-y-8 animate-fade-in">
          {comparisonData.resonanceScore !== undefined && (
            <Card className="bg-gradient-to-br from-background to-primary/5 border border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Musi$tash Resonance Score
                </CardTitle>
                <CardDescription>
                  How closely {comparisonData.searchedArtist.artist.name}'s sound aligns with {comparisonData.comparisonArtist.artist.name}'s commercial profile
                  {comparisonData.originalQuery && (
                    <span className="block mt-1 text-sm italic">
                      Results shown for "{comparisonData.searchedArtist.artist.name}" instead of "{comparisonData.originalQuery}"
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-center flex-col">
                  <div className={`text-5xl font-bold ${getResonanceScoreColor(comparisonData.resonanceScore)}`}>
                    {comparisonData.resonanceScore}%
                  </div>
                  <div className="text-lg font-medium mt-2 mb-4">
                    {getResonanceScoreLabel(comparisonData.resonanceScore)}
                  </div>
                  <Progress 
                    value={comparisonData.resonanceScore} 
                    className="h-3 w-full max-w-md" 
                  />
                  <p className="mt-6 text-sm text-muted-foreground text-center max-w-md">
                    This score represents how similar the audio profiles are between these two artists, 
                    indicating potential for similar commercial success.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Artist Comparison
              </CardTitle>
              <CardDescription>
                Music profile comparison between {comparisonData.searchedArtist.artist.name} and {comparisonData.comparisonArtist.artist.name} (Billboard Artist)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img 
                        src={comparisonData.searchedArtist.artist.images[0]?.url || "https://images.unsplash.com/photo-1470225457124-a3eb161ffa5f?w=100&h=100&fit=crop"} 
                        alt={comparisonData.searchedArtist.artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{comparisonData.searchedArtist.artist.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{comparisonData.searchedArtist.artist.followers.total.toLocaleString()} followers</Badge>
                        <Badge variant="secondary">Popularity: {comparisonData.searchedArtist.artist.popularity}%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Genres</div>
                    <div className="flex flex-wrap gap-1">
                      {comparisonData.searchedArtist.artist.genres.slice(0, 3).map((genre, idx) => (
                        <Badge key={idx} variant="outline" className="capitalize">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img 
                        src={comparisonData.comparisonArtist.artist.images[0]?.url || "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=100&h=100&fit=crop"} 
                        alt={comparisonData.comparisonArtist.artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{comparisonData.comparisonArtist.artist.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{comparisonData.comparisonArtist.artist.followers.total.toLocaleString()} followers</Badge>
                        <Badge variant="secondary">Popularity: {comparisonData.comparisonArtist.artist.popularity}%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Genres</div>
                    <div className="flex flex-wrap gap-1">
                      {comparisonData.comparisonArtist.artist.genres.slice(0, 3).map((genre, idx) => (
                        <Badge key={idx} variant="outline" className="capitalize">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Musical Features Comparison
              </CardTitle>
              <CardDescription>
                Comparing audio features between the two artists
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="h-80 w-full">
                <ChartContainer 
                  className="h-full w-full" 
                  config={{
                    [comparisonData.searchedArtist.artist.name]: { 
                      color: '#8B5CF6' 
                    },
                    [comparisonData.comparisonArtist.artist.name]: { 
                      color: '#D946EF' 
                    },
                  }}
                >
                  <BarChart
                    data={prepareChartData(
                      comparisonData.searchedArtist.features,
                      comparisonData.comparisonArtist.features
                    )}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey={comparisonData.searchedArtist.artist.name} 
                      fill="#8B5CF6" 
                      name={comparisonData.searchedArtist.artist.name}
                    />
                    <Bar 
                      dataKey={comparisonData.comparisonArtist.artist.name} 
                      fill="#D946EF" 
                      name={comparisonData.comparisonArtist.artist.name}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Popularity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Popularity Score</span>
                    <span className="font-medium">{comparisonData.searchedArtist.artist.popularity}%</span>
                  </div>
                  <Progress value={comparisonData.searchedArtist.artist.popularity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Billboard Artist Score</span>
                    <span className="font-medium">{comparisonData.comparisonArtist.artist.popularity}%</span>
                  </div>
                  <Progress value={comparisonData.comparisonArtist.artist.popularity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Commercial Potential</span>
                    <span className="font-medium">{Math.round((comparisonData.searchedArtist.artist.popularity / comparisonData.comparisonArtist.artist.popularity) * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round((comparisonData.searchedArtist.artist.popularity / comparisonData.comparisonArtist.artist.popularity) * 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListMusic className="h-4 w-4" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-semibold">
                        {(comparisonData.searchedArtist.artist.followers.total / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-semibold">
                        {(comparisonData.comparisonArtist.artist.followers.total / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">Billboard Artist</div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 rounded-md p-3">
                    <p className="text-sm">
                      {comparisonData.searchedArtist.artist.name} has {
                        comparisonData.searchedArtist.artist.followers.total < comparisonData.comparisonArtist.artist.followers.total
                          ? `${((comparisonData.searchedArtist.artist.followers.total / comparisonData.comparisonArtist.artist.followers.total) * 100).toFixed(1)}% of`
                          : `${((comparisonData.searchedArtist.artist.followers.total / comparisonData.comparisonArtist.artist.followers.total)).toFixed(1)}x`
                      } {comparisonData.comparisonArtist.artist.name}'s following, with similar appeal in {
                        comparisonData.searchedArtist.artist.genres.filter(g => 
                          comparisonData.comparisonArtist.artist.genres.includes(g)
                        ).length
                      } shared genres.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc className="h-5 w-5" />
                Investment Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/20 rounded-lg p-5 text-muted-foreground">
                <p>
                  Based on our analysis, {comparisonData.searchedArtist.artist.name} shows a 
                  {comparisonData.searchedArtist.artist.popularity > 70 
                    ? ' strong' 
                    : comparisonData.searchedArtist.artist.popularity > 50 
                      ? ' moderate' 
                      : ' developing'} 
                  market position compared to Billboard chart artist {comparisonData.comparisonArtist.artist.name}.
                </p>
                <p className="mt-3">
                  With {comparisonData.searchedArtist.artist.genres.length} distinct genres and a popularity score of {comparisonData.searchedArtist.artist.popularity}%, 
                  this artist demonstrates 
                  {comparisonData.searchedArtist.artist.popularity > comparisonData.comparisonArtist.artist.popularity * 0.8 
                    ? ' exceptional' 
                    : comparisonData.searchedArtist.artist.popularity > comparisonData.comparisonArtist.artist.popularity * 0.5 
                      ? ' significant' 
                      : ' emerging'} 
                  commercial potential.
                </p>
                <p className="mt-3 font-medium text-foreground">
                  Estimated ROI potential: 
                  {comparisonData.searchedArtist.artist.popularity > 80 
                    ? ' 10-15%' 
                    : comparisonData.searchedArtist.artist.popularity > 60 
                      ? ' 7-10%' 
                      : comparisonData.searchedArtist.artist.popularity > 40 
                        ? ' 5-8%' 
                        : ' 3-6%'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationTool;
