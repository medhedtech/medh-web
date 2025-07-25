import { apiBaseUrl, apiUtils } from './utils';

/**
 * Comprehensive Demo Booking API endpoints for managing demo sessions
 * between prospective students and instructors
 */
export const demoBookingAPI = {
  // Core booking endpoints
  createBooking: (options: {
    includeUtmTracking?: boolean;
    validateAvailability?: boolean;
  } = {}): string => {
    const { includeUtmTracking = false, validateAvailability = true } = options;
    
    const queryParams = new URLSearchParams();
    if (includeUtmTracking) {
      queryParams.append('include_utm', 'true');
    }
    if (validateAvailability) {
      queryParams.append('validate_availability', 'true');
    }
    
    const queryString = queryParams.toString();
    return `${apiBaseUrl}/demo-booking${queryString ? '?' + queryString : ''}`;
  },

  getUserBookings: (options: {
    userId?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'no-show';
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    includeHistory?: boolean;
    includeInstructor?: boolean;
  } = {}): string => {
    const { 
      userId = "", 
      status = "", 
      page = 1, 
      limit = 10,
      startDate = "",
      endDate = "",
      includeHistory = false,
      includeInstructor = true
    } = options;
    
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(Math.min(limit, 100))); // Max 100 items per page
    
    if (userId) queryParams.append('userId', userId);
    if (status) queryParams.append('status', status);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (includeHistory) queryParams.append('include_history', 'true');
    if (includeInstructor) queryParams.append('include_instructor', 'true');
    
    return `${apiBaseUrl}/demo-booking?${queryParams.toString()}`;
  },

  updateBooking: (action: 'cancel' | 'reschedule' | 'confirm' | 'complete' | 'no-show'): string => {
    const queryParams = new URLSearchParams();
    queryParams.append('action', action);
    
    return `${apiBaseUrl}/demo-booking?${queryParams.toString()}`;
  },

  getBookingById: (bookingId: string, options: {
    includeInstructor?: boolean;
    includeHistory?: boolean;
    includeUtmData?: boolean;
  } = {}): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    
    const { includeInstructor = true, includeHistory = false, includeUtmData = false } = options;
    const queryParams = new URLSearchParams();
    
    if (includeInstructor) queryParams.append('include_instructor', 'true');
    if (includeHistory) queryParams.append('include_history', 'true');
    if (includeUtmData) queryParams.append('include_utm_data', 'true');
    
    const queryString = queryParams.toString();
    return `${apiBaseUrl}/demo-booking/${bookingId}${queryString ? '?' + queryString : ''}`;
  },

  // Availability and scheduling endpoints
  getAvailableSlots: (date: string, options: {
    timezone?: string;
    demoType?: 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry';
    durationMinutes?: number;
    instructorId?: string;
  } = {}): string => {
    if (!date) throw new Error('Date is required');
    
    const { timezone = "UTC", demoType = "", durationMinutes = 60, instructorId = "" } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('date', date);
    queryParams.append('timezone', timezone);
    
    if (demoType) queryParams.append('demoType', demoType);
    if (durationMinutes !== 60) queryParams.append('duration', String(durationMinutes));
    if (instructorId) queryParams.append('instructorId', instructorId);
    
    return `${apiBaseUrl}/demo-booking/available-slots?${queryParams.toString()}`;
  },

  checkSlotAvailability: (timeSlot: string, options: {
    timezone?: string;
    durationMinutes?: number;
    excludeBookingId?: string;
  } = {}): string => {
    if (!timeSlot) throw new Error('Time slot is required');
    
    const { timezone = "UTC", durationMinutes = 60, excludeBookingId = "" } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('timeSlot', timeSlot);
    queryParams.append('timezone', timezone);
    queryParams.append('duration', String(durationMinutes));
    
    if (excludeBookingId) queryParams.append('excludeBookingId', excludeBookingId);
    
    return `${apiBaseUrl}/demo-booking/check-availability?${queryParams.toString()}`;
  },

  // Instructor and admin endpoints
  getInstructorBookings: (instructorId: string, options: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): string => {
    if (!instructorId) throw new Error('Instructor ID is required');
    
    const { status = "", startDate = "", endDate = "", page = 1, limit = 20 } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(Math.min(limit, 100)));
    
    if (status) queryParams.append('status', status);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return `${apiBaseUrl}/demo-booking/instructor/${instructorId}?${queryParams.toString()}`;
  },

  assignInstructor: (bookingId: string): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    return `${apiBaseUrl}/demo-booking/${bookingId}/assign-instructor`;
  },

  updateInstructorNotes: (bookingId: string): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    return `${apiBaseUrl}/demo-booking/${bookingId}/instructor-notes`;
  },

  // Statistics and analytics endpoints
  getBookingStats: (options: {
    startDate?: string;
    endDate?: string;
    period?: '7d' | '30d' | '90d' | 'custom';
    instructorId?: string;
    includeConversionMetrics?: boolean;
    includeRevenueData?: boolean;
  } = {}): string => {
    const { 
      startDate = "", 
      endDate = "", 
      period = "7d", 
      instructorId = "",
      includeConversionMetrics = false,
      includeRevenueData = false
    } = options;
    
    const queryParams = new URLSearchParams();
    
    queryParams.append('period', period);
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (instructorId) queryParams.append('instructorId', instructorId);
    if (includeConversionMetrics) queryParams.append('include_conversion', 'true');
    if (includeRevenueData) queryParams.append('include_revenue', 'true');
    
    return `${apiBaseUrl}/demo-booking/stats?${queryParams.toString()}`;
  },

  getBookingAnalytics: (options: {
    timeframe?: 'daily' | 'weekly' | 'monthly';
    startDate?: string;
    endDate?: string;
    groupBy?: 'demo_type' | 'experience_level' | 'source' | 'instructor';
  } = {}): string => {
    const { timeframe = "weekly", startDate = "", endDate = "", groupBy = "demo_type" } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('timeframe', timeframe);
    queryParams.append('groupBy', groupBy);
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return `${apiBaseUrl}/demo-booking/analytics?${queryParams.toString()}`;
  },

  // Bulk operations
  bulkUpdateBookings: (): string => {
    return `${apiBaseUrl}/demo-booking/bulk-update`;
  },

  exportBookings: (options: {
    format?: 'csv' | 'xlsx' | 'json';
    startDate?: string;
    endDate?: string;
    status?: string;
    includeHistory?: boolean;
  } = {}): string => {
    const { format = "csv", startDate = "", endDate = "", status = "", includeHistory = false } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('format', format);
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (status) queryParams.append('status', status);
    if (includeHistory) queryParams.append('include_history', 'true');
    
    return `${apiBaseUrl}/demo-booking/export?${queryParams.toString()}`;
  },

  // Notification and communication endpoints
  sendReminder: (bookingId: string, reminderType: 'email' | 'sms' | 'both' = 'email'): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    return `${apiBaseUrl}/demo-booking/${bookingId}/send-reminder?type=${reminderType}`;
  },

  sendFollowUp: (bookingId: string): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    return `${apiBaseUrl}/demo-booking/${bookingId}/send-follow-up`;
  },

  generateMeetingLink: (bookingId: string, platform: 'zoom' | 'teams' | 'meet' = 'zoom'): string => {
    if (!bookingId) throw new Error('Booking ID is required');
    return `${apiBaseUrl}/demo-booking/${bookingId}/generate-meeting-link?platform=${platform}`;
  },

  // Admin dashboard endpoints
  getDashboardData: (options: {
    period?: string;
    includeUpcoming?: boolean;
    includeMetrics?: boolean;
  } = {}): string => {
    const { period = "7d", includeUpcoming = true, includeMetrics = true } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('period', period);
    if (includeUpcoming) queryParams.append('include_upcoming', 'true');
    if (includeMetrics) queryParams.append('include_metrics', 'true');
    
    return `${apiBaseUrl}/demo-booking/dashboard?${queryParams.toString()}`;
  },

  getRecentActivity: (limit: number = 10): string => {
    return `${apiBaseUrl}/demo-booking/recent-activity?limit=${Math.min(limit, 50)}`;
  },

  // Validation and utility endpoints
  validateBookingData: (): string => {
    return `${apiBaseUrl}/demo-booking/validate`;
  },

  getBusinessHours: (timezone: string = "UTC"): string => {
    return `${apiBaseUrl}/demo-booking/business-hours?timezone=${timezone}`;
  },

  getSystemConfig: (): string => {
    return `${apiBaseUrl}/demo-booking/config`;
  },

  // Demo Feedback endpoints
  createFeedback: (): string => {
    return `${apiBaseUrl}/demo-feedback`;
  },

  getUserFeedback: (options: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'overallRating' | 'status';
    sortOrder?: 'asc' | 'desc';
  } = {}): string => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(Math.min(limit, 100)));
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);
    
    return `${apiBaseUrl}/demo-feedback/my-feedback?${queryParams.toString()}`;
  },

  getAvailableDemosForFeedback: (): string => {
    return `${apiBaseUrl}/demo-feedback/available-demos`;
  },

  getFeedbackById: (feedbackId: string): string => {
    if (!feedbackId) throw new Error('Feedback ID is required');
    return `${apiBaseUrl}/demo-feedback/${feedbackId}`;
  },

  updateFeedback: (feedbackId: string): string => {
    if (!feedbackId) throw new Error('Feedback ID is required');
    return `${apiBaseUrl}/demo-feedback/${feedbackId}`;
  },

  getAllFeedback: (options: {
    demoBookingId?: string;
    userId?: string;
    overallRating?: number;
    contentQuality?: string;
    instructorPerformance?: string;
    wouldRecommend?: boolean;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}): string => {
    const { 
      demoBookingId = "",
      userId = "",
      overallRating,
      contentQuality = "",
      instructorPerformance = "",
      wouldRecommend,
      status = "",
      priority = "",
      startDate = "",
      endDate = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = options;
    
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(Math.min(limit, 100)));
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);
    
    if (demoBookingId) queryParams.append('demoBookingId', demoBookingId);
    if (userId) queryParams.append('userId', userId);
    if (typeof overallRating === 'number') queryParams.append('overallRating', String(overallRating));
    if (contentQuality) queryParams.append('contentQuality', contentQuality);
    if (instructorPerformance) queryParams.append('instructorPerformance', instructorPerformance);
    if (typeof wouldRecommend === 'boolean') queryParams.append('wouldRecommend', String(wouldRecommend));
    if (status) queryParams.append('status', status);
    if (priority) queryParams.append('priority', priority);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return `${apiBaseUrl}/demo-feedback?${queryParams.toString()}`;
  },

  addFeedbackResponse: (feedbackId: string): string => {
    if (!feedbackId) throw new Error('Feedback ID is required');
    return `${apiBaseUrl}/demo-feedback/${feedbackId}/response`;
  },

  getFeedbackStats: (options: {
    startDate?: string;
    endDate?: string;
    instructorId?: string;
    period?: 'day' | 'week' | 'month';
  } = {}): string => {
    const { startDate = "", endDate = "", instructorId = "", period = "month" } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('period', period);
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (instructorId) queryParams.append('instructorId', instructorId);
    
    return `${apiBaseUrl}/demo-feedback/stats?${queryParams.toString()}`;
  }
};

