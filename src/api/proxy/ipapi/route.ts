import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// API endpoints for IP geolocation services
const IP_API_ENDPOINTS = [
  'https://ipapi.co/json/',
  'https://ipinfo.io/json',
  'https://api.ipdata.co',
];

/**
 * GET handler for IP geolocation proxy
 * Fetches location data from multiple services with fallback
 */
export async function GET(request: NextRequest) {
  let errorMessages: string[] = [];
  
  // Try each endpoint sequentially until one succeeds
  for (const endpoint of IP_API_ENDPOINTS) {
    try {
      // Prepare the request options
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      };
      
      // Add API key for services that require it
      if (endpoint.includes('ipdata.co') && process.env.IPDATA_API_KEY) {
        const url = `${endpoint}?api-key=${process.env.IPDATA_API_KEY}`;
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
      }
      
      // For services that don't require API key
      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // Store error and try next endpoint
      const errorMessage = error instanceof Error ? error.message : String(error);
      errorMessages.push(`${endpoint}: ${errorMessage}`);
      continue;
    }
  }
  
  // If all endpoints failed, return error with details
  return NextResponse.json(
    { 
      error: 'Failed to fetch IP location data',
      details: errorMessages,
      // Provide a fallback country code for the client
      country: 'US' 
    },
    { status: 500 }
  );
}

// Configure response caching
export const config = {
  runtime: 'edge',
}; 