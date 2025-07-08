import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, AlertTriangle, BarChart2, Music, Star, Info, ArrowRight, Users, DollarSign } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { API_ENDPOINTS } from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtistAnalysis {
  artist: {
    name: string;
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
      genre_family_weight: number;
      content_similarity_weight: number;
      tour_revenue_impact: number;
      follower_growth_trend: number;
      youtube_metrics_score: number;
      cross_platform_engagement: number;
      base_score: number;
      ensemble_score: number;
    };
  };
}

const ScoreCard = ({ 
  label, 
  value, 
  color, 
  icon: Icon 
}: { 
  label: string; 
  value: number | string; 
  color: string;
  icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-${color} transition-colors duration-300`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' ? `${Math.round(value)}%` : value}
      </div>
    </div>
    <div className="text-sm text-gray-400">{label}</div>
  </motion.div>
);

const MetricBreakdown = ({ data }: { data: ArtistAnalysis }) => {
  const { detailed_breakdown, regression_summary } = data.musistash_resonance_score;
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-blue-400" />
        Score Breakdown
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Score Components</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Genre Impact</span>
              <span className="text-blue-400">{detailed_breakdown.genre_family_weight}%</span>
            </li>
            <li className="flex justify-between">
              <span>Content</span>
              <span className="text-red-400">{detailed_breakdown.content_similarity_weight}%</span>
            </li>
            <li className="flex justify-between">
              <span>Tour Revenue</span>
              <span className="text-yellow-400">{detailed_breakdown.tour_revenue_impact}%</span>
            </li>
            <li className="flex justify-between">
              <span>Growth Trend</span>
              <span className="text-green-400">{detailed_breakdown.follower_growth_trend}%</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Model Metrics</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>R² Score</span>
              <span className="text-purple-400">{regression_summary.r_squared}</span>
            </li>
            <li className="flex justify-between">
              <span>Accuracy</span>
              <span className="text-blue-400">{regression_summary.model_accuracy}</span>
            </li>
            <li className="flex justify-between">
              <span>Prediction Interval</span>
              <span className="text-gray-300">{regression_summary.prediction_interval}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const APIStatus = ({ coverage }: { coverage: ArtistAnalysis['musistash_resonance_score']['musistash_analysis']['api_coverage'] }) => (
  <div className="grid grid-cols-4 gap-2">
    {Object.entries(coverage).map(([api, status]) => (
      <div key={api} className={`text-center p-2 rounded ${status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {api.charAt(0).toUpperCase() + api.slice(1)}
      </div>
    ))}
  </div>
);