// TypeScript interfaces for better type safety
export interface DemoBookingRequest {
  userId?: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  timeSlot: string;
  timezone?: string;
  demoType?: 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry';
  courseInterest?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  companyName?: string;
  jobTitle?: string;
  requirements?: string;
  notes?: string;
  source?: 'website' | 'social_media' | 'referral' | 'advertisement' | 'other';
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  autoGenerateZoomMeeting?: boolean;
  zoomMeetingSettings?: {
    duration?: number;
    auto_recording?: 'cloud' | 'local' | 'none';
    waiting_room?: boolean;
    host_video?: boolean;
    participant_video?: boolean;
    mute_upon_entry?: boolean;
    join_before_host?: boolean;
    meeting_authentication?: boolean;
    registrants_confirmation_email?: boolean;
    registrants_email_notification?: boolean;
  };
  // Comprehensive student details
  studentDetails?: {
    personalInfo?: {
      age?: number;
      gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
      dateOfBirth?: string;
    };
    academicInfo?: {
      educationLevel?: 'high-school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'professional' | 'other';
      fieldOfStudy?: string;
      currentOccupation?: string;
      studentStatus?: 'full-time-student' | 'part-time-student' | 'working-professional' | 'job-seeker' | 'freelancer' | 'entrepreneur';
    };
    technicalInfo?: {
      programmingExperience?: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
      currentSkills?: string[];
      interestedTechnologies?: string[];
      hasLaptop?: 'yes' | 'no' | 'shared';
      internetSpeed?: 'slow' | 'moderate' | 'fast' | 'very-fast';
      onlineLearningExperience?: 'none' | 'some' | 'extensive';
    };
    learningPreferences?: {
      preferredLearningStyle?: 'visual' | 'auditory' | 'hands-on' | 'reading' | 'mixed';
      learningGoals?: string[];
      careerObjectives?: string;
      availableTimePerWeek?: number;
      timelineExpectations?: '1-3-months' | '3-6-months' | '6-12-months' | '1-2-years' | 'flexible';
      budgetRange?: 'under-1000' | '1000-2000' | '2000-4000' | '4000-6000' | 'above-6000' | 'flexible';
    };
    contactInfo?: {
      preferredContactMethod?: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'linkedin';
      socialMediaProfiles?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
      };
      emergencyContact?: string;
    };
    additionalInfo?: {
      howDidYouHearAboutUs?: 'google-search' | 'social-media' | 'friend-referral' | 'youtube' | 'linkedin' | 'advertisement' | 'blog' | 'other';
      referralCode?: string;
      specialRequirements?: string;
      accessibilityNeeds?: string;
    };
  };
}

