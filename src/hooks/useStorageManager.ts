import { useCallback } from 'react';
import useStorage, { EnrolledCourse, CourseProgress, LessonProgress, UserData } from './useStorage';

/**
 * A simplified storage management hook that provides common operations for
 * managing auth, user data, courses, and course progress.
 */
const useStorageManager = () => {
  const storage = useStorage();

  // --- Auth functions ---

  /**
   * Login user and store authentication data
   */
  const login = useCallback((data: {
    token: string;
    userId: string;
    email: string;
    password?: string;
    role?: string;
    fullName?: string;
    permissions?: string[];
    rememberMe?: boolean;
  }): void => {
    storage.saveAuthData(data);
  }, [storage]);

  /**
   * Logout user by clearing auth data from all storages
   */
  const logout = useCallback((): void => {
    storage.clearAuthData();
  }, [storage]);

  /**
   * Check if user is logged in with a valid token
   */
  const isAuthenticated = useCallback((): boolean => {
    return storage.isUserLoggedIn();
  }, [storage]);

  /**
   * Get current user data from storage
   */
  const getCurrentUser = useCallback((): UserData | null => {
    return storage.getUserData();
  }, [storage]);

  /**
   * Check if current user has specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    const user = storage.getUserData();
    return !!user?.permissions?.includes(permission);
  }, [storage]);

  /**
   * Check if current user has specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    const user = storage.getUserData();
    
    if (!user?.role) return false;
    
    // Handle array of roles or single role string
    if (Array.isArray(user.role)) {
      return user.role.map(r => r.toLowerCase()).includes(role.toLowerCase());
    }
    
    return user.role.toLowerCase() === role.toLowerCase();
  }, [storage]);

  // --- Course functions ---

  /**
   * Save enrolled courses list to storage
   */
  const saveEnrolledCourses = useCallback((courses: EnrolledCourse[]): void => {
    storage.saveEnrolledCourses(courses);
  }, [storage]);

  /**
   * Get enrolled courses from storage
   */
  const getEnrolledCourses = useCallback((): EnrolledCourse[] => {
    return storage.getEnrolledCourses();
  }, [storage]);

  /**
   * Add a single enrolled course to storage
   */
  const addEnrolledCourse = useCallback((course: EnrolledCourse): void => {
    const courses = storage.getEnrolledCourses();
    const exists = courses.some(c => c._id === course._id);
    
    if (!exists) {
      storage.saveEnrolledCourses([...courses, course]);
    }
  }, [storage]);

  /**
   * Remove a single enrolled course from storage
   */
  const removeEnrolledCourse = useCallback((courseId: string): void => {
    const courses = storage.getEnrolledCourses();
    storage.saveEnrolledCourses(courses.filter(c => c._id !== courseId));
  }, [storage]);

  /**
   * Update a course's progress and related data
   */
  const updateCourseProgress = useCallback((courseId: string, progress: Partial<CourseProgress>): void => {
    storage.saveCourseProgress(courseId, progress);
    
    // Also update the course in the enrolled courses list
    const courses = storage.getEnrolledCourses();
    const updatedCourses = courses.map(course => {
      if (course._id === courseId) {
        return {
          ...course,
          progress: progress.progress !== undefined ? progress.progress : course.progress,
          last_accessed: new Date().toISOString()
        };
      }
      return course;
    });
    
    storage.saveEnrolledCourses(updatedCourses);
  }, [storage]);

  /**
   * Get a course's progress data
   */
  const getCourseProgress = useCallback((courseId: string): CourseProgress | null => {
    return storage.getCourseProgress(courseId);
  }, [storage]);
  
  /**
   * Update progress for a specific lesson
   */
  const updateLessonProgress = useCallback((
    lessonId: string, 
    courseId: string, 
    progress: number, 
    currentTime: number
  ): void => {
    storage.saveLessonProgress(lessonId, courseId, progress, currentTime);
  }, [storage]);

  /**
   * Get progress for a specific lesson
   */
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | null => {
    return storage.getLessonProgress(lessonId);
  }, [storage]);

  /**
   * Mark a lesson as complete and update course progress
   */
  const completeLessonAndUpdateProgress = useCallback((
    lessonId: string, 
    courseId: string, 
    totalLessons: number
  ): void => {
    // Mark the lesson as complete in storage
    storage.markLessonComplete(lessonId, courseId);
    
    // Get the updated course progress
    const courseProgress = storage.getCourseProgress(courseId);
    if (!courseProgress) return;
    
    // Calculate percentage complete
    const completedCount = courseProgress.completedLessons.length;
    const percentComplete = Math.min(Math.round((completedCount / totalLessons) * 100), 100);
    
    // Update the course progress with calculated percentage
    storage.saveCourseProgress(courseId, {
      ...courseProgress,
      progress: percentComplete
    });
    
    // Update the course in enrolled courses list
    const courses = storage.getEnrolledCourses();
    const updatedCourses = courses.map(course => {
      if (course._id === courseId) {
        return {
          ...course,
          progress: percentComplete,
          last_accessed: new Date().toISOString(),
          completion_status: percentComplete === 100 ? 'completed' : 'in_progress'
        };
      }
      return course;
    });
    
    storage.saveEnrolledCourses(updatedCourses);
  }, [storage]);

  /**
   * Get and save the last viewed course
   */
  const trackLastViewedCourse = useCallback((courseId: string): void => {
    storage.saveLastViewedCourse(courseId);
  }, [storage]);

  /**
   * Get the last viewed course ID
   */
  const getLastViewedCourse = useCallback((): string | null => {
    return storage.getLastViewedCourse();
  }, [storage]);

  /**
   * Sync local storage course data with server
   * Call this when fetching fresh data from server to ensure local storage is up-to-date
   */
  const syncCoursesWithServer = useCallback((serverCourses: EnrolledCourse[]): void => {
    // Get local courses
    const localCourses = storage.getEnrolledCourses();
    
    // Create map of local courses for quick lookup
    const localCoursesMap = localCourses.reduce((map, course) => {
      map[course._id] = course;
      return map;
    }, {} as Record<string, EnrolledCourse>);
    
    // Merge server and local data
    const mergedCourses = serverCourses.map(serverCourse => {
      const localCourse = localCoursesMap[serverCourse._id];
      
      // If local course exists, merge any local data not present in server data
      if (localCourse) {
        return {
          ...serverCourse,
          // Keep local progress if server progress is not set
          progress: serverCourse.progress ?? localCourse.progress
        };
      }
      
      return serverCourse;
    });
    
    // Save merged data
    storage.saveEnrolledCourses(mergedCourses);
  }, [storage]);

  /**
   * Save a UI preference
   */
  const setPreference = useCallback((key: string, value: any): void => {
    storage.saveUiPreference(key, value);
  }, [storage]);

  /**
   * Get a UI preference
   */
  const getPreference = useCallback(<T = any>(key: string, defaultValue: T): T => {
    return storage.getUiPreference(key, defaultValue);
  }, [storage]);

  return {
    // Auth functions
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasPermission,
    hasRole,
    
    // Course functions
    saveEnrolledCourses,
    getEnrolledCourses,
    addEnrolledCourse,
    removeEnrolledCourse,
    updateCourseProgress,
    getCourseProgress,
    updateLessonProgress,
    getLessonProgress,
    completeLessonAndUpdateProgress,
    trackLastViewedCourse,
    getLastViewedCourse,
    syncCoursesWithServer,
    
    // Preference functions
    setPreference,
    getPreference,
    
    // Access to storage keys
    STORAGE_KEYS: storage.STORAGE_KEYS
  };
};

export default useStorageManager; 