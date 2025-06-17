"use client";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import LogIn from "@/assets/images/log-sign/logIn.png";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle, AlertCircle, Sparkles, ArrowRight, ChevronLeft, Home, Check } from "lucide-react";
import { Github } from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import { useStorage } from "@/contexts/StorageContext";
import FixedShadow from "../others/FixedShadow";
import { events } from "@/utils/analytics";
import { useTheme } from "next-themes";
import OTPVerification from './OTPVerification';
import { 
  sanitizeAuthData, 
  storeAuthData, 
  saveUserId, 
  saveAuthToken,
  isRememberMeEnabled,
  getRememberedEmail,
  setRememberMe
} from "@/utils/auth";
import { authAPI, authUtils, ILoginData, ILoginResponse } from "@/apis/auth.api";

interface FormInputs {
  email: string;
  password: string;
  agree_terms: boolean;
}

// Extended JWT payload interface for our custom token structure
interface MedhJwtPayload extends JwtPayload {
  user?: {
    role?: string | string[];
    full_name?: string;
    [key: string]: any;
  };
  role?: string | string[];
  [key: string]: any;
}

// Update the interfaces to match the exact API response structure
interface LoginResponseData {
  id: string;
  email: string;
  full_name: string;
  role?: string[] | string; // Support both array and string formats
  permissions?: string[];
  access_token?: string;
  token?: string; // Alternative token field
  refresh_token?: string;
  session_id?: string; // Alternative to refresh_token
  emailVerified?: boolean; // Add email verification status
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

// Interface for the actual API response structure you're using
interface IActualLoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    full_name: string;
    role: string[];
    permissions: string[];
    access_token: string;
    refresh_token: string;
    login_stats?: {
      login_count: number;
      last_login: string;
      session_id: string;
    };
  };
}

// Update the interfaces for auth data
interface AuthData {
  token: string;
  refresh_token: string;
  id: string;
  full_name: string;
  email: string;
}

interface StorageManagerLoginData {
  token: string;
  refresh_token: string;
  userId: string;
  email: string;
  password?: string;
  role?: string;
  fullName?: string;
  permissions?: string[];
  rememberMe?: boolean;
}

