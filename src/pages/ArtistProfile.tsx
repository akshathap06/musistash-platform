
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { projects, artists, similarityData } from '@/lib/mockData';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { Music, Users, Sparkles, BarChart, ArrowRight } from 'lucide-react';
import spotifyService from '@/services/spotify';
import { SpotifyArtist } from '@/services/spotify/spotifyTypes';

// Add ConnectLinks component locally
interface ConnectLinksProps {
  socialLinks: {
    youtube?: string;
    spotify?: string;
    instagram?: string;
  };
  className?: string;
}

const ConnectLinks: React.FC<ConnectLinksProps> = ({ socialLinks, className }) => {
  if (!socialLinks) return null;
  
  const hasAnyLinks = socialLinks.youtube || socialLinks.spotify || socialLinks.instagram;
  if (!hasAnyLinks) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className || ''}`}>
      {socialLinks.youtube && (
        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </Button>
        </a>
      )}
      {socialLinks.spotify && (
        <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </Button>
        </a>
      )}
      {socialLinks.instagram && (
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-transparent">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </Button>
        </a>
      )}
    </div>
  );
};

interface ArtistData {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  biography?: string;
  genres: string[];
  followers: number;
  verified: boolean;
  successRate: number;
  musical_style?: string;
  influences?: string;
  career_highlights?: any[];
  social_links?: {
    youtube?: string;
    spotify?: string;
    instagram?: string;
  };
}

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [artistProjects, setArtistProjects] = useState([]);
  const [similarityInfo, setSimilarityInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotifyArtist, setSpotifyArtist] = useState<SpotifyArtist | null>(null);
  const [spotifyImage, setSpotifyImage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API fetch for artist data
    const fetchData = async () => {
      try {
        console.log('ArtistProfile: Fetching data for artist ID:', id);
        
        if (!id) {
          console.error('ArtistProfile: No artist ID provided');
          setArtist(null);
          setIsLoading(false);
          return;
        }

        // First try to get from approved profiles
        let foundProfile = await artistProfileService.getProfileById(id);
        console.log('ArtistProfile: Found profile:', foundProfile);
        
        let foundArtist: any;
        
        if (foundProfile && foundProfile.status === 'approved') {
          // Convert profile to artist format
          foundArtist = {
            id: foundProfile.id,
            name: foundProfile.artist_name || 'Unknown Artist',
            avatar: foundProfile.profile_photo || '/assets/logo-cricle.png',
            bio: foundProfile.bio || 'No bio available',
            biography: foundProfile.biography || foundProfile.bio || 'No biography available',
            genres: Array.isArray(foundProfile.genre) ? foundProfile.genre : [],
            followers: 0, // Default for new profiles
            verified: foundProfile.is_verified || false,
            successRate: 75, // Default for new profiles
            musical_style: foundProfile.musical_style || '',
            influences: foundProfile.influences || '',
            career_highlights: foundProfile.career_highlights || [],
            social_links: foundProfile.social_links || {}
          };
          console.log('ArtistProfile: Created artist object from profile:', foundArtist);
          setArtist(foundArtist);
          
          // Get follower count
          try {
          const count = await followingService.getFollowerCount(foundProfile.id);
          setFollowersCount(count);
          } catch (error) {
            console.error('ArtistProfile: Error getting follower count:', error);
            setFollowersCount(0);
          }
          
          // Check if current user is following this artist
          if (user && isAuthenticated) {
            try {
            const isUserFollowing = await followingService.isFollowing(user.id, foundProfile.id);
            setIsFollowing(isUserFollowing);
            } catch (error) {
              console.error('ArtistProfile: Error checking follow status:', error);
              setIsFollowing(false);
            }
          }
        } else {
          console.log('ArtistProfile: No approved profile found, checking mock data');
          // Only show mock data if no approved profile exists
          const mockArtist = artists.find(a => a.id === id);
          if (mockArtist) {
            foundArtist = mockArtist;
            setArtist(foundArtist);
            setFollowersCount(foundArtist.followers || 0);
            
            // Check if current user is following this mock artist
            if (user && isAuthenticated) {
              try {
              const isUserFollowing = await followingService.isFollowing(user.id, mockArtist.id);
              setIsFollowing(isUserFollowing);
              } catch (error) {
                console.error('ArtistProfile: Error checking follow status for mock artist:', error);
                setIsFollowing(false);
              }
            }
          } else {
            // No profile found at all
            console.error('ArtistProfile: No artist found with ID:', id);
            setArtist(null);
            setIsLoading(false);
            return;
          }
        }
        
        // Load projects for this artist
        let foundProjects = [];
        if (foundProfile && foundProfile.status === 'approved') {
          // For approved profiles, get projects from Supabase
          console.log('ArtistProfile: Loading projects for approved profile:', foundProfile.id);
          try {
            const supabaseProjects = await supabaseService.getProjectsByArtist(foundProfile.id);
            console.log('ArtistProfile: Supabase projects:', supabaseProjects);
            
            // Convert Supabase projects to the format expected by ProjectCard
            console.log('ArtistProfile: Raw Supabase projects before filtering:', supabaseProjects);
            
            foundProjects = supabaseProjects
              .filter(project => {
                const isCancelled = (project.status as string) === 'cancelled';
                console.log(`ArtistProfile: Project ${project.title} (${project.id}) has status: ${project.status}, isCancelled: ${isCancelled}`);
                return !isCancelled;
              })
              .map(project => ({
                id: project.id,
                artistId: project.artist_id,
                artistName: foundArtist.name,
                title: project.title || 'Untitled Project',
                description: project.description || 'No description',
                detailedDescription: project.detailed_description || project.description || 'No detailed description',
                bannerImage: project.banner_image || '/assets/logo-cricle.png',
                genre: Array.isArray(project.genre) ? project.genre : [],
                projectType: project.project_type || 'album',
                fundingGoal: Number(project.funding_goal) || 0,
                currentFunding: 0, // TODO: Calculate from investments
                minInvestment: Number(project.min_investment) || 0,
                maxInvestment: Number(project.max_investment) || 0,
                expectedROI: Number(project.expected_roi) || 0,
                projectDuration: project.project_duration || 'Unknown',
                deadline: project.deadline || new Date().toISOString(),
                status: project.status || 'draft',
                createdAt: project.created_at || new Date().toISOString(),
                updatedAt: project.updated_at || new Date().toISOString()
              }));
          } catch (error) {
            console.error('ArtistProfile: Error loading Supabase projects:', error);
            foundProjects = [];
          }
        } else {
          // For mock artists, use mock projects
          foundProjects = projects.filter(p => p.artistId === foundArtist.id);
        }
        
        console.log('ArtistProfile: Final projects array:', foundProjects);
        setArtistProjects(foundProjects);
        
        // Only show similarity data for mock artists
        if (foundProfile && foundProfile.status === 'approved') {
          setSimilarityInfo(null); // No mock similarity data for real profiles
        } else {
          const foundSimilarity = similarityData.find(s => s.artist === foundArtist.name);
          setSimilarityInfo(foundSimilarity);
        }
        
        // Then fetch real Spotify data for the artist
        if (foundArtist && foundArtist.name) {
          try {
          const spotifyData = await spotifyService.searchArtist(foundArtist.name);
          if (spotifyData) {
            setSpotifyArtist(spotifyData);
            if (spotifyData.images && spotifyData.images.length > 0) {
              setSpotifyImage(spotifyData.images[0].url);
            }
            }
          } catch (error) {
            console.error('ArtistProfile: Error fetching Spotify data:', error);
          }
        }
      } catch (error) {
        console.error('ArtistProfile: Error fetching artist data:', error);
        setArtist(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Manual refresh function
    const refreshData = () => {
      console.log('ArtistProfile: Manual refresh triggered');
      fetchData();
    };
  }, [id, user, isAuthenticated]);
  
  const handleFollow = async () => {
    if (!user || !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    // Don't allow following own profile
    if (user.id === artist.id) {
      return;
    }
    
    console.log('Follow button clicked. Current state:', isFollowing);
    console.log('User ID:', user.id, 'Artist ID:', artist.id);
    
    const newFollowingState = !isFollowing;
    console.log('Setting new following state to:', newFollowingState);
    
    // Optimistically update the UI
    setIsFollowing(newFollowingState);
    
    try {
    if (newFollowingState) {
      // Follow the artist
        console.log('Attempting to follow artist...');
      const success = await followingService.followArtist(
        user.id,
        { name: user.name, avatar: user.avatar },
        artist.id,
        { name: artist.name, avatar: artist.avatar }
      );
        
        console.log('Follow operation result:', success);
      
      if (success) {
        setFollowersCount(prev => prev + 1);
        } else {
          // Revert if the operation failed
          console.log('Follow operation failed, reverting state');
          setIsFollowing(false);
      }
    } else {
      // Unfollow the artist
        console.log('Attempting to unfollow artist...');
      const success = await followingService.unfollowArtist(user.id, artist.id);
        
        console.log('Unfollow operation result:', success);
      
      if (success) {
        setFollowersCount(prev => Math.max(0, prev - 1));
        } else {
          // Revert if the operation failed
          console.log('Unfollow operation failed, reverting state');
          setIsFollowing(true);
    }
      }
    } catch (error) {
      console.error('Error following/unfollowing artist:', error);
      // Revert on error
      setIsFollowing(!newFollowingState);
    }
  };

  const handleViewProjectDashboard = () => {
    navigate('/artist-project-dashboard');
  };

  const handleViewLatestProject = () => {
    if (artistProjects.length > 0) {
      navigate(`/project/${artistProjects[0].id}`);
    }
  };

  // Check if current user is the project owner
  const isProjectOwner = user && artist && user.id === artist.id;

  // Image error handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/assets/logo-cricle.png';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading Artist Profile</div>
          <div className="text-muted-foreground">Please wait...</div>
        </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-xl font-semibold mb-2">Artist Not Found</div>
              <div className="text-muted-foreground mb-4">
                The artist profile you're looking for doesn't exist or has been removed.
              </div>
              <Link to="/browse-artists">
                <Button>
                  Browse Artists
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
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
                  onError={handleImageError}
                />
              </div>
              
              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
                  {artist.verified && (
                    <Badge className="h-6">Verified Artist</Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                    className="ml-2"
                  >
                    🔄 Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      console.log('ArtistProfile: Debug - checking project statuses...');
                      for (const project of artistProjects) {
                        const status = await supabaseService.getProjectStatus(project.id);
                        console.log(`Project ${project.title}: Database status = ${status}, UI status = ${project.status}`);
                      }
                    }}
                    className="ml-2"
                  >
                    🐛 Debug
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {spotifyArtist && spotifyArtist.genres ? (
                    spotifyArtist.genres.slice(0, 4).map((genre, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">{genre}</Badge>
                    ))
                  ) : (
                    artist.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">{genre}</Badge>
                    ))
                  )}
                </div>
                
                <p className="text-muted-foreground max-w-2xl mb-6">{artist.bio}</p>
                
                {/* Social Links */}
                {artist.social_links && (
                  <div className="mb-6">
                    <ConnectLinks socialLinks={artist.social_links} />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">
                      {spotifyArtist && spotifyArtist.followers ? 
                        `${spotifyArtist.followers.total.toLocaleString()} Followers` : 
                        `${followersCount} Followers`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{artistProjects.length} Projects</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">
                      {spotifyArtist ? 
                        `${spotifyArtist.popularity}% Popularity` : 
                        `${artist.successRate}% Success Rate`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                  {user && isAuthenticated && user.id !== artist.id && (
                  <Button 
                      onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "border-green-500 text-green-400 hover:bg-green-500/20" : "bg-blue-600 hover:bg-blue-700"}
                  >
                      {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
                  <Button onClick={handleViewLatestProject} variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/20">
                    View Latest Project
                  </Button>
                  {isProjectOwner && (
                    <Button 
                      onClick={handleViewProjectDashboard}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View Project Dashboard
                    </Button>
                  )}
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
                  {artistProjects.map(project => {
                    // Ensure project has all required fields for ProjectCard
                    const safeProject = {
                      id: project.id || 'unknown',
                      artistId: project.artistId || artist.id,
                      title: project.title || 'Untitled Project',
                      description: project.description || 'No description',
                      image: project.bannerImage || project.image || '/assets/logo-cricle.png',
                      fundingGoal: Number(project.fundingGoal) || 0,
                      currentFunding: Number(project.currentFunding) || 0,
                      roi: Number(project.expectedROI) || Number(project.roi) || 0,
                      deadline: project.deadline || new Date().toISOString(),
                      packages: project.packages || [{
                        id: 'default',
                        title: 'Basic Investment',
                        description: 'Standard investment package',
                        cost: Number(project.minInvestment) || 100,
                        provider: 'MusiStash',
                        type: 'other' as const
                      }],
                      status: project.status || 'draft',
                      createdAt: project.createdAt || new Date().toISOString()
                    };
                    
                    return (
                      <div key={project.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                        <ProjectCard project={safeProject} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-medium mb-2">No active projects</div>
                    <p className="text-muted-foreground mb-4">
                      This artist doesn't have any active funding projects at the moment.
                    </p>
                    <Link to="/projects">
                      <Button variant="outline" className="text-foreground">
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
                      {artist.biography ? (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {artist.biography}
                      </p>
                      ) : (
                      <p className="text-muted-foreground">
                          {artist.bio || "No biography available yet."}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Musical Style & Influences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {artist.musical_style ? (
                        <div>
                          <h4 className="font-medium mb-2">Musical Style</h4>
                          <p className="text-muted-foreground mb-4">
                            {artist.musical_style}
                          </p>
                        </div>
                      ) : (
                      <p className="text-muted-foreground">
                        {artist.name}'s music blends traditional elements of {
                          spotifyArtist && spotifyArtist.genres ? 
                            spotifyArtist.genres.slice(0, 2).join(' and ') : 
                            artist.genres.join(' and ')
                        } with innovative production techniques. Their sound is characterized by emotional depth
                        and meticulous attention to sonic detail.
                      </p>
                      )}
                      
                      {artist.influences && (
                        <div>
                          <h4 className="font-medium mb-2">Influences</h4>
                      <p className="text-muted-foreground">
                            {artist.influences}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {artist.career_highlights && artist.career_highlights.length > 0 ? (
                        <div className="space-y-4">
                          {artist.career_highlights.map((highlight: any, index: number) => (
                            <div key={index} className="flex gap-3">
                              <div className="text-sm font-medium text-primary">
                                {highlight.year || 'N/A'}
                              </div>
                              <div>
                                <div className="font-medium">{highlight.title || highlight.achievement}</div>
                                <p className="text-sm text-muted-foreground">
                                  {highlight.description || highlight.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
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
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-foreground">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                          </svg>
                          YouTube
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start text-foreground">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.5 8.5c0-1.933-1.566-3.5-3.5-3.5s-3.5 1.567-3.5 3.5c0 1.31.724 2.45 1.792 3.051-.022 1.146-.348 3.265-2.444 4.445-.145.066-.148.19.008.246 2.904 1.024 4.395-1.678 4.644-2.472.21.016.435.03.651.03 1.934 0 3.5-1.567 3.5-3.5"/>
                          </svg>
                          Spotify
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start text-foreground">
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
                                <div className="text-2xl font-semibold">{spotifyArtist ? spotifyArtist.popularity : artist.successRate}%</div>
                                <div className="text-sm text-muted-foreground">{spotifyArtist ? 'Spotify Popularity' : 'Project Success Rate'}</div>
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
                      {similarityInfo ? (
                        <div className="space-y-3">
                          {(spotifyArtist ? spotifyArtist.genres : artist.genres).slice(0, 3).map((genre, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm capitalize">{genre}</span>
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
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No trend data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {similarityInfo ? (
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
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No demographic data available</p>
                        </div>
                      )}
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
