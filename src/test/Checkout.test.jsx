import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Checkout from '../pages/Checkout';

const mockCartItem = {
    id: 'prod1',
    productID: 'prod1',
    name: 'Oak Dining Chair',
    price: 25000,
    quantity: 2,
};

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
});