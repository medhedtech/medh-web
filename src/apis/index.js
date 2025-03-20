export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL; //live instance URL
// export const apiBaseUrl = "http://localhost:8080/api/v1"; // local URL

// Shared utility functions for API URL construction
const apiUtils = {
  /**
   * Safely encodes a value for use in a URL
   * @param {*} value - The value to encode
   * @returns {string} - The encoded value or empty string if null/undefined
   */
  safeEncode: (value) => {
    if (value === null || value === undefined) return '';
    return encodeURIComponent(String(value).trim());
  },
  
  /**
   * Creates a URLSearchParams object and adds array parameters
   * @param {string} name - The parameter name
   * @param {Array|string} value - The parameter value (array or comma-separated string)
   * @param {URLSearchParams} params - The URLSearchParams object to append to
   * @param {string} separator - The separator to use for joined values (default: comma)
   */
  addArrayParam: (name, value, params, separator = ',') => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    
    if (Array.isArray(value)) {
      params.set(name, value.join(separator));
    } else if (typeof value === 'string' && value.includes(separator)) {
      // String already contains separators, pass as is
      params.set(name, value);
    } else if (value) {
      // Single value
      params.set(name, String(value));
    }
  },
  
  /**
   * Creates a query string with proper error handling
   * @param {Object} params - Object of parameter key-value pairs
   * @returns {string} - The encoded query string
   */
  buildQueryString: (params) => {
    try {
      const urlParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(params)) {
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
   * Creates a URLSearchParams object and adds array parameters
   * @param {string} name - The parameter name
   * @param {Array|string} value - The parameter value (array or comma-separated string)
   * @param {URLSearchParams} params - The URLSearchParams object to append to
   * @param {string} separator - The separator to use for joined values (default: comma)
   */
  appendArrayParam: (name, value, params, separator = ',') => {
    if (!value) return;
    
    if (Array.isArray(value)) {
      const encodedValues = value
        .filter(item => item)
        .map(item => apiUtils.safeEncode(item))
        .filter(item => item.length > 0);
        
      if (encodedValues.length > 0) {
        params.append(name, encodedValues.join(separator));
      }
    } else if (typeof value === 'string') {
      const items = value.split(separator)
        .map(item => item.trim())
        .filter(item => item)
        .map(item => apiUtils.safeEncode(item));
        
      if (items.length > 0) {
        params.append(name, items.join(separator));
      }
    }
  },
  
  /**
   * Adds a simple parameter to the URLSearchParams if the value exists
   * @param {string} name - The parameter name 
   * @param {*} value - The parameter value
   * @param {URLSearchParams} params - The URLSearchParams object to append to
   */
  appendParam: (name, value, params) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(name, apiUtils.safeEncode(value));
    }
  }
};

