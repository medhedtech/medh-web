// api.tsx

import { IUpdateCourseData } from '@/types/course.types';

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

export const apiUrls = {
  categories: {
    getAllCategories: "/categories/getAll",
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
    verfiySystemPassword: "/auth//verify-temp-password",
    resetPassword: "/auth/reset-password"
  },
  adminDashboard: {
    getDashboardCount: "/dashboard/admin-dashboard-count"
  },
  courses: {
    getAllCourses: "/courses/get",
    getAllCoursesWithLimits: (params: ICourseSearchParams = {}): string => {
      const {
        page = 1,
        limit = 12,
        course_title = "",
        course_tag = "",
        course_category = "",
        status = "Published",
        search = "",
        course_grade = "",
        category = [],
        filters = {},
        class_type = "",
        course_duration,
        course_fee,
        course_type = "",
        skill_level = "",
        language = "",
        sort_by = "createdAt",
        sort_order = "desc",
        category_type = ""
      } = params;

      const queryParams = new URLSearchParams();

      try {
        // Validate and set pagination params with proper error handling
        const safePage = apiUtils.safeNumber(page, 1);
        const safeLimit = apiUtils.safeNumber(limit, 12);
        
        queryParams.append('page', String(Math.max(1, safePage)));
        queryParams.append('limit', String(Math.min(100, Math.max(1, safeLimit))));

        // Set sorting params with validation
        const validSortFields = ['createdAt', 'course_title', 'course_fee'];
        const safeSortBy = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
        const safeSortOrder = ['asc', 'desc'].includes(sort_order) ? sort_order : 'desc';
        
        queryParams.append('sort_by', safeSortBy);
        queryParams.append('sort_order', safeSortOrder);

        // Add search and filters with proper encoding
        if (search) {
          const safeSearch = apiUtils.safeEncode(search.trim());
          if (safeSearch) queryParams.append('search', safeSearch);
        }

        if (status) queryParams.append('status', status);

        // Handle course_category with special care to prevent double encoding
        if (course_category) {
          if (Array.isArray(course_category)) {
            const safeCategories = course_category
              .map(cat => apiUtils.safeEncode(cat))
              .filter(Boolean);
            if (safeCategories.length) {
              queryParams.append('course_category', safeCategories.join(','));
            }
          } else {
            const safeCategory = apiUtils.safeEncode(course_category);
            if (safeCategory) queryParams.append('course_category', safeCategory);
          }
        }

        // Handle arrays with proper encoding
        if (course_tag) apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
        if (category.length > 0) apiUtils.appendArrayParam('category', category, queryParams);
        if (class_type) apiUtils.appendArrayParam('class_type', class_type, queryParams);

        // Handle other string parameters with safe encoding
        if (course_title) {
          const safeCourseTitle = apiUtils.safeEncode(course_title);
          if (safeCourseTitle) queryParams.append('course_title', safeCourseTitle);
        }

        if (course_grade) {
          const safeCourseGrade = apiUtils.safeEncode(course_grade);
          if (safeCourseGrade) queryParams.append('course_grade', safeCourseGrade);
        }

        if (course_type) {
          const safeCourseType = apiUtils.safeEncode(course_type);
          if (safeCourseType) queryParams.append('course_type', safeCourseType);
        }

        if (skill_level) {
          const safeSkillLevel = apiUtils.safeEncode(skill_level);
          if (safeSkillLevel) queryParams.append('skill_level', safeSkillLevel);
        }

        if (language) {
          const safeLanguage = apiUtils.safeEncode(language);
          if (safeLanguage) queryParams.append('language', safeLanguage);
        }

        if (category_type) {
          const safeCategoryType = apiUtils.safeEncode(category_type);
          if (safeCategoryType) queryParams.append('category_type', safeCategoryType);
        }

        // Handle numeric ranges with validation
        if (course_duration) {
          if (typeof course_duration === 'object' && 'min' in course_duration && 'max' in course_duration) {
            const safeMin = apiUtils.safeNumber(course_duration.min, 0);
            const safeMax = apiUtils.safeNumber(course_duration.max, 0);
            if (safeMin > 0) queryParams.append('course_duration_min', String(safeMin));
            if (safeMax > 0) queryParams.append('course_duration_max', String(safeMax));
          } else if (typeof course_duration === 'number') {
            const safeDuration = apiUtils.safeNumber(course_duration, 0);
            if (safeDuration > 0) queryParams.append('course_duration', String(safeDuration));
          }
        }

        if (course_fee) {
          if (typeof course_fee === 'object' && 'min' in course_fee && 'max' in course_fee) {
            const safeMin = apiUtils.safeNumber(course_fee.min, 0);
            const safeMax = apiUtils.safeNumber(course_fee.max, 0);
            if (safeMin >= 0) queryParams.append('course_fee_min', String(safeMin));
            if (safeMax >= 0) queryParams.append('course_fee_max', String(safeMax));
          } else if (typeof course_fee === 'number') {
            const safeFee = apiUtils.safeNumber(course_fee, 0);
            if (safeFee >= 0) queryParams.append('course_fee', String(safeFee));
          }
        }

        // Handle additional filters with type safety
        if (filters) {
          if (typeof filters.certification === 'boolean') {
            queryParams.append('is_Certification', filters.certification ? 'Yes' : 'No');
          }
          if (typeof filters.assignments === 'boolean') {
            queryParams.append('is_Assignments', filters.assignments ? 'Yes' : 'No');
          }
          if (typeof filters.projects === 'boolean') {
            queryParams.append('is_Projects', filters.projects ? 'Yes' : 'No');
          }
          if (typeof filters.quizzes === 'boolean') {
            queryParams.append('is_Quizes', filters.quizzes ? 'Yes' : 'No');
          }
          if (filters.effortPerWeek) {
            const safeMin = apiUtils.safeNumber(filters.effortPerWeek.min, 0);
            const safeMax = apiUtils.safeNumber(filters.effortPerWeek.max, 0);
            if (safeMin >= 0) queryParams.append('min_hours_per_week', String(safeMin));
            if (safeMax >= 0) queryParams.append('max_hours_per_week', String(safeMax));
          }
          if (filters.noOfSessions) {
            const safeSessions = apiUtils.safeNumber(filters.noOfSessions, 0);
            if (safeSessions > 0) queryParams.append('no_of_Sessions', String(safeSessions));
          }
          if (filters.features?.length) {
            apiUtils.appendArrayParam('features', filters.features, queryParams);
          }
          if (filters.tools?.length) {
            apiUtils.appendArrayParam('tools_technologies', filters.tools, queryParams);
          }
          if (filters.dateRange) {
            if (filters.dateRange.start) queryParams.append('date_start', filters.dateRange.start);
            if (filters.dateRange.end) queryParams.append('date_end', filters.dateRange.end);
          }
          if (typeof filters.isFree === 'boolean') {
            queryParams.append('isFree', String(filters.isFree));
          }
        }

        return `/courses/search?${queryParams.toString()}`;
      } catch (error) {
        console.error('Error building course search URL:', error);
        // Return a safe default URL
        return `/courses/search?page=1&limit=12&sort_by=createdAt&sort_order=desc&status=Published`;
      }
    },
    getNewCourses: (options: {
      page?: number;
      limit?: number;
      course_tag?: string;
      status?: string;
      search?: string;
      user_id?: string;
      sort_by?: string;
      sort_order?: string;
      class_type?: string;
    } = {}): string => {
      const {
        page = 1,
        limit = 10,
        course_tag = "",
        status = "Published",
        search = "",
        user_id = "",
        sort_by = "createdAt",
        sort_order = "desc",
        class_type = ""
      } = options;
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
      return `/courses/new?${queryParams.toString()}`;
    },
    getCourseTitles: (options: {
      status?: string;
      course_category?: string;
      class_type?: string;
    } = {}): string => {
      const { status = "", course_category = "", class_type = "" } = options;
      const queryParams = new URLSearchParams();
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      return `/courses/course-names?${queryParams.toString()}`;
    },
    getAllRelatedCourses: (courseIds: string[] = [], limit: number = 6): { url: string; data: { course_ids: string[] } } => {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', String(limit));
      return {
        url: `/courses/related-courses${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
        data: { course_ids: courseIds }
      };
    },
    getCourseById: (id: string, studentId: string = ""): string => {
      const queryParams = new URLSearchParams();
      if (studentId) apiUtils.appendParam('studentId', studentId, queryParams);
      return `/courses/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getCoorporateCourseById: (id: string, coorporateId: string = ""): string => {
      const queryParams = new URLSearchParams();
      if (coorporateId) apiUtils.appendParam('coorporateId', coorporateId, queryParams);
      return `/courses/get-coorporate/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getRecordedVideosForUser: (studentId: string): string => `/courses/recorded-videos/${studentId}`,
    createCourse: "/courses/create",
    updateCourse: (id: string, data: Partial<IUpdateCourseData>): { url: string; data: Partial<IUpdateCourseData> & { course_id: string; updated_at: string } } => {
      if (!id) throw new Error('Course ID is required');
      return {
        url: `/courses/${id}`,
        data: {
          ...data,
          course_id: id,
          updated_at: new Date().toISOString()
        }
      };
    },
    toggleCourseStatus: (id: string): string => `/courses/${id}/status`,
    updateRecordedVideos: (id: string): string => `/courses/recorded-videos/${id}`,
    deleteCourse: (id: string): string => `/courses/delete/${id}`,
    softDeleteCourse: (id: string): string => `/courses/soft-delete/${id}`,
    getCourseSections: (courseId: string): string => `/courses/${courseId}/sections`,
    getCourseLessons: (courseId: string): string => `/courses/${courseId}/lessons`,
    getLessonDetails: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}`,
    getCourseProgress: (courseId: string): string => `/courses/${courseId}/progress`,
    markLessonComplete: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/complete`,
    getCourseAssignments: (courseId: string): string => `/courses/${courseId}/assignments`,
    submitAssignment: (courseId: string, assignmentId: string): string => `/courses/${courseId}/assignments/${assignmentId}/submit`,
    getCourseQuizzes: (courseId: string): string => `/courses/${courseId}/quizzes`,
    submitQuiz: (courseId: string, quizId: string): string => `/courses/${courseId}/quizzes/${quizId}/submit`,
    getQuizResults: (courseId: string, quizId: string): string => `/courses/${courseId}/quizzes/${quizId}/results`,
    getLessonResources: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/resources`,
    downloadResource: (courseId: string, lessonId: string, resourceId: string): string =>
      `/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}/download`,
    uploadFile: "/courses/upload",
    uploadMultipleFiles: "/courses/upload-multiple",
    getLessonNotes: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/notes`,
    addLessonNote: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/notes`,
    updateNote: (courseId: string, lessonId: string, noteId: string): string => `/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`,
    deleteNote: (courseId: string, lessonId: string, noteId: string): string => `/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`,
    getLessonBookmarks: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/bookmarks`,
    addLessonBookmark: (courseId: string, lessonId: string): string => `/courses/${courseId}/lessons/${lessonId}/bookmarks`,
    updateBookmark: (courseId: string, lessonId: string, bookmarkId: string): string => `/courses/${courseId}/lessons/${lessonId}/bookmarks/${bookmarkId}`,
    deleteBookmark: (courseId: string, lessonId: string, bookmarkId: string): string => `/courses/${courseId}/lessons/${lessonId}/bookmarks/${bookmarkId}`,
    downloadBrochure: (courseId: string): string => `/courses/broucher/download/${courseId}`
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
  }
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