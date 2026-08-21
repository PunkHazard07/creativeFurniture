import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Cart from '../pages/Cart';

const mockCartItem = {
    id: 'prod1',
    productID: 'prod1',
    name: 'Oak Dining Chair',
    price: 25000,
    image: '/chair.jpg',
    quantity: 2,
};

const jsonResponse = (body) => ({
    ok: true,
    json: () => Promise.resolve(body),
});

describe('Cart page', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

    it('renders without crashing when the cart is empty', () => {
        renderWithProviders(<Cart />, {
            preloadedState: { cart: { cartItems: [] } },
    });
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('renders without crashing when the cart has items', () => {
    renderWithProviders(<Cart />, {
        preloadedState: { cart: { cartItems: [mockCartItem] } },
    });
    expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
    expect(screen.getByText(/proceed to checkout/i)).toBeInTheDocument();
  });

  describe('Remove item button', () => {
    it('authenticated: calls the backend remove endpoint and updates the store', async () => {
      global.fetch.mockResolvedValueOnce(
        jsonResponse({ success: true, data: { items: [] } })
      );

      const { store } = renderWithProviders(<Cart />, {
        preloadedState: {
          cart: { cartItems: [mockCartItem] },
          auth: { isAuthenticated: true },
        },
      });

      fireEvent.click(screen.getByLabelText(/remove item/i));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/remove'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ productId: mockCartItem.productID }),
        })
      );

      await waitFor(() => {
        expect(store.getState().cart.cartItems).toEqual([]);
      });
    });

    it('unauthenticated: updates the store locally without calling fetch', () => {
      const { store } = renderWithProviders(<Cart />, {
        preloadedState: {
          cart: { cartItems: [mockCartItem] },
          auth: { isAuthenticated: false },
        },
      });

      fireEvent.click(screen.getByLabelText(/remove item/i));

      expect(global.fetch).not.toHaveBeenCalled();
      expect(store.getState().cart.cartItems).toEqual([]);
    });
  });

  describe('Clear cart button', () => {
    it('authenticated: calls the backend clear endpoint and updates the store', async () => {
      global.fetch.mockResolvedValueOnce(
        jsonResponse({ success: true, data: { items: [] } })
      );

      const { store } = renderWithProviders(<Cart />, {
        preloadedState: {
          cart: { cartItems: [mockCartItem] },
          auth: { isAuthenticated: true },
        },
      });

      fireEvent.click(screen.getByText(/clear cart/i));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/clear'),
        expect.objectContaining({
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await waitFor(() => {
        expect(store.getState().cart.cartItems).toEqual([]);
      });
    });

    it('unauthenticated: clears the store locally without calling fetch', () => {
      const { store } = renderWithProviders(<Cart />, {
        preloadedState: {
          cart: { cartItems: [mockCartItem] },
          auth: { isAuthenticated: false },
        },
      });

      fireEvent.click(screen.getByText(/clear cart/i));

      expect(global.fetch).not.toHaveBeenCalled();
      expect(store.getState().cart.cartItems).toEqual([]);
    });
  });
});