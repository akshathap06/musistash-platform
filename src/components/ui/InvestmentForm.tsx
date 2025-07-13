
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Project } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

interface InvestmentFormProps {
  project: Project;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ project }) => {
  const [investmentAmount, setInvestmentAmount] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const minInvestment = 100;
  const maxInvestment = Math.min(10000, project.fundingGoal - project.currentFunding);
  
  const handleSliderChange = (value: number[]) => {
    setInvestmentAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setInvestmentAmount(minInvestment);
    } else {
      setInvestmentAmount(Math.max(minInvestment, Math.min(maxInvestment, value)));
    }
  };

  const calculateReturn = () => {
    return (investmentAmount * project.roi / 100).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Investment Submitted",
        description: `You have successfully invested $${investmentAmount.toLocaleString()} in ${project.title}.`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Invest in this Project</CardTitle>
        <CardDescription>
          Support this artist and potentially earn returns on their success
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label htmlFor="investment-amount" className="text-sm font-medium">
                Investment Amount
              </label>
              <span className="text-sm text-muted-foreground">
                Min: ${minInvestment} | Max: ${maxInvestment}
              </span>
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="investment-amount"
                type="number"
                min={minInvestment}
                max={maxInvestment}
                value={investmentAmount}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
            
            <Slider
              value={[investmentAmount]}
              min={minInvestment}
              max={maxInvestment}
              step={100}
              onValueChange={handleSliderChange}
              className="my-6"
            />
          </div>
          
          <div className="rounded-md bg-muted p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Potential Return (ROI)</span>
              <span className="font-medium">{project.roi}%</span>
            </div>
            
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm">Estimated Earnings</span>
              <span className="font-medium text-primary">${calculateReturn()}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Invest Now'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex-col items-start text-xs text-muted-foreground border-t pt-4">
        <p>
          By investing, you agree to our terms of service and acknowledge that returns are not guaranteed.
          Investment involves risk.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InvestmentForm;
