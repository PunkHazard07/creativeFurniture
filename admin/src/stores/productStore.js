import { create } from 'zustand';
import { useAuthStore } from './authStore';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useProductStore = create((set) => ({
    products: [],
    editingProduct: null,

    fetchProducts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            const data = await response.json();
            set({ products: data.products })
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },

    removeProduct: async (id) => {
        const { token } = useAuthStore.getState();

        try {
            const response = await fetch(`${BASE_URL}/remove/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                set((state) => ({
                    products: state.products.filter((product) => product._id !== id),
                }));
            } else {
                console.error("Failed to remove product");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
    },

    saveChanges: async (updatedProduct) => {
        const { token } = useAuthStore.getState();

        try {
            const response = await fetch(`${BASE_URL}/update/${updatedProduct._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                const data = await response.json();
                set((state) => ({
                    products: state.products.map((p) =>
                        p._id === updatedProduct._id ? data.product : p
                    ),
                    editingProduct: null,
                }));
            } else {
                console.error("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    },

    setEditingProduct: (product) => set({ editingProduct: product }),

    handleQuantityChange: (e) => {
        const newQuantity = parseInt(e.target.value) || 0;

        set((state) => {
            const prev = state.editingProduct;
            if(!prev) return{};
            if (newQuantity === 0) {
                return { editingProduct: { ...prev, quantity: newQuantity, isOutOfStock: true } };
            } else if (newQuantity > 0 && prev.isOutOfStock) {
                return { editingProduct: { ...prev, quantity: newQuantity, isOutOfStock: false } };
            }
                return { editingProduct: { ...prev, quantity: newQuantity } };
        });
    },

    handleOutOfStockChange: (e) => {
        const isChecked = e.target.checked;

        set((state) => {
            const prev = state.editingProduct;
            if(!prev) return {};
            if (isChecked) {
                return { editingProduct: { ...prev, isOutOfStock: true, quantity: 0 } };
            }
            return {
                editingProduct: {
                    ...prev,
                    isOutOfStock: false,
                    quantity: prev.quantity === 0 ? 1 : prev.quantity
                },
            };
        });
    }
}));