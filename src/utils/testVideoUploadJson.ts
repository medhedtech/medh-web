/**
 * Test JSON Mode Video Upload
 * Simple test utility to verify the JSON upload functionality
 */

import { videoStreamingAPI } from '../apis/video-streaming';
import { convertBlobToBase64, testBase64Encoding } from './videoUploadUtils';

/**
 * Test JSON mode upload with a small file
 * @returns Test results
 */
export const testJsonModeUpload = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('🧪 Starting JSON mode upload test...');
    
    // Step 1: Test base64 encoding/decoding
    console.log('📝 Testing base64 encoding...');
    const encodingTest = await testBase64Encoding();
    if (!encodingTest.success) {
      return {
        success: false,
        message: 'Base64 encoding test failed',
        details: encodingTest
      };
    }
    console.log('✅ Base64 encoding test passed');
    
    // Step 2: Create a small test video file (simulated)
    const testVideoContent = 'This is a test video file content. 🎬📹🎭';
    const testBlob = new Blob([testVideoContent], { type: 'video/mp4' });
    const testFile = new File([testBlob], 'test-video.mp4', { type: 'video/mp4' });
    
    console.log(`📹 Created test file: ${testFile.name} (${testFile.size} bytes)`);
    
    // Step 3: Test chunk conversion to base64
    console.log('🔄 Testing chunk to base64 conversion...');
    const base64Result = await convertBlobToBase64(testFile);
    
    console.log('✅ Chunk conversion successful:', {
      originalSize: base64Result.originalSize,
      encodedSize: base64Result.encodedSize,
      mimeType: base64Result.mimeType,
      base64Preview: base64Result.base64Data.substring(0, 50) + '...'
    });
    
    // Step 4: Test video upload initialization (without actually calling backend)
    const initData = {
      fileName: testFile.name,
      fileSize: testFile.size,
      contentType: testFile.type,
      chunkSize: testFile.size, // Use full file as one chunk for test
      metadata: {
        courseId: 'test-course',
        description: 'JSON mode upload test'
      }
    };
    
    console.log('📤 Test initialization data prepared:', initData);
    
    // Step 5: Prepare JSON chunk payload (what would be sent to backend)
    const jsonChunkPayload = {
      uploadSession: { 
        uploadId: 'test-upload-123', 
        videoId: 'test-video-456',
        testMode: true 
      },
      partNumber: 1,
      chunkData: base64Result.base64Data,
      originalSize: base64Result.originalSize,
      encodedSize: base64Result.encodedSize,
      mimeType: base64Result.mimeType,
      checksum: ''
    };
    
    console.log('📦 JSON chunk payload prepared:', {
      uploadSession: jsonChunkPayload.uploadSession,
      partNumber: jsonChunkPayload.partNumber,
      originalSize: jsonChunkPayload.originalSize,
      encodedSize: jsonChunkPayload.encodedSize,
      mimeType: jsonChunkPayload.mimeType,
      base64DataLength: jsonChunkPayload.chunkData.length
    });
    
    return {
      success: true,
      message: 'JSON mode upload test completed successfully! 🎉',
      details: {
        encodingTest,
        testFile: {
          name: testFile.name,
          size: testFile.size,
          type: testFile.type
        },
        base64Result: {
          originalSize: base64Result.originalSize,
          encodedSize: base64Result.encodedSize,
          mimeType: base64Result.mimeType,
          compressionRatio: (base64Result.encodedSize / base64Result.originalSize).toFixed(2)
        },
        jsonPayloadSize: JSON.stringify(jsonChunkPayload).length,
        readyForBackend: true
      }
    };
    
  } catch (error: any) {
    console.error('❌ JSON mode upload test failed:', error);
    return {
      success: false,
      message: `JSON mode upload test failed: ${error.message}`,
      details: { error }
    };
  }
};

/**
 * Quick console test function
 */
export const runJsonModeTest = async (): Promise<void> => {
  console.group('🎬 Video Upload JSON Mode Test');
  
  const result = await testJsonModeUpload();
  
  if (result.success) {
    console.log('🎉 SUCCESS:', result.message);
    console.log('📊 Test Details:', result.details);
  } else {
    console.error('❌ FAILED:', result.message);
    console.error('📊 Error Details:', result.details);
  }
  
  console.groupEnd();
};

// Auto-run test in browser environment
if (typeof window !== 'undefined') {
  // Run test after a short delay to ensure everything is loaded
  setTimeout(() => {
    runJsonModeTest();
  }, 1000);
}

export default {
  testJsonModeUpload,
  runJsonModeTest
}; 