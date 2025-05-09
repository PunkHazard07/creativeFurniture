import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, addItemToCart } from "../redux/cartSlice";

const Product = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleAddToCart = async () => {
    if (!product) return; // Return if product is not available

    const token = localStorage.getItem('authToken'); // check if user is logged in

    const cartItem ={
      id: product._id,  // for redux/UI
      name: product.name,
      price: product.price,
      image: product.images[0] || product.images,
      productID: product._id, // for backend
      quantity: 1,
    };

    console.log ('cartItem', cartItem);
    if (token && token !== 'undefined' && token !== 'null') {
      dispatch(addItemToCart({productID: product._id, quantity: 1})).unwrap()
      console.log('Dispatched addItemToCart to backend');
    }else{
      dispatch(addToCart(cartItem)); // Add to Redux cart state
      console.log('Dispatched addToCart to local storage');
    }
  }

  if (loading) return <p className="text-center text-gray-500">Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-8 z-10">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row transition hover:shadow-2xl">
        {/* Left: Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
            <div className="w-full h-full max-h-[500px] rounded-xl overflow-hidden">
                <img
                  src={product.images || "default-image.jpg"}
                  alt={product?.name || "Product Image"}
                  className="w-full h-full object-contain"
                />
            </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900">{product?.name || "Product Name"}</h1>

          <p className="text-2xl text-indigo-600 font-semibold mt-3">
            ₦{product?.price?.toLocaleString() || "0.00"}
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">{product?.description || "No description available."}</p>

          {/* Add to Cart Button */}
          <button onClick={handleAddToCart} className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;