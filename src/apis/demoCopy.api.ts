import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiBaseUrl } from './config';
import { courseTypesAPI, ILiveCourse as IDetailedLiveCourse } from './courses';

// ========== FORM CONFIG TYPES (Following formjson.md) ==========

export type TFormType = 'book_a_free_demo_session_copy';

export type TFormStep = 
  | 'details' 
  | 'preferences' 
  | 'confirmation' 
  | 'age'
  | 'parent-contact'
  | 'student-info'
  | 'course-preferences'
  | 'communication-preferences'
  | 'consent';

export type TStudentGrade = 
  | 'grade_1-2' | 'grade_3-4' | 'grade_5-6' | 'grade_7-8' 
  | 'grade_9-10' | 'grade_11-12' | 'home_study';

export type THighestQualification = 
  | '10th passed' | '12th passed' | 'Undergraduate' | 'Graduate' | 'Post-Graduate';

export type TKnowMedhFrom = 
  | 'social_media' | 'friends' | 'website' | 'advertisement' | 'other';

export type TPreferredTiming = 
  | 'morning' | 'afternoon' | 'evening' | 'flexible';

// ========== FORM DATA INTERFACES ==========

export interface IContactInfo {
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  email: string;
  mobile_number: {
    country_code: string;
    number: string;
  };
  city: string;
  country: string;
  address?: string;
  linkedin_profile?: string;
  portfolio_url?: string;
}

export interface IParentDetails {
  relationship: 'father' | 'mother' | 'guardian';
  preferred_timings?: TPreferredTiming;
}

export interface IStudentDetailsUnder16 {
  name: string;
  grade: TStudentGrade;
  school_name?: string;
  city?: string;
  state?: string;
  country?: string;
  parent_mobile_access: boolean;
  learning_style_preference: 'visual' | 'auditory' | 'hands_on' | 'reading' | 'mixed';
  know_medh_from: TKnowMedhFrom;
  preferred_course: string[];
  preferred_timings?: TPreferredTiming;
  additional_notes?: string;
}

export interface IStudentDetails16AndAbove {
  name: string;
  email: string;
  mobile_no?: string;
  city?: string;
  state?: string;
  country?: string;
  highest_qualification: THighestQualification;
  currently_studying: boolean;
  currently_working: boolean;
  education_institute_name?: string;
  know_medh_from: TKnowMedhFrom;
  preferred_course: string[];
  preferred_timings?: TPreferredTiming;
  additional_notes?: string;
  school_name?: string;
}

export interface IDemoSessionDetails {
  preferred_date?: string; // ISO string
  preferred_time_slot?: string;
  timezone: string;
  session_duration_preference: '30min' | '45min' | '60min';
  previous_demo_attended: boolean;
}

export interface IConsent {
  terms_accepted?: boolean; // Legacy field
  privacy_policy_accepted?: boolean; // Legacy field
  terms_and_privacy: boolean; // New combined field
  data_collection_consent: boolean;
  marketing_consent: boolean;
  gdpr_consent?: boolean;
  communication_consent?: boolean;
}

export interface IFormConfig {
  form_type: TFormType;
  form_version: string;
  submission_id?: string;
}

export interface ISubmissionMetadata {
  timestamp: string;
  form_version: string;
  device_info: {
    type: 'mobile' | 'desktop';
    os: string;
    browser: string;
    user_agent: string;
    screen_resolution: string;
  };
  validation_passed: boolean;
  session_id?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  form_interaction_time?: number;
}

// ========== LIVE COURSE INTERFACE ==========

export interface ILiveCourse {
  id: string;
  title: string;
  category?: string;
  subcategory?: string;
  instructor?: string;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  currency?: string;
  language?: string;
  max_participants?: number;
  current_participants?: number;
  start_date?: string;
  end_date?: string;
  schedule?: {
    days: string[];
    time: string;
    timezone: string;
  };
  description?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ========== VALIDATION ERROR INTERFACE ==========

export interface IValidationError {
  field: string;
  message: string;
  code: string;
  type: 'required' | 'format' | 'length' | 'custom';
}

// ========== API RESPONSE INTERFACES ==========

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    validationErrors?: IValidationError[];
    timestamp: string;
    request_id: string;
  };
  timestamp: string;
  request_id: string;
}

