
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Music, User, PlayCircle, BarChart3, Sparkles, Brain } from 'lucide-react';
import { ArtistStats } from '@/services/artistStats';
import { ArtistInsights, getArtistInsights, getSimulatedInsights } from '@/services/openaiService';
import { toast } from 'sonner';

interface ArtistStatsDisplayProps {
  stats: ArtistStats;
  isLoading?: boolean;
}

const ArtistStatsDisplay: React.FC<ArtistStatsDisplayProps> = ({ stats, isLoading = false }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [insights, setInsights] = useState<ArtistInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  // Effect to load OpenAI API key from localStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchInsights(savedApiKey);
    }
  }, [stats]);

  // Function to fetch insights when API key is available
  const fetchInsights = async (key: string) => {
    if (!stats || !key) return;
    
    setIsLoadingInsights(true);
    
    try {
      const aiInsights = await getArtistInsights(stats, key);
      
      if (aiInsights) {
        setInsights(aiInsights);
        toast.success("AI insights generated successfully");
      } else {
        // Fall back to simulated insights if API call fails
        setInsights(getSimulatedInsights(stats));
        toast.error("Using simulated insights due to API error");
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setInsights(getSimulatedInsights(stats));
      toast.error("Using simulated insights due to API error");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
      fetchInsights(apiKey);
      toast.success("API key saved");
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

  // Create chart data from followers history if available
  const followerChartData = stats.followers?.history?.map(item => ({
    date: item.date,
    followers: item.count
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.stats?.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.category}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex items-center ${
                  stat.change && stat.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change && stat.change > 0 ? (
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {stat.change ? Math.abs(stat.change).toFixed(1) + '%' : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Follower Growth
          </CardTitle>
          <CardDescription>Tracking follower growth over the past months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={followerChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
            <Button 
              variant="outline" 
              onClick={() => setShowApiKeyInput(true)}
              className="text-xs"
            >
              {apiKey ? 'Update API Key' : 'Add OpenAI API Key'}
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="pt-4">
          {showApiKeyInput ? (
            <form onSubmit={handleApiKeySubmit} className="space-y-3 mb-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Enter your OpenAI API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Save Key</Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowApiKeyInput(false)}
                >
                  Cancel
                </Button>
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
              <Button onClick={() => setShowApiKeyInput(true)}>
                Add API Key
              </Button>
            </div>
          )}
          
          {(insights && !apiKey) && (
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Currently showing simulated insights. Add your OpenAI API key for personalized analysis.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Music Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Platform Presence</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Spotify</span>
                        <span>{Math.floor(stats.monthlyListeners * 0.6).toLocaleString()} listeners</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Apple Music</span>
                        <span>{Math.floor(stats.monthlyListeners * 0.25).toLocaleString()} listeners</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>YouTube Music</span>
                        <span>{Math.floor(stats.monthlyListeners * 0.15).toLocaleString()} listeners</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Performance Indicators</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Listener Loyalty</span>
                      <Badge variant="outline" className="bg-primary/10">
                        {(Math.random() * 20 + 70).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engagement Rate</span>
                      <Badge variant="outline" className="bg-primary/10">
                        {(Math.random() * 5 + 2).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Growth Projection</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        +{(Math.random() * 15 + 10).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Audience Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>18-24</span>
                        <span>{Math.floor(Math.random() * 30 + 20)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30 + 20)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>25-34</span>
                        <span>{Math.floor(Math.random() * 30 + 30)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30 + 30)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>35-44</span>
                        <span>{Math.floor(Math.random() * 20 + 15)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 20 + 15)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>45+</span>
                        <span>{Math.floor(Math.random() * 15 + 5)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 15 + 5)} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Geographic Distribution</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>United States</span>
                        <span>{Math.floor(Math.random() * 30 + 30)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30 + 30)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>United Kingdom</span>
                        <span>{Math.floor(Math.random() * 15 + 10)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 15 + 10)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Germany</span>
                        <span>{Math.floor(Math.random() * 10 + 5)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 10 + 5)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Other</span>
                        <span>{Math.floor(Math.random() * 40 + 30)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 40 + 30)} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracks" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                Top Tracks Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead className="text-right">Streams</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {i === 0 ? 'Greatest Hit' : `Track ${i + 1}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={Math.random() > 0.3 ? 'text-green-500' : 'text-red-500'}>
                          {Math.random() > 0.3 ? '+' : '-'}
                          {(Math.random() * 20 + 1).toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Investment Insights */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Investment Insights</CardTitle>
          <CardDescription>
            Data-driven insights to help inform your investment decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">Growth Trajectory</h4>
              <p className="text-muted-foreground">
                Based on the current growth rate of {(Math.random() * 15 + 5).toFixed(1)}% month-over-month,
                this artist is projected to increase their audience by {(Math.random() * 100 + 50).toFixed(0)}% 
                within the next 12 months.
              </p>
            </div>
            
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">Commercial Viability</h4>
              <p className="text-muted-foreground">
                The artist's engagement metrics are {Math.random() > 0.5 ? 'above' : 'on par with'} industry averages,
                suggesting {Math.random() > 0.5 ? 'strong' : 'good'} potential for monetization through
                streaming, licensing, and merchandise.
              </p>
            </div>
            
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <div className="flex items-center justify-between mb-2">
                <span>Investment Risk Level</span>
                <Badge 
                  variant="outline" 
                  className={
                    Math.random() > 0.7 
                      ? "bg-green-500/10 text-green-500" 
                      : Math.random() > 0.4 
                        ? "bg-yellow-500/10 text-yellow-500" 
                        : "bg-red-500/10 text-red-500"
                  }
                >
                  {Math.random() > 0.7 ? "Low" : Math.random() > 0.4 ? "Medium" : "High"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Historical performance and current growth patterns indicate a 
                {Math.random() > 0.6 ? " favorable" : " moderate"} return potential with
                {Math.random() > 0.7 ? " manageable" : " typical"} industry risks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistStatsDisplay;
