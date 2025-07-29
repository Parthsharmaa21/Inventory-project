import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Shop from './components/user/Shop';
import Cart from './components/user/Cart';
import Orders from './components/user/Orders';
import Dashboard from './components/admin/Dashboard';
import ManageProducts from './components/admin/ManageProducts';
import StockOverview from './components/admin/StockOverview';
import ProductAnalysis from './components/admin/ProductAnalysis';
import UserManagement from './components/admin/UserManagement';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeMenu, setActiveMenu] = useState('shop');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState('');
  const [orderError, setOrderError] = useState('');
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setInventory(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:5000/orders/${user.id}`);
          setOrders(response.data || []);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      }
    };
    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role === 'admin') {
        try {
          const response = await axios.get('http://localhost:5000/users');
          setUsers(response.data || []);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      }
    };
    fetchUsers();
  }, [user?.role]);

  const addToCart = (product) => {
    setCart(prev => {
      if (!prev.find(item => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
    setCartQuantities(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setCartQuantities(prev => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleQuantityChange = (productId, delta) => {
    const product = inventory.find(p => p.id === productId);
    const currentQty = cartQuantities[productId] || 0;
    const newQty = currentQty + delta;

    if (newQty > product.stock) {
      alert('Not enough stock available!');
      return;
    }

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartQuantities(prev => ({
      ...prev,
      [productId]: newQty
    }));
  };

  const placeOrder = async (paymentMethod) => {
    if (!address.trim()) {
      setOrderError('Please enter delivery address');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: cartQuantities[item.id],
          price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * cartQuantities[item.id]), 0),
        address,
        paymentMethod
      };

      await axios.post('http://localhost:5000/orders', orderData);

      setCart([]);
      setCartQuantities({});
      setAddress('');
      setActiveMenu('orders');

      const response = await axios.get(`http://localhost:5000/orders/${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Order placement error:', error.response?.data || error.message);
      setOrderError(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const continueShopping = () => {
    setActiveMenu('shop');
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: 'DELETE'
      });
      // Refresh orders after deletion
      const response = await fetch(`http://localhost:5000/orders/${user.id}`);
      const updatedOrders = await response.json();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  // Handler to add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log('Adding product:', newProduct);
    try {
      await axios.post('http://localhost:5000/products', newProduct);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: ''
      });
      // Refresh inventory
      const response = await axios.get('http://localhost:5000/products');
      setInventory(response.data);
      alert('Product added successfully');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. See console for details.');
    }
  };

  // Handler to remove a product
  const handleRemoveProduct = async (productId) => {
    console.log('Removing product:', productId);
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      // Refresh inventory
      const response = await axios.get('http://localhost:5000/products');
      setInventory(response.data);
      alert('Product removed successfully');
    } catch (error) {
      console.error('Failed to remove product:', error);
      alert('Failed to remove product. See console for details.');
    }
  };

  // Handler to update stock
  const updateStock = async (productId, change) => {
    try {
      await axios.put(`http://localhost:5000/products/${productId}/stock`, { change });
      // Refresh inventory
      const response = await axios.get('http://localhost:5000/products');
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  return (
    <MainLayout
      username={user?.username}
      role={user?.role}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      <div style={{ padding: '20px' }}>
        {activeMenu === 'shop' && (
          <Shop
            inventory={inventory}
            loading={loading}
            cartQuantities={cartQuantities}
            handleQuantityChange={handleQuantityChange}
            addToCart={addToCart}
          />
        )}

        {activeMenu === 'cart' && (
          <Cart
            cart={cart}
            cartQuantities={cartQuantities}
            handleQuantityChange={handleQuantityChange}
            removeFromCart={removeFromCart}
            address={address}
            setAddress={setAddress}
            orderError={orderError}
            placeOrder={placeOrder}
            continueShopping={continueShopping}
            inventory={inventory}
            addToCart={addToCart}
          />
        )}

        {activeMenu === 'orders' && <Orders orders={orders} onDeleteOrder={handleDeleteOrder} />}

        {activeMenu === 'dashboard' && (
          <Dashboard />
        )}
        {activeMenu === 'manage' && (
          <ManageProducts
            inventory={inventory}
            loading={loading}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
          />
        )}
        {activeMenu === 'stock' && (
          <StockOverview
            inventory={inventory}
            updateStock={updateStock}
          />
        )}
        {activeMenu === 'analytics' && (
          <ProductAnalysis />
        )}
        {activeMenu === 'users' && (
          <UserManagement users={users} />
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
