import { apiClient } from './apiClient';
import { IApiResponse } from './apiClient';

// Hire from Medh Types
export type THireStatus = 'pending' | 'under_review' | 'in_progress' | 'completed' | 'rejected' | 'archived';
export type THirePriority = 'low' | 'medium' | 'high' | 'urgent';
export type TRequirementType = 'full-time-hiring' | 'contract-hiring' | 'project-based' | 'internship' | 'freelance' | 'training-partnership' | 'skill-assessment' | 'other';

// Hire from Medh Interface
export interface IHireFromMedhData {
  _id?: string;
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  company_name: string;
  company_website?: string | null;
  department: string;
  team_size: string;
  requirement_type: TRequirementType;
  training_domain: string;
  detailed_requirements: string;
  terms_accepted: boolean;
  status?: THireStatus;
  priority?: THirePriority;
  assigned_to?: string;
  notes?: string;
  follow_up_date?: string;
  source?: string;
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  submitted_at?: string;
  updated_at?: string;
  created_at?: string;
}

// Query Parameters
export interface IHireQueryParams {
  page?: number;
  limit?: number;
  status?: THireStatus;
  priority?: THirePriority;
  requirement_type?: TRequirementType;
  search?: string;
  date_from?: string;
  date_to?: string;
  assigned_to?: string;
  sort_by?: 'submitted_at' | 'status' | 'priority' | 'company_name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Response Interfaces
export interface IHireFromMedhResponse {
  success: boolean;
  message: string;
  data: IHireFromMedhData;
}

export interface IHireFromMedhListResponse {
  success: boolean;
  message: string;
  data: IHireFromMedhData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    total_inquiries: number;
    pending_inquiries: number;
    completed_inquiries: number;
    by_status: Record<THireStatus, number>;
    by_priority: Record<THirePriority, number>;
  };
}

export interface IHireFormInfo {
  success: boolean;
  message: string;
  data: {
    form_title: string;
    form_description: string;
    requirement_types: Array<{
      value: TRequirementType;
      label: string;
      description?: string;
    }>;
    team_sizes: Array<{
      value: string;
      label: string;
    }>;
    training_domains: string[];
    countries: Array<{
      code: string;
      name: string;
    }>;
  };
}

export interface IHireAnalytics {
  success: boolean;
  message: string;
  data: {
    total_inquiries: number;
    inquiries_by_status: Record<THireStatus, number>;
    inquiries_by_priority: Record<THirePriority, number>;
    inquiries_by_requirement_type: Record<TRequirementType, number>;
    monthly_trends: Array<{
      month: string;
      inquiries: number;
    }>;
    top_companies: Array<{
      company_name: string;
      inquiry_count: number;
    }>;
    top_training_domains: Array<{
      domain: string;
      inquiry_count: number;
    }>;
    response_times: {
      average_response_time_hours: number;
      median_response_time_hours: number;
    };
  };
}

// API Functions

/**
 * Submit a new hire from Medh inquiry
 */
export const createHireFromMedhInquiry = async (
  data: Omit<IHireFromMedhData, '_id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>
): Promise<IApiResponse<IHireFromMedhResponse['data']>> => {
  return apiClient.post<IHireFromMedhResponse['data']>('/hire-from-medh', {
    ...data,
    source: 'website_form',
    submitted_at: new Date().toISOString()
  });
};

/**
 * Get all hire from Medh inquiries (Admin only)
 */
export const getAllHireFromMedhInquiries = async (
  params: IHireQueryParams = {}
): Promise<IApiResponse<IHireFromMedhListResponse['data']>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiClient.get<IHireFromMedhListResponse['data']>(
    `/hire-from-medh?${queryParams.toString()}`
  );
};

/**
 * Get hire from Medh inquiry by ID (Admin only)
 */
export const getHireFromMedhInquiryById = async (
  id: string
): Promise<IApiResponse<IHireFromMedhResponse['data']>> => {
  return apiClient.get<IHireFromMedhResponse['data']>(`/hire-from-medh/${id}`);
};

/**
 * Update hire from Medh inquiry (Admin only)
 */
export const updateHireFromMedhInquiry = async (
  id: string,
  data: Partial<IHireFromMedhData>
): Promise<IApiResponse<IHireFromMedhResponse['data']>> => {
  return apiClient.put<IHireFromMedhResponse['data']>(`/hire-from-medh/${id}`, {
    ...data,
    updated_at: new Date().toISOString()
  });
};

/**
 * Delete hire from Medh inquiry (Admin only)
 */
export const deleteHireFromMedhInquiry = async (
  id: string
): Promise<IApiResponse<null>> => {
  return apiClient.delete<null>(`/hire-from-medh/${id}`);
};

