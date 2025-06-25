// Enhanced error handling for MEDH API
import { ApiError } from '../types/common';

export class ApiErrorHandler {
  static handleError(error: ApiError | Error): string {
    if ('success' in error && !error.success) {
      // API Error
      const apiError = error as ApiError;
      
      switch (apiError.error_code) {
        case 'VALIDATION_ERROR':
          return this.formatValidationError(apiError);
        case 'UNAUTHORIZED':
          return 'Please log in to continue';
        case 'FORBIDDEN':
          return 'You don\'t have permission to perform this action';
        case 'NOT_FOUND':
          return 'The requested resource was not found';
        case 'NETWORK_ERROR':
          return 'Network error. Please check your connection and try again';
        case 'RATE_LIMIT_EXCEEDED':
          return 'Too many requests. Please wait a moment and try again';
        case 'SERVER_ERROR':
          return 'Server error. Please try again later';
        case 'MAINTENANCE':
          return 'System is under maintenance. Please try again later';
        default:
          return apiError.message || 'An unexpected error occurred';
      }
    } else {
      // Generic Error
      return error.message || 'An unexpected error occurred';
    }
  }

  private static formatValidationError(error: ApiError): string {
    if (error.errors && error.errors.length > 0) {
      const firstError = error.errors[0];
      return firstError.msg || error.message || 'Please check your input and try again';
    }
    return error.message || 'Please check your input and try again';
  }

  static getErrorDetails(error: ApiError | Error): {
    message: string;
    code?: string;
    details?: any;
    hint?: string;
  } {
    if ('success' in error && !error.success) {
      const apiError = error as ApiError;
      return {
        message: this.handleError(error),
        code: apiError.error_code,
        details: apiError.errors,
        hint: apiError.hint,
      };
    }
    
    return {
      message: this.handleError(error),
    };
  }

  static isRetryableError(error: ApiError | Error): boolean {
    if ('success' in error && !error.success) {
      const apiError = error as ApiError;
      const retryableCodes = [
        'NETWORK_ERROR',
        'SERVER_ERROR',
        'TIMEOUT',
        'CONNECTION_ERROR',
      ];
      return retryableCodes.includes(apiError.error_code || '');
    }
    return false;
  }

  static shouldRedirectToLogin(error: ApiError | Error): boolean {
    if ('success' in error && !error.success) {
      const apiError = error as ApiError;
      return apiError.error_code === 'UNAUTHORIZED' || apiError.error_code === 'TOKEN_EXPIRED';
    }
    return false;
  }
}

// Error codes enum for consistency
export enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  MAINTENANCE = 'MAINTENANCE',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  TIMEOUT = 'TIMEOUT',
}