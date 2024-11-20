export const apiBaseUrl = "https://medh-backend.vercel.app/api/v1";
// export const apiBaseUrl = "http://localhost:8080/api/v1";

export const apiUrls = {
  user: {
    register: "/auth/register",
    login: "/auth/login",
    update: "/auth/update/:id",
    delete: "/auth/delete",
    getDetailsbyId: "/auth/get/:id",
    getAll: "/auth/get-all",
    updateByEmail: "/auth/update-by-email",
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
      isFree
    ) =>
      `/courses/getLimitedCourses?page=${page}&limit=${limit}&course_title=${course_title}&course_tag=${course_tag}&course_category=${course_category}&status=${status}&search=${search}&isFree=${isFree}`,
    getAllCourses: "/courses/get",
    getCourseById: "/courses/get",
    createCourse: "/courses/create",
    updateCourse: "/courses/update/:id",
    deleteCourse: "/courses/delete",
    getCourseNames: "/courses/course-names",
    getEnrolledCoursesByStudentId: "/enroll/student",
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
  },
  Instructor: {
    getAllInstructors: "/instructors/get",
    getInstructorById: "/instructors/get",
    createInstructor: "/instructors/create",
    updateInstructor: "/instructors/update/:id",
    deleteInstructor: "/instructors/delete",
    toggleInstructorsStatus: "/instructors/toggle-status",
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
    addPlacements: "/placements/",
  },
  quzies: {
    getQuizes: "/quizes",
  },
  assignments: {
    getAssignments: "/assignments",
  },
  feedbacks: {
    createFeedback: "/feedback/",
    createComplaint: "/complaint/",
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
    getEnrolledCourse: "/enroll/get",
    getEnrolledCourseById: "/enroll/get",
  },
};
