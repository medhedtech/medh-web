import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to fetch a student by ID
 * @param request - The incoming request
 * @param params - URL parameters including the student ID
 * @returns JSON response with student data or error
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

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1';
    
    // Fetch student data
    const response = await fetch(`${BASE_URL}/students/get/${params.id}`, {
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
          error: errorData.message || 'Failed to fetch student data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 