import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API documentation route
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    services: [
      {
        name: 'ipapi',
        description: 'Proxy for IP geolocation services',
        usage: '/api/proxy/ipapi',
      }
    ],
    version: '1.0.0'
  });
} 