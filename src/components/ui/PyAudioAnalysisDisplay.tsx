import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  BarChart, 
  Activity, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Clock,
  Volume2,
  Palette,
  Lightbulb,
  Gauge
} from 'lucide-react';

interface PyAudioAnalysisFeatures {
  // Basic PyAudioAnalysis features
  pyaudio_rhythm_clarity?: number;
  pyaudio_bpm?: number;
  pyaudio_beats_confidence?: number;
  pyaudio_dissonance?: number;
  pyaudio_key?: string;
  pyaudio_scale?: string;
  pyaudio_spectral_centroid?: number;
  pyaudio_spectral_rolloff?: number;
  pyaudio_spectral_flux?: number;
  pyaudio_spectral_contrast?: number;
  pyaudio_key_confidence?: number;
  pyaudio_mfcc_features?: number[];
  pyaudio_chroma_vector?: number[];
  
  // Basic audio features (from Librosa)
  duration?: number;
  energy?: number;
  loudness?: number;
  valence?: number;
  arousal?: number;
  
  // Commercial analysis
  commercial_score?: number;
  emotional_category?: string;
  predicted_genre?: string;
  target_audience?: {
    primary: string;
    secondary: string;
  };
  production_quality?: {
    overall_quality: string;
    dynamic_range_score: number;
    loudness_optimization: number;
    mastering_quality: string;
  };
  market_readiness?: string;
}

interface PyAudioAnalysisDisplayProps {
  features: PyAudioAnalysisFeatures;
  className?: string;
}

