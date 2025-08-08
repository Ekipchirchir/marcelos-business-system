import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

const ReportsTab = ({ reportData, period, setPeriod }) => {
  const chartData = {
    labels: reportData.map((data) => data._id),
    datasets: [
      {
        label: 'Total Sales (KES)',
        data: reportData.map((data) => data.totalSales),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Sales (KES)' },
      },
      x: {
        title: { display: true, text: period.charAt(0).toUpperCase() + period.slice(1) },
      },
    },
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '20px' }}>
        Sales Reports
      </h2>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        <select
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '200px',
          }}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ReportsTab;