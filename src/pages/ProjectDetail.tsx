import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtistInfo from '@/components/ui/ArtistInfo';
import InvestmentForm from '@/components/ui/InvestmentForm';
import { projects, artists } from '@/lib/mockData';
import { CalendarIcon, Clock, DollarSign, ArrowRight } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState(null);
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotifyImage, setSpotifyImage] = useState('');
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundProject = projects.find(p => p.id === id) || projects[0];
      setProject(foundProject);
      
      const foundArtist = artists.find(a => a.id === foundProject.artistId);
      setArtist(foundArtist);
      
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
  
  if (isLoading || !project || !artist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading Project</div>
          <div className="text-muted-foreground">Please wait...</div>
        </div>
      </div>
    );
  }
  
  const fundingPercentage = Math.min(100, Math.round((project.currentFunding / project.fundingGoal) * 100));
  
  const calculateTimeLeft = () => {
    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Project Header */}
        <div className="w-full h-96 relative overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-2">
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Active Project' : project.status === 'funded' ? 'Fully Funded' : 'Completed'}
                    </Badge>
                    <Badge variant="outline">{calculateTimeLeft()} days left</Badge>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  
                  <div className="flex items-center">
                    <ArtistInfo artist={artist} spotifyImage={spotifyImage} />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline">Share</Button>
                  <Button>Invest Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Content */}
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-10">
              {/* Funding Progress */}
              <Card className="animate-scale-in">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Raised</div>
                      <div className="text-2xl font-bold">${project.currentFunding.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Goal</div>
                      <div className="text-2xl font-bold">${project.fundingGoal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">ROI</div>
                      <div className="text-2xl font-bold">{project.roi}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={fundingPercentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{fundingPercentage}% Funded</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {calculateTimeLeft()} days remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Project Tabs */}
              <Tabs defaultValue="overview" className="w-full animate-fade-in">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="packages">Funding Packages</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="investors">Investors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {project.description}
                      {"\n\n"}
                      This project aims to push creative boundaries while establishing a sustainable revenue model. 
                      By investing in this project, you're not only supporting the creation of innovative music but 
                      also potentially sharing in its financial success.
                      {"\n\n"}
                      The funds will be used to cover production costs, recording sessions, marketing, and 
                      distribution. Each aspect of the project has been carefully budgeted to maximize both 
                      artistic quality and commercial potential.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Project Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-16 text-sm text-muted-foreground">Dec 2023</div>
                        <div>
                          <div className="font-medium">Funding Phase</div>
                          <p className="text-sm text-muted-foreground">Project funding campaign ends</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-16 text-sm text-muted-foreground">Jan 2024</div>
                        <div>
                          <div className="font-medium">Production Begins</div>
                          <p className="text-sm text-muted-foreground">Studio sessions and recording starts</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-16 text-sm text-muted-foreground">Apr 2024</div>
                        <div>
                          <div className="font-medium">Mixing & Mastering</div>
                          <p className="text-sm text-muted-foreground">Final production touches</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-16 text-sm text-muted-foreground">Jun 2024</div>
                        <div>
                          <div className="font-medium">Release Phase</div>
                          <p className="text-sm text-muted-foreground">Marketing campaign and distribution</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-16 text-sm text-muted-foreground">Jul 2024</div>
                        <div>
                          <div className="font-medium">Official Release</div>
                          <p className="text-sm text-muted-foreground">Album launch and promotion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="packages" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Funding Packages</h2>
                  <p className="text-muted-foreground mb-6">
                    These packages represent the breakdown of project costs and how your investment will be used.
                  </p>
                  
                  <div className="space-y-6">
                    {project.packages.map((pkg) => (
                      <Card key={pkg.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">{pkg.title}</h3>
                                <Badge variant="outline">{pkg.type}</Badge>
                              </div>
                              <p className="text-muted-foreground">{pkg.description}</p>
                              <div className="text-sm">Provider: {pkg.provider}</div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <div className="text-2xl font-bold">${pkg.cost.toLocaleString()}</div>
                              <Button variant="outline" size="sm">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="updates" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Project Updates</h2>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Campaign Launch</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(project.createdAt).toLocaleDateString(undefined, { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <Badge>Latest</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          We're excited to announce the launch of our funding campaign for {project.title}! 
                          This project represents months of planning and creative development, and we're 
                          thrilled to finally share it with you.
                          <br /><br />
                          We've set a funding goal of ${project.fundingGoal.toLocaleString()} to bring this vision to life. 
                          Thank you for your support and belief in our work!
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="investors" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Project Investors</h2>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium">AM</span>
                            </div>
                            <div>
                              <div className="font-medium">Alex Morgan</div>
                              <div className="text-sm text-muted-foreground">Early Supporter</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">$5,000</div>
                            <div className="text-sm text-muted-foreground">5 days ago</div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium">JS</span>
                            </div>
                            <div>
                              <div className="font-medium">Jordan Smith</div>
                              <div className="text-sm text-muted-foreground">Investor</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">$3,500</div>
                            <div className="text-sm text-muted-foreground">1 week ago</div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium">RK</span>
                            </div>
                            <div>
                              <div className="font-medium">Robin Kim</div>
                              <div className="text-sm text-muted-foreground">New Investor</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">$2,200</div>
                            <div className="text-sm text-muted-foreground">2 weeks ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              {/* Investment Form */}
              <InvestmentForm project={project} />
              
              {/* Artist Card */}
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle>About the Artist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ArtistInfo artist={artist} expanded={true} spotifyImage={spotifyImage} />
                </CardContent>
              </Card>
              
              {/* Revenue Model */}
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle>Revenue Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Streaming Revenue</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Digital Sales</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Licensing & Sync</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Merchandise</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Investors receive {project.roi}% of net revenue until initial investment plus ROI is recouped, followed by a 3% ongoing royalty for 3 years.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Similar Projects */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.filter(p => p.id !== project.id).slice(0, 3).map(project => (
                <Link to={`/project/${project.id}`} key={project.id}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}% Funded</span>
                        <span className="text-primary font-medium">{project.roi}% ROI</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
