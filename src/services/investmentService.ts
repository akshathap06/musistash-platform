import { Investment } from '@/lib/mockData';

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
  static getUserInvestments(userId: string): UserInvestment[] {
    try {
      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      if (!storedInvestments) return [];
      
      const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
      return allInvestments.filter(investment => investment.userId === userId);
    } catch (error) {
      console.error('Error retrieving user investments:', error);
      return [];
    }
  }

  // Add a new investment
  static addInvestment(investment: Omit<UserInvestment, 'id' | 'date' | 'investmentDate'>): UserInvestment {
    try {
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
      
      return newInvestment;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw new Error('Failed to add investment');
    }
  }

  // Get investment statistics for a user
  static getUserInvestmentStats(userId: string) {
    const userInvestments = this.getUserInvestments(userId);
    
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
      const storedInvestments = localStorage.getItem(this.STORAGE_KEY);
      if (!storedInvestments) return;
      
      const allInvestments: UserInvestment[] = JSON.parse(storedInvestments);
      const otherInvestments = allInvestments.filter(inv => inv.userId !== userId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otherInvestments));
    } catch (error) {
      console.error('Error clearing user investments:', error);
    }
  }

  // Withdraw from an investment
  static async withdrawInvestment(withdrawal: WithdrawalRequest): Promise<boolean> {
    try {
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
      
      // Store withdrawal history (optional - for tracking purposes)
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