export interface IDemoSessionResponse {
  booking_id: string;
  student_id: string;
  session_details: {
    date: string;
    time: string;
    duration: string;
    timezone: string;
    meeting_link?: string;
    instructor: {
      name: string;
      email: string;
      profile_image?: string;
    };
  };
  confirmation: {
    email_sent: boolean;
    sms_sent: boolean;
    calendar_invite_sent: boolean;
  };
}

// ========== MAIN FORM PAYLOAD ==========

export interface IBookFreeDemoSessionPayload {
  // Form Configuration
  form_config: {
    form_type: TFormType;
    form_version: string;
    submission_id?: string;
  };
  
  // Core Data
  is_student_under_16: boolean;
  contact_info?: IContactInfo;
  parent_details?: IParentDetails;
  student_details: IStudentDetailsUnder16 | IStudentDetails16AndAbove;
  demo_session_details: IDemoSessionDetails;
  
  // Legal & Preferences
  consent: IConsent;
  marketing_preferences?: {
    email_notifications: boolean;
    sms_notifications: boolean;
    whatsapp_updates: boolean;
    course_recommendations: boolean;
  };
  
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

// ========== ENHANCED VALIDATION CLASS ==========

export class FormValidationService {
  // Basic Validation Methods
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid email address'
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

  static validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
    const isValid = value !== null && value !== undefined && value !== '' && 
                   (Array.isArray(value) ? value.length > 0 : true);
    return {
      isValid,
      error: isValid ? undefined : `${fieldName} is required`
    };
  }

