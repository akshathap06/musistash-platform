import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { projects, artists, similarityData } from '@/lib/mockData';
import { Music, Users, Sparkles, BarChart, ArrowRight, TrendingUp, Target, Brain, LineChart } from 'lucide-react';
import spotifyService from '@/services/spotify';
import { SpotifyArtist } from '@/services/spotify/spotifyTypes';
import { API_ENDPOINTS } from '@/config/api';

// Interface for the new regression analysis data
interface RegressionAnalysis {
  musistash_resonance_score: number;
  regression_analysis: {
    resonance_score: number;
    r_squared: number;
    confidence_interval: {
      lower_bound: number;
      upper_bound: number;
      margin_of_error: number;
      confidence_level: string;
    };
    statistical_significance: string;
    variable_importance: Array<{
      variable: string;
      contribution: number;
      percentage_of_total: number;
    }>;
    regression_equation: string;
  };
  success_prediction: {
    success_probability: number;
    success_category: string;
    confidence_score: number;
    key_success_factors: string[];
    risk_factors: string[];
  };
  growth_projections: {
    monthly_projections: Array<{
      month: string;
      projected_score: number;
      confidence: number;
      growth_drivers: string[];
    }>;
    growth_summary: {
      projected_12_month_growth: number;
      peak_growth_period: string;
    };
  };
  genre_resonance_analysis: {
    similarity_percentage: number;
    common_genres: string[];
    artist1_unique_genres: string[];
    artist2_unique_genres: string[];
    related_genres: Array<{
      artist1_genre: string;
      artist2_genre: string;
      relationship: string;
    }>;
    explanation: string;
    genre_compatibility: string;
  };
  methodology: {
    model_type: string;
    r_squared: number;
    statistical_significance: string;
    data_sources: string[];
  };
}

