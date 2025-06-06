/**
 * Course Image Upload Examples
 * 
 * This file demonstrates how to use the new course-specific image upload functions
 * with proper TypeScript typing and error handling.
 */

import { 
  uploadCourseImageBase64Async, 
  uploadCourseImageFileAsync,
  uploadCourseImageBase64WithData,
  uploadCourseImageFileWithData,
  ICourseImageUploadResponse,
  ICourseImageUploadError
} from './course';

// Example 1: Upload image using base64 string (RECOMMENDED)
export const uploadCourseImageExample = async (courseId: string, base64Image: string) => {
  try {
    const result = await uploadCourseImageBase64Async(courseId, base64Image, 'image');
    
    if (result.success) {
      const uploadResponse = result as ICourseImageUploadResponse;
      console.log('✅ Upload successful!');
      console.log('Image URL:', uploadResponse.data.imageUrl);
      console.log('Updated course:', uploadResponse.data.course);
      return uploadResponse;
    } else {
      const errorResponse = result as ICourseImageUploadError;
      console.error('❌ Upload failed:', errorResponse.message);
      console.error('Error details:', errorResponse.error.details);
      throw new Error(errorResponse.message);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    throw error;
  }
};

// Example 2: Upload image using file input (RECOMMENDED)
export const uploadCourseImageFileExample = async (courseId: string, imageFile: File) => {
  try {
    const result = await uploadCourseImageFileAsync(courseId, imageFile);
    
    if (result.success) {
      const uploadResponse = result as ICourseImageUploadResponse;
      console.log('✅ File upload successful!');
      console.log('Image URL:', uploadResponse.data.imageUrl);
      console.log('File size:', uploadResponse.data.size, 'bytes');
      return uploadResponse;
    } else {
      const errorResponse = result as ICourseImageUploadError;
      console.error('❌ File upload failed:', errorResponse.message);
      throw new Error(errorResponse.message);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    throw error;
  }
};

// Example 3: Using the data preparation functions for custom implementations
export const customUploadExample = async (courseId: string, base64Image: string) => {
  try {
    // Prepare the request data
    const { url, data } = uploadCourseImageBase64WithData(courseId, base64Image, 'image');
    
    // You can now use this with your own HTTP client
    console.log('Upload URL:', url);
    console.log('Request payload:', data);
    
    // Example with fetch API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Custom upload error:', error);
    throw error;
  }
};

// Example 4: File upload with custom implementation
export const customFileUploadExample = async (courseId: string, imageFile: File) => {
  try {
    // Prepare the FormData
    const { url, formData } = uploadCourseImageFileWithData(courseId, imageFile);
    
    // You can now use this with your own HTTP client
    console.log('Upload URL:', url);
    
    // Example with fetch API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
        // Note: Don't set Content-Type for FormData, let the browser set it
      },
      body: formData
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Custom file upload error:', error);
    throw error;
  }
};

// Example 5: React component usage
export const ReactComponentExample = () => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const courseId = 'your-course-id-here';
    
    try {
      const result = await uploadCourseImageFileAsync(courseId, file);
      
      if (result.success) {
        const response = result as ICourseImageUploadResponse;
        alert(`Image uploaded successfully! URL: ${response.data.imageUrl}`);
      } else {
        const error = result as ICourseImageUploadError;
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      alert('Unexpected error occurred');
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
      />
    </div>
  );
};

// Example 6: Base64 conversion from file
export const convertFileToBase64AndUpload = async (courseId: string, file: File) => {
  return new Promise<ICourseImageUploadResponse>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64String = reader.result as string;
        const result = await uploadCourseImageBase64Async(courseId, base64String, 'image');
        
        if (result.success) {
          resolve(result as ICourseImageUploadResponse);
        } else {
          reject(new Error((result as ICourseImageUploadError).message));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Example 7: Type guards for response checking
export const isUploadSuccess = (
  response: ICourseImageUploadResponse | ICourseImageUploadError
): response is ICourseImageUploadResponse => {
  return response.success === true;
};

export const isUploadError = (
  response: ICourseImageUploadResponse | ICourseImageUploadError
): response is ICourseImageUploadError => {
  return response.success === false;
};

// Example 8: Batch upload multiple images
export const batchUploadImages = async (
  courseId: string, 
  files: File[]
): Promise<ICourseImageUploadResponse[]> => {
  const uploadPromises = files.map(file => uploadCourseImageFileAsync(courseId, file));
  const results = await Promise.allSettled(uploadPromises);
  
  const successfulUploads: ICourseImageUploadResponse[] = [];
  const failedUploads: ICourseImageUploadError[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      if (isUploadSuccess(result.value)) {
        successfulUploads.push(result.value);
      } else {
        failedUploads.push(result.value);
      }
    } else {
      console.error(`Upload ${index} failed:`, result.reason);
    }
  });
  
  console.log(`✅ ${successfulUploads.length} uploads successful`);
  console.log(`❌ ${failedUploads.length} uploads failed`);
  
  return successfulUploads;
}; 