export interface DemoBookingUpdateRequest {
  bookingId: string;
  action: 'cancel' | 'reschedule' | 'confirm' | 'complete' | 'no-show';
  newTimeSlot?: string;
  reason?: string;
  rating?: number;
  feedback?: string;
  completionNotes?: string;
  rescheduleReason?: string;
  cancellationReason?: string;
}

export interface DemoBooking {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  timeSlot: string;
  scheduledDateTime: Date;
  timezone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'no-show';
  demoType: 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry';
  courseInterest?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  companyName?: string;
  jobTitle?: string;
  requirements?: string;
  notes?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  instructorId?: string;
  instructorNotes?: string;
  durationMinutes: number;
  canReschedule: boolean;
  canCancel: boolean;
  isUpcoming: boolean;
  rescheduleHistory: RescheduleEvent[];
  cancellationReason?: string;
  rating?: number;
  feedback?: string;
  source: 'website' | 'social_media' | 'referral' | 'advertisement' | 'other';
  followUpRequired: boolean;
  followUpCompleted: boolean;
  autoGenerateZoomMeeting?: boolean;
  zoomMeeting?: {
    id?: string;
    uuid?: string;
    topic?: string;
    type?: number;
    status?: string;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    created_at?: string;
    start_url?: string;
    join_url?: string;
    password?: string;
    h323_password?: string;
    pstn_password?: string;
    encrypted_password?: string;
    settings?: {
      host_video?: boolean;
      participant_video?: boolean;
      join_before_host?: boolean;
      mute_upon_entry?: boolean;
      auto_recording?: string;
      waiting_room?: boolean;
      meeting_authentication?: boolean;
      registrants_confirmation_email?: boolean;
      registrants_email_notification?: boolean;
    };
    isZoomMeetingCreated?: boolean;
    zoomMeetingCreatedAt?: string;
    zoomMeetingError?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RescheduleEvent {
  fromDateTime: Date;
  toDateTime: Date;
  reason?: string;
  rescheduledAt: Date;
  rescheduledBy: 'user' | 'instructor' | 'admin';
}

export interface AvailableSlot {
  datetime: string;
  time: string;
  display_time: string;
  display_datetime?: string;
  available: boolean;
  bookings_count: number;
  date?: string;
  display_date?: string;
  day_name?: string;
  is_today?: boolean;
  is_tomorrow?: boolean;
}

export interface DailySlots {
  date: string;
  display_date: string;
  day_name: string;
  is_today: boolean;
  is_tomorrow: boolean;
  slots: AvailableSlot[];
  total_day_slots: number;
  available_day_slots: number;
}

export interface AvailableSlotsResponse {
  start_date: string;
  end_date: string;
  timezone: string;
  days: number;
  daily_slots?: DailySlots[];
  slots?: AvailableSlot[]; // Fallback for older API format
  date?: string; // Fallback for older API format
  summary?: {
    total_days: number;
    total_slots: number;
    available_slots: number;
    fully_booked_days: number;
    partially_available_days: number;
    fully_available_days: number;
  };
  next_available_slots?: AvailableSlot[];
}

// Pagination interface
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  pagination?: PaginationInfo;
}

// Demo type definitions
export type DemoType = 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry';

// Demo Feedback interfaces
export interface DemoFeedbackRequest {
  demoBookingId: string;
  overallRating: number; // 1-5 stars
  contentQuality: 'excellent' | 'good' | 'average' | 'poor';
  instructorPerformance: 'excellent' | 'good' | 'average' | 'poor';
  wouldRecommend: boolean;
  additionalComments?: string;
  specificFeedback?: {
    demoStructure?: {
      rating?: 'excellent' | 'good' | 'average' | 'poor';
      comments?: string;
    };
    technicalAspects?: {
      rating?: 'excellent' | 'good' | 'average' | 'poor';
      comments?: string;
    };
    interaction?: {
      rating?: 'excellent' | 'good' | 'average' | 'poor';
      comments?: string;
    };
    relevance?: {
      rating?: 'excellent' | 'good' | 'average' | 'poor';
      comments?: string;
    };
  };
  likedMost?: string;
  improvementAreas?: string;
  followUpInterest?: {
    enrollmentInterest?: boolean;
    consultationRequest?: boolean;
    moreInfoRequest?: boolean;
    specificCourseInterest?: string;
  };
  feedbackSource?: 'email_link' | 'website_form' | 'mobile_app' | 'phone_call' | 'other';
}

export interface DemoFeedback {
  id: string;
  demoBookingId: string;
  userId: string;
  demoBooking?: DemoBooking;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  
  // Core ratings
  overallRating: number;
  contentQuality: 'excellent' | 'good' | 'average' | 'poor';
  instructorPerformance: 'excellent' | 'good' | 'average' | 'poor';
  wouldRecommend: boolean;
  
