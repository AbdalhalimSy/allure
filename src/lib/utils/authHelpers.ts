/**
 * Shared authentication utilities
 * Consolidates common auth flows like login, signup, and email verification
 */

import { setAuthToken, setActiveProfileId } from '@/lib/api/client';
import { getErrorMessage } from '@/lib/utils/errorHandling';

interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    token_type: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
    talent: {
      primary_profile_id: number;
      id: number;
    };
  };
}

interface SetUserOptions {
  id: number;
  name: string;
  email: string;
  talent: any;
}

/**
 * Handle post-login setup (common in login and verify-email flows)
 * Stores auth token, sets active profile, and triggers profile fetch
 */
export async function handlePostLoginSetup(
  email: string,
  loginResponse: LoginResponse,
  setUser: (userData: SetUserOptions) => void,
  fetchProfile: () => Promise<void>
): Promise<boolean> {
  const token = loginResponse?.data?.token;
  const userData = loginResponse?.data?.user;
  const talentData = loginResponse?.data?.talent;

  if (!token) {
    return false;
  }

  // Step 1: Set auth token
  setAuthToken(token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_email', email);
  }

  // Step 2: Set active profile ID BEFORE any API calls
  if (talentData?.primary_profile_id) {
    setActiveProfileId(talentData.primary_profile_id);
  }

  // Step 3: Set user with initial data
  setUser({
    id: userData?.id,
    name: userData?.name || 'Allure User',
    email: userData?.email || email,
    talent: talentData,
  });

  // Step 4: Fetch full profile
  try {
    await fetchProfile();
    return true;
  } catch (error) {
    console.error('Failed to fetch profile after login:', error);
    // Even if fetch fails, user is logged in, so return true
    return true;
  }
}

/**
 * Generic API call wrapper with error handling
 * Reduces duplication of try-catch-toast patterns
 */
export async function callApiWithErrorHandling<T>(
  apiCall: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void,
  fallbackError: string = 'An error occurred'
): Promise<T | null> {
  try {
    const response = await apiCall();
    if (onSuccess) {
      onSuccess(response);
    }
    return response;
  } catch (error) {
    const errorMsg = getErrorMessage(error, fallbackError);
    if (onError) {
      onError(errorMsg);
    }
    return null;
  }
}
