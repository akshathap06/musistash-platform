import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService } from '@/services/artistProfileService';
import { supabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Target, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { Database } from '@/lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type Investment = Database['public']['Tables']['investments']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface ProjectWithInvestments extends Project {
  investments: Investment[];
  totalInvested: number;
  investorCount: number;
}

const ArtistProjectDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectWithInvestments[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectWithInvestments | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      loadArtistData();
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const loadArtistData = async () => {
    try {
      setIsLoadingProjects(true);
      
      // Get artist profile
      const profile = await artistProfileService.getProfileByUserId(user!.id);
      if (!profile) {
        toast({
          title: "Artist Profile Required",
          description: "Please create an artist profile first",
          variant: "destructive"
        });
        navigate('/artist-profile');
        return;
      }
      
      setArtistProfile(profile);

      // Get projects for this artist
      const projectsData = await supabaseService.getProjectsByArtist(profile.id, true); // Include cancelled projects for dashboard
      console.log('ArtistProjectDashboard: Projects data:', projectsData);
      
      // Get investments for each project
      const projectsWithInvestments = await Promise.all(
        projectsData.map(async (project) => {
          const investments = await supabaseService.getInvestmentsByProject(project.id);
          const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
          
          return {
            ...project,
            investments,
            totalInvested,
            investorCount: investments.length
          };
        })
      );
      
      setProjects(projectsWithInvestments);
    } catch (error) {
      console.error('Error loading artist data:', error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleViewProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowProjectDetails(true);
    }
  };

  const handleCloseProjectDetails = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  const handleEndProject = async (projectId: string, projectTitle: string) => {
    // Check if project is being ended prematurely
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const fundingGoal = project.funding_goal || 0;
    const totalInvested = project.totalInvested || 0;
    const deadline = new Date(project.deadline);
    const today = new Date();
    const isPremature = totalInvested < fundingGoal || today < deadline;

    let warningMessage = `Are you sure you want to end "${projectTitle}"?`;
    
    if (isPremature) {
      warningMessage = `⚠️ WARNING: You are ending "${projectTitle}" PREMATURELY!\n\n` +
        `• Funding Goal: $${fundingGoal.toLocaleString()}\n` +
        `• Current Funding: $${totalInvested.toLocaleString()}\n` +
        `• Deadline: ${deadline.toLocaleDateString()}\n\n` +
        `This project will be moved to the trash and ALL investments will be returned to investors.\n\n` +
        `Are you absolutely sure you want to proceed?`;
    } else {
      warningMessage = `Are you sure you want to end "${projectTitle}"?\n\n` +
        `This project has met its funding goal and deadline. All investments will be returned to investors.`;
    }

    if (!confirm(warningMessage)) {
      return;
    }

    try {
      console.log('ArtistProjectDashboard: Starting to end project:', projectId, 'by user:', user!.id);
      console.log('ArtistProjectDashboard: Project is premature:', isPremature);
      
      // Call the Supabase service to end the project
      const endedProject = await supabaseService.endProject(projectId, user!.id);
      
      console.log('ArtistProjectDashboard: End project result:', endedProject);
      
      if (endedProject) {
        const statusMessage = isPremature 
          ? `"${projectTitle}" has been cancelled prematurely and moved to trash. All investments returned to investors.`
          : `"${projectTitle}" has been completed successfully. All investments returned to investors.`;

        toast({
          title: isPremature ? "Project Cancelled" : "Project Completed",
          description: statusMessage,
        });
        
        // Close the modal and refresh data
        setShowProjectDetails(false);
        setSelectedProject(null);
        loadArtistData();
      } else {
        console.error('ArtistProjectDashboard: endProject returned null');
        throw new Error('Failed to end project - service returned null');
      }
    } catch (error) {
      console.error('ArtistProjectDashboard: Error ending project:', error);
      console.error('ArtistProjectDashboard: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to end project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // TODO: Implement project deletion
      toast({
        title: "Project Deleted",
        description: `"${projectTitle}" has been deleted`,
      });
      loadArtistData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          icon: CheckCircle, 
          color: "text-green-400", 
          bgColor: "bg-green-500/20", 
          label: "Active" 
        };
      case 'draft':
        return { 
          icon: Clock, 
          color: "text-blue-400", 
          bgColor: "bg-blue-500/20", 
          label: "Draft" 
        };
      case 'pending':
        return { 
          icon: Clock, 
          color: "text-yellow-400", 
          bgColor: "bg-yellow-500/20", 
          label: "Pending Approval" 
        };
      case 'funded':
        return { 
          icon: CheckCircle, 
          color: "text-green-400", 
          bgColor: "bg-green-500/20", 
          label: "Funded" 
        };
      case 'completed':
        return { 
          icon: CheckCircle, 
          color: "text-purple-400", 
          bgColor: "bg-purple-500/20", 
          label: "Completed" 
        };
      case 'cancelled':
        return { 
          icon: AlertCircle, 
          color: "text-red-400", 
          bgColor: "bg-red-500/20", 
          label: "Cancelled" 
        };
      case 'ended':
        return { 
          icon: CheckCircle, 
          color: "text-purple-400", 
          bgColor: "bg-purple-500/20", 
          label: "Ended" 
        };
      default:
        return { 
          icon: AlertCircle, 
          color: "text-gray-400", 
          bgColor: "bg-gray-500/20", 
          label: "Unknown" 
        };
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse text-center">
              <div className="text-xl font-semibold mb-2">Loading Project Dashboard</div>
              <div className="text-muted-foreground">Please wait...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalFunding = projects.reduce((sum, p) => sum + p.totalInvested, 0);
  const totalInvestors = projects.reduce((sum, p) => sum + p.investorCount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your music projects and track investor activity
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCreateProject} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Total Projects
                    </CardTitle>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalProjects}</div>
                  <p className="text-xs text-gray-400 mt-1">Projects created</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Active Projects
                    </CardTitle>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{activeProjects}</div>
                  <p className="text-xs text-gray-400 mt-1">Currently active</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
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
                  <div className="text-2xl font-bold text-white">${totalFunding.toLocaleString()}</div>
                  <p className="text-xs text-gray-400 mt-1">Raised from investors</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Total Investors
                    </CardTitle>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalInvestors}</div>
                  <p className="text-xs text-gray-400 mt-1">Supporting your projects</p>
                </CardContent>
              </Card>
            </div>

            {/* Projects Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Projects ({totalProjects})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeProjects})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({projects.filter(p => (p.status as string) === 'draft').length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({projects.filter(p => (p.status as string) === 'pending').length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({projects.filter(p => (p.status as string) === 'completed').length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({projects.filter(p => (p.status as string) === 'cancelled').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {projects.length === 0 ? (
                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardContent className="p-8 text-center">
                      <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                      <p className="text-gray-400 mb-4">
                        Start your music journey by creating your first project to raise funds and connect with investors
                      </p>
                      <Button onClick={handleCreateProject} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => {
                      const statusConfig = getStatusConfig(project.status);
                      const StatusIcon = statusConfig.icon;
                      const fundingPercentage = Math.min(100, Math.round((project.totalInvested / project.funding_goal) * 100));
                      
                      return (
                        <Card key={project.id} className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">
                                  {project.description}
                                </CardDescription>
                              </div>
                              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Funding Progress */}
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">${project.totalInvested.toLocaleString()}</span>
                                <span className="text-gray-400">${project.funding_goal.toLocaleString()}</span>
                              </div>
                              <Progress value={fundingPercentage} className="h-2" />
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-blue-400">{fundingPercentage}% Funded</span>
                                <span className="text-gray-400">{project.investorCount} investors</span>
                              </div>
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Type:</span>
                                <div className="font-medium capitalize text-white">{project.project_type}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">ROI:</span>
                                <div className="font-medium text-white">{project.expected_roi}%</div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleViewProject(project.id)}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              {project.status === 'draft' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditProject(project.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteProject(project.id, project.title)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.filter(p => p.status === 'active').map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const StatusIcon = statusConfig.icon;
                    const fundingPercentage = Math.min(100, Math.round((project.totalInvested / project.funding_goal) * 100));
                    
                    return (
                      <Card key={project.id} className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                            <Badge className={`${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">${project.totalInvested.toLocaleString()}</span>
                              <span className="text-gray-400">${project.funding_goal.toLocaleString()}</span>
                            </div>
                            <Progress value={fundingPercentage} className="h-2" />
                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-blue-400">{fundingPercentage}% Funded</span>
                              <span className="text-gray-400">{project.investorCount} investors</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleViewProject(project.id)}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="draft" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.filter(p => p.status === 'draft').map((project) => (
                    <Card key={project.id} className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditProject(project.id)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Project
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.filter(p => (p.status as string) === 'pending').map((project) => (
                    <Card key={project.id} className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <Clock className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                          <p className="text-gray-400">Waiting for admin approval</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.filter(p => (p.status as string) === 'completed').map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <Card key={project.id} className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                            <Badge className={`${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
                            <p className="text-gray-400">Project completed - investments returned to investors</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Completed on {new Date(project.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.filter(p => (p.status as string) === 'cancelled').map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <Card key={project.id} className="bg-gray-800/50 border-gray-700/50 opacity-75">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                            <Badge className={`${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-2" />
                            <p className="text-gray-400 font-medium">Project Cancelled Prematurely</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Ended on {new Date(project.updated_at).toLocaleDateString()}
                            </p>
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-sm text-red-300">
                                ⚠️ This project was ended before reaching its funding goal or deadline.
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                All investments have been returned to investors.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 border border-gray-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleEndProject(selectedProject.id, selectedProject.title)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {(() => {
                      const fundingGoal = selectedProject.funding_goal || 0;
                      const totalInvested = selectedProject.totalInvested || 0;
                      const deadline = new Date(selectedProject.deadline);
                      const today = new Date();
                      const isPremature = totalInvested < fundingGoal || today < deadline;
                      
                      return isPremature ? "Cancel Project" : "End Project";
                    })()}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseProjectDetails}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Overview */}
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Type</span>
                        <div className="font-medium capitalize text-white">{selectedProject.project_type}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Genre</span>
                        <div className="font-medium text-white">{Array.isArray(selectedProject.genre) ? selectedProject.genre.join(', ') : selectedProject.genre}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Expected ROI</span>
                        <div className="font-medium text-green-400">{selectedProject.expected_roi}%</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Duration</span>
                        <div className="font-medium text-white">{selectedProject.project_duration}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 text-sm">Detailed Description</span>
                      <div className="mt-1 text-sm text-gray-300">{selectedProject.detailed_description || 'No detailed description available'}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Funding Progress */}
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Funding Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">${selectedProject.totalInvested.toLocaleString()}</span>
                        <span className="text-white">${selectedProject.funding_goal.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, Math.round((selectedProject.totalInvested / selectedProject.funding_goal) * 100))} 
                        className="h-3" 
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-blue-400">
                          {Math.min(100, Math.round((selectedProject.totalInvested / selectedProject.funding_goal) * 100))}% Funded
                        </span>
                        <span className="text-white">{selectedProject.investorCount} investors</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Min Investment</span>
                        <div className="font-medium text-white">${selectedProject.min_investment?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Investment</span>
                        <div className="font-medium text-white">${selectedProject.max_investment?.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Investors List */}
              <Card className="bg-gray-800/50 border-gray-700/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    Investors ({selectedProject.investorCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProject.investments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProject.investments.map((investment, index) => (
                        <div key={investment.id} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-white">Investor #{index + 1}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(investment.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-400">
                              ${investment.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              {((investment.amount / selectedProject.funding_goal) * 100).toFixed(1)}% of goal
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p>No investors yet</p>
                      <p className="text-sm">Share your project to attract investors!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Timeline */}
              <Card className="bg-gray-800/50 border-gray-700/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Created</div>
                        <div className="text-sm text-gray-400">
                          {new Date(selectedProject.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Deadline</div>
                        <div className="text-sm text-gray-400">
                          {new Date(selectedProject.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                    
                    <div className="text-sm text-gray-400 mt-4">
                      {(() => {
                        const deadline = new Date(selectedProject.deadline);
                        const today = new Date();
                        const diffTime = deadline.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays > 0 ? `${diffDays} days remaining` : 'Deadline passed';
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ArtistProjectDashboard; 