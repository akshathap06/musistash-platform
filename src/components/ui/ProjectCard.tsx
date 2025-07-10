
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/mockData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const fundingPercentage = Math.min(100, Math.round((project.currentFunding / project.fundingGoal) * 100));
  const timeLeft = () => {
    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col animate-scale-in bg-[#1a1b26]/50 backdrop-blur-sm border-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
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
          <span className="text-blue-400 font-medium">{project.roi}% ROI</span>
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
            {project.packages.slice(0, 3).map((pkg) => (
              <Badge 
                key={pkg.id} 
                variant="outline" 
                className="justify-center truncate border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                {pkg.type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 bg-gray-900/30 pt-3">
        <Link to={`/project/${project.id}`} className="w-full">
          <div className="w-full text-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            View Project
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
