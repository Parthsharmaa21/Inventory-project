import React, { useState, useEffect, useRef } from 'react';
import { userMenu, adminMenu } from '../../utils/menuConfig';

const Sidebar = ({ role, activeMenu, setActiveMenu, sidebarOpen }) => {
  const [photo, setPhoto] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, []);

  useEffect(() => {
    if (photo) {
      localStorage.setItem('userPhoto', photo);
    } else {
      localStorage.removeItem('userPhoto');
    }
  }, [photo]);

  if (!sidebarOpen) return null;

  const handleMenuClick = (menuKey) => {
    console.log("Sidebar clicked:", menuKey); // Debug log
    setActiveMenu(menuKey);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setShowOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoAreaClick = () => {
    if (photo) {
      setShowOptions(prev => !prev);
    } else {
      fileInputRef.current.click();
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhotoClick = () => {
    setPhoto(null);
    setShowOptions(false);
  };

  const menuToRender = role === 'admin' ? adminMenu : userMenu;

  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%)',
      padding: '2rem 1rem',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <div 
        style={{ 
          marginBottom: '1rem', 
          textAlign: 'center', 
          cursor: 'pointer', 
          position: 'relative' 
        }}
        onClick={handlePhotoAreaClick}
        aria-label={photo ? "User photo options" : "Upload user photo"}
        title={photo ? "Click to change or remove photo" : "Click to upload photo"}
      >
        {photo ? (
          <img
            src={photo}
            alt="User"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }}
          />
        ) : (
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#ffffff80',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555'
          }}>
            No Photo
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
        />
        {showOptions && (
          <div style={{
            position: 'absolute',
            top: '110px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '0.5rem',
            zIndex: 10,
            width: '140px',
            textAlign: 'center'
          }}>
            <button
              onClick={handleChangePhotoClick}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.3rem 0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#36d1c4',
                fontWeight: 'bold'
              }}
            >
              Change Photo
            </button>
            <button
              onClick={handleRemovePhotoClick}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.3rem 0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#e53e3e',
                fontWeight: 'bold'
              }}
            >
              Remove Photo
            </button>
          </div>
        )}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
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
