// Common utility functions for enrollment pages

// Define types for the application
interface GradeOption {
  gradeRange: string[];
  recommendedFor: string[];
}

interface SharedGradeOptions {
  schoolStudent: GradeOption;
  [key: string]: GradeOption;
}

interface CategoryHighlight {
  displayName: string;
  description: string;
  shortDescription: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  subtitle: string;
  colorRgb: string;
  icon: string;
  highlights: string[];
  recommendedFor: string[];
  targetGrades?: string[];
  recommendedGrades?: string[];
}

interface CategoryMap {
  [key: string]: CategoryHighlight;
}

interface DurationFilter {
  test: (course: any) => boolean;
  days: number;
}

// Shared grade configurations for specific categories
const SHARED_GRADE_OPTIONS: SharedGradeOptions = {
  schoolStudent: {
    gradeRange: ['Grade 5-6', 'Grade 7-8', 'Grade 9-10', 'Grade 11-12'],
    recommendedFor: ['Students preparing for competitive exams', 'Students aged 10-18 years']
  }
};

// Map of category slugs to their display names and attributes
export const CATEGORY_MAP: CategoryMap = {
  'vedic-mathematics': {
    displayName: 'Vedic Mathematics',
    description: 'Master ancient calculation techniques that speed up mathematical operations and enhance problem-solving skills.',
    shortDescription: 'Ancient calculation techniques for faster math operations and enhanced mental abilities.',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    subtitle: 'Traditional Indian methods for quick calculations',
    colorRgb: '16, 185, 129', // Emerald 500
    icon: 'calculator', // For Lucide icon mapping
    highlights: [
      'Learn calculation shortcuts and mental math techniques',
      'Improve problem-solving speed and accuracy',
      'Develop stronger number sense and mathematical intuition',
      'Applicable to competitive exams and daily calculations'
    ],
    recommendedFor: SHARED_GRADE_OPTIONS.schoolStudent.recommendedFor,
    targetGrades: SHARED_GRADE_OPTIONS.schoolStudent.gradeRange,
    recommendedGrades: ['Grade 7-8', 'Grade 9-10'] // Most suitable grades for this subject
  },
  'ai-and-data-science': {
    displayName: 'AI and Data Science',
    description: 'Explore the cutting-edge fields of artificial intelligence and data science with hands-on projects and practical skills.',
    shortDescription: 'Master modern AI algorithms, machine learning techniques, and data analysis skills.',
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-900/20',
    borderClass: 'border-violet-200 dark:border-violet-800',
    subtitle: 'Future-ready skills for the data-driven world',
    colorRgb: '139, 92, 246', // Violet 500 
    icon: 'brain-circuit',
    highlights: [
      'Master machine learning algorithms and deep learning',
      'Python programming with focus on data analysis libraries',
      'Real-world projects with industry applications',
      'Data visualization and analysis techniques'
    ],
    recommendedFor: ['College students', 'IT professionals', 'Career changers', 'Tech enthusiasts']
  },
  'digital-marketing': {
    displayName: 'Digital Marketing',
    description: 'Learn modern digital marketing strategies to grow businesses online through social media, SEO, content marketing, and analytics.',
    shortDescription: 'Master the digital marketing landscape with SEO, social media, and analytics skills.',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-900/20',
    borderClass: 'border-amber-200 dark:border-amber-800',
    subtitle: 'Modern marketing skills for online success',
    colorRgb: '245, 158, 11', // Amber 500
    icon: 'trending-up',
    highlights: [
      'SEO and content marketing strategies',
      'Social media campaign management',
      'Analytics and data-driven marketing',
      'Digital advertising and conversion optimization'
    ],
    recommendedFor: ['Marketing professionals', 'Entrepreneurs', 'Business owners', 'Content creators']
  },
  'personality-development': {
    displayName: 'Personality Development',
    description: 'Develop essential soft skills, communication abilities, and confidence for personal and professional success.',
    shortDescription: 'Build confidence, communication skills, and personal effectiveness.',
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgClass: 'bg-pink-50 dark:bg-pink-900/20',
    borderClass: 'border-pink-200 dark:border-pink-800',
    subtitle: 'Transform your communication and soft skills',
    colorRgb: '236, 72, 153', // Pink 500
    icon: 'user-check',
    highlights: [
      'Public speaking and presentation skills',
      'Interpersonal communication techniques',
      'Confidence building and leadership development',
      'Interview preparation and professional etiquette'
    ],
    recommendedFor: SHARED_GRADE_OPTIONS.schoolStudent.recommendedFor,
    targetGrades: SHARED_GRADE_OPTIONS.schoolStudent.gradeRange,
    recommendedGrades: ['Grade 9-10', 'Grade 11-12'] // Most suitable grades for this subject
  }
};

