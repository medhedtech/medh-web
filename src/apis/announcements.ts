import { apiClient } from './apiClient';
import { IApiResponse } from './apiClient';

// Types for announcement management
export type TAnnouncementType = 'course' | 'system' | 'maintenance' | 'feature' | 'event' | 'general';
export type TAnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TAnnouncementStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type TTargetAudience = 'all' | 'students' | 'instructors' | 'admins' | 'corporate' | 'parents';

// Student interface for specific targeting
export interface ITargetStudent {
  _id: string;
  full_name: string;
  email: string;
  createdAt?: string;
}

// Action button interface
export interface IAnnouncementActionButton {
  text?: string;
  url?: string;
  type: 'internal' | 'external' | 'link';
}

// Author interface
export interface IAnnouncementAuthor {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
}

// Course reference interface
export interface IAnnouncementCourse {
  _id: string;
  course_title: string;
}

// Category interface
export interface IAnnouncementCategory {
  _id: string;
  category_name: string;
}

// Metadata interface
export interface IAnnouncementMetadata {
  featured?: boolean;
  allowComments?: boolean;
  sendNotification?: boolean;
  emailNotification?: boolean;
  pushNotification?: boolean;
  notificationSent?: boolean;
}

// Main announcement interface
export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  type: TAnnouncementType;
  priority: TAnnouncementPriority;
  status: TAnnouncementStatus;
  targetAudience: TTargetAudience[];
  specificStudents?: ITargetStudent[]; // New: specific student targeting
  isSticky: boolean;
  viewCount: number;
  readCount?: number;
  isRead?: boolean; // User-specific field
  author: IAnnouncementAuthor;
  courseId?: IAnnouncementCourse;
  categories: IAnnouncementCategory[];
  tags: string[];
  actionButton?: IAnnouncementActionButton;
  metadata: IAnnouncementMetadata;
  publishDate: string;
  expiryDate?: string;
  date?: string; // Auto-generated relative date
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB version field
  relatedCourses?: any[]; // Additional field from API
  attachments?: any[]; // Additional field from API
  readBy?: any[]; // Additional field from API
}

// Create announcement input
export interface IAnnouncementCreateInput {
  title: string;
  content: string;
  type: TAnnouncementType;
  priority?: TAnnouncementPriority;
  status?: TAnnouncementStatus;
  targetAudience: TTargetAudience[];
  specificStudents?: string[]; // Array of student IDs for specific targeting
  courseId?: string;
  categories?: string[];
  isSticky?: boolean;
  tags?: string[];
  expiryDate?: string;
  publishDate?: string;
  actionButton?: IAnnouncementActionButton;
  metadata?: IAnnouncementMetadata;
}

// Update announcement input
export interface IAnnouncementUpdateInput extends Partial<IAnnouncementCreateInput> {
  _id: string;
}

// Query parameters for fetching announcements
export interface IAnnouncementQueryParams {
  limit?: number;
  page?: number;
  type?: TAnnouncementType;
  targetAudience?: TTargetAudience;
  priority?: TAnnouncementPriority;
  status?: TAnnouncementStatus;
  includeExpired?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'publishDate' | 'title' | 'type' | 'priority' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  sticky?: boolean;
  authorId?: string;
  courseId?: string;
  categoryId?: string;
}

// Pagination interface
export interface IAnnouncementPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Response for recent announcements
export interface IRecentAnnouncementsResponse {
  announcements: IAnnouncement[];
  pagination: IAnnouncementPagination;
}

// Response for single announcement
export interface IAnnouncementResponse {
  announcement: IAnnouncement;
}

// Response for available students
export interface IAvailableStudentsResponse {
  students: ITargetStudent[];
  pagination: IAnnouncementPagination;
}

// Response for unread count
export interface IUnreadCountResponse {
  unreadCount: number;
}

// Query parameters for student search
export interface IStudentQueryParams {
  search?: string;
  limit?: number;
  page?: number;
}

// Announcement type with count
export interface IAnnouncementTypeCount {
  type: TAnnouncementType;
  count: number;
  label: string;
}

// Analytics interface
export interface IAnnouncementAnalytics {
  totalAnnouncements: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  archivedAnnouncements: number;
  scheduledAnnouncements: number;
  totalViews: number;
  totalReads: number;
  averageReadRate: number;
  byType: Array<{
    type: TAnnouncementType;
    count: number;
    views: number;
    reads: number;
  }>;
  byPriority: Array<{
    priority: TAnnouncementPriority;
    count: number;
    views: number;
  }>;
  recentActivity: Array<{
    date: string;
    created: number;
    published: number;
    views: number;
  }>;
  topPerforming: IAnnouncement[];
}

