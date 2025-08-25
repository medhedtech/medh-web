import { TFormType, TFormStatus, TFormPriority, IFormSubmissionData, IFormField } from "@/apis/form.api";

/**
 * Form validation utilities
 */
export const formValidators = {
  // Email validation
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  // Phone validation (international format)
  phone: (value: string): boolean => {
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(value);
  },

  // URL validation
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Password strength validation - NO RESTRICTIONS
  password: (value: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; issues: string[] } => {
    const issues: string[] = [];

    if (!value || value.length === 0) {
      issues.push("Password cannot be empty");
    }

    const isValid = value && value.length > 0;
    const strength = 'strong'; // Always strong if not empty

    return { isValid, strength, issues };
  },

  // File validation
  file: (file: File, options: { maxSize?: number; allowedTypes?: string[] } = {}): { isValid: boolean; error?: string } => {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options; // Default 10MB

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  },
};

/**
 * Form data transformation utilities
 */
export const formTransformers = {
  // Clean phone number (remove formatting)
  cleanPhone: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  },

  // Format phone number for display
  formatPhone: (phone: string): string => {
    const cleaned = formTransformers.cleanPhone(phone);
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  // Sanitize text input
  sanitizeText: (text: string): string => {
    return text.trim().replace(/\s+/g, ' ');
  },

  // Transform form data for API submission
  transformForSubmission: (data: Record<string, any>, formType: TFormType): IFormSubmissionData => {
    const transformed: IFormSubmissionData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'string') {
          transformed[key] = formTransformers.sanitizeText(value);
        } else {
          transformed[key] = value;
        }
      }
    });

    // Add form-specific transformations
    switch (formType) {
      case 'contact':
        if (transformed.phone) {
          transformed.phone = formTransformers.cleanPhone(transformed.phone as string);
        }
        break;
      case 'enrollment':
        if (transformed.phone) {
          transformed.phone = formTransformers.cleanPhone(transformed.phone as string);
        }
        if (transformed.emergency_contact && typeof transformed.emergency_contact === 'object' && 'phone' in transformed.emergency_contact && transformed.emergency_contact.phone) {
          (transformed.emergency_contact as any).phone = formTransformers.cleanPhone(
            (transformed.emergency_contact as any).phone as string
          );
        }
        break;
    }

    return transformed;
  },
};

/**
 * Form field generators for common use cases
 */
export const fieldGenerators = {
  // Generate name field
  nameField: (required = true): IFormField => ({
    field_name: 'full_name',
    field_label: 'Full Name',
    field_type: 'text',
    field_placeholder: 'Enter your full name',
    is_required: required,
    is_visible: true,
    field_order: 1,
    validation: {
      required,
      minLength: 2,
      maxLength: 50,
      pattern: '^[a-zA-Z\\s]*$'
    }
  }),

  // Generate email field
  emailField: (required = true): IFormField => ({
    field_name: 'email',
    field_label: 'Email Address',
    field_type: 'email',
    field_placeholder: 'Enter your email address',
    is_required: required,
    is_visible: true,
    field_order: 2,
    validation: {
      required,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
    }
  }),

  // Generate phone field
  phoneField: (required = false): IFormField => ({
    field_name: 'phone',
    field_label: 'Phone Number',
    field_type: 'phone',
    field_placeholder: 'Enter your phone number',
    is_required: required,
    is_visible: true,
    field_order: 3,
    validation: {
      required,
      pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$'
    }
  }),

  // Generate message field
  messageField: (required = true, minLength = 20): IFormField => ({
    field_name: 'message',
    field_label: 'Message',
    field_type: 'textarea',
    field_placeholder: 'Enter your message...',
    is_required: required,
    is_visible: true,
    field_order: 10,
    validation: {
      required,
      minLength,
      maxLength: 2000
    }
  }),

  // Generate file upload field
  fileField: (name: string, label: string, accept: string[], required = false): IFormField => ({
    field_name: name,
    field_label: label,
    field_type: 'file',
    field_placeholder: `Upload ${label.toLowerCase()}`,
    is_required: required,
    is_visible: true,
    field_order: 20,
    validation: {
      required,
      fileTypes: accept,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    }
  }),

  // Generate select field
  selectField: (
    name: string,
    label: string,
    options: string[],
    required = true
  ): IFormField => ({
    field_name: name,
    field_label: label,
    field_type: 'select',
    field_placeholder: `Select ${label.toLowerCase()}`,
    field_options: options,
    is_required: required,
    is_visible: true,
    field_order: 5,
    validation: {
      required
    }
  }),
};

/**
 * Form status utilities
 */
export const formStatusUtils = {
  // Get status color
  getStatusColor: (status: TFormStatus): string => {
    const colors = {
      draft: 'gray',
      submitted: 'blue',
      processing: 'yellow',
      completed: 'green',
      rejected: 'red',
      archived: 'gray'
    };
    return colors[status] || 'gray';
  },

  // Get status label
  getStatusLabel: (status: TFormStatus): string => {
    const labels = {
      draft: 'Draft',
      submitted: 'Submitted',
      processing: 'Processing',
      completed: 'Completed',
      rejected: 'Rejected',
      archived: 'Archived'
    };
    return labels[status] || status;
  },

  // Get priority color
  getPriorityColor: (priority: TFormPriority): string => {
    const colors = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      urgent: 'red'
    };
    return colors[priority] || 'gray';
  },

  // Get priority label
  getPriorityLabel: (priority: TFormPriority): string => {
    const labels = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority',
      urgent: 'Urgent'
    };
    return labels[priority] || priority;
  },
};

/**
 * Form analytics utilities
 */
