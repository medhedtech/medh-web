import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// API endpoints for currency exchange rate services
const EXCHANGE_RATE_ENDPOINTS = [
  'https://open.er-api.com/v6/latest/USD',
  'https://api.exchangerate.host/latest?base=USD',
];

/**
 * GET handler for currency exchange rates proxy
 * Fetches exchange rates data from multiple services with fallback
 */
export async function GET(request: NextRequest) {
  let errorMessages: string[] = [];
  const searchParams = request.nextUrl.searchParams;
  const baseCurrency = searchParams.get('base') || 'USD';
  
  // Try each endpoint sequentially until one succeeds
  for (const baseEndpoint of EXCHANGE_RATE_ENDPOINTS) {
    try {
      // Create the URL with the right base currency
      const endpoint = baseEndpoint.includes('?') 
        ? baseEndpoint.replace('USD', baseCurrency)
        : baseEndpoint.replace('/USD', `/${baseCurrency}`);
        
      // Prepare the request options
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Use short cache time to ensure fresh data
        next: { revalidate: 3600 } // 1 hour
      };
      
      // Make the request
      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Process the response
      const data = await response.json();
      
      // Format the response to have a consistent structure regardless of the API
      const formattedResponse = {
        base: baseCurrency,
        rates: data.rates || {},
        timestamp: data.time_last_update_unix || Math.floor(Date.now() / 1000),
        provider: new URL(endpoint).hostname
      };
      
      // Return the formatted response
      return NextResponse.json(formattedResponse, {
        headers: {
          'Cache-Control': 'public, max-age=3600', // 1 hour cache
        }
      });
    } catch (error) {
      // Store error and try next endpoint
      const errorMessage = error instanceof Error ? error.message : String(error);
      errorMessages.push(`${baseEndpoint}: ${errorMessage}`);
      continue;
    }
  }
  
  // If all endpoints failed, return error with details
  return NextResponse.json(
    { 
      error: 'Failed to fetch exchange rates',
      details: errorMessages 
    },
    { status: 500 }
  );
}

// Configure response caching
export const config = {
  runtime: 'edge',
}; 