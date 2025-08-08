import React, { useState } from 'react';
import axios from 'axios';

const InventoryTab = ({ inventory, fetchInventory }) => {
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'Jerseys',
    quantity: 0,
    unitPrice: 0,
  });
  const [errors, setErrors] = useState({});

  const validateItem = () => {
    const newErrors = {};
    if (!newItem.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (newItem.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (newItem.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = async () => {
    if (!validateItem()) return;

    try {
      await axios.post('http://localhost:5000/api/inventory', newItem, { timeout: 5000 });
      fetchInventory();
      setNewItem({ itemName: '', category: 'Jerseys', quantity: 0, unitPrice: 0 });
      setErrors({});
    } catch (error) {
      console.error('Error adding item:', error.message, error.config);
      setErrors({ server: error.response?.data?.error || 'Failed to add item' });
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '20px' }}>
        Inventory Management
      </h2>

      <div style={{
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1a202c', marginBottom: '15px' }}>
          Add New Item
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}>
          <div>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.itemName ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Item Name"
              value={newItem.itemName}
              onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            />
            {errors.itemName && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.itemName}
              </p>
            )}
          </div>
          <div>
            <select
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              {['Jerseys', 'Boots', 'Balls', 'Socks', 'Accessories', 'Trophies', 'Medals', 'Equipment', 'Apparel', 'Others'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.quantity ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
            />
            {errors.quantity && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.quantity}
              </p>
            )}
          </div>
          <div>
            <input
              type="number"
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.unitPrice ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Unit Price (KES)"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
            />
            {errors.unitPrice && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.unitPrice}
              </p>
            )}
          </div>
        </div>
        {errors.server && (
          <p style={{ color: '#b91c1c', fontSize: '14px', marginTop: '10px' }}>
            {errors.server}
          </p>
        )}
        <button
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              {['Item Name', 'Category', 'Quantity', 'Unit Price (KES)'].map((header) => (
                <th key={header} style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr
                key={item._id}
                style={{
                  backgroundColor: item.quantity <= 10 ? '#fee2e2' : '#ffffff',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{item.itemName}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{item.category}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: item.quantity <= 10 ? '#b91c1c' : '#1a202c' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{item.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTab;