export const apiBaseUrl = "https://medh-backend.vercel.app/api/v1";
// export const apiBaseUrl = 'http://localhost:8080/api/v1';

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
    getAllCourses: "/courses/get",
    getCourseById: "/courses/get/:id",
    createCourse: "/courses/create",
    updateCourse: "/courses/update/:id",
    deleteCourse: "/courses/delete/:id",
  },
};
