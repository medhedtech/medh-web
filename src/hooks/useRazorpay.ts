import { useState, useCallback, useEffect, useRef } from 'react';
import { apiBaseUrl, apiUrls } from '@/apis/index';
import axios from 'axios';

// Comprehensive type definitions for Razorpay
export interface RazorpayOptions {
  key: string;
  amount: string | number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    animation?: boolean;
    ondismiss?: () => void;
  };
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  timeout?: number;
  handler?: (response: RazorpayResponse) => void;
  readonly?: boolean;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  [key: string]: any;
}

export interface RazorpayInstance {
  on: (event: string, callback: (response: any) => void) => void;
  open: () => void;
  close: () => void;
}

export interface RazorpayClass {
  new(options: RazorpayOptions): RazorpayInstance;
}

// User details interface
export interface UserDetails {
  _id: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

// Order creation interfaces
export interface CreateOrderPayload {
  amount: number;
  currency: string;
  payment_type: 'course' | 'subscription';
  productInfo: {
    item_name: string;
    description: string;
  };
  course_id?: string;
  enrollment_type?: string;
  is_self_paced?: boolean;
  plan_id?: string;
  plan_name?: string;
  duration_months?: number;
  original_currency?: string;
  price_id?: string;
}

export interface OrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
}

// Payment verification interface
export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface UseRazorpayReturn {
  loadRazorpayScript: () => Promise<boolean>;
  openRazorpayCheckout: (options: RazorpayOptions) => Promise<void>;
  openRazorpayWithUserDetails: (
    options: Omit<RazorpayOptions, 'prefill'>, 
    userId: string
  ) => Promise<void>;
  makePayment: (
    options: Omit<RazorpayOptions, 'prefill'>,
    userIdOrDetails?: string | UserDetails | null
  ) => Promise<void>;
  processPayment: (
    payload: CreateOrderPayload,
    successCallback?: (data: any) => void,
    errorCallback?: (error: string) => void
  ) => Promise<void>;
  verifyPayment: (
    payload: VerifyPaymentPayload,
    successCallback?: (data: any) => void,
    errorCallback?: (error: string) => void
  ) => Promise<any>;
  fetchRazorpayKey: () => Promise<string>;
  isScriptLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

/**
 * A production-ready React hook to integrate Razorpay payment gateway in your application
 * with special handling for authenticated users and complete payment flow
 * 
 * Features:
 * - Optimized script loading with caching
 * - Error recovery and resilience
 * - Comprehensive type checking
 * - Security validation
 * - Performance optimized
 * - Integration with Medh user API
 * - Smart detection of logged-in users
 * - Complete flow for order creation and payment verification
 * 
 * @returns {UseRazorpayReturn} Methods and state for Razorpay integration
 * 
 * @example
 * // Complete order flow
 * const { processPayment, isLoading, error } = useRazorpay();
 * 
 * const handlePayment = async () => {
 *   try {
 *     await processPayment({
 *       amount: 9900, // amount in lowest currency unit (99.00)
 *       currency: 'INR',
 *       payment_type: 'course',
 *       productInfo: {
 *         item_name: 'Course Enrollment',
 *         description: 'Enrollment for course XYZ'
 *       },
 *       course_id: 'course123',
 *       enrollment_type: 'individual',
 *       is_self_paced: true
 *     }, 
 *     (data) => {
 *       console.log('Payment successful!', data);
 *       // Handle success
 *     },
 *     (error) => {
 *       console.error('Payment failed:', error);
 *       // Handle error
 *     });
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 */
export const useRazorpay = (): UseRazorpayReturn => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  
  // ---------------------------------------------------------------------------
  // ENV-BASED & USER-BASED TEST KEY OVERRIDE
  // ---------------------------------------------------------------------------
  const RAZORPAY_TEST_KEY = process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY || 'rzp_test_REPLACE_ME';
  const RAZORPAY_ENV = process.env.NEXT_PUBLIC_RAZORPAY_ENV || 'live'; // 'live' | 'test'
  
  /**
   * Determines whether we should force the Razorpay sandbox key.
   */
  const shouldUseTestKey = useCallback((): boolean => {
    if (RAZORPAY_ENV.toLowerCase() === 'test') return true;

    try {
      if (typeof window !== 'undefined') {
        const uid = localStorage.getItem('userId');
        return uid === '67cfe3a9a50dbb995b4d94da';
      }
    } catch (err) {
      // ignore storage errors
    }
    return false;
  }, []);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user is authenticated on initialization
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
    }
    return false;
  });
  
  // Use refs to avoid stale closures and memory leaks
  const scriptLoadAttempts = useRef<number>(0);
  const maxRetryAttempts = 3;
  const razorpayInstanceRef = useRef<any>(null);
  
  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
      setIsAuthenticated(hasToken);
    };
    
    // Check on mount
    checkAuth();
    
    // Listen for storage events (if user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Close any open checkout if component unmounts
      if (razorpayInstanceRef.current) {
        try {
          razorpayInstanceRef.current.close();
        } catch (err) {
          // Ignore errors when closing on unmount
        }
      }
    };
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const loadRazorpayScript = useCallback(async (): Promise<boolean> => {
    if (isLoading) return false;
    
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return true;
    }
    
    // Prevent additional attempts if max retries reached
    if (scriptLoadAttempts.current >= maxRetryAttempts) {
      setError(`Failed to load payment gateway after ${maxRetryAttempts} attempts. Please refresh the page and try again.`);
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    scriptLoadAttempts.current += 1;

    return new Promise<boolean>((resolve) => {
      try {
        // Check if script is already in DOM but not loaded
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-loaded', 'false');
        
        // Set timeout to prevent hanging forever
        const timeoutId = setTimeout(() => {
          if (script.getAttribute('data-loaded') !== 'true') {
            console.error('Razorpay script load timed out');
            setError('Payment gateway loading timed out. Please check your internet connection and try again.');
            setIsLoading(false);
            resolve(false);
          }
        }, 10000); // 10 seconds timeout
        
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          clearTimeout(timeoutId);
          setIsScriptLoaded(true);
          setIsLoading(false);
          resolve(true);
        };
        
        script.onerror = (error) => {
          console.error('Razorpay script loading failed:', error);
          clearTimeout(timeoutId);
          const errorMessage = 'Failed to load payment gateway. Please check your internet connection or try again later.';
          setError(errorMessage);
          setIsLoading(false);
          resolve(false);
          
          // Retry loading after delay if below max attempts
          if (scriptLoadAttempts.current < maxRetryAttempts) {
            setTimeout(() => {
              loadRazorpayScript().catch(() => {
                // Catch and ignore errors from retries
              });
            }, 2000); // 2 second delay before retry
          }
        };
        
        document.body.appendChild(script);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading the payment gateway';
        console.error('Razorpay initialization error:', err);
        setError(errorMessage);
        setIsLoading(false);
        resolve(false);
      }
    });
  }, [isLoading]);

  /**
   * Fetches the Razorpay key from the backend
   * @returns The Razorpay key
   */
  const fetchRazorpayKey = useCallback(async (): Promise<string> => {
    // 1. Instant return if test key is forced
    if (shouldUseTestKey()) {
      if (!RAZORPAY_TEST_KEY || RAZORPAY_TEST_KEY.includes('REPLACE_ME')) {
        console.warn('[Razorpay] Test mode requested but NEXT_PUBLIC_RAZORPAY_TEST_KEY is missing. Falling back to live key from backend.');
      } else {
        setRazorpayKey(RAZORPAY_TEST_KEY);
        return RAZORPAY_TEST_KEY;
      }
    }

    // 2. Return cached key if we already have it
    if (razorpayKey) {
      return razorpayKey;
    }

    // 3. Otherwise fetch from backend (live key in most cases)
    try {
      const response = await axios.get(`${apiBaseUrl}/payments/key`, {
        headers: {
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (response.data?.data?.key) {
        const key = response.data.data.key;
        setRazorpayKey(key);
        return key;
      }
      throw new Error('Invalid response format from server');
    } catch (err) {
      console.error('Error fetching Razorpay key:', err);
      setError('Failed to fetch payment gateway configuration');
      throw err;
    }
  }, [razorpayKey]);

  /**
   * Gets the current logged-in user ID from local storage or session storage
   * @returns The user ID or null if not logged in
   */
  const getCurrentUserId = useCallback((): string | null => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id || null;
      }
      return null;
    } catch (err) {
      console.error('Error getting current user ID:', err);
      return null;
    }
  }, []);

  /**
   * Gets the current user details from local storage or session storage
   * @returns The user details or null if not logged in
   */
  const getCurrentUserDetails = useCallback((): UserDetails | null => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (err) {
      console.error('Error getting current user details:', err);
      return null;
    }
  }, []);

  /**
   * Fetches user details from the Medh API
   * @param userId - The user ID to fetch details for
   * @returns User details object or null if fetch fails
   */
  const fetchUserDetails = useCallback(async (userId: string): Promise<UserDetails | null> => {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch user details');
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is required to fetch user details');
      }

      const response = await fetch(`${apiBaseUrl}${apiUrls.user.getDetailsbyId}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data?.status === 'success' && data?.data?.user) {
        return data.data.user;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      return null;
    }
  }, []);

  /**
   * Creates a Razorpay order through the backend
   * @param payload - The order creation payload
   * @returns The order response
   */
  const createOrder = useCallback(async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Add original currency and price information if available
      const enhancedPayload = {
        ...payload,
        // Make sure we include any original currency information
        original_currency: payload.original_currency || payload.currency,
        // Don't convert the amount unless explicitly requested
        currency: payload.currency || 'INR',
        // Add metadata to help with debugging
        source: 'web',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
      };
      
      const response = await axios.post(`${apiBaseUrl}/payments/create-order`, enhancedPayload, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (response.data?.status === 'success' && response.data?.data) {
        return response.data.data;
      }
      
      throw new Error('Failed to create payment order');
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment order';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Verifies a Razorpay payment through the backend
   * @param payload - The payment verification payload
   * @returns The verification response
   */
  const verifyPayment = useCallback(async (
    payload: VerifyPaymentPayload,
    successCallback?: (data: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<any> => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await axios.post(`${apiBaseUrl}/payments/verify-payment`, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (response.data?.status === 'success') {
        successCallback && successCallback(response.data);
        return response.data;
      }
      
      throw new Error('Payment verification failed');
    } catch (err) {
      console.error('Error verifying payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      errorCallback && errorCallback(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const openRazorpayCheckout = useCallback(async (options: RazorpayOptions): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load script if not already loaded
      if (!isScriptLoaded && !(await loadRazorpayScript())) {
        throw new Error('Failed to load payment gateway script');
      }
      
      // Sanitize and validate options
      const sanitizedOptions: RazorpayOptions = {
        ...options,
        // Ensure amount is properly formatted (string or number)
        amount: typeof options.amount === 'string' ? options.amount : options.amount.toString(),
        // Set secure defaults
        modal: {
          ...options.modal,
          escape: options.modal?.escape ?? true,
        }
      };
      
      // Required field validation
      if (!sanitizedOptions.key) throw new Error('Payment gateway key is required');
      if (!sanitizedOptions.amount) throw new Error('Payment amount is required');
      if (!sanitizedOptions.currency) throw new Error('Currency is required');
      if (!sanitizedOptions.name) throw new Error('Business/merchant name is required');
      
      // Add metadata to help with debugging
      if (!sanitizedOptions.notes) {
        sanitizedOptions.notes = {};
      }
      sanitizedOptions.notes._source = 'Medh Web App';
      sanitizedOptions.notes._version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
      
      // Create Razorpay instance with enhanced error handling
      const razorpayInstance = new window.Razorpay(sanitizedOptions);
      razorpayInstanceRef.current = razorpayInstance;
      
      // Add event listeners for all important events
      razorpayInstance.on('payment.success', (response: any) => {
        console.log('Payment successful:', response);
      });
      
      razorpayInstance.on('payment.failed', (response: any) => {
        const errorMessage = response.error?.description || 'Payment failed';
        console.error('Payment failed:', response.error);
        setError(errorMessage);
      });
      
      // Safeguard against modal dismiss errors
      const originalOnDismiss = sanitizedOptions.modal?.ondismiss;
      razorpayInstance.on('modal.ondismiss', () => {
        try {
          if (originalOnDismiss) {
            originalOnDismiss();
          }
        } catch (err) {
          console.error('Error in modal dismiss handler:', err);
        } finally {
          setIsLoading(false);
        }
      });
      
      // Open the checkout
      razorpayInstance.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred with the payment gateway';
      console.error('Payment checkout error:', err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [isScriptLoaded, loadRazorpayScript]);

  /**
   * Opens Razorpay checkout with user details fetched from the API
   * @param options - Razorpay options without prefill (will be added automatically)
   * @param userId - The user ID to fetch details for
   */
  const openRazorpayWithUserDetails = useCallback(async (
    options: Omit<RazorpayOptions, 'prefill'>, 
    userId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user details from API
      const userDetails = await fetchUserDetails(userId);
      
      if (!userDetails) {
        throw new Error('Could not fetch user details. Please try again later.');
      }
      
      // Prepare prefill data from user details
      const prefill = {
        name: userDetails.full_name || userDetails.name || '',
        email: userDetails.email || '',
        contact: userDetails.phone || '',
      };
      
      // Open Razorpay checkout with user details
      await openRazorpayCheckout({
        ...options,
        prefill,
        notes: {
          ...options.notes,
          user_id: userId,
        }
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while preparing payment';
      console.error('User details fetch error:', err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [fetchUserDetails, openRazorpayCheckout]);

  /**
   * Smart payment method that adapts based on authentication status
   * - If user details are directly provided, uses them
   * - If userId is provided, fetches details from API
   * - If user is logged in, gets current user details
   * - Otherwise, uses provided options without prefill
   * 
   * @param options - Razorpay options (without prefill if using authenticated flow)
   * @param userIdOrDetails - Optional user ID, user details object, or null to auto-detect
   */
  const makePayment = useCallback(async (
    options: Omit<RazorpayOptions, 'prefill'>,
    userIdOrDetails?: string | UserDetails | null
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Case 1: User details object is directly provided
      if (userIdOrDetails && typeof userIdOrDetails !== 'string') {
        const userDetails = userIdOrDetails as UserDetails;
        
        await openRazorpayCheckout({
          ...options,
          prefill: {
            name: userDetails.full_name || userDetails.name || '',
            email: userDetails.email || '',
            contact: userDetails.phone || '',
          },
          notes: {
            ...options.notes,
            user_id: userDetails._id,
          }
        });
        return;
      }
      
      // Case 2: User ID is explicitly provided
      if (userIdOrDetails && typeof userIdOrDetails === 'string') {
        await openRazorpayWithUserDetails(options, userIdOrDetails);
        return;
      }
      
      // Case 3: Auto-detect if user is logged in
      if (isAuthenticated) {
        const userDetails = getCurrentUserDetails();
        if (userDetails) {
          await openRazorpayCheckout({
            ...options,
            prefill: {
              name: userDetails.full_name || userDetails.name || '',
              email: userDetails.email || '',
              contact: userDetails.phone || '',
            },
            notes: {
              ...options.notes,
              user_id: userDetails._id,
            }
          });
          return;
        }
        
        const userId = getCurrentUserId();
        if (userId) {
          await openRazorpayWithUserDetails(options, userId);
          return;
        }
      }
      
      // Case 4: Fallback to default checkout without prefill (guest user)
      await openRazorpayCheckout({
        ...options,
        prefill: {},
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while preparing payment';
      console.error('Payment error:', err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [isAuthenticated, getCurrentUserId, getCurrentUserDetails, openRazorpayWithUserDetails, openRazorpayCheckout]);

  /**
   * Complete payment processing flow - creates order, handles payment, and verifies
   * @param payload - The payment payload with all details
   * @param successCallback - Callback for successful payment
   * @param errorCallback - Callback for payment errors
   */
  const processPayment = useCallback(async (
    payload: CreateOrderPayload,
    successCallback?: (data: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Fetch Razorpay key
      const key = await fetchRazorpayKey();
      
      // 2. Create order - this should maintain the original currency
      const order = await createOrder(payload);
      
      // 3. Get user details if authenticated
      let userDetails: UserDetails | null = null;
      if (isAuthenticated) {
        userDetails = getCurrentUserDetails();
      }
      
      // 4. Setup payment handler
      const handlePaymentSuccess = (response: RazorpayResponse) => {
        verifyPayment(
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          },
          successCallback,
          errorCallback
        ).catch(error => {
          console.error('Payment verification failed:', error);
          errorCallback && errorCallback('Payment verification failed');
        });
      };
      
      // 5. Configure Razorpay options with original currency
      const options: RazorpayOptions = {
        key,
        amount: order.amount.toString(),
        currency: order.currency, // Use the currency from the order
        name: 'MEDH',
        description: payload.productInfo.description,
        order_id: order.id,
        handler: handlePaymentSuccess,
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            errorCallback && errorCallback('Payment cancelled');
          }
        },
        notes: {
          payment_type: payload.payment_type,
          ...(payload.course_id && { course_id: payload.course_id }),
          ...(payload.enrollment_type && { enrollment_type: payload.enrollment_type }),
          ...(payload.price_id && { price_id: payload.price_id }),
          original_currency: payload.original_currency || payload.currency,
          _source: 'web'
        }
      };
      
      // 6. Make payment with appropriate user context
      await makePayment(options, userDetails);
      
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      console.error('Payment processing error:', err);
      setError(errorMessage);
      errorCallback && errorCallback(errorMessage);
    }
  }, [fetchRazorpayKey, createOrder, isAuthenticated, getCurrentUserDetails, verifyPayment, makePayment]);

  return {
    loadRazorpayScript,
    openRazorpayCheckout,
    openRazorpayWithUserDetails,
    makePayment,
    processPayment,
    verifyPayment,
    fetchRazorpayKey,
    isScriptLoaded,
    isLoading,
    error,
    resetError,
    isAuthenticated,
    setIsAuthenticated
  };
};

// Add type declaration for window.Razorpay
declare global {
  interface Window {
    Razorpay: RazorpayClass;
  }
}

export default useRazorpay; 