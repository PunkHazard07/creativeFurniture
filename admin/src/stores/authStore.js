import { create } from 'zustand';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const readStoredToken = () => localStorage.getItem("token");

let refreshPromise = null

export const useAuthStore = create((set, get) => ({
    token: readStoredToken(),
    isValidToken: false,
    isCheckingToken: true,
    isLoggingIn: false,
    loginError: null,

    //confirm the stored token is still valid in the backend
    checkToken: async () => {
        const token = readStoredToken();

        if (!token) {
            set({ token: null, isValidToken: false, isCheckingToken: false });
        return;
        }

        set({ isCheckingToken: true });

        try {
            const response = await fetch(`${BASE_URL}/verify-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                set({ token, isValidToken: true, isCheckingToken: false });
                return;
            }

            await get().refreshAccessToken();
            set({ isCheckingToken: false });

        } catch (error) {
            console.error("Error verifying token:", error);
            set({ isValidToken: false, isCheckingToken: false });
        }
    },

    login: async (email, password) => {
        set({ isLoggingIn: true, loginError: null });

        try {
            const response = await fetch(`${BASE_URL}/login-admin`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem('token', data.accessToken);
            set({ token: data.accessToken, isValidToken: true, isLoggingIn: false });
            return { success: true };
        } catch (error) {
            const message = error.message || "Login failed";
            set({ isLoggingIn: false, loginError: message });
            return { success: false, message };
        }
    },

    logout: async () => {
        const token = get().token;

        try {
            await fetch(`${BASE_URL}/logout-admin`, {
                method: "POST",
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            set({ token: null, isValidToken: false });
        }
    },

refreshAccessToken: async () => {
        // If a refresh is already in flight, piggyback on it instead of
        // firing a second /refresh-token request.
        if (refreshPromise) {
            return refreshPromise;
        }

        refreshPromise = (async () => {
            try {
                const response = await fetch(`${BASE_URL}/refresh-token`, {
                    method: "POST",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok || !data.accessToken) {
                    get().logout();
                    return null;
                }

                localStorage.setItem("token", data.accessToken);
                set({ token: data.accessToken, isValidToken: true });
                return data.accessToken;
            } catch (error) {
                console.error("Refresh token error:", error);
                get().logout();
                return null;
            } finally {
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    },
}));