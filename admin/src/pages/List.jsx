import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products"); // Adjust endpoint accordingly
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage

      const response = await fetch(
        `http://localhost:8080/api/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
    } else {
        console.error("Failed to remove product");
    }
    } catch (error) {
    console.error("Error removing product:", error);
    }
};

const saveChanges = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage

    const response = await fetch(`http://localhost:8080/api/update/${updatedProduct._id}`, {
        method:'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
    });

    if(response.ok){
        const data = await response.json();
        setProducts(products.map((p)=> (p._id === updatedProduct._id ? data.product : p)));
        setEditingProduct(null);
    } else{
        console.error('Failed to update product');
    }
    } catch (error) {
    console.error('Error updating product:', error);
    }
};

return (
    <div className="container mx-auto p-6">
    <h2 className="text-2xl font-semibold mb-4">Product List</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
        <div key={product._id} className="p-4 shadow-md rounded-xl border bg-white">
            
            <div className="relative w-full pb-2/3 h-48">
            <img
                src={product.images || "https://via.placeholder.com/150"}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain rounded-lg"
            />
            </div>
            <div className="p-4">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-lg font-semibold mt-2">₦{product.price}</p>
            
        <div className="flex flex-wrap gap-3 mt-4">
                <button
                className="flex-1 min-w-24 px-3 py-2 bg-gray-200 rounded-lg flex items-center justify-center gap-2"
                onClick={() => setEditingProduct(product)}
                >
            <FaEdit size={16} /> Edit
                </button>
                <button
                className="flex-1 min-w-24 px-3 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
                onClick={() => removeProduct(product._id)}
                >
                <FaTrash size={16} /> Remove
                </button>
            </div>
            </div>
        </div>
        ))}
    </div>

      {/* Edit Product Modal */}
    {editingProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 border">
            <h3 className="text-lg font-bold mb-4 text-center">Edit Product</h3>
            
            {/* Product Name */}
            <label className="text-sm font-semibold">Product Name</label>
            <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            />
            
            {/* Product Price */}
            <label className="text-sm font-semibold">Price (₦)</label>
            <input
            type="number"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            />

            {/* Product Category - Dropdown */}
            <label className="text-sm font-semibold">Category</label>
            <select
            value={editingProduct.category}
            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            >
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
            <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setEditingProduct(null)}
            >
                Cancel
            </button>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => saveChanges(editingProduct)}
            >
                Save
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
};

export default List;