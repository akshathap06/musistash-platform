import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { Progress } from './progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArtistInfo from './ArtistInfo';
import { getArtistStats, ArtistStats, processRawArtistStats } from '../../services/artistStats';
import ArtistStatsDisplay from './ArtistStatsDisplay';
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
            audience_size_similarity: number;
            chart_performance_similarity: number;
        };
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
            // Use local backend for development
            const apiUrl = 'http://localhost:8000';
            let url = `${apiUrl}/analyze-artist/${encodeURIComponent(artistName)}`;
            
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
            } else {
                setIsLoading(false);
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
            <Card className="bg-white text-white p-6 md:p-8 rounded-xl shadow-lg border-2 border-blue-500/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">AI-Powered Investment Insights</h1>
                    <p className="text-gray-400 mt-2">
                        Our AI analyzes musical similarity and provides investment recommendations based on comparable successful artists.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                    <Input
                        type="text"
                        placeholder="Enter an artist name..."
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className="w-full md:w-1/2 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleFirstArtistSearch()}
                    />
                    <Button onClick={handleFirstArtistSearch} disabled={isLoading} className="w-full md:w-auto">
                        {isLoading ? 'Analyzing...' : 'Analyze'}
                    </Button>
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
                        <Card className="bg-white p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold text-center mb-6">Artist Comparison</h2>
                            <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                                {/* First Artist */}
                                <div className="flex flex-col items-center">
                                    <ArtistInfo
                                        artist={{
                                            id: analysis.artist_comparison.searched.id || '',
                                            name: analysis.artist_comparison.searched.name,
                                            avatar: analysis.artist_comparison.searched.avatar || '',
                                            bio: analysis.artist_comparison.searched.bio || '',
                                            genres: analysis.artist_comparison.searched.genres,
                                            followers: analysis.artist_comparison.searched.followers,
                                            verified: analysis.artist_comparison.searched.verified,
                                            successRate: analysis.artist_comparison.searched.successRate
                                        }}
                                    />
                                </div>

                                <div className="text-2xl font-bold text-gray-500">vs</div>

                                {/* Second Artist with Search Option */}
                                <div className="flex flex-col items-center relative">
                                    <ArtistInfo
                                        artist={{
                                            id: analysis.artist_comparison.comparable.id || '',
                                            name: analysis.artist_comparison.comparable.name,
                                            avatar: analysis.artist_comparison.comparable.avatar || '',
                                            bio: analysis.artist_comparison.comparable.bio || '',
                                            genres: analysis.artist_comparison.comparable.genres,
                                            followers: analysis.artist_comparison.comparable.followers,
                                            verified: analysis.artist_comparison.comparable.verified,
                                            successRate: analysis.artist_comparison.comparable.successRate
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* AI Similarity Analysis */}
                        {analysis.ai_similarity_analysis && (
                            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800/30 p-6 rounded-lg">
                                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
                                    AI Similarity Analysis
                                </h2>
                                
                                {/* Similarity Score */}
                                <div className="text-center mb-8">
                                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {analysis.ai_similarity_analysis.similarity_score}%
                                    </div>
                                    <div className="text-lg text-gray-600 dark:text-gray-300">Overall Similarity Score</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Category Scores */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Category Breakdown</h3>
                                        <div className="space-y-3">
                                            {Object.entries(analysis.ai_similarity_analysis.category_scores).map(([category, score]) => (
                                                <div key={category} className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                                        {category.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex items-center">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full" 
                                                                style={{ width: `${score}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                                            {score}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Reasoning */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">AI Analysis</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {analysis.ai_similarity_analysis.reasoning}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Key Similarities */}
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Key Similarities</h3>
                                        <ul className="space-y-2">
                                            {analysis.ai_similarity_analysis.key_similarities.map((similarity, index) => (
                                                <li key={index} className="text-sm text-green-700 dark:text-green-400 flex items-start">
                                                    <span className="text-green-500 mr-2">✓</span>
                                                    {similarity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Key Differences */}
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">Key Differences</h3>
                                        <ul className="space-y-2">
                                            {analysis.ai_similarity_analysis.key_differences.map((difference, index) => (
                                                <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start">
                                                    <span className="text-red-500 mr-2">×</span>
                                                    {difference}
                                                </li>
                                            ))}
                                        </ul>
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
            </Card>
        </div>
    );
};

export default AIRecommendationTool;
