
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtistStatsDisplay from '@/components/ui/ArtistStatsDisplay';
import { getArtistStats } from '@/services/artistStats';
import { Search } from 'lucide-react';

const ArtistSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const artistQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(artistQuery);

  const { data: artistStats, isLoading, error, refetch } = useQuery({
    queryKey: ['artistStats', artistQuery],
    queryFn: () => artistQuery ? getArtistStats(artistQuery) : null,
    enabled: !!artistQuery,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please enter an artist name to search');
      return;
    }
    setSearchParams({ q: searchInput });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">Artist Stats & Analytics</h1>
              <p className="text-muted-foreground max-w-3xl">
                Search for an artist to view comprehensive statistics from MusicBrainz, Last.fm, and industry data. 
                Make informed investment decisions based on real performance metrics.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Search for an Artist</CardTitle>
                <CardDescription>
                  Enter an artist name to see their statistics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for an artist..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </CardContent>
            </Card>
            
            {artistQuery && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {isLoading ? 'Loading...' : error ? 'Error' : `Results for "${artistQuery}"`}
                  </h2>
                  {error && (
                    <Button 
                      variant="outline" 
                      onClick={() => refetch()}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
                
                {error ? (
                  <Card className="bg-destructive/10 border-destructive/20">
                    <CardContent className="pt-6">
                      <p className="text-center">
                        Error loading artist data. Please try again or search for a different artist.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ArtistStatsDisplay stats={artistStats} isLoading={isLoading} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistSearch;
