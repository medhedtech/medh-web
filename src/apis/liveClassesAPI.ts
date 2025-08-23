import { apiClient } from './apiClient';
import { createApiClient } from './apiClient';
import { apiBaseUrl } from './config';

// Create a specific API client for live classes that points directly to the backend
const liveClassesApiClient = createApiClient({
  baseUrl: apiBaseUrl
});

// Create a separate API client for live sessions that uses Next.js API routes
const liveSessionsApiClient = createApiClient({
  baseUrl: '/api/v1'
});

// Types
export interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  student_id?: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  status?: string;
  role?: string[];
  meta?: {
    gender?: string;
    age_group?: string;
    date_of_birth?: string;
    education_level?: string;
    language?: string;
    upload_resume?: any[];
  };
}

export interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  avatar?: string;
  specializations?: string[];
}

export interface IGrade {
  _id: string;
  name: string;
  level: number;
}

export interface IDashboard {
  _id: string;
  name: string;
  type: string;
  description?: string;
}

export interface IBatch {
  _id: string;
  batch_name?: string;
  name?: string;
  batch_code?: string;
  code?: string;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  enrolled_students?: number;
  enrolledStudents?: number;
}

export interface ICourseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  totalBatches: number;
  totalStudents: number;
  upcomingSessions: number;
  courseRating: number;
  features: string[];
  color: string;
}

export interface ISummaryItem {
  id: string;
  type: string;
  title: string;
  description: string;
}

export interface ILiveSession {
  _id: string;
  sessionTitle: string;
  sessionNo: string;
  students: Array<{ _id: string; full_name: string; email: string }>;
  grades: Array<{ _id: string; name: string }>;
  dashboard: string;
  instructorId: { _id: string; full_name: string; email: string };
  video: {
    fileId: string;
    name: string;
    size: number;
    url?: string;
  };
  date: string;
  remarks?: string;
  summary: {
    title: string;
    description: string;
    items: ISummaryItem[];
  };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLiveSessionRequest {
  sessionTitle: string;
  sessionNo: string;
  students: string[];
  grades: string[];
  dashboard: string;
  instructorId: string;
  batchId?: string; // Add batchId field
  video: {
    fileId: string;
    name: string;
    size: number;
  };
  date: string;
  remarks?: string;
  summary: {
    title: string;
    description: string;
    items: ISummaryItem[];
  };
}

// Static data for dashboards
const staticDashboards: IDashboard[] = [
  {
    _id: 'instructor-dashboard',
    name: 'Instructor Dashboard',
    type: 'instructor',
    description: 'Dashboard for instructors to manage courses and students'
  },
  {
    _id: 'student-dashboard', 
    name: 'Student Dashboard',
    type: 'student',
    description: 'Main dashboard for students to view courses and progress'
  },
  {
    _id: 'admin-dashboard',
    name: 'Admin Dashboard', 
    type: 'admin',
    description: 'Administrative dashboard for system management'
  }
];

// Static data for grades
const staticGrades: IGrade[] = [
  { _id: 'preschool', name: 'Preschool', level: 1 },
  { _id: 'grade-1-2', name: 'Grade 1-2', level: 2 },
  { _id: 'grade-3-5', name: 'Grade 3-5', level: 3 },
  { _id: 'grade-6-8', name: 'Grade 6-8', level: 4 },
  { _id: 'grade-9-10', name: 'Grade 9-10', level: 5 },
  { _id: 'grade-11-12', name: 'Grade 11-12', level: 6 },
  { _id: 'foundation-cert', name: 'Foundation Certificate', level: 7 },
  { _id: 'advance-cert', name: 'Advance Certificate', level: 8 },
  { _id: 'executive-diploma', name: 'Executive Diploma', level: 9 },
  { _id: 'ug-graduate', name: 'UG - Graduate - Professionals', level: 10 }
];

// Static data for instructors - REMOVED - now fetching from backend

// API Functions
export const liveClassesAPI = {
  // Get all students (no pagination for form dropdowns)
  getStudents: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    // Remove pagination limits for form usage - get all students
    params.append('limit', '1000'); // High limit to get all students
    params.append('page', '1');
    
    return liveClassesApiClient.get<{ data: { items: IStudent[]; total: number; page: number; limit: number; pages: number } }>(`/live-classes/students?${params}`);
  },

  // Get all grades from backend
  getGrades: async () => {
    return liveClassesApiClient.get<{ data: IGrade[] }>('/live-classes/grades');
  },

  // Get dashboards from backend
  getDashboards: async () => {
    return liveClassesApiClient.get<{ data: IDashboard[] }>('/live-classes/dashboards');
  },

  // Get all instructors (no pagination for form dropdowns)
  getInstructors: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    // Remove pagination limits for form usage - get all instructors
    params.append('limit', '1000'); // High limit to get all instructors
    params.append('page', '1');
    
