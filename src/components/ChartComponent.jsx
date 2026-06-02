import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function ChartComponent({ 
  type = 'pie', 
  data, 
  options = {}, 
  title = '',
  isLoading = false,
  error = null 
}) {
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error Loading Chart</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: !!title,
        text: title,
        font: {
          size: 13,
          weight: 'bold',
        },
        padding: 10,
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: 12,
          font: {
            size: 11,
          },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        titleFont: {
          size: 11,
        },
        bodyFont: {
          size: 10,
        },
      },
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {type === 'pie' && <Pie data={data} options={mergedOptions} />}
    </div>
  );
}
