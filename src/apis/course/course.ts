import { IUpdateCourseData } from '@/types/course.types';
import { apiBaseUrl, apiUtils, ICourseFilters, ICourseSearchParams } from '../index'; // Adjust path if needed
import { 
  CoursePriceResponse,
  BulkPriceUpdateResponse,
  ErrorResponse,
  PriceDetails,
  BulkPriceUpdatePayload,
  PriceFilterParams
} from '@/types/api-responses';
import axios from 'axios';

/**
 * Fetches all courses based on specified parameters.
 * @param params - Search parameters for filtering and pagination.
 * @returns The constructed API URL string.
 */
export const getAllCoursesWithLimits = (params: ICourseSearchParams = {}): string => {
  const { page = 1, limit = 12, course_title = "", course_tag = "", course_category = "", status = "Published", search = "", course_grade = "", category = [], filters = {}, class_type = "", course_duration, course_fee, course_type = "", skill_level = "", language = "", sort_by = "createdAt", sort_order = "desc", category_type = "", currency = "" } = params;
  const queryParams = new URLSearchParams();
  try {
    const safePage = apiUtils.safeNumber(page, 1);
    const safeLimit = apiUtils.safeNumber(limit, 12);
    queryParams.append('page', String(Math.max(1, safePage)));
    queryParams.append('limit', String(Math.min(100, Math.max(1, safeLimit))));

    const validSortFields = ['createdAt', 'course_title', 'course_fee'];
    const safeSortBy = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const safeSortOrder = ['asc', 'desc'].includes(sort_order) ? sort_order : 'desc';
    queryParams.append('sort_by', safeSortBy);
    queryParams.append('sort_order', safeSortOrder);

    if (search) {
      const safeSearch = apiUtils.safeEncode(search.trim());
      if (safeSearch) queryParams.append('search', safeSearch);
    }
    if (status) queryParams.append('status', status);

    if (currency) {
      const safeCurrency = apiUtils.safeEncode(currency);
      if (safeCurrency) queryParams.append('currency', safeCurrency);
    }

    if (course_category) {
      if (Array.isArray(course_category)) {
        const safeCategories = course_category.map(cat => apiUtils.safeEncode(cat)).filter(Boolean);
        if (safeCategories.length) queryParams.append('course_category', safeCategories.join(','));
      } else {
        const safeCategory = apiUtils.safeEncode(course_category);
        if (safeCategory) queryParams.append('course_category', safeCategory);
      }
    }

    if (course_tag) apiUtils.appendArrayParam('course_tag', course_tag, queryParams);
    if (category.length > 0) apiUtils.appendArrayParam('category', category, queryParams);
    if (class_type) apiUtils.appendArrayParam('class_type', class_type, queryParams);

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

    if (filters) {
      if (typeof filters.certification === 'boolean') queryParams.append('is_Certification', filters.certification ? 'Yes' : 'No');
      if (typeof filters.assignments === 'boolean') queryParams.append('is_Assignments', filters.assignments ? 'Yes' : 'No');
      if (typeof filters.projects === 'boolean') queryParams.append('is_Projects', filters.projects ? 'Yes' : 'No');
      if (typeof filters.quizzes === 'boolean') queryParams.append('is_Quizes', filters.quizzes ? 'Yes' : 'No');
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
      if (filters.features?.length) apiUtils.appendArrayParam('features', filters.features, queryParams);
      if (filters.tools?.length) apiUtils.appendArrayParam('tools_technologies', filters.tools, queryParams);
      if (filters.dateRange) {
        if (filters.dateRange.start) queryParams.append('date_start', filters.dateRange.start);
        if (filters.dateRange.end) queryParams.append('date_end', filters.dateRange.end);
      }
      if (typeof filters.isFree === 'boolean') queryParams.append('isFree', String(filters.isFree));
    }

    return `${apiBaseUrl}/courses/search?${queryParams.toString()}`;
  } catch (error) {
    console.error('Error building course search URL:', error);
    return `${apiBaseUrl}/courses/search?page=1&limit=12&sort_by=createdAt&sort_order=desc&status=Published`;
  }
};

