import { projects } from '@/lib/mockData';
import { InvestmentService } from './investmentService';

export interface ProjectFunding {
  projectId: string;
  totalInvested: number;
  investorCount: number;
  lastUpdated: string;
}

export class ProjectFundingService {
  private static STORAGE_KEY = 'musistash_project_funding';

  // Get current funding for all projects
  static async getProjectFunding(): Promise<ProjectFunding[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize with mock data if no stored data
      const initialFunding: ProjectFunding[] = projects.map(project => ({
        projectId: project.id,
        totalInvested: project.currentFunding,
        investorCount: Math.floor(project.currentFunding / 1000), // Mock investor count
        lastUpdated: new Date().toISOString()
      }));
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialFunding));
      return initialFunding;
    } catch (error) {
      console.error('Error getting project funding:', error);
      return [];
    }
  }

  // Get funding for a specific project
  static async getProjectFundingById(projectId: string): Promise<ProjectFunding | null> {
    const allFunding = await this.getProjectFunding();
    return allFunding.find(funding => funding.projectId === projectId) || null;
  }

  // Update project funding when a new investment is made
  static async updateProjectFunding(projectId: string, investmentAmount: number): Promise<void> {
    try {
      console.log('ProjectFundingService: Updating funding for project:', projectId, 'amount:', investmentAmount);
      
      const allFunding = await this.getProjectFunding();
      const projectFunding = allFunding.find(funding => funding.projectId === projectId);
      
      if (projectFunding) {
        projectFunding.totalInvested += investmentAmount;
        projectFunding.investorCount += 1;
        projectFunding.lastUpdated = new Date().toISOString();
      } else {
        // Create new funding record
        allFunding.push({
          projectId,
          totalInvested: investmentAmount,
          investorCount: 1,
          lastUpdated: new Date().toISOString()
        });
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allFunding));
      console.log('ProjectFundingService: Updated project funding:', allFunding);
    } catch (error) {
      console.error('Error updating project funding:', error);
    }
  }

  // Get updated project data with real funding
  static async getUpdatedProjects() {
    try {
      const projectFunding = await this.getProjectFunding();
      
      return projects.map(project => {
        const funding = projectFunding.find(f => f.projectId === project.id);
        return {
          ...project,
          currentFunding: funding ? funding.totalInvested : project.currentFunding
        };
      });
    } catch (error) {
      console.error('Error getting updated projects:', error);
      return projects;
    }
  }

  // Calculate funding percentage for a project
  static calculateFundingPercentage(currentFunding: number, fundingGoal: number): number {
    return Math.min(100, Math.round((currentFunding / fundingGoal) * 100));
  }

  // Reset all project funding (for testing)
  static resetProjectFunding(): void {
    try {
      console.log('ProjectFundingService: Resetting all project funding');
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting project funding:', error);
    }
  }
} 