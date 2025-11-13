import axios from 'axios';

// Simple token store (in-memory + localStorage hydration)
let authToken: string | null = null;
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('auth_token');
}

const apiClient = axios.create({
  baseURL: '/api', // use internal Next.js API routes for server-side secret handling
  withCredentials: false,
});

// Attach auth token if present
apiClient.interceptors.request.use((config) => {
  if (authToken && config.headers) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  // Add Accept-Language header from localStorage
  if (typeof window !== 'undefined' && config.headers) {
    const locale = localStorage.getItem('locale') || 'en';
    config.headers['Accept-Language'] = locale;
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
