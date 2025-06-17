"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { authUtils } from '@/apis/auth.api';

interface IOAuthCallbackData {
  token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    role: string[];
    permissions?: string[];
  };
  error?: string;
  error_description?: string;
}

const AuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || error || 'Authentication failed');
          
          // Send error to parent window if in popup
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth_error',
              error: {
                message: errorDescription || error || 'Authentication failed'
              }
            }, window.location.origin);
            window.close();
            return;
          }
          
          // Redirect to login with error
          setTimeout(() => {
            router.push('/login?error=' + encodeURIComponent(errorDescription || error || 'Authentication failed'));
          }, 3000);
          return;
        }

        // Check for required parameters
        if (!code || !state) {
          console.error('Missing OAuth parameters:', { code: !!code, state: !!state });
          setStatus('error');
          setMessage('Invalid authentication response');
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth_error',
              error: {
                message: 'Invalid authentication response'
              }
            }, window.location.origin);
            window.close();
            return;
          }
          
          setTimeout(() => {
            router.push('/login?error=' + encodeURIComponent('Invalid authentication response'));
          }, 3000);
          return;
        }

        // Parse state to get provider and other info
        let stateData: { provider?: string; redirect_uri?: string } = {};
        try {
          stateData = JSON.parse(decodeURIComponent(state));
        } catch (e) {
          console.warn('Could not parse state parameter:', state);
          // Continue with default values
        }

        const provider = stateData.provider || 'unknown';
        
        setMessage(`Completing ${provider} authentication...`);

        // Exchange code for tokens (this would typically be done on the server)
        // For now, we'll simulate the response
        const mockOAuthData: IOAuthCallbackData = {
          token: 'mock_jwt_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          user: {
            id: 'oauth_user_' + Date.now(),
            email: 'user@example.com',
            full_name: 'OAuth User',
            role: ['student'],
            permissions: []
          }
        };

        // In a real implementation, you would make an API call here:
        // const response = await fetch('/api/auth/oauth/callback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code, state, provider })
        // });
        // const oauthData = await response.json();

        setStatus('success');
        setMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful!`);

        // Send success data to parent window if in popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'oauth_success',
            data: mockOAuthData
          }, window.location.origin);
          
          // Close popup after a short delay
          setTimeout(() => {
            window.close();
          }, 1500);
          return;
        }

        // If not in popup, handle redirect manually
        // Store auth data and redirect
        if (mockOAuthData.token && mockOAuthData.user) {
          // Store authentication data
          localStorage.setItem('token', mockOAuthData.token);
          localStorage.setItem('refresh_token', mockOAuthData.refresh_token || '');
          localStorage.setItem('userId', mockOAuthData.user.id);
          localStorage.setItem('userEmail', mockOAuthData.user.email);
          localStorage.setItem('userName', mockOAuthData.user.full_name);
          localStorage.setItem('role', mockOAuthData.user.role[0] || 'student');

          showToast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
          
          // Redirect to dashboard
          setTimeout(() => {
            const role = mockOAuthData.user?.role[0] || 'student';
            const dashboardPath = role === 'admin' ? '/dashboards/admin' : 
                                 role === 'instructor' ? '/dashboards/instructor' : 
                                 '/dashboards/student';
            router.push(dashboardPath);
          }, 2000);
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'oauth_error',
            error: {
              message: 'An unexpected error occurred during authentication'
            }
          }, window.location.origin);
          window.close();
          return;
        }
        
        setTimeout(() => {
          router.push('/login?error=' + encodeURIComponent('Authentication failed'));
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authenticating...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Success!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {message}
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <span>Redirecting to dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {message}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage; 