// API Functions

/**
 * Get recent announcements for public display
 */
export const getRecentAnnouncements = async (
  params: IAnnouncementQueryParams = {}
): Promise<IApiResponse<IRecentAnnouncementsResponse>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return apiClient.get<IRecentAnnouncementsResponse>(
    `/announcements/recent?${queryParams.toString()}`
  );
};

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = async (
  id: string
): Promise<IApiResponse<IAnnouncementResponse>> => {
  return apiClient.get<IAnnouncementResponse>(`/announcements/${id}`);
};

/**
 * Get announcement types with counts
 */
export const getAnnouncementTypes = async (): Promise<IApiResponse<IAnnouncementTypeCount[]>> => {
  return apiClient.get<IAnnouncementTypeCount[]>('/announcements/types');
};

/**
 * Mark an announcement as read (requires authentication)
 */
export const markAnnouncementAsRead = async (
  id: string
): Promise<IApiResponse<null>> => {
  return apiClient.post<null>(`/announcements/${id}/read`);
};

/**
 * Mark multiple announcements as read
 */
export const markMultipleAnnouncementsAsRead = async (
  ids: string[]
): Promise<IApiResponse<null>> => {
  return apiClient.post<null>('/announcements/mark-multiple-read', { ids });
};

/**
 * Get unread announcements count for user
 */
export const getUnreadAnnouncementsCount = async (): Promise<IApiResponse<IUnreadCountResponse>> => {
  return apiClient.get<IUnreadCountResponse>('/announcements/unread-count');
};

/**
 * Get available students for targeting (Admin only)
 */
export const getAvailableStudents = async (
  params: IStudentQueryParams = {}
): Promise<IApiResponse<IAvailableStudentsResponse>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiClient.get<IAvailableStudentsResponse>(
    `/announcements/students?${queryParams.toString()}`
  );
};

/**
 * Search students by name or email (Admin only)
 */
export const searchStudents = async (
  searchTerm: string,
  limit: number = 50
): Promise<IApiResponse<IAvailableStudentsResponse>> => {
  return getAvailableStudents({ search: searchTerm, limit });
};

// Admin Functions (require admin authentication)

/**
 * Get all announcements with admin privileges
 */
export const getAllAnnouncements = async (
  params: IAnnouncementQueryParams = {}
): Promise<IApiResponse<IRecentAnnouncementsResponse>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return apiClient.get<IRecentAnnouncementsResponse>(
    `/announcements?${queryParams.toString()}`
  );
};

/**
 * Create a new announcement (admin only)
 */
export const createAnnouncement = async (
  data: IAnnouncementCreateInput
): Promise<IApiResponse<IAnnouncementResponse>> => {
  return apiClient.post<IAnnouncementResponse>('/announcements', data);
};

/**
 * Update an existing announcement (admin only)
 */
export const updateAnnouncement = async (
  id: string,
  data: Partial<IAnnouncementCreateInput>
): Promise<IApiResponse<IAnnouncementResponse>> => {
  return apiClient.put<IAnnouncementResponse>(`/announcements/${id}`, data);
};

/**
 * Delete an announcement (admin only)
 */
export const deleteAnnouncement = async (
  id: string
): Promise<IApiResponse<null>> => {
  return apiClient.delete<null>(`/announcements/${id}`);
};

/**
 * Get announcement analytics (admin only)
 */
export const getAnnouncementAnalytics = async (): Promise<IApiResponse<IAnnouncementAnalytics>> => {
  return apiClient.get<IAnnouncementAnalytics>('/announcements/analytics');
};

/**
 * Bulk update announcement status (admin only)
 */
export const bulkUpdateAnnouncementStatus = async (
  ids: string[],
  status: TAnnouncementStatus
): Promise<IApiResponse<null>> => {
  return apiClient.put<null>('/announcements/bulk-status', { ids, status });
};

/**
 * Archive announcement (admin only)
 */
export const archiveAnnouncement = async (
  id: string
): Promise<IApiResponse<null>> => {
  return apiClient.put<null>(`/announcements/${id}/archive`);
};

/**
 * Publish announcement (admin only)
 */
export const publishAnnouncement = async (
  id: string
): Promise<IApiResponse<null>> => {
  return apiClient.put<null>(`/announcements/${id}/publish`);
};

/**
 * Schedule announcement for later publication (admin only)
 */
export const scheduleAnnouncement = async (
  id: string,
  publishDate: string
): Promise<IApiResponse<null>> => {
  return apiClient.put<null>(`/announcements/${id}/schedule`, { publishDate });
};

/**
 * Duplicate an announcement (admin only)
 */
