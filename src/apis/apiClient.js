import axios from 'axios';
import axiosRetry from 'axios-retry';
import { apiBaseUrl } from './index';
import { logger } from '../utils/logger';

const apiInstance = () => {
  const api = axios.create({
    baseURL: apiBaseUrl,
  });
  axiosRetry(api, { retries: 3 });

  api.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('token');
    logger.log(accessToken, 'setToken');
    if (accessToken) {
      config.headers['x-access-token'] = accessToken;
    }
    logger.log('REQUEST', config);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      logger.log('RESPONSE', response);
      return response;
    },
    (error) => {
      /*
      if (error.response.data.detail === 'Invalid Token') {
        clearStorage();
      }
      */

      logger.log('ERROR', error.response.data.detail);
      throw error;
    }
  );

  return api;
};

const apiClient = apiInstance();

export default apiClient;
