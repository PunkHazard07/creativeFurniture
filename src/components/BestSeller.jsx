import {useEffect, useState} from 'react'
import Title from './Title'
import ProductItem from './ProductItem'


const BestSeller = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/bestselling');
                const data = await response.json();

                if (response.ok) {
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

        fetchBestSellers();
    }, [])

return (
    <div className='my-10'>
        {/* Title Section  */}
        <div className='text-center  py-8'>
        <Title text1='BEST' text2='SELLER' />
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Discover our best-selling products loved by our customers! These handpicked items are must-haves for your collection.
        </p>
        </div>

        {/* Loading State */}
    {loading && <p className="text-center text-gray-500">Loading bestsellers...</p>}
    
      {/* Error State */}
    {error && <p className="text-center text-red-500">{error}</p>}

        {/* Product grid  */}

    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4'>
        {products.map((product) => (
            <ProductItem
                key={product._id}
                id={product._id}
                image={product.images ? [product.images] : []}
                name={product.name}
                price={product.price}
            />
        ))}
    </div>

    </div>
)
}

export default BestSeller