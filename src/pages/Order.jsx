import Spinner from "../components/Spinner";
import ErrorAlert from "../components/ErrorAlert";
import OrderCard from "../components/Orders/OrderCard";
import { useOrders } from '../components/Orders/useOrders';

const Order = () => {
  const { orders, loading, error, statusUpdates, setError } = useOrders();

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <Spinner size="lg" color="indigo" />
          <h1 className="text-xl font-medium text-gray-800">
            Please wait while we fetch your order details.
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto">
        <ErrorAlert message={error} onClose={() => setError(null)} />
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

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isUpdated={statusUpdates[order._id]?.changed}
          />
        ))}
      </div>
    </div>
  );
};

export default Order;