export const duplicateAnnouncement = async (
  id: string
): Promise<IApiResponse<IAnnouncementResponse>> => {
  return apiClient.post<IAnnouncementResponse>(`/announcements/${id}/duplicate`);
};

/**
 * Get announcement engagement metrics (admin only)
 */
export const getAnnouncementEngagement = async (
  id: string
): Promise<IApiResponse<{
  views: number;
  reads: number;
  readRate: number;
  avgTimeToRead: number;
  userEngagement: Array<{
    userId: string;
    userName: string;
    readAt: string;
    timeSpent: number;
  }>;
}>> => {
  return apiClient.get(`/announcements/${id}/engagement`);
};

/**
 * Send notification for announcement (admin only)
 */
export const sendAnnouncementNotification = async (
  id: string,
  notificationTypes: Array<'email' | 'push' | 'sms'>
): Promise<IApiResponse<{
  sent: number;
  failed: number;
  details: Array<{
    type: string;
    status: 'sent' | 'failed';
    count: number;
  }>;
}>> => {
  return apiClient.post(`/announcements/${id}/notify`, { notificationTypes });
};

/**
 * Process scheduled announcements (admin only)
 */
export const processScheduledAnnouncements = async (): Promise<IApiResponse<{
  processed: number;
  published: number;
  failed: number;
}>> => {
  return apiClient.post('/announcements/process-scheduled');
};

/**
 * Get announcement targeting summary (Admin only)
 */
export const getAnnouncementTargeting = async (
  id: string
): Promise<IApiResponse<{
  totalTargeted: number;
  generalAudience: TTargetAudience[];
  specificStudents: ITargetStudent[];
  estimatedReach: number;
}>> => {
  return apiClient.get<{
    totalTargeted: number;
    generalAudience: TTargetAudience[];
    specificStudents: ITargetStudent[];
    estimatedReach: number;
  }>(`/announcements/${id}/targeting`);
};

/**
 * Preview announcement targeting (Admin only)
 */
export const previewAnnouncementTargeting = async (
  targetAudience: TTargetAudience[],
  specificStudents: string[] = []
): Promise<IApiResponse<{
  estimatedReach: number;
  audienceBreakdown: Array<{
    type: TTargetAudience;
    count: number;
  }>;
  specificStudentsCount: number;
}>> => {
  return apiClient.post<{
    estimatedReach: number;
    audienceBreakdown: Array<{
      type: TTargetAudience;
      count: number;
    }>;
    specificStudentsCount: number;
  }>('/announcements/preview-targeting', {
    targetAudience,
    specificStudents
  });
};

/**
 * Validate student IDs for targeting (Admin only)
 */
export const validateStudentIds = async (
  studentIds: string[]
): Promise<IApiResponse<{
  valid: string[];
  invalid: string[];
  validStudents: ITargetStudent[];
}>> => {
  return apiClient.post<{
    valid: string[];
    invalid: string[];
    validStudents: ITargetStudent[];
  }>('/announcements/validate-students', { studentIds });
};

/**
 * Get announcement read status by users (Admin only)
 */
export const getAnnouncementReadStatus = async (
  id: string,
  params: { page?: number; limit?: number } = {}
): Promise<IApiResponse<{
  readBy: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    readAt: string;
  }>;
  unreadBy: Array<{
    userId: string;
    userName: string;
    userEmail: string;
  }>;
  pagination: IAnnouncementPagination;
  summary: {
    totalTargeted: number;
    totalRead: number;
    totalUnread: number;
    readPercentage: number;
  };
}>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiClient.get<{
    readBy: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      readAt: string;
    }>;
    unreadBy: Array<{
      userId: string;
      userName: string;
      userEmail: string;
    }>;
    pagination: IAnnouncementPagination;
    summary: {
      totalTargeted: number;
      totalRead: number;
      totalUnread: number;
      readPercentage: number;
    };
  }>(`/announcements/${id}/read-status?${queryParams.toString()}`);
};

// Utility functions

/**
 * Format announcement date to relative time
 */
