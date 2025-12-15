/**
 * Centralized error handling utilities
 * Reduces code duplication across auth pages and components
 */

import { AxiosError } from 'axios';

/**
 * Extracts error message from various error types
 * Handles AxiosError, Error objects, and unknown types
 */
export function getErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  // Handle AxiosError
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback
  return fallback;
}

/**
 * Check if error message contains a specific keyword
 * Useful for conditional handling (e.g., email verification required)
 */
export function errorContains(error: unknown, keyword: string): boolean {
  const message = getErrorMessage(error, '').toLowerCase();
  return message.includes(keyword.toLowerCase());
}

/**
 * Check if user needs email verification
 * Common pattern in login/auth flows
 */
export function isEmailVerificationError(error: unknown): boolean {
  return errorContains(error, 'verify') && errorContains(error, 'email');
}

/**
 * Check if it's an Axios error
 */
export function isAxiosError(error: unknown): boolean {
  return !!(error && typeof error === 'object' && 'response' in error);
}
