import React from 'react';

const Header = ({ username }) => {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        width: '220px',
        borderRight: '1px solid #e2e8f0',
        paddingRight: '1rem'
      }}>
        <h3 style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '1.1rem',
          fontWeight: 600 
        }}>
          👋 Hi, {username ? username.charAt(0).toUpperCase() + username.slice(1) : "there"}!
        </h3>
      </div>
    </div>
  );
};

export default Header;