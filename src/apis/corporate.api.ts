import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiBaseUrl } from './index';

// ========== FORM CONFIG TYPES (Following formjson.md) ==========

export type TFormType = 'corporate_training_inquiry';
export type TFormStep = 'contact' | 'professional' | 'training' | 'consent';
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

// ========== ENHANCED VALIDATION PATTERNS ==========

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

// ========== TYPE DEFINITIONS ==========

export type TIndustry = 'technology' | 'healthcare' | 'finance' | 'education' | 'manufacturing' | 'retail' | 'consulting' | 'government' | 'non_profit' | 'other';
export type TCompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';
export type TExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type TTrainingType = 'technical_skills' | 'soft_skills' | 'leadership' | 'compliance' | 'product_training' | 'sales_training' | 'customer_service' | 'digital_transformation' | 'other';
export type TTrainingMode = 'online' | 'onsite' | 'hybrid' | 'flexible';
export type TDurationPreference = '1_day' | '2-3_days' | '1_week' | '2-4_weeks' | '1-3_months' | 'ongoing';
export type TBudgetRange = 'under_1l' | '1l_5l' | '5l_10l' | '10l_25l' | '25l_50l' | '50l_plus' | 'not_disclosed';
export type TTimeline = 'immediate' | 'within_month' | 'within_quarter' | 'within_6months' | 'flexible';
export type TInquiryType = 'course_information' | 'enrollment_assistance' | 'technical_support' | 'billing_payment' | 'corporate_training' | 'membership_plans' | 'hiring_solutions' | 'partnership_opportunities' | 'media_press' | 'general_inquiry' | 'feedback_complaint';
export type TContactMethod = 'email' | 'phone' | 'whatsapp';
export type TUrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

// ========== CONTACT & PROFESSIONAL TYPES ==========

// Contact Information (matches backend schema)
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

// Professional Information
export interface IProfessionalInfo {
  designation: string;
  company_name: string;
  company_website?: string;
  industry?: TIndustry;
  company_size?: TCompanySize;
  department?: string;
  experience_level?: TExperienceLevel;
}

// Training Requirements
export interface ITrainingRequirements {
  training_type: TTrainingType;
  training_mode: TTrainingMode;
  participants_count: number;
  duration_preference: TDurationPreference;
  budget_range: TBudgetRange;
  timeline: TTimeline;
  specific_skills: string[];
  custom_requirements: string;
  has_existing_lms: boolean;
  lms_integration_needed: boolean;
}

// Inquiry Details
export interface IInquiryDetails {
  inquiry_type: TInquiryType;
  preferred_contact_method: TContactMethod;
  urgency_level: TUrgencyLevel;
  course_interest: string[];
  heard_about_us?: string;
  additional_requirements?: string;
}

// ========== CONSENT & PRIVACY ==========

export interface IConsent {
  terms_and_privacy: boolean;
  data_collection_consent: boolean;
  marketing_consent?: boolean;
  accuracy_declaration?: boolean;
}

// ========== SUBMISSION METADATA ==========

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

// ========== MAIN FORM PAYLOAD ==========

export interface ICorporateTrainingInquiryPayload {
  // Form Configuration
  form_config: {
    form_type: TFormType;
    form_version: string;
    submission_id?: string;
  };
  
  // Core Data
  contact_info: IContactInfo;
  professional_info: IProfessionalInfo;
  training_requirements: ITrainingRequirements;
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

// ========== API RESPONSE INTERFACES ==========

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

// Corporate Training Response Data
export interface ICorporateTrainingResponse {
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

// ========== ENHANCED VALIDATION CLASS ==========

export class CorporateFormValidationService {
  // Basic Validation Methods
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid business email address'
    };
  }

