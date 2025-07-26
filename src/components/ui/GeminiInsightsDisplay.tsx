import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Music, 
  Target, 
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Play,
  Radio,
  Headphones
} from 'lucide-react';

interface GeminiInsightsProps {
  insights: any;
  isLoading?: boolean;
}

const GeminiInsightsDisplay: React.FC<GeminiInsightsProps> = ({ insights, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-[#181c24] rounded-lg p-6 border border-purple-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold text-purple-300">AI Analysis in Progress...</h3>
        </div>
        <p className="text-gray-400">Gemini AI is analyzing your track and generating insights...</p>
      </div>
    );
  }

  if (!insights || Object.keys(insights).length === 0) {
    return (
      <div className="bg-[#181c24] rounded-lg p-6 border border-purple-700">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-purple-300">AI Analysis Not Available</h3>
        </div>
        <p className="text-gray-400">Enable Gemini AI for detailed insights and similar artist suggestions.</p>
      </div>
    );
  }

  const {
    track_summary,
    technical_analysis,
    artistic_insights,
    actionable_recommendations,
    similar_artists,
    market_positioning
  } = insights;

  return (
    <div className="space-y-6">
      {/* Track Summary */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Star className="w-5 h-5" />
            <span>Track Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#0f1216] rounded-lg p-4">
            <p className="text-white mb-3">{track_summary?.overall_assessment}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              <Badge 
                variant={track_summary?.commercial_potential === 'high' ? 'default' : 'secondary'}
                className="bg-green-600 hover:bg-green-700"
              >
                {track_summary?.commercial_potential?.toUpperCase()} Potential
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {track_summary?.strengths?.map((strength: string, idx: number) => (
                    <li key={idx} className="text-gray-300 text-sm">• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {track_summary?.areas_for_improvement?.map((improvement: string, idx: number) => (
                    <li key={idx} className="text-gray-300 text-sm">• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Music className="w-5 h-5" />
            <span>Technical Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Tempo & Rhythm</h4>
              <p className="text-gray-300 text-sm">{technical_analysis?.tempo_analysis}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Key & Harmony</h4>
              <p className="text-gray-300 text-sm">{technical_analysis?.key_analysis}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2">Energy & Dynamics</h4>
              <p className="text-gray-300 text-sm">{technical_analysis?.energy_analysis}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-2">Spectral Features</h4>
              <p className="text-gray-300 text-sm">{technical_analysis?.spectral_analysis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artistic Insights */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Lightbulb className="w-5 h-5" />
            <span>Artistic Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-pink-400 font-semibold mb-2">Mood & Emotion</h4>
              <p className="text-gray-300 text-sm">{artistic_insights?.mood_and_emotion}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-2">Genre Characteristics</h4>
              <p className="text-gray-300 text-sm">{artistic_insights?.genre_characteristics}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Production Quality</h4>
              <p className="text-gray-300 text-sm">{artistic_insights?.production_quality}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Audience Appeal</h4>
              <p className="text-gray-300 text-sm">{artistic_insights?.audience_appeal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Artists */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Users className="w-5 h-5" />
            <span>Similar Artists</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#0f1216] rounded-lg p-4">
            <h4 className="text-purple-400 font-semibold mb-3">Primary Matches</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {similar_artists?.primary_matches?.map((artist: string, idx: number) => (
                <Badge key={idx} variant="outline" className="border-purple-500 text-purple-400">
                  {artist}
                </Badge>
              ))}
            </div>
            
            <h4 className="text-blue-400 font-semibold mb-3">Secondary Matches</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {similar_artists?.secondary_matches?.map((artist: string, idx: number) => (
                <Badge key={idx} variant="outline" className="border-blue-500 text-blue-400">
                  {artist}
                </Badge>
              ))}
            </div>
            
            <p className="text-gray-300 text-sm">{similar_artists?.reasoning}</p>
          </div>
        </CardContent>
      </Card>

      {/* Market Positioning */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Target className="w-5 h-5" />
            <span>Market Positioning</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Target Audience
              </h4>
              <p className="text-gray-300 text-sm">{market_positioning?.target_audience}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Playlist Fit
              </h4>
              <p className="text-gray-300 text-sm">{market_positioning?.playlist_fit}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                <Radio className="w-4 h-4 mr-2" />
                Radio Potential
              </h4>
              <p className="text-gray-300 text-sm">{market_positioning?.radio_potential}</p>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-2 flex items-center">
                <Headphones className="w-4 h-4 mr-2" />
                Streaming Appeal
              </h4>
              <p className="text-gray-300 text-sm">{market_positioning?.streaming_appeal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Recommendations */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <TrendingUp className="w-5 h-5" />
            <span>Actionable Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Production Tips</h4>
              <ul className="space-y-1">
                {actionable_recommendations?.production_tips?.map((tip: string, idx: number) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start">
                    <ArrowRight className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Mixing Suggestions</h4>
              <ul className="space-y-1">
                {actionable_recommendations?.mixing_suggestions?.map((suggestion: string, idx: number) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start">
                    <ArrowRight className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2">Marketing Angles</h4>
              <ul className="space-y-1">
                {actionable_recommendations?.marketing_angles?.map((angle: string, idx: number) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start">
                    <ArrowRight className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                    {angle}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0f1216] rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-2">Collaboration Opportunities</h4>
              <ul className="space-y-1">
                {actionable_recommendations?.collaboration_opportunities?.map((opportunity: string, idx: number) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start">
                    <ArrowRight className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiInsightsDisplay; 