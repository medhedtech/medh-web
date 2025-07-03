# Upload Recorded Lesson API - Complete Implementation Guide

## 🎯 Overview

This guide documents the complete implementation of the Upload Recorded Lesson API endpoint, which allows instructors and administrators to upload video recordings directly to specific batch sessions with automatic processing and integration.

## 📋 API Endpoint Details

### Endpoint Structure
```
POST /api/v1/batches/{batchId}/schedule/{sessionId}/upload-recorded-lesson
```

### URL Parameters
- `batchId`: MongoDB ObjectId of the target batch (e.g., `6836d9a7781e475dde0620a7`)
- `sessionId`: MongoDB ObjectId of the scheduled session (e.g., `6836d9a7781e475dde0620a8`)

### Authentication & Authorization
- **Authentication**: Required (Bearer token)
- **Authorization**: Admin, Instructor, or Super-admin roles
- **Validation**: Includes batch and session validation middleware

## 🔧 Frontend Implementation

### Enhanced API Method
Added new method to `src/apis/batch.ts`:

```typescript
uploadAndAddRecordedLesson: async (
  batchId: string,
  sessionId: string,
  uploadData: {
    base64String: string;
    title: string;
    recorded_date?: string;
    metadata?: {
      fileName: string;
      originalSize: number;
      encodedSize: number;
      mimeType: string;
      uploadedAt: string;
    };
  }
): Promise<IApiResponse<{ 
  success: boolean; 
  status: string;
  message: string;
  data: {
    videoId: string;
    uploadStatus: string;
    batchId: string;
    sessionId: string;
    title: string;
    url?: string;
    processingJobId?: string;
  };
}>>
```

### Updated Component Integration
Enhanced `OnlineClassManagementPage.tsx` with:

1. **Improved Error Handling**: Better error messages and permission checks
2. **Enhanced Upload Flow**: Streamlined upload process with progress tracking
3. **Type Safety**: Proper TypeScript types for all responses
4. **User Feedback**: Clear success/error messages with toast notifications

## 📤 Request Format

### Request Body
```json
{
  "base64String": "data:video/mp4;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEA...",
  "title": "Physics Lesson 1 - Introduction to Motion",
  "recorded_date": "2025-01-15T10:30:00.000Z",
  "metadata": {
    "fileName": "physics_lesson_1.mp4",
    "originalSize": 52428800,
    "encodedSize": 69905066,
    "mimeType": "video/mp4",
    "uploadedAt": "2025-01-15T10:35:00.000Z"
  }
}
```

### Required Fields
- `base64String`: Base64 encoded video data with MIME type prefix
- `title`: Descriptive title for the recorded lesson

### Optional Fields
- `recorded_date`: ISO string timestamp (defaults to current time)
- `metadata`: Additional file information for tracking

## 📥 Response Format

### Success Response (202 Accepted)
```json
{
  "success": true,
  "status": "uploading",
  "message": "Video upload initiated successfully",
  "data": {
    "videoId": "vid_67890abcdef12345",
    "uploadStatus": "in_progress",
    "batchId": "6836d9a7781e475dde0620a7",
    "sessionId": "6836d9a7781e475dde0620a8",
    "title": "Physics Lesson 1 - Introduction to Motion",
    "processingJobId": "job_xyz789"
  }
}
```

### Success Response (200 OK - Immediate)
```json
{
  "success": true,
  "status": "completed",
  "message": "Video uploaded and processed successfully",
  "data": {
    "videoId": "vid_67890abcdef12345",
    "uploadStatus": "completed",
    "batchId": "6836d9a7781e475dde0620a7",
    "sessionId": "6836d9a7781e475dde0620a8",
    "title": "Physics Lesson 1 - Introduction to Motion",
    "url": "https://d1234567890.cloudfront.net/videos/batch123/lesson456.mp4"
  }
}
```

## ⚡ Key Features

### 1. Asynchronous Processing
- **Background Upload**: Large files are processed in the background
- **Immediate Response**: Returns 202 Accepted for async operations
- **Progress Tracking**: Real-time upload progress with status updates

### 2. Enhanced Security
- **Role-based Access**: Strict permission validation
- **Token Validation**: Secure authentication with Bearer tokens
- **Input Validation**: Comprehensive validation of all inputs

### 3. File Management
- **CloudFront Integration**: Automatic CDN distribution
- **S3 Storage**: Organized storage in `videos/{batchId}/` folders
- **Metadata Tracking**: Complete file information preservation

