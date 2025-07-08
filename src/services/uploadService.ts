import axios from 'axios';
import { apiUrls } from '@/apis';
import { apiConfig } from '@/config/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    key: string;
    [key: string]: any;
  };
}

export interface UploadError {
  success: boolean;
  message: string;
  error: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
export const MAX_FILES = 10;
export const ALLOWED_MIME_TYPES: { [key: string]: string } = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'application/zip': 'zip',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav'
};

class UploadService {
  /**
   * Validates a file before upload
   */
  private validateFile(file: File): void {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!ALLOWED_MIME_TYPES[file.type]) {
      throw new Error(`Invalid file type: ${file.type}. Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`);
    }
  }

  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Uploads a single file
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${apiConfig.apiUrl}${apiUrls.upload.uploadFile}`, formData, {
        headers: this.getAuthHeaders(),
        withCredentials: true
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Uploads multiple files
   */
  async uploadMultipleFiles(files: File[]): Promise<UploadResponse> {
    try {
      if (!files.length) {
        throw new Error('No files provided');
      }

      if (files.length > MAX_FILES) {
        throw new Error(`Too many files. Maximum allowed is ${MAX_FILES}`);
      }

      // Validate each file
      files.forEach(file => this.validateFile(file));

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`${apiConfig.apiUrl}${apiUrls.upload.uploadMultiple}`, formData, {
        headers: this.getAuthHeaders(),
        withCredentials: true
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Uploads a file using base64 string
   */
  async uploadBase64(base64String: string, fileType: 'image' | 'document' | 'video'): Promise<UploadResponse> {
    try {
      if (!base64String) {
        throw new Error('No file data provided');
      }

      if (!['image', 'document', 'video'].includes(fileType)) {
        throw new Error('Invalid file type. Must be either "image", "document", or "video"');
      }

      // If the base64 string doesn't start with 'data:', add the appropriate prefix
      let formattedBase64 = base64String;
      if (!base64String.startsWith('data:')) {
        // Detect MIME type from the base64 string
        let mimeType = 'image/jpeg'; // Default to JPEG
        if (base64String.charAt(0) === 'i') {
          mimeType = 'image/png';
        } else if (base64String.charAt(0) === 'R') {
          mimeType = 'image/gif';
        } else if (base64String.charAt(0) === 'U') {
          mimeType = 'image/webp';
        } else if (base64String.charAt(0) === 'J') {
          mimeType = 'application/pdf';
        }
        formattedBase64 = `data:${mimeType};base64,${base64String}`;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.post(`${apiConfig.apiUrl}${apiUrls.upload.uploadBase64}`, {
        base64String: formattedBase64,
        fileType,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        withCredentials: true
      });

      const responseData = response.data;

      // If response is already in the correct format, return it
      if (responseData && responseData.success !== undefined) {
        return responseData;
      }

      // If response is a string (URL), wrap it in the expected format
      if (typeof responseData === 'string') {
        return {
          success: true,
          message: 'Upload successful',
          data: {
            url: responseData,
            key: responseData.split('/').pop() || '',
          }
        };
      }

      // If response has data property but needs restructuring
      if (responseData.data) {
        return {
          success: true,
          message: 'Upload successful',
          data: {
            url: typeof responseData.data.url === 'string' ? responseData.data.url.replace(/['"]+/g, '') : responseData.data.url,
            key: typeof responseData.data.key === 'string' ? responseData.data.key.replace(/['"]+/g, '') : responseData.data.key,
            ...responseData.data
          }
        };
      }

      // Default response if none of the above conditions match
      return {
        success: false,
        message: 'Invalid response format from server',
        data: {
          url: '',
          key: ''
        }
      };

    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Converts a file to base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Handles upload errors
   */
  private handleError(error: any): Error {
    console.error('Upload error:', error);
    
    if (error.response?.data) {
      return new Error(error.response.data.message || 'Upload failed');
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('Upload failed');
  }
}

export const uploadService = new UploadService(); 