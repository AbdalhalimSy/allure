import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

jest.mock('@/lib/api/client');
import apiClient, { getActiveProfileId, setActiveProfileId } from '@/lib/api/client';

function Consumer() {
  const ctx = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{ctx.isAuthenticated ? 'yes' : 'no'}</span>
      <button onClick={() => ctx.logout()} data-testid="logout-btn">logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates authenticated state when auth_token present (no profile fetch)', async () => {
    localStorage.setItem('auth_token', 'abc');
    localStorage.setItem('auth_email', 'user@example.com');
    (getActiveProfileId as jest.Mock).mockReturnValue(null); // prevents fetchProfile call
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('yes'));
  });

  it('switchProfile updates active profile id and user data', async () => {
    localStorage.setItem('auth_token', 'abc');
    // dynamic active profile id simulation
    let activeId = '10';
    (getActiveProfileId as jest.Mock).mockImplementation(() => activeId);
    (setActiveProfileId as jest.Mock).mockImplementation((next: number) => { activeId = String(next); });
    // initial fetch triggered by useEffect because active profile id exists
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        status: 'success',
        data: {
          profile: { id: 10, first_name: 'Alpha', last_name: 'One', approval_status: 'approved' },
          talent: {
            primary_profile_id: 10,
            profiles: [
              { id: 10, full_name: 'Alpha One', featured_image_url: '', is_primary: true, created_at: '' },
              { id: 11, full_name: 'Beta Two', featured_image_url: '', is_primary: false, created_at: '' }
            ]
          }
        }
      }
    });
    // fetch after switching
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        status: 'success',
        data: {
          profile: { id: 11, first_name: 'Beta', last_name: 'Two', approval_status: 'approved' },
          talent: {
            primary_profile_id: 10,
            profiles: [
              { id: 10, full_name: 'Alpha One', featured_image_url: '', is_primary: true, created_at: '' },
              { id: 11, full_name: 'Beta Two', featured_image_url: '', is_primary: false, created_at: '' }
            ]
          }
        }
      }
    });
    const SwitchConsumer = () => {
      const ctx = useAuth();
      return (
        <div>
          <span data-testid="active-profile">{ctx.activeProfileId}</span>
          <button data-testid="switch" onClick={() => ctx.switchProfile(11)}>switch</button>
        </div>
      );
    };
    render(<AuthProvider><SwitchConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('active-profile').textContent).toBe('10'));
  await userEvent.click(screen.getByTestId('switch'));
    await waitFor(() => expect(screen.getByTestId('active-profile').textContent).toBe('11'));
  });

  it('logout clears authentication state', async () => {
    localStorage.setItem('auth_token', 'abc');
    (getActiveProfileId as jest.Mock).mockReturnValue(null);
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('yes'));
  await userEvent.click(screen.getByTestId('logout-btn'));
    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('no'));
  });
});
