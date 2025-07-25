/**
 * Test Script: Session Refresh Functionality
 * Tests the new session management fix for invalidated upload sessions
 */

const { VideoUploadClient } = require('./src/apis/video-streaming');

async function testSessionRefresh() {
  console.log('🧪 Testing Session Refresh Functionality\n');

  // Mock file for testing
  const testFile = new File(['test content'], 'test-video.mp4', { 
    type: 'video/mp4' 
  });

  const testMetadata = {
    courseId: '6836d9a7781e475dde0620a7',
    lessonId: '6836d9a7781e475dde0620a8',
    description: 'Test session refresh functionality'
  };

  const client = new VideoUploadClient();

  // Add event listeners to track progress
  client.onStatusChange = (status) => {
    console.log(`📊 Status: ${status}`);
  };

  client.onProgress = (progress, uploaded, total) => {
    console.log(`📈 Progress: ${progress}% (${uploaded}/${total} chunks)`);
  };

  client.onError = (error, errorInfo) => {
    console.error('❌ Upload Error:', error.message);
    if (errorInfo) {
      console.error('📋 Error Info:', errorInfo);
    }
  };

  try {
    console.log('1️⃣ Initializing upload...');
    const { uploadId, videoId } = await client.initialize(testFile, testMetadata);
    console.log(`✅ Initialized: uploadId=${uploadId}, videoId=${videoId}\n`);

    console.log('2️⃣ Starting upload (with session refresh capability)...');
    const result = await client.upload(testFile);
    console.log(`🎉 Upload completed: videoId=${result.videoId}\n`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Show progress info even on failure
    const progress = client.getProgress();
    console.log('📊 Final Progress:', progress);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testSessionRefresh().catch(console.error);
}

module.exports = { testSessionRefresh }; 