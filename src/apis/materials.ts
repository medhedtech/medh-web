import { apiBaseUrl, apiUtils } from './utils';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

// Types
export interface IMaterialStats {
  total: number;
  byType: {
    documents: number;
    videos: number;
    assignments: number;
    other: number;
  };
}

export interface IMaterialCourse {
  id: string;
  title: string;
  courseCode: string;
  thumbnail: string;
}

export interface IMaterialLesson {
  id: string;
  title: string;
  order: number;
}

export interface IMaterialCreator {
  id: string;
  name: string;
}

export interface IMaterial {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'assignment' | 'other';
  fileUrl: string;
  course: IMaterialCourse;
  lesson: IMaterialLesson;
  createdBy: IMaterialCreator;
  createdAt: string;
  order?: number;
  size?: number;
  duration?: number;
  downloadCount?: number;
  viewCount?: number;
}

export interface IMaterialsResponse {
  status: 'success' | 'error';
  data?: {
    stats: IMaterialStats;
    materialsByType: {
      documents: IMaterial[];
      videos: IMaterial[];
      assignments: IMaterial[];
      other: IMaterial[];
    };
    materials: IMaterial[];
  };
  message?: string;
}

export interface IMaterialSearchParams {
  type?: 'document' | 'video' | 'assignment' | 'other';
  search?: string;
  courseId?: string;
  query?: string;
}

export interface ICertificateInstructor {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
}

export interface ICertificate {
  _id: string;
  course_id: {
    _id: string;
    course_title: string;
    course_image: string;
  };
  student_id: {
    _id: string;
    full_name: string;
  };
  certificateUrl: string;
  completion_date: string;
  status: 'issued' | 'pending' | 'expired';
  grade?: string;
  validUntil?: string;
}

export interface ICertificatesResponse {
  status: 'success' | 'error';
  data?: ICertificate[];
  message?: string;
}

const materialsAPI = {
  /**
   * Get all materials from enrolled courses
   */
  getEnrolledMaterials: async (params?: { type?: string; search?: string }): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const queryString = params ? apiUtils.buildQueryString(params) : '';
    return axios.get(`${apiBaseUrl}/materials/enrolled${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Get recent materials
   */
  getRecentMaterials: async (limit?: number): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const queryString = limit ? `?limit=${limit}` : '';
    return axios.get(`${apiBaseUrl}/materials/recent${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Search materials
   */
  searchMaterials: async (params: IMaterialSearchParams): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const queryString = apiUtils.buildQueryString(params);
    return axios.get(`${apiBaseUrl}/materials/search${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Get materials for a specific course
   */
  getCourseMaterials: async (courseId: string): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!courseId) throw new Error('Course ID is required');
    return axios.get(`${apiBaseUrl}/materials/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Get material by ID
   */
  getMaterialById: async (materialId: string): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!materialId) throw new Error('Material ID is required');
    return axios.get(`${apiBaseUrl}/materials/${materialId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Record material download
   */
  recordMaterialDownload: async (materialId: string): Promise<IMaterialsResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!materialId) throw new Error('Material ID is required');
    return axios.post(`${apiBaseUrl}/materials/${materialId}/download`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Get all certificates for a student
   * @param studentId Optional student ID. If not provided, uses the authenticated user's ID
   */
  getStudentCertificates: async (studentId?: string): Promise<ICertificatesResponse> => {
    const token = getAuthToken();
    console.log('Token available:', !!token);
    
    if (!token) {
      const error = new Error('Authentication required. Please log in.');
      console.error('Authentication error:', error);
      throw error;
    }

    const userId = studentId || localStorage.getItem('userId');
    console.log('Fetching certificates for userId:', userId);
    console.log('studentId param:', studentId);
    console.log('localStorage userId:', localStorage.getItem('userId'));
    
    if (!userId) {
      const error = new Error('Student ID is required');
      console.error('User ID error:', error);
      throw error;
    }

    try {
      const url = `${apiBaseUrl}${apiUrls.certificate.getCertificatesByStudentId(userId)}`;
      console.log('Making API request to:', url);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      // Handle both array and object response formats
      const certificates = Array.isArray(response.data) ? response.data : response.data.certificates || [];

      return {
        status: 'success',
        data: certificates,
        message: 'Certificates fetched successfully'
      };
    } catch (error: any) {
      // Safely extract error details
      const errorDetails = {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        response: {
          data: error?.response?.data || null,
          status: error?.response?.status || null,
          statusText: error?.response?.statusText || null
        },
        request: {
          url: `${apiBaseUrl}${apiUrls.certificate.getCertificatesByStudentId(userId)}`,
          method: 'GET',
          headers: error?.config?.headers || null
        },
        code: error?.code || 'UNKNOWN_ERROR',
        name: error?.name || 'Error'
      };
      
      console.error('Error fetching certificates:', error);
      console.error('Detailed error info:', errorDetails);
      
      // Handle specific error cases
      if (error?.response?.status === 404) {
        return {
          status: 'success',
          data: [],
          message: 'No certificates found for this student'
        };
      }
      
      if (error?.response?.status === 401) {
        return {
          status: 'error',
          data: [],
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (error?.response?.status === 403) {
        return {
          status: 'error',
          data: [],
          message: 'You do not have permission to access certificates.'
        };
      }
      
      if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
        return {
          status: 'error',
          data: [],
          message: 'Unable to connect to the server. Please check your internet connection.'
        };
      }
      
      return {
        status: 'error',
        data: [],
        message: error?.response?.data?.message || error?.message || 'Failed to fetch certificates'
      };
    }
  }
};

export default materialsAPI;