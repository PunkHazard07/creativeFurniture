import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Order from '../pages/Order';

const mockOrder = {
  _id: 'order123',
  date: '2026-01-15T00:00:00.000Z',
  status: 'Pending',
  shippingDetails: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '08000000000',
    address: '1 Analytical Engine Way',
  },
  amount: 50000,
  items: [
    {
      productId: { name: 'Oak Dining Chair', images: ['/chair.jpg'] },
      quantity: 2,
    },
  ],
};

function mockFetchReturning(body) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });
}

describe('Order page', () => {
  it('renders the order list without crashing once orders load', async () => {
    global.fetch = mockFetchReturning({ success: true, orders: [mockOrder] });

    renderWithProviders(<Order />);

    expect(
      await screen.findByText(new RegExp(`Order #${mockOrder._id}`))
    ).toBeInTheDocument();
    expect(screen.getByText(/oak dining chair/i)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.shippingDetails.address)).toBeInTheDocument();
  });

  it('renders the empty state without crashing when there are no orders', async () => {
    global.fetch = mockFetchReturning({ success: true, orders: [] });

    renderWithProviders(<Order />);

    expect(
      await screen.findByText(/haven't placed any orders yet/i)
    ).toBeInTheDocument();
  });
});