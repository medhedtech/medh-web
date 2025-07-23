import { IApiResponse } from './apiClient';
import { ApiClient } from './apiClient';
import { apiBaseUrl } from './config';

// 1. Interfaces for Educator Registration Form Data

export interface IEducatorContactInfo {
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
}

export interface IEducatorProfessionalInfo {
  current_role: string;
  experience_years: string; // e.g., "1-3", "3-5"
  expertise_areas: string[];
  education_background: string;
  current_company?: string;
}

export interface IEducatorTeachingPreferences {
  preferred_subjects: string[];
  teaching_mode: string[]; // e.g., "Online Live Sessions", "Recorded Content"
  availability: string; // e.g., "weekdays", "weekends", "flexible"
  portfolio_links?: string | null;
  demo_video_url?: string | null;
  has_resume: boolean;
}

export interface IEducatorConsent {
  terms_accepted: boolean;
  background_check_consent: boolean;
}

export interface IEducatorRegistrationFormData {
  form_type: 'educator_registration';
  contact_info: IEducatorContactInfo;
  professional_info: IEducatorProfessionalInfo;
  teaching_preferences: IEducatorTeachingPreferences;
  consent: IEducatorConsent;
  additional_notes?: string;
  message?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected' | 'archived';
  source?: 'website_form' | 'email' | 'phone' | 'referral' | 'social_media' | 'other' | 'campaign';
  submission_metadata?: {
    user_agent?: string;
    timestamp?: string;
    referrer?: string;
    form_version?: string;
    validation_passed?: boolean;
  };
}

// 2. API Functions

const educatorFormApiClient = new ApiClient({
  baseUrl: apiBaseUrl,
});

/**
 * Submits an educator registration form.
 * @param data The form data to submit.
 * @returns A promise that resolves to the API response.
 */
export const submitEducatorRegistrationForm = async (
  data: IEducatorRegistrationFormData
): Promise<IApiResponse<any>> => {
  return educatorFormApiClient.post<any>(
    `/forms/educator-registration`,
    data
  );
};

/**
 * Fetches all educator registration forms (admin only).
 * @param params Query parameters for filtering and pagination.
 * @returns A promise that resolves to the API response containing a list of inquiries.
 */
export const getEducatorRegistrationForms = async (
  params?: Record<string, any>
): Promise<IApiResponse<IEducatorRegistrationFormData[]>> => {
  return educatorFormApiClient.get<IEducatorRegistrationFormData[]>(
    `/forms/admin/educator-registration`,
    params
  );
}; 