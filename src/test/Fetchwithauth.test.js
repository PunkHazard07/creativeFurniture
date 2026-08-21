import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const okResponse = (body = {}) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
});

const unauthorizedResponse = () => ({
    ok: false,
    status: 401,
    json: () => Promise.resolve({ success: false, message: 'Access denied. No token provided' }),
});

describe('fetchWithAuth', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('passes a successful request straight through with no retry', async () => {
        global.fetch.mockResolvedValueOnce(okResponse({ success: true }));

        const response = await fetchWithAuth('/cart/items');

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
    });

    it('always sends credentials: include, even if not passed in', async () => {
        global.fetch.mockResolvedValueOnce(okResponse());

        await fetchWithAuth('/cart/items');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/cart/items'),
            expect.objectContaining({ credentials: 'include' })
        );
    });

    it('on 401: refreshes the token then retries the original request once', async () => {
        global.fetch
            .mockResolvedValueOnce(unauthorizedResponse()) // original request
            .mockResolvedValueOnce(okResponse({ success: true })) // /refresh-token
            .mockResolvedValueOnce(okResponse({ success: true, data: { items: [] } })); // retry

        const response = await fetchWithAuth('/cart/remove', { method: 'POST' });

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('/refresh-token'),
            expect.objectContaining({ method: 'POST', credentials: 'include' })
        );
        expect(response.status).toBe(200);
    });

    it('when refresh itself fails, returns the original 401 without retrying', async () => {
        global.fetch
            .mockResolvedValueOnce(unauthorizedResponse()) // original request
            .mockResolvedValueOnce({ ok: false, status: 403 }); // /refresh-token fails

        const response = await fetchWithAuth('/cart/remove', { method: 'POST' });

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(response.status).toBe(401);
    });

    it('does not retry forever if the retried request also comes back 401', async () => {
        global.fetch
            .mockResolvedValueOnce(unauthorizedResponse()) // original request
            .mockResolvedValueOnce(okResponse({ success: true })) // /refresh-token succeeds
            .mockResolvedValueOnce(unauthorizedResponse()); // retry still 401

        const response = await fetchWithAuth('/cart/remove', { method: 'POST' });

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(response.status).toBe(401);
    });

    it('dedupes simultaneous 401s into a single refresh call', async () => {
        global.fetch
            .mockResolvedValueOnce(unauthorizedResponse()) // request A
            .mockResolvedValueOnce(unauthorizedResponse()) // request B
            .mockResolvedValueOnce(okResponse({ success: true })) // the one /refresh-token call
            .mockResolvedValueOnce(okResponse({ success: true })) // retry A
            .mockResolvedValueOnce(okResponse({ success: true })); // retry B

        const [responseA, responseB] = await Promise.all([
            fetchWithAuth('/cart/remove', { method: 'POST' }),
            fetchWithAuth('/user-orders'),
        ]);

        const refreshCalls = global.fetch.mock.calls.filter(([url]) =>
            url.includes('/refresh-token')
        );

        expect(refreshCalls).toHaveLength(1);
        expect(responseA.status).toBe(200);
        expect(responseB.status).toBe(200);
    });
});