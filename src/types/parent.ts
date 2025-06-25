// Parent API types for MEDH platform
import { PhoneNumber, Course, CourseProgress, Achievement } from './common';

export interface Child {
  id: string;
  full_name: string;
  age?: number;
  grade?: string;
  school?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'suspended';
  current_courses: Course[];
  performance_summary: {
    overall_grade: number;
    attendance_rate: number;
    assignment_completion: number;
  };
}

export interface ParentPermissions {
  can_view_grades: boolean;
  can_view_attendance: boolean;
  can_view_performance: boolean;
  can_communicate_with_instructors: boolean;
  can_schedule_meetings: boolean;
  can_make_payments: boolean;
}

export interface ParentDashboardProfile {
  parent: {
    id: string;
    full_name: string;
    email: string;
    phone_numbers: PhoneNumber[];
    user_image?: {
      upload_date: string;
    };
    status: string;
    member_since: string;
    last_login: string;
  };
  children: Child[];
  summary: {
    total_children: number;
    active_children: number;
    permissions: ParentPermissions;
  };
}

export interface UpcomingClass {
  id: string;
  title: string;
  subject: string;
  instructor_name: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  type: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface ChildProgress {
  child_id: string;
  overall_progress: number;
  current_courses: CourseProgress[];
  performance_metrics: {
    grade_average: number;
    attendance_rate: number;
    assignment_completion_rate: number;
    improvement_trend: 'improving' | 'stable' | 'declining';
  };
  recent_achievements: Achievement[];
}

export interface AttendanceRecord {
  student_id: string;
  date: string;
  class_id: string;
  class_title: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  join_time?: string;
  leave_time?: string;
  duration_minutes?: number;
  notes?: string;
}

export interface ChildAttendance {
  child_id: string;
  attendance_rate: number;
  recent_attendance: AttendanceRecord[];
  monthly_summary: Record<string, {
    total_classes: number;
    attended_classes: number;
    attendance_percentage: number;
  }>;
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  child_id?: string;
  read: boolean;
  created_at: string;
  action_required: boolean;
  action_url?: string;
}

export interface ChildLinkRequest {
  childId: string;
  relationship: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    attendance: boolean;
    grades: boolean;
    assignments: boolean;
    announcements: boolean;
    events: boolean;
  };
}

export interface ParentCommunication {
  id: string;
  recipient_type: 'instructor' | 'admin' | 'support';
  recipient_id: string;
  recipient_name: string;
  subject: string;
  message: string;
  child_id?: string;
  sent_at: string;
  read: boolean;
  replied_at?: string;
  thread_id?: string;
}

export interface TeacherMeeting {
  id: string;
  instructor_id: string;
  instructor_name: string;
  child_id: string;
  meeting_date: string;
  meeting_time: string;
  duration_minutes: number;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_link?: string;
  notes?: string;
}