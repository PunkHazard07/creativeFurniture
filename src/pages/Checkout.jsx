import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartFromBackend } from "../redux/cartSlice";
import BillingForm from "../components/Checkout/BillingForm";
import OrderSummary from "../components/Checkout/OrderSummary";
import StockErrorsAlert from "../components/Checkout/StockErrorsAlert";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stockErrors, setStockErrors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Single form object state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    address: "",
    email: "",
  });

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (stockErrors.length > 0) setStockErrors([]);
  }, [cartItems]);

  const validateForm = () => {
    const { firstName, lastName, phone, country, address, email } = formData;
    if (!firstName || !lastName || !phone || !country || !address || !email) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);
    setStockErrors([]);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to place an order.");
      setIsSubmitting(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.id || item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const endpoint =
      paymentMethod === "cash"
        ? `${import.meta.env.VITE_BASE_URL}/place`
        : `${import.meta.env.VITE_BASE_URL}/paystack/init`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: totalPrice,
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(clearCartFromBackend());

        const orderData = {
          _id: data.order?._id || data.order?.id,
          ...formData,
          amount: totalPrice,
          paymentMethod,
          status: data.order?.status || "Processing",
          items: orderItems,
          ...(data.paystackReference && { paystackReference: data.paystackReference }),
        };

        if (paymentMethod === "cash") {
          navigate("/order-success", { state: { orderData } });
        } else if (paymentMethod === "paystack") {
          localStorage.setItem("latestOrderData", JSON.stringify(orderData));
          window.location.href = data.authorization_url;
        }
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setStockErrors(data.errors);
        } else {
          setError(data.message || "Error placing order. Please try again.");
        }
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

        <StockErrorsAlert errors={stockErrors} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BillingForm formData={formData} onChange={handleFormChange} />

          <OrderSummary
            cartItems={cartItems}
            totalPrice={totalPrice}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            stockErrors={stockErrors}
            isSubmitting={isSubmitting}
            error={error}
            clearError={() => setError(null)}
            onSubmit={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;