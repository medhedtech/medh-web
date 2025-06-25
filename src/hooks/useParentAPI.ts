// Parent API hooks for React Query integration
import { useApiQuery, useApiMutation, queryKeys } from './useApiQuery';
import { ParentAPI } from '../apis/parent.api';
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

// Dashboard hooks
export const useParentDashboard = () => {
  return useApiQuery(
    queryKeys.parent.profile(),
    ParentAPI.getDashboardProfile,
    { staleTime: 2 * 60 * 1000 } // 2 minutes
  );
};

export const useUpcomingClasses = () => {
  return useApiQuery(
    queryKeys.parent.upcomingClasses(),
    ParentAPI.getUpcomingClasses,
    { refetchInterval: 5 * 60 * 1000 } // Refresh every 5 minutes
  );
};

export const useChildProgress = (childId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.parent.childProgress(childId),
    () => ParentAPI.getChildProgress(childId),
    { enabled: !!childId && enabled }
  );
};

export const useChildAttendance = (
  childId: string,
  params?: {
    startDate?: string;
    endDate?: string;
    courseId?: string;
  },
  enabled = true
) => {
  return useApiQuery(
    [...queryKeys.parent.childAttendance(childId), params],
    () => ParentAPI.getChildAttendance(childId, params),
    { enabled: !!childId && enabled }
  );
};

// Children management hooks
export const useChildren = () => {
  return useApiQuery(
    queryKeys.parent.children(),
    ParentAPI.getChildren
  );
};

export const useLinkChild = () => {
  return useApiMutation(
    ParentAPI.linkChild,
    {
      successMessage: 'Child linked successfully',
      invalidateQueries: [
        queryKeys.parent.children(),
        queryKeys.parent.profile(),
      ],
    }
  );
};

export const useUnlinkChild = () => {
  return useApiMutation(
    ParentAPI.unlinkChild,
    {
      successMessage: 'Child unlinked successfully',
      invalidateQueries: [
        queryKeys.parent.children(),
        queryKeys.parent.profile(),
      ],
    }
  );
};

// Notification hooks
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  type?: string;
  child_id?: string;
}) => {
  return useApiQuery(
    [...queryKeys.parent.notifications(), params],
    () => ParentAPI.getNotifications(params),
    { refetchInterval: 30 * 1000 } // Refresh every 30 seconds for real-time updates
  );
};

export const useMarkNotificationAsRead = () => {
  return useApiMutation(
    ParentAPI.markNotificationAsRead,
    {
      successMessage: 'Notification marked as read',
      invalidateQueries: [queryKeys.parent.notifications()],
    }
  );
};

export const useMarkAllNotificationsAsRead = () => {
  return useApiMutation(
    ParentAPI.markAllNotificationsAsRead,
    {
      successMessage: 'All notifications marked as read',
      invalidateQueries: [queryKeys.parent.notifications()],
    }
  );
};

export const useDeleteNotification = () => {
  return useApiMutation(
    ParentAPI.deleteNotification,
    {
      successMessage: 'Notification deleted',
      invalidateQueries: [queryKeys.parent.notifications()],
    }
  );
};

export const useNotificationPreferences = () => {
  return useApiQuery(
    [...queryKeys.parent.notifications(), 'preferences'],
    ParentAPI.getNotificationPreferences
  );
};

export const useUpdateNotificationPreferences = () => {
  return useApiMutation(
    ParentAPI.updateNotificationPreferences,
    {
      successMessage: 'Notification preferences updated',
      invalidateQueries: [
        [...queryKeys.parent.notifications(), 'preferences'],
      ],
    }
  );
};

// Academic tracking hooks
export const useTimetable = (childId?: string) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'timetable', childId],
    () => ParentAPI.getTimetable(childId),
    { staleTime: 10 * 60 * 1000 } // 10 minutes
  );
};

export const useAttendanceReports = (params?: {
  child_id?: string;
  start_date?: string;
  end_date?: string;
  course_id?: string;
}) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'attendance-reports', params],
    () => ParentAPI.getAttendanceReports(params)
  );
};

export const useClassRecordings = (params?: {
  child_id?: string;
  course_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'class-recordings', params],
    () => ParentAPI.getClassRecordings(params)
  );
};

export const usePerformanceTracking = (
  childId: string,
  params?: {
    course_id?: string;
    time_period?: 'week' | 'month' | 'quarter' | 'year';
  },
  enabled = true
) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'performance', childId, params],
    () => ParentAPI.getPerformanceTracking(childId, params),
    { enabled: !!childId && enabled }
  );
};

export const usePendingAssignments = (childId?: string) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'pending-assignments', childId],
    () => ParentAPI.getPendingAssignments(childId),
    { refetchInterval: 5 * 60 * 1000 } // Refresh every 5 minutes
  );
};

export const useGradeReports = (params?: {
  child_id?: string;
  course_id?: string;
  assignment_type?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'grade-reports', params],
    () => ParentAPI.getGradeReports(params)
  );
};

