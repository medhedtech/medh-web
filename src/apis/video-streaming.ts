import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils, type IApiResponse } from './utils';
import { getValidAuthToken } from '@/utils/auth';
import VideoUploadErrorHandler from '@/utils/videoUploadErrorHandler';
import { getVideoConfig, videoConfigUtils } from '@/config/video.config';

/**
 * Video Streaming API Types and Interfaces
 */

// Video quality options for streaming
export type TVideoQuality = '240p' | '360p' | '480p' | '720p' | '1080p';

// Video processing status
export type TVideoProcessingStatus = 
  | 'pending' 
  | 'uploading' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

// Video upload status
export type TVideoUploadStatus = 
  | 'initialized' 
  | 'initializing'
  | 'uploading' 
  | 'completed' 
  | 'aborted' 
  | 'failed';

// Supported video formats
export type TVideoFormat = 'mp4' | 'mov' | 'webm' | 'avi' | 'mkv';

/**
 * Video Upload Metadata Interface
 */
export interface IVideoUploadMetadata {
  courseId?: string;
  lessonId?: string;
  description?: string;
  batchId?: string;
  sessionId?: string;
  originalFileName?: string;
  uploadedAt?: string;
  tags?: string[];
  category?: string;
  [key: string]: any; // Allow additional custom metadata
}

/**
 * Video Upload Interfaces
 */
export interface IVideoUploadInitializeInput {
  fileName: string;
  fileSize: number;
  contentType: string;
  courseId: string;
  chunkSize?: number;
  metadata?: IVideoUploadMetadata;
}

export interface IVideoUploadInitializeResponse {
  uploadId: string;
  videoId: string;
  uploadUrls: string[];
  chunkSize: number;
  totalChunks: number;
  expiresAt: string;
}

export interface IVideoChunkUploadInput {
  uploadSession: any; // Complete upload session object from initialize
  chunkIndex: number;
  chunk: Blob | File;
  checksum?: string;
}

export interface IVideoChunkUploadResponse {
  chunkIndex: number;
  etag: string;
  uploaded: boolean;
  uploadedAt: string;
  // 🆕 SESSION RECOVERY FIELDS
  sessionRecovered?: boolean;
  newUploadSession?: any;
  recovery?: {
    previousVideoId: string;
    newVideoId: string;
    sessionRecovered: boolean;
  };
}

export interface IVideoUploadCompleteInput {
  uploadId: string;
  uploadSession?: any; // Add uploadSession for the working implementation
  parts: Array<{
    partNumber: number;
    etag: string;
  }>;
  metadata?: Record<string, any>;
}

export interface IVideoUploadCompleteResponse {
  videoId: string;
  status: TVideoUploadStatus;
  processingJobId?: string;
  estimatedProcessingTime?: number;
  message: string;
}

/**
 * Video Processing Interfaces
 */
