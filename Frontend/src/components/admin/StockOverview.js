import React from 'react';

const StockOverview = ({ inventory, updateStock }) => {
  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>Stock Overview</h2>
      <div style={{ maxWidth: '800px' }}>
        {inventory.map((prod) => (
          <div key={prod.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            gap: '1rem'
          }}>
            <img 
              src={prod.image} 
              alt={prod.name} 
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem', color: '#2d3748' }}>{prod.name}</h4>
              <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>{prod.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => updateStock(prod.id, -1)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >-</button>
              <span style={{ 
                padding: '0.5rem 1rem',
                background: '#edf2f7',
                borderRadius: '6px',
                fontWeight: '600'
              }}>{prod.stock}</span>
              <button
                onClick={() => updateStock(prod.id, 1)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockOverview;