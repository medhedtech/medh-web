import { apiClient } from '../apiClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TAdminRole = 'admin' | 'super-admin' | 'instructor' | 'student';
export type TUserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type TBatchStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';
export type TAnnouncementType = 'course' | 'system' | 'maintenance' | 'feature' | 'event' | 'general';
export type TAnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TFormStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected' | 'archived';

// User Management Interfaces
export interface IUser {
  _id: string;
  email: string;
  full_name: string;
  role: TAdminRole[];
  status: TUserStatus;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  profile_completion?: number;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  user_image?: string;
  bio?: string;
  location?: string;
  meta?: Record<string, any>;
}

export interface ILockedAccount {
  id: string;
  full_name: string;
  email: string;
  failed_login_attempts: number;
  password_change_attempts: number;
  lockout_reason: 'failed_login_attempts' | 'password_change_attempts' | 'admin_lock';
  locked_until: string;
  remaining_minutes: number;
  remaining_time_formatted: string;
  created_at: string;
  last_login?: string;
}

export interface ILockoutStatistics {
  current_status: {
    currently_locked: number;
    locked_last_24h: number;
    locked_last_week: number;
  };
  lockout_reasons: {
    failed_login_attempts: number;
    password_change_attempts: number;
    admin_lock: number;
  };
  attempt_statistics: {
    avg_failed_login_attempts: number;
    max_failed_login_attempts: number;
    users_with_failed_logins: number;
    avg_password_change_attempts: number;
    max_password_change_attempts: number;
    users_with_failed_password_changes: number;
  };
  lockout_levels: {
    level_1: string;
    level_2: string;
    level_3: string;
    level_4: string;
  };
}