  // Age-specific validation
  static validateStudentAge(
    isUnder16: boolean | null,
    studentDetails: IStudentDetailsUnder16 | IStudentDetails16AndAbove,
    parentDetails?: IParentDetails
  ): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];
    
    if (isUnder16 === null) {
      errors.push({
        field: 'is_student_under_16',
        message: 'Please specify if the student is under 16',
        code: 'AGE_GROUP_REQUIRED',
        type: 'required'
      });
      return { isValid: false, errors };
    }
    
    if (isUnder16) {
      // Validate under 16 student details
      const under16Details = studentDetails as IStudentDetailsUnder16;
      
      if (!under16Details.name?.trim()) {
        errors.push({
          field: 'student_details.name',
          message: 'Student name is required',
          code: 'STUDENT_NAME_REQUIRED',
          type: 'required'
        });
      }
      
      if (!under16Details.grade) {
        errors.push({
          field: 'student_details.grade',
          message: 'Student grade is required',
          code: 'STUDENT_GRADE_REQUIRED',
          type: 'required'
        });
      }
      
      // Parent details are required for under 16
      if (!parentDetails) {
        errors.push({
          field: 'parent_details',
          message: 'Parent details are required for students under 16',
          code: 'PARENT_DETAILS_REQUIRED',
          type: 'required'
        });
      }
    } else {
      // Validate 16+ student details
      const above16Details = studentDetails as IStudentDetails16AndAbove;
      
      if (!above16Details.name?.trim()) {
        errors.push({
          field: 'student_details.name',
          message: 'Student name is required',
          code: 'STUDENT_NAME_REQUIRED',
          type: 'required'
        });
      }
      
      const emailValidation = this.validateEmail(above16Details.email);
      if (!emailValidation.isValid) {
        errors.push({
          field: 'student_details.email',
          message: emailValidation.error!,
          code: 'INVALID_STUDENT_EMAIL',
          type: 'format'
        });
      }
      
      if (!above16Details.highest_qualification) {
        errors.push({
          field: 'student_details.highest_qualification',
          message: 'Highest qualification is required',
          code: 'QUALIFICATION_REQUIRED',
          type: 'required'
        });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Comprehensive Form Validation
  static validateDemoSessionForm(payload: IBookFreeDemoSessionPayload): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    // Validate consent
    if (!payload.consent.terms_accepted && !(payload.consent as any).terms_and_privacy) {
      errors.push({
        field: 'consent.terms_accepted',
        message: 'You must accept the Terms of Service',
        code: 'TERMS_REQUIRED',
        type: 'required'
      });
    }
    
    if (!payload.consent.privacy_policy_accepted && !(payload.consent as any).data_collection_consent) {
      errors.push({
        field: 'consent.privacy_policy_accepted',
        message: 'You must accept the Privacy Policy',
        code: 'PRIVACY_REQUIRED',
        type: 'required'
      });
    }
    
    // Validate student details based on age
    const ageValidation = this.validateStudentAge(
      payload.is_student_under_16,
      payload.student_details,
      payload.parent_details
    );
    errors.push(...ageValidation.errors);
    
    // Validate contact information (always required)
    if (payload.contact_info) {
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
    } else {
      errors.push({
        field: 'contact_info',
        message: 'Contact information is required',
        code: 'CONTACT_INFO_REQUIRED',
        type: 'required'
      });
    }
    
    // Validate course selection
    if (!payload.student_details.preferred_course || payload.student_details.preferred_course.length === 0) {
      errors.push({
        field: 'student_details.preferred_course',
        message: 'Please select at least one preferred course',
        code: 'COURSE_REQUIRED',
        type: 'required'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ========== ENHANCED API SERVICE CLASS ==========

export class DemoSessionAPIService {
  private static readonly BASE_URL = `${apiBaseUrl}/forms`;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;
  private static readonly REQUEST_TIMEOUT = 30000;

  // Utility Methods
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static generateRequestId(): string {
    return `req_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        type: 'server' as const,
        os: 'server',
        browser: 'server',
        user_agent: 'server',
        screen_resolution: '0x0'
      };
    }

    return {
      type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' as const : 'desktop' as const,
      os: navigator.platform || 'Unknown',
      browser: navigator.userAgent.split(' ').pop() || 'Unknown',
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`
    };
  }

  // Enhanced retry mechanism with exponential backoff
  private static async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number,
    operation: string
  ): Promise<IApiResponse<T>> {
    let lastError: AxiosError | Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${operation} (Copy API)`);
        
        const response = await requestFn();
        
        console.log(`✅ ${operation} successful on attempt ${attempt} (Copy API)`);
        return {
          success: true,
          message: 'Request completed successfully',
          data: response.data,
          timestamp: new Date().toISOString(),
          request_id: this.generateRequestId()
        };
        
      } catch (error) {
        lastError = error as AxiosError | Error;
        const axiosError = lastError as AxiosError;
        
        console.warn(`❌ Attempt ${attempt}/${maxRetries} failed for ${operation}:`, {
          status: axiosError?.response?.status,
          message: axiosError?.message,
          data: axiosError?.response?.data
        });
        
        // Don't retry on certain error codes
        if (axiosError?.response?.status && [400, 401, 403, 404, 422].includes(axiosError.response.status)) {
          console.log(`🚫 Not retrying ${operation} due to client error (${axiosError.response.status}) (Copy API)`);
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1);
          console.log(`⏳ Waiting ${delay}ms before retry ${attempt + 1} (Copy API)`);
          await this.delay(delay);
        }
      }
    }
    
    // All retries failed
    if (!lastError) {
      return {
        success: false,
        message: 'Request failed with no error details',
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Request failed with no error details'
        },
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId()
      };
    }
    
    const axiosError = lastError as AxiosError;
    const errorData = axiosError?.response?.data as any;
    
    return {
      success: false,
      message: errorData?.message || axiosError?.message || 'Request failed after all retries',
      error: {
        code: errorData?.code || axiosError?.code || 'REQUEST_FAILED',
        message: errorData?.message || axiosError?.message || 'Unknown error occurred',
        details: errorData,
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId()
      },
      timestamp: new Date().toISOString(),
      request_id: this.generateRequestId()
    };
  }

  /**
   * Submit Demo Session Form with Enhanced Validation and Metadata (Copy Version)
   */
  static async submitBookFreeDemoSessionForm(
    payload: Partial<IBookFreeDemoSessionPayload>
  ): Promise<IApiResponse<IDemoSessionResponse>> {
    
    // Enhanced payload with metadata
    const enhancedPayload: IBookFreeDemoSessionPayload & { form_type: string } = {
      // ✅ Add form_type at root level as required by the API
      form_type: 'book_a_free_demo_session_copy',
      
      form_config: {
        form_type: 'book_a_free_demo_session_copy',
        form_version: '2.1',
        submission_id: this.generateRequestId()
      },
      submission_metadata: {
        timestamp: new Date().toISOString(),
        form_version: '2.1',
        device_info: this.getDeviceInfo(),
        validation_passed: false, // Will be updated after validation
        session_id: typeof window !== 'undefined' ? sessionStorage.getItem('session_id') || undefined : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || undefined : undefined,
        utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || undefined : undefined,
        utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || undefined : undefined
      },
      // Add captcha token for production use
      captcha_token: 'development_token_copy', // TODO: Replace with actual reCAPTCHA token
      ...payload
    } as IBookFreeDemoSessionPayload & { form_type: string };

    // Client-side validation
    const validationResult = FormValidationService.validateDemoSessionForm(enhancedPayload);
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
    const fullUrl = `${this.BASE_URL}/submit-copy`;
    console.log('🔍 Demo Form Copy Debug Info:');
    console.log('  - API Base URL:', this.BASE_URL);
    console.log('  - Full Submit URL:', fullUrl);
    console.log('  - Environment:', process.env.NODE_ENV);
    console.log('  - Payload preview:', {
      form_type: enhancedPayload.form_type,
      is_student_under_16: enhancedPayload.is_student_under_16,
      student_name: enhancedPayload.is_student_under_16 
        ? (enhancedPayload.student_details as any)?.name 
        : (enhancedPayload.contact_info as any)?.full_name
    });

    return this.retryRequest(() => 
      axios.post<IDemoSessionResponse>(
        `${this.BASE_URL}/submit-copy`, // ✅ Modified: Use copy endpoint
        enhancedPayload,
        {
          timeout: this.REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'X-Form-Version': '2.1',
            'X-Request-ID': enhancedPayload.form_config.submission_id,
            'X-User-Agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
            'X-Form-Copy': 'true' // Indicate this is from the copy form
          }
        }
      ),
      this.MAX_RETRIES,
      'demo-session-submission-copy'
    );
  }

  /**
   * Get Available Live Courses for Demo Selection (Copy Version)
   */
  static async getAvailableLiveCourses(
    filters?: {
      category?: string;
      level?: 'beginner' | 'intermediate' | 'advanced';
      language?: string;
      upcoming_only?: boolean;
    }
  ): Promise<IApiResponse<ILiveCourse[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.level) queryParams.append('level', filters.level);
    if (filters?.language) queryParams.append('language', filters.language);
    if (filters?.upcoming_only) queryParams.append('upcoming_only', 'true');
    
    const queryString = queryParams.toString();
    const url = `${this.BASE_URL}/live-courses-copy${queryString ? '?' + queryString : ''}`;
    
    return this.retryRequest(() =>
      axios.get<ILiveCourse[]>(url, {
        timeout: 10000,
        headers: {
          'X-Request-ID': this.generateRequestId(),
          'X-Form-Copy': 'true'
        }
      }),
      2, // Fewer retries for data fetching
      'get-live-courses-copy'
    );
  }

  /**
   * Get Available Time Slots for Demo Sessions (Copy Version)
   */
  static async getAvailableTimeSlots(
    date?: string,
    timezone: string = 'UTC'
  ): Promise<IApiResponse<{ date: string; slots: string[] }[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('timezone', timezone);
    if (date) queryParams.append('date', date);
    
    const url = `${this.BASE_URL}/available-slots-copy?${queryParams.toString()}`;
    
    return this.retryRequest(() =>
      axios.get(url, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId(),
          'X-Form-Copy': 'true'
        }
      }),
      2,
      'get-available-time-slots-copy'
    );
  }

  /**
   * Get Form Configuration for Dynamic Rendering (Copy Version)
   */
  static async getFormConfiguration(formType: TFormType): Promise<IApiResponse<IFormConfig>> {
    return this.retryRequest(() =>
      axios.get(`${this.BASE_URL}/config-copy/${formType}`, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId(),
          'X-Form-Copy': 'true'
        }
      }),
      2, // Fewer retries for config requests
      'get-form-config-copy'
    );
  }

  /**
   * Auto-save Form Data (for logged-in users) (Copy Version)
   */
  static async autoSaveFormData(
    formType: TFormType,
    formData: Partial<IBookFreeDemoSessionPayload>
  ): Promise<IApiResponse<{ saved: boolean; saved_at: string }>> {
    return this.retryRequest(() =>
      axios.post(`${this.BASE_URL}/auto-save-copy`, {
        form_type: formType,
        form_data: formData,
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000,
        headers: {
          'X-Request-ID': this.generateRequestId(),
          'X-Form-Copy': 'true'
        }
      }),
      1, // Single retry for auto-save
      'auto-save-form-copy'
    );
  }
}

// Export the new enhanced API service as default
export { DemoSessionAPIService as DemoSessionAPI, DemoSessionAPIService as default }; 