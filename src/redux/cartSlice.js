import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//load cart from localstorage if it exists(for unauthenticated users)
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

export const addItemToCart = createAsyncThunk(
    "cart/addItemToCart",
    async ({productID, quantity = 1}, { getState, rejectWithValue }) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            return rejectWithValue('User not authenticated');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productID, quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add item to cart');
            }
             // Check structure and return items directly
            if (data.data && data.data.items) {
                return data.data.items; // Return just the items array
            } else if (Array.isArray(data)) {
                return data;
            } else {
                console.error('Unexpected response format:', data);
                return rejectWithValue('Unexpected response format');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add item to cart');
        }
    }
)

//fetch cart from backend if user is authenticated
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
async () => {
    const token = localStorage.getItem('authToken');

    //if no token, fallback to local storage cart
    if (!token) {
        return loadCartFromLocalStorage();
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/items`, { 
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (response.ok && result.success) {
            return result.data.items; // coming from backend storage / database

        } else {
            //fallback to local storage carton backend error
            return loadCartFromLocalStorage();
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        //fallback to local storage cart on network error
        return loadCartFromLocalStorage();
    }
});

// increase item quantity on backend 
export const increaseItemQuantity = createAsyncThunk(
    'cart/increaseItemQuantity',
    async (productID, { getState, rejectWithValue}) => {
        const token = localStorage.getItem('authToken');
        

        console.log('increase item with productID:', productID);

        if (!token) {
            console.error('User not authenticated or userId not found');
            return rejectWithValue('user not authenticated or userId not found');
        }

    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/increase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productID }),
        });
        const data = await res.json();
        
        if (!res.ok) {
            console.error('Failed to increase item quantity:', data.message);
            return rejectWithValue(data.message || 'Failed to increase item quantity');
        }
        if (!data.success) {
            console.error('Failed to increase item quantity:', data.message);
            return rejectWithValue(data.message || 'Failed to increase item quantity');
        }
        if (!data.data || !data.data.items) {
            console.error('Invalid response format:', data);
            return rejectWithValue('Invalid response format');
        }
        return data.data.items || []; // return updated cart items
    } catch (error) {
            console.error('Error increasing item quantity:', error);
            return rejectWithValue(error.message || 'Failed to increase item quantity');
        }
        
    }
);

// decrease item quantity on backend
export const decreaseItemQuantity = createAsyncThunk(
    'cart/decreaseItemQuantity',
    async (productID, { rejectWithValue }) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            return rejectWithValue('User not authenticated');
        }
        
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/decrease`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productID }),
            });
            const data = await res.json();
            if(!res.ok || !data.success) {
                console.error('Failed to decrease item quantity:', data.message);
                return rejectWithValue(data.message || 'Failed to decrease item quantity');
            }
            return data.data?.items || []; // return updated cart items
        } catch (error) {
            console.error('Error decreasing item quantity:', error);
            return rejectWithValue([]); 
        }

        });

