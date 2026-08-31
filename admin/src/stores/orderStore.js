import { create } from 'zustand';
import { fetchWithAuth } from '../utils/api';

let notificationTimeoutId = null;

export const useOrderStore = create((set, get) => ({
    orders: [],
    loading: true,
    error: null,
    updateMessage: null,
    filterStatus: "All",
    showArchived: false,

    //helper to show temporary UI feedback messages. 
    _showNotification: (type, text, duration = 3000) => {
        if (notificationTimeoutId) {
            clearTimeout(notificationTimeoutId);
            notificationTimeoutId = null;
        }

        set({ updateMessage: { type, text } });

        if (duration > 0) {
            notificationTimeoutId = setTimeout(() => {
                set({ updateMessage: null });
                notificationTimeoutId = null;
            }, duration);
        }
    },

    fetchOrders: async () => {
        const { showArchived } = get();

        set({ loading: true, error: null });

        try {
            const data = await fetchWithAuth(`/list-orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!data) return; 

            if (!data.ok) throw new Error("Failed to fetch orders");
            if (!data.success) throw new Error(data.message || "Error fetching orders");

            const filtered = showArchived
                ? data.order
                : data.order.filter((order) => !order.isArchived);

            set({ orders: filtered, loading: false });
        } catch (err) {
            console.error("Error fetching orders:", err);
            set({ error: err.message, loading: false });
        }
    },

    updateStatus: async (orderId, newStatus) => {
        get()._showNotification("loading", "Updating status...", 0);

        try {
            const data = await fetchWithAuth(`/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!data) return;

            if (!data.ok) throw new Error("Failed to update status");
            if (!data.success) throw new Error(data.message || "Error updating status");

            set((state) => ({
                orders: state.orders.map((order) =>
                    order._id === orderId ? data.updatedOrder : order
                ),
            }));
            get()._showNotification("success", "Status updated successfully!", 3000);
        } catch (err) {
            console.error("Error updating order status:", err);
            get()._showNotification("error", `Error: ${err.message}`, 5000);
        }
    },

    deleteOrder: async (orderId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this order? This action cannot be undone."
            )
        ) {
            return;
        }

        get()._showNotification("loading", "Deleting order...", 0);

        try {
            const data = await fetchWithAuth(`/delete-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            if (!data) return;

            if (!data.ok || !data.success) {
                throw new Error(data.message || "Failed to delete order");
            }

            set((state) => ({
                orders: state.orders.filter((order) => order._id !== orderId),
            }));
            get()._showNotification("success", "Order deleted successfully!", 3000);
        } catch (err) {
            console.error("Error deleting order:", err);
            get()._showNotification("error", `Error: ${err.message}`, 5000);
        }
    },

    archiveOrder: async (orderId) => {
        const { showArchived } = get();
        get()._showNotification("loading", "Archiving order...", 0);

        try {
            const data = await fetchWithAuth(`/archive-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            if (!data) return;

            if (!data.ok) throw new Error("Failed to archive order");
            if (!data.success) throw new Error(data.message || "Error archiving order");

            set((state) => ({
                orders: showArchived
                    ? state.orders.map((order) =>
                        order._id === orderId ? { ...order, isArchived: true } : order
                    )
                    : state.orders.filter((order) => order._id !== orderId),
            }));
            get()._showNotification("success", "Order archived successfully!", 3000);
        } catch (err) {
            console.error("Error archiving order:", err);
            get()._showNotification("error", `Error: ${err.message}`, 5000);
        }
    },

    setFilterStatus: (status) => set({ filterStatus: status }),
    setShowArchived: (value) => {
        set({ showArchived: value });
        get().fetchOrders();
    },
}));


export const selectFilteredOrders = (state) =>
state.filterStatus === "All"
    ? state.orders
    : state.orders.filter((order) => order.status === state.filterStatus);

//helper function to help display 
export const getUserDisplayName = (order) => {
    if (order.userId && typeof order.userId === "object") {
        return order.userId.username || "Anonymous User";
    }
return "User #" + (order.userId?.substring(0, 6) || "Unknown");
};