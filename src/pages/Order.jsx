import React, { useState, useEffect, useCallback } from 'react'

const statusColors = {
  Pending: 'text-yellow-500',
  Shipped: 'text-indigo-500',
  Delivered: 'text-green-600',
  Cancelled: 'text-red-500'
}

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track status changes

  const token = localStorage.getItem('authToken');

  // Extract the fetchOrders function so we can reuse it
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch orders from your API endpoint
      const response = await fetch('http://localhost:8080/api/userOrders', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Initial fetch
    fetchOrders();
    
    // Set up polling every 5 seconds to check for status updates
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5000); // 30 seconds
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    // Store previous order statuses to detect changes
    const orderStatuses = {};
    orders.forEach(order => {
      const prevStatus = statusUpdates[order._id]?.prevStatus;
      
      // If we have a previous status and it's different from current
      if (prevStatus && prevStatus !== order.status) {
        // Set the animation flag
        setStatusUpdates(prev => ({
          ...prev,
          [order._id]: { 
            prevStatus: order.status, 
            changed: true 
          }
        }));
        
        // Clear the animation after 2 seconds
        setTimeout(() => {
          setStatusUpdates(prev => ({
            ...prev,
            [order._id]: { 
              prevStatus: order.status, 
              changed: false 
            }
          }));
        }, 2000);
      } else if (!prevStatus) {
        // Initialize for first load
        orderStatuses[order._id] = { 
          prevStatus: order.status, 
          changed: false 
        };
      }
    });
    
    // Only set on first load to avoid loops
    if (Object.keys(statusUpdates).length === 0 && orders.length > 0) {
      setStatusUpdates(orderStatuses);
    }
  }, [orders, statusUpdates]);

  if (loading && orders.length === 0) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Unable to load orders</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white shadow-md border rounded-2xl p-4 sm:p-6">
            <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
              </div>
              <div 
                className={`font-medium ${statusColors[order.status] || 'text-gray-600'} ${
                  statusUpdates[order._id]?.changed ? 'animate-pulse' : ''
                }`}
              >
                {order.status}
                {statusUpdates[order._id]?.changed && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Updated
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <p className="font-medium text-gray-700">Shipping Address:</p>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-2">Items:</p>
              <ul className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 py-3">
                    {item.productId && item.productId.images && item.productId.images[0] ? (
                      <img 
                        src={item.productId.images[0]} 
                        alt={item.productId.name || 'Product image'} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.productId && item.productId.name ? item.productId.name : 'Unnamed Product'}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right font-semibold text-gray-800">
              Total: ₦{(order.amount || 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;