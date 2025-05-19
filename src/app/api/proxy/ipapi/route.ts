import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { z } from 'zod';

// Define response schema for validation
const IPAPISchema = z.object({
  country_code: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
});

/**
 * IP geolocation API proxy to avoid CORS issues
 * This fetches data from external IP API and returns country information
 */
export async function GET(request: NextRequest) {
  try {
    // Try multiple IP APIs for redundancy
    const ipApis = [
      { url: 'https://ipapi.co/json/', timeout: 3000 },
      { url: 'https://api.ipify.org?format=json', timeout: 3000, transform: true },
      { url: 'https://ipinfo.io/json', timeout: 3000 },
    ];
    
    let countryData = null;
    let error = null;
    
    // Try each API until we get a successful response
    for (const api of ipApis) {
      try {
        const response = await axios.get(api.url, { timeout: api.timeout });
        
        // For ipify, we need to get the IP first, then query another API
        if (api.transform && response.data && response.data.ip) {
          const ipAddress = response.data.ip;
          const locationResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`, { timeout: 3000 });
          countryData = locationResponse.data;
        } else {
          countryData = response.data;
        }
        
        // Validate response data
        const validationResult = IPAPISchema.safeParse(countryData);
        
        if (validationResult.success) {
          // Extract country code from response
          const countryCode = 
            countryData.country_code || 
            countryData.countryCode || 
            countryData.country ||
            'US'; // Default to US if no country code found
            
          return NextResponse.json({
            country_code: countryCode,
            country: countryCode,
            countryCode: countryCode
          });
        }
      } catch (apiError) {
        error = apiError;
        // Continue to next API
        continue;
      }
    }
    
    // If we get here, all APIs failed
    throw error || new Error('All IP APIs failed');
  } catch (error) {
    console.error('IP API proxy error:', error instanceof Error ? error.message : String(error));
    
    // Return default data
    return NextResponse.json({
      country_code: 'US',
      country: 'US',
      countryCode: 'US',
      source: 'fallback'
    }, { status: 200 });
  }
} 