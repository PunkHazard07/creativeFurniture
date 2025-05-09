import React, { useState, useEffect } from "react";

const Orders = () => {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [updateMessage, setUpdateMessage] = useState(null);
const [filterStatus, setFilterStatus] = useState("All"); // State for filter status
const [showArchived, setShowArchived] = useState(false); // State for archived orders

const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];
    
    const token = localStorage.getItem('token'); // get token from localStorage

  // Fetch all orders on component mount
useEffect(() => {
    fetchOrders();
}, [showArchived]); // Re-fetch orders when showArchived changes

  // Function to fetch all orders
const fetchOrders = async () => {
    try {
    setLoading(true);
    const response = await fetch('http://localhost:8080/api/listOrders', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Include token in the request header
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    if (data.success) {
          // Filter out archived orders if showArchived is false
          const filteredOrders = showArchived 
          ? data.order 
          : data.order.filter(order => !order.isArchived);
        setOrders(filteredOrders);
    } else {
        throw new Error(data.message || 'Error fetching orders');
    }
    } catch (err) {
    setError(err.message);
    console.error('Error fetching orders:', err);
    } finally {
    setLoading(false);
    }
};

console.log(orders, 'orders');

  // Function to update order status
const updateStatus = async (orderId, newStatus) => {
    try {

      setUpdateMessage({type: 'loading', message: 'Updating status...'});

    const response = await fetch('http://localhost:8080/api/status', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Include token in the request header
        },
        body: JSON.stringify({
        orderId,
        status: newStatus
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update status');
    }

    const data = await response.json();
    if (data.success) {
        // Update the local state to reflect the change
        setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
        ));

        setUpdateMessage({type: 'success', message: 'Status updated successfully!'});
        
        // clear success message after 3 seconds
        setTimeout(() => {
            setUpdateMessage(null);
        }, 3000);

    } else {
        throw new Error(data.message || 'Error updating status');
    }
    } catch (err) {
    console.error('Error updating order status:', err);
    setUpdateMessage({type: 'error', text:`Error: ${err.message}` });
    
    // clear error message after 5 seconds
    setTimeout(() => {
        setUpdateMessage(null);
    }, 5000);

    }
  };

  //function to delete an order
  const deleteOrder = async (orderId) => {
    // Confirmation before deletion
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      setUpdateMessage({type: 'loading', text: 'Deleting order...'});

      const response = await fetch('http://localhost:8080/api/deleteOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      const data = await response.json();
      if (data.success) {
        // Remove the deleted order from the state
        setOrders(orders.filter(order => order._id !== orderId));
        setUpdateMessage({type: 'success', text: 'Order deleted successfully!'});
        
        setTimeout(() => {
          setUpdateMessage(null);
        }, 3000);
      } else {
        throw new Error(data.message || 'Error deleting order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      setUpdateMessage({type: 'error', text: `Error: ${err.message}`});
      
      setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
    }
  };

  //function to archieve an order
  const archiveOrder = async (orderId) => {
    try {
      setUpdateMessage({type: 'loading', text: 'Archiving order...'});

      const response = await fetch('http://localhost:8080/api/archiveOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to archive order');
      }

      const data = await response.json();
      if (data.success) {
        // If not showing archived orders, remove from view
        if (!showArchived) {
          setOrders(orders.filter(order => order._id !== orderId));
        } else {
          // Otherwise update the order's archived status
          setOrders(orders.map(order => 
            order._id === orderId ? { ...order, isArchived: true } : order
          ));
        }
        
        setUpdateMessage({type: 'success', text: 'Order archived successfully!'});
        
        setTimeout(() => {
          setUpdateMessage(null);
        }, 3000);
      } else {
        throw new Error(data.message || 'Error archiving order');
      }
    } catch (err) {
      console.error('Error archiving order:', err);
      setUpdateMessage({type: 'error', text: `Error: ${err.message}`});
      
      setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
    }
  };

  console.log(orders, 'orders');

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    updateStatus(orderId, newStatus);
  };

  // filter orders by status
  const filteredOrders = filterStatus === "All" 
  ? orders 
  : orders.filter(order => order.status === filterStatus);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return  (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      {/* Status Update Message */}
      {updateMessage && (
        <div className={`mb-4 p-3 rounded ${
          updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 
          updateMessage.type === 'error' ? 'bg-red-100 text-red-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {updateMessage.text}
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div>
          <label htmlFor="statusFilter" className="mr-2 text-sm font-medium">Filter by Status:</label>
          <select 
            id="statusFilter"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border rounded px-3 py-1"
          >
            <option value="All">All</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="showArchived"
            checked={showArchived}
            onChange={e => setShowArchived(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showArchived" className="text-sm font-medium">
            Show Archived Orders
          </label>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-xl">No orders found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full table-auto border-collapse shadow-lg rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-4">User</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className={`border-b hover:bg-gray-50 ${order.isArchived ? 'bg-gray-50 opacity-70' : ''}`}
                  >
                    <td className="p-4">{`${order.firstName}`}</td>
                    <td className="p-4">{order.address}</td>
                    <td className="p-4">₦{order.amount ? order.amount.toFixed(2) : '0.00'}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`bg-white border rounded px-2 py-1 ${
                          order.status === 'Pending' ? 'border-yellow-400 text-yellow-500' :
                          order.status === 'Shipped' ? 'border-indigo-400 text-indigo-500' :
                          order.status === 'Delivered' ? 'border-green-400 text-green-600' :
                          order.status === 'Cancelled' ? 'border-red-400 text-red-500' :
                          'border-gray-300'
                        }`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                        <td className="p-4">{order.paymentMethod}</td>
                    <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {!order.isArchived ? (
                          <button
                            onClick={() => archiveOrder(order._id)}
                            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm"
                            title="Archive Order"
                          >
                            Archive
                          </button>
                        ) : null}
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-sm"
                          title="Delete Order"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white shadow-md rounded-xl p-4 space-y-2 border ${order.isArchived ? 'opacity-70' : ''}`}
              >
                <div>
                  <strong>User:</strong> {order.userId}
                </div>
                <div>
                  <strong>Address:</strong> {order.address}
                </div>
                <div>
                  <strong>Total:</strong> ₦{order.amount ? order.amount.toFixed(2) : '0.00'}
                </div>
                <div>
                  <strong>Status:</strong>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`block mt-1 bg-white border rounded px-2 py-1 w-full ${
                      order.status === 'Pending' ? 'border-yellow-400 text-yellow-500' :
                      order.status === 'Shipped' ? 'border-indigo-400 text-indigo-500' :
                      order.status === 'Delivered' ? 'border-green-400 text-green-600' :
                      order.status === 'Cancelled' ? 'border-red-400 text-red-500' :
                      'border-gray-300'
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                </div>
                <div className="flex gap-2 pt-2">
                  {!order.isArchived ? (
                    <button
                      onClick={() => archiveOrder(order._id)}
                      className="flex-1 text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm"
                    >
                      Archive
                    </button>
                  ) : null}
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="flex-1 text-red-500 bg-red-100 hover:bg-red-200 px-3 py-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;