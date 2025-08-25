import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * POST handler to generate S3 presigned URL for video upload
 * @param request - The incoming request with batchObjectId, studentName, fileName, fileType
 * @returns JSON response with presigned URL and file path
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchObjectId, studentName, fileName, fileType } = body;

    // Validate required parameters
    if (!batchObjectId || !studentName || !fileName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: batchObjectId, studentName, fileName' 
        },
        { status: 400 }
      );
    }

    const BASE_URL = apiBaseUrl;
    
    // Generate presigned URL from backend
    const response = await fetch(`${BASE_URL}/live-classes/generate-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ batchObjectId, studentName, fileName, fileType })
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to generate upload URL',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

