import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { projects, artists, similarityData } from '@/lib/mockData';
import { Music, Users, Sparkles, BarChart, ArrowRight } from 'lucide-react';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState(null);
  const [artistProjects, setArtistProjects] = useState([]);
  const [similarityInfo, setSimilarityInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotifyImage, setSpotifyImage] = useState('');
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundArtist = artists.find(a => a.id === id) || artists[0];
      setArtist(foundArtist);
      
      const foundProjects = projects.filter(p => p.artistId === foundArtist.id);
      setArtistProjects(foundProjects);
      
      const foundSimilarity = similarityData.find(s => s.artist === foundArtist.name);
      setSimilarityInfo(foundSimilarity);
      
      // If we have an artist name, try to fetch their Spotify image
      if (foundArtist && foundArtist.name) {
        fetchSpotifyArtistImage(foundArtist.name);
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const fetchSpotifyArtistImage = async (artistName) => {
    try {
      // First get Spotify access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      });
      
      if (!tokenResponse.ok) {
        console.error('Failed to get Spotify token');
        return;
      }
      
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;
      
      // Search for the artist
      const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!searchResponse.ok) {
        console.error('Failed to search Spotify artist');
        return;
      }
      
      const searchData = await searchResponse.json();
      
      if (searchData.artists.items.length > 0) {
        const artistData = searchData.artists.items[0];
        // Get the largest image available
        if (artistData.images && artistData.images.length > 0) {
          setSpotifyImage(artistData.images[0].url);
        }
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    }
  };
  
  if (isLoading || !artist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading Artist Profile</div>
          <div className="text-muted-foreground">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Artist Header */}
        <div className="bg-primary/5 border-b">
          <div className="container max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Artist Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <img 
                  src={spotifyImage || artist.avatar} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
                  {artist.verified && (
                    <Badge className="h-6">Verified Artist</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {artist.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary">{genre}</Badge>
                  ))}
                </div>
                
                <p className="text-muted-foreground max-w-2xl mb-6">{artist.bio}</p>
                
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{artist.followers.toLocaleString()} Followers</span>
                  </div>
                  <div className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{artistProjects.length} Projects</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{artist.successRate}% Success Rate</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="outline">Follow</Button>
                <Link to={artistProjects.length > 0 ? `/project/${artistProjects[0].id}` : '#'}>
                  <Button>
                    View Latest Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artist Content */}
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="analytics">Market Analysis</TabsTrigger>
            </TabsList>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">{artist.name}'s Projects</h2>
              
              {artistProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {artistProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-medium mb-2">No active projects</div>
                    <p className="text-muted-foreground mb-4">
                      This artist doesn't have any active funding projects at the moment.
                    </p>
                    <Link to="/projects">
                      <Button variant="outline">
                        Browse Other Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* About Tab */}
            <TabsContent value="about" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Artist Biography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {artist.bio}
                      </p>
                      <p className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="text-muted-foreground">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Musical Style & Influences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {artist.name}'s music blends traditional elements of {artist.genres.join(' and ')} 
                        with innovative production techniques. Their sound is characterized by emotional depth
                        and meticulous attention to sonic detail.
                      </p>
                      <p className="text-muted-foreground">
                        Key influences include pioneering artists in the {artist.genres[0]} scene, as well as
                        classic songwriters from various eras. This combination creates a fresh yet familiar
                        sound that resonates with diverse audiences.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2023</div>
                          <div>
                            <div className="font-medium">Released 'Reflections' EP</div>
                            <p className="text-sm text-muted-foreground">
                              Reached top 50 on streaming charts
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2022</div>
                          <div>
                            <div className="font-medium">Collaborated with top producers</div>
                            <p className="text-sm text-muted-foreground">
                              Worked with industry veterans
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-sm font-medium text-primary">2021</div>
                          <div>
                            <div className="font-medium">Debut single release</div>
                            <p className="text-sm text-muted-foreground">
                              First major industry recognition
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                          </svg>
                          YouTube
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.5 8.5c0-1.933-1.566-3.5-3.5-3.5s-3.5 1.567-3.5 3.5c0 1.31.724 2.45 1.792 3.051-.022 1.146-.348 3.265-2.444 4.445-.145.066-.148.19.008.246 2.904 1.024 4.395-1.678 4.644-2.472.21.016.435.03.651.03 1.934 0 3.5-1.567 3.5-3.5"/>
                          </svg>
                          Spotify
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                          </svg>
                          Instagram
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Commercial Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {similarityInfo ? (
                        <>
                          <div className="bg-primary/5 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">Similar to: {similarityInfo.similarTo}</h3>
                              <Badge>{similarityInfo.similarity}% Match</Badge>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="font-medium">Key Similarities</h4>
                              <ul className="space-y-2">
                                {similarityInfo.reasons.map((reason, index) => (
                                  <li key={index} className="flex items-start">
                                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2 mt-0.5">
                                      <span className="text-xs">{index + 1}</span>
                                    </div>
                                    <span className="text-muted-foreground">{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Investment Analysis</h3>
                            <p className="text-muted-foreground mb-4">
                              Based on our AI analysis, {artist.name} shows significant commercial potential due to their
                              similarities with established artist {similarityInfo.similarTo}. This similarity extends across
                              musical style, production quality, and audience demographics.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-secondary/50 rounded-lg p-4">
                                <div className="text-2xl font-semibold">{similarityInfo.commercialPotential}%</div>
                                <div className="text-sm text-muted-foreground">Commercial Potential</div>
                              </div>
                              <div className="bg-secondary/50 rounded-lg p-4">
                                <div className="text-2xl font-semibold">{artist.successRate}%</div>
                                <div className="text-sm text-muted-foreground">Project Success Rate</div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground">
                              Artists with similar profiles to {similarityInfo.similarTo} have historically 
                              shown strong commercial performance across streaming platforms, with average 
                              earnings growth of 15-25% year over year during their early career phase.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                          <p>Detailed analysis not available for this artist</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Genre Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {artist.genres.map((genre, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">{genre}</span>
                              <span className="text-sm font-medium">
                                {index === 0 ? '+12%' : index === 1 ? '+8%' : '+5%'}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: index === 0 ? '82%' : index === 1 ? '76%' : '65%' }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? 
                                'Strong growth trend in streaming platforms' : 
                                index === 1 ? 
                                'Moderate but stable audience growth' :
                                'Emerging interest from new markets'
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Age Groups</div>
                          <div className="grid grid-cols-4 gap-1 mb-1">
                            <div className="bg-primary h-16 rounded-md" style={{opacity: 0.4}}></div>
                            <div className="bg-primary h-24 rounded-md" style={{opacity: 0.6}}></div>
                            <div className="bg-primary h-28 rounded-md" style={{opacity: 0.8}}></div>
                            <div className="bg-primary h-12 rounded-md" style={{opacity: 0.3}}></div>
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground">
                            <div>18-24</div>
                            <div>25-34</div>
                            <div>35-44</div>
                            <div>45+</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Top Regions</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>United States</span>
                              <span>42%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>United Kingdom</span>
                              <span>15%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Germany</span>
                              <span>12%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Canada</span>
                              <span>8%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistProfile;
