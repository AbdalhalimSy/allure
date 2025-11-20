import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

jest.mock('@/lib/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: { id: 1, name: 'User' } }) }
}));

jest.mock('@/lib/api/endpoints', () => ({
  endpoints: { auth: { profile: '/auth/profile' } }
}));

describe('useAuth hook', () => {
  it('fetches auth profile data', async () => {
    const client = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 1, name: 'User' });
  });
});
