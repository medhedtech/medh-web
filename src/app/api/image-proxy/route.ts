import { NextRequest, NextResponse } from 'next/server';

// Cache for failed URLs to prevent repeated requests
const failedUrlCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return true;
  }
  
  clientData.count++;
  return false;
}

function isUrlCachedAsFailed(url: string): boolean {
  const failTime = failedUrlCache.get(url);
  if (!failTime) return false;
  
  const now = Date.now();
  if (now - failTime > CACHE_DURATION) {
    failedUrlCache.delete(url);
    return false;
  }
  
  return true;
}

function cacheFailedUrl(url: string): void {
  failedUrlCache.set(url, Date.now());
}

async function fetchWithRetry(url: string, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds per attempt
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
          'User-Agent': 'MEDH-ImageProxy/1.0',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.name === 'AbortError' && attempt < maxRetries) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
      }
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error('Unknown fetch error');
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }
    
    // Check if URL is cached as failed
    if (isUrlCachedAsFailed(imageUrl)) {
      return NextResponse.json(
        { error: 'Image recently failed to load' },
        { status: 404 }
      );
    }
    
    // Validate and decode URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL encoding' },
        { status: 400 }
      );
    }
    
    // Validate URL format
    let url: URL;
    try {
      url = new URL(decodedUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Enhanced security: Only allow S3 URLs from our buckets
    const allowedHosts = [
      'medhdocuments.s3.amazonaws.com',
      'medhdocuments.s3.ap-south-1.amazonaws.com',
      'medh-documents.s3.amazonaws.com',
    ];
    
    const isAllowedHost = allowedHosts.some(host => 
      url.hostname === host || url.hostname.endsWith('.' + host)
    );
    
    if (!isAllowedHost) {
      return NextResponse.json(
        { error: 'URL not allowed. Only MEDH S3 buckets are supported.' },
        { status: 403 }
      );
    }
    
    // Validate file extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const hasValidExtension = validExtensions.some(ext => 
      url.pathname.toLowerCase().includes(ext)
    );
    
    if (!hasValidExtension) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }
    
    // Fetch the image with retry logic
    let response: Response;
    try {
      response = await fetchWithRetry(decodedUrl);
    } catch (error) {
      // Cache failed URL
      cacheFailedUrl(imageUrl);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return NextResponse.json(
            { error: 'Request timeout' },
            { status: 504 }
          );
        }
        
        // Log error for debugging (development only)
        if (process.env.NODE_ENV === 'development') {
          console.error('Image proxy fetch error:', error.message);
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch image from source' },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
      // Cache failed URL
      cacheFailedUrl(imageUrl);
      
      // Handle specific S3 errors
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Access denied to image' },
          { status: 403 }
        );
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }
    
    // Validate content type
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      cacheFailedUrl(imageUrl);
      return NextResponse.json(
        { error: 'Response is not an image' },
        { status: 400 }
      );
    }
    
    // Get content length for size validation
    const contentLength = response.headers.get('content-length');
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        { error: 'Image too large (max 10MB)' },
        { status: 413 }
      );
    }
    
    // Stream the image
    let imageBuffer: ArrayBuffer;
    try {
      imageBuffer = await response.arrayBuffer();
      
      // Double-check size after download
      if (imageBuffer.byteLength > maxSize) {
        return NextResponse.json(
          { error: 'Image too large (max 10MB)' },
          { status: 413 }
        );
      }
    } catch (error) {
      cacheFailedUrl(imageUrl);
      return NextResponse.json(
        { error: 'Failed to process image data' },
        { status: 502 }
      );
    }
    
    // Return the image with optimized headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Proxy-Cache': 'MISS',
        'Vary': 'Accept-Encoding',
      },
    });
    
  } catch (error) {
    // Log error for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Image proxy error:', error);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
} 