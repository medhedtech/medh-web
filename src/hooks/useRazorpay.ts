import { useState, useCallback } from 'react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface UseRazorpayReturn {
  loadRazorpayScript: () => Promise<boolean>;
  openRazorpayCheckout: (options: RazorpayOptions) => Promise<void>;
  isScriptLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useRazorpay = (): UseRazorpayReturn => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (window.Razorpay) {
      setIsScriptLoaded(true);
      setIsLoading(false);
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        setIsScriptLoaded(true);
        setIsLoading(false);
        resolve(true);
      };
      
      script.onerror = () => {
        setError('Failed to load Razorpay script');
        setIsLoading(false);
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  }, []);

  const openRazorpayCheckout = useCallback(async (options: RazorpayOptions): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load script if not already loaded
      if (!isScriptLoaded && !(await loadRazorpayScript())) {
        throw new Error('Failed to load Razorpay script');
      }
      
      // Create Razorpay instance and open checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with Razorpay');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isScriptLoaded, loadRazorpayScript]);

  return {
    loadRazorpayScript,
    openRazorpayCheckout,
    isScriptLoaded,
    isLoading,
    error
  };
};

// Add type declaration for window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default useRazorpay; 