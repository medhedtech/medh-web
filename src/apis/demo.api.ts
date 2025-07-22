import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiBaseUrl } from './index';

// Enhanced Types and Enums
export type TStudentGrade = "Grade 1-2" | "Grade 3-4" | "Grade 5-6" | "Grade 7-8" | "Grade 9-10" | "Grade 11-12" | "Home Study";
export type THighestQualification = "10th passed" | "12th passed" | "Undergraduate" | "Graduate" | "Post-Graduate";
export type TKnowMedhFrom = "social_media" | "friend" | "online_ad" | "school_event" | "other";
export type TPriority = "low" | "medium" | "high" | "urgent";
export type TStatus = "draft" | "submitted" | "processing" | "completed" | "rejected" | "archived";
export type TSource = "website_form" | "email" | "phone" | "referral" | "social_media" | "other";
export type TFormType = "book_a_free_demo_session";

// Enhanced Validation Types
export interface IValidationError {
  field: string;
  message: string;
  code: string;
}

export interface IApiError {
  code: string;
  message: string;
  details?: string[];
  validationErrors?: IValidationError[];
  statusCode?: number;
}

// Enhanced Parent Details Interface
export interface IParentDetails {
  name: string;
  email: string;
  mobile_no: string;
  city: string;
  preferred_timings_to_connect?: string;
  country?: string; // Added country field
}

// Enhanced Student Details Interfaces
export interface IStudentDetailsUnder16 {
  name: string;
  grade: TStudentGrade;
  city: string;
  state: string;
  preferred_course: string[];
  know_medh_from: TKnowMedhFrom;
  email?: string;
  school_name?: string;
  country?: string; // Added country field
}

export interface IStudentDetails16AndAbove {
  name: string;
  email: string;
  mobile_no: string;
  city: string;
  preferred_timings_to_connect?: string;
  highest_qualification: THighestQualification;
  currently_studying: boolean;
  currently_working: boolean;
  preferred_course: string[];
  know_medh_from: TKnowMedhFrom;
  education_institute_name?: string;
  country?: string; // Added country field
}

// Enhanced Demo Session Details
export interface IDemoSessionDetails {
  preferred_date?: Date; // Changed from string to Date
  preferred_time_slot?: string;
  special_requirements?: string; // Added special requirements
  timezone?: string; // Added timezone support
}

// Enhanced Consent Interface
export interface IConsent {
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  gdpr_consent?: boolean;
  marketing_consent?: boolean; // Added marketing consent
}

// Enhanced Submission Metadata
export interface ISubmissionMetadata {
  user_agent?: string;
  timestamp?: string;
  referrer?: string;
  form_version?: string;
  validation_passed?: boolean;
  session_id?: string; // Added session tracking
  ip_address?: string; // Added IP tracking
  device_info?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
}

// Main Form Payload Interface
export interface IBookFreeDemoSessionPayload {
  form_type: TFormType;
  is_student_under_16: boolean;
  priority?: TPriority;
  status?: TStatus;
  source?: TSource;
  parent_details?: IParentDetails;
  student_details: IStudentDetailsUnder16 | IStudentDetails16AndAbove;
  demo_session_details?: IDemoSessionDetails;
  consent: IConsent;
  additional_notes?: string;
  submission_metadata?: ISubmissionMetadata;
}

// Enhanced API Response Interface
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IApiError;
  timestamp?: string;
  request_id?: string; // Added request tracking
}

// Demo Session Response Data
export interface IDemoSessionResponse {
  submission_id: string;
  confirmation_number: string;
  scheduled_date?: Date;
  scheduled_time?: string;
  meeting_link?: string;
  instructor_details?: {
    name: string;
    email: string;
    phone?: string;
  };
  next_steps: string[];
  estimated_response_time: string;
  status: TStatus;
}

// Live Course Interface (Enhanced)
export interface ILiveCourse {
  _id: string;
  title: string;
  description: string;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  instructor?: {
    name: string;
    expertise: string[];
  };
  prerequisites?: string[];
  is_active: boolean;
  demo_available: boolean;
}

// Validation Utilities
export class FormValidation {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phone: string): boolean {
    // Basic international phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  }

  static validateCity(city: string): boolean {
    return city.trim().length >= 2 && city.trim().length <= 50;
  }

  static validateGrade(grade: TStudentGrade): boolean {
    const validGrades: TStudentGrade[] = [
      "Grade 1-2", "Grade 3-4", "Grade 5-6", "Grade 7-8", 
      "Grade 9-10", "Grade 11-12", "Home Study"
    ];
    return validGrades.includes(grade);
  }