// remove item from cart on backend
export const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async (productID, {rejectWithValue}) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return rejectWithValue('User not authenticated');
        }

        try {
            const res = await fetch (`${import.meta.env.VITE_BASE_URL}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productID }),
            });

            const data = await res.json();
            console.log('remove item from cart', data);

            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to remove item from cart');
            }
            return data.data?.items || []; // return updated cart items
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return rejectWithValue(error.message || 'Failed to remove item from cart');
        }

    });

    //clear cart on backend
export const clearCartFromBackend = createAsyncThunk(
    'cart/clearCartOnBackend',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return rejectWithValue('User not authenticated');
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                return rejectWithValue(errorData.message || 'Failed to clear backend cart');
            }

            const data = await res.json();
            return data.data?.items || []; // return empty items array from backend
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
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find((item) => item.id === action .payload.id);
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

        increaseQuantity: (state, action) =>{
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
            if (!action.payload) {
                console.error("Invalidpayload:", action.payload);
                return
            }

            //if payload is already an array of items
            if (Array.isArray(action.payload)) {
                state.cartItems = action.payload.map(item => ({
                    id: item.productID || item._id, //normalize for frontend
                    name: item.name,
                    price: item.price,
                    image: item.images?.[0] || item.images || item.image, //handle image path difference
                    quantity: item.quantity,
                    productID: item.productID || item._id, // for backend
                    _id: item._id, // for backend
                }));
                return;
            }

            // If payload has an items property that is an array (nested structure)
            else if (action.payload.items && Array.isArray(action.payload.items)) {
            state.cartItems = action.payload.items.map(item => ({
            id: item.productID || item._id, // normalize for frontend
            name: item.name,
            price: item.price,
            image: item.image || item.images?.[0] || item.images,
            quantity: item.quantity,
            productID: item.productID || item._id, // for backend
        }));
    }
            
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(addItemToCart.rejected, (state, action) => {
            console.error('Failed to add item to cart:', action.payload);
        })

        builder.addCase(fetchCart.fulfilled, (state, action) => {
            
            if(!action.payload || !Array.isArray(action.payload)) {
                console.error('Invalid payload:', action.payload); 
                state.cartItems = []; // Reset cart to empty array
                return;
            };

            state.cartItems = action.payload.map(item => ({
                id: item.productID?._id || item.id || item.productID, //normalize for frontend
                name: item.productID?.name || item.name,
                price: item.productID?.price || item.price,
                image: item.productID?.images?.[0] || item.images?.[0] || item.image || '', //handle image path difference
                quantity: item.quantity,
                productID: item.productID?._id || item.productID, // for backend
            }));
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(increaseItemQuantity.fulfilled, (state, action) => {
            
            console.log('successfully increased item quantity:', action.payload);
            if(!action.payload || !Array.isArray(action.payload)) {
                console.error('Invalid payload:', action.payload);
                return;
            } ;


            state.cartItems = action.payload.map(item => ({
                id: item.productID._id || item.productID, //normalize for frontend
                name: item.productID.name || item.name,
                price: item.productID.price || item.price,
                image: item.productID.images?.[0] || item.images, //handle image path difference
                quantity: item.quantity,
                productID: item.productID._id || item.productID, // for backend
            }));
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(decreaseItemQuantity.fulfilled, (state, action) => {
            
            if(!action.payload || !Array.isArray(action.payload)) {
                console.error('Invalid payload:', action.payload);
                return;
            }

            state.cartItems = action.payload.map(item => ({
                id: item.productID._id || item.productID, //normalize for frontend
                name: item.productID.name || item.name,
                price: item.productID.price || item.price,
                image: item.productID.images?.[0] || item.images, //handle image path difference
                quantity: item.quantity,
                productID: item.productID._id || item.productID, // for backend
            }));
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });

        builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
            // Check if payload exists and is an array
        if (!action.payload) {
        console.error('Invalid payload:', action.payload);
        return;
    }
    
        // Handle both array format and object with items property format
        const items = Array.isArray(action.payload) 
        ? action.payload 
        : (action.payload.data?.items || []);
    
        if (!Array.isArray(items)) {
        console.error('Invalid items format:', items);
        return;
    }
            state.cartItems = action.payload.map(item => ({
                id: item.productID._id || item.productID, //normalize for frontend
                name: item.productID.name || item.name,
                price: item.productID.price||item.price,
                image: item.productID.images?.[0] || item.image, // handle image path difference
                quantity: item.quantity,
                productID: item.productID._id || item.productID, // for backend
            }));
            // Save cart to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        });
        
        // Handle rejected state for removeItemFromCart
        builder.addCase(removeItemFromCart.rejected, (state, action) => {
            console.error('Failed to remove item from cart:', action.payload);
        });

        builder.addCase(clearCartFromBackend.fulfilled, (state, action) => {
            state.cartItems = action.payload;
            // Clear cart from local storage
            localStorage.removeItem('cartItems');
        });

        builder.addCase(clearCartFromBackend.rejected, (state, action) => {
            console.error('Failed to clear cart:', action.payload);
        });
    }
});

//export actions
export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

//export reducer

export default cartSlice.reducer;