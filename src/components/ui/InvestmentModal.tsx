import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { InvestmentService } from '@/services/investmentService';
import { Project } from '@/lib/mockData';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onInvestmentComplete: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  project,
  onInvestmentComplete
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvest = async () => {
    if (!user) {
      setError('You must be logged in to invest');
      return;
    }

    const investmentAmount = parseFloat(amount);
    
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    if (investmentAmount < 50) {
      setError('Minimum investment amount is $50');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('InvestmentModal: Creating investment for user:', user.id, 'project:', project.id, 'amount:', investmentAmount);
      
      const newInvestment = await InvestmentService.addInvestment({
        userId: user.id,
        projectId: project.id,
        amount: investmentAmount,
        status: 'completed',
        projectTitle: project.title,
        projectROI: project.roi
      });

      console.log('InvestmentModal: Investment created successfully:', newInvestment);
      
      onInvestmentComplete();
      onClose();
      setAmount('');
    } catch (err) {
      console.error('InvestmentModal: Error creating investment:', err);
      setError('Failed to process investment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePotentialReturn = () => {
    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) return 0;
    return investmentAmount * (project.roi / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Invest in {project.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Join other investors in supporting this music project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Info */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-gray-400">ROI: {project.roi}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Funding Progress</p>
                <p className="text-lg font-bold text-white">
                  ${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">Investment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (min $50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                min="50"
                step="10"
              />
            </div>
          </div>

          {/* Potential Return */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-700/30">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h4 className="font-semibold text-green-400">Potential Returns</h4>
              </div>
              <div className="space-y-1">
                <p className="text-white">
                  Investment: <span className="font-bold">${parseFloat(amount).toLocaleString()}</span>
                </p>
                <p className="text-white">
                  Potential Return: <span className="font-bold text-green-400">+${calculatePotentialReturn().toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Total Value: ${(parseFloat(amount) + calculatePotentialReturn()).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="bg-red-900/20 border-red-700/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleInvest}
            disabled={isLoading || !amount || parseFloat(amount) < 50}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal; 