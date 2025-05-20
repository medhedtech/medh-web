import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to fetch enrolled courses for a student by ID
 * @param request - The incoming request
 * @param params - URL parameters including the student ID
 * @returns JSON response with enrolled courses data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if ID is provided
    if (!params.id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Parse optional query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || '';

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1';
    
    // Construct URL with query parameters
    const url = new URL(`${BASE_URL}/enrolled/student/${params.id}`);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (status) {
      url.searchParams.append('status', status);
    }
    
    // Fetch enrolled courses data
    const response = await fetch(url.toString(), {
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
          error: errorData.message || 'Failed to fetch enrolled courses data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 