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

/**
 * Collaborative Course Fetch Parameters
 */
export interface ICollaborativeFetchParams {
  // Source Control
  source?: 'new' | 'legacy' | 'both';
  
  // Merge Strategies
  merge_strategy?: 'unified' | 'separate' | 'prioritize_new';
  
  // Data Processing
  deduplicate?: boolean;
  similarity_threshold?: number;
  include_metadata?: boolean;
  comparison_mode?: 'detailed' | 'summary' | 'none';
  
  // Standard Filters
  page?: number;
  limit?: number;
  search?: string;
  currency?: string;
  course_category?: string;
  class_type?: string;
  course_grade?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  exclude_ids?: string;
}

/**
 * Advanced Search Parameters
 */
export interface IAdvancedSearchParams extends ICollaborativeFetchParams {
  price_range?: string;
  certification?: 'Yes' | 'No';
  has_assignments?: 'Yes' | 'No';
  has_projects?: 'Yes' | 'No';
  has_quizzes?: 'Yes' | 'No';
  exclude_ids?: string;
  user_id?: string;
  group_by_type?: boolean;
}

/**
 * Curriculum Management Interfaces
 */
export interface ICurriculumWeek {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  lessons?: ICurriculumLesson[];
  sections?: ICurriculumSection[];
  live_classes?: ILiveClass[];
}

export interface ICurriculumLesson {
  _id?: string;
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration?: number;
  order: number;
  is_preview?: boolean;
}

export interface ICurriculumSection {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  resources?: ICourseResource[];
}

export interface ILiveClass {
  _id?: string;
  title: string;
  description?: string;
  scheduled_date: Date;
  duration: number;
  zoom_link?: string;
  recording_url?: string;
  instructor_id?: string;
}

/**
 * API Response Interfaces
 */
export interface ICollaborativeResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata?: {
    performance?: {
      new_model?: {
        fetch_time_ms: number;
        breakdown?: Record<string, number>;
      };
      legacy_model?: {
        fetch_time_ms: number;
        type_distribution?: Record<string, number>;
      };
    };
    deduplication?: {
      duplicates_removed: number;
      processing_time_ms: number;
    };
  };
  comparison?: {
    summary?: {
      new_courses_count: number;
      legacy_courses_count: number;
      total_courses: number;
    };
    detailed?: {
      schema_differences: {
        new_only_fields: string[];
        legacy_only_fields: string[];
        common_fields: string[];
      };
    };
  };
  facets?: {
    categories?: Array<{ _id: string; count: number }>;
    classTypes?: Array<{ _id: string; count: number }>;
    deliveryFormats?: Array<{ _id: string; count: number }>;
    tags?: Array<{ _id: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
  };
}

export interface ISeparateCoursesData {
  new_courses: TNewCourse[];
  legacy_courses: ILegacyCourse[];
}

