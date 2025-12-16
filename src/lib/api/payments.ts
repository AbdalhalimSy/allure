import apiClient from './client';
import type {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentStatusResponse,
} from '@/types/subscription';

/**
 * Initiate payment for a subscription package
 * Returns encrypted data and gateway URL for CCAvenue payment
 */
export async function initiatePayment(
  data: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> {
  const response = await apiClient.post<InitiatePaymentResponse>(
    '/payments/initiate',
    data
  );
  return response.data;
}

/**
 * Check payment status by order ID
 */
export async function getPaymentStatus(
  orderId: string
): Promise<PaymentStatusResponse> {
  const response = await apiClient.get<PaymentStatusResponse>(
    '/payments/status',
    {
      params: { order_id: orderId },
    }
  );
  return response.data;
}

/**
 * Redirect user to CCAvenue payment gateway
 */
export function redirectToPaymentGateway(
  gatewayUrl: string,
  encryptedData: string,
  accessCode: string
): void {
  // Create form dynamically
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = gatewayUrl;

  // Add encrypted data
  const encDataInput = document.createElement('input');
  encDataInput.type = 'hidden';
  encDataInput.name = 'encRequest';
  encDataInput.value = encryptedData;
  form.appendChild(encDataInput);

  // Add access code
  const accessCodeInput = document.createElement('input');
  accessCodeInput.type = 'hidden';
  accessCodeInput.name = 'access_code';
  accessCodeInput.value = accessCode;
  form.appendChild(accessCodeInput);

  // Submit form
  document.body.appendChild(form);
  form.submit();
}
