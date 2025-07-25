/**
 * Hire from Medh API Service
 * 
 * Comprehensive API service for hire from medh inquiries following
 * the established patterns from demo.api.ts and corporate.api.ts.
 * 
 * @author MEDH Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import axios, { AxiosResponse, AxiosError } from 'axios';
import { apiBaseUrl } from '@/config/api';

// Form Type Definitions
export type TFormType = 'hire_from_medh_inquiry';
export type TFormStep = 'contact' | 'professional' | 'inquiry' | 'consent';
export type TFormStatus = 'draft' | 'submitted' | 'acknowledged' | 'under_review' | 'shortlisted' | 'selected' | 'completed' | 'rejected' | 'on_hold';

// Form Configuration Interface
export interface IFormConfig {
  form_id: string;
  form_type: TFormType;
  title: string;
  description: string;
  category: string;
  ui_theme: 'modern' | 'professional' | 'corporate';
  layout: 'vertical' | 'horizontal';
  steps: number;
  auto_save: boolean;
  show_progress: boolean;
  conditional_logic: boolean;
}

// Validation Interfaces
export interface IValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string;
  min?: number;
  max?: number;
  fileTypes?: string[];
  maxSize?: string;
}

export interface IValidationError {
  field: string;
  message: string;
  code: string;
  type: 'required' | 'format' | 'length' | 'custom' | 'business_logic';
}

// Enum Type Definitions
export type TIndustry = 'technology' | 'healthcare' | 'finance' | 'education' | 'manufacturing' | 'retail' | 'consulting' | 'government' | 'non_profit' | 'other';
export type TCompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+' | 'not_applicable';
export type TExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type TInquiryType = 'course_information' | 'enrollment_assistance' | 'technical_support' | 'billing_payment' | 'corporate_training' | 'membership_plans' | 'hiring_solutions' | 'partnership_opportunities' | 'media_press' | 'general_inquiry' | 'feedback_complaint';
export type TContactMethod = 'email' | 'phone' | 'whatsapp';
export type TUrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';
export type TBudgetRange = 'under_10k' | '10k_50k' | '50k_1l' | '1l_5l' | '5l_plus' | 'not_disclosed';
export type TTimeline = 'immediate' | 'within_week' | 'within_month' | 'within_quarter' | 'flexible';
export type THeardAboutUs = 'google_search' | 'social_media' | 'referral_friend' | 'referral_colleague' | 'advertisement' | 'blog_article' | 'webinar_event' | 'partner_institution' | 'other';

// Main Data Interfaces
export interface IContactInfo {
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  email: string;
  mobile_number: {
    country_code: string;
    number: string;
    formatted?: string;
    is_validated?: boolean;
  };
  city: string;
  country: string;
  address?: string;
  social_profiles?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    portfolio?: string;
  };
}

export interface IProfessionalInfo {
  designation?: string;
  company_name?: string;
  company_website?: string;
  industry?: TIndustry;
  company_size?: TCompanySize;
  department?: string;
  experience_level?: TExperienceLevel;
}

export interface IInquiryDetails {
  inquiry_type?: TInquiryType;
  preferred_contact_method: TContactMethod;
  urgency_level: TUrgencyLevel;
  course_interest: string[];
  company_size?: TCompanySize;
  budget_range: TBudgetRange;
  timeline: TTimeline;
  heard_about_us?: THeardAboutUs;
  additional_requirements?: string;
}

export interface IConsent {
  terms_and_privacy: boolean;
  data_collection_consent: boolean;
  marketing_consent?: boolean;
  accuracy_declaration?: boolean;
}

// Technical Metadata Interfaces
export interface IDeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screen_resolution?: string;
  user_agent: string;
}

export interface ISubmissionMetadata {
  timestamp: string;
  form_version: string;
  session_id?: string;
  user_id?: string;
  ip_address?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_info: IDeviceInfo;
  form_interaction_time?: number; // in seconds
  validation_passed: boolean;
  auto_saved_count?: number;
}

// Main Payload Interface
export interface IHireFromMedhInquiryPayload {
  // Form Configuration
  form_config: {
    form_type: TFormType;
    form_version: string;
    submission_id?: string;
  };
  
  // Core Data
  contact_info: IContactInfo;
  professional_info?: IProfessionalInfo;
  inquiry_details: IInquiryDetails;
  
  // Legal & Preferences
  consent: IConsent;
  
  // Technical Data
  submission_metadata: ISubmissionMetadata;
  
  // API Requirements
  captcha_token?: string; // reCAPTCHA token for bot protection
  
  // Additional Context
  lead_source?: string;
  referral_code?: string;
  promotional_code?: string;
  additional_notes?: string;
}

// Response Interfaces
export interface IApiError {
  code: string;
  message: string;
  details?: string[];
  validationErrors?: IValidationError[];
  statusCode?: number;
  timestamp: string;
  request_id?: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IApiError;
  timestamp: string;
  request_id: string;
  response_time_ms?: number;
}

export interface IHireFromMedhResponse {
  application_id: string;
  form_id: string;
  form_type: TFormType;
  status: TFormStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  submitted_at: string;
  acknowledgment_email: string;
  
  // Contact Information
  contact_info: {
    full_name: string;
    email: string;
    mobile_number: {
      formatted: string;
      is_validated: boolean;
    };
  };
  
  // Next Steps & Communications
  next_steps: Array<{
    step: string;
    description: string;
    due_date?: Date;
    completed: boolean;
  }>;
  
  // Response Times & Follow-up
  estimated_response_time: string;
  follow_up_contact_date?: Date;
  
  // Support Information
  support_contact: {
    email: string;
    phone: string;
    available_hours: string;
  };
  
  // Assigned Personnel
  assigned_to?: {
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
}

// Course Interest Options
export const COURSE_INTEREST_OPTIONS = [
  // AI and Data Science
  'ai_data_science',
  'ai_for_professionals',
  'ai_in_finance',
  'ai_in_healthcare',
  'ai_in_manufacturing',

  // Digital Marketing
  'digital_marketing',
  'social_media_marketing',
  'brand_management',
  'online_reputation_management',

  // Business & Management
  'business_analysis_strategy',
  'entrepreneurship_startup',
  'marketing_sales_strategy',

  // Technical Skills
  'programming_python',
  'programming_scala',
  'programming_r',
  'cloud_computing',
  'cybersecurity',

  // Finance & Accounts
  'finance_startups',
  'financial_statement_mis',
  'tax_computation_filing',

  // Personal Development
  'personality_development',
  'vedic_mathematics',
  'emotional_intelligence',
  'public_speaking',
  'time_management',

  // Career Development
  'job_search_strategies',
  'personal_branding',
  'resume_interview_prep',

  // Language & Communication
  'business_english',
  'french_language',
  'mandarin_language',
  'spanish_language',

  // Health & Wellness
  'mental_health_awareness',
  'nutrition_diet_planning',
  'yoga_mindfulness',

  // Industry Specific
  'healthcare_medical_coding',
  'hospitality_tourism',
  'interior_designing',
  'legal_compliance',

  // Environmental & Sustainability
  'renewable_energy',
  'sustainable_agriculture',
  'sustainable_housing',

  // Other
  'other'
];

// Validation Service
export class HireFormValidationService {
  
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid email address'
    };
  }

  static validatePhoneNumber(phone: string, countryCode?: string): { isValid: boolean; error?: string } {
    const cleanPhone = phone.replace(/\D/g, '');
    const isValid = cleanPhone.length >= 7 && cleanPhone.length <= 15;
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid phone number'
    };
  }

  static validateName(name: string): { isValid: boolean; error?: string } {
    const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
    const isValid = nameRegex.test(name.trim());
    return {
      isValid,
      error: isValid ? undefined : 'Name must be 2-100 characters and contain only letters'
    };
  }

  static validateCompanyName(name: string): { isValid: boolean; error?: string } {
    if (!name.trim()) return { isValid: true }; // Optional field
    const isValid = name.trim().length >= 2 && name.trim().length <= 150;
    return {
      isValid,
      error: isValid ? undefined : 'Company name must be 2-150 characters'
    };
  }

  static validateWebsite(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) return { isValid: true }; // Optional field
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/;
    const isValid = urlRegex.test(url);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid website URL'
    };
  }

  static validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
    const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
    return {
      isValid,
      error: isValid ? undefined : `${fieldName} is required`
    };
  }

  static validateInquiryDetails(details: IInquiryDetails): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    // Validate required fields
    if (!details.preferred_contact_method) {
      errors.push({
        field: 'inquiry_details.preferred_contact_method',
        message: 'Preferred contact method is required',
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    if (!details.urgency_level) {
      errors.push({
        field: 'inquiry_details.urgency_level',
        message: 'Urgency level is required',
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    if (!details.budget_range) {
      errors.push({
        field: 'inquiry_details.budget_range',
        message: 'Budget range is required',
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    if (!details.timeline) {
      errors.push({
        field: 'inquiry_details.timeline',
        message: 'Timeline is required',
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    if (!details.course_interest || details.course_interest.length === 0) {
      errors.push({
        field: 'inquiry_details.course_interest',
        message: 'At least one skill/area of interest is required',
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    // Validate additional requirements length
    if (details.additional_requirements && details.additional_requirements.trim().length > 2000) {
      errors.push({
        field: 'inquiry_details.additional_requirements',
        message: 'Additional requirements must not exceed 2000 characters',
        code: 'MAX_LENGTH',
        type: 'length'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateHireFromMedhForm(payload: IHireFromMedhInquiryPayload): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    // Validate contact info
    const { contact_info } = payload;
    
    // Name validations
    const firstNameValidation = this.validateName(contact_info.first_name);
    if (!firstNameValidation.isValid) {
      errors.push({
        field: 'contact_info.first_name',
        message: firstNameValidation.error!,
        code: 'INVALID_NAME',
        type: 'format'
      });
    }

    const lastNameValidation = this.validateName(contact_info.last_name);
    if (!lastNameValidation.isValid) {
      errors.push({
        field: 'contact_info.last_name',
        message: lastNameValidation.error!,
        code: 'INVALID_NAME',
        type: 'format'
      });
    }

    // Email validation
    const emailValidation = this.validateEmail(contact_info.email);
    if (!emailValidation.isValid) {
      errors.push({
        field: 'contact_info.email',
        message: emailValidation.error!,
        code: 'INVALID_EMAIL',
        type: 'format'
      });
    }

    // Phone validation
    const phoneValidation = this.validatePhoneNumber(contact_info.mobile_number.number, contact_info.mobile_number.country_code);
    if (!phoneValidation.isValid) {
      errors.push({
        field: 'contact_info.mobile_number.number',
        message: phoneValidation.error!,
        code: 'INVALID_PHONE',
        type: 'format'
      });
    }

    // Required contact fields
    const cityValidation = this.validateRequired(contact_info.city, 'City');
    if (!cityValidation.isValid) {
      errors.push({
        field: 'contact_info.city',
        message: cityValidation.error!,
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    const countryValidation = this.validateRequired(contact_info.country, 'Country');
    if (!countryValidation.isValid) {
      errors.push({
        field: 'contact_info.country',
        message: countryValidation.error!,
        code: 'REQUIRED_FIELD',
        type: 'required'
      });
    }

    // Validate professional info if provided
    if (payload.professional_info) {
      const { professional_info } = payload;
      
      if (professional_info.company_website) {
        const websiteValidation = this.validateWebsite(professional_info.company_website);
        if (!websiteValidation.isValid) {
          errors.push({
            field: 'professional_info.company_website',
            message: websiteValidation.error!,
            code: 'INVALID_URL',
            type: 'format'
          });
        }
      }
    }

    // Validate inquiry details
    const inquiryValidation = this.validateInquiryDetails(payload.inquiry_details);
    if (!inquiryValidation.isValid) {
      errors.push(...inquiryValidation.errors);
    }

    // Validate consent
    if (!payload.consent.terms_and_privacy) {
      errors.push({
        field: 'consent.terms_and_privacy',
        message: 'You must accept the terms and privacy policy',
        code: 'REQUIRED_CONSENT',
        type: 'required'
      });
    }

    if (!payload.consent.data_collection_consent) {
      errors.push({
        field: 'consent.data_collection_consent',
        message: 'You must consent to data collection',
        code: 'REQUIRED_CONSENT',
        type: 'required'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// API Error Handler
export class ApiErrorHandler {
  static handleAxiosError(error: AxiosError, context?: string): IApiResponse {
    console.error(`API Error${context ? ` (${context})` : ''}:`, error);

    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const errorData = error.response.data as any;
      
      return {
        success: false,
        error: {
          code: errorData?.code || `HTTP_${statusCode}`,
          message: errorData?.message || this.getStatusMessage(statusCode),
          details: errorData?.details || [],
          validationErrors: errorData?.validationErrors || [],
          statusCode,
          timestamp: new Date().toISOString(),
          request_id: errorData?.request_id || 'unknown'
        },
        timestamp: new Date().toISOString(),
        request_id: errorData?.request_id || 'unknown'
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to server. Please check your internet connection.',
          statusCode: 0,
          timestamp: new Date().toISOString(),
          request_id: 'network_error'
        },
        timestamp: new Date().toISOString(),
        request_id: 'network_error'
      };
    } else {
      // Request configuration error
      return {
        success: false,
        error: {
          code: 'CLIENT_ERROR',
          message: error.message || 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          request_id: 'client_error'
        },
        timestamp: new Date().toISOString(),
        request_id: 'client_error'
      };
    }
  }

  private static getStatusMessage(status: number): string {
    switch (status) {
      case 400: return 'Invalid request data';
      case 401: return 'Authentication required';
      case 403: return 'Access denied';
      case 404: return 'Resource not found';
      case 422: return 'Validation failed';
      case 429: return 'Too many requests';
      case 500: return 'Internal server error';
      case 502: return 'Bad gateway';
      case 503: return 'Service unavailable';
      case 504: return 'Gateway timeout';
      default: return 'An error occurred';
    }
  }
}

// Main API Service
export class HireFromMedhAPIService {
  private static readonly BASE_URL = `${apiBaseUrl}/forms`;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;
  private static readonly REQUEST_TIMEOUT = 30000;

  // Utility Methods
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDeviceInfo(): IDeviceInfo {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        os: 'Unknown',
        browser: 'Unknown',
        user_agent: 'Server-side-rendering'
      };
    }

    const userAgent = navigator.userAgent;
    return {
      type: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop',
      os: navigator.platform || 'Unknown',
      browser: this.getBrowserName(userAgent),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      user_agent: userAgent
    };
  }

  private static getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private static async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries = this.MAX_RETRIES,
    context?: string
  ): Promise<IApiResponse<T>> {
    let lastError: AxiosError | Error | undefined;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`API Request Attempt ${attempt}${context ? ` (${context})` : ''}`);
        
        const response = await requestFn();
        
        console.log(`✅ API Success${context ? ` (${context})` : ''}:`, response.data);
        
        return {
          success: true,
          data: response.data,
          message: 'Request completed successfully',
          timestamp: new Date().toISOString(),
          request_id: response.headers['x-request-id'] || this.generateRequestId(),
          response_time_ms: response.headers['x-response-time'] ? parseInt(response.headers['x-response-time']) : undefined
        };
      } catch (error) {
        lastError = error as AxiosError | Error;
        console.warn(`❌ API Attempt ${attempt} failed${context ? ` (${context})` : ''}:`, lastError.message);
        
        // Don't retry on client errors (4xx) except 429 (Too Many Requests)
        if (lastError instanceof AxiosError && lastError.response) {
          const status = lastError.response.status;
          if (status >= 400 && status < 500 && status !== 429) {
            console.log(`🚫 Not retrying client error ${status}`);
            break;
          }
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < retries) {
          const delayMs = this.RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Waiting ${delayMs}ms before retry...`);
          await this.delay(delayMs);
        }
      }
    }

    // All retries failed
    console.error(`💥 All ${retries} attempts failed${context ? ` (${context})` : ''}`);
    if (!lastError) {
      return {
        success: false,
        error: {
          code: 'RETRY_FAILED',
          message: 'All retry attempts failed',
          timestamp: new Date().toISOString()
        },
        message: 'All retry attempts failed',
        timestamp: new Date().toISOString(),
        request_id: 'retry-failed-' + Date.now()
      };
    }
    return ApiErrorHandler.handleAxiosError(lastError as AxiosError, context);
  }

  // Main API Methods
  static async submitHireFromMedhInquiry(
    payload: Partial<IHireFromMedhInquiryPayload>
  ): Promise<IApiResponse<IHireFromMedhResponse>> {
    
    console.log('🚀 Submitting Hire from Medh Inquiry:', payload);

    // Enhanced payload with metadata
    const enhancedPayload: IHireFromMedhInquiryPayload = {
      // Form configuration
      form_config: {
        form_type: 'hire_from_medh_inquiry',
        form_version: '1.0',
        submission_id: payload.form_config?.submission_id || this.generateRequestId()
      },

      // Core data (with validation)
      contact_info: payload.contact_info!,
      professional_info: payload.professional_info,
      inquiry_details: payload.inquiry_details!,
      consent: payload.consent!,

      // Technical metadata
      submission_metadata: {
        timestamp: new Date().toISOString(),
        form_version: '1.0',
        device_info: this.getDeviceInfo(),
        validation_passed: true,
        session_id: payload.submission_metadata?.session_id,
        user_id: payload.submission_metadata?.user_id,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || undefined : undefined,
        utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || undefined : undefined,
        utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || undefined : undefined,
        ...payload.submission_metadata
      },

      // Security
      captcha_token: payload.captcha_token || 'development_token',

      // Optional context
      lead_source: payload.lead_source,
      referral_code: payload.referral_code,
      additional_notes: payload.additional_notes
    };

    // Client-side validation
    const validation = HireFormValidationService.validateHireFromMedhForm(enhancedPayload);
    if (!validation.isValid) {
      console.error('❌ Client-side validation failed:', validation.errors);
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Form validation failed',
          validationErrors: validation.errors,
          timestamp: new Date().toISOString(),
          request_id: enhancedPayload.form_config.submission_id!
        },
        timestamp: new Date().toISOString(),
        request_id: enhancedPayload.form_config.submission_id!
      };
    }

    // Submit to API with retry logic
    return this.retryRequest(
      () => axios.post(
        `${this.BASE_URL}/submit`,
        {
          form_type: 'hire_from_medh_inquiry',
          ...enhancedPayload
        },
        {
          timeout: this.REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': enhancedPayload.form_config.submission_id,
            'X-Form-Type': 'hire_from_medh_inquiry'
          }
        }
      ),
      this.MAX_RETRIES,
      'Submit Hire Inquiry'
    );
  }

  static async getFormConfiguration(formType: TFormType): Promise<IApiResponse<IFormConfig>> {
    return this.retryRequest(
      () => axios.get(`${this.BASE_URL}/config/${formType}`, {
        timeout: this.REQUEST_TIMEOUT
      }),
      this.MAX_RETRIES,
      'Get Form Configuration'
    );
  }

  static async autoSaveFormData(
    formType: TFormType,
    formData: Partial<IHireFromMedhInquiryPayload>
  ): Promise<IApiResponse<{ saved: boolean; saved_at: string }>> {
    return this.retryRequest(
      () => axios.post(
        `${this.BASE_URL}/auto-save`,
        {
          form_type: formType,
          form_data: formData
        },
        { timeout: this.REQUEST_TIMEOUT }
      ),
      2, // Fewer retries for auto-save
      'Auto-save Form Data'
    );
  }

  static async getAutoFillData(): Promise<IApiResponse<Partial<IHireFromMedhInquiryPayload>>> {
    return this.retryRequest(
      () => axios.get(`${this.BASE_URL}/auto-fill-data?form_type=hire_from_medh_inquiry`, {
        timeout: this.REQUEST_TIMEOUT,
        headers: {
          'Authorization': typeof window !== 'undefined' ? localStorage.getItem('authToken') : undefined
        }
      }),
      this.MAX_RETRIES,
      'Get Auto-fill Data'
    );
  }
}

// Export default service
export default HireFromMedhAPIService; 