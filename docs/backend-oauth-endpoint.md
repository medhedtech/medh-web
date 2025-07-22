# Backend OAuth Endpoint Implementation - Enhanced with Quick Login

## Required Endpoint

You need to implement: **`POST /api/v1/auth/oauth/frontend`**

## Enhanced Request Format

```json
{
  "provider": "google",
  "token": "google_jwt_id_token",
  "generate_quick_login_key": true,
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

## Enhanced Response Format

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
      "oauth_providers": ["google"],
      "is_new_user": false,
      "profile_completion": 85
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token"
    },
    "quick_login_key": "secure_quick_login_key",
    "quick_login_key_id": "key_identifier_for_revocation",
    "session_id": "session_identifier",
    "email_notifications": {
      "welcome_sent": true,
      "login_notification_sent": true,
      "quick_login_key_notification_sent": true
    }
  }
}
```

## Implementation Examples

### Node.js/Express Example with Enhanced Features

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/oauth/frontend', async (req, res) => {
  try {
    const { provider, token, userInfo, generate_quick_login_key = false } = req.body;
    
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
    let quickLoginKey = null;
    let quickLoginKeyId = null;
    const emailNotifications = {
      welcome_sent: false,
      login_notification_sent: false,
      quick_login_key_notification_sent: false
    };

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        email: googleUserData.email,
        full_name: googleUserData.name,
        user_image: { url: googleUserData.picture },
        email_verified: googleUserData.email_verified,
        oauth_providers: [{
          provider: 'google',
          provider_id: googleUserData.id,
          connected_at: new Date()
        }],
        role: ['student']
      });
      
      await user.save();
      
      // Send welcome email
      try {
        await sendWelcomeEmail(user, 'google', generate_quick_login_key);
        emailNotifications.welcome_sent = true;
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    } else {
      // Update existing user OAuth info
      const existingProvider = user.oauth_providers.find(p => p.provider === 'google');
      if (!existingProvider) {
        user.oauth_providers.push({
          provider: 'google',
          provider_id: googleUserData.id,
          connected_at: new Date()
        });
        await user.save();
      }
      
      // Send login notification for existing users
      try {
        await sendLoginNotification(user, 'google', req);
        emailNotifications.login_notification_sent = true;
      } catch (emailError) {
        console.error('Failed to send login notification:', emailError);
      }
    }

    // Generate quick login key if requested
    if (generate_quick_login_key) {
      try {
        const keyData = generateQuickLoginKey(user.id);
        quickLoginKey = keyData.key;
        quickLoginKeyId = keyData.keyId;
        
        // Save key to database with expiry
        await QuickLoginKey.create({
          user_id: user.id,
          key_id: quickLoginKeyId,
          key_hash: hashQuickLoginKey(quickLoginKey),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          created_via: 'oauth_google'
        });
        
        // Send quick login key notification
        try {
          await sendQuickLoginKeyNotification(user, 'google', quickLoginKeyId);
          emailNotifications.quick_login_key_notification_sent = true;
        } catch (emailError) {
          console.error('Failed to send quick login key notification:', emailError);
        }
      } catch (keyError) {
        console.error('Failed to generate quick login key:', keyError);
        // Don't fail the entire request for key generation failure
      }
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'OAuth authentication successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_image: user.user_image,
          email_verified: user.email_verified,
          oauth_providers: user.oauth_providers.map(p => p.provider),
          is_new_user: isNewUser,
          profile_completion: calculateProfileCompletion(user)
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken
        },
        quick_login_key: quickLoginKey,
        quick_login_key_id: quickLoginKeyId,
        session_id: generateSessionId(),
        email_notifications: emailNotifications
      }
    });

  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OAuth authentication'
    });
  }
});

// Helper functions
function generateQuickLoginKey(userId) {
  const keyId = crypto.randomUUID();
  const key = crypto.randomBytes(32).toString('hex');
  return { key, keyId };
}

function hashQuickLoginKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateSessionId() {
  return crypto.randomUUID();
}

