// Parent API client for MEDH platform
import { ApiClient } from './apiClient';
import {
  ParentDashboardProfile,
  UpcomingClass,
  ChildProgress,
  ChildAttendance,
  ParentNotification,
  ChildLinkRequest,
  NotificationPreferences,
  ParentCommunication,
  TeacherMeeting,
} from '../types/parent';
import { ApiResponse, PaginatedResponse } from '../types/common';

export class ParentAPI {
  private static client = new ApiClient();

  // Dashboard endpoints
  static async getDashboardProfile(): Promise<ParentDashboardProfile> {
    const response = await this.client.get<ParentDashboardProfile>('/parent/dashboard/profile');
    if (!response.data) {
      throw new Error('No profile data received');
    }
    return response.data;
  }

  static async getUpcomingClasses(): Promise<UpcomingClass[]> {
    const response = await this.client.get<{ classes: UpcomingClass[] }>('/parent/dashboard/classes/upcoming');
    if (!response.data) {
      throw new Error('No classes data received');
    }
    return response.data.classes;
  }

  static async getChildProgress(childId: string): Promise<ChildProgress> {
    const response = await this.client.get<ChildProgress>(`/parent/dashboard/progress/${childId}`);
    if (!response.data) {
      throw new Error('No progress data received');
    }
    return response.data;
  }

  static async getChildAttendance(childId: string, params?: {
    startDate?: string;
    endDate?: string;
    courseId?: string;
  }): Promise<ChildAttendance> {
    const response = await this.client.get<ChildAttendance>(`/parent/dashboard/attendance/${childId}`, params);
    if (!response.data) {
      throw new Error('No attendance data received');
    }
    return response.data;
  }

  // Parent management endpoints
  static async getChildren(): Promise<ParentDashboardProfile> {
    const response = await this.client.get<ParentDashboardProfile>('/parent/children');
    return response.data;
  }

  static async linkChild(data: ChildLinkRequest): Promise<{ linkId: string; relationship: string }> {
    const response = await this.client.post<{ linkId: string; relationship: string }>('/parent/link-child', data);
    return response.data;
  }

  static async unlinkChild(childId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete<{ success: boolean; message: string }>(`/parent/unlink-child/${childId}`);
    return response.data;
  }

