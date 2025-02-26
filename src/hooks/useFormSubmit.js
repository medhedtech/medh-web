"use client";
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/utils/api';

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitForm = useCallback(async ({
    endpoint,
    data,
    onSuccess,
    onError,
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  }) => {
    try {
      setLoading(true);
      const response = await api.post(endpoint, data);
      
      toast.success(successMessage);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || errorMessage;
      toast.error(message);
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async ({
    file,
    onSuccess,
    onError,
    successMessage = 'File uploaded successfully',
    errorMessage = 'File upload failed',
  }) => {
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      
      const promise = new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result.split(",")[1];
            const response = await api.post("/upload/image", {
              base64String: base64,
              fileType: file.type.split('/')[0],
            });
            
            toast.success(successMessage);
            if (onSuccess) {
              onSuccess(response.data);
            }
            resolve(response.data);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('File reading failed'));
      });

      reader.readAsDataURL(file);
      return await promise;
    } catch (error) {
      const message = error.response?.data?.message || errorMessage;
      toast.error(message);
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    submitForm,
    uploadFile,
  };
}; 