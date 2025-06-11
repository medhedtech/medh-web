/**
 * Video Upload Utilities
 * Helper functions for video upload operations including base64 encoding
 */

export interface IVideoChunkEncoding {
  base64Data: string;
  originalSize: number;
  encodedSize: number;
  mimeType: string;
}

/**
 * Convert a Blob/File to base64 string for JSON transmission
 * @param blob - The blob or file to encode
 * @returns Promise with base64 string and metadata
 */
export const convertBlobToBase64 = async (blob: Blob | File): Promise<IVideoChunkEncoding> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
        const base64Data = result.split(',')[1] || result;
        
        resolve({
          base64Data,
          originalSize: blob.size,
          encodedSize: base64Data.length,
          mimeType: blob.type || 'application/octet-stream'
        });
      } catch (error: any) {
        reject(new Error(`Failed to encode blob to base64: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read blob for base64 encoding'));
    };
    
    // Read as data URL to get base64 encoding
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert base64 string back to Blob (for verification/testing)
 * @param base64Data - Base64 encoded data
 * @param mimeType - MIME type of the original data
 * @returns Blob object
 */
export const convertBase64ToBlob = (base64Data: string, mimeType: string = 'application/octet-stream'): Blob => {
  try {
    // Decode base64 to binary string
    const binaryString = atob(base64Data);
    
    // Convert binary string to byte array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: mimeType });
  } catch (error: any) {
    throw new Error(`Failed to convert base64 to blob: ${error.message}`);
  }
};

/**
 * Calculate the estimated base64 size for a given file size
 * Base64 encoding increases size by approximately 33%
 * @param originalSize - Original file size in bytes
 * @returns Estimated base64 encoded size
 */
export const calculateBase64Size = (originalSize: number): number => {
  // Base64 encoding: every 3 bytes become 4 characters
  // Plus padding and overhead
  return Math.ceil((originalSize * 4) / 3);
};

/**
 * Validate if a chunk size is appropriate for JSON transmission
 * @param chunkSize - Chunk size in bytes
 * @returns Validation result with recommendation
 */
export const validateChunkSizeForJson = (chunkSize: number): {
  isValid: boolean;
  recommendation?: string;
  estimatedJsonSize: number;
} => {
  const estimatedJsonSize = calculateBase64Size(chunkSize);
  const maxRecommendedSize = 10 * 1024 * 1024; // 10MB for JSON payload
  
  if (estimatedJsonSize > maxRecommendedSize) {
    return {
      isValid: false,
      recommendation: `Chunk size too large for JSON. Recommended max: ${Math.floor(maxRecommendedSize * 0.75 / 1024 / 1024)}MB`,
      estimatedJsonSize
    };
  }
  
  return {
    isValid: true,
    estimatedJsonSize
  };
};

/**
 * Format file size in human readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create a checksum for a blob (optional integrity check)
 * @param blob - The blob to checksum
 * @returns Promise with hex checksum string
 */
export const createBlobChecksum = async (blob: Blob): Promise<string> => {
  if (!crypto.subtle) {
    console.warn('Web Crypto API not available, skipping checksum');
    return '';
  }
  
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.warn('Failed to create checksum:', error);
    return '';
  }
};

/**
 * Validate video file before upload
 * @param file - The video file to validate
 * @returns Validation result
 */
export const validateVideoFile = (file: File): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check file type
  const supportedTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi', 'video/mkv', 'video/quicktime'];
  if (!supportedTypes.includes(file.type)) {
    errors.push(`Unsupported file type: ${file.type}. Supported types: ${supportedTypes.join(', ')}`);
  }
  
  // Check file size (max 10GB)
  const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
  if (file.size > maxSize) {
    errors.push(`File too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(maxSize)}`);
  }
  
  // Check minimum size
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    errors.push(`File too small: ${formatFileSize(file.size)}. Minimum size: ${formatFileSize(minSize)}`);
  }
  
  // Warnings for large files
  const warningSize = 1 * 1024 * 1024 * 1024; // 1GB
  if (file.size > warningSize) {
    warnings.push(`Large file detected: ${formatFileSize(file.size)}. Upload may take a while.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Test the base64 encoding/decoding functionality
 * @param testData - Optional test data (default: small test string)
 * @returns Test results
 */
export const testBase64Encoding = async (testData?: string): Promise<{
  success: boolean;
  originalSize: number;
  encodedSize: number;
  decodedMatches: boolean;
  error?: string;
}> => {
  try {
    const original = testData || 'Hello, Video Upload Test! 🎬';
    const blob = new Blob([original], { type: 'text/plain' });
    
    // Encode to base64
    const encoded = await convertBlobToBase64(blob);
    
    // Decode back to blob
    const decodedBlob = convertBase64ToBlob(encoded.base64Data, 'text/plain');
    const decodedText = await decodedBlob.text();
    
    return {
      success: true,
      originalSize: blob.size,
      encodedSize: encoded.encodedSize,
      decodedMatches: original === decodedText,
    };
  } catch (error: any) {
    return {
      success: false,
      originalSize: 0,
      encodedSize: 0,
      decodedMatches: false,
      error: error.message
    };
  }
};

// Quick test when in browser environment
if (typeof window !== 'undefined') {
  // Run a quick test to verify encoding works
  testBase64Encoding().then(result => {
    if (result.success && result.decodedMatches) {
      console.log('✅ Video upload base64 encoding: Working correctly');
    } else {
      console.warn('❌ Video upload base64 encoding: Test failed', result);
    }
  }).catch(error => {
    console.warn('❌ Video upload base64 encoding: Test error', error);
  });
}

/**
 * Utility function to handle video upload session restart
 * This helps users restart uploads when sessions expire
 */
export const handleVideoUploadSessionRestart = async (
  originalFile: File,
  originalMetadata: any,
  onProgress?: (progress: number) => void,
  onComplete?: (result: any) => void,
  onError?: (error: any) => void
) => {
  try {
    console.log('🔄 Restarting video upload with fresh session...');
    
    // Import VideoUploadClient dynamically to avoid circular dependencies
    const { VideoUploadClient } = await import('@/apis/video-streaming');
    
    // Create new upload client
    const uploadClient = new VideoUploadClient();
    
    // Set up event handlers
    if (onProgress) {
      uploadClient.onProgress = (progress, uploadedChunks, totalChunks) => {
        onProgress(progress);
        console.log(`📈 Upload progress: ${progress}% (${uploadedChunks}/${totalChunks} chunks)`);
      };
    }
    
    uploadClient.onStatusChange = (status) => {
      console.log(`🔄 Upload status changed to: ${status}`);
      if (status === 'completed' && onComplete) {
        const progress = uploadClient.getProgress();
        onComplete({ 
          success: true, 
          videoId: progress.videoId,
          message: 'Upload completed successfully'
        });
      }
    };
    
    if (onError) {
      uploadClient.onError = (error, errorInfo) => {
        console.error('❌ Upload error:', error, errorInfo);
        onError({ error, errorInfo });
      };
    }
    
    // 🆕 SESSION RECOVERY HANDLER
    uploadClient.onSessionRecovered = (recoveryInfo) => {
      console.log('🔄 Session automatically recovered:', recoveryInfo);
      // Optionally notify the UI about session recovery
      if (onProgress) {
        // Keep the current progress but notify about recovery
        const currentProgress = uploadClient.getProgress();
        onProgress(currentProgress.progress);
      }
    };
    
    // Initialize with recovery data
    await uploadClient.initialize(originalFile, originalMetadata);
    
    // Start the upload
    const result = await uploadClient.upload(originalFile);
    
    console.log('✅ Video upload restarted successfully:', result);
    return result;
    
  } catch (error: any) {
    console.error('❌ Failed to restart video upload:', error);
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

/**
 * Validate upload session and check for expiration warnings
 * @param uploadSession - The upload session to validate
 * @returns Validation result with recommendations
 */
export const validateUploadSession = async (uploadSession: any): Promise<{
  isValid: boolean;
  isNearExpiration: boolean;
  expirationWarning?: string;
  shouldRefresh: boolean;
  error?: string;
}> => {
  try {
    // Import API dynamically
    const { videoStreamingAPI } = await import('@/apis/video-streaming');
    
    const result = await videoStreamingAPI.validateSession(uploadSession);
    
    if (result.status === 'success' && result.data) {
      return {
        isValid: result.data.isValid,
        isNearExpiration: result.data.sessionInfo?.isNearExpiration || false,
        expirationWarning: result.data.sessionInfo?.expirationWarning,
        shouldRefresh: result.data.sessionInfo?.isNearExpiration || false,
      };
    } else {
      return {
        isValid: false,
        isNearExpiration: false,
        shouldRefresh: true,
        error: result.data?.reason || 'Session validation failed'
      };
    }
  } catch (error: any) {
    console.error('❌ Session validation error:', error);
    return {
      isValid: false,
      isNearExpiration: false,
      shouldRefresh: true,
      error: error.message || 'Session validation error'
    };
  }
};

/**
 * Attempt to recover an expired session manually
 * @param expiredSession - The expired upload session
 * @param recoveryData - Recovery data (originalFileName, courseId, contentType)
 * @returns Recovery result
 */
export const recoverUploadSession = async (
  expiredSession: any, 
  recoveryData: {
    originalFileName: string;
    courseId: string;
    contentType: string;
  }
): Promise<{
  success: boolean;
  newUploadSession?: any;
  recovery?: {
    previousVideoId: string;
    newVideoId: string;
    sessionRecovered: boolean;
  };
  error?: string;
}> => {
  try {
    console.log('🔧 Attempting manual session recovery...');
    
    // Import API dynamically
    const { videoStreamingAPI } = await import('@/apis/video-streaming');
    
    const result = await videoStreamingAPI.recoverSession(expiredSession, recoveryData);
    
    if (result.status === 'success' && result.data) {
      console.log('✅ Manual session recovery successful:', result.data.recovery);
      return {
        success: true,
        newUploadSession: result.data.newUploadSession,
        recovery: result.data.recovery
      };
    } else {
      return {
        success: false,
        error: result.message || 'Recovery failed'
      };
    }
  } catch (error: any) {
    console.error('❌ Manual session recovery failed:', error);
    return {
      success: false,
      error: error.message || 'Recovery error'
    };
  }
};

/**
 * Enhanced error checker for session expiration with recovery guidance
 * @param error - The error to check
 * @returns Enhanced error information with recovery guidance
 */
export const checkSessionExpirationError = (error: any): {
  isSessionExpired: boolean;
  needsRecovery: boolean;
  hasRecoveryData: boolean;
  canAttemptRecovery: boolean;
  missingRecoveryFields: string[];
  recoveryInstructions: string;
} => {
  // Import error handler dynamically
  const VideoUploadErrorHandler = require('./videoUploadErrorHandler').default;
  const errorInfo = VideoUploadErrorHandler.parseError(error);
  
  const isSessionExpired = errorInfo.code === 'SESSION_EXPIRED' || 
                          error?.actionRequired === 'RESTART_UPLOAD' ||
                          error?.errorType === 'NoSuchUpload';
  
  if (!isSessionExpired) {
    return {
      isSessionExpired: false,
      needsRecovery: false,
      hasRecoveryData: false,
      canAttemptRecovery: false,
      missingRecoveryFields: [],
      recoveryInstructions: errorInfo.suggestedAction
    };
  }
  
  // Check for recovery data availability
  const hasOriginalFileName = !!(error.originalFileName || error.error?.originalFileName);
  const hasCourseId = !!(error.courseId || error.error?.courseId);
  const hasContentType = !!(error.contentType || error.error?.contentType);
  
  const missingFields = [];
  if (!hasOriginalFileName) missingFields.push('originalFileName');
  if (!hasCourseId) missingFields.push('courseId');
  if (!hasContentType) missingFields.push('contentType');
  
  const hasRecoveryData = missingFields.length === 0;
  const canAttemptRecovery = hasRecoveryData || missingFields.length <= 1; // Allow recovery with 1 missing field
  
  let recoveryInstructions = '';
  if (hasRecoveryData) {
    recoveryInstructions = 'Automatic session recovery should be attempted. If it fails, use manual recovery.';
  } else if (canAttemptRecovery) {
    recoveryInstructions = `Manual recovery possible but missing: ${missingFields.join(', ')}. Try manual recovery or restart upload.`;
  } else {
    recoveryInstructions = `Cannot recover session due to missing data: ${missingFields.join(', ')}. Please restart the upload completely.`;
  }
  
  return {
    isSessionExpired: true,
    needsRecovery: true,
    hasRecoveryData,
    canAttemptRecovery,
    missingRecoveryFields: missingFields,
    recoveryInstructions
  };
};

export default {
  convertBlobToBase64,
  convertBase64ToBlob,
  calculateBase64Size,
  validateChunkSizeForJson,
  formatFileSize,
  createBlobChecksum,
  validateVideoFile,
  testBase64Encoding,
  handleVideoUploadSessionRestart,
  validateUploadSession,
  recoverUploadSession,
  checkSessionExpirationError
}; 