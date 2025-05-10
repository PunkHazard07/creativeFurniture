import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localOrder = localStorage.getItem("latestOrderData");
    const stateOrder =
      location.state?.orderData || (localOrder ? JSON.parse(localOrder) : null);
    const reference = stateOrder?.paystackReference;
    const orderId = stateOrder?._id;

    console.log("Order data found in location state:", localOrder);
    console.log("Order data found in state:", stateOrder);
    console.log("Order reference:", reference);
    console.log("Order ID:", orderId);

    if (reference && orderId) {
      const verifyTransaction = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const verifyResponse = await fetch(
            `${
              import.meta.env.VITE_BASE_URL
            }/paystack/verify/${reference}/${orderId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await verifyResponse.json();
          console.log("Verification result:", result);
          if (verifyResponse.ok && result.success) {
            setOrderDetails(result.order);
          } else {
            console.error("Verification failed:", result.message);
          }
        } catch (error) {
          console.error("Verification error:", error);
        } finally {
          setLoading(false);
        }
      };
      verifyTransaction();
    } else {
      // Fallback: use the passed order data directly
      if (stateOrder) {
        setOrderDetails(stateOrder);
      }
      setLoading(false);
    }
  }, [location]);

  console.log("Order first details:", orderDetails); // Debugging line
  useEffect(() => {
    console.log("Current order details state:", orderDetails);
  }, [orderDetails]);
  console.log("Order secodn details:", orderDetails); // Debugging line

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="bg-gray-800 p-4 rounded-full">
            <LoaderCircle className="animate-spin text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Please wait while we fetch your order details.
          </h1>

        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-700 mb-6">
            We couldn't find your order details. Please check your orders in
            your account.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-6 sm:p-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Your order{" "}
            <span className="font-semibold">#{orderDetails._id}</span> has been
            placed successfully.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="text-gray-600 space-y-3 text-sm sm:text-base">
            <p>
              <span className="font-medium">Total:</span> ₦
              {Number(orderDetails.amount).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {orderDetails.paymentMethod || "Cash on Delivery"}
            </p>
            <p>
              <span className="font-medium">Order Status:</span>{" "}
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {orderDetails.status}
              </span>
            </p>
          </div>

          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items Ordered:</h3>
              <div className="border rounded-lg divide-y">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="p-3 flex justify-between">
                    <div>
                      <p className="font-medium">
                        {item.name || `Product ID: ${item.productId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p>₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
          <div className="text-gray-600 space-y-1 text-sm sm:text-base">
            <p>
              {orderDetails.firstName} {orderDetails.lastName}
            </p>
            <p>{orderDetails.email}</p>
            <p>{orderDetails.phone}</p>
            <p>{orderDetails.address}</p>
            <p>{orderDetails.country}</p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition duration-300"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-3 cursor-pointer rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm sm:text-base transition duration-300 block w-full"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
