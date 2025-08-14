import { NextRequest, NextResponse } from 'next/server';

/**
 * POST handler to upload multiple video files
 * @param request - The incoming request with FormData containing video files
 * @returns JSON response with uploaded video URLs or error
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('videos') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No video files provided' 
        },
        { status: 400 }
      );
    }

    // Validate files on frontend
    const allowedTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi', 'video/mkv'];
    const maxSize = 500 * 1024 * 1024; // 500MB
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { 
            success: false,
            error: `Invalid file type: ${file.name}. Only MP4, MOV, WebM, AVI, MKV files are allowed` 
          },
          { status: 400 }
        );
      }
      
      if (file.size > maxSize) {
        return NextResponse.json(
          { 
            success: false,
            error: `File too large: ${file.name}. Maximum size is 500MB` 
          },
          { status: 400 }
        );
      }
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    
    // Create new FormData for backend
    const backendFormData = new FormData();
    files.forEach(file => {
      backendFormData.append('videos', file);
    });
    
    // Upload to backend
    const response = await fetch(`${BASE_URL}/live-classes/upload-videos`, {
      method: 'POST',
      body: backendFormData,
      credentials: 'include',
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to upload videos',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading videos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
