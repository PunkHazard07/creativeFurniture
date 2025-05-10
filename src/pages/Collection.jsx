import { useState, useEffect } from "react";
import ProductItem from "../components/ProductItem";

const CollectionPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`);
                const data = await response.json();

                if (response.ok) {
                    const fetchedProducts = data.products || [];
                    setAllProducts(fetchedProducts);
                    setProducts(fetchedProducts);
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
    }, []);

    // Handle category filtering
    useEffect(() => {
        if (category === "all") {
            setProducts(allProducts);
        } else {
            const filtered = allProducts.filter(
                (product) => product.category?.toLowerCase() === category.toLowerCase()
            );
            setProducts(filtered);
        }
    }, [category, allProducts]);

    // sorting logic
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "low-to-high") {
            return a.price - b.price;
        } else if (sortBy === "high-to-low") {
            return b.price - a.price;
        } else {
            return 0;
        }
    });

    return (
        <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-6 bg-gray-100 gap-4">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Filter</h2>
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-1 border rounded-lg"
                >
                    <option value="all">All Products</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bed Frames</option>
                    <option value="Dining Room">Dinning Tables</option>
                    <option value="Mirror">Mirrors</option>
                </select>
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-3/4 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">All Collections</h1>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-1 border rounded-lg"
                    >
                        <option value="default">Sort by: Default</option>
                        <option value="low-to-high">Sort by: Low to High</option>
                        <option value="high-to-low">Sort by: High to Low</option>
                    </select>
                </div>

                {loading && <p className="text-center text-gray-500">Loading products...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductItem
                            key={product._id}
                            id={product._id}
                            image={product.images ? [product.images] : []}
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
