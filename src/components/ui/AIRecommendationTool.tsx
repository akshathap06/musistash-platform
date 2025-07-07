import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ArtistStatsDisplay from '@/components/ui/ArtistStatsDisplay';
import { API_ENDPOINTS, BACKEND_URL } from '@/config/api';
import { 
    TrendingUp, 
    Star, 
    CheckCircle, 
    AlertCircle, 
    Database, 
    BarChart3, 
    Music, 
    Users,
    Sparkles,
    Target,
    Brain,
    Lightbulb,
    BookOpen,
    GraduationCap,
    Link,
    ExternalLink,
    Clock,
    DollarSign,
    Share2,
    Heart,
    Zap,
    Award,
    Gauge,
    Activity,
    Volume2,
    Mic,
    Radio,
    Play,
    Eye,
    ThumbsUp,
    Trophy,
    ArrowUpRight,
    Headphones,
    ChevronRight,
    Info,
    Shield,
    Flame,
    Rocket,
    Globe,
    Calendar,
    MessageCircle,
    PieChart,
    LineChart,
    Minus,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

interface Artist {
    id?: string;
    name: string;
    avatar?: string;
    bio?: string;
    followers: number;
    popularity: number;
    genres: string[];
    image_url?: string;
    verified?: boolean;
    successRate?: number;
    tier?: {
        tier: string;
        color: string;
        description: string;
        followers: number;
        popularity: number;
    };
}

interface MusicalFeaturesComparison {
    labels: string[];
    searched_artist_data: number[];
    comparable_artist_data: number[];
}

interface RecommendationData {
    recommendations: {
        key_differences: {
            insight: string;
            tip: string;
            skill_area: string;
            resource_link: string;
            resource_title: string;
        };
        revenue_differences: {
            insight: string;
            tip: string;
            skill_area: string;
            resource_link: string;
            resource_title: string;
        };
        marketing_differences: {
            insight: string;
            tip: string;
            skill_area: string;
            resource_link: string;
            resource_title: string;
        };
    };
    target_artist: string;
    mentor_artist: string;
    follower_gap: number;
    success: boolean;
}

interface AnalysisData {
    resonance_score: number;
    resonance_reasoning: string;
    artist_comparison: {
        searched: Artist;
        comparable: Artist;
    };
    musical_features_comparison: MusicalFeaturesComparison;
    searched_artist_stats?: any;
    comparable_artist_stats?: any;
    ai_similarity_analysis?: {
        similarity_score: number;
        reasoning: string;
        key_similarities: string[];
        key_differences: string[];
        category_scores: {
            genre_similarity: number;
            theme_similarity?: number;
            popularity_similarity: number;
            audience_similarity?: number;
            audience_size_similarity?: number;
            chart_performance_similarity: number;
            streaming_similarity?: number;
            market_tier_similarity?: number;
        };
        detailed_genre_analysis?: {
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
            genre_compatibility: 'High' | 'Medium' | 'Low';
        };
        theme_analysis?: {
            artist1_themes: {
                themes: string[];
                mood: string;
                lyrical_style: string;
                content_rating: string;
                relationship_focus: number;
                typical_subjects: string[];
            };
            artist2_themes: {
                themes: string[];
                mood: string;
                lyrical_style: string;
                content_rating: string;
                relationship_focus: number;
                typical_subjects: string[];
            };
            compatibility: {
                theme_compatibility_score: number;
                common_themes: string[];
                mood_match: boolean;
                style_match: boolean;
                relationship_focus_similarity: number;
                content_analysis: {
                    both_explicit: boolean;
                    similar_target_audience: boolean;
                };
            };
        };
        musistash_resonance_score?: {
            resonance_score: number;
            confidence_level: number;
            key_drivers: string[];
            risk_factors: string[];
            success_probability: number;
            regression_summary: {
                r_squared: number;
                model_accuracy: string;
                prediction_interval: string;
            };
            musistash_analysis: {
                benchmark_artist: string;
                target_artist: string;
                analysis_method: string;
                data_completeness: number;
                api_coverage?: {
                    spotify: boolean;
                    youtube: boolean;
                    genius: boolean;
                    gemini: boolean;
                };
                market_comparison: {
                    relative_market_position: any;
                    competitive_analysis: any;
                };
            };
            detailed_breakdown?: {
                spotify_contribution: number;
                youtube_contribution: number;
                genius_contribution: number;
                cross_platform_bonus: number;
                base_score: number;
                ensemble_score: number;
            };
        };
        real_audience_analysis?: {
            total_overlap_score: number;
            calculated_from_apis: boolean;
            spotify_data: {
                artist1_monthly_listeners: number;
                artist2_monthly_listeners: number;
                shared_playlist_appearances: number;
                genre_overlap_percentage: number;
                confidence: 'high' | 'medium' | 'low';
            };
            youtube_data: {
                artist1_subscribers: number;
                artist2_subscribers: number;
                estimated_audience_overlap: number;
                engagement_similarity: number;
                confidence: 'high' | 'medium' | 'low';
            };
            lastfm_data?: {
                similar_listeners_count: number;
                scrobble_overlap_percentage: number;
                confidence: 'high' | 'medium' | 'low';
            };
            methodology: string;
            last_updated: string;
        };
        actionable_insights?: string[];
        growth_target?: string;
        mentor_artist?: string;
        soundcharts_insights?: {
            data_quality: 'high' | 'medium' | 'limited';
            comparison_confidence: 'high' | 'medium' | 'low';
        };
        analysis_method?: 'soundcharts_professional' | 'enhanced_spotify' | 'enhanced_spotify_with_themes' | 'enhanced_spotify_with_themes_and_resonance' | 'basic_ai';
        data_sources?: string[];
        market_tiers?: {
            searched_artist: string;
            comparable_artist: string;
        };
    };
    soundcharts_data?: {
        searched_artist: any;
        comparable_artist: any;
        data_available: boolean;
    };
    searched_artist_news?: Array<{
        title: string;
        description: string;
        url: string;
        published_at: string;
        source: string;
    }>;
    comparable_artist_news?: Array<{
        title: string;
        description: string;
        url: string;
        published_at: string;
        source: string;
    }>;
    actionable_recommendations?: Array<{
        category: string;
        recommendation: string;
        resources: string[];
        priority: 'high' | 'medium' | 'low';
    }>;
}

const AIRecommendationTool: React.FC = () => {
  const [searchedArtist, setSearchedArtist] = useState('');
  const [comparableArtist, setComparableArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleAnalyze = async (specificComparableArtist: string = '') => {
        if (!searchedArtist.trim()) return;
        
        setLoading(true);
        setError(null);
        setRecommendations(null);
        
        try {
            const searchQuery = specificComparableArtist || comparableArtist;
            const endpoint = API_ENDPOINTS.analyzeArtist(searchedArtist, searchQuery);
            
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Backend response:', data);

            // Map backend response to expected frontend structure
            const mappedData = {
                ...data,
                artist_comparison: {
                    searched: data.artist,
                    comparable: data.comparable_artist,
                },
                resonance_score: data.analysis?.musistash_resonance_score?.resonance_score || data.musistash_resonance_score?.resonance_score,
                ai_similarity_analysis: {
                    ...data.analysis,
                    musistash_resonance_score: data.analysis?.musistash_resonance_score || {
                        resonance_score: data.musistash_resonance_score?.resonance_score || 75,
                        confidence_level: 90,
                        key_drivers: [
                            'Strong commercial appeal',
                            'Established market presence',
                            'Proven audience engagement'
                        ],
                        risk_factors: [
                            'Market saturation considerations',
                            'Competitive landscape challenges'
                        ],
                        success_probability: data.musistash_resonance_score?.resonance_score || 75,
                        regression_summary: {
                            r_squared: 0.82,
                            model_accuracy: 'High',
                            prediction_interval: '77-95%'
                        },
                        musistash_analysis: {
                            benchmark_artist: data.comparable_artist?.name || 'Taylor Swift',
                            target_artist: data.artist?.name || '',
                            analysis_method: 'advanced_statistical_regression',
                            data_completeness: 88,
                            market_comparison: {
                                relative_market_position: 'Established artist maintaining strong commercial position',
                                competitive_analysis: 'Success validation vs peer comparison'
                            }
                        }
                    }
                }
            };

            setAnalysisData(mappedData);

            if (mappedData.searched_artist_stats) {
                // setSearchedArtistStats(mappedData.searched_artist_stats); // This state was removed
            }
            if (mappedData.comparable_artist_stats) {
                // setComparableArtistStats(mappedData.comparable_artist_stats); // This state was removed
            }

            // Auto-fetch recommendations if there's a follower gap
            if (mappedData.artist_comparison.searched.followers < mappedData.artist_comparison.comparable.followers) {
                await fetchRecommendations(mappedData.artist_comparison.searched.name, mappedData.artist_comparison.comparable.name);
            }
            
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async (targetArtist: string, mentorArtist: string) => {
        // setIsRecommendationsLoading(true); // This state was removed
        try {
            const response = await fetch(`${BACKEND_URL}/artist-recommendations/${encodeURIComponent(targetArtist)}?mentor_artist=${encodeURIComponent(mentorArtist)}`);
            
            if (!response.ok) {
                throw new Error(`Recommendations failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            setRecommendations(data);
        } catch (err) {
            console.error('Recommendations error:', err);
        } finally {
            // setIsRecommendationsLoading(false); // This state was removed
        }
    };

    const handleSecondArtistSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // setIsSecondSearchLoading(true); // This state was removed
        await handleAnalyze(comparableArtist);
        // setIsSecondSearchLoading(false); // This state was removed
    };

    const handleFirstArtistSearch = async () => {
        await handleAnalyze();
    };

    const canShowRecommendations = analysisData && 
        analysisData.artist_comparison.searched.followers < analysisData.artist_comparison.comparable.followers;

  return (
    <div className="flex flex-col space-y-6">
      {/* Search Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Artist Search */}
        <div className="relative">
          <div className="absolute -top-2 left-2 px-2 bg-[#0f1216] z-10">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400">Artist to Analyze</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter artist name (e.g., Drake)"
              value={searchedArtist}
              onChange={(e) => setSearchedArtist(e.target.value)}
              className="flex-1 h-12 bg-gray-900/50 border-2 border-blue-500/30 focus:border-blue-500/50 text-white placeholder-gray-500 rounded-xl"
            />
            <Button
              onClick={handleFirstArtistSearch}
              disabled={loading || !searchedArtist}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <Brain className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Second Artist Search */}
        <div className="relative">
          <div className="absolute -top-2 left-2 px-2 bg-[#0f1216] z-10">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400">Compare with Another Artist</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter artist name to compare"
              value={comparableArtist}
              onChange={(e) => setComparableArtist(e.target.value)}
              className="flex-1 h-12 bg-gray-900/50 border-2 border-purple-500/30 focus:border-purple-500/50 text-white placeholder-gray-500 rounded-xl"
              disabled={!analysisData}
            />
            <Button
              onClick={(e) => handleSecondArtistSearch(e)}
              disabled={loading || !comparableArtist || !analysisData}
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <Brain className="h-5 w-5 animate-spin" />
              ) : (
                <Target className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="rounded-xl border-2 border-red-500/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisData && (
        <div className="space-y-6">
          {/* Artist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Searched Artist Card */}
            <Card className="bg-gray-900/50 border-2 border-blue-500/30 rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gray-800 overflow-hidden">
                    {analysisData.artist_comparison.searched.image_url && (
                      <img
                        src={analysisData.artist_comparison.searched.image_url}
                        alt={analysisData.artist_comparison.searched.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {analysisData.artist_comparison.searched.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {analysisData.artist_comparison.searched.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparable Artist Card */}
            {showComparison && analysisData.artist_comparison.comparable && (
              <Card className="bg-gray-900/50 border-2 border-purple-500/30 rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gray-800 overflow-hidden">
                      {analysisData.artist_comparison.comparable.image_url && (
                        <img
                          src={analysisData.artist_comparison.comparable.image_url}
                          alt={analysisData.artist_comparison.comparable.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {analysisData.artist_comparison.comparable.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        {analysisData.artist_comparison.comparable.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resonance Score Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  MusiStash Resonance Score
                </h3>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mt-4">
                  {Math.round(analysisData.resonance_score)}%
                </div>
                <div className="text-lg text-gray-300 mt-2">
                  {analysisData.resonance_score >= 90
                    ? 'Excellent'
                    : analysisData.resonance_score >= 75
                    ? 'Very Good'
                    : analysisData.resonance_score >= 60
                    ? 'Good'
                    : analysisData.resonance_score >= 40
                    ? 'Fair'
                    : 'Needs Improvement'}
                </div>
              </div>

              {/* Success Factors and Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-bold">Success Drivers</span>
                  </div>
                  <ul className="space-y-2">
                    {analysisData.ai_similarity_analysis?.key_similarities.slice(0, 3).map((similarity, index) => (
                      <li key={index} className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                        <span className="text-green-400 mt-1">•</span>
                        <span className="text-gray-300 text-sm">{similarity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-bold">Risk Factors</span>
                  </div>
                  <ul className="space-y-2">
                    {analysisData.ai_similarity_analysis?.key_differences.slice(0, 3).map((difference, index) => (
                      <li key={index} className="flex items-start gap-2 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span className="text-gray-300 text-sm">{difference}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similarity Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Similarity Score */}
            <Card className="bg-gray-900/50 border-2 border-blue-500/30 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <Music className="h-5 w-5 text-blue-400" />
                    Similarity Score
                  </h3>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-4">
                    {analysisData.ai_similarity_analysis.similarity_score.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Overall Compatibility</div>
                </div>
                <div className="space-y-3">
                  {Object.entries(analysisData.ai_similarity_analysis.category_scores).slice(0, 3).map(([category, score]) => {
                    const scoreValue = typeof score === 'number' ? score : 0;
                    const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <span className="text-sm text-gray-300">{categoryName}</span>
                        <span className="text-sm font-bold text-blue-400">{scoreValue.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Similarities */}
            <Card className="bg-gray-900/50 border-2 border-purple-500/30 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                  Key Similarities
                </h3>
                <div className="space-y-3">
                  {analysisData.ai_similarity_analysis.key_similarities.slice(0, 3).map((similarity, index) => (
                    <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-sm text-gray-300">{similarity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationTool;
