
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { similarityData } from '@/lib/mockData';

interface Recommendation {
  artist: string;
  similarTo: string;
  similarity: number;
  reasons: string[];
  commercialPotential: number;
}

const AIRecommendationTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Find a recommendation from our mock data that most closely matches
      const result = similarityData.find(
        data => data.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setRecommendation(result || null);
      setIsLoading(false);
      setHasSearched(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter an artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </form>

      {isLoading && (
        <div className="text-center py-12 animate-pulse">
          <div className="text-xl font-semibold mb-2">Analyzing artist profile</div>
          <div className="text-muted-foreground">
            Our AI is comparing sound signatures and market data...
          </div>
        </div>
      )}

      {!isLoading && hasSearched && !recommendation && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              We couldn't find any matches for "{searchQuery}". Please try another artist name.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && recommendation && (
        <Card className="animate-slide-up overflow-hidden">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle>{recommendation.artist}</CardTitle>
            <CardDescription>
              Investment Analysis & Market Comparison
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Similar to</div>
                  <Badge variant="outline" className="font-normal">
                    {recommendation.similarity}% Match
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">{recommendation.similarTo}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Key Similarities</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recommendation.reasons.map((reason, index) => (
                    <div key={index} className="bg-secondary/30 rounded-md p-3 text-sm">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Commercial Potential</div>
                <div className="bg-primary/10 rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">{recommendation.commercialPotential}%</span>
                    <Badge variant="secondary">High Potential</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Based on market trends, musical similarity to established artists, and current
                    listener preferences, this artist shows significant commercial promise.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/20 border-t flex flex-col items-start">
            <div className="text-sm font-medium mb-2">Investment Insight</div>
            <p className="text-sm text-muted-foreground">
              Artists with similar sound profiles to {recommendation.similarTo} have shown an average 
              ROI of 8-12% on successful projects. This artist's commercial potential score of {recommendation.commercialPotential}% 
              suggests above-average returns may be possible.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendationTool;
