import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { handleSessionExpired } from '../utils/sessionExpired';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Refresh a bit before that so it never actually expires during normal use.
const REFRESH_INTERVAL_MS = 13 * 60 * 1000;

export const useTokenRefresh = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const intervalRef = useRef(null);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    handleSessionExpired();
                } else {
                    console.error('Background token refresh failed:', response.status);
                }
            }
        } catch (error) {
            // A transient network blip here isn't fatal fetchWithAuth's reactive
            // retry is still there as a fallback the next time a real request 401s.
            console.error('Error during background token refresh:', error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        intervalRef.current = setInterval(refreshAccessToken, REFRESH_INTERVAL_MS);

        // Same pattern as useOrders: don't bother refreshing a tab nobody's
        // looking at, but catch up immediately when it becomes visible again
        // in case it was backgrounded past the refresh window.
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(intervalRef.current);
            } else {
                refreshAccessToken();
                intervalRef.current = setInterval(refreshAccessToken, REFRESH_INTERVAL_MS);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated, refreshAccessToken]);
}