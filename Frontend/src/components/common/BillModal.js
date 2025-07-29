import React from 'react';

const BillModal = ({ cart, cartQuantities, address, setAddress, orderError, setShowBillModal, placeOrder }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3>Bill Details</h3>
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{cartQuantities[item.id]}</td>
                  <td>${item.price}</td>
                  <td>${item.price * cartQuantities[item.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Total Items:</strong> {cart.length}<br />
          <strong>Total Amount:</strong> ${cart.reduce((sum, item) => 
            sum + (item.price * cartQuantities[item.id]), 0)}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            rows="3"
            placeholder="Enter your delivery address"
          />
        </div>
        {orderError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{orderError}</div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowBillModal(false)}
            style={{
              padding: '0.5rem 1rem',
              background: '#gray',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={placeOrder}
            style={{
              padding: '0.5rem 1rem',
              background: '#36d1c4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;