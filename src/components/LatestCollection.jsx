import {useEffect, useState} from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/latest`);
        const data = await response.json();

        if (response.ok){
          setProducts(data.products);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError(error.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      };
    };

    fetchLatestProduct(); 
  }, []);

  return (
    <div className="my-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Title Section */}
      <div className="text-center py-8">
        <Link to="/collection">
          <Title text1="LATEST" text2="COLLECTIONS" />
        </Link>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mt-3">
          Explore our latest arrivals! These handpicked selections feature
          timeless designs and exquisite craftsmanship. Don't miss out on
          adding these beautiful pieces to your collection.
        </p>
      </div>

      {/* Loading & Error Handling */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-500 py-8">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 text-indigo-600 hover:text-indigo-800 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              image={product.images ? [product.images] : []} // ensure this is an array
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      )}

      {/* Show message if no products */}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products available at the moment.</p>
      )}
    </div>
  );
};

export default LatestCollection;