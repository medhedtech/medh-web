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
      
      // Add validated pagination and sorting parameters
      Object.entries(sanitizedParams).forEach(([key, value]) => {
        queryParams.append(key, value);
      });

      // Handle search parameters with proper validation
      if (search?.trim()) {
        // If general search is provided, use it as primary search parameter
        queryParams.append('search', search.trim());
      } else if (course_title?.trim()) {
        // Use course title as fallback search parameter
        queryParams.append('course_title', course_title.trim());
      }

      // Handle status with validation
      const validStatuses = ['Published', 'Draft', 'Archived'];
      if (status && validStatuses.includes(status)) {
        queryParams.append('status', status);
      }

      // Handle array parameters with proper validation
      const arrayParams = [
        { key: 'course_tag', value: course_tag },
        { key: 'course_category', value: course_category },
        { key: 'category', value: category },
        { key: 'class_type', value: class_type },
        { key: 'category_type', value: category_type }
      ];

      arrayParams.forEach(({ key, value }) => {
        if (value) {
          if (Array.isArray(value)) {
            // Filter out empty values and join with commas
            const validValues = value.filter(item => item?.toString().trim()).map(item => item.toString().trim());
            if (validValues.length > 0) {
              apiUtils.appendArrayParam(key, validValues, queryParams);
            }
          } else if (typeof value === 'string' && value.trim()) {
            apiUtils.appendArrayParam(key, value.trim(), queryParams);
          }
        }
      });
      // Handle course grade if provided
      if (course_grade?.trim()) {
        queryParams.append('course_grade', course_grade.trim());
      }

      // Handle course fee with range support
      if (course_fee) {
        if (typeof course_fee === 'object') {
              // Handle range object format
          if (course_fee.min !== undefined) queryParams.append('course_fee_min', course_fee.min);
          if (course_fee.max !== undefined) queryParams.append('course_fee_max', course_fee.max);
        } else if (!isNaN(parseFloat(course_fee))) {
          // Handle direct numeric value
          queryParams.append('course_fee', parseFloat(course_fee));
        }
      }

      // Handle course duration with special parsing for format like "0 months 2 weeks"
      if (course_duration) {
        if (typeof course_duration === 'object') {
          // Handle range object format
          if (course_duration.min !== undefined) queryParams.append('course_duration_min', course_duration.min);
          if (course_duration.max !== undefined) queryParams.append('course_duration_max', course_duration.max);
        } else if (typeof course_duration === 'string') {
          // Parse duration string format like "0 months 2 weeks"
          queryParams.append('course_duration', course_duration.trim());
        }
      }

      // Handle categorical filters
      const categoricalFilters = {
        course_type,
        skill_level,
        language
      };

      Object.entries(categoricalFilters).forEach(([key, value]) => {
        if (value?.toString().trim()) {
          queryParams.append(key, value.toString().trim());
        }
      });

      // Handle additional filters from filters object
      if (filters && typeof filters === 'object') {
        // Handle certification, assignments, projects, quizzes filters
        const booleanFilters = [
          { param: 'is_Certification', value: filters.certification },
          { param: 'is_Assignments', value: filters.assignments },
          { param: 'is_Projects', value: filters.projects },
          { param: 'is_Quizes', value: filters.quizzes }
        ];
        
        booleanFilters.forEach(({ param, value }) => {
          if (value !== undefined) {
            const boolValue = typeof value === 'string' ? value : (value ? 'Yes' : 'No');
            queryParams.append(param, boolValue);
          }
        });

        // Handle effort per week filter
        if (filters.effortPerWeek) {
          if (typeof filters.effortPerWeek === 'object') {
            if (filters.effortPerWeek.min !== undefined) {
              queryParams.append('min_hours_per_week', filters.effortPerWeek.min);
            }
            if (filters.effortPerWeek.max !== undefined) {
              queryParams.append('max_hours_per_week', filters.effortPerWeek.max);
            }
          }
        }

        // Handle session count filter
        if (filters.noOfSessions !== undefined) {
          queryParams.append('no_of_Sessions', filters.noOfSessions);
        }

        // Handle price filters with currency support
        if (filters.priceRange) {
          if (filters.priceRange.min !== undefined) {
            queryParams.append('price_min', filters.priceRange.min);
          }
          if (filters.priceRange.max !== undefined) {
            queryParams.append('price_max', filters.priceRange.max);
          }
          if (filters.priceRange.currency) {
            queryParams.append('price_currency', filters.priceRange.currency);
          }
        }

        // Handle features array
        if (filters.features?.length) {
          apiUtils.appendArrayParam('features', filters.features, queryParams);
        }

        // Handle tools and technologies
        if (filters.tools?.length) {
          apiUtils.appendArrayParam('tools_technologies', filters.tools, queryParams);
        }

        // Handle date range filters
        if (filters.dateRange) {
          if (filters.dateRange.start) queryParams.append('date_start', filters.dateRange.start);
          if (filters.dateRange.end) queryParams.append('date_end', filters.dateRange.end);
        }

        // Handle free courses filter
        if (filters.isFree !== undefined) {
          queryParams.append('isFree', filters.isFree ? 'true' : 'false');
        }
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
     * @param {boolean} [options.with_content=false] - Include full content in response
     * @param {boolean} [options.count_only=false] - Return only count of matching blogs
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
        date_range = {},
        with_content = false,
        count_only = false,
        exclude_ids = []
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
      
      // Add content options
      apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
      apiUtils.appendParam('count_only', count_only ? 'true' : 'false', queryParams);
      
      // Add excluded blog IDs
      apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
      
      return `/blogs/get${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    },

    /**
     * Get featured or popular blogs with limit
     * @param {Object} options - Query options
     * @param {number} [options.limit=6] - Number of blogs to return
     * @param {string} [options.type="featured"] - Type of blogs (featured, popular, recent)
     * @param {boolean} [options.with_content=false] - Include full content in response
     * @param {Array|string} [options.category=""] - Optional category filter
     * @returns {string} The constructed API URL
     */
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
    
    /**
     * Get related blogs based on current blog
     * @param {Object} options - Query options
     * @param {string|number} options.blogId - Current blog ID
     * @param {number} [options.limit=3] - Number of related blogs to return
     * @param {Array|string} [options.tags=""] - Specific tags to match
     * @param {Array|string} [options.category=""] - Optional category filter
     * @param {boolean} [options.with_content=false] - Include full content in response
     * @returns {string} The constructed API URL
     */
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
    
    /**
     * Get a blog by ID with format matching the fake data structure
     * @param {string|number} id - Blog ID
     * @param {boolean} incrementViews - Whether to increment view count
     * @returns {string} The blog API URL
     */
    getBlogById: (id, incrementViews = true) => {
      if (!id) throw new Error('Blog ID is required');
      
      const queryParams = new URLSearchParams();
      queryParams.append('increment_views', incrementViews ? 'true' : 'false');
      
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
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.sort_by="createdAt"] - Sort field
     * @param {string} [options.sort_order="desc"] - Sort direction (asc/desc)
     * @returns {string} The constructed API URL
     */
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
     * @param {string} [options.userId=""] - User ID if authenticated
     * @returns {Object} Request config for POST request
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
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            referrer: document.referrer
          }
        }
      };
    },

    /**
     * Get trending or popular blogs for a specific period
     * @param {Object} options - Query options
     * @param {string} [options.period="week"] - Time period (day, week, month, year)
     * @param {number} [options.limit=5] - Number of blogs to return
     * @param {Array|string} [options.category=""] - Optional category filter
     * @param {Array|string} [options.tags=""] - Optional tags filter
     * @returns {string} The constructed API URL
     */
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

    /**
     * Get blog stats and metrics
     * @param {Object} options - Query options
     * @param {string} [options.period="all"] - Time period to analyze (day, week, month, year, all)
     * @returns {string} The blog stats API URL
     */
    getBlogStats: (options = {}) => {
      const { period = "all" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      
      return `/blogs/stats?${queryParams.toString()}`;
    },

    /**
     * Search blogs with advanced filtering
     * @param {Object} options - Search options
     * @param {string} options.query - Search query
     * @param {number} [options.limit=10] - Number of results to return
     * @param {Array|string} [options.fields=["title","content"]] - Fields to search in
     * @param {Array|string} [options.category=""] - Category filter
     * @param {Array|string} [options.tags=""] - Tags filter
     * @returns {string} The constructed API URL
     */
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

    /**
     * Generate static paths for pre-rendering blog detail pages
     * This mimics the behavior of generateStaticParams in Next.js
     * @param {Object} options - Query options
     * @param {number} [options.limit=100] - Maximum number of blogs to return IDs for
     * @returns {string} The static paths API URL
     */
    getStaticBlogPaths: (options = {}) => {
      const { limit = 100 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('fields', 'id');
      
      return `/blogs/paths?${queryParams.toString()}`;
    },

    /**
     * Get blog comments
     * @param {string|number} blogId - Blog ID
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.sort_by="createdAt"] - Sort field
     * @param {string} [options.sort_order="desc"] - Sort direction (asc/desc)
     * @returns {string} The blog comments API URL
     */
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

    /**
     * Add a comment to a blog
     * @param {string|number} blogId - Blog ID
     * @returns {string} The blog comment API URL
     */
    addBlogComment: (blogId) => {
      if (!blogId) throw new Error('Blog ID is required');
      return `/blogs/comments/${blogId}`;
    },

    /**
     * Get recent blog posts for widgets
     * @param {Object} options - Query options
     * @param {number} [options.limit=5] - Number of recent posts to return
     * @param {boolean} [options.with_image=true] - Include image URLs in response
     * @returns {string} The recent posts API URL
     */
    getRecentPosts: (options = {}) => {
      const { limit = 5, with_image = true } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('with_image', with_image ? 'true' : 'false');
      queryParams.append('sort_by', 'createdAt');
      queryParams.append('sort_order', 'desc');
      
      return `/blogs/recent?${queryParams.toString()}`;
    },

    /**
     * Get blog tags
     * @param {Object} options - Query options
     * @param {number} [options.limit=20] - Number of tags to return
     * @param {boolean} [options.with_count=true] - Include post count with each tag
     * @returns {string} The blog tags API URL
     */
    getBlogTags: (options = {}) => {
      const { limit = 20, with_count = true } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('with_count', with_count ? 'true' : 'false');
      
      return `/blogs/tags?${queryParams.toString()}`;
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
  brouchers: {
    /**
     * Create a new brochure
     * @param {Object} broucherData - Brochure data to be created
     * @returns {string} The brochure creation API URL
     */
    createBrouchers: "/broucher",
    
    /**
     * Get all brochures with filtering options
     * @param {Object} options - Query parameters
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.search=""] - Search term
     * @returns {string} The brochure list API URL
     */
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
    
    /**
     * Get a specific brochure by ID
     * @param {string} id - Brochure ID
     * @returns {string} The brochure detail API URL
     */
    getBroucherById: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    
    /**
     * Update a brochure by ID
     * @param {string} id - Brochure ID to update
     * @returns {string} The brochure update API URL
     */
    updateBroucher: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    
    /**
     * Delete a brochure by ID
     * @param {string} id - Brochure ID to delete
     * @returns {string} The brochure deletion API URL
     */
    deleteBroucher: (id) => {
      if (!id) throw new Error('Brochure ID is required');
      return `/broucher/${id}`;
    },
    
    /**
     * Download a brochure by course ID
     * @param {string} courseId - Course ID
     * @param {Object} [userData] - User data for POST request
     * @returns {Object|string} The brochure download API URL or request config
     */
    downloadBrochure: (courseId, userData = null) => {
      if (!courseId) throw new Error('Course ID is required');
      
      // If userData is provided, return both URL and data for a POST request
      if (userData) {
        return {
          url: `/broucher/download/${courseId}`,
          data: {
            ...userData,
            course_id: courseId
          }
        };
      }
      
      // Otherwise just return the URL for a GET request
      return `/broucher/download/${courseId}`;
    },
    
    /**
     * Request a brochure download based on either course_id or brochure_id
     * @param {Object} options - Request parameters
     * @param {string} [options.brochure_id] - Brochure ID (optional if course_id is provided)
     * @param {string} [options.course_id] - Course ID (optional if brochure_id is provided)
     * @param {string} options.full_name - User's full name
     * @param {string} options.email - User's email address
     * @param {string} options.phone_number - User's phone number
     * @param {string} options.country_code - Country code for phone number
     * @returns {Object} Request config with URL and data
     */
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
      
      // Prioritize course_id for the URL path as per the API design
      const idToUse = course_id || brochure_id;
      
      return {
        url: `/broucher/download/${idToUse}`,
        data: {
          full_name,
          email,
          phone_number,
          country_code,
          // Only include brochure_id in the body if different from the URL param and it exists
          ...(brochure_id && course_id ? { brochure_id } : {})
        }
      };
    },
    
    /**
     * Track brochure download events
     * @param {Object} options - Tracking parameters
     * @param {string} [options.brochure_id] - Brochure ID (optional if course_id is provided)
     * @param {string} [options.course_id] - Course ID (optional if brochure_id is provided)
     * @param {string} options.user_id - User ID for tracking
     * @param {string} options.source - Source page or referrer
     * @param {Object} [options.metadata] - Additional tracking metadata
     * @returns {Object} Request config with URL and data
     */
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
    /**
     * Create a new enrolled course
     * @returns {string} The enrolled course creation API URL
     */
    createEnrolledCourse: "/enroll/create",
    
    /**
     * Get all enrolled courses with filtering options
     * @param {Object} options - Query parameters
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.search=""] - Search term
     * @returns {string} The enrolled courses list API URL
     */
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
    
    /**
     * Get a specific enrolled course by ID
     * @param {string} id - Enrolled course ID
     * @returns {string} The enrolled course detail API URL
     */
    getEnrolledCourseById: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/get/${id}`;
    },
    
    /**
     * Get enrollment counts for a student
     * @param {string} studentId - Student ID
     * @returns {string} The enrollment counts API URL
     */
    getEnrollmentCountsByStudentId: (studentId) => {
      if (!studentId) throw new Error('Student ID is required');
      return `/enroll/getCount/${studentId}`;
    },
    
    /**
     * Update an enrolled course
     * @param {string} id - Enrolled course ID
     * @returns {string} The enrolled course update API URL
     */
    updateEnrolledCourse: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/update/${id}`;
    },
    
    /**
     * Delete an enrolled course
     * @param {string} id - Enrolled course ID
     * @returns {string} The enrolled course deletion API URL
     */
    deleteEnrolledCourse: (id) => {
      if (!id) throw new Error('Enrolled course ID is required');
      return `/enroll/delete/${id}`;
    },
    
    /**
     * Get enrolled courses by student ID
     * @param {string} studentId - Student ID
     * @param {Object} options - Query parameters
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.status=""] - Filter by enrollment status
     * @returns {string} The enrolled courses by student API URL
     */
    getEnrolledCourseByStudentId: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { page = 1, limit = 10, status = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (status) {
        queryParams.append('status', status);
      }
      
      return `/enrolled-courses/student/${studentId}?${queryParams.toString()}`;
    },
    
    /**
     * Get enrolled students by course ID
     * @param {string} courseId - Course ID
     * @param {Object} options - Query parameters
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @returns {string} The enrolled students by course API URL
     */
    getEnrolledStudentsByCourseId: (courseId, options = {}) => {
      if (!courseId) throw new Error('Course ID is required');
      
      const { page = 1, limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      return `/enrolled-courses/course/${courseId}?${queryParams.toString()}`;
    },
    
    /**
     * Get upcoming meetings for a student
     * @param {string} studentId - Student ID
     * @param {Object} options - Query parameters
     * @param {number} [options.limit=10] - Number of meetings to return
     * @returns {string} The upcoming meetings API URL
     */
    getUpcomingMeetingsForStudent: (studentId, options = {}) => {
      if (!studentId) throw new Error('Student ID is required');
      
      const { limit = 10 } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      
      return `/enrolled-courses/get-upcoming-meetings/${studentId}?${queryParams.toString()}`;
    },
    
    /**
     * Mark a course as completed
     * @returns {string} The mark course as completed API URL
     */
    markCourseAsCompleted: "/enrolled-courses/mark-completed",
    
    /**
     * Get all students with their enrolled courses
     * @param {Object} options - Query parameters
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=10] - Items per page
     * @param {string} [options.search=""] - Search term
     * @returns {string} The students with enrolled courses API URL
     */
    getAllStudentsWithEnrolledCourses: (options = {}) => {
      const { page = 1, limit = 10, search = "" } = options;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }
      
      return `/enrolled-courses/get-enrolled-students?${queryParams.toString()}`;
    },
    
    /**
     * Watch a video from an enrolled course
     * @param {Object} options - Query parameters
     * @param {string} [options.courseId] - Course ID
     * @param {string} [options.videoId] - Video ID
     * @param {string} [options.studentId] - Student ID
     * @returns {string} The watch video API URL
     */
    watchVideo: (options = {}) => {
      const { courseId, videoId, studentId } = options;
      
      const queryParams = new URLSearchParams();
      apiUtils.appendParam('courseId', courseId, queryParams);
      apiUtils.appendParam('videoId', videoId, queryParams);
      apiUtils.appendParam('studentId', studentId, queryParams);
      
      return `/enrolled-courses/watch?${queryParams.toString()}`;
    }
  }
};

