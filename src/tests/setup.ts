/// <reference types="jest" />
import '@testing-library/jest-dom';

// Mock next/navigation router hooks (basic implementation)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Prevent axios-based apiClient from issuing real network requests in JSDOM
jest.mock('@/lib/api/client', () => {
  const mockGet = jest.fn().mockResolvedValue({
    data: {
      status: 'success',
      data: {
        profile: {
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          profile_picture: null,
        },
        talent: {
          primary_profile_id: 1,
          profiles: [],
        },
      },
    },
  });

  const mockPost = jest.fn().mockResolvedValue({ status: 200, data: { status: 'success' } });

  const safeGetActiveProfileId = () =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('active_profile_id') : null;

  const safeSetActiveProfileId = (profileId: number | null) => {
    if (typeof localStorage === 'undefined') return;
    if (profileId !== null) {
      localStorage.setItem('active_profile_id', profileId.toString());
    } else {
      localStorage.removeItem('active_profile_id');
    }
  };

  return {
    __esModule: true,
    default: {
      get: mockGet,
      post: mockPost,
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    },
    setAuthToken: jest.fn(),
    getActiveProfileId: jest.fn(safeGetActiveProfileId),
    setActiveProfileId: jest.fn(safeSetActiveProfileId),
  };
});

// Silence console errors in tests that intentionally trigger them
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (/(Failed to fetch profile|Failed to switch profile)/.test(String(args[0]))) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
