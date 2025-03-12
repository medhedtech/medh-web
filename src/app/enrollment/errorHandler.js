/**
 * ErrorHandler utility functions for the enrollment page
 * Provides consistent error handling for API requests and user actions
 */

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

// Format durations consistently
export const formatDuration = (days) => {
  if (!days) return 'Self-paced';
  
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  const weeks = Math.floor(remainingDays / 7);
  
  let result = '';
  if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
  if (weeks > 0) result += `${weeks} week${weeks > 1 ? 's' : ''}`;
  
  return result.trim() || `${days} days`;
};

// Format prices consistently
export const formatPrice = (price) => {
  if (!price) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Convert duration selection to filter function
export const getDurationFilter = (selectedDuration) => {
  switch (selectedDuration) {
    case 'short':
      return (course) => course.course_duration_days <= 90; // 1-3 months
    case 'medium':
      return (course) => course.course_duration_days > 90 && course.course_duration_days <= 180; // 3-6 months
    case 'long':
      return (course) => course.course_duration_days > 180; // 6+ months
    default:
      return () => true; // Show all
  }
};

// Set retry strategy with exponential backoff
export const retryStrategy = (retries = 3, baseDelay = 1000) => {
  return {
    retry: (failCount, error) => {
      if (failCount < retries) {
        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, failCount) + Math.random() * 1000,
          30000 // Max 30 seconds delay
        );
        console.log(`Retrying API call after ${delay}ms`);
        return new Promise(resolve => setTimeout(resolve, delay));
      }
      return Promise.reject(error);
    }
  };
}; 