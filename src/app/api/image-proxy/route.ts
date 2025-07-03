import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }
    
    // Validate URL
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Only allow S3 URLs from our bucket
    const allowedHosts = [
      'medhdocuments.s3.amazonaws.com',
      'medhdocuments.s3.ap-south-1.amazonaws.com',
      'medh-documents.s3.amazonaws.com',
      's3.amazonaws.com',
      's3.ap-south-1.amazonaws.com'
    ];
    
    if (!allowedHosts.some(host => url.hostname.includes(host))) {
      return NextResponse.json(
        { error: 'URL not allowed' },
        { status: 403 }
      );
    }
    
    // Fetch the image from S3
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 seconds
    });
    
    if (!response.ok) {
      // If S3 returns 400, it might be due to missing or expired URL
      if (response.status === 400 || response.status === 403) {
        return NextResponse.json(
          { error: 'Image not accessible or expired' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get the content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Stream the image directly
    const imageBuffer = await response.arrayBuffer();
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'X-Content-Type-Options': 'nosniff',
      },
    });
    
  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 