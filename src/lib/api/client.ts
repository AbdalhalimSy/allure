import axios from 'axios';
import { languageSwitchHandler } from './language-switch-handler';

// Simple token store (in-memory + localStorage hydration)
let authToken: string | null = null;
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('auth_token');
}

const apiClient = axios.create({
  baseURL: '/api', // use internal Next.js API routes for server-side secret handling
  withCredentials: false,
});

// Resolve the preferred locale for API requests
function getPreferredLocale(): string {
  if (typeof window === 'undefined') return 'en';
  // Use languageSwitchHandler as single source of truth
  return languageSwitchHandler.getLocale();
}

// Get current profile ID from localStorage
export function getActiveProfileId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('active_profile_id');
  }
  return null;
}

// Set active profile ID in localStorage
export function setActiveProfileId(profileId: number | null) {
  if (typeof window !== 'undefined') {
    if (profileId !== null) {
      localStorage.setItem('active_profile_id', profileId.toString());
    } else {
      localStorage.removeItem('active_profile_id');
    }
  }
}

// Attach auth token and active profile headers if present
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (typeof window !== 'undefined') {
    const locale = getPreferredLocale();
    config.headers['Accept-Language'] = locale;

    const profileId = getActiveProfileId();
    if (profileId) {
      config.headers['x-profile-id'] = profileId;
    }
  }

  return config;
});

// Basic response interceptor (optional future refresh handling)
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // TODO: handle 401 for token refresh when backend supports it
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=Lax`;
    } else {
      localStorage.removeItem('auth_token');
      document.cookie = "token=; path=/; max-age=0; sameSite=Lax";
    }
  }
}

export default apiClient;
