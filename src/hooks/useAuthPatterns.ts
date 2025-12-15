/**
 * Custom hooks for common authentication patterns
 * Reduces duplicated logic across auth pages
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to redirect authenticated users away from auth pages
 * Used in: login, register, forgot-password, reset-password, verify-email pages
 */
export function useAuthRedirect(): { hydrated: boolean; isAuthenticated: boolean } {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, router]);

  return { hydrated, isAuthenticated };
}

/**
 * Hook to handle email verification redirect after login failure
 * Provides reusable logic for email verification required scenario
 */
export function useEmailVerificationRedirect() {
  const router = useRouter();

  const redirectToVerification = (email: string, password?: string) => {
    const params = new URLSearchParams();
    params.set('email', email);
    if (password) {
      params.set('password', password);
    }
    router.push(`/verify-email?${params.toString()}`);
  };

  return { redirectToVerification };
}

/**
 * Hook for managing form loading state with automatic reset
 * Simplifies isLoading state management in forms
 */
export function useFormLoading(onError?: (error: unknown) => void, onSuccess?: () => void) {
  // Note: This is a simple wrapper, actual state management is done in components
  // Exported for potential future enhancement with automatic state management
  return {
    onError: onError || (() => {}),
    onSuccess: onSuccess || (() => {}),
  };
}
