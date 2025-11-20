import apiClient from './client';
import type {
  PackagesResponse,
  ValidateCouponRequest,
  ValidateCouponResponse,
  SubscriptionStatusResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  SubscriptionHistoryResponse,
  PaymentHistoryResponse,
} from '@/types/subscription';

/**
 * Get all available subscription packages (public endpoint)
 */
export async function getSubscriptionPackages(): Promise<PackagesResponse> {
  // Backend currently returns { status: 'success', message: string, data: SubscriptionPackage[] }
  // Normalize to PackagesResponse { success: boolean, data: { packages: SubscriptionPackage[] } }
  const response = await apiClient.get('/subscriptions/packages');
  const raw = response.data;
  const rawPackages = Array.isArray(raw?.data) ? raw.data : raw?.data?.packages;
  const packages = (rawPackages || []).map((p: any) => ({
    id: p.id,
    name: p.title ?? p.name ?? `Package ${p.id}`,
    description: p.description ?? '',
    price: Number(p.price) || 0,
    duration_in_days: p.duration_in_days ?? p.duration ?? 30,
    is_active: p.is_active !== undefined ? p.is_active : true,
  }));
  return {
    success: raw?.status ? raw.status === 'success' : !!raw?.success,
    data: { packages },
  };
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
 * Create a new subscription after payment is completed
 */
export async function createSubscription(
  data: CreateSubscriptionRequest
): Promise<CreateSubscriptionResponse> {
  const response = await apiClient.post<CreateSubscriptionResponse>(
    '/subscriptions/create',
    data
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
