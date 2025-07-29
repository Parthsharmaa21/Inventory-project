import React from 'react';
import { userMenu, adminMenu } from '../../utils/menuConfig';

const Sidebar = ({ role, activeMenu, setActiveMenu, sidebarOpen }) => {
  if (!sidebarOpen) return null;

  const handleMenuClick = (menuKey) => {
    console.log("Sidebar clicked:", menuKey); // Debug log
    setActiveMenu(menuKey);
  };

  const menuToRender = role === 'admin' ? adminMenu : userMenu;

  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%)',
      padding: '2rem 1rem',
      minHeight: '80vh'
    }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuToRender.map((item) => (
          <li
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            style={{
              marginBottom: '1rem',
              padding: '0.7rem 1rem',
              borderRadius: '8px',
              background: activeMenu === item.key ? '#fff' : 'transparent',
              color: activeMenu === item.key ? '#36d1c4' : '#fff',
              cursor: 'pointer'
            }}
          >
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
