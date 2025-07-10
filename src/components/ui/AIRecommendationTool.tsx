import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, AlertTriangle, BarChart2, Music, Star, Info, ArrowRight, Users, DollarSign, Target, Zap } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { API_ENDPOINTS } from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatLargeNumber, formatCurrency } from '@/lib/utils';

interface ArtistAnalysis {
  artist: {
    name: string;
    avatar?: string;
    genres: string[];
    followers: number;
    tier: {
      tier: string;
      description: string;
      composite_score: number;
      enhanced_data: {
        instagram_followers: number;
        net_worth_millions: number;
        youtube_subscribers: number;
        monthly_streams_millions: number;
      };
    };
  };
  comparable_artist: {
    name: string;
    avatar?: string;
    genres: string[];
    followers: number;
    tier: {
      tier: string;
      description: string;
      composite_score: number;
      enhanced_data: {
        instagram_followers: number;
        net_worth_millions: number;
        youtube_subscribers: number;
        monthly_streams_millions: number;
      };
    };
  };
  musistash_resonance_score: {
    musistash_resonance_score: number;
    similarity_score: number;
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
      market_comparison: {
        relative_market_position: string;
        competitive_analysis: string;
      };
      data_completeness: number;
      api_coverage: {
        spotify: boolean;
        youtube: boolean;
        genius: boolean;
        gemini: boolean;
      };
    };
    detailed_breakdown: {
      spotify_contribution: number;
      youtube_contribution: number;
      genius_contribution: number;
      cross_platform_bonus: number;
      base_score: number;
      ensemble_score: number;
    };
  };
}

// Enhanced score calculation functions that use REAL API data
const calculateSimilarityScore = (artist: any, comparable: any, breakdown: any): number => {
  if (!artist || !comparable || !breakdown) return 0;
  
  // Use real API data for similarity calculation
  const followerRatio = Math.min(
    (artist.followers || 0) / Math.max((comparable.followers || 1), 1), 
    1
  ) * 100;
  
  // Genre similarity based on actual genres
  const genreOverlap = calculateGenreOverlap(artist.genres || [], comparable.genres || []);
  
  // Platform engagement from real breakdown data
  const platformSimilarity = breakdown.cross_platform_bonus || 0;
  
  // Market tier similarity
  const marketTierSimilarity = calculateMarketTierSimilarity(artist.followers || 0, comparable.followers || 0);
  
  // Weighted calculation using real data
  const similarity = (
    (genreOverlap * 0.35) + 
    (followerRatio * 0.25) + 
    (platformSimilarity * 0.25) + 
    (marketTierSimilarity * 0.15)
  );
  
  return Math.max(10, Math.min(95, similarity));
};

const calculateResonanceScore = (artist: any, comparable: any, breakdown: any): number => {
  if (!artist || !comparable || !breakdown) return 0;
  
  const artistFollowers = artist.followers || 0;
  const comparableFollowers = comparable.followers || 0;
  
  // Use real API breakdown data
  const spotifyContribution = breakdown.spotify_contribution || 0;
  const youtubeContribution = breakdown.youtube_contribution || 0;
  const geniusContribution = breakdown.genius_contribution || 0;
  const crossPlatformBonus = breakdown.cross_platform_bonus || 0;
  const baseScore = breakdown.base_score || 0;
  
  // CRITICAL: For smaller artists with growth potential, boost the score
  const growthPotentialMultiplier = calculateGrowthPotential(artistFollowers, comparableFollowers, artist.genres || []);
  
  // Enhanced resonance calculation using real API data
  const resonance = (
    (spotifyContribution * 0.3) +
    (youtubeContribution * 0.25) +
    (geniusContribution * 0.2) +
    (crossPlatformBonus * 0.15) +
    (baseScore * 0.1)
  ) * growthPotentialMultiplier;
  
  return Math.max(10, Math.min(98, resonance));
};

// Helper functions
const calculateGenreOverlap = (genres1: string[], genres2: string[]): number => {
  if (!genres1.length || !genres2.length) return 0;
  
  const set1 = new Set(genres1.map(g => g.toLowerCase()));
  const set2 = new Set(genres2.map(g => g.toLowerCase()));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  return (intersection.size / Math.max(set1.size, set2.size)) * 100;
};

const calculateMarketTierSimilarity = (followers1: number, followers2: number): number => {
  const ratio = Math.min(followers1, followers2) / Math.max(followers1, followers2);
  return ratio * 100;
};

const calculateGrowthPotential = (artistFollowers: number, comparableFollowers: number, genres: string[]): number => {
  // If the artist is significantly smaller but in trending genres, boost potential
  const followerRatio = artistFollowers / Math.max(comparableFollowers, 1);
  
  // Trending genres get higher multipliers
  const trendingGenres = ['rap', 'hip hop', 'trap', 'drill', 'phonk', 'hyperpop'];
  const hasTrendingGenre = genres.some(genre => 
    trendingGenres.some(trending => genre.toLowerCase().includes(trending))
  );
  
  if (followerRatio < 0.1 && hasTrendingGenre) {
    // Small artist in trending genre - high growth potential
    return 1.4;
  } else if (followerRatio < 0.5 && hasTrendingGenre) {
    // Medium artist in trending genre - moderate growth potential
    return 1.2;
  } else if (followerRatio < 0.1) {
    // Small artist in any genre - some growth potential
    return 1.1;
  }
  
  return 1.0; // No multiplier for established artists
};

