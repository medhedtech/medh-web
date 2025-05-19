import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API documentation route
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    services: [
      {
        name: 'exchange-rates',
        description: 'Proxy for currency exchange rates',
        usage: '/api/proxy/exchange-rates?base=USD',
      },
      {
        name: 'ipapi',
        description: 'Proxy for IP geolocation services',
        usage: '/api/proxy/ipapi',
      }
    ],
    version: '1.0.0'
  });
} 