import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState({
    id: localStorage.getItem('user_id'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role') || 'user'
  });

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });
      
      const userData = response.data;
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('role', userData.role);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return { user, login, logout };
};