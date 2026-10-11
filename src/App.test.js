import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn().mockReturnThis(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  };
  return {
    __esModule: true,
    default: mockAxios,
    ...mockAxios
  };
});

test('renders App and redirects unauthenticated user to Login screen', () => {
  render(<App />);
  const loginButtons = screen.getAllByText(/Đăng nhập/i);
  expect(loginButtons.length).toBeGreaterThan(0);
});