  static validatePhoneNumber(phone: string, countryCode?: string): { isValid: boolean; error?: string } {
    // Remove all non-digit characters for basic validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Basic validation - should be between 7 and 15 digits
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
      error: isValid ? undefined : 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'
    };
  }

  static validateCompanyName(name: string): { isValid: boolean; error?: string } {
    const isValid = name.trim().length >= 2 && name.trim().length <= 150;
    return {
      isValid,
      error: isValid ? undefined : 'Company name must be between 2 and 150 characters'
    };
  }

  static validateDesignation(designation: string): { isValid: boolean; error?: string } {
    const isValid = designation.trim().length >= 2 && designation.trim().length <= 100;
    return {
      isValid,
      error: isValid ? undefined : 'Designation must be between 2 and 100 characters'
    };
  }

  static validateWebsite(url: string): { isValid: boolean; error?: string } {
    if (!url || url.trim() === '') return { isValid: true }; // Optional field
    
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/;
    const isValid = urlRegex.test(url);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid website URL'
    };
  }

  static validateParticipantCount(count: number): { isValid: boolean; error?: string } {
    const isValid = count >= 1 && count <= 10000;
    return {
      isValid,
      error: isValid ? undefined : 'Participant count must be between 1 and 10,000'
    };
  }

  static validateCustomRequirements(text: string): { isValid: boolean; error?: string } {
    const isValid = text.trim().length >= 10 && text.trim().length <= 2000;
    return {
      isValid,
      error: isValid ? undefined : 'Training requirements must be between 10 and 2000 characters'
    };
  }

  static validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
    const isValid = value !== null && value !== undefined && value !== '' && 
                   (Array.isArray(value) ? value.length > 0 : true);
    return {
      isValid,
      error: isValid ? undefined : `${fieldName} is required`
    };
  }

  // Business Logic Validation
  static validateTrainingRequirements(requirements: ITrainingRequirements): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    // Validate participant count
    const participantValidation = this.validateParticipantCount(requirements.participants_count);
    if (!participantValidation.isValid) {
      errors.push({
        field: 'training_requirements.participants_count',
        message: participantValidation.error!,
        code: 'INVALID_PARTICIPANT_COUNT',
        type: 'format'
      });
    }

    // Validate custom requirements
    const requirementsValidation = this.validateCustomRequirements(requirements.custom_requirements);
    if (!requirementsValidation.isValid) {
      errors.push({
        field: 'training_requirements.custom_requirements',
        message: requirementsValidation.error!,
        code: 'INVALID_REQUIREMENTS_LENGTH',
        type: 'length'
      });
    }

    // Validate specific skills array
    if (!requirements.specific_skills || requirements.specific_skills.length === 0) {
      errors.push({
        field: 'training_requirements.specific_skills',
        message: 'Please select at least one specific skill or training area',
        code: 'SKILLS_REQUIRED',
        type: 'required'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Comprehensive Form Validation
  static validateCorporateTrainingForm(payload: ICorporateTrainingInquiryPayload): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    // Validate contact information
    const nameValidation = this.validateName(payload.contact_info.full_name);
    if (!nameValidation.isValid) {
      errors.push({
        field: 'contact_info.full_name',
        message: nameValidation.error!,
        code: 'INVALID_NAME',
        type: 'format'
      });
    }

    const emailValidation = this.validateEmail(payload.contact_info.email);
    if (!emailValidation.isValid) {
      errors.push({
        field: 'contact_info.email',
        message: emailValidation.error!,
        code: 'INVALID_EMAIL',
        type: 'format'
      });
    }

    const phoneValidation = this.validatePhoneNumber(payload.contact_info.mobile_number.number);
    if (!phoneValidation.isValid) {
      errors.push({
        field: 'contact_info.mobile_number.number',
        message: phoneValidation.error!,
        code: 'INVALID_PHONE',
        type: 'format'
      });
    }

    // Validate professional information
    const designationValidation = this.validateDesignation(payload.professional_info.designation);
    if (!designationValidation.isValid) {
      errors.push({
        field: 'professional_info.designation',
        message: designationValidation.error!,
        code: 'INVALID_DESIGNATION',
        type: 'format'
      });
    }

    const companyValidation = this.validateCompanyName(payload.professional_info.company_name);
    if (!companyValidation.isValid) {
      errors.push({
        field: 'professional_info.company_name',
        message: companyValidation.error!,
        code: 'INVALID_COMPANY_NAME',
        type: 'format'
      });
    }

    if (payload.professional_info.company_website) {
      const websiteValidation = this.validateWebsite(payload.professional_info.company_website);
      if (!websiteValidation.isValid) {
        errors.push({
          field: 'professional_info.company_website',
          message: websiteValidation.error!,
          code: 'INVALID_WEBSITE',
          type: 'format'
        });
      }
    }

    // Validate training requirements
    const trainingValidation = this.validateTrainingRequirements(payload.training_requirements);
    errors.push(...trainingValidation.errors);

    // Validate consent
    if (!payload.consent.terms_and_privacy) {
      errors.push({
        field: 'consent.terms_and_privacy',
        message: 'You must accept the Terms of Service and Privacy Policy',
        code: 'TERMS_REQUIRED',
        type: 'required'
      });
    }

    if (!payload.consent.data_collection_consent) {
      errors.push({
        field: 'consent.data_collection_consent',
        message: 'You must consent to data collection for processing your inquiry',
        code: 'DATA_CONSENT_REQUIRED',
        type: 'required'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ========== ENHANCED ERROR HANDLER ==========

export class ApiErrorHandler {
  static handleAxiosError(error: AxiosError, context?: string): IApiResponse {
    const timestamp = new Date().toISOString();
    const request_id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      return {
        success: false,
        message: data?.message || this.getStatusMessage(status),
        error: {
          code: data?.error?.code || `HTTP_${status}`,
          message: data?.message || this.getStatusMessage(status),
          details: data?.error?.details || [error.message],
          validationErrors: data?.error?.validationErrors || [],
          statusCode: status,
          timestamp,
          request_id
        },
        timestamp,
        request_id
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection and try again.',
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed',
          details: ['Please check your internet connection and try again.'],
          timestamp,
          request_id
        },
        timestamp,
        request_id
      };
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred while processing your request.',
        error: {
          code: 'REQUEST_ERROR',
          message: 'Request configuration error',
          details: [error.message],
          timestamp,
          request_id
        },
        timestamp,
        request_id
      };
    }
  }

  private static getStatusMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: 'Invalid request data provided.',
      401: 'Authentication required.',
      403: 'Access denied.',
      404: 'The requested resource was not found.',
      409: 'Conflict with current state.',
      422: 'Validation errors occurred.',
      429: 'Too many requests. Please try again later.',
      500: 'Internal server error. Please try again later.',
      502: 'Server is temporarily unavailable.',
      503: 'Service is temporarily unavailable.',
      504: 'Request timeout. Please try again.'
    };
    
    return statusMessages[status] || 'An unexpected error occurred.';
  }
}

// ========== ENHANCED API SERVICE CLASS ==========

export class CorporateTrainingAPIService {
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
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);
    
    return {
      type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      os: navigator.platform,
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
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  // Enhanced Retry Logic
  private static async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries = this.MAX_RETRIES,
    context?: string
  ): Promise<IApiResponse<T>> {
    const startTime = Date.now();
    
    try {
      const response = await requestFn();
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId(),
        response_time_ms: responseTime
      };
    } catch (error) {
      if (retries > 0 && axios.isAxiosError(error)) {
        const shouldRetry = 
          !error.response || 
          (error.response.status >= 500 && error.response.status < 600) ||
          error.code === 'ECONNABORTED' || // timeout
          error.code === 'ENOTFOUND' || // DNS issues
          error.code === 'ECONNRESET'; // connection reset
          
        if (shouldRetry) {
          console.warn(`Retrying request (${this.MAX_RETRIES - retries + 1}/${this.MAX_RETRIES}) in ${this.RETRY_DELAY}ms...`);
          await this.delay(this.RETRY_DELAY);
          return this.retryRequest(requestFn, retries - 1, context);
        }
      }
      
      if (axios.isAxiosError(error)) {
        return ApiErrorHandler.handleAxiosError(error, context);
      }
      
      return {
        success: false,
        message: 'An unknown error occurred.',
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Something went wrong.',
          details: [error instanceof Error ? error.message : 'Unknown error'],
          timestamp: new Date().toISOString(),
          request_id: this.generateRequestId()
        },
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId()
      };
    }
  }

  /**
   * Submit Corporate Training Inquiry Form with Enhanced Validation and Metadata
   */
  static async submitCorporateTrainingInquiry(
    payload: Partial<ICorporateTrainingInquiryPayload>
  ): Promise<IApiResponse<ICorporateTrainingResponse>> {
    
    // Enhanced payload with metadata
    const enhancedPayload: ICorporateTrainingInquiryPayload & { form_type: string } = {
      // ✅ Add form_type at root level as required by the API
      form_type: 'corporate_training_inquiry',
      
      form_config: {
        form_type: 'corporate_training_inquiry',
        form_version: '1.0',
        submission_id: this.generateRequestId()
      },
      submission_metadata: {
        timestamp: new Date().toISOString(),
        form_version: '1.0',
        device_info: this.getDeviceInfo(),
        validation_passed: false, // Will be updated after validation
        session_id: sessionStorage.getItem('session_id') || undefined,
        referrer: document.referrer || undefined,
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
      },
      // Add captcha token for production use
      captcha_token: 'development_token', // TODO: Replace with actual reCAPTCHA token
      ...payload
    } as ICorporateTrainingInquiryPayload & { form_type: string };

    // Client-side validation
    const validationResult = CorporateFormValidationService.validateCorporateTrainingForm(enhancedPayload);
    if (!validationResult.isValid) {
      return {
        success: false,
        message: 'Please correct the validation errors before submitting.',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Form validation failed',
          validationErrors: validationResult.errors,
          timestamp: new Date().toISOString(),
          request_id: this.generateRequestId()
        },
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId()
      };
    }

    // Update validation status
    enhancedPayload.submission_metadata.validation_passed = true;

    // 🐛 Debug logging to verify the correct URL is being used
    const fullUrl = `${this.BASE_URL}/submit`;
    console.log('🔍 Corporate Training Form Debug Info:');
    console.log('  - API Base URL:', this.BASE_URL);
    console.log('  - Full Submit URL:', fullUrl);
    console.log('  - Environment:', process.env.NODE_ENV);
    console.log('  - Payload preview:', {
      form_type: enhancedPayload.form_type,
      company_name: enhancedPayload.professional_info?.company_name,
      contact_name: enhancedPayload.contact_info?.full_name,
      training_type: enhancedPayload.training_requirements?.training_type
    });

    return this.retryRequest(() => 
      axios.post<ICorporateTrainingResponse>(
        `${this.BASE_URL}/submit`, // ✅ Fixed: Use correct endpoint
        enhancedPayload,
        {
          timeout: this.REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'X-Form-Version': '1.0',
            'X-Request-ID': enhancedPayload.form_config.submission_id,
            'X-User-Agent': navigator.userAgent
          }
        }
      ),
      this.MAX_RETRIES,
      'corporate-training-submission'
    );
  }

  /**
   * Get Form Configuration for Dynamic Rendering
   */
  static async getFormConfiguration(formType: TFormType): Promise<IApiResponse<IFormConfig>> {
    return this.retryRequest(() =>
      axios.get(`${this.BASE_URL}/config/${formType}`, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId()
        }
      }),
      2, // Fewer retries for config requests
      'get-form-config'
    );
  }

  /**
   * Auto-save Form Data (for logged-in users)
   */
  static async autoSaveFormData(
    formType: TFormType,
    formData: Partial<ICorporateTrainingInquiryPayload>
  ): Promise<IApiResponse<{ saved: boolean; saved_at: string }>> {
    return this.retryRequest(() =>
      axios.post(`${this.BASE_URL}/auto-save`, {
        form_type: formType,
        form_data: formData,
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId()
        }
      }),
      1, // Single retry for auto-save
      'auto-save-form'
    );
  }

  /**
   * Get Auto-Fill Data for Logged-in Users
   */
  static async getAutoFillData(): Promise<IApiResponse<Partial<ICorporateTrainingInquiryPayload>>> {
    return this.retryRequest(() =>
      axios.get(`${this.BASE_URL}/auto-fill-data?form_type=corporate_training_inquiry`, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId(),
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }),
      2,
      'get-auto-fill-data'
    );
  }
}

// Export legacy functions for backward compatibility
export const submitCorporateTrainingInquiry = CorporateTrainingAPIService.submitCorporateTrainingInquiry;

// Export the new enhanced API service as default
export { CorporateTrainingAPIService as CorporateTrainingAPI, CorporateTrainingAPIService as default }; 