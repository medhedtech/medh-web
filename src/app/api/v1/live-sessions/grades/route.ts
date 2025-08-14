import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to fetch grades
 * @param request - The incoming request
 * @returns JSON response with grades data or error
 */
export async function GET(request: NextRequest) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    
    // Fetch grades data from backend
    const response = await fetch(`${BASE_URL}/live-classes/grades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to fetch grades data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
