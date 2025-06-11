# Course Image Upload TypeScript API Guide

This guide covers the new TypeScript API functions for uploading course images with the RESTful endpoint pattern `/courses/{courseId}/upload-image`.

## 🎯 Overview

The new course image upload system provides:
- **RESTful Design**: Course-specific endpoints following `/courses/{courseId}/upload-image`
- **Automatic Course Update**: Uploads image and updates course record in one operation
- **Full TypeScript Support**: Complete type safety with interfaces and error handling
- **Multiple Upload Methods**: Base64 and file upload support
- **Comprehensive Error Handling**: Detailed error responses with proper typing

## 📦 Available Functions

### 1. **Recommended Async Functions**

#### `uploadCourseImageBase64Async()`
```typescript
const uploadCourseImageBase64Async = async (
  courseId: string,
  base64String: string,
  fileType: string = 'image'
): Promise<ICourseImageUploadResponse | ICourseImageUploadError>
```

**Usage:**
```typescript
import { uploadCourseImageBase64Async } from '@/apis/course/course';

const result = await uploadCourseImageBase64Async(
  'course-id-123',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
  'image'
);

if (result.success) {
  console.log('Image URL:', result.data.imageUrl);
  console.log('Updated course:', result.data.course);
}
```

#### `uploadCourseImageFileAsync()`
```typescript
const uploadCourseImageFileAsync = async (
  courseId: string,
  imageFile: File
): Promise<ICourseImageUploadResponse | ICourseImageUploadError>
```

**Usage:**
```typescript
import { uploadCourseImageFileAsync } from '@/apis/course/course';

const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const result = await uploadCourseImageFileAsync('course-id-123', file);
  
  if (result.success) {
    console.log('Upload successful!', result.data.imageUrl);
  }
}
```

### 2. **URL Builder Functions**

#### `uploadCourseImageBase64()`
```typescript
const uploadCourseImageBase64 = (id: string): string
```

Returns the endpoint URL for base64 uploads:
```typescript
const url = uploadCourseImageBase64('course-id-123');
// Returns: "https://api.example.com/courses/course-id-123/upload-image"
```

#### `uploadCourseImageFile()`
```typescript
const uploadCourseImageFile = (id: string): string
```

Returns the endpoint URL for file uploads:
```typescript
const url = uploadCourseImageFile('course-id-123');
// Returns: "https://api.example.com/courses/course-id-123/upload-image-file"
```

### 3. **Data Preparation Functions**

#### `uploadCourseImageBase64WithData()`
```typescript
const uploadCourseImageBase64WithData = (
  courseId: string,
  base64String: string,
  fileType: string = 'image'
): { url: string; data: { base64String: string; fileType: string } }
```

#### `uploadCourseImageFileWithData()`
```typescript
const uploadCourseImageFileWithData = (
  courseId: string,
  imageFile: File
): { url: string; formData: FormData }
```

## 🔧 TypeScript Interfaces

### `ICourseImageUploadResponse`
```typescript
interface ICourseImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    courseId: string;
    imageUrl: string;
    key: string;
    size: number;
    course: {
      id: string;
      title: string;
      image: string;
      [key: string]: any;
    };
  };
  timestamp: string;
}
```

### `ICourseImageUploadError`
```typescript
interface ICourseImageUploadError {
  success: false;
  message: string;
  error: {
    code: string;
    details: string[];
  };
  timestamp: string;
}
```

### `ICourseImageUploadRequest`
```typescript
interface ICourseImageUploadRequest {
  base64String: string;
  fileType: string;
}
```

## 🚀 Usage Examples

### React Component Example
```typescript
import React, { useState } from 'react';
import { uploadCourseImageFileAsync, ICourseImageUploadResponse } from '@/apis/course/course';

const CourseImageUploader: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadCourseImageFileAsync(courseId, file);
      
      if (result.success) {
        const response = result as ICourseImageUploadResponse;
        setImageUrl(response.data.imageUrl);
        alert('Image uploaded successfully!');
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      alert('Unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Course" style={{ maxWidth: '200px' }} />}
    </div>
  );
};
```

