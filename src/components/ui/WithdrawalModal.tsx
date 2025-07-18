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
import { DollarSign, TrendingDown, AlertCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: any;
  onWithdrawalComplete: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  investment,
  onWithdrawalComplete
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [withdrawalType, setWithdrawalType] = useState<'partial' | 'full'>('partial');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('WithdrawalModal: Received investment data:', investment);
  console.log('WithdrawalModal: Investment amount:', investment.amount);
  console.log('WithdrawalModal: Project ROI:', investment.projectROI);

  const currentValue = investment.amount * (1 + investment.projectROI / 100);
  const potentialProfit = currentValue - investment.amount;
  const maxWithdrawal = currentValue;

  console.log('WithdrawalModal: Calculated values - currentValue:', currentValue, 'potentialProfit:', potentialProfit, 'maxWithdrawal:', maxWithdrawal);

  const handleWithdrawal = async () => {
    if (!user) {
      setError('You must be logged in to withdraw');
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }

    if (withdrawalAmount > maxWithdrawal) {
      setError(`Maximum withdrawal amount is $${maxWithdrawal.toFixed(2)}`);
      return;
    }

    if (withdrawalAmount < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Calculate the percentage being withdrawn
      const withdrawalPercentage = (withdrawalAmount / currentValue) * 100;
      
      await InvestmentService.withdrawInvestment({
        userId: user.id,
        investmentId: investment.id,
        amount: withdrawalAmount,
        percentage: withdrawalPercentage,
        type: withdrawalType,
        projectTitle: investment.projectTitle,
        projectROI: investment.projectROI
      });

      onWithdrawalComplete();
      onClose();
      setAmount('');
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWithdrawalValue = () => {
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) return null;
    
    const percentage = (withdrawalAmount / currentValue) * 100;
    return {
      amount: withdrawalAmount,
      percentage: percentage,
      profit: (withdrawalAmount / currentValue) * potentialProfit
    };
  };

  const withdrawalValue = calculateWithdrawalValue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto z-50">
        {/* Mobile swipe indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full opacity-50 sm:hidden"></div>
        {/* Mobile-friendly close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <DialogHeader className="pr-12">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">
            Withdraw from {investment.projectTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Sell your shares or withdraw your investment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Investment Info */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{investment.projectTitle}</h3>
                <p className="text-sm text-gray-400">ROI: {investment.projectROI}%</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-500">
                Active Investment
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Original Investment</p>
                <p className="text-white font-semibold text-base">${investment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Current Value</p>
                <p className="text-green-400 font-semibold text-base">${currentValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Potential Profit</p>
                <p className="text-blue-400 font-semibold text-base">+${potentialProfit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Max Withdrawal</p>
                <p className="text-white font-semibold text-base">${maxWithdrawal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Withdrawal Type */}
          <div className="space-y-2">
            <Label className="text-gray-300">Withdrawal Type</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setWithdrawalType('partial')}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors text-sm font-medium ${
                  withdrawalType === 'partial'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                Partial Withdrawal
              </button>
              <button
                onClick={() => {
                  setWithdrawalType('full');
                  setAmount(maxWithdrawal.toString());
                }}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors text-sm font-medium ${
                  withdrawalType === 'full'
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                Full Withdrawal
              </button>
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder={`Enter amount (max $${maxWithdrawal.toFixed(2)})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-red-500 text-base py-3"
                min="10"
                max={maxWithdrawal}
                step="0.01"
                inputMode="decimal"
              />
            </div>
            <p className="text-xs text-gray-500">
              Min: $10 | Max: ${maxWithdrawal.toFixed(2)}
            </p>
          </div>

          {/* Withdrawal Preview */}
          {amount && parseFloat(amount) > 0 && withdrawalValue && (
            <div className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-700/30">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
                <h4 className="font-semibold text-red-400">Withdrawal Preview</h4>
              </div>
              <div className="space-y-1">
                <p className="text-white">
                  Withdrawal Amount: <span className="font-bold">${withdrawalValue.amount.toFixed(2)}</span>
                </p>
                <p className="text-white">
                  Percentage: <span className="font-bold text-red-400">{withdrawalValue.percentage.toFixed(1)}%</span>
                </p>
                <p className="text-white">
                  Profit Included: <span className="font-bold text-green-400">+${withdrawalValue.profit.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Remaining Value: ${(currentValue - withdrawalValue.amount).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Warning */}
          <Alert className="bg-yellow-900/20 border-yellow-700/50">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-400">
              Withdrawing will sell your shares in this project. You'll receive the current value including any profits earned.
            </AlertDescription>
          </Alert>

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

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdrawal}
            disabled={isLoading || !amount || parseFloat(amount) < 10 || parseFloat(amount) > maxWithdrawal}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 py-3 font-medium"
          >
            {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal; 