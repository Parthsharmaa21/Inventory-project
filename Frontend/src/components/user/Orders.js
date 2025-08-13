import React from 'react';

const Orders = ({ orders, onDeleteOrder }) => {
  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Order History</h2>
        <p>No orders yet</p>
      </div>
    );
  }

  const handleDeleteClick = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      onDeleteOrder(orderId);
    }
  };

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order, index) => (
        <div key={order.id} style={{
          background: '#fff',
          margin: '1rem 0',
          padding: '1rem',
          borderRadius: '8px',
          position: 'relative'
        }}>
          <button
            onClick={() => handleDeleteClick(order.id)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer'
            }}
            title="Delete Order"
          >
            Delete
          </button>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0' }}>Order #{index + 1}</h3>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>Date: {order.date}</p>
          </div>
          <div>
            {order.items.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0'
              }}>
                <span>{item.name} x {item.quantity}</span>
                <span>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ 
            borderTop: '1px solid #eee', 
            marginTop: '1rem', 
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <strong>Total:</strong>
            <strong>${(order.total || 0).toFixed(2)}</strong>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Delivery Address: {order.address}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
