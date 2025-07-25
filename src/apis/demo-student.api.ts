import { ApiClient } from './apiClient';
import { IApiResponse } from './apiClient';

// Initialize API client
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.medh.in',
});

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

export type TDemoStudentStatus = 'active' | 'inactive' | 'completed' | 'expired' | 'cancelled';
export type TDemoStudentSource = 'admin_created' | 'instructor_created' | 'self_registered' | 'bulk_import';
export type TDemoClassType = 'individual' | 'group' | 'webinar';

export interface IDemoStudentPersonalInfo {
  full_name: string;
  email: string;
  phone_numbers: Array<{
    country: string;
    number: string;
  }>;
  age?: number;
  age_group?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: {
    country?: string;
    state?: string;
    city?: string;
    timezone?: string;
  };
}

export interface IDemoStudentEducationInfo {
  education_level?: 'high_school' | 'undergraduate' | 'graduate' | 'postgraduate' | 'professional' | 'other';
  institution_name?: string;
  field_of_study?: string;
  graduation_year?: number;
  current_occupation?: string;
  work_experience_years?: number;
  skills?: string[];
  interests?: string[];
}

export interface IDemoStudentPreferences {
  preferred_course_categories?: string[];
  preferred_schedule?: {
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    time_slots: ('morning' | 'afternoon' | 'evening' | 'night')[];
    timezone?: string;
  };
  learning_goals?: string[];
  budget_range?: {
    min: number;
    max: number;
    currency: string;
  };
  demo_class_type?: TDemoClassType;
  special_requirements?: string;
}

export interface IDemoStudentMeta {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referral_code?: string;
  marketing_consent?: boolean;
  newsletter_subscription?: boolean;
  sms_consent?: boolean;
  data_processing_consent: boolean;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
}

