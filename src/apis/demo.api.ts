import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiBaseUrl } from './index';
import { courseTypesAPI, ILiveCourse as IDetailedLiveCourse } from './courses';

// ========== FORM CONFIG TYPES (Following formjson.md) ==========

export type TFormType = 'book_a_free_demo_session';
export type TFormStep = 'details' | 'preferences' | 'confirmation';
export type TFormStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected';

// Form Configuration Interface
export interface IFormConfig {
  form_id: string;
  form_type: TFormType;
  title: string;
  description: string;
  category: string;
  ui_theme: 'modern' | 'educational' | 'professional';
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

// ========== STUDENT & CONTACT TYPES ==========

export type TStudentGrade = "Grade 1-2" | "Grade 3-4" | "Grade 5-6" | "Grade 7-8" | "Grade 9-10" | "Grade 11-12" | "Home Study";
export type THighestQualification = "10th passed" | "12th passed" | "Undergraduate" | "Graduate" | "Post-Graduate";
export type TKnowMedhFrom = "social_media" | "friend" | "online_ad" | "school_event" | "other";
export type TPreferredTiming = "morning" | "afternoon" | "evening" | "flexible";

// Enhanced Contact Information (matches backend schema)
export interface IContactInfo {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  mobile_number: {
    country_code: string;
    number: string;
  };
  city: string;
  state?: string;
  country?: string;
  preferred_contact_method?: 'email' | 'phone' | 'whatsapp';
}

// Parent Details (simplified - only parent-specific fields)
export interface IParentDetails {
  relationship?: 'father' | 'mother' | 'guardian';
  occupation?: string;
  preferred_timings_to_connect?: TPreferredTiming;
}

// Student Details Base
interface IStudentDetailsBase {
  name: string;
  city: string;
  state?: string;
  country?: string;
  preferred_course: string[];
  know_medh_from: TKnowMedhFrom;
  school_name?: string;
  additional_notes?: string;
}

// Student Details for Under 16 (with corrected grade format)
export interface IStudentDetailsUnder16 extends IStudentDetailsBase {
  grade: 'grade_1-2' | 'grade_3-4' | 'grade_5-6' | 'grade_7-8' | 'grade_9-10' | 'grade_11-12' | 'home_study';
  parent_mobile_access: boolean;
  learning_style_preference?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

// Student Details for 16 and Above
export interface IStudentDetails16AndAbove extends IStudentDetailsBase {
  email?: string;
  mobile_no?: string;
  country_code?: string;
  highest_qualification: THighestQualification;
  currently_studying: boolean;
  currently_working: boolean;
  preferred_timings_to_connect?: TPreferredTiming;
  education_institute_name?: string;
  work_experience_years?: number;
  career_goals?: string[];
  linkedin_profile?: string;
}

// ========== DEMO SESSION & PREFERENCES ==========

export interface IDemoSessionDetails {
  preferred_date?: Date;
  preferred_time_slot?: string;
  timezone?: string;
  session_duration_preference?: '30min' | '45min' | '60min';
  learning_objectives?: string[];
  specific_topics_interest?: string[];
  previous_demo_attended?: boolean;
  device_preference?: 'computer' | 'tablet' | 'mobile';
  internet_quality?: 'excellent' | 'good' | 'average' | 'poor';
  special_requirements?: string;
  language_preference?: 'english' | 'hindi' | 'regional';
}

// ========== CONSENT & PRIVACY ==========

export interface IConsent {
  // Legacy field names (for form compatibility)
  terms_accepted?: boolean;
  privacy_policy_accepted?: boolean;
  gdpr_consent?: boolean;
  marketing_consent?: boolean;
  data_processing_consent?: boolean;
  communication_consent?: boolean;
  
  // Backend expected field names
  terms_and_privacy?: boolean;
  data_collection_consent?: boolean;
  
  // Optional additional consent fields
  third_party_sharing_consent?: boolean;
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

// Demo Session Response Data
export interface IDemoSessionResponse {
  submission_id: string;
  confirmation_number: string;
  application_status: TFormStatus;
  
  // Session Details
  scheduled_session?: {
    date: Date;
    time: string;
    duration: string;
  meeting_link?: string;
    meeting_id?: string;
    meeting_password?: string;
  };
  
  // Instructor Information
  instructor_details?: {
    name: string;
    email: string;
    phone?: string;
    expertise: string[];
    profile_image?: string;
    bio?: string;
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
  
  // Additional Resources
  preparation_materials?: Array<{
    title: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
    description?: string;
  }>;
  
  // Support Information
  support_contact: {
    email: string;
    phone: string;
    available_hours: string;
  };
}

// Live Course Enhanced Interface
export interface ILiveCourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'live' | 'recorded' | 'hybrid';
  
  // Course Details
  instructor?: {
    name: string;
    expertise: string[];
    experience_years: number;
  };
  
  // Scheduling
  schedule?: {
    start_date: Date;
    end_date: Date;
    sessions_per_week: number;
    session_duration: string;
    time_slots: string[];
  };
  
  // Pricing & Availability
  pricing?: {
    regular_price: number;
    discounted_price?: number;
    currency: string;
  };
  
  // Meta Information
  prerequisites: string[];
  learning_outcomes: string[];
  is_active: boolean;
  demo_available: boolean;
  enrollment_status: 'open' | 'closed' | 'waitlist';
  capacity?: number;
  enrolled_students?: number;
  
