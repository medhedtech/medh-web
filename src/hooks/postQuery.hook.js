import { useState } from 'react';
import apiClient from '../apis/apiClient';
import apiWithAuth from '../utils/apiWithAuth';
import { getAuthToken } from '../utils/auth';

const headers = {
  'Content-Type': 'application/json',
};

const usePostQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const postQuery = async (params) => {
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
      const api = requireAuth ? apiWithAuth : apiClient;
      
      // Custom headers merged with auth headers
      const mergedHeaders = {
        ...headers,
        ...(headersFromParams || {})
      };
      
      if (debug) {
        console.log('Request Headers:', mergedHeaders);
      }
      
      const { data: apiData = {} } = requireAuth
        ? await api.post(url, postData, { 
            headers: mergedHeaders 
          })
        : await apiClient.post(url, postData, {
            headers: mergedHeaders,
          });
      
      setData(apiData);
      await onSuccess(apiData);
      console.log(apiData, 'postQuery-success');
      return apiData;
    } catch (err) {
      if (debug) {
        console.error('Request failed with error:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
      }
      
      onFail(err);
      console.log(err, 'postQuery-fail');
      setError(err);
      setData();
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