interface AnalysisData {
  artist_comparison: {
    searched: any;
    comparable: any;
  };
  musistash_resonance_analysis: RegressionAnalysis;
}

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState(null);
  const [artistProjects, setArtistProjects] = useState([]);
  const [similarityInfo, setSimilarityInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotifyArtist, setSpotifyArtist] = useState<SpotifyArtist | null>(null);
  const [spotifyImage, setSpotifyImage] = useState('');
  const [regressionAnalysis, setRegressionAnalysis] = useState<RegressionAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch for artist data
    const fetchData = async () => {
      // First get the mock artist data
      const foundArtist = artists.find(a => a.id === id) || artists[0];
      setArtist(foundArtist);
      
      const foundProjects = projects.filter(p => p.artistId === foundArtist.id);
      setArtistProjects(foundProjects);
      
      const foundSimilarity = similarityData.find(s => s.artist === foundArtist.name);
      setSimilarityInfo(foundSimilarity);
      
      // Then fetch real Spotify data for the artist
      try {
        if (foundArtist && foundArtist.name) {
          const spotifyData = await spotifyService.searchArtist(foundArtist.name);
          if (spotifyData) {
            setSpotifyArtist(spotifyData);
            if (spotifyData.images && spotifyData.images.length > 0) {
              setSpotifyImage(spotifyData.images[0].url);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Spotify artist data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Fetch regression analysis data
  const fetchRegressionAnalysis = async () => {
    if (!artist?.name || analysisLoading) return;
    
    setAnalysisLoading(true);
    try {
      console.log('🔍 Fetching regression analysis for:', artist.name);
      const url = API_ENDPOINTS.analyzeArtist(artist.name);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: AnalysisData = await response.json();
      console.log('✅ Regression analysis received:', data.musistash_resonance_analysis);
      setRegressionAnalysis(data.musistash_resonance_analysis);
    } catch (error) {
      console.error('❌ Error fetching regression analysis:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Function to get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to get significance badge color
  const getSignificanceBadge = (significance: string) => {
    const colors = {
      'highly_significant': 'bg-green-100 text-green-800',
      'significant': 'bg-blue-100 text-blue-800',
      'moderately_significant': 'bg-yellow-100 text-yellow-800',
      'limited_significance': 'bg-red-100 text-red-800'
    };
    return colors[significance] || 'bg-gray-100 text-gray-800';
  };
  
  if (isLoading || !artist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading Artist Profile</div>
          <div className="text-muted-foreground">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Artist Header */}
        <div className="bg-primary/5 border-b">
          <div className="container max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Artist Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <img 
                  src={spotifyImage || artist.avatar} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
                  {artist.verified && (
                    <Badge className="h-6">Verified Artist</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {spotifyArtist && spotifyArtist.genres ? (
                    spotifyArtist.genres.slice(0, 4).map((genre, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">{genre}</Badge>
                    ))
                  ) : (
                    artist.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">{genre}</Badge>
                    ))
                  )}
                </div>
                
                <p className="text-muted-foreground max-w-2xl mb-6">{artist.bio}</p>
                
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">
                      {spotifyArtist && spotifyArtist.followers ? 
                        `${spotifyArtist.followers.total.toLocaleString()} Followers` : 
                        `${artist.followers.toLocaleString()} Followers`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{artistProjects.length} Projects</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">
                      {spotifyArtist ? 
                        `${spotifyArtist.popularity}% Popularity` : 
                        `${artist.successRate}% Success Rate`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="outline">Follow</Button>
                <Link to={artistProjects.length > 0 ? `/project/${artistProjects[0].id}` : '#'}>
                  <Button>
                    View Latest Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artist Content */}
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="analytics">MusiStash Analysis</TabsTrigger>
            </TabsList>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">{artist.name}'s Projects</h2>
              
              {artistProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {artistProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-medium mb-2">No active projects</div>
                    <p className="text-muted-foreground mb-4">
                      This artist doesn't have any active funding projects at the moment.
                    </p>
                    <Link to="/projects">
                      <Button variant="outline">
                        Browse Other Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* About Tab */}
            <TabsContent value="about" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Artist Biography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {artist.bio}
                      </p>
                      <p className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="text-muted-foreground">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Musical Style & Influences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {artist.name}'s music blends traditional elements of {
                          spotifyArtist && spotifyArtist.genres ? 
                            spotifyArtist.genres.slice(0, 2).join(' and ') : 
                            artist.genres.join(' and ')
                        } with innovative production techniques. Their sound is characterized by emotional depth
                        and meticulous attention to sonic detail.
                      </p>
                      <p className="text-muted-foreground">
                        Key influences include pioneering artists in the {
                          spotifyArtist && spotifyArtist.genres ? 
                            spotifyArtist.genres[0] : 
                            artist.genres[0]
                        } scene, as well as
                        classic songwriters from various eras. This combination creates a fresh yet familiar
                        sound that resonates with diverse audiences.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2023</div>
                          <div>
                            <div className="font-medium">Released 'Reflections' EP</div>
                            <p className="text-sm text-muted-foreground">
                              Reached top 50 on streaming charts
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2022</div>
                          <div>
                            <div className="font-medium">Collaborated with top producers</div>
                            <p className="text-sm text-muted-foreground">
                              Worked with industry veterans
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2021</div>
                          <div>
                            <div className="font-medium">Debut single release</div>
                            <p className="text-sm text-muted-foreground">
                              First major industry recognition
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                          </svg>
                          YouTube
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.5 8.5c0-1.933-1.566-3.5-3.5-3.5s-3.5 1.567-3.5 3.5c0 1.31.724 2.45 1.792 3.051-.022 1.146-.348 3.265-2.444 4.445-.145.066-.148.19.008.246 2.904 1.024 4.395-1.678 4.644-2.472.21.016.435.03.651.03 1.934 0 3.5-1.567 3.5-3.5"/>
                          </svg>
                          Spotify
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                          </svg>
                          Instagram
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Analytics Tab - NEW REGRESSION ANALYSIS */}
            <TabsContent value="analytics" className="animate-fade-in">
              {!regressionAnalysis && !analysisLoading && (
                <div className="mb-6">
                  <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                    <CardContent className="p-6 text-center">
                      <Brain className="h-12 w-12 mx-auto mb-3 text-primary" />
                      <h3 className="text-lg font-semibold mb-2">Advanced MusiStash Analysis</h3>
                      <p className="text-muted-foreground mb-4">
                        Get detailed regression-based insights powered by AI and real music industry data
                      </p>
                      <Button onClick={fetchRegressionAnalysis} className="bg-primary hover:bg-primary/90">
                        Analyze {artist.name}
                        <TrendingUp className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {analysisLoading && (
                <div className="text-center py-12">
                  <div className="animate-pulse space-y-4">
                    <Brain className="h-16 w-16 mx-auto text-primary/60 animate-spin" />
                    <div className="text-xl font-semibold">Analyzing {artist.name}</div>
                    <div className="text-muted-foreground">Running regression analysis on music industry data...</div>
                  </div>
                </div>
              )}

              {regressionAnalysis && (
                <div className="space-y-8">
                  {/* Main MusiStash Resonance Score */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">MusiStash Resonance Score</h2>
                    <div className="text-6xl font-bold mb-2">
                      <span className={getScoreColor(regressionAnalysis.musistash_resonance_score)}>
                        {regressionAnalysis.musistash_resonance_score}
                      </span>
                      <span className="text-3xl text-muted-foreground">/100</span>
                    </div>
                    <Badge className={getSignificanceBadge(regressionAnalysis.methodology.statistical_significance)}>
                      {regressionAnalysis.methodology.statistical_significance.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Statistical Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Regression Model Stats */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <LineChart className="h-5 w-5 mr-2" />
                            Statistical Model Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {(regressionAnalysis.regression_analysis.r_squared * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">R-Squared</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {regressionAnalysis.regression_analysis.confidence_interval.confidence_level}
                              </div>
                              <div className="text-sm text-muted-foreground">Confidence</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                ±{regressionAnalysis.regression_analysis.confidence_interval.margin_of_error}
                              </div>
                              <div className="text-sm text-muted-foreground">Margin</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Regression Equation</h4>
                            <p className="text-sm font-mono bg-gray-50 p-3 rounded">
                              {regressionAnalysis.regression_analysis.regression_equation}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Confidence Interval</h4>
                            <p className="text-sm text-muted-foreground">
                              Score range: {regressionAnalysis.regression_analysis.confidence_interval.lower_bound} - {regressionAnalysis.regression_analysis.confidence_interval.upper_bound} 
                              ({regressionAnalysis.regression_analysis.confidence_interval.confidence_level} confidence level)
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Variable Importance */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Key Success Drivers
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {regressionAnalysis.regression_analysis.variable_importance.slice(0, 5).map((variable, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium capitalize">
                                    {variable.variable.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-sm font-bold">
                                    {variable.percentage_of_total}%
                                  </span>
                                </div>
                                <Progress value={variable.percentage_of_total} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  Contribution: {variable.contribution > 0 ? '+' : ''}{variable.contribution.toFixed(2)} points
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Enhanced Genre Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Music className="h-5 w-5 mr-2" />
                            Genre Compatibility Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              <span className={getScoreColor(regressionAnalysis.genre_resonance_analysis.similarity_percentage)}>
                                {regressionAnalysis.genre_resonance_analysis.similarity_percentage}%
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {regressionAnalysis.genre_resonance_analysis.genre_compatibility} Compatibility
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            {regressionAnalysis.genre_resonance_analysis.common_genres.length > 0 && (
                              <div>
                                <h4 className="font-medium text-green-600 mb-2">Common Genres</h4>
                                <div className="flex flex-wrap gap-2">
                                  {regressionAnalysis.genre_resonance_analysis.common_genres.map((genre, index) => (
                                    <Badge key={index} className="bg-green-100 text-green-800">{genre}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {regressionAnalysis.genre_resonance_analysis.related_genres.length > 0 && (
                              <div>
                                <h4 className="font-medium text-blue-600 mb-2">Related Connections</h4>
                                <div className="space-y-2">
                                  {regressionAnalysis.genre_resonance_analysis.related_genres.slice(0, 3).map((connection, index) => (
                                    <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                                      <span className="font-medium">{connection.artist1_genre}</span> ↔ <span className="font-medium">{connection.artist2_genre}</span>
                                      <span className="text-muted-foreground ml-2">({connection.relationship})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                              {regressionAnalysis.genre_resonance_analysis.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Success Prediction & Growth */}
                    <div className="space-y-6">
                      {/* Success Prediction */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Success Prediction
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">
                              <span className={getScoreColor(regressionAnalysis.success_prediction.success_probability)}>
                                {regressionAnalysis.success_prediction.success_probability}%
                              </span>
                            </div>
                            <Badge variant="outline" className="mb-2">
                              {regressionAnalysis.success_prediction.success_category.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Confidence: {regressionAnalysis.success_prediction.confidence_score}%
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-green-600 mb-2">Success Factors</h4>
                            <ul className="space-y-1">
                              {regressionAnalysis.success_prediction.key_success_factors.map((factor, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-600 mb-2">Risk Factors</h4>
                            <ul className="space-y-1">
                              {regressionAnalysis.success_prediction.risk_factors.map((risk, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <span className="text-red-500 mr-2">⚠</span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Growth Projections */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Growth Projections
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">
                              <span className={getScoreColor(regressionAnalysis.growth_projections.growth_summary.projected_12_month_growth)}>
                                +{regressionAnalysis.growth_projections.growth_summary.projected_12_month_growth}%
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">12-Month Growth</div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Peak Growth Period</h4>
                            <Badge className="bg-purple-100 text-purple-800">
                              {regressionAnalysis.growth_projections.growth_summary.peak_growth_period}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Growth Trajectory</h4>
                            <div className="space-y-2">
                              {regressionAnalysis.growth_projections.monthly_projections.slice(0, 6).map((month, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span>{month.month}</span>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-2">{month.projected_score}</span>
                                    <span className="text-muted-foreground">({month.confidence}%)</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Data Sources */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart className="h-5 w-5 mr-2" />
                            Analysis Sources
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {regressionAnalysis.methodology.data_sources.map((source, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                {source}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Model: {regressionAnalysis.methodology.model_type}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistProfile;
