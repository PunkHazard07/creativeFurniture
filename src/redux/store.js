import { configureStore } from "@reduxjs/toolkit";  
import authReducer from "./authSlice";
import  cartReducer from "./cartSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,  // add cart slice here
    },
});

export default store;