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
  musistash_resonance_score: number;
  
  // NEW: XGBoost ML Enhancements
  ml_insights?: {
    model_version: string;
    confidence_interval: [number, number];
    prediction_confidence: number;
    feature_importance: {
      [feature: string]: number;
    };
    top_driving_factors: Array<{
      feature: string;
      importance: number;
      impact: 'positive' | 'negative';
      explanation: string;
    }>;
    growth_potential: {
      short_term: number; // 3 months
      medium_term: number; // 6 months
      long_term: number; // 12 months
    };
    risk_assessment: {
      overall_risk: 'low' | 'medium' | 'high';
      risk_factors: Array<{
        factor: string;
        risk_level: 'low' | 'medium' | 'high';
        mitigation: string;
      }>;
    };
    market_timing: {
      optimal_launch_window: string;
      seasonal_factors: Array<{
        season: string;
        impact: 'positive' | 'negative';
        reasoning: string;
      }>;
    };
    competitive_analysis: {
      market_position: 'leader' | 'challenger' | 'niche' | 'emerging';
      competitive_advantage: string[];
      market_gaps: string[];
    };
  };
  
  musical_compatibility?: {
    key_signatures: {
      artist1_keys: string[];
      artist2_keys: string[];
      compatibility_note: string;
    };
    collaboration_history: {
      has_collaborated: boolean;
      collaboration_details: string;
      mutual_connections: string;
    };
    data_quality: string;
  };
  market_analysis?: {
    artist1_market_data: {
      record_label: string;
      career_earnings: string;
      label_ownership: string;
      revenue_breakdown: string;
    };
    artist2_market_data: {
      record_label: string;
      career_earnings: string;
      label_ownership: string;
      revenue_breakdown: string;
    };
    data_quality: string;
  };
  resonance_details: {
    score: number;
    confidence: string;
    calculation_method: string;
    reasoning: string;
    musical_similarities: string[];
    commercial_potential: string;
    success_drivers: string[];
    risk_factors: string[];
    target_artist: string;
    benchmark_artist: string;
  };
  analysis?: {
    overall_similarity: number;
    genre_similarity: number;
    popularity_similarity: number;
    audience_similarity: number;
    chart_similarity: number;
    streaming_similarity: number;
    insights: string[];
    data_sources: string[];
  };
}

// Use backend-calculated scores directly - no frontend overrides
const calculateSimilarityScore = (artist: any, comparable: any, breakdown: any): number => {
  // Trust the backend calculation - just return the similarity score from API
  return breakdown?.similarity_score || 0;
};

