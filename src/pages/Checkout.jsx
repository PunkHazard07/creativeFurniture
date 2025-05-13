import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartFromBackend } from "../redux/cartSlice";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stockErrors, setStockErrors] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("cash");

  //Billing form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

   // Reset error states when cart changes
  useEffect(() => {
    if (stockErrors.length > 0) {
      setStockErrors([]);
    }
  }, [cartItems]);

  //form validation
  const validateForm = () => {
    if (!firstName || !lastName || !phone || !country || !address || !email) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

    // Check if a product in the cart has stock issues
    const hasStockIssue = (productId) => {
      return stockErrors.some(error => error.includes(productId));
    };

  // Handle form submission
  const handlePlaceOrder = async () => {
    if (!validateForm()) return; //validate form before proceeding

    setIsSubmitting(true); // Set loading state
    setError(null); // Reset error state
    setStockErrors([]); // Reset stock errors

    if (paymentMethod === "cash") {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You must be logged in to place an order.");
          setIsSubmitting(false); // Reset loading state
          return;
        }

        //normilize cart items to match backend expectations
        const orderItems = cartItems.map((item) => ({
          productId: item.id || item.productId, //fallback to productID if id is not available
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        }));

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/place`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            country,
            address,
            email,
            amount: totalPrice,
            items: orderItems,
          }),
        });

        console.log("Response from backend:", response); // Log the response for debugging

        const data = await response.json();
        if (response.ok) {
          // Clear cart in redux and localStorage after successful order
          dispatch(clearCartFromBackend());
          // Handle successful order placement

          //pass complete order data to the confirmation page
          const orderData = {
            _id: data.order._id || data.order.id,
            firstName,
            lastName,
            phone,
            country,
            address,
            email,
            amount: totalPrice,
            paymentMethod: paymentMethod,
            status: data.order.status || "Processing",
            items: orderItems,
          };

          navigate("/order-success", {
            state: { orderData }, // Pass order details to success page
          }); // Redirect to success page
        } else {
          // Handle stock validation errors
          if (data.errors && Array.isArray(data.errors)) {
            setStockErrors(data.errors);
          } else if (data.message && data.message.includes("Stock validation failed") && data.errors) {
            setStockErrors(data.errors);
          } else {
            setError(data.message || "Error placing order. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error placing order:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }

    // Handle Paystack payment logic here
    if (paymentMethod === "paystack") {
      // Implement Paystack payment logic here
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You must be logged in to place an order.");
          setIsSubmitting(false); // Reset loading state
          return;
        }

        //normilize cart items to match backend expectations
        const orderItems = cartItems.map((item) => ({
          productId: item.id || item.productId, //fallback to productID if id is not available
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        }));

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/paystack/init`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName,
              lastName,
              phone,
              country,
              address,
              email,
              amount: totalPrice,
              items: orderItems,
            }),
          }
        );

        console.log("paystack Response from backend:", response); // Log the response for debugging

        const data = await response.json();
        console.log("paystack data", data);
        if (response.ok) {
          // Clear cart in redux and localStorage after successful order
          
          const orderData = {
            _id: data.order._id || data.order.id,
            firstName,
            lastName,
            phone,
            country,
            address,
            email,
            amount: totalPrice,
            paymentMethod: paymentMethod,
            status: data.order.status || "Processing",
            items: orderItems,
            paystackReference: data.paystackReference,
          };
          
          localStorage.setItem("latestOrderData", JSON.stringify(orderData));
          
          window.location.href = data.authorization_url;
          
          dispatch(clearCartFromBackend());

        } else {
          // Handle stock validation errors
          if (data.errors && Array.isArray(data.errors)) {
            setStockErrors(data.errors);
          } else if (data.message && data.message.includes("Stock validation failed") && data.errors) {
            setStockErrors(data.errors);
          } else {
            setError(data.message || "Error placing order. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error placing order:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        
          {/* Stock Warning Display */}
          {stockErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Stock Issues:</h4>
            <ul className="list-disc pl-5">
              {stockErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              Please adjust your cart before continuing.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
            <form className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </form>
          </div>

          {/* Your Order Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Order</h3>
            <div className="border rounded-lg p-4 space-y-4">
            {cartItems.length > 0 ? (
                cartItems.map((item, index) => {
                  const itemId = item.id || item.productId;
                  const hasIssue = stockErrors.some(error => 
                    error.includes(itemId) || (item.name && error.includes(item.name))
                  );
                  
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center border-b pb-2 ${
                        hasIssue ? "bg-red-50 p-2 rounded border-red-200" : ""
                      }`}
                    >
                      <div className={`${hasIssue ? "text-red-700" : "text-gray-700"}`}>
                        {item.name} × {item.quantity}
                        {hasIssue && (
                          <span className="block text-xs text-red-600 font-medium">
                            Stock issue
                          </span>
                        )}
                      </div>
                      <div className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Your cart is empty.</p>
              )}

              <div className="flex justify-between items-center font-semibold pt-4 border-t">
                <span>Subtotal:</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>

              {/* Payment Method */}
              <div className="pt-6">
                <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="mr-2"
                      />
                    <label htmlFor="cash" className="text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paystack"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={() => setPaymentMethod("paystack")}
                      className="mr-2"
                    />
                    <label htmlFor="paystack" className="text-gray-700">
                      Pay with Paystack
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <button
                onClick={handlePlaceOrder}
                className={`w-full mt-6 py-2 rounded-lg transition cursor-pointer ${
                  isSubmitting || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
