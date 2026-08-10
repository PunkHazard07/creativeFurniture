import React from "react";

const CATEGORIES = ["Living Room", "Bedroom", "Dining Room", "Mirror"];

const EditProductModal = ({
    product,
    setProduct,
    onSave,
    onCancel,
    onQuantityChange,
    onOutOfStockChange,
}) => {
    if (!product) return null;

return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 border">
            <h3 className="text-lg font-bold mb-4 text-center">Edit Product</h3>

        {/* Product Name */}
        <label className="text-sm font-semibold">Product Name</label>
        <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
        />

        {/* Product Price */}
        <label className="text-sm font-semibold">Price (₦)</label>
        <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full p-2 border rounded mb-2"
        />

        {/* Product Category */}
        <label className="text-sm font-semibold">Category</label>
        <select
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="w-full p-2 border rounded mb-2"
        >
        {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
                {cat}
            </option>
        ))}
        </select>

        {/* Product Description */}
        <label className="text-sm font-semibold">Description</label>
        <textarea
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            rows="3"
        />

        {/* Product Quantity */}
        <label className="text-sm font-semibold">Quantity in Stock</label>
        <input
            type="number"
            min="0"
            value={product.quantity}
            onChange={onQuantityChange}
            className="w-full p-2 border rounded mb-2"
            disabled={product.isOutOfStock}
        />

        {/* Out of Stock Checkbox */}
        <div className="flex items-center mt-2 mb-4">
        <input
            type="checkbox"
            id="editOutOfStock"
            checked={product.isOutOfStock}
            onChange={onOutOfStockChange}
            className="mr-2"
        />
        <label htmlFor="editOutOfStock" className="text-sm font-semibold">
            Mark as Out of Stock
        </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
        <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            onClick={onCancel}
        >
            Cancel
        </button>
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => onSave(product)}
        >
            Save
        </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;