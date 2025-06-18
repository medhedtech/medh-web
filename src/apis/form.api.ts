import { apiClient } from './apiClient';
import { IApiResponse } from './apiClient';

// Form Types
export type TFormType = 'contact' | 'feedback' | 'enrollment' | 'support' | 'survey' | 'application' | 'newsletter' | 'custom';
export type TFormStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected' | 'archived';
export type TFormPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'date' | 'number' | 'url' | 'password';

// Field Validation Rules
export interface IFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  fileTypes?: string[];
  maxFileSize?: number;
  customValidation?: string;
}

// Form Field Interface
export interface IFormField {
  _id?: string;
  field_name: string;
  field_label: string;
  field_type: TFieldType;
  field_placeholder?: string;
  field_description?: string;
  field_options?: string[]; // For select, radio, checkbox fields
  validation?: IFieldValidation;
  is_required: boolean;
  is_visible: boolean;
  field_order: number;
  default_value?: string | string[] | number | boolean;
  conditional_logic?: {
    show_if_field: string;
    show_if_value: string | string[];
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

// Form Configuration
export interface IFormConfig {
  _id?: string;
  form_name: string;
  form_title: string;
  form_description?: string;
  form_type: TFormType;
  form_category?: string;
  form_fields: IFormField[];
  form_settings: {
    allow_multiple_submissions: boolean;
    require_authentication: boolean;
    send_confirmation_email: boolean;
    redirect_url?: string;
    success_message: string;
    error_message: string;
    auto_respond: boolean;
    notification_emails: string[];
  };
  form_styling?: {
    theme: 'default' | 'minimal' | 'modern' | 'classic';
    primary_color?: string;
    background_color?: string;
    text_color?: string;
    button_style?: string;
  };
  is_active: boolean;
  is_public: boolean;
  created_by: string;
  createdAt?: string;
  updatedAt?: string;
}

// Form Submission Data
export interface IFormSubmissionData {
  [fieldName: string]: string | string[] | number | boolean | File | File[];
}

// File Attachment
export interface IFormAttachment {
  _id: string;
  original_name: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

// Form Submission
export interface IFormSubmission {
  _id?: string;
  form_id: string;
  form_name: string;
  form_type: TFormType;
  submission_data: IFormSubmissionData;
  attachments?: IFormAttachment[];
  submitter_info: {
    user_id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    ip_address?: string;
    user_agent?: string;
    location?: {
      country?: string;
      city?: string;
      timezone?: string;
    };
  };
  status: TFormStatus;
  priority: TFormPriority;
  assigned_to?: string;
  tags?: string[];
  notes?: string;
  response_message?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  source: 'web' | 'mobile' | 'api' | 'admin';
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  submitted_at: string;
  processed_at?: string;
  completed_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Contact Form Specific Interface
export interface IContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  inquiry_type?: 'general' | 'support' | 'sales' | 'partnership' | 'feedback';
  preferred_contact_method?: 'email' | 'phone' | 'both';
  consent_marketing?: boolean;
  consent_terms: boolean;
}

// Feedback Form Specific Interface
export interface IFeedbackFormData {
  full_name?: string;
  email?: string;
  course_id?: string;
  instructor_id?: string;
  feedback_type: 'course' | 'instructor' | 'platform' | 'technical' | 'general';
  rating: number; // 1-5 scale
  title: string;
  feedback_message: string;
  suggestions?: string;
  recommend_to_others?: boolean;
  allow_public_display?: boolean;
  anonymous_submission?: boolean;
}

// Enrollment Form Specific Interface
export interface IEnrollmentFormData {
  full_name: string;
  email: string;
  phone: string;
  course_id: string;
  batch_preference?: string;
  enrollment_type: 'individual' | 'corporate' | 'group';
  payment_preference: 'full' | 'installment';
  educational_background?: string;
  work_experience?: string;
  learning_goals?: string;
  special_requirements?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  consent_terms: boolean;
  consent_privacy: boolean;
}

// Support Form Specific Interface
export interface ISupportFormData {
  full_name: string;
  email: string;
  user_id?: string;
  issue_type: 'technical' | 'billing' | 'course_access' | 'account' | 'other';
  priority: TFormPriority;
  subject: string;
  description: string;
  steps_to_reproduce?: string;
  browser_info?: string;
  device_info?: string;
  attachments?: File[];
}

// Query Parameters
export interface IFormQueryParams {
  page?: number;
  limit?: number;
  form_type?: TFormType;
  status?: TFormStatus;
  priority?: TFormPriority;
  search?: string;
  date_from?: string;
  date_to?: string;
  assigned_to?: string;
  created_by?: string;
  tags?: string[];
  source?: string;
  sort_by?: 'submitted_at' | 'status' | 'priority' | 'form_type' | 'createdAt';
  sort_order?: 'asc' | 'desc';
}

// Form Analytics
export interface IFormAnalytics {
  form_id: string;
  form_name: string;
  form_type: TFormType;
  total_submissions: number;
  total_views: number;
  conversion_rate: number;
  average_completion_time: number;
  abandonment_rate: number;
  submission_trends: Array<{
    date: string;
    submissions: number;
    views: number;
  }>;
  field_analytics: Array<{
    field_name: string;
    field_label: string;
    completion_rate: number;
    error_rate: number;
    average_time_spent: number;
  }>;
  status_distribution: Record<TFormStatus, number>;
  priority_distribution: Record<TFormPriority, number>;
  source_distribution: Record<string, number>;
  geographic_distribution: Array<{
    country: string;
    submissions: number;
    percentage: number;
  }>;
  device_breakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  popular_times: Array<{
    hour: number;
    submissions: number;
  }>;
}

// Response Interfaces
export interface IFormConfigResponse {
  success: boolean;
  message: string;
  data: IFormConfig;
}

export interface IFormConfigListResponse {
  success: boolean;
  message: string;
  data: IFormConfig[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IFormSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    submission_id: string;
    form_id: string;
    status: TFormStatus;
    confirmation_number?: string;
    next_steps?: string;
    estimated_response_time?: string;
  };
}

export interface IFormSubmissionListResponse {
  success: boolean;
  message: string;
  data: IFormSubmission[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    total_submissions: number;
    pending_submissions: number;
    completed_submissions: number;
    by_status: Record<TFormStatus, number>;
    by_priority: Record<TFormPriority, number>;
  };
}

export interface IFormAnalyticsResponse {
  success: boolean;
  message: string;
  data: IFormAnalytics;
  generated_at: string;
}

// API Functions

/**
 * Get all form configurations
 */
export const getAllFormConfigs = async (
  params: Partial<IFormQueryParams> = {}
): Promise<IApiResponse<IFormConfigListResponse['data']>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return apiClient.get<IFormConfigListResponse['data']>(
    `/forms/configs?${queryParams.toString()}`
  );
};

/**
 * Get form configuration by ID
 */
export const getFormConfigById = async (
  formId: string
): Promise<IApiResponse<IFormConfigResponse['data']>> => {
  return apiClient.get<IFormConfigResponse['data']>(`/forms/configs/${formId}`);
};

/**
 * Get public form configuration (for rendering forms)
 */
export const getPublicFormConfig = async (
  formId: string
): Promise<IApiResponse<IFormConfigResponse['data']>> => {
  return apiClient.get<IFormConfigResponse['data']>(`/forms/public/${formId}`);
};

/**
 * Create new form configuration (Admin only)
 */
export const createFormConfig = async (
  data: Omit<IFormConfig, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IApiResponse<IFormConfigResponse['data']>> => {
  return apiClient.post<IFormConfigResponse['data']>('/forms/configs', data);
};

/**
 * Update form configuration (Admin only)
 */
export const updateFormConfig = async (
  formId: string,
  data: Partial<IFormConfig>
): Promise<IApiResponse<IFormConfigResponse['data']>> => {
  return apiClient.put<IFormConfigResponse['data']>(`/forms/configs/${formId}`, data);
};

/**
 * Delete form configuration (Admin only)
 */
export const deleteFormConfig = async (
  formId: string
): Promise<IApiResponse<null>> => {
  return apiClient.delete<null>(`/forms/configs/${formId}`);
};

/**
 * Submit a form
 */
export const submitForm = async (
  formId: string,
  submissionData: IFormSubmissionData,
  attachments?: File[]
): Promise<IApiResponse<IFormSubmissionResponse['data']>> => {
  const formData = new FormData();
  
  // Add form data
  formData.append('form_id', formId);
  formData.append('submission_data', JSON.stringify(submissionData));
  
  // Add attachments if any
  if (attachments && attachments.length > 0) {
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  return apiClient.upload<IFormSubmissionResponse['data']>('/forms/submit', formData);
};

/**
 * Submit contact form
 */
export const submitContactForm = async (
  data: IContactFormData,
  attachments?: File[]
): Promise<IApiResponse<IFormSubmissionResponse['data']>> => {
  const formData = new FormData();
  formData.append('form_type', 'contact');
  formData.append('submission_data', JSON.stringify(data));
  
  if (attachments && attachments.length > 0) {
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  return apiClient.upload<IFormSubmissionResponse['data']>('/forms/contact', formData);
};

/**
 * Submit feedback form
 */
export const submitFeedbackForm = async (
  data: IFeedbackFormData,
  attachments?: File[]
): Promise<IApiResponse<IFormSubmissionResponse['data']>> => {
  const formData = new FormData();
  formData.append('form_type', 'feedback');
  formData.append('submission_data', JSON.stringify(data));
  
  if (attachments && attachments.length > 0) {
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  return apiClient.upload<IFormSubmissionResponse['data']>('/forms/feedback', formData);
};

/**
 * Submit enrollment form
 */
export const submitEnrollmentForm = async (
  data: IEnrollmentFormData,
  attachments?: File[]
): Promise<IApiResponse<IFormSubmissionResponse['data']>> => {
  const formData = new FormData();
  formData.append('form_type', 'enrollment');
  formData.append('submission_data', JSON.stringify(data));
  
  if (attachments && attachments.length > 0) {
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  return apiClient.upload<IFormSubmissionResponse['data']>('/forms/enrollment', formData);
};

/**
 * Submit support form
 */
export const submitSupportForm = async (
  data: ISupportFormData
): Promise<IApiResponse<IFormSubmissionResponse['data']>> => {
  const formData = new FormData();
  formData.append('form_type', 'support');
  formData.append('submission_data', JSON.stringify(data));
  
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  return apiClient.upload<IFormSubmissionResponse['data']>('/forms/support', formData);
};

/**
 * Get all form submissions (Admin only)
 */
export const getFormSubmissions = async (
  params: IFormQueryParams = {}
): Promise<IApiResponse<IFormSubmissionListResponse['data']>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return apiClient.get<IFormSubmissionListResponse['data']>(
    `/forms/submissions?${queryParams.toString()}`
  );
};

/**
 * Get form submission by ID (Admin only)
 */
export const getFormSubmissionById = async (
  submissionId: string
): Promise<IApiResponse<IFormSubmission>> => {
  return apiClient.get<IFormSubmission>(`/forms/submissions/${submissionId}`);
};

/**
 * Update form submission status (Admin only)
 */
export const updateFormSubmissionStatus = async (
  submissionId: string,
  status: TFormStatus,
  notes?: string
): Promise<IApiResponse<IFormSubmission>> => {
  return apiClient.put<IFormSubmission>(`/forms/submissions/${submissionId}/status`, {
    status,
    notes
  });
};

/**
 * Assign form submission to user (Admin only)
 */
export const assignFormSubmission = async (
  submissionId: string,
  assignedTo: string,
  notes?: string
): Promise<IApiResponse<IFormSubmission>> => {
  return apiClient.put<IFormSubmission>(`/forms/submissions/${submissionId}/assign`, {
    assigned_to: assignedTo,
    notes
  });
};

/**
 * Add response to form submission (Admin only)
 */
export const respondToFormSubmission = async (
  submissionId: string,
  responseMessage: string,
  status?: TFormStatus
): Promise<IApiResponse<IFormSubmission>> => {
  return apiClient.post<IFormSubmission>(`/forms/submissions/${submissionId}/respond`, {
    response_message: responseMessage,
    status
  });
};

/**
 * Delete form submission (Admin only)
 */
export const deleteFormSubmission = async (
  submissionId: string
): Promise<IApiResponse<null>> => {
  return apiClient.delete<null>(`/forms/submissions/${submissionId}`);
};

/**
 * Get form analytics (Admin only)
 */
export const getFormAnalytics = async (
  formId: string,
  dateRange?: { start_date: string; end_date: string }
): Promise<IApiResponse<IFormAnalyticsResponse['data']>> => {
  const queryParams = new URLSearchParams();
  
  if (dateRange) {
    queryParams.append('start_date', dateRange.start_date);
    queryParams.append('end_date', dateRange.end_date);
  }

  return apiClient.get<IFormAnalyticsResponse['data']>(
    `/forms/${formId}/analytics?${queryParams.toString()}`
  );
};

/**
 * Get all forms analytics summary (Admin only)
 */
export const getAllFormsAnalytics = async (
  dateRange?: { start_date: string; end_date: string }
): Promise<IApiResponse<{
  total_forms: number;
  total_submissions: number;
  total_views: number;
  average_conversion_rate: number;
  forms_analytics: IFormAnalytics[];
  trends: Array<{
    date: string;
    total_submissions: number;
    total_views: number;
  }>;
}>> => {
  const queryParams = new URLSearchParams();
  
  if (dateRange) {
    queryParams.append('start_date', dateRange.start_date);
    queryParams.append('end_date', dateRange.end_date);
  }

  return apiClient.get(`/forms/analytics?${queryParams.toString()}`);
};

/**
 * Export form submissions (Admin only)
 */
export const exportFormSubmissions = async (
  formId: string,
  format: 'csv' | 'excel' | 'json' = 'csv',
  filters?: Partial<IFormQueryParams>
): Promise<IApiResponse<{ download_url: string; expires_at: string }>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('format', format);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }

  return apiClient.get(`/forms/${formId}/export?${queryParams.toString()}`);
};

/**
 * Bulk update form submissions (Admin only)
 */
export const bulkUpdateFormSubmissions = async (
  submissionIds: string[],
  updates: {
    status?: TFormStatus;
    priority?: TFormPriority;
    assigned_to?: string;
    tags?: string[];
  }
): Promise<IApiResponse<{ updated_count: number; failed_count: number }>> => {
  return apiClient.put('/forms/submissions/bulk-update', {
    submission_ids: submissionIds,
    updates
  });
};

/**
 * Get form submission statistics (Admin only)
 */
export const getFormSubmissionStats = async (
  dateRange?: { start_date: string; end_date: string }
): Promise<IApiResponse<{
  total_submissions: number;
  submissions_by_type: Record<TFormType, number>;
  submissions_by_status: Record<TFormStatus, number>;
  submissions_by_priority: Record<TFormPriority, number>;
  daily_submissions: Array<{
    date: string;
    count: number;
  }>;
  top_forms: Array<{
    form_id: string;
    form_name: string;
    submission_count: number;
  }>;
  response_times: {
    average_response_time_hours: number;
    median_response_time_hours: number;
  };
}>> => {
  const queryParams = new URLSearchParams();
  
  if (dateRange) {
    queryParams.append('start_date', dateRange.start_date);
    queryParams.append('end_date', dateRange.end_date);
  }

  return apiClient.get(`/forms/stats?${queryParams.toString()}`);
};

// Utility Functions

/**
 * Validate form data against form configuration
 */
export const validateFormData = (
  formConfig: IFormConfig,
  submissionData: IFormSubmissionData
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  
  formConfig.form_fields.forEach(field => {
    const fieldErrors: string[] = [];
    const value = submissionData[field.field_name];
    
    // Required field validation
    if (field.is_required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      fieldErrors.push(`${field.field_label} is required`);
    }
    
    // Type-specific validation
    if (value && field.validation) {
      const validation = field.validation;
      
      // String length validation
      if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          fieldErrors.push(`${field.field_label} must be at least ${validation.minLength} characters`);
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          fieldErrors.push(`${field.field_label} must not exceed ${validation.maxLength} characters`);
        }
        
        // Pattern validation
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          fieldErrors.push(`${field.field_label} format is invalid`);
        }
      }
      
      // Number validation
      if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          fieldErrors.push(`${field.field_label} must be at least ${validation.min}`);
        }
        if (validation.max !== undefined && value > validation.max) {
          fieldErrors.push(`${field.field_label} must not exceed ${validation.max}`);
        }
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field.field_name] = fieldErrors;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format form submission for display
 */
export const formatFormSubmission = (submission: IFormSubmission): {
  formattedData: Record<string, string>;
  metadata: Record<string, any>;
} => {
  const formattedData: Record<string, string> = {};
  const metadata: Record<string, any> = {};
  
  // Format submission data
  Object.entries(submission.submission_data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formattedData[key] = value.join(', ');
    } else if (typeof value === 'boolean') {
      formattedData[key] = value ? 'Yes' : 'No';
    } else {
      formattedData[key] = String(value);
    }
  });
  
  // Add metadata
  metadata.submittedAt = new Date(submission.submitted_at).toLocaleString();
  metadata.status = submission.status;
  metadata.priority = submission.priority;
  metadata.source = submission.source;
  
  if (submission.submitter_info.location) {
    metadata.location = `${submission.submitter_info.location.city}, ${submission.submitter_info.location.country}`;
  }
  
  return { formattedData, metadata };
};

/**
 * Generate form configuration template
 */
export const generateFormTemplate = (
  formType: TFormType,
  formName: string
): Partial<IFormConfig> => {
  const baseConfig: Partial<IFormConfig> = {
    form_name: formName,
    form_title: formName,
    form_type: formType,
    form_settings: {
      allow_multiple_submissions: false,
      require_authentication: false,
      send_confirmation_email: true,
      success_message: 'Thank you for your submission!',
      error_message: 'There was an error processing your submission. Please try again.',
      auto_respond: true,
      notification_emails: []
    },
    is_active: true,
    is_public: true
  };
  
  // Add form-specific fields
  switch (formType) {
    case 'contact':
      baseConfig.form_fields = [
        {
          field_name: 'full_name',
          field_label: 'Full Name',
          field_type: 'text',
          is_required: true,
          is_visible: true,
          field_order: 1,
          validation: { required: true, minLength: 2, maxLength: 100 }
        },
        {
          field_name: 'email',
          field_label: 'Email Address',
          field_type: 'email',
          is_required: true,
          is_visible: true,
          field_order: 2,
          validation: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
        },
        {
          field_name: 'subject',
          field_label: 'Subject',
          field_type: 'text',
          is_required: true,
          is_visible: true,
          field_order: 3,
          validation: { required: true, minLength: 5, maxLength: 200 }
        },
        {
          field_name: 'message',
          field_label: 'Message',
          field_type: 'textarea',
          is_required: true,
          is_visible: true,
          field_order: 4,
          validation: { required: true, minLength: 10, maxLength: 1000 }
        }
      ];
      break;
      
    case 'feedback':
      baseConfig.form_fields = [
        {
          field_name: 'rating',
          field_label: 'Overall Rating',
          field_type: 'select',
          field_options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Poor', '1 - Very Poor'],
          is_required: true,
          is_visible: true,
          field_order: 1,
          validation: { required: true }
        },
        {
          field_name: 'feedback_message',
          field_label: 'Your Feedback',
          field_type: 'textarea',
          is_required: true,
          is_visible: true,
          field_order: 2,
          validation: { required: true, minLength: 10, maxLength: 1000 }
        }
      ];
      break;
      
    default:
      baseConfig.form_fields = [];
  }
  
  return baseConfig;
};

// Export default instance
export default {
  getAllFormConfigs,
  getFormConfigById,
  getPublicFormConfig,
  createFormConfig,
  updateFormConfig,
  deleteFormConfig,
  submitForm,
  submitContactForm,
  submitFeedbackForm,
  submitEnrollmentForm,
  submitSupportForm,
  getFormSubmissions,
  getFormSubmissionById,
  updateFormSubmissionStatus,
  assignFormSubmission,
  respondToFormSubmission,
  deleteFormSubmission,
  getFormAnalytics,
  getAllFormsAnalytics,
  exportFormSubmissions,
  bulkUpdateFormSubmissions,
  getFormSubmissionStats,
  validateFormData,
  formatFormSubmission,
  generateFormTemplate
}; 