function calculateProfileCompletion(user) {
  let completion = 0;
  if (user.full_name) completion += 20;
  if (user.email_verified) completion += 20;
  if (user.user_image?.url) completion += 15;
  if (user.oauth_providers.length > 0) completion += 25;
  if (user.phone_numbers?.length > 0) completion += 20;
  return completion;
}

// Email notification functions
async function sendWelcomeEmail(user, provider, quickLoginEnabled) {
  const emailData = {
    to: user.email,
    subject: '🎉 Welcome to Medh Learning Platform!',
    template: 'oauth_welcome',
    data: {
      user_name: user.full_name || user.email.split('@')[0],
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      account_features: [
        'OAuth authentication',
        'Secure profile management',
        quickLoginEnabled ? 'Quick login key generated' : 'Password-free login',
        'Email notifications'
      ],
      quick_login_enabled: quickLoginEnabled,
      platform_features: [
        'Access to all courses',
        'Progress tracking',
        'Certificates',
        'Community features'
      ],
      support_links: {
        getting_started: `${process.env.FRONTEND_URL}/getting-started`,
        help_center: `${process.env.FRONTEND_URL}/help`,
        contact_support: `${process.env.FRONTEND_URL}/contact`
      }
    }
  };
  
  return sendEmail(emailData);
}

async function sendLoginNotification(user, provider, req) {
  const deviceInfo = {
    device: getDeviceInfo(req.headers['user-agent']),
    location: await getLocationFromIP(req.ip),
    browser: getBrowserInfo(req.headers['user-agent'])
  };
  
  const emailData = {
    to: user.email,
    subject: '🔐 Login Notification - Medh Learning Platform',
    template: 'login_notification',
    data: {
      user_name: user.full_name || user.email.split('@')[0],
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      login_time: new Date().toLocaleString(),
      device_info: deviceInfo,
      is_new_device: await isNewDevice(user.id, req.headers['user-agent']),
      security_actions: {
        review_devices: `${process.env.FRONTEND_URL}/security/devices`,
        change_password: `${process.env.FRONTEND_URL}/security/password`,
        enable_2fa: `${process.env.FRONTEND_URL}/security/2fa`
      }
    }
  };
  
  return sendEmail(emailData);
}

async function sendQuickLoginKeyNotification(user, provider, keyId) {
  const emailData = {
    to: user.email,
    subject: '🔑 Quick Login Key Generated - Medh Learning Platform',
    template: 'quick_login_key',
    data: {
      user_name: user.full_name || user.email.split('@')[0],
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      key_generated_at: new Date().toLocaleString(),
      key_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      security_info: {
        storage_location: 'local_device',
        encryption: 'AES-256',
        auto_expiry: '30_days_inactive'
      },
      management_links: {
        view_keys: `${process.env.FRONTEND_URL}/security/quick-login`,
        revoke_key: `${process.env.FRONTEND_URL}/security/quick-login/revoke/${keyId}`,
        security_settings: `${process.env.FRONTEND_URL}/security`
      }
    }
  };
  
  return sendEmail(emailData);
}

