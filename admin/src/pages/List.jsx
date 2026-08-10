import React from "react";
import ProductCard from "../components/Products/ProductCard";
import EditProductModal from "../components/Products/EditProductModal";
import { useProducts } from "../hooks/useProducts";

const List = () => {
  const {
    products,
    editingProduct,
    setEditingProduct,
    removeProduct,
    saveChanges,
    handleQuantityChange,
    handleOutOfStockChange,
  } = useProducts();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={setEditingProduct}
            onRemove={removeProduct}
          />
        ))}
      </div>

      <EditProductModal
        product={editingProduct}
        setProduct={setEditingProduct}
        onSave={saveChanges}
        onCancel={() => setEditingProduct(null)}
        onQuantityChange={handleQuantityChange}
        onOutOfStockChange={handleOutOfStockChange}
      />
    </div>
  );
};

export default List;