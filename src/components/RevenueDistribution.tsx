import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./new.css";

interface ApiResponse {
  success: boolean;
  data: Array<{
    TCCN_CLIENT_CODE: number;
    TCCN_AMOUNT: number;
    [key: string]: any;
  }>;
}

interface DataPoint {
  clientCode: number;
  amount: number;
}

const RevenueDistribution: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://4.240.99.207:3000/api/data"
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          const processedData = processData(response.data.data);
          setData(processedData);
        } else {
          throw new Error("Invalid data format received from API");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (rawData: ApiResponse["data"]): DataPoint[] => {
    const limitedData = rawData.slice(0, 30);
    return limitedData
      .map((item) => {
        try {
          const clientCode = item.RMWAUM_RM_NAME;
          const amount = item.RMWAUM_AUM || 0;

          return { clientCode, amount };
        } catch (error) {
          console.warn("Error processing data point:", error);
          return null;
        }
      })
      .filter((item): item is DataPoint => item !== null);
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
    <ResponsiveContainer width="100%" height={325}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 40, // Increase bottom margin for label spacing
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="clientCode"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickMargin={10}
          angle={-45} // Rotate labels by 45 degrees
          textAnchor="end" // Align text to the end
        />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              const { clientCode, amount } = payload[0].payload; // Access the payload's data
              return (
                <div
                  className="custom-tooltip"
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                >
                  <p>
                    <strong>Client Code:</strong> {clientCode}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{amount.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar dataKey="amount" fill="#4caf50">
          <LabelList
            dataKey="amount"
            position="top"
            fill="#333"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueDistribution;
