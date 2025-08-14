// Test script to verify session update functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1';

async function testSessionUpdate() {
  try {
    console.log('🧪 Testing Session Update Functionality...\n');

    // 1. Get current latest session
    console.log('1️⃣ Getting current latest session...');
    const currentSession = await axios.get(`${BASE_URL}/live-classes/sessions/previous`);
    console.log('Current latest session:', {
      title: currentSession.data.data.sessionTitle,
      sessionNo: currentSession.data.data.sessionNo,
      grade: currentSession.data.data.grades[0],
      student: currentSession.data.data.students[0]?.full_name,
      instructor: currentSession.data.data.instructorId?.full_name
    });

    // 2. Create a new test session
    console.log('\n2️⃣ Creating new test session...');
    const newSessionData = {
      sessionTitle: `Test Session ${Date.now()}`,
      sessionNo: `TEST-${Date.now()}`,
      students: ['6736488a7af9992ef5d6e4cc'],
      grades: ['grade-3-5'],
      dashboard: 'student-dashboard',
      instructorId: '673c72304a9b0b144d4159a7',
      date: '2025-08-13',
      remarks: 'Test session for update verification',
      summary: {
        title: 'Test Summary',
        description: 'Test description',
        items: []
      }
    };

    const createResponse = await axios.post(`${BASE_URL}/live-classes/sessions`, newSessionData);
    console.log('✅ New session created:', createResponse.data);

    // 3. Wait a moment for the session to be saved
    console.log('\n3️⃣ Waiting for session to be saved...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Get the updated latest session
    console.log('\n4️⃣ Getting updated latest session...');
    const updatedSession = await axios.get(`${BASE_URL}/live-classes/sessions/previous`);
    console.log('Updated latest session:', {
      title: updatedSession.data.data.sessionTitle,
      sessionNo: updatedSession.data.data.sessionNo,
      grade: updatedSession.data.data.grades[0],
      student: updatedSession.data.data.students[0]?.full_name,
      instructor: updatedSession.data.data.instructorId?.full_name
    });

    // 5. Verify the update
    console.log('\n5️⃣ Verifying update...');
    if (updatedSession.data.data.sessionTitle === newSessionData.sessionTitle) {
      console.log('✅ SUCCESS: Latest session was updated correctly!');
    } else {
      console.log('❌ FAILED: Latest session was not updated correctly!');
      console.log('Expected:', newSessionData.sessionTitle);
      console.log('Got:', updatedSession.data.data.sessionTitle);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testSessionUpdate();
