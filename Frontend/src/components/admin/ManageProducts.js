import React from 'react';

const ManageProducts = ({ 
  inventory, 
  loading, 
  newProduct, 
  setNewProduct, 
  handleAddProduct, 
  handleRemoveProduct 
}) => {
  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleAddProduct} style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Name" 
          value={newProduct.name} 
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
          required 
          style={{ flex: '1 1 120px', padding: '0.5rem' }} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={newProduct.description} 
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} 
          style={{ flex: '2 1 200px', padding: '0.5rem' }} 
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={newProduct.price} 
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
          required 
          style={{ flex: '1 1 80px', padding: '0.5rem' }} 
        />
        <input 
          type="number" 
          placeholder="Stock" 
          value={newProduct.stock} 
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} 
          required 
          style={{ flex: '1 1 80px', padding: '0.5rem' }} 
        />
        <input 
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
          style={{ flex: '2 1 200px', padding: '0.5rem' }}
        />
        {newProduct.image && (
          <img 
            src={newProduct.image} 
            alt="Preview" 
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} 
          />
        )}
        <button type="submit" style={{ padding: '0.5rem 1.2rem', background: '#36d1c4', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
          Add Product
        </button>
      </form>
      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {inventory.map((prod) => (
            <div key={prod.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1rem', textAlign: 'center' }}>
              <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
              <h4 style={{ margin: '0.7rem 0 0.3rem 0' }}>{prod.name}</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', minHeight: '40px' }}>{prod.description}</p>
              <div style={{ color: '#36d1c4', fontWeight: 700 }}>${prod.price}</div>
              <div style={{ color: '#888', fontSize: '0.95rem' }}>Stock: {prod.stock}</div>
              <button onClick={() => handleRemoveProduct(prod.id)} style={{ marginTop: '0.7rem', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;