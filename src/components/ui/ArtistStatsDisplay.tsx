import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ArtistStats } from '@/services/artistStats';
import { ArtistInsights, getArtistInsights, getSimulatedInsights } from '@/services/openaiService';
import { toast } from 'sonner';
import { Brain, Music, PlayCircle, TrendingUp, TrendingDown, Users, BarChart3, Award, Star } from 'lucide-react';

interface ArtistStatsDisplayProps {
  stats: ArtistStats;
  comparableStats?: ArtistStats;
  isLoading?: boolean;
}

const getStatColor = (label: string, value: number | undefined) => {
  if (value === undefined || value === null) return 'text-muted-foreground';
  if (label === 'Engagement Rate') return value > 100 ? 'text-green-500' : 'text-yellow-500';
  if (label === 'Monthly Listeners') return value > 1000000 ? 'text-green-500' : 'text-red-500';
  if (label === 'Total Plays') return value > 10000000 ? 'text-green-500' : 'text-red-500';
  if (label === 'Followers') return value > 1000000 ? 'text-green-500' : 'text-red-500';
  return 'text-muted-foreground';
};

const getStatIcon = (label: string) => {
  switch (label) {
    case 'Monthly Listeners': return <Users className="h-5 w-5" />;
    case 'Total Plays': return <BarChart3 className="h-5 w-5" />;
    case 'Followers': return <Star className="h-5 w-5" />;
    case 'Engagement Rate': return <TrendingUp className="h-5 w-5" />;
    case 'ListenBrainz Listens': return <Award className="h-5 w-5" />;
    case 'Billboard Chart': return <Music className="h-5 w-5" />;
    default: return <Music className="h-5 w-5" />;
  }
};

const statExplanations: Record<string, string> = {
  'Monthly Listeners': 'Number of unique listeners in the last month (Last.fm)',
  'Total Plays': 'Total number of plays (Last.fm)',
  'Followers': 'Spotify followers',
  'Engagement Rate': 'Plays per follower, as a percentage',
  'ListenBrainz Listens': 'Total listens tracked by ListenBrainz',
  'Billboard Chart': 'Current or recent Billboard Hot 100 chart position',
};

const isStatPositive = (label: string, value: number | undefined) => {
  if (value === undefined || value === null) return null;
  if (label === 'Engagement Rate') return value > 100;
  if (label === 'Monthly Listeners') return value > 1000000;
  if (label === 'Total Plays') return value > 10000000;
  if (label === 'Followers') return value > 1000000;
  return null;
};

const formatValue = (label: string, value: any) => {
  if (value === undefined || value === null) return 'N/A';
  if (label === 'Engagement Rate') return value;
  if (typeof value === 'number') return value.toLocaleString();
  return value;
};

const statOrder = [
  'Monthly Listeners',
  'Total Plays',
  'Followers',
  'Engagement Rate',
  'ListenBrainz Listens',
  'Billboard Chart',
];

