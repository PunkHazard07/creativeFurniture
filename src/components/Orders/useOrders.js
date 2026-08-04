import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  const token = localStorage.getItem("authToken");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/userOrders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err.message || "Error fetching orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    const orderStatuses = {};
    orders.forEach((order) => {
      const prevStatus = statusUpdates[order._id]?.prevStatus;

      if (prevStatus && prevStatus !== order.status) {
        setStatusUpdates((prev) => ({
          ...prev,
          [order._id]: { prevStatus: order.status, changed: true },
        }));

        setTimeout(() => {
          setStatusUpdates((prev) => ({
            ...prev,
            [order._id]: { prevStatus: order.status, changed: false },
          }));
        }, 2000);
      } else if (!prevStatus) {
        orderStatuses[order._id] = { prevStatus: order.status, changed: false };
      }
    });

    if (Object.keys(statusUpdates).length === 0 && orders.length > 0) {
      setStatusUpdates(orderStatuses);
    }
  }, [orders, statusUpdates]);

  return { orders, loading, error, statusUpdates, setError };
};