const schema = yup
  .object({
    email: yup.string().trim().email("Please enter a valid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms to proceed"),
  })
  .required();

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('from') || '';
  const redirectPath = redirectParam ? decodeURIComponent(redirectParam) : '';
  const { postQuery, loading } = usePostQuery();
  const storageManager = useStorage();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [prefilledValues, setPrefilledValues] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  // Add email verification states
  const [showOTPVerification, setShowOTPVerification] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [pendingLoginData, setPendingLoginData] = useState<LoginResponseData | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOAuthLoading, setIsOAuthLoading] = useState<{ [key: string]: boolean }>({});
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    reset,
    getValues,
    clearErrors
  } = useForm<FormInputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: prefilledValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Sanitize any invalid auth data when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sanitizeAuthData();
    }
  }, []);

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Prefill email from auth utility if remember me was previously enabled
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRemembered = isRememberMeEnabled();
      const rememberedEmail = getRememberedEmail();
      
      if (isRemembered && rememberedEmail) {
        setPrefilledValues({
          email: rememberedEmail,
          password: "", // For security, don't prefill password in the form
        });
        setRememberMe(true);
      }
      
      // Also check the storage manager as a fallback during transition
      if (!rememberedEmail) {
        const rememberedUser = storageManager.getCurrentUser();
        const isStorageRemembered = storageManager.getPreference(storageManager.STORAGE_KEYS.REMEMBER_ME, false);
        
        if (isStorageRemembered && rememberedUser && rememberedUser.email) {
          setPrefilledValues({
            email: rememberedUser.email,
            password: "", // For security, don't prefill password in the form
          });
          setRememberMe(true);
        }
      }
    }
  }, [storageManager]);

  // Update form values when prefilledValues change
  useEffect(() => {
    if (prefilledValues.email) {
      setValue("email", prefilledValues.email, { shouldValidate: true });
      setValue("password", prefilledValues.password);
      // Clear email error if value exists
      if (errors.email && prefilledValues.email) {
        clearErrors("email");
      }
    }
  }, [prefilledValues, setValue, errors.email, clearErrors]);

  // Initialize theme to light if not set
  useEffect(() => {
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);

  const handleRecaptchaChange = (value: string): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  // Update onChange handler
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  // Create a reference for focusing after errors
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Optimized role-based dashboard routing with memoization
  const rolePathCache = useMemo(() => new Map<string, string>(), []);
  
  const getRoleBasedRedirectPath = useCallback((role: string): string => {
    if (!role || typeof role !== 'string') {
      return "/dashboards/student";
    }

    const roleLower = role.toLowerCase().trim();
    
    // Check cache first for performance
    if (rolePathCache.has(roleLower)) {
      return rolePathCache.get(roleLower)!;
    }

    // Optimized role mapping with most common roles first
    let dashboardPath: string;
    
    // Fast switch-case for common roles
    switch (roleLower) {
      case "student":
      case "learner":
      case "user":
        dashboardPath = "/dashboards/student";
        break;
      case "admin":
      case "super-admin":
      case "superadmin":
      case "administrator":
      case "super_admin":
        dashboardPath = "/dashboards/admin";
        break;
      case "instructor":
      case "teacher":
      case "tutor":
      case "faculty":
        dashboardPath = "/dashboards/instructor";
        break;
      case "corporate":
      case "coorporate":
      case "corporate-admin":
      case "coorporate-admin":
      case "company":
      case "enterprise":
        dashboardPath = "/dashboards/coorporate-dashboard";
        break;
      case "corporate-student":
      case "coorporate-student":
      case "corporate-employee":
      case "coorporate-employee":
      case "employee":
      case "corporate-learner":
        dashboardPath = "/dashboards/coorporate-employee-dashboard";
        break;
      case "parent":
      case "guardian":
        dashboardPath = "/dashboards/parent";
        break;
      default:
        dashboardPath = "/dashboards/student";
    }

    // Cache the result for future use
    rolePathCache.set(roleLower, dashboardPath);
    return dashboardPath;
  }, [rolePathCache]);

  // Enhanced keyboard support for form navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow users to submit form with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(onSubmit)();
    }
  };

  // Optimized helper function to extract role from JWT token with caching
  const tokenRoleCache = useMemo(() => new Map<string, string>(), []);
  
  const getUserRoleFromToken = useCallback((token: string): string => {
    if (!token || typeof token !== 'string') {
      return '';
    }

    // Check cache first
    if (tokenRoleCache.has(token)) {
      return tokenRoleCache.get(token)!;
    }

    let role = '';
    try {
      const decoded = jwtDecode(token) as any;
      
      // Fast role extraction with early returns
      if (decoded.user?.role) {
        role = (Array.isArray(decoded.user.role) ? decoded.user.role[0] : decoded.user.role).toLowerCase().trim();
      } else if (decoded.role) {
        role = (Array.isArray(decoded.role) ? decoded.role[0] : decoded.role).toLowerCase().trim();
      } else if (decoded.userRole) {
        role = decoded.userRole.toLowerCase().trim();
      } else if (decoded.admin_role) {
        role = decoded.admin_role.toLowerCase().trim();
      } else {
        // Quick admin check by user ID
        const userId = decoded.userId || decoded.user?.id || decoded.id;
        if (userId === "680092818c413e0442bf10dd") {
          role = "super-admin";
        }
      }
    } catch (error) {
      // Silent fail for performance
      role = '';
    }

    // Cache the result
    tokenRoleCache.set(token, role);
    return role;
  }, [tokenRoleCache]);

  // Handle verification success
  const handleVerificationSuccess = (): void => {
    if (pendingLoginData) {
      // If we have incomplete login data, attempt login again after verification
      if (!pendingLoginData.access_token || !pendingLoginData.id) {
        // Re-attempt login now that email is verified
        const formData = getValues();
        
        postQuery({
          url: apiUrls?.user?.login,
          postData: {
            email: formData.email,
            password: formData.password,
            agree_terms: formData.agree_terms,
          },
          onSuccess: (res: LoginResponse) => {
            console.log('Login after verification successful:', res);
            completeLoginProcess(res.data);
          },
          onFail: (error) => {
            console.error('Login failed after verification:', error);
            toast.error("Login failed after verification. Please try logging in again.");
            // Reset to login form
            handleBackFromVerification();
          }
        });
      } else {
        // Complete the login process with existing data
        completeLoginProcess(pendingLoginData);
      }
    } else {
      // Fallback: redirect to login
      toast.success("Email verified successfully! Please log in again.");
      handleBackFromVerification();
    }
  };

  // Complete login process after verification
  const completeLoginProcess = (loginData: LoginResponseData): void => {
    // Add safety checks for loginData
    if (!loginData || !loginData.id || !loginData.email) {
      console.error('Invalid login data:', loginData);
      toast.error("Invalid login data received. Please try again.");
      return;
    }

    // Prepare auth data with the exact structure and proper validation
    const token = loginData.access_token || loginData.token || '';
    const refreshToken = loginData.refresh_token || loginData.session_id || '';
    
    if (!token) {
      toast.error("Invalid authentication token received. Please try again.");
      return;
    }

    const authData: AuthData = {
      token: token,
      refresh_token: refreshToken,
      id: loginData.id || '',
      full_name: loginData.full_name || '',
      email: loginData.email || ''
    };

    const authSuccess = storeAuthData(
      authData,
      rememberMe,
      loginData.email
    );

    if (!authSuccess) {
      toast.error("Failed to save authentication data. Please try again.");
      return;
    }

    // Optimized user role extraction with fast-path detection
    let userRole = '';
    
    // Fast-path: Try login data first (most common case)
    if (loginData.role) {
      if (Array.isArray(loginData.role) && loginData.role.length > 0) {
        userRole = loginData.role[0]?.toLowerCase().trim() || '';
      } else if (typeof loginData.role === 'string' && loginData.role.trim()) {
        userRole = loginData.role.toLowerCase().trim();
      }
    }
    
    // Fallback: Decode token only when necessary
    if (!userRole) {
      try {
        const decoded = jwtDecode(authData.token) as any;
        
        // Quick role extraction with early returns
        if (decoded.user?.role) {
          userRole = (Array.isArray(decoded.user.role) ? decoded.user.role[0] : decoded.user.role).toLowerCase().trim();
        } else if (decoded.role) {
          userRole = (Array.isArray(decoded.role) ? decoded.role[0] : decoded.role).toLowerCase().trim();
        } else if (decoded.userRole) {
          userRole = decoded.userRole.toLowerCase().trim();
        } else if (decoded.admin_role) {
          userRole = decoded.admin_role.toLowerCase().trim();
        } else {
          // Quick admin check by user ID
          const userId = decoded.userId || decoded.user?.id || decoded.id;
          if (userId === "680092818c413e0442bf10dd") {
            userRole = 'super-admin';
          } else {
            // Fast localStorage check or default
            userRole = (localStorage.getItem('role')?.toLowerCase().trim()) || 'student';
          }
        }
      } catch (error) {
        // Quick fallback without extensive logging
        userRole = (localStorage.getItem('role')?.toLowerCase().trim()) || 'student';
      }
    }

    // Ensure valid role
    if (!userRole) {
      userRole = 'student';
    }

    const fullName = loginData.full_name;
    const dashboardPath = getRoleBasedRedirectPath(userRole);
    const finalRedirectPath = (redirectPath && redirectPath.startsWith('/')) ? redirectPath : dashboardPath;

    // Batch localStorage operations for better performance
    const localStorageUpdates: [string, string][] = [];
    if (userRole) localStorageUpdates.push(["role", userRole]);
    if (fullName) localStorageUpdates.push(["fullName", fullName]);
    
    // Apply all localStorage updates at once
    localStorageUpdates.forEach(([key, value]) => localStorage.setItem(key, value));

    // Prepare storage data
    const storageData: StorageManagerLoginData = {
      token: authData.token,
      refresh_token: authData.refresh_token,
      userId: loginData.id,
      email: loginData.email,
      password: rememberMe ? getValues('password') : undefined,
      role: userRole,
      fullName: fullName,
      permissions: loginData.permissions || [],
      rememberMe: rememberMe
    };

    // Parallel operations: storage, events, and UI updates
    const operations = [
      () => storageManager.login(storageData),
      () => events.login(userRole || 'user'),
      () => toast.success(`Welcome back, ${fullName || 'User'}!`, { autoClose: 1500 }) // Shorter toast duration
    ];

    // Execute operations in parallel
    operations.forEach(op => {
      try {
        op();
      } catch (error) {
        console.warn('Non-critical operation failed:', error);
      }
    });

    // Immediate redirect with loading state
    setIsRedirecting(true);
    try {
      router.push(finalRedirectPath);
    } catch (redirectError) {
      console.error('Redirect failed:', redirectError);
      // Immediate fallback without setTimeout delay
      try {
        router.push(dashboardPath);
      } catch (fallbackError) {
        console.error('Fallback redirect failed:', fallbackError);
        router.push('/');
      }
    }
    
    // Reset verification states
    setShowOTPVerification(false);
    setPendingLoginData(null);
    setVerificationEmail('');
    setCurrentStep(1);
  };

  // Handle back from verification
  const handleBackFromVerification = (): void => {
    setShowOTPVerification(false);
    setPendingLoginData(null);
    setVerificationEmail('');
    setCurrentStep(1);
  };
  
  // OAuth login handlers
  const handleOAuthLogin = async (provider: 'google' | 'github'): Promise<void> => {
    try {
      setIsOAuthLoading(prev => ({ ...prev, [provider]: true }));
      
      // Get OAuth login URL
      const oauthUrl = authUtils.getOAuthLoginUrl(provider, window.location.origin + '/auth/callback');
      
      // Open OAuth popup
      authUtils.openOAuthPopup(
        provider,
        // Success callback
        (data) => {
          console.log(`${provider} OAuth success:`, data);
          
          if (data.access_token && data.id) {
            // Store auth data
            const authData = {
              token: data.access_token,
              refresh_token: data.refresh_token || '',
              id: data.id,
              full_name: data.full_name,
              email: data.email
            };
            
            const authSuccess = storeAuthData(authData, rememberMe, data.email);
            
            if (authSuccess) {
              // Fast role extraction and path determination
              const userRole = (Array.isArray(data.role) ? data.role[0] : data.role)?.toLowerCase().trim() || 'student';
              const dashboardPath = getRoleBasedRedirectPath(userRole);
              const finalRedirectPath = (redirectPath && redirectPath.startsWith('/')) ? redirectPath : dashboardPath;
              
              // Batch localStorage operations
              const localStorageUpdates: [string, string][] = [];
              if (userRole) localStorageUpdates.push(["role", userRole]);
              if (data.full_name) localStorageUpdates.push(["fullName", data.full_name]);
              localStorageUpdates.forEach(([key, value]) => localStorage.setItem(key, value));
              
              // Prepare storage data
              const storageData = {
                token: data.access_token,
                refresh_token: data.refresh_token || '',
                userId: data.id,
                email: data.email,
                role: userRole,
                fullName: data.full_name,
                permissions: data.permissions || [],
                rememberMe: rememberMe
              };
              
              // Parallel operations
              const operations = [
                () => storageManager.login(storageData),
                () => events.login(`${provider}_oauth`),
                () => toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`, { autoClose: 1500 })
              ];
              
              operations.forEach(op => {
                try {
                  op();
                } catch (error) {
                  console.warn('Non-critical OAuth operation failed:', error);
                }
              });
              
                             // Immediate redirect with loading state
               setIsRedirecting(true);
               router.push(finalRedirectPath);
            } else {
              toast.error("Failed to save authentication data. Please try again.");
            }
          } else {
            toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`);
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        },
        // Error callback
        (error) => {
          console.error(`${provider} OAuth error:`, error);
          toast.error(error.message || `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`);
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        }
      );
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      toast.error(`Failed to initiate ${provider.charAt(0).toUpperCase() + provider.slice(1)} login. Please try again.`);
      setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Updated submit handler to use new auth API
  const onSubmit = async (data: FormInputs): Promise<void> => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      setTimeout(() => emailInputRef.current?.focus(), 100);
      return;
    }
    
    try {
      const loginData: ILoginData = {
        email: data.email,
        password: data.password
      };

      await postQuery({
        url: authAPI.local.login,
        postData: loginData,
        onSuccess: (res: any) => { // Use any to handle both response structures
          console.log('Login response:', res);
          
          // Add safety checks for response structure
          if (!res || !res.data) {
            console.error('Invalid response structure:', res);
            toast.error("Invalid response from server. Please try again.");
            return;
          }
          
          // Handle both response structures - nested user object or flat structure
          const isNestedStructure = res.data && 'user' in res.data && res.data.user;
          const userData = isNestedStructure ? res.data.user : res.data;
          const token = isNestedStructure ? res.data.token : res.data.access_token;
          const refreshToken = isNestedStructure ? res.data.session_id : res.data.refresh_token;
          
          console.log('User data:', userData);
          console.log('User role:', userData?.role);
          console.log('Email verified:', userData?.email_verified);

          // Additional safety check for userData
          if (!userData || !userData.id || !userData.email) {
            console.error('Missing required user data:', userData);
            toast.error("Incomplete user data received. Please try again.");
            return;
          }

          // Check if email verification is required
          // Configuration: Set this to true to skip email verification entirely
          const SKIP_EMAIL_VERIFICATION_FOR_ALL = false;
          
          // Skip email verification for admin users or if it's a special case
          const userRole = getUserRoleFromToken(token) || '';
          const isAdmin = ['admin', 'super-admin', 'administrator'].includes(userRole.toLowerCase());
          const shouldSkipVerification = SKIP_EMAIL_VERIFICATION_FOR_ALL || 
                                       isAdmin || 
                                       userData?.email_verified !== false;
          
          console.log('Email verification check:', {
            email_verified: userData?.email_verified,
            userRole,
            isAdmin,
            shouldSkipVerification
          });
          
          if (userData?.email_verified === false && !shouldSkipVerification) {
            // User needs to verify email first
            const mockLoginData = {
              id: userData.id || '',
              email: userData.email || data.email,
              full_name: userData.full_name || '',
              role: userData.role || [userRole], // Use role from response or detected role
              permissions: userData.permissions || [],
              access_token: token || '',
              refresh_token: refreshToken || '',
              emailVerified: false
            };
            
            setPendingLoginData(mockLoginData);
            setVerificationEmail(userData.email || data.email);
            setCurrentStep(2);
            setShowOTPVerification(true);
            
            // Send verification email
            postQuery({
              url: authAPI.local.resendVerification,
              postData: { email: userData.email || data.email },
              requireAuth: false,
              onSuccess: () => {
                toast.info("Please verify your email. A verification code has been sent to your inbox.");
              },
              onFail: (error) => {
                console.error("Failed to send verification email:", error);
                toast.warning("Login successful, but we couldn't send a verification email. Please contact support.");
              }
            });
            
            return;
          }

          // Email is verified, proceed with normal login
          const loginResponseData: LoginResponseData = {
            id: userData.id || '',
            email: userData.email || '',
            full_name: userData.full_name || '',
            role: userData.role || [], // Extract role from API response
            permissions: userData.permissions || [],
            access_token: token || '',
            refresh_token: refreshToken || '',
            emailVerified: userData.email_verified
          };

          completeLoginProcess(loginResponseData);
          setRecaptchaError(false);
          setRecaptchaValue(null);
        },
        onFail: (error) => {
          console.log('Login error:', error);
          
          // Check if this is an email verification error
          const errorResponse = error?.response?.data;
          const isEmailNotVerified = errorResponse?.error_code === "EMAIL_NOT_VERIFIED" || 
                                   errorResponse?.message?.includes("Email not verified");
          
          if (isEmailNotVerified) {
            // Handle email verification required
            const email = errorResponse?.data?.email || data.email;
            
            const mockLoginData = {
              id: '',
              email: email,
              full_name: '',
              role: [],
              permissions: [],
              access_token: '',
              refresh_token: '',
              emailVerified: false
            };
            
            setPendingLoginData(mockLoginData);
            setVerificationEmail(email);
            setCurrentStep(2);
            setShowOTPVerification(true);
            
            toast.info(errorResponse?.message || "Please verify your email. A verification code has been sent to your inbox.");
            return;
          }
          
          // Handle other login errors
          toast.error(authUtils.handleAuthError(error));
          setTimeout(() => emailInputRef.current?.focus(), 100);
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      if (process.env.NODE_ENV !== 'production') {
        console.error("Unexpected login error:", error);
      }
    }
  };

  // Show OTP verification if needed
  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container with glass morphism effect */}
          <div className="login-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            
            {/* Header area */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 text-center relative">
              <Link href="/" className="inline-block mb-2 sm:mb-4">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={100} 
                  height={32} 
                  className="mx-auto w-24 sm:w-32"
                  priority
                />
              </Link>
            </div>

            {/* Stepper UI */}
            <div className="px-4 sm:px-8 mb-4">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">Login</span>
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-0.5 bg-primary-500"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">Verification</span>
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-8 mb-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Email Verification Required</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Please verify your email to complete the login process<br />
                <span className="font-medium text-gray-900 dark:text-white">{verificationEmail}</span>
              </p>
            </div>
            
            {/* Form area */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <OTPVerification
                email={verificationEmail}
                onVerificationSuccess={handleVerificationSuccess}
                onBack={handleBackFromVerification}
                backButtonText="Back to Login"
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Trusted by students worldwide 🌎</p>
          </div>
          
          {/* Copyright notice */}
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500">
            <p>© {new Date().getFullYear()} Medh. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
          <p className="font-body text-gray-600 dark:text-gray-300">Signing you in...</p>
        </div>
      </div>
    );
  }

  // Apply font styles
  return (
    <>
      {/* Fast Redirect Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4 animate-pulse">
              <ArrowRight className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Redirecting to Dashboard
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taking you to your personalized dashboard...
            </p>
          </div>
        </div>
      )}
      
      {/* Font styles */}
      <style jsx global>{`
        /* Font variables */
        :root {
          --font-heading: var(--font-montserrat);
          --font-body: var(--font-inter);
        }
        
        .font-heading {
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
        }
        
        .font-body {
          font-family: var(--font-body);
          letter-spacing: 0;
        }

        /* Enable scrolling for mobile view only */
        @media (max-width: 640px) {
          html, body {
            overflow: auto;
            height: auto;
            position: relative;
            width: 100%;
          }
        }

        /* Disable scrolling for desktop view */
        @media (min-width: 641px) {
          html, body {
            overflow: hidden;
            height: 100%;
            position: fixed;
            width: 100%;
          }
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container with glass morphism effect */}
          <div className="login-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            
            {/* Header area with navigation */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 text-center relative">
              {/* Back to Home link */}
              <Link 
                href="/"
                className="absolute left-4 top-4 sm:left-6 sm:top-6 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex items-center text-xs"
                aria-label="Back to homepage"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              
              <Link href="/" className="inline-block mb-2 sm:mb-4">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={100} 
                  height={32} 
                  className="mx-auto w-24 sm:w-32"
                  priority
                />
              </Link>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey
              </p>
            </div>
            
            {/* Form area */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-3 sm:space-y-5"
                onKeyDown={handleKeyDown}
              >
                {/* Email field */}
                <div>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                        errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 text-sm sm:text-base`}
                      {...register("email", {
                        required: true,
                        onChange: (e) => {
                          // Trim value on change
                          e.target.value = e.target.value.trimStart();
                          setTimeout(() => trigger("email"), 100);
                        },
                        onBlur: (e) => {
                          // Trim value on blur
                          setValue("email", e.target.value.trim(), { shouldValidate: true });
                        }
                      })}
                      ref={emailInputRef}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
                
                {/* Password field */}
                <div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                        errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base`}
                      {...register("password")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>
                
                {/* Options row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded-md text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      onChange={handleRememberMeChange}
                      checked={rememberMe}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-right">
                    <a
                      href="/forgot-password"
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                {/* Terms and conditions */}
                <div>
                  <label className="inline-flex items-start">
                    <input
                      type="checkbox"
                      className="rounded-md text-primary-600 focus:ring-primary-500 h-3.5 w-3.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 mt-0.5"
                      {...register("agree_terms")}
                    />
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                      I accept the{" "}
                      <a
                        href="/terms-and-services"
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of use
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.agree_terms && (
                    <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.agree_terms.message}</span>
                    </p>
                  )}
                </div>
                
                {/* Custom ReCAPTCHA */}
                <div className="scale-90 sm:scale-100 origin-center">
                  <CustomReCaptcha onChange={handleRecaptchaChange} error={!!recaptchaError} />
                </div>
                
                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group text-sm sm:text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* OAuth Divider - HIDDEN */}
                {/* 
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* OAuth Buttons - HIDDEN */}
                {/* 
                <div className="grid grid-cols-2 gap-3">
                  {/* Google OAuth */}
                {/*
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isOAuthLoading.google}
                    className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isOAuthLoading.google ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </>
                    )}
                  </button>

                  {/* GitHub OAuth */}
                {/*
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('github')}
                    disabled={isOAuthLoading.github}
                    className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isOAuthLoading.github ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Github className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                        GitHub
                      </>
                    )}
                  </button>
                </div>
                */}
                
                {/* Sign Up Link */}
                <div className="text-center mt-2 sm:mt-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <a 
                      href="/signup" 
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Social proof */}
          <div className="text-center mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Trusted by students worldwide 🌎</p>
          </div>
          
          {/* Copyright notice */}
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500">
            <p>© {new Date().getFullYear()} Medh. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
