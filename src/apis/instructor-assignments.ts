import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';

/**
 * Instructor Assignment Type Definitions
 */
export type TAssignmentType = 'mentor' | 'tutor' | 'advisor' | 'supervisor';
export type TEnrollmentType = 'individual' | 'batch' | 'corporate' | 'group' | 'scholarship' | 'trial';
export type TEnrollmentStatus = 'active' | 'completed' | 'cancelled' | 'on_hold' | 'expired';

// Re-export batch types from batch.ts to avoid conflicts
export type { TBatchStatus, IBatchSchedule, IBatchWithDetails, IBatchQueryParams } from './batch';

/**
 * Individual Assignment Interfaces
 */
export interface IIndividualAssignment {
  student_id: string;
  instructor_id: string;
  assignment_type: TAssignmentType;
  assignment_date: Date;
  assignment_notes?: string;
}

export interface IIndividualAssignmentInput {
  instructor_id: string;
  student_id: string;
  assignment_type: TAssignmentType;
  notes?: string;
}

export interface IStudentWithAssignment {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
  assigned_instructor?: string;
  instructor_assignment_date?: Date;
  instructor_assignment_type?: TAssignmentType;
  instructor_assignment_notes?: string;
  instructor_details?: {
    _id: string;
    full_name: string;
    email: string;
  };
}

export interface IInstructorWithStudents {
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  assigned_students: IStudentWithAssignment[];
  total_students: number;
}

/**
 * Enrollment Interfaces
 */
