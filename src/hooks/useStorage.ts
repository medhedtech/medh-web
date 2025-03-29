import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

// Secret key for encryption (should match the one used in LoginForm.js)
const SECRET_KEY = "secret-key-s3cUr3K3y$12345#";

// Types
export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  permissions?: string[];
  token?: string;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  lastAccessed: string;
  completedLessons: string[];
  completedAssignments: string[];
  completedQuizzes: string[];
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  progress: number;
  currentTime: number;
  updatedAt: string;
}

export interface EnrolledCourse {
  _id: string;
  course_title: string;
  course_description?: string;
  course_image?: string;
  course_category?: string;
  course_grade?: string;
  course_fee?: number;
  enrollment_id?: string;
  progress?: number;
  last_accessed?: string;
  completion_status?: 'completed' | 'in_progress' | 'not_started';
  payment_status?: string;
  is_self_paced?: boolean;
  expiry_date?: string;
}

export interface StorageOptions {
  expires?: number; // Days
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Storage keys
export const STORAGE_KEYS = {
  // Auth related
  TOKEN: 'token',
  USER_ID: 'userId',
  EMAIL: 'email',
  PASSWORD: 'password',
  ROLE: 'role',
  FULL_NAME: 'full_name',
  PERMISSIONS: 'permissions',
  REMEMBER_ME: 'remember_me',
  
  // Course related
  ENROLLED_COURSES: 'enrolled_courses',
  COURSE_PROGRESS: 'course_progress',
  LESSON_PROGRESS_PREFIX: 'lesson-progress-',
  VIDEO_BOOKMARKS_PREFIX: 'video-bookmarks-',
  LAST_COURSE_VIEWED: 'last_course_viewed',
  
  // UI preferences
  DARK_MODE: 'dark_mode',
  VIDEO_AUTOPLAY: 'video-autoplay',
  VIDEO_QUALITY: 'video-quality',
  VIDEO_SPEED: 'video-speed',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

/**
 * Comprehensive storage management hook for handling user data, auth tokens, 
 * course progress and other persistent data using localStorage, cookies, and sessionStorage
 */
const useStorage = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Initialize on mount only in browser environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
    }
  }, []);

  // --- Core storage operations ---

  /**
   * Set value in localStorage with optional encryption
   */
  const setLocalStorage = useCallback((key: string, value: any, encrypt = false): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const valueToStore = encrypt 
        ? CryptoJS.AES.encrypt(typeof value === 'string' ? value : JSON.stringify(value), SECRET_KEY).toString()
        : typeof value === 'string' ? value : JSON.stringify(value);
      
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, []);

  /**
   * Get value from localStorage with optional decryption
   */
  const getLocalStorage = useCallback(<T = any>(key: string, isEncrypted = false, defaultValue: T | null = null): T | null => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      if (isEncrypted) {
        const decrypted = CryptoJS.AES.decrypt(item, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (!decrypted) return defaultValue;
        
        try {
          return JSON.parse(decrypted) as T;
        } catch {
          return decrypted as unknown as T;
        }
      }
      
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, []);

  /**
   * Remove item from localStorage
   */
  const removeLocalStorage = useCallback((key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, []);

  /**
   * Set cookie with configurable options
   */
  const setCookie = useCallback((key: string, value: any, options: StorageOptions = {}): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      Cookies.set(key, valueToStore, {
        expires: options.expires || 30, // Default 30 days
        secure: options.secure !== undefined ? options.secure : true,
        sameSite: options.sameSite || 'lax'
      });
    } catch (error) {
      console.error(`Error setting cookie "${key}":`, error);
    }
  }, []);

  /**
   * Get cookie value
   */
  const getCookie = useCallback(<T = any>(key: string, defaultValue: T | null = null): T | null => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const value = Cookies.get(key);
      if (!value) return defaultValue;
      
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting cookie "${key}":`, error);
      return defaultValue;
    }
  }, []);

  /**
   * Remove cookie
   */
  const removeCookie = useCallback((key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      Cookies.remove(key);
    } catch (error) {
      console.error(`Error removing cookie "${key}":`, error);
    }
  }, []);

  /**
   * Set session storage value
   */
  const setSessionStorage = useCallback((key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, []);

  /**
   * Get session storage value
   */
  const getSessionStorage = useCallback(<T = any>(key: string, defaultValue: T | null = null): T | null => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return defaultValue;
      
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  }, []);

  /**
   * Remove session storage item
   */
  const removeSessionStorage = useCallback((key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, []);

  // --- Auth & User related functions ---

  /**
   * Get authentication token with fallbacks
   */
  const getAuthToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try cookies first (most secure)
      let token = getCookie<string>(STORAGE_KEYS.TOKEN);
      
      // Fall back to localStorage
      if (!token) {
        token = getLocalStorage<string>(STORAGE_KEYS.TOKEN);
      }
      
      // Last resort, check sessionStorage
      if (!token) {
        token = getSessionStorage<string>(STORAGE_KEYS.TOKEN);
      }
      
      return token;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }, [getCookie, getLocalStorage, getSessionStorage]);

  /**
   * Validate and check if the token is still valid
   */
  const validateToken = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = getAuthToken();
      
      if (token) {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired, clear storage
          clearAuthData();
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }, [getAuthToken]);

  /**
   * Save full authentication data across storages
   */
  const saveAuthData = useCallback((data: {
    token: string;
    userId: string;
    email: string;
    password?: string;
    role?: string;
    fullName?: string;
    permissions?: string[];
    rememberMe?: boolean;
  }): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const { token, userId, email, password, role, fullName, permissions, rememberMe } = data;
      
      // Always store in localStorage for API calls
      setLocalStorage(STORAGE_KEYS.TOKEN, token);
      setLocalStorage(STORAGE_KEYS.USER_ID, userId);
      setLocalStorage(STORAGE_KEYS.ROLE, role || '');
      
      if (fullName) {
        setLocalStorage(STORAGE_KEYS.FULL_NAME, fullName);
      }
      
      if (permissions) {
        setLocalStorage(STORAGE_KEYS.PERMISSIONS, permissions);
      }
      
      // If remember me is enabled, store encrypted email/password and long-term cookies
      if (rememberMe) {
        setLocalStorage(STORAGE_KEYS.EMAIL, email, true);
        if (password) {
          setLocalStorage(STORAGE_KEYS.PASSWORD, password, true);
        }
        setLocalStorage(STORAGE_KEYS.REMEMBER_ME, true);
        
        // Also set cookies for 30 days
        setCookie(STORAGE_KEYS.TOKEN, token, { expires: 30 });
        setCookie(STORAGE_KEYS.USER_ID, userId, { expires: 30 });
      } else {
        // Session-only storage
        setSessionStorage(STORAGE_KEYS.TOKEN, token);
        setSessionStorage(STORAGE_KEYS.USER_ID, userId);
        
        // Clear any stored credentials
        removeLocalStorage(STORAGE_KEYS.EMAIL);
        removeLocalStorage(STORAGE_KEYS.PASSWORD);
        removeLocalStorage(STORAGE_KEYS.REMEMBER_ME);
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }, [setLocalStorage, setCookie, setSessionStorage, removeLocalStorage]);

  /**
   * Get user data from storage
   */
  const getUserData = useCallback((): UserData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = getAuthToken();
      const userId = getLocalStorage<string>(STORAGE_KEYS.USER_ID) || 
                      getCookie<string>(STORAGE_KEYS.USER_ID) || 
                      getSessionStorage<string>(STORAGE_KEYS.USER_ID);
                      
      // If either token or userId is missing, user is not logged in
      if (!token || !userId) return null;
      
      // Get email (potentially encrypted)
      const email = getLocalStorage<string>(STORAGE_KEYS.EMAIL, true) || '';
      
      // Get role and other user data
      const role = getLocalStorage<string>(STORAGE_KEYS.ROLE);
      const fullName = getLocalStorage<string>(STORAGE_KEYS.FULL_NAME);
      const permissions = getLocalStorage<string[]>(STORAGE_KEYS.PERMISSIONS);
      
      return {
        id: userId,
        email,
        full_name: fullName || '',
        role: role || '',
        permissions: permissions || [],
        token
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }, [getAuthToken, getLocalStorage, getCookie, getSessionStorage]);

  /**
   * Clear all authentication data from all storages
   */
  const clearAuthData = useCallback((): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Clear from all storage types
      const keysToRemove = [
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.ROLE,
        STORAGE_KEYS.PERMISSIONS,
      ];
      
      keysToRemove.forEach(key => {
        removeLocalStorage(key);
        removeCookie(key);
        removeSessionStorage(key);
      });
      
      // Optionally keep email/password if previously stored with remember me
      // Or clear them explicitly with:
      // removeLocalStorage(STORAGE_KEYS.EMAIL);
      // removeLocalStorage(STORAGE_KEYS.PASSWORD);
      // removeLocalStorage(STORAGE_KEYS.REMEMBER_ME);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, [removeLocalStorage, removeCookie, removeSessionStorage]);

  /**
   * Check if user is logged in
   */
  const isUserLoggedIn = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      return validateToken();
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }, [validateToken]);

  // --- Course related functions ---

  /**
   * Save enrolled courses to storage
   */
  const saveEnrolledCourses = useCallback((courses: EnrolledCourse[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      setLocalStorage(STORAGE_KEYS.ENROLLED_COURSES, courses);
    } catch (error) {
      console.error('Error saving enrolled courses:', error);
    }
  }, [setLocalStorage]);

  /**
   * Get enrolled courses from storage
   */
  const getEnrolledCourses = useCallback((): EnrolledCourse[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      return getLocalStorage<EnrolledCourse[]>(STORAGE_KEYS.ENROLLED_COURSES, false, []) || [];
    } catch (error) {
      console.error('Error getting enrolled courses:', error);
      return [];
    }
  }, [getLocalStorage]);

  /**
   * Save course progress
   */
  const saveCourseProgress = useCallback((courseId: string, progressData: Partial<CourseProgress>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const allProgress = getLocalStorage<Record<string, CourseProgress>>(STORAGE_KEYS.COURSE_PROGRESS, false, {}) || {};
      
      const existingProgress = allProgress[courseId] || {
        courseId,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        completedLessons: [],
        completedAssignments: [],
        completedQuizzes: []
      };
      
      // Update with new data
      const updatedProgress = {
        ...existingProgress,
        ...progressData,
        lastAccessed: new Date().toISOString() // Always update last accessed
      };
      
      // Save back to storage
      allProgress[courseId] = updatedProgress;
      setLocalStorage(STORAGE_KEYS.COURSE_PROGRESS, allProgress);
    } catch (error) {
      console.error(`Error saving progress for course ${courseId}:`, error);
    }
  }, [getLocalStorage, setLocalStorage]);

  /**
   * Get course progress
   */
  const getCourseProgress = useCallback((courseId: string): CourseProgress | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const allProgress = getLocalStorage<Record<string, CourseProgress>>(STORAGE_KEYS.COURSE_PROGRESS, false, {}) || {};
      return allProgress[courseId] || null;
    } catch (error) {
      console.error(`Error getting progress for course ${courseId}:`, error);
      return null;
    }
  }, [getLocalStorage]);

  /**
   * Save lesson progress
   */
  const saveLessonProgress = useCallback((lessonId: string, courseId: string, progress: number, currentTime: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const progressData: LessonProgress = {
        lessonId,
        courseId,
        progress,
        currentTime,
        updatedAt: new Date().toISOString()
      };
      
      setLocalStorage(`${STORAGE_KEYS.LESSON_PROGRESS_PREFIX}${lessonId}`, progressData);
      
      // Also update overall course progress if needed
      const courseProgress = getCourseProgress(courseId);
      if (courseProgress) {
        // Logic to calculate overall course progress based on individual lesson progress
        // This is a simplified version - you may need to adjust this based on your course structure
        saveCourseProgress(courseId, {
          ...courseProgress,
          lastAccessed: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error saving progress for lesson ${lessonId}:`, error);
    }
  }, [setLocalStorage, getCourseProgress, saveCourseProgress]);

  /**
   * Get lesson progress
   */
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return getLocalStorage<LessonProgress>(`${STORAGE_KEYS.LESSON_PROGRESS_PREFIX}${lessonId}`, false, null);
    } catch (error) {
      console.error(`Error getting progress for lesson ${lessonId}:`, error);
      return null;
    }
  }, [getLocalStorage]);

  /**
   * Mark lesson as complete
   */
  const markLessonComplete = useCallback((lessonId: string, courseId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Get current course progress
      const courseProgress = getCourseProgress(courseId) || {
        courseId,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        completedLessons: [],
        completedAssignments: [],
        completedQuizzes: []
      };
      
      // Add lesson to completed lessons if not already there
      if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId);
      }
      
      // Save progress data for lesson
      saveLessonProgress(lessonId, courseId, 100, 0); // 100% complete
      
      // Update course progress percentage based on completed lessons
      // This calculation would depend on how you determine overall course progress
      
      // Save updated course progress
      saveCourseProgress(courseId, courseProgress);
    } catch (error) {
      console.error(`Error marking lesson ${lessonId} as complete:`, error);
    }
  }, [getCourseProgress, saveLessonProgress, saveCourseProgress]);

  /**
   * Save the last viewed course
   */
  const saveLastViewedCourse = useCallback((courseId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      setLocalStorage(STORAGE_KEYS.LAST_COURSE_VIEWED, courseId);
    } catch (error) {
      console.error('Error saving last viewed course:', error);
    }
  }, [setLocalStorage]);

  /**
   * Get the last viewed course
   */
  const getLastViewedCourse = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return getLocalStorage<string>(STORAGE_KEYS.LAST_COURSE_VIEWED, false, null);
    } catch (error) {
      console.error('Error getting last viewed course:', error);
      return null;
    }
  }, [getLocalStorage]);

  /**
   * Save UI preferences
   */
  const saveUiPreference = useCallback((key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    
    try {
      setLocalStorage(key, value);
    } catch (error) {
      console.error(`Error saving UI preference ${key}:`, error);
    }
  }, [setLocalStorage]);

  /**
   * Get UI preference
   */
  const getUiPreference = useCallback(<T = any>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      return getLocalStorage<T>(key, false, defaultValue) || defaultValue;
    } catch (error) {
      console.error(`Error getting UI preference ${key}:`, error);
      return defaultValue;
    }
  }, [getLocalStorage]);

  // Return all the functions
  return {
    isReady,
    
    // Core storage functions
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    setCookie,
    getCookie,
    removeCookie,
    setSessionStorage,
    getSessionStorage,
    removeSessionStorage,
    
    // Auth functions
    getAuthToken,
    validateToken,
    saveAuthData,
    getUserData,
    clearAuthData,
    isUserLoggedIn,
    
    // Course functions
    saveEnrolledCourses,
    getEnrolledCourses,
    saveCourseProgress,
    getCourseProgress,
    saveLessonProgress,
    getLessonProgress,
    markLessonComplete,
    saveLastViewedCourse,
    getLastViewedCourse,
    
    // UI preferences
    saveUiPreference,
    getUiPreference,
    STORAGE_KEYS
  };
};

export default useStorage; 