// export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL; //live instance URL
export const apiBaseUrl = "http://localhost:8080/api/v1"; // local URL

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
    getAllBlogs: "/blogs/get",
    getBlogById: "/blogs/get/:id",
    createBlog: "/blogs/create",
    updateBlog: "/blogs/update/:id",
    deleteBlog: "/blogs/delete",
  },
  adminDashboard: {
    getDashboardCount: "/dashboard/admin-dashboard-count",
  },
  assignedInstructors: {
    getAllAssignedInstructors: "/assigned-instrutors/assigned",
    getAssignedInstructorById: "/assigned-instrutors/get",
    createAssignedInstructor: "/assigned-instrutors/create",
    updateAssignedInstructor: "/assigned-instrutors/update",
    deleteAssignedInstructor: "/assigned-instrutors/delete",
  },
  placements: {
    addPlacements: "/placements/create",
    getPlacements: "/placements/getAll",
  },
  quzies: {
    getQuizes: "/quizes",
    uploadQuizes: "/quizes/upload",
    quizResponses: "/quizResponses",
    getQuizResponses: "/quizResponses/responses",
    getQuizesById: "/quizes/get",
  },
  assignments: {
    addAssignments: "/assignments/create",
    getAssignments: "/assignments",
    submitAssignments: "/assignments/submit",
    submittedAssignments: "/assignments/submitted/get",
    assignmentsStatus: "/assignments/submition/status",
    assignmentsCountByInstructorId: "/assignments/submitted-assignments-count",
    getAssignmentsByEnrolledCourses: "/assignments/enrolled-assignments",
    getAssignmentsCoorporateEnrolledCourses:
      "/assignments/enrolled-assignments-coorporate",
  },
  feedbacks: {
    createFeedback: "/feedback/",
    getAllFeedbacks: "/feedback/getAll",
    deleteFeedback: "/feedback/delete-feedback",
    createComplaint: "/complaint/",
    getAllComplaints: "/complaint",
    createInstructorComplaint: "/complaint/create",
    getAllInstructorComplaints: "/complaint/getAll",
    createEmployeeComplaint: "/complaint/addEmployee",
    getAllEmployeeComplaints: "/complaint/getAllEmployee",
    deleteComplaint: "/complaint/delete",
    updateComplaintStatus: "/complaint/change-status",
    instructorFeedback: "/feedback/instructor/add",
    getAllInstructorFeedbacks: "/feedback/getAll/instructors-feedbacks",
    deleteInstructorFeedback: "/feedback/instructor",
    createCoorporateFeedback: "/feedback/coorporate/add",
    getAllCoorporateEmployeesFeedbacks: "/feedback/getAll/coorporate-feedbacks",
    deleteCoorporateFeedback: "/feedback/delete-coorporate",
  },
  resources: {},
  categories: {
    getAllCategories: "/categories/getAll",
    getCategoriesById: "/categories/get/:id",
    createCategories: "/categories/create",
    updateCategories: "/categories/update",
    deleteCategories: "/categories/delete",
  },
  EnrollCourse: {
    enrollCourse: "/enroll/create",
    getEnrolledCourse: "/enroll/getAll",
    getCountByStudentId: "/enroll/getCount",
    getEnrolledCourseById: "/enroll/get",
    getEnrolledCoursesByStudentId: "/enroll/student",
    getUpcomingCoursesByStudentId: "/enroll/get-upcoming-meetings",
    getEnrolledStudentsByCourseId: "/enroll/course",
    watchModule: "/enroll/watch",
    getEnrolledStudents: "/enroll/get-enrolled-students",
  },
  CoorporateEnrollCourse: {
    addCooporateAssignToCourse: "/enroll-coorporate/create",
    getCoorporateAssignCourse: "/enroll-coorporate/getAll",
    getCoorporateAssignCourseById: "/enroll-coorporate/get",
    getCoorporateCoursesByCoorporateId: "/enroll-coorporate/getCount",
    getCoorporateStudentCoursesCountByEmployeeId:
      "/enroll-coorporate/courses/corporate-student-count",
    getEnrolledCoursesByEmployeeId: "/enroll-coorporate/getByEmployeeId",
    getEnrolledCoorporatesByCourseId: "/enroll-coorporate/course/:course_id",
    deleteCoorporateAssignCourse: "/enroll-coorporate/delete/:id",
    watchCoorporateModule: "/enroll-coorporate/watchVideo-coorporate",
    getCoorporateCountByCoorporateStudentId:
      "/enroll-coorporate/enrolled-courses/corporate-student-count",
  },
  Subscription: {
    AddSubscription: "/subscription/create",
    getSubscription: "/subscription/getAll",
    getSubscriptionById: "/subscription/get",
    getEnrollmentStatus: "/subscription/enrollStatus",
    getCoorporateEnrollmentsStatus: "/subscription/coorporate-enrollStatus",
    getCoorporateEmployeeEnrollmentsStatus:
      "/subscription/corporate-employee-enroll-status",
    updateSubscription: "/subscription/update",
    deleteSubscription: "/subscription/delete",
    getAllSubscriptionByStudentId: "/subscription/get-subscription",
  },
  Membership: {
    addMembership: "/memberships/create",
    getMembership: "/memberships/getAll",
    getMembershipById: "/memberships/get",
    renewMembershipById: "/memberships/renew",
    updateMembership: "/memberships/update",
    deleteMembership: "/memberships/delete",
    getSelfPackedCount: "/memberships/membership-count",
    getMembershipBbyStudentId: "/memberships/getmembership",
    getRenewAmount: "/memberships/get-renew-amount",
    renewMembership: "/memberships/renew",
  },
  jobForm: {
    getAllJobPosts: "/job-post/getAll",
    getJobPostById: "/job-post/get",
    addJobPost: "/job-post/create",
    updateJobPost: "/job-post/update",
    deleteJobPost: "/job-post/delete",
    addNewJobPost: "/add-job-post/create",
    getAllNewJobs: "/add-job-post/getAll",
    deleteNewJobPost: "/add-job-post/delete",
  },
  brouchers: {
    getAllBrouchers: "/broucher/get",
    addBroucher: "/broucher/create",
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