export const apiUrls = {
  faqs: {
    getAllFaqs: "/faqs/getAll",
    getFaqsByCategory: "/faqs/category",
    getAllCategories: "/faqs/categories",
    createFaq: "/faqs/create",
    updateFaq: "/faqs/update",
    deleteFaq: "/faqs/delete",
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
    resetPassword: "/auth/reset-password",
  },
  courses: {
    getAllCourses: "/courses/get",
    getAllCoursesWithLimits: (
      page = 1,
      limit = 10,
      course_title = "",
      course_tag = "",
      course_category = "",
      status = "Published",
      search = "",
      course_grade = "",
      category = [],
      filters = {},
      class_type = "",
      course_duration = "",
      course_fee = "",
      course_type = "",
      skill_level = "",
      language = "",
      sort_by = "createdAt",
      sort_order = "desc",
      category_type = "",
    ) => {
      // Validate and sanitize input parameters
      const sanitizedParams = {
        page: Math.max(1, parseInt(page) || 1),
        limit: Math.min(100, Math.max(1, parseInt(limit) || 10)),
        sort_by: ['createdAt', 'title', 'course_fee', 'course_duration', 'updatedAt'].includes(sort_by) ? sort_by : 'createdAt',
        sort_order: ['asc', 'desc'].includes(sort_order?.toLowerCase()) ? sort_order.toLowerCase() : 'desc'
      };

      // Initialize query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination and sorting
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      queryParams.append('sort_by', sort_by);
      queryParams.append('sort_order', sort_order);
      
      // Add search and filters
      apiUtils.appendParam('search', search, queryParams);
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('course_title', course_title, queryParams);
      apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      apiUtils.appendParam('course_grade', course_grade, queryParams);
      apiUtils.appendParam('course_type', course_type, queryParams);
      apiUtils.appendParam('skill_level', skill_level, queryParams);
      apiUtils.appendParam('language', language, queryParams);
      apiUtils.appendParam('category_type', category_type, queryParams);
      
      // Handle course duration and fee
      if (course_duration) {
        if (typeof course_duration === 'object') {
          apiUtils.appendParam('course_duration_min', course_duration.min, queryParams);
          apiUtils.appendParam('course_duration_max', course_duration.max, queryParams);
        } else {
          apiUtils.appendParam('course_duration', course_duration, queryParams);
        }
      }
      
      if (course_fee) {
        if (typeof course_fee === 'object') {
          apiUtils.appendParam('course_fee_min', course_fee.min, queryParams);
          apiUtils.appendParam('course_fee_max', course_fee.max, queryParams);
        } else {
          apiUtils.appendParam('course_fee', course_fee, queryParams);
        }
      }
      
      // Handle additional filters
      if (filters) {
        if (filters.certification !== undefined) apiUtils.appendParam('is_Certification', filters.certification ? 'Yes' : 'No', queryParams);
        if (filters.assignments !== undefined) apiUtils.appendParam('is_Assignments', filters.assignments ? 'Yes' : 'No', queryParams);
        if (filters.projects !== undefined) apiUtils.appendParam('is_Projects', filters.projects ? 'Yes' : 'No', queryParams);
        if (filters.quizzes !== undefined) apiUtils.appendParam('is_Quizes', filters.quizzes ? 'Yes' : 'No', queryParams);
        
        if (filters.effortPerWeek) {
          apiUtils.appendParam('min_hours_per_week', filters.effortPerWeek.min, queryParams);
          apiUtils.appendParam('max_hours_per_week', filters.effortPerWeek.max, queryParams);
        }
        
        apiUtils.appendParam('no_of_Sessions', filters.noOfSessions, queryParams);
        apiUtils.appendArrayParam('features', filters.features, queryParams);
        apiUtils.appendArrayParam('tools_technologies', filters.tools, queryParams);
        
        if (filters.dateRange) {
          apiUtils.appendParam('date_start', filters.dateRange.start, queryParams);
          apiUtils.appendParam('date_end', filters.dateRange.end, queryParams);
        }
        
        apiUtils.appendParam('isFree', filters.isFree, queryParams);
      }
      
      return `/courses/search?${queryParams.toString()}`;
    },
    getNewCourses: (options = {}) => {
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
    getCourseTitles: (options = {}) => {
      const { status = "", course_category = "", class_type = "" } = options;
      const queryParams = new URLSearchParams();
      
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      
      return `/courses/course-names?${queryParams.toString()}`;
    },
    getAllRelatedCourses: (courseIds = [], limit = 6) => {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit);
      
      return {
        url: `/courses/related-courses${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
        data: { course_ids: courseIds }
      };
    },
    getCourseById: (id, studentId = "") => {
      const queryParams = new URLSearchParams();
      if (studentId) apiUtils.appendParam('studentId', studentId, queryParams);
      return `/courses/get/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getCoorporateCourseById: (id, coorporateId = "") => {
      const queryParams = new URLSearchParams();
      if (coorporateId) apiUtils.appendParam('coorporateId', coorporateId, queryParams);
      return `/courses/get-coorporate/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getRecordedVideosForUser: (studentId) => `/courses/recorded-videos/${studentId}`,
    createCourse: "/courses/create",
    updateCourse: (id) => `/courses/update/${id}`,
    toggleCourseStatus: (id) => `/courses/toggle-status/${id}`,
    updateRecordedVideos: (id) => `/courses/recorded-videos/${id}`,
    deleteCourse: (id) => `/courses/delete/${id}`,
    softDeleteCourse: (id) => `/courses/soft-delete/${id}`,
    getCourseSections: (courseId) => `/courses/${courseId}/sections`,
    getCourseLessons: (courseId) => `/courses/${courseId}/lessons`,
    getLessonDetails: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
    getCourseProgress: (courseId) => `/courses/${courseId}/progress`,
    markLessonComplete: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/complete`,
    getCourseAssignments: (courseId) => `/courses/${courseId}/assignments`,
    submitAssignment: (courseId, assignmentId) => `/courses/${courseId}/assignments/${assignmentId}/submit`,
    getCourseQuizzes: (courseId) => `/courses/${courseId}/quizzes`,
    submitQuiz: (courseId, quizId) => `/courses/${courseId}/quizzes/${quizId}/submit`,
    getQuizResults: (courseId, quizId) => `/courses/${courseId}/quizzes/${quizId}/results`,
    getLessonResources: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/resources`,
    downloadResource: (courseId, lessonId, resourceId) => 
      `/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}/download`,
    uploadFile: "/courses/upload",
    uploadMultipleFiles: "/courses/upload-multiple",
    addLessonNote: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/notes`,
    addLessonBookmark: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/bookmarks`,
  },
  upload: {
    uploadImage: "/upload/uploadImage",
    uploadMedia: "/upload/uploadMedia",
    uploadDocument: "/upload/uploadDocument",
  },
  onlineMeeting: {
    createMeeting: "/online-meeting/create",
    getAllMeetings: "/online-meeting/get",
    getMeetingDetails: "/online-meeting/get/:id",
    updateMeeting: "/online-meeting/update/:id",
    deleteMeeting: "/online-meeting/delete/:id",
    getMeetingByStudentId: "/online-meeting/student",
    getMeetingsByInstructorId: "/online-meeting/upcoming-classes",
    getOngoingMeetingsByinstrcutorId: "/online-meeting/ongoing-classes",
    getAllMeetingsForAllEmployeees: "/online-meeting/all-employee-meetings",
  },
  Instructor: {
    getAllInstructors: "/auth/get-all-instrucors",
    getInstructorById: "/auth/get-instructor",
    createInstructor: "/auth/create",
    updateInstructor: "/auth/updateInstrucor/:id",
    deleteInstructor: "/auth/delete-instrucor",
    toggleInstructorsStatus: "/auth/toggle-status-instrucor",
  },
  Coorporate: {
    getAllCoorporates: "/auth/get-all-coorporates",
    getCoorporateById: "/auth/get-coorporate",
    createCoorporate: "/auth/add",
    updateCoorporate: "/auth/update-coorporate/:id",
    deleteCoorporate: "/auth/delete-coorporate",
    toggleCoorporateStatus: "/auth/toggle-coorporate-status",
    bulkDelete: "/api/coorporate/bulk-delete",
  },
  CoorporateStudent: {
    getAllCoorporateStudents: "/auth/get-all-coorporate-students",
    getCoorporateStudentById: "/auth/get-coorporate-student",
    createCoorporateStudent: "/auth/add-coorporate-student",
    updateCoorporateStudent: "/auth/update-coorporate-student/:id",
    deleteCoorporateStudent: "/auth/delete-coorporate-student",
    toggleCoorporateStudentStatus: "/auth/toggle-coorporate-student-status",
  },
  Students: {
    getAllStudents: "/students/get",
    getStudentById: "/students/get/:id",
    createStudent: "/students/create",
    updateStudent: "/students/update/:id",
    deleteStudent: "/students/delete",
    toggleStudentStatus: "/students/toggle-status",
  },
  Contacts: {
    getAllContacts: "/contact/get",
    getContactById: "/contact/get/:id",
    createContact: "/contact/create",
    updateContact: "/contact/update/:id",
    deleteContact: "/contact/delete",
  },
  enrollWebsiteform: {
    createEnrollWebsiteForm: "/enroll-form/create",
    getAllEnrollWebsiteForms: "/enroll-form/getAll",
    getEnrollWebsiteFormById: "/enroll-form/get/:id",
    updateEnrollWebsiteForm: "/enroll-form/update/:id",
    deleteEnrollWebsiteForm: "/enroll-form/delete",
  },
  Blogs: {
    getAllBlogs: (options = {}) => {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort_by = "createdAt",
        sort_order = "desc",
        status = "published",
        category = "",
        tags = "",
        author = "",
        date_range = {},
        with_content = false,
        count_only = false,
        exclude_ids = []
      } = options;
      
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
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
      
      return `/blogs/get${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getFeaturedBlogs: (options = {}) => {
      const { 
        limit = 6, 
        type = "featured", 
        with_content = false,
        category = "",
        tags = "",
        exclude_ids = []
      } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('type', type);
      apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
      
      return `/blogs/featured?${queryParams.toString()}`;
    },
    getRelatedBlogs: (options = {}) => {
      const { 
        blogId, 
        limit = 3, 
        tags = "", 
        category = "",
        with_content = false 
      } = options;
      
      if (!blogId) throw new Error('Blog ID is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
      
      return `/blogs/related/${blogId}?${queryParams.toString()}`;
    },
    getBlogById: (id, incrementViews = true) => {
      if (!id) throw new Error('Blog ID is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('increment_views', incrementViews ? 'true' : 'false');
      
      return `/blogs/get/${id}?${queryParams.toString()}`;
    },
    createBlog: "/blogs/create",
    updateBlog: (id) => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/update/${id}`;
    },
    deleteBlog: (id) => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/delete/${id}`;
    },
    getBlogCategories: "/blogs/categories",
    getBlogsByCategory: (categoryId, options = {}) => {
      if (!categoryId) throw new Error('Category ID is required');
      
      const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      
      return `/blogs/category/${categoryId}?${queryParams.toString()}`;
    },
    getBlogAnalytics: (blogId) => {
      if (!blogId) throw new Error('Blog ID is required');
      return `/blogs/analytics/${blogId}`;
    },
    logBlogInteraction: (options = {}) => {
      const { blogId, action, userId = "" } = options;
      
      if (!blogId) throw new Error('Blog ID is required');
      if (!action) throw new Error('Action is required');
      
      return {
        url: '/blogs/interaction',
        data: {
          blog_id: blogId,
          action,
          user_id: userId,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            referrer: document.referrer
          }
        }
      };
    },
    getTrendingBlogs: (options = {}) => {
      const { 
        period = "week", 
        limit = 5, 
        category = "", 
        tags = "" 
      } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      queryParams.append('limit', limit);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      
      return `/blogs/trending?${queryParams.toString()}`;
    },
    getBlogStats: (options = {}) => {
      const { period = "all" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      
      return `/blogs/stats?${queryParams.toString()}`;
    },
    searchBlogs: (options = {}) => {
      const { 
        query = "", 
        limit = 10, 
        fields = ["title", "content"], 
        category = "", 
        tags = "" 
      } = options;
      
      if (!query || query.trim().length === 0) throw new Error('Search query is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('query', query.trim());
      queryParams.append('limit', limit);
      apiUtils.appendArrayParam('fields', fields, queryParams);
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      
      return `/blogs/search?${queryParams.toString()}`;
    },
    getStaticBlogPaths: (options = {}) => {
      const { limit = 100 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('fields', 'id');
      
      return `/blogs/paths?${queryParams.toString()}`;
    },
    getBlogComments: (blogId, options = {}) => {
      if (!blogId) throw new Error('Blog ID is required');
      
      const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      queryParams.append('sort_by', sort_by);
      queryParams.append('sort_order', sort_order);
      
      return `/blogs/comments/${blogId}?${queryParams.toString()}`;
    },
    addBlogComment: (blogId) => {
      if (!blogId) throw new Error('Blog ID is required');
      return `/blogs/comments/${blogId}`;
    },
    getRecentPosts: (options = {}) => {
      const { limit = 5, with_image = true } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('with_image', with_image ? 'true' : 'false');
      queryParams.append('sort_by', 'createdAt');
      queryParams.append('sort_order', 'desc');
      
      return `/blogs/recent?${queryParams.toString()}`;
    },
    getBlogTags: (options = {}) => {
      const { limit = 20, with_count = true } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('with_count', with_count ? 'true' : 'false');
      
      return `/blogs/tags?${queryParams.toString()}`;
    },
  },
  certificate: {
    getAllCertificate: "/certificates/get",
    addCertificate: "/certificates/create",
    getCertificatesByStudentId: "/certificates/get",
  },
  Newsletter: {
    getAllNewsletter: "/newsletter/getAll",
    addNewsletter: "/newsletter/add",
  },
  CorporateTraining: {
    getAllCorporate: "/corporate-training/getAll",
    addCorporate: "/corporate-training/create",
    updateCorporate: "/corporate-training/update/:id",
    deleteCorporate: "/corporate-training/delete",
  },
  Session_Count: {
    getCountByInstructorId: "/track-sessions/get",
  },
  brouchers: {
    createBrouchers: "/broucher",
    getAllBrouchers: (options = {}) => {
      const { page = 1, limit = 10, search = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      
      return `/broucher?${queryParams.toString()}`;
    },
    getBroucherById: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    updateBroucher: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    deleteBroucher: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    downloadBrochure: (courseId, userData = null) => {
      if (!courseId) throw new Error('Course ID is required');
      
      if (userData) {
        return {
          url: `/broucher/download/${courseId}`,
          data: {
            ...userData,
            course_id: courseId
          }
        };
      }
      
      return `/broucher/download/${courseId}`;
    },
    requestBroucher: (options = {}) => {
      const { 
        brochure_id, 
        course_id, 
        full_name, 
        email, 
        phone_number, 
        country_code = "IN"
      } = options;
      
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
    trackBroucherDownload: (options = {}) => {
      const { 
        brochure_id, 
        course_id, 
        user_id, 
        source = "", 
        metadata = {} 
      } = options;
      
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
          metadata: {
            ...metadata,
            browser: navigator?.userAgent || '',
            timestamp: new Date().toISOString()
          }
        }
      };
    }
  },
  enrolledCourses: {
    createEnrolledCourse: "/enroll/create",
    getAllEnrolledCourses: (options = {}) => {
      const { page = 1, limit = 10, search = "", sort_by = "createdAt", sort_order = "desc" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      
      return `/enroll/get?${queryParams.toString()}`;
    },
    getEnrolledCourseById: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/get/${id}`;
    },
    getEnrollmentCountsByStudentId: (studentId) => {
      if (!studentId) throw new Error('Student ID is required');
      return `/enroll/getCount/${studentId}`;
    },
    updateEnrolledCourse: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/update/${id}`;
    },
    deleteEnrolledCourse: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/delete/${id}`;
    },
    getEnrolledCourseByStudentId: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { page = 1, limit = 10, status = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (status) {
        queryParams.append('status', status);
      }
      
      return `/enroll/student/${studentId}?${queryParams.toString()}`;
    },
    getEnrolledStudentsByCourseId: (courseId, options = {}) => {
      if (!courseId) throw new Error('Course ID is required');
      
      const { page = 1, limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      return `/enroll/course/${courseId}?${queryParams.toString()}`;
    },
    getUpcomingMeetingsForStudent: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      
      return `/enroll/get-upcoming-meetings/${studentId}?${queryParams.toString()}`;
    },
    markCourseAsCompleted: "/enroll/mark-completed",
    getAllStudentsWithEnrolledCourses: (options = {}) => {
      const { page = 1, limit = 10, search = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      
      return `/enroll/get-enrolled-students?${queryParams.toString()}`;
    },
    watchVideo: (options = {}) => {
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
    getStudentPayments: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { page = 1, limit = 10, payment_type = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (payment_type) {
        queryParams.append('payment_type', payment_type);
      }
      
      return `/payments/student/${studentId}?${queryParams.toString()}`;
    },
    getPaymentById: (paymentType, paymentId) => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      
      return `/payments/${paymentType}/${paymentId}`;
    },
    getPaymentStats: (options = {}) => {
      const { period = "month" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      
      return `/payments/stats?${queryParams.toString()}`;
    },
    generateReceipt: (paymentType, paymentId) => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      
      return `/payments/receipt/${paymentType}/${paymentId}`;
    },
    resendReceiptEmail: (paymentType, paymentId) => {
      if (!paymentType) throw new Error('Payment type is required');
      if (!paymentId) throw new Error('Payment ID is required');
      
      return `/payments/receipt/${paymentType}/${paymentId}/email`;
    },
    getStudentReceipts: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { page = 1, limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      return `/payments/receipts/student/${studentId}?${queryParams.toString()}`;
    }
  }
};

// Expected response structures
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
    sections: [{
      _id: "string",
      title: "string",
      order: "number",
      duration: "string",
      lessons: [{
        _id: "string",
        title: "string",
        type: "video|document",
        duration: "string",
        video_url: "string",
        content_url: "string",
        is_completed: "boolean",
        resources: [{
          _id: "string",
          title: "string",
          type: "string",
          url: "string"
        }]
      }]
    }],
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
    attachments: [{
      _id: "string",
      filename: "string",
      url: "string"
    }]
  },
  
  quiz: {
    _id: "string",
    title: "string",
    duration: "string",
    total_questions: "number",
    attempts_allowed: "number",
    questions: [{
      _id: "string",
      text: "string",
      type: "multiple_choice|single_choice",
      options: [{
        _id: "string",
        text: "string"
      }]
    }]
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

// API request structures
export const apiRequestStructures = {
  submitAssignment: {
    email: "string",
    content: "string",
    files: "File[]"
  },
  
  submitQuiz: {
    answers: [{
      question_id: "string",
      selected_options: "string[]"
    }],
    time_taken: "string"
  },
  
  markLessonComplete: {
    completion_time: "string",
    notes: "string?"
  }
};

