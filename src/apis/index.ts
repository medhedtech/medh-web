// api.tsx

import { IUpdateCourseData } from '@/types/course.types';
import * as courseAPI from './course/course';

export const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_URL as string; // live instance URL
// export const apiBaseUrl = "http://localhost:8080/api/v1"; // local URL

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

export interface ICourseSearchParams {
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
    getRecordedVideosForUser: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID cannot be empty');
      return `${apiBaseUrl}/courses/recorded-videos/${studentId}`;
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
    searchSuggestions: (query: string): string => `${apiBaseUrl}/courses/search-suggestions?q=${encodeURIComponent(query)}`
  },
  faqs: {
    getAllFaqs: "/faqs/getAll",
    getFaqsByCategory: "/faqs/category",
    getAllCategories: "/faqs/categories",
    createFaq: "/faqs/create",
    updateFaq: "/faqs/update",
    deleteFaq: "/faqs/delete"
  },
  user: {
    register: "/auth/register",
    login: "/auth/login",
    update: "/auth/update",
    delete: "/auth/delete",
    getDetailsbyId: "/auth/get",
    getAll: "/auth/get-all",
    updateByEmail: "/auth/update-by-email",
    toggleStudentStatus: "/auth/toggle-status",
    sendResetEmail: "/auth/forgot-password",
    verfiySystemPassword: "/auth/verify-temp-password",
    resetPassword: "/auth/reset-password"
  },
  adminDashboard: {
    getDashboardCount: "/dashboard/admin-dashboard-count"
  },
  upload: {
    uploadFile: "/upload",
    uploadMultiple: "/upload/multiple",
    uploadBase64: "/upload/base64",
    uploadImage: "/upload/base64",
    uploadMedia: "/upload/base64",
    uploadDocument: "/upload/base64"
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
    toggleInstructorsStatus: "/auth/toggle-status-instrucor"
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
    createEnrolledCourse: "/enrolled/create",
    getAllEnrolledCourses: (options: { page?: number; limit?: number; search?: string; sort_by?: string; sort_order?: string } = {}): string => {
      const { page = 1, limit = 10, search = "", sort_by = "createdAt", sort_order = "desc" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      return `/enrolled/get?${queryParams.toString()}`;
    },
    getEnrolledCourseById: (id: string): string => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enrolled/get/${id}`;
    },
    getEnrollmentCountsByStudentId: (studentId: string): string => {
      if (!studentId) throw new Error('Student ID is required');
      return `/enrolled/getCount/${studentId}`;
    },
    updateEnrolledCourse: (id: string): string => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enrolled/update/${id}`;
    },
    deleteEnrolledCourse: (id: string): string => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enrolled/delete/${id}`;
    },
    getEnrolledCourseByStudentId: (studentId: string, options: { page?: number; limit?: number; status?: string } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const { page = 1, limit = 10, status = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (status) {
        queryParams.append('status', status);
      }
      return `/enrolled/student/${studentId}?${queryParams.toString()}`;
    },
    getEnrolledStudentsByCourseId: (courseId: string, options: { page?: number; limit?: number } = {}): string => {
      if (!courseId) throw new Error('Course ID is required');
      const { page = 1, limit = 10 } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      return `/enrolled/course/${courseId}?${queryParams.toString()}`;
    },
    getUpcomingMeetingsForStudent: (studentId: string, options: { limit?: number } = {}): string => {
      if (!studentId) throw new Error('Student ID is required');
      const { limit = 10 } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('limit', String(limit));
      return `/enrolled/get-upcoming-meetings/${studentId}?${queryParams.toString()}`;
    },
    markCourseAsCompleted: "/enroll/mark-completed",
    getAllStudentsWithEnrolledCourses: (options: { page?: number; limit?: number; search?: string } = {}): string => {
      const { page = 1, limit = 10, search = "" } = options;
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      return `/enrolled/get-enrolled-students?${queryParams.toString()}`;
    },
    watchVideo: (options: { courseId: string; videoId: string; studentId: string }): string => {
      const { courseId, videoId, studentId } = options;
      const queryParams = new URLSearchParams();
      apiUtils.appendParam('courseId', courseId, queryParams);
      apiUtils.appendParam('videoId', videoId, queryParams);
      apiUtils.appendParam('studentId', studentId, queryParams);
      return `/enrolled-courses/watch?${queryParams.toString()}`;
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