import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ArtistStatsDisplay from '@/components/ui/ArtistStatsDisplay';
import { API_ENDPOINTS } from '@/config/api';
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
    Brain
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
                market_comparison: {
                    relative_market_position: any;
                    competitive_analysis: any;
                };
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
}

const AIRecommendationTool: React.FC = () => {
    const [artistName, setArtistName] = useState('');
    const [comparableArtistName, setComparableArtistName] = useState('');
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSecondSearchLoading, setIsSecondSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedArtistStats, setSearchedArtistStats] = useState<any>(null);
    const [comparableArtistStats, setComparableArtistStats] = useState<any>(null);

    const handleAnalyze = async (specificComparableArtist: string = '') => {
        if (!artistName.trim()) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const searchQuery = specificComparableArtist || comparableArtistName;
            const endpoint = API_ENDPOINTS.analyzeArtist(artistName, searchQuery);
            
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            setAnalysis(data);
            
            if (data.searched_artist_stats) {
                setSearchedArtistStats(data.searched_artist_stats);
            }
            if (data.comparable_artist_stats) {
                setComparableArtistStats(data.comparable_artist_stats);
            }
            
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSecondArtistSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSecondSearchLoading(true);
        await handleAnalyze(comparableArtistName);
        setIsSecondSearchLoading(false);
    };

    const handleFirstArtistSearch = async () => {
        await handleAnalyze();
    };

    return (
        <div className={`transition-all duration-500 ${analysis ? 'min-h-screen bg-[#0f1216]' : 'bg-[#0f1216]'}`}>
            <div className={`container mx-auto px-6 max-w-7xl transition-all duration-500 ${analysis ? 'py-12' : 'py-8'}`}>
                {/* Dynamic Hero Section - Compact when no data, expanded when data loaded */}
                <div className={`text-center transition-all duration-500 ${analysis ? 'mb-16' : 'mb-8'}`}>
                    <div className={`transition-all duration-500 ${analysis ? 'mb-8' : 'mb-6'}`}>
                        <h1 className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500 ${analysis ? 'text-6xl mb-6' : 'text-5xl md:text-6xl mb-4'}`}>
                            AI Artist Analysis & Investment Intelligence
                        </h1>
                        <p className={`text-white/80 mx-auto leading-relaxed transition-all duration-500 ${analysis ? 'text-xl max-w-3xl' : 'text-lg max-w-2xl'}`}>
                            Compare artists using advanced AI, predict commercial success, and discover investment opportunities with our comprehensive analysis platform
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className={`mx-auto transition-all duration-500 ${analysis ? 'max-w-4xl' : 'max-w-3xl'}`}>
                        <div className={`grid gap-6 transition-all duration-500 ${analysis ? 'grid-cols-1 md:grid-cols-2 mb-8' : 'grid-cols-1 md:grid-cols-2 mb-6'}`}>
                            {/* Primary Search */}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader className={`transition-all duration-300 ${analysis ? 'pb-4' : 'pb-3'}`}>
                                    <CardTitle className={`font-semibold text-gray-800 flex items-center gap-2 transition-all duration-300 ${analysis ? 'text-lg' : 'text-base'}`}>
                                        <Target className={`text-blue-600 transition-all duration-300 ${analysis ? 'h-5 w-5' : 'h-4 w-4'}`} />
                                        Artist to Analyze
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={`transition-all duration-300 ${analysis ? 'space-y-4' : 'space-y-3'}`}>
                                    <Input
                                        type="text"
                                        placeholder="Enter artist name (e.g., Drake, Taylor Swift)"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                        className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${analysis ? 'text-lg py-3' : 'text-base py-2'}`}
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        onClick={handleFirstArtistSearch}
                                        disabled={isLoading || !artistName.trim()}
                                        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform transition-all duration-200 hover:scale-105 ${analysis ? 'py-3 text-lg' : 'py-2 text-base'}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Brain className={`mr-2 animate-spin transition-all duration-300 ${analysis ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className={`mr-2 transition-all duration-300 ${analysis ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                                Analyze Artist
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Comparison Search */}
                            <Card className={`transition-all duration-500 ${analysis ? 'bg-white/80 backdrop-blur-sm border-0 shadow-lg' : 'bg-gray-50/50 border-dashed border-2 border-gray-300'}`}>
                                <CardHeader className={`transition-all duration-300 ${analysis ? 'pb-4' : 'pb-3'}`}>
                                    <CardTitle className={`font-semibold flex items-center gap-2 transition-all duration-300 ${analysis ? 'text-lg text-gray-800' : 'text-base text-gray-400'}`}>
                                        <Users className={`text-green-600 transition-all duration-300 ${analysis ? 'h-5 w-5' : 'h-4 w-4'}`} />
                                        Compare with Another Artist
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={`transition-all duration-300 ${analysis ? 'space-y-4' : 'space-y-3'}`}>
                                    <Input
                                        type="text"
                                        placeholder={analysis ? "Enter another artist for comparison" : "Analyze an artist first"}
                                        value={comparableArtistName}
                                        onChange={(e) => setComparableArtistName(e.target.value)}
                                        className={`border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 ${analysis ? 'text-lg py-3' : 'text-base py-2'}`}
                                        disabled={!analysis || isSecondSearchLoading}
                                    />
                                    <Button 
                                        onClick={handleSecondArtistSearch}
                                        disabled={!analysis || isSecondSearchLoading || !comparableArtistName.trim()}
                                        variant="outline"
                                        className={`w-full border-green-500 text-green-600 hover:bg-green-50 shadow-lg transform transition-all duration-200 hover:scale-105 ${analysis ? 'py-3 text-lg' : 'py-2 text-base'}`}
                                    >
                                        {isSecondSearchLoading ? (
                                            <>
                                                <Brain className={`mr-2 animate-spin transition-all duration-300 ${analysis ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                                Comparing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className={`mr-2 transition-all duration-300 ${analysis ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                                Compare Artists
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert className="max-w-4xl mx-auto mb-8 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Analysis Results */}
                {analysis && (
                    <div className="space-y-8 animate-fade-in"
                         style={{
                             animation: 'fadeInUp 0.6s ease-out forwards',
                             opacity: 0,
                             transform: 'translateY(20px)'
                         }}
                         onAnimationEnd={(e) => {
                             if (e.animationName === 'fadeInUp') {
                                 e.currentTarget.style.opacity = '1';
                                 e.currentTarget.style.transform = 'translateY(0)';
                             }
                         }}
                    >
                        {/* Artist Comparison Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={analysis.artist_comparison.searched.avatar || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.searched.name} 
                                            className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-blue-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{analysis.artist_comparison.searched.name}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users className="h-4 w-4" />
                                                    <span className="font-semibold">{analysis.artist_comparison.searched.followers?.toLocaleString() || 'N/A'}</span>
                                                    <span>followers</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="font-semibold">{analysis.artist_comparison.searched.popularity || 'N/A'}</span>
                                                    <span>popularity score</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {(analysis.artist_comparison.searched.genres || []).slice(0, 3).map((genre, index) => (
                                                        <Badge key={index} className="bg-blue-200 text-blue-800 border-0">
                                                            {genre}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={analysis.artist_comparison.comparable.avatar || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.comparable.name} 
                                            className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-green-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{analysis.artist_comparison.comparable.name}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users className="h-4 w-4" />
                                                    <span className="font-semibold">{analysis.artist_comparison.comparable.followers?.toLocaleString() || 'N/A'}</span>
                                                    <span>followers</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="font-semibold">{analysis.artist_comparison.comparable.popularity || 'N/A'}</span>
                                                    <span>popularity score</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {(analysis.artist_comparison.comparable.genres || []).slice(0, 3).map((genre, index) => (
                                                        <Badge key={index} className="bg-green-200 text-green-800 border-0">
                                                            {genre}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Compact MusiStash Resonance Score */}
                        {analysis.ai_similarity_analysis?.musistash_resonance_score && (
                            <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 border-0 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-indigo-600/20"></div>
                                    <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
                                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-400/20 rounded-full translate-x-20 translate-y-20 blur-3xl"></div>
                                </div>
                                <CardContent className="relative z-10 p-6">
                                    {/* Compact Header with Side-by-Side Layout */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                        {/* Score Display - Compact */}
                                        <div className="text-center lg:text-left">
                                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                                    <Star className="h-6 w-6 text-yellow-300" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-white">MusiStash Resonance Score</h2>
                                                    <p className="text-purple-100 text-sm">Commercial Success Prediction</p>
                                                </div>
                                            </div>
                                            
                                            {/* Enhanced Progress Bar Score - Main Highlight */}
                                            <div className="w-full">
                                                {/* Large Score Display */}
                                                <div className="text-center mb-4">
                                                    <div className="text-5xl font-black text-white mb-2">
                                                        {analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score}%
                                                    </div>
                                                    <div className="text-purple-200 text-lg font-medium">
                                                        {analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 80 ? 'Excellent' :
                                                         analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 60 ? 'Good' :
                                                         analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 40 ? 'Moderate' : 'Challenging'}
                                                    </div>
                                                </div>
                                                
                                                {/* Animated Progress Bar */}
                                                <div className="relative mb-4">
                                                    <div className="w-full bg-white/20 rounded-full h-4 backdrop-blur-sm shadow-inner">
                                                        <div 
                                                            className="h-4 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-green-400 transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                                                            style={{ width: `${analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score}%` }}
                                                        >
                                                            {/* Animated shine effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                                        </div>
                                                    </div>
                                                    {/* Progress indicators */}
                                                    <div className="flex justify-between text-xs text-purple-200 mt-2">
                                                        <span>0%</span>
                                                        <span className="text-white font-semibold">{analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score}%</span>
                                                        <span>100%</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Confidence Badge */}
                                                <div className="text-center">
                                                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-2">
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        {analysis.ai_similarity_analysis.musistash_resonance_score.confidence_level}% Confidence
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Compact Metrics Grid - 2x2 */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                                                <TrendingUp className="h-4 w-4 text-yellow-300 mx-auto mb-1" />
                                                <div className="text-lg font-bold text-white">{analysis.ai_similarity_analysis.musistash_resonance_score.success_probability}%</div>
                                                <div className="text-xs text-purple-100">Success Rate</div>
                                                <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full transition-all duration-1000 ease-out"
                                                         style={{ width: `${analysis.ai_similarity_analysis.musistash_resonance_score.success_probability}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                                                <CheckCircle className="h-4 w-4 text-green-300 mx-auto mb-1" />
                                                <div className="text-sm font-bold text-white">High R²=0.82</div>
                                                <div className="text-xs text-purple-100">Model Quality</div>
                                                <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                                                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-1 rounded-full w-[82%] transition-all duration-1000 ease-out"></div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                                                <Database className="h-4 w-4 text-blue-300 mx-auto mb-1" />
                                                <div className="text-lg font-bold text-white">{Math.round(analysis.ai_similarity_analysis.musistash_resonance_score.musistash_analysis.data_completeness)}%</div>
                                                <div className="text-xs text-purple-100">Data Quality</div>
                                                <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                                                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-1000 ease-out"
                                                         style={{ width: `${Math.round(analysis.ai_similarity_analysis.musistash_resonance_score.musistash_analysis.data_completeness)}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                                                <BarChart3 className="h-4 w-4 text-pink-300 mx-auto mb-1" />
                                                <div className="text-lg font-bold text-white">{analysis.ai_similarity_analysis.musistash_resonance_score.regression_summary.r_squared}</div>
                                                <div className="text-xs text-purple-100">R² Score</div>
                                                <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                                                    <div className="bg-gradient-to-r from-pink-400 to-red-400 h-1 rounded-full w-[82%] transition-all duration-1000 ease-out"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Compact Insights */}
                                        <div className="space-y-4">
                                            {/* Success Drivers - Compact */}
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="p-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg">
                                                        <TrendingUp className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white">Success Drivers</h3>
                                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                                        {analysis.ai_similarity_analysis.musistash_resonance_score.key_drivers.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {analysis.ai_similarity_analysis.musistash_resonance_score.key_drivers.slice(0, 2).map((driver, index) => (
                                                        <div key={index} className="flex items-start gap-2 text-sm">
                                                            <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xs mt-0.5">
                                                                {index + 1}
                                                            </div>
                                                            <span className="text-purple-100 leading-tight">{driver}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Risk Factors - Compact */}
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="p-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg">
                                                        <AlertCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white">Risk Factors</h3>
                                                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                                        {analysis.ai_similarity_analysis.musistash_resonance_score.risk_factors.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {analysis.ai_similarity_analysis.musistash_resonance_score.risk_factors.slice(0, 2).map((risk, index) => (
                                                        <div key={index} className="flex items-start gap-2 text-sm">
                                                            <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-xs mt-0.5">
                                                                !
                                                            </div>
                                                            <span className="text-purple-100 leading-tight">{risk}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Compact Statistical Summary */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <h4 className="text-lg font-bold text-white mb-3 text-center">Analysis Summary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                            <div className="text-center">
                                                <div className="text-purple-200 font-semibold">Target Artist</div>
                                                <div className="text-white">{analysis.ai_similarity_analysis.musistash_resonance_score.musistash_analysis.target_artist}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-purple-200 font-semibold">Method</div>
                                                <div className="text-white">Advanced Statistical Regression</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-purple-200 font-semibold">Prediction Range</div>
                                                <div className="text-white">{analysis.ai_similarity_analysis.musistash_resonance_score.regression_summary.prediction_interval}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* AI Similarity Analysis */}
                        {analysis.ai_similarity_analysis && (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Main Score Card */}
                                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl">
                                    <CardContent className="p-6 text-center">
                                        <div className="mb-6">
                                            <Music className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Similarity Score</h2>
                                            <div className="text-6xl font-bold text-blue-600 mb-2">
                                                {analysis.ai_similarity_analysis.similarity_score}%
                                            </div>
                                            <p className="text-gray-600 mb-4">Overall Compatibility</p>
                                            
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                                <Brain className="h-3 w-3 mr-1" />
                                                AI Enhanced Analysis
                                            </Badge>
                                        </div>
                                        
                                        {/* Quick Scores */}
                                        <div className="space-y-3">
                                            {Object.entries(analysis.ai_similarity_analysis.category_scores).slice(0, 4).map(([category, score]) => {
                                                const scoreValue = typeof score === 'number' ? score : 0;
                                                const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                                
                                                return (
                                                    <div key={category} className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                                                        <span className="text-gray-700 text-sm font-medium">{categoryName}</span>
                                                        <span className="font-bold text-blue-600">{scoreValue.toFixed(0)}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Insights Grid */}
                                <div className="xl:col-span-2 space-y-6">
                                    {/* Similarities & Differences */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                                    <CheckCircle className="h-6 w-6" />
                                                    Key Similarities
                                                </h3>
                                                <div className="space-y-3">
                                                    {analysis.ai_similarity_analysis.key_similarities.slice(0, 4).map((similarity, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-green-700 text-sm">{similarity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                                                    <AlertCircle className="h-6 w-6" />
                                                    Key Differences
                                                </h3>
                                                <div className="space-y-3">
                                                    {analysis.ai_similarity_analysis.key_differences.slice(0, 4).map((difference, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-orange-700 text-sm">{difference}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Theme Analysis */}
                                    {analysis.ai_similarity_analysis.theme_analysis && (
                                        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 shadow-lg">
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                                                    <Music className="h-6 w-6" />
                                                    Content Theme Analysis
                                                    <Badge className="bg-pink-200 text-pink-800 ml-2">
                                                        {analysis.ai_similarity_analysis.theme_analysis.compatibility.theme_compatibility_score.toFixed(1)}% Match
                                                    </Badge>
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <span className="font-semibold text-pink-700 block mb-2">Common Themes:</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {analysis.ai_similarity_analysis.theme_analysis.compatibility.common_themes.slice(0, 4).map((theme, index) => (
                                                                <Badge key={index} className="bg-pink-200 text-pink-800 text-xs">
                                                                    {theme}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-pink-700 block mb-2">Mood Match:</span>
                                                        <Badge className={analysis.ai_similarity_analysis.theme_analysis.compatibility.mood_match ? 
                                                            'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                            {analysis.ai_similarity_analysis.theme_analysis.compatibility.mood_match ? '✓ Similar' : '✗ Different'}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-pink-700 block mb-2">Style Match:</span>
                                                        <Badge className={analysis.ai_similarity_analysis.theme_analysis.compatibility.style_match ? 
                                                            'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                            {analysis.ai_similarity_analysis.theme_analysis.compatibility.style_match ? '✓ Similar' : '✗ Different'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Investment Insights */}
                                    {analysis.ai_similarity_analysis.actionable_insights && (
                                        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg">
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                                                    <TrendingUp className="h-6 w-6" />
                                                    Investment Intelligence
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {analysis.ai_similarity_analysis.actionable_insights.slice(0, 6).map((insight, index) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                                                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-indigo-700 text-sm">{insight}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Artist Stats */}
                        {(searchedArtistStats || comparableArtistStats) && (
                            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                                        <BarChart3 className="h-6 w-6 text-indigo-600" />
                                        Detailed Artist Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ArtistStatsDisplay 
                                        stats={searchedArtistStats} 
                                        comparableStats={comparableArtistStats}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIRecommendationTool;
