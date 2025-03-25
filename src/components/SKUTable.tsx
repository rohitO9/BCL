import React from 'react';
import { Filter, Edit2 } from 'lucide-react';

const SKUTable: React.FC = () => {
  const skuData = [
    { id: '23232232', unitsSold: 1009, revenue: 370900, profitMargin: '19%', stockLevels: 413313, status: 'Active' },
    { id: '23232233', unitsSold: 1009, revenue: 370900, profitMargin: '19%', stockLevels: 413313, status: 'Low Sale' },
    { id: '23232234', unitsSold: 1009, revenue: 370900, profitMargin: '19%', stockLevels: 413313, status: 'Low Sale' },
    { id: '23232235', unitsSold: 1009, revenue: 370900, profitMargin: '19%', stockLevels: 413313, status: 'Low Sale' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold">SKU LIST</h2>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">10</span>
        </div>
        <button className="text-sm text-gray-600">View All</button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg">
          <span>+ Add SKU</span>
        </button>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search SKU Product"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg">
          <Filter size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">SKU Name</th>
              <th className="px-4 py-2">Units Sold</th>
              <th className="px-4 py-2">Revenue</th>
              <th className="px-4 py-2">Profit Margin (%)</th>
              <th className="px-4 py-2">Stock Levels</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skuData.map((sku) => (
              <tr key={sku.id} className="border-b border-gray-100">
                <td className="px-4 py-3">{sku.id}</td>
                <td className="px-4 py-3">{sku.unitsSold}</td>
                <td className="px-4 py-3">₹{sku.revenue}</td>
                <td className="px-4 py-3">{sku.profitMargin}</td>
                <td className="px-4 py-3">{sku.stockLevels}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sku.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {sku.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SKUTable;