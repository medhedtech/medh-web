import { IApiResponse } from './apiClient';
import { ApiClient } from './apiClient';
import { apiBaseUrl } from './config'; // Import apiBaseUrl from config.ts

// 1. Interfaces for School Partnership Form Data

export interface ISchoolContactInfo {
  full_name: string;
  designation: string;
  email: string;
  country: string;
  phone_number: string;
}

export interface ISchoolInfo {
  school_name: string;
  school_type: string;
  city_state: string;
  student_count: string;
  website?: string | null;
}

export interface IPartnershipInfo {
  services_of_interest: string[];
  additional_notes?: string;
}

export interface ISchoolPartnershipFormData {
  contact_info: ISchoolContactInfo;
  school_info: ISchoolInfo;
  partnership_info: IPartnershipInfo;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  message?: string; // Corresponds to the 'message' field in the provided JSON
  form_type: 'school_partnership_inquiry';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected' | 'archived';
  source?: 'website_form' | 'email' | 'phone' | 'referral' | 'social_media' | 'other';
  submission_metadata?: {
    user_agent?: string;
    timestamp?: string;
    referrer?: string;
    form_version?: string;
  };
}

// 2. API Functions

const schoolFormApiClient = new ApiClient({
  baseUrl: apiBaseUrl, // Use apiBaseUrl from config.ts
});

/**
 * Submits a school partnership inquiry form.
 * @param data The form data to submit.
 * @returns A promise that resolves to the API response.
 */
export const submitSchoolPartnershipForm = async (
  data: ISchoolPartnershipFormData
): Promise<IApiResponse<any>> => {
  return schoolFormApiClient.post<any>(
    `/forms/school-partnership`, // Updated endpoint as per documentation
    data
  );
};

/**
 * Fetches all school partnership inquiries (admin only).
 * @param params Query parameters for filtering and pagination.
 * @returns A promise that resolves to the API response containing a list of inquiries.
 */
export const getSchoolPartnershipInquiries = async (
  params?: Record<string, any>
): Promise<IApiResponse<ISchoolPartnershipFormData[]>> => {
  return schoolFormApiClient.get<ISchoolPartnershipFormData[]>(
    `/forms/admin/school-partnership`, // Updated endpoint as per documentation
    params
  );
}; 