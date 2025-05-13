import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, addItemToCart } from "../redux/cartSlice";

const Product = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/single/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          setError(data.message || "Failed to fetch product");
        }
      } catch (error) {
        setError(error.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); // Refetch when product ID changes

  // Check if product is out of stock
  const isProductUnavailable = product?.isOutOfStock || product?.quantity === 0;

  const handleAddToCart = async () => {
    if (!product || isProductUnavailable) return; // Return if product is not available or out of stock

    const token = localStorage.getItem('authToken'); // check if user is logged in
    const cartItem = {
      id: product._id,  // for redux/UI
      name: product.name,
      price: product.price,
      image: product.images && Array.isArray(product.images) ? product.images[0] : product.images,
      productID: product._id, // for backend
      quantity: 1,
    };

    try {
      if (token && token !== 'undefined' && token !== 'null') {
        await dispatch(addItemToCart({productID: product._id, quantity: 1})).unwrap();
        console.log('Dispatched addItemToCart to backend');
      } else {
        dispatch(addToCart(cartItem)); // Add to Redux cart state
        console.log('Dispatched addToCart to local storage');
      }
      
      // Show added to cart feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-center text-red-500 p-4 bg-red-50 rounded-lg">{error}</p></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-center text-gray-500">Product not found</p></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-8 z-10">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row transition hover:shadow-2xl relative">
        {/* Left: Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="w-full h-full max-h-[500px] rounded-xl overflow-hidden relative">
            <img
              src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.images || "default-image.jpg"}
              alt={product.name || "Product Image"}
              className={`w-full h-full object-contain ${isProductUnavailable ? 'opacity-60' : ''}`}
            />
            {isProductUnavailable && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white font-bold py-2 px-6 rounded-md transform rotate-45 shadow-lg text-lg">
                  OUT OF STOCK
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right: Product Details */}
        <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900">{product.name || "Product Name"}</h1>
          
          <div className="flex items-center mt-3">
            <p className="text-2xl text-indigo-600 font-semibold">
              ₦{product.price?.toLocaleString() || "0.00"}
            </p>
            
            {!isProductUnavailable && product.quantity > 0 && (
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {product.quantity} in stock
              </span>
            )}
            
            {isProductUnavailable && (
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mt-4 leading-relaxed">{product.description || "No description available."}</p>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart} 
            disabled={isProductUnavailable}
            className={`mt-6 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
              isProductUnavailable 
                ? 'bg-gray-400 cursor-not-allowed text-white opacity-70' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105'
            }`}
          >
            {isProductUnavailable ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          {/* Stock details */}
          {!isProductUnavailable && product.quantity <= 5 && (
            <p className="mt-3 text-amber-600 text-sm">
              Only {product.quantity} left in stock - order soon!
            </p>
          )}
        </div>
        
        {/* Added to cart notification */}
        {addedToCart && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
            {product.name} added to cart!
          </div>
        )}
      </div>
      
      {/* Animation styles */}
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

export default Product;