    return liveClassesApiClient.get<{ data: { items: IInstructor[]; total: number } }>(`/live-classes/instructors?${params}`);
  },

  // Get all batches from backend
  getAllBatches: async () => {
    return liveClassesApiClient.get<{ data: IBatch[] }>('/live-classes/batches');
  },

  // Upload video file (legacy)
  uploadVideo: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return liveClassesApiClient.post<{
      fileId: string;
      url: string;
      name: string;
      size: number;
    }>('/live-classes/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // Generate S3 presigned URL for video upload
  generateUploadUrl: async (params: {
    batchObjectId: string;
    studentName: string;
    fileName: string;
    fileType?: string;
  }) => {
    return liveClassesApiClient.post<{
      uploadUrl: string;
      filePath: string;
      fileName: string;
      expiresIn: number;
    }>('/live-classes/generate-upload-url', params);
  },

  // Upload video to S3 using presigned URL
  uploadVideoToS3: async (uploadUrl: string, file: File, onProgress?: (progress: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },

  // Create new live session
  createLiveSession: async (sessionData: ICreateLiveSessionRequest) => {
    return liveClassesApiClient.post<{ sessionId: string; success: boolean }>('/live-classes/sessions', sessionData);
  },

  // Get latest session (most recently created/updated)
  getPreviousSession: async (courseCategory?: string) => {
    const url = courseCategory 
      ? `/live-classes/sessions/previous?courseCategory=${encodeURIComponent(courseCategory)}`
      : '/live-classes/sessions/previous';
    return liveClassesApiClient.get<ILiveSession>(url);
  },

  // Get all sessions (optionally filtered by course category)
  getSessions: async (courseCategory?: string, page: number = 1, limit: number = 20) => {
    const params = new URLSearchParams();
    if (courseCategory) {
      params.append('courseCategory', courseCategory);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Temporarily call backend directly to get data working
    return liveClassesApiClient.get<{ items: ILiveSession[]; total: number }>(`/live-classes/sessions?${params}`);
  },

  // Get session by ID
  getSession: async (sessionId: string) => {
    console.log('Fetching session with ID:', sessionId);
    try {
      // Use direct backend call like getSessions does
      const response = await liveClassesApiClient.get<ILiveSession>(`/live-classes/sessions/${sessionId}`);
      console.log('Session API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },

  // Update session
  updateSession: async (sessionId: string, sessionData: Partial<ICreateLiveSessionRequest>) => {
    return liveClassesApiClient.put<{ success: boolean }>(`/live-classes/sessions/${sessionId}`, sessionData);
  },

  // Delete session
  deleteSession: async (sessionId: string) => {
    return liveClassesApiClient.delete<{ success: boolean }>(`/live-classes/sessions/${sessionId}`);
  },

  // Get student's latest session
  getStudentLatestSession: async (studentId: string) => {
    console.log('🌐 API Call: getStudentLatestSession for student:', studentId);
    const url = `/live-classes/students/${studentId}/latest-session`;
    console.log('🔗 Direct Backend URL:', url);
    
    try {
      const response = await liveClassesApiClient.get<{
        sessionTitle: string;
        sessionNo: string;
        status: string;
        student: IStudent;
        instructor: IInstructor;
        grade: IGrade;
        batch: any;
        date: string;
        courseCategory: string;
        remarks?: string;
        summary?: any;
      }>(url);
      
      console.log('✅ API Response received:', response);
      return response;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  },

  // Get course statistics
  getCourseStats: async (courseCategory: string) => {
    return liveClassesApiClient.get<{
      totalBatches: number;
      totalStudents: number;
      upcomingSessions: number;
      courseRating: number;
      recentSessions: ILiveSession[];
    }>(`/live-classes/courses/${encodeURIComponent(courseCategory)}/stats`);
  },

  // Get all course categories
  getCourseCategories: async () => {
    return liveClassesApiClient.get<ICourseCategory[]>('/live-classes/course-categories');
  },

  // Get batches for selected students
  getBatchesForStudents: async (studentIds: string[]) => {
    const params = new URLSearchParams();
    params.append('studentIds', JSON.stringify(studentIds));
    return liveClassesApiClient.get<{ batches: IBatch[]; totalBatches: number }>(`/live-classes/batches-for-students?${params}`);
  },
};

// Custom hooks for React components
export const useLiveClassesAPI = () => {
  return {
    // Students
    getStudents: liveClassesAPI.getStudents,
    
    // Grades
    getGrades: liveClassesAPI.getGrades,
    
    // Dashboards
    getDashboards: liveClassesAPI.getDashboards,
    
    // Instructors
    getInstructors: liveClassesAPI.getInstructors,
    
    // File upload
    uploadVideo: liveClassesAPI.uploadVideo,
    generateUploadUrl: liveClassesAPI.generateUploadUrl,
    uploadVideoToS3: liveClassesAPI.uploadVideoToS3,
    
    // Sessions
    createLiveSession: liveClassesAPI.createLiveSession,
    getPreviousSession: liveClassesAPI.getPreviousSession,
    getSessions: liveClassesAPI.getSessions,
    getSession: liveClassesAPI.getSession,
    getStudentLatestSession: liveClassesAPI.getStudentLatestSession,
    updateSession: liveClassesAPI.updateSession,
    deleteSession: liveClassesAPI.deleteSession,
    
    // Course stats
    getCourseStats: liveClassesAPI.getCourseStats,
    
    // Course categories
    getCourseCategories: liveClassesAPI.getCourseCategories,
    
    // Batches for students
    getBatchesForStudents: liveClassesAPI.getBatchesForStudents,
  };
};
