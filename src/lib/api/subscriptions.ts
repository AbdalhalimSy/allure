import apiClient from './client';
import type {
  PackagesResponse,
  ValidateCouponRequest,
  ValidateCouponResponse,
  SubscriptionStatusResponse,
  SubscriptionHistoryResponse,
  PaymentHistoryResponse,
} from '@/types/subscription';

/**
 * Get all available subscription packages
 */
export async function getSubscriptionPackages(): Promise<PackagesResponse> {
  const response = await apiClient.get<PackagesResponse>('/subscriptions/packages');
  return response.data;
}

/**
 * Validate a coupon code for a specific package and profile
 */
export async function validateCoupon(
  data: ValidateCouponRequest
): Promise<ValidateCouponResponse> {
  const response = await apiClient.post<ValidateCouponResponse>(
    '/subscriptions/validate-coupon',
    data
  );
  return response.data;
}

/**
 * Get subscription status for a profile
 */
export async function getSubscriptionStatus(
  profileId: number
): Promise<SubscriptionStatusResponse> {
  const response = await apiClient.get<SubscriptionStatusResponse>(
    '/subscriptions/status',
    {
      params: { profile_id: profileId },
    }
  );
  return response.data;
}

/**
 * Get subscription history for a profile
 */
export async function getSubscriptionHistory(
  profileId: number
): Promise<SubscriptionHistoryResponse> {
  const response = await apiClient.get<SubscriptionHistoryResponse>(
    '/subscriptions/history',
    {
      params: { profile_id: profileId },
    }
  );
  return response.data;
}

/**
 * Get payment history for a profile
 */
export async function getPaymentHistory(
  profileId: number
): Promise<PaymentHistoryResponse> {
  const response = await apiClient.get<PaymentHistoryResponse>(
    '/subscriptions/payments',
    {
      params: { profile_id: profileId },
    }
  );
  return response.data;
}