export interface IEnrollment {
  _id?: string;
  student: string; // Student ID
  course: string;  // Course ID
  batch?: string;  // Batch ID (optional for individual enrollments)
  enrollment_type: TEnrollmentType;
  status: TEnrollmentStatus;
  enrollment_date: Date;
  access_expiry_date?: Date;
  enrollment_source?: string;
  payment_details?: {
    amount: number;
    currency: string;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IEnrollmentInput {
  courseId: string;
  batchId?: string;
  enrollment_type: TEnrollmentType;
  enrollment_source?: string;
  paymentDetails?: {
    amount: number;
    currency: string;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
  };
}

export interface IEnrollmentWithDetails extends IEnrollment {
  student_details?: {
    _id: string;
    full_name: string;
    email: string;
  };
  course_details?: {
    _id: string;
    course_title: string;
    course_category: string;
  };
  batch_details?: {
    _id: string;
    batch_name: string;
    batch_code: string;
  };
}

/**
 * Query Parameters Interfaces
 */
export interface IAssignmentQueryParams {
  page?: number;
  limit?: number;
  assignment_type?: TAssignmentType;
  instructor_id?: string;
  student_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Response Interfaces
 */
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAssignmentStatistics {
  total_assignments: number;
  by_type: Record<TAssignmentType, number>;
  instructor_workload: Array<{
    instructor_id: string;
    instructor_name: string;
    individual_assignments: number;
    batch_assignments: number;
    total_students: number;
  }>;
  unassigned_students: number;
}

/**
 * Individual Assignment API
 */
export const individualAssignmentAPI = {
  /**
   * Assign instructor to student
   * @param assignmentData - Assignment data
   * @returns Promise with assignment response
   */
  assignInstructorToStudent: async (assignmentData: IIndividualAssignmentInput) => {
    return apiClient.post<IApiResponse<IIndividualAssignment>>(
      `${apiBaseUrl}/auth/assign-instructor-to-student`,
      assignmentData
    );
  },

  /**
   * Get students assigned to instructor
   * @param instructorId - Instructor ID
   * @param params - Query parameters
   * @returns Promise with assigned students response
   */
  getInstructorStudents: async (instructorId: string, params: IAssignmentQueryParams = {}) => {
    if (!instructorId) throw new Error('Instructor ID cannot be empty');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IInstructorWithStudents>>(
      `${apiBaseUrl}/auth/instructor-students/${instructorId}${queryString}`
    );
  },

  /**
   * Unassign instructor from student
   * @param studentId - Student ID
   * @returns Promise with unassignment response
   */
  unassignInstructorFromStudent: async (studentId: string) => {
    if (!studentId) throw new Error('Student ID cannot be empty');
    return apiClient.delete<IApiResponse<{ 
      student_id: string; 
      student_name: string; 
      previous_instructor: { id: string; name: string; email: string; };
    }>>(
      `${apiBaseUrl}/auth/unassign-instructor-from-student/${studentId}`
    );
  },

  /**
   * Get all students with instructor information
   * @param params - Query parameters
   * @returns Promise with students with instructors response
   */
  getAllStudentsWithInstructors: async (params: IAssignmentQueryParams = {}) => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IStudentWithAssignment[]>>(
      `${apiBaseUrl}/auth/get-all-students-with-instructors${queryString}`
    );
  },

  /**
   * Update individual assignment details
   * @param studentId - Student ID
   * @param updateData - Update data
   * @returns Promise with updated assignment response
   */
  updateIndividualAssignment: async (studentId: string, updateData: {
    assignment_type?: TAssignmentType;
    notes?: string;
  }) => {
    if (!studentId) throw new Error('Student ID cannot be empty');
    return apiClient.put<IApiResponse<IIndividualAssignment>>(
      `${apiBaseUrl}/auth/update-individual-assignment/${studentId}`,
      updateData
    );
  },

  /**
   * Get assignment statistics
   * @returns Promise with assignment statistics response
   */
  getAssignmentStatistics: async () => {
    return apiClient.get<IApiResponse<IAssignmentStatistics>>(
      `${apiBaseUrl}/auth/assignment-statistics`
    );
  },

  /**
   * Get instructor workload summary
   * @param instructorId - Instructor ID
   * @returns Promise with instructor workload response
   */
  getInstructorWorkload: async (instructorId: string) => {
    if (!instructorId) throw new Error('Instructor ID cannot be empty');
    return apiClient.get<IApiResponse<{
      instructor_details: {
        _id: string;
        full_name: string;
        email: string;
      };
      batch_assignments: number;
      individual_assignments: number;
      total_students: number;
      active_batches: any[];
      assigned_students: IStudentWithAssignment[];
    }>>(
      `${apiBaseUrl}/auth/instructor-workload/${instructorId}`
    );
  }
};

/**
 * Enrollment Management API
 */
export const enrollmentAPI = {
  /**
   * Enroll student in course/batch
   * @param studentId - Student ID
   * @param enrollmentData - Enrollment data
   * @returns Promise with enrollment response
   */
  enrollStudent: async (studentId: string, enrollmentData: IEnrollmentInput) => {
    if (!studentId) throw new Error('Student ID cannot be empty');
    return apiClient.post<IApiResponse<IEnrollmentWithDetails>>(
      `${apiBaseUrl}/enrolled/student/${studentId}/enroll`,
      enrollmentData
    );
  },

  /**
   * Get enrollment details by ID
   * @param enrollmentId - Enrollment ID
   * @returns Promise with enrollment details response
   */
  getEnrollmentById: async (enrollmentId: string) => {
    if (!enrollmentId) throw new Error('Enrollment ID cannot be empty');
    return apiClient.get<IApiResponse<IEnrollmentWithDetails>>(
      `${apiBaseUrl}/enrolled/${enrollmentId}`
    );
  },

  /**
   * Update enrollment details
   * @param enrollmentId - Enrollment ID
   * @param updateData - Update data
   * @returns Promise with updated enrollment response
   */
  updateEnrollment: async (enrollmentId: string, updateData: {
    status?: TEnrollmentStatus;
    access_expiry_date?: Date | string;
    batch?: string;
  }) => {
    if (!enrollmentId) throw new Error('Enrollment ID cannot be empty');
    return apiClient.put<IApiResponse<IEnrollmentWithDetails>>(
      `${apiBaseUrl}/enrolled/${enrollmentId}`,
      updateData
    );
  },

  /**
   * Cancel enrollment
   * @param enrollmentId - Enrollment ID
   * @returns Promise with cancellation response
   */
  cancelEnrollment: async (enrollmentId: string) => {
    if (!enrollmentId) throw new Error('Enrollment ID cannot be empty');
    return apiClient.delete<IApiResponse<{ message: string }>>(
      `${apiBaseUrl}/enrolled/${enrollmentId}`
    );
  },

  /**
   * Get student enrollments
   * @param studentId - Student ID
   * @param params - Query parameters
   * @returns Promise with student enrollments response
   */
  getStudentEnrollments: async (studentId: string, params: {
    page?: number;
    limit?: number;
    status?: TEnrollmentStatus;
    enrollment_type?: TEnrollmentType;
  } = {}) => {
    if (!studentId) throw new Error('Student ID cannot be empty');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IEnrollmentWithDetails[]>>(
      `${apiBaseUrl}/enrolled/student/${studentId}${queryString}`
    );
  },

  /**
   * Transfer student to different batch
   * @param enrollmentId - Enrollment ID
   * @param newBatchId - New batch ID
   * @returns Promise with transfer response
   */
  transferStudentToBatch: async (enrollmentId: string, newBatchId: string) => {
    if (!enrollmentId) throw new Error('Enrollment ID cannot be empty');
    if (!newBatchId) throw new Error('New batch ID cannot be empty');
    return apiClient.put<IApiResponse<IEnrollmentWithDetails>>(
      `${apiBaseUrl}/enrolled/${enrollmentId}/transfer-batch`,
      { new_batch_id: newBatchId }
    );
  }
};

/**
 * Assignment Utility Functions
 */
export const assignmentUtils = {
  /**
   * Format assignment type for display
   * @param type - Assignment type
   * @returns Formatted type string
   */
  formatAssignmentType: (type: TAssignmentType): string => {
    const typeMap: Record<TAssignmentType, string> = {
      mentor: 'Mentor',
      tutor: 'Tutor',
      advisor: 'Academic Advisor',
      supervisor: 'Project Supervisor'
    };
    return typeMap[type] || type;
  },

  /**
   * Check if student can be enrolled in batch
   * @param batch - Batch details
   * @returns Enrollment eligibility
   */
  canEnrollInBatch: (batch: any): { canEnroll: boolean; reason?: string } => {
    if (batch.status === 'Cancelled') {
      return { canEnroll: false, reason: 'Batch has been cancelled' };
    }
    
    if (batch.status === 'Completed') {
      return { canEnroll: false, reason: 'Batch has already completed' };
    }
    
    if (batch.enrolled_students >= batch.capacity) {
      return { canEnroll: false, reason: 'Batch has reached maximum capacity' };
    }
    
    if (new Date(batch.start_date) < new Date()) {
      return { canEnroll: false, reason: 'Batch has already started' };
    }
    
    return { canEnroll: true };
  }
};

// Import and re-export batch API and utilities from batch.ts to avoid conflicts
export { batchAPI, batchUtils as instructorAssignmentUtils } from './batch'; 