import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//load cart from localStorage if it exist(for unauthenticated users)
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (!savedCart || savedCart === 'undefined') {
        return [];
    }

    try {
        return JSON.parse(savedCart);
    } catch (error) {
        console.error('Failed to parse cartItems from local storage:', error);
        return [];
    }
};

const normalizeCartItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items
        .filter((item) => item && item.productId)
        .map(item => ({
            id: item.productId,
            productID: item.productId,
            name: item.name,
            price: item.price,
            image: item.image || '',
            quantity: item.quantity,
        }));
};

export const addItemToCart = createAsyncThunk(
    "cart/addItemToCart",
    async ({ productID, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ productId: productID, quantity }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                return rejectWithValue(data.message || 'Failed to add item to cart');
            }

            return data.data.items;
        } catch(error) {
            return rejectWithValue(error.message || 'Failed to add item to cart');
        }
    }
);

//fetch cart from backend if user is authenticated
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/items`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok && result.success) {
                return result.data.items; //coming from the backend/Db
            } else {
                return rejectWithValue(result.message || 'Not authenticated');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            return rejectWithValue(error.message || 'Failed to fetch cart');        }
    }
);

//update item quantity
export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async ({ productID, delta }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/quantity`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ productId: productID, delta }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error('Failed to update item quantity:', data.message);
                return rejectWithValue(data.message || 'Failed to update item quantity');
            }

            return data.data.items; 
        } catch (error) {
            console.error('Error updating item quantity:', error);
            return rejectWithValue(error.message || 'Failed to update item quantity');
        }
    }
);

// remove item from cart on backend
export const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async (productID, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId: productID }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || 'Failed to remove item from cart');
            }

            return data.data.items; // return updated cart items
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return rejectWithValue(error.message || 'Failed to remove item from cart');
        }
    }
);

//clear cart on backend
export const clearCartFromBackend = createAsyncThunk(
    'cart/clearCartOnBackend',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || 'Failed to clear backend cart');
            }

            return data.data.items; // empty items array from backend
        } catch (error) {
            console.error('Error clearing backend cart:', error);
            return rejectWithValue(error.message || 'Failed to clear backend cart');
        }
    }
);

const initialState = {
    cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
            // Save updated cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
            // Save updated cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
            // Save updated cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            // Clear cart from local storage
            localStorage.removeItem('cartItems');
        }
    },

    //thunks
    extraReducers: (builder) => {

        builder.addCase(addItemToCart.fulfilled, (state, action) => {
            state.cartItems = normalizeCartItems(action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(addItemToCart.rejected, (state, action) => {
            console.error('Failed to add item to cart:', action.payload);
        });

        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.cartItems = normalizeCartItems(action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        // Guests and unverified users hit this branch — leave the local cart
        // untouched. For verified users, a rejection usually means a transient
        // network error; we also keep state intact so we don't clobber a
        // guest-shaped cart with an empty normalized array.
        builder.addCase(fetchCart.rejected, (state, action) => {
            console.error('Failed to fetch cart:', action.payload);
        });

        builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
            state.cartItems = normalizeCartItems(action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(updateItemQuantity.rejected, (state, action) => {
            console.error('Failed to update item quantity:', action.payload);
        });

        builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
            state.cartItems = normalizeCartItems(action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        // Handle rejected state for removeItemFromCart
        builder.addCase(removeItemFromCart.rejected, (state, action) => {
            console.error('Failed to remove item from cart:', action.payload);
        });

        builder.addCase(clearCartFromBackend.fulfilled, (state, action) => {
            state.cartItems = normalizeCartItems(action.payload);
            localStorage.removeItem('cartItems');
        });

        builder.addCase(clearCartFromBackend.rejected, (state, action) => {
            console.error('Failed to clear cart:', action.payload);
        });
    }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;