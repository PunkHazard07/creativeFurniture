import { useEffect, useState } from "react";
import LoadingState from "../components/Profile/LoadingState";
import UserCard from "../components/Profile/UserCard";
import OrdersSummary from "../components/Profile/OrderSummary";
import ErrorAlert from "../components/ErrorAlert";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [ordersSummary, setOrdersSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [userRes, ordersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, { headers }),
        fetch(`${import.meta.env.VITE_BASE_URL}/userOrders`, { headers }),
      ]);

      if (!userRes.ok) throw new Error("Failed to fetch user profile.");
      const userData = await userRes.json();

      const ordersData = await ordersRes.json();
      if (!ordersData.success) {
        throw new Error(ordersData.message || "Failed to fetch orders.");
      }

      const summary = (ordersData.orders || []).reduce(
        (acc, order) => {
          acc.totalOrders++;
          if (order.status === "Pending") acc.pendingOrders++;
          else if (order.status === "Shipped") acc.shippedOrders++;
          else if (order.status === "Delivered") acc.deliveredOrders++;
          else if (order.status === "Cancelled") acc.cancelledOrders++;
          return acc;
        },
        { totalOrders: 0, pendingOrders: 0, shippedOrders: 0, deliveredOrders: 0, cancelledOrders: 0 }
      );

      setUser(userData.user);
      setOrdersSummary(summary);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          My Profile
        </h1>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserCard user={user} />
          <OrdersSummary summary={ordersSummary} />
        </div>
      </div>
    </div>
  );
};

export default Profile;