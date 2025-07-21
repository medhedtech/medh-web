# Backend OAuth Endpoint Implementation

## Required Endpoint

You need to implement: **`POST /api/v1/auth/oauth/frontend`**

## Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/oauth/frontend', async (req, res) => {
  try {
    const { provider, token, userInfo } = req.body;
    
    if (provider !== 'google') {
      return res.status(400).json({
        success: false,
        message: 'Only Google OAuth is supported currently'
      });
    }

    // Verify the Google JWT token
    let verifiedPayload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      verifiedPayload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    // Extract user data from verified token
    const googleUserData = {
      id: verifiedPayload.sub,
      email: verifiedPayload.email,
      name: verifiedPayload.name,
      picture: verifiedPayload.picture,
      email_verified: verifiedPayload.email_verified,
      given_name: verifiedPayload.given_name,
      family_name: verifiedPayload.family_name
    };

    // Find or create user in your database
    let user = await User.findOne({ 
      $or: [
        { email: googleUserData.email },
        { 'oauth_providers.google.id': googleUserData.id }
      ]
    });

    let isNewUser = false;
    if (!user) {
      // Create new user
      user = new User({
        email: googleUserData.email,
        full_name: googleUserData.name,
        user_image: { url: googleUserData.picture },
        email_verified: googleUserData.email_verified,
        oauth_providers: [{
          provider: 'google',
          id: googleUserData.id,
          email: googleUserData.email
        }],
        role: ['student'],
        account_type: 'free',
        profile_completion: 60
      });
      isNewUser = true;
    } else {
      // Update existing user
      const hasGoogleProvider = user.oauth_providers.some(p => p.provider === 'google');
      if (!hasGoogleProvider) {
        user.oauth_providers.push({
          provider: 'google',
          id: googleUserData.id,
          email: googleUserData.email
        });
      }
      
      // Update profile if needed
      if (!user.user_image?.url && googleUserData.picture) {
        user.user_image = { url: googleUserData.picture };
      }
      if (!user.email_verified && googleUserData.email_verified) {
        user.email_verified = true;
      }
    }

    await user.save();

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Return response in expected format
    res.json({
      success: true,
      message: 'OAuth authentication successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          user_image: user.user_image,
          account_type: user.account_type,
          email_verified: user.email_verified,
          profile_completion: user.profile_completion,
          oauth_providers: user.oauth_providers.map(p => p.provider)
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: '24h'
        }
      }
    });

  } catch (error) {
    console.error('OAuth endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth authentication failed',
      error: error.message
    });
  }
});

module.exports = router;
```

### Python/FastAPI Example

```python
from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
import os
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/auth/oauth/frontend")
async def oauth_frontend(request: dict):
    try:
        provider = request.get("provider")
        token = request.get("token")
        user_info = request.get("userInfo")
        
        if provider != "google":
            raise HTTPException(
                status_code=400, 
                detail="Only Google OAuth is supported currently"
            )
        
        # Verify Google JWT token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                os.getenv("GOOGLE_CLIENT_ID")
            )
        except ValueError as e:
            raise HTTPException(status_code=401, detail="Invalid Google token")
        
        # Extract user data
        google_user_data = {
            "id": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo["name"],
            "picture": idinfo.get("picture"),
            "email_verified": idinfo.get("email_verified", False),
            "given_name": idinfo.get("given_name"),
            "family_name": idinfo.get("family_name")
        }
        
        # Find or create user in database
        user = await find_or_create_user(google_user_data)
        
        # Generate JWT tokens
        access_token = jwt.encode({
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, os.getenv("JWT_SECRET"), algorithm="HS256")
        
        refresh_token = jwt.encode({
            "id": str(user.id),
            "exp": datetime.utcnow() + timedelta(days=7)
        }, os.getenv("JWT_REFRESH_SECRET"), algorithm="HS256")
        
        return {
            "success": True,
            "message": "OAuth authentication successful",
            "data": {
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "full_name": user.full_name,
                    "user_image": {"url": user.user_image_url},
                    "email_verified": user.email_verified,
                    "oauth_providers": ["google"]
                },
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "token_type": "Bearer",
                    "expires_in": "24h"
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"OAuth authentication failed: {str(e)}"
        )
```

### PHP/Laravel Example

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Google_Client;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Route::post('/auth/oauth/frontend', function (Request $request) {
    try {
        $provider = $request->input('provider');
        $token = $request->input('token');
        $userInfo = $request->input('userInfo');
        
        if ($provider !== 'google') {
            return response()->json([
                'success' => false,
                'message' => 'Only Google OAuth is supported currently'
            ], 400);
        }
        
        // Verify Google JWT token
        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);
        
        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Google token'
            ], 401);
        }
        
        // Extract user data
        $googleUserData = [
            'id' => $payload['sub'],
            'email' => $payload['email'],
            'name' => $payload['name'],
            'picture' => $payload['picture'] ?? null,
            'email_verified' => $payload['email_verified'] ?? false,
            'given_name' => $payload['given_name'] ?? null,
            'family_name' => $payload['family_name'] ?? null
        ];
        
        // Find or create user
        $user = User::where('email', $googleUserData['email'])
                   ->orWhere('google_id', $googleUserData['id'])
                   ->first();
        
        if (!$user) {
            $user = User::create([
                'email' => $googleUserData['email'],
                'full_name' => $googleUserData['name'],
                'google_id' => $googleUserData['id'],
                'user_image_url' => $googleUserData['picture'],
                'email_verified' => $googleUserData['email_verified'],
                'role' => 'student'
            ]);
        }
        
        // Generate JWT tokens
        $accessToken = JWT::encode([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ], env('JWT_SECRET'), 'HS256');
        
        return response()->json([
            'success' => true,
            'message' => 'OAuth authentication successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                    'user_image' => ['url' => $user->user_image_url],
                    'email_verified' => $user->email_verified,
                    'oauth_providers' => ['google']
                ],
                'tokens' => [
                    'access_token' => $accessToken,
                    'refresh_token' => '', // Implement as needed
                    'token_type' => 'Bearer',
                    'expires_in' => '24h'
                ]
            ]
        ]);
        
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'OAuth authentication failed',
            'error' => $e->getMessage()
        ], 500);
    }
});
```

## Required Environment Variables

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

## Testing the Endpoint

You can test your endpoint with curl:

```bash
curl -X POST http://localhost:8080/api/v1/auth/oauth/frontend \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "token": "test_jwt_token",
    "userInfo": {
      "id": "test_user_id",
      "email": "test@example.com",
      "name": "Test User",
      "picture": "https://example.com/avatar.jpg",
      "email_verified": true
    }
  }'
```

## Key Requirements

1. **Verify Google JWT Token** - Always verify with Google's servers
2. **Handle Existing Users** - Check for existing users by email or OAuth ID
3. **Generate Your JWT Tokens** - Return your application's JWT tokens
4. **Return Proper Format** - Match the expected response structure
5. **Error Handling** - Provide clear error messages
6. **Security** - Use HTTPS in production, validate all inputs

Once you implement this endpoint, the frontend OAuth will work perfectly! 🚀 