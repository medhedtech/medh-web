import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * GET handler to fetch a specific session by ID
 * @param request - The incoming request
 * @param params - Route parameters containing session ID
 * @returns JSON response with session data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const BASE_URL = apiBaseUrl;
    
    // Fetch session data from backend
    const response = await fetch(`${BASE_URL}/live-classes/sessions/${sessionId}`, {
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
          error: errorData.message || 'Failed to fetch session data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching session:', error);
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
 * PUT handler to update a specific session
 * @param request - The incoming request
 * @param params - Route parameters containing session ID
 * @returns JSON response with updated session data or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    
    const BASE_URL = apiBaseUrl;
    
    // Update session in backend
    const response = await fetch(`${BASE_URL}/live-classes/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
          error: errorData.message || 'Failed to update session',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating session:', error);
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
 * DELETE handler to delete a specific session
 * @param request - The incoming request
 * @param params - Route parameters containing session ID
 * @returns JSON response with deletion status or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
    const BASE_URL = apiBaseUrl;
    
    // Delete session in backend
    const response = await fetch(`${BASE_URL}/live-classes/sessions/${sessionId}`, {
      method: 'DELETE',
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
          error: errorData.message || 'Failed to delete session',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}


