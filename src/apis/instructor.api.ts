import { apiClient } from './apiClient';
import { 
  InstructorCourse,
  CourseStudent,
  InstructorStats,
  AttendanceSession,
  RevenueStats,
  MonthlyRevenue,
  CourseBatch,
  StudentPerformance,
  InstructorAnnouncement,
  ClassSession,
} from '../types/instructor';
import { ApiResponse, PaginatedResponse } from '../types/common';

// ==================== INTERFACES ====================

export interface InstructorDashboardData {
  overview: {
    activeBatches: number;
    totalStudents: number;
    pendingDemos: number;
    completedAssignments: number;
    pendingAssignments: number;
  };
  upcomingClasses: UpcomingClass[];
  recentSubmissions: RecentSubmission[];
  monthlyStats: {
    demosCompleted: number;
    assignmentsCreated: number;
    newStudents: number;
    month: string;
  };
  quickActions: QuickAction[];
}

export interface UpcomingClass {
  batchName: string;
  courseTitle: string;
  date: string;
  time: string;
  studentCount: number;
  type: 'live_class' | 'demo' | 'workshop';
}

export interface RecentSubmission {
  assignmentTitle: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'returned';
  grade: number | null;
}

export interface QuickAction {
  action: string;
  label: string;
  count: number;
}

export interface InstructorProfile {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  domain: string;
  status: 'active' | 'inactive';
}

export interface InstructorStatistics {
  totalBatches: number;
  totalStudents: number;
  totalDemos: number;
  averageRating: number;
  experience: string;
}

export interface DemoClass {
  id: string;
  studentName: string;
  courseName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  studentEmail: string;
  studentPhone: string;
}

export interface DemoStatusUpdate {
  status: 'accepted' | 'rejected';
  reason?: string;
}

export interface DemoFeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: {
    [key: string]: number;
  };
}

export interface BatchSchedule {
  days: string[];
  time: string;
}

export interface CreateBatchRequest {
  batch_name: string;
  course_id: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  max_students: number;
  schedule: BatchSchedule;
}

export interface Batch {
  _id: string;
  batch_name: string;
  course_id: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  max_students: number;
  current_students: number;
  schedule: BatchSchedule;
  status: 'active' | 'completed' | 'upcoming';
}

export interface BatchAnalytics {
  enrollmentStats: {
    total: number;
    active: number;
    completed: number;
    dropped: number;
  };
  progressStats: {
    averageProgress: number;
    completionRate: number;
  };
  attendanceStats: {
    averageAttendance: number;
  };
}

export interface StudentProgress {
  studentId: string;
  overallProgress: number;
  courseProgress: {
    completed_lessons: number;
    total_lessons: number;
    completion_percentage: number;
  };
  performanceMetrics: {
    quiz_average: number;
    assignment_average: number;
    attendance_rate: number;
  };
  engagementMetrics: {
    forum_posts: number;
    questions_asked: number;
    peer_interactions: number;
  };
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  course_id: string;
  batch_id: string;
  due_date: string;
  max_marks: number;
  instructions: string;
  attachments?: string[];
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course_id: string;
  batch_id: string;
  due_date: string;
  max_marks: number;
  instructions: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  _id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  content: string;
  attachments: string[];
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface GradeSubmissionRequest {
  marks: number;
  feedback: string;
  status: 'graded';
}

export interface VideoLessonRequest {
  title: string;
  description: string;
  video_data: string;
  duration: number;
  order: number;
  is_preview: boolean;
}

export interface CourseMaterialUpload {
  course_id: string;
  material_type: 'presentation' | 'document' | 'resource';
  title: string;
  description: string;
}

export interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  join_time?: string;
  leave_time?: string;
  reason?: string;
  notes?: string;
}

export interface MarkAttendanceRequest {
  batch_id: string;
  session_date: string;
  session_time: string;
  session_duration: number;
  session_topic: string;
  attendance_records: AttendanceRecord[];
}

export interface AttendanceResponse {
  attendance_id: string;
  session_info: {
    batch_name: string;
    session_date: string;
    total_students: number;
    present_count: number;
    absent_count: number;
    attendance_percentage: number;
  };
}

export interface BulkAttendanceRequest {
  sessions: {
    batch_id: string;
    session_date: string;
    attendance_records: AttendanceRecord[];
  }[];
}

export interface AttendanceAnalytics {
  overall_stats: {
    total_sessions: number;
    average_attendance: number;
    total_students: number;
    most_active_batch: string;
  };
  trends: {
    date: string;
    attendance_percentage: number;
    session_count: number;
  }[];
  student_performance: {
    student_id: string;
    student_name: string;
    attendance_percentage: number;
    total_sessions: number;
    present_count: number;
  }[];
}

export interface InstructorRevenue {
  summary: {
    totalRevenue: number;
    monthlyRevenue: number;
    demoRevenue: number;
    batchRevenue: number;
    pendingAmount: number;
    averageRevenuePerStudent: number;
  };
  breakdown: {
    period: string;
    revenue: number;
    enrollments: number;
    batches: number;
  }[];
  monthlyTrends: {
    year: number;
    month: number;
    revenue: number;
    enrollments: number;
    monthName: string;
  }[];
  demoMetrics: {
    totalDemos: number;
    completedDemos: number;
    conversionRate: number;
    averageRevenuePerDemo: number;
  };
  batchMetrics: {
    averageRevenuePerBatch: number;
    totalEnrollments: number;
    activeBatches: number;
    batchDetails: any[];
  };
  pendingPayments: {
    enrollmentId: string;
    studentName: string;
    batchName: string;
    pendingAmount: number;
    paymentStatus: string;
  }[];
}

export interface RevenueComparison {
  instructorRevenue: number;
  platformAverage: number;
  percentile: number;
  performance: 'above_average' | 'below_average' | 'average';
  totalInstructors: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  target_type: 'batch' | 'course' | 'all';
  target_id?: string;
  priority: 'low' | 'medium' | 'high';
  sender_id: string;
}

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  target_type: string;
  target_id?: string;
  priority: string;
  sender_id: string;
  created_at: string;
  read_by: string[];
}

// ==================== QUERY PARAMETERS INTERFACES ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BatchQueryParams extends PaginationParams {
  status?: 'active' | 'completed' | 'upcoming';
}

export interface StudentQueryParams extends PaginationParams {
  batch_id?: string;
  search?: string;
}

export interface AttendanceQueryParams extends PaginationParams {
  start_date?: string;
  end_date?: string;
}

export interface AttendanceAnalyticsParams {
  batch_id?: string;
  period?: 'week' | 'month' | 'quarter';
}

export interface RevenueQueryParams {
  start_date?: string;
  end_date?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  include_projections?: boolean;
}

export interface ExportParams {
  format: 'csv' | 'excel' | 'pdf';
  batch_id?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== API FUNCTIONS ====================

export const instructorApi = {
  // ==================== DASHBOARD ====================
  
  /**
   * Get instructor dashboard overview data
   */
  getDashboardData: async (): Promise<InstructorDashboardData> => {
    const response = await apiClient.get('/instructors/dashboard');
    return response.data.data;
  },

  /**
   * Get instructor profile overview
   */
  getInstructorProfile: async (): Promise<{ profile: InstructorProfile; statistics: InstructorStatistics }> => {
    const response = await apiClient.get('/instructors/profile');
    return response.data.data;
  },

  /**
   * Get active batches with optional filtering
   */
  getActiveBatches: async (params?: BatchQueryParams): Promise<Batch[]> => {
    const response = await apiClient.get('/instructors/batches', { params });
    return response.data.data;
  },

  /**
   * Get students list with optional filtering
   */
  getStudentsList: async (params?: StudentQueryParams): Promise<any[]> => {
    const response = await apiClient.get('/instructors/students', { params });
    return response.data.data;
  },

  /**
   * Get pending demos
   */
  getPendingDemos: async (): Promise<DemoClass[]> => {
    const response = await apiClient.get('/instructors/demos/pending');
    return response.data.data;
  },

  /**
   * Get upcoming classes
   */
  getUpcomingClasses: async (): Promise<UpcomingClass[]> => {
    const response = await apiClient.get('/instructors/classes/upcoming');
    return response.data.data;
  },

  /**
   * Get recent submissions
   */
  getRecentSubmissions: async (): Promise<RecentSubmission[]> => {
    const response = await apiClient.get('/instructors/submissions/recent');
    return response.data.data;
  },

  /**
   * Get monthly statistics
   */
  getMonthlyStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/stats/monthly');
    return response.data.data;
  },

  // ==================== DEMO CLASSES ====================
  
  /**
   * Get assigned demo classes for instructor
   */
  getAssignedDemoClasses: async (instructorId: string): Promise<DemoClass[]> => {
    const response = await apiClient.get(`/demo-booking/instructors/${instructorId}`);
    return response.data.data;
  },

