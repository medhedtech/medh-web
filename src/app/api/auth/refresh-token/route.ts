import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

/**
 * External API URL - ideally this would come from an environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.medh.co/api/v1';

/**
 * Helper function to add CORS and security headers to responses
 */
function addResponseHeaders(response: NextResponse): NextResponse {
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, x-access-token, x-refresh-token');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Vary', 'Origin, Accept-Encoding');
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

/**
 * Handles token refresh requests
 * This endpoint proxies refresh token requests to the external API and handles errors
 */
export async function POST(request: NextRequest) {
  try {
    // Clone request to safely read the body multiple times if needed
    const requestClone = request.clone();
    
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '') || 
                        request.headers.get('x-access-token');
    
    // Extract refresh token from headers or body
    let refreshToken = request.headers.get('x-refresh-token');
    
    // If not in headers, try to get it from request body
    if (!refreshToken) {
      try {
        const body = await requestClone.json();
        refreshToken = body.refresh_token;
      } catch (e) {
        // Silent catch - body might not be JSON or might not have refresh_token
        console.warn('Failed to parse request body for refresh token:', e);
      }
    }
    
    // Basic validation
    if (!accessToken) {
      return addResponseHeaders(
        NextResponse.json(
          { error: 'No access token provided' },
          { status: 401 }
        )
      );
    }
    
    if (!refreshToken) {
      return addResponseHeaders(
        NextResponse.json(
          { error: 'No refresh token provided' },
          { status: 400 }
        )
      );
    }

    // Make request to actual API endpoint
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refresh_token: refreshToken },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-access-token': accessToken,
          'x-refresh-token': refreshToken
        },
        timeout: 10000
      }
    );

    // Return the response data directly with appropriate headers
    return addResponseHeaders(
      NextResponse.json(response.data)
    );
    
  } catch (error: any) {
    console.error('Token refresh failed:', {
      message: error?.message || 'Unknown error',
      status: error?.response?.status,
      data: error?.response?.data,
      url: `${API_BASE_URL}/auth/refresh-token`,
    });

    // Properly handle different error scenarios
    if (error?.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Token refresh failed';
      
      return addResponseHeaders(
        NextResponse.json(
          { error: errorMessage },
          { status: error.response.status || 500 }
        )
      );
    } else if (error?.request) {
      // The request was made but no response was received
      return addResponseHeaders(
        NextResponse.json(
          { error: 'No response from authentication server' },
          { status: 503 }
        )
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return addResponseHeaders(
        NextResponse.json(
          { error: 'Failed to process token refresh' },
          { status: 500 }
        )
      );
    }
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return addResponseHeaders(
    NextResponse.json({}, { status: 200 })
  );
} 