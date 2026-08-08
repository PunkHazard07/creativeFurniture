import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCartFromBackend } from "../redux/cartSlice";
import BillingForm from "../components/Checkout/BillingForm";
import CheckOrderSummary from "../components/Checkout/CheckOrderSummary";
import StockErrorsAlert from "../components/Checkout/StockErrorsAlert";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stockErrors, setStockErrors] = useState([]);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

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
    setStockErrors([]);
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

    const { firstName, lastName, phone, country, address } = formData;
    const combinedAddress = `${firstName} ${lastName}, ${address}, ${country}. Phone: ${phone}`;

    const orderItems = cartItems.map((item) => ({
      productId: item.productID || item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/paystack/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        credentials: "include",
        body: JSON.stringify({
          items: orderItems,
          address: combinedAddress,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(clearCartFromBackend());

        const orderData = {
          _id: data.order?._id,
          ...formData,
          amount: data.order?.amount ?? totalPrice,
          paymentMethod: "paystack",
          status: data.order?.status || "Pending",
          items: orderItems,
          reference: data.reference,
        };

        localStorage.setItem("latestOrderData", JSON.stringify(orderData));
        window.location.href = data.authorization_url;
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

          <CheckOrderSummary
            cartItems={cartItems}
            totalPrice={totalPrice}
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