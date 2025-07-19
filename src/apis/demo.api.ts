import axios from 'axios';
import { apiBaseUrl, apiUtils } from './index'; // Assuming apiUtils and apiBaseUrl are in index.ts or a common config

// 1. Interfaces for Request and Response Payloads

export type TStudentGrade = "Grade 1-2" | "Grade 3-4" | "Grade 5-6" | "Grade 7-8" | "Grade 9-10" | "Grade 11-12" | "Home Study";
export type THighestQualification = "10th passed" | "12th passed" | "Undergraduate" | "Graduate" | "Post-Graduate";
export type TKnowMedhFrom = "social_media" | "friend" | "online_ad" | "school_event" | "other";
export type TPriority = "low" | "medium" | "high" | "urgent";
export type TStatus = "draft" | "submitted" | "processing" | "completed" | "rejected" | "archived";
export type TSource = "website_form" | "email" | "phone" | "referral" | "social_media" | "other";

export interface IParentDetails {
  name: string;
  email: string;
  mobile_no: string; // International format, e.g., "+919343011613"
  city?: string; // Add current city
  preferred_timings_to_connect?: string; // Add preferred timings
}

export interface IStudentDetailsUnder16 {
  name: string;
  grade: TStudentGrade;
  city: string; // Current City
  state: string;
  preferred_course: string[];
  know_medh_from: TKnowMedhFrom;
  email?: string; // Optional for under 16
  school_name?: string; // Optional for under 16
}

export interface IStudentDetails16AndAbove {
  name: string;
  email: string;
  mobile_no: string; // International format
  city: string; // Current City
  preferred_timings_to_connect?: string; // Optional
  highest_qualification: THighestQualification;
  currently_studying: boolean;
  currently_working: boolean;
  preferred_course: string[];
  know_medh_from: TKnowMedhFrom;
  education_institute_name?: string; // Optional
}

export interface IDemoSessionDetails {
  preferred_date?: string; // ISO date string, e.g., "2024-08-15T00:00:00.000Z"
  preferred_time_slot?: string; // e.g., "04:00 PM - 05:00 PM"
}

export interface IConsent {
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  gdpr_consent?: boolean; // Optional, defaults to false
}

export interface ISubmissionMetadata {
  user_agent?: string;
  timestamp?: string; // Backend will default
  referrer?: string;
  form_version?: string;
  validation_passed?: boolean; // Frontend validation status
}

export interface IBookFreeDemoSessionPayload {
  form_type: "book_a_free_demo_session";
  is_student_under_16: boolean;
  priority?: TPriority;
  status?: TStatus;
  source?: TSource;
  parent_details?: IParentDetails; // Conditional
  student_details: IStudentDetailsUnder16 | IStudentDetails16AndAbove; // Conditional structure
  demo_session_details?: IDemoSessionDetails;
  consent: IConsent;
  additional_notes?: string;
  submission_metadata?: ISubmissionMetadata;
}

// 2. API Response Interfaces

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: string[];
  };
  timestamp?: string;
}

export interface ILiveCourse {
  _id: string;
  title: string;
  description: string;
  // Add any other fields you expect for a live course
}

// 3. API Functions

/**
 * Submits the "Book-A-Free-Demo-Session" form.
 * @param payload - The form data payload.
 * @returns A promise resolving to the API response.
 */
export const submitBookFreeDemoSessionForm = async (
  payload: IBookFreeDemoSessionPayload
): Promise<IApiResponse<any>> => {
  try {
    const response = await axios.post<IApiResponse<any>>(
      `${apiBaseUrl}/forms/book-a-free-demo-session`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "An unexpected error occurred during form submission.",
        error: {
          code: error.response?.data?.error?.code || "FORM_SUBMISSION_ERROR",
          details: error.response?.data?.error?.details || [error.message],
        },
        timestamp: new Date().toISOString(),
      };
    }
    return {
      success: false,
      message: "An unknown error occurred during form submission.",
      error: {
        code: "UNKNOWN_ERROR",
        details: [error instanceof Error ? error.message : "Something went wrong."],
      },
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetches all published live courses.
 * @returns A promise resolving to an array of live courses.
 */
export const getLiveCourses = async (): Promise<IApiResponse<ILiveCourse[]>> => {
  try {
    const response = await axios.get<IApiResponse<ILiveCourse[]>>(
      `${apiBaseUrl}/category/live`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch live courses.",
        error: {
          code: error.response?.data?.error?.code || "FETCH_COURSES_ERROR",
          details: error.response?.data?.error?.details || [error.message],
        },
        timestamp: new Date().toISOString(),
      };
    }
    return {
      success: false,
      message: "An unknown error occurred while fetching live courses.",
      error: {
        code: "UNKNOWN_ERROR",
        details: [error instanceof Error ? error.message : "Something went wrong."],
      },
      timestamp: new Date().toISOString(),
    };
  }
}; 