/**
 * Get hire from Medh form information
 */
export const getHireFromMedhFormInfo = async (): Promise<IApiResponse<IHireFormInfo['data']>> => {
  return apiClient.get<IHireFormInfo['data']>('/hire-from-medh/info');
};

/**
 * Get hire from Medh analytics (Admin only)
 */
export const getHireFromMedhAnalytics = async (
  dateRange?: { start_date: string; end_date: string }
): Promise<IApiResponse<IHireAnalytics['data']>> => {
  const queryParams = new URLSearchParams();
  
  if (dateRange) {
    queryParams.append('start_date', dateRange.start_date);
    queryParams.append('end_date', dateRange.end_date);
  }

  return apiClient.get<IHireAnalytics['data']>(
    `/hire-from-medh/analytics?${queryParams.toString()}`
  );
};

/**
 * Update inquiry status (Admin only)
 */
export const updateHireInquiryStatus = async (
  id: string,
  status: THireStatus,
  notes?: string
): Promise<IApiResponse<IHireFromMedhResponse['data']>> => {
  return apiClient.put<IHireFromMedhResponse['data']>(`/hire-from-medh/${id}/status`, {
    status,
    notes,
    updated_at: new Date().toISOString()
  });
};

/**
 * Assign inquiry to user (Admin only)
 */
export const assignHireInquiry = async (
  id: string,
  assignedTo: string,
  notes?: string
): Promise<IApiResponse<IHireFromMedhResponse['data']>> => {
  return apiClient.put<IHireFromMedhResponse['data']>(`/hire-from-medh/${id}/assign`, {
    assigned_to: assignedTo,
    notes,
    updated_at: new Date().toISOString()
  });
};

/**
 * Bulk update inquiries (Admin only)
 */
export const bulkUpdateHireInquiries = async (
  inquiryIds: string[],
  updates: {
    status?: THireStatus;
    priority?: THirePriority;
    assigned_to?: string;
  }
): Promise<IApiResponse<{ updated_count: number; failed_count: number }>> => {
  return apiClient.put('/hire-from-medh/bulk-update', {
    inquiry_ids: inquiryIds,
    updates: {
      ...updates,
      updated_at: new Date().toISOString()
    }
  });
};

/**
 * Export hire inquiries (Admin only)
 */
export const exportHireInquiries = async (
  format: 'csv' | 'excel' | 'json' = 'csv',
  filters?: Partial<IHireQueryParams>
): Promise<IApiResponse<{ download_url: string; expires_at: string }>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('format', format);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  return apiClient.get(`/hire-from-medh/export?${queryParams.toString()}`);
};

// Utility Functions

/**
 * Format hire inquiry data for display
 */
export const formatHireInquiryData = (inquiry: IHireFromMedhData): {
  formattedData: Record<string, string>;
  metadata: Record<string, any>;
} => {
  const formattedData: Record<string, string> = {
    'Full Name': inquiry.full_name,
    'Email': inquiry.email,
    'Phone': inquiry.phone_number,
    'Company': inquiry.company_name,
    'Department': inquiry.department,
    'Team Size': inquiry.team_size,
    'Requirement Type': inquiry.requirement_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    'Training Domain': inquiry.training_domain,
    'Requirements': inquiry.detailed_requirements
  };

  if (inquiry.company_website) {
    formattedData['Company Website'] = inquiry.company_website;
  }

  const metadata: Record<string, any> = {
    submittedAt: inquiry.submitted_at ? new Date(inquiry.submitted_at).toLocaleString() : 'N/A',
    status: inquiry.status || 'pending',
    priority: inquiry.priority || 'medium',
    source: inquiry.source || 'website'
  };

  if (inquiry.assigned_to) {
    metadata.assignedTo = inquiry.assigned_to;
  }

  return { formattedData, metadata };
};

/**
 * Get status color for UI display
 */
export const getStatusColor = (status: THireStatus): string => {
  const colors: Record<THireStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'under_review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in_progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  };
  return colors[status] || colors.pending;
};

/**
 * Get priority color for UI display
 */
export const getPriorityColor = (priority: THirePriority): string => {
  const colors: Record<THirePriority, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  return colors[priority] || colors.medium;
};

// Export default instance
export default {
  createHireFromMedhInquiry,
  getAllHireFromMedhInquiries,
  getHireFromMedhInquiryById,
  updateHireFromMedhInquiry,
  deleteHireFromMedhInquiry,
  getHireFromMedhFormInfo,
  getHireFromMedhAnalytics,
  updateHireInquiryStatus,
  assignHireInquiry,
  bulkUpdateHireInquiries,
  exportHireInquiries,
  formatHireInquiryData,
  getStatusColor,
  getPriorityColor
}; 