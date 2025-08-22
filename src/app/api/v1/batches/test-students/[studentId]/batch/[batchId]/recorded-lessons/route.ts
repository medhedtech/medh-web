import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrl } from '@/apis/config';

/**
 * GET handler to fetch recorded lessons for a specific student and batch
 * @param request - The incoming request
 * @param params - Route parameters containing student ID and batch ID
 * @returns JSON response with recorded lessons data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string; batchId: string } }
) {
  try {
    const { studentId, batchId } = params;
    
    if (!studentId || !batchId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Student ID and Batch ID are required' 
        },
        { status: 400 }
      );
    }

    const BASE_URL = apiBaseUrl;
    
    console.log('🔍 Fetching recorded lessons for student:', studentId, 'batch:', batchId);
    console.log('🌐 Using BASE_URL:', BASE_URL);
    
    // Fetch recorded lessons from backend
    const backendUrl = `${BASE_URL}/batches/test-students/${studentId}/batch/${batchId}/recorded-lessons`;
    console.log('🔗 Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log('📊 Backend response status:', response.status);

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend error:', errorData);
      
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to fetch batch recorded lessons',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    console.log('✅ Successfully fetched batch recorded lessons');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error fetching batch recorded lessons:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