// Helper to normalize category slugs
export const normalizeCategory = (category: string | null | undefined): string | null => {
  if (!category) return null;
  
  // Convert to lowercase and replace spaces with hyphens
  const normalized = category.toLowerCase().replace(/\s+/g, '-');
  
  // Return the normalized category if it exists in our map
  return CATEGORY_MAP[normalized] ? normalized : null;
};

// Get category info by slug
export const getCategoryInfo = (categorySlug: string | null | undefined): CategoryHighlight | null => {
  const normalized = normalizeCategory(categorySlug);
  return normalized ? CATEGORY_MAP[normalized] : null;
};

/**
 * Format duration string for display
 * @param {string | number} duration - Raw duration string or number
 * @returns {string} - Formatted duration
 */
export const formatDuration = (duration: string | number | undefined): string => {
  if (!duration) return "";
  
  // Handle already formatted durations
  if (typeof duration === 'string' && (
    duration.includes('week') || duration.includes('month') || 
    duration.includes('day') || duration.includes('hour')
  )) {
    return duration;
  }
  
  // Convert number to days/weeks/months
  const days = Number(duration);
  if (isNaN(days)) return duration.toString();
  
  if (days < 1) {
    return "Less than a day";
  } else if (days === 1) {
    return "1 day";
  } else if (days < 7) {
    return `${days} days`;
  } else if (days < 14) {
    return "1 week";
  } else if (days < 30) {
    return `${Math.floor(days / 7)} weeks`;
  } else if (days < 60) {
    return "1 month";
  } else {
    return `${Math.floor(days / 30)} months`;
  }
};

/**
 * Parse duration string to numeric days
 * @param {string | number | undefined} duration - Duration string or number
 * @returns {number} - Duration in days
 */
export const parseDuration = (duration: string | number | undefined): number => {
  if (!duration) return 30; // Default to 30 days
  
  if (typeof duration === 'number') return duration;
  
  const lowerDuration = String(duration).toLowerCase();
  
  if (lowerDuration.includes('hour')) {
    const hours = parseInt(lowerDuration.replace(/[^0-9]/g, '')) || 1;
    return hours / 24; // Convert hours to days
  } else if (lowerDuration.includes('day')) {
    return parseInt(lowerDuration.replace(/[^0-9]/g, '')) || 1;
  } else if (lowerDuration.includes('week')) {
    const weeks = parseInt(lowerDuration.replace(/[^0-9]/g, '')) || 1;
    return weeks * 7;
  } else if (lowerDuration.includes('month')) {
    const months = parseInt(lowerDuration.replace(/[^0-9]/g, '')) || 1;
    return months * 30;
  } else if (lowerDuration.includes('year')) {
    const years = parseInt(lowerDuration.replace(/[^0-9]/g, '')) || 1;
    return years * 365;
  }
  
  // If just a number, assume it's days
  const days = parseInt(lowerDuration.replace(/[^0-9]/g, ''));
  return isNaN(days) ? 30 : days;
};

interface CourseType {
  course_duration_days: number;
  grade?: string;
  course_grade?: string;
  [key: string]: any;
}

/**
 * Get duration filter test function
 * @param {string | null | undefined} durationId - Duration identifier (e.g. 'short', 'medium', 'long')
 * @returns {DurationFilter | null} - Filter test function and days value
 */
export const getDurationFilter = (durationId: string | null | undefined): DurationFilter | null => {
  if (!durationId || durationId === 'all') return null;
  
  const filters: Record<string, DurationFilter> = {
    'short': {
      test: (course: CourseType) => (course.course_duration_days <= 14),
      days: 14
    },
    'medium': {
      test: (course: CourseType) => (course.course_duration_days > 14 && course.course_duration_days <= 60),
      days: 60 
    },
    'long': {
      test: (course: CourseType) => (course.course_duration_days > 60),
      days: 61
    }
  };
  
  return filters[durationId] || null;
};

/**
 * Get grade filter test function
 * @param {string | null | undefined} gradeId - Grade identifier
 * @returns {((course: CourseType) => boolean) | null} - Filter test function
 */
export const getGradeFilter = (gradeId: string | null | undefined): ((course: CourseType) => boolean) | null => {
  if (!gradeId || gradeId === 'all') return null;
  
  return (course: CourseType) => {
    // Implement grade filtering logic based on your data structure
    return course.grade === gradeId || course.course_grade === gradeId;
  };
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Parse API error to human-readable message
 * @param {ApiError | string | unknown} error - Error object or API response
 * @returns {string} - Human readable error message
 */
export const parseApiError = (error: ApiError | string | unknown): string => {
  if (!error) return 'An unknown error occurred';
  
  // Handle axios error structure
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as ApiError;
    const responseData = apiError.response?.data;
    
    if (responseData?.message) {
      return responseData.message;
    } else if (responseData?.error) {
      return responseData.error;
    } else if (apiError.response?.status) {
      return `Server error: ${apiError.response.status}`;
    }
  }
  
  // Handle direct API error responses
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as {message: string}).message === 'string') {
    return (error as {message: string}).message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Failed to load data. Please try again later.';
};
