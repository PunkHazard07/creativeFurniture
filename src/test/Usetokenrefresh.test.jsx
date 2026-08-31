import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from '../redux/authSlice';
import { useTokenRefresh } from '../hooks/useTokenRefresh';

const okResponse = { ok: true, json: () => Promise.resolve({ success: true }) };

const renderWithAuthState = (isAuthenticated) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: { isAuthenticated, user: null, loading: false } },
    });

    return renderHook(() => useTokenRefresh(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
};

describe('useTokenRefresh', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        global.fetch = vi.fn().mockResolvedValue(okResponse);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('does not call refresh-token at all when the user is not authenticated', () => {
        renderWithAuthState(false);
        vi.advanceTimersByTime(20 * 60 * 1000);

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('calls refresh-token once per 13-minute interval while authenticated', async () => {
        renderWithAuthState(true);

        await vi.advanceTimersByTimeAsync(13 * 60 * 1000);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/refresh-token'),
            expect.objectContaining({ method: 'POST', credentials: 'include' })
        );

        await vi.advanceTimersByTimeAsync(13 * 60 * 1000);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('clears the timer on unmount so it does not keep firing after logout', async () => {
        const { unmount } = renderWithAuthState(true);

        unmount();
        await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

        expect(global.fetch).not.toHaveBeenCalled();
    });
});