import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrl } from '@/apis/config';

/**
 * GET handler to fetch student's latest session
 * @param request - The incoming request
 * @param params - Route parameters containing student ID
 * @returns JSON response with latest session data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    
    if (!studentId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Student ID is required' 
        },
        { status: 400 }
      );
    }

    const BASE_URL = apiBaseUrl;
    
    console.log('🔍 Next.js API Route - Fetching latest session for student:', studentId);
    console.log('🌐 Using BASE_URL:', BASE_URL);
    
    // Fetch student's latest session from backend
    const backendUrl = `${BASE_URL}/live-classes/students/${studentId}/latest-session`;
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
          error: errorData.message || 'Failed to fetch student latest session',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    console.log('✅ Successfully fetched latest session data');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error fetching student latest session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
