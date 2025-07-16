
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/mockData';
import { ArtistProject } from '@/services/artistProfileService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import InvestmentModal from './InvestmentModal';
import { useAuth } from '@/hooks/useAuth';

interface ProjectCardProps {
  project: Project | ArtistProject;
  onInvestmentComplete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInvestmentComplete }) => {
  const { isAuthenticated } = useAuth();
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  
  // Handle different project types
  const isArtistProject = 'bannerImage' in project;
  const projectImage = isArtistProject ? (project as ArtistProject).bannerImage : (project as Project).image;
  const projectROI = isArtistProject ? (project as ArtistProject).expectedROI : (project as Project).roi;
  
  const fundingPercentage = Math.min(100, Math.round((project.currentFunding / project.fundingGoal) * 100));
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

  const handleInvestmentComplete = () => {
    if (onInvestmentComplete) {
      onInvestmentComplete();
    }
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
              <span className="text-white">${project.currentFunding.toLocaleString()}</span>
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
          {project.status === 'active' && (
            <Button 
              onClick={handleInvestClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={!isAuthenticated}
            >
              Invest Now
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        project={compatibleProject}
        onInvestmentComplete={handleInvestmentComplete}
      />
    </Card>
  );
};

export default ProjectCard;
