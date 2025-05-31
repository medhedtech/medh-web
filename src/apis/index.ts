// api.tsx

// Import apiBaseUrl from config to avoid circular dependencies
import { apiBaseUrl } from './config';
export { apiBaseUrl };

import { IUpdateCourseData } from '@/types/course.types';
import * as courseAPI from './course/course';
import { MdHomeFilled } from 'react-icons/md';

// Keep commented out for reference
// export const apiBaseUrl = "http://localhost:8080/api/v1"; // local URL
// This is a duplicate export, so removing it
// export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.io/api/v1';

/**
 * Shared utility functions for API URL construction.
 */
export const apiUtils = {
  /**
   * Safely encodes a value for use in a URL.
   * @param value - The value to encode.
   * @returns The encoded value or an empty string if null/undefined.
   */
  safeEncode: (value: any): string => {
    if (value === null || value === undefined) return '';
    // Prevent double encoding by first decoding if already encoded
    const decodedValue = decodeURIComponent(String(value).trim());
    return encodeURIComponent(decodedValue);
  },

  /**
   * Safely converts a value to a number, with fallback
   * @param value - The value to convert
   * @param fallback - Fallback value if conversion fails
   * @returns The number or fallback value
   */
  safeNumber: (value: any, fallback: number): number => {
    if (value === null || value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  },

  /**
   * Creates a URLSearchParams object and adds array parameters.
   * @param name - The parameter name.
   * @param value - The parameter value (array or comma-separated string).
   * @param params - The URLSearchParams object to append to.
   * @param separator - The separator to use for joined values (default: comma).
   */
  addArrayParam: (
    name: string,
    value: string | string[] | undefined,
    params: URLSearchParams,
    separator: string = ','
  ): void => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    if (Array.isArray(value)) {
      params.set(name, value.join(separator));
    } else if (typeof value === 'string' && value.includes(separator)) {
      // String already contains separators, pass as is.
      params.set(name, value);
    } else if (value) {
      // Single value.
      params.set(name, String(value));
    }
  },

  /**
   * Creates a query string with proper error handling.
   * @param paramsObj - Object of parameter key-value pairs.
   * @returns The encoded query string.
   */
  buildQueryString: (paramsObj: { [key: string]: any }): string => {
    try {
      const urlParams = new URLSearchParams();
      for (const [key, value] of Object.entries(paramsObj)) {
        if (value === null || value === undefined) continue;
        if (Array.isArray(value)) {
          apiUtils.addArrayParam(key, value, urlParams);
        } else {
          urlParams.set(key, apiUtils.safeEncode(value));
        }
      }
      const queryString = urlParams.toString();
      return queryString ? `?${queryString}` : '';
    } catch (error) {
      console.error('Error building query string:', error);
      return '';
    }
  },

  /**
   * Adds a simple parameter to the URLSearchParams if the value exists.
   * @param name - The parameter name.
   * @param value - The parameter value.
   * @param params - The URLSearchParams object to append to.
   */
  appendParam: (name: string, value: any, params: URLSearchParams): void => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(name, apiUtils.safeEncode(value));
    }
  },
  
  /**
   * Creates a URLSearchParams object and adds array parameters by appending.
   * @param name - The parameter name.
   * @param value - The parameter value (array or comma-separated string).
   * @param params - The URLSearchParams object to append to.
   * @param separator - The separator to use for joined values (default: comma).
   */
  appendArrayParam: (
    name: string,
    value: string | string[] | undefined,
    params: URLSearchParams,
    separator: string = ','
  ): void => {
    if (!value) return;

    if (Array.isArray(value)) {
      const encodedValues = value
        .filter((item) => item)
        .map((item) => apiUtils.safeEncode(item))
        .filter((item) => item.length > 0);
      if (encodedValues.length > 0) {
        params.append(name, encodedValues.join(separator));
      }
    } else if (typeof value === 'string') {
      const items = value
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item)
        .map((item) => apiUtils.safeEncode(item));
      if (items.length > 0) {
        params.append(name, items.join(separator));
      }
    }
  }
};

// Add new TypeScript interfaces for better type safety
export interface ICourseFilters {
  certification?: boolean;
  assignments?: boolean;
  projects?: boolean;
  quizzes?: boolean;
  effortPerWeek?: {
    min: number;
    max: number;
  };
  noOfSessions?: number;
  features?: string[];
  tools?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  isFree?: boolean;
}

export interface ICourseQueryParams {
  page?: number;
  limit?: number;
  course_title?: string;
  course_tag?: string | string[];
  course_category?: string | string[];
  status?: 'Draft' | 'Published' | 'Archived';
  search?: string;
  course_grade?: string;
  category?: string[];
  filters?: ICourseFilters;
  class_type?: string;
  course_duration?: number | { min: number; max: number };
  course_fee?: number | { min: number; max: number };
  course_type?: string;
  skill_level?: string;
  language?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  category_type?: string;
}

export interface ICourseSearchParams extends ICourseQueryParams {
  currency?: string;
}