export interface ICurriculumStats {
  total_weeks: number;
  total_lessons: number;
  total_duration_minutes: number;
  completion_rate?: number;
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
 * New Course Types API Interfaces
 */
export interface IToolTechnology {
  name: string;
  category?: 'programming_language' | 'framework' | 'library' | 'tool' | 'platform' | 'other';
  description?: string;
  logo_url?: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ICourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives?: string[];
  course_requirements?: string[];
  target_audience?: string[];
}

/**
 * Unified Pricing Structure for all course types
 */
export interface IUnifiedPrice {
  currency: 'USD' | 'EUR' | 'INR' | 'GBP' | 'AUD' | 'CAD';
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

export interface IBlendedCourseLesson {
  title: string;
  description: string;
  duration?: number;
  content_type: 'video' | 'text' | 'quiz';
  content_url: string;
  is_preview?: boolean;
  order: number;
}

export interface IBlendedCourseResource {
  title: string;
  description?: string;
  fileUrl: string;
  type?: string;
}

export interface IBlendedCourseAssignment {
  title: string;
  description: string;
  due_date: Date;
  total_points: number;
  instructions: string;
}

export interface IBlendedCurriculumSection {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: IBlendedCourseLesson[];
  resources?: IBlendedCourseResource[];
  assignments?: IBlendedCourseAssignment[];
}

export interface IDoubtSessionSchedule {
  frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'on-demand';
  preferred_days?: string[];
  preferred_time_slots?: Array<{
    start_time: string;
    end_time: string;
    timezone: string;
  }>;
}

export interface IBlendedCourse {
  _id?: string;
  course_type: 'blended';
  course_category: string;
  course_title: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  course_image: string;
  course_description: ICourseDescription;
  course_subcategory?: string;
  course_subtitle?: string;
  course_tag?: string;
  slug?: string;
  language?: string;
  brochures?: string[];
  status?: 'Draft' | 'Published' | 'Upcoming';
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  curriculum: IBlendedCurriculumSection[];
  course_duration: string;
  session_duration: string;
  prices: IUnifiedPrice[];
  doubt_session_schedule?: IDoubtSessionSchedule;
  instructors?: string[];
  prerequisites?: string[];
  certification?: {
    is_certified?: boolean;
    certification_criteria?: {
      min_assignments_score?: number;
      min_quizzes_score?: number;
      min_attendance?: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ILiveCourseSession {
  title: string;
  description: string;
  scheduled_date?: Date;
  duration: number;
  instructor_requirements?: string[];
  zoom_link?: string;
  recording_url?: string;
}

export interface ILiveCourseModule {
  title: string;
  description: string;
  order: number;
  sessions?: ILiveCourseSession[];
  resources?: IBlendedCourseResource[];
}

export interface ICourseSchedule {
  start_date: Date;
  end_date: Date;
  session_days: string[];
  session_time: string;
  timezone: string;
}

export interface ILiveCourse {
  _id?: string;
  course_type: 'live';
  course_category: string;
  course_title: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  course_image: string;
  course_description: ICourseDescription;
  course_subcategory?: string;
  course_subtitle?: string;
  course_tag?: string;
  slug?: string;
  language?: string;
  brochures?: string[];
  status?: 'Draft' | 'Published' | 'Upcoming';
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  course_schedule: ICourseSchedule;
  total_sessions: number;
  session_duration: number;
  modules: ILiveCourseModule[];
  max_students: number;
  prices: IUnifiedPrice[];
  instructors?: string[];
  prerequisites?: string[];
  certification?: {
    is_certified?: boolean;
    attendance_required?: number;
  };
  is_Quizes: 'Yes' | 'No';
  is_Projects: 'Yes' | 'No';
  is_Assignments: 'Yes' | 'No';
  is_Certification: 'Yes' | 'No';
  class_type: 'Live Courses' | 'Blended Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded';
  course_duration: string;
  no_of_Sessions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFreeCourseLesson {
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'pdf' | 'link';
  content: string;
  duration?: number;
  order: number;
  is_preview?: boolean;
}

export interface IFreeCourseResource {
  title: string;
  description?: string;
  url: string;
  type?: 'pdf' | 'link' | 'video' | 'other';
}

export interface IFreeCourse {
  _id?: string;
  course_type: 'free';
  course_category: string;
  course_title: string;
  course_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  course_image: string;
  course_description: ICourseDescription;
  course_subcategory?: string;
  course_subtitle?: string;
  course_tag?: string;
  slug?: string;
  language?: string;
  brochures?: string[];
  status?: 'Draft' | 'Published' | 'Upcoming';
  tools_technologies?: IToolTechnology[];
  faqs?: IFAQ[];
  estimated_duration: string;
  lessons: IFreeCourseLesson[];
  prices: IUnifiedPrice[];
  resources?: IFreeCourseResource[];
  access_type?: 'unlimited' | 'time-limited';
  access_duration?: number;
  prerequisites?: string[];
  target_skills?: string[];
  completion_certificate?: {
    is_available?: boolean;
    requirements?: {
      min_lessons_completed?: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ILegacyCourseLesson {
  title: string;
  description?: string;
  duration?: number;
  content_type?: string;
  url?: string;
  is_preview?: boolean;
}

export interface ILegacyCourseCurriculum {
  weekTitle: string;
  weekDescription?: string;
  lessons?: ILegacyCourseLesson[];
}

export interface ILegacyCourseTool {
  name: string;
  category?: string;
  description?: string;
}

export interface ILegacyCourse {
  _id?: string;
  course_category: string;
  course_title: string;
  course_image: string;
  category_type: 'Paid' | 'Live' | 'Free';
  class_type: 'Blended Courses' | 'Live Courses' | 'Self-Paced' | 'Virtual Learning' | 'Online Classes' | 'Hybrid' | 'Pre-Recorded';
  no_of_Sessions: number;
  course_duration: string;
  is_Certification: 'Yes' | 'No';
  is_Assignments: 'Yes' | 'No';
  is_Projects: 'Yes' | 'No';
  is_Quizes: 'Yes' | 'No';
  course_description: ICourseDescription;
  course_subcategory?: string;
  course_subtitle?: string;
  course_tag?: string;
  course_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  language?: string;
  brochures?: string[];
  status?: 'Draft' | 'Published' | 'Upcoming';
  session_duration?: string;
  isFree?: boolean;
  prices?: IUnifiedPrice[];
  tools_technologies?: ILegacyCourseTool[];
  faqs?: IFAQ[];
  curriculum?: ILegacyCourseCurriculum[];
  efforts_per_Week?: string;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  related_courses?: string[];
  show_in_home?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TCourseType = 'blended' | 'live' | 'free';
export type TNewCourse = IBlendedCourse | ILiveCourse | IFreeCourse;

export interface ICourseTypesResponse<T = TNewCourse> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
  sources?: string[];
}

export interface IAllCoursesResponse {
  success: boolean;
  message: string;
  data: (TNewCourse | ILegacyCourse)[];
  totalCount: number;
  newModelCount: number;
  legacyModelCount: number;
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

/**
 * New Course Types API service with Collaborative Features
 */
export const courseTypesAPI = {
  /**
   * Collaborative Course Fetch (Primary Endpoint)
   * Fetches courses from both new and legacy systems with advanced merge strategies
   * @param params - Collaborative fetch parameters
   * @returns Promise with collaborative response
   */
  fetchCollaborative: async (params: ICollaborativeFetchParams = {}) => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<ICollaborativeResponse<TNewCourse[] | ISeparateCoursesData>>(
      `${apiBaseUrl}/tcourse/collab${queryString}`
    );
  },

  /**
   * Advanced Search with Faceted Filtering
   * Enhanced search with full-text search, facets, and smart currency handling
   * @param params - Advanced search parameters
   * @returns Promise with search results and facets
   */
  advancedSearch: async (params: IAdvancedSearchParams = {}) => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<ICollaborativeResponse<TNewCourse[]>>(
      `${apiBaseUrl}/tcourse/search${queryString}`
    );
  },

  /**
   * Create a new course using the new course types API
   * @param courseData - Course data to create (Blended, Live, or Free course)
   * @returns Promise with created course response
   */
  createCourse: async <T extends TNewCourse>(courseData: T) => {
    return apiClient.post<ICourseTypesResponse<T>>(
      `${apiBaseUrl}/tcourse`,
      courseData
    );
  },

  /**
   * Get courses by type
   * @param type - Course type (blended, live, free)
   * @returns Promise with courses list response
   */
  getCoursesByType: async <T extends TNewCourse>(type: TCourseType) => {
    if (!['blended', 'live', 'free'].includes(type)) {
      throw new Error('Invalid course type. Must be one of: blended, live, free');
    }
    return apiClient.get<ICourseTypesResponse<T[]>>(
      `${apiBaseUrl}/tcourse/${type}`
    );
  },

  /**
   * Get a specific course by type and ID
   * @param type - Course type (blended, live, free)
   * @param id - Course ID
   * @returns Promise with course detail response
   */
  getCourseById: async <T extends TNewCourse>(type: TCourseType, id: string) => {
    if (!id) throw new Error('Course ID cannot be empty');
    if (!['blended', 'live', 'free'].includes(type)) {
      throw new Error('Invalid course type. Must be one of: blended, live, free');
    }
    return apiClient.get<ICourseTypesResponse<T>>(
      `${apiBaseUrl}/tcourse/${type}/${id}`
    );
  },

  /**
   * Update an existing course
   * @param type - Course type (blended, live, free)
   * @param id - Course ID to update
   * @param updateData - Updated course data
   * @returns Promise with updated course response
   */
  updateCourse: async <T extends TNewCourse>(
    type: TCourseType, 
    id: string, 
    updateData: Partial<T>
  ) => {
    if (!id) throw new Error('Course ID cannot be empty');
    if (!['blended', 'live', 'free'].includes(type)) {
      throw new Error('Invalid course type. Must be one of: blended, live, free');
    }
    return apiClient.put<ICourseTypesResponse<T>>(
      `${apiBaseUrl}/tcourse/${type}/${id}`,
      updateData
    );
  },

  /**
   * Delete a course
   * @param type - Course type (blended, live, free)
   * @param id - Course ID to delete
   * @returns Promise with deletion response
   */
  deleteCourse: async (type: TCourseType, id: string) => {
    if (!id) throw new Error('Course ID cannot be empty');
    if (!['blended', 'live', 'free'].includes(type)) {
      throw new Error('Invalid course type. Must be one of: blended, live, free');
    }
    return apiClient.delete<{ message: string }>(
      `${apiBaseUrl}/tcourse/${type}/${id}`
    );
  },

  /**
   * Get all courses (unified - both new and legacy courses)
   * @returns Promise with all courses response
   */
  getAllCourses: async () => {
    return apiClient.get<IAllCoursesResponse>(
      `${apiBaseUrl}/tcourse/all`
    );
  },

  /**
   * Get single course with enhanced options
   * @param type - Course type
   * @param id - Course ID
   * @param options - Additional options
   * @returns Promise with course response
   */
  getCourseWithOptions: async <T extends TNewCourse>(
    type: TCourseType, 
    id: string, 
    options: { currency?: string; include_legacy?: boolean } = {}
  ) => {
    if (!id) throw new Error('Course ID cannot be empty');
    if (!['blended', 'live', 'free'].includes(type)) {
      throw new Error('Invalid course type. Must be one of: blended, live, free');
    }
    
    const queryString = apiUtils.buildQueryString(options);
    return apiClient.get<ICourseTypesResponse<T>>(
      `${apiBaseUrl}/tcourse/${type}/${id}${queryString}`
    );
  },

  /**
   * Blended course specific methods
   */
  blended: {
    /**
     * Create doubt session for a blended course
     * @param courseId - Blended course ID
     * @param sessionData - Doubt session data
     * @returns Promise with session creation response
     */
    createDoubtSession: async (courseId: string, sessionData: any) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.post(
        `${apiBaseUrl}/tcourse/blended/${courseId}/doubt-session`,
        sessionData
      );
    },

    /**
     * Update doubt session schedule
     * @param courseId - Blended course ID
     * @param scheduleData - Schedule data
     * @returns Promise with schedule update response
     */
    updateDoubtSchedule: async (courseId: string, scheduleData: IDoubtSessionSchedule) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.put(
        `${apiBaseUrl}/tcourse/blended/${courseId}/doubt-schedule`,
        scheduleData
      );
    }
  },

  /**
   * Live course specific methods
   */
  live: {
    /**
     * Update course schedule
     * @param courseId - Live course ID
     * @param scheduleData - Schedule data
     * @returns Promise with schedule update response
     */
    updateSchedule: async (courseId: string, scheduleData: ICourseSchedule) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.put(
        `${apiBaseUrl}/tcourse/live/${courseId}/schedule`,
        scheduleData
      );
    },

    /**
     * Add recording to a specific week
     * @param courseId - Live course ID
     * @param weekId - Week ID
     * @param recordingData - Recording data
     * @returns Promise with recording addition response
     */
    addWeekRecording: async (courseId: string, weekId: string, recordingData: any) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.post(
        `${apiBaseUrl}/tcourse/live/${courseId}/week/${weekId}/recording`,
        recordingData
      );
    }
  },

  /**
   * Free course specific methods
   */
  free: {
    /**
     * Update course access settings
     * @param courseId - Free course ID
     * @param accessData - Access settings data
     * @returns Promise with access update response
     */
    updateAccess: async (courseId: string, accessData: { access_type?: 'unlimited' | 'time-limited'; access_duration?: number }) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.put(
        `${apiBaseUrl}/tcourse/free/${courseId}/access`,
        accessData
      );
    }
  },

  /**
   * Curriculum Management Methods
   */
  curriculum: {
    /**
     * Get course curriculum
     * @param type - Course type
     * @param courseId - Course ID
     * @returns Promise with curriculum response
     */
    getCurriculum: async (type: TCourseType, courseId: string) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.get<{ curriculum: ICurriculumWeek[]; stats: ICurriculumStats }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum`
      );
    },

    /**
     * Add week to curriculum
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekData - Week data
     * @returns Promise with week creation response
     */
    addWeek: async (type: TCourseType, courseId: string, weekData: Omit<ICurriculumWeek, '_id'>) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.post<{ week: ICurriculumWeek }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks`,
        weekData
      );
    },

