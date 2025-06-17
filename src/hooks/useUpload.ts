import { useState, useCallback, useRef } from 'react';
import { uploadService, UploadResponse, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '@/services/uploadService';
import { showToast } from '@/utils/toastManager';

// Custom error class with code and additional details
export class UploadError extends Error {
  code: string;
  details?: Record<string, any>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: Record<string, any>) {
    super(message);
    this.name = 'UploadError';
    this.code = code;
    this.details = details;
  }
}

export type FileType = 'image' | 'document' | 'video' | 'audio';

export interface UploadOptions {
  // Callbacks
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: UploadError) => void;
  onProgress?: (progress: number) => void; // 0-100
  
  // Toast options
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  
  // Validation options
  maxFileSize?: number; // in bytes
  allowedMimeTypes?: Record<string, string>;
  validateFile?: boolean;
  
  // Debug options
  debug?: boolean;
  
  // Form handling options
  formConfig?: {
    useFormData?: boolean;
    fieldName?: string;
    headers?: Record<string, string>;
  };
  
  // Retry configuration
  retryConfig?: {
    retries?: number;
    shouldRetry?: (error: Error) => boolean;
    retryDelay?: number;
  };
}

export interface UploadHookReturn {
  // State
  isUploading: boolean;
  progress: number;
  error: UploadError | null;
  lastUploadedFile: UploadResponse | null;
  
  // Methods
  uploadFile: (file: File, options?: Partial<UploadOptions>) => Promise<UploadResponse | null>;
  uploadMultipleFiles: (files: File[], options?: Partial<UploadOptions>) => Promise<UploadResponse | null>;
  uploadBase64: (base64: string, fileType: FileType, options?: Partial<UploadOptions>) => Promise<UploadResponse | null>;
  convertToBase64: (file: File) => Promise<string>;
  uploadImageSafely: (imageData: string | File, options?: Partial<UploadOptions>) => Promise<UploadResponse | null>;
  ensureValidBase64: (base64: string, fileType: FileType) => string;
  
  // Utilities
  validateFile: (file: File) => { isValid: boolean; error?: UploadError };
  resetState: () => void;
  cancelUpload: () => void;
}

// Type augmentation for uploadService methods to support progress and cancellation
declare module '@/services/uploadService' {
  interface UploadOptions {
    onProgress?: (progressEvent: ProgressEvent) => void;
    signal?: AbortSignal;
  }
}