/**
 * Fetches newly added courses.
 * @param options - Filtering and pagination options.
 * @returns The constructed API URL string.
 */
export const getNewCourses = (options: {
  page?: number; limit?: number; course_tag?: string; status?: string; search?: string;
  user_id?: string; sort_by?: string; sort_order?: string; class_type?: string;
} = {}): string => {
  const { page = 1, limit = 10, course_tag = "", status = "Published", search = "", user_id = "", sort_by = "createdAt", sort_order = "desc", class_type = "" } = options;
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
  return `${apiBaseUrl}/courses/new?${queryParams.toString()}`;
};

/**
 * Fetches course titles based on status, category, and class type.
 * @param options - Filtering options.
 * @returns The constructed API URL string.
 */
export const getCourseTitles = (options: {
  status?: string; course_category?: string; class_type?: string;
} = {}): string => {
  const { status = "", course_category = "", class_type = "" } = options;
  const queryParams = new URLSearchParams();
  apiUtils.appendParam('status', status, queryParams);
  apiUtils.appendArrayParam('course_category', course_category, queryParams);
  apiUtils.appendArrayParam('class_type', class_type, queryParams);
  return `${apiBaseUrl}/courses/course-names?${queryParams.toString()}`;
};

/**
 * Fetches related courses based on a list of course IDs.
 * @param courseIds - Array of course IDs.
 * @param limit - Maximum number of related courses to fetch.
 * @returns An object containing the URL and the data payload.
 */
export const getAllRelatedCourses = (courseIds: string[] = [], limit: number = 6): { url: string; data: { course_ids: string[] } } => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', String(limit));
  const queryString = queryParams.toString();
  return {
    url: `${apiBaseUrl}/courses/related-courses${queryString ? '?' + queryString : ''}`,
    data: { course_ids: courseIds }
  };
};

/**
 * Fetches a specific course by its ID, optionally including student context.
 * @param id - The ID of the course.
 * @param studentId - Optional ID of the student accessing the course.
 * @param currency - Optional currency code (e.g., 'USD', 'INR') to filter prices.
 * @returns The constructed API URL string.
 */
export const getCourseById = (id: string, studentId: string = "", currency: string = ""): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  const queryParams = new URLSearchParams();
  if (studentId) apiUtils.appendParam('studentId', studentId, queryParams);
  if (currency) apiUtils.appendParam('currency', currency, queryParams);
  const queryString = queryParams.toString();
  return `${apiBaseUrl}/courses/${id}${queryString ? '?' + queryString : ''}`;
};

/**
 * Fetches a specific corporate course by its ID, optionally including corporate context.
 * @param id - The ID of the corporate course.
 * @param coorporateId - Optional ID of the corporate entity.
 * @returns The constructed API URL string.
 */
export const getCoorporateCourseById = (id: string, coorporateId: string = ""): string => {
  if (!id) throw new Error('Corporate Course ID cannot be empty');
  const queryParams = new URLSearchParams();
  if (coorporateId) apiUtils.appendParam('coorporateId', coorporateId, queryParams);
  const queryString = queryParams.toString();
  return `${apiBaseUrl}/courses/get-coorporate/${id}${queryString ? '?' + queryString : ''}`;
};

/**
 * Fetches recorded videos accessible to a specific student.
 * @param studentId - The ID of the student.
 * @returns The constructed API URL string.
 */
export const getRecordedVideosForUser = (studentId: string): string => {
  if (!studentId) throw new Error('Student ID cannot be empty');
  return `${apiBaseUrl}/courses/recorded-videos/${studentId}`;
}

/**
 * Provides the endpoint URL for creating a new course.
 * Note: This returns a URL;the actual creation requires a POST request.
 * @returns The API URL string for course creation.
 */
export const createCourse = (): string => `${apiBaseUrl}/courses/create`;

/**
 * Constructs the URL and data payload for updating a course.
 * @param id - The ID of the course to update.
 * @param data - The partial course data to update.
 * @returns An object containing the URL and the data payload.
 */
