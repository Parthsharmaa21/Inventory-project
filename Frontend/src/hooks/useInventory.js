import { useState, useEffect } from 'react';
import axios from 'axios';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await axios.post('http://localhost:5000/products', productData);
      await fetchInventory();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to add product:', error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateProduct = async (productId, changes) => {
    try {
      await axios.put(`http://localhost:5000/products/${productId}`, changes);
      await fetchInventory();
      return { success: true };
    } catch (error) {
      console.error('Failed to update product:', error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const removeProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      await fetchInventory();
      return { success: true };
    } catch (error) {
      console.error('Failed to remove product:', error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  return {
    inventory,
    loading,
    fetchInventory,
    addProduct,
    updateProduct,
    removeProduct
  };
};