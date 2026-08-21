import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`/user/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                return rejectWithValue(data.message || "Session invalid");
            }

            return data.user;
        } catch (error) {
            return rejectWithValue(error.message || "Network error checking auth status");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: true
    },
    reducers: {
        // Call this after a successful POST to your /login endpoint
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload?.user || null;
            state.loading = false;
        },
        // Call this after a successful POST to your /logout endpoint
        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
            });
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;