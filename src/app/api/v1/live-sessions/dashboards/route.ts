import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
/**
 * GET handler to fetch dashboards
 * @param request - The incoming request
 * @returns JSON response with dashboards data or error
 */
export async function GET(request: NextRequest) {
  try {
    const BASE_URL = apiBaseUrl;
    
    // Fetch dashboards data from backend
    const response = await fetch(`${BASE_URL}/live-classes/dashboards`, {
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
          error: errorData.message || 'Failed to fetch dashboards data',
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