export const updateCourse = (id: string, data: Partial<IUpdateCourseData>): { url: string; data: Partial<IUpdateCourseData> & { course_id: string; updated_at: string } } => {
  if (!id) throw new Error('Course ID is required for update');
  return {
    url: `${apiBaseUrl}/courses/${id}`,
    data: {
      ...data,
      course_id: id,
      updated_at: new Date().toISOString()
    }
  };
};

/**
 * Provides the endpoint URL for toggling the status of a course.
 * Note: This requires a PATCH or PUT request.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const toggleCourseStatus = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${id}/status`;
}

/**
 * Provides the endpoint URL for updating recorded videos for a course.
 * Note: This likely requires a PUT or POST request.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const updateRecordedVideos = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/recorded-videos/${id}`;
}

/**
 * Provides the endpoint URL for updating a course thumbnail/image.
 * Note: This requires a PATCH request with multipart/form-data containing the image file.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const updateCourseThumbnail = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${id}/thumbnail`;
}

/**
 * Provides the endpoint URL for updating a course thumbnail/image using base64.
 * Note: This requires a PATCH request with JSON containing base64String and fileType.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const updateCourseThumbnailBase64 = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${id}/thumbnail/base64`;
}

/**
 * Provides the endpoint URL for permanently deleting a course.
 * Note: This requires a DELETE request.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const deleteCourse = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/delete/${id}`;
}

/**
 * Provides the endpoint URL for soft-deleting (archiving) a course.
 * Note: This likely requires a PATCH or PUT request.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const softDeleteCourse = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/soft-delete/${id}`;
}

/**
 * Fetches the sections for a specific course.
 * @param courseId - The ID of the course.
 * @returns The constructed API URL string.
 */
export const getCourseSections = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/sections`;
}

/**
 * Fetches the lessons for a specific course.
 * @param courseId - The ID of the course.
 * @returns The constructed API URL string.
 */
export const getCourseLessons = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons`;
}

/**
 * Fetches the details of a specific lesson within a course.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The constructed API URL string.
 */
export const getLessonDetails = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}`;
}

/**
 * Fetches the progress for a specific course (likely for the logged-in user).
 * @param courseId - The ID of the course.
 * @returns The constructed API URL string.
 */
export const getCourseProgress = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/progress`;
}

/**
 * Provides the endpoint URL for marking a lesson as complete.
 * Note: This requires a POST or PUT request.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The API URL string.
 */
export const markLessonComplete = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/complete`;
}

/**
 * Fetches the assignments for a specific course.
 * @param courseId - The ID of the course.
 * @returns The constructed API URL string.
 */
export const getCourseAssignments = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/assignments`;
}

/**
 * Provides the endpoint URL for submitting an assignment.
 * Note: This requires a POST request with submission data.
 * @param courseId - The ID of the course.
 * @param assignmentId - The ID of the assignment.
 * @returns The API URL string.
 */
export const submitAssignment = (courseId: string, assignmentId: string): string => {
  if (!courseId || !assignmentId) throw new Error('Course ID and Assignment ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/assignments/${assignmentId}/submit`;
}

/**
 * Fetches the quizzes for a specific course.
 * @param courseId - The ID of the course.
 * @returns The constructed API URL string.
 */
export const getCourseQuizzes = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/quizzes`;
}

/**
 * Provides the endpoint URL for submitting a quiz.
 * Note: This requires a POST request with quiz answers.
 * @param courseId - The ID of the course.
 * @param quizId - The ID of the quiz.
 * @returns The API URL string.
 */
export const submitQuiz = (courseId: string, quizId: string): string => {
  if (!courseId || !quizId) throw new Error('Course ID and Quiz ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/quizzes/${quizId}/submit`;
}

/**
 * Fetches the results for a specific quiz within a course.
 * @param courseId - The ID of the course.
 * @param quizId - The ID of the quiz.
 * @returns The constructed API URL string.
 */
export const getQuizResults = (courseId: string, quizId: string): string => {
  if (!courseId || !quizId) throw new Error('Course ID and Quiz ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/quizzes/${quizId}/results`;
}

/**
 * Fetches the resources for a specific lesson within a course.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The constructed API URL string.
 */
export const getLessonResources = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/resources`;
}

/**
 * Provides the endpoint URL for downloading a specific resource from a lesson.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @param resourceId - The ID of the resource.
 * @returns The API URL string.
 */
export const downloadResource = (courseId: string, lessonId: string, resourceId: string): string => {
  if (!courseId || !lessonId || !resourceId) throw new Error('Course ID, Lesson ID, and Resource ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}/download`;
}

