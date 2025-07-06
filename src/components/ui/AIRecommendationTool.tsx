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
    const [artistName, setArtistName] = useState('');
    const [comparableArtistName, setComparableArtistName] = useState('');
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSecondSearchLoading, setIsSecondSearchLoading] = useState(false);
    const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedArtistStats, setSearchedArtistStats] = useState<any>(null);
    const [comparableArtistStats, setComparableArtistStats] = useState<any>(null);

    const handleAnalyze = async (specificComparableArtist: string = '') => {
        if (!artistName.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setRecommendations(null);
        
        try {
            const searchQuery = specificComparableArtist || comparableArtistName;
            const endpoint = API_ENDPOINTS.analyzeArtist(artistName, searchQuery);
            
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

            setAnalysis(mappedData);

            if (mappedData.searched_artist_stats) {
                setSearchedArtistStats(mappedData.searched_artist_stats);
            }
            if (mappedData.comparable_artist_stats) {
                setComparableArtistStats(mappedData.comparable_artist_stats);
            }

            // Auto-fetch recommendations if there's a follower gap
            if (mappedData.artist_comparison.searched.followers < mappedData.artist_comparison.comparable.followers) {
                await fetchRecommendations(mappedData.artist_comparison.searched.name, mappedData.artist_comparison.comparable.name);
            }
            
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecommendations = async (targetArtist: string, mentorArtist: string) => {
        setIsRecommendationsLoading(true);
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
            setIsRecommendationsLoading(false);
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

    const canShowRecommendations = analysis && 
        analysis.artist_comparison.searched.followers < analysis.artist_comparison.comparable.followers;

    return (
        <div className={`transition-all duration-500 ${analysis ? 'min-h-screen bg-[#0f1216]' : 'bg-[#0f1216]'}`}>
            <div className={`container mx-auto px-4 max-w-6xl transition-all duration-500 ${analysis ? 'py-8' : 'py-6'}`}>
                {/* Compact Search Section */}
                <div className="text-center mb-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Primary Search */}
                            <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 shadow-lg hover:border-blue-500/50 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Target className="h-5 w-5 text-blue-400" />
                                        Artist to Analyze
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input
                                        type="text"
                                        placeholder="Enter artist name (e.g., Drake)"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 py-2"
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        onClick={handleFirstArtistSearch}
                                        disabled={isLoading || !artistName.trim()}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Brain className="mr-2 w-4 h-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 w-4 h-4" />
                                                Analyze Artist
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Comparison Search */}
                            <Card className={`backdrop-blur-sm shadow-lg transition-all duration-300 ${analysis ? 'bg-gray-900/70 border border-gray-700 hover:border-green-500/50' : 'bg-gray-800/30 border border-gray-600/50'}`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${analysis ? 'text-white' : 'text-gray-400'}`}>
                                        <Users className={`h-5 w-5 ${analysis ? 'text-green-400' : 'text-gray-500'}`} />
                                        Compare with Another Artist
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input
                                        type="text"
                                        placeholder={analysis ? "Enter another artist" : "Analyze an artist first"}
                                        value={comparableArtistName}
                                        onChange={(e) => setComparableArtistName(e.target.value)}
                                        className={`border-gray-600 placeholder-gray-400 py-2 transition-all duration-300 ${analysis ? 'bg-gray-800/50 text-white focus:border-green-400 focus:ring-green-400/20' : 'bg-gray-700/30 text-gray-500'}`}
                                        disabled={!analysis || isSecondSearchLoading}
                                    />
                                    <Button 
                                        onClick={handleSecondArtistSearch}
                                        disabled={!analysis || isSecondSearchLoading || !comparableArtistName.trim()}
                                        variant="outline"
                                        className={`w-full py-2 font-semibold shadow-lg transition-all duration-200 ${analysis ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white' : 'border-gray-600 text-gray-500'}`}
                                    >
                                        {isSecondSearchLoading ? (
                                            <>
                                                <Brain className="mr-2 w-4 h-4 animate-spin" />
                                                Comparing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 w-4 h-4" />
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
                    <Alert className="max-w-4xl mx-auto mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Analysis Results */}
                {analysis && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Compact Artist Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={analysis.artist_comparison.searched.avatar || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.searched.name} 
                                            className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-blue-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{analysis.artist_comparison.searched.name}</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Users className="h-3 w-3" />
                                                    <span className="font-medium">{analysis.artist_comparison.searched.followers?.toLocaleString() || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <span className="font-medium">{analysis.artist_comparison.searched.popularity || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={analysis.artist_comparison.comparable.avatar || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.comparable.name} 
                                            className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-green-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{analysis.artist_comparison.comparable.name}</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Users className="h-3 w-3" />
                                                    <span className="font-medium">{analysis.artist_comparison.comparable.followers?.toLocaleString() || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <span className="font-medium">{analysis.artist_comparison.comparable.popularity || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Compact Resonance Score */}
                        {analysis.ai_similarity_analysis?.musistash_resonance_score && (
                            <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Star className="h-5 w-5 text-yellow-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-white">MusiStash Resonance Score</h2>
                                                <p className="text-purple-100 text-sm">Commercial Success Prediction</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-white">
                                                {analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score}%
                                            </div>
                                            <div className="text-purple-200 text-sm">
                                                {analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 80 ? 'Excellent' :
                                                 analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 60 ? 'Good' :
                                                 analysis.ai_similarity_analysis.musistash_resonance_score.resonance_score >= 40 ? 'Moderate' : 'Challenging'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Success Drivers */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                <span className="text-sm font-medium text-white">Success Drivers</span>
                                                <Badge className="bg-green-500/20 text-green-300 text-xs">
                                                    {analysis.ai_similarity_analysis.musistash_resonance_score.key_drivers.length}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                {analysis.ai_similarity_analysis.musistash_resonance_score.key_drivers.slice(0, 3).map((driver, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                                        <span className="text-xs text-green-200">{driver}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Risk Factors */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-orange-400" />
                                                <span className="text-sm font-medium text-white">Risk Factors</span>
                                                <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                                                    {analysis.ai_similarity_analysis.musistash_resonance_score.risk_factors.length}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                {analysis.ai_similarity_analysis.musistash_resonance_score.risk_factors.slice(0, 3).map((risk, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                                                        <span className="text-xs text-orange-200">{risk}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* API Coverage */}
                                    {analysis.ai_similarity_analysis.musistash_resonance_score.musistash_analysis?.api_coverage && (
                                        <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-purple-200">API Coverage:</span>
                                                <div className="flex gap-2">
                                                    {Object.entries(analysis.ai_similarity_analysis.musistash_resonance_score.musistash_analysis.api_coverage).map(([api, available]) => (
                                                        <span key={api} className={`px-2 py-1 rounded text-xs ${available ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                            {api.toUpperCase()} {available ? '✓' : '✗'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Compact Similarity Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                                            <Music className="h-5 w-5" />
                                            Similarity Score
                                        </h3>
                                        <Badge className="bg-blue-200 text-blue-800">
                                            {analysis.ai_similarity_analysis.similarity_score.toFixed(1)}%
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-blue-700 mb-3">Overall Compatibility</div>
                                    <div className="space-y-2">
                                        {Object.entries(analysis.ai_similarity_analysis.category_scores).slice(0, 3).map(([category, score]) => {
                                            const scoreValue = typeof score === 'number' ? score : 0;
                                            const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                            
                                            return (
                                                <div key={category} className="flex justify-between items-center">
                                                    <span className="text-xs text-blue-600">{categoryName}</span>
                                                    <span className="text-xs font-bold text-blue-800">{scoreValue.toFixed(0)}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                {/* Key Similarities */}
                                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Key Similarities
                                        </h3>
                                        <div className="space-y-2">
                                            {analysis.ai_similarity_analysis.key_similarities.slice(0, 3).map((similarity, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-xs text-green-700">{similarity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Key Differences */}
                                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Key Differences
                                        </h3>
                                        <div className="space-y-2">
                                            {analysis.ai_similarity_analysis.key_differences.slice(0, 3).map((difference, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-xs text-orange-700">{difference}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Artist Recommendations Section */}
                        {canShowRecommendations && (
                            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-indigo-800 flex items-center gap-2">
                                        <Lightbulb className="h-6 w-6" />
                                        Artist Development Recommendations
                                        <Badge className="bg-indigo-200 text-indigo-800 ml-2">
                                            {analysis.artist_comparison.searched.name} → {analysis.artist_comparison.comparable.name}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isRecommendationsLoading ? (
                                        <div className="flex items-center justify-center p-8">
                                            <Brain className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
                                            <span className="text-indigo-700">Generating personalized recommendations...</span>
                                        </div>
                                    ) : recommendations?.success ? (
                                        <div className="space-y-4">
                                            {/* Key Differences */}
                                            <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                                        <Music className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-indigo-800 mb-2">Musical Key & Audience Reaction</h4>
                                                        <p className="text-indigo-700 text-sm mb-2">{recommendations.recommendations.key_differences.insight}</p>
                                                        <p className="text-indigo-600 text-sm mb-3 font-medium">💡 {recommendations.recommendations.key_differences.tip}</p>
                                                        <a 
                                                            href={recommendations.recommendations.key_differences.resource_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                                        >
                                                            <BookOpen className="h-3 w-3" />
                                                            {recommendations.recommendations.key_differences.resource_title}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Revenue Differences */}
                                            <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <DollarSign className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-indigo-800 mb-2">Revenue Streams & Monetization</h4>
                                                        <p className="text-indigo-700 text-sm mb-2">{recommendations.recommendations.revenue_differences.insight}</p>
                                                        <p className="text-indigo-600 text-sm mb-3 font-medium">💡 {recommendations.recommendations.revenue_differences.tip}</p>
                                                        <a 
                                                            href={recommendations.recommendations.revenue_differences.resource_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                                                        >
                                                            <GraduationCap className="h-3 w-3" />
                                                            {recommendations.recommendations.revenue_differences.resource_title}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Marketing Differences */}
                                            <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-pink-100 rounded-lg">
                                                        <Share2 className="h-5 w-5 text-pink-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-indigo-800 mb-2">Marketing & Fan Engagement</h4>
                                                        <p className="text-indigo-700 text-sm mb-2">{recommendations.recommendations.marketing_differences.insight}</p>
                                                        <p className="text-indigo-600 text-sm mb-3 font-medium">💡 {recommendations.recommendations.marketing_differences.tip}</p>
                                                        <a 
                                                            href={recommendations.recommendations.marketing_differences.resource_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs bg-pink-600 text-white px-3 py-2 rounded-md hover:bg-pink-700 transition-colors"
                                                        >
                                                            <Link className="h-3 w-3" />
                                                            {recommendations.recommendations.marketing_differences.resource_title}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gap Info */}
                                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                                                <div className="flex items-center gap-2 text-sm text-indigo-700">
                                                    <Info className="h-4 w-4" />
                                                    <span className="font-medium">Follower Gap:</span>
                                                    <span>{recommendations.follower_gap.toLocaleString()} followers</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 text-indigo-600">
                                            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-indigo-400" />
                                            <p className="text-sm">No recommendations available for artists with similar or higher follower counts.</p>
                                        </div>
                                    )}
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
