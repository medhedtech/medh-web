#!/usr/bin/env node

/**
 * Video Upload Authentication Test Script
 * 
 * This script tests the video streaming API authentication
 * and helps diagnose the JSON parsing error.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1';
const TEST_TOKEN = 'your-test-token-here'; // Replace with a valid token

// Test data
const testVideoFile = {
  fileName: 'test-video.mp4',
  fileSize: 1024 * 1024 * 10, // 10MB
  contentType: 'video/mp4',
  courseId: 'test-course-123'
};

/**
 * Test 1: Check API Health
 */
async function testApiHealth() {
  console.log('\n🔍 Testing API Health...');
  try {
    const response = await axios.get(`${API_BASE_URL}/video-streaming/health`);
    console.log('✅ API Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    return false;
  }
}

/**
 * Test 2: Test Authentication with Token
 */
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  if (!TEST_TOKEN || TEST_TOKEN === 'your-test-token-here') {
    console.log('⚠️  No test token provided. Please set TEST_TOKEN in the script.');
    return false;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/video-streaming/initialize-upload`,
      {
        fileName: testVideoFile.fileName,
        fileSize: testVideoFile.fileSize,
        contentType: testVideoFile.contentType,
        courseId: testVideoFile.courseId,
        chunkSize: 5 * 1024 * 1024, // 5MB
        metadata: {
          courseId: testVideoFile.courseId,
          description: 'Test video upload'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'x-access-token': TEST_TOKEN
        }
      }
    );
    
    console.log('✅ Authentication successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Authentication failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    return false;
  }
}

/**
 * Test 3: Test Multipart vs JSON Content-Type
 */
async function testContentTypes() {
  console.log('\n📝 Testing Content-Type Handling...');
  
  // Test 1: JSON Content-Type (should work)
  console.log('Testing JSON Content-Type...');
  try {
    const jsonResponse = await axios.post(
      `${API_BASE_URL}/video-streaming/initialize-upload`,
      {
        fileName: testVideoFile.fileName,
        fileSize: testVideoFile.fileSize,
        contentType: testVideoFile.contentType,
        courseId: testVideoFile.courseId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      }
    );
    console.log('✅ JSON Content-Type works:', jsonResponse.status);
  } catch (error) {
    console.error('❌ JSON Content-Type failed:', error.response?.status, error.response?.data);
  }

  // Test 2: Multipart Content-Type (might cause JSON parsing error)
  console.log('\nTesting Multipart Content-Type...');
  try {
    const formData = new FormData();
    formData.append('fileName', testVideoFile.fileName);
    formData.append('fileSize', testVideoFile.fileSize.toString());
    formData.append('contentType', testVideoFile.contentType);
    formData.append('courseId', testVideoFile.courseId);

    const multipartResponse = await axios.post(
      `${API_BASE_URL}/video-streaming/initialize-upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      }
    );
    console.log('✅ Multipart Content-Type works:', multipartResponse.status);
  } catch (error) {
    console.error('❌ Multipart Content-Type failed:', error.response?.status);
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
    
    // Check if this is the JSON parsing error
    if (error.message.includes('Unexpected token') || 
        error.response?.data?.includes?.('Unexpected token')) {
      console.log('🎯 Found the JSON parsing error! The backend expects JSON but received multipart data.');
    }
  }
}

/**
 * Test 4: Generate a Valid Test Token (Mock)
 */
function generateTestToken() {
  console.log('\n🔑 Generating Test Token...');
  
  // This is a mock token for testing - in real scenario, you'd get this from login
  const mockPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
    role: 'student',
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now
  };
  
  // Base64 encode the payload (this is just for testing, not a real JWT)
  const mockToken = Buffer.from(JSON.stringify(mockPayload)).toString('base64');
  
  console.log('📋 Mock token generated (for testing only):', mockToken);
  console.log('⚠️  Note: This is not a real JWT. Use a valid token from your authentication system.');
  
  return mockToken;
}

/**
 * Test 5: Check Backend Middleware Configuration
 */
async function testMiddlewareConfiguration() {
  console.log('\n⚙️  Testing Backend Middleware Configuration...');
  
  // Test CORS headers
  try {
    const response = await axios.options(`${API_BASE_URL}/video-streaming/health`);
    console.log('✅ CORS preflight successful');
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    });
  } catch (error) {
    console.error('❌ CORS preflight failed:', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Video Upload Authentication Tests...');
  console.log('API Base URL:', API_BASE_URL);
  
  // Run all tests
  const healthOk = await testApiHealth();
  
  if (!healthOk) {
    console.log('\n❌ API is not healthy. Please ensure the backend is running on port 8080.');
    return;
  }
  
  await testMiddlewareConfiguration();
  
  // Generate a test token if none provided
  if (!TEST_TOKEN || TEST_TOKEN === 'your-test-token-here') {
    generateTestToken();
    console.log('\n⚠️  Please update TEST_TOKEN in the script with a valid token and run again.');
    return;
  }
  
  await testAuthentication();
  await testContentTypes();
  
  console.log('\n✅ Tests completed!');
  console.log('\n📋 Summary:');
  console.log('1. If authentication fails with 401, the token is invalid or expired');
  console.log('2. If you see JSON parsing errors, the backend is receiving multipart data when expecting JSON');
  console.log('3. Check that the frontend sends Content-Type: application/json for initialization');
  console.log('4. Check that the frontend sends multipart/form-data only for chunk uploads');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testApiHealth,
  testAuthentication,
  testContentTypes,
  generateTestToken
}; 