/**
 * Provides the endpoint URL for uploading a single file related to courses.
 * Note: This requires a POST request with file data.
 * @returns The API URL string.
 */
export const uploadFile = (): string => `${apiBaseUrl}/courses/upload`;

/**
 * Provides the endpoint URL for uploading multiple files related to courses.
 * Note: This requires a POST request with file data.
 * @returns The API URL string.
 */
export const uploadMultipleFiles = (): string => `${apiBaseUrl}/courses/upload-multiple`;

/**
 * Manages notes for a lesson.
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 * @param studentId - The ID of the student
 * @returns The API URL for managing lesson notes
 */
export const getProgressLessonNotes = (courseId: string, lessonId: string, studentId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!lessonId) throw new Error('Lesson ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  return `${apiBaseUrl}/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`;
};

/**
 * Provides the endpoint URL for adding a note to a lesson.
 * Note: This requires a POST request with note data.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The API URL string.
 */
export const addLessonNote = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/notes`;
}

/**
 * Provides the endpoint URL for updating a specific note within a lesson.
 * Note: This requires a PUT or PATCH request.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @param noteId - The ID of the note.
 * @returns The API URL string.
 */
export const updateNote = (courseId: string, lessonId: string, noteId: string): string => {
  if (!courseId || !lessonId || !noteId) throw new Error('Course ID, Lesson ID, and Note ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`;
}

/**
 * Provides the endpoint URL for deleting a specific note within a lesson.
 * Note: This requires a DELETE request.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @param noteId - The ID of the note.
 * @returns The API URL string.
 */
export const deleteNote = (courseId: string, lessonId: string, noteId: string): string => {
  if (!courseId || !lessonId || !noteId) throw new Error('Course ID, Lesson ID, and Note ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`;
}

/**
 * Fetches the bookmarks for a specific lesson within a course.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The constructed API URL string.
 */
export const getLessonBookmarks = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/bookmarks`;
}

/**
 * Provides the endpoint URL for adding a bookmark to a lesson.
 * Note: This requires a POST request with bookmark data.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @returns The API URL string.
 */
export const addLessonBookmark = (courseId: string, lessonId: string): string => {
  if (!courseId || !lessonId) throw new Error('Course ID and Lesson ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/bookmarks`;
}

/**
 * Provides the endpoint URL for updating a specific bookmark within a lesson.
 * Note: This requires a PUT or PATCH request.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @param bookmarkId - The ID of the bookmark.
 * @returns The API URL string.
 */