module.exports = router;
```

## Quick Login Endpoint

You also need to implement: **`POST /api/v1/auth/quick-login`**

```javascript
router.post('/auth/quick-login', async (req, res) => {
  try {
    const { email, quick_login_key } = req.body;
    
    if (!email || !quick_login_key) {
      return res.status(400).json({
        success: false,
        message: 'Email and quick login key are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and verify quick login key
    const hashedKey = hashQuickLoginKey(quick_login_key);
    const keyRecord = await QuickLoginKey.findOne({
      user_id: user.id,
      key_hash: hashedKey,
      expires_at: { $gt: new Date() },
      revoked: false
    });

    if (!keyRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired quick login key'
      });
    }

    // Update last used timestamp
    keyRecord.last_used_at = new Date();
    await keyRecord.save();

    // Generate new tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Optionally generate a new quick login key for rotation
    let newQuickLoginKey = null;
    let newKeyId = null;
    
    if (keyRecord.usage_count > 10) { // Rotate after 10 uses
      const newKeyData = generateQuickLoginKey(user.id);
      newQuickLoginKey = newKeyData.key;
      newKeyId = newKeyData.keyId;
      
      // Save new key and mark old one as rotated
      await QuickLoginKey.create({
        user_id: user.id,
        key_id: newKeyId,
        key_hash: hashQuickLoginKey(newQuickLoginKey),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_via: 'key_rotation'
      });
      
      keyRecord.rotated = true;
      await keyRecord.save();
    }

    res.json({
      success: true,
      message: 'Quick login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          email_verified: user.email_verified
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        quick_login_key: newQuickLoginKey, // New key if rotated
        quick_login_key_id: newKeyId,
        session_id: generateSessionId()
      }
    });

  } catch (error) {
    console.error('Quick login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during quick login'
    });
  }
});
```

## Email Templates

### Welcome Email Template
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Medh Learning Platform</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3bac63;">🎉 Welcome to Medh Learning Platform!</h1>
        
        <p>Hi {{user_name}},</p>
        
        <p>Welcome to Medh! Your account has been successfully created using your {{provider}} account.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Account Features:</h3>
            <ul>
                {{#each account_features}}
                <li>✅ {{this}}</li>
                {{/each}}
            </ul>
        </div>
        
        {{#if quick_login_enabled}}
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>🔑 Quick Login Key Generated</h3>
            <p>We've generated a secure quick login key for faster future access. This key is stored securely on your device and expires after 30 days of inactivity.</p>
        </div>
        {{/if}}
        
        <h3>What you can do now:</h3>
        <ul>
            {{#each platform_features}}
            <li>{{this}}</li>
            {{/each}}
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{support_links.getting_started}}" style="background: #3bac63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
        </div>
        
        <hr style="margin: 30px 0;">
        
        <p><strong>Need help?</strong></p>
        <ul>
            <li><a href="{{support_links.help_center}}">Help Center</a></li>
            <li><a href="{{support_links.contact_support}}">Contact Support</a></li>
        </ul>
        
        <p>Best regards,<br>The Medh Team</p>
    </div>
</body>
</html>
```

### Login Notification Template
```html
<!DOCTYPE html>
<html>
<head>
    <title>Login Notification - Medh Learning Platform</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1976d2;">🔐 Login Notification</h1>
        
        <p>Hi {{user_name}},</p>
        
        <p>We detected a login to your Medh account using {{provider}}.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Login Details:</h3>
            <ul>
                <li><strong>Time:</strong> {{login_time}}</li>
                <li><strong>Device:</strong> {{device_info.device}}</li>
                <li><strong>Location:</strong> {{device_info.location}}</li>
                <li><strong>Browser:</strong> {{device_info.browser}}</li>
            </ul>
        </div>
        
        {{#if is_new_device}}
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3>⚠️ New Device Detected</h3>
            <p>This login was from a device we haven't seen before. If this wasn't you, please secure your account immediately.</p>
        </div>
        {{/if}}
        
        <p><strong>If this wasn't you:</strong></p>
        <ul>
            <li><a href="{{security_actions.change_password}}">Change your password</a></li>
            <li><a href="{{security_actions.enable_2fa}}">Enable two-factor authentication</a></li>
            <li><a href="{{security_actions.review_devices}}">Review your devices</a></li>
        </ul>
        
        <p>Best regards,<br>The Medh Security Team</p>
    </div>
</body>
</html>
```

## Database Schema

### Quick Login Keys Table
```sql
CREATE TABLE quick_login_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    key_id VARCHAR(255) NOT NULL UNIQUE,
    key_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    created_via VARCHAR(50) DEFAULT 'manual',
    revoked BOOLEAN DEFAULT FALSE,
    rotated BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_quick_login_keys_user_id ON quick_login_keys(user_id);
CREATE INDEX idx_quick_login_keys_key_hash ON quick_login_keys(key_hash);
CREATE INDEX idx_quick_login_keys_expires_at ON quick_login_keys(expires_at);
```

### OAuth Providers in Users Table
```sql
ALTER TABLE users ADD COLUMN oauth_providers JSONB DEFAULT '[]';
CREATE INDEX idx_users_oauth_providers ON users USING GIN (oauth_providers);
``` 