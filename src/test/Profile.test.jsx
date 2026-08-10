import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Profile from '../pages/Profile';

const mockUser = { username: 'adalovelace', email: 'ada@example.com', verified: true };
const mockOrders = [
  { _id: 'o1', status: 'Pending' },
  { _id: 'o2', status: 'Delivered' },
];

function mockProfileFetch({ userOk = true } = {}) {
  return vi.fn((url) => {
    if (url.includes('/user/profile')) {
        return Promise.resolve({
            ok: userOk,
            json: async () => ({ user: mockUser }),
        });
    }
    if (url.includes('/user-orders')) {
        return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, orders: mockOrders }),
        });
    }
    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}

describe('Profile page', () => {
  it('renders user info and order summary without crashing once data loads', async () => {
    global.fetch = mockProfileFetch();

    renderWithProviders(<Profile />);

    expect(
        await screen.findByRole('heading', { name: mockUser.username })
    ).toBeInTheDocument();
    expect(screen.getByText(/orders summary/i)).toBeInTheDocument();
    expect(screen.getByText(/view all orders/i)).toBeInTheDocument();
  });

  it('renders an error alert without crashing when the profile fetch fails', async () => {
    global.fetch = mockProfileFetch({ userOk: false });

    renderWithProviders(<Profile />);

    expect(
        await screen.findByText(/failed to fetch user profile/i)
    ).toBeInTheDocument();
  });
});