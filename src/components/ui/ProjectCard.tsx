
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col animate-scale-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status === 'active' ? 'Active' : project.status === 'funded' ? 'Funded' : 'Completed'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <span className="text-primary font-medium">{project.roi}% ROI</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>${project.currentFunding.toLocaleString()}</span>
              <span className="text-muted-foreground">${project.fundingGoal.toLocaleString()}</span>
            </div>
            <Progress value={fundingPercentage} className="h-2" />
            <div className="flex justify-between text-xs">
              <span>{fundingPercentage}% Funded</span>
              <span className="text-muted-foreground">{timeLeft()} days left</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {project.packages.slice(0, 3).map((pkg) => (
              <Badge key={pkg.id} variant="outline" className="justify-center truncate">
                {pkg.type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/10 pt-3">
        <Link to={`/project/${project.id}`} className="w-full">
          <div className="w-full text-center text-sm font-medium text-primary hover:underline">
            View Project
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
