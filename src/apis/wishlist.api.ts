import { apiBaseUrl } from './config';
import { IApiResponse } from './index';

// Types and Interfaces
export interface IWishlistItem {
  _id: string;
  student_id: string;
  course_id: string;
  added_at: string;
  course_details?: {
    _id: string;
    course_title: string;
    course_subtitle?: string;
    course_image?: string;
    course_fee?: number;
    currency?: string;
    course_category?: string;
    course_subcategory?: string;
    class_type?: string;
    course_level?: string;
    course_duration?: string;
    instructor?: {
      _id: string;
      full_name: string;
      email: string;
    };
    rating?: {
      average: number;
      count: number;
    };
    status?: 'Draft' | 'Published' | 'Archived';
    isFree?: boolean;
  };
  notifications?: {
    price_drop?: boolean;
    course_updates?: boolean;
    enrollment_opening?: boolean;
  };
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  tags?: string[];
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IWishlistAddInput {
  student_id: string;
  course_id: string;
  notifications?: {
    price_drop?: boolean;
    course_updates?: boolean;
    enrollment_opening?: boolean;
  };
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  tags?: string[];
}

export interface IWishlistRemoveInput {
  student_id: string;
  course_id: string;
}

export interface IWishlistStats {
  total_items: number;
  items_by_category: Record<string, number>;
  items_by_priority: Record<string, number>;
  items_by_class_type: Record<string, number>;
  average_course_fee: number;
  total_value: number;
  currency: string;
  recently_added: number; // Items added in last 7 days
  price_alerts_enabled: number;
  available_courses: number;
  unavailable_courses: number;
  free_courses: number;
  paid_courses: number;
  enrollment_reminders: number;
  oldest_item_date: string;
  newest_item_date: string;
  recommendations_count?: number;
}

export interface IWishlistStatusCheck {
  student_id: string;
  course_id: string;
  is_in_wishlist: boolean;
  added_at?: string;
  priority?: 'low' | 'medium' | 'high';
  notifications_enabled?: {
    price_drop: boolean;
    course_updates: boolean;
    enrollment_opening: boolean;
  };
}

export interface IWishlistQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  class_type?: string;
  priority?: 'low' | 'medium' | 'high';
  is_available?: boolean;
  sort_by?: 'added_at' | 'course_title' | 'course_fee' | 'priority' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
  tags?: string[];
  price_range?: {
    min?: number;
    max?: number;
  };
  date_range?: {
    start?: string;
    end?: string;
  };
}

export interface IWishlistNotificationSettings {
  student_id: string;
  course_id: string;
  price_drop: boolean;
  course_updates: boolean;
  enrollment_opening: boolean;
}

export interface IWishlistBulkOperation {
  student_id: string;
  course_ids: string[];
  action: 'add' | 'remove' | 'update_priority' | 'update_notifications';
  priority?: 'low' | 'medium' | 'high';
  notifications?: {
    price_drop?: boolean;
    course_updates?: boolean;
    enrollment_opening?: boolean;
  };
}

// Response Interfaces
export interface IWishlistResponse {
  success: boolean;
  message: string;
  data: IWishlistItem;
}

export interface IWishlistListResponse {
  success: boolean;
  message: string;
  data: IWishlistItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary?: {
    total_items: number;
    total_value: number;
    currency: string;
    categories_count: number;
    available_courses: number;
  };
}

export interface IWishlistStatsResponse {
  success: boolean;
  message: string;
  data: IWishlistStats;
  generated_at: string;
}

export interface IWishlistStatusResponse {
  success: boolean;
  message: string;
  data: IWishlistStatusCheck;
}

export interface IWishlistBulkResponse {
  success: boolean;
  message: string;
  data: {
    successful_operations: number;
    failed_operations: number;
    results: Array<{
      course_id: string;
      status: 'success' | 'failed';
      message?: string;
    }>;
  };
}

// API Functions

/**
 * Add a course to student's wishlist
 */