  // Detailed feedback
  additionalComments?: string;
  specificFeedback?: {
    demoStructure?: { rating?: string; comments?: string; };
    technicalAspects?: { rating?: string; comments?: string; };
    interaction?: { rating?: string; comments?: string; };
    relevance?: { rating?: string; comments?: string; };
  };
  likedMost?: string;
  improvementAreas?: string;
  
  // Follow-up interest
  followUpInterest?: {
    enrollmentInterest?: boolean;
    consultationRequest?: boolean;
    moreInfoRequest?: boolean;
    specificCourseInterest?: string;
  };
  
  // Metadata
  feedbackSource: 'email_link' | 'website_form' | 'mobile_app' | 'phone_call' | 'other';
  
  // Admin management
  adminResponse?: {
    respondedBy?: string;
    responseText?: string;
    responseDate?: Date;
    isPublic?: boolean;
  };
  status: 'pending' | 'reviewed' | 'responded' | 'archived';
  internalNotes?: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentimentScore?: number;
  
  // Computed fields
  feedbackSummary?: {
    averageRating?: string;
    hasFollowUpInterest?: boolean;
    requiresResponse?: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date;
  isActive: boolean;
  
  // User permissions
  canEdit: boolean;
  canRespond?: boolean;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageOverallRating: number;
  recommendationRate: number;
  distributions: {
    ratings: Record<string, number>;
    contentQuality: Record<string, number>;
    instructorPerformance: Record<string, number>;
    status: Record<string, number>;
    priority: Record<string, number>;
  };
  trends: Array<{
    period: string;
    count: number;
    averageRating: number;
    recommendationRate: number;
  }>;
}

export interface AvailableDemoForFeedback {
  id: string;
  scheduledDateTime: string;
  demoType: string;
  courseInterest?: string;
  instructor?: {
    id: string;
    fullName: string;
    email: string;
  };
  durationMinutes: number;
  completedAt: string;
}

// Utility functions for demo booking handling
export const demoBookingUtils = {
  /**
   * Validates if a booking can be cancelled
   */
  canCancelBooking: (booking: DemoBooking): boolean => {
    console.log('Checking if booking can be cancelled:', booking);
    
    if (!booking) {
      console.log('Booking is null/undefined');
      return false;
    }
    
    // Check status
    if (!['pending', 'confirmed', 'rescheduled'].includes(booking.status)) {
      console.log('Booking status does not allow cancellation:', booking.status);
      return false;
    }
    
    // Check time - must be more than 2 hours before scheduled time
    const now = new Date();
    const scheduledTime = new Date(booking.scheduledDateTime);
    const timeDifference = scheduledTime.getTime() - now.getTime();
    const hoursUntilBooking = timeDifference / (1000 * 60 * 60);
    
    console.log('Hours until booking:', hoursUntilBooking);
    
    const canCancel = hoursUntilBooking > 2;
    console.log('Can cancel booking:', canCancel);
    
    return canCancel;
  },

  /**
   * Validates if a booking can be rescheduled
   */
  canRescheduleBooking: (booking: DemoBooking): boolean => {
    console.log('Checking if booking can be rescheduled:', booking);
    
    if (!booking) {
      console.log('Booking is null/undefined');
      return false;
    }
    
    // Check status
    if (!['pending', 'confirmed'].includes(booking.status)) {
      console.log('Booking status does not allow rescheduling:', booking.status);
      return false;
    }
    
    // Check reschedule limit (max 3 reschedules)
    const rescheduleCount = booking.rescheduleHistory?.length || 0;
    if (rescheduleCount >= 3) {
      console.log('Maximum reschedule limit reached:', rescheduleCount);
      return false;
    }
    
    // Check time - must be more than 24 hours before scheduled time
    const now = new Date();
    const scheduledTime = new Date(booking.scheduledDateTime);
    const timeDifference = scheduledTime.getTime() - now.getTime();
    const hoursUntilBooking = timeDifference / (1000 * 60 * 60);
    
    console.log('Hours until booking:', hoursUntilBooking);
    
    const canReschedule = hoursUntilBooking > 24;
    console.log('Can reschedule booking:', canReschedule);
    
    return canReschedule;
  },

  /**
   * Checks if a booking is upcoming
   */
  isUpcomingBooking: (booking: DemoBooking): boolean => {
    if (!booking) return false;
    
    const now = new Date();
    const scheduledTime = new Date(booking.scheduledDateTime);
    
    return scheduledTime > now && ['pending', 'confirmed', 'rescheduled'].includes(booking.status);
  },

  /**
   * Formats time slot for display
   */
  formatTimeSlot: (timeSlot: string, timezone: string = 'UTC'): string => {
    try {
      const date = new Date(timeSlot);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date);
    } catch (error) {
      console.error('Error formatting time slot:', error);
      return timeSlot;
    }
  },

