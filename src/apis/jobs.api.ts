import { apiClient, IApiResponse } from './apiClient';
import { apiUrls } from './index';

/**
 * Job Posting model - Enhanced to match backend schema
 */
export interface IJobPost {
  _id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'hour' | 'month' | 'year';
  };
  applicationDeadline?: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Closed' | 'Archived';
  createdAt: string;
  updatedAt?: string;
  responsibilities?: string[];
  qualifications?: {
    education?: string[];
    experience?: string;
    skills?: string[];
    additional?: string[];
  };
  workMode?: 'Remote' | 'Office' | 'Hybrid' | 'Work from Office & Remote';
  markets?: ('INDIA' | 'US' | 'UK' | 'AUSTRALIA' | 'GLOBAL')[];
  selectionProcess?: Array<{
    step: string;
    order: number;
    description?: string;
  }>;
  officeLocation?: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  homeRequirements?: string[];
  note?: string;
  noteDescription?: string;
  remuneration?: string;
  postedBy?: string;
  applicationsCount?: number;
}

/**
 * Job Application model - Enhanced
 */
export interface IJobApplication {
  _id: string;
  jobId: string;
  userId: string;
  userDetails: {
    fullName: string;
    email: string;
    phone?: string;
    resume?: string;
    coverLetter?: string;
    portfolio?: string;
    experience?: string;
    skills?: string[];
    [key: string]: any;
  };
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Selected';
  applicationDate: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  interviewDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Job search and filter parameters
 */
export interface IJobSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  workMode?: string;
  market?: string;
  salaryMin?: number;
  salaryMax?: number;
  status?: string;
  sort_by?: 'createdAt' | 'title' | 'department' | 'applicationDeadline';
  sort_order?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Input types
 */
export type ICreateJobPostInput = Omit<IJobPost, '_id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>;
export type IUpdateJobPostInput = Partial<ICreateJobPostInput>;

export interface IJobApplicationInput {
  jobId: string;
  userId: string;
  userDetails: IJobApplication['userDetails'];
  applicationDate: string;
}

/**
 * Career Application Input - for general career applications
 */
export interface ICareerApplicationInput {
  fullName: string;
  email: string;
  country: string;
  mobile: string;
  coverLetter?: string;
  resume?: File;
}

export interface IBulkUpdateInput {
  jobIds: string[];
  updates: {
    status?: IJobPost['status'];
    department?: string;
    employmentType?: string;
    [key: string]: any;
  };
}

// ==========================================
// PUBLIC ENDPOINTS (No Authentication)
// ==========================================

/**
 * Get all active job postings (public view)
 * @route GET /api/v1/jobs/active
 */
export const fetchActiveJobPosts = async (
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any; total: number }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/active${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Search and filter jobs with pagination
 * @route GET /api/v1/jobs/search
 */
export const searchJobs = async (
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any; filters: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get a single active job posting (public view)
 * @route GET /api/v1/jobs/public/:id
 */
export const fetchPublicJobPost = async (
  jobId: string
): Promise<IApiResponse<IJobPost>> => {
  return apiClient.get(`/jobs/public/${jobId}`);
};

/**
 * Submit job application (public endpoint)
 * @route POST /api/v1/jobs/apply
 */
export const submitJobApplication = async (
  data: IJobApplicationInput
): Promise<IApiResponse<IJobApplication>> => {
  return apiClient.post('/jobs/apply', data);
};

/**
 * Submit career application (public endpoint)
 * @route POST /api/v1/jobs/careers/apply
 */
export const submitCareerApplication = async (
  data: ICareerApplicationInput
): Promise<IApiResponse<{ message: string; applicationId: string }>> => {
  const formData = new FormData();
  
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('country', data.country);
  formData.append('mobile', data.mobile);
  
  if (data.coverLetter) {
    formData.append('coverLetter', data.coverLetter);
  }
  
  if (data.resume) {
    formData.append('resume', data.resume);
  }
  
  return apiClient.upload('/jobs/careers/apply', formData);
};

// ==========================================
// AUTHENTICATED ENDPOINTS
// ==========================================

/**
 * Create a new job application (authenticated)
 * @route POST /api/v1/jobs/create
 */
export const createJobApplication = async (
  data: IJobApplicationInput
): Promise<IApiResponse<IJobApplication>> => {
  return apiClient.post('/jobs/create', data);
};

/**
 * Create a comprehensive job posting (Admin/HR)
 * @route POST /api/v1/jobs/posting/create
 */
export const createJobPost = async (
  data: ICreateJobPostInput
): Promise<IApiResponse<IJobPost>> => {
  return apiClient.post('/jobs/posting/create', data);
};

/**
 * Get all job forms/applications with filtering (Admin/HR)
 * @route GET /api/v1/jobs/getAll
 */
export const fetchAllJobPosts = async (
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/getAll${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get current user's job applications
 * @route GET /api/v1/jobs/my-applications
 */
export const fetchMyApplications = async (
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ applications: IJobApplication[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/my-applications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get job statistics and analytics (Admin/HR)
 * @route GET /api/v1/jobs/stats
 */
export const fetchJobStats = async (): Promise<IApiResponse<{
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  jobsByDepartment: Record<string, number>;
  recentActivity: any[];
}>> => {
  return apiClient.get('/jobs/stats');
};

/**
 * Get a single job form/application by ID
 * @route GET /api/v1/jobs/get/:id
 */
export const fetchJobPostById = async (
  jobId: string
): Promise<IApiResponse<IJobPost>> => {
  return apiClient.get(`/jobs/get/${jobId}`);
};

/**
 * Get all applications for a specific job posting (Admin/HR)
 * @route GET /api/v1/jobs/:id/applications
 */
export const fetchJobApplications = async (
  jobId: string,
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ applications: IJobApplication[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/${jobId}/applications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Update a job form/posting by ID
 * @route PUT /api/v1/jobs/update/:id
 */
export const updateJobPost = async (
  jobId: string,
  data: IUpdateJobPostInput
): Promise<IApiResponse<IJobPost>> => {
  return apiClient.put(`/jobs/update/${jobId}`, data);
};

/**
 * Update application status for a job (Admin/HR)
 * @route PUT /api/v1/jobs/:id/status
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: IJobApplication['status'],
  notes?: string,
  interviewDate?: string
): Promise<IApiResponse<IJobApplication>> => {
  return apiClient.put(`/jobs/${applicationId}/status`, {
    status,
    notes,
    interviewDate
  });
};

/**
 * Bulk update multiple jobs (Admin/HR)
 * @route POST /api/v1/jobs/bulk-update
 */
export const bulkUpdateJobs = async (
  data: IBulkUpdateInput
): Promise<IApiResponse<{ updated: number; failed: number; results: any[] }>> => {
  return apiClient.post('/jobs/bulk-update', data);
};

/**
 * Duplicate a job posting (Admin/HR)
 * @route POST /api/v1/jobs/:id/duplicate
 */
export const duplicateJobPost = async (
  jobId: string,
  modifications?: Partial<ICreateJobPostInput>
): Promise<IApiResponse<IJobPost>> => {
  return apiClient.post(`/jobs/${jobId}/duplicate`, modifications || {});
};

/**
 * Export job data (CSV/Excel) (Admin/HR)
 * @route GET /api/v1/jobs/export
 */
export const exportJobData = async (
  format: 'csv' | 'excel' | 'json' = 'csv',
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ downloadUrl: string; filename: string; expiresAt: string }>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('format', format);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  return apiClient.get(`/jobs/export?${queryParams.toString()}`);
};

/**
 * Delete a job form/posting by ID (Admin/HR)
 * @route DELETE /api/v1/jobs/delete/:id
 */
export const deleteJobPost = async (
  jobId: string
): Promise<IApiResponse<{ message: string }>> => {
  return apiClient.delete(`/jobs/delete/${jobId}`);
};

// ==========================================
// ADVANCED FILTERING ENDPOINTS
// ==========================================

/**
 * Get jobs filtered by market
 * @route GET /api/v1/jobs/filter/by-market/:market
 */
export const fetchJobsByMarket = async (
  market: string,
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/filter/by-market/${market}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get jobs filtered by work mode
 * @route GET /api/v1/jobs/filter/by-work-mode/:work_mode
 */
export const fetchJobsByWorkMode = async (
  workMode: string,
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/filter/by-work-mode/${workMode}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get jobs filtered by employment type
 * @route GET /api/v1/jobs/filter/by-employment-type/:employment_type
 */
export const fetchJobsByEmploymentType = async (
  employmentType: string,
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/filter/by-employment-type/${employmentType}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

/**
 * Get jobs filtered by department
 * @route GET /api/v1/jobs/filter/by-department/:department
 */
export const fetchJobsByDepartment = async (
  department: string,
  params: IJobSearchParams = {}
): Promise<IApiResponse<{ jobs: IJobPost[]; pagination: any }>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const endpoint = `/jobs/filter/by-department/${department}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get(endpoint);
};

// ==========================================
// FILE UPLOAD ENDPOINTS
// ==========================================

/**
 * Upload resume file
 */
export const uploadResume = async (
  formData: FormData
): Promise<IApiResponse<{ resumeUrl: string; filename: string }>> => {
  return apiClient.upload('/jobs/upload/resume', formData);
};

/**
 * Upload cover letter file
 */
export const uploadCoverLetter = async (
  formData: FormData
): Promise<IApiResponse<{ coverLetterUrl: string; filename: string }>> => {
  return apiClient.upload('/jobs/upload/cover-letter', formData);
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Helper function to format job data for display
 */
export const formatJobData = (job: IJobPost) => ({
  ...job,
  formattedSalary: job.salaryRange 
    ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} per ${job.salaryRange.period}`
    : 'Competitive',
  formattedDeadline: job.applicationDeadline 
    ? new Date(job.applicationDeadline).toLocaleDateString()
    : 'Open until filled',
  isExpired: job.applicationDeadline 
    ? new Date(job.applicationDeadline) < new Date()
    : false
});

/**
 * Helper function to get status color for UI
 */
export const getJobStatusColor = (status: IJobPost['status']): string => {
  const statusColors = {
    'Draft': '#6B7280',
    'Active': '#10B981',
    'Paused': '#F59E0B',
    'Closed': '#EF4444',
    'Archived': '#9CA3AF'
  };
  return statusColors[status] || '#6B7280';
};

/**
 * Helper function to get application status color for UI
 */
export const getApplicationStatusColor = (status: IJobApplication['status']): string => {
  const statusColors = {
    'Applied': '#3B82F6',
    'Under Review': '#F59E0B',
    'Shortlisted': '#8B5CF6',
    'Interview Scheduled': '#06B6D4',
    'Rejected': '#EF4444',
    'Selected': '#10B981'
  };
  return statusColors[status] || '#6B7280';
}; 