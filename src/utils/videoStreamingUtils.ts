/**
 * Video Streaming Utilities
 * Common utilities for video streaming operations
 */

import { IVideoUploadInitializeInput } from '../apis/video-streaming';

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
 * Validate upload input parameters
 * @param uploadData - Upload initialization data
 * @returns Validation result
 */
export const validateUploadInput = (uploadData: IVideoUploadInitializeInput): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!uploadData.fileName) {
    errors.push('File name is required');
  }

  if (!uploadData.fileSize || uploadData.fileSize <= 0) {
    errors.push('Valid file size is required');
  }

  if (!uploadData.contentType) {
    errors.push('Content type is required');
  }

  // Check file type
  const supportedTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi', 'video/mkv', 'video/quicktime'];
  if (uploadData.contentType && !supportedTypes.includes(uploadData.contentType)) {
    errors.push(`Unsupported file type: ${uploadData.contentType}. Supported types: ${supportedTypes.join(', ')}`);
  }

  // Check file size limits
  const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
  const minSize = 1024; // 1KB

  if (uploadData.fileSize > maxSize) {
    errors.push(`File too large: ${formatFileSize(uploadData.fileSize)}. Maximum size: ${formatFileSize(maxSize)}`);
  }

  if (uploadData.fileSize < minSize) {
    errors.push(`File too small: ${formatFileSize(uploadData.fileSize)}. Minimum size: ${formatFileSize(minSize)}`);
  }

  // Check chunk size
  if (uploadData.chunkSize) {
    const maxChunkSize = 50 * 1024 * 1024; // 50MB
    const minChunkSize = 1024 * 1024; // 1MB

    if (uploadData.chunkSize > maxChunkSize) {
      errors.push(`Chunk size too large: ${formatFileSize(uploadData.chunkSize)}. Maximum: ${formatFileSize(maxChunkSize)}`);
    }

    if (uploadData.chunkSize < minChunkSize) {
      warnings.push(`Small chunk size: ${formatFileSize(uploadData.chunkSize)}. Recommended minimum: ${formatFileSize(minChunkSize)}`);
    }
  }

  // Warnings for large files
  const warningSize = 1 * 1024 * 1024 * 1024; // 1GB
  if (uploadData.fileSize > warningSize) {
    warnings.push(`Large file detected: ${formatFileSize(uploadData.fileSize)}. Upload may take a while.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Calculate optimal chunk size based on file size
 * @param fileSize - File size in bytes
 * @returns Optimal chunk size in bytes
 */
export const calculateOptimalChunkSize = (fileSize: number): number => {
  // Base chunk size: 5MB
  let chunkSize = 5 * 1024 * 1024;

  // For larger files, use bigger chunks
  if (fileSize > 1 * 1024 * 1024 * 1024) { // > 1GB
    chunkSize = 10 * 1024 * 1024; // 10MB chunks
  }

  if (fileSize > 5 * 1024 * 1024 * 1024) { // > 5GB
    chunkSize = 20 * 1024 * 1024; // 20MB chunks
  }

  // Cap at 50MB max
  const maxChunkSize = 50 * 1024 * 1024;
  return Math.min(chunkSize, maxChunkSize);
};

/**
 * Calculate total number of chunks for a file
 * @param fileSize - File size in bytes
 * @param chunkSize - Chunk size in bytes
 * @returns Total number of chunks
 */
export const calculateTotalChunks = (fileSize: number, chunkSize: number): number => {
  return Math.ceil(fileSize / chunkSize);
};

/**
 * Convert duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * Generate a unique upload session ID
 * @returns Unique session ID
 */
export const generateUploadSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `upload_${timestamp}_${randomStr}`;
};

/**
 * Check if a file extension is supported for video uploads
 * @param fileName - File name with extension
 * @returns Whether the file type is supported
 */
export const isSupportedVideoFile = (fileName: string): boolean => {
  const extension = fileName.toLowerCase().split('.').pop();
  const supportedExtensions = ['mp4', 'mov', 'webm', 'avi', 'mkv'];
  return supportedExtensions.includes(extension || '');
};

/**
 * Extract file extension from filename
 * @param fileName - File name
 * @returns File extension without dot
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().split('.').pop() || '';
};

/**
 * Create video streaming utilities object
 */
export const videoStreamingUtils = {
  formatFileSize,
  validateUploadInput,
  calculateOptimalChunkSize,
  calculateTotalChunks,
  formatDuration,
  generateUploadSessionId,
  isSupportedVideoFile,
  getFileExtension
};

export default videoStreamingUtils; 