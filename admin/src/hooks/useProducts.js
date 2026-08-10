import { useState, useEffect } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        console.error("Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const saveChanges = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/update/${updatedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? data.product : p))
        );
        setEditingProduct(null);
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 0;

    setEditingProduct((prev) => {
      if (!prev) return null;
      if (newQuantity === 0) {
        return { ...prev, quantity: newQuantity, isOutOfStock: true };
      } else if (newQuantity > 0 && prev.isOutOfStock) {
        return { ...prev, quantity: newQuantity, isOutOfStock: false };
      }
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleOutOfStockChange = (e) => {
    const isChecked = e.target.checked;

    setEditingProduct((prev) => {
      if (!prev) return null;
      if (isChecked) {
        return { ...prev, isOutOfStock: true, quantity: 0 };
      }
      return {
        ...prev,
        isOutOfStock: false,
        quantity: prev.quantity === 0 ? 1 : prev.quantity,
      };
    });
  };

  return {
    products,
    editingProduct,
    setEditingProduct,
    removeProduct,
    saveChanges,
    handleQuantityChange,
    handleOutOfStockChange,
  };
};