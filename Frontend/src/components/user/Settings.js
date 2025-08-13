import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [profile, setProfile] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const [tempValue, setTempValue] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditProfileClick = () => {
    setIsEditing(!isEditing);
  };

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveClick = async () => {
    // Update the specific field in the local state
    setProfile(prev => ({
      ...prev,
      [editingField]: tempValue
    }));
    
    // Send the update to the backend
    try {
      await axios.put('http://localhost:5000/update_profile', {
        user_id: user.id,
        role: 'user',
        name: editingField === 'name' ? tempValue : profile.name,
        email: editingField === 'email' ? tempValue : profile.email,
        phone: editingField === 'phone' ? tempValue : profile.phone
      });
      console.log(`Updated ${editingField}:`, tempValue);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
    
    setEditingField(null);
    setTempValue('');
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    try {
      await axios.put('http://localhost:5000/change_password', {
        user_id: user.id,
        role: 'user',
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      alert('Password changed successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Current password is incorrect!');
      } else {
        alert('Failed to change password');
      }
    }
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePassword(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Profile Settings</h2>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Personal Information</h3>
          <button 
            onClick={handleEditProfileClick}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#36d1c4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Name:</strong> {profile.name}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Email:</strong> {profile.email || 'Not provided'}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Phone:</strong> {profile.phone || 'Not provided'}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Password:</strong> {'••••••••'}
          </div>
        </div>
        
        {isEditing && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <h4>Edit Information</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Name:</strong> {profile.name}
                </div>
                {editingField === 'name' ? (
                  <div>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      style={{ padding: '0.3rem', marginRight: '0.5rem' }}
                    />
                    <button 
                      onClick={handleSaveClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#36d1c4', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '0.3rem'
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#ccc', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEditClick('name', profile.name)}
                    style={{ 
                      padding: '0.3rem 0.5rem', 
                      backgroundColor: '#36d1c4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Email:</strong> {profile.email}
                </div>
                {editingField === 'email' ? (
                  <div>
                    <input
                      type="email"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      style={{ padding: '0.3rem', marginRight: '0.5rem' }}
                    />
                    <button 
                      onClick={handleSaveClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#36d1c4', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '0.3rem'
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#ccc', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEditClick('email', profile.email)}
                    style={{ 
                      padding: '0.3rem 0.5rem', 
                      backgroundColor: '#36d1c4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Phone:</strong> {profile.phone}
                </div>
                {editingField === 'phone' ? (
                  <div>
                    <input
                      type="tel"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      style={{ padding: '0.3rem', marginRight: '0.5rem' }}
                    />
                    <button 
                      onClick={handleSaveClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#36d1c4', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '0.3rem'
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelClick}
                      style={{ 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: '#ccc', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEditClick('phone', profile.phone)}
                    style={{ 
                      padding: '0.3rem 0.5rem', 
                      backgroundColor: '#36d1c4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Change Password</h3>
          <button 
            onClick={() => setShowChangePassword(!showChangePassword)}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#36d1c4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            {showChangePassword ? 'Cancel' : 'Change'}
          </button>
        </div>
        
        {showChangePassword && (
          <form onSubmit={handleSubmitPassword} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                padding: '0.7rem 1.5rem',
                backgroundColor: '#36d1c4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Update Password
            </button>
          </form>
        )}
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.7rem 1.5rem', 
            backgroundColor: '#e53e3e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserSettings;

