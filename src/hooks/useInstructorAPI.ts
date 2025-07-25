// Instructor API hooks for React Query integration
import { useApiQuery, useApiMutation, queryKeys } from './useApiQuery';
import { InstructorAPI } from '../apis/instructor.api';
import {
  InstructorCourse,
  CourseStudent,
  InstructorStats,
  AttendanceSession,
  RevenueStats,
  MonthlyRevenue,
  CourseBatch,
  Assignment,
  AssignmentSubmission,
  StudentPerformance,
  InstructorAnnouncement,
  ClassSession,
} from '../types/instructor';

// Dashboard hooks
export const useInstructorCourses = () => {
  return useApiQuery(
    queryKeys.instructor.courses(),
    InstructorAPI.getCourses,
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useCourseStudents = (courseId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.instructor.courseStudents(courseId),
    () => InstructorAPI.getCourseStudents(courseId),
    { enabled: !!courseId && enabled }
  );
};

export const useInstructorDashboardStats = () => {
  return useApiQuery(
    queryKeys.instructor.stats(),
    InstructorAPI.getDashboardStats,
    { 
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    }
  );
};

export const useCourseDetails = (courseId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.instructor.course(courseId),
    () => InstructorAPI.getCourseDetails(courseId),
    { enabled: !!courseId && enabled }
  );
};

export const useCourseBatches = (courseId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.instructor.courseBatches(courseId),
    () => InstructorAPI.getCourseBatches(courseId),
    { enabled: !!courseId && enabled }
  );
};

// Attendance management hooks
export const useBatchAttendance = (batchId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.instructor.batchAttendance(batchId),
    () => InstructorAPI.getBatchAttendance(batchId),
    { enabled: !!batchId && enabled }
  );
};

export const useMarkAttendance = () => {
  return useApiMutation(
    InstructorAPI.markAttendanceSession,
    {
      successMessage: 'Attendance marked successfully',
      invalidateQueries: [
        queryKeys.instructor.attendance(),
        queryKeys.instructor.stats(),
      ],
    }
  );
};

export const useUpdateAttendance = () => {
  return useApiMutation(
    ({ attendanceId, updates }: { attendanceId: string; updates: any }) =>
      InstructorAPI.updateAttendanceRecord(attendanceId, updates),
    {
      successMessage: 'Attendance updated successfully',
      invalidateQueries: [queryKeys.instructor.attendance()],
    }
  );
};

// Revenue management hooks
export const useRevenueStats = () => {
  return useApiQuery(
    queryKeys.instructor.revenueStats(),
    InstructorAPI.getRevenueStats,
    { staleTime: 10 * 60 * 1000 } // 10 minutes
  );
};

export const useMonthlyRevenue = () => {
  return useApiQuery(
    queryKeys.instructor.monthlyRevenue(),
    InstructorAPI.getMonthlyRevenue,
    { staleTime: 30 * 60 * 1000 } // 30 minutes
  );
};

export const useRevenueDetails = (params: {
  startDate: string;
  endDate: string;
}) => {
  return useApiQuery(
    [...queryKeys.instructor.revenue(), 'details', params],
    () => InstructorAPI.getRevenueDetails(params),
    { 
      enabled: !!params.startDate && !!params.endDate,
      staleTime: 10 * 60 * 1000 
    }
  );
};

// Assignment management hooks
export const useInstructorAssignments = (params?: {
  course_id?: string;
  batch_id?: string;
  status?: 'draft' | 'published' | 'closed';
  page?: number;
  limit?: number;
}) => {
  return useApiQuery(
    [...queryKeys.instructor.assignments(), params],
    () => InstructorAPI.getAssignments(params)
  );
};

export const useCreateAssignment = () => {
  return useApiMutation(
    InstructorAPI.createAssignmentEnhanced,
    {
      successMessage: 'Assignment created successfully',
      invalidateQueries: [
        queryKeys.instructor.assignments(),
        queryKeys.instructor.stats(),
      ],
    }
  );
};

export const useAssignmentSubmissions = (assignmentId: string, enabled = true) => {
  return useApiQuery(
    queryKeys.instructor.assignmentSubmissions(assignmentId),
    () => InstructorAPI.getAssignmentSubmissions(assignmentId),
    { enabled: !!assignmentId && enabled }
  );
};

export const useGradeSubmission = () => {
  return useApiMutation(
    ({ submissionId, grading }: { submissionId: string; grading: any }) =>
      InstructorAPI.gradeAssignmentSubmission(submissionId, grading),
    {
      successMessage: 'Submission graded successfully',
      invalidateQueries: [
        queryKeys.instructor.assignments(),
        queryKeys.instructor.stats(),
      ],
    }
  );
};

// Student performance hooks
export const useStudentPerformance = (params?: {
  course_id?: string;
  batch_id?: string;
  student_id?: string;
  time_period?: 'week' | 'month' | 'quarter' | 'year';
}) => {
  return useApiQuery(
    [...queryKeys.instructor.performance(), params],
    () => InstructorAPI.getStudentPerformance(params),
    { staleTime: 5 * 60 * 1000 }
  );
};

