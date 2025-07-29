import React from 'react';

const UserManagement = ({ users }) => {
  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>User Management</h2>
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
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#4299e1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;