  /**
   * Accept or reject demo assignment
   */
  updateDemoStatus: async (demoId: string, statusData: DemoStatusUpdate): Promise<DemoClass> => {
    const response = await apiClient.put(`/demo-booking/${demoId}/status`, statusData);
    return response.data.data;
  },

  /**
   * Get demo feedback statistics
   */
  getDemoFeedbackStats: async (instructorId: string): Promise<DemoFeedbackStats> => {
    const response = await apiClient.get(`/demo-feedback/stats/instructors/${instructorId}`);
    return response.data.data;
  },

  // ==================== BATCH MANAGEMENT ====================
  
  /**
   * Get instructor batches
   */
  getInstructorBatches: async (instructorId: string): Promise<Batch[]> => {
    const response = await apiClient.get(`/batches/instructors/${instructorId}`);
    return response.data.data;
  },

  /**
   * Create new batch
   */
  createBatch: async (batchData: CreateBatchRequest): Promise<Batch> => {
    const response = await apiClient.post('/batches', batchData);
    return response.data.data;
  },

  /**
   * Get batch analytics
   */
  getBatchAnalytics: async (batchId: string): Promise<BatchAnalytics> => {
    const response = await apiClient.get(`/batches/${batchId}/analytics`);
    return response.data.data;
  },

  // ==================== STUDENT MANAGEMENT ====================
  
  /**
   * Get batch students
   */
  getBatchStudents: async (batchId: string): Promise<any[]> => {
    const response = await apiClient.get(`/enrollments/batch/${batchId}/students`);
    return response.data.data;
  },

  /**
   * Get student progress
   */
  getStudentProgress: async (studentId: string, batchId: string): Promise<any> => {
    const response = await apiClient.get(`/progress/student/${studentId}/batch/${batchId}`);
    return response.data.data;
  },

  /**
   * Get enhanced student analytics
   */
  getEnhancedStudentAnalytics: async (studentId: string): Promise<StudentProgress> => {
    const response = await apiClient.get(`/enhanced-progress/student/${studentId}`);
    return response.data.data;
  },

  // ==================== ASSIGNMENT MANAGEMENT ====================
  
  /**
   * Get instructor assignments
   */
  getInstructorAssignments: async (instructorId: string): Promise<Assignment[]> => {
    const response = await apiClient.get(`/assignments/instructors/${instructorId}`);
    return response.data.data;
  },

  /**
   * Create assignment
   */
  createAssignment: async (assignmentData: CreateAssignmentRequest): Promise<Assignment> => {
    const response = await apiClient.post('/assignments', assignmentData);
    return response.data.data;
  },

  /**
   * Get assignment submissions
   */
  getAssignmentSubmissions: async (assignmentId: string): Promise<AssignmentSubmission[]> => {
    const response = await apiClient.get(`/assignments/${assignmentId}/submissions`);
    return response.data.data;
  },

