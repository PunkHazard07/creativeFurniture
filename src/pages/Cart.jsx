import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart, increaseItemQuantity, decreaseItemQuantity, removeItemFromCart, clearCartFromBackend } from "../redux/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []); // Get cart items from Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation

   const isAuthenticated = !! localStorage.getItem('authToken'); // check if user is logged in

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0; // Ensure price is a number
    return total + price * item.quantity; // Multiply by quantity
    
  }, 0);

  //handle checkout button click
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout"); // Navigate to checkout page
    } else {
      //set a flag in the local storage to indicate we need to redirect to checkout after login
      localStorage.setItem("redirectToCheckout", "true");
      // Navigate to login page
      navigate("/login"); // Navigate to login page
    }
  }

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Shopping Cart</h2>
          {/* Clear Cart Button */}
          {cartItems.length > 0 && (
            <button 
          onClick={() => {
              if (isAuthenticated) {
                dispatch(clearCartFromBackend());
              } else {
                dispatch(clearCart());
              }
          }} 
              className="flex items-center space-x-2 text-red-500 hover:text-red-700 bg-gray-100 px-3 py-2 rounded-lg transition"
            >
              <FaTrashAlt size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Check if cart is empty */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id ||index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500"> ₦{(Number(item.price) || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Decrease Quantity Button */}
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        dispatch(decreaseItemQuantity(item.productID || item.id));
                      } else{
                        dispatch(decreaseQuantity(item.id));
                      }
                    }}
                    className="px-3 py-1 bg-gray-200 rounded-lg"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  
                  <span className="px-4">{item.quantity}</span>

                  {/* Increase Quantity Button */}
                  <button onClick={() => {
                      if (isAuthenticated) {
                        console.log('increasing quantity for item', item);
                        dispatch(increaseItemQuantity(item.productID || item.id));
                      } else {
                        dispatch(increaseQuantity(item.id));
                      }
                  }} className="px-3 py-1 bg-gray-200 rounded-lg">
                    +
                  </button>

                  {/* Remove Item Button */}
                  <button onClick={() => {
                    if (isAuthenticated) {
                      console.log(item);
                      dispatch(removeItemFromCart(item.productID));
                    } else {
                      dispatch(removeFromCart(item.id));
                    }
                  }} className="text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="mt-6 p-4 border-t">
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <button 
            onClick={handleCheckout}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
