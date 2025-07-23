'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/utils/toastManager';

const OAuthSuccessPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Get the current page data (your backend should provide the OAuth result here)
        // Since we're on the success page, the OAuth should be completed
        
        // Try to get OAuth data from the current page or make API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/success`, {
          method: 'GET',
          credentials: 'include', // Include cookies for session
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('OAuth success data:', result);
          
          if (result.success && result.data) {
            // Store authentication data in localStorage
            const userData = result.data.user;
            const token = result.data.token;
            
            if (token && userData) {
              // Store auth data
              localStorage.setItem('token', token);
              localStorage.setItem('authToken', token);
              localStorage.setItem('userId', userData.id);
              localStorage.setItem('userEmail', userData.email);
              localStorage.setItem('userName', userData.full_name);
              localStorage.setItem('fullName', userData.full_name);
              
              // Extract role from token or use default
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || payload.user?.role || 'student';
                localStorage.setItem('role', Array.isArray(role) ? role[0] : role);
              } catch (e) {
                localStorage.setItem('role', 'student');
              }
              
              setStatus('success');
              showToast.success('🎉 OAuth authentication successful!', { duration: 3000 });
              
              // Check if we have stored callbacks from the login page
              const returnUrl = sessionStorage.getItem('oauth_return_url');
              const provider = sessionStorage.getItem('oauth_provider');
              
              // Clean up session storage
              sessionStorage.removeItem('oauth_return_url');
              sessionStorage.removeItem('oauth_provider');
              
              // Call the success callback if it exists
              if ((window as any).oauthSuccessCallback) {
                try {
                  (window as any).oauthSuccessCallback(result);
                } catch (e) {
                  console.log('Callback execution error:', e);
                }
              }
              
              // Redirect back to login page to complete the authentication flow
              setTimeout(() => {
                if (returnUrl && returnUrl.includes('/login')) {
                  // Add success parameter to indicate OAuth completion
                  const url = new URL(returnUrl);
                  url.searchParams.set('oauth_success', 'true');
                  url.searchParams.set('oauth_provider', provider || 'google');
                  window.location.href = url.toString();
                } else {
                  // Fallback to login page with success indicator
                  router.push('/login?oauth_success=true');
                }
              }, 1500);
              
              return;
            }
          }
        }
        
        // If we reach here, something went wrong
        throw new Error('Failed to get OAuth data');
        
      } catch (error) {
        console.error('OAuth success handling error:', error);
        setStatus('error');
        showToast.error('❌ OAuth authentication failed. Redirecting to login...', { duration: 4000 });
        
        // Clean up session storage
        sessionStorage.removeItem('oauth_return_url');
        sessionStorage.removeItem('oauth_provider');
        
        // Call error callback if it exists
        if ((window as any).oauthErrorCallback) {
          try {
            (window as any).oauthErrorCallback({ message: 'OAuth authentication failed' });
          } catch (e) {
            console.log('Error callback execution error:', e);
          }
        }
        
        // Redirect back to login after error
        setTimeout(() => {
          router.push('/login?oauth_error=true');
        }, 2000);
      }
    };

    handleOAuthSuccess();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {status === 'loading' && 'Completing Authentication...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Failed'}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {status === 'loading' && 'Please wait while we complete your login...'}
          {status === 'success' && 'Taking you to your dashboard...'}
          {status === 'error' && 'Redirecting back to login page...'}
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage; 