import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('totalSpent');
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoadingLeaderboard(true);
      const response = await axios.get('http://localhost:5000/analytics/user-leaderboard');
      setLeaderboardData(response.data);
      setLoadingLeaderboard(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLoadingLeaderboard(false);
    }
  };

  const openModal = async (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setLoadingOrders(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/orders/${user.id}`);
      setOrderHistory(response.data);
    } catch (err) {
      setError('Failed to fetch order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setOrderHistory([]);
    setError(null);
  };

  const getTopUsers = (data, metric, limit = 10) => {
    return [...data]
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, limit)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  };

  const topUsers = getTopUsers(leaderboardData, selectedMetric);

  // Simple bar chart data
  const chartData = topUsers.map(user => ({
    name: user.username,
    value: user[selectedMetric]
  }));

  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>User Management</h2>

      {/* User Leaderboard Section */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#2d3748', fontSize: '1.25rem', fontWeight: 'bold' }}>User Leaderboard</h3>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            style={{
              padding: '0.5rem 1rem',
              background: '#4299e1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
          </button>
        </div>

        {showLeaderboard && (
          <>
            {loadingLeaderboard ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading leaderboard...</div>
            ) : (
              <>
                {/* Controls */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ marginRight: '0.5rem' }}>Sort by:</label>
                  <select 
                    value={selectedMetric} 
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="totalSpent">Total Amount Spent</option>
                    <option value="totalProducts">Total Products Bought</option>
                    <option value="totalOrders">Total Orders</option>
                    <option value="activityScore">Activity Score</option>
                  </select>
                </div>

                {/* Simple Bar Chart */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#4a5568' }}>Top 10 Users by {selectedMetric.replace(/([A-Z])/g, ' $1').toUpperCase()}</h4>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    height: '200px', 
                    gap: '2px',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '4px',
                    overflowX: 'auto'
                  }}>
                    {chartData.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        minWidth: '40px'
                      }}>
                        <div style={{
                          width: '30px',
                          background: `hsl(${220 + index * 20}, 70%, 50%)`,
                          height: `${Math.max(10, (item.value / Math.max(...chartData.map(d => d.value))) * 150)}px`,
                          borderRadius: '2px 2px 0 0'
                        }}></div>
                        <div style={{ 
                          fontSize: '10px', 
                          transform: 'rotate(-45deg)',
                          marginTop: '4px',
                          whiteSpace: 'nowrap'
                        }}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '4px' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Rank</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>User</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Orders</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Products</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Total Spent</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Last Purchase</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.875rem' }}>Activity Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>
                            <span style={{
                              display: 'inline-block',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: user.rank <= 3 ? '#ffd700' : '#e2e8f0',
                              textAlign: 'center',
                              lineHeight: '24px',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}>{user.rank}</span>
                          </td>
                          <td style={{ padding: '0.75rem', color: '#2d3748', fontSize: '0.875rem' }}>{user.username}</td>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>{user.totalOrders}</td>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>{user.totalProducts}</td>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>${user.totalSpent}</td>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>{user.lastPurchaseDate || 'Never'}</td>
                          <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.875rem' }}>{user.activityScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* All Users Section */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>All Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Username</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', color: '#718096' }}>{user.id}</td>
                  <td style={{ padding: '1rem', color: '#2d3748' }}>{user.username}</td>
                  <td style={{ padding: '1rem', color: '#718096' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#4299e1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => openModal(user)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80%',
            overflowY: 'auto',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <h3>User Details</h3>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>

            <h4>Order History</h4>
            {loadingOrders && <p>Loading orders...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loadingOrders && orderHistory.length === 0 && <p>No orders found.</p>}
            {!loadingOrders && orderHistory.length > 0 && (
              <ul>
                {orderHistory.map(order => (
                  <li key={order.id}>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <p><strong>Total:</strong> ${(order.total || 0).toFixed(2)}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.id}>{item.name} - Qty: {item.quantity} - Price: ${(item.price || 0).toFixed(2)}</li>
                      ))}
                    </ul>
                    <hr />
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#e53e3e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