// Batch Management Interfaces
export interface IBatch {
  _id: string;
  batch_name: string;
  batch_code?: string;
  course: string;
  status: TBatchStatus;
  batch_type?: 'group' | 'individual';
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_students: number;
  assigned_instructor?: string;
  created_by: string;
  schedule?: Array<{
    date: string;
    title?: string;
    description?: string;
    start_time: string;
    end_time: string;
  }>;
  batch_notes?: string;
  student_id?: string;
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

export interface IBatchCreateInput {
  batch_name: string;
  batch_code?: string;
  course: string;
  status?: TBatchStatus;
  batch_type?: 'group' | 'individual';
  start_date: string;
  end_date: string;
  capacity: number;
  assigned_instructor?: string;
  schedule?: Array<{
    date: string;
    title?: string;
    description?: string;
    start_time: string;
    end_time: string;
  }>;
  batch_notes?: string;
  student_id?: string;
}

export interface IBatchUpdateInput extends Partial<IBatchCreateInput> {
  enrolled_students?: number;
}

// Batch Analytics Interfaces
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
    status: TBatchStatus;
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
    status: TBatchStatus;
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

// Announcement Interfaces
export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  type: TAnnouncementType;
  priority: TAnnouncementPriority;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  targetAudience: ('all' | 'students' | 'instructors' | 'admins' | 'corporate' | 'parents')[];
  specificStudents?: Array<{
    _id: string;
    full_name: string;
    email: string;
  }>;
  isSticky: boolean;
  viewCount: number;
  readCount?: number;
  author: {
    _id: string;
    full_name: string;
    email: string;
    role: string[];
  };
  courseId?: {
    _id: string;
    course_title: string;
  };
  categories: Array<{
    _id: string;
    category_name: string;
  }>;
  tags: string[];
  actionButton?: {
    text?: string;
    url?: string;
    type: 'internal' | 'external' | 'link';
  };
  metadata: {
    featured?: boolean;
    allowComments?: boolean;
    sendNotification?: boolean;
    emailNotification?: boolean;
    pushNotification?: boolean;
    notificationSent?: boolean;
  };
  publishDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAnnouncementCreateInput {
  title: string;
  content: string;
  type: TAnnouncementType;
  priority?: TAnnouncementPriority;
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  targetAudience: ('all' | 'students' | 'instructors' | 'admins' | 'corporate' | 'parents')[];
  specificStudents?: string[];
  courseId?: string;
  categories?: string[];
  isSticky?: boolean;
  tags?: string[];
  expiryDate?: string;
  publishDate?: string;
  actionButton?: {
    text?: string;
    url?: string;
    type: 'internal' | 'external' | 'link';
  };
  metadata?: {
    featured?: boolean;
    allowComments?: boolean;
    sendNotification?: boolean;
    emailNotification?: boolean;
    pushNotification?: boolean;
  };
}

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

// Form Management Interfaces
export interface IForm {
  _id: string;
  form_name: string;
  form_title: string;
  form_description?: string;
  form_type: 'contact' | 'feedback' | 'enrollment' | 'support' | 'survey' | 'application' | 'newsletter' | 'custom';
  form_category?: string;
  form_fields: Array<{
    _id?: string;
    field_name: string;
    field_label: string;
    field_type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'date' | 'number' | 'url' | 'password';
    field_placeholder?: string;
    field_description?: string;
    field_options?: string[];
    validation?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      min?: number;
      max?: number;
      fileTypes?: string[];
      maxFileSize?: number;
      customValidation?: string;
    };
    is_required: boolean;
    is_visible: boolean;
    field_order: number;
    default_value?: string | string[] | number | boolean;
  }>;
  form_settings: {
    allow_multiple_submissions: boolean;
    require_authentication: boolean;
    send_confirmation_email: boolean;
    redirect_url?: string;
    success_message: string;
    error_message: string;
    auto_respond: boolean;
    notification_emails: string[];
  };
  form_styling?: {
    theme: 'default' | 'minimal' | 'modern' | 'classic';
    primary_color?: string;
    background_color?: string;
    text_color?: string;
    button_style?: string;
  };
  is_active: boolean;
  is_public: boolean;
  created_by: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFormSubmission {
  _id?: string;
  form_id: string;
  form_name: string;
  form_type: 'contact' | 'feedback' | 'enrollment' | 'support' | 'survey' | 'application' | 'newsletter' | 'custom';
  submission_data: Record<string, any>;
  attachments?: Array<{
    _id: string;
    original_name: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    uploaded_at: string;
  }>;
  submitter_info: {
    user_id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    ip_address?: string;
    user_agent?: string;
    location?: {
      country?: string;
      city?: string;
      timezone?: string;
    };
  };
  status: TFormStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  tags?: string[];
  notes?: string;
  response_message?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  source: 'web' | 'mobile' | 'api' | 'admin';
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  submitted_at: string;
  processed_at?: string;
  completed_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFormAnalytics {
  form_id: string;
  form_name: string;
  form_type: 'contact' | 'feedback' | 'enrollment' | 'support' | 'survey' | 'application' | 'newsletter' | 'custom';
  total_submissions: number;
  total_views: number;
  conversion_rate: number;
  average_completion_time: number;
  abandonment_rate: number;
  submission_trends: Array<{
    date: string;
    submissions: number;
    views: number;
  }>;
  field_analytics: Array<{
    field_name: string;
    field_label: string;
    completion_rate: number;
    error_rate: number;
    average_time_spent: number;
  }>;
  status_distribution: Record<TFormStatus, number>;
  priority_distribution: Record<'low' | 'medium' | 'high' | 'urgent', number>;
  source_distribution: Record<string, number>;
  geographic_distribution: Array<{
    country: string;
    submissions: number;
    percentage: number;
  }>;
  device_breakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  popular_times: Array<{
    hour: number;
    submissions: number;
  }>;
}

// Course Management Interfaces
export interface ICourse {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_description: string;
  course_category: string;
  course_subcategory?: string;
  course_image?: string;
  course_fee?: number;
  currency?: string;
  course_duration?: number;
  language?: string;
  subtitle_languages?: string[];
  class_type?: string;
  course_grade?: string;
  skill_level?: string;
  is_certification?: boolean;
  is_assignments?: boolean;
  is_projects?: boolean;
  is_quizzes?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  no_of_sessions?: number;
  features?: string[];
  tools_technologies?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  assigned_instructor?: string;
  show_in_home?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseCreateInput {
  course_title: string;
  course_subtitle?: string;
  course_description: string;
  course_category: string;
  course_subcategory?: string;
  course_image?: string;
  course_fee?: number;
  currency?: string;
  course_duration?: number;
  language?: string;
  subtitle_languages?: string[];
  class_type?: string;
  course_grade?: string;
  skill_level?: string;
  is_certification?: boolean;
  is_assignments?: boolean;
  is_projects?: boolean;
  is_quizzes?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  no_of_sessions?: number;
  features?: string[];
  tools_technologies?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  assigned_instructor?: string;
  show_in_home?: boolean;
}

// Zoom Integration Interfaces
export interface IZoomMeeting {
  meeting_id: string;
  join_url: string;
  topic: string;
  password: string;
  start_time: string;
  duration: number;
  timezone: string;
  agenda?: string;
  settings?: Record<string, any>;
  [key: string]: any;
}

export interface IZoomMeetingInput {
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  agenda?: string;
  settings?: Record<string, any>;
}

// API Response Interfaces
export interface IApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================

export const adminAuthApi = {
  // Get All Users
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: TAdminRole;
    status?: TUserStatus;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ users: IUser[] }>> => {
    return apiClient.get('/auth/users', params);
  },

  // Get Locked Accounts
  getLockedAccounts: async (params?: {
    page?: number;
    limit?: number;
    lockout_reason?: string;
  }): Promise<IApiResponse<{ lockedAccounts: ILockedAccount[] }>> => {
    return apiClient.get('/auth/locked-accounts', params);
  },

  // Unlock Account
  unlockAccount: async (userId: string, resetAttempts?: boolean): Promise<IApiResponse<{
    user: {
      id: string;
      email: string;
      full_name: string;
      unlocked_at: string;
      attempts_reset: boolean;
    };
    previous_state: {
      locked_until: string;
      failed_login_attempts: number;
      password_change_attempts: number;
      lockout_reason: string;
    };
  }>> => {
    return apiClient.post(`/auth/unlock-account/${userId}`, { resetAttempts });
  },

  // Unlock All Accounts
  unlockAllAccounts: async (resetAttempts?: boolean): Promise<IApiResponse<{
    unlocked_count: number;
    attempts_reset: boolean;
    accounts: Array<{
      id: string;
      email: string;
      full_name: string;
      was_locked_until: string;
      lockout_reason: string;
      failed_login_attempts: number;
      password_change_attempts: number;
    }>;
  }>> => {
    return apiClient.post('/auth/unlock-all-accounts', { resetAttempts });
  },

  // Get Lockout Stats
  getLockoutStats: async (): Promise<IApiResponse<ILockoutStatistics>> => {
    return apiClient.get('/auth/lockout-stats');
  },
};

// ============================================================================
// BATCH MANAGEMENT
// ============================================================================

export const adminBatchApi = {
  // Create Batch
  createBatch: async (courseId: string, batchData: IBatchCreateInput): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.post(`/batches/courses/${courseId}/batches`, batchData);
  },

  // Update Batch
  updateBatch: async (batchId: string, updateData: IBatchUpdateInput): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.put(`/batches/${batchId}`, updateData);
  },

