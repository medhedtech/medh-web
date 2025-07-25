import { apiClient } from '../apis/apiClient';
import { apiBaseUrl } from '@/apis';

/**
 * Interface for CORS test results
 */
export interface CorsTestResult {
  success: boolean;
  message: string;
  details?: {
    allowOrigin?: string;
    allowMethods?: string;
    allowHeaders?: string;
    allowCredentials?: string;
    maxAge?: string;
    [key: string]: string | undefined;
  };
  error?: string;
}

/**
 * Tests the CORS configuration by making an OPTIONS request to the API
 * This can be used to verify if CORS is properly configured
 */
export const testCorsConfiguration = async (): Promise<CorsTestResult> => {
  try {
    // Make an OPTIONS request to test CORS
    const response = await fetch(`${apiBaseUrl}/cors-test`, {
      method: 'OPTIONS',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Extract CORS headers
    const corsHeaders = {
      allowOrigin: response.headers.get('Access-Control-Allow-Origin') || undefined,
      allowMethods: response.headers.get('Access-Control-Allow-Methods') || undefined,
      allowHeaders: response.headers.get('Access-Control-Allow-Headers') || undefined,
      allowCredentials: response.headers.get('Access-Control-Allow-Credentials') || undefined,
      maxAge: response.headers.get('Access-Control-Max-Age') || undefined
    };

    // Check if CORS is configured correctly
    if (corsHeaders.allowOrigin) {
      return {
        success: true,
        message: 'CORS is properly configured',
        details: corsHeaders
      };
    } else {
      return {
        success: false,
        message: 'CORS headers are missing in the response',
        details: corsHeaders
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'CORS test failed',
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Checks if the observed error is likely a CORS error
 */
export const isCorsError = (error: any): boolean => {
  if (!error) return false;
  
  // Network errors are often CORS-related
  if (error.message && typeof error.message === 'string' &&
      (error.message.includes('Network Error') || 
       error.message.includes('Failed to fetch') ||
       error.message.includes('CORS'))) {
    return true;
  }
  
  // Status 0 is often a CORS error
  if (error.response && error.response.status === 0) {
    return true;
  }
  
  // Explicit CORS errors
  if (error.isCorsError) {
    return true;
  }
  
  return false;
};

/**
 * Diagnoses potential CORS issues by checking various common causes
 */
export const diagnoseCorsIssue = async (url = `${apiBaseUrl}/cors-test`): Promise<string[]> => {
  const issues: string[] = [];
  
  try {
    // Try without credentials first
    const noCreds = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (noCreds.ok) {
      issues.push('API works without credentials but fails with credentials. This suggests a configuration issue with Access-Control-Allow-Credentials.');
    }
  } catch (error) {
    // Both ways fail - likely a fundamental CORS issue
  }

  // Check preflight
  try {
    await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      }
    });
  } catch (error) {
    issues.push('Preflight OPTIONS request failed. This suggests the server is not handling OPTIONS requests correctly.');
  }
  
  // Check for allowed origins
  const origin = window.location.origin;
  if (origin.includes('localhost')) {
    issues.push('You are using a localhost origin. Make sure your API server explicitly allows localhost origins in development.');
  }
  
  if (issues.length === 0) {
    issues.push('No specific CORS issues detected. The server may need to explicitly allow your origin: ' + origin);
  }
  
  return issues;
};

/**
 * Generates a full CORS diagnostic report
 */
export const generateCorsReport = async (): Promise<{
  browserInfo: Record<string, string>;
  diagnostics: string[];
  testResults: CorsTestResult;
}> => {
  // Collect browser and environment info
  const browserInfo = {
    userAgent: navigator.userAgent,
    origin: window.location.origin,
    targetApi: apiBaseUrl,
    protocol: window.location.protocol,
    hasCredentials: String(navigator.cookieEnabled),
    timestamp: new Date().toISOString()
  };
  
  // Run diagnostics
  const diagnostics = await diagnoseCorsIssue();
  const testResults = await testCorsConfiguration();
  
  return {
    browserInfo,
    diagnostics,
    testResults
  };
};

export default {
  testCorsConfiguration,
  isCorsError,
  diagnoseCorsIssue,
  generateCorsReport
}; 