export interface IVideoProcessingStatus {
  videoId: string;
  status: TVideoProcessingStatus;
  progress: number;
  jobId?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedTimeRemaining?: number;
  currentStep?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface IVideoMetadata {
  videoId: string;
  fileName: string;
  originalSize: number;
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  bitrate: number;
  codec: string;
  format: string;
  thumbnails: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Video Streaming Interfaces
 */
export interface IVideoStreamingUrls {
  videoId: string;
  hlsUrl: string;
  dashUrl?: string;
  qualities: Array<{
    quality: TVideoQuality;
    url: string;
    bitrate: number;
    resolution: string;
  }>;
  thumbnails: string[];
  subtitles?: Array<{
    language: string;
    url: string;
    label: string;
  }>;
  cdnUrls?: {
    primary: string;
    fallback: string[];
  };
}

/**
 * Video Analytics Interfaces
 */
export interface IVideoAnalytics {
  videoId: string;
  totalViews: number;
  uniqueViews: number;
  totalWatchTime: number; // in seconds
  averageWatchTime: number;
  completionRate: number;
  dropOffPoints: Array<{
    timestamp: number;
    percentage: number;
    dropOffCount: number;
  }>;
  qualityDistribution: Record<TVideoQuality, number>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: Array<{
    country: string;
    views: number;
    watchTime: number;
  }>;
  timeRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Service Health Interface
 */
export interface IVideoStreamingHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    s3: 'connected' | 'disconnected' | 'error';
    mediaConvert: 'connected' | 'not configured' | 'error';
    cloudFront: 'connected' | 'not configured' | 'error';
  };
  configuration: {
    videoQualities: TVideoQuality[];
    maxFileSize: string;
    chunkSize: string;
    supportedFormats: TVideoFormat[];
  };
  uptime: number;
  lastChecked: string;
}

/**
 * Query Parameters Interfaces
 */
export interface IVideoQueryParams {
  page?: number;
  limit?: number;
  status?: TVideoProcessingStatus;
  courseId?: string;
  lessonId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'fileName' | 'duration' | 'size';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface IVideoAnalyticsParams {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  includeDropOff?: boolean;
  includeGeographic?: boolean;
  includeDeviceBreakdown?: boolean;
}

/**
 * Video Streaming Utility Functions
 */
export const videoStreamingUtils = {
  /**
   * Calculate optimal chunk size based on file size and configuration
   * @param fileSize - File size in bytes
   * @param connectionSpeed - Optional connection speed in Mbps
   * @returns Optimal chunk size in bytes
   */
  calculateOptimalChunkSize: (fileSize: number, connectionSpeed?: number): number => {
    // Use the centralized configuration utility
    return videoConfigUtils.calculateOptimalChunkSize(fileSize, connectionSpeed);
  },

  /**
   * Validate video file format using configuration
   * @param fileName - Name of the video file
   * @returns Boolean indicating if format is supported
   */
  isValidVideoFormat: (fileName: string): boolean => {
    const config = getVideoConfig();
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeType = `video/${extension}`;
    return videoConfigUtils.isFormatSupported(mimeType);
  },

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  formatFileSize: (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  /**
   * Format duration for display
   * @param seconds - Duration in seconds
   * @returns Formatted duration string (HH:MM:SS)
   */
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  /**
   * Calculate upload progress
   * @param uploadedChunks - Number of uploaded chunks
   * @param totalChunks - Total number of chunks
   * @returns Progress percentage (0-100)
   */
  calculateUploadProgress: (uploadedChunks: number, totalChunks: number): number => {
    if (totalChunks === 0) return 0;
    return Math.round((uploadedChunks / totalChunks) * 100);
  },

  /**
   * Get video quality label
   * @param quality - Video quality
   * @returns Human-readable quality label
   */
  getQualityLabel: (quality: TVideoQuality): string => {
    const labels: Record<TVideoQuality, string> = {
      '240p': 'Low (240p)',
      '360p': 'Medium (360p)',
      '480p': 'Standard (480p)',
      '720p': 'HD (720p)',
      '1080p': 'Full HD (1080p)'
    };
    return labels[quality] || quality;
  },

  /**
   * Get status color class for UI
   * @param status - Video processing status
   * @returns CSS class string for status styling
   */
  getStatusColorClass: (status: TVideoProcessingStatus): string => {
    const statusColors: Record<TVideoProcessingStatus, string> = {
      'pending': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      'uploading': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'processing': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'failed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'cancelled': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return statusColors[status] || statusColors['pending'];
  },

  /**
   * Validate video upload input
   * @param input - Video upload input data
   * @returns Validation result with errors if any
   */
  validateUploadInput: (input: IVideoUploadInitializeInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!input.fileName) {
      errors.push('File name is required');
    } else if (!videoStreamingUtils.isValidVideoFormat(input.fileName)) {
      errors.push('Unsupported video format');
    }

    if (!input.contentType) {
      errors.push('Content type is required');
    }

    if (!input.fileSize || input.fileSize <= 0) {
      errors.push('Valid file size is required');
    } else if (input.fileSize > 10 * 1024 * 1024 * 1024) { // 10GB limit
      errors.push('File size exceeds maximum limit of 10GB');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Video Streaming API Service
 */
export const videoStreamingAPI = {
  /**
   * Check video streaming service health
   * @returns Promise with service health status
   */
  getHealth: async (): Promise<IApiResponse<IVideoStreamingHealth>> => {
    return apiClient.get<IVideoStreamingHealth>(
      `${apiBaseUrl}/video-streaming/health`
    );
  },

  /**
   * Initialize video upload
   * @param uploadData - Video upload initialization data
   * @returns Promise with upload initialization response
   */
  initializeUpload: async (uploadData: IVideoUploadInitializeInput): Promise<IApiResponse<IVideoUploadInitializeResponse>> => {
    // Validate input
    const validation = videoStreamingUtils.validateUploadInput(uploadData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Ensure we have a valid token
    const token = getValidAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to upload videos.');
    }

    // Set the token in the API client
    apiClient.setAuthToken(token);

    // Prepare request body with required fields for backend
    const requestBody = {
      fileName: uploadData.fileName,
      fileSize: uploadData.fileSize,
      contentType: uploadData.contentType,
      courseId: uploadData.courseId, // Use the required courseId from input
      chunkSize: uploadData.chunkSize || 5 * 1024 * 1024, // 5MB default
      metadata: {
        ...uploadData.metadata,
        originalFileName: uploadData.fileName
      }
    };

    console.log('🎬 Video upload initialization request:', requestBody);

    try {
      const response = await apiClient.post<IVideoUploadInitializeResponse>(
        `${apiBaseUrl}/video-streaming/initialize-upload`,
        requestBody
      );

      console.log('🎬 Raw response structure:', {
        status: response.status,
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        fullResponse: response
      });
      
      if (response.status !== 'success') {
        const errorMessage = response.message || response.error || 'Failed to initialize upload';
        throw new Error(errorMessage);
      }
      
      // If the response data is nested, extract it
      let responseData = response.data as any; // Use any to handle different backend response formats
      
      // Handle deeply nested response structure (data.data.data)
      // Check multiple levels of nesting to find the actual upload data
      let attempts = 0;
      while (responseData && responseData.data && !responseData.uploadId && !responseData.upload_id && attempts < 3) {
        console.log(`🎬 Extracting nested data (attempt ${attempts + 1}):`, responseData);
        responseData = responseData.data;
        attempts++;
      }
      
      // Add detailed logging for debugging
      console.log('🎬 Final response data structure:', {
        hasUploadId: !!(responseData?.uploadId || responseData?.upload_id),
        hasVideoId: !!(responseData?.videoId || responseData?.video_id),
        keys: responseData ? Object.keys(responseData) : [],
        responseData: responseData,
        attempts: attempts
      });
      
      // Check if the response has the expected structure
      if (!responseData || (!responseData.uploadId && !responseData.upload_id)) {
        console.error('Invalid response structure:', response);
        console.error('Response data keys:', responseData ? Object.keys(responseData) : 'No data');
        console.error('Full response data:', responseData);
        throw new Error('Invalid response from server: missing upload ID');
      }
      
      // Handle different field naming conventions (backend might use snake_case)
      const uploadId = responseData?.uploadId || responseData?.upload_id || null;
      const videoId = responseData?.videoId || responseData?.video_id || null;
      
      // Calculate total chunks based on the response or file size
      const totalChunks = responseData?.totalChunks || responseData?.total_chunks || Math.ceil(uploadData.fileSize / (uploadData.chunkSize || 5 * 1024 * 1024));
      
      // Update chunk size if provided by server
      const chunkSize = responseData?.chunkSize || responseData?.chunk_size || 5 * 1024 * 1024;
      
      // 🔧 FIX: Recalculate totalChunks with actual chunk size to avoid empty chunks
      const actualTotalChunks = Math.ceil(uploadData.fileSize / chunkSize);
      
      console.log('Upload initialized successfully:', {
        uploadId,
        videoId,
        totalChunks: actualTotalChunks,
        chunkSize: videoStreamingUtils.formatFileSize(chunkSize),
        fileSize: videoStreamingUtils.formatFileSize(uploadData.fileSize),
        calculationCheck: {
          originalTotalChunks: totalChunks,
          recalculatedTotalChunks: actualTotalChunks,
          fileSizeBytes: uploadData.fileSize,
          chunkSizeBytes: chunkSize
        }
      });
      
      // Validate that we have the required IDs
      if (!uploadId) {
        throw new Error('Failed to get upload ID from server response');
      }
      
      if (!videoId) {
        throw new Error('Failed to get video ID from server response');
      }
      
      return {
        status: 'success',
        data: {
          uploadId,
          videoId,
          uploadUrls: responseData?.uploadUrls || [],
          chunkSize,
          totalChunks: actualTotalChunks,
          expiresAt: responseData?.expiresAt || ''
        }
      };
    } catch (error: any) {
      console.error('Video upload initialization failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Clear potentially invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
        throw new Error('Authentication failed. Please log in again and try uploading the video.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to upload videos.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Please use a smaller video file.');
      } else if (error.response?.status === 415) {
        throw new Error('Unsupported file type. Please use MP4, MOV, WebM, AVI, or MKV format.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. The video streaming service is currently unavailable. Please try again later.');
      } else if (error.response?.status === 404) {
        throw new Error('Video streaming service not found. Please contact support.');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // If we have a response with error details, use that
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else if (errorData.error) {
          throw new Error(errorData.error);
        }
      }
      
      throw error;
    }
  },

  /**
   * Upload video chunk with enhanced error handling and retry logic
   * @param chunkData - Video chunk upload data
   * @returns Promise with chunk upload response
   */
  uploadChunk: async (chunkData: IVideoChunkUploadInput): Promise<IApiResponse<IVideoChunkUploadResponse>> => {
    if (!chunkData.uploadSession) throw new Error('Upload session is required');
    if (chunkData.chunkIndex < 0) throw new Error('Invalid chunk index');
    if (!chunkData.chunk) throw new Error('Chunk data is required');

    // Ensure we have a valid token
    const token = getValidAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to upload videos.');
    }

    // FRONTEND FIX 1: Validate chunk size before upload
    const chunkSize = chunkData.chunk.size;
    const maxChunkSize = 50 * 1024 * 1024; // 50MB limit
    if (chunkSize > maxChunkSize) {
      throw new Error(`Chunk size (${videoStreamingUtils.formatFileSize(chunkSize)}) exceeds maximum allowed size (${videoStreamingUtils.formatFileSize(maxChunkSize)})`);
    }

    // FRONTEND FIX 2: Add chunk validation
    if (chunkSize === 0) {
      throw new Error('Empty chunk detected. Please try uploading again.');
    }

    // WORKING SOLUTION: Convert chunk to base64 for JSON transmission (exactly as provided)
    const chunkBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (data:application/octet-stream;base64,)
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(chunkData.chunk);
    });

    // WORKING SOLUTION: Create JSON payload with available fields from uploadSession
    // ✅ DEFINITIVE FIX: Use proper filename and preserve all fields
    // Note: We're in the API object, not the class, so get filename from uploadSession
    const videoFileName = chunkData.uploadSession?.originalFileName || 
                         chunkData.uploadSession?.fileName || 
                         `video_${chunkData.uploadSession.videoId}.mp4`;
    
    const completeUploadSession = {
      uploadId: chunkData.uploadSession.uploadId,                    // ✅ Required (available)
      videoId: chunkData.uploadSession.videoId,                     // ✅ Required (available)
      // ✅ FIXED: Use actual filename instead of videoId
      key: chunkData.uploadSession.key || `videos/recordings/${videoFileName}`,
      bucket: chunkData.uploadSession.bucket || 'medhdocuments'
    };

    console.log('✅ DEFINITIVE FIX: Upload session with proper filename:', {
      originalKeys: Object.keys(chunkData.uploadSession || {}),
      finalKeys: Object.keys(completeUploadSession),
      usingFallbacks: {
        key: !chunkData.uploadSession.key,
        bucket: !chunkData.uploadSession.bucket
      },
      finalValues: {
        key: completeUploadSession.key,
        bucket: completeUploadSession.bucket,
        actualFileName: videoFileName,
        sessionHasFileName: !!(chunkData.uploadSession?.originalFileName || chunkData.uploadSession?.fileName)
      }
    });

    // ENHANCED: Include recovery data for automatic session recovery (as per guide)
    const jsonPayload = {
      uploadSession: completeUploadSession,                          // ✅ Now has all 4 required fields
      chunkData: chunkBase64,                                          // ✅ Required (base64 string)
      partNumber: chunkData.chunkIndex + 1,                             // ✅ Required (positive integer)
      
      // 🆕 RECOVERY DATA: Required for automatic session recovery
      originalFileName: chunkData.uploadSession?.originalFileName || videoFileName,
      courseId: chunkData.uploadSession?.courseId,
      contentType: chunkData.uploadSession?.contentType || 'video/mp4'
    };

    // 🔍 DEBUG: Log what we're actually sending (shows missing fields)
    console.log('🔍 DEBUG: Request data being sent:', {
      uploadSession: {
        type: typeof jsonPayload.uploadSession,
        isObject: typeof jsonPayload.uploadSession === 'object',
        keys: Object.keys(jsonPayload.uploadSession || {}),
        hasUploadId: !!(jsonPayload.uploadSession?.uploadId),
        hasVideoId: !!(jsonPayload.uploadSession?.videoId),
        hasKey: !!(jsonPayload.uploadSession?.key),
        hasBucket: !!(jsonPayload.uploadSession?.bucket),
        // Show what's actually available in the session
        availableFields: Object.keys(chunkData.uploadSession || {})
      },
      chunkData: {
        type: typeof jsonPayload.chunkData,
        length: jsonPayload.chunkData?.length || 0,
        isString: typeof jsonPayload.chunkData === 'string',
        preview: jsonPayload.chunkData?.substring(0, 50) + '...'
      },
      partNumber: {
        value: jsonPayload.partNumber,
        type: typeof jsonPayload.partNumber,
        isInteger: Number.isInteger(jsonPayload.partNumber)
      },
      recoveryData: {
        hasOriginalFileName: !!jsonPayload.originalFileName,
        hasCourseId: !!jsonPayload.courseId,
        hasContentType: !!jsonPayload.contentType
      }
    });

    // 🔍 DEBUG: Log the complete request being sent
    console.log('🔍 DEBUG: Complete JSON payload with recovery data:', JSON.stringify({
      ...jsonPayload,
      chunkData: `[BASE64 DATA - ${jsonPayload.chunkData.length} chars]`
    }, null, 2));

    // FRONTEND FIX 3: Add retry logic for chunk uploads
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎬 Uploading chunk ${chunkData.chunkIndex} (attempt ${attempt}/${maxRetries}), size: ${videoStreamingUtils.formatFileSize(chunkSize)} [WORKING JSON MODE WITH RECOVERY]`);
        
        // WORKING SOLUTION: Use direct fetch with proper headers (exactly as provided)
        const response = await fetch(`${apiBaseUrl}/video-streaming/upload-chunk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jsonPayload)
        });

