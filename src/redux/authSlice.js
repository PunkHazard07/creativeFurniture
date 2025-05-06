import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: !!localStorage.getItem('authToken') //check token existence
    },
    reducers: {
        login: (state, action) => {
            const token = action.payload.token;
            if (token) {
                state.isAuthenticated = true;
                localStorage.setItem('authToken', token); //save token in local storage
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem('authToken'); // Remove token on logout
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;