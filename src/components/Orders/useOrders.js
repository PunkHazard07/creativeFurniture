import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/user-orders`, {
        headers: {
          "Content-Type": "application/json",
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
  }, []);

  useEffect(() => {
    fetchOrders();

    let intervalId = setInterval(() => fetchOrders(), 5000);

    // Pause polling while the tab is in the background — no point
    // hitting the server every 5s for a page nobody's looking at.
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        fetchOrders(); // catch up immediately on return
        intervalId = setInterval(() => fetchOrders(), 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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