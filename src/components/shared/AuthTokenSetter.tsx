'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { showToast } from '@/utils/toastManager';

interface AuthTokenSetterProps {
  token?: string;
  children: React.ReactNode;
}

/**
 * Component that sets authentication token from props or URL
 * This can be used to wrap components that need authentication
 */
const AuthTokenSetter: React.FC<AuthTokenSetterProps> = ({ token, children }) => {
  const { setToken, isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const setAuthFromSource = () => {
      // Try using the token passed as prop
      if (token) {
        setToken(token);
        return;
      }

      // Try to parse token from URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token') || urlParams.get('x-access-token') || urlParams.get('access_token');
      
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        return;
      }

      // Try to get token from URL hash if present in format #access-token=xyz
      if (window.location.hash.includes('access-token')) {
        const hashMatch = window.location.hash.match(/access-token=([^&]*)/);
        if (hashMatch && hashMatch[1]) {
          setToken(hashMatch[1]);
          return;
        }
      }

      // Try extracting from request headers (though not usually accessible in browser)
      // This is a fallback and likely won't work directly in the browser
      const headerTokenValue = document.querySelector('meta[name="x-access-token"]')?.getAttribute('content');
      if (headerTokenValue) {
        setToken(headerTokenValue);
      }
    };

    setAuthFromSource();
    setInitialized(true);
  }, [setToken, token, initialized]);

  // Handle token extraction specifically from the x-access-token header mentioned in the error
  useEffect(() => {
    if (!isAuthenticated) {
      // For demonstration, prompt user to manually enter the token
      // This would only happen if all automatic methods fail
      const promptForToken = () => {
        // Only offer this option if user is on a secure page that should already be authenticated
        const manualToken = prompt(
          "Authentication required. Please enter your access token:"
        );
        if (manualToken) {
          setToken(manualToken);
          showToast.success("Token set manually");
        }
      };

      // Uncomment this line to enable manual token entry if needed
      // promptForToken();
    }
  }, [isAuthenticated, setToken]);

  return <>{children}</>;
};

export default AuthTokenSetter; 