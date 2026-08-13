import { useEffect } from "react";
import ProductCard from "../components/Products/ProductCard";
import EditProductModal from "../components/Products/EditProductModal";
import { useProductStore } from "../stores/productStore";

const ListProduct = () => {
  const products = useProductStore((s) => s.products);
  const editingProduct = useProductStore((s) => s.editingProduct);
  const setEditingProduct = useProductStore((s) => s.setEditingProduct);
  const removeProduct = useProductStore((s) => s.removeProduct);
  const saveChanges = useProductStore((s) => s.saveChanges);
  const handleQuantityChange = useProductStore((s) => s.handleQuantityChange);
  const handleOutOfStockChange = useProductStore((s) => s.handleOutOfStockChange);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

export default ListProduct