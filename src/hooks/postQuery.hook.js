import { useState } from 'react';
import apiClient from '../apis/apiClient';
import { logger } from '../utils/logger';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

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
        logger.log('onSuccess function');
      },
      onFail = () => {
        logger.log('onFail function');
      },
      postData,
    } = params;
    setLoading(true);
    try {
      const { data: apiData = {} } = await apiClient.post(url, postData, {
        headers,
      });
      setData(apiData);
      await onSuccess(apiData);
      logger.log(apiData, 'postQuery-success');
    } catch (err) {
      // toast.error(
      //   err?.response?.data?.message ||
      //     err?.message ||
      //     err?.data?.message ||
      //     err?.response?.data?.message ||
      //     err?.data?.data?.message ||
      //     'Something went wrong'
      // );
      onFail(err);
      logger.log(err, 'postQuery-fail');
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