        if (!response.ok) {
          // If the structured format fails, try a simpler format as fallback
          if (attempt === 1 && response.status === 400) {
            console.log('🔄 Trying fallback format for chunk upload...');
            
            const fallbackPayload = {
              uploadId: chunkData.uploadSession.uploadId,
              videoId: chunkData.uploadSession.videoId,
              partNumber: chunkData.chunkIndex + 1,
              chunkData: chunkBase64,
              // Include recovery data in fallback too
              originalFileName: jsonPayload.originalFileName,
              courseId: jsonPayload.courseId,
              contentType: jsonPayload.contentType
            };
            
            const fallbackResponse = await fetch(`${apiBaseUrl}/video-streaming/upload-chunk`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(fallbackPayload)
            });
            
            if (fallbackResponse.ok) {
              const fallbackResult = await fallbackResponse.json();
              return await videoStreamingAPI.handleEnhancedChunkResponse(fallbackResult, chunkData);
            }
          }
          
          throw new Error(`Chunk upload failed: ${response.status}`);
        }

        const result = await response.json();
        return await videoStreamingAPI.handleEnhancedChunkResponse(result, chunkData);

      } catch (error: any) {
        lastError = error;
        console.error(`❌ Chunk upload attempt ${attempt} failed:`, error);
        
        // FRONTEND FIX 4: Enhanced error handling for specific backend issues
        if (error.message?.includes('JSON parsing') || error.message?.includes('multipart')) {
          throw new Error('Server configuration error: The backend is not properly configured to handle file uploads. Please contact support.');
        }
        
        // For server errors, retry might help
        if (attempt < maxRetries && (error.message?.includes('500') || error.message?.includes('Network'))) {
          console.log(`⏳ Retrying chunk upload in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        
        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          throw new Error(`Failed to upload chunk after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
    
    // If we get here, all retries failed
    throw new Error(`Failed to upload chunk after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
  },

  /**
   * Handle enhanced chunk upload response with session recovery support
   * @private
   */
  handleEnhancedChunkResponse: async (result: any, chunkData: IVideoChunkUploadInput) => {
    if (result.success) {
      // Check if session was automatically recovered
      if (result.data?.sessionRecovered && result.data.newUploadSession) {
        console.log('🔄 Session was automatically recovered during chunk upload:', result.data.recovery);
        
        // Note: The calling code should update their upload session with result.data.newUploadSession
        console.log('✅ Session recovery successful, continuing with new session');
      }
      
      console.log(`✅ Chunk ${chunkData.chunkIndex} uploaded successfully`);
      
      // Convert to our expected response format
      return {
        status: 'success',
        data: {
          chunkIndex: chunkData.chunkIndex,
          etag: result.data.ETag || result.data.etag,
          uploaded: true,
          uploadedAt: new Date().toISOString(),
          // Include recovery information if present
          sessionRecovered: result.data?.sessionRecovered || false,
          newUploadSession: result.data?.newUploadSession,
          recovery: result.data?.recovery
        }
      };
    }
    
    // Handle errors with enhanced recovery logic (as per guide)
    if (!result.success && result.error?.isSessionExpired) {
      console.warn('🚨 Upload session expired:', result.error);
      
      // Check if automatic recovery was attempted
      if (result.error.recoveryAttempted === false && result.error.recoveryDataAvailable === false) {
        console.log('📝 Automatic recovery not available, manual recovery needed');
        
        // Return error with recovery guidance
        throw new Error(`Session expired and automatic recovery failed. Recovery data missing: ${result.error.missingRecoveryFields?.join(', ')}`);
      } else if (result.error.sessionRecoveryAttempted && result.error.errorType === 'SessionRecoveryFailed') {
        console.error('❌ Automatic recovery failed:', result.error);
        throw new Error('Session recovery failed. Please restart the upload.');
      }
    }
    
    // Handle other upload errors
    if (!result.success) {
      throw new Error(result.message || `Chunk ${chunkData.chunkIndex + 1} upload failed`);
    }
    
    return result;
  },

  /**
   * Manually recover an expired upload session
   * @param expiredSession - The expired upload session
   * @param recoveryData - Recovery data (originalFileName, courseId, contentType)
   * @returns Promise with new upload session
   */
  recoverSession: async (expiredSession: any, recoveryData: {
    originalFileName: string;
    courseId: string;
    contentType: string;
  }): Promise<IApiResponse<{
    newUploadSession: any;
    recovery: {
      previousVideoId: string;
      newVideoId: string;
      sessionRecovered: boolean;
    };
  }>> => {
    if (!expiredSession) throw new Error('Expired session is required');
    if (!recoveryData.originalFileName) throw new Error('Original filename is required for recovery');
    if (!recoveryData.courseId) throw new Error('Course ID is required for recovery');

    // Ensure we have a valid token
    const token = getValidAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to recover the session.');
    }

    try {
      console.log('🔄 Attempting manual session recovery...');
      
      const response = await fetch(`${apiBaseUrl}/video-streaming/recover-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          expiredSession: expiredSession,
          originalFileName: recoveryData.originalFileName,
          courseId: recoveryData.courseId,
          contentType: recoveryData.contentType
        })
      });

      if (!response.ok) {
        throw new Error(`Session recovery failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Manual session recovery successful:', result.data.recovery);
        return {
          status: 'success',
          data: result.data
        };
      } else {
        throw new Error(result.message || 'Manual recovery failed');
      }
    } catch (error: any) {
      console.error('❌ Manual session recovery failed:', error);
      throw new Error(`Session recovery failed: ${error.message}`);
    }
  },

  /**
   * Validate if an upload session is still valid
   * @param uploadSession - Upload session to validate
   * @returns Promise with validation result
   */
  validateSession: async (uploadSession: any): Promise<IApiResponse<{
    isValid: boolean;
    sessionInfo?: {
      isNearExpiration: boolean;
      expirationWarning?: string;
      expiresAt?: string;
    };
    reason?: string;
  }>> => {
    if (!uploadSession) throw new Error('Upload session is required');

    // Ensure we have a valid token
    const token = getValidAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to validate the session.');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/video-streaming/validate-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uploadSession: uploadSession
        })
      });

      if (!response.ok) {
        throw new Error(`Session validation failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        if (result.data.sessionInfo?.isNearExpiration) {
          console.warn('⚠️ Session is near expiration:', result.data.sessionInfo.expirationWarning);
        }
        return {
          status: 'success',
          data: result.data
        };
      } else {
        console.warn('⚠️ Session is invalid:', result.data?.reason || result.message);
        return {
          status: 'success',
          data: {
            isValid: false,
            reason: result.message || 'Session validation failed'
          }
        };
      }
    } catch (error: any) {
      console.error('❌ Session validation failed:', error);
      return {
        status: 'success',
        data: {
          isValid: false,
          reason: error.message || 'Session validation error'
        }
      };
    }
  },

  /**
   * Complete video upload
   * @param completeData - Upload completion data
   * @returns Promise with upload completion response
   */
  completeUpload: async (completeData: IVideoUploadCompleteInput): Promise<IApiResponse<IVideoUploadCompleteResponse>> => {
    if (!completeData.uploadId) throw new Error('Upload ID is required');
    if (!completeData.parts || completeData.parts.length === 0) {
      throw new Error('Upload parts are required');
    }

    // FRONTEND FIX 5: Validate parts before completion
    const invalidParts = completeData.parts.filter(part => !part.etag || !part.partNumber);
    if (invalidParts.length > 0) {
      throw new Error(`Invalid parts detected: ${invalidParts.length} parts are missing ETag or part number`);
    }

    // Sort parts by part number to ensure correct order
    const sortedParts = [...completeData.parts].sort((a, b) => a.partNumber - b.partNumber);

    // Ensure we have a valid token
    const token = getValidAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to upload videos.');
    }

    // WORKING SOLUTION: Use the exact format from definitive guide
    // 🔧 TEMPORARY WORKAROUND: Add fallback values for missing fields
    const completeUploadSession = {
      uploadId: completeData.uploadSession?.uploadId || completeData.uploadId,     // ✅ Required
      videoId: completeData.uploadSession?.videoId,                               // ✅ Required  
      // 🔧 PRESET/FALLBACK VALUES for missing fields
      key: completeData.uploadSession?.key || `videos/recordings/${completeData.uploadSession?.videoId}.mp4`,
      bucket: completeData.uploadSession?.bucket || 'medhdocuments'
    };

    console.log('🔧 COMPLETE UPLOAD: Upload session with fallbacks:', {
      hasUploadId: !!completeUploadSession.uploadId,
      hasVideoId: !!completeUploadSession.videoId,
      hasKey: !!completeUploadSession.key,
      hasBucket: !!completeUploadSession.bucket,
      keyValue: completeUploadSession.key,
      bucketValue: completeUploadSession.bucket
    });

    const requestPayload = {
      uploadSession: completeUploadSession,
      parts: sortedParts.map(part => ({
        partNumber: part.partNumber,                                                // ✅ Required (positive integer)
        etag: part.etag                                                            // ✅ Required (ETag from chunk upload)
      }))
    };

    // 🔍 DEBUG: Log what we're sending for completion
    console.log('🔍 DEBUG: Complete upload request:', {
      uploadSession: {
        hasUploadId: !!(requestPayload.uploadSession?.uploadId),
        hasVideoId: !!(requestPayload.uploadSession?.videoId),
        hasKey: !!(requestPayload.uploadSession?.key),
        hasBucket: !!(requestPayload.uploadSession?.bucket)
      },
      parts: {
        count: requestPayload.parts.length,
        allHaveEtag: requestPayload.parts.every(p => !!p.etag),
        allHavePartNumber: requestPayload.parts.every(p => Number.isInteger(p.partNumber))
      }
    });

    try {
      console.log('🏁 Completing upload with working JSON method...');
      
      // WORKING SOLUTION: Use direct fetch with proper headers
      const response = await fetch(`${apiBaseUrl}/video-streaming/complete-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`Upload completion failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload completion failed');
      }

      console.log('🎉 Upload completed successfully!');

      // Convert to our expected response format
      return {
        status: 'success',
        data: {
          videoId: result.data.videoId || completeData.uploadId,
          status: 'completed',
          processingJobId: result.data.processingJobId,
          estimatedProcessingTime: result.data.estimatedProcessingTime,
          message: result.message || 'Upload completed successfully'
        }
      };

    } catch (error: any) {
      console.error('Complete upload failed:', error);
      
      // Enhanced error handling for completion
      if (error.message?.includes('404')) {
        throw new Error('Upload session not found. The upload may have expired.');
      } else if (error.message?.includes('400')) {
        throw new Error('Invalid upload data. Please restart the upload.');
      }
      
      throw error;
    }
  },

  /**
   * Abort video upload with enhanced error handling
   * @param uploadSession - Upload session object to abort
   * @returns Promise with abort response
   */
  abortUpload: async (uploadSession: any): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!uploadSession) throw new Error('Upload session is required');

    try {
      const response = await apiClient.post(
        `${apiBaseUrl}/video-streaming/abort-upload`,
        { uploadSession: uploadSession }
      );

      // FRONTEND FIX 6: Handle the res.status error gracefully
      if (response.status !== 'success') {
        // If the abort failed but we got a response, consider it partially successful
        console.warn('Abort upload returned non-success status:', response);
        return {
          status: 'success',
          data: {
            success: true,
            message: 'Upload abort initiated (server response unclear)'
          }
        };
      }

      return response;
    } catch (error: any) {
      console.error('Abort upload failed:', error);
      
      // FRONTEND FIX 7: Handle specific abort errors gracefully
      if (error.response?.status === 404) {
        // Upload session not found - consider this a successful abort
        return {
          status: 'success',
          data: {
            success: true,
            message: 'Upload session not found (may already be cleaned up)'
          }
        };
      } else if (error.message?.includes('res.status is not a function')) {
        // This is the specific backend error - handle gracefully
        console.warn('Backend abort endpoint has configuration issue, but upload will be cleaned up');
        return {
          status: 'success',
          data: {
            success: true,
            message: 'Upload abort initiated (backend configuration issue detected)'
          }
        };
      }
      
      // For other errors, still try to return a success response
      // since the goal is to clean up the upload
      return {
        status: 'success',
        data: {
          success: false,
          message: `Abort failed: ${error.message}`
        }
      };
    }
  },

  /**
   * Get video processing status
   * @param videoId - Video ID
   * @returns Promise with processing status
   */
  getProcessingStatus: async (videoId: string): Promise<IApiResponse<IVideoProcessingStatus>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.get<IVideoProcessingStatus>(
      `${apiBaseUrl}/video-streaming/${videoId}/status`
    );
  },

  /**
   * Get video streaming URLs
   * @param videoId - Video ID
   * @returns Promise with streaming URLs
   */
  getStreamingUrls: async (videoId: string): Promise<IApiResponse<IVideoStreamingUrls>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.get<IVideoStreamingUrls>(
      `${apiBaseUrl}/video-streaming/${videoId}/streaming-urls`
    );
  },

  /**
   * Get video metadata
   * @param videoId - Video ID
   * @returns Promise with video metadata
   */
  getVideoMetadata: async (videoId: string): Promise<IApiResponse<IVideoMetadata>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.get<IVideoMetadata>(
      `${apiBaseUrl}/video-streaming/${videoId}/metadata`
    );
  },

  /**
   * Delete video
   * @param videoId - Video ID to delete
   * @returns Promise with deletion response
   */
  deleteVideo: async (videoId: string): Promise<IApiResponse<{ success: boolean; message: string }>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.delete(
      `${apiBaseUrl}/video-streaming/${videoId}`
    );
  },

  /**
   * Invalidate CDN cache for video
   * @param videoId - Video ID
   * @returns Promise with cache invalidation response
   */
  invalidateCache: async (videoId: string): Promise<IApiResponse<{ success: boolean; invalidationId: string }>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.post(
      `${apiBaseUrl}/video-streaming/${videoId}/invalidate-cache`
    );
  },

  /**
   * Get video analytics
   * @param videoId - Video ID
   * @param params - Analytics query parameters
   * @returns Promise with video analytics
   */
  getVideoAnalytics: async (
    videoId: string, 
    params: IVideoAnalyticsParams = {}
  ): Promise<IApiResponse<IVideoAnalytics>> => {
    if (!videoId) throw new Error('Video ID is required');

    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get<IVideoAnalytics>(
      `${apiBaseUrl}/video-streaming/${videoId}/analytics${queryString}`
    );
  },

  /**
   * Get all videos with filtering
   * @param params - Query parameters for filtering
   * @returns Promise with video list
   */
  getAllVideos: async (params: IVideoQueryParams = {}): Promise<IApiResponse<{
    videos: Array<IVideoMetadata & { status: TVideoProcessingStatus; progress: number }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> => {
    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/video-streaming/videos${queryString}`
    );
  },

  /**
   * Get videos by course
   * @param courseId - Course ID
   * @param params - Additional query parameters
   * @returns Promise with course videos
   */
  getVideosByCourse: async (
    courseId: string, 
    params: Omit<IVideoQueryParams, 'courseId'> = {}
  ): Promise<IApiResponse<{
    videos: Array<IVideoMetadata & { status: TVideoProcessingStatus; progress: number }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> => {
    if (!courseId) throw new Error('Course ID is required');

    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/video-streaming/courses/${courseId}/videos${queryString}`
    );
  },

  /**
   * Get videos by lesson
   * @param lessonId - Lesson ID
   * @param params - Additional query parameters
   * @returns Promise with lesson videos
   */
  getVideosByLesson: async (
    lessonId: string, 
    params: Omit<IVideoQueryParams, 'lessonId'> = {}
  ): Promise<IApiResponse<{
    videos: Array<IVideoMetadata & { status: TVideoProcessingStatus; progress: number }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> => {
    if (!lessonId) throw new Error('Lesson ID is required');

    const queryString = apiUtils.buildQueryString(params);
    return apiClient.get(
      `${apiBaseUrl}/video-streaming/lessons/${lessonId}/videos${queryString}`
    );
  },

  /**
   * Update video metadata
   * @param videoId - Video ID
   * @param metadata - Updated metadata
   * @returns Promise with updated video metadata
   */
  updateVideoMetadata: async (
    videoId: string, 
    metadata: Partial<Pick<IVideoMetadata, 'fileName'>> & { 
      description?: string; 
      tags?: string[];
      courseId?: string;
      lessonId?: string;
    }
  ): Promise<IApiResponse<IVideoMetadata>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.patch<IVideoMetadata>(
      `${apiBaseUrl}/video-streaming/${videoId}/metadata`,
      metadata
    );
  },

  /**
   * Retry failed video processing
   * @param videoId - Video ID
   * @returns Promise with retry response
   */
  retryProcessing: async (videoId: string): Promise<IApiResponse<{
    success: boolean;
    jobId: string;
    message: string;
  }>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.post(
      `${apiBaseUrl}/video-streaming/${videoId}/retry-processing`
    );
  },

  /**
   * Get video processing logs
   * @param videoId - Video ID
   * @returns Promise with processing logs
   */
  getProcessingLogs: async (videoId: string): Promise<IApiResponse<{
    logs: Array<{
      timestamp: string;
      level: 'info' | 'warning' | 'error';
      message: string;
      details?: any;
    }>;
  }>> => {
    if (!videoId) throw new Error('Video ID is required');

    return apiClient.get(
      `${apiBaseUrl}/video-streaming/${videoId}/logs`
    );
  }
};

