import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendPositive }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <div className={`flex items-center text-sm ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trendPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
}

export default MetricCard