export const useUpload = (defaultOptions: UploadOptions = {}): UploadHookReturn => {
  // Default options
  const options = {
    showToast: true,
    validateFile: true,
    maxFileSize: MAX_FILE_SIZE,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
    debug: false,
    ...defaultOptions
  };

  // State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [lastUploadedFile, setLastUploadedFile] = useState<UploadResponse | null>(null);
  
  // Refs
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Debug logger
  const debugLog = useCallback((message: string, data?: any) => {
    if (options.debug) {
      console.log(`[useUpload] ${message}`, data || '');
    }
  }, [options.debug]);

  // Reset all state
  const resetState = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  // Cancel current upload
  const cancelUpload = useCallback(() => {
    if (cancelTokenRef.current) {
      debugLog('Upload cancelled by user');
      cancelTokenRef.current.abort();
      cancelTokenRef.current = null;
      setIsUploading(false);
      setProgress(0);
    }
  }, [debugLog]);

  // Validate file before upload
  const validateFile = useCallback((file: File): { isValid: boolean; error?: UploadError } => {
    debugLog('Validating file', { 
      name: file?.name, 
      type: file?.type, 
      size: file?.size 
    });
    
    if (!file) {
      debugLog('File validation failed: No file provided');
      return {
        isValid: false,
        error: new UploadError('No file provided', 'NO_FILE')
      };
    }

    if (file.size > options.maxFileSize) {
      debugLog('File validation failed: File too large', {
        fileSize: file.size,
        maxSize: options.maxFileSize
      });
      
      return {
        isValid: false,
        error: new UploadError(
          `File size exceeds maximum limit of ${Math.round(options.maxFileSize / (1024 * 1024))}MB`,
          'FILE_TOO_LARGE',
          { fileSize: file.size, maxSize: options.maxFileSize }
        )
      };
    }

    if (!options.allowedMimeTypes[file.type]) {
      debugLog('File validation failed: Invalid file type', {
        fileType: file.type,
        allowedTypes: Object.keys(options.allowedMimeTypes)
      });
      
      return {
        isValid: false,
        error: new UploadError(
          `Invalid file type: ${file.type}. Allowed types: ${Object.keys(options.allowedMimeTypes).join(', ')}`,
          'INVALID_FILE_TYPE',
          { fileType: file.type, allowedTypes: Object.keys(options.allowedMimeTypes) }
        )
      };
    }

    debugLog('File validation successful');
    return { isValid: true };
  }, [options.maxFileSize, options.allowedMimeTypes, debugLog]);

  // Handle successful upload
  const handleSuccess = useCallback((response: UploadResponse, currentOptions?: Partial<UploadOptions>) => {
    const mergedOptions = { ...options, ...currentOptions };
    
    debugLog('Upload successful', response);
    
    if (mergedOptions.showToast) {
      showToast.success(mergedOptions.successMessage || response.message || 'Upload successful');
    }
    
    setLastUploadedFile(response);
    setProgress(100);
    
    // Call onSuccess callback if provided
    mergedOptions.onSuccess?.(response);
    
    return response;
  }, [options, debugLog]);

  // Handle upload error
  const handleError = useCallback((error: Error | UploadError, currentOptions?: Partial<UploadOptions>) => {
    const mergedOptions = { ...options, ...currentOptions };
    
    // Convert generic Error to UploadError
    const uploadError = error instanceof UploadError 
      ? error 
      : new UploadError(error.message || 'Upload failed');
    
    debugLog('Upload error', { 
      message: uploadError.message, 
      code: uploadError.code, 
      details: uploadError.details,
      stack: error.stack 
    });
    
    if (mergedOptions.showToast) {
      toast.error(mergedOptions.errorMessage || uploadError.message || 'Upload failed');
    }
    
    setError(uploadError);
    
    // Call onError callback if provided
    mergedOptions.onError?.(uploadError);
    
    return null;
  }, [options, debugLog]);

  // Upload a single file
  const uploadFile = useCallback(async (
    file: File, 
    currentOptions?: Partial<UploadOptions>
  ): Promise<UploadResponse | null> => {
    const mergedOptions = { ...options, ...currentOptions };
    
    debugLog('Starting file upload', { 
      fileName: file?.name, 
      fileType: file?.type, 
      fileSize: file?.size 
    });
    
    resetState();
    setIsUploading(true);
    
    // Create abort controller for cancellation
    cancelTokenRef.current = new AbortController();
    
    try {
      // Check if file is valid
      if (!file || !(file instanceof File)) {
        throw new UploadError('Invalid file object', 'INVALID_FILE');
      }
      
      // Validate file if option is enabled
      if (mergedOptions.validateFile) {
        const { isValid, error } = validateFile(file);
        if (!isValid && error) {
          throw error;
        }
      }
      
      // Set up progress tracking
      const onUploadProgress = (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          mergedOptions.onProgress?.(percentCompleted);
          debugLog(`Upload progress: ${percentCompleted}%`);
        }
      };
      
      // Upload file
      debugLog('Sending file to server');
      const response = await uploadService.uploadFile(file);
      
      // Log response
      debugLog('Server response', response);
      
      if (!response || !response.success) {
        throw new UploadError(
          response?.message || 'Server returned an unsuccessful response',
          'SERVER_ERROR',
          response
        );
      }
      
      return handleSuccess(response, mergedOptions);
    } catch (error) {
      return handleError(error as Error, mergedOptions);
    } finally {
      setIsUploading(false);
      cancelTokenRef.current = null;
    }
  }, [options, validateFile, handleSuccess, handleError, resetState, debugLog]);

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (
    files: File[],
    currentOptions?: Partial<UploadOptions>
  ): Promise<UploadResponse | null> => {
    const mergedOptions = { ...options, ...currentOptions };
    
    debugLog('Starting multiple file upload', { 
      fileCount: files?.length,
      files: files?.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });
    
    // Check if files array is valid
    if (!files || !Array.isArray(files) || files.length === 0) {
      return handleError(
        new UploadError('No files to upload', 'NO_FILES'), 
        mergedOptions
      );
    }
    
    resetState();
    setIsUploading(true);
    
    // Create abort controller for cancellation
    cancelTokenRef.current = new AbortController();
    
    try {
      // Validate files if option is enabled
      if (mergedOptions.validateFile) {
        for (const file of files) {
          const { isValid, error } = validateFile(file);
          if (!isValid && error) {
            throw error;
          }
        }
      }
      
      // Upload files
      debugLog('Sending files to server');
      const response = await uploadService.uploadMultipleFiles(files);
      
      // Log response
      debugLog('Server response', response);
      
      if (!response || !response.success) {
        throw new UploadError(
          response?.message || 'Server returned an unsuccessful response',
          'SERVER_ERROR',
          response
        );
      }
      
      return handleSuccess(response, mergedOptions);
    } catch (error) {
      return handleError(error as Error, mergedOptions);
    } finally {
      setIsUploading(false);
      cancelTokenRef.current = null;
    }
  }, [options, validateFile, handleSuccess, handleError, resetState, debugLog]);

  // Upload base64 data
  const uploadBase64 = useCallback(async (
    base64: string,
    fileType: FileType,
    currentOptions?: Partial<UploadOptions>
  ): Promise<UploadResponse | null> => {
    const mergedOptions = { ...options, ...currentOptions };
    
    debugLog('Starting base64 upload', { 
      fileType,
      base64Length: base64?.length,
      base64Prefix: base64?.substring(0, 20) + '...'
    });
    
    resetState();
    setIsUploading(true);
    
    try {
      // Validate base64 string
      if (!base64) {
        throw new UploadError('No file data provided', 'NO_DATA');
      }
      
      // Check if base64 string is properly formatted
      const isBase64Format = typeof base64 === 'string' && (
        base64.startsWith('data:') || 
        /^[A-Za-z0-9+/=]+$/.test(base64)
      );
      
      if (!isBase64Format) {
        debugLog('Invalid base64 format', {
          start: base64.substring(0, 30)
        });
        throw new UploadError('Invalid base64 format', 'INVALID_BASE64_FORMAT');
      }
      
      // Validate file type
      if (!['image', 'document', 'video', 'audio'].includes(fileType)) {
        throw new UploadError(
          `Invalid file type: ${fileType}. Allowed types: image, document, video, audio`,
          'INVALID_FILE_TYPE'
        );
      }
      
      // Format base64 string if needed
      let formattedBase64 = base64;
      if (!base64.startsWith('data:')) {
        // Add proper prefix based on file type
        const mimeType = 
          fileType === 'image' ? 'image/jpeg' :
          fileType === 'video' ? 'video/mp4' :
          fileType === 'audio' ? 'audio/mp3' :
          'application/octet-stream';
          
        formattedBase64 = `data:${mimeType};base64,${base64}`;
        debugLog('Formatted base64 string', { 
          before: base64.substring(0, 20),
          after: formattedBase64.substring(0, 40)
        });
      }
      
      // Set progress
      setProgress(50);
      mergedOptions.onProgress?.(50);
      
      // Convert video and audio to document type for service compatibility
      const supportedFileType = fileType === 'video' || fileType === 'audio' ? 'document' : fileType;
      
      // Upload base64 data
      debugLog('Sending base64 to server');
      const response = await uploadService.uploadBase64(formattedBase64, supportedFileType);
      
      // Log response
      debugLog('Server response', response);
      
      if (!response || !response.success) {
        throw new UploadError(
          response?.message || 'Server returned an unsuccessful response',
          'SERVER_ERROR',
          response
        );
      }
      
      setProgress(100);
      mergedOptions.onProgress?.(100);
      
      return handleSuccess(response, mergedOptions);
    } catch (error) {
      return handleError(error as Error, mergedOptions);
    } finally {
      setIsUploading(false);
    }
  }, [options, handleSuccess, handleError, resetState, debugLog]);

  // Convert file to base64
  const convertToBase64 = useCallback(async (file: File): Promise<string> => {
    debugLog('Converting file to base64', { 
      fileName: file?.name, 
      fileType: file?.type, 
      fileSize: file?.size 
    });
    
    try {
      // Check if file is valid
      if (!file || !(file instanceof File)) {
        throw new UploadError('Invalid file object', 'INVALID_FILE');
      }
      
      // Validate file
      const { isValid, error } = validateFile(file);
      if (!isValid && error) {
        throw error;
      }
      
      const base64 = await uploadService.fileToBase64(file);
      debugLog('File converted to base64 successfully', { 
        base64Length: base64?.length,
        base64Substring: base64?.substring(0, 20) + '...' 
      });
      
      return base64;
    } catch (error) {
      debugLog('Error converting file to base64', error);
      handleError(error as Error);
      throw error;
    }
  }, [validateFile, handleError, debugLog]);

  // Helper to ensure base64 is properly formatted and not truncated
  const ensureValidBase64 = useCallback((base64: string, fileType: FileType): string => {
    debugLog('Validating base64 string', { 
      length: base64?.length,
      hasPrefix: base64?.startsWith('data:'),
      type: fileType
    });

    // If it's already a proper data URL, validate it
    if (base64?.startsWith('data:')) {
      // Check if it has the correct structure
      const isValidFormat = /^data:(\w+)\/(\w+);base64,/.test(base64);
      if (!isValidFormat) {
        throw new UploadError(
          'Invalid base64 format: missing proper mime type or base64 indicator',
          'INVALID_BASE64_FORMAT'
        );
      }
      
      // Check if it ends properly (not truncated)
      if (base64.length % 4 !== 0) {
        debugLog('Base64 string length is not a multiple of 4, may be truncated');
      }
      
      // Minimum length check - a valid image would be at least a few hundred characters
      if (base64.length < 100) {
        throw new UploadError(
          'Base64 string is too short - likely truncated or incomplete',
          'TRUNCATED_BASE64'
        );
      }
      
      return base64;
    } 
    
    // It's a raw base64 string without prefix, add the appropriate prefix
    else {
      // Validate that it contains only valid base64 characters
      if (!/^[A-Za-z0-9+/=]+$/.test(base64)) {
        throw new UploadError(
          'Invalid base64 string: contains non-base64 characters',
          'INVALID_BASE64_CHARS'
        );
      }
      
      // Check if it's properly padded
      if (base64.length % 4 !== 0) {
        debugLog('Raw base64 string is not properly padded');
        // Add padding if needed
        const padding = '='.repeat(4 - (base64.length % 4));
        base64 = base64 + padding;
      }
      
      // Add proper MIME type prefix based on file type
      const mimeType = 
        fileType === 'image' ? 'image/jpeg' :
        fileType === 'video' ? 'video/mp4' :
        fileType === 'audio' ? 'audio/mp3' :
        'application/octet-stream';
        
      return `data:${mimeType};base64,${base64}`;
    }
  }, [debugLog]);

  // Specialized method to upload images with extra validation
  const uploadImageSafely = useCallback(async (
    imageData: string | File,
    currentOptions?: Partial<UploadOptions>
  ): Promise<UploadResponse | null> => {
    const mergedOptions = { ...options, ...currentOptions };
    debugLog('Starting safe image upload', { 
      type: typeof imageData,
      isFile: imageData instanceof File
    });
    
    try {
      // Handle File object
      if (imageData instanceof File) {
        // Check file type before uploading
        if (!imageData.type.startsWith('image/')) {
          throw new UploadError(
            `File is not an image: ${imageData.type}`,
            'INVALID_IMAGE_TYPE'
          );
        }
        return await uploadFile(imageData, mergedOptions);
      }
      
      // Handle string (base64 or URL)
      if (typeof imageData === 'string') {
        // If it's a URL, not a base64 string, just return it
        if (imageData.startsWith('http')) {
          debugLog('Image data is already a URL, not uploading', { url: imageData });
          return {
            success: true,
            message: 'Image is already a URL',
            data: { url: imageData, key: '' }
          };
        }
        
        // Ensure the base64 string is valid and properly formatted
        const validatedBase64 = ensureValidBase64(imageData, 'image');
        
        // Chunk the base64 data if it's very large to avoid server-side issues
        if (validatedBase64.length > 500000) { // ~500KB
          debugLog('Base64 string is very large, consider resizing the image', {
            length: validatedBase64.length
          });
        }
        
        return await uploadBase64(validatedBase64, 'image', {
          ...mergedOptions,
          errorMessage: 'Image upload failed: server error processing image data'
        });
      }
      
      throw new UploadError(
        'Invalid image data: must be a File object or base64 string',
        'INVALID_IMAGE_DATA'
      );
    } catch (error) {
      // Provide specific guidance for common errors
      if (error instanceof UploadError) {
        if (error.code === 'SERVER_ERROR' && error.message.includes('end of form')) {
          error.message = 'Server error processing image: the image data may be too large or corrupted. Try resizing the image before uploading.';
          error.code = 'UNEXPECTED_END_OF_FORM';
        }
      }
      
      return handleError(error as Error, mergedOptions);
    }
  }, [options, uploadFile, uploadBase64, ensureValidBase64, handleError, debugLog]);

  return {
    // State
    isUploading,
    progress,
    error,
    lastUploadedFile,
    
    // Methods
    uploadFile,
    uploadMultipleFiles,
    uploadBase64,
    convertToBase64,
    uploadImageSafely,
    ensureValidBase64,
    
    // Utilities
    validateFile,
    resetState,
    cancelUpload
  };
}; 