const PyAudioAnalysisDisplay: React.FC<PyAudioAnalysisDisplayProps> = ({ 
  features, 
  className = "" 
}) => {
  
  // Utility functions
  const formatNumber = (num: number | undefined, decimals: number = 2): string => {
    if (num === undefined || isNaN(num)) return 'N/A';
    return Number(num).toFixed(decimals);
  };

  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityBadge = (score: number): string => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  const getEmotionalColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'energetic_happy': 'text-green-400',
      'calm_happy': 'text-blue-400',
      'energetic_sad': 'text-orange-400',
      'calm_sad': 'text-purple-400',
      'neutral': 'text-gray-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const getKeyColor = (key: string): string => {
    const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
    const minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m'];
    
    if (majorKeys.includes(key)) return 'text-green-400';
    if (minorKeys.includes(key)) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Audio Analysis Results</h2>
        </div>
        <p className="text-sm text-gray-400">Comprehensive analysis using PyAudioAnalysis</p>
      </div>

      {/* Compact Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {formatDuration(features.duration)}
          </div>
          <div className="text-xs text-gray-400">Duration</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">
            {formatNumber(features.pyaudio_bpm, 1)}
          </div>
          <div className="text-xs text-gray-400">BPM</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${getKeyColor(features.pyaudio_key || '')}`}>
            {features.pyaudio_key || 'N/A'}
          </div>
          <div className="text-xs text-gray-400">Key</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-400">
            {features.pyaudio_scale || 'N/A'}
          </div>
          <div className="text-xs text-gray-400">Scale</div>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column */}
        <div className="space-y-4">
          
          {/* Rhythm & Musical Analysis */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Activity className="h-4 w-4 text-green-400" />
                Rhythm & Musical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Rhythm Clarity</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getQualityColor(features.pyaudio_rhythm_clarity || 0)}`}>
                    {formatNumber(features.pyaudio_rhythm_clarity, 3)}
                  </span>
                  <Progress 
                    value={(features.pyaudio_rhythm_clarity || 0) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Beat Confidence</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getQualityColor(features.pyaudio_beats_confidence || 0)}`}>
                    {formatNumber(features.pyaudio_beats_confidence, 3)}
                  </span>
                  <Progress 
                    value={(features.pyaudio_beats_confidence || 0) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Key Confidence</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getQualityColor(features.pyaudio_key_confidence || 0)}`}>
                    {formatNumber(features.pyaudio_key_confidence, 3)}
                  </span>
                  <Progress 
                    value={(features.pyaudio_key_confidence || 0) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Dissonance</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getQualityColor(1 - (features.pyaudio_dissonance || 0))}`}>
                    {formatNumber(features.pyaudio_dissonance, 3)}
                  </span>
                  <Progress 
                    value={(1 - (features.pyaudio_dissonance || 0)) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spectral Analysis */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                Spectral Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Spectral Centroid</div>
                  <div className="text-sm font-bold text-blue-400">
                    {formatNumber(features.pyaudio_spectral_centroid, 3)}
                  </div>
                  <div className="text-xs text-gray-400">Brightness</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">Spectral Rolloff</div>
                  <div className="text-sm font-bold text-green-400">
                    {formatNumber(features.pyaudio_spectral_rolloff, 3)}
                  </div>
                  <div className="text-xs text-gray-400">Rolloff Point</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">Spectral Flux</div>
                  <div className="text-sm font-bold text-orange-400">
                    {formatNumber(features.pyaudio_spectral_flux, 3)}
                  </div>
                  <div className="text-xs text-gray-400">Change Rate</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">Spectral Contrast</div>
                  <div className="text-sm font-bold text-pink-400">
                    {formatNumber(features.pyaudio_spectral_contrast, 3)}
                  </div>
                  <div className="text-xs text-gray-400">Peak vs Valley</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          
          {/* Energy & Dynamics */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Zap className="h-4 w-4 text-yellow-400" />
                Energy & Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Energy</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-yellow-400">
                    {formatNumber(features.energy, 3)}
                  </span>
                  <Progress 
                    value={(features.energy || 0) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Loudness</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-orange-400">
                    {formatNumber(features.loudness, 1)} dB
                  </span>
                  <Progress 
                    value={Math.max(0, Math.min(100, ((features.loudness || -60) + 60) / 60 * 100))} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Valence</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-pink-400">
                    {formatNumber(features.valence, 3)}
                  </span>
                  <Progress 
                    value={(features.valence || 0) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial Analysis */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Commercial Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Commercial Score</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getQualityColor(features.commercial_score || 0)}`}>
                    {formatNumber((features.commercial_score || 0) * 100, 1)}%
                  </span>
                  <Progress 
                    value={(features.commercial_score || 0) * 100} 
                    className="w-20 h-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Emotional Category</div>
                  <Badge className={`${getEmotionalColor(features.emotional_category || '')} bg-gray-700 text-xs`}>
                    {features.emotional_category?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">Market Readiness</div>
                  <Badge className="bg-green-900/50 text-green-300 text-xs">
                    {features.market_readiness?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
              </div>
              
              {features.target_audience && (
                <div>
                  <div className="text-sm text-gray-300 mb-1">Target Audience</div>
                  <div className="text-xs text-green-400">
                    Primary: {features.target_audience.primary}
                  </div>
                  <div className="text-xs text-blue-400">
                    Secondary: {features.target_audience.secondary}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Features (Collapsible) */}
      {(features.pyaudio_mfcc_features || features.pyaudio_chroma_vector) && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Target className="h-4 w-4 text-yellow-400" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.pyaudio_mfcc_features && (
              <div>
                <div className="text-sm text-gray-300 mb-2">MFCC Features (First 5)</div>
                <div className="flex gap-2">
                  {features.pyaudio_mfcc_features.slice(0, 5).map((value, index) => (
                    <div key={index} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                      {formatNumber(value, 2)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {features.pyaudio_chroma_vector && (
              <div>
                <div className="text-sm text-gray-300 mb-2">Chroma Vector (Harmonic Content)</div>
                <div className="grid grid-cols-12 gap-1">
                  {features.pyaudio_chroma_vector.map((value, index) => (
                    <div 
                      key={index} 
                      className="h-6 bg-gradient-to-t from-purple-900 to-purple-600 rounded text-xs flex items-end justify-center pb-1"
                      style={{ 
                        height: `${Math.max(16, Math.abs(value) * 80)}px`,
                        backgroundColor: value > 0 ? 'rgb(147 51 234)' : 'rgb(75 85 99)'
                      }}
                    >
                      {index === 0 ? 'C' : index === 1 ? 'C#' : index === 2 ? 'D' : 
                       index === 3 ? 'D#' : index === 4 ? 'E' : index === 5 ? 'F' :
                       index === 6 ? 'F#' : index === 7 ? 'G' : index === 8 ? 'G#' :
                       index === 9 ? 'A' : index === 10 ? 'A#' : 'B'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PyAudioAnalysisDisplay; 