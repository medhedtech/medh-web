# Google OAuth Setup Guide

This guide will help you configure Google OAuth for the Medh Web application.

## 🔧 Quick Fix for "redirect_uri_mismatch" Error

The `redirect_uri_mismatch` error occurs when your OAuth redirect URI doesn't match what's configured in Google Cloud Console.

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Create a new project or select existing one
   - Note your project ID

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "People API" for profile information

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"

5. **Configure Authorized Redirect URIs**
   Add these URIs exactly as shown:

   **For Local Development:**
   ```
   http://localhost:3000/auth/callback
   http://127.0.0.1:3000/auth/callback
   ```

   **For Production (replace with your domain):**
   ```
   https://yourdomain.com/auth/callback
   https://www.yourdomain.com/auth/callback
   ```

6. **Configure Authorized Origins**
   Add these origins:

   **For Local Development:**
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```

   **For Production:**
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

7. **Save and Copy Client ID**
   - Click "Save"
   - Copy the "Client ID" (ends with `.apps.googleusercontent.com`)

### Step 2: Environment Configuration

1. **Create/Update .env.local file:**
   ```bash
   # Copy from .env.example
   cp .env.example .env.local
   ```

2. **Add your Google Client ID:**
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```

3. **Set correct App URL:**
   ```env
   # For development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # For production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

### Step 3: Test the Configuration

1. **Start your development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open browser and check console:**
   - Go to http://localhost:3000
   - Open browser console (F12)
   - Look for OAuth configuration debug info

3. **Test Google Login:**
   - Go to login or signup page
   - Click "Continue with Google" button
   - Should redirect to Google OAuth consent screen

## 🔍 Troubleshooting

### Common Issues and Solutions:

#### 1. "redirect_uri_mismatch" Error
**Problem:** Redirect URI doesn't match Google Cloud Console configuration
**Solution:** 
- Check exact URL in browser when error occurs
- Add that exact URL to Google Cloud Console
- Common URLs to add:
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`

#### 2. "invalid_client" Error
**Problem:** Client ID is incorrect or not set
**Solution:**
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
- Ensure it ends with `.apps.googleusercontent.com`
- No quotes around the value in .env file

#### 3. "access_denied" Error
**Problem:** User denied access or OAuth app not configured properly
**Solution:**
- Check OAuth consent screen configuration
- Ensure app is not in testing mode (or add test users)
- Verify scopes are correctly configured

#### 4. CORS Errors
**Problem:** Cross-origin request blocked
**Solution:**
- Add your domain to "Authorized JavaScript origins"
- Ensure both `http://localhost:3000` and `http://127.0.0.1:3000` are added

#### 5. Development vs Production Issues
**Problem:** Works locally but not in production
**Solution:**
- Update production environment variables
- Add production URLs to Google Cloud Console
- Ensure HTTPS is used in production

## 🛡️ Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different OAuth apps for development/production
- Rotate client secrets regularly

### 2. Redirect URI Security
- Only add necessary redirect URIs
- Use HTTPS in production
- Validate redirect URIs on backend

### 3. OAuth Scopes
- Request minimal required scopes
- Explain to users why scopes are needed
- Handle scope changes gracefully

## 📋 OAuth App Configuration Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] People API enabled
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs configured
- [ ] Authorized JavaScript origins configured
- [ ] Client ID added to environment variables
- [ ] OAuth consent screen configured
- [ ] Test users added (if in testing mode)
- [ ] Production URLs configured (if deploying)

## 🔄 Backend Integration

Your Express.js backend should handle the OAuth callback at:
```
POST /api/auth/oauth/callback
```

Expected request body:
```json
{
  "code": "oauth_authorization_code",
  "state": "oauth_state_parameter",
  "provider": "google",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

Expected response:
```json
{
  "success": true,
  "token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "full_name": "User Name",
    "role": ["student"],
    "email_verified": true,
    "account_merged": false,
    "profile_updated": false
  }
}
```

## 📞 Support

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all URLs match exactly (including http/https)
3. Ensure environment variables are loaded correctly
4. Test with a fresh incognito browser window

For additional help, check the OAuth configuration debug output in the browser console when in development mode. 