  /**
   * Validates booking request data
   */
  validateBookingRequest: (request: DemoBookingRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields
    if (!request.email) errors.push('Email is required');
    if (!request.fullName) errors.push('Full name is required');
    if (!request.timeSlot) errors.push('Time slot is required');
    
    // Email validation
    if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      errors.push('Please provide a valid email address');
    }
    
    // Full name validation
    if (request.fullName && (request.fullName.length < 2 || request.fullName.length > 100)) {
      errors.push('Full name must be between 2 and 100 characters');
    }
    
    // Phone number validation (if provided)
    if (request.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(request.phoneNumber.replace(/[\s-()]/g, ''))) {
      errors.push('Please provide a valid phone number');
    }
    
    // Time slot validation
    if (request.timeSlot) {
      const timeSlot = new Date(request.timeSlot);
      const now = new Date();
      
      if (isNaN(timeSlot.getTime())) {
        errors.push('Invalid time slot format');
      } else {
        const timeDifference = timeSlot.getTime() - now.getTime();
        const hoursFromNow = timeDifference / (1000 * 60 * 60);
        
        if (hoursFromNow < 2) {
          errors.push('Time slot must be at least 2 hours in the future');
        }
        
        if (hoursFromNow > (90 * 24)) {
          errors.push('Time slot cannot be more than 90 days in the future');
        }
      }
    }
    
