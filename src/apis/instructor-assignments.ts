import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';

/**
 * Instructor Assignment Type Definitions
 */
export type TAssignmentType = 'mentor' | 'tutor' | 'advisor' | 'supervisor';
export type TBatchStatus = 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
export type TEnrollmentType = 'individual' | 'batch' | 'corporate' | 'group' | 'scholarship' | 'trial';
export type TEnrollmentStatus = 'active' | 'completed' | 'cancelled' | 'on_hold' | 'expired';

/**
 * Batch Management Interfaces
 */
export interface IBatchSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // Format: "HH:MM"
  end_time: string;   // Format: "HH:MM"
}

export interface IBatch {
  _id?: string;
  batch_name: string;
  batch_code?: string;
  course: string; // Course ID
  status: TBatchStatus;
  start_date: Date;
  end_date: Date;
  capacity: number;
  enrolled_students: number;
  assigned_instructor: string; // Instructor ID
  schedule: IBatchSchedule[];
  batch_notes?: string;
  created_by: string; // Admin user ID
  createdAt?: string;
  updatedAt?: string;
}

export interface IBatchWithDetails extends IBatch {
  course_details?: {
    _id: string;
    course_title: string;
    course_category: string;
  };
  instructor_details?: {
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
  available_spots: number;
}

export interface IBatchCreateInput {
  batch_name: string;
  batch_code?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  assigned_instructor: string;
  status?: TBatchStatus;
  batch_notes?: string;
  schedule: IBatchSchedule[];
}

export interface IBatchUpdateInput {
  batch_name?: string;
  start_date?: string;
  end_date?: string;
  capacity?: number;
  assigned_instructor?: string;
  status?: TBatchStatus;
  batch_notes?: string;
  schedule?: IBatchSchedule[];
}

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
export interface IBatchQueryParams {
  page?: number;
  limit?: number;
  status?: TBatchStatus;
  instructor_id?: string;
  search?: string;
  start_date_from?: string;
  start_date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

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

export interface IBatchStatistics {
  total_batches: number;
  active_batches: number;
  upcoming_batches: number;
  completed_batches: number;
  total_enrolled_students: number;
  average_capacity_utilization: number;
  instructor_workload: Array<{
    instructor_id: string;
    instructor_name: string;
    active_batches: number;
    total_students: number;
  }>;
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
 * Batch Management API
 */
export const batchAPI = {
  /**
   * Create a new batch for a course
   * @param courseId - Course ID
   * @param batchData - Batch creation data
   * @returns Promise with created batch response
   */
  createBatch: async (courseId: string, batchData: IBatchCreateInput) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    return apiClient.post<IApiResponse<IBatchWithDetails>>(
      `${apiBaseUrl}/batches/courses/${courseId}/batches`,
      batchData
    );
  },

  /**
   * Get all batches for a course
   * @param courseId - Course ID
   * @param params - Query parameters
   * @returns Promise with batches list response
   */
  getBatchesByCourse: async (courseId: string, params: IBatchQueryParams = {}) => {
    if (!courseId) throw new Error('Course ID cannot be empty');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IBatchWithDetails[]>>(
      `${apiBaseUrl}/batches/courses/${courseId}/batches${queryString}`
    );
  },

  /**
   * Get batch details by ID
   * @param batchId - Batch ID
   * @returns Promise with batch details response
   */
  getBatchById: async (batchId: string) => {
    if (!batchId) throw new Error('Batch ID cannot be empty');
    return apiClient.get<IApiResponse<IBatchWithDetails>>(
      `${apiBaseUrl}/batches/${batchId}`
    );
  },

  /**
   * Update batch details
   * @param batchId - Batch ID
   * @param updateData - Updated batch data
   * @returns Promise with updated batch response
   */
  updateBatch: async (batchId: string, updateData: IBatchUpdateInput) => {
    if (!batchId) throw new Error('Batch ID cannot be empty');
    return apiClient.put<IApiResponse<IBatchWithDetails>>(
      `${apiBaseUrl}/batches/${batchId}`,
      updateData
    );
  },

  /**
   * Delete a batch
   * @param batchId - Batch ID
   * @returns Promise with deletion response
   */
  deleteBatch: async (batchId: string) => {
    if (!batchId) throw new Error('Batch ID cannot be empty');
    return apiClient.delete<IApiResponse<{ message: string }>>(
      `${apiBaseUrl}/batches/${batchId}`
    );
  },

  /**
   * Assign instructor to batch
   * @param batchId - Batch ID
   * @param instructorId - Instructor ID
   * @returns Promise with assignment response
   */
  assignInstructorToBatch: async (batchId: string, instructorId: string) => {
    if (!batchId) throw new Error('Batch ID cannot be empty');
    if (!instructorId) throw new Error('Instructor ID cannot be empty');
    return apiClient.put<IApiResponse<IBatchWithDetails>>(
      `${apiBaseUrl}/batches/${batchId}/assign-instructor/${instructorId}`
    );
  },

