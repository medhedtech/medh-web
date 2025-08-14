import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

async function testFrontendAPI() {
  try {
    console.log('🧪 Testing Frontend API Calls...\n');

    // Test 1: Check if Next.js server is running
    console.log('1. Testing Next.js server connectivity...');
    try {
      const response = await axios.get(`${BASE_URL}/live-sessions`);
      console.log('✅ Next.js server is running and accessible');
    } catch (error) {
      console.log('❌ Next.js server error:', error.response?.data || error.message);
      return;
    }

    // Test 2: Test getting students
    console.log('\n2. Testing get students...');
    try {
      const studentsResponse = await axios.get(`${BASE_URL}/live-sessions/students`);
      console.log('✅ Get students successful:', studentsResponse.data?.data?.items?.length || 0, 'students found');
    } catch (error) {
      console.log('❌ Get students failed:', error.response?.data || error.message);
    }

    // Test 3: Test getting grades
    console.log('\n3. Testing get grades...');
    try {
      const gradesResponse = await axios.get(`${BASE_URL}/live-sessions/grades`);
      console.log('✅ Get grades successful:', gradesResponse.data?.data?.length || 0, 'grades found');
    } catch (error) {
      console.log('❌ Get grades failed:', error.response?.data || error.message);
    }

    // Test 4: Test getting instructors
    console.log('\n4. Testing get instructors...');
    try {
      const instructorsResponse = await axios.get(`${BASE_URL}/live-sessions/instructors`);
      console.log('✅ Get instructors successful:', instructorsResponse.data?.data?.items?.length || 0, 'instructors found');
    } catch (error) {
      console.log('❌ Get instructors failed:', error.response?.data || error.message);
    }

    // Test 5: Test getting dashboards
    console.log('\n5. Testing get dashboards...');
    try {
      const dashboardsResponse = await axios.get(`${BASE_URL}/live-sessions/dashboards`);
      console.log('✅ Get dashboards successful:', dashboardsResponse.data?.data?.length || 0, 'dashboards found');
    } catch (error) {
      console.log('❌ Get dashboards failed:', error.response?.data || error.message);
    }

    // Test 6: Test getting sessions
    console.log('\n6. Testing get sessions...');
    try {
      const sessionsResponse = await axios.get(`${BASE_URL}/live-sessions`);
      console.log('✅ Get sessions successful:', sessionsResponse.data?.data?.items?.length || 0, 'sessions found');
    } catch (error) {
      console.log('❌ Get sessions failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendAPI();
