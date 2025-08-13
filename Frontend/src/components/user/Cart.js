import React, { useState } from 'react';

const Cart = ({ cart, cartQuantities, handleQuantityChange, removeFromCart, address, setAddress, orderError, placeOrder, continueShopping, inventory, addToCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * cartQuantities[item.id]), 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>My Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  // Select related products to suggest (e.g., first 4 products not in cart)
  const relatedProducts = inventory.filter(p => !cart.find(c => c.id === p.id)).slice(0, 4);

  const handlePlaceOrderClick = () => {
    if (paymentMethod === 'cod') {
      placeOrder();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmPayment = () => {
    setShowConfirmation(false);
    // Redirect to payment page (simulate with alert for now)
    alert('Redirecting to payment page...');
    // Here you can implement actual redirection logic
  };

  const handleCancelPayment = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <h2>My Cart ({cart.length} items)</h2>
      {cart.map(item => (
        <div key={item.id} style={{ 
          background: '#fff', 
          margin: '1rem 0', 
          padding: '1rem', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <span style={{ margin: '0 1rem' }}>{cartQuantities[item.id]}</span>
              <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}

      {/* Bill Details Section */}
      <div style={{
        background: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3>Bill Details</h3>
        <table style={{ width: '100%', marginBottom: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Item</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>Quantity</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: '8px' }}>Price</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                <td style={{ borderBottom: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>{cartQuantities[item.id]}</td>
                <td style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: '8px' }}>${item.price}</td>
                <td style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: '8px' }}>${((item.price || 0) * (cartQuantities[item.id] || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Total Items:</strong> {cart.length}<br />
          <strong>Total Amount:</strong> ${(total || 0).toFixed(2)}
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

        {/* Payment Options */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Payment Method:</label>
          <div>
            <label>
              <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
              UPI
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Debit/Credit Card
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on Delivery
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handlePlaceOrderClick}
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

      {/* Confirmation Popup */}
      {showConfirmation && (
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
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <p>Proceed to payment page?</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={handleConfirmPayment} style={{
                padding: '0.5rem 1rem',
                background: '#36d1c4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Yes
              </button>
              <button onClick={handleCancelPayment} style={{
                padding: '0.5rem 1rem',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <div style={{
        marginTop: '2rem',
        background: '#fff',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <h3>You can add this too</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {relatedProducts.map(product => (
            <div key={product.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '0.5rem',
              width: 'calc(25% - 1rem)',
              boxSizing: 'border-box'
            }}>
              <h4>{product.name}</h4>
              <p>Price: ${product.price}</p>
              <button onClick={() => addToCart(product)} style={{
                background: '#36d1c4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer'
              }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Shopping Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={continueShopping} style={{
          background: '#36d1c4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer'
        }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;
