import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import Login from '../pages/Login';

describe('Login page', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});

  it('shows the email field, password field, and submit button', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});