  /**
   * Get students in a batch
   * @param batchId - Batch ID
   * @param params - Query parameters
   * @returns Promise with students list response
   */
  getBatchStudents: async (batchId: string, params: { page?: number; limit?: number } = {}) => {
    if (!batchId) throw new Error('Batch ID cannot be empty');
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IEnrollmentWithDetails[]>>(
      `${apiBaseUrl}/batches/${batchId}/students${queryString}`
    );
  },

  /**
   * Get batch statistics
   * @param courseId - Optional course ID to filter by
   * @returns Promise with batch statistics response
   */
  getBatchStatistics: async (courseId?: string) => {
    const params = courseId ? { course_id: courseId } : {};
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IApiResponse<IBatchStatistics>>(
      `${apiBaseUrl}/batches/statistics${queryString}`
    );
  },

  /**
   * Get batches by instructor
   * @param instructorId - Instructor ID
   * @param params - Query parameters
   * @returns Promise with instructor's batches response
   */
  getBatchesByInstructor: async (instructorId: string, params: IBatchQueryParams = {}) => {
    if (!instructorId) throw new Error('Instructor ID cannot be empty');
    const queryString = apiUtils.buildQueryString({ ...params, instructor_id: instructorId });
    return apiClient.get<IApiResponse<IBatchWithDetails[]>>(
      `${apiBaseUrl}/batches/instructor/${instructorId}${queryString}`
    );
  }
};

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
      `${apiBaseUrl}/v1/auth/assign-instructor-to-student`,
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
      `${apiBaseUrl}/v1/auth/instructor-students/${instructorId}${queryString}`
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
      `${apiBaseUrl}/v1/auth/unassign-instructor-from-student/${studentId}`
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
      `${apiBaseUrl}/v1/auth/get-all-students-with-instructors${queryString}`
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
      `${apiBaseUrl}/v1/auth/update-individual-assignment/${studentId}`,
      updateData
    );
  },

  /**
   * Get assignment statistics
   * @returns Promise with assignment statistics response
   */
  getAssignmentStatistics: async () => {
    return apiClient.get<IApiResponse<IAssignmentStatistics>>(
      `${apiBaseUrl}/v1/auth/assignment-statistics`
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
      active_batches: IBatchWithDetails[];
      assigned_students: IStudentWithAssignment[];
    }>>(
      `${apiBaseUrl}/v1/auth/instructor-workload/${instructorId}`
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
      `${apiBaseUrl}/enrollments/students/${studentId}/enroll`,
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
      `${apiBaseUrl}/enrollments/${enrollmentId}`
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
      `${apiBaseUrl}/enrollments/${enrollmentId}`,
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
      `${apiBaseUrl}/enrollments/${enrollmentId}`
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
      `${apiBaseUrl}/enrollments/students/${studentId}${queryString}`
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
      `${apiBaseUrl}/enrollments/${enrollmentId}/transfer-batch`,
      { new_batch_id: newBatchId }
    );
  }
};

/**
 * Utility Functions
 */
export const instructorAssignmentUtils = {
  /**
   * Validate batch schedule for conflicts
   * @param schedule - Batch schedule array
   * @returns Validation result
   */
  validateBatchSchedule: (schedule: IBatchSchedule[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!schedule || schedule.length === 0) {
      errors.push('At least one schedule entry is required');
      return { isValid: false, errors };
    }

    schedule.forEach((entry, index) => {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      
      if (!timePattern.test(entry.start_time)) {
        errors.push(`Invalid start time format at entry ${index + 1}. Use HH:MM format.`);
      }
      
      if (!timePattern.test(entry.end_time)) {
        errors.push(`Invalid end time format at entry ${index + 1}. Use HH:MM format.`);
      }
      
      if (entry.start_time >= entry.end_time) {
        errors.push(`Start time must be before end time at entry ${index + 1}.`);
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Calculate batch utilization percentage
   * @param enrolledStudents - Number of enrolled students
   * @param capacity - Batch capacity
   * @returns Utilization percentage
   */
  calculateBatchUtilization: (enrolledStudents: number, capacity: number): number => {
    if (capacity === 0) return 0;
    return Math.round((enrolledStudents / capacity) * 100);
  },

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
   * Generate batch code from course and batch name
   * @param courseName - Course name
   * @param batchName - Batch name
   * @returns Generated batch code
   */
  generateBatchCode: (courseName: string, batchName: string): string => {
    const coursePrefix = courseName.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    const batchSuffix = batchName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = new Date().getFullYear().toString().slice(-2);
    return `${coursePrefix}-${batchSuffix}-${timestamp}`;
  },

  /**
   * Check if student can be enrolled in batch
   * @param batch - Batch details
   * @returns Enrollment eligibility
   */
  canEnrollInBatch: (batch: IBatchWithDetails): { canEnroll: boolean; reason?: string } => {
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