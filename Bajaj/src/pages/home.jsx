import React, { useEffect, useRef, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import './home.css';

const NetSalesDashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [filteredData, setFilteredData] = useState([]);
  const [chartWidth, setChartWidth] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/data')
      .then(res => res.json())
      .then(response => {
        const data = response.data || response;
        setRawData(data.slice(1)); // skip header
      })
      .catch(err => console.error('Fetch Error:', err));
  }, []);

  const branchCodes = [...new Set(rawData.map(item => item.NSDR_BRANCH_CODE))];

  useEffect(() => {
    const result = rawData
      .filter(item => branchFilter === 'ALL' || item.NSDR_BRANCH_CODE === branchFilter)
      .map(item => ({
        TR_DATE: item.NSDR_TR_DATE,
        Net_Sales:
          parseFloat(item.NSDR_POSITIVE_AMOUNT || 0) - parseFloat(item.NSDR_NEGATIVE_AMOUNT || 0),
      }));
    setFilteredData(result);
    setChartWidth(Math.max(result.length * 60, window.innerWidth));  // Update chart width based on filtered data length
  }, [branchFilter, rawData]);

  // Smooth scroll
  const scrollChart = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Net Sales Dashboard</h2>

      <div className="controls">
        <div className="filter-bar">
          <label>Branch:</label>
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="ALL">All</option>
            {branchCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div className="buttons">
          <button onClick={() => scrollChart('left')}>⬅ Scroll Left</button>
          <button onClick={() => scrollChart('right')}>Scroll Right ➡</button>
        </div>
      </div>

      <div className="chart-scroll-wrapper" ref={scrollRef}>
        <div className="chart-inner" style={{ width: `${chartWidth}px` }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="TR_DATE" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Net_Sales" stroke="#32CD32" strokeWidth={3} />
              <Line type="monotone" dataKey="Target" stroke="#FF6347" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NetSalesDashboard;
