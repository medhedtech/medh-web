/**
 * Comprehensive TypeScript types for Demo Booking system
 * These types match the API documentation and ensure type safety
 */

// Core booking status types
export type DemoBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'no-show';

// Demo type categories
export type DemoType = 'course_demo' | 'consultation' | 'product_walkthrough' | 'general_inquiry';

// Experience levels
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Booking sources
export type BookingSource = 'website' | 'social_media' | 'referral' | 'advertisement' | 'other';

// Action types for booking updates
export type BookingActionType = 'cancel' | 'reschedule' | 'confirm' | 'complete' | 'no-show';

// Reschedule event types
export type RescheduleBy = 'user' | 'instructor' | 'admin';

// Meeting platform types
export type MeetingPlatform = 'zoom' | 'teams' | 'meet';

// Export format types
export type ExportFormat = 'csv' | 'xlsx' | 'json';

// Analytics grouping types
export type AnalyticsGroupBy = 'demo_type' | 'experience_level' | 'source' | 'instructor';

// Time frame types for analytics
export type AnalyticsTimeframe = 'daily' | 'weekly' | 'monthly';

// Period types for statistics
export type StatsPeriod = '7d' | '30d' | '90d' | 'custom';

// Reminder types
export type ReminderType = 'email' | 'sms' | 'both';

/**
 * UTM Parameters for tracking marketing campaigns
 */
export interface UTMParameters {
  source?: string;      // Campaign source (e.g., 'google', 'newsletter')
  medium?: string;      // Campaign medium (e.g., 'cpc', 'email')
  campaign?: string;    // Campaign name (e.g., 'spring_sale')
  term?: string;        // Campaign term (e.g., 'running+shoes')
  content?: string;     // Campaign content (e.g., 'logolink', 'textlink')
}

/**
 * Reschedule event tracking
 */
export interface RescheduleEvent {
  fromDateTime: Date;
  toDateTime: Date;
  reason?: string;
  rescheduledAt: Date;
  rescheduledBy: RescheduleBy;
}

/**
 * Instructor information included with bookings
 */
export interface BookingInstructor {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
  specialization?: string[];
  rating?: number;
  experience_years?: number;
}

/**
 * Core Demo Booking model
 */
