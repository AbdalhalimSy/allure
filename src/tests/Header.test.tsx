import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Header from '@/components/layout/Header';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import userEvent from '@testing-library/user-event';
jest.mock('@/lib/api/client');
import apiClient, { getActiveProfileId, setActiveProfileId } from '@/lib/api/client';

jest.mock('@/lib/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        status: 'success',
        data: {
          profile: { id: 1, first_name: 'Test', last_name: 'User', approval_status: 'approved' },
          talent: { primary_profile_id: 1, profiles: [{ id: 1, full_name: 'Test User', featured_image_url: '', is_primary: true, created_at: '' }] }
        }
      }
    }),
    post: jest.fn().mockResolvedValue({ status: 200, data: { message: 'Logged out' } }),
  },
  setAuthToken: jest.fn(),
  getActiveProfileId: jest.fn(() => null),
  setActiveProfileId: jest.fn(),
}));

function renderWithProviders() {
  return render(
    <I18nProvider>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </I18nProvider>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows login/register when unauthenticated', () => {
    renderWithProviders();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows avatar menu when authenticated', async () => {
  localStorage.setItem('auth_token', 'abc');
  let activeId = '10';
  (getActiveProfileId as jest.Mock).mockImplementation(() => activeId);
  (setActiveProfileId as jest.Mock).mockImplementation((next: number) => { activeId = String(next); });
  // first profile fetch (triggered by useEffect because active id exists)
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
  // after switch fetch
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
    renderWithProviders();
    const avatarButton = screen.getByRole('button', { name: /open user menu/i });
    expect(avatarButton).toBeInTheDocument();
    await userEvent.click(avatarButton);
    // open profile switcher
  const switchProfileButton = await screen.findByText(text => text.toLowerCase().includes('switch profile'));
    await userEvent.click(switchProfileButton);
    const betaProfile = screen.getByText('Beta Two');
    await userEvent.click(betaProfile);
    // avatar letter should update to B (from Alpha A) after switch
    await waitFor(() => {
      const avatarLetter = screen.getByLabelText(/open user menu/i).textContent;
      expect(avatarLetter).toBe('B');
    });
  });
});