// Demo Session Type
export interface IDemoSession {
  _id: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  course_category?: string;
  course_title?: string;
  session_type: TDemoClassType;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: {
    rating: number;
    comment: string;
    submitted_at: string;
  };
  attendance?: {
    joined_at?: string;
    left_at?: string;
    duration_minutes?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface IDemoStudent {
  _id: string;
  demo_student_id: string;
  personal_info: IDemoStudentPersonalInfo;
  education_info?: IDemoStudentEducationInfo;
  preferences?: IDemoStudentPreferences;
  meta?: IDemoStudentMeta;
  status: TDemoStudentStatus;
  source: TDemoStudentSource;
  created_by?: {
    _id: string;
    full_name: string;
    email: string;
    role: string[];
  };
  assigned_instructor?: {
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
  demo_sessions?: IDemoSession[];
  conversion_tracking?: {
    demo_completed: boolean;
    enrolled_in_course: boolean;
    enrollment_date?: string;
    enrolled_course_id?: string;
    conversion_value?: number;
    conversion_currency?: string;
  };
  communication_log?: Array<{
    _id: string;
    type: 'email' | 'sms' | 'call' | 'whatsapp' | 'in_app';
    subject?: string;
    message: string;
    sent_by: string;
    sent_at: string;
    delivery_status: 'sent' | 'delivered' | 'read' | 'failed';
    response?: string;
    response_at?: string;
  }>;
  notes?: Array<{
    _id: string;
    note: string;
    added_by: string;
    added_at: string;
    is_private: boolean;
    tags?: string[];
  }>;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  last_activity_at?: string;
}

export interface IDemoStudentCreateInput {
  personal_info: IDemoStudentPersonalInfo;
  education_info?: IDemoStudentEducationInfo;
  preferences?: IDemoStudentPreferences;
  meta?: IDemoStudentMeta;
  assigned_instructor_id?: string;
  demo_session?: {
    session_date: string;
    session_time: string;
    duration_minutes?: number;
    course_category?: string;
    course_title?: string;
    session_type?: TDemoClassType;
  };
  source?: TDemoStudentSource;
  expires_in_days?: number;
  send_welcome_email?: boolean;
  send_sms_notification?: boolean;
}

export interface IDemoStudentUpdateInput extends Partial<IDemoStudentCreateInput> {
  status?: TDemoStudentStatus;
  assigned_instructor_id?: string;
}

export interface IDemoStudentQueryParams {
  page?: number;
  limit?: number;
  status?: TDemoStudentStatus;
  source?: TDemoStudentSource;
  assigned_instructor_id?: string;
  created_by?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  age_group?: string;
  education_level?: string;
  location_country?: string;
  location_state?: string;
  course_category?: string;
  conversion_status?: 'converted' | 'not_converted' | 'pending';
  sort_by?: 'created_at' | 'last_activity_at' | 'demo_session_date' | 'full_name' | 'email';
  sort_order?: 'asc' | 'desc';
  include_expired?: boolean;
  include_deleted?: boolean;
}

export interface IDemoStudentListResponse {
  success: boolean;
  message: string;
  data: {
    demo_students: IDemoStudent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      total_count: number;
      active_count: number;
      completed_count: number;
      expired_count: number;
      conversion_rate: number;
    };
  };
}

export interface IDemoStudentResponse {
  success: boolean;
  message: string;
  data: {
    demo_student: IDemoStudent;
  };
}

export interface IDemoSessionScheduleInput {
  demo_student_id: string;
  session_date: string;
  session_time: string;
  duration_minutes?: number;
  course_category?: string;
  course_title?: string;
  session_type?: TDemoClassType;
  instructor_id?: string;
  meeting_platform?: 'zoom' | 'google_meet' | 'teams' | 'custom';
  send_calendar_invite?: boolean;
  send_reminder_email?: boolean;
  send_reminder_sms?: boolean;
}

export interface IDemoSessionUpdateInput {
  session_date?: string;
  session_time?: string;
  duration_minutes?: number;
  course_category?: string;
  course_title?: string;
  session_type?: TDemoClassType;
  instructor_id?: string;
  meeting_link?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  reschedule_reason?: string;
  cancellation_reason?: string;
}

export interface IDemoSessionFeedbackInput {
  instructor_rating?: number;
  content_rating?: number;
  overall_satisfaction?: number;
  comments?: string;
  would_recommend?: boolean;
  areas_for_improvement?: string[];
  follow_up_interest?: boolean;
  preferred_course_format?: 'individual' | 'group' | 'self_paced' | 'hybrid';
}

export interface IDemoStudentAnalytics {
  overview: {
    total_demo_students: number;
    active_demo_students: number;
    completed_demo_sessions: number;
    conversion_rate: number;
    average_session_duration: number;
    total_revenue_generated: number;
  };
  trends: {
    registrations_by_month: Array<{
      month: string;
      count: number;
      conversion_rate: number;
    }>;
    conversion_funnel: {
      registered: number;
      demo_scheduled: number;
      demo_completed: number;
      enrolled: number;
      conversion_rates: {
        schedule_rate: number;
        completion_rate: number;
        enrollment_rate: number;
      };
    };
  };
  demographics: {
    by_age_group: Array<{
      age_group: string;
      count: number;
      percentage: number;
      conversion_rate: number;
    }>;
    by_location: Array<{
      country: string;
      count: number;
      percentage: number;
      conversion_rate: number;
    }>;
    by_education_level: Array<{
      education_level: string;
      count: number;
      percentage: number;
      conversion_rate: number;
    }>;
  };
  performance: {
    top_instructors: Array<{
      instructor_id: string;
      instructor_name: string;
      demo_sessions_conducted: number;
      average_rating: number;
      conversion_rate: number;
      total_revenue_generated: number;
    }>;
    popular_course_categories: Array<{
      category: string;
      demo_requests: number;
      completion_rate: number;
      conversion_rate: number;
    }>;
  };
  communication: {
    email_metrics: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
    };
    sms_metrics: {
      sent: number;
      delivered: number;
      failed: number;
    };
  };
}

export interface IBulkDemoStudentCreateInput {
  demo_students: IDemoStudentCreateInput[];
  default_instructor_id?: string;
  default_session_settings?: {
    duration_minutes: number;
    session_type: TDemoClassType;
    auto_schedule: boolean;
    schedule_within_days: number;
  };
  notification_settings?: {
    send_welcome_emails: boolean;
    send_sms_notifications: boolean;
    batch_size: number;
  };
}

export interface IBulkDemoStudentResponse {
  success: boolean;
  message: string;
  data: {
    created_count: number;
    failed_count: number;
    created_demo_students: IDemoStudent[];
    failed_entries: Array<{
      index: number;
      data: IDemoStudentCreateInput;
      error: string;
    }>;
    summary: {
      total_processed: number;
      success_rate: number;
      processing_time_ms: number;
    };
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Create a new demo student
 */
export const createDemoStudent = async (
  data: IDemoStudentCreateInput
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.post('/demo-students', data);
};

/**
 * Get all demo students with filtering and pagination
 */
export const getAllDemoStudents = async (
  params: IDemoStudentQueryParams = {}
): Promise<IApiResponse<IDemoStudentListResponse>> => {
  return apiClient.get('/demo-students', params);
};

/**
 * Get demo student by ID
 */
export const getDemoStudentById = async (
  id: string
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.get(`/demo-students/${id}`);
};

/**
 * Update demo student
 */
export const updateDemoStudent = async (
  id: string,
  data: IDemoStudentUpdateInput
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.put(`/demo-students/${id}`, data);
};

/**
 * Delete demo student (soft delete)
 */
export const deleteDemoStudent = async (
  id: string
): Promise<IApiResponse<{ message: string }>> => {
  return apiClient.delete(`/demo-students/${id}`);
};

/**
 * Schedule a demo session for a demo student
 */
export const scheduleDemoSession = async (
  data: IDemoSessionScheduleInput
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.post('/demo-students/schedule-session', data);
};

/**
 * Update demo session details
 */
export const updateDemoSession = async (
  demoStudentId: string,
  sessionId: string,
  data: IDemoSessionUpdateInput
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.put(`/demo-students/${demoStudentId}/sessions/${sessionId}`, data);
};

/**
 * Submit demo session feedback
 */
export const submitDemoSessionFeedback = async (
  demoStudentId: string,
  sessionId: string,
  feedback: IDemoSessionFeedbackInput
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.post(`/demo-students/${demoStudentId}/sessions/${sessionId}/feedback`, feedback);
};

/**
 * Add note to demo student
 */
export const addDemoStudentNote = async (
  id: string,
  note: {
    note: string;
    is_private?: boolean;
    tags?: string[];
  }
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.post(`/demo-students/${id}/notes`, note);
};

/**
 * Update demo student note
 */
export const updateDemoStudentNote = async (
  demoStudentId: string,
  noteId: string,
  note: {
    note?: string;
    is_private?: boolean;
    tags?: string[];
  }
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.put(`/demo-students/${demoStudentId}/notes/${noteId}`, note);
};

/**
 * Delete demo student note
 */
export const deleteDemoStudentNote = async (
  demoStudentId: string,
  noteId: string
): Promise<IApiResponse<{ message: string }>> => {
  return apiClient.delete(`/demo-students/${demoStudentId}/notes/${noteId}`);
};

/**
 * Send communication to demo student
 */
export const sendDemoStudentCommunication = async (
  id: string,
  communication: {
    type: 'email' | 'sms' | 'whatsapp';
    subject?: string;
    message: string;
    template_id?: string;
    schedule_at?: string;
  }
): Promise<IApiResponse<{ message: string; communication_id: string }>> => {
  return apiClient.post(`/demo-students/${id}/communicate`, communication);
};

/**
 * Convert demo student to regular student
 */
export const convertDemoStudentToStudent = async (
  id: string,
  conversionData: {
    course_id: string;
    enrollment_type?: 'full_course' | 'trial' | 'free_tier';
    payment_plan?: 'full_payment' | 'installments';
    discount_code?: string;
    special_pricing?: number;
    notes?: string;
  }
): Promise<IApiResponse<{
  message: string;
  student_id: string;
  enrollment_id: string;
  demo_student: IDemoStudent;
}>> => {
  return apiClient.post(`/demo-students/${id}/convert`, conversionData);
};

/**
 * Get demo student analytics
 */
export const getDemoStudentAnalytics = async (
  params: {
    date_from?: string;
    date_to?: string;
    instructor_id?: string;
    course_category?: string;
    location_filter?: string;
  } = {}
): Promise<IApiResponse<IDemoStudentAnalytics>> => {
  return apiClient.get('/demo-students/analytics', params);
};

/**
 * Bulk create demo students
 */
export const bulkCreateDemoStudents = async (
  data: IBulkDemoStudentCreateInput
): Promise<IApiResponse<IBulkDemoStudentResponse>> => {
  return apiClient.post('/demo-students/bulk-create', data);
};

/**
 * Export demo students data
 */
export const exportDemoStudents = async (
  params: IDemoStudentQueryParams & {
    format?: 'csv' | 'excel' | 'json';
    include_sessions?: boolean;
    include_notes?: boolean;
    include_communication_log?: boolean;
  }
): Promise<IApiResponse<{
  download_url: string;
  file_name: string;
  expires_at: string;
}>> => {
  return apiClient.get('/demo-students/export', params);
};

/**
 * Get available instructors for demo sessions
 */
export const getAvailableInstructors = async (
  params: {
    course_category?: string;
    session_date?: string;
    session_time?: string;
    session_type?: TDemoClassType;
  } = {}
): Promise<IApiResponse<{
  instructors: Array<{
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
    specializations: string[];
    rating: number;
    demo_sessions_conducted: number;
    availability: Array<{
      day: string;
      time_slots: string[];
    }>;
  }>;
}>> => {
  return apiClient.get('/demo-students/available-instructors', params);
};

/**
 * Get demo student dashboard stats
 */
export const getDemoStudentDashboardStats = async (): Promise<IApiResponse<{
  total_demo_students: number;
  active_demo_students: number;
  sessions_today: number;
  sessions_this_week: number;
  conversion_rate_this_month: number;
  pending_follow_ups: number;
  recent_registrations: IDemoStudent[];
  upcoming_sessions: Array<{
    demo_student: IDemoStudent;
    session_date: string;
    session_time: string;
    instructor_name: string;
  }>;
}>> => {
  return apiClient.get('/demo-students/dashboard-stats');
};

/**
 * Search demo students
 */
export const searchDemoStudents = async (
  searchTerm: string,
  filters: {
    status?: TDemoStudentStatus;
    source?: TDemoStudentSource;
    instructor_id?: string;
    limit?: number;
  } = {}
): Promise<IApiResponse<{
  demo_students: IDemoStudent[];
  total_found: number;
  search_suggestions: string[];
}>> => {
  return apiClient.get('/demo-students/search', { q: searchTerm, ...filters });
};

/**
 * Update demo student status
 */
export const updateDemoStudentStatus = async (
  id: string,
  status: TDemoStudentStatus,
  reason?: string
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.patch(`/demo-students/${id}/status`, { status, reason });
};

/**
 * Assign instructor to demo student
 */
export const assignInstructorToDemoStudent = async (
  demoStudentId: string,
  instructorId: string,
  notes?: string
): Promise<IApiResponse<IDemoStudentResponse>> => {
  return apiClient.post(`/demo-students/${demoStudentId}/assign-instructor`, {
    instructor_id: instructorId,
    notes
  });
};

/**
 * Get demo sessions by instructor
 */
export const getDemoSessionsByInstructor = async (
  instructorId: string,
  params: {
    date_from?: string;
    date_to?: string;
    status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    page?: number;
    limit?: number;
  } = {}
): Promise<IApiResponse<{
  sessions: Array<{
    demo_student: IDemoStudent;
    session: IDemoSession;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>> => {
  return apiClient.get(`/demo-students/instructor/${instructorId}/sessions`, params);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate demo student data before creation
 */
export const validateDemoStudentData = (data: IDemoStudentCreateInput): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validate personal info
  if (!data.personal_info.full_name?.trim()) {
    errors.push('Full name is required');
  }

  if (!data.personal_info.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_info.email)) {
    errors.push('Invalid email format');
  }

  if (!data.personal_info.phone_numbers || data.personal_info.phone_numbers.length === 0) {
    errors.push('At least one phone number is required');
  }

  // Validate meta data
  if (!data.meta?.data_processing_consent) {
    errors.push('Data processing consent is required');
  }

  if (!data.meta?.terms_accepted) {
    errors.push('Terms acceptance is required');
  }

  if (!data.meta?.privacy_policy_accepted) {
    errors.push('Privacy policy acceptance is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format demo student name for display
 */
export const formatDemoStudentName = (demoStudent: IDemoStudent): string => {
  return demoStudent.personal_info.full_name || 'Unknown Student';
};

/**
 * Get demo student status color class
 */
export const getDemoStudentStatusColor = (status: TDemoStudentStatus): string => {
  const colorMap: Record<TDemoStudentStatus, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  };
  return colorMap[status] || colorMap.inactive;
};

/**
 * Calculate demo student age from birth date or age
 */
export const calculateDemoStudentAge = (demoStudent: IDemoStudent): number | null => {
  if (demoStudent.personal_info.age) {
    return demoStudent.personal_info.age;
  }
  return null;
};

/**
 * Format demo session date and time
 */
export const formatDemoSessionDateTime = (session: IDemoSession): string => {
  const date = new Date(`${session.session_date}T${session.session_time}`);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if demo student has expired
 */
export const isDemoStudentExpired = (demoStudent: IDemoStudent): boolean => {
  if (!demoStudent.expires_at) return false;
  return new Date(demoStudent.expires_at) < new Date();
};

/**
 * Get demo student conversion status
 */
export const getDemoStudentConversionStatus = (demoStudent: IDemoStudent): {
  isConverted: boolean;
  conversionDate?: string;
  enrolledCourse?: string;
} => {
  const conversion = demoStudent.conversion_tracking;
  return {
    isConverted: !!conversion?.enrolled_in_course,
    conversionDate: conversion?.enrollment_date,
    enrolledCourse: conversion?.enrolled_course_id
  };
};

export default {
  createDemoStudent,
  getAllDemoStudents,
  getDemoStudentById,
  updateDemoStudent,
  deleteDemoStudent,
  scheduleDemoSession,
  updateDemoSession,
  submitDemoSessionFeedback,
  addDemoStudentNote,
  updateDemoStudentNote,
  deleteDemoStudentNote,
  sendDemoStudentCommunication,
  convertDemoStudentToStudent,
  getDemoStudentAnalytics,
  bulkCreateDemoStudents,
  exportDemoStudents,
  getAvailableInstructors,
  getDemoStudentDashboardStats,
  searchDemoStudents,
  updateDemoStudentStatus,
  assignInstructorToDemoStudent,
  getDemoSessionsByInstructor,
  validateDemoStudentData,
  formatDemoStudentName,
  getDemoStudentStatusColor,
  calculateDemoStudentAge,
  formatDemoSessionDateTime,
  isDemoStudentExpired,
  getDemoStudentConversionStatus
}; 