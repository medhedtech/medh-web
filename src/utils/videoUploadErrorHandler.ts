/**
 * Video Upload Error Handler Utility
 * Provides enhanced error handling and user-friendly messages for video upload issues
 * 
 * Usage Examples:
 * 
 * // Example 1: Handle the multipart/JSON parsing error (direct API response)
 * const error = {
 *   "success": false,
 *   "message": "Invalid JSON in request body", 
 *   "error": "Unexpected token '-', \"------WebK\"... is not valid JSON"
 * };
 * 
 * const parsedError = VideoUploadErrorHandler.parseError(error);
 * // Result: { code: 'BACKEND_CONFIG_ERROR', userMessage: '...', isRetryable: false }
 * 
 * // Example 2: Handle wrapped error from retry logic (video-streaming.ts)
 * const wrappedError = new Error("Failed to upload chunk after 3 attempts: Unexpected token '-', \"------WebK\"... is not valid JSON");
 * const parsedWrappedError = VideoUploadErrorHandler.parseError(wrappedError);
 * // Result: { code: 'BACKEND_CONFIG_ERROR', userMessage: '...', isRetryable: false }
 * 
 * // Example 3: Get user-friendly message
 * const userMessage = VideoUploadErrorHandler.getUserFriendlyMessage(error);
 * // Result: "Server configuration issue detected. The video upload service needs to be updated. Please contact support..."
 * 
 * // Example 4: Using the React hook
 * const { handleError, getUserMessage } = useVideoUploadErrorHandler();
 * const errorInfo = handleError(error, { uploadId: 'abc123', chunkIndex: 0 });
 * 
 * // Quick test for the chunk upload error fix (remove this in production)
 * if (typeof window !== 'undefined') {
 *   const testError = new Error("Failed to upload chunk after 3 attempts: Unexpected token '-', \"------WebK\"... is not valid JSON");
 *   const result = VideoUploadErrorHandler.parseError(testError);
 *   if (result.code === 'BACKEND_CONFIG_ERROR') {
 *     console.log('✅ VideoUploadErrorHandler: Chunk upload error detection working correctly');
 *   } else {
 *     console.warn('❌ VideoUploadErrorHandler: Chunk upload error detection NOT working, got:', result.code);
 *   }
 * }
 */

export interface IVideoUploadError {
  code: string;
  message: string;
  userMessage: string;
  isRetryable: boolean;
  suggestedAction: string;
}

