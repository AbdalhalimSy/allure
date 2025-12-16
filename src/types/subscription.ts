// Subscription-related TypeScript interfaces

export interface SubscriptionPackage {
  id: number;
  title: string;
  title_en?: string;
  title_ar?: string;
  name?: string; // Deprecated, use title
  description: string;
  price: number;
  duration_in_days: number;
  is_active?: boolean;
}

export interface PackageInfo {
  id: number;
  name: string;
  title: string;
  title_en?: string;
  title_ar?: string;
  price: number;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  final_price: number;
  original_price: number;
  savings: number;
}

export interface PricingDetails {
  original_price: number;
  discount_amount: number;
  final_price: number;
  currency: string;
}

export interface Subscription {
  id: number;
  package?: PackageInfo;
  package_name: string;
  package_price: number;
  starts_at: string;
  end_at: string;
  is_active: boolean;
  days_remaining: number;
  created_at: string;
}

export interface Payment {
  id: number;
  amount: number;
  payment_method: string;
  payment_reference: string;
  paid_at: string;
  created_at: string;
}

// API Request types
export interface ValidateCouponRequest {
  profile_id: number;
  code: string;
  package_id: number;
}

export interface InitiatePaymentRequest {
  profile_id: number;
  package_id: number;
  coupon_code?: string;
}

export interface CreateSubscriptionRequest {
  profile_id: number;
  package_id: number;
  coupon_code?: string;
  payment_reference: string;
  payment_method: string;
  amount_paid: number;
  starts_at?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface PackagesResponse {
  status: string;
  message: string;
  data: SubscriptionPackage[];
}

export interface ValidateCouponResponse {
  status: string;
  message: string;
  data: {
    coupon: Coupon;
  } | null;
}

export interface PaymentFormData {
  action: string;
  method: string;
  fields: {
    encRequest: string;
    access_code: string;
  };
}

export interface InitiatePaymentResponse {
  status: string;
  message: string;
  data: {
    order_id: string;
    gateway_url: string;
    encrypted_data: string;
    access_code: string;
    payment_mode: string;
    payment_form: PaymentFormData;
    pricing: PricingDetails;
  };
}

export interface PaymentStatusResponse {
  status: string;
  message: string;
  data: {
    status: "pending" | "success" | "failed" | "cancelled";
    order_id: string;
    subscription_id?: number;
    tracking_id?: string;
    bank_ref_no?: string;
    amount: number;
    currency?: string;
    created_at?: string;
  };
}

export interface SubscriptionStatusResponse {
  status: string;
  message: string;
  data: {
    has_subscription: boolean;
    subscription?: Subscription;
  };
}

export interface CreateSubscriptionResponse {
  status: string;
  message: string;
  data: {
    subscription: Subscription;
    payment: Payment;
  };
}

export interface SubscriptionHistoryResponse {
  status: string;
  message: string;
  data: Subscription[];
}

export interface PaymentHistoryResponse {
  status: string;
  message: string;
  data: {
    payments: Payment[];
    total_spent: number;
  };
}
