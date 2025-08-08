import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryTab from './components/InventoryTab';
import SalesTab from './components/SalesTab';
import ReportsTab from './components/ReportsTab';

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [error, setError] = useState('');

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory', { timeout: 5000 });
      setInventory(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching inventory:', error.message, error.config);
      setError('Failed to fetch inventory. Ensure the backend is running.');
    }
  };

  // Fetch sales report
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sales/reports/sales?period=${period}`, { timeout: 5000 });
      setReportData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sales report:', error.message, error.config);
      setError(`Failed to fetch ${period} sales report.`);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchSalesReport();
  }, [period]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f4f7fa',
      minHeight: '100vh',
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>
          Marcelo Sports Hub
        </h1>
        <p style={{ color: '#4a5568', fontSize: '16px' }}>
          Manage your sports inventory and sales efficiently
        </p>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        {['inventory', 'sales', 'reports'].map((tab) => (
          <button
            key={tab}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab ? '#3b82f6' : '#e5e7eb',
              color: activeTab === tab ? '#ffffff' : '#1a202c',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.3s',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {activeTab === 'inventory' && <InventoryTab inventory={inventory} fetchInventory={fetchInventory} />}
        {activeTab === 'sales' && <SalesTab inventory={inventory} fetchInventory={fetchInventory} />}
        {activeTab === 'reports' && <ReportsTab reportData={reportData} period={period} setPeriod={setPeriod} />}
      </main>
    </div>
  );
};

export default App;