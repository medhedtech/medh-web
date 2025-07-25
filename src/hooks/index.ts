// Storage management hooks
export { default as useStorage } from './useStorage';
export { default as useStorageManager } from './useStorageManager';
export { useLocalStorage } from './useLocalStorage';
export { default as useLocalStorageDefault } from './useLocalStorage';

// Export types from storage hooks
export type {
  UserData,
  CourseProgress,
  LessonProgress,
  EnrolledCourse,
  StorageOptions,
} from './useStorage';

// Storage keys constant for direct import
export { STORAGE_KEYS } from './useStorage';

// Input hooks
export { default as useDebounce } from './useDebounce';
export { default as useThrottle } from './useThrottle';
export { default as usePrevious } from './usePrevious';

// Data fetching hooks
export { default as useFetch } from './useFetch';
export type { FetchResponse, FetchOptions } from './useFetch';

// API query hooks 
export { default as useGetQuery } from './getQuery.hook';
export { default as usePostQuery } from './postQuery.hook';
export { default as usePutQuery } from './putQuery.hook';
export { default as usePatchQuery } from './patchQuery.hook';
export { default as useDeleteQuery } from './deleteQuery.hook';

export type {
  UseGetQueryParams,
  UseGetQueryReturn,
  UseGetQueryState,
  RetryConfig
} from './getQuery.hook';

export type {
  PostQueryParams,
  PostQueryResult,
  UsePostQueryResult
} from './postQuery.hook';

export type {
  PutQueryParams,
  PutQueryResult,
  PutQueryReturn
} from './putQuery.hook';

export type {
  PatchQueryParams,
  UsePatchQueryResult
} from './patchQuery.hook';

export type {
  DeleteQueryParams,
  UseDeleteQueryResult
} from './deleteQuery.hook';

// DOM interaction hooks
export { default as useClickOutside } from './useClickOutside';
export type { UseClickOutsideOptions } from './useClickOutside';

export { default as useIntersectionObserver } from './useIntersectionObserver';
export type { 
  IntersectionObserverOptions, 
  IntersectionResult 
} from './useIntersectionObserver';

// Error handling hooks
export { default as useErrorBoundary } from './useErrorBoundary';
export type { 
  ErrorBoundaryState, 
  ErrorInfo 
} from './useErrorBoundary';

// Navigation and path hooks
export { default as useIsTrue } from './useIsTrue';
export { default as useIsSecondary } from './useIsSecondary';
export type { 
  UseIsSecondaryOptions,
  UseIsSecondaryResult
} from './useIsSecondary';

// UI/UX hooks
export { default as useMediaQuery } from './useMediaQuery';

export { default as useScrollDirection } from './useScrollDirection';
export type { 
  ScrollDirection,
  ScrollDirectionOptions 
} from './useScrollDirection';

// Alert and notification hooks
export { default as useSweetAlert } from './useSweetAlert';
export type {
  AlertType,
  AlertPosition,
  AlertOptions,
  AlertResult
} from './useSweetAlert';

// Theme hooks
export { default as useTheme } from './useTheme';

// Authentication hooks
export { default as useAuth } from './useAuth';
export { 
  useRequireAuth, 
  useRequireAdmin, 
  useRequireInstructor, 
  useRedirectAuthenticated 
} from './useRequireAuth';
export type { UseRequireAuthOptions, RequireAuthResult } from './useRequireAuth';

// Form handling
export { default as useForm } from './useForm';
export { default as useFormSubmit } from './useFormSubmit';
export type {
  UseFormOptions,
  UseFormResult,
  FormConfig,
  FieldConfig,
  ValidationRule,
  FormErrors,
  FormTouched
} from './useForm';

export type {
  SubmitFormParams,
  UploadFileParams,
  UploadFilesParams,
  UseFormSubmitResult
} from './useFormSubmit';

// Cart and ecommerce hooks
export { default as useCartOfLocalStorage } from './useCartOfLocalStorage';
export { default as useClose } from './useClose';
export type { 
  CartItem,
  UseCartStorageResult
} from './useCartOfLocalStorage';

export type {
  UseCloseResult
} from './useClose';

// Content management hooks 
export { default as useBlog } from './useBlog.hook';
export { default as useCourseLesson } from './useCourseLesson.hook';

export type {
  BlogData,
  BlogCategory,
  BlogComment,
  CommentInput
} from './useBlog.hook';

export type {
  CourseData,
  LessonData,
  CompletionData,
  AssignmentData,
  QuizData
} from './useCourseLesson.hook';

// External API integration hooks
export { useZoomClient } from './useZoomClient';
export type {
  ZoomMeetingDetails,
  ZoomMeetingStatus,
  ZoomClient,
  ZoomClientConfig
} from '../types/zoom';

export { default as useRazorpay } from './useRazorpay';