  /**
   * Grade submission
   */
  gradeSubmission: async (submissionId: string, gradeData: GradeSubmissionRequest): Promise<AssignmentSubmission> => {
    const response = await apiClient.put(`/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data.data;
  },

  // ==================== CONTENT MANAGEMENT ====================
  
  /**
   * Upload video lesson
   */
  uploadVideoLesson: async (courseId: string, videoData: VideoLessonRequest): Promise<any> => {
    const response = await apiClient.post(`/courses/${courseId}/video-lessons`, videoData);
    return response.data.data;
  },

  /**
   * Upload course materials
   */
  uploadCourseMaterials: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post('/upload/course-materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get course content
   */
  getCourseContent: async (courseId: string): Promise<any> => {
    const response = await apiClient.get(`/courses/${courseId}/content`);
    return response.data.data;
  },

  // ==================== ATTENDANCE MANAGEMENT ====================
  
  /**
   * Mark attendance for session
   */
  markAttendance: async (attendanceData: MarkAttendanceRequest): Promise<AttendanceResponse> => {
    const response = await apiClient.post('/instructors/attendance/mark', attendanceData);
    return response.data.data;
  },

  /**
   * Get attendance for batch
   */
  getAttendanceForBatch: async (batchId: string, params?: AttendanceQueryParams): Promise<any> => {
    const response = await apiClient.get(`/instructors/attendance/batch/${batchId}`, { params });
    return response.data.data;
  },

  /**
   * Update attendance record
   */
  updateAttendanceRecord: async (attendanceId: string, updateData: Partial<AttendanceRecord>): Promise<any> => {
    const response = await apiClient.put(`/instructors/attendance/${attendanceId}`, updateData);
    return response.data.data;
  },

  /**
   * Bulk mark attendance
   */
  bulkMarkAttendance: async (bulkData: BulkAttendanceRequest): Promise<any> => {
    const response = await apiClient.post('/instructors/attendance/bulk-mark', bulkData);
    return response.data.data;
  },

  /**
   * Get attendance analytics
   */
  getAttendanceAnalytics: async (params?: AttendanceAnalyticsParams): Promise<AttendanceAnalytics> => {
    const response = await apiClient.get('/instructors/attendance/analytics', { params });
    return response.data.data;
  },

  /**
   * Export attendance report
   */
  exportAttendanceReport: async (params: ExportParams): Promise<Blob> => {
    const response = await apiClient.get('/instructors/attendance/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get attendance reports (legacy method for backward compatibility)
   */
  getAttendanceReport: async (batchId: string): Promise<any> => {
    const response = await apiClient.get(`/attendance/batch/${batchId}/report`);
    return response.data.data;
  },

  // ==================== REVENUE & ANALYTICS ====================
  
  /**
   * Get revenue overview
   */
  getRevenueOverview: async (params?: RevenueQueryParams): Promise<InstructorRevenue> => {
    const response = await apiClient.get('/instructors/revenue', { params });
    return response.data.data;
  },

  /**
   * Get revenue comparison
   */
  getRevenueComparison: async (): Promise<RevenueComparison> => {
    const response = await apiClient.get('/instructors/revenue/comparison');
    return response.data.data;
  },

  /**
   * Get demo revenue metrics
   */
  getDemoRevenueMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/demos');
    return response.data.data;
  },

  /**
   * Get batch revenue metrics
   */
  getBatchRevenueMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/batches');
    return response.data.data;
  },

  /**
   * Get pending payments
   */
  getPendingPayments: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/pending');
    return response.data.data;
  },

  /**
   * Get revenue trends
   */
  getRevenueTrends: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/trends');
    return response.data.data;
  },

  /**
   * Get revenue projections
   */
  getRevenueProjections: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/projections');
    return response.data.data;
  },

  /**
   * Get platform revenue statistics
   */
  getPlatformRevenueStats: async (): Promise<any> => {
    const response = await apiClient.get('/instructors/revenue/platform-stats');
    return response.data.data;
  },

  /**
   * Get instructor revenue (legacy method for backward compatibility)
   */
  getInstructorRevenue: async (instructorId: string): Promise<InstructorRevenue> => {
    const response = await apiClient.get(`/instructors/${instructorId}/revenue`);
    return response.data.data;
  },

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics: async (instructorId: string): Promise<any> => {
    const response = await apiClient.get(`/instructors/${instructorId}/analytics`);
    return response.data.data;
  },

  // ==================== COMMUNICATION & ANNOUNCEMENTS ====================
  
  /**
   * Send batch announcement
   */
  createAnnouncement: async (announcementData: CreateAnnouncementRequest): Promise<Announcement> => {
    const response = await apiClient.post('/announcements', announcementData);
    return response.data.data;
  },

  /**
   * Get batch messages/announcements
   */
  getBatchMessages: async (batchId: string): Promise<Announcement[]> => {
    const response = await apiClient.get(`/announcements/batch/${batchId}`);
    return response.data.data;
  },

  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Create course material upload FormData
   */
  createCourseMaterialFormData: (
    file: File, 
    materialData: CourseMaterialUpload
  ): FormData => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', materialData.course_id);
    formData.append('material_type', materialData.material_type);
    formData.append('title', materialData.title);
    formData.append('description', materialData.description);
    return formData;
  },

  /**
   * Format date for API requests
   */
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Format time for API requests
   */
  formatTimeForAPI: (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  /**
   * Build query string from parameters
   */
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  },

  /**
   * Handle API error responses
   */
  handleApiError: (error: any): never => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
          throw new Error('Authentication required');
        case 403:
          throw new Error('You do not have permission to perform this action');
        case 404:
          throw new Error('Requested resource not found');
        case 400:
          throw new Error(`Validation Error: ${data.message || 'Invalid request data'}`);
        default:
          throw new Error('An unexpected error occurred');
      }
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Download file from blob response
   */
  downloadFile: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ==================== HOOKS FOR REACT INTEGRATION ====================

export const useInstructorApi = () => {
  return instructorApi;
};

// ==================== ERROR TYPES ====================

export interface InstructorApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field: string;
      issue: string;
    };
  };
}

// ==================== CONSTANTS ====================

export const INSTRUCTOR_API_ENDPOINTS = {
  DASHBOARD: '/instructors/dashboard',
  PROFILE: '/instructors/profile',
  BATCHES: '/instructors/batches',
  STUDENTS: '/instructors/students',
  DEMOS_PENDING: '/instructors/demos/pending',
  CLASSES_UPCOMING: '/instructors/classes/upcoming',
  SUBMISSIONS_RECENT: '/instructors/submissions/recent',
  STATS_MONTHLY: '/instructors/stats/monthly',
  ATTENDANCE_MARK: '/instructors/attendance/mark',
  ATTENDANCE_BATCH: '/instructors/attendance/batch',
  ATTENDANCE_ANALYTICS: '/instructors/attendance/analytics',
  ATTENDANCE_EXPORT: '/instructors/attendance/export',
  REVENUE: '/instructors/revenue',
  REVENUE_COMPARISON: '/instructors/revenue/comparison',
  REVENUE_DEMOS: '/instructors/revenue/demos',
  REVENUE_BATCHES: '/instructors/revenue/batches',
  REVENUE_PENDING: '/instructors/revenue/pending',
  REVENUE_TRENDS: '/instructors/revenue/trends',
  REVENUE_PROJECTIONS: '/instructors/revenue/projections',
  REVENUE_PLATFORM_STATS: '/instructors/revenue/platform-stats',
  ANNOUNCEMENTS: '/announcements',
} as const;

export const DEMO_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const;

export const BATCH_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  UPCOMING: 'upcoming',
} as const;

export const MATERIAL_TYPES = {
  PRESENTATION: 'presentation',
  DOCUMENT: 'document',
  RESOURCE: 'resource',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

export const SESSION_TYPES = {
  LIVE_CLASS: 'live_class',
  DEMO: 'demo',
  WORKSHOP: 'workshop',
} as const;

export const ANNOUNCEMENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
} as const;

export const REVENUE_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
} as const;

// ==================== ENHANCED API METHODS ====================

/**
 * Enhanced Instructor API with modern TypeScript patterns
 */
export class InstructorAPI {
  // Dashboard endpoints with enhanced types
  static async getCourses(): Promise<InstructorCourse[]> {
    const response = await apiClient.get<InstructorCourse[]>('/instructors/courses');
    return response.data!;
  }

  static async getCourseStudents(courseId: string): Promise<CourseStudent[]> {
    const response = await apiClient.get<CourseStudent[]>(`/instructors/students/${courseId}`);
    return response.data!;
  }

  static async getDashboardStats(): Promise<InstructorStats> {
    const response = await apiClient.get<InstructorStats>('/instructors/dashboard/stats');
    return response.data!;
  }

  // Enhanced attendance management
  static async getBatchAttendance(batchId: string): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<AttendanceRecord[]>(`/attendance/batch/${batchId}`);
    return response.data!;
  }

  static async markAttendanceSession(attendanceData: AttendanceSession): Promise<AttendanceResponse> {
    const response = await apiClient.post<AttendanceResponse>('/attendance/mark', attendanceData);
    return response.data!;
  }

  static async updateAttendanceRecord(attendanceId: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await apiClient.put<AttendanceRecord>(`/attendance/${attendanceId}`, updates);
    return response.data!;
  }

  // Enhanced revenue management
  static async getRevenueStats(): Promise<RevenueStats> {
    const response = await apiClient.get<RevenueStats>('/instructors/revenue/stats');
    return response.data!;
  }

  static async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const response = await apiClient.get<MonthlyRevenue[]>('/instructors/revenue/monthly');
    return response.data!;
  }

  static async getRevenueDetails(params: {
    startDate: string;
    endDate: string;
  }): Promise<InstructorRevenue> {
    const response = await apiClient.get<InstructorRevenue>('/instructors/revenue/details', { params });
    return response.data!;
  }

  // Enhanced course management
  static async getCourseDetails(courseId: string): Promise<InstructorCourse> {
    const response = await apiClient.get<InstructorCourse>(`/instructors/courses/${courseId}`);
    return response.data!;
  }

  static async getCourseBatches(courseId: string): Promise<CourseBatch[]> {
    const response = await apiClient.get<CourseBatch[]>(`/instructors/courses/${courseId}/batches`);
    return response.data!;
  }

  // Enhanced assignment management
  static async getAssignments(params?: {
    course_id?: string;
    batch_id?: string;
    status?: 'draft' | 'published' | 'closed';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Assignment>> {
    const response = await apiClient.get<PaginatedResponse<Assignment>>('/instructors/assignments', { params });
    return response.data!;
  }

  static async createAssignmentEnhanced(assignment: {
    title: string;
    description: string;
    course_id: string;
    batch_id: string;
    due_date: string;
    max_marks: number;
    assignment_type: 'homework' | 'project' | 'quiz' | 'exam';
    submission_format: 'text' | 'file' | 'code' | 'presentation';
    instructions: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }): Promise<Assignment> {
    const response = await apiClient.post<Assignment>('/instructors/assignments/enhanced', assignment);
    return response.data!;
  }

  static async getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const response = await apiClient.get<AssignmentSubmission[]>(`/instructors/assignments/${assignmentId}/submissions`);
    return response.data!;
  }

  static async gradeAssignmentSubmission(submissionId: string, grading: {
    grade: number;
    feedback: string;
    status: 'submitted' | 'graded' | 'late' | 'missing';
  }): Promise<AssignmentSubmission> {
    const response = await apiClient.put<AssignmentSubmission>(`/instructors/assignments/${submissionId}/grade`, grading);
    return response.data!;
  }

  // Enhanced student performance tracking
  static async getStudentPerformance(params?: {
    course_id?: string;
    batch_id?: string;
    student_id?: string;
    time_period?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<StudentPerformance[]> {
    const response = await apiClient.get<StudentPerformance[]>('/instructors/student-performance', { params });
    return response.data!;
  }

  // Enhanced communication
  static async getAnnouncements(params?: {
    course_id?: string;
    batch_id?: string;
    status?: 'draft' | 'published' | 'archived';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<InstructorAnnouncement>> {
    const response = await apiClient.get<PaginatedResponse<InstructorAnnouncement>>('/instructors/announcements', { params });
    return response.data!;
  }

  static async createAnnouncementEnhanced(announcement: {
    title: string;
    content: string;
    course_id?: string;
    batch_id?: string;
    target_audience: 'all' | 'course' | 'batch' | 'individual';
    target_students?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_for?: string;
    expires_at?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }): Promise<InstructorAnnouncement> {
    const response = await apiClient.post<InstructorAnnouncement>('/instructors/announcements/enhanced', announcement);
    return response.data!;
  }

  // Enhanced class session management
  static async getClassSessions(params?: {
    course_id?: string;
    batch_id?: string;
    session_type?: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam' | 'presentation' | 'office_hours';
    status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    start_date?: string;
    end_date?: string;
  }): Promise<ClassSession[]> {
    const response = await apiClient.get<ClassSession[]>('/instructors/class-sessions', { params });
    return response.data!;
  }

  static async createClassSession(session: {
    course_id: string;
    batch_id: string;
    title: string;
    description?: string;
    session_date: string;
    start_time: string;
    end_time: string;
    session_type: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam' | 'presentation' | 'office_hours';
    meeting_link?: string;
    materials: Array<{
      name: string;
      url: string;
      type: 'document' | 'video' | 'presentation' | 'code' | 'other';
    }>;
  }): Promise<ClassSession> {
    const response = await apiClient.post<ClassSession>('/instructors/class-sessions', session);
    return response.data!;
  }

  static async updateClassSession(sessionId: string, updates: Partial<ClassSession>): Promise<ClassSession> {
    const response = await apiClient.put<ClassSession>(`/instructors/class-sessions/${sessionId}`, updates);
    return response.data!;
  }

  static async markSessionAttendance(sessionId: string, attendanceData: AttendanceSession): Promise<AttendanceResponse> {
    const response = await apiClient.post<AttendanceResponse>(`/instructors/class-sessions/${sessionId}/attendance`, attendanceData);
    return response.data!;
  }

  // File upload helpers
  static async uploadSessionMaterials(sessionId: string, files: File[]): Promise<Array<{ name: string; url: string; type: string }>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`materials[${index}]`, file);
    });

    const response = await apiClient.post<Array<{ name: string; url: string; type: string }>>(`/instructors/class-sessions/${sessionId}/materials`, formData);
    return response.data!;
  }

  static async uploadAssignmentAttachments(assignmentId: string, files: File[]): Promise<Array<{ name: string; url: string; type: string }>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    const response = await apiClient.post<Array<{ name: string; url: string; type: string }>>(`/instructors/assignments/${assignmentId}/attachments`, formData);
    return response.data!;
  }
}

export default instructorApi; 