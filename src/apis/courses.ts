import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';

/**
 * Course type definitions
 */
export interface ICourseSection {
  _id: string;
  title: string;
  order: number;
  duration: string;
  lessons: ICourseLesson[];
}

export interface ICourseLesson {
  _id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: string;
  video_url?: string;
  content_url?: string;
  is_completed?: boolean;
  resources?: ICourseResource[];
}

export interface ICourseResource {
  _id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
}

export interface ICourseInstructor {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
}

export interface ICourse {
  _id: string;
  title: string;
  course_subtitle?: string;
  description: string;
  instructor: ICourseInstructor;
  course_image?: string;
  course_fee?: number;
  currency?: string;
  course_duration?: number;
  language?: string;
  subtitle_languages?: string[];
  course_category?: string;
  course_subcategory?: string;
  class_type?: string;
  course_grade?: string;
  skill_level?: string;
  is_certification?: boolean;
  is_assignments?: boolean;
  is_projects?: boolean;
  is_quizzes?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  no_of_sessions?: number;
  features?: string[];
  tools_technologies?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  sections: ICourseSection[];
  progress?: {
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseFilters {
  certification?: boolean;
  assignments?: boolean;
  projects?: boolean;
  quizzes?: boolean;
  effortPerWeek?: {
    min: number;
    max: number;
  };
  noOfSessions?: number;
  features?: string[];
  tools?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  isFree?: boolean;
}

export interface ICourseQueryParams {
  page?: number;
  limit?: number;
  course_title?: string;
  course_tag?: string | string[];
  course_category?: string | string[];
  status?: 'Draft' | 'Published' | 'Archived';
  search?: string;
  course_grade?: string;
  category?: string[];
  filters?: ICourseFilters;
  class_type?: string;
  course_duration?: number | { min: number; max: number };
  course_fee?: number | { min: number; max: number };
  course_type?: string;
  skill_level?: string;
  language?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  category_type?: string;
}

export interface ICourseUpdateInput {
  course_title?: string;
  course_subtitle?: string;
  course_description?: string;
  course_category?: string;
  course_subcategory?: string;
  class_type?: string;
  course_grade?: string;
  language?: string;
  subtitle_languages?: string[];
  course_image?: string;
  assigned_instructor?: string;
  course_duration?: number;
  course_fee?: number;
  is_certification?: boolean;
  is_assignments?: boolean;
  is_projects?: boolean;
  is_quizzes?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  no_of_sessions?: number;
  features?: string[];
  tools_technologies?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  sections?: {
    title: string;
    order: number;
    lessons: {
      title: string;
      type: string;
      duration: string;
      video_url?: string;
      content_url?: string;
      resources?: {
        title: string;
        type: string;
        url: string;
      }[];
    }[];
  }[];
}

/**
 * Course API service
 */
export const courseAPI = {
  /**
   * Get all courses with optional filtering
   * @param params - Query parameters for filtering
   * @returns Promise with course list response
   */
  getAllCourses: async (params: ICourseQueryParams = {}) => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<{ courses: ICourse[]; totalCount: number }>(
      `${apiBaseUrl}/courses/get${queryString}`
    );
  },

  /**
   * Get a single course by ID
   * @param id - Course ID
   * @param studentId - Optional student ID for progress tracking
   * @returns Promise with course detail response
   */
  getCourseById: async (id: string, studentId?: string) => {
    if (!id) throw new Error('Course ID cannot be empty');
    const params = studentId ? { studentId } : {};
    return apiClient.get<{ course: ICourse }>(
      `${apiBaseUrl}/courses/${id}`, 
      params
    );
  },

  /**
   * Create a new course
   * @param courseData - Course data to create
   * @returns Promise with created course response
   */
  createCourse: async (courseData: ICourseUpdateInput) => {
    return apiClient.post<{ course: ICourse }>(
      `${apiBaseUrl}/courses/create`,
      courseData
    );
  },

  /**
   * Update an existing course
   * @param courseId - Course ID to update
   * @param courseData - Updated course data
   * @returns Promise with updated course response
   */
  updateCourse: async (courseId: string, courseData: ICourseUpdateInput) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.put<{ course: ICourse }>(
      `${apiBaseUrl}/courses/update/${courseId}`,
      courseData
    );
  },

  /**
   * Toggle course published status
   * @param courseId - Course ID to toggle
   * @returns Promise with toggle response
   */
  toggleCourseStatus: async (courseId: string) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.patch(
      `${apiBaseUrl}/courses/toggle-status/${courseId}`
    );
  },

  /**
   * Delete a course
   * @param courseId - Course ID to delete
   * @returns Promise with deletion response
   */
  deleteCourse: async (courseId: string) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.delete(
      `${apiBaseUrl}/courses/delete/${courseId}`
    );
  },

  /**
   * Get search suggestions for courses
   * @param query - Search query string
   * @returns Promise with search suggestions
   */
  getSearchSuggestions: async (query: string) => {
    return apiClient.get(
      `${apiBaseUrl}/courses/search-suggestions`,
      { q: query }
    );
  },

  /**
   * Filter courses by various criteria
   * @param courses - Array of courses to filter
   * @param filters - Filter criteria
   * @returns Filtered array of courses
   */
  filterCourses: (courses: ICourse[], filters: Partial<ICourseFilters> = {}): ICourse[] => {
    return courses.filter(course => {
      let matches = true;

      if (typeof filters.certification === 'boolean') {
        matches = matches && course.is_certification === filters.certification;
      }
      if (typeof filters.assignments === 'boolean') {
        matches = matches && course.is_assignments === filters.assignments;
      }
      if (typeof filters.projects === 'boolean') {
        matches = matches && course.is_projects === filters.projects;
      }
      if (typeof filters.quizzes === 'boolean') {
        matches = matches && course.is_quizzes === filters.quizzes;
      }
      if (filters.effortPerWeek) {
        matches = matches && 
          (course.min_hours_per_week || 0) >= filters.effortPerWeek.min &&
          (course.max_hours_per_week || 0) <= filters.effortPerWeek.max;
      }
      if (filters.noOfSessions) {
        matches = matches && course.no_of_sessions === filters.noOfSessions;
      }
      if (filters.features?.length) {
        matches = matches && filters.features.every(feature => 
          course.features?.includes(feature)
        );
      }
      if (filters.tools?.length) {
        matches = matches && filters.tools.every(tool => 
          course.tools_technologies?.includes(tool)
        );
      }
      if (filters.dateRange && course.createdAt) {
        const courseDate = new Date(course.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        matches = matches && courseDate >= startDate && courseDate <= endDate;
      }
      if (typeof filters.isFree === 'boolean') {
        matches = matches && (course.course_fee === 0) === filters.isFree;
      }

      return matches;
    });
  }
}; 