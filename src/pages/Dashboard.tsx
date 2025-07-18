import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { useAuth } from '@/hooks/useAuth';
import { projects } from '@/lib/mockData';
import { InvestmentService, UserInvestment } from '@/services/investmentService';
import { artistProfileService } from '@/services/artistProfileService';
import { followingService } from '@/services/followingService';
import { PlusCircle, ChevronRight, LineChart, DollarSign, TrendingUp, Zap, Music, User, Users, Heart, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ThemeSelector from '@/components/ui/ThemeSelector';
import ProfitProjectionChart from '@/components/ui/ProfitProjectionChart';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await artistProfileService.getProfileByUserId(user.id);
          setUserProfile(profile);
          
          // Load following count
          const followingCount = await followingService.getFollowingCount(user.id);
          setFollowingCount(followingCount);
          
          // Load followers count if user has an approved artist profile
          if (profile && profile.status === 'approved') {
            const followersCount = await followingService.getFollowerCount(profile.id);
            setFollowersCount(followersCount);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile(null);
        } finally {
          setProfileLoading(false);
        }
      }
    };
    
    loadUserProfile();
  }, [user]);

  const handleInvestmentComplete = () => {
    // This will trigger re-renders in child components
    // Since we're using the investment service, components will refresh their data
  };
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="text-xl font-semibold mb-2 text-white">Loading Dashboard</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }
  
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'artist':
        return <ArtistDashboard onInvestmentComplete={handleInvestmentComplete} />;
      case 'developer':
        return <DeveloperDashboard onInvestmentComplete={handleInvestmentComplete} />;
      default:
        return (
          <ListenerDashboard 
            onInvestmentComplete={handleInvestmentComplete}
            showFollowingModal={showFollowingModal}
            setShowFollowingModal={setShowFollowingModal}
            showFollowersModal={showFollowersModal}
            setShowFollowersModal={setShowFollowersModal}
          />
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header Section with Gradient Background */}
          <div className="relative mb-8 md:mb-12 p-4 md:p-8 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                  <img
                    className="w-full h-full rounded-full object-cover bg-gray-800"
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 text-transparent bg-clip-text">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg mt-1">
                    {user.role === 'artist' ? 'Create and manage your music projects' : 
                     user.role === 'developer' ? 'Build the future of music technology' :
                     'Discover and invest in the next big hits, or create your own artist profile'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 capitalize">
                      {user.role}
                    </Badge>
                    <button
                      onClick={() => setShowFollowingModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/50 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {followingCount} Following
                    </button>
                    {userProfile && userProfile.status === 'approved' && (
                      <button
                        onClick={() => setShowFollowersModal(true)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/50 rounded-full hover:bg-green-500/30 transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        {followersCount} Followers
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <ThemeSelector />
                
                {(user.role === 'artist' || user.role === 'listener') && !profileLoading && (
                  <>
                    {userProfile ? (
                      <Link to="/view-artist-profile" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-300 hover:bg-blue-500/20 bg-gray-800/50 backdrop-blur-sm">
                          <User className="mr-2 h-4 w-4" />
                          View Artist Profile
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/create-artist-profile" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-300 hover:bg-blue-500/20 bg-gray-800/50 backdrop-blur-sm">
                          <User className="mr-2 h-4 w-4" />
                          Create Artist Profile
                        </Button>
                      </Link>
                    )}
                    <Link to="/create-project" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Project
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              {user.role === 'developer' && (
                <Link to="/create-service">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Service
                  </Button>
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <User className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {renderDashboardContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

interface DashboardProps {
  onInvestmentComplete: () => void;
  showFollowingModal?: boolean;
  setShowFollowingModal?: (show: boolean) => void;
  showFollowersModal?: boolean;
  setShowFollowersModal?: (show: boolean) => void;
}

const ListenerDashboard: React.FC<DashboardProps> = ({ 
  onInvestmentComplete, 
  showFollowingModal, 
  setShowFollowingModal, 
  showFollowersModal, 
  setShowFollowersModal 
}) => {
  const { user } = useAuth();
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 0,
    totalProjects: 0,
    potentialReturns: 0,
    averageROI: 0,
    investments: [] as UserInvestment[]
  });
  const [recentFollowing, setRecentFollowing] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentFollowers, setRecentFollowers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const stats = await InvestmentService.getUserInvestmentStats(user.id);
          setInvestmentStats(stats);
          
          // Load following data
          const following = await followingService.getRecentFollowing(user.id);
          setRecentFollowing(following);
          
          // Load user profile and followers data
          const profile = await artistProfileService.getProfileByUserId(user.id);
          setUserProfile(profile);
          
          if (profile && profile.status === 'approved') {
            const followers = await followingService.getRecentFollowers(profile.id);
            setRecentFollowers(followers);
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      }
    };
    
    loadData();
  }, [user]);

  const handleInvestmentComplete = async () => {
    if (user) {
      try {
        const stats = await InvestmentService.getUserInvestmentStats(user.id);
        setInvestmentStats(stats);
      } catch (error) {
        console.error('Error refreshing investment stats:', error);
      }
    }
    onInvestmentComplete();
  };

  // Get projects that the user has invested in
  const investedProjectIds = investmentStats.investments.map(inv => inv.projectId);
  const investedProjects = projects.filter(project => investedProjectIds.includes(project.id));
  
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Invested
              </CardTitle>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${investmentStats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Across {investmentStats.totalProjects} projects
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Potential Returns
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <LineChart className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${investmentStats.potentialReturns.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Based on project ROI estimates
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Average ROI
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {investmentStats.averageROI > 0 ? `${investmentStats.averageROI}%` : '0%'}
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Music className="w-3 h-3 mr-1" />
              Across all investments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Projection Chart */}
      {investmentStats.totalInvested > 0 && (
        <ProfitProjectionChart
          totalInvested={investmentStats.totalInvested}
          potentialReturns={investmentStats.potentialReturns}
          averageROI={investmentStats.averageROI}
          investments={investmentStats.investments}
        />
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50">
          <TabsTrigger 
            value="portfolio" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            My Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="discover"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Discover Projects
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Your Investments</h2>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              {investmentStats.totalProjects} Active
            </Badge>
          </div>
          
          {investedProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {investedProjects.map((project) => (
                <div key={project.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProjectCard project={project} onInvestmentComplete={handleInvestmentComplete} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No investments yet</h3>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  Start building your music investment portfolio by discovering and investing in promising projects.
                </p>
                <Link to="/discover-projects">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Discover Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Trending Projects</h2>
            <Link to="/discover-projects">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} className="transform hover:scale-105 transition-all duration-300">
                <ProjectCard project={project} onInvestmentComplete={handleInvestmentComplete} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Following Modal */}
      {showFollowingModal && setShowFollowingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Following ({recentFollowing.length})
              </h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {recentFollowing.length > 0 ? (
                <div className="space-y-3">
                  {recentFollowing.map((follow) => (
                    <div key={follow.artistId} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={follow.artistAvatar}
                          alt={follow.artistName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{follow.artistName}</p>
                          <p className="text-xs text-gray-400">
                            Followed {new Date(follow.followedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link to={`/artist/${follow.artistId}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-400 mb-2">Not following any artists yet</p>
                  <Link to="/browse-artists">
                    <Button variant="outline" size="sm">
                      Discover Artists
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && setShowFollowersModal && userProfile && userProfile.status === 'approved' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Followers ({recentFollowers.length})
              </h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {recentFollowers.length > 0 ? (
                <div className="space-y-3">
                  {recentFollowers.map((follower) => (
                    <div key={follower.followerId} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={follower.followerAvatar}
                          alt={follower.followerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{follower.followerName}</p>
                          <p className="text-xs text-gray-400">
                            Followed you {new Date(follower.followedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-400">No followers yet</p>
                  <p className="text-xs text-gray-500 mt-1">Share your artist profile to get followers</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArtistDashboard: React.FC<DashboardProps> = ({ onInvestmentComplete }) => {
  const { user } = useAuth();
  const [artistProjects, setArtistProjects] = useState([]);
  const [artistProfile, setArtistProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [recentFollowers, setRecentFollowers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const profile = await artistProfileService.getProfileByUserId(user.id);
        setArtistProfile(profile);
        
        if (profile) {
          const userProjects = await artistProfileService.getProjectsByArtistId(profile.id);
          setArtistProjects(userProjects);
          
          // Load followers data
          const count = await followingService.getFollowerCount(profile.id);
          setFollowersCount(count);
          
          const followers = await followingService.getRecentFollowers(profile.id);
          setRecentFollowers(followers);
        }
      }
    };
    
    loadData();
  }, [user]);
  
  const totalFundingGoal = artistProjects.reduce((sum, project) => sum + project.fundingGoal, 0);
  const totalCurrentFunding = artistProjects.reduce((sum, project) => sum + project.currentFunding, 0);
  const fundingPercentage = totalFundingGoal > 0 ? Math.round((totalCurrentFunding / totalFundingGoal) * 100) : 0;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Funding
              </CardTitle>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalCurrentFunding.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {fundingPercentage}% of total goal
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Projects
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{artistProjects.length}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Seeking ${(totalFundingGoal - totalCurrentFunding).toLocaleString()} more
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Investors
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Supporting your projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Followers Section for Artists */}
      {artistProfile && artistProfile.status === 'approved' && (
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Your Followers</CardTitle>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">
                  {followersCount} Followers
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentFollowers.length > 0 ? (
              <div className="space-y-3">
                {recentFollowers.map((follower) => (
                  <div key={follower.followerId} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={follower.followerAvatar}
                        alt={follower.followerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{follower.followerName}</p>
                        <p className="text-xs text-gray-400">
                          Followed you {new Date(follower.followedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentFollowers.length >= 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      View All Followers
                    </Button>
                  </div>
                )}
              </div>
            ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-400">No followers yet</p>
                  <p className="text-xs text-gray-500 mt-1">Share your artist profile to get followers</p>
                </div>
              )}
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50">
          <TabsTrigger 
            value="projects"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            My Projects
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="messages"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Active Projects</h2>
            <Link to="/create-project">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistProjects.length > 0 ? (
              artistProjects.map(project => (
                <div key={project.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProjectCard project={project} onInvestmentComplete={onInvestmentComplete} />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first project to start raising funds for your music</p>
                  <Link to="/create-project">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Project
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Funding Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Track the performance of your projects over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-gray-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <LineChart className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-400">Detailed project performance insights will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6 mt-6">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Investor Messages</CardTitle>
              <CardDescription className="text-gray-400">
                Connect with your investors and service providers
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
              <div className="text-center text-gray-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Messages Yet</h3>
                <p className="text-gray-400">Messages from investors will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DeveloperDashboard: React.FC<DashboardProps> = ({ onInvestmentComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Services
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Listed on the marketplace
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Revenue
              </CardTitle>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$12,500</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              From 5 completed projects
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Pending Requests
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Awaiting your response
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50">
          <TabsTrigger 
            value="services"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            My Services
          </TabsTrigger>
          <TabsTrigger 
            value="requests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Service Requests
          </TabsTrigger>
          <TabsTrigger 
            value="earnings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Earnings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Listed Services</h2>
            <Link to="/create-service">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {projects[0].packages.map(pkg => (
              <Card key={pkg.id} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-white">{pkg.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{pkg.description}</p>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 capitalize">{pkg.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${pkg.cost.toLocaleString()}</div>
                      <Button size="sm" variant="outline" className="mt-2 border-gray-600 text-gray-300 hover:bg-gray-700">Edit Service</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-6 mt-6">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">New Service Requests</CardTitle>
              <CardDescription className="text-gray-400">
                Artists interested in your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 2).map((project, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium text-white">{project.title}</h4>
                      <p className="text-sm text-gray-400">
                        {project.packages[0].title} - ${project.packages[0].cost.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Decline</Button>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-6 mt-6">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Earnings Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Track your revenue from services
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-gray-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Earnings Dashboard Coming Soon</h3>
                <p className="text-gray-400">Detailed revenue tracking and analytics will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
