// Test script to verify API configuration
const testApiConfig = () => {
  console.log('🧪 Testing API Configuration...');
  
  // Simulate different environments
  const environments = [
    { NODE_ENV: 'development', hostname: 'localhost', expected: 'http://localhost:8080/api/v1' },
    { NODE_ENV: 'development', hostname: '127.0.0.1', expected: 'http://localhost:8080/api/v1' },
    { NODE_ENV: 'production', hostname: 'medh.co', expected: 'https://api.medh.co' },
    { NODE_ENV: 'production', hostname: 'www.medh.co', expected: 'https://api.medh.co' },
  ];

  console.log('\n📋 Environment Tests:');
  environments.forEach((env, index) => {
    console.log(`\n${index + 1}. ${env.NODE_ENV} on ${env.hostname}:`);
    console.log(`   Expected: ${env.expected}`);
    
    // Simulate the logic from config.ts
    let apiUrl;
    
    // Check for explicit API URL
    if (process.env.NEXT_PUBLIC_API_URL) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log(`   Using explicit NEXT_PUBLIC_API_URL: ${apiUrl}`);
    } else if (env.NODE_ENV === 'production') {
      apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co';
      console.log(`   Using production URL: ${apiUrl}`);
    } else if (env.NODE_ENV === 'test') {
      apiUrl = process.env.NEXT_PUBLIC_API_URL_TEST || 'https://api.medh.co';
      console.log(`   Using test URL: ${apiUrl}`);
    } else {
      // Development
      if (env.hostname === 'localhost' || env.hostname === '127.0.0.1') {
        apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8080/api/v1';
        console.log(`   Using development localhost URL: ${apiUrl}`);
      } else {
        apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'https://api.medh.co';
        console.log(`   Using development non-localhost URL: ${apiUrl}`);
      }
    }
    
    const isCorrect = apiUrl === env.expected;
    console.log(`   Result: ${isCorrect ? '✅ PASS' : '❌ FAIL'} (got: ${apiUrl})`);
  });

  console.log('\n🔧 Current Environment Variables:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL_PROD:', process.env.NEXT_PUBLIC_API_URL_PROD || 'Not set');
  console.log('  - NEXT_PUBLIC_API_URL_DEV:', process.env.NEXT_PUBLIC_API_URL_DEV || 'Not set');
  
  console.log('\n📝 Recommendations:');
  console.log('1. For development: Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1');
  console.log('2. For production: Set NEXT_PUBLIC_API_URL=https://api.medh.co in your deployment environment');
  console.log('3. For testing: The configuration should automatically detect the environment');
};

testApiConfig();
