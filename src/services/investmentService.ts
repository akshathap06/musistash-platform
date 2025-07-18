import { Investment } from '@/lib/mockData';
import { supabaseService } from './supabaseService';
import { artistProfileService } from './artistProfileService';

export interface UserInvestment extends Investment {
  projectTitle: string;
  projectROI: number;
  investmentDate: string;
}

export interface WithdrawalRequest {
  userId: string;
  investmentId: string;
  amount: number;
  percentage: number;
  type: 'partial' | 'full';
  projectTitle: string;
  projectROI: number;
}

export class InvestmentService {
  private static STORAGE_KEY = 'musistash_user_investments';

  // Get all investments for a specific user
  static async getUserInvestments(userId: string): Promise<UserInvestment[]> {
    try {
      console.log('InvestmentService: getUserInvestments called for user:', userId);
      
      // First try to get from database
      const dbInvestments = await supabaseService.getUserInvestments(userId);
      console.log('InvestmentService: Database investments found:', dbInvestments.length);
      
      // Convert database investments to UserInvestment format
      const dbUserInvestments: UserInvestment[] = await Promise.all(
        dbInvestments.map(async (dbInv) => {
          // Get project details to include project title and ROI
          let projectTitle = 'Unknown Project';
          let projectROI = 0;
          
          try {
            // Try to get project details from artistProfileService
            const project = await artistProfileService.getProjectById(dbInv.project_id);
            if (project) {
              projectTitle = project.title;
              projectROI = project.expectedROI || 0;
            }
          } catch (error) {
            console.error('Error fetching project details:', error);
          }
          
          return {
            id: dbInv.id,
            userId: dbInv.user_id,
            projectId: dbInv.project_id,
            amount: dbInv.amount,
            date: dbInv.date,
            status: dbInv.status === 'cancelled' ? 'canceled' : dbInv.status,
            projectTitle,
            projectROI,
            investmentDate: dbInv.investment_date || dbInv.created_at
          };
        })
      );
      
      // Also get localStorage investments (for mock projects)
      let localStorageInvestments: UserInvestment[] = [];
      try {
        const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
        if (storedInvestments) {
          const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
          localStorageInvestments = allInvestments.filter(investment => investment.userId === userId);
          console.log('InvestmentService: localStorage investments found:', localStorageInvestments.length);
        }
      } catch (localError) {
        console.error('Error retrieving user investments from localStorage:', localError);
      }
      
      // Combine both sources, prioritizing database investments
      const combinedInvestments = [...dbUserInvestments, ...localStorageInvestments];
      console.log('InvestmentService: Total investments found:', combinedInvestments.length);
      
      return combinedInvestments;
    } catch (error) {
      console.error('Error retrieving user investments from database:', error);
      
      // Fallback to localStorage if database fails
      try {
        const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
        if (!storedInvestments) return [];
        
        const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
        const userInvestments = allInvestments.filter(investment => investment.userId === userId);
        console.log('InvestmentService: Fallback to localStorage, found:', userInvestments.length, 'investments');
        return userInvestments;
      } catch (localError) {
        console.error('Error retrieving user investments from localStorage:', localError);
        return [];
      }
    }
  }

  // Add a new investment
  static async addInvestment(investment: Omit<UserInvestment, 'id' | 'date' | 'investmentDate'>): Promise<UserInvestment> {
    try {
      console.log('InvestmentService: addInvestment called with', investment);
      
      // Check if this is a mock project (simple ID like '1', '2', '3')
      const isMockProject = /^\d+$/.test(investment.projectId);
      
      if (isMockProject) {
        console.log('InvestmentService: Detected mock project, using localStorage only');
        // For mock projects, use localStorage only
        const newInvestment: UserInvestment = {
          ...investment,
          id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString().split('T')[0],
          investmentDate: new Date().toISOString(),
          status: 'completed'
        };

        const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
        const allInvestments: UserInvestment[] = storedInvestments ? JSON.parse(storedInvestments) : [];
        
        allInvestments.push(newInvestment);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allInvestments));
        
        console.log('InvestmentService: Mock project investment saved to localStorage', newInvestment);
        return newInvestment;
      }
      
      // For real projects, try database first
      try {
        const dbInvestment = await supabaseService.createInvestment({
          user_id: investment.userId,
          project_id: investment.projectId,
          amount: investment.amount
        });
        
        if (dbInvestment) {
          console.log('InvestmentService: Investment saved to database successfully', dbInvestment);
          
          // Create UserInvestment object from database result
          const newInvestment: UserInvestment = {
            id: dbInvestment.id,
            userId: dbInvestment.user_id,
            projectId: dbInvestment.project_id,
            amount: dbInvestment.amount,
            date: dbInvestment.date,
            status: dbInvestment.status === 'cancelled' ? 'canceled' : dbInvestment.status,
            projectTitle: investment.projectTitle,
            projectROI: investment.projectROI,
            investmentDate: dbInvestment.investment_date || dbInvestment.created_at
          };
          
          // Also save to localStorage as backup
          const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
          const allInvestments: UserInvestment[] = storedInvestments ? JSON.parse(storedInvestments) : [];
          allInvestments.push(newInvestment);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allInvestments));
          