/**
 * Video Upload Client Utility
 * High-level client for handling chunked video uploads
 */
export class VideoUploadClient {
  private uploadSession: any = null; // Store complete upload session object
  private uploadId: string | null = null;
  private videoId: string | null = null;
  private totalChunks: number = 0;
  private uploadedChunks: number = 0;
  private chunkSize: number = 5 * 1024 * 1024; // Default 5MB chunk size
  private uploadedParts: Array<{ partNumber: number; etag: string }> = [];
  private file: File | null = null;
  private metadata: IVideoUploadMetadata | null = null;
  
  // 🆕 RECOVERY DATA: Store recovery data for session recovery
  private recoveryData: {
    originalFileName: string;
    courseId: string;
    contentType: string;
  } | null = null;

  /**
   * Upload progress callback
   */
  onProgress?: (progress: number, uploadedChunks: number, totalChunks: number) => void;

  /**
   * Upload status callback
   */
  onStatusChange?: (status: TVideoUploadStatus) => void;

  /**
   * Error callback with enhanced error information
   */
  onError?: (error: Error, errorInfo?: any) => void;

  /**
   * Session recovery callback - called when session is automatically recovered
   */
  onSessionRecovered?: (recoveryInfo: {
    previousVideoId: string;
    newVideoId: string;
    sessionRecovered: boolean;
  }) => void;

