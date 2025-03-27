
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtistStatsDisplay from '@/components/ui/ArtistStatsDisplay';
import { getArtistStats } from '@/services/artistStats';
import { Search } from 'lucide-react';
import { spotifyService } from '@/services/spotifyService';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ArtistSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const artistQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(artistQuery);
  const [open, setOpen] = useState(false);
  const [suggestedArtists, setSuggestedArtists] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const { data: artistStats, isLoading: statsLoading, error, refetch } = useQuery({
    queryKey: ['artistStats', artistQuery],
    queryFn: () => artistQuery ? getArtistStats(artistQuery) : null,
    enabled: !!artistQuery,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSuggestedArtists([]);
        return;
      }

      setIsLoading(true);
      try {
        const artist = await spotifyService.searchArtist(debouncedSearchTerm);
        if (artist) {
          // Get similar artists based on search
          const similarArtists = await spotifyService.getArtistRecommendations(artist.id);
          const suggestions = [
            { id: artist.id, name: artist.name },
            ...(similarArtists || []).map(a => ({ id: a.id, name: a.name }))
          ].slice(0, 5);
          
          setSuggestedArtists(suggestions);
          setOpen(true);
        } else {
          setSuggestedArtists([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestedArtists([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      fetchSuggestions();
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchInput);
  };

  const performSearch = async (input: string) => {
    if (!input.trim()) {
      toast.error('Please enter an artist name to search');
      return;
    }

    setIsLoading(true);
    try {
      // Try to find the correct artist name on Spotify
      const artist = await spotifyService.searchArtist(input);
      if (artist) {
        toast.success(`Showing results for "${artist.name}"`);
        setSearchInput(artist.name);
        setSearchParams({ q: artist.name });
      } else {
        // If not found, just search with the original input
        setSearchParams({ q: input });
      }
    } catch (error) {
      console.error('Error searching for artist:', error);
      // Fall back to original behavior
      setSearchParams({ q: input });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleSuggestionSelect = (artistName: string) => {
    setSearchInput(artistName);
    performSearch(artistName);
    setOpen(false);
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
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search for an artist..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px]" align="start">
                        <Command>
                          <CommandList>
                            {isLoading ? (
                              <CommandItem disabled>Loading suggestions...</CommandItem>
                            ) : (
                              <>
                                {suggestedArtists.length > 0 ? (
                                  <CommandGroup heading="Suggested Artists">
                                    {suggestedArtists.map((artist) => (
                                      <CommandItem
                                        key={artist.id}
                                        onSelect={() => handleSuggestionSelect(artist.name)}
                                      >
                                        {artist.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                ) : (
                                  searchInput.trim().length > 1 && (
                                    <CommandEmpty>No artists found</CommandEmpty>
                                  )
                                )}
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button type="submit" disabled={statsLoading || isLoading}>
                    {statsLoading || isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {artistQuery && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    {statsLoading ? 'Loading...' : error ? 'Error' : `Results for "${artistQuery}"`}
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
                  <ArtistStatsDisplay stats={artistStats} isLoading={statsLoading} />
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
