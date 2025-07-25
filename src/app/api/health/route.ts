import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config/api';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'ok',
      apiBaseUrl,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 