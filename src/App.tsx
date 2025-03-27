
import Bajaj from "../src/logo-bajaj-capital.png"

import React, { useState } from 'react';
import { Search, Home, BarChart2, Clock, Settings, ChevronDown, Filter, Edit2 } from 'lucide-react';
import RevenueChart, { Metrics } from './components/RevenueChart';
import RevenueDistribution from './components/RevenueDistribution';
import MetricCard from './components/MetricCard';
import SKUTable from './components/SKUTable';

function App() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    targetAchievement: 0,
    revenueGrowth: 0,
    totalRMs: 0
  });

  const handleMetricsCalculated = (newMetrics: Metrics) => {
    setMetrics(newMetrics);
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 10000000) { // 1 Cr
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (absValue >= 100000) { // 1 Lakh
      return `₹${(value / 100000).toFixed(2)} L`;
    } else if (absValue >= 1000) { // 1k
      return `₹${(value / 1000).toFixed(2)}k`;
    }
    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-8">
        <div className="text-red-500 font-bold"><img src={Bajaj}/></div>
        <nav className="flex flex-col space-y-4">
          <button className="p-3 text-red-500 bg-red-50 rounded-lg"><Home size={20} /></button>
          <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-lg"><BarChart2 size={20} /></button>
          <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-lg"><Clock size={20} /></button>
          <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-lg"><Settings size={20} /></button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bar"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Hi Diya!</span>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Total Positive Amount"
            value={formatCurrency(metrics.totalRevenue)}
            trend={`${metrics.revenueGrowth >= 0 ? '+' : ''}${metrics.revenueGrowth.toFixed(1)}% from last quarter`}
            trendPositive={metrics.revenueGrowth >= 0}
          />
          <MetricCard
            title="Total Negative Amount"
            value={formatCurrency(metrics.targetAchievement)}
            trend={`${metrics.targetAchievement >= 100 ? 'Exceeded' : 'Below'} target Revenue`}
            trendPositive={metrics.targetAchievement >= 100}
          />
          <MetricCard
            title="RMs Managed"
            value={metrics.totalRMs.toString()}
            trend="Active Relationship Managers"
            trendPositive={true}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Sales Analysis</h2>
              <button className="flex items-center space-x-2 text-sm text-gray-600 border rounded-lg px-3 py-1">
                <span>Last 30 days</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <RevenueChart onMetricsCalculated={handleMetricsCalculated} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">RM Wise AUM</h2>
            <RevenueDistribution />
          </div>
        </div>

        {/* SKU List */}
        <SKUTable />
      </div>
    </div>
  );
}

export default App;