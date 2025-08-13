import React from 'react';

const ProductCard = ({ product, cartQuantity = 0, onQuantityChange, onAddToCart, isAdmin, onRemove }) => {
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
      padding: '1rem', 
      textAlign: 'center' 
    }}>
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ 
          width: '100%', 
          height: '120px', 
          objectFit: 'cover', 
          borderRadius: '8px' 
        }} 
      />
      <h4 style={{ margin: '0.7rem 0 0.3rem 0' }}>{product.name}</h4>
      <p style={{ 
        color: '#666', 
        fontSize: '0.95rem', 
        minHeight: '40px' 
      }}>{product.description}</p>
      <div style={{ color: '#36d1c4', fontWeight: 700 }}>${product.price}</div>
      <div style={{ color: '#888', fontSize: '0.95rem' }}>Stock: {product.stock}</div>
      
      {isAdmin ? (
        <button 
          onClick={() => onRemove(product.id)} 
          style={{ 
            marginTop: '0.7rem', 
            background: '#ff4d4f', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            padding: '0.4rem 1rem', 
            cursor: 'pointer' 
          }}
        >
          Remove
        </button>
      ) : (
        !cartQuantity ? (
          <button
            onClick={() => onAddToCart(product)}
            style={{ 
              marginTop: '0.7rem', 
              background: '#36d1c4', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              padding: '0.4rem 1rem', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Add to Cart 
          </button>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            marginTop: '0.7rem' 
          }}>
            <button
              onClick={() => onQuantityChange(product.id, -1)}
              style={{ 
                background: '#f1f5f9', 
                border: 'none', 
                borderRadius: '4px', 
                width: '28px', 
                height: '28px', 
                cursor: 'pointer',
                color: '#64748b',
                fontWeight: 'bold'
              }}
            >
              -
            </button>
            <span style={{ color: '#1e293b', fontWeight: '600' }}>
              {cartQuantity}
            </span>
            <button
              onClick={() => onQuantityChange(product.id, 1)}
              style={{ 
                background: '#f1f5f9', 
                border: 'none', 
                borderRadius: '4px', 
                width: '28px', 
                height: '28px', 
                cursor: 'pointer',
                color: '#64748b',
                fontWeight: 'bold'
              }}
              disabled={cartQuantity >= product.stock}
            >
              +
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ProductCard;