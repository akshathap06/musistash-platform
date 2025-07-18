import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ProfitProjectionChartProps {
  totalInvested: number;
  potentialReturns: number;
  averageROI: number;
  investments: any[];
}

const ProfitProjectionChart: React.FC<ProfitProjectionChartProps> = ({
  totalInvested,
  potentialReturns,
  averageROI,
  investments
}) => {
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | '2y'>('1y');

  // Generate projection data based on investments and ROI
  const projectionData = useMemo(() => {
    const data = [];
    const months = timeframe === '6m' ? 6 : timeframe === '1y' ? 12 : 24;
    
    for (let i = 0; i <= months; i++) {
      const month = i;
      const projectedValue = totalInvested * Math.pow(1 + (averageROI / 100), month / 12);
      const profit = projectedValue - totalInvested;
      
      data.push({
        month,
        invested: totalInvested,
        projected: projectedValue,
        profit: profit,
        roi: ((projectedValue - totalInvested) / totalInvested) * 100
      });
    }
    
    return data;
  }, [totalInvested, averageROI, timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">Month {label}</p>
          <p className="text-white font-semibold">
            Projected Value: ${payload[1]?.value?.toLocaleString()}
          </p>
          <p className="text-green-400 font-semibold">
            Profit: +${payload[2]?.value?.toFixed(2)}
          </p>
          <p className="text-blue-400 text-sm">
            ROI: {payload[3]?.value?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Profit Projection</CardTitle>
          </div>
          <div className="flex gap-2">
            {(['6m', '1y', '2y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>Initial: ${totalInvested.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Projected: ${(totalInvested + potentialReturns).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Avg ROI: {averageROI}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="#3b82f6"
                fill="url(#investedGradient)"
                strokeWidth={2}
                name="Invested"
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#10b981"
                fill="url(#profitGradient)"
                strokeWidth={2}
                name="Projected"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Current Value</p>
            <p className="text-white font-semibold">${totalInvested.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Projected Value</p>
            <p className="text-green-400 font-semibold">${(totalInvested + potentialReturns).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Potential Profit</p>
            <p className="text-blue-400 font-semibold">+${potentialReturns.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitProjectionChart; 