import React, { useState } from 'react';
import axios from 'axios';

const SalesTab = ({ inventory, fetchInventory }) => {
  const [sale, setSale] = useState({
    itemId: '',
    quantity: 1,
    unitPrice: 0,
    paymentMethod: 'M-Pesa',
    invoiceNumber: '',
  });
  const [errors, setErrors] = useState({});

  const validateSale = () => {
    const newErrors = {};
    if (!sale.itemId) newErrors.itemId = 'Please select an item';
    if (sale.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (sale.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be positive';
    if (!sale.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!['M-Pesa', 'Cash', 'Card', 'Bank Transfer'].includes(sale.paymentMethod)) {
      newErrors.paymentMethod = 'Invalid payment method';
    }
    const selectedItem = inventory.find((item) => item._id === sale.itemId);
    if (selectedItem && selectedItem.quantity < sale.quantity) {
      newErrors.quantity = `Insufficient stock: ${selectedItem.quantity} available`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecordSale = async () => {
    if (!validateSale()) return;

    try {
      await axios.post(
        'http://localhost:5000/api/sales',
        {
          items: [{ itemId: sale.itemId, quantity: sale.quantity, unitPrice: sale.unitPrice }],
          paymentMethod: sale.paymentMethod,
          invoiceNumber: sale.invoiceNumber,
        },
        { timeout: 5000 }
      );
      fetchInventory();
      setSale({ itemId: '', quantity: 1, unitPrice: 0, paymentMethod: 'M-Pesa', invoiceNumber: '' });
      setErrors({});
    } catch (error) {
      console.error('Error recording sale:', error.message, error.config, error.response?.data);
      setErrors({ server: error.response?.data?.error || 'Failed to record sale' });
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '20px' }}>
        Record Sale
      </h2>
      <div style={{
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}>
          <div>
            <select
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.itemId ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              value={sale.itemId}
              onChange={(e) => {
                const selectedItem = inventory.find((item) => item._id === e.target.value);
                setSale({ ...sale, itemId: e.target.value, unitPrice: selectedItem?.unitPrice || 0 });
              }}
            >
              <option value="">Select Item</option>
              {inventory.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName} ({item.quantity} in stock)
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.itemId}
              </p>
            )}
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
              value={sale.quantity}
              onChange={(e) => setSale({ ...sale, quantity: Number(e.target.value) })}
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
              value={sale.unitPrice}
              onChange={(e) => setSale({ ...sale, unitPrice: Number(e.target.value) })}
            />
            {errors.unitPrice && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.unitPrice}
              </p>
            )}
          </div>
          <div>
            <select
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.paymentMethod ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              value={sale.paymentMethod}
              onChange={(e) => setSale({ ...sale, paymentMethod: e.target.value })}
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {errors.paymentMethod && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.paymentMethod}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.invoiceNumber ? '#b91c1c' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Invoice Number"
              value={sale.invoiceNumber}
              onChange={(e) => setSale({ ...sale, invoiceNumber: e.target.value })}
            />
            {errors.invoiceNumber && (
              <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '5px' }}>
                {errors.invoiceNumber}
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
          onClick={handleRecordSale}
        >
          Record Sale
        </button>
      </div>
    </div>
  );
};

export default SalesTab;