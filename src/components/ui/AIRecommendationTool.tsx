import React, { useState } from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

const AIRecommendationTool = () => {
  const [primaryArtist, setPrimaryArtist] = useState('');
  const [compareArtist, setCompareArtist] = useState('');

  return (
    <div className="space-y-8">
      {/* Primary Artist Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Search className="h-5 w-5" />
          <span className="text-sm font-medium">Artist to Analyze</span>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter artist name..."
            value={primaryArtist}
            onChange={(e) => setPrimaryArtist(e.target.value)}
            className="w-full bg-[#12141a] border-gray-800 text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 h-8 w-8"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comparison Artist Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-400">
          <Users className="h-5 w-5" />
          <span className="text-sm font-medium">Compare with Another Artist</span>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter artist name..."
            value={compareArtist}
            onChange={(e) => setCompareArtist(e.target.value)}
            className="w-full bg-[#12141a] border-gray-800 text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 h-8 w-8"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Preview Box */}
      <div className="mt-8 p-4 rounded-lg bg-[#12141a] border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-gray-400">// Analysis Results</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500">AI Ready</span>
          </div>
        </div>
        <div className="h-32 flex items-center justify-center border border-dashed border-gray-800 rounded bg-[#0d0f14]">
          <p className="text-gray-500 text-sm">Enter an artist name to see AI predictions</p>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationTool;
