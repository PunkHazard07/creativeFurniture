import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart, 
  increaseItemQuantity, 
  decreaseItemQuantity, 
  removeItemFromCart, 
  clearCartFromBackend 
} from "../redux/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('authToken');

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

  // Handle checkout button click
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      localStorage.setItem("redirectToCheckout", "true");
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6">
      <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl md:text-2xl font-semibold">Shopping Cart</h2>
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
              className="flex items-center space-x-1 sm:space-x-2 text-red-500 hover:text-red-700 bg-gray-100 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition text-sm sm:text-base"
            >
              <FaTrashAlt size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Check if cart is empty */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <p className="text-center text-gray-500">Your cart is empty.</p>
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" 
                  />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                    <p className="text-gray-500 text-sm sm:text-base"> ₦{(Number(item.price) || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          dispatch(decreaseItemQuantity(item.productID || item.id));
                        } else {
                          dispatch(decreaseQuantity(item.id));
                        }
                      }}
                      className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    
                    <span className="px-3 sm:px-4 py-1 text-center min-w-8">{item.quantity}</span>

                    <button 
                      onClick={() => {
                        if (isAuthenticated) {
                          dispatch(increaseItemQuantity(item.productID || item.id));
                        } else {
                          dispatch(increaseQuantity(item.id));
                        }
                      }} 
                      className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Item Button */}
                  <button 
                    onClick={() => {
                      if (isAuthenticated) {
                        dispatch(removeItemFromCart(item.productID));
                      } else {
                        dispatch(removeFromCart(item.id));
                      }
                    }} 
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Remove item"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="mt-6 p-4 border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-base sm:text-lg">Total:</span>
              <span className="font-bold text-lg sm:text-xl">₦{totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => navigate("/")}
                className="sm:flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-center"
              >
                Continue Shopping
              </button>
              
              <button 
                onClick={handleCheckout}
                className="sm:flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
