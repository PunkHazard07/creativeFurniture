import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, addItemToCart } from "../redux/cartSlice";

const ProductItem = ({ id, image, name, price, quantity = 0, isOutOfStock = false }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product detail page
    e.stopPropagation(); // Stop event bubbling
    
    // Don't proceed if product is out of stock
    if (isOutOfStock || quantity === 0) {
      return;
    }

    const token = localStorage.getItem('authToken'); // Check if user is logged in

    const cartItem = {
      id: id,  // for redux/UI
      name: name,
      price: price,
      image: image && image.length > 0 ? image[0] : null,
      productID: id, // for backend
      quantity: 1,
    };

    if (token && token !== 'undefined' && token !== 'null') {
      dispatch(addItemToCart({productID: id, quantity: 1})).unwrap()
        .then(() => {
          // Show a small toast notification or feedback
          showAddedToCartFeedback();
        })
        .catch(err => console.error('Error adding to cart:', err));
    } else {
      dispatch(addToCart(cartItem)); // Add to Redux cart state for unauthenticated users
      showAddedToCartFeedback();
    }
  };

  // Simple feedback function - you can enhance this later
  const showAddedToCartFeedback = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
    notification.textContent = `${name} added to cart!`;
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };

  // Check if product is out of stock
  const productUnavailable = isOutOfStock || quantity === 0;

  return (
    <div className="group relative">
      <Link to={`/product/${id}`} className="block">
        <div className="overflow-hidden aspect-square bg-gray-100 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300 ease-in-out relative">
          {image && image.length > 0 ? (
            <>
              <img 
                src={image[0]} 
                alt={name || "Product Image"}
                className={`w-full h-full object-cover object-center ${productUnavailable ? 'opacity-60' : ''}`}
              />
              {productUnavailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500 text-white font-bold py-1 px-3 rounded-md transform rotate-45 shadow-lg">
                    OUT OF STOCK
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">Image Not Available</p>
            </div>
          )}
        </div>

        <div className="mt-3 group-hover:transform group-hover:translate-y-1 transition-transform duration-300">
          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-800 transition-colors duration-300">{name || "Unnamed Product"}</p>
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-black group-hover:text-indigo-800 transition-colors duration-300">₦{price?.toLocaleString() || "0.00"}</p>
            {!productUnavailable && (
              <p className="text-xs text-green-600">{quantity} in stock</p>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Appears on hover but positioned above the product details */}
      <button 
        onClick={handleAddToCart}
        disabled={productUnavailable}
        className={`absolute bottom-16 left-0 right-0 text-white text-sm py-2 px-3 rounded-md font-medium
                  transition-all duration-300 mx-2 flex items-center justify-center
                  ${productUnavailable 
                    ? 'bg-gray-400 cursor-not-allowed opacity-70 group-hover:opacity-70' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 hover:from-purple-600 hover:to-indigo-700 transform hover:scale-[1.02]'
                  }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {productUnavailable ? 'Out of Stock' : 'Add to Cart'}
      </button>
      
      {/* Add a style for the notification animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 2.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProductItem;