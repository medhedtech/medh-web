import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * GET handler to fetch live sessions with filtering and pagination
 * @param request - The incoming request
 * @returns JSON response with sessions data or error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCategory = searchParams.get('courseCategory');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const BASE_URL = apiBaseUrl;
    
    console.log('Next.js API Route - BASE_URL:', BASE_URL);
    console.log('Next.js API Route - Request URL:', request.url);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (courseCategory) params.append('courseCategory', courseCategory);
    params.append('page', page);
    params.append('limit', limit);
    
    // Fetch sessions data from backend
    const backendUrl = `${BASE_URL}/live-classes/sessions?${params}`;
    console.log('Next.js API Route - Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });
    
    console.log('Next.js API Route - Response status:', response.status);

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to fetch sessions data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new live session
 * @param request - The incoming request
 * @returns JSON response with created session data or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const BASE_URL = apiBaseUrl;
    
    // Create session in backend
    const response = await fetch(`${BASE_URL}/live-classes/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to create session',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
