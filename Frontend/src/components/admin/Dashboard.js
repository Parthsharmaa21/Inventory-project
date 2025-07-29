import React from 'react';

const Dashboard = ({ username }) => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {username}! Use the sidebar to manage products, view users, or check stock.</p>
    </div>
  );
};

export default Dashboard;