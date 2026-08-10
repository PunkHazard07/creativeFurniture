import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import OrderConfirmation from '../pages/OrderConfirmation';

const mockOrder = {
    _id: 'order123',
    amount: 50000,
    status: 'Pending',
    items: [{ productId: 'prod1', name: 'Oak Dining Chair', price: 25000, quantity: 2 }],
    shippingDetails: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '08000000000',
        address: '1 Analytical Engine Way',
    },
};

describe('OrderConfirmation page', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders an error state without crashing when no order data is available', async () => {
    renderWithProviders(<OrderConfirmation />, {
        route: '/order-confirmation',
    });

    expect(
        await screen.findByRole('heading', { name: /order not found/i })
    ).toBeInTheDocument();
  });

  it('renders the order summary without crashing when order data is passed via navigation state', async () => {
    renderWithProviders(<OrderConfirmation />, {
        route: { pathname: '/order-confirmation', state: { orderData: mockOrder } },
    });

    expect(
        await screen.findByRole('heading', { name: /thank you for your order/i })
    ).toBeInTheDocument();
    expect(screen.getByText(mockOrder.items[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.shippingDetails.email)).toBeInTheDocument();
  });
});