  // Notification endpoints
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
    type?: string;
    child_id?: string;
  }): Promise<{ notifications: ParentNotification[]; unread_count: number }> {
    const response = await this.client.get<{ notifications: ParentNotification[]; unread_count: number }>('/parent/notifications', params);
    return response.data;
  }

  static async markNotificationAsRead(notificationId: string): Promise<{ notification_id: string; read_at: Date }> {
    const response = await this.client.put<{ notification_id: string; read_at: Date }>(`/parent/notifications/${notificationId}/read`);
    return response.data;
  }

  static async markAllNotificationsAsRead(): Promise<{ marked_count: number }> {
    const response = await this.client.put<{ marked_count: number }>('/parent/notifications/mark-all-read');
    return response.data;
  }

  static async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(`/parent/notifications/${notificationId}`);
    return response.data;
  }

  static async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await this.client.get<NotificationPreferences>('/parent/notifications/preferences');
    return response.data;
  }

  static async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await this.client.put<NotificationPreferences>('/parent/notifications/preferences', preferences);
    return response.data;
  }

  // Academic tracking endpoints
  static async getTimetable(childId?: string): Promise<any> {
    const endpoint = childId ? `/parent/timetable/${childId}` : '/parent/timetable';
    const response = await this.client.get(endpoint);
    return response.data;
  }

  static async getAttendanceReports(params?: {
    child_id?: string;
    start_date?: string;
    end_date?: string;
    course_id?: string;
  }): Promise<any> {
    const response = await this.client.get('/parent/attendance', params);
    return response.data;
  }

  static async getClassRecordings(params?: {
    child_id?: string;
    course_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.client.get('/parent/classes/recordings', params);
    return response.data;
  }

  static async getPerformanceTracking(childId: string, params?: {
    course_id?: string;
    time_period?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<any> {
    const response = await this.client.get(`/parent/performance/tracking/${childId}`, params);
    return response.data;
  }

  static async getPendingAssignments(childId?: string): Promise<any> {
    const endpoint = childId ? `/parent/assignments/pending/${childId}` : '/parent/assignments/pending';
    const response = await this.client.get(endpoint);
    return response.data;
  }

  static async getGradeReports(params?: {
    child_id?: string;
    course_id?: string;
    assignment_type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    const response = await this.client.get('/parent/grades', params);
    return response.data;
  }

  static async getChildCourses(childId: string): Promise<any> {
    const response = await this.client.get(`/parent/children/${childId}/courses`);
    return response.data;
  }

  static async getChildAssignments(childId: string, params?: {
    course_id?: string;
    status?: 'pending' | 'submitted' | 'graded' | 'overdue';
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.client.get(`/parent/children/${childId}/assignments`, params);
    return response.data;
  }

  // Communication endpoints
  static async getMessages(params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
    recipient_type?: 'instructor' | 'admin' | 'support';
    child_id?: string;
  }): Promise<PaginatedResponse<ParentCommunication>> {
    const response = await this.client.get<PaginatedResponse<ParentCommunication>>('/parent/messages', params);
    return response;
  }

  static async sendMessage(message: {
    recipient_type: 'instructor' | 'admin' | 'support';
    recipient_id: string;
    subject: string;
    message: string;
    child_id?: string;
  }): Promise<ParentCommunication> {
    const response = await this.client.post<ParentCommunication>('/parent/messages', message);
    return response.data;
  }

  static async markMessageAsRead(messageId: string): Promise<{ success: boolean }> {
    const response = await this.client.put<{ success: boolean }>(`/parent/messages/${messageId}/read`);
    return response.data;
  }

  static async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(`/parent/messages/${messageId}`);
    return response.data;
  }

  static async getAnnouncements(params?: {
    child_id?: string;
    course_id?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.client.get('/parent/announcements', params);
    return response.data;
  }

  // Teacher meeting endpoints
  static async getTeacherMeetings(params?: {
    child_id?: string;
    instructor_id?: string;
    status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    date_from?: string;
    date_to?: string;
  }): Promise<TeacherMeeting[]> {
    const response = await this.client.get<TeacherMeeting[]>('/parent/meetings', params);
    return response.data;
  }

  static async scheduleTeacherMeeting(meeting: {
    instructor_id: string;
    child_id: string;
    meeting_date: string;
    meeting_time: string;
    duration_minutes: number;
    purpose: string;
  }): Promise<TeacherMeeting> {
    const response = await this.client.post<TeacherMeeting>('/parent/meetings/schedule', meeting);
    return response.data;
  }

  static async cancelTeacherMeeting(meetingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.put<{ success: boolean; message: string }>(`/parent/meetings/${meetingId}/cancel`, { reason });
    return response.data;
  }

  static async rescheduleTeacherMeeting(meetingId: string, data: {
    meeting_date: string;
    meeting_time: string;
    reason?: string;
  }): Promise<TeacherMeeting> {
    const response = await this.client.put<TeacherMeeting>(`/parent/meetings/${meetingId}/reschedule`, data);
    return response.data;
  }

  // Payment and billing endpoints
  static async getPaymentHistory(params?: {
    start_date?: string;
    end_date?: string;
    status?: 'pending' | 'completed' | 'failed' | 'refunded';
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.client.get('/parent/payments/history', params);
    return response.data;
  }

  static async getOutstandingPayments(): Promise<any> {
    const response = await this.client.get('/parent/payments/outstanding');
    return response.data;
  }

  static async makePayment(payment: {
    amount: number;
    currency: string;
    description: string;
    child_id?: string;
    course_id?: string;
    payment_method: string;
  }): Promise<any> {
    const response = await this.client.post('/parent/payments/make', payment);
    return response.data;
  }

  static async getPaymentMethods(): Promise<any> {
    const response = await this.client.get('/parent/payments/methods');
    return response.data;
  }

  static async addPaymentMethod(method: {
    type: 'card' | 'bank' | 'wallet';
    details: any;
    is_default?: boolean;
  }): Promise<any> {
    const response = await this.client.post('/parent/payments/methods', method);
    return response.data;
  }

  static async removePaymentMethod(methodId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(`/parent/payments/methods/${methodId}`);
    return response.data;
  }

  // Profile management endpoints
  static async updateProfile(data: {
    full_name?: string;
    phone_numbers?: Array<{
      country: string;
      number: string;
      type?: string;
    }>;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    emergency_contact?: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  }): Promise<any> {
    const response = await this.client.put('/parent/profile', data);
    return response.data;
  }

  static async uploadProfileImage(file: File): Promise<{ image_url: string }> {
    const formData = new FormData();
    formData.append('profile_image', file);
    
    const response = await this.client.post<{ image_url: string }>('/parent/profile/image', formData);
    return response.data;
  }

  static async deleteProfileImage(): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>('/parent/profile/image');
    return response.data;
  }
}