export const formatAnnouncementDate = (date: string): string => {
  const now = new Date();
  const announcementDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - announcementDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Get priority color class
 */
export const getPriorityColorClass = (priority: TAnnouncementPriority): string => {
  const colorMap = {
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-blue-600 bg-blue-100',
    high: 'text-orange-600 bg-orange-100',
    urgent: 'text-red-600 bg-red-100'
  };
  return colorMap[priority] || colorMap.medium;
};

/**
 * Get type icon class
 */
export const getTypeIconClass = (type: TAnnouncementType): string => {
  const iconMap = {
    course: 'book-open',
    system: 'cog',
    maintenance: 'wrench',
    feature: 'star',
    event: 'calendar',
    general: 'megaphone'
  };
  return iconMap[type] || iconMap.general;
};

/**
 * Check if announcement is expired
 */
export const isAnnouncementExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

/**
 * Get announcement summary for notifications
 */
export const getAnnouncementSummary = (announcement: IAnnouncement): string => {
  const maxLength = 100;
  if (announcement.content.length <= maxLength) {
    return announcement.content;
  }
  return `${announcement.content.substring(0, maxLength)}...`;
};

/**
 * Validate announcement data
 */
export const validateAnnouncementData = (data: IAnnouncementCreateInput): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!data.type) {
    errors.push('Type is required');
  }

  if ((!data.targetAudience || data.targetAudience.length === 0) && 
      (!data.specificStudents || data.specificStudents.length === 0)) {
    errors.push('Either target audience or specific students must be selected');
  }

  if (data.expiryDate && new Date(data.expiryDate) <= new Date()) {
    errors.push('Expiry date must be in the future');
  }

  if (data.publishDate && data.expiryDate && new Date(data.publishDate) >= new Date(data.expiryDate)) {
    errors.push('Publish date must be before expiry date');
  }

  if (data.specificStudents && data.specificStudents.length > 1000) {
    errors.push('Cannot target more than 1000 specific students at once');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get targeting description for announcement
 */
export const getTargetingDescription = (announcement: IAnnouncement): string => {
  const parts: string[] = [];
  
  if (announcement.targetAudience && announcement.targetAudience.length > 0) {
    const audienceLabels = announcement.targetAudience.map(audience => {
      switch (audience) {
        case 'all': return 'All Users';
        case 'students': return 'All Students';
        case 'instructors': return 'All Instructors';
        case 'admins': return 'All Administrators';
        case 'corporate': return 'Corporate Users';
        case 'parents': return 'Parents';
        default: return audience;
      }
    });
    parts.push(audienceLabels.join(', '));
  }
  
  if (announcement.specificStudents && announcement.specificStudents.length > 0) {
    parts.push(`${announcement.specificStudents.length} specific student${announcement.specificStudents.length > 1 ? 's' : ''}`);
  }
  
  return parts.length > 0 ? parts.join(' + ') : 'No targeting specified';
};

/**
 * Check if user should see announcement based on targeting
 */
export const shouldUserSeeAnnouncement = (
  announcement: IAnnouncement,
  userRole: string,
  userId: string
): boolean => {
  // Check general audience targeting
  if (announcement.targetAudience && announcement.targetAudience.length > 0) {
    if (announcement.targetAudience.includes('all')) {
      return true;
    }
    
    const roleMapping: Record<string, TTargetAudience> = {
      'student': 'students',
      'instructor': 'instructors',
      'admin': 'admins',
      'super-admin': 'admins',
      'corporate': 'corporate',
      'parent': 'parents'
    };
    
    const userAudience = roleMapping[userRole.toLowerCase()];
    if (userAudience && announcement.targetAudience.includes(userAudience)) {
      return true;
    }
  }
  
  // Check specific student targeting
  if (announcement.specificStudents && announcement.specificStudents.length > 0) {
    return announcement.specificStudents.some(student => student._id === userId);
  }
  
  return false;
};

/**
 * Format student list for display
 */
export const formatStudentList = (students: ITargetStudent[], maxDisplay: number = 3): string => {
  if (!students || students.length === 0) {
    return 'No students selected';
  }
  
  if (students.length <= maxDisplay) {
    return students.map(s => s.full_name).join(', ');
  }
  
  const displayed = students.slice(0, maxDisplay).map(s => s.full_name).join(', ');
  const remaining = students.length - maxDisplay;
  return `${displayed} and ${remaining} more`;
};

// Export default instance
export default {
  getRecentAnnouncements,
  getAnnouncementById,
  getAnnouncementTypes,
  markAnnouncementAsRead,
  markMultipleAnnouncementsAsRead,
  getUnreadAnnouncementsCount,
  getAvailableStudents,
  searchStudents,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementAnalytics,
  bulkUpdateAnnouncementStatus,
  archiveAnnouncement,
  publishAnnouncement,
  scheduleAnnouncement,
  duplicateAnnouncement,
  getAnnouncementEngagement,
  sendAnnouncementNotification,
  processScheduledAnnouncements,
  getAnnouncementTargeting,
  previewAnnouncementTargeting,
  validateStudentIds,
  getAnnouncementReadStatus,
  formatAnnouncementDate,
  getPriorityColorClass,
  getTypeIconClass,
  isAnnouncementExpired,
  getAnnouncementSummary,
  validateAnnouncementData,
  getTargetingDescription,
  shouldUserSeeAnnouncement,
  formatStudentList
}; 