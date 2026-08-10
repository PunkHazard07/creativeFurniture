import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showArchived, setShowArchived] = useState(false);

  const token = localStorage.getItem("token");

  // Helper to show temporary UI feedback messages
  const showNotification = (type, text, duration = 3000) => {
    setUpdateMessage({ type, text });
    if (duration > 0) {
      setTimeout(() => setUpdateMessage(null), duration);
    }
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/listOrders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      if (data.success) {
        const filtered = showArchived
          ? data.order
          : data.order.filter((order) => !order.isArchived);
        setOrders(filtered);
      } else {
        throw new Error(data.message || "Error fetching orders");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token, showArchived]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      showNotification("loading", "Updating status...", 0);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        showNotification("success", "Status updated successfully!", 3000);
      } else {
        throw new Error(data.message || "Error updating status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      showNotification("error", `Error: ${err.message}`, 5000);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      showNotification("loading", "Deleting order...", 0);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/deleteOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) throw new Error("Failed to delete order");

      const data = await response.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
        showNotification("success", "Order deleted successfully!", 3000);
      } else {
        throw new Error(data.message || "Error deleting order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      showNotification("error", `Error: ${err.message}`, 5000);
    }
  };

  // Archive order
  const archiveOrder = async (orderId) => {
    try {
      showNotification("loading", "Archiving order...", 0);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/archiveOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) throw new Error("Failed to archive order");

      const data = await response.json();
      if (data.success) {
        if (!showArchived) {
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
        } else {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, isArchived: true } : order
            )
          );
        }
        showNotification("success", "Order archived successfully!", 3000);
      } else {
        throw new Error(data.message || "Error archiving order");
      }
    } catch (err) {
      console.error("Error archiving order:", err);
      showNotification("error", `Error: ${err.message}`, 5000);
    }
  };

  // Derived filtered list based on selected filter status
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // User display helper
  const getUserDisplayName = (order) => {
    if (order.userId && typeof order.userId === "object") {
      return order.userId.username || "Anonymous User";
    }
    return "User #" + (order.userId?.substring(0, 6) || "Unknown");
  };

  return {
    orders,
    filteredOrders,
    loading,
    error,
    updateMessage,
    filterStatus,
    setFilterStatus,
    showArchived,
    setShowArchived,
    updateStatus,
    deleteOrder,
    archiveOrder,
    refetch: fetchOrders,
    getUserDisplayName,
  };
};