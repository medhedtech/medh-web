import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * POST handler to upload files for live sessions
 * @param request - The incoming request
 * @returns JSON response with uploaded file data or error
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const BASE_URL = apiBaseUrl;
    
    // Upload file to backend
    const response = await fetch(`${BASE_URL}/live-classes/files/upload`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: formData
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to upload file',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
