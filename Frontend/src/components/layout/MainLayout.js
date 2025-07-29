import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

const MainLayout = ({ children, username, role, activeMenu, setActiveMenu }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);

  // Reset activeMenu when role changes
  useEffect(() => {
    if (setActiveMenu) {
      setActiveMenu(role === 'admin' ? 'dashboard' : 'shop');
    }
  }, [role, setActiveMenu]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header username={username} />
      <div style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        flexWrap: window.innerWidth <= 700 ? 'wrap' : 'nowrap'
      }}>
        <Sidebar 
          role={role}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          sidebarOpen={sidebarOpen}
          adminMenuOpen={adminMenuOpen}
          setAdminMenuOpen={setAdminMenuOpen}
        />
        <div style={{ 
          flex: 1, 
          padding: window.innerWidth <= 700 ? '1rem' : '2rem', 
          width: '100%' 
        }}>
          {children}
        </div>
      </div>
      {window.innerWidth <= 700 && (
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1000,
            background: '#36d1c4',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            fontSize: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        >
          {sidebarOpen ? '✖' : '☰'}
        </button>
      )}
    </div>
  );
};

export default MainLayout;