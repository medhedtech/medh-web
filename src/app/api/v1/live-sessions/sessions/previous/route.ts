import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * GET handler to fetch the previous session for a course category
 * @param request - The incoming request
 * @returns JSON response with previous session data or error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCategory = searchParams.get('courseCategory');

    if (!courseCategory) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Course category is required' 
        },
        { status: 400 }
      );
    }

    const BASE_URL = apiBaseUrl;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('courseCategory', courseCategory);
    
    // Fetch previous session data from backend
    const response = await fetch(`${BASE_URL}/live-classes/sessions/previous?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to fetch previous session data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching previous session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}


