import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic functionality
    const testUrl = 'https://medhdocuments.s3.amazonaws.com/test.jpg';
    const startTime = Date.now();
    
    // Simple connectivity test (don't actually fetch)
    const response = await fetch(testUrl, {
      method: 'HEAD', // Only get headers
      signal: AbortSignal.timeout(3000), // 3 second timeout
    }).catch(() => null);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      s3Connectivity: response ? 'ok' : 'degraded',
      version: '1.0.0',
      features: [
        'rate-limiting',
        'retry-logic', 
        'failed-url-caching',
        'size-validation',
        'cors-support'
      ]
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  }
} 