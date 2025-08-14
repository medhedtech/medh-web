import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to fetch students with search and pagination
 * @param request - The incoming request
 * @returns JSON response with students data or error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    // Fetch students data from backend
    const response = await fetch(`${BASE_URL}/students/get?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      // Include cookies for auth if necessary
      credentials: 'include',
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to fetch students data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching students:', error);
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
 * POST handler to create a new student
 * @param request - The incoming request
 * @returns JSON response with created student data or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1';
    
    // Create student in backend
    const response = await fetch(`${BASE_URL}/students/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to create student',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

