/// <reference types="jest" />
import '@testing-library/jest-dom';

// Mock next/navigation router hooks (basic implementation)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

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
