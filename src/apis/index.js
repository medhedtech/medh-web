// export const apiBaseUrl = "https://medh-backend.vercel.app/api/v1";
export const apiBaseUrl = "http://localhost:8080/api/v1";

export const apiUrls = {
  user: {
    register: "/auth/register",
    login: "/auth/login",
    update: "/auth/update/:id",
    delete: "/auth/delete/:id",
    getDetailsbyId: "/auth/get/:id",
    getAll: "/auth/get-all",
  },
  courses: {
    getAllCoursesWithLimits: (
      page = 1,
      limit = 10,
      course_title,
      course_tag,
      course_category,
      status
    ) =>
      `/courses/getLimitedCourses?page=${page}&limit=${limit}&course_title=${course_title}&course_tag=${course_tag}&course_category=${course_category}&status=${status}`,
    getAllCourses: "/courses/get",
    getCourseById: "/courses/get/:id",
    createCourse: "/courses/create",
    updateCourse: "/courses/update/:id",
    deleteCourse: "/courses/delete/:id",
    getCourseNames: "/courses/course-names",
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
    getInstructorById: "/instructors/get/:id",
    createInstructor: "/instructors/create",
    updateInstructor: "/instructors/update/:id",
    deleteInstructor: "/instructors/delete/:id",
  },
  Students: {
    getAllStudents: "/students/get",
    getStudentById: "/students/get/:id",
    createStudent: "/students/create",
    updateStudent: "/students/update/:id",
    deleteStudent: "/students/delete/:id",
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
  placements:{

  },
  quzies:{

  },
  assignments:{

  },
  feedbacks:{

  },
  resources:{

  },
  assignments:{
    
  }
};
