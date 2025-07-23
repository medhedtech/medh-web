# Image Proxy API Documentation

## Overview

The Image Proxy API provides a secure, reliable way to serve images from MEDH's S3 buckets with enhanced error handling, caching, and performance optimizations.

## Endpoints

### GET /api/image-proxy

Proxies image requests from MEDH S3 buckets with fallback handling and security validation.

#### Parameters

- `url` (required): URL-encoded S3 image URL to proxy

#### Example Request

```bash
GET /api/image-proxy?url=https%3A%2F%2Fmedhdocuments.s3.amazonaws.com%2Fimages%2Fexample.jpg
```

#### Response

**Success (200):**
- Returns the image binary data with appropriate headers
- Content-Type: image/jpeg, image/png, etc.
- Cache-Control: public, max-age=31536000, immutable

**Error Responses:**
- `400`: Invalid URL or file type
- `403`: Access denied or URL not allowed
- `404`: Image not found or recently failed
- `413`: Image too large (>10MB)
- `429`: Rate limit exceeded
- `502`: Failed to fetch from source
- `504`: Request timeout

### GET /api/image-proxy/health

Health check endpoint for monitoring API status.

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-01-24T12:00:00.000Z",
  "responseTime": "150ms",
  "s3Connectivity": "ok",
  "version": "1.0.0",
  "features": [
    "rate-limiting",
    "retry-logic",
    "failed-url-caching",
    "size-validation",
    "cors-support"
  ]
}
```

## Features

### 🚀 Performance Optimizations

1. **Failed URL Caching**: URLs that fail are cached for 5 minutes to prevent repeated requests
2. **Retry Logic**: Up to 3 attempts with exponential backoff (1s, 2s, 4s)
3. **Timeout Management**: 8-second timeout per attempt
4. **Content Validation**: Validates content type and file size

### 🔒 Security Features

1. **Domain Whitelist**: Only allows MEDH S3 bucket URLs
2. **File Type Validation**: Only allows image file extensions
3. **Size Limits**: Maximum 10MB per image
4. **Rate Limiting**: 100 requests per minute per IP
5. **CORS Protection**: Proper CORS headers and security headers

### 🛡️ Error Handling

1. **Graceful Degradation**: Returns appropriate error codes and messages
2. **Development Logging**: Detailed error logs in development mode only
3. **Production Safety**: Minimal error exposure in production
4. **Automatic Recovery**: Failed URL cache expires automatically

### 📊 Rate Limiting

- **Limit**: 100 requests per minute per IP address
- **Window**: 60 seconds
- **Headers**: Returns rate limit information in response headers
- **Response**: 429 status with retry-after header when exceeded

## Usage in Components

### OptimizedImage Integration

The OptimizedImage component automatically uses the proxy as a fallback:

```typescript
// Automatic fallback chain:
// 1. Original S3 URL
// 2. Global S3 endpoint
// 3. Image proxy (/api/image-proxy?url=...)
// 4. Local placeholder
```

### Manual Usage

```typescript
const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(s3Url)}`;
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/api/image-proxy/health
```

### Metrics Available

- Response time to S3
- S3 connectivity status
- API version and features
- Timestamp for monitoring

## Error Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check URL format and file type |
| 403 | Forbidden | Verify S3 bucket permissions |
| 404 | Not Found | Image doesn't exist or recently failed |
| 413 | Too Large | Image exceeds 10MB limit |
| 429 | Rate Limited | Wait 60 seconds before retry |
| 502 | Bad Gateway | S3 service issue |
| 504 | Timeout | Network or S3 response timeout |

## Best Practices

1. **URL Encoding**: Always URL-encode the S3 URL parameter
2. **Error Handling**: Implement fallbacks in your components
3. **Caching**: Respect the cache headers for optimal performance
4. **Rate Limits**: Implement client-side rate limiting for bulk operations
5. **Monitoring**: Use the health endpoint for uptime monitoring

## Configuration

Environment variables (optional):
- `NODE_ENV`: Controls logging verbosity
- No additional configuration required

## Changelog

### Version 1.0.0
- Initial release with enhanced error handling
- Rate limiting implementation
- Failed URL caching
- Retry logic with exponential backoff
- Health check endpoint
- Comprehensive security validation
- CORS support
- Size validation (10MB limit)

## Support

For issues or questions about the Image Proxy API, please check:
1. Health endpoint status
2. Console logs in development mode
3. Network tab for request/response details
4. S3 bucket permissions and connectivity 