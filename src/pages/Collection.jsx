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
                const response = await fetch("http://localhost:8080/api/products");
                const data = await response.json();

                if (response.ok) {
                    const fetchedProducts = data.products || [];
                    setAllProducts(fetchedProducts);
                    setProducts(fetchedProducts); // default to all
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
                    <option value="Living Room">Living Room</option>
                    <option value="Bed Frames">Bed Frames</option>
                    <option value="Dinning Tables">Dinning Tables</option>
                    <option value="Mirrors">Mirrors</option>
                </select>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 p-6">
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
