import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils, type IApiResponse } from './index';

// =====================
// TYPES & INTERFACES
// =====================

/**
 * Razorpay Order Creation Request
 */
export interface ICreateOrderRequest {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, any>;
  emi?: boolean;
  enrollmentId?: string;
  userId?: string;
}

/**
 * Razorpay Order Creation Response
 */
export interface ICreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
  created_at: number;
  notes?: Record<string, any>;
  [key: string]: any;
}

/**
 * Payment Verification Request
 */
export interface IVerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  enrollmentId?: string;
  userId?: string;
}

/**
 * Payment Verification Response
 */
export interface IVerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Payment Details
 */
export interface IPaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: string;
  userId?: string;
  enrollmentId?: string;
  [key: string]: any;
}

/**
 * EMI Details
 */
export interface IEMIDetails {
  enrollmentId: string;
  emiPlan: string;
  installments: Array<{
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paymentId?: string;
  }>;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

/**
 * EMI Payment Request
 */
export interface IProcessEMIRequest {
  enrollmentId: string;
  installmentId: string;
  paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
}

/**
 * User Payment History
 */
export interface IUserPaymentHistory {
  payments: IPaymentDetails[];
  total: number;
}

/**
 * Course Pricing
 */
export interface ICoursePricing {
  courseId: string;
  prices: Array<{
    currency: string;
    amount: number;
    type: 'individual' | 'batch';
    [key: string]: any;
  }>;
}

// =====================
// PAYMENTS API SERVICE
// =====================

export const paymentsAPI = {
  /**
   * Create a new Razorpay order (supports EMI)
   */
  createOrder: async (data: ICreateOrderRequest): Promise<IApiResponse<ICreateOrderResponse>> => {
    return apiClient.post(`${apiBaseUrl}/payments/create-order`, data);
  },

  /**
   * Verify payment after completion
   */
  verifyPayment: async (data: IVerifyPaymentRequest): Promise<IApiResponse<IVerifyPaymentResponse>> => {
    return apiClient.post(`${apiBaseUrl}/payments/verify-payment`, data);
  },

  /**
   * Get payment details by payment ID
   */
  getPaymentById: async (paymentId: string): Promise<IApiResponse<IPaymentDetails>> => {
    if (!paymentId) throw new Error('Payment ID is required');
    return apiClient.get(`${apiBaseUrl}/payments/${paymentId}`);
  },

  /**
   * Get all Razorpay orders for the logged-in user
   */
  getUserOrders: async (): Promise<IApiResponse<{ orders: ICreateOrderResponse[] }>> => {
    return apiClient.get(`${apiBaseUrl}/payments/orders`);
  },

  /**
   * Get Razorpay Key ID for frontend
   */
  getRazorpayKey: async (): Promise<IApiResponse<{ key: string }>> => {
    return apiClient.get(`${apiBaseUrl}/payments/key`);
  },

  /**
   * Process EMI payment installment
   */
  processEMI: async (data: IProcessEMIRequest): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.post(`${apiBaseUrl}/payments/process-emi`, data);
  },

  /**
   * Get EMI details for an enrollment
   */
  getEMIDetails: async (enrollmentId: string): Promise<IApiResponse<IEMIDetails>> => {
    if (!enrollmentId) throw new Error('Enrollment ID is required');
    return apiClient.get(`${apiBaseUrl}/payments/emi/${enrollmentId}`);
  },

  /**
   * Get comprehensive payment history for a user
   */
  getUserComprehensiveHistory: async (userId: string): Promise<IApiResponse<IUserPaymentHistory>> => {
    if (!userId) throw new Error('User ID is required');
    return apiClient.get(`${apiBaseUrl}/payments/user/${userId}/comprehensive-history`);
  },

  /**
   * Get course pricing info
   */
  getCoursePricing: async (courseId: string): Promise<IApiResponse<ICoursePricing>> => {
    if (!courseId) throw new Error('Course ID is required');
    return apiClient.get(`${apiBaseUrl}/payments/course-pricing/${courseId}`);
  },

  /**
   * Create payment order for enrollment
   */
  createEnrollmentOrder: async (data: ICreateOrderRequest): Promise<IApiResponse<ICreateOrderResponse>> => {
    return apiClient.post(`${apiBaseUrl}/payments/create-enrollment-order`, data);
  },

  /**
   * Verify payment and create enrollment
   */
  verifyEnrollmentPayment: async (data: IVerifyPaymentRequest): Promise<IApiResponse<IVerifyPaymentResponse>> => {
    return apiClient.post(`${apiBaseUrl}/payments/verify-enrollment-payment`, data);
  },

  /**
   * Get student's enrollment payment history
   */
  getEnrollmentHistory: async (enrollmentId: string): Promise<IApiResponse<{ payments: IPaymentDetails[] }>> => {
    if (!enrollmentId) throw new Error('Enrollment ID is required');
    return apiClient.get(`${apiBaseUrl}/payments/enrollment-history/${enrollmentId}`);
  },

  /**
   * Get enrollment dashboard for student
   */
  getEnrollmentDashboard: async (): Promise<IApiResponse<{ dashboard: any }>> => {
    return apiClient.get(`${apiBaseUrl}/payments/enrollment-dashboard`);
  },

  /**
   * Get membership payment history
   */
  getMembershipPaymentHistory: async (enrollmentId: string): Promise<IApiResponse<{ payments: IPaymentDetails[] }>> => {
    if (!enrollmentId) throw new Error('Enrollment ID is required');
    return apiClient.get(`${apiBaseUrl}/memberships/${enrollmentId}/payments`);
  },

  /**
   * Get payment history for an enrollment (student/admin)
   */
  getEnrollmentPaymentHistory: async (enrollmentId: string): Promise<IApiResponse<{ payments: IPaymentDetails[] }>> => {
    if (!enrollmentId) throw new Error('Enrollment ID is required');
    return apiClient.get(`${apiBaseUrl}/enrollments/${enrollmentId}/payments`);
  },
};

export default paymentsAPI; 