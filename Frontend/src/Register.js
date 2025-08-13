import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/register', {
        name,
        phone,
        email,
        password,
        role, // Include role in the request
      });

      if (res.status === 201) {
        alert(`Registration successful as ${role}! Please login.`);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <form
        onSubmit={handleRegister}
        style={{
          background: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          width: '100%',
          maxWidth: '400px',
          transition: 'transform 0.2s ease',
          transform: isLoading ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        <h2 style={{
          textAlign: 'center',
          margin: '0 0 1.5rem',
          color: '#2d3748',
          fontSize: '1.875rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Create Account
        </h2>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#FED7D7',
            color: '#C53030',
            borderRadius: '8px',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A5568',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              outline: 'none',
            }}
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A5568',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              outline: 'none',
            }}
            placeholder="Enter your phone number"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A5568',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              outline: 'none',
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A5568',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Create Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              outline: 'none',
            }}
            placeholder="Create a password"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#4A5568',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Register as:
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              User
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              Admin
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: 'linear-gradient(to right, #4299E1, #667EEA)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
            opacity: isLoading ? 0.7 : 1,
            transform: isLoading ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#718096',
          fontSize: '0.875rem'
        }}>
          Already have an account? <span style={{ color: '#4299E1', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate('/')}>Login here</span>
        </div>
      </form>
    </div>
  );
};

export default Register;
