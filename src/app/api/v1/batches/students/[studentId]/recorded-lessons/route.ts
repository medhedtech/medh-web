import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrl } from '@/apis/config';

/**
 * GET handler to fetch recorded lessons for a student
 * @param request - The incoming request
 * @param params - Route parameters containing student ID
 * @returns JSON response with recorded lessons data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    
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
    
    console.log('🔍 Fetching recorded lessons for student:', studentId);
    console.log('🌐 Using BASE_URL:', BASE_URL);
    
    // Extract authentication headers from the request
    const authHeader = request.headers.get('authorization');
    const accessToken = request.headers.get('x-access-token');
    
    console.log('🔐 Auth header present:', !!authHeader);
    console.log('🔑 Access token present:', !!accessToken);
    console.log('🔐 Auth header value:', authHeader ? authHeader.substring(0, 20) + '...' : 'null');
    console.log('🔑 Access token value:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
    
    // Log all headers for debugging
    console.log('📋 All request headers:', Object.fromEntries(request.headers.entries()));
    
    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authentication headers if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    if (accessToken) {
      headers['x-access-token'] = accessToken;
    }
    
    // Fetch recorded lessons from backend
    const backendUrl = `${BASE_URL}/batches/students/${studentId}/recorded-lessons`;
    console.log('🔗 Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
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
          error: errorData.message || 'Failed to fetch recorded lessons',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    console.log('✅ Successfully fetched recorded lessons');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error fetching recorded lessons:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