const ArtistStatsDisplay: React.FC<ArtistStatsDisplayProps> = ({ stats, comparableStats, isLoading = false }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [insights, setInsights] = useState<ArtistInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchInsights(savedApiKey);
    }
  }, [stats]);

  const fetchInsights = async (key: string) => {
    if (!stats || !key) return;
    setIsLoadingInsights(true);
    try {
      const aiInsights = await getArtistInsights(stats, key);
      if (aiInsights) {
        setInsights(aiInsights);
        toast.success('AI insights generated successfully');
      } else {
        setInsights(getSimulatedInsights(stats));
        toast.error('Using simulated insights due to API error');
      }
    } catch (error) {
      setInsights(getSimulatedInsights(stats));
      toast.error('Using simulated insights due to API error');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
      fetchInsights(apiKey);
      toast.success('API key saved');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-12 flex justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No statistics found</h3>
        <p className="text-muted-foreground">We couldn't find any data for this artist.</p>
      </div>
    );
  }

  // Gather all stats into a flat object for easy card rendering
  const statMap: Record<string, any> = {};
  stats.stats?.forEach((s) => {
    statMap[s.category] = s.value;
  });

  // Gather comparable stats if available
  const comparableStatMap: Record<string, any> = {};
  if (comparableStats && comparableStats.stats) {
    comparableStats.stats.forEach((s) => {
      comparableStatMap[s.category] = s.value;
    });
  }

  // Helper function to create stat cards for an artist
  const createStatCards = (artistStats: ArtistStats, statMap: Record<string, any>) => {
    return statOrder.map((label) => {
      const value = statMap[label];
      const color = getStatColor(label, typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value);
      const positive = isStatPositive(label, typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value);
      return (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Card className="flex flex-row items-center justify-between p-5 mb-4 shadow-md bg-background hover:shadow-lg transition-all border-2 border-muted-foreground/10 w-full min-w-[260px] max-w-[340px]">
              <div className="flex items-center gap-3">
                {getStatIcon(label)}
                <span className="text-base font-semibold text-muted-foreground">{label}</span>
              </div>
              <div className={`text-2xl font-bold ${color} flex items-center gap-1`}>
                {formatValue(label, value)}
                {positive === true && <TrendingUp className="h-5 w-5 text-green-500" />}
                {positive === false && <TrendingDown className="h-5 w-5 text-red-500" />}
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent>{statExplanations[label] || label}</TooltipContent>
        </Tooltip>
      );
    });
  };

  // Helper function to create artist profile section
  const createArtistProfile = (artistStats: ArtistStats) => (
    <div className="w-full md:w-80 flex flex-col items-center">
      <div className="rounded-full overflow-hidden border-2 border-primary shadow-md w-28 h-28 mb-4">
        {artistStats.image ? 
          <img src={artistStats.image} alt="artist" className="object-cover w-full h-full" /> : 
          <Music className="h-28 w-28 text-muted-foreground" />
        }
      </div>
      <div className="text-2xl font-bold mb-1 text-center">{artistStats.name}</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col cursor-help mb-4 text-center">
            <span className="text-xs text-muted-foreground">MusicBrainz ID</span>
            <span className="truncate max-w-xs text-sm font-mono bg-muted/40 rounded px-2 py-1">
              {artistStats.mbid ? artistStats.mbid.slice(0, 8) + '...' : 'N/A'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{artistStats.mbid || 'No MusicBrainz ID'}</TooltipContent>
      </Tooltip>
      <div className="flex flex-col w-full mt-2">
        {createStatCards(artistStats, artistStats === stats ? statMap : comparableStatMap)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8 justify-center">
        {/* Left artist stats */}
        {createArtistProfile(stats)}
        
        {/* Right artist stats - only show if comparable stats exist */}
        {comparableStats && createArtistProfile(comparableStats)}
      </div>

      {/* AI Insights Section */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Investment Insights
            </CardTitle>
            <CardDescription>
              AI-powered analysis based on artist statistics
            </CardDescription>
          </div>
          {!showApiKeyInput && (
            <Badge 
              variant="outline" 
              onClick={() => setShowApiKeyInput(true)}
              className="text-xs cursor-pointer"
            >
              {apiKey ? 'Update API Key' : 'Add OpenAI API Key'}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {showApiKeyInput ? (
            <form onSubmit={handleApiKeySubmit} className="space-y-3 mb-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Enter your OpenAI API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full border rounded px-2 py-1"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers
                </p>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">Save Key</button>
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setShowApiKeyInput(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : isLoadingInsights ? (
            <div className="py-8 flex justify-center items-center">
              <div className="animate-pulse space-y-2 w-full">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          ) : insights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">Investment Potential</h3>
                <p className="text-sm">{insights.investmentPotential}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">Market Trends</h3>
                <p className="text-sm">{insights.marketTrends}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">Audience Growth</h3>
                <p className="text-sm">{insights.audienceGrowth}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">Risk Assessment</h3>
                <p className="text-sm">{insights.riskAssessment}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Add your OpenAI API key to get AI-powered insights for this artist
              </p>
              <button className="btn btn-primary" onClick={() => setShowApiKeyInput(true)}>
                Add API Key
              </button>
            </div>
          )}
          {(insights && !apiKey) && (
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Currently showing simulated insights. Add your OpenAI API key for personalized analysis.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistStatsDisplay;