  // Delete Batch
  deleteBatch: async (batchId: string): Promise<IApiResponse<null>> => {
    return apiClient.delete(`/batches/${batchId}`);
  },

  // Assign Instructor
  assignInstructor: async (batchId: string, instructorId: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.put(`/batches/${batchId}/assign-instructor/${instructorId}`);
  },

  // Add Student to Batch
  addStudentToBatch: async (batchId: string, studentId: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.post(`/batches/${batchId}/students`, { studentId });
  },

  // Remove Student from Batch
  removeStudentFromBatch: async (batchId: string, studentId: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.delete(`/batches/${batchId}/students/${studentId}`);
  },

  // Transfer Student to Another Batch
  transferStudent: async (batchId: string, studentId: string, targetBatchId: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.post(`/batches/${batchId}/students/${studentId}/transfer`, { targetBatchId });
  },

  // Update Student Status in Batch
  updateStudentStatus: async (batchId: string, studentId: string, status: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.put(`/batches/${batchId}/students/${studentId}/status`, { status });
  },

  // Get All Batches
  getAllBatches: async (params?: {
    page?: number;
    limit?: number;
    status?: TBatchStatus;
    course_id?: string;
    instructor_id?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ batches: IBatch[] }>> => {
    return apiClient.get('/batches', params);
  },

  // Get Batch by ID
  getBatchById: async (batchId: string): Promise<IApiResponse<{ batch: IBatch }>> => {
    return apiClient.get(`/batches/${batchId}`);
  },
};

// ============================================================================
// BATCH ANALYTICS
// ============================================================================

export const adminBatchAnalyticsApi = {
  // Get Dashboard Analytics
  getDashboardAnalytics: async (): Promise<IApiResponse<IBatchAnalyticsDashboard>> => {
    return apiClient.get('/batches/analytics/dashboard');
  },

  // Get Status Distribution
  getStatusDistribution: async (): Promise<IApiResponse<IBatchStatusDistribution>> => {
    return apiClient.get('/batches/analytics/status-distribution');
  },

  // Get Instructor Workload
  getInstructorWorkload: async (): Promise<IApiResponse<IInstructorWorkloadAnalytics>> => {
    return apiClient.get('/batches/analytics/instructor-workload');
  },

  // Get Capacity Analytics
  getCapacityAnalytics: async (): Promise<IApiResponse<ICapacityAnalytics>> => {
    return apiClient.get('/batches/analytics/capacity');
  },

  // Get Instructor Analysis
  getInstructorAnalysis: async (): Promise<IApiResponse<any>> => {
    return apiClient.get('/batches/analytics/instructor-analysis');
  },
};

// ============================================================================
// ANNOUNCEMENTS
// ============================================================================

export const adminAnnouncementApi = {
  // Get All Announcements
  getAllAnnouncements: async (params?: {
    page?: number;
    limit?: number;
    type?: TAnnouncementType;
    priority?: TAnnouncementPriority;
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ announcements: IAnnouncement[] }>> => {
    return apiClient.get('/announcements', params);
  },

  // Create Announcement
  createAnnouncement: async (announcementData: IAnnouncementCreateInput): Promise<IApiResponse<{ announcement: IAnnouncement }>> => {
    return apiClient.post('/announcements', announcementData);
  },

  // Update Announcement
  updateAnnouncement: async (id: string, updateData: Partial<IAnnouncementCreateInput>): Promise<IApiResponse<{ announcement: IAnnouncement }>> => {
    return apiClient.put(`/announcements/${id}`, updateData);
  },

  // Delete Announcement
  deleteAnnouncement: async (id: string): Promise<IApiResponse<null>> => {
    return apiClient.delete(`/announcements/${id}`);
  },

  // Get Announcement Analytics
  getAnnouncementAnalytics: async (): Promise<IApiResponse<IAnnouncementAnalytics>> => {
    return apiClient.get('/announcements/analytics');
  },

  // Get Announcement by ID
  getAnnouncementById: async (id: string): Promise<IApiResponse<{ announcement: IAnnouncement }>> => {
    return apiClient.get(`/announcements/${id}`);
  },
};

// ============================================================================
// FORM MANAGEMENT
// ============================================================================

export const adminFormApi = {
  // Get All Forms
  getAllForms: async (params?: {
    page?: number;
    limit?: number;
    form_type?: string;
    status?: TFormStatus;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ forms: IForm[] }>> => {
    return apiClient.get('/forms', params);
  },

  // Get Form Analytics
  getFormAnalytics: async (formId?: string, dateRange?: { start_date: string; end_date: string }): Promise<IApiResponse<IFormAnalytics>> => {
    return apiClient.get('/forms/analytics', { formId, ...dateRange });
  },

  // Export Forms
  exportForms: async (format: 'csv' | 'excel' | 'json' = 'csv', filters?: any): Promise<IApiResponse<{ download_url: string; expires_at: string }>> => {
    return apiClient.get('/forms/export', { format, ...filters });
  },

  // Update Form
  updateForm: async (id: string, updateData: Partial<IForm>): Promise<IApiResponse<{ form: IForm }>> => {
    return apiClient.put(`/forms/${id}`, updateData);
  },

  // Delete Form
  deleteForm: async (id: string): Promise<IApiResponse<null>> => {
    return apiClient.delete(`/forms/${id}`);
  },

  // Get Form Submissions
  getFormSubmissions: async (params?: {
    page?: number;
    limit?: number;
    form_type?: string;
    status?: TFormStatus;
    priority?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    assigned_to?: string;
    created_by?: string;
    tags?: string[];
    source?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ submissions: IFormSubmission[] }>> => {
    return apiClient.get('/forms/submissions', params);
  },

  // Get Form by ID
  getFormById: async (id: string): Promise<IApiResponse<{ form: IForm }>> => {
    return apiClient.get(`/forms/${id}`);
  },
};

// ============================================================================
// COURSE MANAGEMENT
// ============================================================================

export const adminCourseApi = {
  // Create Course
  createCourse: async (courseData: ICourseCreateInput): Promise<IApiResponse<{ course: ICourse }>> => {
    return apiClient.post('/courses/create', courseData);
  },

  // Update Course
  updateCourse: async (id: string, updateData: Partial<ICourseCreateInput>): Promise<IApiResponse<{ course: ICourse }>> => {
    return apiClient.put(`/courses/${id}`, updateData);
  },

  // Delete Course
  deleteCourse: async (id: string): Promise<IApiResponse<null>> => {
    return apiClient.delete(`/courses/${id}`);
  },

  // Get All Courses
  getAllCourses: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<IApiResponse<{ courses: ICourse[] }>> => {
    return apiClient.get('/tcourse/all', params);
  },

  // Get Course by ID
  getCourseById: async (id: string): Promise<IApiResponse<{ course: ICourse }>> => {
    return apiClient.get(`/courses/${id}`);
  },
};

// ============================================================================
// ZOOM INTEGRATION
// ============================================================================

export const adminZoomApi = {
  // Create Zoom Meeting for Session
  createZoomMeeting: async (batchId: string, sessionId: string, meetingData: IZoomMeetingInput): Promise<IApiResponse<{ meeting: IZoomMeeting }>> => {
    return apiClient.post(`/batches/${batchId}/schedule/${sessionId}/zoom-meeting`, meetingData);
  },

  // Sync Zoom Recordings
  syncZoomRecordings: async (batchId: string): Promise<IApiResponse<{ syncStatus: string }>> => {
    return apiClient.post(`/batches/${batchId}/sync-zoom-recordings`);
  },
};

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export const adminProfileApi = {
  // Restore Soft-Deleted Profile
  restoreProfile: async (userId: string): Promise<IApiResponse<{ profile: any }>> => {
    return apiClient.post(`/profile/${userId}/restore`);
  },

  // Get Admin Progress Stats
  getAdminProgressStats: async (): Promise<IApiResponse<{ stats: any }>> => {
    return apiClient.get('/profile/admin/progress-stats');
  },
};

// ============================================================================
// UNIFIED ADMIN DASHBOARD STATS
// ============================================================================

export interface IAdminDashboardStats {
  totalStudents: {
    value: number;
    change: number;
  };
  activeEnrollments: {
    value: number;
    change: number;
  };
  activeCourses: {
    value: number;
    change: number;
  };
  monthlyRevenue: {
    value: number;
    change: number;
  };
  upcomingClasses: {
    value: number;
    change: number;
  };
  completionRate: {
    value: number;
    change: number;
  };
  studentSatisfaction: {
    value: number;
    change: number;
  };
  instructorRating: {
    value: number;
    change: number;
  };
  supportTickets: {
    value: number;
    change: number;
  };
}

// New interface for the actual API response structure
export interface IAdminDashboardStatsResponse {
  totalStudents: {
    total: number;
    changes: {
      monthly: { current: number; previous: number; change: number };
      quarterly: { current: number; previous: number; change: number };
      halfYearly: { current: number; previous: number; change: number };
      yearly: { current: number; previous: number; change: number };
    };
  };
  activeEnrollments: {
    total: number;
    changes: {
      monthly: { current: number; previous: number; change: number };
      quarterly: { current: number; previous: number; change: number };
      halfYearly: { current: number; previous: number; change: number };
      yearly: { current: number; previous: number; change: number };
    };
  };
  activeCourses: {
    total: number;
    changes: {
      monthly: { current: number; previous: number; change: number };
      quarterly: { current: number; previous: number; change: number };
      halfYearly: { current: number; previous: number; change: number };
      yearly: { current: number; previous: number; change: number };
    };
  };
  monthlyRevenue: {
    total: number;
    changes: {
      monthly: { current: number; previous: number; change: number };
      quarterly: { current: number; previous: number; change: number };
      halfYearly: { current: number; previous: number; change: number };
      yearly: { current: number; previous: number; change: number };
    };
  };
  upcomingClasses: {
    total: number;
  };
  completionRate: {
    total: number;
  };
  studentSatisfaction: {
    total: number;
  };
  instructorRating: {
    total: number;
  };
  supportTickets: {
    total: number;
  };
}

export const adminDashboardApi = {
  // Get unified admin dashboard stats
  getDashboardStats: async (): Promise<IApiResponse<{ data: IAdminDashboardStatsResponse }>> => {
    return apiClient.get('/admin/dashboard-stats');
  },
};

// ============================================================================
// EXPORT ALL APIs
// ============================================================================

export const adminApi = {
  auth: adminAuthApi,
  batch: adminBatchApi,
  batchAnalytics: adminBatchAnalyticsApi,
  announcement: adminAnnouncementApi,
  form: adminFormApi,
  course: adminCourseApi,
  zoom: adminZoomApi,
  profile: adminProfileApi,
  dashboard: adminDashboardApi,
};

export default adminApi; 