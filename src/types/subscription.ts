// Subscription-related TypeScript interfaces

export interface SubscriptionPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_in_days: number;
  is_active: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  type: "%" | "fixed";
  discount: number;
  is_public: boolean;
}

export interface PricingDetails {
  original_price: number;
  discount_amount: number;
  final_price: number;
  currency: string;
}

export interface Subscription {
  id: number;
  package_name: string;
  package_price?: number;
  starts_at: string;
  end_at: string;
  is_active: boolean;
  days_remaining?: number;
  coupon_used?: {
    code: string;
    type: "%" | "fixed";
    discount: number;
  } | null;
  created_at?: string;
}

export interface Payment {
  id: number;
  amount: number;
  payment_method: "credit_card" | "debit_card" | "bank_transfer" | "cash" | "other";
  payment_reference: string;
  payment_date: string;
  status: string;
  package_name?: string;
  created_at: string;
}

// API Request types
export interface ValidateCouponRequest {
  profile_id: number;
  code: string;
  package_id: number;
}

export interface CreateSubscriptionRequest {
  profile_id: number;
  package_id: number;
  coupon_code?: string;
  payment_reference: string;
  payment_method: "credit_card" | "debit_card" | "bank_transfer" | "cash" | "other";
  amount_paid: number;
  starts_at?: string;
}

// API Response types
export interface PackagesResponse {
  success: boolean;
  data: {
    packages: SubscriptionPackage[];
  };
}

export interface ValidateCouponResponse {
  success: boolean;
  data: {
    coupon: Coupon;
    pricing: PricingDetails;
  };
}

export interface SubscriptionStatusResponse {
  success: boolean;
  data: {
    has_subscription: boolean;
    subscription?: Subscription;
    last_subscription?: {
      package_name: string;
      expired_at: string;
    };
  };
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: Subscription;
    payment: Payment;
  };
}

export interface SubscriptionHistoryResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: {
    payments: Payment[];
    total_spent: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
