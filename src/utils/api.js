import axios from 'axios';

// Create an Axios instance with base config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  // You can add headers or other config here
});

export default api; 