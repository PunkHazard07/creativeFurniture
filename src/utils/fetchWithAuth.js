import { handleSessionExpired } from "./sessionExpired";

const BASE_URL = import.meta.env.VITE_BASE_URL;

let refreshPromise = null;

const refreshAccessToken = () => {
    if(!refreshPromise) {
        refreshPromise = fetch(`${BASE_URL}/refresh-token`, {
            method: 'POST',
            credentials: 'include'
        })
            .then((res) => res.ok)
            .catch((error) => {
                console.error('Error refreshing access token:', error);
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

export const fetchWithAuth = async (endpoint, options = {}, _isRetry = false) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include'
    });

    if (response.status !== 401 || _isRetry || endpoint === '/refresh-token') {
        return response;
    }

    const refreshed = await refreshAccessToken();

    if(!refreshed) {
        handleSessionExpired();
        return response;
    }

    return fetchWithAuth(endpoint, options, true);
};