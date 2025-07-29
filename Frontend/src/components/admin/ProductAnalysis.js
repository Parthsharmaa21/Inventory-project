import React from 'react';

const ProductAnalytics = ({ totalSales, totalProductsSold, lowStockCount }) => {
  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>Product Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#ebf8ff', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#2c5282' }}>Total Sales</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2b6cb0' }}>
            ${totalSales}
          </p>
        </div>
        <div style={{ padding: '1.5rem', background: '#f0fff4', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#276749' }}>Products Sold</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2f855a' }}>
            {totalProductsSold}
          </p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#c53030' }}>Low Stock Items</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#e53e3e' }}>
            {lowStockCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;