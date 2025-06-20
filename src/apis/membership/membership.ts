import { apiClient } from '../apiClient';
import { IApiResponse } from '../apiClient';

// ==================== TYPES & ENUMS ====================

export type TMembershipType = 'silver' | 'gold';
export type TMembershipStatus = 'active' | 'expired' | 'cancelled' | 'suspended' | 'pending';
export type TBillingCycle = 'monthly' | 'quarterly' | 'half_yearly' | 'annually';
export type TPaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type TPaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'bank_transfer';
export type TAutoRenewalStatus = 'active' | 'paused' | 'cancelled';

// ==================== INTERFACES ====================

export interface IMembershipPricing {
  membership_type: TMembershipType;
  duration_months: number;
  billing_cycle: TBillingCycle;
  price_inr: number;
  original_price_inr?: number;
  discount_percentage?: number;
  features: string[];
  is_popular?: boolean;
  savings_text?: string;
}

export interface IMembershipPlan {
  amount: number;
  currency: string;
  duration: string;
  features: string[];
}

export interface IMembershipPricingData {
  silver: {
    monthly: IMembershipPlan;
    quarterly: IMembershipPlan;
    half_yearly: IMembershipPlan;
    annual: IMembershipPlan;
  };
  gold: {
    monthly: IMembershipPlan;
    quarterly: IMembershipPlan;
    half_yearly: IMembershipPlan;
    annual: IMembershipPlan;
  };
}

export interface IMembershipBenefits {
  membership_type: TMembershipType;
  tier_name: string;
  description: string;
  features: {
    course_access: {
      description: string;
      categories_allowed: number;
      self_paced_blended: boolean;
      live_courses_discount: string;
    };
    support_features: string[];
    additional_benefits: string[];
  };
  ideal_for: string;
  badge_color: string;
  highlight_features: string[];
}

export interface IPaymentInfo {
  amount: number;
  currency: string;
  payment_method: TPaymentMethod;
  transaction_id?: string;
  payment_gateway?: string;
  payment_details?: {
    gateway_response?: any;
    payment_reference?: string;
    bank_reference?: string;
  };
}

export interface IMembershipEnrollmentInput {
  membership_type: TMembershipType;
  duration_months: number;
  billing_cycle: TBillingCycle;
  auto_renewal?: boolean;
  selected_categories?: string[]; // For Silver: 1 category, Gold: up to 3 categories
  payment_info: IPaymentInfo;
  promo_code?: string;
  referral_code?: string;
}

