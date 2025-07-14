import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';

/**
 * Brochure type definitions
 */
export interface IBrochure {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  courseId?: string; // Optional: if brochure is associated with a specific course
  courseName?: string; // Optional: if brochure is associated with a specific course
  createdAt: string;
  updatedAt: string;
}

export interface IBrochureCreateInput {
  title: string;
  description?: string;
  fileUrl: string;
  courseId?: string;
}

export interface IBrochureUpdateInput extends Partial<IBrochureCreateInput> {}

/**
 * API Response Interfaces
 */
export interface IBrochuresResponse {
  success: boolean;
  message: string;
  data: {
    brochures: IBrochure[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IBrochureResponse {
  success: boolean;
  message: string;
  data: {
    brochure: IBrochure;
  };
}

/**
 * Brochure API service
 */
export const brochureAPI = {
  /**
   * Create a new brochure
   * @param brochureData - Brochure data to create
   * @returns Promise with created brochure response
   */
  createBrochure: async (brochureData: IBrochureCreateInput) => {
    return apiClient.post<IBrochureResponse>(
      `${apiBaseUrl}/broucher/create`,
      brochureData
    );
  },

  /**
   * Get all brochures with optional filtering
   * @param params - Query parameters for filtering (page, limit, search)
   * @returns Promise with brochure list response
   */
  getAllBrochures: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBrochuresResponse>(
      `${apiBaseUrl}/broucher${queryString}`
    );
  },

  /**
   * Get a specific brochure by ID
   * @param id - Brochure ID
   * @returns Promise with brochure detail response
   */
  getBrochureById: async (id: string) => {
    if (!id) throw new Error('Brochure ID cannot be empty');
    return apiClient.get<IBrochureResponse>(
      `${apiBaseUrl}/broucher/${id}`
    );
  },

  /**
   * Update an existing brochure
   * @param id - Brochure ID to update
   * @param updateData - Updated brochure data
   * @returns Promise with updated brochure response
   */
  updateBrochure: async (id: string, updateData: IBrochureUpdateInput) => {
    if (!id) throw new Error('Brochure ID cannot be empty');
    return apiClient.put<IBrochureResponse>(
      `${apiBaseUrl}/broucher/update/${id}`,
      updateData
    );
  },

  /**
   * Delete a brochure
   * @param id - Brochure ID to delete
   * @returns Promise with deletion response
   */
  deleteBrochure: async (id: string) => {
    if (!id) throw new Error('Brochure ID cannot be empty');
    return apiClient.delete<{ message: string }>(
      `${apiBaseUrl}/broucher/delete/${id}`
    );
  },

  /**
   * Download a brochure for a specific course (for logged-in users)
   * @param courseId - Course ID to download brochure for
   * @returns Promise with download response containing brochureUrl
   */
  downloadBrochure: async (courseId: string) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.get<{ 
      success: boolean; 
      message: string; 
      data: { 
        brochureUrl: string; 
        course_title: string;
        course_type: string;
      } 
    }>(`${apiBaseUrl}/broucher/download/${courseId}`);
  },

  /**
   * Download a brochure with user data collection (for non-logged-in users)
   * @param courseId - Course ID to download brochure for
   * @param userData - User data for lead generation
   * @returns Promise with download response
   */
  downloadBrochureWithData: async (courseId: string, userData: {
    full_name: string;
    email: string;
    phone_number: string;
  }) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.post<{ 
      success: boolean; 
      message: string; 
      data: { 
        brochureUrl: string; 
        course_title: string;
        recordId: string;
      } 
    }>(`${apiBaseUrl}/broucher/download/${courseId}`, userData);
  },

  /**
   * Request a brochure (using the create endpoint for email sending)
   * @param data - Request data including user info and course title
   * @returns Promise with request response
   */
  requestBrochure: async (data: {
    full_name: string;
    email: string;
    phone_number: string;
    course_title: string;
    course_id?: string;
  }) => {
    return apiClient.post<{ 
      success: boolean; 
      message: string; 
      data: any;
    }>(`${apiBaseUrl}/broucher/create`, data);
  },

  /**
   * Track a brochure download for analytics
   * @param data - Tracking data including brochure/course ID, user ID, source, and metadata
   * @returns Promise with tracking response
   */
  trackBrochureDownload: async (data: {
    brochure_id?: string;
    course_id?: string;
    user_id?: string; // Optional: if user is authenticated
    source?: string;
    metadata?: { [key: string]: any };
  }) => {
    return apiClient.post<{ message: string }>(
      `${apiBaseUrl}/broucher/track-download`,
      data
    );
  },

  /**
   * Upload a brochure PDF for a course (replaces previous brochures)
   * @param courseId - The course ID
   * @param file - The PDF file to upload
   * @param token - JWT token for authentication
   * @returns Promise with upload response
   */
  uploadCourseBrochure: async (
    courseId: string,
    file: File,
    token: string
  ) => {
    if (!courseId || !file || !token) throw new Error('Course ID, file, and token are required');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}/brochures/upload?addToCourse=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    return response.json();
  },

  /**
   * Get brochures for a course
   * @param courseId - The course ID
   * @param token - JWT token (optional)
   * @returns Promise with brochures array
   */
  getCourseBrochures: async (
    courseId: string,
    token?: string
  ) => {
    if (!courseId) throw new Error('Course ID is required');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}/brochures`, {
      method: 'GET',
      headers,
    });
    return response.json();
  },
};

export const uploadCourseBrochure = brochureAPI.uploadCourseBrochure;
export const getCourseBrochures = brochureAPI.getCourseBrochures;
