
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { useAuth } from '@/hooks/useAuth';
import { projects, investments } from '@/lib/mockData';
import { PlusCircle, ChevronRight, LineChart, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2">Loading Dashboard</div>
          <div className="text-muted-foreground">Please wait...</div>
        </div>
      </div>
    );
  }
  
  // For demo purposes, we'll show different dashboard views based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'artist':
        return <ArtistDashboard />;
      case 'developer':
        return <DeveloperDashboard />;
      default:
        return <ListenerDashboard />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}
              </p>
            </div>
            
            {user.role === 'artist' && (
              <Link to="/create-project">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
            )}
            
            {user.role === 'developer' && (
              <Link to="/create-service">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Service
                </Button>
              </Link>
            )}
          </div>
          
          {renderDashboardContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const ListenerDashboard = () => {
  // For demo purposes, we'll show a few projects as "invested"
  const myInvestments = investments.filter(inv => inv.userId === 'user1');
  const investedProjectIds = myInvestments.map(inv => inv.projectId);
  const investedProjects = projects.filter(project => investedProjectIds.includes(project.id));
  
  // Calculate total invested and potential returns
  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const potentialReturns = investedProjects.reduce((sum, project) => {
    const investment = myInvestments.find(inv => inv.projectId === project.id);
    return sum + (investment ? investment.amount * (project.roi / 100) : 0);
  }, 0);
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Investment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {investedProjects.length} projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${potentialReturns.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on project ROI estimates
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investedProjects.length ? 
                (investedProjects.reduce((sum, project) => sum + project.roi, 0) / investedProjects.length).toFixed(1) + '%' : 
                '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all investments
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Investments Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Investments</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {investedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Investments</CardTitle>
                <CardDescription>
                  You haven't invested in any projects yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/projects">
                  <Button variant="outline" className="w-full">
                    Browse Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/projects">
              <Button variant="outline">
                View More Projects
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>No Completed Investments</CardTitle>
              <CardDescription>
                You don't have any completed investments yet.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ArtistDashboard = () => {
  // For demo purposes, we'll show a few projects as belonging to this artist
  const artistProjects = projects.slice(0, 2);
  
  const totalFundingGoal = artistProjects.reduce((sum, project) => sum + project.fundingGoal, 0);
  const totalCurrentFunding = artistProjects.reduce((sum, project) => sum + project.currentFunding, 0);
  const fundingPercentage = Math.round((totalCurrentFunding / totalFundingGoal) * 100);
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Funding Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Funding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCurrentFunding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fundingPercentage}% of total goal
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artistProjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Seeking ${(totalFundingGoal - totalCurrentFunding).toLocaleString()} more
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Supporting your projects
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Projects and Stats Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <Link to="/create-project">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Analytics</CardTitle>
              <CardDescription>
                Track the performance of your projects over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <LineChart className="h-16 w-16 mb-4 text-primary/40" />
                <p>Detailed analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investor Messages</CardTitle>
              <CardDescription>
                Connect with your investors and service providers
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>No messages yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DeveloperDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Service Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Listed on the marketplace
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,500</div>
            <p className="text-xs text-muted-foreground mt-1">
              From 5 completed projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting your response
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Services Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="services">My Services</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Listed Services</h3>
            <Link to="/create-service">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {projects[0].packages.map(pkg => (
              <Card key={pkg.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{pkg.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{pkg.description}</p>
                      <Badge variant="outline">{pkg.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${pkg.cost.toLocaleString()}</div>
                      <Button size="sm" variant="outline" className="mt-2">Edit Service</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Service Requests</CardTitle>
              <CardDescription>
                Artists interested in your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 2).map((project, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.packages[0].title} - ${project.packages[0].cost.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Decline</Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>
                Track your revenue from services
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <DollarSign className="h-16 w-16 mb-4 text-primary/40" />
                <p>Detailed earnings dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
