import React from 'react';

const Header = ({ username, setSidebarOpen }) => {
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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
        <button
          onClick={handleToggleSidebar}
          style={{
            margin: 0,
            color: '#2d3748',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          👋 Hi, {username ? username.charAt(0).toUpperCase() + username.slice(1) : "there"}!
        </button>
      </div>
    </div>
  );
};

export default Header;