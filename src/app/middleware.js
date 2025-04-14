// middleware.js
import { NextResponse } from "next/server";
import { protectedRoutes } from "./protectedRoutes";

// Helper to check if the user is authenticated (works with custom JWT)
async function isAuthenticated(req) {
  // Use only our custom token implementation
  const customToken = req.cookies.get("token")?.value;
  return !!customToken;
}

// Security headers for better performance and security
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://www.google-analytics.com;
    media-src 'self';
    frame-src 'self';
  `.replace(/\s{2,}/g, ' ').trim(),
  // Cache control for static assets
  'Cache-Control': 'public, max-age=31536000, immutable',
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
};

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === "/login" || path === "/signup" || path === "/forgot-password";
  const isPublicPage = !protectedRoutes.some((route) => path.startsWith(route));
  const isAuthenticated_ = await isAuthenticated(request);

  // Handle authentication redirects
  if (isLoginPage && isAuthenticated_) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPage && !isAuthenticated_) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // Apply security headers and performance optimizations
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add special caching for static assets
  if (
    path.includes('/_next/static') || 
    path.includes('/images/') || 
    path.endsWith('.jpg') || 
    path.endsWith('.png') || 
    path.endsWith('.svg') || 
    path.endsWith('.webp') || 
    path.endsWith('.css') || 
    path.endsWith('.js')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Enable early hints for faster loading
  response.headers.set('Link', '</fonts/inter.woff2>; rel=preload; as=font; crossorigin=anonymous');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     * 5. /robots.txt (SEO file)
     * 6. /sitemap.xml (SEO file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};