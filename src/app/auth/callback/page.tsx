"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, ArrowRight, UserCheck, Mail, Shield } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { authUtils, IOAuthUserData } from '@/apis/auth.api';

interface IOAuthCallbackData {
  token?: string;
  refresh_token?: string;
  user?: IOAuthUserData;
  account_merged?: boolean;
  profile_updated?: boolean;
  email_verified?: boolean;
  email_conflicts?: Array<{
    oauth_email: string;
    user_email: string;
    provider: string;
  }>;
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

        // Exchange code for tokens with the backend
        try {
          // Import the API base URL from our centralized config
import { apiBaseUrl } from '../../../apis/config';
          const response = await fetch(`${apiBaseUrl}/api/v1/auth/oauth/callback`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              code, 
              state, 
              provider,
              redirect_uri: window.location.origin + '/auth/callback'
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const backendResponse = await response.json();

          if (!backendResponse || !backendResponse.success) {
            throw new Error(backendResponse?.message || 'OAuth authentication failed');
          }

          console.log('✅ OAuth Backend Response:', backendResponse);
          
          // Extract user data from your backend response structure
          const userData = {
            id: backendResponse.data.user.id,
            email: backendResponse.data.user.email,
            full_name: backendResponse.data.user.full_name,
            first_name: backendResponse.data.user.full_name?.split(' ')[0] || '',
            last_name: backendResponse.data.user.full_name?.split(' ').slice(1).join(' ') || '',
            profile_picture: backendResponse.data.user.user_image?.url,
            email_verified: backendResponse.data.user.email_verified,
            provider,
            provider_id: backendResponse.data.user.id,
            role: ['student'], // Default role
            permissions: [],
            access_token: backendResponse.data.token,
            refresh_token: backendResponse.data.refresh_token || '',
            session_id: backendResponse.data.session_id || '',
            account_merged: backendResponse.data.oauth?.total_connected > 1,
            profile_updated: backendResponse.data.user.profile_completion > 0,
            email_conflicts: []
          };

          setStatus('success');
          
          // Enhanced success message based on account status
          let successMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful!`;
          
          if (userData.account_merged) {
            successMessage += ' Your existing account has been linked.';
          }
          
          if (userData.email_verified) {
            successMessage += ' Email verified.';
          }
          
          setMessage(successMessage);

          // Send enhanced success data to parent window if in popup
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth_success',
              data: {
                ...backendResponse.data,
                user: userData,
                provider,
                account_merged: userData.account_merged,
                profile_updated: userData.profile_updated,
                email_verified: userData.email_verified,
                email_conflicts: userData.email_conflicts
              }
            }, window.location.origin);
            
            // Close popup after a short delay
            setTimeout(() => {
              window.close();
            }, 1500);
            return;
          }

          // If not in popup, handle redirect manually
          // Store enhanced auth data and redirect
          if (backendResponse.data.token && userData) {
            // Store authentication data
            localStorage.setItem('token', backendResponse.data.token);
            localStorage.setItem('refresh_token', userData.refresh_token || '');
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userName', userData.full_name);
            localStorage.setItem('role', userData.role[0] || 'student');

            // Store enhanced OAuth metadata
            if (userData.account_merged) {
              localStorage.setItem('oauth_account_merged', 'true');
            }
            if (userData.profile_updated) {
              localStorage.setItem('oauth_profile_updated', 'true');
            }
            if (userData.email_conflicts && userData.email_conflicts.length > 0) {
              localStorage.setItem('oauth_email_conflicts', JSON.stringify(userData.email_conflicts));
            }

            // Enhanced success toast with account status
            let toastMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`;
            if (userData.account_merged) {
              toastMessage += ' Account linked successfully.';
            }
            
            showToast.success(toastMessage);
            
            // Show additional notifications for important events
            if (userData.email_verified) {
              showToast.success('✅ Email verified through OAuth!', { duration: 4000 });
            }
            
            if (userData.email_conflicts && userData.email_conflicts.length > 0) {
              showToast.info(`📧 Email conflicts detected. Please check your account settings.`, { duration: 6000 });
            }
            
            // Redirect to dashboard
            setTimeout(() => {
              const role = userData.role[0] || 'student';
              const dashboardPath = role === 'admin' ? '/dashboards/admin' : 
                                   role === 'instructor' ? '/dashboards/instructor' : 
                                   '/dashboards/student';
              router.push(dashboardPath);
            }, 2000);
          }

        } catch (apiError: any) {
          console.error('OAuth API error:', apiError);
          setStatus('error');
          setMessage(apiError.message || 'Failed to complete authentication with server');
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth_error',
              error: {
                message: apiError.message || 'Failed to complete authentication with server'
              }
            }, window.location.origin);
            window.close();
            return;
          }
          
          setTimeout(() => {
            router.push('/login?error=' + encodeURIComponent(apiError.message || 'Authentication failed'));
          }, 3000);
          return;
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
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-green-400/20 dark:bg-green-600/20 rounded-full animate-pulse"></div>
              <CheckCircle className="relative w-12 h-12 text-green-500 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Success!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {message}
            </p>
            
            {/* Enhanced status indicators */}
            <div className="space-y-2 mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <UserCheck className="h-4 w-4" />
                <span>Account authenticated</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Shield className="h-4 w-4" />
                <span>Secure OAuth connection</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Mail className="h-4 w-4" />
                <span>Email verified</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2">
              <span>Redirecting to dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
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