export const updateBookmark = (courseId: string, lessonId: string, bookmarkId: string): string => {
  if (!courseId || !lessonId || !bookmarkId) throw new Error('Course ID, Lesson ID, and Bookmark ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/bookmarks/${bookmarkId}`;
}

/**
 * Provides the endpoint URL for deleting a specific bookmark within a lesson.
 * Note: This requires a DELETE request.
 * @param courseId - The ID of the course.
 * @param lessonId - The ID of the lesson.
 * @param bookmarkId - The ID of the bookmark.
 * @returns The API URL string.
 */
export const deleteBookmark = (courseId: string, lessonId: string, bookmarkId: string): string => {
  if (!courseId || !lessonId || !bookmarkId) throw new Error('Course ID, Lesson ID, and Bookmark ID cannot be empty');
  return `${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/bookmarks/${bookmarkId}`;
}

/**
 * Provides the endpoint URL for downloading the brochure for a specific course.
 * @param courseId - The ID of the course.
 * @returns The API URL string.
 */
export const downloadBrochure = (courseId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/broucher/download/${courseId}`;
}

/**
 * Provides the endpoint URL for fetching all courses (no parameters by default).
 * Consider using `getAllCoursesWithLimits` for pagination and filtering.
 * @returns The API URL string.
 */
export const getAllCourses = (): string => `${apiBaseUrl}/courses/get`;

/**
 * Tracks progress for course completion.
 * @param courseId - The ID of the course
 * @param studentId - The ID of the student
 * @param overallProgress - The overall progress percentage (0-100)
 * @returns The API URL for tracking progress
 */
export const trackCourseProgress = (courseId: string, studentId: string, overallProgress: number): { url: string; data: any } => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  
  return {
    url: `${apiBaseUrl}/course/${courseId}/student/${studentId}`,
    data: {
      course_id: courseId,
      student_id: studentId,
      overall_progress: Math.min(100, Math.max(0, overallProgress)),
      last_accessed: new Date().toISOString()
    }
  };
};

/**
 * Updates progress for a specific lesson.
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 * @param studentId - The ID of the student
 * @param completed - Whether the lesson is completed
 * @param watchDuration - Duration watched in seconds
 * @param lastPosition - Last position in the video
 * @returns The API URL and data payload for updating lesson progress
 */
export const updateLessonProgress = (
  courseId: string,
  lessonId: string,
  studentId: string,
  completed: boolean = false,
  watchDuration: number = 0,
  lastPosition: number = 0
): { url: string; data: any } => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!lessonId) throw new Error('Lesson ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  
  return {
    url: `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/student/${studentId}`,
    data: {
      lesson_id: lessonId,
      completed,
      watch_duration: watchDuration,
      last_position: lastPosition,
      completion_date: completed ? new Date().toISOString() : undefined
    }
  };
};

/**
 * Gets all progress data for a student across all enrolled courses.
 * @param studentId - The ID of the student
 * @returns The API URL for retrieving student progress
 */
export const getStudentCoursesProgress = (studentId: string): string => {
  if (!studentId) throw new Error('Student ID cannot be empty');
  return `${apiBaseUrl}/progress/student/${studentId}`;
};

/**
 * Gets progress statistics for a student.
 * @param studentId - The ID of the student
 * @returns The API URL for retrieving progress stats
 */
export const getStudentProgressStats = (studentId: string): string => {
  if (!studentId) throw new Error('Student ID cannot be empty');
  return `${apiBaseUrl}/progress/stats/${studentId}`;
};

/**
 * Creates a new note for a lesson.
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 * @param studentId - The ID of the student
 * @param content - The note content
 * @param timestamp - Optional timestamp in the video
 * @returns The API URL and data payload for creating a note
 */
export const createLessonNote = (
  courseId: string,
  lessonId: string,
  studentId: string,
  content: string,
  timestamp?: number
): { url: string; data: any } => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!lessonId) throw new Error('Lesson ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  if (!content) throw new Error('Note content cannot be empty');
  
  return {
    url: `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`,
    data: {
      lesson_id: lessonId,
      content,
      timestamp,
      created_at: new Date().toISOString()
    }
  };
};

/**
 * Gets all comments for a lesson.
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 * @param studentId - The ID of the student
 * @returns The API URL for retrieving lesson comments
 */
export const getLessonComments = (courseId: string, lessonId: string, studentId: string): string => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!lessonId) throw new Error('Lesson ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  return `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`;
};

/**
 * Creates a new comment for a lesson video.
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 * @param studentId - The ID of the student
 * @param content - The comment content
 * @param timestamp - Timestamp in the video for the comment
 * @returns The API URL and data payload for creating a comment
 */
export const createVideoComment = (
  courseId: string,
  lessonId: string,
  studentId: string,
  content: string,
  timestamp: number
): { url: string; data: any } => {
  if (!courseId) throw new Error('Course ID cannot be empty');
  if (!lessonId) throw new Error('Lesson ID cannot be empty');
  if (!studentId) throw new Error('Student ID cannot be empty');
  if (!content) throw new Error('Comment content cannot be empty');
  
  return {
    url: `${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`,
    data: {
      lesson_id: lessonId,
      content,
      timestamp,
      created_at: new Date().toISOString()
    }
  };
};

/**
 * Constructs the URL and data payload for bulk updating multiple course fees.
 * @param updateData - Array of objects containing course ID and new fee/pricing information.
 * @returns An object containing the URL and the data payload.
 */
export const bulkUpdateCourseFees = (updateData: {
  course_id: string;
  course_fee: number;
  prices: {
    currency: string;
    individual: number;
    batch: number;
    min_batch_size?: number;
    max_batch_size?: number;
    early_bird_discount?: number;
    group_discount?: number;
    is_active: boolean;
  }[];
}[]): { url: string; data: { updates: any[] } } => {
  if (!updateData || !Array.isArray(updateData) || updateData.length === 0) {
    throw new Error('Update data must be a non-empty array of course fee updates');
  }
  
  return {
    url: `${apiBaseUrl}/courses/bulk-update-fees`,
    data: {
      updates: updateData.map(item => ({
        ...item,
        updated_at: new Date().toISOString()
      }))
    }
  };
};

// PRICE MANAGEMENT ENDPOINTS

/**
 * Get pricing details for a specific course
 * @param courseId - ID of the course to retrieve prices for
 * @returns Promise containing CoursePriceResponse or ErrorResponse
 */
export const fetchCoursePrices = async (
  courseId: string
): Promise<CoursePriceResponse | ErrorResponse> => {
  try {
    const response = await axios.get<CoursePriceResponse>(
      `${apiBaseUrl}/courses/${courseId}/prices`
    );
    return response.data;
  } catch (error) {
    return handlePriceError(error, 'Failed to fetch course prices');
  }
};

/**
 * Update pricing for a single course
 * @param courseId - ID of the course to update
 * @param prices - Updated price data
 * @returns Promise containing CoursePriceResponse or ErrorResponse
 */
export const updateCoursePricing = async (
  courseId: string,
  prices: PriceDetails[]
): Promise<CoursePriceResponse | ErrorResponse> => {
  try {
    const response = await axios.put<CoursePriceResponse>(
      `${apiBaseUrl}/courses/${courseId}/prices`,
      { prices }
    );
    return response.data;
  } catch (error) {
    return handlePriceError(error, 'Failed to update course prices');
  }
};

/**
 * Bulk update prices for multiple courses
 * @param updates - Array of bulk update payloads
 * @returns Promise containing BulkPriceUpdateResponse or ErrorResponse
 */
export const bulkUpdateCoursePrices = async (
  updates: BulkPriceUpdatePayload[]
): Promise<BulkPriceUpdateResponse | ErrorResponse> => {
  try {
    const response = await axios.post<BulkPriceUpdateResponse>(
      `${apiBaseUrl}/courses/prices/bulk-update`,
      { updates }
    );
    return response.data;
  } catch (error) {
    return handlePriceError(error, 'Bulk price update failed');
  }
};

/**
 * List all courses with pricing information
 * @param filters - Optional filter parameters
 * @returns Promise containing CoursePriceResponse[] or ErrorResponse
 */
export const listAllCoursePrices = async (
  filters?: PriceFilterParams
): Promise<CoursePriceResponse[] | ErrorResponse> => {
  try {
    const response = await axios.get<CoursePriceResponse[]>(
      `${apiBaseUrl}/courses/prices`,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    return handlePriceError(error, 'Failed to list course prices');
  }
};

/**
 * Fetches courses with specific fields.
 * @param options - Optional parameters for filtering and pagination.
 * @returns The constructed API URL string.
 */
export const getCoursesWithFields = (options: {
  page?: number;
  limit?: number;
  fields?: string[];
  status?: string;
  search?: string;
  filters?: Record<string, any>;
} = {}): string => {
  const { page = 1, limit = 10, fields = [], status = "Published", search = "", filters = {} } = options;
  const queryParams = new URLSearchParams();
  
  apiUtils.appendParam('page', page, queryParams);
  apiUtils.appendParam('limit', limit, queryParams);
  apiUtils.appendParam('status', status, queryParams);
  apiUtils.appendParam('search', search, queryParams);
  
  if (fields.length > 0) {
    apiUtils.appendArrayParam('fields', fields, queryParams);
  }
  
  // Add filters to the query parameters
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(`filters[${key}]`, String(value));
      }
    });
  }
  
  return `${apiBaseUrl}/courses/fields?${queryParams.toString()}`;
};

// Shared error handler for price endpoints
const handlePriceError = (error: unknown, defaultMessage: string): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data.message || defaultMessage,
      error: {
        code: error.response?.data.error.code || 'PRICE_API_ERROR',
        details: error.response?.data.error.details
      },
      timestamp: new Date().toISOString()
    };
  }
  return {
    success: false,
    message: defaultMessage,
    error: {
      code: 'UNKNOWN_ERROR',
      details: ['An unexpected error occurred']
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Fetches courses that are marked to be shown on the home page.
 * @returns The API URL string for getting home courses.
 */
export const getHomeCourses = (): string => `${apiBaseUrl}/courses/home`;

/**
 * Provides the endpoint URL for toggling a course's visibility on the home page.
 * Note: This requires a PATCH request and authentication.
 * @param id - The ID of the course.
 * @returns The API URL string.
 */
export const toggleShowInHome = (id: string): string => {
  if (!id) throw new Error('Course ID cannot be empty');
  return `${apiBaseUrl}/courses/${id}/toggle-home`;
}

/**
 * Creates a new course with minimal required fields.
 * This is a simplified version of the course creation process for quick drafts.
 * @returns The API URL string for creating a basic course.
 */
export const createBasicCourse = (): string => `${apiBaseUrl}/courses/create-basic`;

/**
 * Prepares form data for creating a basic course with minimal fields.
 * @param data - The basic course data (title, category, image, etc.)
 * @returns FormData object ready for submission
 */
export const prepareBasicCourseData = (data: {
  course_title: string;
  course_category?: string;
  program_overview?: string;
  benefits?: string;
  learning_objectives?: string[];
  course_requirements?: string[];
  target_audience?: string[];
  no_of_Sessions?: number;
  course_duration?: string;
  class_type?: string;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  course_image?: string | File;
  course_tag?: string;
  course_subtitle?: string;
  course_level?: string;
  course_grade?: string;
  category_type?: string;
  language?: string;
}): FormData => {
  const formData = new FormData();
  
  // Add required field
  formData.append('course_title', data.course_title);
  
  // Add optional fields if provided
  if (data.course_category) formData.append('course_category', data.course_category);
  if (data.program_overview) formData.append('program_overview', data.program_overview);
  if (data.benefits) formData.append('benefits', data.benefits);
  
  // Handle arrays
  if (data.learning_objectives && data.learning_objectives.length > 0) {
    data.learning_objectives.forEach((objective, index) => {
      formData.append(`learning_objectives[${index}]`, objective);
    });
  }
  if (data.course_requirements && data.course_requirements.length > 0) {
    data.course_requirements.forEach((requirement, index) => {
      formData.append(`course_requirements[${index}]`, requirement);
    });
  }
  if (data.target_audience && data.target_audience.length > 0) {
    data.target_audience.forEach((audience, index) => {
      formData.append(`target_audience[${index}]`, audience);
    });
  }
  
  // Add other optional fields
  if (data.no_of_Sessions !== undefined) formData.append('no_of_Sessions', String(data.no_of_Sessions));
  if (data.course_duration) formData.append('course_duration', data.course_duration);
  if (data.class_type) formData.append('class_type', data.class_type);
  if (data.is_Certification) formData.append('is_Certification', data.is_Certification);
  if (data.is_Assignments) formData.append('is_Assignments', data.is_Assignments);
  if (data.is_Projects) formData.append('is_Projects', data.is_Projects);
  if (data.is_Quizes) formData.append('is_Quizes', data.is_Quizes);
  if (data.course_tag) formData.append('course_tag', data.course_tag);
  if (data.course_subtitle) formData.append('course_subtitle', data.course_subtitle);
  if (data.course_level) formData.append('course_level', data.course_level);
  if (data.course_grade) formData.append('course_grade', data.course_grade);
  if (data.category_type) formData.append('category_type', data.category_type);
  if (data.language) formData.append('language', data.language);
  
  // Handle course image - can be a file or a URL string
  if (data.course_image) {
    if (typeof data.course_image === 'string') {
      formData.append('course_image', data.course_image);
    } else {
      formData.append('course_image', data.course_image);
    }
  }
  
  return formData;
};