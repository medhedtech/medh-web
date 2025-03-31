/**
 * API Response Type Definitions
 */

// Base response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Error response
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: {
    code: string;
    details?: string[];
  };
}

// Course price details
export interface PriceDetails {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size?: number;
  max_batch_size?: number;
  early_bird_discount?: number;
  group_discount?: number;
  is_active: boolean;
}

// Response for course price API
export interface CoursePriceResponse extends ApiResponse {
  success: true;
  data: {
    course_id: string;
    course_title?: string;
    course_fee: number;
    course_category?: string;
    prices: PriceDetails[];
  };
}

// Payload for bulk price update
export interface BulkPriceUpdatePayload {
  course_id: string;
  course_fee: number;
  prices: PriceDetails[];
}

// Response for bulk price update
export interface BulkPriceUpdateResponse extends ApiResponse {
  success: true;
  data: {
    updated: number;
    courses: {
      course_id: string;
      course_title?: string;
      status: 'success' | 'failed';
    }[];
  };
}

// Filter parameters for price listings
export interface PriceFilterParams {
  status?: string;
  course_category?: string | string[];
  search?: string;
  min_price?: number;
  max_price?: number;
} 