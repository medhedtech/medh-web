export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL; //live instance URL
// export const apiBaseUrl = "http://localhost:8080/api/v1"; // local URL

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
      filters = {}
    ) => {
      // Helper function to safely encode URI components
      const safeEncode = (value) => {
        if (!value) return '';
        return encodeURIComponent(String(value).trim());
      };
      
      // Build the base URL with required parameters
      let url = `/courses/search?page=${page}&limit=${limit}`;
      
      // Add status if provided
      if (status) url += `&status=${safeEncode(status)}`;
      
      // Handle search parameter first (highest priority)
      if (search) {
        url += `&search=${safeEncode(search)}`;
      }
      
      // Add course title if provided and different from search
      if (course_title && course_title !== search) {
        url += `&course_title=${safeEncode(course_title)}`;
      }
      
      // Handle course_tag parameter - could be string or array
      if (course_tag) {
        if (Array.isArray(course_tag)) {
          const tags = course_tag.filter(tag => tag).map(tag => safeEncode(tag));
          if (tags.length > 0) {
            url += `&course_tag=${tags.join(',')}`;
          }
        } else if (typeof course_tag === 'string' && course_tag.trim()) {
          url += `&course_tag=${safeEncode(course_tag)}`;
        }
      }
      
      // Handle course_category parameter
      if (course_category) {
        if (Array.isArray(course_category)) {
          const categories = course_category.filter(cat => cat).map(cat => safeEncode(cat));
          if (categories.length > 0) {
            url += `&course_category=${categories.join(',')}`;
          }
        } else if (typeof course_category === 'string') {
          const categories = course_category.split(',').map(cat => cat.trim()).filter(cat => cat);
          if (categories.length > 0) {
            url += `&course_category=${categories.map(cat => safeEncode(cat)).join(',')}`;
          }
        }
      }
      
      // Handle category parameter
      if (category && category.length > 0) {
        const categories = Array.isArray(category) ? category : [category];
        const filteredCategories = categories.filter(cat => cat).map(cat => safeEncode(cat));
        if (filteredCategories.length > 0) {
          url += `&category=${filteredCategories.join(',')}`;
        }
      }
      
      // Add course grade if provided
      if (course_grade) {
        url += `&course_grade=${safeEncode(course_grade)}`;
      }

      // Handle additional filters
      if (filters && typeof filters === 'object') {
        // Handle skill level
        if (filters.skillLevel) {
          url += `&skill_level=${safeEncode(filters.skillLevel)}`;
        }

        // Handle course type
        if (filters.courseType) {
          url += `&course_type=${safeEncode(filters.courseType)}`;
        }

        // Handle language
        if (filters.language) {
          url += `&language=${safeEncode(filters.language)}`;
        }

        // Handle features
        if (filters.features && Array.isArray(filters.features)) {
          const features = filters.features.filter(f => f).map(f => safeEncode(f));
          if (features.length > 0) {
            url += `&features=${features.join(',')}`;
          }
        }

        // Handle price range
        if (filters.priceRange) {
          if (filters.priceRange.min !== undefined) {
            url += `&price_min=${filters.priceRange.min}`;
          }
          if (filters.priceRange.max !== undefined) {
            url += `&price_max=${filters.priceRange.max}`;
          }
        }

        // Handle duration range
        if (filters.duration) {
          if (filters.duration.min !== undefined) {
            url += `&duration_min=${filters.duration.min}`;
          }
          if (filters.duration.max !== undefined) {
            url += `&duration_max=${filters.duration.max}`;
          }
        }

        // Handle sort options
        if (filters.sortBy) {
          url += `&sort=${safeEncode(filters.sortBy)}`;
        }

        // Handle date filters
        if (filters.dateRange) {
          if (filters.dateRange.start) {
            url += `&date_start=${safeEncode(filters.dateRange.start)}`;
          }
          if (filters.dateRange.end) {
            url += `&date_end=${safeEncode(filters.dateRange.end)}`;
          }
        }
      }
      
      return url;
    },
    getNewCourses: "/courses/new",
    getCourseNames: "/courses/course-names",
    getAllRelatedCourses: "/courses/related-courses",
    getCourseById: (id) => `/courses/get/${id}`,
    getCoorporateCourseByid: (id) => `/courses/get-coorporate/${id}`,
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
