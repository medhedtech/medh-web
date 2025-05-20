import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { z } from 'zod';

// Define response schema for validation
const ExchangeRatesSchema = z.object({
  rates: z.record(z.number()),
  base: z.string().optional(),
  date: z.string().optional(),
  timestamp: z.number().optional(),
});

/**
 * Exchange rates API proxy to avoid CORS issues
 * This fetches data from external exchange rate API and returns it
 */
export async function GET(request: NextRequest) {
  try {
    // Get base currency from query params, default to USD
    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base') || 'USD';

    // Free API options (may need to be updated if they change/deprecate)
    // Option 1: ExchangeRate-API
    const exchangeRateApiUrl = `https://open.er-api.com/v6/latest/${base}`;

    // Fetch data with timeout to avoid hanging requests
    const response = await axios.get(exchangeRateApiUrl, { timeout: 5000 });
    
    // Validate response data
    const validationResult = ExchangeRatesSchema.safeParse(response.data);

    if (!validationResult.success) {
      console.error('Invalid exchange rate API response:', validationResult.error);
      
      // Return fallback data
      return NextResponse.json({
        rates: {
          USD: 1, EUR: 0.91, AED: 3.67, GBP: 0.78, INR: 83.18, 
          AUD: 1.52, CAD: 1.36, SGD: 1.34, NZD: 1.65, JPY: 150.12,
          CNY: 7.12, KRW: 1350.45, BRL: 5.23, MXN: 16.78, ZAR: 18.12, HKD: 7.81
        },
        base: base,
        source: 'fallback'
      }, { status: 200 });
    }

    // If API response doesn't include base, add it
    if (!response.data.base) {
      response.data.base = base;
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Exchange rates proxy error:', error instanceof Error ? error.message : String(error));
    
    // Return fallback data
    return NextResponse.json({
      rates: {
        USD: 1, EUR: 0.91, AED: 3.67, GBP: 0.78, INR: 83.18, 
        AUD: 1.52, CAD: 1.36, SGD: 1.34, NZD: 1.65, JPY: 150.12,
        CNY: 7.12, KRW: 1350.45, BRL: 5.23, MXN: 16.78, ZAR: 18.12, HKD: 7.81
      },
      base: base,
      source: 'fallback'
    }, { status: 200 });
  }
} 