export interface IMembershipPayment {
  _id: string;
  enrollment_id: string;
  amount: number;
  currency: string;
  payment_method: TPaymentMethod;
  payment_status: TPaymentStatus;
  transaction_id: string;
  payment_date: string;
  billing_period: {
    start_date: string;
    end_date: string;
  };
  payment_gateway?: string;
  failure_reason?: string;
  refund_details?: {
    refund_id: string;
    refund_amount: number;
    refund_date: string;
    refund_reason: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IMembershipEnrollment {
  _id: string;
  user_id: string;
  membership_type: TMembershipType;
  status: TMembershipStatus;
  enrollment_date: string;
  start_date: string;
  expiry_date: string;
  duration_months: number;
  billing_cycle: TBillingCycle;
  auto_renewal: {
    enabled: boolean;
    status: TAutoRenewalStatus;
    next_billing_date?: string;
    renewal_amount?: number;
  };
  selected_categories: string[];
  pricing: {
    original_amount: number;
    paid_amount: number;
    currency: string;
    discount_applied?: number;
    promo_code?: string;
  };
  benefits: {
    course_access_categories: number;
    live_course_discount_percentage: number;
    features_included: string[];
  };
  usage_stats?: {
    courses_accessed: number;
    categories_used: string[];
    last_activity_date?: string;
    total_learning_hours?: number;
  };
  payments: IMembershipPayment[];
  upgrade_history?: Array<{
    from_type: TMembershipType;
    to_type: TMembershipType;
    upgrade_date: string;
    upgrade_amount: number;
  }>;
  cancellation_details?: {
    cancelled_at: string;
    cancelled_by: 'user' | 'admin' | 'system';
    cancellation_reason: string;
    refund_processed?: boolean;
    refund_amount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IMembershipUpgradeInput {
  new_membership_type: TMembershipType;
  payment_info: IPaymentInfo;
  new_categories?: string[];
}

export interface IMembershipRenewalInput {
  duration_months: number;
  billing_cycle: TBillingCycle;
  auto_renewal?: boolean;
  payment_info: IPaymentInfo;
  promo_code?: string;
}

export interface IMembershipCancellationInput {
  cancellation_reason: string;
  immediate_cancellation?: boolean;
  feedback?: string;
  request_refund?: boolean;
}

export interface IMembershipQueryParams {
  page?: number;
  limit?: number;
  status?: TMembershipStatus;
  membership_type?: TMembershipType;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'enrollment_date' | 'expiry_date' | 'status' | 'membership_type';
  sort_order?: 'asc' | 'desc';
  auto_renewal?: boolean;
  expired_in_days?: number;
}

export interface IMembershipStatistics {
  overview: {
    total_memberships: number;
    active_memberships: number;
    expired_memberships: number;
    cancelled_memberships: number;
    total_revenue: number;
    monthly_recurring_revenue: number;
  };
  by_type: {
    silver: {
      count: number;
      revenue: number;
      percentage: number;
    };
    gold: {
      count: number;
      revenue: number;
      percentage: number;
    };
  };
  by_billing_cycle: Array<{
    billing_cycle: TBillingCycle;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  growth_metrics: {
    monthly_enrollments: Array<{
      month: string;
      silver_enrollments: number;
      gold_enrollments: number;
      total_revenue: number;
    }>;
    churn_rate: number;
    retention_rate: number;
    upgrade_rate: number;
  };
  auto_renewal_stats: {
    enabled_count: number;
    disabled_count: number;
    renewal_success_rate: number;
    upcoming_renewals: number;
  };
  popular_categories: Array<{
    category_name: string;
    selection_count: number;
    percentage: number;
  }>;
}

export interface IMembershipEnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollment: IMembershipEnrollment;
    payment_details: IMembershipPayment;
    next_steps?: string[];
  };
}

export interface IMembershipStatusResponse {
  success: boolean;
  message: string;
  data: {
    enrollment: IMembershipEnrollment | null;
    is_active: boolean;
    days_remaining?: number;
    renewal_reminder?: {
      show_reminder: boolean;
      days_until_expiry: number;
      renewal_discount?: number;
    };
  };
}

export interface IMembershipListResponse {
  success: boolean;
  message: string;
  data: {
    enrollments: IMembershipEnrollment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary?: {
      active_count: number;
      expired_count: number;
      total_revenue: number;
    };
  };
}

export interface IMembershipPricingResponse {
  success: boolean;
  message: string;
  data: {
    pricing: IMembershipPricingData;
    special_offers?: Array<{
      title: string;
      description: string;
      discount_percentage: number;
      valid_until: string;
      applicable_plans: TMembershipType[];
    }>;
  };
}

export interface IMembershipBenefitsResponse {
  success: boolean;
  message: string;
  data: {
    benefits: IMembershipBenefits;
    comparison?: {
      silver_features: string[];
      gold_features: string[];
      unique_gold_features: string[];
    };
  };
}

export interface IMembershipStatsResponse {
  success: boolean;
  message: string;
  data: {
    statistics: IMembershipStatistics;
    generated_at: string;
  };
}

// ==================== API BASE URL ====================

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  }
  return process.env.API_BASE_URL || 'http://localhost:3000/api';
};

const apiBaseUrl = getApiBaseUrl();

// ==================== PUBLIC API FUNCTIONS ====================

/**
 * Get membership pricing plans
 */
export const getMembershipPricing = async (): Promise<IApiResponse<IMembershipPricingResponse['data']>> => {
  return await apiClient.get<IMembershipPricingResponse['data']>('/memberships/pricing');
};

/**
 * Get membership benefits by type
 */
export const getMembershipBenefits = async (
  membershipType: TMembershipType
): Promise<IApiResponse<IMembershipBenefitsResponse['data']>> => {
  return await apiClient.get<IMembershipBenefitsResponse['data']>(`/memberships/benefits/${membershipType}`);
};

/**
 * Get all membership benefits for comparison
 */
export const getAllMembershipBenefits = async (): Promise<IApiResponse<{
  silver: IMembershipBenefits;
  gold: IMembershipBenefits;
  comparison: any;
}>> => {
  return await apiClient.get('/memberships/benefits');
};

// ==================== AUTHENTICATED API FUNCTIONS (STUDENT) ====================

/**
 * Create a new membership enrollment
 */
export const createMembershipEnrollment = async (
  enrollmentData: IMembershipEnrollmentInput
): Promise<IApiResponse<IMembershipEnrollmentResponse['data']>> => {
  return await apiClient.post<IMembershipEnrollmentResponse['data']>('/memberships/enroll', enrollmentData);
};

/**
 * Get current user's membership status
 */
export const getMembershipStatus = async (): Promise<IApiResponse<IMembershipStatusResponse['data']>> => {
  return await apiClient.get<IMembershipStatusResponse['data']>('/memberships/status');
};

/**
 * Upgrade current membership
 */
export const upgradeMembership = async (
  enrollmentId: string,
  upgradeData: IMembershipUpgradeInput
): Promise<IApiResponse<IMembershipEnrollmentResponse['data']>> => {
  return await apiClient.patch<IMembershipEnrollmentResponse['data']>(
    `/memberships/${enrollmentId}/upgrade`,
    upgradeData
  );
};

/**
 * Renew membership
 */
export const renewMembership = async (
  enrollmentId: string,
  renewalData: IMembershipRenewalInput
): Promise<IApiResponse<IMembershipEnrollmentResponse['data']>> => {
  return await apiClient.patch<IMembershipEnrollmentResponse['data']>(
    `/memberships/${enrollmentId}/renew`,
    renewalData
  );
};

/**
 * Get payment history for a membership
 */
export const getMembershipPayments = async (
  enrollmentId: string,
  params?: { page?: number; limit?: number }
): Promise<IApiResponse<{
  payments: IMembershipPayment[];
  pagination: any;
  summary: {
    total_paid: number;
    total_payments: number;
    next_payment_date?: string;
  };
}>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `/memberships/${enrollmentId}/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiClient.get(url);
};

/**
 * Cancel membership
 */
export const cancelMembership = async (
  enrollmentId: string,
  cancellationData: IMembershipCancellationInput
): Promise<IApiResponse<{
  cancelled_enrollment: IMembershipEnrollment;
  refund_details?: {
    refund_amount: number;
    refund_timeline: string;
    refund_method: string;
  };
}>> => {
  return await apiClient.post(`/memberships/${enrollmentId}/cancel`, cancellationData);
};

/**
 * Toggle auto-renewal
 */
export const toggleAutoRenewal = async (
  enrollmentId: string,
  enabled: boolean
): Promise<IApiResponse<{ auto_renewal_status: TAutoRenewalStatus }>> => {
  return await apiClient.patch(`/memberships/${enrollmentId}/auto-renewal`, {
    enabled
  });
};

/**
 * Update selected categories (for active memberships)
 */
export const updateSelectedCategories = async (
  enrollmentId: string,
  categories: string[]
): Promise<IApiResponse<{ updated_categories: string[] }>> => {
  return await apiClient.patch(`/memberships/${enrollmentId}/categories`, {
    selected_categories: categories
  });
};

/**
 * Get membership usage statistics
 */
export const getMembershipUsage = async (
  enrollmentId: string
): Promise<IApiResponse<{
  usage_stats: {
    courses_accessed: number;
    categories_used: string[];
    total_learning_hours: number;
    last_activity_date: string;
    course_completion_rate: number;
    monthly_usage: Array<{
      month: string;
      hours: number;
      courses: number;
    }>;
  };
}>> => {
  return await apiClient.get(`/memberships/${enrollmentId}/usage`);
};

// ==================== ADMIN API FUNCTIONS ====================

/**
 * Get all memberships (Admin only)
 */
export const getAllMemberships = async (
  params: IMembershipQueryParams = {}
): Promise<IApiResponse<IMembershipListResponse['data']>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `/memberships/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiClient.get<IMembershipListResponse['data']>(url);
};

