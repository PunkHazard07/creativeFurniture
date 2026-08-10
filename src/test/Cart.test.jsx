import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
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
});