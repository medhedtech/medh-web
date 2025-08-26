const axios = require('axios');

async function testStudentsAPI() {
  try {
    console.log('Testing Students API...');
    
    // Test the students API endpoint
    const response = await axios.get('http://localhost:5000/api/students/get?limit=1000&page=1');
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      const students = response.data.data.items;
      console.log(`\n✅ Success! Found ${students.length} students`);
      
      // Display first few students for verification
      console.log('\nFirst 3 students:');
      students.slice(0, 3).forEach((student, index) => {
        console.log(`${index + 1}. ${student.full_name} - ${student.email} - ${student.course_name}`);
      });
      
      if (students.length > 3) {
        console.log(`... and ${students.length - 3} more students`);
      }
    } else {
      console.log('❌ API returned success: false');
    }
    
  } catch (error) {
    console.error('❌ Error testing Students API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testStudentsAPI();


