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
      class_type
    ) => {
      // Initialize query parameters object for better organization
      const queryParams = new URLSearchParams();
      
      // Add required pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add basic filtering parameters
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('search', search, queryParams);
      
      // Add course title if provided and different from search
      if (course_title && course_title !== search) {
        apiUtils.appendParam('course_title', course_title, queryParams);
      }
      
      // Apply array parameters
      apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      
      // Handle category parameter
      if (category && category.length > 0) {
        apiUtils.appendArrayParam('category', category, queryParams);
      }
      
      // Add course grade if provided
      apiUtils.appendParam('course_grade', course_grade, queryParams);

      // Handle additional filters
      if (filters && typeof filters === 'object') {
        // Handle basic string filters
        const stringFilters = [
          { param: 'skill_level', value: filters.skillLevel },
          { param: 'course_type', value: filters.courseType },
          { param: 'language', value: filters.language },
          { param: 'sort', value: filters.sortBy }
        ];
        
        // Add each string filter if it exists
        stringFilters.forEach(({ param, value }) => {
          apiUtils.appendParam(param, value, queryParams);
        });
        
        // Handle array filters
        if (filters.features && Array.isArray(filters.features)) {
          apiUtils.appendArrayParam('features', filters.features, queryParams);
        }
        
        // Handle range filters
        if (filters.priceRange) {
          apiUtils.appendParam('price_min', filters.priceRange.min, queryParams);
          apiUtils.appendParam('price_max', filters.priceRange.max, queryParams);
        }
        
        if (filters.duration) {
          apiUtils.appendParam('duration_min', filters.duration.min, queryParams);
          apiUtils.appendParam('duration_max', filters.duration.max, queryParams);
        }
        
        // Handle date filters
        if (filters.dateRange) {
          apiUtils.appendParam('date_start', filters.dateRange.start, queryParams);
          apiUtils.appendParam('date_end', filters.dateRange.end, queryParams);
        }
      }

      if (class_type) {
        apiUtils.appendArrayParam('class_type', class_type, queryParams);
      }
      
      return `/courses/search?${queryParams.toString()}`;
    },
    getNewCourses: (
      page = 1,
      limit = 10,
      course_tag = "",
      status = "Published",
      search = "",
      user_id = "",
      sort_by = "createdAt",
      sort_order = "desc",
      class_type = ""
    ) => {
      // Use the shared URLSearchParams approach for consistent URL building
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add filtering parameters if provided
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('search', search, queryParams);
      apiUtils.appendParam('user_id', user_id, queryParams);
      
      // Handle array parameters
      apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      
      // Add sorting parameters
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      
      return `/courses/new?${queryParams.toString()}`;
    },
    getCourseNames: "/courses/course-names",
    getCourseTitles: (options = {}) => {
      const { status = "", course_category = "", class_type = "" } = options;
      
      // Initialize URLSearchParams
      const queryParams = new URLSearchParams();
      
      // Add filter parameters
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      
      return `/courses/course-names?${queryParams.toString()}`;
    },
    getAllRelatedCourses: "/courses/related-courses",
    getAllRelatedCoursesWithParams: (courseIds = [], limit = 6) => {
      // Create URL including the endpoint and parameters
      const queryParams = new URLSearchParams();
      
      // Add limit parameter if provided
      if (limit) {
        queryParams.append('limit', limit);
      }
      
      // The API expects course_ids in the POST body, not in the URL
      // This function returns an object with both the URL and course_ids for use in the POST request
      return {
        url: `/courses/related-courses${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
        data: { course_ids: courseIds }
      };
    },
    filterCourses: (options = {}) => {
      const {
        page = 1,
        limit = 10,
        search = "",
        course_category = "",
        category_type = "",
        status = "Published",
        price_range = "",
        course_tag = "",
        class_type = "",
        sort_by = "createdAt",
        sort_order = "desc",
        min_duration = "",
        max_duration = "",
        certification = "",
        has_assignments = "",
        has_projects = "",
        has_quizzes = "",
        exclude_ids = []
      } = options;

      // Initialize URLSearchParams
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add search parameter
      apiUtils.appendParam('search', search, queryParams);
      
      // Add array parameters with support for arrays or comma-separated strings
      apiUtils.appendArrayParam('course_category', course_category, queryParams);
      apiUtils.appendArrayParam('category_type', category_type, queryParams);
      apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
      apiUtils.appendArrayParam('class_type', class_type, queryParams);
      
      // Add filter parameters
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('price_range', price_range, queryParams);
      apiUtils.appendParam('min_duration', min_duration, queryParams);
      apiUtils.appendParam('max_duration', max_duration, queryParams);
      
      // Add feature filters
      apiUtils.appendParam('certification', certification, queryParams);
      apiUtils.appendParam('has_assignments', has_assignments, queryParams);
      apiUtils.appendParam('has_projects', has_projects, queryParams);
      apiUtils.appendParam('has_quizzes', has_quizzes, queryParams);
      
      // Add sorting parameters
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      
      // Handle excluded course IDs
      if (exclude_ids && exclude_ids.length > 0) {
        apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
      }
      
      return `/courses/search?${queryParams.toString()}`;
    },
    getCourseById: (id, studentId = "") => {
      const queryParams = new URLSearchParams();
      
      if (studentId) {
        apiUtils.appendParam('studentId', studentId, queryParams);
      }
      
      return `/courses/get/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getCoorporateCourseByid: (id, coorporateId = "") => {
      const queryParams = new URLSearchParams();
      
      if (coorporateId) {
        apiUtils.appendParam('coorporateId', coorporateId, queryParams);
      }
      
      return `/courses/get-coorporate/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },
    getRecorderVideosForUser: (studentId) => `/courses/recorded-videos/${studentId}`,
    createCourse: "/courses/create",
    updateCourse: (id) => `/courses/update/${id}`,
    toggleCourseStatus: (id) => `/courses/toggle-status/${id}`,
    addRecordedVideos: (id) => `/courses/recorded-videos/${id}`,
    deleteCourse: (id) => `/courses/delete/${id}`,
    softDeleteCourse: (id) => `/courses/soft-delete/${id}`,
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
    /**
     * Get all blogs with pagination and filtering options
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.search=""] - Search term for title/content
     * @param {string} [options.sort_by="createdAt"] - Sort field
     * @param {string} [options.sort_order="desc"] - Sort direction (asc/desc)
     * @param {string} [options.status="published"] - Blog status
     * @param {Array|string} [options.category=""] - Blog categories
     * @param {Array|string} [options.tags=""] - Blog tags
     * @param {string} [options.author=""] - Filter by author ID
     * @param {Object} [options.date_range={}] - Date range filter
     * @param {string} [options.date_range.start=""] - Start date
     * @param {string} [options.date_range.end=""] - End date
     * @returns {string} The constructed API URL
     */
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
        date_range = {}
      } = options;
      
      // Initialize URLSearchParams
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add filtering parameters
      apiUtils.appendParam('search', search, queryParams);
      apiUtils.appendParam('status', status, queryParams);
      apiUtils.appendParam('author', author, queryParams);
      
      // Add array parameters
      apiUtils.appendArrayParam('category', category, queryParams);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      
      // Add date range filters
      if (date_range && Object.keys(date_range).length > 0) {
        apiUtils.appendParam('date_start', date_range.start, queryParams);
        apiUtils.appendParam('date_end', date_range.end, queryParams);
      }
      
      // Add sorting parameters
      apiUtils.appendParam('sort_by', sort_by, queryParams);
      apiUtils.appendParam('sort_order', sort_order, queryParams);
      
      return `/blogs/get${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },

    /**
     * Get featured or popular blogs with limit
     * @param {Object} options - Query options
     * @param {number} [options.limit=6] - Number of blogs to return
     * @param {string} [options.type="featured"] - Type of blogs (featured, popular, recent)
     * @returns {string} The constructed API URL
     */
    getFeaturedBlogs: (options = {}) => {
      const { limit = 6, type = "featured" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('type', type);
      
      return `/blogs/featured?${queryParams.toString()}`;
    },
    
    /**
     * Get related blogs based on current blog
     * @param {Object} options - Query options
     * @param {string|number} options.blogId - Current blog ID
     * @param {number} [options.limit=3] - Number of related blogs to return
     * @param {Array|string} [options.tags=""] - Specific tags to match
     * @returns {string} The constructed API URL
     */
    getRelatedBlogs: (options = {}) => {
      const { blogId, limit = 3, tags = "" } = options;
      
      if (!blogId) throw new Error('Blog ID is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      apiUtils.appendArrayParam('tags', tags, queryParams);
      
      return `/blogs/related/${blogId}?${queryParams.toString()}`;
    },
    
    /**
     * Get a blog by ID
     * @param {string|number} id - Blog ID
     * @param {boolean} [incrementViews=true] - Whether to increment view count
     * @returns {string} The blog API URL
     */
    getBlogById: (id, incrementViews = true) => {
      if (!id) throw new Error('Blog ID is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('incrementViews', incrementViews);
      
      return `/blogs/get/${id}?${queryParams.toString()}`;
    },
    
    /**
     * Create a new blog
     * @returns {string} The blog creation API URL
     */
    createBlog: "/blogs/create",
    
    /**
     * Update an existing blog
     * @param {string|number} id - Blog ID to update
     * @returns {string} The blog update API URL
     */
    updateBlog: (id) => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/update/${id}`;
    },
    
    /**
     * Delete a blog
     * @param {string|number} id - Blog ID to delete
     * @returns {string} The blog deletion API URL
     */
    deleteBlog: (id) => {
      if (!id) throw new Error('Blog ID is required');
      return `/blogs/delete/${id}`;
    },
    
    /**
     * Get all blog categories
     * @returns {string} The blog categories API URL
     */
    getBlogCategories: "/blogs/categories",
    
    /**
     * Get blogs by category
     * @param {string|number} categoryId - Category ID
     * @param {Object} options - Additional query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @returns {string} The constructed API URL
     */
    getBlogsByCategory: (categoryId, options = {}) => {
      if (!categoryId) throw new Error('Category ID is required');
      
      const { page = 1, limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      return `/blogs/category/${categoryId}?${queryParams.toString()}`;
    },
    
    /**
     * Get blog analytics
     * @param {string|number} blogId - Blog ID
     * @returns {string} The blog analytics API URL
     */
    getBlogAnalytics: (blogId) => {
      if (!blogId) throw new Error('Blog ID is required');
      return `/blogs/analytics/${blogId}`;
    },
    
    /**
     * Log user interaction with a blog
     * @param {Object} options - Interaction data
     * @param {string|number} options.blogId - Blog ID
     * @param {string} options.action - Interaction type (view, like, share, comment)
     * @param {string} [options.userId=""] - User ID if available
     * @returns {Object} The URL and data for the API call
     */
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
          timestamp: new Date().toISOString(),
          client_info: {
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
          }
        }
      };
    }
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
};
