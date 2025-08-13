import React, { useState, useEffect } from 'react';
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

const ProductAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalSales: 0,
    totalProductsSold: 0,
    lowStockCount: 0
  });
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [leastSoldProducts, setLeastSoldProducts] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics overview
        const overviewResponse = await fetch('http://localhost:5000/analytics/overview');
        const overviewData = await overviewResponse.json();
        setAnalyticsData(overviewData);

        // Fetch most sold products
        const mostSoldResponse = await fetch('http://localhost:5000/analytics/most-sold');
        const mostSoldData = await mostSoldResponse.json();
        setMostSoldProducts(mostSoldData);

        // Fetch least sold products
        const leastSoldResponse = await fetch('http://localhost:5000/analytics/least-sold');
        const leastSoldData = await leastSoldResponse.json();
        setLeastSoldProducts(leastSoldData);

        // Fetch product sales data
        const productSalesResponse = await fetch('http://localhost:5000/analytics/product-sales');
        const productSalesData = await productSalesResponse.json();
        setProductSales(productSalesData);

        // Fetch low stock count directly
        const productsResponse = await fetch('http://localhost:5000/products');
        const products = await productsResponse.json();
        const lowStockCount = products.filter(product => product.stock < 15).length;
        setAnalyticsData(prev => ({ ...prev, lowStockCount }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch low stock products when needed
  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      const products = await response.json();
      // Filter products with low stock (less than 15)
      const lowStockItems = products.filter(product => product.stock < 15);
      setLowStockProducts(lowStockItems);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  // Toggle low stock details visibility
  const toggleLowStockDetails = async () => {
    if (!showLowStockDetails && lowStockProducts.length === 0) {
      await fetchLowStockProducts();
    }
    setShowLowStockDetails(!showLowStockDetails);
  };

  // Prepare data for charts
  const mostSoldChartData = {
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
  };

  const leastSoldChartData = {
    labels: leastSoldProducts.map(product => product.name),
    datasets: [
      {
        label: 'Units Sold',
        data: leastSoldProducts.map(product => product.total_sold),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const productSalesChartData = {
    labels: productSales.map(product => product.name),
    datasets: [
      {
        label: 'Sales ($)',
        data: productSales.map(product => product.total_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>Product Analytics</h2>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div 
          style={{ padding: '1.5rem', background: '#ebf8ff', borderRadius: '8px' }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: '#2c5282' }}>Total Sales</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2b6cb0' }}>
            ${analyticsData.totalSales.toFixed(2)}
          </p>
        </div>
        <div 
          style={{ padding: '1.5rem', background: '#f0fff4', borderRadius: '8px' }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: '#276749' }}>Products Sold</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2f855a' }}>
            {analyticsData.totalProductsSold}
          </p>
        </div>
        <div 
          style={{ padding: '1.5rem', background: '#fff5f5', borderRadius: '8px', cursor: 'pointer' }} 
          onClick={toggleLowStockDetails}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: '#c53030' }}>Low Stock Items</h4>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#e53e3e' }}>
            {analyticsData.lowStockCount}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#718096' }}>
            {showLowStockDetails ? 'Click to hide details' : 'Click to see details'}
          </p>
        </div>
      </div>

      {/* Low Stock Products Details */}
      {showLowStockDetails && (
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '1rem' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Low Stock Items (Less than 15 in stock)</h3>
          {lowStockProducts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7fafc' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Product Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Current Stock</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#4a5568' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', color: '#2d3748' }}>{product.name}</td>
                      <td style={{ padding: '1rem', color: '#e53e3e', fontWeight: '600' }}>{product.stock}</td>
                      <td style={{ padding: '1rem', color: '#718096' }}>{product.category || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#718096', fontStyle: 'italic' }}>
              No products with low stock (less than 15 items)
            </p>
          )}
        </div>
      )}

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Most Sold Products Chart */}
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Most Sold Products</h3>
          <Bar 
            data={mostSoldChartData} 
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

        {/* Least Sold Products Chart */}
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Least Sold Products</h3>
          <Bar 
            data={leastSoldChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Bottom 5 Least Sold Products'
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Product Sales Chart */}
      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '2rem' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Product Sales Overview</h3>
        <Bar 
          data={productSalesChartData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Total Sales by Product'
              }
            }
          }} 
        />
      </div>
    </div>
  );
}; 

export default ProductAnalytics;
