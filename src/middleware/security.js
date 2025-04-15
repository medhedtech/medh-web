/**
 * @license
 * Proprietary and confidential.
 * Copyright (c) 2025-2026 Medh. All rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import { NextResponse } from 'next/server';
import { securityConfig } from '@/config/security';

// Helper function to check if request is from allowed origin
const isAllowedOrigin = (origin) => {
  return securityConfig.cors.allowedOrigins.includes(origin) ||
    securityConfig.cors.allowedOrigins.includes('*');
};

// Helper function to generate nonce
const generateNonce = () => {
  return Buffer.from(crypto.randomBytes(16)).toString('base64');
};

// Middleware to handle security
export function middleware(request) {
  const response = NextResponse.next();
  const nonce = generateNonce();

  // 1. CORS Headers
  const origin = request.headers.get('origin');
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', securityConfig.cors.allowedMethods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', securityConfig.cors.allowedHeaders.join(', '));
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', securityConfig.cors.maxAge.toString());
  }

  // 2. Security Headers
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 3. Content Security Policy
  const cspDirectives = {
    ...securityConfig.csp.directives,
    scriptSrc: [
      ...securityConfig.csp.directives.scriptSrc,
      `'nonce-${nonce}'`
    ]
  };

  const cspString = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  response.headers.set('Content-Security-Policy', cspString);

  // 4. Check for basic security vulnerabilities
  const url = new URL(request.url);

  // Prevent directory traversal
  if (url.pathname.includes('..')) {
    return new NextResponse('Invalid path', { status: 400 });
  }

  // Block suspicious file extensions
  const suspiciousExtensions = ['.php', '.asp', '.aspx', '.jsp', '.cgi', '.exe'];
  if (suspiciousExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
    return new NextResponse('Invalid file type', { status: 400 });
  }

  // 5. Add security attributes to response
  response.headers.set('X-Nonce', nonce);

  // 6. Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // 7. Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 8. Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 9. Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 10. Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

// Configure which routes to apply the middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 