# Profile Edit Form Production Fix Guide

## 🚨 Issue Description
Profile edit form is working in local development but failing in production:
- ❌ Data not saving in production
- ❌ Personal details not displaying in production
- ❌ Form submission errors in production
- ✅ Working fine in local development

## 🔍 Root Cause Analysis

### **Production Issues Identified:**
1. **Environment Variable Missing:** Production deployment doesn't have `NEXT_PUBLIC_API_URL` set
2. **API Configuration:** Production using wrong API base URL
3. **CORS Issues:** Backend may not allow production frontend domain
4. **Authentication Issues:** Token validation problems in production

### **Current Status:**
- ✅ **Local Development:** Working perfectly
- ❌ **Production:** API calls failing
- ❌ **Data Loading:** Profile data not loading
- ❌ **Form Submission:** Updates not saving

## 🛠️ Fixes Applied

### 1. **Enhanced Debugging** (Added to StudentProfilePage.tsx)

**Added comprehensive logging:**
```typescript
// In fetchProfile function
console.log('🔑 Token available:', !!token);
console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'Using default');

// In handleSave function  
console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'Using default');
console.log('🔑 Token available:', !!getAuthToken());
```

### 2. **API Configuration Verification**

**Created test script:** `fix-profile-production.js`
- Tests production API configuration
- Verifies endpoints are correct
- Provides deployment instructions

## 🚀 Production Deployment Fix

### **Step 1: Set Environment Variable**

#### **For Vercel Deployment:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.medh.co`
   - **Environment:** Production (and Preview if needed)
5. Save and redeploy

#### **For Netlify Deployment:**
1. Go to Site Settings → Environment Variables
2. Add new variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.medh.co`
3. Save and redeploy

#### **For AWS Amplify:**
1. Go to App Settings → Environment Variables
2. Add new variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.medh.co`
3. Save and redeploy

### **Step 2: Verify Backend CORS Settings**

**Check if backend allows your production domain:**
```javascript
// Backend CORS configuration should include:
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-production-domain.com',
  'https://medh.co',
  'https://www.medh.co'
];
```

### **Step 3: Test API Endpoints**

**Test production API directly:**
```bash
# Test profile fetch
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.medh.co/profile/me/comprehensive

# Test profile update
curl -X PATCH \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"full_name":"Test User"}' \
     https://api.medh.co/profile/me/comprehensive
```

## 🧪 Testing the Fix

### **1. Run Production Test Script:**
```bash
cd medh-web
node fix-profile-production.js
```

### **2. Test in Browser Console:**
```javascript
// Check API configuration
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test profile fetch
fetch('/api/v1/profile/me/comprehensive', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Profile API Response:', data))
.catch(err => console.error('Profile API Error:', err));
```

### **3. Verify Environment Variables:**
```javascript
// In browser console
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('- Hostname:', window.location.hostname);
```

## 📋 Verification Checklist

### **Before Deployment:**
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set to `https://api.medh.co`
- [ ] Backend CORS allows production domain
- [ ] Backend is running and accessible
- [ ] Authentication tokens are valid

### **After Deployment:**
- [ ] Profile data loads correctly
- [ ] Personal details are displayed
- [ ] Form submission works
- [ ] Data is saved successfully
- [ ] No console errors
- [ ] No CORS errors

### **Browser Console Checks:**
- [ ] API Base URL shows `https://api.medh.co`
- [ ] Token is available and valid
- [ ] Profile API calls succeed
- [ ] No network errors

## 🔧 Troubleshooting

### **If Profile Still Doesn't Load:**

1. **Check Environment Variable:**
   ```javascript
   // In browser console
   console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
   ```

2. **Check API Configuration:**
   ```javascript
   // Look for this log in console
   console.log('🌐 API Base URL configured:', apiBaseUrl);
   ```

3. **Test API Directly:**
   ```javascript
   // Test with your actual token
   const token = localStorage.getItem('token');
   fetch('https://api.medh.co/profile/me/comprehensive', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   .then(r => r.json())
   .then(data => console.log('Direct API Test:', data));
   ```

4. **Check Network Tab:**
   - Open browser dev tools
   - Go to Network tab
   - Try to load profile
   - Check if API calls are made to correct URL
   - Check response status codes

### **Common Issues:**

1. **Environment Variable Not Set:**
   - Solution: Set `NEXT_PUBLIC_API_URL=https://api.medh.co` in deployment platform

2. **CORS Error:**
   - Solution: Add production domain to backend CORS allowed origins

3. **Authentication Error:**
   - Solution: Check if token is valid and not expired

4. **API Endpoint Not Found:**
   - Solution: Verify backend is running and endpoint exists

## 🎯 Expected Results After Fix

### **Profile Loading:**
- ✅ Profile data loads immediately
- ✅ Personal details are displayed correctly
- ✅ Profile completion percentage shows
- ✅ All form fields are populated

### **Form Submission:**
- ✅ Form saves data successfully
- ✅ Success message appears
- ✅ Profile data updates immediately
- ✅ No error messages

### **API Calls:**
- ✅ All API calls go to `https://api.medh.co`
- ✅ Authentication headers are sent correctly
- ✅ Response data is processed properly
- ✅ No network errors

## 📞 Support

### **If Issues Persist:**

1. **Check Deployment Logs:**
   - Look for build errors
   - Check environment variable loading
   - Verify deployment success

2. **Test Backend API:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.medh.co/profile/me/comprehensive
   ```

3. **Compare Local vs Production:**
   - Test same functionality locally
   - Compare API responses
   - Check for differences in data structure

4. **Contact Support:**
   - Provide browser console logs
   - Include network tab screenshots
   - Share environment variable settings

## 🚀 Quick Fix Summary

1. **Set Environment Variable:** `NEXT_PUBLIC_API_URL=https://api.medh.co`
2. **Redeploy Application**
3. **Test Profile Loading**
4. **Test Form Submission**
5. **Verify No Console Errors**

The profile edit form should now work correctly in production! 🎉