    // Requirements and notes length validation
    if (request.requirements && request.requirements.length > 1000) {
      errors.push('Requirements must not exceed 1000 characters');
    }
    
    if (request.notes && request.notes.length > 500) {
      errors.push('Notes must not exceed 500 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Generates booking summary for display
   */
  generateBookingSummary: (booking: DemoBooking): string => {
    const formattedTime = demoBookingUtils.formatTimeSlot(booking.timeSlot, booking.timezone);
    const demoTypeFormatted = booking.demoType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let summary = `${demoTypeFormatted} with ${booking.fullName}`;
    if (booking.courseInterest) {
      summary += ` (${booking.courseInterest})`;
    }
    summary += ` on ${formattedTime}`;
    
    return summary;
  },

  /**
   * Calculates booking status badge color
   */
  getStatusBadgeColor: (status: DemoBooking['status']): string => {
    const statusColors = {
      pending: 'yellow',
      confirmed: 'green',
      cancelled: 'red',
      rescheduled: 'blue',
      completed: 'green',
      'no-show': 'gray'
    };
    
    return statusColors[status] || 'gray';
  }
};

// Helper functions for common operations that make actual API calls
export const demoBookingHelpers = {
  /**
   * Creates a booking for the current authenticated user
   */
  createBookingForCurrentUser: async (timeSlot: string, additionalData: Partial<DemoBookingRequest> = {}): Promise<ApiResponse<{ booking: DemoBooking }>> => {
    try {
      // Get user data from localStorage - check multiple possible keys
      const userId = localStorage.getItem("userId") || undefined;
      const userEmail = localStorage.getItem("email") || 
                       localStorage.getItem("userEmail") || 
                       localStorage.getItem("rememberedEmail") || "";
      
      // Get full name and clean it to meet validation requirements
      let fullName = localStorage.getItem("fullName") || 
                     localStorage.getItem("userName") || 
                     localStorage.getItem("full_name") || "";
      
      // Clean the full name to only contain letters, spaces, hyphens, and apostrophes
      if (fullName) {
        fullName = fullName.replace(/[^a-zA-Z\s\-']/g, '').trim();
        if (!fullName) {
          fullName = "User"; // Fallback if cleaning results in empty string
        }
      } else {
        fullName = "User"; // Default fallback
      }
      
      // Validate email
      if (!userEmail || !userEmail.includes('@')) {
        throw new Error('Valid email address is required. Please log in again.');
      }
      
      // Validate and adjust time slot
      const now = new Date();
      const selectedTime = new Date(timeSlot);
      
      // Check if the time slot is valid
      if (isNaN(selectedTime.getTime())) {
        throw new Error('Invalid time slot format. Please select a valid time.');
      }
      
      // Check if the time slot is at least 2 hours in the future
      const timeDifference = selectedTime.getTime() - now.getTime();
      const hoursFromNow = timeDifference / (1000 * 60 * 60);
      
      if (hoursFromNow < 2) {
        // If the selected time is too soon, find the next available slot (2 hours from now)
        const minTime = new Date(now.getTime() + (2.5 * 60 * 60 * 1000)); // 2.5 hours from now
        const adjustedTimeSlot = minTime.toISOString();
        
        console.warn(`Selected time slot was too soon (${hoursFromNow.toFixed(2)} hours from now). Adjusting to: ${adjustedTimeSlot}`);
        
        const bookingData: DemoBookingRequest = {
          userId,
          email: userEmail,
          fullName,
          timeSlot: adjustedTimeSlot,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          demoType: 'course_demo',
          source: 'website',
          ...additionalData
        };
        
        // Show a warning to the user about the time adjustment
        if (typeof window !== 'undefined') {
          alert(`Selected time was too soon. Your demo has been scheduled for ${minTime.toLocaleString()} instead.`);
        }
        
        // Make the API call with adjusted time slot
        const endpoint = demoBookingAPI.createBooking({
          includeUtmTracking: true,
          validateAvailability: true
        });

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        return result;
      }
      
      const bookingData: DemoBookingRequest = {
        userId,
        email: userEmail,
        fullName,
        timeSlot,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        demoType: 'course_demo',
        source: 'website',
        ...additionalData
      };

      const endpoint = demoBookingAPI.createBooking({
        includeUtmTracking: true,
        validateAvailability: true
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create booking',
        error_code: 'BOOKING_ERROR'
      };
    }
  },

  /**
   * Gets current user's bookings with common filters
   */
  getCurrentUserBookings: async (status?: DemoBooking['status']): Promise<ApiResponse<{ bookings: DemoBooking[]; pagination: PaginationInfo }>> => {
    try {
      const endpoint = demoBookingAPI.getUserBookings({
        status,
        limit: 20,
        includeInstructor: true,
        includeHistory: false
      });

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch bookings',
        error_code: 'FETCH_ERROR',
        data: { bookings: [], pagination: { current_page: 1, total_pages: 0, total_items: 0, items_per_page: 20, has_next_page: false, has_prev_page: false } }
      };
    }
  },

  /**
   * Checks if user has any active bookings
   */
  hasActiveBookings: async (): Promise<boolean> => {
    try {
      const response = await demoBookingHelpers.getCurrentUserBookings('confirmed');
      return !!(response.success && response.data && response.data.bookings.length > 0);
    } catch (error) {
      console.error('Error checking active bookings:', error);
      return false;
    }
  },

  /**
   * Cancels a booking with validation
   */
  cancelBooking: async (bookingId: string, reason?: string): Promise<ApiResponse<{ booking: DemoBooking }>> => {
    try {
      const updateData: DemoBookingUpdateRequest = {
        bookingId,
        action: 'cancel',
        cancellationReason: reason
      };

      const endpoint = demoBookingAPI.updateBooking('cancel');

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel booking',
        error_code: 'CANCEL_ERROR'
      };
    }
  },

  /**
   * Reschedules a booking with validation
   */
  rescheduleBooking: async (bookingId: string, newTimeSlot: string, reason?: string): Promise<ApiResponse<{ booking: DemoBooking }>> => {
    try {
      const updateData: DemoBookingUpdateRequest = {
        bookingId,
        action: 'reschedule',
        newTimeSlot,
        rescheduleReason: reason
      };

      const endpoint = demoBookingAPI.updateBooking('reschedule');

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reschedule booking',
        error_code: 'RESCHEDULE_ERROR'
      };
    }
  },

  /**
   * Gets available time slots for booking
   */
  getAvailableSlots: async (date: string, options: {
    timezone?: string;
    demoType?: DemoType;
    durationMinutes?: number;
  } = {}): Promise<ApiResponse<AvailableSlotsResponse>> => {
    try {
      const endpoint = demoBookingAPI.getAvailableSlots(date, options);

      const response = await fetch(endpoint, {
        method: 'GET'
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch available slots',
        error_code: 'SLOTS_ERROR',
        data: { 
          start_date: date, 
          end_date: date, 
          timezone: 'UTC', 
          days: 1, 
          slots: [] 
        }
      };
    }
  },

  /**
   * Submits feedback for a completed demo session
   */
  submitFeedback: async (bookingId: string, feedbackData: {
    overallRating: number;
    contentQuality?: string;
    instructorPerformance?: string;
    additionalComments?: string;
    wouldRecommend?: boolean;
  }): Promise<ApiResponse<{ booking: DemoBooking }>> => {
    try {
      const updateData: DemoBookingUpdateRequest = {
        bookingId,
        action: 'complete',
        rating: feedbackData.overallRating,
        feedback: feedbackData.additionalComments,
        completionNotes: `Content Quality: ${feedbackData.contentQuality || 'N/A'}, Instructor: ${feedbackData.instructorPerformance || 'N/A'}, Recommend: ${feedbackData.wouldRecommend ? 'Yes' : 'No'}`
      };

      const endpoint = demoBookingAPI.updateBooking('complete');

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit feedback',
        error_code: 'FEEDBACK_ERROR'
      };
    }
  },

  /**
   * Gets a specific booking by ID
   */
  getBookingById: async (bookingId: string): Promise<ApiResponse<{ booking: DemoBooking }>> => {
    try {
      const endpoint = demoBookingAPI.getBookingById(bookingId, {
        includeInstructor: true,
        includeHistory: true
      });

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch booking',
        error_code: 'FETCH_ERROR'
      };
    }
  }
};

// Helper functions for demo feedback handling
export const demoFeedbackHelpers = {
  /**
   * Creates feedback for a completed demo session
   */
  createFeedback: async (feedbackData: DemoFeedbackRequest): Promise<ApiResponse<{ feedback: DemoFeedback }>> => {
    try {
      const endpoint = demoBookingAPI.createFeedback();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          ...feedbackData,
          feedbackSource: feedbackData.feedbackSource || 'website_form'
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit feedback',
        error_code: 'FEEDBACK_ERROR'
      };
    }
  },