export const addToWishlist = async (
  data: IWishlistAddInput
): Promise<IApiResponse<IWishlistResponse['data']>> => {
  const url = `${apiBaseUrl}/students/wishlist/add`;
  // TODO: Implement actual API call
  return { 
    status: 'success', 
    data: {
      _id: 'mock-id',
      student_id: data.student_id,
      course_id: data.course_id,
      added_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
};

/**
 * Remove a course from student's wishlist
 */
export const removeFromWishlist = async (
  data: IWishlistRemoveInput
): Promise<IApiResponse<null>> => {
  const url = `${apiBaseUrl}/students/wishlist/remove`;
  // TODO: Implement actual API call
  return { 
    status: 'success',
    message: 'Item removed from wishlist'
  };
};

/**
 * Get student's wishlist with optional filters and pagination
 */
export const getStudentWishlist = (
  studentId: string,
  params: IWishlistQueryParams = {}
): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested objects like price_range, date_range
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            queryParams.append(`${key}.${subKey}`, String(subValue));
          }
        });
      } else if (Array.isArray(value)) {
        // Handle arrays like tags
        value.forEach(item => queryParams.append(key, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const queryString = queryParams.toString();
  return `${apiBaseUrl}/students/wishlist/${studentId}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Check if a course is in student's wishlist
 */
export const checkWishlistStatus = (
  studentId: string,
  courseId: string
): string => {
  return `${apiBaseUrl}/students/wishlist/check/${studentId}/${courseId}`;
};

/**
 * Clear all items from student's wishlist
 */
export const clearWishlist = (studentId: string): string => {
  return `${apiBaseUrl}/students/wishlist/clear/${studentId}`;
};

/**
 * Get wishlist statistics for a student
 */
export const getWishlistStats = (studentId: string): string => {
  return `${apiBaseUrl}/students/wishlist/stats/${studentId}`;
};

/**
 * Update wishlist item priority
 */
export const updateWishlistItemPriority = (
  studentId: string,
  courseId: string,
  priority: 'low' | 'medium' | 'high'
): { url: string; data: any } => {
  return {
    url: `${apiBaseUrl}/students/wishlist/update-priority`,
    data: {
      student_id: studentId,
      course_id: courseId,
      priority
    }
  };
};

/**
 * Update wishlist notification settings
 */
export const updateWishlistNotifications = (
  data: IWishlistNotificationSettings
): { url: string; data: IWishlistNotificationSettings } => {
  return {
    url: `${apiBaseUrl}/students/wishlist/update-notifications`,
    data
  };
};

/**
 * Bulk operations on wishlist items
 */
export const bulkWishlistOperation = (
  data: IWishlistBulkOperation
): { url: string; data: IWishlistBulkOperation } => {
  return {
    url: `${apiBaseUrl}/students/wishlist/bulk-operation`,
    data
  };
};

/**
 * Get wishlist recommendations based on student's wishlist
 */
export const getWishlistRecommendations = (
  studentId: string,
  limit: number = 10
): string => {
  return `${apiBaseUrl}/students/wishlist/recommendations/${studentId}?limit=${limit}`;
};

/**
 * Export wishlist data
 */
export const exportWishlist = (
  studentId: string,
  format: 'csv' | 'json' | 'pdf' = 'json'
): string => {
  return `${apiBaseUrl}/students/wishlist/export/${studentId}?format=${format}`;
};

/**
 * Import wishlist data from file
 */
export const importWishlist = (
  studentId: string,
  file: File
): { url: string; formData: FormData } => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('student_id', studentId);
  
  return {
    url: `${apiBaseUrl}/students/wishlist/import`,
    formData
  };
};

/**
 * Share wishlist with others
 */
export const shareWishlist = (
  studentId: string,
  shareSettings: {
    is_public: boolean;
    expires_at?: string;
    share_with_emails?: string[];
    allow_comments?: boolean;
  }
): { url: string; data: any } => {
  return {
    url: `${apiBaseUrl}/students/wishlist/share`,
    data: {
      student_id: studentId,
      ...shareSettings
    }
  };
};

/**
 * Get shared wishlist by share token
 */
export const getSharedWishlist = (shareToken: string): string => {
  return `${apiBaseUrl}/students/wishlist/shared/${shareToken}`;
};

// Utility Functions

/**
 * Format wishlist item for display
 */
export const formatWishlistItem = (item: IWishlistItem): {
  displayTitle: string;
  displayPrice: string;
  displayCategory: string;
  displayDuration: string;
  isAvailable: boolean;
  priorityColor: string;
} => {
  return {
    displayTitle: item.course_details?.course_title || 'Unknown Course',
    displayPrice: item.course_details?.isFree 
      ? 'Free' 
      : `${item.course_details?.currency || '$'} ${item.course_details?.course_fee || 0}`,
    displayCategory: item.course_details?.course_category || 'Uncategorized',
    displayDuration: item.course_details?.course_duration || 'Duration not specified',
    isAvailable: item.is_available !== false && item.course_details?.status === 'Published',
    priorityColor: getPriorityColor(item.priority || 'medium')
  };
};

/**
 * Get priority color class
 */
export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Calculate total wishlist value
 */
export const calculateWishlistValue = (items: IWishlistItem[]): {
  totalValue: number;
  freeCoursesCount: number;
  paidCoursesCount: number;
  currency: string;
} => {
  let totalValue = 0;
  let freeCoursesCount = 0;
  let paidCoursesCount = 0;
  const currency = items[0]?.course_details?.currency || 'USD';

  items.forEach(item => {
    if (item.course_details?.isFree) {
      freeCoursesCount++;
    } else {
      paidCoursesCount++;
      totalValue += item.course_details?.course_fee || 0;
    }
  });

  return {
    totalValue,
    freeCoursesCount,
    paidCoursesCount,
    currency
  };
};

/**
 * Filter wishlist items by availability
 */
export const filterByAvailability = (
  items: IWishlistItem[],
  showOnlyAvailable: boolean = false
): IWishlistItem[] => {
  if (!showOnlyAvailable) return items;
  
  return items.filter(item => 
    item.is_available !== false && 
    item.course_details?.status === 'Published'
  );
};

/**
 * Group wishlist items by category
 */
export const groupByCategory = (items: IWishlistItem[]): Record<string, IWishlistItem[]> => {
  return items.reduce((groups, item) => {
    const category = item.course_details?.course_category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, IWishlistItem[]>);
};

/**
 * Validate wishlist item data
 */
export const validateWishlistItem = (data: IWishlistAddInput): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.student_id?.trim()) {
    errors.push('Student ID is required');
  }

  if (!data.course_id?.trim()) {
    errors.push('Course ID is required');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  if (data.notes && data.notes.length > 500) {
    errors.push('Notes cannot exceed 500 characters');
  }

  if (data.tags && data.tags.length > 10) {
    errors.push('Cannot have more than 10 tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  addToWishlist,
  removeFromWishlist,
  getStudentWishlist,
  checkWishlistStatus,
  clearWishlist,
  getWishlistStats,
  updateWishlistItemPriority,
  updateWishlistNotifications,
  bulkWishlistOperation,
  getWishlistRecommendations,
  exportWishlist,
  importWishlist,
  shareWishlist,
  getSharedWishlist,
  formatWishlistItem,
  getPriorityColor,
  calculateWishlistValue,
  filterByAvailability,
  groupByCategory,
  validateWishlistItem
}; 