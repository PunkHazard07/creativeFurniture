import { useAuthStore } from "../stores/authStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWithAuth = async (url, options = {}) => {
    const { token, refreshAccessToken } = useAuthStore.getState();

    if (!options.headers) {
        options.headers = {};
    }
    options.headers["Authorization"] = `Bearer ${token}`

    let response = await fetch(`${BASE_URL}${url}`, options);

    if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
        options.headers["Authorization"] = `Bearer ${newAccessToken}`;
        response = await fetch(`${BASE_URL}${url}`, options);
    } else {
        window.location.href = "/login";
        return null;
    }
}

    try {
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Invalid server response");
    }
};

export { fetchWithAuth };