export class VideoUploadErrorHandler {
  /**
   * Parse and categorize video upload errors
   * @param error - The error object from the API
   * @returns Structured error information
   */
  static parseError(error: any): IVideoUploadError {
    // Handle session expiration errors (AWS S3 NoSuchUpload)
    const hasSessionExpiredError = (
      // Check for the specific error structure from the backend
      (error.errorType === 'NoSuchUpload' && error.isSessionExpired === true) ||
      (error.awsError === 'Upload session expired or invalid') ||
      (error.actionRequired === 'RESTART_UPLOAD') ||
      // Check for NoSuchUpload in error messages
      error.message?.includes('NoSuchUpload') ||
      error.message?.includes('Upload session expired') ||
      error.message?.includes('does not exist') ||
      // Check in nested error structures
      error.error?.errorType === 'NoSuchUpload' ||
      error.error?.awsError?.includes('Upload session expired') ||
      error.originalError?.includes('Upload session expired') ||
      // Check response data
      error.response?.data?.errorType === 'NoSuchUpload' ||
      error.response?.data?.awsError?.includes('Upload session expired') ||
      error.data?.errorType === 'NoSuchUpload' ||
      error.data?.awsError?.includes('Upload session expired')
    );

    if (hasSessionExpiredError) {
      return {
        code: 'SESSION_EXPIRED',
        message: 'Upload session has expired and needs to be restarted',
        userMessage: 'Your upload session has expired. This can happen with large files or slow connections.',
        isRetryable: true,
        suggestedAction: 'Please restart the upload with a fresh session. Your progress will be lost, but you can upload the file again.'
      };
    }

    // Handle JSON parsing errors (the main issue) - improved detection
    const hasJsonParsingError = (
      // Check various possible error structures
      error.response?.status === 400 && (
        error.response?.data?.includes?.('Unexpected token') ||
        error.response?.data?.message?.includes?.('Invalid JSON') ||
        error.response?.data?.error?.includes?.('Unexpected token') ||
        error.message?.includes('Unexpected token') ||
        error.message?.includes('Invalid JSON') ||
        error.data?.message?.includes?.('Invalid JSON') ||
        error.data?.error?.includes?.('Unexpected token') ||
        // Handle the specific case shown in the user's error
        (typeof error.message === 'string' && error.message.includes('Invalid JSON in request body')) ||
        (typeof error.error === 'string' && error.error.includes('Unexpected token')) ||
        // Check if response data contains WebKitFormBoundary (indicates multipart parsing issue)
        error.response?.data?.includes?.('WebKitFormBoundary') ||
        error.data?.error?.includes?.('WebKitFormBoundary')
      )
    ) || (
      // Handle case where error is the response object itself
      error.success === false && (
        error.message?.includes?.('Invalid JSON') ||
        error.error?.includes?.('Unexpected token')
      )
    ) || (
      // Handle wrapped errors from video-streaming.ts retry logic
      typeof error.message === 'string' && (
        error.message.includes('Failed to upload chunk after') && 
        error.message.includes('Unexpected token') &&
        (error.message.includes('is not valid JSON') || error.message.includes('... is not valid JSON'))
      )
    );

    if (hasJsonParsingError) {
      return {
        code: 'BACKEND_CONFIG_ERROR',
        message: 'Backend is not configured to handle multipart uploads',
        userMessage: 'Server configuration issue detected. The video upload service needs to be updated.',
        isRetryable: false,
        suggestedAction: 'Please contact support or try again later when the issue is resolved.'
      };
    }

    // Handle empty chunk errors (file size calculation issues)
    if (error.message?.includes('Empty chunk detected')) {
      return {
        code: 'EMPTY_CHUNK_ERROR',
        message: 'Empty chunk detected during upload',
        userMessage: 'There was an issue with file processing. This usually happens with very specific file sizes.',
        isRetryable: true,
        suggestedAction: 'Please try uploading the file again. If the problem persists, try converting the video to a different format or size.'
      };
    }

    // Handle parameter mismatch errors
    if (error.message?.includes('uploadSession, chunkData, and partNumber are required') ||
        error.response?.data?.message?.includes('uploadSession, chunkData, and partNumber are required')) {
      return {
        code: 'PARAMETER_MISMATCH',
        message: 'Frontend and backend parameter names do not match',
        userMessage: 'The upload service configuration has been updated.',
        isRetryable: true,
        suggestedAction: 'Please refresh the page and try uploading again.'
      };
    }

    // Handle detailed parameter validation errors from the backend
    if (error.message?.includes('uploadSession (must be a valid JSON object/string), chunkData (must be non-empty), and partNumber (must be a positive integer) are required') ||
        (error.error?.errors && error.error.errors.uploadSession && error.error.errors.chunkData && error.error.errors.partNumber)) {
      let userMessage = 'There was an issue with the upload parameters. ';
      if (error.error?.receivedValues?.chunkDataProvided === false) {
        userMessage += 'The video file chunk was not sent correctly. ';
      }
      userMessage += 'Please try the upload again. If the issue persists, contact support.';
      return {
        code: 'DETAILED_PARAMETER_VALIDATION_ERROR',
        message: error.message || 'Detailed parameter validation failed on backend.',
        userMessage,
        isRetryable: false, // Usually not retryable without code/config changes
        suggestedAction: 'Please check your internet connection and try the upload again. If the problem continues, please contact support with the error details.'
      };
    }

    // Handle res.status is not a function error
    if (error.message?.includes('res.status is not a function')) {
      return {
        code: 'BACKEND_RESPONSE_ERROR',
        message: 'Backend response handler is misconfigured',
        userMessage: 'Server response issue detected during upload cancellation.',
        isRetryable: false,
        suggestedAction: 'The upload cancellation may have succeeded despite the error. Try refreshing the page.'
      };
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      return {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        userMessage: 'Your session has expired. Please log in again.',
        isRetryable: true,
        suggestedAction: 'Please log in again and try uploading the video.'
      };
    }

    // Handle file size errors
    if (error.response?.status === 413) {
      return {
        code: 'FILE_TOO_LARGE',
        message: 'File or chunk too large',
        userMessage: 'The video file is too large for upload.',
        isRetryable: false,
        suggestedAction: 'Please use a smaller video file or compress the video before uploading.'
      };
    }

    // Handle unsupported file type
    if (error.response?.status === 415) {
      return {
        code: 'UNSUPPORTED_FORMAT',
        message: 'Unsupported file format',
        userMessage: 'This video format is not supported.',
        isRetryable: false,
        suggestedAction: 'Please convert your video to MP4, MOV, WebM, AVI, or MKV format.'
      };
    }

    // Handle server errors
    if (error.response?.status === 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        userMessage: 'The video upload service is temporarily unavailable.',
        isRetryable: true,
        suggestedAction: 'Please try again in a few minutes. If the problem persists, contact support.'
      };
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection error',
        userMessage: 'Unable to connect to the upload service.',
        isRetryable: true,
        suggestedAction: 'Please check your internet connection and try again.'
      };
    }

    // Handle upload session not found
    if (error.response?.status === 404) {
      return {
        code: 'SESSION_NOT_FOUND',
        message: 'Upload session not found',
        userMessage: 'The upload session has expired or was not found.',
        isRetryable: false,
        suggestedAction: 'Please start a new upload.'
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Upload timeout',
        userMessage: 'The upload is taking too long to complete.',
        isRetryable: true,
        suggestedAction: 'Please check your internet connection and try again with a smaller file.'
      };
    }

    // Default error handling
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred during video upload.',
      isRetryable: true,
      suggestedAction: 'Please try again. If the problem persists, contact support.'
    };
  }

  /**
   * Get user-friendly error message with suggested actions
   * @param error - The error object
   * @returns User-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    const parsedError = this.parseError(error);
    return `${parsedError.userMessage} ${parsedError.suggestedAction}`;
  }

  /**
   * Check if an error is retryable
   * @param error - The error object
   * @returns Whether the operation should be retried
   */
  static isRetryable(error: any): boolean {
    const parsedError = this.parseError(error);
    return parsedError.isRetryable;
  }

  /**
   * Get retry delay based on error type
   * @param error - The error object
   * @param attemptNumber - Current attempt number
   * @returns Delay in milliseconds
   */
  static getRetryDelay(error: any, attemptNumber: number): number {
    const parsedError = this.parseError(error);
    
    switch (parsedError.code) {
      case 'NETWORK_ERROR':
        return attemptNumber * 2000; // 2s, 4s, 6s
      case 'SERVER_ERROR':
        return attemptNumber * 1000; // 1s, 2s, 3s
      case 'TIMEOUT_ERROR':
        return attemptNumber * 3000; // 3s, 6s, 9s
      default:
        return attemptNumber * 1000; // Default 1s, 2s, 3s
    }
  }

  /**
   * Log error details for debugging
   * @param error - The error object
   * @param context - Additional context information
   */
  static logError(error: any, context: Record<string, any> = {}): void {
    const parsedError = this.parseError(error);
    
    console.group('🚨 Video Upload Error');
    console.error('Error Code:', parsedError.code);
    console.error('Error Message:', parsedError.message);
    console.error('User Message:', parsedError.userMessage);
    console.error('Is Retryable:', parsedError.isRetryable);
    console.error('Suggested Action:', parsedError.suggestedAction);
    console.error('Context:', context);
    console.error('Original Error:', error);
    console.groupEnd();
  }

  /**
   * Create a standardized error response for UI components
   * @param error - The error object
   * @returns Standardized error response
   */
  static createErrorResponse(error: any): {
    success: false;
    error: IVideoUploadError;
    timestamp: string;
  } {
    return {
      success: false,
      error: this.parseError(error),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Test method to verify error detection works correctly
   * @param testError - Test error object
   */
  static testErrorDetection(testError: any): void {
    console.group('🧪 Testing Video Upload Error Detection');
    const parsedError = this.parseError(testError);
    console.log('Input Error:', testError);
    console.log('Detected Error Code:', parsedError.code);
    console.log('User Message:', parsedError.userMessage);
    console.log('Is Retryable:', parsedError.isRetryable);
    console.groupEnd();
  }

  /**
   * Test the specific wrapped chunk upload error fix
   */
  static testChunkUploadErrorFix(): void {
    console.group('🔧 Testing Chunk Upload Error Fix');
    
    // Test the exact error from the user's logs
    const wrappedError = new Error("Failed to upload chunk after 3 attempts: Unexpected token '-', \"------WebK\"... is not valid JSON");
    const parsedError = this.parseError(wrappedError);
    
    console.log('✅ Testing wrapped chunk upload error:');
    console.log('Error message:', wrappedError.message);
    console.log('Detected code:', parsedError.code);
    console.log('Expected: BACKEND_CONFIG_ERROR');
    console.log('Match:', parsedError.code === 'BACKEND_CONFIG_ERROR' ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n🎯 User message:', parsedError.userMessage);
    console.log('🔄 Is retryable:', parsedError.isRetryable);
    console.log('💡 Suggested action:', parsedError.suggestedAction);
    
    console.groupEnd();
  }

  /**
   * Test session expiration error detection for the user's specific case
   */
  static testSessionExpirationErrorFix(): void {
    console.group('🔧 Testing Session Expiration Error Detection');
    
    // Test the exact error structure from the user's case
    const sessionExpiredError = {
      success: false,
      message: "Failed to upload video chunk",
      error: {
        partNumber: 1,
        videoId: "e80e432c-3b70-438b-97d5-38e6d66ebcb8",
        chunkSize: 10485760,
        actionRequired: "RESTART_UPLOAD",
        awsError: "Upload session expired or invalid",
        errorType: "NoSuchUpload",
        isSessionExpired: true,
        originalError: "Upload session expired or invalid. UploadId: KV85A2792eRvHov4yZtIHZvP42e3xfS3Ej2Pt.ZY581aqrzMOcj35c04jbcsDKCT.Q5ejdzRq130EnTB2LjxfDrI640AVUu7fL_SmOU0J.yeR1LEcxdN1_fwqowt_B6P",
        stack: "NoSuchUpload: Upload session expired or invalid. UploadId: KV85A2792eRvHov4yZtIHZvP42e3xfS3Ej2Pt.ZY581aqrzMOcj35c04jbcsDKCT.Q5ejdzRq130EnTB2LjxfDrI640AVUu7fL_SmOU0J.yeR1LEcxdN1_fwqowt_B6P\\n    at VideoStreamingService.uploadVideoChunk (file:///Users/abhishekjha/Documents/Medh-live/medh-backend/services/videoStreamingService.js:301:40)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\\n    at async file:///Users/abhishekjha/Documents/Medh-live/medh-backend/controllers/videoStreamingController.js:326:20",
        suggestion: "Please restart the upload process with a new session",
        timestamp: "2025-06-03T09:25:10.157Z"
      }
    };
    
    const parsedError = this.parseError(sessionExpiredError);
    
    console.log('✅ Testing session expiration error:');
    console.log('Error structure:', sessionExpiredError);
    console.log('Detected code:', parsedError.code);
    console.log('Expected: SESSION_EXPIRED');
    console.log('Match:', parsedError.code === 'SESSION_EXPIRED' ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n🎯 User message:', parsedError.userMessage);
    console.log('🔄 Is retryable:', parsedError.isRetryable);
    console.log('💡 Suggested action:', parsedError.suggestedAction);
    
    // Test alternative error structures
    const alternativeError1 = { errorType: 'NoSuchUpload', isSessionExpired: true };
    const alternativeError2 = { awsError: 'Upload session expired or invalid' };
    const alternativeError3 = { actionRequired: 'RESTART_UPLOAD' };
    
    console.log('\n🧪 Testing alternative error structures:');
    console.log('Alternative 1 (errorType + isSessionExpired):', this.parseError(alternativeError1).code === 'SESSION_EXPIRED' ? '✅ PASS' : '❌ FAIL');
    console.log('Alternative 2 (awsError):', this.parseError(alternativeError2).code === 'SESSION_EXPIRED' ? '✅ PASS' : '❌ FAIL');
    console.log('Alternative 3 (actionRequired):', this.parseError(alternativeError3).code === 'SESSION_EXPIRED' ? '✅ PASS' : '❌ FAIL');
    
    console.groupEnd();
  }
}

/**
 * Hook for handling video upload errors in React components
 */
export const useVideoUploadErrorHandler = () => {
  const handleError = (error: any, context?: Record<string, any>) => {
    VideoUploadErrorHandler.logError(error, context);
    return VideoUploadErrorHandler.parseError(error);
  };

  const getUserMessage = (error: any) => {
    return VideoUploadErrorHandler.getUserFriendlyMessage(error);
  };

  const shouldRetry = (error: any) => {
    return VideoUploadErrorHandler.isRetryable(error);
  };

  const getRetryDelay = (error: any, attempt: number) => {
    return VideoUploadErrorHandler.getRetryDelay(error, attempt);
  };

  return {
    handleError,
    getUserMessage,
    shouldRetry,
    getRetryDelay
  };
};

export default VideoUploadErrorHandler; 