/**
 * Get membership statistics (Admin only)
 */
export const getMembershipStatistics = async (
  dateRange?: { start_date: string; end_date: string }
): Promise<IApiResponse<IMembershipStatsResponse['data']>> => {
  const queryParams = new URLSearchParams();
  if (dateRange) {
    queryParams.append('start_date', dateRange.start_date);
    queryParams.append('end_date', dateRange.end_date);
  }

  const url = `/memberships/admin/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiClient.get<IMembershipStatsResponse['data']>(url);
};

/**
 * Get membership by ID (Admin only)
 */
export const getMembershipById = async (
  enrollmentId: string
): Promise<IApiResponse<{ enrollment: IMembershipEnrollment }>> => {
  return await apiClient.get(`/memberships/admin/${enrollmentId}`);
};

/**
 * Update membership status (Admin only)
 */
export const updateMembershipStatus = async (
  enrollmentId: string,
  status: TMembershipStatus,
  reason?: string
): Promise<IApiResponse<{ updated_enrollment: IMembershipEnrollment }>> => {
  return await apiClient.patch(`/memberships/admin/${enrollmentId}/status`, {
    status,
    reason
  });
};

/**
 * Process membership renewal (Admin only)
 */
export const processMembershipRenewal = async (
  enrollmentId: string,
  renewalData: {
    duration_months: number;
    amount: number;
    payment_reference?: string;
    notes?: string;
  }
): Promise<IApiResponse<{ renewed_enrollment: IMembershipEnrollment }>> => {
  return await apiClient.post(`/memberships/admin/${enrollmentId}/renew`, renewalData);
};

/**
 * Get upcoming renewals (Admin only)
 */
export const getUpcomingRenewals = async (
  days?: number
): Promise<IApiResponse<{
  upcoming_renewals: Array<{
    enrollment: IMembershipEnrollment;
    user_details: {
      full_name: string;
      email: string;
    };
    days_until_renewal: number;
    renewal_amount: number;
  }>;
  total_count: number;
}>> => {
  const queryParams = new URLSearchParams();
  if (days) queryParams.append('days', days.toString());

  const url = `/memberships/admin/upcoming-renewals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiClient.get(url);
};