### 4. Error Handling
- **Comprehensive Errors**: Detailed error messages for debugging
- **CORS Support**: Proper CORS error detection and handling
- **Permission Errors**: Clear permission-related error messages

## 🛠️ Usage Examples

### Basic Upload
```typescript
try {
  const result = await batchAPI.uploadAndAddRecordedLesson(
    "6836d9a7781e475dde0620a7",
    "6836d9a7781e475dde0620a8",
    {
      base64String: "data:video/mp4;base64,UklGRnoGAABXQVZFZm10...",
      title: "Advanced Mathematics - Calculus Introduction",
      recorded_date: new Date().toISOString()
    }
  );
  
  console.log("Upload initiated:", result.data);
} catch (error) {
  console.error("Upload failed:", error.message);
}
```

### With Metadata
```typescript
const uploadData = {
  base64String: base64VideoData,
  title: "Physics Lab Session 3",
  recorded_date: "2025-01-15T14:00:00.000Z",
  metadata: {
    fileName: "physics_lab_3.mp4",
    originalSize: file.size,
    encodedSize: encodedData.encodedSize,
    mimeType: file.type,
    uploadedAt: new Date().toISOString()
  }
};

const result = await batchAPI.uploadAndAddRecordedLesson(
  batchId,
  sessionId,
  uploadData
);
```

## 🔍 Error Scenarios

### Common Errors
1. **Authentication Error (401)**
   ```json
   {
     "success": false,
     "message": "Authentication token is missing or invalid"
   }
   ```

2. **Permission Error (403)**
   ```json
   {
     "success": false,
     "message": "Insufficient permissions. Required roles: admin, instructor, super_admin"
   }
   ```

3. **Validation Error (400)**
   ```json
   {
     "success": false,
     "message": "Invalid batch ID or session ID provided"
   }
   ```

4. **File Too Large (413)**
   ```json
   {
     "success": false,
     "message": "File size exceeds maximum allowed limit"
   }
   ```

## 🎯 Best Practices

### 1. File Validation
```typescript
// Validate file before upload
const validation = validateVideoFile(file);
if (!validation.isValid) {
  throw new Error(validation.errors.join(', '));
}
```

### 2. Progress Tracking
```typescript
// Track upload progress
setUploadProgress(75); // During encoding
setUploadProgress(90); // During upload
setUploadProgress(100); // On completion
```

### 3. Error Handling
```typescript
try {
  await uploadRecordedLesson(data);
} catch (error) {
  if (error.response?.status === 403) {
    // Handle permission errors
    showPermissionError();
  } else if (error.response?.status === 413) {
    // Handle file size errors
    showFileSizeError();
  } else {
    // Handle general errors
    showGenericError(error.message);
  }
}
```

## 🚀 Integration Steps

### 1. Backend Setup
Ensure the backend endpoint is deployed with:
- Proper authentication middleware
- File upload handling
- S3 and CloudFront configuration
- Background processing setup

### 2. Frontend Integration
The frontend is already integrated with:
- File validation utilities
- Base64 encoding helpers
- Progress tracking components
- Error handling systems

### 3. Testing
Test with:
- Different file sizes (small, medium, large)
- Various video formats (MP4, MOV, WebM)
- Different user roles (admin, instructor, super_admin)
- Network conditions (slow, fast, intermittent)

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Upload success rate
- Average upload time
- File size distribution
- Error frequency by type
- User engagement with recorded lessons

### Logging
The implementation includes comprehensive logging for:
- Upload initiation
- Progress tracking
- Error conditions
- Success completion
- Background processing status

## 🔄 Related Endpoints

- `GET /api/v1/batches/{batchId}/schedule/{sessionId}/recorded-lessons` - List recorded lessons
- `POST /api/v1/batches/{batchId}/schedule/{sessionId}/recorded-lessons` - Add lesson metadata only
- `DELETE /api/v1/batches/{batchId}/schedule/{sessionId}/recorded-lessons/{lessonId}` - Remove lesson

## 📝 Conclusion

The Upload Recorded Lesson API provides a robust, scalable solution for video upload and management within the batch education system. With comprehensive error handling, asynchronous processing, and seamless frontend integration, it delivers a professional-grade user experience for educators and administrators.

For any issues or questions, refer to the error handling documentation or contact the development team.
