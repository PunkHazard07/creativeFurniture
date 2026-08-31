import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Checkout from '../pages/Checkout';

const mockCartItem = {
    id: 'prod1',
    productID: 'prod1',
    name: 'Oak Dining Chair',
    price: 25000,
    quantity: 2,
};

function mockCheckoutFetch() {
  return vi.fn((url) => {
    if (url.includes('/paystack/init')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          authorization_url: 'https://paystack.test/pay/abc',
          reference: 'ref_123',
          order: { _id: 'order_1', amount: 50000, status: 'Pending' },
        }),
      });
    }
    if (url.includes('/cart/clear')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { items: [] } }),
      });
    }
    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}

describe('Checkout page', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders without crashing when the cart has items', () => {
    renderWithProviders(<Checkout />, {
        preloadedState: { cart: { cartItems: [mockCartItem] } },
    });

    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByText(/billing details/i)).toBeInTheDocument();
    expect(screen.getByText(/your order/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  it('renders without crashing when the cart is empty', () => {
    renderWithProviders(<Checkout />, {
        preloadedState: { cart: { cartItems: [] } },
    });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeDisabled();
  });

  it('sends items and a structured shippingDetails object to /paystack/init on submit', async () => {
    const fetchMock = mockCheckoutFetch();
    global.fetch = fetchMock;

    renderWithProviders(<Checkout />, {
        preloadedState: { cart: { cartItems: [mockCartItem] } },
    });

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '08000000000' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '1 Analytical Engine Way' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ada@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/paystack/init'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    const [, requestOptions] = fetchMock.mock.calls.find(([url]) =>
      url.includes('/paystack/init')
    );
    const requestBody = JSON.parse(requestOptions.body);

    expect(requestBody).toEqual({
      items: [{ productId: mockCartItem.productID, quantity: mockCartItem.quantity }],
      shippingDetails: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '08000000000',
        email: 'ada@example.com',
        address: '1 Analytical Engine Way',
      },
    });
  });
});