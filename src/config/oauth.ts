// OAuth Configuration
// This file contains OAuth-specific configuration for different environments

interface OAuthConfig {
  redirectUri: string;
  baseUrl: string;
  allowedOrigins: string[];
}

interface OAuthProviderConfig {
  google: {
    clientId?: string;
    redirectUri: string;
  };
  github: {
    clientId?: string;
    redirectUri: string;
  };
  facebook: {
    appId?: string;
    redirectUri: string;
  };
}

// Get the current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Base URLs for different environments
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallbacks
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
  
  return process.env.NEXT_PUBLIC_APP_URL || 'https://medh.co';
};

// OAuth redirect URI
const getRedirectUri = (): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/auth/callback`;
};

// OAuth provider configuration
export const oauthConfig: OAuthProviderConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: getRedirectUri()
  },
  github: {
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    redirectUri: getRedirectUri()
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    redirectUri: getRedirectUri()
  }
};

// Allowed origins for OAuth callbacks
export const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://medh.co',
  'https://www.medh.co',
  'https://medh-web.vercel.app'
];

// OAuth configuration helper
export const getOAuthConfig = (provider: keyof OAuthProviderConfig): OAuthConfig => {
  const providerConfig = oauthConfig[provider];
  
  return {
    redirectUri: providerConfig.redirectUri,
    baseUrl: getBaseUrl(),
    allowedOrigins
  };
};

// Validate redirect URI
export const isValidRedirectUri = (uri: string): boolean => {
  try {
    const url = new URL(uri);
    return allowedOrigins.some(origin => uri.startsWith(origin));
  } catch {
    return false;
  }
};

// Debug OAuth configuration (development only)
if (isDevelopment && typeof window !== 'undefined') {
  console.log('🔐 OAuth Configuration:', {
    environment: process.env.NODE_ENV,
    baseUrl: getBaseUrl(),
    redirectUri: getRedirectUri(),
    allowedOrigins,
    providers: {
      google: {
        clientId: oauthConfig.google.clientId ? '✅ Configured' : '❌ Missing',
        redirectUri: oauthConfig.google.redirectUri
      },
      github: {
        clientId: oauthConfig.github.clientId ? '✅ Configured' : '❌ Missing',
        redirectUri: oauthConfig.github.redirectUri
      }
    }
  });
}

export default oauthConfig; 