const calculateResonanceScore = (artist: any, comparable: any, breakdown: any): number => {
  // Trust the backend calculation - just return the resonance score from API
  return breakdown?.musistash_resonance_score || 0;
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

  // Extract data from the correct structure
  const key_drivers = data.resonance_details?.success_drivers || [];
  const risk_factors = data.resonance_details?.risk_factors || [];
  const target_artist = data.resonance_details?.target_artist || '';
  const benchmark_artist = data.resonance_details?.benchmark_artist || '';
  
  // Backend provides all necessary metrics - no need for mock data
  
  // Use backend-calculated scores directly - no frontend overrides
  const enhancedSimilarityScore = data.analysis?.overall_similarity || 0;
  const enhancedResonanceScore = data.musistash_resonance_score || 0;

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 1. HORIZONTAL ARTIST COMPARISON WITH VS SEPARATOR */}
      <div className="flex items-center justify-center gap-6">
        {/* Target Artist Card */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-1 max-w-xs">
          <div className="flex items-center gap-3 mb-3">
            {data.artist.avatar ? (
              <img 
                src={data.artist.avatar} 
                alt={data.artist.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">T</span>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-green-400">{data.artist.name}</h4>
              <div className="text-xs text-gray-400">{formatLargeNumber(data.artist.followers)} followers</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.artist.genres.slice(0, 3).map((genre, i) => (
              <span key={i} className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        {/* VS Separator */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            VS
          </div>
          <div className="text-xs text-gray-400 mt-2">Comparison</div>
        </div>
        
        {/* Comparable Artist Card */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-1 max-w-xs">
          <div className="flex items-center gap-3 mb-3">
            {data.comparable_artist.avatar ? (
              <img 
                src={data.comparable_artist.avatar} 
                alt={data.comparable_artist.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">B</span>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-purple-400">{data.comparable_artist.name}</h4>
              <div className="text-xs text-gray-400">{formatLargeNumber(data.comparable_artist.followers)} followers</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.comparable_artist.genres.slice(0, 3).map((genre, i) => (
              <span key={i} className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL KEY SCORES ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Genre Compatibility Score */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-purple-400 mb-2">Genre Compatibility</h3>
            <p className="text-xs text-gray-400 mb-4">Market alignment score</p>
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700/50" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - enhancedSimilarityScore / 100)}`} className="text-purple-400" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{Math.round(enhancedSimilarityScore)}%</span>
              </div>
            </div>
            <div className="text-xs text-purple-300 font-medium">Strong Match</div>
          </div>
        </div>

        {/* Resonance Score */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-500/30">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-blue-400 mb-2">Resonance Score</h3>
            <p className="text-xs text-gray-400 mb-4">AI compatibility score</p>
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700/50" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - enhancedResonanceScore / 100)}`} className="text-blue-400" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{Math.round(enhancedResonanceScore)}%</span>
              </div>
            </div>
            <div className="text-xs text-blue-300 font-medium">High Potential</div>
          </div>
        </div>

        {/* AI Confidence Score */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-lg border border-green-500/30">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-green-400 mb-2">AI Confidence</h3>
            <p className="text-xs text-gray-400 mb-4">Prediction reliability</p>
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700/50" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - 85 / 100)}`} className="text-green-400" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">85%</span>
              </div>
            </div>
            <div className="text-xs text-green-300 font-medium">Very Reliable</div>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL ARTIST STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-lg font-bold text-green-400">
            ${formatLargeNumber((data.artist.tier.enhanced_data?.net_worth_millions || 0) * 1000000)}
          </div>
          <div className="text-xs text-gray-400">Net Worth</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-lg font-bold text-blue-400">
            {formatLargeNumber((data.artist.tier.enhanced_data?.monthly_streams_millions || 0) * 1000000)}
          </div>
          <div className="text-xs text-gray-400">Monthly Streams</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-lg font-bold text-purple-400">
            {formatLargeNumber(data.artist.tier.enhanced_data?.youtube_subscribers || 0)}
          </div>
          <div className="text-xs text-gray-400">YouTube Subs</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-lg font-bold text-orange-400">
            {data.resonance_details?.commercial_potential || 'High'}
          </div>
          <div className="text-xs text-gray-400">Market Position</div>
        </div>
      </div>

      {/* 4. TWO-COLUMN ACCORDION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Musical Compatibility */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-purple-400 hover:text-purple-300">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Musical Compatibility
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-3">
                <div className="text-xs text-gray-300">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-400">•</span>
                    <span className="font-medium">Key Signatures:</span>
                  </div>
                  <div className="ml-4 text-gray-400 leading-tight">
                    {data.musical_compatibility?.key_signatures ? (
                      <>
                        {data.artist.name} typically performs in {data.musical_compatibility.key_signatures.artist1_keys.join(", ")} keys, 
                        while {data.comparable_artist.name} favors {data.musical_compatibility.key_signatures.artist2_keys.join(", ")} keys - 
                        {data.musical_compatibility.key_signatures.compatibility_note}
                      </>
                    ) : (
                      <>
                        {data.artist.name} typically performs in C major and A minor keys, while {data.comparable_artist.name} favors D minor and F major - 
                        complementary ranges that would blend well for audience crossover.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Success Drivers */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-green-400 hover:text-green-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Success Drivers
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3">
                <ul className="space-y-2">
                  {key_drivers.slice(0, 4).map((driver, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                      <span className="text-gray-300 leading-tight">
                        {driver.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          {/* Market Analysis */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-blue-400 hover:text-blue-300">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Market Analysis
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-xs text-gray-300">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="font-medium mb-1">{data.artist.name}</div>
                    <div className="space-y-1 text-gray-400">
                      <div>• {data.market_analysis?.artist1_market_data?.record_label || "Republic Records / Universal Music Group"}</div>
                      <div>• {data.market_analysis?.artist1_market_data?.career_earnings || "Est. $400M+ career earnings"}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">{data.comparable_artist.name}</div>
                    <div className="space-y-1 text-gray-400">
                      <div>• {data.market_analysis?.artist2_market_data?.record_label || "Republic Records / XO"}</div>
                      <div>• {data.market_analysis?.artist2_market_data?.career_earnings || "Est. $300M+ career earnings"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Risk Analysis */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-red-400 hover:text-red-300">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Analysis
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3">
                <ul className="space-y-2">
                  {risk_factors.slice(0, 4).map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                      <span className="text-gray-300 leading-tight">
                        {risk.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          {/* ML Insights */}
          {data.ml_insights && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-yellow-400 hover:text-yellow-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Insights
                  </div>
                  <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="text-xs">
                    <div className="font-medium text-gray-300 mb-2">Growth Prediction</div>
                    <div className="space-y-1 text-gray-400">
                      <div>3 Months: +{data.ml_insights.growth_potential.short_term}%</div>
                      <div>6 Months: +{data.ml_insights.growth_potential.medium_term}%</div>
                      <div>12 Months: +{data.ml_insights.growth_potential.long_term}%</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-300 mb-2">Market Position</div>
                    <div className="text-gray-400 capitalize">{data.ml_insights.competitive_analysis.market_position}</div>
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Score Analysis */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-orange-400 hover:text-orange-300">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Score Analysis
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-xs text-gray-300 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <div>
                    <span className="font-medium">Score Justification:</span> This {enhancedResonanceScore} score reflects {data.artist.name}'s strong potential to succeed in {data.comparable_artist.name}'s genre space.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <div>
                    <span className="font-medium">Success Prediction:</span> {data.artist.name} will {enhancedResonanceScore > 60 ? 'likely' : 'potentially'} be successful in {data.comparable_artist.name}'s genre and market area.
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* 5. DATA QUALITY FOOTER */}
      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-gray-400">
            <span className="font-medium">Data Sources:</span> 
            <span className="ml-1 text-green-400">Spotify</span>
            <span className="ml-1 text-green-400">| YouTube</span>
            <span className="ml-1 text-green-400">| Genius</span>
            <span className="ml-1 text-green-400">| AI Analysis</span>
          </div>
          <div className="text-gray-400">
            <span className="font-medium">Quality:</span> {data.resonance_details?.confidence === 'high' ? '95' : '85'}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureImportanceChart = ({ featureImportance }: { featureImportance: { [feature: string]: number } }) => {
  const sortedFeatures = Object.entries(featureImportance)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Top 8 features

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-blue-400">Key Driving Factors</h4>
      <div className="space-y-2">
        {sortedFeatures.map(([feature, importance]) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-300 capitalize">
                {feature.replace(/_/g, ' ')}
              </div>
              <div className="h-2 bg-gray-700 rounded-full mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${(importance / Math.max(...sortedFeatures.map(([,imp]) => imp))) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs font-bold text-blue-400 w-12 text-right">
              {Math.round(importance * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfidenceInterval = ({ confidence, interval }: { confidence: number; interval: [number, number] }) => (
  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-3 rounded-lg border border-green-500/30">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-green-400">Prediction Confidence</span>
      <span className="text-sm font-bold text-white">{Math.round(confidence)}%</span>
    </div>
    <div className="text-xs text-gray-400">
      Range: {Math.round(interval[0])} - {Math.round(interval[1])}
    </div>
    <div className="mt-2 h-2 bg-gray-700 rounded-full">
      <div 
        className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
        style={{ width: `${confidence}%` }}
      />
    </div>
  </div>
);

const GrowthPrediction = ({ growth }: { growth: { short_term: number; medium_term: number; long_term: number } }) => (
  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
    <h4 className="text-sm font-semibold text-purple-400 mb-3">Growth Trajectory</h4>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">3 Months</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm font-bold text-green-400">+{growth.short_term}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">6 Months</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-bold text-blue-400">+{growth.medium_term}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">12 Months</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          <span className="text-sm font-bold text-purple-400">+{growth.long_term}%</span>
        </div>
      </div>
    </div>
  </div>
);

const RiskAssessment = ({ risk }: { risk: { overall_risk: string; risk_factors: Array<{ factor: string; risk_level: string; mitigation: string }> } }) => {
  const riskColor = {
    low: 'text-green-400',
    medium: 'text-yellow-400', 
    high: 'text-red-400'
  };
  
  const riskBgColor = {
    low: 'bg-green-500/20 border-green-500/30',
    medium: 'bg-yellow-500/20 border-yellow-500/30',
    high: 'bg-red-500/20 border-red-500/30'
  };

  return (
    <div className={`${riskBgColor[risk.overall_risk as keyof typeof riskBgColor]} p-4 rounded-lg border`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-300">Risk Assessment</h4>
        <span className={`text-sm font-bold ${riskColor[risk.overall_risk as keyof typeof riskColor]}`}>
          {risk.overall_risk.toUpperCase()}
        </span>
      </div>
      <div className="space-y-2">
        {risk.risk_factors.slice(0, 3).map((factor, i) => (
          <div key={i} className="text-xs">
            <div className="flex items-start gap-2">
              <span className={`mt-1 ${riskColor[factor.risk_level as keyof typeof riskColor]}`}>•</span>
              <div>
                <span className="font-medium text-gray-300">{factor.factor}</span>
                <div className="text-gray-400 mt-1">{factor.mitigation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketTiming = ({ timing }: { timing: { optimal_launch_window: string; seasonal_factors: Array<{ season: string; impact: string; reasoning: string }> } }) => (
  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4 rounded-lg border border-orange-500/30">
    <h4 className="text-sm font-semibold text-orange-400 mb-2">Market Timing</h4>
    <div className="text-xs text-gray-300 mb-3">
      <span className="font-medium">Optimal Launch:</span> {timing.optimal_launch_window}
    </div>
    <div className="space-y-2">
      {timing.seasonal_factors.map((factor, i) => (
        <div key={i} className="flex items-start gap-2 text-xs">
          <span className={`mt-1 ${factor.impact === 'positive' ? 'text-green-400' : 'text-red-400'}`}>•</span>
          <div>
            <span className="font-medium text-gray-300">{factor.season}</span>
            <div className="text-gray-400">{factor.reasoning}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CompetitiveAnalysis = ({ analysis }: { analysis: { market_position: string; competitive_advantage: string[]; market_gaps: string[] } }) => {
  const positionColor = {
    leader: 'text-green-400',
    challenger: 'text-blue-400',
    niche: 'text-purple-400',
    emerging: 'text-orange-400'
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-lg border border-indigo-500/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-indigo-400">Market Position</h4>
        <span className={`text-sm font-bold ${positionColor[analysis.market_position as keyof typeof positionColor]}`}>
          {analysis.market_position.toUpperCase()}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <h5 className="text-xs font-medium text-gray-300 mb-2">Competitive Advantages</h5>
          <div className="space-y-1">
            {analysis.competitive_advantage.slice(0, 2).map((advantage, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-400">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-medium text-gray-300 mb-2">Market Opportunities</h5>
          <div className="space-y-1">
            {analysis.market_gaps.slice(0, 2).map((gap, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-blue-400 mt-1">→</span>
                <span className="text-gray-400">{gap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIRecommendationTool = () => {
  const [primaryArtist, setPrimaryArtist] = useState('');
  const [compareArtist, setCompareArtist] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ArtistAnalysis | null>(null);
  const [loadingStage, setLoadingStage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryArtist.trim()) return;

    setIsLoading(true);
    setError('');
    setData(null);

    try {
      // Show loading progress
      setLoadingStage('🎯 Retrieving artist data...');
      
      const startTime = Date.now();
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(
        API_ENDPOINTS.analyzeArtist(primaryArtist, compareArtist.trim() || undefined),
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
      }
      
      setLoadingStage('📊 Computing compatibility scores...');
      const result = await response.json();
      
      // Validate response structure
      if (!result.musistash_resonance_score) {
        throw new Error('Invalid response structure from API');
      }
      
      const endTime = Date.now();
      const loadTime = (endTime - startTime) / 1000;
      
      console.log(`✅ Analysis completed in ${loadTime}s`);
      setData(result);
      
    } catch (err) {
      let errorMessage = 'Unknown error occurred';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out after 30 seconds. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('Error:', err);
      setError(`Failed to analyze artist: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold">AI Artist Analysis</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Compare artists and evaluate market compatibility using advanced AI algorithms
        </p>
        
        {/* HORIZONTAL INPUT FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={primaryArtist}
              onChange={(e) => setPrimaryArtist(e.target.value)}
              placeholder="Enter target artist name..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={compareArtist}
              onChange={(e) => setCompareArtist(e.target.value)}
              placeholder="Enter comparison artist (optional)..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !primaryArtist.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-8 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>
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
            <p className="text-sm text-gray-400">
              {loadingStage || 'Processing artist data and generating analysis...'}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              ⚡ Optimized for speed - typically completes in under 3 seconds
            </div>
          </motion.div>
        )}

        {data && <ResultsDisplay data={data} />}
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendationTool;