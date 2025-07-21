# Frontend OAuth Setup Guide

## Overview

This implementation uses **frontend-initiated OAuth** with Google Identity Services, giving you full control over the user experience while leveraging your backend for secure token verification.

## How It Works

```
Frontend → Google Identity Services → Frontend → Your Backend API → Database
```

### Flow:
1. **Frontend** loads Google Identity Services and triggers OAuth
2. **Google** returns JWT ID token directly to frontend  
3. **Frontend** decodes token and sends to your backend `/auth/oauth/frontend`
4. **Your Backend** verifies token with Google and creates/updates user
5. **Backend** returns JWT tokens and user data
6. **Frontend** stores tokens and redirects to dashboard

## Setup Instructions

### 1. Backend API Endpoint

Your backend needs to implement: **`POST /api/v1/auth/oauth/frontend`**

**Expected Request:**
```json
{
  "provider": "google",
  "token": "google_jwt_id_token",
  "userInfo": {
    "id": "google_user_id", 
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "email_verified": true,
    "given_name": "John",
    "family_name": "Doe"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OAuth authentication successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com", 
      "full_name": "John Doe",
      "user_image": {"url": "..."},
      "email_verified": true,
      "oauth_providers": ["google"]
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token"
    }
  }
}
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**: Not needed for this implementation

### 3. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Testing

1. **Start your backend** on `http://localhost:8080`
2. **Start your frontend** on `http://localhost:3000`
3. **Click Google OAuth button** in login page
4. **Authenticate with Google** in the popup/modal
5. **Check browser console** for success logs
6. **Verify redirect** to dashboard

## Features

✅ **No Popups/Redirects** - Uses Google Identity Services modal
✅ **Full Frontend Control** - Handle loading states, errors, UI
✅ **Secure** - Backend verifies all tokens with Google
✅ **Fast** - Direct token exchange, no multiple redirects  
✅ **User Friendly** - Better error messages and UX
✅ **Mobile Optimized** - Works great on mobile devices

## Troubleshooting

### "Google Client ID not configured"
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart your development server after adding environment variables

### "Failed to load Google OAuth"
- Check internet connection
- Verify Google Cloud Console setup
- Check browser console for detailed errors

### "OAuth authentication failed"
- Verify your backend endpoint `/api/v1/auth/oauth/frontend` is working
- Check that your backend can verify Google JWT tokens
- Ensure CORS is configured properly on your backend

### "Invalid response from server"
- Check that your backend returns the expected response format
- Verify the response includes `success: true` and proper `data` structure

## Security Notes

1. **JWT Verification**: Your backend must verify the Google JWT token
2. **HTTPS Only**: Use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Token Storage**: Consider using httpOnly cookies for production
5. **Rate Limiting**: Implement rate limiting on OAuth endpoints

## Benefits vs Traditional OAuth

| Traditional OAuth | Frontend OAuth |
|------------------|----------------|
| Multiple redirects | Direct token exchange |
| Limited UI control | Full UI control |
| Popup blocking issues | Modal-based (no popups) |
| Complex error handling | Clear error messages |
| Mobile unfriendly | Mobile optimized |

This implementation provides the best user experience while maintaining security! 🚀 