// Communication hooks
export const useInstructorAnnouncements = (params?: {
  course_id?: string;
  batch_id?: string;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
}) => {
  return useApiQuery(
    [...queryKeys.instructor.announcements(), params],
    () => InstructorAPI.getAnnouncements(params)
  );
};

export const useCreateAnnouncement = () => {
  return useApiMutation(
    InstructorAPI.createAnnouncementEnhanced,
    {
      successMessage: 'Announcement created successfully',
      invalidateQueries: [queryKeys.instructor.announcements()],
    }
  );
};

// Class session management hooks
export const useClassSessions = (params?: {
  course_id?: string;
  batch_id?: string;
  session_type?: 'live_class' | 'demo' | 'workshop' | 'lab' | 'exam' | 'presentation' | 'office_hours';
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
}) => {
  return useApiQuery(
    [...queryKeys.instructor.sessions(), params],
    () => InstructorAPI.getClassSessions(params)
  );
};

export const useCreateClassSession = () => {
  return useApiMutation(
    InstructorAPI.createClassSession,
    {
      successMessage: 'Class session created successfully',
      invalidateQueries: [
        queryKeys.instructor.sessions(),
        queryKeys.instructor.stats(),
      ],
    }
  );
};

export const useUpdateClassSession = () => {
  return useApiMutation(
    ({ sessionId, updates }: { sessionId: string; updates: Partial<ClassSession> }) =>
      InstructorAPI.updateClassSession(sessionId, updates),
    {
      successMessage: 'Class session updated successfully',
      invalidateQueries: [queryKeys.instructor.sessions()],
    }
  );
};

export const useMarkSessionAttendance = () => {
  return useApiMutation(
    ({ sessionId, attendanceData }: { sessionId: string; attendanceData: AttendanceSession }) =>
      InstructorAPI.markSessionAttendance(sessionId, attendanceData),
    {
      successMessage: 'Session attendance marked successfully',
      invalidateQueries: [
        queryKeys.instructor.sessions(),
        queryKeys.instructor.attendance(),
        queryKeys.instructor.stats(),
      ],
    }
  );
};

// File upload hooks
export const useUploadSessionMaterials = () => {
  return useApiMutation(
    ({ sessionId, files }: { sessionId: string; files: File[] }) =>
      InstructorAPI.uploadSessionMaterials(sessionId, files),
    {
      successMessage: 'Materials uploaded successfully',
      invalidateQueries: [queryKeys.instructor.sessions()],
    }
  );
};

export const useUploadAssignmentAttachments = () => {
  return useApiMutation(
    ({ assignmentId, files }: { assignmentId: string; files: File[] }) =>
      InstructorAPI.uploadAssignmentAttachments(assignmentId, files),
    {
      successMessage: 'Attachments uploaded successfully',
      invalidateQueries: [queryKeys.instructor.assignments()],
    }
  );
};

// Composite hooks for complex operations
export const useInstructorDashboard = () => {
  const courses = useInstructorCourses();
  const stats = useInstructorDashboardStats();
  const revenueStats = useRevenueStats();
  
  return {
    courses,
    stats,
    revenueStats,
    isLoading: courses.isLoading || stats.isLoading || revenueStats.isLoading,
    isError: courses.isError || stats.isError || revenueStats.isError,
    error: courses.error || stats.error || revenueStats.error,
  };
};

export const useCourseManagement = (courseId: string) => {
  const courseDetails = useCourseDetails(courseId);
  const students = useCourseStudents(courseId);
  const batches = useCourseBatches(courseId);
  
  return {
    course: courseDetails.data,
    students: students.data,
    batches: batches.data,
    isLoading: courseDetails.isLoading || students.isLoading || batches.isLoading,
    isError: courseDetails.isError || students.isError || batches.isError,
    error: courseDetails.error || students.error || batches.error,
  };
};

export const useAssignmentManagement = (courseId?: string, batchId?: string) => {
  const assignments = useInstructorAssignments({ course_id: courseId, batch_id: batchId });
  const createAssignment = useCreateAssignment();
  const gradeSubmission = useGradeSubmission();
  
  return {
    assignments: assignments.data,
    createAssignment: createAssignment.mutate,
    gradeSubmission: gradeSubmission.mutate,
    isLoading: assignments.isPending,
    isCreating: createAssignment.isPending,
    isGrading: gradeSubmission.isPending,
    error: assignments.error || createAssignment.error || gradeSubmission.error,
  };
};

export const useAttendanceManagement = (batchId?: string) => {
  const attendance = useBatchAttendance(batchId!, !!batchId);
  const markAttendance = useMarkAttendance();
  const updateAttendance = useUpdateAttendance();
  
  return {
    attendance: attendance.data,
    markAttendance: markAttendance.mutate,
    updateAttendance: updateAttendance.mutate,
    isLoading: attendance.isPending,
    isMarking: markAttendance.isPending,
    isUpdating: updateAttendance.isPending,
    error: attendance.error || markAttendance.error || updateAttendance.error,
  };
};