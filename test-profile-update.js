// Test script to check profile update functionality
const testProfileUpdate = async () => {
  console.log('🧪 Testing Profile Update API...');
  
  // Test API configuration
  console.log('\n📋 API Configuration Test:');
  
  // Simulate different environments
  const testCases = [
    {
      name: 'Development (localhost)',
      env: { NODE_ENV: 'development', hostname: 'localhost' },
      expected: 'http://localhost:8080/api/v1'
    },
    {
      name: 'Production',
      env: { NODE_ENV: 'production', hostname: 'medh.co' },
      expected: 'https://api.medh.co'
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}:`);
    
    // Simulate the API configuration logic
    let apiUrl;
    
    if (process.env.NEXT_PUBLIC_API_URL) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log(`   Using explicit NEXT_PUBLIC_API_URL: ${apiUrl}`);
    } else if (testCase.env.NODE_ENV === 'production') {
      apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co';
      console.log(`   Using production URL: ${apiUrl}`);
    } else {
      if (testCase.env.hostname === 'localhost' || testCase.env.hostname === '127.0.0.1') {
        apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8080/api/v1';
        console.log(`   Using development localhost URL: ${apiUrl}`);
      } else {
        apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'https://api.medh.co';
        console.log(`   Using development non-localhost URL: ${apiUrl}`);
      }
    }
    
    const isCorrect = apiUrl === testCase.expected;
    console.log(`   Result: ${isCorrect ? '✅ PASS' : '❌ FAIL'} (got: ${apiUrl})`);
  });

  // Test profile update endpoint
  console.log('\n🔗 Profile Update Endpoint Test:');
  const endpoints = [
    '/profile/me/comprehensive',  // PATCH - Partial update (used by frontend)
    '/profile/me/comprehensive',  // PUT - Full update
    '/auth/profile'               // Alternative endpoint
  ];

  endpoints.forEach((endpoint, index) => {
    console.log(`${index + 1}. ${endpoint}`);
  });

  // Test data structure
  console.log('\n📦 Profile Update Data Structure Test:');
  const sampleUpdateData = {
    full_name: 'Test User',
    bio: 'Test bio',
    age: 25,
    phone_numbers: [{
      country: 'IN',
      number: '9876543210'
    }],
    meta: {
      education_level: 'Bachelor',
      institution_name: 'Test University',
      field_of_study: 'Computer Science',
      graduation_year: 2023
    }
  };

  console.log('Sample update data structure:');
  console.log(JSON.stringify(sampleUpdateData, null, 2));

  // Environment variables check
  console.log('\n🔧 Environment Variables Check:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL_PROD:', process.env.NEXT_PUBLIC_API_URL_PROD || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL_DEV:', process.env.NEXT_PUBLIC_API_URL_DEV || 'Not set');

  console.log('\n📝 Recommendations:');
  console.log('1. For development: Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1');
  console.log('2. For production: Set NEXT_PUBLIC_API_URL=https://api.medh.co in your deployment environment');
  console.log('3. Verify the profile edit form uses the PATCH /profile/me/comprehensive endpoint');
  console.log('4. Check browser console for any CORS or authentication errors');
  console.log('5. Ensure the backend is running and accessible');
};

testProfileUpdate();