### Base64 Upload Example
```typescript
import { uploadCourseImageBase64Async } from '@/apis/course/course';

const uploadBase64Image = async (courseId: string, base64Data: string) => {
  try {
    const result = await uploadCourseImageBase64Async(courseId, base64Data, 'image');
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log('New image URL:', result.data.imageUrl);
      console.log('Course updated:', result.data.course);
      return result.data.imageUrl;
    } else {
      console.error('❌ Upload failed:', result.message);
      console.error('Error details:', result.error.details);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    throw error;
  }
};
```

### Custom HTTP Client Example
```typescript
import { uploadCourseImageBase64WithData } from '@/apis/course/course';

const customUpload = async (courseId: string, base64Image: string) => {
  const { url, data } = uploadCourseImageBase64WithData(courseId, base64Image, 'image');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};
```

### Type Guards Example
```typescript
import { 
  uploadCourseImageBase64Async,
  ICourseImageUploadResponse,
  ICourseImageUploadError
} from '@/apis/course/course';

// Type guard functions
const isUploadSuccess = (
  response: ICourseImageUploadResponse | ICourseImageUploadError
): response is ICourseImageUploadResponse => {
  return response.success === true;
};

const isUploadError = (
  response: ICourseImageUploadResponse | ICourseImageUploadError
): response is ICourseImageUploadError => {
  return response.success === false;
};

// Usage with type guards
const handleUpload = async (courseId: string, base64Image: string) => {
  const result = await uploadCourseImageBase64Async(courseId, base64Image);
  
  if (isUploadSuccess(result)) {
    // TypeScript knows this is ICourseImageUploadResponse
    console.log('Success! Image URL:', result.data.imageUrl);
    console.log('Course info:', result.data.course);
  } else if (isUploadError(result)) {
    // TypeScript knows this is ICourseImageUploadError
    console.error('Error code:', result.error.code);
    console.error('Error details:', result.error.details);
  }
};
```

## 🔄 Migration from Legacy Functions

### Before (Legacy)
```typescript
// Old way - deprecated
const url = updateCourseThumbnailBase64('course-id-123');
// Manual HTTP request needed
```

### After (New)
```typescript
// New way - recommended
const result = await uploadCourseImageBase64Async(
  'course-id-123',
  base64String,
  'image'
);
// Automatic course update included
```

## 🛡️ Error Handling

### Comprehensive Error Handling
```typescript
import { 
  uploadCourseImageFileAsync,
  ICourseImageUploadResponse,
  ICourseImageUploadError
} from '@/apis/course/course';

const safeUpload = async (courseId: string, file: File) => {
  try {
    const result = await uploadCourseImageFileAsync(courseId, file);
    
    if (result.success) {
      const response = result as ICourseImageUploadResponse;
      return {
        success: true,
        imageUrl: response.data.imageUrl,
        course: response.data.course
      };
    } else {
      const error = result as ICourseImageUploadError;
      return {
        success: false,
        message: error.message,
        code: error.error.code,
        details: error.error.details
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

## 📝 Best Practices

1. **Use Async Functions**: Prefer `uploadCourseImageBase64Async()` and `uploadCourseImageFileAsync()` for complete functionality
2. **Handle Both Success and Error Cases**: Always check the `success` property
3. **Use Type Guards**: Implement type guards for better TypeScript support
4. **Validate Inputs**: Check courseId and file/base64 data before uploading
5. **Show Loading States**: Provide user feedback during upload operations
6. **Handle Network Errors**: Wrap calls in try-catch blocks

## 🔗 Related Files

- **Main API File**: `src/apis/course/course.ts`
- **Examples File**: `src/apis/course/course-image-upload-examples.ts`
- **Type Definitions**: Included in the main course API file

## 🎉 Benefits

- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Automatic Updates**: Course record updated automatically
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **RESTful Design**: Clean, predictable URL structure
- ✅ **Multiple Methods**: Support for both base64 and file uploads
- ✅ **Backward Compatible**: Legacy functions still available (deprecated) 