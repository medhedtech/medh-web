// Debug script to check API configuration
console.log('🔍 API Configuration Debug');
console.log('========================');

// Check environment variables
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('- NEXT_PUBLIC_API_URL_PROD:', process.env.NEXT_PUBLIC_API_URL_PROD);
console.log('- NEXT_PUBLIC_API_URL_DEV:', process.env.NEXT_PUBLIC_API_URL_DEV);

// Import the API config
const { apiConfig } = require('./src/config/api.ts');

console.log('\n📡 API Configuration:');
console.log('- API URL:', apiConfig.apiUrl);
console.log('- Timeout:', apiConfig.timeout);
console.log('- With Credentials:', apiConfig.withCredentials);

// Test backend connectivity
async function testBackendConnection() {
  console.log('\n🧪 Testing Backend Connection...');
  
  try {
    const response = await fetch(`${apiConfig.apiUrl}/admin/dashboard-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    console.log('- Response Status:', response.status);
    console.log('- Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('- Response Data Structure:', Object.keys(data));
      console.log('- Has Data:', !!data.data);
      console.log('- Success:', data.success);
    } else {
      console.log('- Error Response:', await response.text());
    }
  } catch (error) {
    console.log('- Connection Error:', error.message);
  }
}

// Run the test
testBackendConnection();

