# Production API Testing Guide

## 🧪 Build से पहले Production API Test करें

### **Method 1: Environment Variable Override (आसान तरीका)**

#### Step 1: Create `.env.local` file
```bash
# Production API Testing
NEXT_PUBLIC_API_URL=https://api.medh.co

# Other variables (copy from .env file)
MONGO_URI=mongodb+srv://medhupskill:Medh567upskill@medh.xmifs.mongodb.net/MedhDB
JWT_SECRET=placeholder-jwt-secret
# ... (copy other variables from .env)
```

#### Step 2: Restart Development Server
```bash
npm run dev
```

#### Step 3: Test Both Features
1. **Create Live Session Form**: Check student dropdown
2. **Recorded Sessions**: Check videos grid loading

#### Step 4: Switch Back to Local
```bash
# In .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

### **Method 2: Browser Console Testing (तुरंत test)**

#### Test Production API Directly:
```javascript
// Test students API (for live session form)
fetch('https://api.medh.co/live-classes/students?limit=5')
  .then(r => r.json())
  .then(data => console.log('Production Students API:', data))
  .catch(err => console.error('Production API Error:', err));

// Test auth profile (for recorded sessions)  
const token = localStorage.getItem('token');
fetch('https://api.medh.co/auth/profile', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'x-access-token': token 
  }
})
  .then(r => r.json())
  .then(data => console.log('Production Profile API:', data))
  .catch(err => console.error('Production Auth Error:', err));
```

---

### **Method 3: Quick Switch Script (Advanced)**

Create a test script:
```javascript
// In browser console
window.testProductionAPI = async () => {
  console.log('🧪 Testing Production APIs...');
  
  // Test 1: Students API
  try {
    const studentsResponse = await fetch('https://api.medh.co/live-classes/students?limit=3');
    const studentsData = await studentsResponse.json();
    console.log('✅ Students API:', studentsData.data?.items?.length || 0, 'students found');
  } catch (err) {
    console.error('❌ Students API failed:', err.message);
  }
  
  // Test 2: Profile API  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const profileResponse = await fetch('https://api.medh.co/auth/profile', {
        headers: { 'x-access-token': token }
      });
      const profileData = await profileResponse.json();
      console.log('✅ Profile API:', profileData.success ? 'Success' : 'Failed');
    } else {
      console.log('⚠️ No auth token found');
    }
  } catch (err) {
    console.error('❌ Profile API failed:', err.message);
  }
};

// Run the test
window.testProductionAPI();
```

---

## 🎯 **Recommended Testing Flow**

### **Pre-Build Checklist:**

#### 1. **Test Local APIs (Current)**
```bash
# Ensure .env.local has:
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

npm run dev
# Test both features
```

#### 2. **Test Production APIs**
```bash
# Change .env.local to:
NEXT_PUBLIC_API_URL=https://api.medh.co

npm run dev
# Test both features again
```

#### 3. **Verify Console Logs**
Check browser console for:
```
🌐 API Base URL configured: https://api.medh.co
```

#### 4. **Test Both Features**
- ✅ **Create Live Session**: Student dropdown loads
- ✅ **Recorded Sessions**: Videos grid loads

#### 5. **Ready for Build**
```bash
# If both work, ready for production build
npm run build
```

---

## 🚨 **Quick Debug Commands**

### **Check Current API Configuration:**
```javascript
// In browser console
console.log('Current API Base URL:', window.location.hostname === 'localhost' ? 'http://localhost:8080/api/v1' : 'https://api.medh.co');
```

### **Test API Connectivity:**
```javascript
// Test if production API is accessible
fetch('https://api.medh.co/health')
  .then(r => r.json())
  .then(data => console.log('Production API Health:', data))
  .catch(err => console.error('Production API Down:', err));
```

### **Compare Local vs Production:**
```javascript
// Compare both APIs
Promise.all([
  fetch('http://localhost:8080/api/v1/health').catch(() => 'Local API Down'),
  fetch('https://api.medh.co/health').catch(() => 'Production API Down')
]).then(results => {
  console.log('Local API:', results[0]);
  console.log('Production API:', results[1]);
});
```

---

## ✅ **Expected Results**

### **Local API Test:**
```
🌐 API Base URL configured: http://localhost:8080/api/v1
✅ Students loading: Success
✅ Videos loading: Success
```

### **Production API Test:**
```
🌐 API Base URL configured: https://api.medh.co
✅ Students loading: Success  
✅ Videos loading: Success
```

### **If Both Pass:**
🎉 **Ready for production build!**

### **If Any Fails:**
🔍 **Debug the specific API endpoint**

---

## 🎯 **One-Line Test Command**

```bash
# Quick test - change env and restart
echo "NEXT_PUBLIC_API_URL=https://api.medh.co" > .env.local && npm run dev
```

Iss guide se aap easily production API test kar sakte ho build se pehle! 🚀
