/**
 * Category-specific utilities for the enrollment pages
 * Includes formatters, data processing, and category info
 */

// Map of category slugs to their display names and attributes
export const CATEGORY_MAP = {
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
    recommendedFor: ['Students preparing for competitive exams', 'Math enthusiasts', 'Students aged 10-18 years']
  },
  'ai-and-data-science': {
    displayName: 'AI & Data Science',
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
    recommendedFor: ['Students', 'Young professionals', 'Job seekers', 'Anyone looking to improve social skills']
  }
};

// Helper to normalize category slugs
export const normalizeCategory = (category) => {
  if (!category) return null;
  
  // Convert to lowercase and replace spaces with hyphens
  const normalized = category.toLowerCase().replace(/\s+/g, '-');
  
  // Return the normalized category if it exists in our map
  return CATEGORY_MAP[normalized] ? normalized : null;
};

// Get category info by slug
export const getCategoryInfo = (categorySlug) => {
  const normalized = normalizeCategory(categorySlug);
  return normalized ? CATEGORY_MAP[normalized] : null;
};

// Duration options with flexible descriptions
export const DURATION_OPTIONS = [
  { id: 'short', name: '3 Months (12 weeks)', label: 'Quick Learning', description: 'Perfect for beginners looking to quickly grasp core concepts' },
  { id: 'medium', name: '6 Months (24 weeks)', label: 'Comprehensive', description: 'Deeper understanding with extensive practice and application' },
  { id: 'long', name: '9 Months (36 weeks)', label: 'Complete Mastery', description: 'Master all aspects with advanced techniques and specialized topics' }
];

// Grade options
export const GRADE_OPTIONS = [
  { id: 'grade5-6', label: 'Grade 5-6', description: 'Fundamental concepts tailored for younger students' },
  { id: 'grade7-8', label: 'Grade 7-8', description: 'Advanced concepts for middle school students' },
  { id: 'grade9-10', label: 'Grade 9-10', description: 'Higher-level concepts for secondary students' },
  { id: 'grade11-12', label: 'Grade 11-12', description: 'Pre-college preparation and advanced topics' }
];

// Format price consistently
export const formatPrice = (price) => {
  if (!price) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Update the formatDuration function to work with days
export const formatDuration = (days) => {
  if (!days && days !== 0) return 'Flexible duration';
  
  // Handle if days is a string
  if (typeof days === 'string') {
    if (days.toLowerCase().includes('week') || 
        days.toLowerCase().includes('month') || 
        days.toLowerCase().includes('day')) {
      return days; // Already formatted
    }
    
    // Try to parse as number
    days = parseInt(days, 10);
    if (isNaN(days)) return 'Flexible duration';
  }
  
  if (days < 1) return 'Less than a day';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} weeks`;
    return `${weeks} weeks, ${remainingDays} days`;
  }
  if (days === 30) return '1 month';
  if (days < 365) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (remainingDays === 0) return `${months} months`;
    if (remainingDays < 7) return `${months} months, ${remainingDays} days`;
    const weeks = Math.floor(remainingDays / 7);
    return `${months} months, ${weeks} weeks`;
  }
  
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  if (remainingDays === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  const months = Math.floor(remainingDays / 30);
  if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years} ${years === 1 ? 'year' : 'years'}, ${months} months`;
};

// Add this function to parse duration strings from the API
export const parseDuration = (durationStr) => {
  if (!durationStr) return 30; // Default to 30 days
  
  // Handle numeric values
  if (typeof durationStr === 'number') return durationStr;
  
  // Convert string to lowercase for consistent matching
  const duration = durationStr.toLowerCase();
  
  // Handle different duration formats
  if (duration.includes('day') || duration.includes('days')) {
    const days = parseInt(duration.match(/\d+/)?.[0] || '30', 10);
    return days;
  } else if (duration.includes('week') || duration.includes('weeks')) {
    const weeks = parseInt(duration.match(/\d+/)?.[0] || '4', 10);
    return weeks * 7;
  } else if (duration.includes('month') || duration.includes('months')) {
    const months = parseInt(duration.match(/\d+/)?.[0] || '1', 10);
    return months * 30;
  } else if (duration.includes('year') || duration.includes('years')) {
    const years = parseInt(duration.match(/\d+/)?.[0] || '1', 10);
    return years * 365;
  } else if (duration === 'short') {
    return 7; // 1 week
  } else if (duration === 'medium') {
    return 30; // 1 month
  } else if (duration === 'long') {
    return 90; // 3 months
  }
  
  // If no match, try to extract any number in the string
  const numberMatch = duration.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }
  
  // Default fallback
  return 30;
};

// Update the getDurationFilter function to handle the new format
export const getDurationFilter = (durationId) => {
  switch(durationId) {
    case 'short':
      return (course) => {
        const courseDuration = course.course_duration_days || parseDuration(course.course_duration);
        return courseDuration <= 7; // 1 week or less
      };
    case 'medium':
      return (course) => {
        const courseDuration = course.course_duration_days || parseDuration(course.course_duration);
        return courseDuration > 7 && courseDuration <= 30; // 1 week to 1 month
      };
    case 'long':
      return (course) => {
        const courseDuration = course.course_duration_days || parseDuration(course.course_duration);
        return courseDuration > 30; // More than 1 month
      };
    default:
      return () => true; // No filtering
  }
};

// Update the getGradeFilter function to work with the new grade field
export const getGradeFilter = (gradeId) => {
  if (gradeId === 'all') return () => true;
  
  return (course) => {
    if (!course.grade) return false;
    
    const courseGrade = course.grade.toLowerCase();
    const grade = gradeId.toLowerCase();
    
    // Check if the course grade contains the selected grade
    return courseGrade.includes(grade);
  };
};

// Parse API error response 
export const parseApiError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle structured API errors
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Handle network errors
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  
  // Default error message
  return error.message || 'Something went wrong. Please try again.';
}; 