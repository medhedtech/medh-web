import React, { createContext, useContext, ReactNode } from 'react';
import { useStorageManager } from '@/hooks';
import { 
  UserData, 
  CourseProgress, 
  LessonProgress, 
  EnrolledCourse, 
  STORAGE_KEYS 
} from '@/hooks/useStorage';

// Define the context type with all our storage manager functions
interface StorageContextType {
  // Auth functions
  login: (data: {
    token: string;
    userId: string;
    email: string;
    password?: string;
    role?: string;
    fullName?: string;
    permissions?: string[];
    rememberMe?: boolean;
  }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getCurrentUser: () => UserData | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  
  // Course functions
  saveEnrolledCourses: (courses: EnrolledCourse[]) => void;
  getEnrolledCourses: () => EnrolledCourse[];
  addEnrolledCourse: (course: EnrolledCourse) => void;
  removeEnrolledCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: Partial<CourseProgress>) => void;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  updateLessonProgress: (lessonId: string, courseId: string, progress: number, currentTime: number) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  completeLessonAndUpdateProgress: (lessonId: string, courseId: string, totalLessons: number) => void;
  trackLastViewedCourse: (courseId: string) => void;
  getLastViewedCourse: () => string | null;
  syncCoursesWithServer: (serverCourses: EnrolledCourse[]) => void;
  
  // Preference functions
  setPreference: (key: string, value: any) => void;
  getPreference: <T = any>(key: string, defaultValue: T) => T;
  
  // Storage keys
  STORAGE_KEYS: typeof STORAGE_KEYS;
}

// Create the context with an initial undefined value
const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Provider component that wraps your app and makes storage available to any child component
export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storageManager = useStorageManager();
  
  return (
    <StorageContext.Provider value={storageManager}>
      {children}
    </StorageContext.Provider>
  );
};

// Custom hook to use the storage context
export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  
  return context;
};

// Export the context and provider for direct usage
export default StorageContext; 