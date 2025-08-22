# API Configuration Guide

## Overview

The project now uses a centralized API configuration system that automatically handles different environments. Here's how to configure it:

## Current Setup

### 1. Centralized Configuration
All API URLs are managed in `src/apis/config.ts` which:
- Automatically detects localhost for development
- Uses environment variables for production
- Provides sensible defaults

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# For Local Development (default)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# For Production Testing
# NEXT_PUBLIC_API_URL=https://api.medh.co

# Environment-specific URLs (optional)
NEXT_PUBLIC_API_URL_DEV=http://localhost:8080/api/v1
NEXT_PUBLIC_API_URL_PROD=https://api.medh.co
```

## How It Works

### Development Mode
- When running on `localhost` or `127.0.0.1`, automatically uses `http://localhost:8080/api/v1`
- Perfect for local development with your backend running on port 8080

### Production Mode
- When `NODE_ENV=production`, uses `https://api.medh.co`
- Ensures all production deployments use the correct API

### Manual Override
- Set `NEXT_PUBLIC_API_URL` to override automatic detection
- Useful for testing production API from local development

## Quick Switching

### To use Local Backend:
```bash
# In .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### To use Production Backend:
```bash
# In .env.local
NEXT_PUBLIC_API_URL=https://api.medh.co
```

## Files Updated

The following files now use the centralized configuration:

✅ **Fixed Files:**
- `src/apis/config.ts` - Main configuration
- `src/utils/api.js` - API client utility
- `src/config/api.ts` - Configuration helper

⚠️ **Files that may need manual updates:**
- Some components still have hardcoded URLs
- Check console logs for "API Base URL configured" to verify current setting

## Verification

1. Start your development server
2. Check browser console for: `🌐 API Base URL configured: [URL]`
3. Verify the URL matches your expectation

## Troubleshooting

### If APIs are hitting wrong endpoint:
1. Check `.env.local` file exists and has correct `NEXT_PUBLIC_API_URL`
2. Restart development server after changing environment variables
3. Clear browser cache if needed

### For production deployment:
1. Ensure `NODE_ENV=production` is set
2. Verify `NEXT_PUBLIC_API_URL_PROD=https://api.medh.co` in environment variables
3. Check deployment logs for the configured URL

## Best Practices

1. **Always use the centralized config**: Import `apiBaseUrl` from `@/apis/config`
2. **Don't hardcode URLs**: Use the configuration system instead
3. **Test both environments**: Verify APIs work with both local and production backends
4. **Environment-specific testing**: Use different URLs for different deployment stages

## Example Usage

```typescript
import { apiBaseUrl } from '@/apis/config';

// Correct way to make API calls
const response = await fetch(`${apiBaseUrl}/courses`);

// Don't do this (hardcoded URL)
// const response = await fetch('http://localhost:8080/api/v1/courses');
```

This ensures your API calls will work correctly in all environments!