  // SEO & Marketing
  tags?: string[];
  featured_image?: string;
  video_preview?: string;
  testimonials?: Array<{
    student_name: string;
    rating: number;
    comment: string;
  }>;
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

  // Business Logic Validation
  static validateStudentAge(isUnder16: boolean, studentDetails: any, parentDetails?: any): { isValid: boolean; errors: IValidationError[] } {
    const errors: IValidationError[] = [];

    if (isUnder16 && !parentDetails) {
      errors.push({
        field: 'parent_details',
        message: 'Parent details are required for students under 16',
        code: 'PARENT_DETAILS_REQUIRED',
        type: 'business_logic'
      });
    }
    
    if (isUnder16 && !studentDetails.grade) {
      errors.push({
        field: 'student_details.grade',
        message: 'Grade is required for students under 16',
        code: 'GRADE_REQUIRED',
        type: 'business_logic'
      });
    }
    
    if (!isUnder16 && !studentDetails.mobile_no) {
      errors.push({
        field: 'student_details.mobile_no',
        message: 'Mobile number is required for students 16 and above',
        code: 'MOBILE_REQUIRED',
        type: 'business_logic'
      });
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
   * Submit Demo Session Form with Enhanced Validation and Metadata
   */
  static async submitBookFreeDemoSessionForm(
    payload: Partial<IBookFreeDemoSessionPayload>
  ): Promise<IApiResponse<IDemoSessionResponse>> {
    
    // Enhanced payload with metadata
    const enhancedPayload: IBookFreeDemoSessionPayload & { form_type: string } = {
      // ✅ Add form_type at root level as required by the API
      form_type: 'book_a_free_demo_session',
      
      form_config: {
        form_type: 'book_a_free_demo_session',
        form_version: '2.1',
        submission_id: this.generateRequestId()
      },
      submission_metadata: {
        timestamp: new Date().toISOString(),
        form_version: '2.1',
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
    const fullUrl = `${this.BASE_URL}/submit`;
    console.log('🔍 Demo Form Debug Info:');
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
        `${this.BASE_URL}/submit`, // ✅ Fixed: Use correct endpoint
        enhancedPayload,
        {
          timeout: this.REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'X-Form-Version': '2.1',
            'X-Request-ID': enhancedPayload.form_config.submission_id,
            'X-User-Agent': navigator.userAgent
          }
        }
      ),
      this.MAX_RETRIES,
      'demo-session-submission'
    );
  }

  /**
   * Get Live Courses with Enhanced Filtering and Caching
   */
  static async getLiveCourses(options?: {
    category?: string;
    level?: string;
    include_inactive?: boolean;
  }): Promise<IApiResponse<ILiveCourse[]>> {
    try {
      const response = await courseTypesAPI.getCoursesByType<IDetailedLiveCourse>('live');
      
      if (response?.data?.success && response.data.data) {
        const liveCourses: ILiveCourse[] = Array.isArray(response.data.data) 
          ? response.data.data
              .filter(course => 
                course.status === 'Published' &&
                (!options?.category || course.course_category === options.category) &&
                (!options?.level || course.course_level?.toLowerCase() === options.level)
              )
              .map(course => ({
                _id: course._id || '',
                title: course.course_title,
                description: course.course_description?.program_overview || course.course_subtitle || '',
                category: course.course_category || 'General',
                subcategory: course.course_subcategory,
                duration: course.course_duration,
                level: (course.course_level?.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
                format: 'live' as const,
                instructor: course.instructors && course.instructors.length > 0 
                  ? {
                      name: course.instructors[0],
                      expertise: [],
                      experience_years: 0
                    }
                  : undefined,
                prerequisites: course.prerequisites || [],
                learning_outcomes: [],
                is_active: course.status === 'Published',
                demo_available: true,
                enrollment_status: 'open' as const,
                tags: []
              })) 
          : [];
        
        return {
          success: true,
          data: liveCourses,
          timestamp: new Date().toISOString(),
          request_id: this.generateRequestId()
        };
      } else {
        throw new Error('Invalid response format from course API');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return ApiErrorHandler.handleAxiosError(error, 'get-live-courses');
      }
      
      return {
        success: false,
        message: 'An unknown error occurred while fetching live courses.',
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
   * Get Available Time Slots for Demo Sessions
   */
  static async getAvailableTimeSlots(
    date: Date,
    options?: { courseId?: string; timezone?: string }
  ): Promise<IApiResponse<Array<{ time_slot: string; available: boolean; instructor?: string; capacity?: number }>>> {
    const queryParams = new URLSearchParams({
      date: date.toISOString().split('T')[0],
      ...(options?.courseId && { course_id: options.courseId }),
      ...(options?.timezone && { timezone: options.timezone })
    });

    return this.retryRequest(() =>
      axios.get(
        `${this.BASE_URL}/demo-sessions/available-slots?${queryParams.toString()}`,
        {
          timeout: 10000,
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
            'X-Request-ID': this.generateRequestId()
          }
        }
      ),
      this.MAX_RETRIES,
      'get-time-slots'
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
    formData: Partial<IBookFreeDemoSessionPayload>
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
}

// Export legacy functions for backward compatibility
export const submitBookFreeDemoSessionForm = DemoSessionAPIService.submitBookFreeDemoSessionForm;
export const getLiveCourses = DemoSessionAPIService.getLiveCourses;

// Export the new enhanced API service as default
export { DemoSessionAPIService as DemoSessionAPI, DemoSessionAPIService as default }; 