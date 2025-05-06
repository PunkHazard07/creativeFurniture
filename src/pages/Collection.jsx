import { useState, useEffect } from "react";
import ProductItem from "../components/ProductItem";



const CollectionPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
        
            setLoading(true);
            setError(null);

            let url= "http://localhost:8080/api/products";

            if (category === 'indoor') {
                url = 'http://localhost:8080/api/products/indoor-category';
            } else if (category === 'outdoor') {
                url = 'http://localhost:8080/api/products/outdoor-category';
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    setProducts(data.products || data.indoorProducts || data.outdoorProducts);
                } else {
                    setError(data.message || "Failed to fetch products");
                }
            } catch (error) {
                setError(error.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    //sorting logic
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "low-to-high") {
            return a.price - b.price;
        } else if (sortBy === "high-to-low") {
            return b.price - a.price;
        } else {
            return 0;
        }
    })

    return (
        <div className="flex min-h-screen p-6 bg-gray-100">
            {/* Sidebar */}
            <aside className="w-1/4 bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Filter</h2>
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                >
                    <option value="all">All Products</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                </select>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Collections</h1>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="default">Sort by: Default</option>
                        <option value="low-to-high">Sort by: Low to High</option>
                        <option value="high-to-low">Sort by: High to Low</option>
                    </select>
                </div>

                 {/* Loading State */}
                {loading && <p className="text-center text-gray-500">Loading products...</p>}

                 {/* Error State */}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductItem
                            key={product._id} // Ensure correct key
                            id={product._id}
                            image={product.images ? [product.images] : []}  // Handle missing images
                            name={product.name}
                            price={product.price}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CollectionPage;
