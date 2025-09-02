import React, { useState, useEffect } from "react";
import { backendUrl, currency } from "../App";
import { Link } from "react-router-dom";

// Icons for dashboard
const IconBox = ({ icon, bgColor }) => (
  <div className={`p-3 rounded-full ${bgColor} text-white w-12 h-12 flex items-center justify-center`}>
    {icon}
  </div>
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    eyeglasses: 0,
    sunglasses: 0,
    contacts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get products stats
        const productsResponse = await fetch(`${backendUrl}/api/products/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
          },
        });
        
        // Get orders stats
        const ordersResponse = await fetch(`${backendUrl}/api/orders/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
          },
        });
        
        if (!productsResponse.ok || !ordersResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        
        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();
        
        setStats({
          totalProducts: productsData.totalProducts || 0,
          eyeglasses: productsData.categoryCount?.eyeglasses || 0,
          sunglasses: productsData.categoryCount?.sunglasses || 0,
          contacts: productsData.categoryCount?.contacts || 0,
          totalOrders: ordersData.totalOrders || 0,
          pendingOrders: ordersData.pendingOrders || 0,
          revenue: ordersData.totalRevenue || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-sm text-blue-500 font-medium">Total Products</h2>
              <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h2 className="text-sm text-green-500 font-medium">Total Orders</h2>
              <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
              <h2 className="text-sm text-yellow-500 font-medium">Pending Orders</h2>
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <h2 className="text-sm text-purple-500 font-medium">Total Revenue</h2>
              <p className="text-3xl font-bold mt-2">{currency}{stats.revenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Product Category Breakdown */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium">Eyeglasses</h3>
                <p className="text-2xl font-bold mt-2">{stats.eyeglasses}</p>
                <div className="h-2 bg-gray-200 rounded-full mt-4">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(stats.eyeglasses / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium">Sunglasses</h3>
                <p className="text-2xl font-bold mt-2">{stats.sunglasses}</p>
                <div className="h-2 bg-gray-200 rounded-full mt-4">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${(stats.sunglasses / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium">Contact Lenses</h3>
                <p className="text-2xl font-bold mt-2">{stats.contacts}</p>
                <div className="h-2 bg-gray-200 rounded-full mt-4">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(stats.contacts / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="/add" 
                className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">Add New Product</span>
              </a>
              <a 
                href="/orders" 
                className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">View Orders</span>
              </a>
              <a 
                href="/list" 
                className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">Manage Products</span>
              </a>
              <a 
                href="/blogs" 
                className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">Manage Content</span>
              </a>
              <a 
                href="/import" 
                className="flex items-center justify-center bg-white p-4 rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <span className="font-medium">Import Products</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
