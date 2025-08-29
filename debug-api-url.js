// Debug script to check API URL configuration
console.log('=== API URL Debug ===');

// Simulate browser environment
global.window = {
  location: {
    hostname: 'localhost',
    origin: 'http://localhost:3000'
  }
};

// Mock process.env
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_API_URL_DEV = 'http://localhost:8080/api/v1';

// Import the config
const { apiBaseUrl } = require('./src/apis/config.ts');

console.log('Current API Base URL:', apiBaseUrl);
console.log('Environment:', process.env.NODE_ENV);
console.log('DEV URL:', process.env.NEXT_PUBLIC_API_URL_DEV);

// Test URL construction
const testEndpoint = '/auth/verify-temp-password';
const fullUrl = `${apiBaseUrl}${testEndpoint}`;
console.log('Full URL would be:', fullUrl);

console.log('=== End Debug ===');