export interface DemoBooking {
  id: string;
  userId?: string;                    // MongoDB ObjectId (optional for guest bookings)
  email: string;                      // Required, normalized to lowercase
  fullName: string;                   // Required, 2-100 characters
  phoneNumber?: string;               // Optional, validated format
  timeSlot: string;                   // Required, ISO 8601 date string
  scheduledDateTime: Date;            // Auto-generated from timeSlot
  timezone: string;                   // Default: "UTC"
  status: DemoBookingStatus;
  demoType: DemoType;
  courseInterest?: string;            // Course of interest
  experienceLevel?: ExperienceLevel;
  companyName?: string;               // Company name
  jobTitle?: string;                  // Job title
  requirements?: string;              // Special requirements (max 1000 chars)
  notes?: string;                     // Additional notes (max 500 chars)
  meetingLink?: string;               // Meeting URL (auto-generated)
  meetingId?: string;                 // Meeting ID
  instructorId?: string;              // Assigned instructor
  instructorNotes?: string;           // Instructor's notes
  durationMinutes: number;            // Default: 60, min: 15, max: 180
  canReschedule: boolean;             // Virtual field - can booking be rescheduled
  canCancel: boolean;                 // Virtual field - can booking be cancelled
  isUpcoming: boolean;                // Virtual field - is booking upcoming
  rescheduleHistory: RescheduleEvent[]; // History of reschedules
  cancellationReason?: string;        // Reason for cancellation
  rating?: number;                    // 1-5 rating after completion
  feedback?: string;                  // Feedback after completion
  source: BookingSource;
  followUpRequired: boolean;          // Default: true
  followUpCompleted: boolean;         // Default: false
  instructor?: BookingInstructor;     // Populated when includeInstructor is true
  utmParameters?: UTMParameters;      // UTM tracking data
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request payload for creating a new demo booking
 */
export interface DemoBookingRequest {
  userId?: string;                    // Optional if authenticated
  email: string;                      // Required
  fullName: string;                   // Required
  phoneNumber?: string;               // Optional
  timeSlot: string;                   // Required, ISO 8601 format
  timezone?: string;                  // Optional, defaults to UTC
  demoType?: DemoType;               // Optional, defaults to 'course_demo'
  courseInterest?: string;            // Optional
  experienceLevel?: ExperienceLevel; // Optional
  companyName?: string;               // Optional
  jobTitle?: string;                  // Optional
  requirements?: string;              // Optional, max 1000 chars
  notes?: string;                     // Optional, max 500 chars
  source?: BookingSource;            // Optional, defaults to 'website'
  utmParameters?: UTMParameters;      // Optional UTM tracking
}

/**
 * Request payload for updating a demo booking
 */
export interface DemoBookingUpdateRequest {
  bookingId: string;                  // Required
  action: BookingActionType;
  newTimeSlot?: string;               // Required for reschedule action
  reason?: string;                    // Optional reason (max 500 chars)
  rating?: number;                    // Required for complete action (1-5)
  feedback?: string;                  // Optional for complete action (max 1000 chars)
  completionNotes?: string;           // Optional for complete action (max 1000 chars)
  rescheduleReason?: string;          // Specific reschedule reason
  cancellationReason?: string;        // Specific cancellation reason
  instructorNotes?: string;           // Instructor-specific notes
}

/**
 * Available time slot information
 */
export interface AvailableSlot {
  datetime: string;                   // ISO 8601 format
  time: string;                       // Time in HH:MM format
  display_time: string;               // Formatted display time (e.g., "2:30 PM")
  available: boolean;                 // Whether slot is available
  bookings_count: number;             // Number of existing bookings
  instructor_availability?: boolean;  // Whether instructor is available
  recommended?: boolean;              // Whether this is a recommended slot
}

/**
 * Pagination information for API responses
 */
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

/**
 * Query parameters for getting user bookings
 */
export interface GetBookingsQuery {
  userId?: string;
  status?: DemoBookingStatus;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  includeHistory?: boolean;
  includeInstructor?: boolean;
}

/**
 * Query parameters for getting available slots
 */
export interface AvailableSlotsQuery {
  date: string;                       // Required, YYYY-MM-DD format
  timezone?: string;                  // Optional, defaults to UTC
  demoType?: DemoType;               // Optional filter by demo type
  durationMinutes?: number;           // Optional, defaults to 60
  instructorId?: string;              // Optional, specific instructor
}

/**
 * Booking statistics summary
 */
export interface BookingStatsSummary {
  total_bookings: number;
  status_breakdown: Record<DemoBookingStatus, number>;
  demo_type_breakdown: Record<DemoType, number>;
  source_breakdown: Record<BookingSource, number>;
  experience_level_breakdown: Record<ExperienceLevel, number>;
  conversion_rate?: number;           // Percentage of completed bookings
  average_rating?: number;            // Average rating from completed bookings
  total_revenue?: number;             // Revenue generated from bookings
}

/**
 * Comprehensive booking statistics response
 */
export interface BookingStatsResponse {
  summary: BookingStatsSummary;
  recent_bookings: DemoBooking[];
  upcoming_bookings: DemoBooking[];
  period: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

/**
 * Analytics data point
 */
export interface AnalyticsDataPoint {
  date: string;
  value: number;
  label: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

/**
 * Booking analytics response
 */
export interface BookingAnalyticsResponse {
  timeframe: AnalyticsTimeframe;
  group_by: AnalyticsGroupBy;
  data_points: AnalyticsDataPoint[];
  total_bookings: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
  summary: {
    top_performing: AnalyticsDataPoint;
    lowest_performing: AnalyticsDataPoint;
    average_value: number;
  };
}

/**
 * Business hours configuration
 */
export interface BusinessHoursConfig {
  timezone: string;
  days: {
    [key: string]: {
      enabled: boolean;
      start_time: string;    // HH:MM format
      end_time: string;      // HH:MM format
      breaks?: Array<{
        start_time: string;
        end_time: string;
      }>;
    };
  };
  holidays: string[];       // Array of holiday dates in YYYY-MM-DD format
  minimum_advance_hours: number;
  maximum_advance_days: number;
}

/**
 * System configuration for demo bookings
 */
export interface DemoBookingSystemConfig {
  business_hours: BusinessHoursConfig;
  booking_limits: {
    max_concurrent_per_slot: number;
    max_bookings_per_user_per_hour: number;
    max_reschedules_allowed: number;
    cancellation_deadline_hours: number;
    reschedule_deadline_hours: number;
  };
  notification_settings: {
    send_confirmation_email: boolean;
    send_reminder_email: boolean;
    send_follow_up_email: boolean;
    reminder_hours_before: number[];
  };
  meeting_platforms: {
    default_platform: MeetingPlatform;
    available_platforms: MeetingPlatform[];
  };
  validation_rules: {
    min_full_name_length: number;
    max_full_name_length: number;
    max_requirements_length: number;
    max_notes_length: number;
    phone_number_required: boolean;
  };
}

/**
 * Validation result for booking requests
 */
export interface BookingValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Dashboard data for admin interface
 */
export interface DashboardData {
  summary: BookingStatsSummary;
  upcoming_bookings: DemoBooking[];
  recent_activity: Array<{
    id: string;
    type: 'booking_created' | 'booking_cancelled' | 'booking_completed' | 'booking_rescheduled';
    message: string;
    timestamp: Date;
    booking_id: string;
    user_name?: string;
  }>;
  metrics: {
    bookings_today: number;
    bookings_this_week: number;
    bookings_this_month: number;
    completion_rate: number;
    cancellation_rate: number;
    average_rating: number;
  };
  alerts?: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    action_required?: boolean;
  }>;
}

/**
 * Standard API response wrapper
 */
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

/**
 * Bulk update request for multiple bookings
 */
export interface BulkUpdateRequest {
  booking_ids: string[];
  action: BookingActionType;
  reason?: string;
  new_status?: DemoBookingStatus;
  instructor_id?: string;
  bulk_notes?: string;
}

/**
 * Bulk update response
 */
export interface BulkUpdateResponse {
  total_processed: number;
  successful_updates: number;
  failed_updates: number;
  results: Array<{
    booking_id: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Export request parameters
 */
export interface ExportRequest {
  format: ExportFormat;
  startDate?: string;
  endDate?: string;
  status?: DemoBookingStatus;
  includeHistory?: boolean;
  fields?: string[];                  // Specific fields to include
}

/**
 * Meeting link generation request
 */
export interface MeetingLinkRequest {
  platform: MeetingPlatform;
  duration_minutes?: number;
  password_protected?: boolean;
  waiting_room?: boolean;
  record_meeting?: boolean;
}

/**
 * Meeting link response
 */
export interface MeetingLinkResponse {
  meeting_link: string;
  meeting_id: string;
  password?: string;
  host_link?: string;
  platform: MeetingPlatform;
  expires_at?: Date;
}

// Re-export commonly used types for convenience
export type {
  DemoBooking as Booking,
  DemoBookingRequest as BookingRequest,
  DemoBookingUpdateRequest as BookingUpdateRequest,
  AvailableSlot as TimeSlot,
  BookingStatsSummary as StatsSummary,
  DemoBookingStatus as BookingStatus
}; 