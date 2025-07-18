
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/mockData';
import { ArtistProject } from '@/services/artistProfileService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import InvestmentModal from './InvestmentModal';
import WithdrawalModal from './WithdrawalModal';
import { useAuth } from '@/hooks/useAuth';
import { InvestmentService, UserInvestment } from '@/services/investmentService';
import { ProjectFundingService } from '@/services/projectFundingService';

interface ProjectCardProps {
  project: Project | ArtistProject;
  onInvestmentComplete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInvestmentComplete }) => {
  const { isAuthenticated, user } = useAuth();
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [userInvestment, setUserInvestment] = useState<UserInvestment | null>(null);
  const [updatedFunding, setUpdatedFunding] = useState(project.currentFunding);
  
  // Handle different project types
  const isArtistProject = 'bannerImage' in project;
  const projectImage = isArtistProject ? (project as ArtistProject).bannerImage : (project as Project).image;
  const projectROI = isArtistProject ? (project as ArtistProject).expectedROI : (project as Project).roi;
  
  const fundingPercentage = Math.min(100, Math.round((updatedFunding / project.fundingGoal) * 100));
  const timeLeft = () => {
    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleInvestClick = () => {
    if (!isAuthenticated) {
      // Could redirect to login or show login modal
      return;
    }
    setIsInvestmentModalOpen(true);
  };

  const handleInvestmentComplete = async () => {
    if (onInvestmentComplete) {
      onInvestmentComplete();
    }
    // Refresh funding data
    try {
      const projectFunding = await ProjectFundingService.getProjectFundingById(project.id);
      if (projectFunding) {
        setUpdatedFunding(projectFunding.totalInvested);
      }
    } catch (error) {
      console.error('Error refreshing funding data:', error);
    }
  };

  // Check if user has invested in this project
  React.useEffect(() => {
    const checkUserInvestment = async () => {
      if (user) {
        try {
          console.log('ProjectCard: Checking investment for project:', project.id, 'user:', user.id);
          const userInvestments = await InvestmentService.getUserInvestments(user.id);
          console.log('ProjectCard: All user investments:', userInvestments);
          
          const investment = userInvestments.find(inv => inv.projectId === project.id);
          console.log('ProjectCard: Found investment for this project:', investment);
          
          setUserInvestment(investment || null);
        } catch (error) {
          console.error('Error checking user investment:', error);
          setUserInvestment(null);
        }
      }
    };
    
    checkUserInvestment();
  }, [user, project.id]);

  // Fetch updated project funding
  React.useEffect(() => {
    const fetchUpdatedFunding = async () => {
      try {
        const projectFunding = await ProjectFundingService.getProjectFundingById(project.id);
        if (projectFunding) {
          setUpdatedFunding(projectFunding.totalInvested);
          console.log('ProjectCard: Updated funding for project:', project.id, 'amount:', projectFunding.totalInvested);
        }
      } catch (error) {
        console.error('Error fetching updated funding:', error);
      }
    };
    
    fetchUpdatedFunding();
  }, [project.id]);

  const handleWithdrawClick = () => {
    if (!isAuthenticated || !userInvestment) {
      console.log('ProjectCard: Cannot withdraw - authenticated:', isAuthenticated, 'userInvestment:', userInvestment);
      return;
    }
    console.log('ProjectCard: Opening withdrawal modal with investment:', userInvestment);
    setIsWithdrawalModalOpen(true);
  };

  const handleWithdrawalComplete = async () => {
    if (onInvestmentComplete) {
      onInvestmentComplete();
    }
    // Refresh user investment data
    if (user) {
      try {
        const userInvestments = await InvestmentService.getUserInvestments(user.id);
        const investment = userInvestments.find(inv => inv.projectId === project.id);
        setUserInvestment(investment || null);
      } catch (error) {
        console.error('Error refreshing user investment:', error);
        setUserInvestment(null);
      }
    }
  };

  // Image error handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/assets/logo-cricle.png';
  };

  // Create a compatible project object for the investment modal
  const compatibleProject: Project = isArtistProject ? {
    ...project as ArtistProject,
    image: (project as ArtistProject).bannerImage,
    roi: (project as ArtistProject).expectedROI,
    packages: (project as ArtistProject).rewards.map(reward => ({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      cost: reward.minInvestment,
      provider: 'Artist',
      type: 'other' as 'producer' | 'studio' | 'marketing' | 'other'
    })),
    artistId: (project as ArtistProject).artistId,
    createdAt: (project as ArtistProject).createdAt
  } as unknown as Project : project as Project;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col animate-scale-in bg-[#1a1b26]/50 backdrop-blur-sm border-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={projectImage} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3">
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="bg-blue-500/80 text-white">
            {project.status === 'active' ? 'Active' : project.status === 'funded' ? 'Funded' : 'Completed'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <span className="text-blue-400 font-medium">{projectROI}% ROI</span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white">${updatedFunding.toLocaleString()}</span>
              <span className="text-gray-400">${project.fundingGoal.toLocaleString()}</span>
            </div>
            <Progress 
              value={fundingPercentage} 
              className="h-2 [&>div]:bg-blue-500 bg-gray-700" 
            />
            <div className="flex justify-between text-xs">
              <span className="text-blue-400">{fundingPercentage}% Funded</span>
              <span className="text-gray-400">{timeLeft()} days left</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {isArtistProject ? (
              (project as ArtistProject).rewards.slice(0, 3).map((reward) => (
                <Badge 
                  key={reward.id} 
                  variant="outline" 
                  className="justify-center truncate border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  ${reward.minInvestment}+
                </Badge>
              ))
            ) : (
              (project as Project).packages.slice(0, 3).map((pkg) => (
                <Badge 
                  key={pkg.id} 
                  variant="outline" 
                  className="justify-center truncate border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {pkg.type}
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 bg-gray-900/30 pt-3">
        <div className="flex space-x-2 w-full">
          <Link to={`/project/${project.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              View Project
            </Button>
          </Link>
          {userInvestment ? (
            <Button 
              onClick={handleWithdrawClick}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
              disabled={!isAuthenticated}
            >
              Withdraw
            </Button>
          ) : project.status === 'active' ? (
            <Button 
              onClick={handleInvestClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={!isAuthenticated}
            >
              Invest Now
            </Button>
          ) : null}
        </div>
      </CardFooter>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        project={compatibleProject}
        onInvestmentComplete={handleInvestmentComplete}
      />

      {/* Withdrawal Modal */}
      {userInvestment && (
        <WithdrawalModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          investment={userInvestment}
          onWithdrawalComplete={handleWithdrawalComplete}
        />
      )}
    </Card>
  );
};

export default ProjectCard;