// Communication hooks
export const useMessages = (params?: {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  recipient_type?: 'instructor' | 'admin' | 'support';
  child_id?: string;
}) => {
  return useApiQuery(
    [...queryKeys.parent.messages(), params],
    () => ParentAPI.getMessages(params),
    { refetchInterval: 30 * 1000 } // Refresh every 30 seconds
  );
};

export const useSendMessage = () => {
  return useApiMutation(
    ParentAPI.sendMessage,
    {
      successMessage: 'Message sent successfully',
      invalidateQueries: [queryKeys.parent.messages()],
    }
  );
};

export const useMarkMessageAsRead = () => {
  return useApiMutation(
    ParentAPI.markMessageAsRead,
    {
      invalidateQueries: [queryKeys.parent.messages()],
    }
  );
};

export const useDeleteMessage = () => {
  return useApiMutation(
    ParentAPI.deleteMessage,
    {
      successMessage: 'Message deleted',
      invalidateQueries: [queryKeys.parent.messages()],
    }
  );
};

export const useAnnouncements = (params?: {
  child_id?: string;
  course_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  page?: number;
  limit?: number;
}) => {
  return useApiQuery(
    [...queryKeys.parent.all(), 'announcements', params],
    () => ParentAPI.getAnnouncements(params),
    { refetchInterval: 2 * 60 * 1000 } // Refresh every 2 minutes
  );
};

// Teacher meeting hooks
export const useTeacherMeetings = (params?: {
  child_id?: string;
  instructor_id?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  date_from?: string;
  date_to?: string;
}) => {
  return useApiQuery(
    [...queryKeys.parent.meetings(), params],
    () => ParentAPI.getTeacherMeetings(params)
  );
};

export const useScheduleTeacherMeeting = () => {
  return useApiMutation(
    ParentAPI.scheduleTeacherMeeting,
    {
      successMessage: 'Meeting scheduled successfully',
      invalidateQueries: [queryKeys.parent.meetings()],
    }
  );
};

export const useCancelTeacherMeeting = () => {
  return useApiMutation(
    ({ meetingId, reason }: { meetingId: string; reason?: string }) =>
      ParentAPI.cancelTeacherMeeting(meetingId, reason),
    {
      successMessage: 'Meeting cancelled successfully',
      invalidateQueries: [queryKeys.parent.meetings()],
    }
  );
};

export const useRescheduleTeacherMeeting = () => {
  return useApiMutation(
    ({ meetingId, data }: { meetingId: string; data: any }) =>
      ParentAPI.rescheduleTeacherMeeting(meetingId, data),
    {
      successMessage: 'Meeting rescheduled successfully',
      invalidateQueries: [queryKeys.parent.meetings()],
    }
  );
};

// Payment hooks
export const usePaymentHistory = (params?: {
  start_date?: string;
  end_date?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  page?: number;
  limit?: number;
}) => {
  return useApiQuery(
    [...queryKeys.parent.payments(), 'history', params],
    () => ParentAPI.getPaymentHistory(params)
  );
};

export const useOutstandingPayments = () => {
  return useApiQuery(
    [...queryKeys.parent.payments(), 'outstanding'],
    ParentAPI.getOutstandingPayments,
    { refetchInterval: 5 * 60 * 1000 } // Refresh every 5 minutes
  );
};

export const useMakePayment = () => {
  return useApiMutation(
    ParentAPI.makePayment,
    {
      successMessage: 'Payment processed successfully',
      invalidateQueries: [
        [...queryKeys.parent.payments(), 'history'],
        [...queryKeys.parent.payments(), 'outstanding'],
      ],
    }
  );
};

export const usePaymentMethods = () => {
  return useApiQuery(
    [...queryKeys.parent.payments(), 'methods'],
    ParentAPI.getPaymentMethods
  );
};

export const useAddPaymentMethod = () => {
  return useApiMutation(
    ParentAPI.addPaymentMethod,
    {
      successMessage: 'Payment method added successfully',
      invalidateQueries: [
        [...queryKeys.parent.payments(), 'methods'],
      ],
    }
  );
};

export const useRemovePaymentMethod = () => {
  return useApiMutation(
    ParentAPI.removePaymentMethod,
    {
      successMessage: 'Payment method removed successfully',
      invalidateQueries: [
        [...queryKeys.parent.payments(), 'methods'],
      ],
    }
  );
};

// Profile management hooks
export const useUpdateProfile = () => {
  return useApiMutation(
    ParentAPI.updateProfile,
    {
      successMessage: 'Profile updated successfully',
      invalidateQueries: [
        queryKeys.parent.profile(),
        queryKeys.parent.children(),
      ],
    }
  );
};

export const useUploadProfileImage = () => {
  return useApiMutation(
    ParentAPI.uploadProfileImage,
    {
      successMessage: 'Profile image updated successfully',
      invalidateQueries: [queryKeys.parent.profile()],
    }
  );
};

export const useDeleteProfileImage = () => {
  return useApiMutation(
    ParentAPI.deleteProfileImage,
    {
      successMessage: 'Profile image removed successfully',
      invalidateQueries: [queryKeys.parent.profile()],
    }
  );
};