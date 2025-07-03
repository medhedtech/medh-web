import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils, type IApiResponse } from './index';
import axios from 'axios';

/**
 * Batch type definitions
 */
export type TBatchStatus = 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
export type TBatchType = 'group' | 'individual'; // Added batch type for 1:1 classes

export interface IBatchSchedule {
  // Date-based format (required)
  date: string; // Format: "2024-01-15"
  title?: string; // Optional session title
  description?: string; // Optional session description
  
  // Common fields
  start_time: string;
  end_time: string;
}

export interface IBatchWithDetails {
  _id?: string;
  batch_name: string;
  batch_code?: string;
  course: string;
  status: TBatchStatus;
  batch_type?: TBatchType; // Added batch type field
  start_date: Date;
  end_date: Date;
  capacity: number;
  enrolled_students: number;
  assigned_instructor?: string;
  created_by: string;
  schedule?: IBatchSchedule[];
  batch_notes?: string;
  student_id?: string; // For individual batches, store the specific student ID
  course_details?: {
    _id: string;
    course_title: string;
    course_category: string;
    course_image?: string;
  };
  instructor_details?: {
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
  student_details?: {
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
    profile_image?: string;
  };
  available_spots: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBatchQueryParams {
  page?: number;
  limit?: number;
  status?: TBatchStatus;
  batch_type?: TBatchType;
  search?: string;
  course_id?: string;
  instructor_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  start_date_from?: string;
  start_date_to?: string;
}

export interface IBatchCreateInput {
  batch_name: string;
  batch_code?: string;
  course: string;
  status?: TBatchStatus;
  batch_type?: TBatchType; // Added batch type field
  start_date: Date;
  end_date: Date;
  capacity: number;
  assigned_instructor?: string;
  schedule?: IBatchSchedule[];
  batch_notes?: string;
  student_id?: string; // For individual batches
}

export interface IBatchUpdateInput extends Partial<IBatchCreateInput> {
  enrolled_students?: number;
}

export interface IBatchResponse {
  success: boolean;
  message: string;
  data: IBatchWithDetails;
}

export interface IBatchListResponse {
  success: boolean;
  message: string;
  data: IBatchWithDetails[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IBatchAnalytics {
  total_batches: number;
  active_batches: number;
  upcoming_batches: number;
  completed_batches: number;
  cancelled_batches: number;
  total_capacity: number;
  total_enrolled: number;
  overall_utilization: number;
  by_course: Array<{
    course_id: string;
    course_title: string;
    batch_count: number;
    total_capacity: number;
    total_enrolled: number;
    utilization: number;
  }>;
  by_instructor: Array<{
    instructor_id: string;
    instructor_name: string;
    batch_count: number;
    total_students: number;
  }>;
}

export interface IBatchAnalyticsDashboard {
  overview: {
    total_batches: number;
    active_batches: number;
    upcoming_batches: number;
    completed_batches: number;
    cancelled_batches: number;
    total_capacity: number;
    total_enrolled: number;
    overall_utilization: number;
    average_batch_size: number;
  };
  trends: {
    monthly_batch_creation: Array<{ month: string; count: number }>;
    enrollment_trends: Array<{ month: string; enrollments: number }>;
    capacity_trends: Array<{ month: string; utilization: number }>;
  };
  top_courses: Array<{
    course_id: string;
    course_title: string;
    batch_count: number;
    total_enrolled: number;
    avg_utilization: number;
  }>;
  instructor_performance: Array<{
    instructor_id: string;
    instructor_name: string;
    batch_count: number;
    total_students: number;
    avg_rating: number;
  }>;
}

export interface IBatchStatusDistribution {
  distribution: Array<{
    status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
    count: number;
    percentage: number;
    trend: number;
  }>;
  historical_trends: Array<{
    period: string;
    active: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  }>;
  by_course: Array<{
    course_id: string;
    course_title: string;
    status_breakdown: {
      active: number;
      upcoming: number;
      completed: number;
      cancelled: number;
    };
  }>;
}

export interface IInstructorWorkloadAnalytics {
  instructors: Array<{
    instructor_id: string;
    instructor_name: string;
    email: string;
    workload: {
      total_batches: number;
      active_batches: number;
      upcoming_batches: number;
      total_students: number;
      avg_batch_size: number;
      utilization_percentage: number;
      weekly_hours: number;
    };
    performance: {
      completion_rate: number;
      student_satisfaction: number;
      on_time_start_rate: number;
    };
    schedule_conflicts: Array<{
      batch_id: string;
      batch_name: string;
      conflict_type: 'time_overlap' | 'overload';
      severity: 'low' | 'medium' | 'high';
    }>;
  }>;
  summary: {
    total_instructors: number;
    avg_workload: number;
    overloaded_instructors: number;
    underutilized_instructors: number;
    optimal_instructors: number;
  };
}

export interface ICapacityAnalytics {
  overall: {
    total_capacity: number;
    total_enrolled: number;
    utilization_percentage: number;
    available_spots: number;
    overfull_batches: number;
    underfull_batches: number;
    optimal_batches: number;
  };
  by_course: Array<{
    course_id: string;
    course_title: string;
    total_capacity: number;
    total_enrolled: number;
    utilization_percentage: number;
    batch_count: number;
    avg_batch_utilization: number;
  }>;
  by_status: Array<{
    status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
    total_capacity: number;
    total_enrolled: number;
    utilization_percentage: number;
    batch_count: number;
  }>;
  utilization_distribution: Array<{
    range: string;
    batch_count: number;
    percentage_of_total: number;
  }>;
  trends: Array<{
    period: string;
    total_capacity: number;
    total_enrolled: number;
    utilization_percentage: number;
  }>;
}

export interface IBatchStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'completed' | 'dropped';
  progress?: {
    lessons_completed: number;
    total_lessons: number;
    percentage: number;
  };
}

export interface IBatchStudentEnrollmentInput {
  student_ids: string[];
  batch_id: string;
  enrollment_date?: string;
  notes?: string;
}

// Add new interface for individual batch creation
export interface IIndividualBatchCreateInput {
  student_id?: string; // NEW: Auto-enroll student (optional)
  instructor_id: string;
  course_id: string;
  batch_name: string; // Required according to docs
  batch_type: 'individual'; // Must be 'individual' for individual batches
  capacity: 1; // Must be exactly 1 for individual batches
  start_date: Date;
  end_date: Date;
  schedule: IBatchSchedule[];
  session_duration_minutes?: number;
  total_sessions?: number;
  batch_notes?: string;
  payment_plan?: 'full_payment' | 'installments';
  hourly_rate?: number;
}

// Types for Zoom meetings and recorded lessons
export interface IZoomMeetingInput {
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  agenda?: string;
  settings?: Record<string, any>;
}

export interface IZoomMeeting {
  meeting_id: string;
  join_url: string;
  topic: string;
  password: string;
  [key: string]: any;
}

export interface IRecordedLessonInput {
  title: string;
  url: string;
  recorded_date: string;
}

export interface IRecordedLesson {
  _id: string;
  title: string;
  url: string;
  recorded_date: string;
  created_by: string;
}

// Upload recorded lesson types
export interface IUploadRecordedLessonInput {
  base64String: string;
  title: string;
  recorded_date?: string;
  metadata?: {
    fileName: string;
    originalSize: number;
    encodedSize: number;
    mimeType: string;
    uploadedAt: string;
  };
  // NEW: Optional text file support for supplementary materials
  textFile?: {
    content: string;           // Text content (max 1MB)
    filename: string;          // Filename with extension (.txt, .md, .rtf, .doc, .docx)
    description?: string;      // Optional description of the text file
  };
}

export interface IUploadRecordedLessonResponse {
  success: boolean;
  status: 'uploading' | 'in_progress' | 'completed' | 'failed';
  message: string;
  data: {
    videoId: string;
    uploadStatus: string;
    batchId: string;
    sessionId: string;
    title: string;
    url?: string;
    processingJobId?: string;
    // NEW: Text file upload status
    hasTextFile?: boolean;
    textFileStatus?: 'uploading' | 'completed' | 'failed';
  };
}

/**
 * Helper function to convert time string (HH:MM) to minutes
 * @param timeString - Time in HH:MM format
 * @returns Time in minutes from midnight
 */
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Batch API utility functions
 */
export const batchUtils = {
  /**
   * Calculate batch utilization percentage
   * @param enrolled - Number of enrolled students
   * @param capacity - Total batch capacity
   * @returns Utilization percentage
   */
  calculateBatchUtilization: (enrolled: number, capacity: number): number => {
    if (capacity === 0) return 0;
    return Math.round((enrolled / capacity) * 100);
  },

  /**
   * Check if batch is full
   * @param enrolled - Number of enrolled students
   * @param capacity - Total batch capacity
   * @returns Boolean indicating if batch is full
   */
  isBatchFull: (enrolled: number, capacity: number): boolean => {
    return enrolled >= capacity;
  },

  /**
   * Get available spots in batch
   * @param enrolled - Number of enrolled students
   * @param capacity - Total batch capacity
   * @returns Number of available spots
   */
  getAvailableSpots: (enrolled: number, capacity: number): number => {
    return Math.max(0, capacity - enrolled);
  },

  /**
   * Format batch schedule for display
   * @param schedule - Array of batch schedules
   * @returns Formatted schedule string
   */
  formatSchedule: (schedule: IBatchSchedule[]): string => {
    if (!schedule || schedule.length === 0) return 'No schedule set';
    
    return schedule
      .map(s => {
        const displayDate = new Date(s.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        const title = s.title ? ` - ${s.title}` : '';
        return `${displayDate}: ${s.start_time} - ${s.end_time}${title}`;
      })
      .join(', ');
  },

  /**
   * Format schedule for calendar display
   * @param schedule - Array of batch schedules
   * @returns Array of formatted schedule entries for calendar
   */
  formatScheduleForCalendar: (schedule: IBatchSchedule[]): Array<{
    date: string;
    time: string;
    title: string;
    description?: string;
  }> => {
    if (!schedule || schedule.length === 0) return [];
    
    return schedule.map(s => ({
      date: s.date,
      time: `${s.start_time} - ${s.end_time}`,
      title: s.title || 'Session',
      description: s.description
    }));
  },

  /**
   * Convert dates to recurring schedule if needed
   * @param schedule - Date-based schedule array
   * @param startDate - Batch start date
   * @param endDate - Batch end date
   * @returns Extended schedule array with recurring dates
   */
  generateRecurringSchedule: (schedule: IBatchSchedule[], startDate: Date, endDate: Date): IBatchSchedule[] => {
    if (!schedule || schedule.length === 0) return [];
    
    // For now, just return the original schedule
    // In the future, this could be enhanced to generate recurring sessions
    return schedule.map(s => ({
      ...s,
      title: s.title || 'Session'
    }));
  },

  /**
   * Validate batch schedule entries (legacy support)
   * @param schedule - Array of schedule entries to validate
   * @returns Validation result with errors if any
   */
  validateBatchSchedule: (schedule: IBatchSchedule[]): { isValid: boolean; errors: string[] } => {
    // For backward compatibility, delegate to the enhanced validation
    return batchUtils.validateEnhancedBatchSchedule(schedule);
  },

  /**
   * Validate enhanced batch schedule entries
   * @param schedule - Array of schedule entries to validate
   * @returns Validation result with errors if any
   */
  validateEnhancedBatchSchedule: (schedule: IBatchSchedule[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!schedule || schedule.length === 0) {
      errors.push('At least one schedule entry is required');
      return { isValid: false, errors };
    }

    // Track dates to check for duplicates
    const dates = new Set<string>();

    schedule.forEach((entry, index) => {
      // Validate date field (required)
      if (!entry.date) {
        errors.push(`Date is required for schedule entry ${index + 1}`);
      } else {
        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(entry.date)) {
          errors.push(`Invalid date format for entry ${index + 1}. Use YYYY-MM-DD format`);
        } else {
          // Check for duplicate dates
          if (dates.has(entry.date)) {
            errors.push(`Duplicate date found: ${entry.date}`);
          }
          dates.add(entry.date);
          
          // Validate that date is not in the past
          const entryDate = new Date(entry.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (entryDate < today) {
            errors.push(`Date ${entry.date} is in the past`);
          }
        }
      }

      // Validate time fields
      if (!entry.start_time) {
        errors.push(`Start time is required for schedule entry ${index + 1}`);
      }

      if (!entry.end_time) {
        errors.push(`End time is required for schedule entry ${index + 1}`);
      }

      if (entry.start_time && entry.end_time) {
        // Convert time strings to minutes for comparison
        const startMinutes = timeToMinutes(entry.start_time);
        const endMinutes = timeToMinutes(entry.end_time);

        if (startMinutes >= endMinutes) {
          errors.push(`End time must be after start time for ${entry.date || `entry ${index + 1}`}`);
        }

        // Check for reasonable duration (at least 30 minutes, max 8 hours)
        const durationMinutes = endMinutes - startMinutes;
        if (durationMinutes < 30) {
          errors.push(`Session duration for ${entry.date || `entry ${index + 1}`} is too short (minimum 30 minutes)`);
        }
        if (durationMinutes > 480) { // 8 hours
          errors.push(`Session duration for ${entry.date || `entry ${index + 1}`} is too long (maximum 8 hours)`);
        }
      }

      // Validate optional title length
      if (entry.title && entry.title.length > 100) {
        errors.push(`Title for entry ${index + 1} is too long (maximum 100 characters)`);
      }

      // Validate optional description length
      if (entry.description && entry.description.length > 500) {
        errors.push(`Description for entry ${index + 1} is too long (maximum 500 characters)`);
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Get batch status color class
   * @param status - Batch status
   * @returns CSS class string for status styling
   */
  getStatusColorClass: (status: TBatchStatus): string => {
    const statusColors: Record<TBatchStatus, string> = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Completed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return statusColors[status] || statusColors['Active'];
  },

  /**
   * Validate batch dates
   * @param startDate - Batch start date
   * @param endDate - Batch end date
   * @returns Boolean indicating if dates are valid
   */
  validateBatchDates: (startDate: Date, endDate: Date): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    return start < end && start >= now;
  },

  /**
   * Get batch duration in days
   * @param startDate - Batch start date
   * @param endDate - Batch end date
   * @returns Duration in days
   */
  getBatchDuration: (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Generate batch name for individual batch
   * @param studentName - Student's full name
   * @param courseName - Course name
   * @param instructorName - Instructor's name (optional)
   * @returns Generated batch name
   */
  generateIndividualBatchName: (studentName: string, courseName: string, instructorName?: string): string => {
    const sanitizedStudentName = studentName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const sanitizedCourseName = courseName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    
    if (instructorName) {
      const sanitizedInstructorName = instructorName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      return `${sanitizedStudentName} - ${sanitizedCourseName} (1:1 with ${sanitizedInstructorName})`;
    }
    
    return `${sanitizedStudentName} - ${sanitizedCourseName} (Individual Class)`;
  },

  /**
   * Generate unique batch code for individual batch
   * @param studentId - Student ID
   * @param courseId - Course ID
   * @returns Generated batch code
   */
  generateIndividualBatchCode: (studentId: string, courseId: string): string => {
    const timestamp = Date.now().toString().slice(-6);
    const studentIdShort = studentId.slice(-4);
    const courseIdShort = courseId.slice(-4);
    return `IND-${studentIdShort}-${courseIdShort}-${timestamp}`;
  },

  /**
   * Validate individual batch data
   * @param data - Individual batch creation data
   * @returns Validation result
   */
  validateIndividualBatchData: (data: IIndividualBatchCreateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required fields validation
    if (!data.student_id) errors.push('Student ID is required');
    if (!data.instructor_id) errors.push('Instructor ID is required');
    if (!data.course_id) errors.push('Course ID is required');
    if (!data.start_date) errors.push('Start date is required');
    if (!data.end_date) errors.push('End date is required');

    // Date validation
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const now = new Date();

      if (start >= end) {
        errors.push('End date must be after start date');
      }

      if (start < now) {
        errors.push('Start date must be in the future');
      }
    }

    // Schedule validation
    if (data.schedule) {
      const scheduleValidation = batchUtils.validateBatchSchedule(data.schedule);
      if (!scheduleValidation.isValid) {
        errors.push(...scheduleValidation.errors);
      }
    } else {
      errors.push('Schedule is required for individual batches');
    }

    // Session validation
    if (data.session_duration_minutes && (data.session_duration_minutes < 30 || data.session_duration_minutes > 480)) {
      errors.push('Session duration must be between 30 minutes and 8 hours');
    }

    if (data.total_sessions && data.total_sessions < 1) {
      errors.push('Total sessions must be at least 1');
    }

    if (data.hourly_rate && data.hourly_rate < 0) {
      errors.push('Hourly rate cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Check if batch is individual type
   * @param batch - Batch data
   * @returns Boolean indicating if batch is individual
   */
  isIndividualBatch: (batch: IBatchWithDetails): boolean => {
    return batch.batch_type === 'individual' || batch.capacity === 1;
  },

  /**
   * Calculate individual batch pricing
   * @param hourlyRate - Hourly rate for instructor
   * @param sessionDurationMinutes - Duration per session in minutes
   * @param totalSessions - Total number of sessions
   * @returns Calculated pricing information
   */
  calculateIndividualBatchPricing: (
    hourlyRate: number, 
    sessionDurationMinutes: number, 
    totalSessions: number
  ): {
    pricePerSession: number;
    totalPrice: number;
    totalHours: number;
  } => {
    const hoursPerSession = sessionDurationMinutes / 60;
    const pricePerSession = hourlyRate * hoursPerSession;
    const totalPrice = pricePerSession * totalSessions;
    const totalHours = hoursPerSession * totalSessions;

    return {
      pricePerSession: Math.round(pricePerSession * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      totalHours: Math.round(totalHours * 100) / 100
    };
  }
};

/**
 * Batch API service
 */
export const batchAPI = {
  /**
   * Get all batches with optional filtering
   * @param params - Query parameters for filtering
   * @returns Promise with batch list response
   */
  getAllBatches: async (params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches${queryString}`
    );
  },

  /**
   * Get recorded lessons for a specific session in a batch
   * @param batchId - Batch ID
   * @param sessionId - Session ID
   * @returns Promise with recorded lessons response
   */
  getRecordedLessons: async (batchId: string, sessionId: string): Promise<IApiResponse<IRecordedLesson[]>> => {
    if (!batchId) throw new Error('Batch ID is required');
    if (!sessionId) throw new Error('Session ID is required');
    return apiClient.get<IRecordedLesson[]>(
      `${apiBaseUrl}/batches/${batchId}/schedule/${sessionId}/recorded-lessons`
    );
  },

  /**
   * Get batches by course ID
   * @param courseId - Course ID
   * @param params - Additional query parameters
   * @returns Promise with batch list response
   */
  getBatchesByCourse: async (courseId: string, params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    if (!courseId) throw new Error('Course ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/course/${courseId}${queryString}`
    );
  },

  /**
   * Get batches by instructor ID
   * @param instructorId - Instructor ID
   * @param params - Additional query parameters
   * @returns Promise with batch list response
   */
  getBatchesByInstructor: async (instructorId: string, params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    if (!instructorId) throw new Error('Instructor ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/instructor/${instructorId}${queryString}`
    );
  },

  /**
   * Get a single batch by ID
   * @param batchId - Batch ID
   * @returns Promise with batch response
   */
  getBatchById: async (batchId: string): Promise<IApiResponse<IBatchResponse>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.get<IBatchResponse>(
      `${apiBaseUrl}/batches/${batchId}`
    );
  },

  // Add a new scheduled session to a batch
  addScheduledSession: async (
    batchId: string,
    scheduleData: IBatchSchedule
  ): Promise<IApiResponse<{ success: boolean; data: IBatchSchedule & { _id: string; recorded_lessons: IRecordedLesson[]; zoom_meeting: IZoomMeeting } }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.post(
      `${apiBaseUrl}/batches/${batchId}/schedule`,
      scheduleData
    );
  },

  // Create a Zoom meeting for a specific session
  createZoomMeetingForSession: async (
    batchId: string,
    sessionId: string,
    meetingData: IZoomMeetingInput
  ): Promise<IApiResponse<{ success: boolean; data: IZoomMeeting }>> => {
    if (!batchId || !sessionId) throw new Error('Batch ID and Session ID are required');
    return apiClient.post(
      `${apiBaseUrl}/batches/${batchId}/schedule/${sessionId}/zoom-meeting`,
      meetingData
    );
  },

  // Add a recorded lesson to a specific session
  addRecordedLesson: async (
    batchId: string,
    sessionId: string,
    lessonData: IRecordedLessonInput
  ): Promise<IApiResponse<{ success: boolean; data: IRecordedLesson[] }>> => {
    if (!batchId || !sessionId) throw new Error('Batch ID and Session ID are required');
    return apiClient.post(
      `${apiBaseUrl}/batches/${batchId}/schedule/${sessionId}/recorded-lessons`,
      lessonData
    );
  },

  /**
   * Create a new batch
   * @param batchData - Batch data to create
   * @returns Promise with created batch response
   */
  createBatch: async (batchData: IBatchCreateInput): Promise<IApiResponse<IBatchResponse>> => {
    if (!batchData.course) throw new Error('Course ID is required');
    return apiClient.post<IBatchResponse>(
      `${apiBaseUrl}/batches/courses/${batchData.course}/batches`,
      batchData
    );
  },

  /**
   * Update an existing batch
   * @param batchId - Batch ID to update
   * @param batchData - Updated batch data
   * @returns Promise with updated batch response
   */
  updateBatch: async (batchId: string, batchData: IBatchUpdateInput): Promise<IApiResponse<IBatchResponse>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.put<IBatchResponse>(
      `${apiBaseUrl}/batches/${batchId}`,
      batchData
    );
  },

  /**
   * Delete a batch
   * @param batchId - Batch ID to delete
   * @returns Promise with deletion response
   */
  deleteBatch: async (batchId: string): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.delete(
      `${apiBaseUrl}/batches/${batchId}`
    );
  },

  /**
   * Get batch analytics
   * @param courseId - Optional course ID for filtering
   * @returns Promise with batch analytics
   */
  getBatchAnalytics: async (courseId?: string): Promise<IApiResponse<{ success: boolean; data: IBatchAnalytics }>> => {
    const params = courseId ? { course_id: courseId } : {};
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<{ success: boolean; data: IBatchAnalytics }>(
      `${apiBaseUrl}/batches/analytics${queryString}`
    );
  },

  /**
   * Get comprehensive batch analytics dashboard
   * @param params - Optional query parameters for filtering
   * @returns Promise with dashboard analytics
   */
  getBatchAnalyticsDashboard: async (params: {
    courseId?: string;
    instructorId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<IApiResponse<{
    success: boolean;
    data: IBatchAnalyticsDashboard;
  }>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/batches/analytics/dashboard${queryString}`
    );
  },

  
  /**
   * Get batch status distribution analytics
   * @param params - Optional query parameters for filtering
   * @returns Promise with status distribution data
   */
  getBatchStatusDistribution: async (params: {
    courseId?: string;
    instructorId?: string;
    timeframe?: 'week' | 'month' | 'quarter' | 'year';
  } = {}): Promise<IApiResponse<{
    success: boolean;
    data: IBatchStatusDistribution;
  }>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/batches/analytics/status-distribution${queryString}`
    );
  },

  /**
   * Get instructor workload analytics
   * @param params - Optional query parameters for filtering
   * @returns Promise with instructor workload data
   */
  getInstructorWorkloadAnalytics: async (params: {
    instructorId?: string;
    courseId?: string;
    timeframe?: 'current' | 'upcoming' | 'all';
  } = {}): Promise<IApiResponse<{
    success: boolean;
    data: IInstructorWorkloadAnalytics;
  }>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/batches/analytics/instructor-workload${queryString}`
    );
  },

  /**
   * Get capacity utilization analytics
   * @param params - Optional query parameters for filtering
   * @returns Promise with capacity analytics data
   */
  getCapacityAnalytics: async (params: {
    courseId?: string;
    instructorId?: string;
    status?: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
    timeframe?: 'week' | 'month' | 'quarter' | 'year';
  } = {}): Promise<IApiResponse<{
    success: boolean;
    data: ICapacityAnalytics;
  }>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/batches/analytics/capacity${queryString}`
    );
  },

  /**
   * Get students in a batch
   * @param batchId - Batch ID
   * @param params - Query parameters
   * @returns Promise with batch students
   */
  getBatchByStudent: async (batchId: string, params: { page?: number; limit?: number; search?: string } = {}): Promise<IApiResponse<{
    success: boolean;
    data: IBatchStudent[];
    pagination?: { page: number; limit: number; total: number; totalPages: number };
  }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/batches/${batchId}/students${queryString}`
    );
  },

  /**
   * Enroll students in a batch
   * @param enrollmentData - Student enrollment data
   * @returns Promise with enrollment response
   */
  enrollStudents: async (enrollmentData: IBatchStudentEnrollmentInput): Promise<IApiResponse<{
    success: boolean;
    message: string;
    data: { enrolled_count: number; failed_count: number; details: any[] };
  }>> => {
    return apiClient.post(
      `${apiBaseUrl}/batches/enroll-students`,
      enrollmentData
    );
  },

  /**
   * Remove student from batch
   * @param batchId - Batch ID
   * @param studentId - Student ID
   * @returns Promise with removal response
   */
  removeStudent: async (batchId: string, studentId: string): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    if (!studentId) throw new Error('Student ID is required');
    return apiClient.delete(
      `${apiBaseUrl}/batches/${batchId}/students/${studentId}`
    );
  },

  /**
   * Update student status in batch
   * @param batchId - Batch ID
   * @param studentId - Student ID
   * @param status - New status
   * @returns Promise with status update response
   */
  updateStudentStatus: async (
    batchId: string, 
    studentId: string, 
    status: 'active' | 'inactive' | 'completed' | 'dropped'
  ): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    if (!studentId) throw new Error('Student ID is required');
    return apiClient.patch(
      `${apiBaseUrl}/batches/${batchId}/students/${studentId}/status`,
      { status }
    );
  },

  /**
   * Clone a batch
   * @param batchId - Source batch ID
   * @param cloneData - Clone configuration
   * @returns Promise with cloned batch response
   */
  cloneBatch: async (batchId: string, cloneData: {
    batch_name: string;
    batch_code?: string;
    start_date: Date;
    end_date: Date;
    copy_students?: boolean;
  }): Promise<IApiResponse<IBatchResponse>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.post<IBatchResponse>(
      `${apiBaseUrl}/batches/${batchId}/clone`,
      cloneData
    );
  },

  /**
   * Archive/Unarchive a batch
   * @param batchId - Batch ID
   * @param archive - Whether to archive or unarchive
   * @returns Promise with archive response
   */
  toggleArchive: async (batchId: string, archive: boolean = true): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.patch(
      `${apiBaseUrl}/batches/${batchId}/archive`,
      { archive }
    );
  },

  /**
   * Get batch schedule conflicts
   * @param scheduleData - Schedule to check for conflicts
   * @returns Promise with conflict check response
   */
  checkScheduleConflicts: async (scheduleData: {
    instructor_id?: string;
    schedule: IBatchSchedule[];
    start_date: Date;
    end_date: Date;
    exclude_batch_id?: string;
  }): Promise<IApiResponse<{
    success: boolean;
    data: {
      has_conflicts: boolean;
      conflicts: Array<{
        batch_id: string;
        batch_name: string;
        conflicting_schedule: IBatchSchedule;
      }>;
    };
  }>> => {
    return apiClient.post(
      `${apiBaseUrl}/batches/check-conflicts`,
      scheduleData
    );
  },

  // Update batch status
  updateBatchStatus: async (
    batchId: string, 
    status: TBatchStatus
  ): Promise<IApiResponse<{ batch: IBatchWithDetails; message: string }>> => {
    if (!batchId) throw new Error('Batch ID is required');
    return apiClient.put<{ batch: IBatchWithDetails; message: string }>(
      `${apiBaseUrl}/batches/${batchId}/status`,
      { status }
    );
  },

  /**
   * Create individual batch (1:1) with optional student auto-enrollment
   * @param individualBatchData - Individual batch creation data
   * @returns Promise with created individual batch response
   */
  createIndividualBatch: async (individualBatchData: IIndividualBatchCreateInput): Promise<IApiResponse<{
    success: boolean;
    message: string;
    data: {
      batch: IBatchWithDetails;
      enrollment?: {
        _id: string;
        student: string;
        course: string;
        batch: string;
        enrollment_type: string;
        status: string;
        pricing_snapshot: {
          original_price: number;
          final_price: number;
          currency: string;
          pricing_type: string;
        };
      };
    };
  }>> => {
    try {
      // Validate individual batch requirements
      if (individualBatchData.batch_type !== 'individual') {
        throw new Error('Batch type must be "individual" for individual batches');
      }
      
      if (individualBatchData.capacity !== 1) {
        throw new Error('Individual batch type can only have capacity of 1');
      }

      // Ensure we have a course_id
      if (!individualBatchData.course_id) {
        throw new Error('Course ID is required for individual batch creation');
      }

      // Prepare the payload according to the API specification
      const payload = {
        batch_name: individualBatchData.batch_name, // Required
        batch_type: 'individual', // Required
        capacity: 1, // Required - must be exactly 1
        start_date: individualBatchData.start_date.toISOString(),
        end_date: individualBatchData.end_date.toISOString(),
        assigned_instructor: individualBatchData.instructor_id, // Required
        schedule: individualBatchData.schedule, // Required
        ...(individualBatchData.student_id && { student_id: individualBatchData.student_id }), // NEW: Auto-enroll student
        ...(individualBatchData.batch_notes && { batch_notes: individualBatchData.batch_notes }),
        ...(individualBatchData.session_duration_minutes && { session_duration_minutes: individualBatchData.session_duration_minutes }),
        ...(individualBatchData.total_sessions && { total_sessions: individualBatchData.total_sessions }),
        ...(individualBatchData.payment_plan && { payment_plan: individualBatchData.payment_plan }),
        ...(individualBatchData.hourly_rate && { hourly_rate: individualBatchData.hourly_rate })
      };

      // Use the proper API endpoint: POST /api/courses/:courseId/batches
      const response = await apiClient.post(
        `${apiBaseUrl}/batches/courses/${individualBatchData.course_id}/batches`,
        payload
      );
      
      return response;
    } catch (error: any) {
      console.error('Error creating individual batch:', error);
      
      // Handle specific validation errors
      if (error.message.includes('capacity')) {
        throw new Error('Individual batch type can only have capacity of 1');
      }
      
      if (error.message.includes('batch_type')) {
        throw new Error('Batch type must be "individual" for individual batches');
      }
      
      if (error.message.includes('course_id') || error.message.includes('Course ID')) {
        throw new Error('Course ID is required for individual batch creation');
      }
      
      // Re-throw with original message for API errors
      throw error;
    }
  },

  /**
   * Get all individual batches
   * @param params - Query parameters for filtering
   * @returns Promise with individual batch list response
   */
  getIndividualBatches: async (params: IBatchQueryParams & {
    student_id?: string;
    include_pricing?: boolean;
  } = {}): Promise<IApiResponse<IBatchListResponse>> => {
    const queryString = apiUtils.buildQueryString({
      ...params,
      batch_type: 'individual'
    });
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/individual${queryString}`
    );
  },

  /**
   * Get individual batches by student ID
   * @param studentId - Student ID
   * @param params - Additional query parameters
   * @returns Promise with student's individual batch list
   */
  getIndividualBatchesByStudent: async (studentId: string, params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    if (!studentId) throw new Error('Student ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/individual/student/${studentId}${queryString}`
    );
  },

  /**
   * Get individual batches by instructor ID
   * @param instructorId - Instructor ID
   * @param params - Additional query parameters
   * @returns Promise with instructor's individual batch list
   */
  getIndividualBatchesByInstructor: async (instructorId: string, params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    if (!instructorId) throw new Error('Instructor ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/individual/instructor/${instructorId}${queryString}`
    );
  },
  /**
   * Get recorded lessons for a student
   * @param studentId - Student ID
   * @param params - Additional query parameters
   * @returns Promise with student's recorded lessons
   */
  getStudentRecordedLessons: async (studentId: string, params: IBatchQueryParams = {}): Promise<IApiResponse<IBatchListResponse>> => {
    if (!studentId) throw new Error('Student ID is required');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IBatchListResponse>(
      `${apiBaseUrl}/batches/students/${studentId}/recorded-lessons${queryString}`
    );
  },
  /**
   * Get upcoming sessions for a student
   * @param studentId - Student ID
   * @param params - Query parameters including limit and days_ahead
   * @returns Promise with student's upcoming sessions
   */
  getStudentUpcomingSessions: async (studentId: string, params: {
    limit?: number;
    days_ahead?: number;
  } = {}): Promise<IApiResponse<{
    success: boolean;
    count: number;
    total_upcoming: number;
    active_batches: number;
    upcoming_batches: number;
    total_batches: number;
    days_ahead: number;
    search_period: {
      from: string;
      to: string;
    };
    student: {
      id: string;
      name: string;
      email: string;
    };
    data: Array<{
      session_id: string;
      session_date: string;
      session_end_date: string;
      date: string;
      start_time: string;
      end_time: string;
      title: string;
      description: string;
      batch: {
        id: string;
        name: string;
        code: string;
        status: string;
        start_date: string;
        end_date: string;
      };
      course: {
        id: string;
        title: string;
      };
      instructor: {
        _id: string;
        full_name: string;
        email: string;
      };
      has_recorded_lessons: boolean;
      enrollment_status: string;
      is_upcoming: boolean;
      zoom_meeting?: {
        id: string;
        join_url: string;
        password?: string;
      };
    }>;
  }>> => {
    if (!studentId) throw new Error('Student ID is required');
    
    const queryString = apiUtils.buildQueryString({
      limit: params.limit || 20,
      days_ahead: params.days_ahead || 7
    });

    return apiClient.get(
      `${apiBaseUrl}/batches/students/${studentId}/upcoming-sessions${queryString}`
    );
  },

  
  /**
   * Update individual batch schedule
   * @param batchId - Batch ID
   * @param scheduleData - New schedule data
   * @returns Promise with updated batch response
   */
  updateIndividualBatchSchedule: async (batchId: string, scheduleData: {
    schedule: IBatchSchedule[];
    reschedule_reason?: string;
    notify_student?: boolean;
    notify_instructor?: boolean;
  }): Promise<IApiResponse<IBatchResponse>> => {
    if (!batchId) throw new Error('Batch ID is required');
    
    // Validate schedule
    const validation = batchUtils.validateBatchSchedule(scheduleData.schedule);
    if (!validation.isValid) {
      throw new Error(`Schedule validation failed: ${validation.errors.join(', ')}`);
    }

    return apiClient.put<IBatchResponse>(
      `${apiBaseUrl}/batches/individual/${batchId}/schedule`,
      scheduleData
    );
  },

  /**
   * Convert group batch to individual batches
   * @param groupBatchId - Group batch ID to convert
   * @param conversionData - Conversion configuration
   * @returns Promise with conversion result
   */
  convertGroupToIndividualBatches: async (groupBatchId: string, conversionData: {
    maintain_schedule?: boolean;
    redistribute_sessions?: boolean;
    new_instructor_assignments?: Array<{
      student_id: string;
      instructor_id: string;
    }>;
    conversion_reason?: string;
  }): Promise<IApiResponse<{
    success: boolean;
    message: string;
    data: {
      original_batch: IBatchWithDetails;
      individual_batches: IBatchWithDetails[];
      conversion_summary: {
        students_converted: number;
        total_individual_batches: number;
        failed_conversions: Array<{
          student_id: string;
          reason: string;
        }>;
      };
    };
  }>> => {
    if (!groupBatchId) throw new Error('Group batch ID is required');
    return apiClient.post(
      `${apiBaseUrl}/batches/${groupBatchId}/convert-to-individual`,
      conversionData
    );
  },

  /**
   * Get individual batch pricing calculation
   * @param pricingData - Pricing calculation parameters
   * @returns Promise with pricing calculation
   */
  calculateIndividualBatchPrice: async (pricingData: {
    instructor_id: string;
    course_id: string;
    session_duration_minutes: number;
    total_sessions: number;
    custom_hourly_rate?: number;
  }): Promise<IApiResponse<{
    success: boolean;
    data: {
      pricing: {
        pricePerSession: number;
        totalPrice: number;
        totalHours: number;
        currency: string;
        hourlyRate: number;
      };
      instructor_info: {
        name: string;
        hourly_rate: number;
        availability: boolean;
      };
      course_info: {
        title: string;
        category: string;
        base_price?: number;
      };
    };
  }>> => {
    return apiClient.post(
      `${apiBaseUrl}/batches/individual/calculate-pricing`,
      pricingData
    );
  },

  /**
   * Check instructor availability for individual batch
   * @param availabilityData - Availability check parameters
   * @returns Promise with availability result
   */
  checkInstructorAvailabilityForIndividual: async (availabilityData: {
    instructor_id: string;
    proposed_schedule: IBatchSchedule[];
    start_date: Date;
    end_date: Date;
    exclude_batch_id?: string;
  }): Promise<IApiResponse<{
    success: boolean;
    data: {
      is_available: boolean;
      conflicts: Array<{
        batch_id: string;
        batch_name: string;
        conflict_schedule: IBatchSchedule;
        conflict_type: 'time_overlap' | 'back_to_back' | 'overload';
      }>;
      suggestions: Array<{
        alternative_schedule: IBatchSchedule[];
        confidence_score: number;
      }>;
    };
  }>> => {
    return apiClient.post(
      `${apiBaseUrl}/batches/individual/check-instructor-availability`,
      availabilityData
    );
  },

  // Upload and add a recorded lesson to a specific session with base64 video
  uploadAndAddRecordedLesson: async (
    batchId: string,
    sessionId: string,
    uploadData: IUploadRecordedLessonInput
  ): Promise<IApiResponse<IUploadRecordedLessonResponse>> => {
    if (!batchId || !sessionId) throw new Error('Batch ID and Session ID are required');
    if (!uploadData.base64String) throw new Error('Base64 video data is required');
    if (!uploadData.title) throw new Error('Video title is required');
    
    return apiClient.post(
      `${apiBaseUrl}/batches/${batchId}/schedule/${sessionId}/upload-recorded-lesson`,
      {
        ...uploadData,
        recorded_date: uploadData.recorded_date || new Date().toISOString()
      }
    );
  },
};

// Export the batch API as default
export default batchAPI;