  /**
   * Initialize video upload
   */
  async initialize(
    file: File, 
    metadata?: IVideoUploadMetadata
  ): Promise<{ uploadId: string; videoId: string }> {
    try {
      this.reset();
      this.file = file;
      this.metadata = metadata || null;
      
      // VALIDATION FIX: Ensure courseId is provided
      if (!metadata?.courseId) {
        throw new Error('courseId is required in metadata for video upload');
      }
      
      // 🆕 STORE RECOVERY DATA
      this.recoveryData = {
        originalFileName: file.name,
        courseId: metadata.courseId,
        contentType: file.type
      };
      
      // Calculate optimal chunk size for this file
      this.chunkSize = videoStreamingUtils.calculateOptimalChunkSize(file.size);
      
      console.log('Initializing video upload with recovery data:', {
        fileName: file.name,
        fileSize: videoStreamingUtils.formatFileSize(file.size),
        fileType: file.type,
        chunkSize: videoStreamingUtils.formatFileSize(this.chunkSize),
        courseId: metadata.courseId,
        recoveryData: this.recoveryData,
        metadata
      });
      
      this.updateStatus('initializing');
      
      const response = await videoStreamingAPI.initializeUpload({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        courseId: metadata.courseId, // Use the validated courseId
        chunkSize: this.chunkSize,
        metadata: {
          ...metadata,
          originalFileName: file.name
        }
      });
      
      console.log('🎬 Raw response structure:', {
        status: response.status,
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        fullResponse: response
      });
      
      if (response.status !== 'success') {
        const errorMessage = response.message || response.error || 'Failed to initialize upload';
        throw new Error(errorMessage);
      }
      
      // If the response data is nested, extract it
      let responseData = response.data as any; // Use any to handle different backend response formats
      
      // Handle deeply nested response structure (data.data.data)
      // Check multiple levels of nesting to find the actual upload data
      let attempts = 0;
      while (responseData && responseData.data && !responseData.uploadId && !responseData.upload_id && attempts < 3) {
        console.log(`🎬 Extracting nested data (attempt ${attempts + 1}):`, responseData);
        responseData = responseData.data;
        attempts++;
      }
      
      // Add detailed logging for debugging
      console.log('🎬 Final response data structure:', {
        hasUploadId: !!(responseData?.uploadId || responseData?.upload_id),
        hasVideoId: !!(responseData?.videoId || responseData?.video_id),
        keys: responseData ? Object.keys(responseData) : [],
        responseData: responseData,
        attempts: attempts
      });
      
      // Check if the response has the expected structure
      if (!responseData || (!responseData.uploadId && !responseData.upload_id)) {
        console.error('Invalid response structure:', response);
        console.error('Response data keys:', responseData ? Object.keys(responseData) : 'No data');
        console.error('Full response data:', responseData);
        throw new Error('Invalid response from server: missing upload ID');
      }
      
      // Handle different field naming conventions (backend might use snake_case)
      const uploadId = responseData?.uploadId || responseData?.upload_id || null;
      const videoId = responseData?.videoId || responseData?.video_id || null;
      
      // Calculate total chunks based on the response or file size
      const totalChunks = responseData?.totalChunks || responseData?.total_chunks || Math.ceil(file.size / this.chunkSize);
      
      // Update chunk size if provided by server
      const chunkSize = responseData?.chunkSize || responseData?.chunk_size || 5 * 1024 * 1024;
      
      // 🔧 FIX: Recalculate totalChunks with actual chunk size to avoid empty chunks
      const actualTotalChunks = Math.ceil(file.size / chunkSize);
      
      console.log('Upload initialized successfully:', {
        uploadId,
        videoId,
        totalChunks: actualTotalChunks,
        chunkSize: videoStreamingUtils.formatFileSize(chunkSize),
        fileSize: videoStreamingUtils.formatFileSize(file.size),
        calculationCheck: {
          originalTotalChunks: totalChunks,
          recalculatedTotalChunks: actualTotalChunks,
          fileSizeBytes: file.size,
          chunkSizeBytes: chunkSize
        }
      });
      
      // Validate that we have the required IDs
      if (!uploadId) {
        throw new Error('Failed to get upload ID from server response');
      }
      
      if (!videoId) {
        throw new Error('Failed to get video ID from server response');
      }
      
      // Store the response data in instance properties with recovery data
      this.uploadId = uploadId;
      this.videoId = videoId;
      this.uploadSession = {
        ...responseData,
        // 🆕 ENSURE RECOVERY DATA IS IN SESSION
        originalFileName: file.name,
        courseId: metadata.courseId,
        contentType: file.type
      };
      this.totalChunks = actualTotalChunks;
      this.chunkSize = chunkSize;
      
      // 🔍 DEBUG: Track field preservation
      console.log('🔍 STORED uploadSession debug with recovery data:', {
        storedSession: this.uploadSession,
        storedKeys: Object.keys(this.uploadSession || {}),
        hasKey: !!this.uploadSession?.key,
        hasBucket: !!this.uploadSession?.bucket,
        hasFileName: !!this.uploadSession?.originalFileName,
        hasCourseId: !!this.uploadSession?.courseId,
        hasContentType: !!this.uploadSession?.contentType,
        keyValue: this.uploadSession?.key,
        bucketValue: this.uploadSession?.bucket,
        recoveryDataComplete: !!(this.uploadSession?.originalFileName && this.uploadSession?.courseId && this.uploadSession?.contentType)
      });
      
      this.updateStatus('initialized');
      
      return {
        uploadId: uploadId,
        videoId: videoId
      };
      
    } catch (error: any) {
      console.error('Failed to initialize upload:', error);
      
      // FRONTEND FIX 8: Use enhanced error handler
      const errorInfo = VideoUploadErrorHandler.parseError(error);
      VideoUploadErrorHandler.logError(error, {
        fileName: file.name,
        fileSize: file.size,
        metadata
      });
      
      this.updateStatus('failed');
      this.handleError(new Error(errorInfo.userMessage), errorInfo);
      throw new Error(errorInfo.userMessage);
    }
  }