/**
 * Process bulk renewal (Admin only)
 */
export const processBulkRenewal = async (
  enrollmentIds: string[],
  renewalData: {
    duration_months: number;
    discount_percentage?: number;
    notes?: string;
  }
): Promise<IApiResponse<{
  processed_count: number;
  failed_count: number;
  results: Array<{
    enrollment_id: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
}>> => {
  return await apiClient.post('/memberships/admin/bulk-renewal', {
    enrollment_ids: enrollmentIds,
    ...renewalData
  });
};

/**
 * Export memberships data (Admin only)
 */
export const exportMembershipsData = async (
  params: IMembershipQueryParams & {
    format?: 'csv' | 'excel' | 'pdf';
    include_payments?: boolean;
  } = {}
): Promise<IApiResponse<{
  download_url: string;
  expires_at: string;
  file_size: number;
}>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `/memberships/admin/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiClient.get(url);
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate membership pricing with discounts
 */
export const calculateMembershipPricing = (
  membershipType: TMembershipType,
  billingCycle: TBillingCycle,
  pricingData?: IMembershipPricingData,
  promoCode?: string
): {
  original_price: number;
  final_price: number;
  discount_amount: number;
  discount_percentage: number;
  savings_compared_to_monthly: number;
} => {
  // Fallback pricing if API data not available
  const fallbackPrices = {
    silver: {
      monthly: 999,
      quarterly: 2499,
      half_yearly: 3999,
      annually: 4999
    },
    gold: {
      monthly: 1999,
      quarterly: 3999,
      half_yearly: 5999,
      annually: 6999
    }
  };

  const cycleKey = billingCycle === 'annually' ? 'annual' : billingCycle;
  
  // Get pricing from API data or fallback
  const originalPrice = pricingData 
    ? pricingData[membershipType][cycleKey as keyof typeof pricingData[TMembershipType]].amount
    : fallbackPrices[membershipType][billingCycle];
    
  const monthlyPrice = pricingData
    ? pricingData[membershipType].monthly.amount
    : fallbackPrices[membershipType].monthly;

  // Calculate duration months
  const durationMonths = billingCycle === 'monthly' ? 1 : 
                        billingCycle === 'quarterly' ? 3 :
                        billingCycle === 'half_yearly' ? 6 : 12;
  
  const monthlyTotal = monthlyPrice * durationMonths;
  
  // Calculate savings compared to monthly
  const savingsComparedToMonthly = monthlyTotal - originalPrice;
  const discountPercentage = Math.round((savingsComparedToMonthly / monthlyTotal) * 100);

  return {
    original_price: originalPrice,
    final_price: originalPrice, // TODO: Apply promo code logic
    discount_amount: 0, // TODO: Calculate promo discount
    discount_percentage: discountPercentage,
    savings_compared_to_monthly: savingsComparedToMonthly
  };
};

/**
 * Format membership duration
 */
export const formatMembershipDuration = (durationMonths: number): string => {
  if (durationMonths === 1) return '1 Month';
  if (durationMonths === 3) return '3 Months';
  if (durationMonths === 6) return '6 Months';
  if (durationMonths === 12) return '1 Year';
  return `${durationMonths} Months`;
};

/**
 * Get billing cycle from duration
 */
export const getBillingCycleFromDuration = (durationMonths: number): TBillingCycle => {
  switch (durationMonths) {
    case 1: return 'monthly';
    case 3: return 'quarterly';
    case 6: return 'half_yearly';
    case 12: return 'annually';
    default: return 'monthly';
  }
};

/**
 * Check if membership is expiring soon
 */
export const isMembershipExpiringSoon = (expiryDate: string, days: number = 7): boolean => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

/**
 * Get membership status color
 */
export const getMembershipStatusColor = (status: TMembershipStatus): string => {
  switch (status) {
    case 'active': return 'green';
    case 'expired': return 'red';
    case 'cancelled': return 'gray';
    case 'suspended': return 'orange';
    case 'pending': return 'yellow';
    default: return 'gray';
  }
};

/**
 * Validate membership enrollment data
 */
export const validateMembershipEnrollmentData = (data: IMembershipEnrollmentInput): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.membership_type || !['silver', 'gold'].includes(data.membership_type)) {
    errors.push('Invalid membership type');
  }

  if (!data.duration_months || ![1, 3, 6, 12].includes(data.duration_months)) {
    errors.push('Invalid duration months');
  }

  if (!data.payment_info || !data.payment_info.amount || data.payment_info.amount <= 0) {
    errors.push('Invalid payment amount');
  }

  if (!data.payment_info.payment_method) {
    errors.push('Payment method is required');
  }

  if (data.membership_type === 'silver' && data.selected_categories && data.selected_categories.length > 1) {
    errors.push('Silver membership allows only 1 category');
  }

  if (data.membership_type === 'gold' && data.selected_categories && data.selected_categories.length > 3) {
    errors.push('Gold membership allows maximum 3 categories');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  // Public APIs
  getMembershipPricing,
  getMembershipBenefits,
  getAllMembershipBenefits,
  
  // Student APIs
  createMembershipEnrollment,
  getMembershipStatus,
  upgradeMembership,
  renewMembership,
  getMembershipPayments,
  cancelMembership,
  toggleAutoRenewal,
  updateSelectedCategories,
  getMembershipUsage,
  
  // Admin APIs
  getAllMemberships,
  getMembershipStatistics,
  getMembershipById,
  updateMembershipStatus,
  processMembershipRenewal,
  getUpcomingRenewals,
  processBulkRenewal,
  exportMembershipsData,
  
  // Utilities
  calculateMembershipPricing,
  formatMembershipDuration,
  getBillingCycleFromDuration,
  isMembershipExpiringSoon,
  getMembershipStatusColor,
  validateMembershipEnrollmentData
}; 