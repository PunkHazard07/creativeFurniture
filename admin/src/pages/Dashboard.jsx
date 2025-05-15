import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell
} from 'recharts';
import { 
  LayoutDashboard, Users, Package, 
  CreditCard, RefreshCcw, ChevronRight, 
  Activity, ShoppingBag, TrendingUp, AlertTriangle
} from 'lucide-react';
import { dashboardService } from '../services/api'; // Import the dashboard service
import socketService from '../services/socket'; // Import the socket service

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    salesMetrics: { totalOrders: 0, totalSales: 0 },
    customerMetrics: { registeredUsers: 0 },
    inventoryMetrics: { outOfStockProducts: 0, totalProducts: 0, stockLevel: "0%" },
    financeMetrics: { successfulPayments: 0, failedPayments: 0, paymentSuccessRate: "0%" },
    recentActivity: {
      recentOrders: {
        data: [],
        pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 }
      },
      recentProducts: {
        data: [],
        pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 }
      }
    }
  });

  // Current pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardMetrics(
        timePeriod, 
        ordersPage, 
        productsPage
      );
      
      if (response.success) {
        setDashboardData(response.data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data manually
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Handle time period change
  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  // Handle pagination for orders
  const handleOrdersPagination = (direction) => {
    if (direction === 'prev' && ordersPage > 1) {
      setOrdersPage(prev => prev - 1);
    } else if (direction === 'next' && ordersPage < dashboardData.recentActivity.recentOrders.pagination.totalPages) {
      setOrdersPage(prev => prev + 1);
    }
  };

  // Handle pagination for products
  const handleProductsPagination = (direction) => {
    if (direction === 'prev' && productsPage > 1) {
      setProductsPage(prev => prev - 1);
    } else if (direction === 'next' && productsPage < dashboardData.recentActivity.recentProducts.pagination.totalPages) {
      setProductsPage(prev => prev + 1);
    }
  };

  // Set up Socket.io listeners for real-time updates
  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    // Subscribe to real-time events
    const newOrderSubscription = socketService.subscribe('new-order', () => {
      fetchDashboardData(); // Refresh data when new order comes in
    });

    const productUpdatedSubscription = socketService.subscribe('product-updated', () => {
      fetchDashboardData(); // Refresh data when a product is updated
    });

    const inventoryChangedSubscription = socketService.subscribe('inventory-changed', () => {
      fetchDashboardData(); // Refresh data when inventory changes
    });

    // Clean up subscriptions when component unmounts
    return () => {
      newOrderSubscription();
      productUpdatedSubscription();
      inventoryChangedSubscription();
    };
  }, []);

  // Fetch initial data and refresh when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod, ordersPage, productsPage]);

  // Generate chart data from the API data
  const salesData = Array(7).fill(0).map((_, index) => {
    // For simplicity, we're generating sample data for the chart
    // In a real app, you might want to add a dedicated endpoint for chart data
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const randomValue = dashboardData.salesMetrics.totalSales / 7 * (0.7 + Math.random() * 0.6);
    return {
      name: weekdays[index],
      value: randomValue
    };
  });

  const inventoryData = [
    { 
      name: 'In Stock', 
      value: dashboardData.inventoryMetrics.totalProducts - dashboardData.inventoryMetrics.outOfStockProducts, 
      fill: '#10b981' 
    },
    { 
      name: 'Out of Stock', 
      value: dashboardData.inventoryMetrics.outOfStockProducts, 
      fill: '#ef4444' 
    }
  ];

  const paymentData = [
    { 
      name: 'Successful', 
      value: dashboardData.financeMetrics.successfulPayments, 
      fill: '#3b82f6' 
    },
    { 
      name: 'Failed', 
      value: dashboardData.financeMetrics.failedPayments, 
      fill: '#f59e0b' 
    }
  ];

  // Format date 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency to Naira
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && !dashboardData.salesMetrics.totalOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex flex-col xs:flex-row gap-3">
              <select
                value={timePeriod}
                onChange={handleTimePeriodChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="daily">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
                <option value="all">All Time</option>
              </select>
              <button 
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales Metric */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">Sales</h2>
              <div className="p-2 bg-blue-50 rounded-full">
                <span className="h-5 w-5 text-blue-600 font-bold">₦</span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-800 text-left">{formatNaira(dashboardData.salesMetrics.totalSales)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData.salesMetrics.totalOrders} orders
              </p>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% increase</span>
              </div>
            </div>
          </div>

          {/* Customer Metric */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">Customers</h2>
              <div className="p-2 bg-green-50 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-800">{dashboardData.customerMetrics.registeredUsers}</p>
              <p className="text-sm text-gray-500 mt-1">
                Registered users
              </p>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>8.5% increase</span>
              </div>
            </div>
          </div>

          {/* Inventory Metric */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">Inventory</h2>
              <div className="p-2 bg-purple-50 rounded-full">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-800">{dashboardData.inventoryMetrics.totalProducts}</p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData.inventoryMetrics.outOfStockProducts} out of stock
              </p>
              <div className="mt-2 flex items-center text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>{dashboardData.inventoryMetrics.stockLevel} in stock</span>
              </div>
            </div>
          </div>

          {/* Finance Metric */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">Payments</h2>
              <div className="p-2 bg-amber-50 rounded-full">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-800">{dashboardData.financeMetrics.successfulPayments}</p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData.financeMetrics.failedPayments} failed payments
              </p>
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>{dashboardData.financeMetrics.paymentSuccessRate} success rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Sales Overview</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatNaira(value), 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status Chart */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Payment Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Payments']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Products']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-700">Recent Orders</h2>
                <div className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                  <span className="text-sm font-medium">View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {dashboardData.recentActivity.recentOrders.data.length > 0 ? (
                    dashboardData.recentActivity.recentOrders.data.map((order) => (
                      <li key={order.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100' : 
                              order.status === 'processing' ? 'bg-blue-100' : 'bg-red-100'
                            }`}>
                              <ShoppingBag className={`h-5 w-5 ${
                                order.status === 'completed' ? 'text-green-600' : 
                                order.status === 'processing' ? 'text-blue-600' : 'text-red-600'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Order #{order.id}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-semibold text-gray-900">{formatNaira(order.amount)}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500">No orders found</li>
                  )}
                </ul>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {dashboardData.recentActivity.recentOrders.pagination.page} of {dashboardData.recentActivity.recentOrders.pagination.totalPages} pages
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleOrdersPagination('prev')} 
                    disabled={ordersPage === 1}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                      ordersPage === 1 
                        ? 'text-gray-400 bg-gray-100' 
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handleOrdersPagination('next')} 
                    disabled={ordersPage >= dashboardData.recentActivity.recentOrders.pagination.totalPages}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                      ordersPage >= dashboardData.recentActivity.recentOrders.pagination.totalPages 
                        ? 'text-gray-400 bg-gray-100' 
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-700">Recent Products</h2>
                <div className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                  <span className="text-sm font-medium">View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {dashboardData.recentActivity.recentProducts.data.length > 0 ? (
                    dashboardData.recentActivity.recentProducts.data.map((product) => (
                      <li key={product.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-full ${
                              product.action === 'Added' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <Package className={`h-5 w-5 ${
                                product.action === 'Added' ? 'text-green-600' : 'text-blue-600'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.action} on {formatDate(product.date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{formatNaira(product.price)}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500">No products found</li>
                  )}
                </ul>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {dashboardData.recentActivity.recentProducts.pagination.page} of {dashboardData.recentActivity.recentProducts.pagination.totalPages} pages
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleProductsPagination('prev')} 
                    disabled={productsPage === 1}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                      productsPage === 1 
                        ? 'text-gray-400 bg-gray-100' 
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handleProductsPagination('next')} 
                    disabled={productsPage >= dashboardData.recentActivity.recentProducts.pagination.totalPages}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                      productsPage >= dashboardData.recentActivity.recentProducts.pagination.totalPages 
                        ? 'text-gray-400 bg-gray-100' 
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;