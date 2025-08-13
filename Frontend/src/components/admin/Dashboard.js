import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ username }) => {
  const [analyticsData, setAnalyticsData] = useState({
    totalSales: 0,
    totalProductsSold: 0,
    lowStockCount: 0
  });
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    fetchLeaderboardData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const overviewResponse = await axios.get('http://localhost:5000/analytics/overview');
      setAnalyticsData(overviewResponse.data);

      const mostSoldResponse = await axios.get('http://localhost:5000/analytics/most-sold');
      setMostSoldProducts(mostSoldResponse.data);

      const productSalesResponse = await axios.get('http://localhost:5000/analytics/product-sales');
      setProductSales(productSalesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

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

  if (loading || loadingLeaderboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {username}! Use the sidebar to manage products, view users, or check stock.</p>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px', flex: 1 }}>
          <h4>Total Sales</h4>
          <p>${analyticsData.totalSales.toFixed(2)}</p>
        </div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px', flex: 1 }}>
          <h4>Products Sold</h4>
          <p>{analyticsData.totalProductsSold}</p>
        </div>
        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '8px', flex: 1 }}>
          <h4>Low Stock Count</h4>
          <p>{analyticsData.lowStockCount}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Most Sold Products Chart */}
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Most Sold Products</h3>
          <Bar 
            data={{
              labels: mostSoldProducts.map(product => product.name),
              datasets: [
                {
                  label: 'Units Sold',
                  data: mostSoldProducts.map(product => product.total_sold),
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  borderColor: 'rgba(53, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Top 5 Most Sold Products'
                }
              }
            }}
          />
        </div>

        {/* Product Sales Revenue Chart */}
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Product Sales Revenue</h3>
          <Bar 
            data={{
              labels: productSales.slice(0, 5).map(product => product.name),
              datasets: [
                {
                  label: 'Revenue ($)',
                  data: productSales.slice(0, 5).map(product => Number(product.total_sales)),
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Top 5 Products by Revenue'
                }
              }
            }}
          />
        </div>
      </div>

      {/* User Leaderboard */}
      <div style={{ marginTop: '2rem' }}>
        <h3>User Leaderboard</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Total Orders</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Total Products</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Total Spent</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Activity Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>{index + 1}</td>
                <td style={{ padding: '0.5rem' }}>{user.username}</td>
                <td style={{ padding: '0.5rem' }}>{user.totalOrders}</td>
                <td style={{ padding: '0.5rem' }}>{user.totalProducts}</td>
                <td style={{ padding: '0.5rem' }}>${user.totalSpent}</td>
                <td style={{ padding: '0.5rem' }}>{user.activityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