    /**
     * Update curriculum week
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekId - Week ID
     * @param weekData - Updated week data
     * @returns Promise with week update response
     */
    updateWeek: async (type: TCourseType, courseId: string, weekId: string, weekData: Partial<ICurriculumWeek>) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.put<{ week: ICurriculumWeek }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks/${weekId}`,
        weekData
      );
    },

    /**
     * Delete curriculum week
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekId - Week ID
     * @returns Promise with deletion response
     */
    deleteWeek: async (type: TCourseType, courseId: string, weekId: string) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.delete(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks/${weekId}`
      );
    },

    /**
     * Add lesson to week
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekId - Week ID
     * @param lessonData - Lesson data
     * @returns Promise with lesson creation response
     */
    addLesson: async (type: TCourseType, courseId: string, weekId: string, lessonData: Omit<ICurriculumLesson, '_id'>) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.post<{ lesson: ICurriculumLesson }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks/${weekId}/lessons`,
        lessonData
      );
    },

    /**
     * Add section to week
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekId - Week ID
     * @param sectionData - Section data
     * @returns Promise with section creation response
     */
    addSection: async (type: TCourseType, courseId: string, weekId: string, sectionData: Omit<ICurriculumSection, '_id'>) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.post<{ section: ICurriculumSection }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks/${weekId}/sections`,
        sectionData
      );
    },

    /**
     * Add live class to week
     * @param type - Course type
     * @param courseId - Course ID
     * @param weekId - Week ID
     * @param liveClassData - Live class data
     * @returns Promise with live class creation response
     */
    addLiveClass: async (type: TCourseType, courseId: string, weekId: string, liveClassData: Omit<ILiveClass, '_id'>) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      if (!weekId) throw new Error('Week ID cannot be empty');
      return apiClient.post<{ liveClass: ILiveClass }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/weeks/${weekId}/live-classes`,
        liveClassData
      );
    },

    /**
     * Get curriculum statistics
     * @param type - Course type
     * @param courseId - Course ID
     * @returns Promise with curriculum stats
     */
    getStats: async (type: TCourseType, courseId: string) => {
      if (!courseId) throw new Error('Course ID cannot be empty');
      return apiClient.get<{ stats: ICurriculumStats }>(
        `${apiBaseUrl}/tcourse/${type}/${courseId}/curriculum/stats`
      );
    }
  },

  /**
   * Pricing utility methods
   */
  pricing: {
    /**
     * Create a default pricing structure
     * @param currency - Currency code
     * @param individual - Individual price
     * @param batch - Batch price
     * @returns Unified price object
     */
    createPrice: (currency: IUnifiedPrice['currency'], individual: number, batch: number): IUnifiedPrice => ({
      currency,
      individual,
      batch,
      min_batch_size: 2,
      max_batch_size: 10,
      early_bird_discount: 0,
      group_discount: 0,
      is_active: true
    }),

    /**
     * Create multi-currency pricing
     * @param prices - Array of price configurations
     * @returns Array of unified price objects
     */
    createMultiCurrencyPricing: (prices: Array<{ currency: IUnifiedPrice['currency']; individual: number; batch: number; }>): IUnifiedPrice[] => {
      return prices.map(price => courseTypesAPI.pricing.createPrice(price.currency, price.individual, price.batch));
    },

    /**
     * Create free course pricing (empty array)
     * @returns Empty array for free courses
     */
    createFreePricing: (): IUnifiedPrice[] => [],

    /**
     * Validate pricing structure
     * @param prices - Pricing array to validate
     * @returns Boolean indicating if pricing is valid
     */
    validatePricing: (prices: IUnifiedPrice[]): boolean => {
      if (!Array.isArray(prices)) return false;
      
      return prices.every(price => {
        return (
          price.currency &&
          typeof price.individual === 'number' && price.individual >= 0 &&
          typeof price.batch === 'number' && price.batch >= 0 &&
          typeof price.min_batch_size === 'number' && price.min_batch_size >= 2 &&
          typeof price.max_batch_size === 'number' && price.max_batch_size >= price.min_batch_size &&
          typeof price.early_bird_discount === 'number' && price.early_bird_discount >= 0 && price.early_bird_discount <= 100 &&
          typeof price.group_discount === 'number' && price.group_discount >= 0 && price.group_discount <= 100 &&
          typeof price.is_active === 'boolean'
        );
      });
    }
  },

  /**
   * Migration and Analysis Utilities
   */
  migration: {
    /**
     * Get migration analysis data
     * @param options - Analysis options
     * @returns Promise with migration analysis
     */
    getAnalysis: async (options: { comparison_mode?: 'detailed' | 'summary' } = {}) => {
      return courseTypesAPI.fetchCollaborative({
        source: 'both',
        merge_strategy: 'separate',
        comparison_mode: options.comparison_mode || 'detailed',
        include_metadata: true,
        limit: 1000
      });
    },

    /**
     * Compare course schemas
     * @param courseIds - Array of course IDs to exclude from comparison
     * @returns Promise with schema comparison
     */
    compareSchemas: async (courseIds: string[] = []) => {
      return courseTypesAPI.fetchCollaborative({
        source: 'both',
        merge_strategy: 'separate',
        comparison_mode: 'detailed',
        exclude_ids: courseIds.join(',')
      });
    }
  },

  /**
   * Performance Monitoring Utilities
   */
  performance: {
    /**
     * Get performance metrics
     * @param options - Performance monitoring options
     * @returns Promise with performance data
     */
    getMetrics: async (options: { include_breakdown?: boolean } = {}) => {
      return courseTypesAPI.fetchCollaborative({
        source: 'both',
        merge_strategy: 'unified',
        include_metadata: true,
        limit: 1
      });
    },

    /**
     * Test deduplication performance
     * @param threshold - Similarity threshold for testing
     * @returns Promise with deduplication metrics
     */
    testDeduplication: async (threshold: number = 0.8) => {
      return courseTypesAPI.fetchCollaborative({
        source: 'both',
        merge_strategy: 'unified',
        deduplicate: true,
        similarity_threshold: threshold,
        include_metadata: true
      });
    }
  },

  /**
   * Utility Methods for Frontend Integration
   */
  utils: {
    /**
     * Build collaborative fetch parameters with defaults
     * @param overrides - Parameter overrides
     * @returns Complete collaborative fetch parameters
     */
    buildCollaborativeParams: (overrides: Partial<ICollaborativeFetchParams> = {}): ICollaborativeFetchParams => ({
      source: 'both',
      merge_strategy: 'unified',
      deduplicate: false,
      similarity_threshold: 0.8,
      include_metadata: true,
      comparison_mode: 'summary',
      page: 1,
      limit: 20,
      sort_by: 'createdAt',
      sort_order: 'desc',
      ...overrides
    }),

    /**
     * Build advanced search parameters with defaults
     * @param overrides - Parameter overrides
     * @returns Complete advanced search parameters
     */
    buildSearchParams: (overrides: Partial<IAdvancedSearchParams> = {}): IAdvancedSearchParams => ({
      ...courseTypesAPI.utils.buildCollaborativeParams(overrides),
      group_by_type: false,
      ...overrides
    }),

    /**
     * Parse faceted search results for UI components
     * @param facets - Raw facets from API response
     * @returns Parsed facets for UI consumption
     */
    parseFacets: (facets: ICollaborativeResponse['facets'] = {}) => {
      return {
        categories: facets.categories || [],
        classTypes: facets.classTypes || [],
        deliveryFormats: facets.deliveryFormats || [],
        tags: facets.tags || [],
        priceRanges: facets.priceRanges || []
      };
    },

    /**
     * Extract performance insights from metadata
     * @param metadata - Response metadata
     * @returns Performance insights
     */
         extractPerformanceInsights: (metadata: ICollaborativeResponse['metadata'] = {}) => {
       const performance = metadata.performance || {};
       const deduplication = metadata.deduplication;

       return {
         totalFetchTime: (performance.new_model?.fetch_time_ms || 0) + (performance.legacy_model?.fetch_time_ms || 0),
         newModelTime: performance.new_model?.fetch_time_ms || 0,
         legacyModelTime: performance.legacy_model?.fetch_time_ms || 0,
         deduplicationTime: deduplication?.processing_time_ms || 0,
         duplicatesRemoved: deduplication?.duplicates_removed || 0,
         breakdown: performance.new_model?.breakdown || {},
         typeDistribution: performance.legacy_model?.type_distribution || {}
       };
     }
  }
}; 