
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { artists, similarityData } from '@/lib/mockData';
import { Search, Filter, Music, Verified, Users, ArrowRight, Star } from 'lucide-react';

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  
  // Get all unique genres
  const allGenres = ['all', ...new Set(artists.flatMap(artist => artist.genres))];
  
  // Filter artists based on search and genre
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        artist.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedGenre === 'all') return matchesSearch;
    
    return matchesSearch && artist.genres.includes(selectedGenre);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Discover Emerging Artists</h1>
              <p className="text-muted-foreground max-w-3xl">
                Explore and invest in the next generation of musical talent. Connect with artists, review their projects, 
                and be part of their journey to success.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for artists..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="bg-background border rounded-md px-3 py-2 text-sm"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  {allGenres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="trending">Trending Artists</TabsTrigger>
                <TabsTrigger value="new">New Artists</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="new" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Display in reverse order to simulate "new" artists */}
                  {filteredArtists.slice().reverse().map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommended" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredArtists.map(artist => {
                    const similarityInfo = similarityData.find(data => data.artist === artist.name);
                    return (
                      <FeaturedArtistCard 
                        key={artist.id} 
                        artist={artist} 
                        similarityInfo={similarityInfo}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const ArtistCard = ({ artist }) => {
  const similarityInfo = similarityData.find(data => data.artist === artist.name);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex gap-4 items-center">
          <img 
            src={artist.avatar} 
            alt={artist.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center">
              <CardTitle className="text-lg">{artist.name}</CardTitle>
              {artist.verified && (
                <Verified className="h-4 w-4 ml-2 text-primary" />
              )}
            </div>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <Music className="h-3 w-3 mr-1" />
              {artist.genres.join(', ')}
            </div>
            <div className="flex items-center mt-1 text-sm">
              <Users className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{artist.followers.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6 flex-1">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{artist.bio}</p>
        
        {similarityInfo && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Resonance Score</span>
              <Badge variant="outline" className="font-semibold">
                {similarityInfo.similarity}%
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Similar to {similarityInfo.similarTo}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          {artist.genres.map(genre => (
            <Badge variant="secondary" key={genre}>
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t mt-auto">
        <Link to={`/artist/${artist.id}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const FeaturedArtistCard = ({ artist, similarityInfo }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-2 text-center text-sm font-medium text-primary">
        Featured Artist
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={artist.avatar} 
              alt={artist.name} 
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center">
                <CardTitle>{artist.name}</CardTitle>
                {artist.verified && (
                  <Verified className="h-4 w-4 ml-2 text-primary" />
                )}
              </div>
              <CardDescription className="mt-1">
                {artist.genres.join(', ')}
              </CardDescription>
              <div className="flex items-center mt-1 text-sm">
                <Users className="h-3 w-3 mr-1" />
                <span>{artist.followers.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
          {similarityInfo && (
            <div className="text-right">
              <div className="text-sm font-medium">Resonance Score</div>
              <div className="text-2xl font-bold text-primary">{similarityInfo.similarity}%</div>
              <div className="text-sm text-muted-foreground">with {similarityInfo.similarTo}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{artist.bio}</p>
        
        {similarityInfo && (
          <div className="space-y-4">
            <div className="font-medium">Why Similar to {similarityInfo.similarTo}:</div>
            <div className="space-y-2">
              {similarityInfo.reasons.map((reason, index) => (
                <div key={index} className="flex items-start">
                  <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="font-medium mb-2">Commercial Potential:</div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full" 
                  style={{ width: `${similarityInfo.commercialPotential}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>{similarityInfo.commercialPotential}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t">
        <Button variant="outline" className="text-foreground">View Projects</Button>
        <Link to={`/artist/${artist.id}`}>
          <Button>
            View Full Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Artists;
