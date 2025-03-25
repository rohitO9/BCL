import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ApiResponse {
  success: boolean;
  data: Array<{
    NSDR_TR_DATE: string;
    NSDR_POSITIVE_AMOUNT: string;
    NSDR_NEGATIVE_AMOUNT: string;
    NSDR_RM_NAME: string;
    [key: string]: any;
  }>;
}

interface DataPoint {
  date: string;
  netSales: number;
  originalDate: string;
}

export interface Metrics {
  totalRevenue: number;
  targetAchievement: number;
  revenueGrowth: number;
  totalRMs: number;
}

interface Props {
  onMetricsCalculated?: (metrics: Metrics) => void;
}

const RevenueChart: React.FC<Props> = ({ onMetricsCalculated }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:3000/api/data');
        if (response.data.success && Array.isArray(response.data.data)) {
          const processedData = processData(response.data.data);
          setData(processedData);
          
          // Calculate metrics
          if (onMetricsCalculated) {
            const metrics = calculateMetrics(response.data.data);
            onMetricsCalculated(metrics);
          }
        } else {
          throw new Error('Invalid data format received from API');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [onMetricsCalculated]);

  const calculateMetrics = (rawData: ApiResponse['data']): Metrics => {
    const totalPositive = rawData.reduce((sum, item) => 
      sum + (parseFloat(item.NSDR_POSITIVE_AMOUNT) || 0), 0);
    
    const totalNegative = rawData.reduce((sum, item) => 
      sum + (parseFloat(item.NSDR_NEGATIVE_AMOUNT) || 0), 0);

    // Get unique RM count
    const uniqueRMs = new Set(rawData.map(item => item.RMWAUM_RM_NAME)).size;

    const totalRevenue = totalPositive;

    const target = totalRevenue * 1.2;
    const targetAchievement = totalNegative;


    const revenueGrowth = ((totalRevenue - (totalRevenue * 0.9)) / (totalRevenue * 0.9)) * 100;

    return {
      totalRevenue,
      targetAchievement,
      revenueGrowth,
      totalRMs: uniqueRMs
    };
  };

  const processData = (rawData: ApiResponse['data']): DataPoint[] => {
    return rawData
      .map(item => {
        try {
          // Parse date parts
          const [year, month, day] = item.NSDR_TR_DATE.split('-').map(Number);
          
          // Validate date parts
          if (!year || !month || !day) {
            console.warn('Invalid date format:', item.NSDR_TR_DATE);
            return null;
          }
          
          // Create formatted date string (YYYY-MM-DD)
          const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          const positiveAmount = parseFloat(item.NSDR_POSITIVE_AMOUNT) || 0;
          const negativeAmount = parseFloat(item.NSDR_NEGATIVE_AMOUNT) || 0;
          
          return {
            originalDate: item.NSDR_TR_DATE,
            date: formattedDate,
            netSales: positiveAmount - negativeAmount
          };
        } catch (error) {
          console.warn('Error processing data point:', error);
          return null;
        }
      })
      .filter((item): item is DataPoint => item !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return dateStr;
    }
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

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-gray-400">Loading chart data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-gray-400">No data available</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickMargin={10}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          width={80}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Net Sales']}
          labelFormatter={(label) => `Date: ${formatDate(label)}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px'
          }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '10px'
          }}
        />
        <Line
          type="monotone"
          dataKey="netSales"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
          name="Net Sales"
          isAnimationActive={true}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;