import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductItem from '../components/ProductItem'; // Using your existing ProductItem component

const CategoryProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        // Use the encoded category parameter from the URL
        const response = await fetch(`http://localhost:8080/api/categories/${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products for category: ${category}`);
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProductsByCategory();
    }
  }, [category]);

  // Calculate banner gradient based on category name for visual differentiation
  const getBannerGradient = () => {
    switch(category) {
      case 'Living Room':
        return 'from-blue-500 to-indigo-600';
      case 'Bedroom':
        return 'from-purple-500 to-pink-500';
      case 'Dining Room':
        return 'from-amber-500 to-red-500';
      case 'Mirror':
        return 'from-teal-400 to-emerald-500';
      default:
        return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="pb-16">
      {/* Category Banner */}
      <div className={`bg-gradient-to-r ${getBannerGradient()} py-12 mb-8 rounded-lg shadow-md`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            {category || 'Category Products'}
          </h1>
          <p className="text-white text-opacity-90 text-center mt-2">
            Browse our selection of quality {category.toLowerCase()} furniture
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : (
          <>
            {/* Products count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            
            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductItem
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.images}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;