  /**
   * Gets current user's feedback with pagination
   */
  getUserFeedback: async (options: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'overallRating' | 'status';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<{ feedbacks: DemoFeedback[]; pagination: PaginationInfo }>> => {
    try {
      const endpoint = demoBookingAPI.getUserFeedback(options);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch feedback',
        error_code: 'FETCH_ERROR',
        data: { feedbacks: [], pagination: { current_page: 1, total_pages: 0, total_items: 0, items_per_page: 10, has_next_page: false, has_prev_page: false } }
      };
    }
  },

  /**
   * Gets available demo sessions for feedback
   */
  getAvailableDemosForFeedback: async (): Promise<ApiResponse<{ availableDemos: AvailableDemoForFeedback[]; totalAvailable: number }>> => {
    try {
      const endpoint = demoBookingAPI.getAvailableDemosForFeedback();

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching available demos for feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch available demos',
        error_code: 'FETCH_ERROR',
        data: { availableDemos: [], totalAvailable: 0 }
      };
    }
  },

  /**
   * Gets feedback by ID
   */
  getFeedbackById: async (feedbackId: string): Promise<ApiResponse<{ feedback: DemoFeedback }>> => {
    try {
      const endpoint = demoBookingAPI.getFeedbackById(feedbackId);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch feedback',
        error_code: 'FETCH_ERROR'
      };
    }
  },

  /**
   * Updates existing feedback (within 24 hours)
   */
  updateFeedback: async (feedbackId: string, feedbackData: Partial<DemoFeedbackRequest>): Promise<ApiResponse<{ feedback: DemoFeedback }>> => {
    try {
      const endpoint = demoBookingAPI.updateFeedback(feedbackId);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(feedbackData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating feedback:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update feedback',
        error_code: 'UPDATE_ERROR'
      };
    }
  },

  /**
   * Gets feedback statistics
   */
  getFeedbackStats: async (options: {
    startDate?: string;
    endDate?: string;
    instructorId?: string;
    period?: 'day' | 'week' | 'month';
  } = {}): Promise<ApiResponse<FeedbackStats>> => {
    try {
      const endpoint = demoBookingAPI.getFeedbackStats(options);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch feedback statistics',
        error_code: 'STATS_ERROR'
      };
    }
  },

  /**
   * Checks if user can provide feedback for a demo session
   */
  canProvideFeedback: async (demoBookingId: string): Promise<boolean> => {
    try {
      // First check if the demo is completed
      const bookingResponse = await demoBookingHelpers.getBookingById(demoBookingId);
      
      if (!bookingResponse.success || !bookingResponse.data?.booking) {
        return false;
      }

      const booking = bookingResponse.data.booking;
      
      // Check if demo is completed
      if (booking.status !== 'completed') {
        return false;
      }

      // Check if feedback already exists
      const availableResponse = await demoFeedbackHelpers.getAvailableDemosForFeedback();
      
      if (availableResponse.success && availableResponse.data?.availableDemos) {
        const isAvailable = availableResponse.data.availableDemos.some(
          demo => demo.id === demoBookingId
        );
        return isAvailable;
      }

      return false;
    } catch (error) {
      console.error('Error checking feedback eligibility:', error);
      return false;
    }
  },

  /**
   * Validates feedback data before submission
   */
  validateFeedbackData: (data: DemoFeedbackRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required fields
    if (!data.demoBookingId) errors.push('Demo booking ID is required');
    if (!data.overallRating || data.overallRating < 1 || data.overallRating > 5) {
      errors.push('Overall rating must be between 1 and 5');
    }
    if (!data.contentQuality) errors.push('Content quality rating is required');
    if (!data.instructorPerformance) errors.push('Instructor performance rating is required');
    if (typeof data.wouldRecommend !== 'boolean') errors.push('Recommendation preference is required');

    // Optional field validations
    if (data.additionalComments && data.additionalComments.length > 2000) {
      errors.push('Additional comments must not exceed 2000 characters');
    }

    if (data.likedMost && data.likedMost.length > 1000) {
      errors.push('Liked most section must not exceed 1000 characters');
    }

    if (data.improvementAreas && data.improvementAreas.length > 1000) {
      errors.push('Improvement areas section must not exceed 1000 characters');
    }

    // Validate specific feedback comments
    if (data.specificFeedback) {
      Object.values(data.specificFeedback).forEach(feedback => {
        if (feedback?.comments && feedback.comments.length > 500) {
          errors.push('Specific feedback comments must not exceed 500 characters each');
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Formats feedback data for display
   */
  formatFeedbackForDisplay: (feedback: DemoFeedback) => {
    const getRatingText = (rating: string) => {
      const ratingMap = {
        'excellent': '⭐⭐⭐⭐⭐ Excellent',
        'good': '⭐⭐⭐⭐ Good',
        'average': '⭐⭐⭐ Average',
        'poor': '⭐⭐ Poor'
      };
      return ratingMap[rating as keyof typeof ratingMap] || rating;
    };

    const getStarRating = (rating: number) => {
      return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return {
      ...feedback,
      formattedOverallRating: getStarRating(feedback.overallRating),
      formattedContentQuality: getRatingText(feedback.contentQuality),
      formattedInstructorPerformance: getRatingText(feedback.instructorPerformance),
      formattedSubmittedAt: new Date(feedback.submittedAt).toLocaleDateString(),
      recommendationText: feedback.wouldRecommend ? '👍 Yes' : '👎 No'
    };
  }
};

export default demoBookingAPI;