          return newInvestment;
        }
      } catch (dbError) {
        console.error('InvestmentService: Error saving to database, falling back to localStorage:', dbError);
      }
      
      // Fallback to localStorage if database fails
      const newInvestment: UserInvestment = {
        ...investment,
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split('T')[0],
        investmentDate: new Date().toISOString(),
        status: 'completed'
      };

      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      const allInvestments: UserInvestment[] = storedInvestments ? JSON.parse(storedInvestments) : [];
      
      allInvestments.push(newInvestment);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allInvestments));
      
      console.log('InvestmentService: Investment saved to localStorage as fallback', newInvestment);
      return newInvestment;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw new Error('Failed to add investment');
    }
  }

  // Get investment statistics for a user
  static async getUserInvestmentStats(userId: string) {
    const userInvestments = await this.getUserInvestments(userId);
    
    if (userInvestments.length === 0) {
      return {
        totalInvested: 0,
        totalProjects: 0,
        potentialReturns: 0,
        averageROI: 0,
        investments: []
      };
    }

    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const potentialReturns = userInvestments.reduce((sum, inv) => sum + (inv.amount * (inv.projectROI / 100)), 0);
    const averageROI = userInvestments.reduce((sum, inv) => sum + inv.projectROI, 0) / userInvestments.length;

    return {
      totalInvested,
      totalProjects: userInvestments.length,
      potentialReturns,
      averageROI: Number(averageROI.toFixed(1)),
      investments: userInvestments
    };
  }

  // Remove an investment (for testing purposes)
  static removeInvestment(investmentId: string, userId: string): boolean {
    try {
      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      if (!storedInvestments) return false;
      
      const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
      const updatedInvestments = allInvestments.filter(
        inv => !(inv.id === investmentId && inv.userId === userId)
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedInvestments));
      return true;
    } catch (error) {
      console.error('Error removing investment:', error);
      return false;
    }
  }

  // Clear all investments for a user (for testing purposes)
  static clearUserInvestments(userId: string): void {
    try {
      console.log('InvestmentService: Clearing all investments for user:', userId);
      
      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      if (!storedInvestments) {
        console.log('InvestmentService: No investments found in localStorage');
        return;
      }
      
      const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
      const otherInvestments = allInvestments.filter(inv => inv.userId !== userId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otherInvestments));
      console.log('InvestmentService: Cleared investments. Remaining investments:', otherInvestments.length);
    } catch (error) {
      console.error('Error clearing user investments:', error);
    }
  }

  // Add a test investment for debugging
  static addTestInvestment(userId: string, projectId: string, amount: number): UserInvestment {
    try {
      console.log('InvestmentService: Adding test investment:', { userId, projectId, amount });
      
      const testInvestment: UserInvestment = {
        id: `test_inv_${Date.now()}`,
        userId: userId,
        projectId: projectId,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        projectTitle: 'Test Project',
        projectROI: 7.5,
        investmentDate: new Date().toISOString()
      };

      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      const allInvestments: UserInvestment[] = storedInvestments ? JSON.parse(storedInvestments) : [];
      
      allInvestments.push(testInvestment);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allInvestments));
      
      console.log('InvestmentService: Test investment added successfully:', testInvestment);
      return testInvestment;
    } catch (error) {
      console.error('Error adding test investment:', error);
      throw new Error('Failed to add test investment');
    }
  }

  // Withdraw from an investment
  static async withdrawInvestment(withdrawal: WithdrawalRequest): Promise<boolean> {
    try {
      // For now, use localStorage as the primary method since database methods are limited
      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      if (!storedInvestments) throw new Error('No investments found');
      
      const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
      const investmentIndex = allInvestments.findIndex(
        inv => inv.id === withdrawal.investmentId && inv.userId === withdrawal.userId
      );
      
      if (investmentIndex === -1) throw new Error('Investment not found');
      
      const investment = allInvestments[investmentIndex];
      const currentValue = investment.amount * (1 + investment.projectROI / 100);
      
      if (withdrawal.amount > currentValue) {
        throw new Error('Withdrawal amount exceeds current investment value');
      }
      
      if (withdrawal.type === 'full') {
        // Remove the entire investment
        allInvestments.splice(investmentIndex, 1);
      } else {
        // Partial withdrawal - reduce the investment amount proportionally
        const remainingPercentage = 100 - withdrawal.percentage;
        const remainingAmount = (investment.amount * remainingPercentage) / 100;
        
        allInvestments[investmentIndex] = {
          ...investment,
          amount: remainingAmount
        };
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allInvestments));
      
      // Store withdrawal history for tracking
      const withdrawalHistory = JSON.parse(localStorage.getItem('musistash_withdrawals') || '[]');
      withdrawalHistory.push({
        ...withdrawal,
        withdrawalDate: new Date().toISOString(),
        originalInvestmentAmount: investment.amount,
        currentValue: currentValue
      });
      localStorage.setItem('musistash_withdrawals', JSON.stringify(withdrawalHistory));
      
      return true;
    } catch (error) {
      console.error('Error withdrawing investment:', error);
      throw error;
    }
  }
} 