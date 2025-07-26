import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';

interface CompleteAnalysisDisplayProps {
  analysis: any;
  isSaved?: boolean;
}

const CompleteAnalysisDisplay: React.FC<CompleteAnalysisDisplayProps> = ({ analysis, isSaved = false }) => {
  if (!analysis) return null;

  const formatNumber = (num: any, decimals = 2) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return Number(num).toFixed(decimals);
  };

  const formatLargeNumber = (num: any) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPotentialColor = (potential: string) => {
    switch (potential?.toLowerCase()) {
      case 'high': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Track Analysis Report</h2>
        <div className="flex items-center gap-2">
          {isSaved && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              Saved
            </Badge>
          )}
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {analysis.analysis_quality || 'Enhanced'}
          </Badge>
        </div>
      </div>

      {/* Track Summary */}
      {analysis.gemini_insights?.track_summary && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              ⭐ Track Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.gemini_insights.track_summary.overall_assessment && (
              <p className="text-white leading-relaxed">
                {analysis.gemini_insights.track_summary.overall_assessment}
              </p>
            )}
            
            {analysis.gemini_insights.track_summary.commercial_potential && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Commercial Potential:</span>
                <Badge className={getPotentialColor(analysis.gemini_insights.track_summary.commercial_potential)}>
                  {analysis.gemini_insights.track_summary.commercial_potential.toUpperCase()}
                </Badge>
              </div>
            )}

            {analysis.gemini_insights.track_summary.strengths && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">✅ Strengths</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysis.gemini_insights.track_summary.strengths.map((strength: string, idx: number) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.gemini_insights.track_summary.areas_for_improvement && (
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Areas for Improvement</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysis.gemini_insights.track_summary.areas_for_improvement.map((improvement: string, idx: number) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Analysis */}
      {analysis.gemini_insights?.technical_analysis && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              🎵 Technical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.gemini_insights.technical_analysis.tempo_analysis && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Tempo & Rhythm</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.technical_analysis.tempo_analysis}
                </p>
                <div className="mt-2 text-blue-300 font-mono">
                  BPM: {formatNumber(analysis.bpm || analysis.pyaudio_bpm, 1)}
                </div>
              </div>
            )}

            {analysis.gemini_insights.technical_analysis.key_analysis && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Key & Harmony</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.technical_analysis.key_analysis}
                </p>
                <div className="mt-2 text-green-300 font-mono">
                  Key: {analysis.key || analysis.pyaudio_key || 'N/A'} {analysis.mode || analysis.pyaudio_scale || 'major'}
                </div>
              </div>
            )}

            {analysis.gemini_insights.technical_analysis.energy_analysis && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Energy & Dynamics</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.technical_analysis.energy_analysis}
                </p>
                <div className="mt-2 text-blue-300 font-mono">
                  Energy: {formatNumber(analysis.energy || analysis.pyaudio_energy_mean, 3)}
                </div>
              </div>
            )}

            {analysis.gemini_insights.technical_analysis.spectral_analysis && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Spectral Features</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.technical_analysis.spectral_analysis}
                </p>
                <div className="mt-2 text-green-300 font-mono text-xs">
                  Centroid: {formatNumber(analysis.pyaudio_spectral_centroid, 3)} | 
                  Rolloff: {formatNumber(analysis.pyaudio_spectral_rolloff, 3)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Artistic Insights */}
      {analysis.gemini_insights?.artistic_insights && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              💡 Artistic Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.gemini_insights.artistic_insights.mood_and_emotion && (
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Mood & Emotion</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.artistic_insights.mood_and_emotion}
                </p>
                <div className="mt-2 text-red-300 font-mono text-xs">
                  Valence: {formatNumber(analysis.valence, 3)} | 
                  Arousal: {formatNumber(analysis.arousal, 3)}
                </div>
              </div>
            )}

            {analysis.gemini_insights.artistic_insights.genre_characteristics && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Genre Characteristics</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.gemini_insights.artistic_insights.genre_characteristics}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actionable Recommendations */}
      {analysis.gemini_insights?.actionable_recommendations && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              🎯 Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.gemini_insights.actionable_recommendations.production_tips && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Production Tips</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysis.gemini_insights.actionable_recommendations.production_tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.gemini_insights.actionable_recommendations.mixing_suggestions && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Mixing Suggestions</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysis.gemini_insights.actionable_recommendations.mixing_suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.gemini_insights.actionable_recommendations.marketing_angles && (
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">Marketing Angles</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysis.gemini_insights.actionable_recommendations.marketing_angles.map((angle: string, idx: number) => (
                    <li key={idx}>{angle}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Similar Artists */}
      {analysis.gemini_insights?.similar_artists && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              🎤 Similar Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.gemini_insights.similar_artists.reasoning && (
              <p className="text-gray-300 mb-4 leading-relaxed">
                {analysis.gemini_insights.similar_artists.reasoning}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.gemini_insights.similar_artists.primary_matches && (
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">Primary Matches</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.gemini_insights.similar_artists.primary_matches.map((artist: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {artist}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.gemini_insights.similar_artists.secondary_matches && (
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Secondary Matches</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.gemini_insights.similar_artists.secondary_matches.map((artist: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {artist}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Positioning */}
      {analysis.gemini_insights?.market_positioning && (
        <Card className="bg-[#181c24] border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              📊 Market Positioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.gemini_insights.market_positioning.target_audience && (
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">Target Audience</h4>
                <p className="text-gray-300 leading-relaxed">
                  {analysis.gemini_insights.market_positioning.target_audience}
                </p>
              </div>
            )}

            {analysis.gemini_insights.market_positioning.playlist_fit && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Playlist Fit</h4>
                <p className="text-gray-300 leading-relaxed">
                  {analysis.gemini_insights.market_positioning.playlist_fit}
                </p>
              </div>
            )}

            {analysis.gemini_insights.market_positioning.streaming_appeal && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Streaming Appeal</h4>
                <p className="text-gray-300 leading-relaxed">
                  {analysis.gemini_insights.market_positioning.streaming_appeal}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Metrics Summary */}
      <Card className="bg-[#181c24] border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            📈 Technical Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatNumber(analysis.bpm || analysis.pyaudio_bpm, 1)}
              </div>
              <div className="text-xs text-gray-400">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatNumber(analysis.energy || analysis.pyaudio_energy_mean, 3)}
              </div>
              <div className="text-xs text-gray-400">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {formatNumber(analysis.loudness, 1)}
              </div>
              <div className="text-xs text-gray-400">Loudness (dB)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {formatNumber(analysis.pyaudio_rhythm_clarity, 3)}
              </div>
              <div className="text-xs text-gray-400">Rhythm Clarity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteAnalysisDisplay; 