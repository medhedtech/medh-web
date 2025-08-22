# Environment Switching Guide

## 🔧 Quick Fix Applied

The student data loading issue in your live session form has been **FIXED**! 

### What was the problem?
- The API configuration was centralized correctly ✅
- BUT the Next.js API routes were still using hardcoded URLs ❌
- This caused production to use wrong endpoints while local worked fine

### What was fixed?
✅ Updated 10 API route files to use centralized configuration  
✅ All `/api/v1/live-sessions/*` endpoints now use `apiBaseUrl`  
✅ Automatic environment detection working properly

---

## 🌍 Environment Configuration

### Current Setup:
- **Local Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.medh.co`

### How to Switch Environments:

#### Option 1: Automatic (Recommended)
The system automatically detects your environment:
- `localhost` → Uses local backend
- Production domain → Uses production backend

#### Option 2: Manual Override
Create/edit `.env.local` file:

```bash
# For Local Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# For Production Testing  
# NEXT_PUBLIC_API_URL=https://api.medh.co
```

---

## 🧪 Testing Your Fix

### 1. Restart Development Server
```bash
npm run dev
# or
yarn dev
```

### 2. Test Live Session Form
1. Go to Create Live Session Form
2. Check student dropdown - should now load latest data
3. Check browser console for API URL confirmation

### 3. Verify API Calls
Open browser console and look for:
```
🌐 API Base URL configured: [your-expected-url]
```

### 4. Debug if Needed
If still having issues, run in browser console:
```javascript
// Check current configuration
console.log('Current API Base URL:', window.location.hostname === 'localhost' ? 'http://localhost:8080/api/v1' : 'https://api.medh.co');

// Test student API directly
fetch('/api/v1/live-sessions/students?limit=5')
  .then(r => r.json())
  .then(data => console.log('Student API Test:', data));
```

---

## 📋 Files Fixed

The following API routes were updated to use centralized configuration:

- ✅ `src/app/api/v1/live-sessions/students/route.ts`
- ✅ `src/app/api/v1/live-sessions/route.ts`
- ✅ `src/app/api/v1/live-sessions/sessions/route.ts`
- ✅ `src/app/api/v1/live-sessions/sessions/previous/route.ts`
- ✅ `src/app/api/v1/live-sessions/sessions/[id]/route.ts`
- ✅ `src/app/api/v1/live-sessions/instructors/route.ts`
- ✅ `src/app/api/v1/live-sessions/grades/route.ts`
- ✅ `src/app/api/v1/live-sessions/generate-upload-url/route.ts`
- ✅ `src/app/api/v1/live-sessions/files/upload/route.ts`
- ✅ `src/app/api/v1/live-sessions/dashboards/route.ts`
- ✅ `src/app/api/v1/live-sessions/course-categories/route.ts`

---

## 🚀 Expected Result

**Before Fix:**
- Local: Student data loads ✅
- Production: Student data doesn't load ❌

**After Fix:**
- Local: Student data loads ✅  
- Production: Student data loads ✅

---

## 🆘 If Still Having Issues

1. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
2. **Check Environment Variables**: Verify `.env.local` settings
3. **Check Network Tab**: Look for failed API calls
4. **Check Console**: Look for error messages
5. **Verify Backend**: Ensure your backend is running and accessible

## 📞 Quick Test Commands

```bash
# Test local backend
curl http://localhost:8080/api/v1/live-classes/students

# Test production backend  
curl https://api.medh.co/live-classes/students
```

Your live session form should now work perfectly in both environments! 🎉
