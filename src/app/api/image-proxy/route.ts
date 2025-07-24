import { NextRequest, NextResponse } from 'next/server';

// Enhanced cache for failed URLs with TTL
const failedUrlCache = new Map<string, { timestamp: number; retryAfter: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRY_DELAY = 30 * 60 * 1000; // 30 minutes max

// Enhanced rate limiting with IP-based tracking
const rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>();
const RATE_LIMIT = 200; // Increased for production
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes block

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);
  
  // Check if client is currently blocked
  if (clientData?.blocked && now < clientData.resetTime) {
    return true;
  }
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false 
    });
    return false;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    // Block the client for extended period
    clientData.blocked = true;
    clientData.resetTime = now + RATE_LIMIT_BLOCK_DURATION;
    return true;
  }
  
  clientData.count++;
  return false;
}

function isUrlCachedAsFailed(url: string): { isFailed: boolean; retryAfter?: number } {
  const failData = failedUrlCache.get(url);
  if (!failData) return { isFailed: false };
  
  const now = Date.now();
  const timeSinceFailure = now - failData.timestamp;
  
  // Progressive retry delays: 5min, 15min, 30min
  if (timeSinceFailure > failData.retryAfter) {
    failedUrlCache.delete(url);
    return { isFailed: false };
  }
  
  return { 
    isFailed: true, 
    retryAfter: Math.ceil((failData.retryAfter - timeSinceFailure) / 1000) 
  };
}

function cacheFailedUrl(url: string): void {
  const existing = failedUrlCache.get(url);
  const retryAfter = existing 
    ? Math.min(existing.retryAfter * 2, MAX_RETRY_DELAY) // Exponential backoff
    : CACHE_DURATION;
    
  failedUrlCache.set(url, {
    timestamp: Date.now(),
    retryAfter
  });
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*,*/*;q=0.8',
          'User-Agent': 'MEDH-ImageProxy/2.0 (+https://medh.co)',
          'Cache-Control': 'no-cache',
          'Accept-Encoding': 'gzip, deflate, br',
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
          // Wait before retry with jittered exponential backoff
          const baseDelay = Math.pow(2, attempt) * 1000;
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
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

// Enhanced URL validation
function validateImageUrl(url: string): { isValid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Protocol validation
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'Only HTTP/HTTPS protocols allowed' };
    }
    
    // Enhanced host validation
    const allowedHosts = [
      'medhdocuments.s3.amazonaws.com',
      'medhdocuments.s3.ap-south-1.amazonaws.com',
      'medh-documents.s3.amazonaws.com',
      // Add production CDN domains if needed
      'cdn.medh.co',
      'assets.medh.co'
    ];
    
    const isAllowedHost = allowedHosts.some(host => 
      parsedUrl.hostname === host || parsedUrl.hostname.endsWith('.' + host)
    );
    
    if (!isAllowedHost) {
      return { isValid: false, error: 'Host not allowed' };
    }
    
    // File extension validation
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];
    const hasValidExtension = validExtensions.some(ext => 
      parsedUrl.pathname.toLowerCase().includes(ext)
    );
    
    if (!hasValidExtension) {
      return { isValid: false, error: 'Invalid file type' };
    }
    
    return { isValid: true };
    
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Enhanced client IP detection
    const clientIP = request.headers.get('cf-connecting-ip') || // Cloudflare
                    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                    request.headers.get('x-real-ip') || 
                    request.headers.get('x-client-ip') ||
                    'unknown';
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: 300 // 5 minutes
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '300',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Decode and validate URL
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL encoding' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Enhanced URL validation
    const validation = validateImageUrl(decodedUrl);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid URL' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Check if URL is cached as failed
    const failCheck = isUrlCachedAsFailed(imageUrl);
    if (failCheck.isFailed) {
      return NextResponse.json(
        { 
          error: 'Image recently failed to load',
          retryAfter: failCheck.retryAfter 
        },
        { 
          status: 404,
          headers: {
            'Retry-After': failCheck.retryAfter?.toString() || '300',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    // Fetch the image with enhanced retry logic
    let response: Response;
    try {
      response = await fetchWithRetry(decodedUrl);
    } catch (error) {
      // Cache failed URL with progressive backoff
      cacheFailedUrl(imageUrl);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return NextResponse.json(
            { error: 'Request timeout' },
            { status: 504, headers: { 'Access-Control-Allow-Origin': '*' } }
          );
        }
        
        // Enhanced error logging for production debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('Image proxy fetch error:', {
            url: decodedUrl,
            error: error.message,
            stack: error.stack
          });
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch image from source' },
        { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    if (!response.ok) {
      // Cache failed URL
      cacheFailedUrl(imageUrl);
      
      // Enhanced S3 error handling
      const errorBody = await response.text().catch(() => '');
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Access denied to image' },
          { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
      
      return NextResponse.json(
        { 
          error: `Failed to fetch image: ${response.statusText}`,
          details: process.env.NODE_ENV === 'development' ? errorBody : undefined
        },
        { 
          status: response.status >= 500 ? 502 : response.status,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }
    
    // Enhanced content type validation
    const contentType = response.headers.get('content-type') || '';
    const validContentTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
      'image/gif', 'image/svg+xml', 'image/avif'
    ];
    
    if (!validContentTypes.some(type => contentType.startsWith(type))) {
      cacheFailedUrl(imageUrl);
      return NextResponse.json(
        { error: 'Response is not a valid image type' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Enhanced size validation
    const contentLength = response.headers.get('content-length');
    const maxSize = 15 * 1024 * 1024; // 15MB limit for high-res images
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        { error: 'Image too large (max 15MB)' },
        { status: 413, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Stream the image with size check
    let imageBuffer: ArrayBuffer;
    try {
      imageBuffer = await response.arrayBuffer();
      
      // Double-check size after download
      if (imageBuffer.byteLength > maxSize) {
        return NextResponse.json(
          { error: 'Image too large (max 15MB)' },
          { status: 413, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
    } catch (error) {
      cacheFailedUrl(imageUrl);
      return NextResponse.json(
        { error: 'Failed to process image data' },
        { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    
    // Enhanced response headers for production
    const responseHeaders = new Headers({
      'Content-Type': contentType,
      'Content-Length': imageBuffer.byteLength.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Proxy-Cache': 'MISS',
      'X-Proxy-Version': '2.0',
      'Vary': 'Accept-Encoding, Origin',
    });
    
    // Add ETag for better caching
    const etag = `"${Buffer.from(imageBuffer.slice(0, 1024)).toString('base64').slice(0, 16)}"`;
    responseHeaders.set('ETag', etag);
    
    // Check if client has cached version
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: responseHeaders
      });
    }
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: responseHeaders,
    });
    
  } catch (error) {
    // Enhanced error logging for production
    if (process.env.NODE_ENV === 'development') {
      console.error('Image proxy error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

// Enhanced OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, X-Requested-With, If-None-Match',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    },
  });
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'X-Proxy-Status': 'healthy',
      'X-Proxy-Version': '2.0'
    }
  });
} 