export const formAnalytics = {
  // Calculate completion rate
  calculateCompletionRate: (totalViews: number, totalSubmissions: number): number => {
    if (totalViews === 0) return 0;
    return Math.round((totalSubmissions / totalViews) * 100);
  },

  // Calculate abandonment rate
  calculateAbandonmentRate: (totalViews: number, totalSubmissions: number): number => {
    if (totalViews === 0) return 0;
    return Math.round(((totalViews - totalSubmissions) / totalViews) * 100);
  },

  // Format duration
  formatDuration: (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      return `${Math.round(seconds / 3600)}h`;
    }
  },

  // Get form performance grade
  getPerformanceGrade: (conversionRate: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (conversionRate >= 80) return 'A';
    if (conversionRate >= 70) return 'B';
    if (conversionRate >= 60) return 'C';
    if (conversionRate >= 50) return 'D';
    return 'F';
  },
};

/**
 * Form error handling utilities
 */
export const formErrorUtils = {
  // Parse API errors
  parseApiError: (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    return 'An unexpected error occurred. Please try again.';
  },

  // Get user-friendly error messages
  getUserFriendlyError: (error: string): string => {
    const errorMap: Record<string, string> = {
      'NETWORK_ERROR': 'Network connection error. Please check your internet connection.',
      'VALIDATION_ERROR': 'Please check your form inputs and try again.',
      'FILE_TOO_LARGE': 'File size is too large. Please choose a smaller file.',
      'INVALID_FILE_TYPE': 'Invalid file type. Please choose a supported file format.',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment and try again.',
      'UNAUTHORIZED': 'You are not authorized to perform this action.',
      'FORBIDDEN': 'Access denied. Please contact support if you need help.',
      'NOT_FOUND': 'The requested resource was not found.',
      'INTERNAL_SERVER_ERROR': 'Server error. Please try again later.',
    };

    return errorMap[error] || formErrorUtils.parseApiError(error);
  },

  // Validate form data before submission
  validateFormData: (data: Record<string, any>, fields: IFormField[]): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
      const value = data[field.field_name];

      // Check required fields
      if (field.is_required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field.field_name] = `${field.field_label} is required`;
        return;
      }

      // Skip validation if field is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return;
      }

      // Type-specific validation
      if (field.field_type === 'email' && !formValidators.email(value)) {
        errors[field.field_name] = 'Please enter a valid email address';
      }

      if (field.field_type === 'phone' && !formValidators.phone(value)) {
        errors[field.field_name] = 'Please enter a valid phone number';
      }

      if (field.field_type === 'url' && !formValidators.url(value)) {
        errors[field.field_name] = 'Please enter a valid URL';
      }

      // Length validation
      if (field.validation?.minLength && value.length < field.validation.minLength) {
        errors[field.field_name] = `${field.field_label} must be at least ${field.validation.minLength} characters`;
      }

      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        errors[field.field_name] = `${field.field_label} must not exceed ${field.validation.maxLength} characters`;
      }

      // Pattern validation
      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          errors[field.field_name] = field.validation.customValidation || `${field.field_label} format is invalid`;
        }
      }

      // File validation
      if (field.field_type === 'file' && value instanceof File) {
        const fileValidation = formValidators.file(value, {
          maxSize: field.validation?.maxFileSize,
          allowedTypes: field.validation?.fileTypes
        });

        if (!fileValidation.isValid) {
          errors[field.field_name] = fileValidation.error || 'Invalid file';
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
};

/**
 * Local storage utilities for form data
 */
export const formStorageUtils = {
  // Save form draft
  saveDraft: (formId: string, data: Record<string, any>): void => {
    try {
      const key = `form_draft_${formId}`;
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save form draft:', error);
    }
  },

  // Load form draft
  loadDraft: (formId: string): Record<string, any> | null => {
    try {
      const key = `form_draft_${formId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Check if draft is older than 24 hours
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to load form draft:', error);
      return null;
    }
  },

  // Clear form draft
  clearDraft: (formId: string): void => {
    try {
      const key = `form_draft_${formId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear form draft:', error);
    }
  },

  // Clear all expired drafts
  clearExpiredDrafts: (): void => {
    try {
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const keys = Object.keys(localStorage).filter(key => key.startsWith('form_draft_'));

      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Date.now() - parsed.timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Remove invalid entries
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired drafts:', error);
    }
  },
};

/**
 * Form accessibility utilities
 */
export const formA11yUtils = {
  // Generate accessible field ID
  generateFieldId: (formId: string, fieldName: string): string => {
    return `${formId}_${fieldName}`;
  },

  // Generate aria-describedby for error messages
  generateErrorId: (formId: string, fieldName: string): string => {
    return `${formId}_${fieldName}_error`;
  },

  // Generate aria-describedby for help text
  generateHelpId: (formId: string, fieldName: string): string => {
    return `${formId}_${fieldName}_help`;
  },

  // Get ARIA attributes for form field
  getFieldAriaAttributes: (
    formId: string,
    fieldName: string,
    hasError: boolean,
    hasHelp: boolean
  ): Record<string, string> => {
    const attributes: Record<string, string> = {};

    if (hasError) {
      attributes['aria-invalid'] = 'true';
      attributes['aria-describedby'] = formA11yUtils.generateErrorId(formId, fieldName);
    }

    if (hasHelp) {
      const existingDescribedBy = attributes['aria-describedby'];
      const helpId = formA11yUtils.generateHelpId(formId, fieldName);
      attributes['aria-describedby'] = existingDescribedBy 
        ? `${existingDescribedBy} ${helpId}`
        : helpId;
    }

    return attributes;
  },
}; 