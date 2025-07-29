import React, { useEffect } from 'react';
import ProductCard from '../common/ProductCard';

const Shop = ({ inventory, loading, cartQuantities, handleQuantityChange, addToCart }) => {
  // Debug log to check inventory
  useEffect(() => {
    console.log('Inventory length:', inventory?.length);
    console.log('Inventory data:', inventory);
  }, [inventory]);

  return (
    <div>
      <h2 style={{ 
        color: '#2d3748', 
        marginBottom: '1.5rem',
        fontSize: '1.875rem',
        fontWeight: '600'
      }}>Start Shopping</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {inventory?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartQuantities[product.id] || 0}
              onQuantityChange={handleQuantityChange}
              onAddToCart={() => addToCart(product)}
              isAdmin={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;