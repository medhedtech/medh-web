/**
 * Test Script for Upload Recorded Lesson API
 * 
 * This script tests the upload recorded lesson functionality
 * Run with: node test-upload-recorded-lesson.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1'; // Adjust for your environment
const BATCH_ID = '6836d9a7781e475dde0620a7'; // Replace with actual batch ID
const SESSION_ID = '6836d9a7781e475dde0620a8'; // Replace with actual session ID
const AUTH_TOKEN = 'your-auth-token-here'; // Replace with actual token

// Test data
const TEST_VIDEO_DATA = {
  base64String: 'data:video/mp4;base64,VGVzdCB2aWRlbyBkYXRhIC0gdGhpcyBpcyBub3QgYSByZWFsIHZpZGVv', // Dummy data
  title: 'Test Recorded Lesson',
  recorded_date: new Date().toISOString(),
  metadata: {
    fileName: 'test_lesson.mp4',
    originalSize: 1024000,
    encodedSize: 1365333,
    mimeType: 'video/mp4',
    uploadedAt: new Date().toISOString()
  }
};

async function testUploadRecordedLesson() {
  console.log('🚀 Testing Upload Recorded Lesson API...\n');
  
  try {
    // Test 1: Basic upload
    console.log('📤 Test 1: Basic upload with valid data');
    const response = await axios.post(
      `${API_BASE_URL}/batches/${BATCH_ID}/schedule/${SESSION_ID}/upload-recorded-lesson`,
      TEST_VIDEO_DATA,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 seconds
      }
    );
    
    console.log('✅ Upload Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 202) {
      console.log('🔄 Upload accepted for background processing');
    } else if (response.status === 200) {
      console.log('✨ Upload completed immediately');
    }
    
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔐 Authentication issue - check your token');
    } else if (error.response?.status === 403) {
      console.log('🚫 Permission issue - check user roles');
    } else if (error.response?.status === 404) {
      console.log('🔍 Endpoint not found - check batch/session IDs');
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Missing required fields
  console.log('📤 Test 2: Missing required fields (should fail)');
  try {
    const invalidData = {
      // Missing base64String and title
      recorded_date: new Date().toISOString()
    };
    
    await axios.post(
      `${API_BASE_URL}/batches/${BATCH_ID}/schedule/${SESSION_ID}/upload-recorded-lesson`,
      invalidData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      }
    );
    
    console.log('❌ Test should have failed but didn\'t');
  } catch (error) {
    console.log('✅ Validation error caught as expected:', error.response?.data?.message || error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Invalid authentication
  console.log('📤 Test 3: Invalid authentication (should fail)');
  try {
    await axios.post(
      `${API_BASE_URL}/batches/${BATCH_ID}/schedule/${SESSION_ID}/upload-recorded-lesson`,
      TEST_VIDEO_DATA,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token'
        }
      }
    );
    
    console.log('❌ Test should have failed but didn\'t');
  } catch (error) {
    console.log('✅ Authentication error caught as expected:', error.response?.status);
  }
  
  console.log('\n🎉 API tests completed!');
}

// Helper function to create a real base64 video (for actual testing)
function createTestVideoBase64() {
  // This would normally read a real video file
  // For testing, we'll use dummy data
  const dummyVideoData = Buffer.from('RIFF....WAVEfmt ').toString('base64');
  return `data:video/mp4;base64,${dummyVideoData}`;
}

// Instructions for running the test
console.log(`
📋 Setup Instructions:
1. Update BATCH_ID with a real batch ID from your database
2. Update SESSION_ID with a real session ID from that batch
3. Update AUTH_TOKEN with a valid authentication token
4. Ensure your API server is running on ${API_BASE_URL}
5. Run: node test-upload-recorded-lesson.js

🔧 Configuration:
- API Base URL: ${API_BASE_URL}
- Batch ID: ${BATCH_ID}
- Session ID: ${SESSION_ID}
- Auth Token: ${AUTH_TOKEN ? 'Set' : 'Not Set'}

`);

// Run the test if this file is executed directly
if (require.main === module) {
  if (AUTH_TOKEN === 'your-auth-token-here') {
    console.log('⚠️  Please update the AUTH_TOKEN before running tests');
    process.exit(1);
  }
  
  testUploadRecordedLesson();
}

module.exports = { testUploadRecordedLesson };