const CircularProgress = ({ value, label, color, size = "lg" }: { 
  value: number; 
  label: string; 
  color: string; 
  size?: "sm" | "lg";
}) => {
  const sizeClass = size === "sm" ? "w-16 h-16" : "w-24 h-24";
  const textSize = size === "sm" ? "text-sm" : "text-xl";
  
  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative ${sizeClass}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className={color}
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * value) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className={`${textSize} font-bold text-white`}>{Math.round(value)}%</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">{label}</div>
    </div>
  );
};

const CompactArtistCard = ({ artist, label, isTarget = false }: { 
  artist: any; 
  label: string; 
  isTarget?: boolean;
}) => (
  <div className={`p-4 rounded-lg border ${isTarget ? 'border-blue-500/30 bg-blue-500/5' : 'border-gray-700 bg-gray-800/50'}`}>
    <div className="space-y-3">
      {/* Header with label and tier */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">{label}</div>
        {artist?.tier?.tier && (
          <div className="bg-purple-500 text-xs px-2 py-1 rounded-full font-medium text-white">
            {artist.tier.tier}
          </div>
        )}
      </div>
      
      {/* Artist info row */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
          {artist?.avatar ? (
            <img 
              src={artist.avatar} 
              alt={artist.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Music className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-semibold text-white truncate mb-1">
            {artist?.name}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mb-2">
            {artist?.followers 
              ? `${formatLargeNumber(artist.followers)} followers`
              : 'Emerging Artist'
            }
          </div>
        </div>
      </div>
      
      {/* Genre Tags */}
      <div className="flex flex-wrap gap-1.5">
        {artist?.genres?.slice(0, 4).map((genre: string, index: number) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
          >
            {genre}
          </span>
        ))}
        {artist?.genres?.length > 4 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
            +{artist.genres.length - 4} more
          </span>
        )}
      </div>
    </div>
  </div>
);

const MetricBar = ({ label, value, color = "blue", description }: { 
  label: string; 
  value: number; 
  color?: string;
  description?: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="text-xs sm:text-sm text-gray-300 font-medium">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      <span className={`text-sm sm:text-base font-bold text-${color}-400 ml-2`}>
        {Math.round(value)}%
      </span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

const ResultsDisplay = ({ data }: { data: ArtistAnalysis }) => {
  if (!data?.musistash_resonance_score) return null;

  const { detailed_breakdown, key_drivers, risk_factors, musistash_analysis } = data.musistash_resonance_score;
  
  // Calculate enhanced scores using REAL API data
  const enhancedSimilarityScore = calculateSimilarityScore(
    data.artist, 
    data.comparable_artist, 
    detailed_breakdown
  );
  
  const enhancedResonanceScore = calculateResonanceScore(
    data.artist, 
    data.comparable_artist, 
    detailed_breakdown
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Artist Comparison Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CompactArtistCard 
          artist={data.artist} 
          label="Target Artist" 
          isTarget={true}
        />
        <CompactArtistCard 
          artist={data.comparable_artist} 
          label="Benchmark Artist" 
        />
      </div>

      {/* Main Analysis - Mobile First Layout */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Scores Section - Full width on mobile, sidebar on desktop */}
        <div className="lg:col-span-4 space-y-4">
          {/* Resonance Score */}
          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-blue-500/20">
            <div className="text-center">
              <CircularProgress 
                value={enhancedResonanceScore} 
                label="Resonance Score" 
                color="text-blue-500"
                size="lg"
              />
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium text-blue-400">Commercial Potential</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Success probability based on genre alignment, growth trajectory, and market positioning
                </div>
              </div>
            </div>
          </div>

          {/* Similarity Score */}
          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-purple-500/20">
            <div className="text-center">
              <CircularProgress 
                value={enhancedSimilarityScore} 
                label="Similarity Score" 
                color="text-purple-500"
                size="lg"
              />
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium text-purple-400">Artistic Alignment</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Genre compatibility, audience overlap, and artistic style matching
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Details - Full width on mobile, main content on desktop */}
        <div className="lg:col-span-8 space-y-4">
          {/* Performance Breakdown - Using REAL API Data */}
          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              Performance Breakdown
            </h3>
            <div className="space-y-4">
              <MetricBar 
                label="Spotify Contribution" 
                value={detailed_breakdown.spotify_contribution || 0}
                color="green"
                description="Streaming metrics and audio features"
              />
              <MetricBar 
                label="YouTube Contribution" 
                value={detailed_breakdown.youtube_contribution || 0}
                color="red"
                description="Video content and engagement"
              />
              <MetricBar 
                label="Genius Contribution" 
                value={detailed_breakdown.genius_contribution || 0}
                color="yellow"
                description="Lyrical content and cultural relevance"
              />
              <MetricBar 
                label="Cross-Platform Bonus" 
                value={detailed_breakdown.cross_platform_bonus || 0}
                color="purple"
                description="Multi-platform consistency"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="text-gray-400">
                  <span className="font-medium">Base Score:</span> {Math.round(detailed_breakdown.base_score || 0)}%
                </div>
                <div className="text-gray-400">
                  <span className="font-medium">Ensemble Score:</span> {Math.round(detailed_breakdown.ensemble_score || 0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Financial Insights - Stacked on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Artist */}
            <div className="bg-gray-800/50 p-4 sm:p-5 rounded-lg border border-green-500/20">
              <h4 className="text-sm sm:text-base font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="truncate">{data.artist.name}</span>
              </h4>
              {data.artist.tier?.enhanced_data ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">Net Worth</span>
                    <span className="text-sm sm:text-base font-semibold text-green-400">
                      ${data.artist.tier.enhanced_data.net_worth_millions}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">Monthly Streams</span>
                    <span className="text-sm sm:text-base font-semibold text-green-400">
                      {formatLargeNumber(data.artist.tier.enhanced_data.monthly_streams_millions * 1000000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">YouTube Subs</span>
                    <span className="text-sm sm:text-base font-semibold text-green-400">
                      {formatLargeNumber(data.artist.tier.enhanced_data.youtube_subscribers)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Emerging artist with growing potential across social platforms and streaming services.
                </div>
              )}
            </div>

            {/* Benchmark Artist */}
            <div className="bg-gray-800/50 p-4 sm:p-5 rounded-lg border border-blue-500/20">
              <h4 className="text-sm sm:text-base font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="truncate">{data.comparable_artist.name}</span>
              </h4>
              {data.comparable_artist.tier?.enhanced_data ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">Net Worth</span>
                    <span className="text-sm sm:text-base font-semibold text-blue-400">
                      ${data.comparable_artist.tier.enhanced_data.net_worth_millions}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">Monthly Streams</span>
                    <span className="text-sm sm:text-base font-semibold text-blue-400">
                      {formatLargeNumber(data.comparable_artist.tier.enhanced_data.monthly_streams_millions * 1000000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-400">YouTube Subs</span>
                    <span className="text-sm sm:text-base font-semibold text-blue-400">
                      {formatLargeNumber(data.comparable_artist.tier.enhanced_data.youtube_subscribers)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Established artist with proven commercial success and market presence.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights - Full width, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 sm:p-5 rounded-lg border border-gray-700">
          <h4 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            Key Drivers
          </h4>
          <ul className="space-y-2">
            {key_drivers.slice(0, 4).map((driver, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-300 leading-relaxed">{driver}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-800/50 p-4 sm:p-5 rounded-lg border border-gray-700">
          <h4 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Risk Factors
          </h4>
          <ul className="space-y-2">
            {risk_factors.slice(0, 4).map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-300 leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* API Data Quality Indicator */}
      <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-400">
            <span className="font-medium">Data Sources:</span> 
            <span className={`ml-1 ${musistash_analysis.api_coverage.spotify ? 'text-green-400' : 'text-red-400'}`}>
              Spotify
            </span>
            <span className={`ml-1 ${musistash_analysis.api_coverage.youtube ? 'text-green-400' : 'text-red-400'}`}>
              | YouTube
            </span>
            <span className={`ml-1 ${musistash_analysis.api_coverage.genius ? 'text-green-400' : 'text-red-400'}`}>
              | Genius
            </span>
            <span className={`ml-1 ${musistash_analysis.api_coverage.gemini ? 'text-green-400' : 'text-red-400'}`}>
              | AI Analysis
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            <span className="font-medium">Data Quality:</span> {musistash_analysis.data_completeness || 85}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIRecommendationTool = () => {
  const [primaryArtist, setPrimaryArtist] = useState('');
  const [compareArtist, setCompareArtist] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ArtistAnalysis | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryArtist.trim()) return;

    setIsLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(
        API_ENDPOINTS.analyzeArtist(primaryArtist, compareArtist.trim() || undefined)
      );
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error:', err);
      setError(`Failed to analyze artist: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold">AI Artist Analysis</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Get comprehensive insights on artist commercial potential and market positioning
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={primaryArtist}
                onChange={(e) => setPrimaryArtist(e.target.value)}
                placeholder="Enter target artist name..."
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={compareArtist}
                onChange={(e) => setCompareArtist(e.target.value)}
                placeholder="Enter comparison artist (optional)..."
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading || !primaryArtist.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Artists
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-red-400 mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-sm"
          >
            {error}
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <Sparkles className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Analyzing artist data and market positioning...</p>
          </motion.div>
        )}

        {data && <ResultsDisplay data={data} />}
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendationTool;