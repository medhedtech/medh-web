// Test script to check profile update functionality
const testProfileUpdate = async () => {
  console.log('🧪 Testing Profile Update API...');
  
  // Test data
  const testData = {
    full_name: 'Test User Updated',
    bio: 'This is a test bio update',
    meta: {
      occupation: 'Software Developer',
      company: 'Test Company'
    }
  };
  
  try {
    // Test the API endpoint directly
    const response = await fetch('http://localhost:8080/api/v1/profile/me/comprehensive', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('📦 Response Data:', data);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testProfileUpdate();
