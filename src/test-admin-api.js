// Test script for Admin API endpoints
// Run with: node src/test-admin-api.js

import axios from 'axios';

// Configuration
const BASE_URL = 'http://localhost:3000/api'; // Adjust if your API runs on different port
const CREDENTIALS = {
  email: 'superadmin@medh.co',
  password: 'Admin@123'
};

// Test results storage
const testResults = [];

// Helper function to format table
function formatTable(data, title) {
  if (!data || data.length === 0) {
    return `\n${title}\n${'='.repeat(title.length)}\nNo data available\n`;
  }

  const headers = Object.keys(data[0]);
  const maxLengths = headers.map(header => {
    const maxLength = Math.max(
      header.length,
      ...data.map(row => String(row[header] || '').length)
    );
    return Math.min(maxLength, 30); // Cap at 30 characters
  });

  let table = `\n${title}\n${'='.repeat(title.length)}\n`;
  
  // Header
  table += '| ' + headers.map((header, i) => 
    header.padEnd(maxLengths[i])
  ).join(' | ') + ' |\n';
  
  // Separator
  table += '| ' + headers.map((_, i) => 
    '-'.repeat(maxLengths[i])
  ).join(' | ') + ' |\n';
  
  // Data rows
  data.slice(0, 10).forEach(row => { // Show first 10 rows
    table += '| ' + headers.map((header, i) => {
      const value = String(row[header] || '');
      return value.length > maxLengths[i] 
        ? value.substring(0, maxLengths[i] - 3) + '...'
        : value.padEnd(maxLengths[i]);
    }).join(' | ') + ' |\n';
  });

  if (data.length > 10) {
    table += `\n... showing first 10 of ${data.length} records\n`;
  }

  return table;
}

// Helper function to test API endpoint
async function testEndpoint(name, method, url, data = null) {
  try {
    console.log(`\n🔄 Testing: ${name}`);
    console.log(`   ${method.toUpperCase()} ${url}`);
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${global.authToken}`
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    const result = {
      name,
      method,
      url,
      status: response.status,
      success: true,
      data: response.data,
      count: response.data?.data?.length || response.data?.count || 0
    };

    testResults.push(result);
    
    console.log(`   ✅ Success (${response.status}) - ${result.count} items`);
    
    // Display table if we have array data
    if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      console.log(formatTable(response.data.data, `${name} Results`));
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(formatTable(response.data, `${name} Results`));
    } else {
      console.log(`   📊 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
    }

    return result;
  } catch (error) {
    const result = {
      name,
      method,
      url,
      status: error.response?.status || 'Network Error',
      success: false,
      error: error.response?.data?.message || error.message,
      data: null,
      count: 0
    };

    testResults.push(result);
    console.log(`   ❌ Failed (${result.status}): ${result.error}`);
    return result;
  }
}

// Authentication function
async function authenticate() {
  try {
    console.log('🔐 Authenticating...');
    const response = await axios.post(`${BASE_URL}/auth/login`, CREDENTIALS);
    
    if (response.data.success && response.data.data?.token) {
      global.authToken = response.data.data.token;
      console.log('✅ Authentication successful');
      return true;
    } else {
      console.log('❌ Authentication failed: No token received');
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Admin API Tests');
  console.log('='.repeat(50));

  // Step 1: Authenticate
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Step 2: Test all endpoints
  const tests = [
    // Auth endpoints
    { name: 'Get All Users', method: 'get', url: '/auth/users' },
    { name: 'Get Locked Accounts', method: 'get', url: '/auth/locked-accounts' },
    { name: 'Get Lockout Stats', method: 'get', url: '/auth/lockout-stats' },
    
    // Batch endpoints
    { name: 'Get All Batches', method: 'get', url: '/batches' },
    { name: 'Get Batch Analytics Dashboard', method: 'get', url: '/batches/analytics/dashboard' },
    { name: 'Get Batch Status Distribution', method: 'get', url: '/batches/analytics/status-distribution' },
    { name: 'Get Instructor Workload', method: 'get', url: '/batches/analytics/instructor-workload' },
    { name: 'Get Capacity Analytics', method: 'get', url: '/batches/analytics/capacity' },
    
    // Announcement endpoints
    { name: 'Get All Announcements', method: 'get', url: '/announcements' },
    { name: 'Get Announcement Analytics', method: 'get', url: '/announcements/analytics' },
    
    // Form endpoints
    { name: 'Get All Forms', method: 'get', url: '/forms' },
    { name: 'Get Form Submissions', method: 'get', url: '/forms/submissions' },
    
    // Course endpoints
    { name: 'Get All Courses', method: 'get', url: '/courses' },
    
    // Profile endpoints
    { name: 'Get Admin Progress Stats', method: 'get', url: '/profile/admin/progress-stats' },
  ];

  for (const test of tests) {
    await testEndpoint(test.name, test.method, test.url);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }

  // Step 3: Generate summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const successful = testResults.filter(r => r.success);
  const failed = testResults.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${testResults.length}`);
  console.log(`❌ Failed: ${failed.length}/${testResults.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    failed.forEach(test => {
      console.log(`   - ${test.name}: ${test.status} - ${test.error}`);
    });
  }

  console.log('\n📈 Data Summary:');
  successful.forEach(test => {
    if (test.count > 0) {
      console.log(`   - ${test.name}: ${test.count} items`);
    }
  });

  return testResults;
}

// Run the tests
if (require.main === module) {
  runAllTests()
    .then(results => {
      console.log('\n🎉 Test run completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test run failed:', error);
      process.exit(1);
    });
}

export { runAllTests, testEndpoint, authenticate }; 