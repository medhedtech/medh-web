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
    getAllCoursesWithLimits: (
      page = 1,
      limit = 10,
      course_title,
      course_tag,
      course_category,
      status,
      search,
      course_grade,
      category,
      courseId = ""
    ) => {
      // Helper function to safely encode URI components
      const safeEncode = (value) => {
        if (!value) return '';
        return encodeURIComponent(String(value).trim());
      };
      
      // Build the base URL with required parameters
      let url = `/courses/getLimitedCourses?page=${page}&limit=${limit}&status=${status || 'Published'}`;
      
      // Add optional parameters only if they have values
      if (course_title) url += `&course_title=${safeEncode(course_title)}`;
      
      // Handle course_tag parameter - could be string or array
      if (course_tag) {
        if (Array.isArray(course_tag)) {
          url += `&course_tag=${course_tag.map(tag => safeEncode(tag)).join(',')}`;
        } else {
          url += `&course_tag=${safeEncode(course_tag)}`;
        }
      }
      
      // Handle course_category parameter - could be string, array, or comma-separated string
      if (course_category) {
        if (Array.isArray(course_category)) {
          // If it's an array, join with commas
          url += `&course_category=${course_category.map(cat => safeEncode(cat)).join(',')}`;
        } else if (typeof course_category === 'string' && course_category.includes(',')) {
          // If it's already a comma-separated string, split, encode each part, and rejoin
          const categories = course_category.split(',');
          url += `&course_category=${categories.map(cat => safeEncode(cat.trim())).join(',')}`;
        } else {
          // Single category
          url += `&course_category=${safeEncode(course_category)}`;
        }
      }
      
      // Handle category parameter (legacy support) - similar to course_category
      if (category) {
        if (Array.isArray(category)) {
          url += `&category=${category.map(cat => safeEncode(cat)).join(',')}`;
        } else if (typeof category === 'string' && category.includes(',')) {
          const categories = category.split(',');
          url += `&category=${categories.map(cat => safeEncode(cat.trim())).join(',')}`;
        } else {
          url += `&category=${safeEncode(category)}`;
        }
      }
      
      // Add other optional parameters
      if (search) url += `&search=${safeEncode(search)}`;
      if (course_grade) url += `&course_grade=${safeEncode(course_grade)}`;
      
      // Only add exclude parameter if courseId is provided and not empty
      if (courseId && typeof courseId === 'string' && courseId.trim() !== '') {
        // Sanitize the courseId to prevent ObjectId casting errors
        const sanitizedCourseId = courseId.replace(/['"\\]/g, ''); // Remove quotes and backslashes
        
        if (sanitizedCourseId) {
          url += `&exclude=${sanitizedCourseId}`;
        }
      }
      
      return url;
    },
    getNewCourses: ({
      page = 1,
      limit = 10,
      status,
      course_tag,
      search,
      user_id,
      course_grade,
      course_category
    }) => {
      // Helper function to safely encode URI components
      const safeEncode = (value) => {
        if (!value) return '';
        return encodeURIComponent(String(value).trim());
      };
      
      // Build base URL with required parameters
      let url = `/courses/getNewLimitedCourses?page=${page}&limit=${limit}`;
      
      // Add optional parameters only if they have values
      if (status) url += `&status=${safeEncode(status)}`;
      if (user_id) url += `&user_id=${safeEncode(user_id)}`;
      
      // Handle course_tag parameter - could be string or array
      if (course_tag) {
        if (Array.isArray(course_tag)) {
          // If it's an array, join with commas or use appropriate format for API
          url += `&course_tag=${course_tag.map(tag => safeEncode(tag)).join(',')}`;
        } else {
          url += `&course_tag=${safeEncode(course_tag)}`;
        }
      }
      
      // Handle course_category parameter - could be string, array, or comma-separated string
      if (course_category) {
        if (Array.isArray(course_category)) {
          // If it's an array, join with commas
          url += `&course_category=${course_category.map(cat => safeEncode(cat)).join(',')}`;
        } else if (typeof course_category === 'string' && course_category.includes(',')) {
          // If it's already a comma-separated string, split, encode each part, and rejoin
          const categories = course_category.split(',');
          url += `&course_category=${categories.map(cat => safeEncode(cat.trim())).join(',')}`;
        } else {
          // Single category
          url += `&course_category=${safeEncode(course_category)}`;
        }
      }
      
      // Add other optional parameters
      if (search) url += `&search=${safeEncode(search)}`;
      if (course_grade) url += `&course_grade=${safeEncode(course_grade)}`;
      
      return url;
    },

    getAllCourses: "/courses/get",
    getCourseById: "/courses/get",
    getCoorporateCourseByid: "/courses/get-coorporate",
    createCourse: "/courses/create",
    updateCourse: "/courses/update",
    deleteCourse: "/courses/delete",
    getCourseNames: "/courses/course-names",
    getEnrolledCoursesByStudentId: "/enroll/student",
    toggleCourseStatus: "/courses/toggle-status",
    addRecordedVideos: "/courses/recorded-videos",
    getRecorderVideosForUser: "/courses/recorded-videos",
    getAllRelatedCources: "/courses/related-courses",
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
