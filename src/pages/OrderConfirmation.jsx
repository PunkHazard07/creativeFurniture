import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Try to get order from URL params (for Paystack redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        
        // Get locally stored order data
        const localOrderStr = localStorage.getItem("latestOrderData");
        const localOrder = localOrderStr ? JSON.parse(localOrderStr) : null;
        
        // Get order from location state (for direct navigation)
        const stateOrder = location.state?.orderData;
        
        console.log("URL Reference:", reference);
        console.log("Local order data:", localOrder);
        console.log("State order data:", stateOrder);
        
        // First priority: verify Paystack transaction if reference exists
        if (reference && localOrder?.paystackReference === reference) {
          const orderId = localOrder._id;
          console.log("Verifying Paystack transaction for order:", orderId);
          
          const token = localStorage.getItem("authToken");
          if (!token) {
            throw new Error("Authentication token not found");
          }
          
          const verifyResponse = await fetch(
            `${import.meta.env.VITE_BASE_URL}/paystack/verify/${reference}/${orderId}`,
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
            throw new Error(result.message || "Transaction verification failed");
          }
        } 
        // Second priority: use state order data
        else if (stateOrder) {
          console.log("Using order data from state:", stateOrder);
          setOrderDetails(stateOrder);
        }
        // Third priority: use local storage order data
        else if (localOrder) {
          console.log("Using order data from local storage:", localOrder);
          setOrderDetails(localOrder);
        } 
        // No order data found
        else {
          throw new Error("Order data not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [location]);

  // Clear order data from localStorage after successful load
  useEffect(() => {
    if (orderDetails && !loading) {
      // Clear stored order data to prevent reuse
      localStorage.removeItem("latestOrderData");
    }
  }, [orderDetails, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="bg-gray-800 p-4 rounded-full">
            <LoaderCircle className="animate-spin text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Please wait while we fetch your order details...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-700 mb-6">
            {error || "We couldn't find your order details. Please check your orders in your account."}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition duration-300 w-full"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate("/order")}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 transition duration-300 w-full"
            >
              View My Orders
            </button>
          </div>
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