  static validateParentDetails(details: IParentDetails): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!this.validateName(details.name)) {
      errors.push({
        field: 'parent.name',
        message: 'Parent name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    if (!this.validateEmail(details.email)) {
      errors.push({
        field: 'parent.email',
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    if (!this.validatePhoneNumber(details.mobile_no)) {
      errors.push({
        field: 'parent.mobile_no',
        message: 'Please provide a valid phone number',
        code: 'INVALID_PHONE'
      });
    }

    if (!this.validateCity(details.city)) {
      errors.push({
        field: 'parent.city',
        message: 'City name must be between 2 and 50 characters',
        code: 'INVALID_CITY'
      });
    }

    return errors;
  }

  static validateStudentDetailsUnder16(details: IStudentDetailsUnder16): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!this.validateName(details.name)) {
      errors.push({
        field: 'student.name',
        message: 'Student name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    if (!this.validateGrade(details.grade)) {
      errors.push({
        field: 'student.grade',
        message: 'Please select a valid grade',
        code: 'INVALID_GRADE'
      });
    }

    if (!this.validateCity(details.city)) {
      errors.push({
        field: 'student.city',
        message: 'City name must be between 2 and 50 characters',
        code: 'INVALID_CITY'
      });
    }

    if (!details.state.trim() || details.state.trim().length < 2) {
      errors.push({
        field: 'student.state',
        message: 'State is required and must be at least 2 characters',
        code: 'INVALID_STATE'
      });
    }

    if (!details.preferred_course.length) {
      errors.push({
        field: 'student.preferred_course',
        message: 'Please select at least one preferred course',
        code: 'COURSE_REQUIRED'
      });
    }

    if (details.email && !this.validateEmail(details.email)) {
      errors.push({
        field: 'student.email',
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    return errors;
  }

  static validateStudentDetails16AndAbove(details: IStudentDetails16AndAbove): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!this.validateName(details.name)) {
      errors.push({
        field: 'student.name',
        message: 'Student name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    if (!this.validateEmail(details.email)) {
      errors.push({
        field: 'student.email',
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    if (!this.validatePhoneNumber(details.mobile_no)) {
      errors.push({
        field: 'student.mobile_no',
        message: 'Please provide a valid phone number',
        code: 'INVALID_PHONE'
      });
    }

    if (!this.validateCity(details.city)) {
      errors.push({
        field: 'student.city',
        message: 'City name must be between 2 and 50 characters',
        code: 'INVALID_CITY'
      });
    }

    if (!details.preferred_course.length) {
      errors.push({
        field: 'student.preferred_course',
        message: 'Please select at least one preferred course',
        code: 'COURSE_REQUIRED'
      });
    }

    return errors;
  }

  static validateConsent(consent: IConsent): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!consent.terms_accepted) {
      errors.push({
        field: 'consent.terms_accepted',
        message: 'You must accept the Terms of Use to proceed',
        code: 'TERMS_REQUIRED'
      });
    }

    if (!consent.privacy_policy_accepted) {
      errors.push({
        field: 'consent.privacy_policy_accepted',
        message: 'You must accept the Privacy Policy to proceed',
        code: 'PRIVACY_REQUIRED'
      });
    }

    return errors;
  }

  static validatePayload(payload: IBookFreeDemoSessionPayload): IValidationError[] {
    const errors: IValidationError[] = [];

    // Validate consent
    errors.push(...this.validateConsent(payload.consent));

    // Validate based on age group
    if (payload.is_student_under_16) {
      if (payload.parent_details) {
        errors.push(...this.validateParentDetails(payload.parent_details));
      } else {
        errors.push({
          field: 'parent_details',
          message: 'Parent details are required for students under 16',
          code: 'PARENT_DETAILS_REQUIRED'
        });
      }
      errors.push(...this.validateStudentDetailsUnder16(payload.student_details as IStudentDetailsUnder16));
    } else {
      errors.push(...this.validateStudentDetails16AndAbove(payload.student_details as IStudentDetails16AndAbove));
    }

    return errors;
  }
}

// Enhanced Error Handler
export class ApiErrorHandler {
  static handleAxiosError(error: AxiosError): IApiResponse {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
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
          statusCode: status
        },
        timestamp: new Date().toISOString()
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: 'Unable to connect to the server. Please check your internet connection.',
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed',
          details: ['Please check your internet connection and try again.']
        },
        timestamp: new Date().toISOString()
      };
    } else {
      // Request setup error
      return {
        success: false,
        message: 'An unexpected error occurred while processing your request.',
        error: {
          code: 'REQUEST_ERROR',
          message: 'Request configuration error',
          details: [error.message]
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private static getStatusMessage(status: number): string {
    switch (status) {
      case 400: return 'Invalid request data provided.';
      case 401: return 'Authentication required.';
      case 403: return 'Access denied.';
      case 404: return 'The requested resource was not found.';
      case 422: return 'Validation errors occurred.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'Internal server error. Please try again later.';
      case 502: return 'Server is temporarily unavailable.';
      case 503: return 'Service is temporarily unavailable.';
      default: return 'An unexpected error occurred.';
    }
  }
}

// Enhanced API Functions with retry logic
export class DemoSessionAPI {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries = this.MAX_RETRIES
  ): Promise<IApiResponse<T>> {
    try {
      const response = await requestFn();
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (retries > 0 && axios.isAxiosError(error)) {
        // Retry on network errors or 5xx server errors
        const shouldRetry = 
          !error.response || 
          (error.response.status >= 500 && error.response.status < 600);
          
        if (shouldRetry) {
          await this.delay(this.RETRY_DELAY);
          return this.retryRequest(requestFn, retries - 1);
        }
      }
      
      if (axios.isAxiosError(error)) {
        return ApiErrorHandler.handleAxiosError(error);
      }
      
      return {
        success: false,
        message: 'An unknown error occurred.',
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Something went wrong.',
          details: [error instanceof Error ? error.message : 'Unknown error']
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Submit the "Book-A-Free-Demo-Session" form with validation and retry logic
   */
  static async submitBookFreeDemoSessionForm(
    payload: IBookFreeDemoSessionPayload
  ): Promise<IApiResponse<IDemoSessionResponse>> {
    // Client-side validation
    const validationErrors = FormValidation.validatePayload(payload);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: 'Please correct the validation errors before submitting.',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Form validation failed',
          validationErrors
        },
        timestamp: new Date().toISOString()
      };
    }

    // Convert Date objects to ISO strings for API
    const apiPayload = {
      ...payload,
      demo_session_details: payload.demo_session_details ? {
        ...payload.demo_session_details,
        preferred_date: payload.demo_session_details.preferred_date 
          ? payload.demo_session_details.preferred_date.toISOString()
          : undefined
      } : undefined,
      submission_metadata: {
        ...payload.submission_metadata,
        timestamp: new Date().toISOString(),
        form_version: '2.0'
      }
    };

    return this.retryRequest(() => 
      axios.post<IDemoSessionResponse>(
        `${apiBaseUrl}/forms/book-a-free-demo-session`,
        apiPayload,
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
            'X-Form-Version': '2.0'
          }
        }
      )
    );
  }

  /**
   * Fetch all published live courses with caching
   */
  static async getLiveCourses(): Promise<IApiResponse<ILiveCourse[]>> {
    return this.retryRequest(() =>
      axios.get<ILiveCourse[]>(
        `${apiBaseUrl}/category/live`,
        {
          timeout: 15000, // 15 second timeout
          headers: {
            'Cache-Control': 'max-age=300' // Cache for 5 minutes
          }
        }
      )
    );
  }

  /**
   * Get available time slots for a specific date
   */
  static async getAvailableTimeSlots(
    date: Date,
    courseId?: string
  ): Promise<IApiResponse<{ time_slot: string; available: boolean; instructor?: string }[]>> {
    const queryParams = new URLSearchParams({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      ...(courseId && { course_id: courseId })
    });

    return this.retryRequest(() =>
      axios.get(
        `${apiBaseUrl}/demo-sessions/available-slots?${queryParams.toString()}`,
        {
          timeout: 10000,
          headers: {
            'Cache-Control': 'max-age=60' // Cache for 1 minute
          }
        }
      )
    );
  }

  /**
   * Check if a demo session can be rescheduled
   */
  static async checkRescheduleAvailability(
    submissionId: string
  ): Promise<IApiResponse<{ can_reschedule: boolean; available_dates: Date[] }>> {
    return this.retryRequest(() =>
      axios.get(`${apiBaseUrl}/demo-sessions/${submissionId}/reschedule-options`, {
        timeout: 10000
      })
    );
  }
}

// Export legacy functions for backward compatibility
export const submitBookFreeDemoSessionForm = DemoSessionAPI.submitBookFreeDemoSessionForm;
export const getLiveCourses = DemoSessionAPI.getLiveCourses;

// Export new enhanced API
export { DemoSessionAPI as default }; 