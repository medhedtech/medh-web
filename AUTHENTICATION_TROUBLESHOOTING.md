# Authentication Troubleshooting Guide

## Issue: Profile Not Available / Profile Information Not Loading

### Quick Fix Steps

1. **Open Browser Developer Tools**
   - Press `F12` or right-click → "Inspect"
   - Go to the "Console" tab

2. **Check for Debug Information**
   - Look for authentication debug logs (🔐 symbol)
   - Check for any error messages in red

3. **Try These Solutions in Order:**

#### Solution 1: Clear Authentication Data
```javascript
// Run this in the browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### Solution 2: Manual Re-login
1. Go to `/login` page
2. Log in with your credentials
3. Check if profile loads properly

#### Solution 3: Check Network Tab
1. Open Developer Tools → Network tab
2. Go to profile page
3. Look for failed API requests (red status codes)
4. Check if the API endpoint `/auth/get/{userId}` is returning data

### Common Issues and Solutions

#### Issue 1: Invalid Token Format
**Symptoms:** Console shows "Token format is invalid"
**Solution:** Clear storage and re-login

#### Issue 2: Token Expired
**Symptoms:** Console shows "Token has expired"
**Solution:** System should auto-redirect to login. If not, manually clear storage.

#### Issue 3: User ID Missing
**Symptoms:** Console shows "User ID is missing or invalid"
**Solution:** 
1. Check if login process completed successfully
2. Clear storage and re-login
3. Check if `userId` is being saved during login

#### Issue 4: API Endpoint Not Found (404)
**Symptoms:** Network tab shows 404 for `/auth/get/{userId}`
**Solution:**
1. Check if API server is running
2. Verify API endpoint URL in `src/apis/index.ts`
3. Check if `userId` parameter is valid

#### Issue 5: Authentication Required (401/403)
**Symptoms:** API returns 401 or 403 status
**Solution:**
1. Check if token is being sent in API requests
2. Verify token is valid and not expired
3. Re-login to get fresh token

### Debug Commands (Run in Browser Console)

```javascript
// Check authentication status
console.log('Token:', localStorage.getItem('token'));
console.log('User ID:', localStorage.getItem('userId'));
console.log('Role:', localStorage.getItem('role'));

// Check if token is expired
const token = localStorage.getItem('token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token expires:', new Date(payload.exp * 1000));
    console.log('Current time:', new Date());
    console.log('Token valid:', payload.exp > Math.floor(Date.now() / 1000));
  } catch (e) {
    console.log('Token decode error:', e);
  }
}

// Test API endpoint
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
if (userId && token) {
  fetch(`https://api.medh.co/api/v1/auth/get/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Status:', response.status);
    return response.json();
  })
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('API Error:', error));
}
```

### Development Mode Debug Features

When running in development mode (`npm run dev`), the system automatically logs detailed authentication information to the console. Look for:

- 🔐 Authentication Debug Information
- Token validation status
- User data availability
- Storage locations
- Issues and recommendations

### Profile Page Specific Issues

#### Mock Data vs Real Data
The profile page at `/dashboards/student/profile/page.tsx` contains mock user data for development. If you see static mock data instead of your real profile:

1. Check if the `StudentProfilePage` component is fetching real data
2. Verify API integration is working
3. Check if `userId` from storage matches your actual user ID

#### API Endpoint Configuration
Profile data is fetched from `/auth/get/{userId}`. Check:
1. API base URL is correct in environment variables
2. Endpoint exists and is accessible
3. User ID format matches API expectations

### Environment Variables

Make sure these environment variables are set:
```env
NEXT_PUBLIC_API_URL=https://api.medh.co/api/v1
```

### Contact Support

If none of these solutions work:
1. Copy the console logs (especially the 🔐 Authentication Debug Information)
2. Note the exact error messages
3. Include browser and device information
4. Contact the development team with this information

### Prevention

To prevent authentication issues:
1. Don't manually edit localStorage/sessionStorage
2. Use the proper logout functionality
3. Don't share tokens between different environments
4. Clear browser data when switching between development/production 