// Add Currency interfaces before the apiUrls object
export interface ICurrency {
  _id: string;
  country: string;
  countryCode: string;
  valueWrtUSD: number;
  symbol: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICurrencyResponse {
  status: string;
  data: {
    currency: ICurrency;
  };
}

export interface ICurrenciesResponse {
  status: string;
  results: number;
  data: {
    currencies: ICurrency[];
  };
}

export interface ICreateCurrencyInput {
  country: string;
  countryCode: string;
  valueWrtUSD: number;
  symbol: string;
}

export interface IUpdateCurrencyInput extends Partial<ICreateCurrencyInput> {}

// Instructor Assignment interfaces
export interface IInstructorCourseAssignment {
  _id: string;
  full_name: string;
  email: string;
  course_title: string;
  user_id: string | {
    _id: string;
    full_name: string;
    email: string;
  };
  count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IInstructorCourseAssignmentInput {
  full_name: string;
  email: string;
  course_title: string;
  user_id: string;
}

export interface IInstructorStudentAssignment {
  _id?: string;
  instructor_id: string;
  student_id: string;
  assignment_type: 'mentor' | 'tutor' | 'advisor' | 'supervisor';
  assignment_date: string;
  notes?: string;
  instructor_name?: string;
  student_name?: string;
}

export interface IInstructorStudentAssignmentInput {
  instructor_id: string;
  student_id: string;
  assignment_type?: 'mentor' | 'tutor' | 'advisor' | 'supervisor';
  notes?: string;
}

export interface IInstructorStudentAssignmentResponse {
  success: boolean;
  message: string;
  data: {
    student_id: string;
    student_name: string;
    instructor_id: string;
    instructor_name: string;
    assignment_type: string;
    assignment_date: string;
    notes?: string;
  };
}

export interface IInstructorStudentsResponse {
  success: boolean;
  message: string;
  data: {
    instructor: {
      id: string;
      name: string;
      email: string;
    };
    assigned_students: Array<{
      _id: string;
      full_name: string;
      email: string;
      role: string[];
      instructor_assignment_date: string;
      instructor_assignment_type: string;
      instructor_assignment_notes?: string;
    }>;
    total_students: number;
  };
}

export interface IAssignedCourse {
  _id: string;
  course_title: string;
  assigned_instructor: {
    _id: string;
    full_name: string;
    email: string;
  };
}

export interface IInstructorCoursesResponse {
  message: string;
  courses: IAssignedCourse[];
}

export const apiUrls = {
  categories: {
    getAllCategories: "/categories",
    createCategory: "/categories/create",
    getCategoryById: (id: string): string => {
      if (!id) throw new Error('Category ID is required');
      return `/categories/get/${id}`;
    },
    updateCategory: (id: string): string => {
      if (!id) throw new Error('Category ID is required');
      return `/categories/update/${id}`;
    },
    deleteCategory: (id: string): string => {
      if (!id) throw new Error('Category ID is required');
      return `/categories/delete/${id}`;
    },
    getRelatedCourses: (id: string): string => {
      if (!id) throw new Error('Category ID is required');
      return `/categories/related-courses/${id}`;
    }
  },
  courses: {
    getAllCourses: `${apiBaseUrl}/courses/get`,
    getCourseById: (id: string, studentId: string = ""): string => {
      if (!id) throw new Error('Course ID cannot be empty');
      const queryParams = new URLSearchParams();
      if (studentId) {
        queryParams.append('studentId', studentId);
      }
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/courses/${id}${queryString ? '?' + queryString : ''}`;
    },
    getCoorporateCourseById: (id: string, coorporateId: string = ""): string => {
      if (!id) throw new Error('Corporate Course ID cannot be empty');
      const queryParams = new URLSearchParams();
      if (coorporateId) {
        queryParams.append('coorporateId', coorporateId);
      }
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/courses/${id}${queryString ? '?' + queryString : ''}`;
    },
    getRecordedVideosForUser: (id: string): string => {
      if (!id) throw new Error('Student ID cannot be empty');
      return `${apiBaseUrl}/courses/recorded-videos/${id}`;
    },
    getRecorderVideosForUser: "/courses/recorded-videos",
    createCourse: `${apiBaseUrl}/courses/create`,
    updateCourse: `${apiBaseUrl}/courses/update`,
    toggleCourseStatus: (id: string): string => {
      if (!id) throw new Error('Course ID cannot be empty');
      return `${apiBaseUrl}/courses/toggle-status/${id}`;
    },
    deleteCourse: (id: string): string => {
      if (!id) throw new Error('Course ID cannot be empty');
      return `${apiBaseUrl}/courses/delete/${id}`;
    },
    searchSuggestions: (query: string): string => `${apiBaseUrl}/courses/search-suggestions?q=${encodeURIComponent(query)}`,
    getNewCourses: (options: {
      page?: number; limit?: number; course_tag?: string; status?: string; search?: string;
      user_id?: string; sort_by?: string; sort_order?: string; class_type?: string;
    } = {}): string => {
      const { page = 1, limit = 10, course_tag = "", status = "Published", search = "", user_id = "", sort_by = "createdAt", sort_order = "desc", class_type = "" } = options;
      const queryParams = new URLSearchParams();
      apiUtils.appendParam('page', page, queryParams);
      apiUtils.appendParam('limit', limit, queryParams);
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('search', search, queryParams);
      apiUtils.appendParam('user_id', user_id, queryParams);
      apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      return `${apiBaseUrl}/courses/new?${queryParams.toString()}`;
    },
    curriculum: (() => {
      try {
        // Dynamic import of curriculum API to handle "No curriculum available" scenarios
        const { curriculumAPI } = require('./curriculum.api');
        return curriculumAPI;
      } catch (error) {
        console.warn('Curriculum API not available, using fallback endpoints');
        return {
          getCurriculumByCourseId: (courseId: string): string => {
            if (!courseId) throw new Error('Course ID is required');
            return `${apiBaseUrl}/curriculum/course/${courseId}`;
          },
          checkCurriculumAvailability: (courseId: string): string => {
            if (!courseId) throw new Error('Course ID is required');
            return `${apiBaseUrl}/curriculum/course/${courseId}/check-availability`;
          },
          getOrCreateCurriculum: (courseId: string): string => {
            if (!courseId) throw new Error('Course ID is required');
            return `${apiBaseUrl}/curriculum/course/${courseId}/get-or-create`;
          }
        };
      }
    })(),
  },
  faqs: {
    getAllFaqs: "/faq/getAll",
    getFaqsByCategory: "/faq/category",
    getAllCategories: "/faq/categories",
    createFaq: "/faq/create",
    updateFaq: "/faq/update",
    deleteFaq: "/faq/delete"
  },
  user: {
    register: "/auth/register",
    login: "/auth/login",
    update: "/auth/update",
    delete: "/auth/delete",
    getDetailsbyId: "/auth/get",
    getAll: "/auth/get-all",
    getAllStudents: "/auth/get-all-students",
    updateByEmail: "/auth/update-by-email",
    toggleStudentStatus: "/auth/toggle-status",
    sendResetEmail: "/auth/forgot-password",
    verfiySystemPassword: "/auth/verify-temp-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: '/auth/verify-email',
    resendOTP: '/auth/resend-verification',
  },
  adminDashboard: {
    getDashboardCount: `${apiBaseUrl}/dashboard/counts`,
    getDetailedStats: (options: { period?: string; filter?: string } = {}): string => {
      const { period = "month", filter = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      if (filter) {
        queryParams.append('filter', filter);
      }
      return `${apiBaseUrl}/dashboard/admin-stats?${queryParams.toString()}`;
    },
    getRevenueMetrics: (options: { 
      start_date?: string; 
      end_date?: string; 
      granularity?: 'day' | 'week' | 'month' | 'year' 
    } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.start_date) queryParams.append('start_date', options.start_date);
      if (options.end_date) queryParams.append('end_date', options.end_date);
      if (options.granularity) queryParams.append('granularity', options.granularity);
      return `${apiBaseUrl}/dashboard/revenue-metrics?${queryParams.toString()}`;
    },
    getEnrollmentStats: (options: { 
      course_id?: string; 
      period?: string; 
      category?: string; 
      instructor_id?: string 
    } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.course_id) queryParams.append('course_id', options.course_id);
      if (options.period) queryParams.append('period', options.period);
      if (options.category) queryParams.append('category', options.category);
      if (options.instructor_id) queryParams.append('instructor_id', options.instructor_id);
      return `${apiBaseUrl}/dashboard/enrollment-stats?${queryParams.toString()}`;
    },
    getCompletionRates: (options: { 
      course_id?: string; 
      category?: string; 
      start_date?: string; 
      end_date?: string 
    } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.course_id) queryParams.append('course_id', options.course_id);
      if (options.category) queryParams.append('category', options.category);
      if (options.start_date) queryParams.append('start_date', options.start_date);
      if (options.end_date) queryParams.append('end_date', options.end_date);
      return `${apiBaseUrl}/dashboard/completion-rates?${queryParams.toString()}`;
    },
    getUserActivityTimeline: (options: {
      user_type?: 'student' | 'instructor' | 'admin' | 'corporate';
      user_id?: string;
      start_date?: string;
      end_date?: string;
      limit?: number;
    } = {}): string => {
      const { limit = 20 } = options;
      const queryParams = new URLSearchParams();
      if (options.user_type) queryParams.append('user_type', options.user_type);
      if (options.user_id) queryParams.append('user_id', options.user_id);
      if (options.start_date) queryParams.append('start_date', options.start_date);
      if (options.end_date) queryParams.append('end_date', options.end_date);
      queryParams.append('limit', String(limit));
      return `${apiBaseUrl}/dashboard/user-activity-timeline?${queryParams.toString()}`;
    },
    getZoomAnalytics: (options: {
      meeting_id?: string;
      instructor_id?: string;
      course_id?: string;
      period?: string;
    } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.meeting_id) queryParams.append('meeting_id', options.meeting_id);
      if (options.instructor_id) queryParams.append('instructor_id', options.instructor_id);
      if (options.course_id) queryParams.append('course_id', options.course_id);
      if (options.period) queryParams.append('period', options.period);
      return `${apiBaseUrl}/dashboard/zoom-analytics?${queryParams.toString()}`;
    },
    getBlogPerformance: (options: {
      blog_id?: string;
      category?: string;
      period?: string;
      metrics?: string[];
    } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.blog_id) queryParams.append('blog_id', options.blog_id);
      if (options.category) queryParams.append('category', options.category);
      if (options.period) queryParams.append('period', options.period);
      apiUtils.appendArrayParam('metrics', options.metrics, queryParams);
      return `${apiBaseUrl}/dashboard/blog-performance?${queryParams.toString()}`;
    },
    getSystemHealth: `${apiBaseUrl}/dashboard/system-health`,
    exportDashboardData: (format: 'csv' | 'pdf' | 'excel' = 'csv', report_type: string): string => {
      return `${apiBaseUrl}/dashboard/export-data?format=${format}&report_type=${report_type}`;
    }
  },
  upload: {
    uploadFile: "/upload",
    uploadMultiple: "/upload/multiple",
    uploadBase64: "/upload/base64",
    uploadImage: "/upload/base64",
    uploadMedia: "/upload/base64",
    uploadDocument: "/upload/base64",
  uploadVideo: (options: {
    duration?: number;
    resolution?: string;
    description?: string;
  } = {}): string => {
    const queryParams = new URLSearchParams();
    if (options.duration) queryParams.append('duration', String(options.duration));
    if (options.resolution) queryParams.append('resolution', options.resolution);
    if (options.description) queryParams.append('description', options.description);
    return `${apiBaseUrl}/upload/video${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  },
  },
  onlineMeeting: {
    createMeeting: "/online-meetings/create",
    getAllMeetings: "/online-meetings/get",
    getMeetingDetails: "/online-meetings/get/:id",
    updateMeeting: "/online-meetings/update/:id",
    deleteMeeting: "/online-meetings/delete/:id",
    getMeetingByStudentId: "/online-meetings/student",
    getMeetingsByInstructorId: "/online-meetings/upcoming-classes",
    getOngoingMeetingsByinstrcutorId: "/online-meetings/ongoing-classes",
    getAllMeetingsForAllEmployeees: "/online-meetings/all-employee-meetings",
    getUpcomingMeetingsForStudent: (studentId: string, options: { showAllUpcoming?: boolean } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const queryParams = new URLSearchParams();
      if (options.showAllUpcoming) {
        queryParams.append('show_all_upcoming', 'true');
      }
      const queryString = queryParams.toString();
      return `/online-meeting/student/${studentId}${queryString ? `?${queryString}` : ''}`;
    }
  },
  Instructor: {
    getAllInstructors: "/auth/get-all-instrucors",
    getInstructorById: "/auth/get-instructor",
    createInstructor: "/auth/create",
    updateInstructor: (id: string): string => `/auth/updateInstrucor/${id}`,
    deleteInstructor: "/auth/delete-instrucor",
    toggleInstructorsStatus: "/auth/toggle-status-instrucor",
    uploadCSV: "/auth/upload-instructors-csv",
    
    // Instructor-to-Course Assignment endpoints
    assignInstructorToCourse: "/auth/assign-instructor-to-course",
    getAllInstructorAssignments: "/auth/instructor-assignments",
    getInstructorAssignmentById: (id: string): string => {
      if (!id) throw new Error('Assignment ID or User ID is required');
      return `/auth/instructor-assignment/${id}`;
    },
    updateInstructorAssignment: (id: string): string => {
      if (!id) throw new Error('Assignment ID is required');
      return `/auth/instructor-assignment/${id}`;
    },
    deleteInstructorAssignment: (id: string): string => {
      if (!id) throw new Error('Assignment ID is required');
      return `/auth/instructor-assignment/${id}`;
    },
    getInstructorCourses: (instructorId: string): string => {
      if (!instructorId) throw new Error('Instructor ID is required');
      return `/auth/instructor-courses/${instructorId}`;
    },
    
    // Instructor-to-Student Assignment endpoints
    assignInstructorToStudent: "/auth/assign-instructor-to-student",
    getInstructorStudents: (instructorId: string): string => {
      if (!instructorId) throw new Error('Instructor ID is required');
      return `/auth/instructor-students/${instructorId}`;
    },
    unassignInstructorFromStudent: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `/auth/unassign-instructor-from-student/${studentId}`;
    }
  },
  Coorporate: {
    getAllCoorporates: "/auth/get-all-coorporates",
    getCoorporateById: "/auth/get-coorporate",
    createCoorporate: "/auth/add",
    updateCoorporate: (id: string): string => `/auth/update-coorporate/${id}`,
    deleteCoorporate: "/auth/delete-coorporate",
    toggleCoorporateStatus: "/auth/toggle-coorporate-status"
  },
  feedbacks: {
    getAllFeedbacks: "/feedback/all",
    getAllComplaints: "/feedback/complaints",
    getAllInstructorFeedbacks: "/feedback/instructor",
    createFeedback: "/feedback",
    createComplaint: "/complaint",
    createInstructorFeedback: "/feedback/create-instructor",
    updateFeedback: (id: string): string => `/feedback/update/${id}`,
    deleteFeedback: (id: string): string => `/feedback/delete/${id}`,
    getFeedbackById: (id: string): string => `/feedback/get/${id}`,
    getComplaintById: (id: string): string => `/feedback/complaint/${id}`,
    getInstructorFeedbackById: (id: string): string => `/feedbacks/instructor/${id}`
  },
  CoorporateStudent: {
    getAllCoorporateStudents: "/auth/get-all-coorporate-students",
    getCoorporateStudentById: "/auth/get-coorporate-student",
    createCoorporateStudent: "/auth/add-coorporate-student",
    updateCoorporateStudent: (id: string): string => `/auth/update-coorporate-student/${id}`,
    deleteCoorporateStudent: "/auth/delete-coorporate-student",
    toggleCoorporateStudentStatus: "/auth/toggle-coorporate-student-status"
  },
  Students: {
    getAllStudents: "/students/get",
    getStudentById: (id: string): string => `/students/get/${id}`,
    createStudent: "/students/create",
    updateStudent: (id: string): string => `/students/update/${id}`,
    deleteStudent: "/students/delete",
    toggleStudentStatus: "/students/toggle-status"
  },
  Contacts: {
    getAllContacts: "/contact/get",
    getContactById: (id: string): string => `/contact/get/${id}`,
    createContact: "/contact/create",
    updateContact: (id: string): string => `/contact/update/${id}`,
    deleteContact: (id: string): string => `/contact/delete/${id}`
  },
  enrollWebsiteform: {
    createEnrollWebsiteForm: "/enroll-form/create",
    getAllEnrollWebsiteForms: (options: { page?: number; limit?: number; search?: string } = {}): string => {
      const { page = 1, limit = 10, search = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      return `/enroll-form?${queryParams.toString()}`;
    },
    getEnrollWebsiteFormById: (id: string): string => {
      if (!id) throw new Error('Enroll Website Form ID is required');
      return `/enroll-form/get/${id}`;
    },
    updateEnrollWebsiteForm: (id: string): string => {
      if (!id) throw new Error('Enroll Website Form ID is required');
      return `/enroll-form/update/${id}`;
    },
    deleteEnrollWebsiteForm: "/enroll-form/delete"
  },
  Blogs: {
    getAllBlogs: (options: {
      page?: number;
      limit?: number;
      search?: string;
      sort_by?: string;
      sort_order?: string;
      status?: string;
      category?: string;
      tags?: string;
      author?: string;
      date_range?: { start?: string; end?: string };
      with_content?: boolean;
      count_only?: boolean;
      exclude_ids?: string[];
    } = {}): string => {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort_by = "createdAt",
        sort_order = "desc",
        status = "",
        category = "",
        tags = "",
        author = "",
        date_range = {},
        with_content = false,
        count_only = false,
        exclude_ids = []
      } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      apiUtils.appendParam('search', search, queryParams);
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('author', author, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      if (date_range && Object.keys(date_range).length > 0) {
        apiUtils.appendParam('date_start', date_range.start, queryParams);
        apiUtils.appendParam('date_end', date_range.end, queryParams);
      }
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
      apiUtils.appendParam('count_only', count_only ? 'true' : 'false', queryParams);
      apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
      return `/blogs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    searchBlogs: (options: { query: string; limit?: number; fields?: string[]; category?: string; tags?: string }): string => {
      const { query, limit = 10, fields = ["title", "content"], category = "", tags = "" } = options;
      if (!query || query.trim().length === 0) throw new Error('Search query is required');
      const queryParams = new URLSearchParams();
      queryParams.append('query', query.trim());
      queryParams.append('limit', String(limit));
      apiUtils.appendArrayParam('fields', fields, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      return `/blogs/search?${queryParams.toString()}`;
    },
    getFeaturedBlogs: (options: {
      limit?: number;
      with_content?: boolean;
      category?: string;
      tags?: string;
      exclude_ids?: string[];
    } = {}): string => {
      const { limit = 6, with_content = false, category = "", tags = "", exclude_ids = [] } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('limit', String(limit));
      apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
      return `/blogs/featured?${queryParams.toString()}`;
    },
    getBlogsByCategory: (category: string, options: { page?: number; limit?: number; sort_by?: string; sort_order?: string } = {}): string => {
      if (!category) throw new Error('Category is required');
      const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      return `/blogs/category/${category}?${queryParams.toString()}`;
    },
    getBlogsByTag: (tag: string, options: { page?: number; limit?: number; sort_by?: string; sort_order?: string } = {}): string => {
      if (!tag) throw new Error('Tag is required');
      const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      return `/blogs/tag/${tag}?${queryParams.toString()}`;
    },
    getBlogBySlug: (slug: string, incrementViews: boolean = true): string => {
      if (!slug) throw new Error('Blog slug is required');
      const queryParams = new URLSearchParams();
      queryParams.append('increment_views', incrementViews ? 'true' : 'false');
      return `/blogs/slug/${slug}?${queryParams.toString()}`;
    },
    createBlog: "/blogs",
    updateBlog: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}`;
    },
    deleteBlog: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}`;
    },
    likeBlog: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}/like`;
    },
    addComment: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}/comment`;
    },
    deleteComment: (blogId: string, commentId: string): string => {
      if (!blogId) throw new Error('Blog ID is required');
      if (!commentId) throw new Error('Comment ID is required');
      return `/blogs/${blogId}/comment/${commentId}`;
    },
    updateBlogStatus: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}/status`;
    },
    toggleFeatured: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/${id}/feature`;
    },
    getBlogCategories: "/blogs/categories",
    getBlogTags: (options: { limit?: number; with_count?: boolean } = {}): string => {
      const { limit = 20, with_count = true } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('limit', String(limit));
      queryParams.append('with_count', with_count ? 'true' : 'false');
      return `/blogs/tags?${queryParams.toString()}`;
    },
    getRelatedBlogs: (options: { blogId: string; limit?: number; tags?: string; category?: string }): string => {
      const { blogId, limit = 3, tags = "", category = "" } = options;
      if (!blogId) throw new Error('Blog ID is required');
      const queryParams = new URLSearchParams();
      queryParams.append('limit', String(limit));
      apiUtils.appendArrayParam('tags', tags, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      return `/blogs/${blogId}/related?${queryParams.toString()}`;
    },
    getBlogAnalytics: (blogId: string): string => {
      if (!blogId) throw new Error('Blog ID is required');
      return `/blogs/${blogId}/analytics`;
    },
    getBlogById: (id: string): string => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/id/${id}`;
    }
  },
  certificate: {
    getAllCertificate: "/certificates/get",
    addCertificate: "/certificates/create",
    getCertificatesByStudentId: "/certificates/get"
  },
  Newsletter: {
    getAllNewsletter: "/newsletter/getAll",
    addNewsletter: "/newsletter/add"
  },
  CorporateTraining: {
    getAllCorporate: "/corporate-training/getAll",
    addCorporate: "/corporate-training/create",
    updateCorporate: (id: string): string => `/corporate-training/update/${id}`,
    deleteCorporate: "/corporate-training/delete"
  },
  Session_Count: {
    getCountByInstructorId: "/track-sessions/get"
  },
  brouchers: {
    createBrouchers: "/broucher",
    getAllBrouchers: (options: { page?: number; limit?: number; search?: string } = {}): string => {
      const { page = 1, limit = 10, search = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      return `/broucher?${queryParams.toString()}`;
    },
    getBroucherById: (id: string): string => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    updateBroucher: (id: string): string => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    deleteBroucher: (id: string): string => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    downloadBrochure: (courseId: string, userData: any = null): string | { url: string; data: any } => {
      if (!courseId) throw new Error('Course ID is required');
      if (userData) {
        return {
          url: `/broucher/download/${courseId}`,
          data: { ...userData, course_id: courseId }
        };
      }
      return `/broucher/download/${courseId}`;
    },
    requestBroucher: (options: {
      brochure_id?: string;
      course_id?: string;
      full_name: string;
      email: string;
      phone_number: string;
      country_code?: string;
    }): { url: string; data: any } => {
      const { brochure_id, course_id, full_name, email, phone_number, country_code = "IN" } = options;
      if (!brochure_id && !course_id) {
        console.error("Either brochure_id or course_id must be provided");
        throw new Error("Either brochure_id or course_id must be provided");
      }
      const idToUse = course_id || brochure_id;
      return {
        url: `/broucher/download/${idToUse}`,
        data: {
          full_name,
          email,
          phone_number,
          country_code,
          ...(brochure_id && course_id ? { brochure_id } : {})
        }
      };
    },
    trackBroucherDownload: (options: {
      brochure_id?: string;
      course_id?: string;
      user_id: string;
      source?: string;
      metadata?: { [key: string]: any };
    }): { url: string; data: any } => {
      const { brochure_id, course_id, user_id, source = "", metadata = {} } = options;
      if (!brochure_id && !course_id) {
        console.error("Either brochure_id or course_id must be provided");
      }
      return {
        url: '/broucher/track-download',
        data: {
          brochure_id: brochure_id || null,
          course_id: course_id || null,
          user_id,
          source,
          timestamp: new Date().toISOString(),
          metadata: { ...metadata, browser: navigator?.userAgent || '', timestamp: new Date().toISOString() }
        }
      };
    }
  },
  enrolledCourses: {
    createEnrollment: `${apiBaseUrl}/enrolled/create`,
    getAllEnrollments: `${apiBaseUrl}/enrolled/get`,
    getEnrollmentById: (id: string): string => {
      if (!id) throw new Error('Enrollment ID is required');
      return `${apiBaseUrl}/enrolled/get/${id}`;
    },
    getEnrollmentCountsByStudent: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/enrolled/getCount/${studentId}`;
    },
    updateEnrollment: (id: string): string => {
      if (!id) throw new Error('Enrollment ID is required');
      return `${apiBaseUrl}/enrolled/update/${id}`;
    },
    deleteEnrollment: (id: string): string => {
      if (!id) throw new Error('Enrollment ID is required');
      return `${apiBaseUrl}/enrolled/delete/${id}`;
    },
    getEnrollmentsByStudent: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/enrolled/student/${studentId}`;
    },
    getEnrolledStudentsByCourse: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/enrolled/course/${courseId}`;
    },
    getUpcomingMeetings: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/enrolled/get-upcoming-meetings/${studentId}`;
    },
    markCourseAsCompleted: `${apiBaseUrl}/enrolled/mark-completed`,
    getAllStudentsWithEnrolledCourses: `${apiBaseUrl}/enrolled/get-enrolled-students`,
    watchVideo: `${apiBaseUrl}/enrolled/watch`,
    
    saveCourse: `${apiBaseUrl}/enrolled/save-course`,
    removeSavedCourse: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/enrolled/save-course/${courseId}`;
    },
    getSavedCourses: `${apiBaseUrl}/enrolled/saved-courses`,
    convertSavedCourseToEnrollment: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/enrolled/convert-saved/${courseId}`;
    }
  },
  payment: {
    processPayment: "/payments/process",
    getStudentPayments: (studentId: string, options: { page?: number; limit?: number; payment_type?: string } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const { page = 1, limit = 8, payment_type = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (payment_type) {
        queryParams.append('payment_type', payment_type);
      }
      return `/payments/student/${studentId}?${queryParams.toString()}`;
    },
    getPaymentById: (paymentType: string, paymentId: string): string => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      return `/payments/${paymentType}/${paymentId}`;
    },
    getPaymentStats: (options: { period?: string } = {}): string => {
      const { period = "month" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      return `/payments/stats?${queryParams.toString()}`;
    },
    generateReceipt: (paymentType: string, paymentId: string): string => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      return `/payments/receipt/${paymentType}/${paymentId}`;
    },
    resendReceiptEmail: (paymentType: string, paymentId: string): string => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      return `/payments/receipt/${paymentType}/${paymentId}/email`;
    },
    getStudentReceipts: (studentId: string, options: { page?: number; limit?: number } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const { page = 1, limit = 10 } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      return `/payments/receipts/student/${studentId}?${queryParams.toString()}`;
    }
  },
  // Add new progress tracking API endpoints
  progress: {
    getCourseProgress: (courseId: string, studentId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/progress/course/${courseId}/student/${studentId}`;
    },
    getStudentProgress: (studentId: string, options: { page?: number; limit?: number } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const { page = 1, limit = 10 } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      return `${apiBaseUrl}/progress/student/${studentId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getProgressStats: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/progress/stats/${studentId}`;
    },
    updateLessonCompletion: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/student/${studentId}`;
    },
    updateWatchPosition: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/position/student/${studentId}`;
    },
    getLessonNotes: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`;
    },
    addLessonNote: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`;
    },
    updateLessonNote: (courseId: string, lessonId: string, noteId: string, studentId: string): string => {
      if (!courseId || !lessonId || !noteId || !studentId) throw new Error('Course ID, Lesson ID, Note ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/${noteId}/student/${studentId}`;
    },
    deleteLessonNote: (courseId: string, lessonId: string, noteId: string, studentId: string): string => {
      if (!courseId || !lessonId || !noteId || !studentId) throw new Error('Course ID, Lesson ID, Note ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/${noteId}/student/${studentId}`;
    },
    getLessonComments: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`;
    },
    addVideoComment: (courseId: string, lessonId: string, studentId: string): string => {
      if (!courseId || !lessonId || !studentId) throw new Error('Course ID, Lesson ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`;
    },
    updateVideoComment: (courseId: string, lessonId: string, commentId: string, studentId: string): string => {
      if (!courseId || !lessonId || !commentId || !studentId) throw new Error('Course ID, Lesson ID, Comment ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/${commentId}/student/${studentId}`;
    },
    deleteVideoComment: (courseId: string, lessonId: string, commentId: string, studentId: string): string => {
      if (!courseId || !lessonId || !commentId || !studentId) throw new Error('Course ID, Lesson ID, Comment ID, and Student ID are required');
      return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/${commentId}/student/${studentId}`;
    }
  },
  // Add new utility function for course filtering
  filterCourses: (courses: any[], filters: Partial<ICourseFilters> = {}): any[] => {
    return courses.filter(course => {
      let matches = true;

      if (typeof filters.certification === 'boolean') {
        matches = matches && course.is_Certification === (filters.certification ? 'Yes' : 'No');
      }
      if (typeof filters.assignments === 'boolean') {
        matches = matches && course.is_Assignments === (filters.assignments ? 'Yes' : 'No');
      }
      if (typeof filters.projects === 'boolean') {
        matches = matches && course.is_Projects === (filters.projects ? 'Yes' : 'No');
      }
      if (typeof filters.quizzes === 'boolean') {
        matches = matches && course.is_Quizes === (filters.quizzes ? 'Yes' : 'No');
      }
      if (filters.effortPerWeek) {
        matches = matches && 
          course.min_hours_per_week >= filters.effortPerWeek.min &&
          course.max_hours_per_week <= filters.effortPerWeek.max;
      }
      if (filters.noOfSessions) {
        matches = matches && course.no_of_Sessions === filters.noOfSessions;
      }
      if (filters.features?.length) {
        matches = matches && filters.features.every(feature => 
          course.features?.includes(feature)
        );
      }
      if (filters.tools?.length) {
        matches = matches && filters.tools.every(tool => 
          course.tools_technologies?.includes(tool)
        );
      }
      if (filters.dateRange) {
        const courseDate = new Date(course.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        matches = matches && courseDate >= startDate && courseDate <= endDate;
      }
      if (typeof filters.isFree === 'boolean') {
        matches = matches && course.isFree === filters.isFree;
      }

      return matches;
    });
  },
  home: {
    getHomeFields: (options: { fields?: string[]; filters?: Record<string, any> } = {}): string => {
      const { fields = [], filters = {} } = options;
      const queryParams = new URLSearchParams();
      if (fields.length) {
        fields.forEach(field => queryParams.append('fields', field));
      }
      if (Object.keys(filters).length) {
        Object.entries(filters).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
      }
      return `${apiBaseUrl}/home-display/fields?${queryParams.toString()}`;
    },
    getAllHomeDisplaysWithPrices: `${apiBaseUrl}/home-display/prices`,
    bulkUpdateHomeDisplayPrices: `${apiBaseUrl}/home-display/prices/bulk-update`,
    getHomeDisplayPrices: (id: string): string => {
      if (!id) throw new Error('Home Display ID is required');
      return `${apiBaseUrl}/home-display/${id}/prices`;
    }
  },
  currencies: {
    getAllCurrencies: `${apiBaseUrl}/currencies`,
    getCurrencyById: (id: string): string => {
      if (!id) throw new Error('Currency ID is required');
      return `${apiBaseUrl}/currencies/${id}`;
    },
    getCurrencyByCountryCode: (code: string): string => {
      if (!code) throw new Error('Country code is required');
      return `${apiBaseUrl}/currencies/code/${code}`;
    },
    getAllCurrencyCountryCodes: `${apiBaseUrl}/currencies/country-codes`,
    createCurrency: `${apiBaseUrl}/currencies`,
    updateCurrency: (id: string): string => {
      if (!id) throw new Error('Currency ID is required');
      return `${apiBaseUrl}/currencies/${id}`;
    },
    deleteCurrency: (id: string): string => {
      if (!id) throw new Error('Currency ID is required');
      return `${apiBaseUrl}/currencies/${id}`;
    },
    toggleCurrencyStatus: (id: string): string => {
      if (!id) throw new Error('Currency ID is required');
      return `${apiBaseUrl}/currencies/${id}/toggle-status`;
    },
  },
  zoom: {
    // Meeting endpoints
    createMeeting: `${apiBaseUrl}/zoom/meetings`,
    getMeeting: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}`;
    },
    updateMeeting: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}`;
    },
    deleteMeeting: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}`;
    },
    
    // User meeting endpoints
    listUserMeetings: (userId: string, options: { type?: string; page_size?: number; page_number?: number } = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      if (options.type) queryParams.append('type', options.type);
      if (options.page_size) queryParams.append('page_size', String(options.page_size));
      if (options.page_number) queryParams.append('page_number', String(options.page_number));
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/users/${userId}/meetings${queryString ? '?' + queryString : ''}`;
    },
    listCurrentUserMeetings: (options: { type?: string; page_size?: number; page_number?: number } = {}): string => {
      const queryParams = new URLSearchParams();
      if (options.type) queryParams.append('type', options.type);
      if (options.page_size) queryParams.append('page_size', String(options.page_size));
      if (options.page_number) queryParams.append('page_number', String(options.page_number));
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/me/meetings${queryString ? '?' + queryString : ''}`;
    },
    
    // Signature and webhook
    signature: `${apiBaseUrl}/zoom/signature`,
    webhook: `${apiBaseUrl}/zoom/webhook`,
    webhookValidation: `${apiBaseUrl}/zoom/webhook`,
    
    // Recordings
    listUserRecordings: (userId: string, options: any = {}): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/users/${userId}/recordings${queryString ? '?' + queryString : ''}`;
    },
    listCurrentUserRecordings: (options: any = {}): string => {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/me/recordings${queryString ? '?' + queryString : ''}`;
    },
    getMeetingRecordings: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/recordings`;
    },
    deleteRecording: (meetingId: string, recordingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      if (!recordingId) throw new Error('Recording ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/recordings/${recordingId}`;
    },
    getRecordingSettings: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/recordings/settings`;
    },
    updateRecordingSettings: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/recordings/settings`;
    },
    getMeetingTranscript: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/recordings/transcript`;
    },
    
    // User management
    listUsers: (options: any = {}): string => {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/users${queryString ? '?' + queryString : ''}`;
    },
    getUser: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/zoom/users/${userId}`;
    },
    createUser: `${apiBaseUrl}/zoom/users`,
    updateUser: (userId: string): string => {
      if (!userId) throw new Error('User ID is required');
      return `${apiBaseUrl}/zoom/users/${userId}`;
    },
    deleteUser: (userId: string, action?: string): string => {
      if (!userId) throw new Error('User ID is required');
      const queryParams = new URLSearchParams();
      if (action) queryParams.append('action', action);
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/users/${userId}${queryString ? '?' + queryString : ''}`;
    },
    
    // Classroom management
    createClassroomMeeting: (userId: string = 'me'): string => {
      return `${apiBaseUrl}/zoom/classroom/meetings?userId=${userId}`;
    },
    
    // Registrants
    getRegistrants: (meetingId: string, options: any = {}): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/registrants${queryString ? '?' + queryString : ''}`;
    },
    addRegistrant: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/registrants`;
    },
    updateRegistrantStatus: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/registrants/status`;
    },
    generateJoinLink: (meetingId: string, registrantId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      if (!registrantId) throw new Error('Registrant ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/join/${registrantId}`;
    },
    
    // Invitation
    getInvitation: (meetingId: string): string => {
      if (!meetingId) throw new Error('Meeting ID is required');
      return `${apiBaseUrl}/zoom/meetings/${meetingId}/invitation`;
    },
    
    // User roles
    createInstructorUser: `${apiBaseUrl}/zoom/users/instructor`,
    createStudentUser: `${apiBaseUrl}/zoom/users/student`,
  },
  auth: {
    refreshToken: `${apiBaseUrl}/auth/refresh-token`,
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    verifyToken: "/auth/verify-token"
  },
  batches: {
    getAllBatches: `${apiBaseUrl}/batches`,
    getBatchesByCourse: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/batches/course/${courseId}`;
    },
    getBatchesByInstructor: (instructorId: string): string => {
      if (!instructorId) throw new Error('Instructor ID is required');
      return `${apiBaseUrl}/batches/instructor/${instructorId}`;
    },
    getBatchById: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}`;
    },
    createBatch: (courseId: string): string => {
      if (!courseId) throw new Error('Course ID is required');
      return `${apiBaseUrl}/batches/courses/${courseId}/batches`;
    },
    updateBatch: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}`;
    },
    deleteBatch: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}`;
    },
    getBatchAnalytics: `${apiBaseUrl}/batches/analytics`,
    getBatchStudents: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}/students`;
    },
    enrollStudents: `${apiBaseUrl}/batches/enroll-students`,
    removeStudent: (batchId: string, studentId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/batches/${batchId}/students/${studentId}`;
    },
    updateStudentStatus: (batchId: string, studentId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      if (!studentId) throw new Error('Student ID is required');
      return `${apiBaseUrl}/batches/${batchId}/students/${studentId}/status`;
    },
    cloneBatch: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}/clone`;
    },
    toggleArchive: (batchId: string): string => {
      if (!batchId) throw new Error('Batch ID is required');
      return `${apiBaseUrl}/batches/${batchId}/archive`;
    },
    checkScheduleConflicts: `${apiBaseUrl}/batches/check-conflicts`
  },
};

/**
 * Expected response structures for documentation purposes.
 */
export const apiResponseStructures = {
  course: {
    _id: "string",
    title: "string",
    description: "string",
    instructor: {
      _id: "string",
      name: "string",
      avatar: "string"
    },
    sections: [
      {
        _id: "string",
        title: "string",
        order: "number",
        duration: "string",
        lessons: [
          {
            _id: "string",
            title: "string",
            type: "video|document",
            duration: "string",
            video_url: "string",
            content_url: "string",
            is_completed: "boolean",
            resources: [
              {
                _id: "string",
                title: "string",
                type: "string",
                url: "string"
              }
            ]
          }
        ]
      }
    ],
    progress: {
      completed_lessons: "number",
      total_lessons: "number",
      percentage: "number"
    }
  },
  assignment: {
    _id: "string",
    title: "string",
    description: "string",
    total_marks: "number",
    due_date: "string",
    submission_count: "number",
    attachments: [
      {
        _id: "string",
        filename: "string",
        url: "string"
      }
    ]
  },
  quiz: {
    _id: "string",
    title: "string",
    duration: "string",
    total_questions: "number",
    attempts_allowed: "number",
    questions: [
      {
        _id: "string",
        text: "string",
        type: "multiple_choice|single_choice",
        options: [
          {
            _id: "string",
            text: "string"
          }
        ]
      }
    ]
  },
  quizResult: {
    quiz_id: "string",
    score: "number",
    total_marks: "number",
    correct_answers: "number",
    total_questions: "number",
    completion_time: "string",
    status: "pass|fail",
    attempt_number: "number",
    submitted_at: "string"
  }
};

/**
 * API request structures for documentation purposes.
 */
export const apiRequestStructures = {
  submitAssignment: {
    email: "string",
    content: "string",
    files: "File[]"
  },
  submitQuiz: {
    answers: [
      {
        question_id: "string",
        selected_options: "string[]"
      }
    ],
    time_taken: "string"
  },
  markLessonComplete: {
    completion_time: "string",
    notes: "string"
  },
  updateCourse: {
    course_title: "string",
    course_subtitle: "string",
    course_description: "string",
    course_category: "string",
    course_subcategory: "string",
    class_type: "string",
    course_grade: "string",
    language: "string",
    subtitle_languages: "string[]",
    course_image: "string",
    assigned_instructor: "string",
    course_duration: "number",
    course_fee: "number",
    is_certification: "boolean",
    is_assignments: "boolean",
    is_projects: "boolean",
    is_quizzes: "boolean",
    min_hours_per_week: "number",
    max_hours_per_week: "number",
    no_of_sessions: "number",
    features: "string[]",
    tools_technologies: "string[]",
    status: "string",
    sections: {
      type: "array",
      items: {
        title: "string",
        order: "number",
        lessons: {
          type: "array",
          items: {
            title: "string",
            type: "string",
            duration: "string",
            video_url: "string",
            content_url: "string",
            resources: {
              type: "array",
              items: {
                title: "string",
                type: "string",
                url: "string"
              }
            }
          }
        }
      }
    },
    metadata: {
      last_updated: "string",
      version: "string",
      additional_info: "Record<string, any>"
    }
  }
};

// Blog related interfaces
export interface IBlogComment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  blog_link: string;
  upload_image: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  categories: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  likes: number;
  comments: IBlogComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IBlogCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  blog_link: string;
  upload_image: string;
  categories?: string[];
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface IBlogUpdateInput extends Partial<IBlogCreateInput> {
  featured?: boolean;
}

export interface IBlogCommentInput {
  content: string;
}

export * from './courses';
export * from './blog.api';
export * from './apiClient';
export * from './batch';

// Admin Dashboard Interfaces
export interface IDashboardCount {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  currency: string;
  activeMeetings: number;
  pendingComplaints: number;
  courseCompletionRate: number;
  totalBrochureDownloads: number;
}

export interface IRevenueMetric {
  period: string;
  amount: number;
  enrollmentCount: number;
  currency: string;
  comparedToPrevious?: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface IEnrollmentStat {
  courseId?: string;
  courseTitle?: string;
  categoryId?: string;
  categoryName?: string;
  instructorId?: string;
  instructorName?: string;
  enrollmentCount: number;
  completionCount: number;
  completionRate: number;
  avgRating: number;
  revenue: number;
  currency: string;
}

export interface ICompletionRate {
  courseId?: string;
  courseTitle?: string;
  enrollmentCount: number;
  completionCount: number;
  completionRate: number;
  avgTimeToComplete: number; // in days
  dropoffPoints: Array<{
    lessonId: string;
    lessonTitle: string;
    dropoffCount: number;
    dropoffPercentage: number;
  }>;
}

export interface IUserActivity {
  userId: string;
  userName: string;
  userType: 'student' | 'instructor' | 'admin' | 'corporate';
  activity: string;
  activityType: 'login' | 'course_view' | 'lesson_complete' | 'meeting_join' | 'payment' | 'other';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IZoomAnalytic {
  meetingId?: string;
  meetingTitle?: string;
  instructorId?: string;
  instructorName?: string;
  courseId?: string;
  courseTitle?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  participantCount: number;
  averageAttendanceTime: number; // in minutes
  recordingAvailable: boolean;
  recordingViews: number;
}

export interface IBlogPerformance {
  blogId?: string;
  blogTitle?: string;
  categoryId?: string;
  categoryName?: string;
  views: number;
  uniqueVisitors: number;
  averageReadTime: number; // in seconds
  likes: number;
  comments: number;
  shares: number;
  clickthroughRate?: number;
}

export interface ISystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  apiLatency: number; // in ms
  dbLatency: number; // in ms
  errorRate: number; // percentage
  memoryUsage: number; // percentage
  cpuUsage: number; // percentage
  recentErrors: Array<{
    endpoint: string;
    count: number;
    lastOccurred: string;
  }>;
}

export interface IDashboardResponse<T> {
  status: string;
  data: T;
  timestamp: string;
  metadata?: {
    cacheStatus?: 'hit' | 'miss';
    dataLastUpdated?: string;
  };
}

// Dashboard Utility Functions
export const dashboardUtils = {
  /**
   * Calculates the growth or decline percentage between two values
   * @param current - The current value
   * @param previous - The previous value to compare against
   * @param decimals - Number of decimal places (default: 2)
   * @returns The percentage change as a number
   */
  calculateGrowthPercentage: (current: number, previous: number, decimals: number = 2): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const percentage = ((current - previous) / previous) * 100;
    return Number(percentage.toFixed(decimals));
  },

  /**
   * Determines the trend direction based on percentage change
   * @param percentage - The percentage change value
   * @param thresholdPercent - The percentage threshold to consider as stable (default: 1%)
   * @returns The trend as 'up', 'down', or 'stable'
   */
  getTrendDirection: (percentage: number, thresholdPercent: number = 1): 'up' | 'down' | 'stable' => {
    if (Math.abs(percentage) < thresholdPercent) return 'stable';
    return percentage >= 0 ? 'up' : 'down';
  },

  /**
   * Formats revenue numbers with currency symbol
   * @param amount - The amount to format
   * @param currency - Currency symbol or code
   * @param locale - The locale for formatting (default: 'en-US')
   * @returns Formatted currency string
   */
  formatCurrency: (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Groups enrollment data by category for visualization
   * @param stats - Array of enrollment statistics
   * @returns Object with categories as keys and aggregated values
   */
  groupEnrollmentsByCategory: (stats: IEnrollmentStat[]): Record<string, { count: number, revenue: number, completionRate: number }> => {
    return stats.reduce((acc, stat) => {
      const categoryName = stat.categoryName || 'Uncategorized';
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          count: 0,
          revenue: 0,
          completionRate: 0,
          items: []
        };
      }
      
      acc[categoryName].count += stat.enrollmentCount;
      acc[categoryName].revenue += stat.revenue;
      acc[categoryName].items.push(stat);
      
      // Recalculate average completion rate
      acc[categoryName].completionRate = acc[categoryName].items.reduce(
        (sum, item) => sum + item.completionRate, 
        0
      ) / acc[categoryName].items.length;
      
      return acc;
    }, {} as Record<string, { count: number, revenue: number, completionRate: number, items: IEnrollmentStat[] }>);
  },

  /**
   * Processes time series data for charts (e.g., revenue over time)
   * @param metrics - Array of metric data points
   * @param valueKey - The key to use for the y-axis values
   * @returns Processed data ready for charting libraries
   */
  prepareTimeSeriesData: (
    metrics: Array<{ period: string; [key: string]: any }>, 
    valueKey: string = 'amount'
  ): { labels: string[], data: number[] } => {
    const sortedMetrics = [...metrics].sort((a, b) => 
      new Date(a.period).getTime() - new Date(b.period).getTime()
    );
    
    return {
      labels: sortedMetrics.map(item => item.period),
      data: sortedMetrics.map(item => item[valueKey] || 0)
    };
  },

  /**
   * Calculates user retention metrics from activity data
   * @param activities - Array of user activities
   * @param periodDays - Number of days to consider for retention (default: 30)
   * @returns Retention metrics
   */
  calculateRetentionMetrics: (activities: IUserActivity[], periodDays: number = 30): {
    activeUsers: number;
    returningUsers: number;
    retentionRate: number;
    avgSessionsPerUser: number;
  } => {
    const now = new Date();
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    
    // Group activities by user
    const userActivities = activities.reduce((acc, activity) => {
      const activityDate = new Date(activity.timestamp);
      if (activityDate >= periodStart) {
        if (!acc[activity.userId]) {
          acc[activity.userId] = [];
        }
        acc[activity.userId].push(activity);
      }
      return acc;
    }, {} as Record<string, IUserActivity[]>);
    
    const userIds = Object.keys(userActivities);
    const activeUsers = userIds.length;
    
    // Count users with more than one login session
    const returningUsers = userIds.filter(userId => 
      userActivities[userId].filter(a => a.activityType === 'login').length > 1
    ).length;
    
    // Calculate average sessions per user
    const totalSessions = userIds.reduce((sum, userId) => 
      sum + userActivities[userId].filter(a => a.activityType === 'login').length, 
      0
    );
    
    return {
      activeUsers,
      returningUsers,
      retentionRate: activeUsers > 0 ? (returningUsers / activeUsers) * 100 : 0,
      avgSessionsPerUser: activeUsers > 0 ? totalSessions / activeUsers : 0
    };
  },

  /**
   * Identifies completion bottlenecks in courses
   * @param completionRates - Array of course completion data
   * @returns Sorted array of dropout points across courses
   */
  identifyCompletionBottlenecks: (completionRates: ICompletionRate[]): Array<{
    courseId: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
    dropoffPercentage: number;
  }> => {
    const bottlenecks: Array<{
      courseId: string;
      courseTitle: string;
      lessonId: string;
      lessonTitle: string;
      dropoffPercentage: number;
    }> = [];
    
    completionRates.forEach(course => {
      if (course.dropoffPoints && course.dropoffPoints.length > 0) {
        course.dropoffPoints.forEach(point => {
          bottlenecks.push({
            courseId: course.courseId || '',
            courseTitle: course.courseTitle || '',
            lessonId: point.lessonId,
            lessonTitle: point.lessonTitle,
            dropoffPercentage: point.dropoffPercentage
          });
        });
      }
    });
    
    // Sort by highest dropout percentage
    return bottlenecks.sort((a, b) => b.dropoffPercentage - a.dropoffPercentage);
  }
};

// Add new interfaces for authentication after IDashboardResponse

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    full_name?: string;
    email?: string;
    role?: string[];
    admin_role?: string;
    permissions?: string[];
    status?: string;
  };
  token?: string;
}

export interface IRegisterData {
  full_name: string;
  email: string;
  password: string;
  phone_numbers: [{
    country: string;
    number: string;
  }];
  agree_terms: boolean;
  role?: string[];
  meta?: {
    gender?: string;
    age?: string;
    age_group?: string;
    category?: string;
    [key: string]: any;
  };
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IVerifyEmailData {
  email: string;
  otp: string;
}

export interface IResendVerificationData {
  email: string;
}

export interface IOTPVerificationResponse {
  success: boolean;
  message: string;
}

// Curriculum-related interfaces
export interface ICurriculumResource {
  _id?: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document' | 'code' | 'quiz' | 'assignment' | 'other';
  url?: string;
  fileUrl?: string;
  description?: string;
  size?: string;
  duration?: string;
  downloadable?: boolean;
  isRequired?: boolean;
}

export interface ICurriculumLesson {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  lessonType: 'video' | 'quiz' | 'assessment' | 'reading' | 'assignment' | 'live_session';
  order?: number;
  duration?: string | number;
  videoUrl?: string;
  video_url?: string;
  thumbnailUrl?: string;
  isPreview?: boolean;
  is_completed?: boolean;
  completed?: boolean;
  quiz_id?: string;
  assignment_id?: string;
  resources?: ICurriculumResource[];
  learning_objectives?: string[];
  prerequisites?: string[];
  meta?: {
    presenter?: string;
    transcript?: string;
    time_limit?: number;
    passing_score?: number;
    due_date?: string;
    max_score?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimated_time?: number;
    [key: string]: any;
  };
  progress?: {
    completed: boolean;
    completion_date?: string;
    watch_time?: number;
    total_time?: number;
    score?: number;
    attempts?: number;
  };
}

export interface ICurriculumSection {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  order?: number;
  lessons: ICurriculumLesson[];
  isCollapsed?: boolean;
  estimatedDuration?: string;
  totalLessons?: number;
  completedLessons?: number;
}

export interface ICurriculumWeek {
  _id?: string;
  id?: string;
  weekTitle: string;
  weekDescription?: string;
  order?: number;
  sections?: ICurriculumSection[];
  lessons?: ICurriculumLesson[];
  topics?: string[];
  isCollapsed?: boolean;
  estimatedDuration?: string;
  totalLessons?: number;
  completedLessons?: number;
}

export interface ICurriculum {
  _id: string;
  courseId: string;
  weeks?: ICurriculumWeek[];
  sections?: ICurriculumSection[];
  lessons?: ICurriculumLesson[];
  totalDuration?: string;
  totalLessons?: number;
  totalSections?: number;
  totalWeeks?: number;
  structure_type: 'weekly' | 'sectioned' | 'linear';
  version?: string;
  isPublished?: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICurriculumResponse {
  success: boolean;
  message: string;
  data: {
    curriculum: ICurriculum;
    course_info?: {
      _id: string;
      course_title: string;
      status: string;
    };
    progress?: {
      overall_progress: number;
      completed_lessons: number;
      total_lessons: number;
      last_accessed_lesson?: string;
      time_spent?: number;
    };
  };
}

export interface ICurriculumStats {
  courseId: string;
  totalLessons: number;
  totalSections: number;
  totalWeeks: number;
  totalDuration: number; // in minutes
  completionRate?: number;
  averageTimePerLesson?: number;
  engagementMetrics?: {
    views: number;
    completions: number;
    dropoffRate: number;
    averageWatchTime: number;
  };
  lessonTypeBreakdown?: {
    video: number;
    quiz: number;
    assessment: number;
    reading: number;
    live_session: number;
  };
}

export interface ICurriculumTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  structure: ICurriculum;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICurriculumNavigation {
  currentLesson: {
    id: string;
    title: string;
    sectionId?: string;
    weekId?: string;
    order: number;
  };
  previousLesson?: {
    id: string;
    title: string;
    sectionId?: string;
    weekId?: string;
  };
  nextLesson?: {
    id: string;
    title: string;
    sectionId?: string;
    weekId?: string;
  };
  breadcrumb: Array<{
    type: 'course' | 'week' | 'section' | 'lesson';
    id: string;
    title: string;
  }>;
  totalProgress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export interface ICurriculumValidationResult {
  isValid: boolean;
  errors: Array<{
    type: 'missing_content' | 'invalid_structure' | 'broken_link' | 'missing_resource';
    message: string;
    location: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  warnings: Array<{
    type: string;
    message: string;
    location: string;
  }>;
  suggestions: Array<{
    type: string;
    message: string;
    action: string;
  }>;
  summary: {
    totalLessons: number;
    validLessons: number;
    missingContent: number;
    brokenLinks: number;
  };
}

// Export curriculum utilities for handling "No curriculum available" scenarios
export { curriculumAPI, curriculumUtils } from './curriculum.api';

export default apiUrls;