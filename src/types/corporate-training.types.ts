/**
 * Corporate Training Universal Form Model Types
 * 
 * TypeScript interfaces for the corporate training inquiry system
 * integrated with the Universal Form Model backend.
 */

export type TCorporateInquiryStatus = 'submitted' | 'under_review' | 'in_progress' | 'completed' | 'cancelled';
export type TCorporateInquiryPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TFormSource = 'website_form' | 'admin_portal' | 'mobile_app' | 'api' | 'other';

export interface ICorporateContactInfo {
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
}

export interface ICorporateProfessionalInfo {
  designation: string;
  company_name: string;
  company_website: string;
}

export interface ICorporateSubmissionMetadata {
  user_agent?: string;
  timestamp: string;
  referrer?: string;
  form_version: string;
  validation_passed: boolean;
  ip_address?: string;
  session_id?: string;
}

export interface ICorporateInquiry {
  _id: string;
  form_id: string;
  form_type: 'corporate_training_inquiry';
  
  // Contact and professional information
  contact_info: ICorporateContactInfo;
  professional_info: ICorporateProfessionalInfo;
  
  // Training requirements
  message: string;
  
  // Consent and compliance
  accept: boolean;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  
  // Workflow management
  status: TCorporateInquiryStatus;
  priority: TCorporateInquiryPriority;
  assigned_to?: string;
  internal_notes?: string[];
  
  // Tracking and analytics
  source: TFormSource;
  submission_metadata: ICorporateSubmissionMetadata;
  
  // Progress tracking
  completion_percentage: number;
  
  // Timestamps
  submitted_at: string;
  updated_at: string;
  completed_at?: string;
  
  // Soft delete
  is_deleted: boolean;
  deleted_at?: string;
  deleted_by?: string;
}

export interface ICorporateInquiryCreateInput {
  form_type: 'corporate_training_inquiry';
  contact_info: ICorporateContactInfo;
  professional_info: ICorporateProfessionalInfo;
  message: string;
  accept: boolean;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  priority?: TCorporateInquiryPriority;
  source?: TFormSource;
  submission_metadata?: Partial<ICorporateSubmissionMetadata>;
}

export interface ICorporateInquiryUpdateInput {
  status?: TCorporateInquiryStatus;
  priority?: TCorporateInquiryPriority;
  assigned_to?: string;
  internal_notes?: string;
  completion_percentage?: number;
}

export interface ICorporateInquiryListResponse {
  success: boolean;
  message: string;
  data: ICorporateInquiry[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  filters?: {
    status?: TCorporateInquiryStatus;
    priority?: TCorporateInquiryPriority;
    search?: string;
  };
}

export interface ICorporateInquiryResponse {
  success: boolean;
  message: string;
  data: {
    form_id: string;
    submission_date: string;
    status: TCorporateInquiryStatus;
    priority: TCorporateInquiryPriority;
  };
}

export interface ICorporateInquiryStatsResponse {
  success: boolean;
  data: {
    total_inquiries: number;
    by_status: Record<TCorporateInquiryStatus, number>;
    by_priority: Record<TCorporateInquiryPriority, number>;
    completion_rate: number;
    average_response_time: number;
    monthly_trends: Array<{
      month: string;
      count: number;
      completion_rate: number;
    }>;
  };
}

export interface ICorporateFormValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ICorporateFormErrorResponse {
  success: false;
  message: string;
  errors?: ICorporateFormValidationError[];
}

// Frontend-specific types
export interface ICorporateFormState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  lastSubmissionId?: string;
  errors: Record<string, string>;
}

export interface ICorporateFormConfig {
  enableAnalytics: boolean;
  enableLocalStorage: boolean;
  debugMode: boolean;
  apiTimeout: number;
} 