  /**
   * Upload video file in chunks with enhanced error handling and session management
   * @param file - Video file to upload
   * @returns Promise with upload result
   */
  async upload(file: File): Promise<{ videoId: string; processingJobId?: string }> {
    if (!this.uploadId || !this.videoId) {
      throw new Error('Upload not initialized. Call initialize() first.');
    }

    try {
      this.onStatusChange?.('uploading');

      // 🔧 SESSION MANAGEMENT: Track if we need to refresh session
      let currentUploadSession = this.uploadSession;
      let sessionRefreshCount = 0;
      const maxSessionRefreshes = 2;

      // FRONTEND FIX 9: Upload chunks with better error handling and session management
      for (let i = 0; i < this.totalChunks; i++) {
        const start = i * this.chunkSize;
        const end = Math.min(start + this.chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Skip empty chunks that can occur when file size divides evenly by chunk size
        if (chunk.size === 0) {
          console.log(`ℹ️ Skipping empty chunk ${i} - file upload complete`);
          // Adjust totalChunks to reflect actual number of chunks needed
          this.totalChunks = i;
          break;
        }

        let chunkUploadSuccess = false;
        let sessionRefreshAttempted = false;

        // Try uploading the chunk with current session
        while (!chunkUploadSuccess && sessionRefreshCount < maxSessionRefreshes) {
          try {
            const chunkResponse = await videoStreamingAPI.uploadChunk({
              uploadSession: currentUploadSession,
              chunkIndex: i,
              chunk
            });

            if (chunkResponse.status === 'success' && chunkResponse.data) {
              
              // 🆕 HANDLE SESSION RECOVERY: Check if session was automatically recovered
              if (chunkResponse.data.sessionRecovered && chunkResponse.data.newUploadSession) {
                console.log('🔄 Session was automatically recovered during chunk upload:', chunkResponse.data.recovery);
                
                // Update current session with the recovered session
                currentUploadSession = chunkResponse.data.newUploadSession;
                this.uploadSession = chunkResponse.data.newUploadSession;
                
                // Notify about recovery
                if (this.onSessionRecovered && chunkResponse.data.recovery) {
                  this.onSessionRecovered(chunkResponse.data.recovery);
                }
                
                console.log('✅ Session recovery successful, continuing with new session');
              }
              
              this.uploadedParts.push({
                partNumber: i + 1,
                etag: chunkResponse.data.etag
              });
              this.uploadedChunks++;

              const progress = videoStreamingUtils.calculateUploadProgress(
                this.uploadedChunks, 
                this.totalChunks
              );
              this.onProgress?.(progress, this.uploadedChunks, this.totalChunks);
              chunkUploadSuccess = true;
            } else {
              throw new Error(`Failed to upload chunk ${i}: ${chunkResponse.error}`);
            }
          } catch (chunkError: any) {
            console.error(`❌ Chunk ${i} upload failed:`, chunkError);

            // 🔧 SESSION REFRESH: Check if it's a session invalidation error using enhanced error handler
            const errorInfo = VideoUploadErrorHandler.parseError(chunkError);
            
            if (errorInfo.code === 'SESSION_EXPIRED' || 
                chunkError.message?.includes('NoSuchUpload') || 
                chunkError.message?.includes('does not exist') ||
                chunkError.message?.includes('InvalidRequest') ||
                chunkError.message?.includes('Session expired and automatic recovery failed')) {
              
              if (!sessionRefreshAttempted && sessionRefreshCount < maxSessionRefreshes) {
                console.log(`🔄 Upload session expired/invalid, attempting recovery (attempt ${sessionRefreshCount + 1}/${maxSessionRefreshes})...`);
                console.log(`📝 Session expiration details:`, {
                  errorCode: errorInfo.code,
                  errorMessage: errorInfo.message,
                  originalError: chunkError
                });
                
                try {
                  // 🆕 TRY MANUAL RECOVERY FIRST: If automatic recovery failed due to missing data
                  if (chunkError.message?.includes('Recovery data missing') && this.recoveryData) {
                    console.log('🔧 Attempting manual session recovery...');
                    
                    const recoveryResult = await videoStreamingAPI.recoverSession(currentUploadSession, this.recoveryData);
                    
                    if (recoveryResult.status === 'success' && recoveryResult.data) {
                      console.log('✅ Manual session recovery successful:', recoveryResult.data.recovery);
                      
                      currentUploadSession = recoveryResult.data.newUploadSession;
                      this.uploadSession = recoveryResult.data.newUploadSession;
                      
                      // Notify about recovery
                      if (this.onSessionRecovered) {
                        this.onSessionRecovered(recoveryResult.data.recovery);
                      }
                      
                      sessionRefreshCount++;
                      sessionRefreshAttempted = true;
                      
                      console.log('✅ Manual recovery complete, retrying chunk upload...');
                      // Reset uploaded parts for this chunk since we need to restart
                      this.uploadedParts = this.uploadedParts.filter(part => part.partNumber !== (i + 1));
                      continue; // Try again with recovered session
                    }
                  }
                  
                  // Fallback to original session refresh method
                  console.log('🔄 Falling back to fresh session initialization...');
                  const freshSession = await this.refreshUploadSession(file);
                  currentUploadSession = freshSession;
                  this.uploadSession = freshSession;
                  sessionRefreshCount++;
                  sessionRefreshAttempted = true;
                  
                  console.log('✅ Fresh upload session obtained, retrying chunk upload...');
                  // Reset uploaded parts for this chunk since we need to restart
                  this.uploadedParts = this.uploadedParts.filter(part => part.partNumber !== (i + 1));
                  continue; // Try again with fresh session
                } catch (refreshError: any) {
                  console.error('❌ Failed to refresh/recover upload session:', refreshError);
                  throw new Error(`Failed to refresh upload session: ${refreshError.message}`);
                }
              } else {
                throw new Error(`Upload session refresh limit reached. ${errorInfo.userMessage}`);
              }
            }
            
            if (errorInfo.code === 'BACKEND_CONFIG_ERROR') {
              // This is the JSON parsing error - abort the entire upload
              this.updateStatus('failed');
              throw new Error(`${errorInfo.userMessage} (Chunk ${i + 1}/${this.totalChunks})`);
            }
            
            // For other non-session errors, throw immediately
            throw chunkError;
          }
        }

        if (!chunkUploadSuccess) {
          throw new Error(`Failed to upload chunk ${i} after session refresh attempts`);
        }
      }

      // Complete upload with current (possibly refreshed) session
      const completeResponse = await videoStreamingAPI.completeUpload({
        uploadId: this.uploadId,
        uploadSession: currentUploadSession,
        parts: this.uploadedParts
      });

      if (completeResponse.status === 'success' && completeResponse.data) {
        this.onStatusChange?.('completed');
        return {
          videoId: completeResponse.data.videoId,
          processingJobId: completeResponse.data.processingJobId
        };
      } else {
        throw new Error(completeResponse.error || 'Failed to complete upload');
      }
    } catch (error: any) {
      // FRONTEND FIX 11: Enhanced error handling - avoid unnecessary abort calls
      const errorInfo = VideoUploadErrorHandler.parseError(error);
      VideoUploadErrorHandler.logError(error, {
        uploadId: this.uploadId,
        videoId: this.videoId,
        uploadedChunks: this.uploadedChunks,
        totalChunks: this.totalChunks
      });
      
      this.updateStatus('failed');
      this.handleError(new Error(errorInfo.userMessage), errorInfo);
      
      // 🔧 AVOID ABORT: Don't abort upload sessions as it invalidates them
      // Let the session expire naturally (7 days) instead of invalidating it
      console.log('ℹ️ Upload failed, but not calling abort to preserve session validity for potential retry');
      
      throw new Error(errorInfo.userMessage);
    }
  }

  /**
   * Refresh upload session when the current one becomes invalid
   * @private
   */
  private async refreshUploadSession(file: File): Promise<any> {
    if (!this.metadata) {
      throw new Error('Cannot refresh session: original metadata not available');
    }

    console.log('🔄 Refreshing upload session...');
    
    // Initialize a new upload session
    const response = await videoStreamingAPI.initializeUpload({
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      courseId: this.metadata.courseId!, // We know this exists from validation
      chunkSize: this.chunkSize,
      metadata: {
        ...this.metadata,
        originalFileName: file.name
      }
    });
    
    if (response.status !== 'success' || !response.data) {
      throw new Error('Failed to initialize fresh upload session');
    }

    // Extract the new session data (same logic as initialize method)
    let responseData = response.data as any;
    let attempts = 0;
    while (responseData && responseData.data && !responseData.uploadId && !responseData.upload_id && attempts < 3) {
      responseData = responseData.data;
      attempts++;
    }

    const uploadId = responseData?.uploadId || responseData?.upload_id;
    const videoId = responseData?.videoId || responseData?.video_id;
    
    if (!uploadId || !videoId) {
      throw new Error('Invalid fresh session response: missing upload/video ID');
    }

    // Update instance properties with fresh session
    this.uploadId = uploadId;
    this.videoId = videoId;
    
    console.log('✅ Fresh upload session created:', { uploadId, videoId });
    
    return responseData;
  }

  /**
   * Abort current upload with enhanced error handling
   * ⚠️ WARNING: This will invalidate the upload session, making retries impossible
   * @returns Promise with abort result
   */
  async abort(): Promise<void> {
    if (!this.uploadSession) {
      throw new Error('No active upload to abort');
    }

    console.log('⚠️ WARNING: Aborting upload will invalidate the session, making retries impossible');

    try {
      const response = await videoStreamingAPI.abortUpload(this.uploadSession);
      
      // FRONTEND FIX 12: Handle abort response gracefully
      if (response.status === 'success' || response.data?.success) {
        this.onStatusChange?.('aborted');
        this.reset();
        console.log('✅ Upload aborted and session invalidated');
      } else {
        // Even if abort "failed", clean up local state
        console.warn('Abort response unclear, but cleaning up local state:', response);
        this.onStatusChange?.('aborted');
        this.reset();
      }
    } catch (error: any) {
      // FRONTEND FIX 13: Graceful abort error handling
      const errorInfo = VideoUploadErrorHandler.parseError(error);
      
      if (errorInfo.code === 'BACKEND_RESPONSE_ERROR' || 
          errorInfo.code === 'SESSION_NOT_FOUND') {
        // These are expected errors - consider abort successful
        console.warn('Abort had expected error, considering successful:', errorInfo.message);
        this.onStatusChange?.('aborted');
        this.reset();
        return;
      }
      
      VideoUploadErrorHandler.logError(error, {
        uploadSession: this.uploadSession,
        operation: 'abort'
      });
      
      // Always clean up local state even if abort fails
      this.reset();
      this.handleError(new Error(errorInfo.userMessage), errorInfo);
      
      // Don't throw abort errors - just log them
      console.warn('Upload abort completed with warnings:', errorInfo.userMessage);
    }
  }

  /**
   * Reset upload state
   */
  reset(): void {
    this.uploadSession = null;
    this.uploadId = null;
    this.videoId = null;
    this.totalChunks = 0;
    this.uploadedChunks = 0;
    this.chunkSize = 5 * 1024 * 1024; // Default 5MB chunk size
    this.uploadedParts = [];
    this.file = null; 
    this.metadata = null;
    this.recoveryData = null;
  }

  /**
   * Get current upload progress
   * @returns Upload progress information
   */
  getProgress(): {
    progress: number;
    uploadedChunks: number;
    totalChunks: number;
    uploadId: string | null;
    videoId: string | null;
  } {
    return {
      progress: videoStreamingUtils.calculateUploadProgress(this.uploadedChunks, this.totalChunks),
      uploadedChunks: this.uploadedChunks,
      totalChunks: this.totalChunks,
      uploadId: this.uploadId,
      videoId: this.videoId
    };
  }

  /**
   * Update status and notify callback
   * @private
   */
  private updateStatus(status: TVideoUploadStatus): void {
    this.onStatusChange?.(status);
  }

  /**
   * Handle error and notify callback
   * @private
   */
  private handleError(error: Error, errorInfo?: any): void {
    this.onError?.(error, errorInfo);
  }
}

export default videoStreamingAPI; 