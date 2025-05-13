import axios from 'axios';

// Define types for the API responses
export interface IBatch {
  _id: string;
  batch_name: string;
  batch_code: string;
  start_date: string;
  end_date: string;
  capacity: number;
  assigned_instructor: string;
  schedule: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  batch_notes?: string;
}

export interface IPaymentDetails {
  amount: number;
  payment_method: string;
  transaction_id: string;
  payment_status: string;
  currency: string;
  payment_date?: string;
}

export interface IEnrollment {
  _id: string;
  student: string;
  course: string;
  batch: string | IBatch;
  enrollment_date: string;
  status: string;
  enrollment_type: string;
  enrollment_source: string;
  payment_plan: string;
  payments: IPaymentDetails[];
  installments_count?: number;
  next_payment_date?: string;
  access_expiry_date: string;
  progress: {
    lesson_id: string;
    status: string;
    progress_percentage: number;
    time_spent_seconds: number;
    completed_at?: string;
  }[];
  assessments: {
    assessment_id: string;
    score: number;
    max_possible_score: number;
    passed: boolean;
    attempts: number;
    completed_at?: string;
  }[];
}

// API methods for enrollments
const EnrollmentAPI = {
  // Get student enrollments
  getStudentEnrollments: async (studentId: string): Promise<IEnrollment[]> => {
    const response = await axios.get(`/api/v1/enrollments/students/${studentId}/enrollments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Get enrollment details
  getEnrollmentDetails: async (enrollmentId: string): Promise<IEnrollment> => {
    const response = await axios.get(`/api/v1/enrollments/enrollments/${enrollmentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Update lesson progress
  updateLessonProgress: async (
    enrollmentId: string, 
    lessonId: string, 
    progress: {
      status: string;
      progress_percentage: number;
      time_spent_seconds: number;
    }
  ): Promise<any> => {
    const response = await axios.put(
      `/api/v1/enrollments/enrollments/${enrollmentId}/progress/${lessonId}`,
      progress,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  // Record assessment score
  recordAssessmentScore: async (
    enrollmentId: string,
    assessmentId: string,
    scoreData: {
      score: number;
      max_possible_score: number;
      passed: boolean;
      attempts: number;
    }
  ): Promise<any> => {
    const response = await axios.post(
      `/api/v1/enrollments/enrollments/${enrollmentId}/assessments/${assessmentId}/scores`,
      scoreData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },
  
  // Enroll student in a batch
  enrollStudent: async (
    studentId: string,
    enrollmentData: {
      courseId: string;
      batchId: string;
      enrollment_type: string;
      enrollment_source: string;
      paymentDetails: IPaymentDetails;
      payment_plan: string;
      installments_count?: number;
      next_payment_date?: string;
      discount_applied?: number;
      discount_code?: string;
    }
  ): Promise<IEnrollment> => {
    const response = await axios.post(
      `/api/v1/enrollments/students/${studentId}/enroll`,
      enrollmentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
};

export default EnrollmentAPI; 