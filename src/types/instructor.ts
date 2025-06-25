// Instructor API types for MEDH platform
import { AttendanceRecord, Course } from './common';

export interface ClassSchedule {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  timezone: string;
}

export interface InstructorCourse extends Course {
  schedule: ClassSchedule[];
  start_date: string;
  end_date: string;
}

export interface CourseStudent {
  student: {
    _id: string;
    full_name: string;
    email: string;
    enrollment_date: string;
    status: 'active' | 'inactive' | 'completed' | 'dropped';
  };
  progress: {
    completion_percentage: number;
    current_module: string;
    last_activity: string;
    grade_average: number;
  };
  attendance: {
    total_classes: number;
    attended_classes: number;
    attendance_rate: number;
  };
}

export interface InstructorStats {
  overview: {
    total_courses: number;
    active_students: number;
    completed_courses: number;
    average_rating: number;
  };
  recent_activity: {
    classes_this_week: number;
    new_enrollments: number;
    pending_assignments: number;
    unread_messages: number;
  };
  performance: {
    student_satisfaction: number;
    course_completion_rate: number;
    average_attendance_rate: number;
    revenue_this_month: number;
  };
}

export interface SessionMaterial {
  name: string;
  url: string;
  type: 'document' | 'video' | 'presentation' | 'code' | 'other';
}

export interface AttendanceSession {
  batch_id: string;
  session_date: string;
  session_type: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam' | 'presentation';
  session_title: string;
  session_duration_minutes?: number;
  attendance_records: AttendanceRecord[];
  session_notes?: string;
  meeting_link?: string;
  recording_link?: string;
  materials_shared?: SessionMaterial[];
}

export interface RevenueStats {
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  top_earning_courses: Array<{
    course_id: string;
    course_name: string;
    revenue: number;
    student_count: number;
  }>;
  payment_breakdown: {
    subscription: number;
    one_time: number;
    corporate: number;
  };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  student_count: number;
  course_completions: number;
  refunds: number;
  net_revenue: number;
}

export interface CourseBatch {
  _id: string;
  name: string;
  course_id: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  schedule: ClassSchedule[];
  student_capacity: number;
  enrolled_students: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meeting_details: {
    platform: string;
    meeting_id?: string;
    meeting_link?: string;
  };
}

export interface Assignment {
  _id: string;
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
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  _id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  submission_date: string;
  content?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  grade?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
}

export interface StudentPerformance {
  student_id: string;
  student_name: string;
  email: string;
  course_progress: number;
  attendance_rate: number;
  assignment_completion: number;
  average_grade: number;
  last_activity: string;
  engagement_score: number;
  strengths: string[];
  areas_for_improvement: string[];
}

export interface InstructorAnnouncement {
  _id: string;
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
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ClassSession {
  _id: string;
  course_id: string;
  batch_id: string;
  title: string;
  description?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  session_type: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam' | 'presentation' | 'office_hours';
  meeting_link?: string;
  recording_link?: string;
  materials: SessionMaterial[];
  attendance_marked: boolean;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}