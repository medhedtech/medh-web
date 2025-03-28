import { useState } from 'react';
import apiClient from '../apis/apiClient';
import apiWithAuth from '../utils/apiWithAuth';
import { getAuthToken } from '../utils/auth';
import { AxiosResponse } from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

interface PostQueryParams {
  url: string;
  onSuccess?: (data: any) => void;
  onFail?: (error: any) => void;
  postData: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
  debug?: boolean;
}

const usePostQuery = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const postQuery = async (params: PostQueryParams) => {
    const {
      url,
      onSuccess = () => {
        console.log('onSuccess function');
      },
      onFail = () => {
        console.log('onFail function');
      },
      postData,
      headers: headersFromParams,
      requireAuth = true,
      debug = false,
    } = params;
    
    setLoading(true);
    
    // Debug auth token if in debug mode
    if (debug) {
      const token = getAuthToken();
      console.log('Auth Token:', token ? 'Present (length: ' + token.length + ')' : 'Missing');
      console.log('Auth requirement:', requireAuth ? 'Required' : 'Not required');
      console.log('Request URL:', url);
      console.log('Request Data:', postData);
    }
    
    try {
      // Custom headers merged with auth headers
      const mergedHeaders = {
        ...headers,
        ...(headersFromParams || {})
      };
      
      if (debug) {
        console.log('Request Headers:', mergedHeaders);
      }
      
      let apiData: any = {};
      
      if (requireAuth) {
        const response: AxiosResponse = await apiWithAuth.post(url, postData, { 
          headers: mergedHeaders 
        });
        apiData = response.data || {};
      } else {
        const response: AxiosResponse = await apiClient.post(url, postData, {
          headers: mergedHeaders,
        });
        apiData = response.data || {};
      }
      
      setData(apiData);
      await onSuccess(apiData);
      console.log(apiData, 'postQuery-success');
      return apiData;
    } catch (err: any) {
      if (debug) {
        console.error('Request failed with error:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
      }
      
      onFail(err);
      console.log(err, 'postQuery-fail');
      setError(err);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  };

  return {
    postQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default usePostQuery;