const ArtistCard = ({ artist, label }: { artist: any; label: string }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16 flex-shrink-0">
          <img 
            src={artist?.avatar} 
            alt={artist?.name}
            className="w-full h-full rounded-lg object-cover border border-purple-500/50"
          />
          <div className="absolute -top-2 -right-2 bg-purple-500 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
            {artist?.tier?.tier}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-xs text-gray-400 mb-0.5">{label}</div>
          <div className="text-lg font-bold truncate">{artist?.name}</div>
          <div className="text-sm text-gray-400">
            {artist?.followers?.toLocaleString()} followers
          </div>
        </div>
      </div>
      
      {/* Genres Tags */}
      <div className="flex flex-wrap gap-1.5">
        {artist?.genres?.map((genre: string, index: number) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CircularProgress = ({ value, label, color, className }: { value: number; label: string; color: string; className?: string }) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${color} bg-opacity-20`}>
      {label}
    </div>
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className={color}
          strokeWidth="12"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 - (251.2 * (value || 0)) / 100}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xl font-bold">{value ? `${Math.round(value)}%` : '0%'}</div>
      </div>
    </div>
  </div>
);

const ResultsDisplay = ({ data }: { data: ArtistAnalysis }) => {
  if (!data?.musistash_resonance_score) return null;

  const {
    musistash_resonance_score: resonanceScore,
    similarity_score: similarityScore,
    key_drivers,
    risk_factors,
    success_probability,
    musistash_analysis,
    detailed_breakdown
  } = data.musistash_resonance_score;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Artist Comparison */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ArtistCard artist={data.artist} label="Target Artist" />
          <ArtistCard artist={data.comparable_artist} label="Benchmark Artist" />
        </div>
      </div>

      {/* Scores Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
          <Star className="h-4 w-4 text-blue-400" />
          Performance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resonance Score */}
          <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900/50 border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
            <CircularProgress 
              value={resonanceScore} 
              label="Resonance Score" 
              color="text-blue-500"
              className="mb-4" 
            />
            <h4 className="text-lg font-semibold text-blue-400 mb-2">Commercial Potential</h4>
            <p className="text-sm text-gray-400 text-center">
              Measures {data.artist.name}'s likelihood of achieving similar commercial success as {data.comparable_artist.name}
            </p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>Based on market performance, growth, and engagement metrics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Music className="h-4 w-4 text-blue-400" />
                <span>Considers genre alignment and content similarity</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <BarChart2 className="h-4 w-4 text-purple-400" />
                <span>Analyzes tour revenue and cross-platform success</span>
              </div>
            </div>
          </div>

          {/* Similarity Score */}
          <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
            <CircularProgress 
              value={similarityScore || 0} 
              label="Similarity Score" 
              color="text-purple-500"
              className="mb-4"
            />
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Artistic Alignment</h4>
            <p className="text-sm text-gray-400 text-center">
              How closely {data.artist.name}'s artistic style matches with {data.comparable_artist.name}
            </p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Music className="h-4 w-4 text-purple-400" />
                <span>Genre family compatibility</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Lyrical themes and content analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Users className="h-4 w-4 text-purple-400" />
                <span>Audience demographic overlap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Target Artist Financial Data */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-green-500/20 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-green-400 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {data.artist.name}'s Financial Insights
            </h4>
            {data.artist.tier?.enhanced_data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-green-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Net Worth</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${data.artist.tier.enhanced_data.net_worth_millions}M
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-green-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Monthly Streams</div>
                    <div className="text-2xl font-bold text-green-400">
                      {data.artist.tier.enhanced_data.monthly_streams_millions}M
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-green-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">YouTube Subscribers</div>
                    <div className="text-2xl font-bold text-green-400">
                      {(data.artist.tier.enhanced_data.youtube_subscribers / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-green-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Instagram Followers</div>
                    <div className="text-2xl font-bold text-green-400">
                      {(data.artist.tier.enhanced_data.instagram_followers / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  {data.artist.name} is an emerging artist with growing potential. While detailed financial data isn't available yet, they're building a strong foundation through:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Active social media engagement and growing follower base</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Regular content releases and collaborations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Strong local/regional performance presence</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Benchmark Artist Financial Data */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-blue-500/20 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {data.comparable_artist.name}'s Financial Insights
            </h4>
            {data.comparable_artist.tier?.enhanced_data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-blue-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Net Worth</div>
                    <div className="text-2xl font-bold text-blue-400">
                      ${data.comparable_artist.tier.enhanced_data.net_worth_millions}M
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-blue-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Monthly Streams</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {data.comparable_artist.tier.enhanced_data.monthly_streams_millions}M
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-blue-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">YouTube Subscribers</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {(data.comparable_artist.tier.enhanced_data.youtube_subscribers / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-blue-500/10 backdrop-blur-sm">
                    <div className="text-sm text-gray-400 mb-1">Instagram Followers</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {(data.comparable_artist.tier.enhanced_data.instagram_followers / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Financial data for {data.comparable_artist.name} is currently being processed. We're analyzing their market presence and performance metrics.
                </p>
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score Relationship Explanation */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-400/5 border border-blue-500/10 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="text-sm font-medium text-blue-400 mb-1">Understanding the Scores</h5>
              <p className="text-sm text-gray-400">
                While the Similarity Score shows how alike the artists are, the Resonance Score predicts commercial potential by analyzing market performance, audience engagement, and growth metrics relative to {data.comparable_artist.name}'s trajectory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown and Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resonance Score Components */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-400" />
            Resonance Score Components
          </h3>
          <div className="space-y-3">
            {[
              { key: 'genre_family_weight', label: 'Genre Family Impact' },
              { key: 'content_similarity_weight', label: 'Content Relevance' },
              { key: 'tour_revenue_impact', label: 'Tour Performance' },
              { key: 'follower_growth_trend', label: 'Growth Trajectory' },
              { key: 'youtube_metrics_score', label: 'YouTube Engagement' },
              { key: 'cross_platform_engagement', label: 'Cross-Platform Reach' }
            ].map(({ key, label }) => (
              <div key={key} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span>{label}</span>
                  <span>{detailed_breakdown[key as keyof typeof detailed_breakdown]}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${detailed_breakdown[key as keyof typeof detailed_breakdown]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Drivers and Risk Factors */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Key Drivers
              </h4>
              <ul className="grid grid-cols-1 gap-1.5">
                {key_drivers.map((driver, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span className="text-gray-300">{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Risk Factors
              </h4>
              <ul className="grid grid-cols-1 gap-1.5">
                {risk_factors.map((risk, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span className="text-gray-300">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        {musistash_analysis?.market_comparison && (
          <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Market Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-1">Market Position</h4>
                <p className="text-sm text-gray-300">{musistash_analysis.market_comparison.relative_market_position}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-1">Competitive Analysis</h4>
                <p className="text-sm text-gray-300">{musistash_analysis.market_comparison.competitive_analysis}</p>
              </div>
            </div>
          </div>
        )}
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
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold">AI Recommendation Tool</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Compare any artist's commercial potential against industry benchmarks or specific artists
        </p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={primaryArtist}
              onChange={(e) => setPrimaryArtist(e.target.value)}
              placeholder="Enter primary artist name..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={compareArtist}
              onChange={(e) => setCompareArtist(e.target.value)}
              placeholder="Enter comparison artist (optional)..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2 flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading || !primaryArtist.trim()}
              className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                'Analyze Artists'
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
            className="text-red-500 mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-12"
            >
              <Sparkles className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Analyzing artist data...</p>
            </motion.div>
          ) : (
            data && <ResultsDisplay data={data} />
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendationTool;