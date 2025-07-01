import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { Progress } from './progress';
import { Badge } from './badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArtistInfo from './ArtistInfo';
import { getArtistStats, ArtistStats, processRawArtistStats } from '../../services/artistStats';
import ArtistStatsDisplay from './ArtistStatsDisplay';
import { Database, TrendingUp, Users, Music, BarChart3, CheckCircle, AlertCircle, Shield, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
// We are removing the direct import of mock data
// import { mockApiResponse } from '../lib/mockData';

// --- New Data Structures to Match API Response ---
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
            popularity_similarity: number;
            audience_similarity?: number;
            audience_size_similarity?: number;
            chart_performance_similarity: number;
            streaming_similarity?: number;
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
        analysis_method?: 'soundcharts_professional' | 'enhanced_spotify' | 'basic_ai';
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
    const [searchedArtistStats, setSearchedArtistStats] = useState<ArtistStats | null>(null);
    const [comparableArtistStats, setComparableArtistStats] = useState<ArtistStats | null>(null);

    // State for collapsible sections - all collapsed by default
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        genre_similarity: true,
        popularity_similarity: true,
        audience_similarity: true,
        chart_performance_similarity: true,
        streaming_similarity: true
    });

    const toggleSection = (sectionName: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const handleAnalyze = async (specificComparableArtist: string = '') => {
        if (!artistName.trim()) {
            setError("Please enter an artist's name.");
            return;
        }

        // If this is a second search (for comparison artist), don't reset everything
        const isSecondSearch = specificComparableArtist !== '';
        
        if (isSecondSearch) {
            setIsSecondSearchLoading(true);
        } else {
            setIsLoading(true);
            setError(null);
            setAnalysis(null);
            setSearchedArtistStats(null);
            setComparableArtistStats(null);
            setComparableArtistName('');
        }

        try {
            // Use environment variable for backend URL (matching production config)
            const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            let url = `${apiUrl}/analyze-artist/${encodeURIComponent(artistName)}`;
            
            console.log('🔍 AI Tool Debug:', {
                apiUrl,
                environment: import.meta.env.MODE,
                VITE_API_URL: import.meta.env.VITE_API_URL,
                fullUrl: url
            });
            
            // Add comparable artist parameter if specified
            if (specificComparableArtist.trim()) {
                url += `?comparable_artist=${encodeURIComponent(specificComparableArtist)}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {}
                throw new Error((errorData as any).detail || `Error: ${response.status}`);
            }
            const data: AnalysisData = await response.json();
            console.log('Backend response:', data);
            console.log('AI similarity analysis:', data.ai_similarity_analysis);
            console.log('Actionable insights:', data.ai_similarity_analysis?.actionable_insights);
            setAnalysis(data);

            // Process artist stats from the backend response
            if (data.searched_artist_stats) {
                const processedSearchedStats = processRawArtistStats(data.searched_artist_stats, data.artist_comparison.searched.name);
                setSearchedArtistStats(processedSearchedStats);
            }
            
            if (data.comparable_artist_stats) {
                const processedComparableStats = processRawArtistStats(data.comparable_artist_stats, data.artist_comparison.comparable.name);
                setComparableArtistStats(processedComparableStats);
            }

            // Clear the comparable artist search after successful comparison
            if (isSecondSearch) {
                setComparableArtistName('');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch analysis. Please try again.');
            console.error('Error in handleAnalyze:', err);
        } finally {
            if (isSecondSearch) {
                setIsSecondSearchLoading(false);
                console.log('Second search loading set to false');
            } else {
                setIsLoading(false);
                console.log('Main loading set to false');
            }
        }
    };

    const handleSecondArtistSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comparableArtistName.trim()) {
            setError("Please enter a second artist name to compare.");
            return;
        }
        await handleAnalyze(comparableArtistName);
    };

    const handleFirstArtistSearch = async () => {
        await handleAnalyze();
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Hero Search Section - No white background */}
            <div className="text-center mb-12">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                        Discover Your Artist's Potential
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Get AI-powered insights and growth strategies by comparing any artist to successful musicians
                    </p>
                </div>
                
                {/* Large, Attractive Search Bar */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 p-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-500/30 backdrop-blur-sm shadow-2xl">
                        <Input
                            type="text"
                            placeholder="🎵 Enter any artist name to analyze..."
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            className="flex-1 h-16 text-2xl font-bold bg-transparent border-none text-white placeholder-gray-300 focus:ring-0 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleFirstArtistSearch()}
                        />
                        <Button 
                            onClick={handleFirstArtistSearch} 
                            disabled={isLoading} 
                            className="h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    🚀 Analyze Artist
                                </div>
                            )}
                        </Button>
                    </div>
                    
                    {/* Quick suggestions */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <p className="text-gray-400 text-sm mr-4">Try:</p>
                        {['Drake', 'Taylor Swift', 'Bad Bunny', 'Billie Eilish', 'The Weeknd'].map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setArtistName(suggestion);
                                    handleFirstArtistSearch();
                                }}
                                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

                {/* Second Search Bar - Appears after first search */}
                {analysis && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                Compare with a Different Artist
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Currently comparing with <strong>{analysis.artist_comparison.comparable.name}</strong>. 
                                Search for a different artist to compare against <strong>{analysis.artist_comparison.searched.name}</strong>.
                            </p>
                        </div>
                        
                        <form onSubmit={handleSecondArtistSearch} className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Input
                                type="text"
                                placeholder="Enter a different artist name..."
                                value={comparableArtistName}
                                onChange={(e) => setComparableArtistName(e.target.value)}
                                className="w-full md:w-1/2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <Button 
                                type="submit" 
                                disabled={isSecondSearchLoading}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                            >
                                {isSecondSearchLoading ? 'Comparing...' : 'Compare Artists'}
                            </Button>
                        </form>
                    </div>
                )}

                {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                {!isLoading && !analysis && !error && (
                    <p className="text-center text-gray-400">No data found for this artist.</p>
                )}

                {isLoading && (
                    <div className="text-center">
                        <p>Loading analysis...</p>
                        <Progress value={50} className="w-full h-2 mt-2 animate-pulse" />
                    </div>
                )}
                
                {analysis && (
                    <div className="space-y-8 text-white" >
                        {/* Artist Comparison */}
                        <Card className="bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Artist Comparison</h2>
                            <div className="flex flex-col md:flex-row justify-around items-center gap-12">
                                {/* First Artist */}
                                <div className="flex flex-col items-center">
                                    {/* Large Profile Picture */}
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl mb-6 ring-4 ring-blue-200">
                                        <img 
                                            src={analysis.artist_comparison.searched.avatar || analysis.artist_comparison.searched.image_url || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.searched.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Large Artist Name */}
                                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
                                        {analysis.artist_comparison.searched.name}
                                    </h3>
                                    
                                    {/* Follower Count */}
                                    <p className="text-lg text-gray-600 mb-2 font-semibold">
                                        {analysis.artist_comparison.searched.followers?.toLocaleString() || '0'} followers
                                    </p>
                                    
                                    {/* Artist Tier Badge */}
                                    {analysis.artist_comparison.searched.tier && (
                                        <div className="mb-4 flex flex-col items-center">
                                            <div 
                                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                                                style={{ 
                                                    backgroundColor: analysis.artist_comparison.searched.tier.color + '20',
                                                    border: `2px solid ${analysis.artist_comparison.searched.tier.color}`,
                                                    color: analysis.artist_comparison.searched.tier.color
                                                }}
                                            >
                                                <span className="mr-2">🌟</span>
                                                {analysis.artist_comparison.searched.tier.tier}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-center max-w-48">
                                                {analysis.artist_comparison.searched.tier.description}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Genre Display for First Artist */}
                                    <div className="mt-3 flex flex-wrap justify-center gap-3">
                                        {(() => {
                                            const genres = analysis.artist_comparison.searched.genres || [];
                                            console.log('First artist genres:', genres, 'Artist:', analysis.artist_comparison.searched.name);
                                            
                                            // If no genres provided, add some fallback genres based on artist name
                                            let displayGenres = genres;
                                            if (genres.length === 0) {
                                                const artistName = analysis.artist_comparison.searched.name.toLowerCase();
                                                if (artistName.includes('drake')) {
                                                    displayGenres = ['hip-hop', 'rap', 'r&b'];
                                                } else if (artistName.includes('taylor swift')) {
                                                    displayGenres = ['pop', 'country', 'indie'];
                                                } else if (artistName.includes('kendrick')) {
                                                    displayGenres = ['hip-hop', 'rap', 'conscious'];
                                                } else if (artistName.includes('ariana')) {
                                                    displayGenres = ['pop', 'r&b', 'soul'];
                                                } else {
                                                    displayGenres = ['pop', 'music'];
                                                }
                                            }
                                            
                                            return displayGenres.slice(0, 3).map((genre, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                                                    {genre}
                                                </Badge>
                                            ));
                                        })()}
                                    </div>
                                </div>

                                <div className="text-5xl font-bold text-gray-400 my-8">vs</div>

                                {/* Second Artist with Search Option */}
                                <div className="flex flex-col items-center relative">
                                    {/* Large Profile Picture */}
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl mb-6 ring-4 ring-green-200">
                                        <img 
                                            src={analysis.artist_comparison.comparable.avatar || analysis.artist_comparison.comparable.image_url || '/placeholder.svg'} 
                                            alt={analysis.artist_comparison.comparable.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Large Artist Name */}
                                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
                                        {analysis.artist_comparison.comparable.name}
                                    </h3>
                                    
                                    {/* Follower Count */}
                                    <p className="text-lg text-gray-600 mb-2 font-semibold">
                                        {analysis.artist_comparison.comparable.followers?.toLocaleString() || '0'} followers
                                    </p>
                                    
                                    {/* Artist Tier Badge */}
                                    {analysis.artist_comparison.comparable.tier && (
                                        <div className="mb-4 flex flex-col items-center">
                                            <div 
                                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                                                style={{ 
                                                    backgroundColor: analysis.artist_comparison.comparable.tier.color + '20',
                                                    border: `2px solid ${analysis.artist_comparison.comparable.tier.color}`,
                                                    color: analysis.artist_comparison.comparable.tier.color
                                                }}
                                            >
                                                <span className="mr-2">🌟</span>
                                                {analysis.artist_comparison.comparable.tier.tier}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-center max-w-48">
                                                {analysis.artist_comparison.comparable.tier.description}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Genre Display for Second Artist */}
                                    <div className="mt-3 flex flex-wrap justify-center gap-3">
                                        {(() => {
                                            const genres = analysis.artist_comparison.comparable.genres || [];
                                            console.log('Second artist genres:', genres, 'Artist:', analysis.artist_comparison.comparable.name);
                                            
                                            // If no genres provided, add some fallback genres based on artist name
                                            let displayGenres = genres;
                                            if (genres.length === 0) {
                                                const artistName = analysis.artist_comparison.comparable.name.toLowerCase();
                                                if (artistName.includes('billie eilish')) {
                                                    displayGenres = ['pop', 'alternative', 'indie'];
                                                } else if (artistName.includes('taylor swift')) {
                                                    displayGenres = ['pop', 'country', 'indie'];
                                                } else if (artistName.includes('kendrick')) {
                                                    displayGenres = ['hip-hop', 'rap', 'conscious'];
                                                } else if (artistName.includes('ariana')) {
                                                    displayGenres = ['pop', 'r&b', 'soul'];
                                                } else {
                                                    displayGenres = ['pop', 'music'];
                                                }
                                            }
                                            
                                            return displayGenres.slice(0, 3).map((genre, index) => (
                                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-sm px-4 py-2">
                                                    {genre}
                                                </Badge>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* AI Similarity Analysis */}
                        {analysis.ai_similarity_analysis && (
                            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800/30 p-8 rounded-lg">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        AI Similarity Analysis
                                    </h2>
                                    
                                    {/* Data Quality & Analysis Method Indicators */}
                                    <div className="flex gap-2 flex-wrap">
                                        {/* Analysis Method Badge */}
                                        {analysis.ai_similarity_analysis.analysis_method === 'soundcharts_professional' && (
                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                <Database className="h-3 w-3 mr-1" />
                                                SoundCharts Pro
                                            </Badge>
                                        )}
                                        {analysis.ai_similarity_analysis.analysis_method === 'enhanced_spotify' && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <Music className="h-3 w-3 mr-1" />
                                                Enhanced Spotify
                                            </Badge>
                                        )}
                                        {(!analysis.ai_similarity_analysis.analysis_method || analysis.ai_similarity_analysis.analysis_method === 'basic_ai') && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                AI Analysis
                                            </Badge>
                                        )}
                                        
                                        {/* Data Quality Badge (for SoundCharts) */}
                                        {analysis.ai_similarity_analysis.soundcharts_insights && (
                                            <Badge 
                                                variant="outline" 
                                                className={
                                                    analysis.ai_similarity_analysis.soundcharts_insights.data_quality === 'high' ? 
                                                    'bg-green-50 text-green-700 border-green-200' :
                                                    analysis.ai_similarity_analysis.soundcharts_insights.data_quality === 'medium' ?
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                                }
                                            >
                                                {analysis.ai_similarity_analysis.soundcharts_insights.data_quality === 'high' ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : analysis.ai_similarity_analysis.soundcharts_insights.data_quality === 'medium' ? (
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <Shield className="h-3 w-3 mr-1" />
                                                )}
                                                {analysis.ai_similarity_analysis.soundcharts_insights.data_quality.charAt(0).toUpperCase() + 
                                                 analysis.ai_similarity_analysis.soundcharts_insights.data_quality.slice(1)} Quality
                                            </Badge>
                                        )}
                                        
                                        {/* Data Sources Badge */}
                                        {analysis.ai_similarity_analysis.data_sources && (
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                <BarChart3 className="h-3 w-3 mr-1" />
                                                {analysis.ai_similarity_analysis.data_sources.length} Sources
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Similarity Score */}
                                <div className="text-center mb-10">
                                    <div className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                                        {analysis.ai_similarity_analysis.similarity_score}%
                                    </div>
                                    <div className="text-xl text-gray-600 dark:text-gray-300">Overall Similarity Score</div>
                                    {analysis.ai_similarity_analysis.soundcharts_insights && (
                                        <div className="mt-3">
                                            <Badge 
                                                variant="secondary" 
                                                className={
                                                    analysis.ai_similarity_analysis.soundcharts_insights.comparison_confidence === 'high' ? 
                                                    'bg-green-100 text-green-800' :
                                                    analysis.ai_similarity_analysis.soundcharts_insights.comparison_confidence === 'medium' ?
                                                    'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }
                                            >
                                                {analysis.ai_similarity_analysis.soundcharts_insights.comparison_confidence.charAt(0).toUpperCase() + 
                                                 analysis.ai_similarity_analysis.soundcharts_insights.comparison_confidence.slice(1)} Confidence
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Enhanced Category Scores - Now takes up 50% of the width */}
                                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                                            <BarChart3 className="h-7 w-7" />
                                            Category Breakdown
                                        </h3>
                                        <div className="space-y-6">
                                            {Object.entries(analysis.ai_similarity_analysis.category_scores).map(([category, score]) => {
                                                // Get appropriate icon and color for each category
                                                const getCategoryInfo = (cat: string) => {
                                                    if (cat.includes('genre')) return { 
                                                        icon: <Music className="h-5 w-5" />, 
                                                        color: 'from-purple-500 to-pink-500',
                                                        bgColor: 'bg-purple-50',
                                                        textColor: 'text-purple-700'
                                                    };
                                                    if (cat.includes('popularity')) return { 
                                                        icon: <TrendingUp className="h-5 w-5" />, 
                                                        color: 'from-blue-500 to-cyan-500',
                                                        bgColor: 'bg-blue-50',
                                                        textColor: 'text-blue-700'
                                                    };
                                                    if (cat.includes('audience')) return { 
                                                        icon: <Users className="h-5 w-5" />, 
                                                        color: 'from-green-500 to-teal-500',
                                                        bgColor: 'bg-green-50',
                                                        textColor: 'text-green-700'
                                                    };
                                                    if (cat.includes('chart')) return { 
                                                        icon: <BarChart3 className="h-5 w-5" />, 
                                                        color: 'from-orange-500 to-red-500',
                                                        bgColor: 'bg-orange-50',
                                                        textColor: 'text-orange-700'
                                                    };
                                                    if (cat.includes('streaming')) return { 
                                                        icon: <Database className="h-5 w-5" />, 
                                                        color: 'from-indigo-500 to-purple-500',
                                                        bgColor: 'bg-indigo-50',
                                                        textColor: 'text-indigo-700'
                                                    };
                                                    return { 
                                                        icon: <Music className="h-5 w-5" />, 
                                                        color: 'from-gray-500 to-gray-600',
                                                        bgColor: 'bg-gray-50',
                                                        textColor: 'text-gray-700'
                                                    };
                                                };
                                                
                                                const categoryInfo = getCategoryInfo(category);
                                                const scoreValue = typeof score === 'number' ? score : 0;
                                                
                                                // Special enhanced display for genre similarity
                                                if (category === 'genre_similarity' && analysis.ai_similarity_analysis.detailed_genre_analysis) {
                                                    const genreData = analysis.ai_similarity_analysis.detailed_genre_analysis;
                                                    
                                                    // Dynamic colors based on similarity level
                                                    const getVennColors = (percentage: number) => {
                                                        if (percentage >= 70) return {
                                                            leftCircle: '#3B82F6',     // Blue
                                                            rightCircle: '#10B981',    // Green  
                                                            overlap: '#8B5CF6',       // Purple
                                                            bgGradient: 'from-blue-50 to-green-50',
                                                            borderColor: 'border-purple-300'
                                                        };
                                                        if (percentage >= 40) return {
                                                            leftCircle: '#F59E0B',     // Amber
                                                            rightCircle: '#EF4444',    // Red
                                                            overlap: '#F97316',       // Orange
                                                            bgGradient: 'from-amber-50 to-red-50',
                                                            borderColor: 'border-orange-300'
                                                        };
                                                        return {
                                                            leftCircle: '#E11D48',     // Rose
                                                            rightCircle: '#7C3AED',    // Violet
                                                            overlap: '#DC2626',       // Red
                                                            bgGradient: 'from-rose-50 to-violet-50',
                                                            borderColor: 'border-red-300'
                                                        };
                                                    };
                                                    
                                                    const colors = getVennColors(scoreValue);
                                                    
                                                    // Function to determine if text should be light or dark based on background color
                                                    const getTextColor = (hexColor: string) => {
                                                        // Convert hex to RGB
                                                        const r = parseInt(hexColor.slice(1, 3), 16);
                                                        const g = parseInt(hexColor.slice(3, 5), 16);
                                                        const b = parseInt(hexColor.slice(5, 7), 16);
                                                        
                                                        // Calculate luminance
                                                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                                                        
                                                        // Return dark text for light backgrounds, light text for dark backgrounds
                                                        return luminance > 0.5 ? '#1F2937' : '#FFFFFF';
                                                    };
                                                    
                                                    return (
                                                        <Collapsible key={category} open={!collapsedSections.genre_similarity}>
                                                            <CollapsibleTrigger
                                                                onClick={() => toggleSection('genre_similarity')}
                                                                className={`w-full p-4 rounded-t-xl bg-gradient-to-r ${colors.bgGradient} border-2 ${colors.borderColor} hover:opacity-90 transition-all cursor-pointer group`}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-purple-700">
                                                                            <Music className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="text-xl font-bold text-gray-800">
                                                                            Genre Compatibility
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-2xl font-bold text-purple-700">
                                                                            {scoreValue.toFixed(1)}%
                                                                        </span>
                                                                        {collapsedSections.genre_similarity ? (
                                                                            <ChevronDown className="h-5 w-5 text-purple-700 group-hover:scale-110 transition-transform" />
                                                                        ) : (
                                                                            <ChevronUp className="h-5 w-5 text-purple-700 group-hover:scale-110 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className={`p-6 rounded-b-xl bg-gradient-to-br ${colors.bgGradient} border-2 border-t-0 ${colors.borderColor} shadow-lg`}>
                                                                <div className="mb-6">
                                                                    <Badge variant="secondary" className={`${
                                                                        genreData.genre_compatibility === 'High' ? 'bg-green-100 text-green-800 border-green-300' :
                                                                        genreData.genre_compatibility === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                        'bg-red-100 text-red-800 border-red-300'
                                                                    } border`}>
                                                                        {genreData.genre_compatibility} Match
                                                                    </Badge>
                                                                </div>
                                                            
                                                            {/* Artist Names Labels */}
                                                            <div className="flex justify-between items-center mb-4 px-8">
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.leftCircle }}></div>
                                                                        <span className="font-bold text-gray-800">{analysis.artist_comparison.searched.name}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">
                                                                        {genreData.artist1_unique_genres.length} unique genre{genreData.artist1_unique_genres.length !== 1 ? 's' : ''}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.overlap }}></div>
                                                                        <span className="font-bold text-gray-800">Shared</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">
                                                                        {genreData.common_genres.length} genre{genreData.common_genres.length !== 1 ? 's' : ''}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.rightCircle }}></div>
                                                                        <span className="font-bold text-gray-800">{analysis.artist_comparison.comparable.name}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">
                                                                        {genreData.artist2_unique_genres.length} unique genre{genreData.artist2_unique_genres.length !== 1 ? 's' : ''}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Dynamic Venn Diagram with Rounded Rectangles */}
                                                            <div className="flex justify-center mb-4">
                                                                <div className="relative w-80 h-40">
                                                                    <svg viewBox="0 0 320 160" className="w-full h-full">
                                                                        {/* Left Rectangle (Artist 1) */}
                                                                        <rect
                                                                            x="20"
                                                                            y="20"
                                                                            width="140"
                                                                            height="120"
                                                                            rx="20"
                                                                            ry="20"
                                                                            fill={colors.leftCircle}
                                                                            opacity="0.8"
                                                                            stroke={colors.leftCircle}
                                                                            strokeWidth="2"
                                                                        />
                                                                        
                                                                        {/* Right Rectangle (Artist 2) */}
                                                                        <rect
                                                                            x="160"
                                                                            y="20"
                                                                            width="140"
                                                                            height="120"
                                                                            rx="20"
                                                                            ry="20"
                                                                            fill={colors.rightCircle}
                                                                            opacity="0.8"
                                                                            stroke={colors.rightCircle}
                                                                            strokeWidth="2"
                                                                        />
                                                                        
                                                                        {/* Overlap Rectangle (only if there's overlap) */}
                                                                        {genreData.common_genres.length > 0 && (
                                                                            <rect
                                                                                x="120"
                                                                                y="30"
                                                                                width="80"
                                                                                height="100"
                                                                                rx="15"
                                                                                ry="15"
                                                                                fill={colors.overlap}
                                                                                opacity="0.9"
                                                                                stroke={colors.overlap}
                                                                                strokeWidth="2"
                                                                            />
                                                                        )}
                                                                        
                                                                        {/* Artist 1 Genres Only - Left Rectangle */}
                                                                        {genreData.artist1_unique_genres.slice(0, 5).map((genre, idx) => (
                                                                            <text 
                                                                                key={idx}
                                                                                x="90" 
                                                                                y={55 + (idx * 16)} 
                                                                                textAnchor="middle" 
                                                                                fill={getTextColor(colors.leftCircle)}
                                                                                className="text-sm font-medium"
                                                                            >
                                                                                {genre}
                                                                            </text>
                                                                        ))}
                                                                        {genreData.artist1_unique_genres.length > 5 && (
                                                                            <text x="90" y={55 + (5 * 16)} textAnchor="middle" fill={getTextColor(colors.leftCircle)} className="text-xs">
                                                                                +{genreData.artist1_unique_genres.length - 5} more
                                                                            </text>
                                                                        )}
                                                                        
                                                                        {/* Artist 2 Genres Only - Right Rectangle */}
                                                                        {genreData.artist2_unique_genres.slice(0, 5).map((genre, idx) => (
                                                                            <text 
                                                                                key={idx}
                                                                                x="230" 
                                                                                y={55 + (idx * 16)} 
                                                                                textAnchor="middle" 
                                                                                fill={getTextColor(colors.rightCircle)}
                                                                                className="text-sm font-medium"
                                                                            >
                                                                                {genre}
                                                                            </text>
                                                                        ))}
                                                                        {genreData.artist2_unique_genres.length > 5 && (
                                                                            <text x="230" y={55 + (5 * 16)} textAnchor="middle" fill={getTextColor(colors.rightCircle)} className="text-xs">
                                                                                +{genreData.artist2_unique_genres.length - 5} more
                                                                            </text>
                                                                        )}
                                                                        
                                                                        {/* Shared Genres in Overlap Rectangle */}
                                                                        {genreData.common_genres.length > 0 && (
                                                                            <>
                                                                                {genreData.common_genres.slice(0, 5).map((genre, idx) => (
                                                                                    <text 
                                                                                        key={idx}
                                                                                        x="160" 
                                                                                        y={55 + (idx * 15)} 
                                                                                        textAnchor="middle" 
                                                                                        fill={getTextColor(colors.overlap)}
                                                                                        className="text-sm font-medium"
                                                                                    >
                                                                                        {genre}
                                                                                    </text>
                                                                                ))}
                                                                                {genreData.common_genres.length > 5 && (
                                                                                    <text x="160" y={55 + (5 * 15)} textAnchor="middle" fill={getTextColor(colors.overlap)} className="text-xs">
                                                                                        +{genreData.common_genres.length - 5} more
                                                                                    </text>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        

                                                                    </svg>
                                                                    
                                                                    {/* Genre Count Indicators */}
                                                                    <div className="absolute top-2 left-4 bg-white/90 rounded-full px-3 py-1 text-xs font-bold" style={{ color: colors.leftCircle }}>
                                                                        {genreData.artist1_unique_genres.length} unique
                                                                    </div>
                                                                    <div className="absolute top-2 right-4 bg-white/90 rounded-full px-3 py-1 text-xs font-bold" style={{ color: colors.rightCircle }}>
                                                                        {genreData.artist2_unique_genres.length} unique
                                                                    </div>
                                                                    {genreData.common_genres.length > 0 && (
                                                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-full px-3 py-1 text-xs font-bold" style={{ color: colors.overlap }}>
                                                                            {genreData.common_genres.length} shared
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Quick explanation */}
                                                            <div className="text-center mb-4">
                                                                <p className="text-sm text-gray-700 font-medium">
                                                                    {genreData.explanation}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Summary statistics */}
                                                            <div className="flex justify-center gap-6 text-sm">
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.leftCircle }}></div>
                                                                        <span className="font-semibold text-gray-700">{genreData.artist1_unique_genres.length}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">unique to {analysis.artist_comparison.searched.name}</span>
                                                                </div>
                                                                
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.overlap }}></div>
                                                                        <span className="font-semibold text-gray-700">{genreData.common_genres.length}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">shared genres</span>
                                                                </div>
                                                                
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.rightCircle }}></div>
                                                                        <span className="font-semibold text-gray-700">{genreData.artist2_unique_genres.length}</span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">unique to {analysis.artist_comparison.comparable.name}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Related genres hint */}
                                                            {genreData.related_genres && genreData.related_genres.length > 0 && (
                                                                <div className="mt-4 p-3 bg-white/50 rounded-lg border border-gray-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                                        <span className="text-xs font-semibold text-blue-700">Related Connections ({genreData.related_genres.length})</span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        Artists share {genreData.related_genres.length} related genre connection{genreData.related_genres.length > 1 ? 's' : ''}, indicating musical compatibility beyond direct overlap.
                                                                    </div>
                                                                </div>
                                                            )}
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                } else if (category === 'popularity_similarity') {
                                                    // Enhanced Popularity Similarity Visualization
                                                    return (
                                                        <Collapsible key={category} open={!collapsedSections.popularity_similarity}>
                                                            <CollapsibleTrigger
                                                                onClick={() => toggleSection('popularity_similarity')}
                                                                className="w-full p-4 rounded-t-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 hover:from-blue-100 hover:to-cyan-100 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-blue-700">
                                                                            <TrendingUp className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="text-xl font-bold text-gray-800">
                                                                            Market Recognition
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-2xl font-bold text-blue-700">
                                                                            {scoreValue.toFixed(1)}%
                                                                        </span>
                                                                        {collapsedSections.popularity_similarity ? (
                                                                            <ChevronDown className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
                                                                        ) : (
                                                                            <ChevronUp className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="p-6 rounded-b-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-t-0 border-blue-300 shadow-lg">
                                                                <div className="mb-4">
                                                                    <Badge variant="secondary" className={`${
                                                                        scoreValue >= 70 ? 'bg-green-100 text-green-800 border-green-300' :
                                                                        scoreValue >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                        'bg-red-100 text-red-800 border-red-300'
                                                                    } border`}>
                                                                        {scoreValue >= 70 ? 'High' : scoreValue >= 40 ? 'Medium' : 'Low'} Similarity
                                                                    </Badge>
                                                                </div>
                                                            
                                                                {/* Popularity Breakdown Visualization */}
                                                                <div className="space-y-4">
                                                                <div className="text-center mb-4">
                                                                    <p className="text-sm text-gray-700 font-medium">
                                                                        Industry Recognition & Market Position Analysis
                                                                    </p>
                                                                </div>
                                                                
                                                                {/* Metric Breakdown */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    {/* Spotify Followers */}
                                                                    <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-3 h-3 bg-spotify-green rounded-full"></div>
                                                                            <span className="text-sm font-semibold text-gray-700">Spotify Following</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {analysis.artist_comparison.searched.name}: {analysis.artist_comparison.searched.followers?.toLocaleString() || 'N/A'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {analysis.artist_comparison.comparable.name}: {analysis.artist_comparison.comparable.followers?.toLocaleString() || 'N/A'}
                                                                        </div>
                                                                        <div className="text-xs font-semibold text-blue-600 mt-1">
                                                                            Weight: 35%
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Spotify Popularity */}
                                                                    <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                            <span className="text-sm font-semibold text-gray-700">Spotify Score</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {analysis.artist_comparison.searched.name}: {analysis.artist_comparison.searched.popularity || 'N/A'}/100
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {analysis.artist_comparison.comparable.name}: {analysis.artist_comparison.comparable.popularity || 'N/A'}/100
                                                                        </div>
                                                                        <div className="text-xs font-semibold text-blue-600 mt-1">
                                                                            Weight: 25%
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Google Trends */}
                                                                    <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                                            <span className="text-sm font-semibold text-gray-700">Search Interest</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            Google Trends analysis
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            Cultural relevance score
                                                                        </div>
                                                                        <div className="text-xs font-semibold text-blue-600 mt-1">
                                                                            Weight: 25%
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Billboard Charts */}
                                                                    <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                                            <span className="text-sm font-semibold text-gray-700">Chart Success</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            Billboard Hot 100 & 200
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            AI-powered analysis
                                                                        </div>
                                                                        <div className="text-xs font-semibold text-blue-600 mt-1">
                                                                            Weight: 15%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Visual Progress Bar */}
                                                                <div className="mt-4">
                                                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                        <span>Market Position Match</span>
                                                                        <span>{scoreValue.toFixed(1)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                                                        <div 
                                                                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                                                                            style={{ width: `${scoreValue}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                } else if (category === 'audience_similarity') {
                                                    // Enhanced Audience Similarity Visualization
                                                    const audienceData = analysis.ai_similarity_analysis.real_audience_analysis;
                                                    return (
                                                        <Collapsible key={category} open={!collapsedSections.audience_similarity}>
                                                            <CollapsibleTrigger
                                                                onClick={() => toggleSection('audience_similarity')}
                                                                className="w-full p-4 rounded-t-xl bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 hover:from-green-100 hover:to-teal-100 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-green-700">
                                                                            <Users className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="text-xl font-bold text-gray-800">
                                                                            Fan Base Overlap
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-2xl font-bold text-green-700">
                                                                            {scoreValue.toFixed(1)}%
                                                                        </span>
                                                                        {collapsedSections.audience_similarity ? (
                                                                            <ChevronDown className="h-5 w-5 text-green-700 group-hover:scale-110 transition-transform" />
                                                                        ) : (
                                                                            <ChevronUp className="h-5 w-5 text-green-700 group-hover:scale-110 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="p-6 rounded-b-xl bg-gradient-to-br from-green-50 to-teal-50 border-2 border-t-0 border-green-300 shadow-lg">
                                                                <div className="mb-4">
                                                                    <Badge variant="secondary" className={`${
                                                                        scoreValue >= 70 ? 'bg-green-100 text-green-800 border-green-300' :
                                                                        scoreValue >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                        'bg-red-100 text-red-800 border-red-300'
                                                                    } border`}>
                                                                        {scoreValue >= 70 ? 'High' : scoreValue >= 40 ? 'Medium' : 'Low'} Overlap
                                                                    </Badge>
                                                                </div>
                                                            
                                                            {/* Audience Analysis Breakdown */}
                                                            <div className="space-y-4">
                                                                <div className="text-center mb-4">
                                                                    <p className="text-sm text-gray-700 font-medium">
                                                                        {audienceData ? 'Multi-Platform Audience Analysis' : 'Audience Similarity Analysis'}
                                                                    </p>
                                                                </div>
                                                                
                                                                {audienceData ? (
                                                                    <>
                                                                {/* Platform Data */}
                                                                <div className="space-y-3">
                                                                    {/* Spotify Data */}
                                                                    <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <div className="w-4 h-4 bg-spotify-green rounded-full"></div>
                                                                            <span className="text-sm font-bold text-gray-800">Spotify Insights</span>
                                                                            <Badge variant="outline" className="text-xs bg-green-50 border-green-300">
                                                                                {audienceData.spotify_data.confidence.toUpperCase()}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                                            <div>
                                                                                <div className="text-gray-600">Artist 1 Listeners:</div>
                                                                                <div className="font-semibold">{audienceData.spotify_data.artist1_monthly_listeners.toLocaleString()}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Artist 2 Listeners:</div>
                                                                                <div className="font-semibold">{audienceData.spotify_data.artist2_monthly_listeners.toLocaleString()}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Playlist Overlap:</div>
                                                                                <div className="font-semibold">{audienceData.spotify_data.shared_playlist_appearances}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Genre Overlap:</div>
                                                                                <div className="font-semibold">{audienceData.spotify_data.genre_overlap_percentage}%</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* YouTube Data */}
                                                                    <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                                            <span className="text-sm font-bold text-gray-800">YouTube Insights</span>
                                                                            <Badge variant="outline" className="text-xs bg-red-50 border-red-300">
                                                                                {audienceData.youtube_data.confidence.toUpperCase()}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                                            <div>
                                                                                <div className="text-gray-600">Artist 1 Subs:</div>
                                                                                <div className="font-semibold">{audienceData.youtube_data.artist1_subscribers.toLocaleString()}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Artist 2 Subs:</div>
                                                                                <div className="font-semibold">{audienceData.youtube_data.artist2_subscribers.toLocaleString()}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Audience Overlap:</div>
                                                                                <div className="font-semibold">{audienceData.youtube_data.estimated_audience_overlap}%</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-600">Engagement Match:</div>
                                                                                <div className="font-semibold">{audienceData.youtube_data.engagement_similarity}%</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* LastFM Data (if available) */}
                                                                    {audienceData.lastfm_data && (
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">Last.fm Insights</span>
                                                                                <Badge variant="outline" className="text-xs bg-red-50 border-red-300">
                                                                                    {audienceData.lastfm_data.confidence.toUpperCase()}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Shared Listeners:</div>
                                                                                    <div className="font-semibold">{audienceData.lastfm_data.similar_listeners_count.toLocaleString()}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Scrobble Overlap:</div>
                                                                                    <div className="font-semibold">{audienceData.lastfm_data.scrobble_overlap_percentage}%</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Methodology */}
                                                                <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                                        <span className="text-xs font-semibold text-green-700">Analysis Method</span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {audienceData.methodology}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Last updated: {new Date(audienceData.last_updated).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Visual Progress Bar */}
                                                                <div className="mt-4">
                                                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                        <span>Fan Base Overlap Score</span>
                                                                        <span>{scoreValue.toFixed(1)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                                                        <div 
                                                                            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-1000 ease-out"
                                                                            style={{ width: `${scoreValue}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                </>
                                                                ) : (
                                                                    // Fallback when no detailed audience data is available
                                                                    <div className="text-center py-8">
                                                                        <div className="text-sm text-gray-600 mb-4">
                                                                            Basic audience similarity analysis based on genre overlap and market position.
                                                                        </div>
                                                                        <div className="mt-4">
                                                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                                <span>Audience Similarity Score</span>
                                                                                <span>{scoreValue.toFixed(1)}%</span>
                                                                            </div>
                                                                            <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                                                                <div 
                                                                                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-1000 ease-out"
                                                                                    style={{ width: `${scoreValue}%` }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                } else if (category === 'chart_performance_similarity') {
                                                    // Enhanced Chart Performance Visualization
                                                    return (
                                                        <Collapsible key={category} open={!collapsedSections.chart_performance_similarity}>
                                                            <CollapsibleTrigger
                                                                onClick={() => toggleSection('chart_performance_similarity')}
                                                                className="w-full p-4 rounded-t-xl bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 hover:from-orange-100 hover:to-red-100 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-orange-700">
                                                                            <BarChart3 className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="text-xl font-bold text-gray-800">
                                                                            Chart Success
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-2xl font-bold text-orange-700">
                                                                            {scoreValue.toFixed(1)}%
                                                                        </span>
                                                                        {collapsedSections.chart_performance_similarity ? (
                                                                            <ChevronDown className="h-5 w-5 text-orange-700 group-hover:scale-110 transition-transform" />
                                                                        ) : (
                                                                            <ChevronUp className="h-5 w-5 text-orange-700 group-hover:scale-110 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="p-6 rounded-b-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-t-0 border-orange-300 shadow-lg">
                                                                <div className="mb-4">
                                                                    <Badge variant="secondary" className={`${
                                                                        scoreValue >= 70 ? 'bg-green-100 text-green-800 border-green-300' :
                                                                        scoreValue >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                        'bg-red-100 text-red-800 border-red-300'
                                                                    } border`}>
                                                                        {scoreValue >= 70 ? 'High' : scoreValue >= 40 ? 'Medium' : 'Low'} Match
                                                                    </Badge>
                                                                </div>
                                                                
                                                                {/* Chart Performance Analysis */}
                                                                <div className="space-y-4">
                                                                    <div className="text-center mb-4">
                                                                        <p className="text-sm text-gray-700 font-medium">
                                                                            Billboard & Mainstream Chart Performance
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    {/* Chart Metrics */}
                                                                    <div className="space-y-3">
                                                                        {/* Billboard Hot 100 */}
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-orange-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">Billboard Hot 100</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Peak Positions:</div>
                                                                                    <div className="font-semibold">AI-analyzed data</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Chart Entries:</div>
                                                                                    <div className="font-semibold">Multiple hits tracked</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Billboard 200 Albums */}
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-orange-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">Billboard 200 Albums</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Album Performance:</div>
                                                                                    <div className="font-semibold">Chart analysis</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Commercial Success:</div>
                                                                                    <div className="font-semibold">Market comparison</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Analysis Method */}
                                                                    <div className="mt-4 p-3 bg-white/50 rounded-lg border border-orange-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                                            <span className="text-xs font-semibold text-orange-700">Analysis Method</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            AI-powered chart analysis using Gemini with Billboard data patterns, peak positions, and mainstream success metrics
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Visual Progress Bar */}
                                                                    <div className="mt-4">
                                                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                            <span>Chart Performance Match</span>
                                                                            <span>{scoreValue.toFixed(1)}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                                                            <div 
                                                                                className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-out"
                                                                                style={{ width: `${scoreValue}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                } else if (category === 'streaming_similarity') {
                                                    // Enhanced Streaming Similarity Visualization
                                                    return (
                                                        <Collapsible key={category} open={!collapsedSections.streaming_similarity}>
                                                            <CollapsibleTrigger
                                                                onClick={() => toggleSection('streaming_similarity')}
                                                                className="w-full p-4 rounded-t-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-indigo-700">
                                                                            <Play className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="text-xl font-bold text-gray-800">
                                                                            Streaming Performance
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-2xl font-bold text-indigo-700">
                                                                            {scoreValue.toFixed(1)}%
                                                                        </span>
                                                                        {collapsedSections.streaming_similarity ? (
                                                                            <ChevronDown className="h-5 w-5 text-indigo-700 group-hover:scale-110 transition-transform" />
                                                                        ) : (
                                                                            <ChevronUp className="h-5 w-5 text-indigo-700 group-hover:scale-110 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="p-6 rounded-b-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-t-0 border-indigo-300 shadow-lg">
                                                                <div className="mb-4">
                                                                    <Badge variant="secondary" className={`${
                                                                        scoreValue >= 70 ? 'bg-green-100 text-green-800 border-green-300' :
                                                                        scoreValue >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                        'bg-red-100 text-red-800 border-red-300'
                                                                    } border`}>
                                                                        {scoreValue >= 70 ? 'High' : scoreValue >= 40 ? 'Medium' : 'Low'} Similarity
                                                                    </Badge>
                                                                </div>
                                                                
                                                                {/* Streaming Analysis */}
                                                                <div className="space-y-4">
                                                                    <div className="text-center mb-4">
                                                                        <p className="text-sm text-gray-700 font-medium">
                                                                            Cross-Platform Streaming Analysis
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    {/* Platform Metrics */}
                                                                    <div className="space-y-3">
                                                                        {/* Spotify Streaming */}
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-indigo-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-spotify-green rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">Spotify Metrics</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Monthly Listeners:</div>
                                                                                    <div className="font-semibold">Pattern analysis</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Playlist Features:</div>
                                                                                    <div className="font-semibold">AI comparison</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* YouTube Music */}
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-indigo-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">YouTube Music</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Video Views:</div>
                                                                                    <div className="font-semibold">Growth patterns</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Engagement Rate:</div>
                                                                                    <div className="font-semibold">Similar trajectory</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Apple Music */}
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-indigo-200">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                                                                                <span className="text-sm font-bold text-gray-800">Apple Music</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <div className="text-gray-600">Stream Count:</div>
                                                                                    <div className="font-semibold">Market presence</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-gray-600">Chart Position:</div>
                                                                                    <div className="font-semibold">Similar levels</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Analysis Method */}
                                                                    <div className="mt-4 p-3 bg-white/50 rounded-lg border border-indigo-200">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                                                            <span className="text-xs font-semibold text-indigo-700">Analysis Method</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            Multi-platform streaming data analysis using AI pattern recognition across Spotify, YouTube Music, Apple Music, and other major platforms
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Visual Progress Bar */}
                                                                    <div className="mt-4">
                                                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                            <span>Streaming Pattern Match</span>
                                                                            <span>{scoreValue.toFixed(1)}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                                                            <div 
                                                                                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                                                                                style={{ width: `${scoreValue}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                } else {
                                                    // Regular display for other categories
                                                return (
                                                    <div key={category} className={`p-4 rounded-lg ${categoryInfo.bgColor}`}>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={categoryInfo.textColor}>
                                                                    {categoryInfo.icon}
                                                                </div>
                                                                <span className={`text-lg font-semibold capitalize ${categoryInfo.textColor}`}>
                                                                    {category.replace(/_/g, ' ')}
                                                                </span>
                                                            </div>
                                                            <span className={`text-xl font-bold ${categoryInfo.textColor}`}>
                                                                {scoreValue.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="w-full bg-white dark:bg-gray-700 rounded-full h-4 shadow-inner">
                                                                <div 
                                                                    className={`h-4 rounded-full bg-gradient-to-r ${categoryInfo.color} transition-all duration-1000 ease-out shadow-sm`}
                                                                    style={{ width: `${scoreValue}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                                }
                                            })}
                                        </div>
                                    </div>

                                    {/* Enhanced AI Insights - Now takes up 50% of the width */}
                                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                                            <TrendingUp className="h-7 w-7" />
                                            AI Growth Insights
                                        </h3>
                                        
                                        {/* AI Processing State - Show loading messages during analysis */}
                                        {(isLoading || isSecondSearchLoading) ? (
                                            <div className="space-y-6">
                                                <div className="mb-6">
                                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                                        🔍 <span className="font-semibold text-blue-600">AI Analysis</span> in progress...
                                                    </p>
                                                </div>
                                                
                                                {/* Loading Messages */}
                                                {[
                                                    'Analyzing musical patterns and sonic characteristics...',
                                                    'Processing streaming data from Spotify and YouTube APIs...',
                                                    'Computing audience overlap across multiple platforms...',
                                                    'Generating personalized growth recommendations...',
                                                    'Finalizing data-driven insights and strategies...'
                                                ].map((loadingText, index) => (
                                                    <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm animate-pulse">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                                                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                                        </div>
                                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                                                                {loadingText}
                                                            </span>
                                                        </p>
                                                    </div>
                                                ))}
                                                
                                                {/* AI Processing Badge */}
                                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                                                            🤖 AI Processing Real-Time Data...
                                                        </span>
                                                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Actionable Insights */}
                                                {analysis.ai_similarity_analysis.actionable_insights && analysis.ai_similarity_analysis.actionable_insights.length > 0 ? (
                                                    <div className="space-y-6">
                                                        <div className="mb-6">
                                                            {analysis.ai_similarity_analysis.growth_target && analysis.ai_similarity_analysis.mentor_artist ? (
                                                                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                                                                    <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
                                                                        🎯 <span className="font-bold text-green-600 dark:text-green-400">{analysis.ai_similarity_analysis.growth_target}</span> can learn from <span className="font-bold text-blue-600 dark:text-blue-400">{analysis.ai_similarity_analysis.mentor_artist}</span>
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                                                    Ways <span className="font-semibold text-blue-600">{analysis.ai_similarity_analysis.growth_target || analysis.artist_comparison.searched.name}</span> can grow:
                                                                </p>
                                                            )}
                                                        </div>
                                                        {analysis.ai_similarity_analysis.actionable_insights.map((insight, index) => {
                                                            // Function to add gradient colors to key words and make links clickable
                                                            const highlightKeywords = (text: string) => {
                                                                const keywords = ['collaborate', 'experiment', 'develop', 'incorporate', 'explore', 'expand', 'focus', 'enhance', 'strengthen', 'diversify', 'target', 'amplify', 'refine', 'cultivate', 'leverage', 'should', 'can', 'try', 'implement', 'adopt', 'learn', 'follow', 'scale', 'submit', 'reach out', 'use', 'visit', 'start'];
                                                                let highlightedText = text;
                                                                
                                                                // Simple URL detection for common domains mentioned in insights
                                                                const domains = ['BeatStars.com', 'Splice.com', 'SubmitHub.com', 'Bandsintown.com', 'Songkick.com', 'GigSalad.com', 'MusicTheory.net', 'Buffer.com', 'Later.com', 'Hootsuite.com', 'TuneCore.com', 'Berklee Online', 'Daily Playlists', 'Playlist Push', 'Instagram', 'Twitter', 'Discord', 'Reddit', 'Social Blade', 'Point Blank Music School'];
                                                                
                                                                domains.forEach(domain => {
                                                                    const regex = new RegExp(`\\b${domain.replace('.', '\\.')}\\b`, 'gi');
                                                                    highlightedText = highlightedText.replace(regex, (match) => {
                                                                        let fullUrl;
                                                                        const lowerMatch = match.toLowerCase();
                                                                        
                                                                        // Handle special cases
                                                                        if (lowerMatch === 'instagram') {
                                                                            fullUrl = 'https://instagram.com';
                                                                        } else if (lowerMatch === 'twitter') {
                                                                            fullUrl = 'https://twitter.com';
                                                                        } else if (lowerMatch === 'discord') {
                                                                            fullUrl = 'https://discord.com';
                                                                        } else if (lowerMatch === 'reddit') {
                                                                            fullUrl = 'https://reddit.com';
                                                                        } else if (lowerMatch === 'berklee online') {
                                                                            fullUrl = 'https://online.berklee.edu';
                                                                        } else if (lowerMatch === 'point blank music school') {
                                                                            fullUrl = 'https://pointblankmusicschool.com';
                                                                        } else if (lowerMatch === 'social blade') {
                                                                            fullUrl = 'https://socialblade.com';
                                                                        } else if (lowerMatch === 'daily playlists') {
                                                                            fullUrl = 'https://dailyplaylists.com';
                                                                        } else if (lowerMatch === 'playlist push') {
                                                                            fullUrl = 'https://playlistpush.com';
                                                                        } else {
                                                                            // For domains with extensions, use as-is
                                                                            const url = match.includes('.') ? match : `${match}.com`;
                                                                            fullUrl = `https://${url.toLowerCase()}`;
                                                                        }
                                                                        
                                                                        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-semibold">${match}</a>`;
                                                                    });
                                                                });
                                                                
                                                                // Then highlight action keywords (but avoid ones already in links)
                                                                keywords.forEach(keyword => {
                                                                    const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, 'gi');
                                                                    highlightedText = highlightedText.replace(regex, 
                                                                        `<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">${keyword}</span>`
                                                                    );
                                                                });
                                                                
                                                                return highlightedText;
                                                            };
                                                            
                                                            return (
                                                                <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1 shadow-lg">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p 
                                                                            className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-words"
                                                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(insight) }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    // Enhanced AI-Generated Insights Fallback
                                                    <div className="space-y-6">
                                                        <div className="mb-6">
                                                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                                                How <span className="font-semibold text-blue-600">{analysis.artist_comparison.comparable.name}</span> can learn from <span className="font-semibold text-purple-600">{analysis.artist_comparison.searched.name}</span>:
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Show actionable insights or fallback message */}
                                                        {(() => {
                                                            // Use the actual actionable insights from the backend
                                                            const actionableInsights = analysis.ai_similarity_analysis?.actionable_insights;
                                                            const growthTarget = analysis.ai_similarity_analysis?.growth_target;
                                                            const mentorArtist = analysis.ai_similarity_analysis?.mentor_artist;
                                                            
                                                            if (actionableInsights && actionableInsights.length > 0) {
                                                                // Display the real actionable insights from backend
                                                                return actionableInsights.map((insight, index) => {
                                                                    // Function to add gradient colors to key action words and make links clickable
                                                                    const highlightKeywords = (text: string) => {
                                                                        const keywords = ['should', 'can', 'try', 'implement', 'adopt', 'learn', 'follow', 'scale', 'target', 'focus', 'collaborate', 'optimize', 'expand', 'develop', 'key', 'strategy', 'approach', 'method', 'submit', 'reach out', 'use', 'visit', 'start'];
                                                                        let highlightedText = text;
                                                                        
                                                                        // Simple URL detection for common domains mentioned in insights
                                                                        const domains = ['BeatStars.com', 'Splice.com', 'SubmitHub.com', 'Bandsintown.com', 'Songkick.com', 'GigSalad.com', 'MusicTheory.net', 'Buffer.com', 'Later.com', 'Hootsuite.com', 'TuneCore.com', 'Berklee Online', 'Daily Playlists', 'Playlist Push', 'Instagram', 'Twitter', 'Discord', 'Reddit', 'Social Blade', 'Point Blank Music School'];
                                                                        
                                                                        domains.forEach(domain => {
                                                                            const regex = new RegExp(`\\b${domain.replace('.', '\\.')}\\b`, 'gi');
                                                                            highlightedText = highlightedText.replace(regex, (match) => {
                                                                                let fullUrl;
                                                                                const lowerMatch = match.toLowerCase();
                                                                                
                                                                                // Handle special cases
                                                                                if (lowerMatch === 'instagram') {
                                                                                    fullUrl = 'https://instagram.com';
                                                                                } else if (lowerMatch === 'twitter') {
                                                                                    fullUrl = 'https://twitter.com';
                                                                                } else if (lowerMatch === 'discord') {
                                                                                    fullUrl = 'https://discord.com';
                                                                                } else if (lowerMatch === 'reddit') {
                                                                                    fullUrl = 'https://reddit.com';
                                                                                } else if (lowerMatch === 'berklee online') {
                                                                                    fullUrl = 'https://online.berklee.edu';
                                                                                } else if (lowerMatch === 'point blank music school') {
                                                                                    fullUrl = 'https://pointblankmusicschool.com';
                                                                                } else if (lowerMatch === 'social blade') {
                                                                                    fullUrl = 'https://socialblade.com';
                                                                                } else if (lowerMatch === 'daily playlists') {
                                                                                    fullUrl = 'https://dailyplaylists.com';
                                                                                } else if (lowerMatch === 'playlist push') {
                                                                                    fullUrl = 'https://playlistpush.com';
                                                                                } else {
                                                                                    // For domains with extensions, use as-is
                                                                                    const url = match.includes('.') ? match : `${match}.com`;
                                                                                    fullUrl = `https://${url.toLowerCase()}`;
                                                                                }
                                                                                
                                                                                return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-semibold">${match}</a>`;
                                                                            });
                                                                        });
                                                                        
                                                                        // Then highlight action keywords (but avoid ones already in links)
                                                                        keywords.forEach(keyword => {
                                                                            const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, 'gi');
                                                                            highlightedText = highlightedText.replace(regex, 
                                                                                `<span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-semibold">${keyword}</span>`
                                                                            );
                                                                        });
                                                                        
                                                                        return highlightedText;
                                                                    };
                                                                    
                                                                    return (
                                                                        <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                                                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1 shadow-lg">
                                                                                {index + 1}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p 
                                                                                    className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-words"
                                                                                    dangerouslySetInnerHTML={{ __html: highlightKeywords(insight) }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                });
                                                            } else {
                                                                // Fallback message if no actionable insights available
                                                                return (
                                                                    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                                        <p className="text-yellow-800 dark:text-yellow-300 text-center">
                                                                            🔄 AI is analyzing the artists to generate actionable growth insights. Please try again in a moment.
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                        })()}
                                                        
                                                        {/* AI Analysis Badge */}
                                                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                                    AI-Powered Data-Driven Insights
                                                                </span>
                                                                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Key Similarities */}
                                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg shadow-sm">
                                        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Key Similarities
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysis.ai_similarity_analysis.key_similarities.map((similarity, index) => (
                                                <li key={index} className="text-sm text-green-700 dark:text-green-400 flex items-start gap-3">
                                                    <span className="text-green-500 text-lg">✓</span>
                                                    <span className="leading-relaxed">{similarity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Key Differences */}
                                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-sm">
                                        <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Key Differences
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysis.ai_similarity_analysis.key_differences.map((difference, index) => (
                                                <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-3">
                                                    <span className="text-red-500 text-lg">×</span>
                                                    <span className="leading-relaxed">{difference}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Market Tier Analysis (for Enhanced Spotify Analysis) */}
                                {analysis.ai_similarity_analysis.market_tiers && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
                                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Market Tier Analysis
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                                                    {analysis.artist_comparison.searched.name}
                                                </div>
                                                <div className="text-lg font-semibold text-blue-800 dark:text-blue-300 capitalize">
                                                    {analysis.ai_similarity_analysis.market_tiers.searched_artist}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                                                    {analysis.artist_comparison.comparable.name}
                                                </div>
                                                <div className="text-lg font-semibold text-blue-800 dark:text-blue-300 capitalize">
                                                    {analysis.ai_similarity_analysis.market_tiers.comparable_artist}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 text-center">
                                            Market tiers: Developing → Emerging → Mainstream → Superstar
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}

                                                {/* Enhanced Spotify Analysis Insights */}
                        {analysis.ai_similarity_analysis.analysis_method === 'enhanced_spotify' && (
                            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 dark:from-green-950/20 dark:to-blue-950/20 dark:border-green-800/30 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <Music className="h-6 w-6 text-green-600" />
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                        Enhanced Spotify Analysis
                                    </h2>
                                    <Badge variant="default" className="bg-green-600 text-white">
                                        Multi-Dimensional
                                    </Badge>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-green-600" />
                                        Advanced Analysis Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Genre compatibility analysis</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Market tier classification</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Logarithmic audience scaling</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span>Popularity trend analysis</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>Commercial performance metrics</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span>AI-powered insights</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="font-medium text-green-800 dark:text-green-300">Works with Any Artist</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        This enhanced analysis works with any artist on Spotify, providing professional-grade 
                                        insights using advanced algorithms and market intelligence.
                                    </p>
                                </div>
                            </Card>
                        )}
 
                         {/* SoundCharts Professional Insights */}
                        {analysis.ai_similarity_analysis.analysis_method === 'soundcharts_professional' && (
                            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800/30 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <Database className="h-6 w-6 text-purple-600" />
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                        SoundCharts Professional Insights
                                    </h2>
                                    <Badge variant="default" className="bg-purple-600 text-white">
                                        Industry Data
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Data Source Information */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Data Sources
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Real-time streaming metrics</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Social media followers & engagement</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Chart performance & rankings</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span>Audience demographics</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analysis Method */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-blue-600" />
                                            Analysis Method
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                            <p>Multi-dimensional comparison using:</p>
                                            <div className="ml-4 space-y-1">
                                                <div>• Genre classification algorithms</div>
                                                <div>• Audience overlap analysis</div>
                                                <div>• Streaming pattern recognition</div>
                                                <div>• Market positioning metrics</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Demo Notice for Sandbox */}
                                {analysis.soundcharts_data.searched_artist?.is_sandbox_demo && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                            <span className="font-medium text-yellow-800 dark:text-yellow-300">Demo Mode</span>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Using demo data from SoundCharts sandbox. In production, this would show real-time industry data 
                                            for <strong>{analysis.soundcharts_data.searched_artist.original_query}</strong>.
                                        </p>
                                    </div>
                                )}

                                {/* Professional Metrics Preview */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Professional Metrics Available</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">SoundCharts Score</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">Industry ranking</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">Audience Growth</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">Monthly trends</div>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">Chart Performance</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">Global rankings</div>
                                        </div>
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <Database className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">Streaming Data</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">Platform breakdown</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* News Articles */}
                        {(analysis.searched_artist_news || analysis.comparable_artist_news) && (
                            <Card className="bg-white p-6 rounded-lg">
                                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Latest News</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Searched Artist News */}
                                    {analysis.searched_artist_news && analysis.searched_artist_news.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                                {analysis.artist_comparison.searched.name} News
                                            </h3>
                                            <div className="space-y-4">
                                                {analysis.searched_artist_news.map((article, index) => (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                                                            <a 
                                                                href={article.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="hover:text-blue-600"
                                                            >
                                                                {article.title}
                                                            </a>
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {article.description}
                                                        </p>
                                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                                            <span>{article.source}</span>
                                                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Comparable Artist News */}
                                    {analysis.comparable_artist_news && analysis.comparable_artist_news.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                                {analysis.artist_comparison.comparable.name} News
                                            </h3>
                                            <div className="space-y-4">
                                                {analysis.comparable_artist_news.map((article, index) => (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                                                            <a 
                                                                href={article.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="hover:text-blue-600"
                                                            >
                                                                {article.title}
                                                            </a>
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {article.description}
                                                        </p>
                                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                                            <span>{article.source}</span>
                                                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {(searchedArtistStats || comparableArtistStats) && (
                    <div className="mt-8">
                        <ArtistStatsDisplay 
                            stats={searchedArtistStats} 
                            comparableStats={comparableArtistStats}
                        />
                    </div>
                )}
        </div>
    );
};

export default AIRecommendationTool;
