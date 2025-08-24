# Profile Edit Form API Configuration Fix Guide

## 🚨 Issue Description
The student profile edit form is currently only working in local development but failing in production. The form uses the `/profile/me/comprehensive` endpoint but the API configuration is not properly handling production environments.

## 🔍 Root Cause Analysis

### Current API Configuration Issues:
1. **Forced Localhost Logic**: The previous configuration was forcing localhost for development, overriding environment variables
2. **Missing Environment Variables**: Production environment variables may not be properly set
3. **Inconsistent API URL Detection**: The logic wasn't properly handling different deployment scenarios

### Backend Endpoints Available:
- ✅ `PUT /api/v1/profile/me/comprehensive` - Full profile update
- ✅ `PATCH /api/v1/profile/me/comprehensive` - Partial profile update (used by frontend)
- ✅ `GET /api/v1/profile/me/comprehensive` - Get comprehensive profile

## 🛠️ Fixes Applied

### 1. Fixed API Configuration Logic (`src/apis/config.ts`)

**Before:**
```typescript
// Force localhost for development (override everything)
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  console.log('🔧 Development mode detected - using localhost backend');
  return 'http://localhost:8080/api/v1';
}
```

**After:**
```typescript
// First priority: Explicit API URL override (highest priority)
if (process.env.NEXT_PUBLIC_API_URL) {
  console.log('🚀 Using explicit API URL from environment:', process.env.NEXT_PUBLIC_API_URL);
  return process.env.NEXT_PUBLIC_API_URL;
}

// Second priority: Environment-specific URLs
if (process.env.NODE_ENV === 'production') {
  const prodUrl = process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co';
  console.log('🌐 Production environment detected - using:', prodUrl);
  return prodUrl;
} else if (process.env.NODE_ENV === 'test') {
  const testUrl = process.env.NEXT_PUBLIC_API_URL_TEST || 'https://api.medh.co';
  console.log('🧪 Test environment detected - using:', testUrl);
  return testUrl;
} else {
  // Development environment
  // Check if we're running on localhost
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    const devUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8080/api/v1';
    console.log('🔧 Development mode detected (localhost) - using:', devUrl);
    return devUrl;
  } else {
    // Development but not on localhost (could be staging or preview)
    const devUrl = process.env.NEXT_PUBLIC_API_URL_DEV || 'https://api.medh.co';
    console.log('🔧 Development mode detected (non-localhost) - using:', devUrl);
    return devUrl;
  }
}
```

### 2. Enhanced Debug Logging
Added comprehensive logging to help diagnose API configuration issues:
```typescript
console.log('📋 Environment Variables:');
console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'Not set');
console.log('  - NEXT_PUBLIC_API_URL_PROD:', process.env.NEXT_PUBLIC_API_URL_PROD || 'Not set');
console.log('  - NEXT_PUBLIC_API_URL_DEV:', process.env.NEXT_PUBLIC_API_URL_DEV || 'Not set');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'Not set');
```

## 🚀 Environment Setup Instructions

### For Development:
1. Create `.env.local` file in the `medh-web` directory:
```bash
# Development - Local Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### For Production:
1. Set environment variable in your deployment platform:
```bash
NEXT_PUBLIC_API_URL=https://api.medh.co
```

### For Staging/Testing:
1. Set environment variable:
```bash
NEXT_PUBLIC_API_URL=https://api.medh.co
```

## 🧪 Testing the Fix

### 1. Run the API Configuration Test:
```bash
cd medh-web
node test-api-config.js
```

### 2. Test Profile Edit Form:
1. **Development**: 
   - Start local backend: `cd medh-backend && npm run dev`
   - Start frontend: `cd medh-web && npm run dev`
   - Navigate to `/student/profile` and test edit form

2. **Production**:
   - Deploy with `NEXT_PUBLIC_API_URL=https://api.medh.co`
   - Test profile edit form on production site

### 3. Verify API Calls:
Open browser developer tools and check:
- Network tab for API requests
- Console for API configuration logs
- Ensure requests go to correct endpoints

## 📋 Verification Checklist

- [ ] API configuration test passes
- [ ] Profile edit form loads correctly
- [ ] Form submission works in development
- [ ] Form submission works in production
- [ ] No CORS errors in browser console
- [ ] API requests use correct base URL
- [ ] Authentication tokens are properly sent

## 🔧 Troubleshooting

### If Profile Edit Still Doesn't Work:

1. **Check Environment Variables**:
   ```bash
   # In browser console
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
   ```

2. **Verify API Endpoint**:
   - Check Network tab in dev tools
   - Ensure requests go to `/profile/me/comprehensive`
   - Verify HTTP method is PATCH

3. **Check Authentication**:
   - Ensure user is logged in
   - Verify auth token is present in localStorage
   - Check if token is expired

4. **Backend Health Check**:
   ```bash
   curl https://api.medh.co/health
   ```

### Common Issues:

1. **CORS Errors**: Backend needs to allow frontend domain
2. **Authentication Errors**: Token missing or expired
3. **Validation Errors**: Form data doesn't match backend expectations
4. **Network Errors**: API endpoint not reachable

## 📞 Support

If issues persist:
1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Test API endpoints directly with Postman/curl
4. Check backend logs for any errors

## 🎯 Expected Behavior After Fix

- ✅ Profile edit form works in both development and production
- ✅ API requests use correct base URL for each environment
- ✅ Form submissions are successful
- ✅ Profile data is updated correctly
- ✅ No console errors related to API configuration
