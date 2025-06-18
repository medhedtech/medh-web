"use client";

import { useState, useCallback } from "react";
import api from "@/utils/api";

export interface SubmitFormParams<T = any> {
  /** API endpoint for form submission */
  endpoint: string;
  /** Data to be submitted */
  data: T;
  /** Optional callback on successful submission */
  onSuccess?: (data: any) => void;
  /** Optional callback on submission error */
  onError?: (error: any) => void;
  /** Success toast message */
  successMessage?: string;
  /** Error toast message */
  errorMessage?: string;
  /** Whether to show toast notifications */
  showToast?: boolean;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request method (defaults to POST) */
  method?: "POST" | "PUT" | "PATCH";
}

export interface UploadFileParams {
  /** File to upload */
  file: File;
  /** Optional custom endpoint for file upload */
  endpoint?: string;
  /** Optional callback on successful upload */
  onSuccess?: (data: any) => void;
  /** Optional callback on upload error */
  onError?: (error: any) => void;
  /** Success toast message */
  successMessage?: string;
  /** Error toast message */
  errorMessage?: string;
  /** Whether to show toast notifications */
  showToast?: boolean;
  /** Optional additional form data */
  additionalData?: Record<string, any>;
  /** Whether to use multipart/form-data instead of base64 */
  useFormData?: boolean;
  /** Upload progress callback */
  onProgress?: (progress: number) => void;
}

export interface UploadFilesParams {
  /** Files to upload */
  files: File[];
  /** Other upload parameters */
  params: Omit<UploadFileParams, "file">;
}

export interface UseFormSubmitResult {
  /** Loading state */
  loading: boolean;
  /** Submit form data */
  submitForm: <T = any>(params: SubmitFormParams<T>) => Promise<any>;
  /** Upload a single file */
  uploadFile: (params: UploadFileParams) => Promise<any>;
  /** Upload multiple files */
  uploadFiles: (params: UploadFilesParams) => Promise<any[]>;
  /** Reset loading state */
  resetLoading: () => void;
}

/**
 * Custom hook for handling form submissions and file uploads
 * @returns Object with form submission functions and loading state
 */
export const useFormSubmit = (): UseFormSubmitResult => {
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Submit form data to an API endpoint
   */
  const submitForm = useCallback(async <T = any>({
    endpoint,
    data,
    onSuccess,
    onError,
    successMessage = "Operation successful",
    errorMessage = "Operation failed",
    showToast = true,
    headers,
    method = "POST"
  }: SubmitFormParams<T>): Promise<any> => {
    try {
      setLoading(true);
      
      let response;
      switch (method) {
        case "PUT":
          response = await api.put(endpoint, data, { headers });
          break;
        case "PATCH":
          response = await api.patch(endpoint, data, { headers });
          break;
        default:
          response = await api.post(endpoint, data, { headers });
      }
      
      if (showToast) {
        showToast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || errorMessage;
      
      if (showToast) {
        showToast.error(message);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload a file using base64 or FormData
   */
  const uploadFile = useCallback(async ({
    file,
    endpoint = "/upload/image",
    onSuccess,
    onError,
    successMessage = "File uploaded successfully",
    errorMessage = "File upload failed",
    showToast = true,
    additionalData = {},
    useFormData = false,
    onProgress
  }: UploadFileParams): Promise<any> => {
    if (!file) {
      const error = new Error("No file provided");
      if (onError) onError(error);
      return Promise.reject(error);
    }

    try {
      setLoading(true);
      
      // Use FormData for file upload
      if (useFormData) {
        const formData = new FormData();
        formData.append("file", file);
        
        // Add any additional data
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        const response = await api.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: onProgress 
            ? (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 100)
                );
                onProgress(percentCompleted);
              }
            : undefined
        });
        
        if (showToast) {
          showToast.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        return response.data;
      } 
      // Use base64 encoding
      else {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = async () => {
            try {
              if (!reader.result) {
                throw new Error("Failed to read file");
              }
              
              const base64 = typeof reader.result === 'string' 
                ? reader.result.split(",")[1]
                : '';
              
              const response = await api.post(endpoint, {
                base64String: base64,
                fileType: file.type.split("/")[0],
                fileName: file.name,
                ...additionalData
              });
              
              if (showToast) {
                showToast.success(successMessage);
              }
              
              if (onSuccess) {
                onSuccess(response.data);
              }
              
              resolve(response.data);
            } catch (error) {
              if (showToast) {
                showToast.error(errorMessage);
              }
              
              if (onError) {
                onError(error);
              }
              
              reject(error);
            }
          };
          
          reader.onerror = () => {
            const error = new Error("File reading failed");
            
            if (showToast) {
              showToast.error(errorMessage);
            }
            
            if (onError) {
              onError(error);
            }
            
            reject(error);
          };
          
          reader.readAsDataURL(file);
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || errorMessage;
      
      if (showToast) {
        showToast.error(message);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload multiple files
   */
  const uploadFiles = useCallback(async ({
    files,
    params
  }: UploadFilesParams): Promise<any[]> => {
    if (!files.length) {
      return Promise.resolve([]);
    }
    
    try {
      setLoading(true);
      
      // Upload files concurrently
      const uploadPromises = files.map(file => 
        uploadFile({ ...params, file, showToast: false })
      );
      
      const results = await Promise.all(uploadPromises);
      
      if (params.showToast !== false) {
        showToast.success(params.successMessage || "Files uploaded successfully");
      }
      
      if (params.onSuccess) {
        params.onSuccess(results);
      }
      
      return results;
    } catch (error: any) {
      if (params.showToast !== false) {
        const message = error?.response?.data?.message || params.errorMessage || "Files upload failed";
        showToast.error(message);
      }
      
      if (params.onError) {
        params.onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [uploadFile]);

  /**
   * Reset loading state manually
   */
  const resetLoading = useCallback((): void => {
    setLoading(false);
  }, []);

  return {
    loading,
    submitForm,
    uploadFile,
    uploadFiles,
    resetLoading
  };
};

export default useFormSubmit; 