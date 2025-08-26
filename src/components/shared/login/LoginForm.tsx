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
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle, AlertCircle, Sparkles, ArrowRight, ChevronLeft, Home, Check, Clock, Shield, RefreshCw } from "lucide-react";
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
import { 
  RememberedAccountsManager, 
  RememberedAccount, 
  hasRememberedAccounts 
} from "@/utils/rememberedAccounts";
import QuickLoginAccounts from './QuickLoginAccounts';
import QuickLoginPassword from './QuickLoginPassword';
import { 
  authAPI, 
  authUtils, 
  ILoginData, 
  ILoginResponse,
  IMFALoginRequiredResponse,
  IMFAVerifyResponse,
  IMFASendSMSResponse
} from "@/apis/auth.api";
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

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

// Add MFA-specific interfaces
interface MFAVerificationState {
  isRequired: boolean;
  method: 'totp' | 'sms' | null;
  userId: string;
  phoneHint?: string;
  tempSession: boolean;
}

interface MFAStepProps {
  mfaState: MFAVerificationState;
  onVerificationSuccess: (loginData: ILoginResponse) => void;
  onBack: () => void;
  onResendSMS?: () => void;
}

interface LoginFormProps {
  redirectPath?: string;
  popupMode?: boolean;
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

const LoginForm: React.FC<LoginFormProps> = ({ redirectPath: propRedirectPath, popupMode = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('from') || '';
  const redirectPath = propRedirectPath || (redirectParam ? decodeURIComponent(redirectParam) : '');
  const actionParam = searchParams.get('action') || '';
  const isDemoScheduling = actionParam === 'schedule-demo';
  
  // Check for OAuth completion parameters
  const oauthSuccess = searchParams.get('oauth_success');
  const oauthError = searchParams.get('oauth_error');
  const oauthProvider = searchParams.get('oauth_provider');
  const { postQuery, loading } = usePostQuery();
  const storageManager = useStorage();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();
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
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [accountLockInfo, setAccountLockInfo] = useState<{
    isLocked: boolean;
    lockedUntil?: string;
    message?: string;
  }>({ isLocked: false });
  
  // Add MFA-specific state
  const [mfaVerificationState, setMFAVerificationState] = useState<MFAVerificationState>({
    isRequired: false,
    method: null,
    userId: '',
    phoneHint: '',
    tempSession: false
  });
  const [showMFAVerification, setShowMFAVerification] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>('');
  const [mfaError, setMfaError] = useState<string>('');
  const [mfaLoading, setMfaLoading] = useState<boolean>(false);
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  const [backupCode, setBackupCode] = useState<string>('');
  const [smsResendCooldown, setSmsResendCooldown] = useState<number>(0);
  
  // Quick Login states
  const [showQuickLogin, setShowQuickLogin] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<RememberedAccount | null>(null);
  const [showQuickPassword, setShowQuickPassword] = useState<boolean>(false);
  const [quickLoginError, setQuickLoginError] = useState<string>('');
  const [showManualLoginOptions, setShowManualLoginOptions] = useState<boolean>(false);
  const [showEmailLogin, setShowEmailLogin] = useState<boolean>(false);

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
    defaultValues: {
      ...prefilledValues,
      agree_terms: true
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Check for remembered accounts on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Migrate old format first
      RememberedAccountsManager.migrateFromOldFormat();
      
      // Check if we have remembered accounts
      const hasAccounts = hasRememberedAccounts();
      setShowQuickLogin(hasAccounts);
      
      // If we have accounts, show quick login by default
      // If no accounts, show manual login options directly
      if (hasAccounts) {
        console.log('Found remembered accounts, showing quick login interface');
        setShowManualLoginOptions(false);
        setShowEmailLogin(false);
      } else {
        console.log('No remembered accounts found, showing manual login options');
        setShowQuickLogin(false);
        setShowManualLoginOptions(false);
        setShowEmailLogin(false);
      }
    }
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

  // Autofill detection for email input to update RHF state and clear validation error
  useEffect(() => {
    const intervalId = setInterval(() => {
      const input = emailInputRef.current;
      if (input && input.value) {
        setValue("email", input.value, { shouldValidate: true });
        clearErrors("email");
        trigger("email");
        clearInterval(intervalId);
      }
    }, 300);
    return () => clearInterval(intervalId);
  }, [setValue, clearErrors, trigger]);

  // Initialize theme to light if not set
  useEffect(() => {
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);



  const handleRecaptchaChange = (value: string): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
    if (value) {
      showToast.success("Human verification completed successfully", { duration: 2000 });
    }
  };

  // Update onChange handler
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  // Create a reference for focusing after errors
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Optimized role-based dashboard routing with memoization
  const rolePathCache = useMemo(() => new Map<string, string>(), []);
  const demoPathCache = useMemo(() => new Map<string, string>(), []);
  
  const getRoleBasedRedirectPath = useCallback((role: string, isDemo: boolean = false): string => {
    if (!role || typeof role !== 'string') {
      return isDemo ? "/dashboards/student/demo-classes/" : "/dashboards/student";
    }

    const roleLower = role.toLowerCase().trim();
    
    // Handle demo scheduling navigation
    if (isDemo) {
      // Check demo cache first
      if (demoPathCache.has(roleLower)) {
        return demoPathCache.get(roleLower)!;
      }

      let demoPath: string;
      switch (roleLower) {
        case "student":
        case "learner":
        case "user":
          demoPath = "/dashboards/student/demo-classes/";
          break;
        case "admin":
        case "super-admin":
        case "superadmin":
        case "administrator":
        case "super_admin":
          demoPath = "/dashboards/admin/demo-management/";
          break;
        case "instructor":
        case "teacher":
        case "tutor":
        case "faculty":
          demoPath = "/dashboards/instructor/demo-classes/";
          break;
        case "corporate":
        case "coorporate":
        case "corporate-admin":
        case "coorporate-admin":
        case "company":
        case "enterprise":
          demoPath = "/dashboards/coorporate-dashboard/demo-classes/";
          break;
        case "corporate-student":
        case "coorporate-student":
        case "corporate-employee":
        case "coorporate-employee":
        case "employee":
        case "corporate-learner":
          demoPath = "/dashboards/coorporate-employee-dashboard/demo-classes/";
          break;
        case "parent":
        case "guardian":
          demoPath = "/dashboards/parent/demo-classes/";
          break;
        case "sales_team":
        case "sales-team":
        case "sales":
          demoPath = "/dashboards/sales/demo-classes/";
          break;
        case "support_team":
        case "support-team":
        case "support":
          demoPath = "/dashboards/support/demo-classes/";
          break;
        default:
          demoPath = "/dashboards/student/demo-classes/";
      }

      // Cache the demo result
      demoPathCache.set(roleLower, demoPath);
      return demoPath;
    }
    
    // Regular dashboard routing
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
      case "sales_team":
      case "sales-team":
      case "sales":
        dashboardPath = "/dashboards/sales";
        break;
      case "support_team":
      case "support-team":
      case "support":
        dashboardPath = "/dashboards/support";
        break;
      default:
        dashboardPath = "/dashboards/student";
    }

    // Cache the result for future use
    rolePathCache.set(roleLower, dashboardPath);
    return dashboardPath;
  }, [rolePathCache, demoPathCache]);

  // Handle OAuth completion when returning from backend
  useEffect(() => {
    if (oauthSuccess === 'true') {
      // OAuth was successful, check if we have stored auth data
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('role');
      
      if (token && userId) {
        showToast.success(`${oauthProvider || 'OAuth'} authentication successful. Redirecting to your dashboard.`, { duration: 3000 });
        
        // Determine redirect path
        const shouldRedirectToDemo = isDemoScheduling && !redirectPath;
        const dashboardPath = getRoleBasedRedirectPath(userRole || 'student', shouldRedirectToDemo);
        const finalRedirectPath = redirectPath && redirectPath.startsWith('/') ? redirectPath : dashboardPath;
        
        // Redirect to dashboard
        setTimeout(() => {
          setIsRedirecting(true);
          router.push(finalRedirectPath);
        }, 1500);
      } else {
        // Auth data not found, something went wrong
        showToast.error('Authentication data not found. Please try logging in again.', { duration: 4000 });
      }
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('oauth_success');
      url.searchParams.delete('oauth_provider');
      window.history.replaceState({}, '', url.toString());
    }
    
    if (oauthError === 'true') {
      showToast.error('OAuth authentication failed. Please try again.', { duration: 4000 });
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('oauth_error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [oauthSuccess, oauthError, oauthProvider, isDemoScheduling, redirectPath, getRoleBasedRedirectPath, router]);

  // Sanitize any invalid auth data when component mounts and check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sanitizeAuthData();
      
      // Check if user is already authenticated
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('role');
      
      if (token && userId) {
        // User is already logged in, redirect them to their dashboard
        // Check if this is a demo scheduling request
        const shouldRedirectToDemo = isDemoScheduling && !redirectPath;
        const dashboardPath = getRoleBasedRedirectPath(userRole || 'student', shouldRedirectToDemo);
        const finalRedirectPath = (propRedirectPath && propRedirectPath.startsWith('/'))
          ? propRedirectPath
          : (redirectPath && redirectPath.startsWith('/'))
            ? redirectPath
            : dashboardPath;
        
        console.log('User already authenticated, redirecting to:', finalRedirectPath);
        setIsRedirecting(true);
        router.push(finalRedirectPath);
        return;
      }
      
      // User is not authenticated, show the login form
      setIsCheckingAuth(false);
    }
  }, [router, redirectPath, getRoleBasedRedirectPath, propRedirectPath]);

  // Enhanced keyboard support for form navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow users to submit form with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(onSubmit)();
    }
  };

  // Enhanced error message handler with more descriptive messages
  const getEnhancedErrorMessage = (error: any): string => {
    const errorResponse = error?.response?.data;
    const status = error?.response?.status;
    const message = errorResponse?.message || error?.message || 'An unexpected error occurred';

    // Network and connection errors
    if (!navigator.onLine) {
      return "No internet connection. Please check your network and try again.";
    }

    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      return "Unable to connect to our servers. Please check your internet connection and try again.";
    }

    // Timeout errors
    if (error?.code === 'ECONNABORTED' || message.includes('timeout')) {
      return "Request timed out. Our servers might be busy. Please try again in a few moments.";
    }

    // HTTP status specific errors
    switch (status) {
      case 400:
        if (message.includes('password')) {
          return "Invalid email or password. Please check your credentials and try again.";
        }
        if (message.includes('email')) {
          return "Please enter a valid email address.";
        }
        return `${message}`;
      
      case 401:
        return "Invalid email or password. Please check your credentials.";
      
      case 403:
        return "Access denied. Your account may be suspended or restricted.";
      
      case 404:
        return "Account not found. Please check your email or create a new account.";
      
      case 409:
        if (message.includes('already exists')) {
          return "An account with this email already exists. Try logging in instead.";
        }
        return `${message}`;
      
      case 422:
        return "Please check your input and try again. Some fields may be invalid.";
      
      case 429:
        return "Too many attempts. Please wait a few minutes before trying again.";
      
      case 500:
        return "Our servers are experiencing issues. Please try again later.";
      
      case 502:
      case 503:
      case 504:
        return "Our services are temporarily unavailable. Please try again in a few minutes.";
      
      default:
        // Account locked scenarios
        if (message.includes('locked') || message.includes('suspended')) {
          return "Your account has been temporarily locked for security reasons.";
        }
        
        // Email verification scenarios
        if (message.includes('verify') || message.includes('verification')) {
          return "Please verify your email address to continue.";
        }
        
        // Generic fallback with professional messaging
        return `${message}`;
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
      // Show loading toast
      const loadingToastId = showToast.loading("Completing your login...", { duration: 10000 });
      
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
          requireAuth: false, // Login endpoints are public and don't require authentication
          onSuccess: (res: LoginResponse) => {
            console.log('Login after verification successful:', res);
            showToast.dismiss(loadingToastId);
            showToast.success("Email verified successfully. Welcome back!", { duration: 3000 });
            completeLoginProcess(res.data, undefined, undefined);
          },
          onFail: (error) => {
            console.error('Login failed after verification:', error);
            showToast.dismiss(loadingToastId);
            const errorMessage = getEnhancedErrorMessage(error);
            showToast.error(`Login failed after verification: ${errorMessage}`, { duration: 6000 });
            // Reset to login form
            handleBackFromVerification();
          }
        });
      } else {
        // Complete the login process with existing data
        showToast.dismiss(loadingToastId);
        showToast.success("Email verified successfully. Welcome back.", { duration: 3000 });
        completeLoginProcess(pendingLoginData, undefined, undefined);
      }
    } else {
      // Fallback: redirect to login
      showToast.success("Email verified successfully. Please log in again.", { duration: 4000 });
      handleBackFromVerification();
    }
  };

  // Complete login process after verification
  const completeLoginProcess = (loginData: LoginResponseData, quickLoginKey?: string, quickLoginKeyId?: string): void => {
    // Add safety checks for loginData
    if (!loginData || !loginData.id || !loginData.email) {
      console.error('Invalid login data:', loginData);
      showToast.error("Invalid login data received. Please try again.");
      return;
    }

    // Prepare auth data with the exact structure and proper validation
    const token = loginData.access_token || loginData.token || '';
    const refreshToken = loginData.refresh_token || loginData.session_id || '';
    
    if (!token) {
      showToast.error("Invalid authentication token received. Please try again.");
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
      showToast.error("Failed to save authentication data. Please try again.");
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
    
    // Determine if this is a demo scheduling login
    const shouldRedirectToDemo = isDemoScheduling && !redirectPath;
    const dashboardPath = getRoleBasedRedirectPath(userRole, shouldRedirectToDemo);
    
    // Priority: explicit redirect > demo classes > default dashboard
    let finalRedirectPath: string;
    if (redirectPath && redirectPath.startsWith('/')) {
      finalRedirectPath = redirectPath;
    } else if (shouldRedirectToDemo) {
      finalRedirectPath = dashboardPath; // This will be the demo classes path
      // Show demo-specific welcome message
                  showToast.info("Redirecting to demo classes...", { duration: 2000 });
    } else {
      finalRedirectPath = dashboardPath;
    }

    // Batch localStorage operations for better performance
    const localStorageUpdates: [string, string][] = [];
    if (userRole) localStorageUpdates.push(["role", userRole]);
    if (fullName) localStorageUpdates.push(["fullName", fullName]);
    
    // Set last login time
    const currentTime = new Date().toISOString();
    localStorageUpdates.push(["lastLoginTime", currentTime]);
    
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

    // Save to new remembered accounts system if remember me is enabled
    if (rememberMe) {
      console.log('Attempting to save quickLoginKey:', quickLoginKey); // Add this log
      try {
        RememberedAccountsManager.addRememberedAccount({
          email: loginData.email,
          fullName: fullName || loginData.email.split('@')[0],
          role: userRole,
          quickLoginKey: quickLoginKey, // Ensure quickLoginKey is passed here
          keyId: quickLoginKeyId // Add keyId
        });
      } catch (error) {
        console.warn('Failed to save to remembered accounts:', error);
      }
    }

    // Parallel operations: storage, events, and UI updates
    const operations = [
      () => storageManager.login(storageData),
      () => events.login(userRole || 'user'),
      () => showToast.success(`Welcome back, ${fullName || 'User'}!`, { duration: 1500 }) // Shorter toast duration
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
      // If redirecting to membership page, reload and scroll after navigation
      if (typeof window !== 'undefined' && finalRedirectPath.startsWith('/medh-membership')) {
        sessionStorage.setItem('scrollToMembershipCard', '1');
        setTimeout(() => {
          window.location.reload();
        }, 100); // Give router.push a moment
      }
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
  
  // Enhanced OAuth login handlers
  const handleOAuthLogin = async (provider: 'google' | 'github'): Promise<void> => {
    try {
      setIsOAuthLoading(prev => ({ ...prev, [provider]: true }));
      
      // Show informational toast
      showToast.info(`Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} login...`, { duration: 3000 });
      
      // Open enhanced OAuth popup with quick login key generation if remember me is enabled
      authUtils.openOAuthPopup(
        provider,
        // Success callback
        (data) => {
          console.log(`${provider} OAuth success:`, data);
          
          // Handle the transformed OAuth data from frontend OAuth
          if (data.access_token && data.id) {
            // Show processing toast
            const processingToastId = showToast.loading("Setting up your account...", { duration: 8000 });
            
            // Store enhanced auth data using frontend OAuth structure
            const authData = {
              token: data.access_token,
              refresh_token: data.refresh_token || '',
              id: data.id,
              full_name: data.full_name,
              email: data.email
            };
            
            const authSuccess = storeAuthData(authData, rememberMe, data.email);
            
            if (authSuccess) {
              // Extract role from JWT token or use provided role
              const userRole = getUserRoleFromToken(data.access_token) || (Array.isArray(data.role) ? data.role[0] : data.role) || 'student';
              const shouldRedirectToDemo = isDemoScheduling && !redirectPath;
              const dashboardPath = getRoleBasedRedirectPath(userRole, shouldRedirectToDemo);
              
              // Priority: explicit redirect > demo classes > default dashboard
              let finalRedirectPath: string;
              if (redirectPath && redirectPath.startsWith('/')) {
                finalRedirectPath = redirectPath;
              } else if (shouldRedirectToDemo) {
                finalRedirectPath = dashboardPath; // This will be the demo classes path
                // Show demo-specific welcome message for OAuth
                showToast.info("Taking you to demo classes...", { duration: 2000 });
              } else {
                finalRedirectPath = dashboardPath;
              }
              
              // Batch localStorage operations with enhanced data
              const localStorageUpdates: [string, string][] = [];
              if (userRole) localStorageUpdates.push(["role", userRole]);
              if (data.full_name) localStorageUpdates.push(["fullName", data.full_name]);
              
              // Store enhanced OAuth metadata
              if (data.account_merged) localStorageUpdates.push(["oauth_account_merged", "true"]);
              if (data.profile_updated) localStorageUpdates.push(["oauth_profile_updated", "true"]);
              if (data.email_verified) localStorageUpdates.push(["oauth_email_verified", "true"]);
              
              localStorageUpdates.forEach(([key, value]) => localStorage.setItem(key, value));
              
              // Prepare enhanced storage data
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
              
              // Save to remembered accounts with OAuth quick login key if available
              if (rememberMe) {
                try {
                  RememberedAccountsManager.addRememberedAccount({
                    email: data.email,
                    fullName: data.full_name || data.email.split('@')[0],
                    role: userRole,
                    quickLoginKey: data.quick_login_key, // Store OAuth quick login key
                    keyId: data.quick_login_key_id,
                    provider: provider // Add provider info for OAuth accounts
                  });
                  
                  // Show quick login key notification if generated
                  if (data.quick_login_key) {
                    showToast.success('🔑 Quick login key generated for faster future logins!', { duration: 4000 });
                  }
                } catch (error) {
                  console.warn('Failed to save OAuth account to remembered accounts:', error);
                }
              }
              
              // Parallel operations
              const operations = [
                () => storageManager.login(storageData),
                () => events.login(`${provider}_oauth`),
                () => {
                  showToast.dismiss(processingToastId);
                  
                  // Enhanced success message based on account status
                  let successMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful.`;
                  if (data.account_merged) {
                    successMessage += ' Account linked successfully.';
                  } else if (data.is_new_user) {
                    successMessage += ' Welcome to Medh!';
                  } else {
                    successMessage += ' Welcome back.';
                  }
                  
                  showToast.success(successMessage, { duration: 4000 });
                  
                  // Show additional notifications for important events
                  if (data.email_verified) {
                    showToast.success('Email verified through OAuth', { duration: 3000 });
                  }
                  
                  if (data.profile_updated) {
                    showToast.info('Profile enhanced with OAuth data', { duration: 3000 });
                  }
                  
                  if (data.account_merged) {
                    showToast.info('Multiple OAuth providers connected', { duration: 3000 });
                  }
                  
                  // Show welcome message for new users
                  if (data.is_new_user) {
                    showToast.info('📧 Welcome email sent! Check your inbox for getting started guide.', { duration: 5000 });
                  } else {
                    showToast.info('🔔 Login notification sent if accessing from a new device.', { duration: 3000 });
                  }
                }
              ];
              
              // Execute operations in parallel
              Promise.all(operations.map(op => op())).then(() => {
                setIsRedirecting(true);
                router.push(finalRedirectPath);
              }).catch(error => {
                console.error('Error during login operations:', error);
                showToast.error("Login successful but encountered some issues. Please refresh if needed.", { duration: 5000 });
                setIsRedirecting(true);
                router.push(finalRedirectPath);
              });
            } else {
              showToast.dismiss(processingToastId);
              showToast.error("Failed to complete login process. Please try again.", { duration: 5000 });
            }
          } else {
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Invalid response from server.`, { duration: 5000 });
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        },
        // Error callback
        (error) => {
          console.error(`${provider} OAuth error:`, error);
          const enhancedError = getEnhancedErrorMessage(error);
          
          // Check if this is the student ID validation error
          if (error.message?.includes('Account Creation Issue') || error.message?.includes('Student ID must follow the pattern')) {
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-up temporarily unavailable`, { duration: 8000 });
            showToast.info(`Workaround: Create an account manually first, then link Google in your profile settings.`, { duration: 10000 });
          } else {
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed: ${enhancedError}`, { duration: 6000 });
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        },
        // Options including quick login key generation
        {
          mode: 'login',
          generateQuickLoginKey: rememberMe // Generate quick login key if remember me is enabled
        }
      );
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      const errorMsg = `Failed to initiate ${provider.charAt(0).toUpperCase() + provider.slice(1)} login. Please try again.`;
      showToast.error(errorMsg, { duration: 5000 });
      setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // MFA Verification Component
  const MFAVerificationStep: React.FC<MFAStepProps> = ({ 
    mfaState, 
    onVerificationSuccess, 
    onBack, 
    onResendSMS 
  }) => {
    const [code, setCode] = useState<string>('');
    const [backupCodeValue, setBackupCodeValue] = useState<string>('');
    const [isUsingBackupCode, setIsUsingBackupCode] = useState<boolean>(false);
    const [verificationError, setVerificationError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [resendCooldown, setResendCooldown] = useState<number>(0);

    // Cooldown timer for SMS resend
    useEffect(() => {
      if (resendCooldown > 0) {
        const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendCooldown]);

    const handleVerification = async (): Promise<void> => {
      const verificationCode = isUsingBackupCode ? backupCodeValue : code;
      
      if (!verificationCode.trim()) {
        setVerificationError(`Please enter a ${isUsingBackupCode ? 'backup code' : 'verification code'}`);
        return;
      }

      // Validate code format
      if (!isUsingBackupCode && !authUtils.isValidMFACode(verificationCode)) {
        setVerificationError('Please enter a valid 6-digit code');
        return;
      }

      if (isUsingBackupCode && !authUtils.isValidBackupCode(verificationCode.replace(/\s/g, ''))) {
        setVerificationError('Please enter a valid backup code (16 characters)');
        return;
      }

      setIsVerifying(true);
      setVerificationError('');

      try {
        const verifyResponse: IMFAVerifyResponse = await authUtils.verifyMFA(
          mfaState.userId,
          isUsingBackupCode ? undefined : verificationCode,
          isUsingBackupCode ? verificationCode.replace(/\s/g, '') : undefined
        );

        if (verifyResponse.success && verifyResponse.data.verified) {
          // Complete MFA login
          const loginResponse: ILoginResponse = await authUtils.completeMFALogin(
            mfaState.userId, 
            true
          );

          if (loginResponse.success) {
            showToast.success("Authentication successful", { duration: 3000 });
            onVerificationSuccess(loginResponse);
          } else {
            throw new Error(loginResponse.message || 'Failed to complete login');
          }
        } else {
          setVerificationError(verifyResponse.message || 'Invalid verification code');
        }
      } catch (error: any) {
        console.error('MFA verification error:', error);
        setVerificationError(error.message || 'Verification failed. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    const handleResendSMS = async (): Promise<void> => {
      if (mfaState.method !== 'sms' || resendCooldown > 0) return;

      try {
        const smsResponse: IMFASendSMSResponse = await authUtils.sendMFASMS(mfaState.userId);
        if (smsResponse.success) {
          showToast.success("New verification code sent to your phone", { duration: 3000 });
          setResendCooldown(60); // 60 second cooldown
        } else {
          showToast.error(smsResponse.message || 'Failed to send SMS code');
        }
      } catch (error: any) {
        showToast.error('Failed to resend SMS code');
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter') {
        handleVerification();
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mfaState.method === 'totp' 
              ? 'Enter the 6-digit code from your authenticator app'
              : `Enter the 6-digit code sent to ${mfaState.phoneHint || 'your phone'}`
            }
          </p>
        </div>

        {/* Verification Code Input */}
        <div className="space-y-4">
          {!isUsingBackupCode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setVerificationError('');
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backup Code
              </label>
              <input
                type="text"
                value={backupCodeValue}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  // Format with spaces every 4 characters
                  const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                  setBackupCodeValue(formatted);
                  setVerificationError('');
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19} // 16 characters + 3 spaces
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{verificationError}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleVerification}
            disabled={isVerifying || (!code && !backupCodeValue)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Verify & Continue</span>
              </>
            )}
          </button>

          {/* SMS Resend Button */}
          {mfaState.method === 'sms' && !isUsingBackupCode && (
            <button
              onClick={handleResendSMS}
              disabled={resendCooldown > 0}
              className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 px-4 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 
                ? `Resend code in ${resendCooldown}s`
                : 'Resend SMS Code'
              }
            </button>
          )}

          {/* Backup Code Toggle */}
          <button
            onClick={() => {
              setIsUsingBackupCode(!isUsingBackupCode);
              setCode('');
              setBackupCodeValue('');
              setVerificationError('');
            }}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {isUsingBackupCode 
              ? 'Use verification code instead'
              : 'Use backup code instead'
            }
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Lost access to your {mfaState.method === 'totp' ? 'authenticator app' : 'phone'}?</p>
          <button
            onClick={() => {
              // Handle MFA recovery
              const email = getValues('email');
              if (email) {
                router.push(`/forgot-password?email=${encodeURIComponent(email)}&reason=mfa_recovery`);
              }
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Request account recovery
          </button>
        </div>
      </div>
    );
  };

  // Updated submit handler to handle MFA responses
  const onSubmit = async (data: FormInputs): Promise<void> => {
    // Check terms agreement first with immediate feedback
    if (!data.agree_terms) {
      trigger("agree_terms");
      showToast.warning("Please accept the Terms of Use and Privacy Policy to continue.", { duration: 4000 });
      return;
    }

    if (!recaptchaValue) {
      setRecaptchaError(true);
      showToast.warning("Please complete the reCAPTCHA verification to continue.", { duration: 4000 });
      setTimeout(() => emailInputRef.current?.focus(), 100);
      return;
    }
    
    // Show loading toast
    const loadingToastId = showToast.loading("Signing you in...", { duration: 15000 });
    
    try {
      const loginData: ILoginData = {
        email: data.email,
        password: data.password,
      };

      // Add generate_quick_login_key if rememberMe is enabled
      if (rememberMe) {
        (loginData as any).generate_quick_login_key = true;
      }

      await postQuery({
        url: authAPI.local.login,
        postData: loginData,
        requireAuth: false, // Login endpoints are public and don't require authentication
        isLoginRequest: true, // Enable extended timeout for login operations
        onSuccess: (res: any) => {
          console.log('Login response:', res);
          
          // Check if MFA is required
          if (authUtils.isMFARequired(res)) {
                      const mfaResponse = res as IMFALoginRequiredResponse;
          showToast.dismiss(loadingToastId);
          showToast.info("Multi-factor authentication required", { duration: 3000 });
            
            setMFAVerificationState({
              isRequired: true,
              method: mfaResponse.mfa_method,
              userId: mfaResponse.data.user_id,
              phoneHint: mfaResponse.data.phone_hint,
              tempSession: mfaResponse.data.temp_session
            });
            setShowMFAVerification(true);
            setCurrentStep(3); // Add MFA as step 3
            return;
          }
          
          // Handle normal login success (existing code)
          if (!res || !res.data) {
            console.error('Invalid response structure:', res);
            showToast.dismiss(loadingToastId);
                        showToast.error("Invalid response from server. Please try again.", { duration: 5000 });
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
          showToast.dismiss(loadingToastId);
          showToast.error("Incomplete user data received. Please try again.", { duration: 5000 });
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
            showToast.dismiss(loadingToastId);
            showToast.info("Please verify your email to complete login.", { duration: 5000 });
            
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
                showToast.info("Verification code sent to your email inbox.", { duration: 4000 });
              },
              onFail: (error) => {
                console.error("Failed to send verification email:", error);
                const errorMsg = getEnhancedErrorMessage(error);
                showToast.warning(`Login successful, but verification email failed: ${errorMsg}`, { duration: 6000 });
              }
            });
            
            return;
          }

          // Email is verified, proceed with normal login
          showToast.dismiss(loadingToastId);
          
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

          // Extract quick_login_key if present in the response
          const quickLoginKey = res.data?.quick_login_key || null;
          const quickLoginKeyId = res.data?.quick_login_key_id || null;

          completeLoginProcess(loginResponseData, quickLoginKey, quickLoginKeyId);
          setRecaptchaError(false);
          setRecaptchaValue(null);
        },
        onFail: async (error) => {
          console.log('Login error:', error);
          showToast.dismiss(loadingToastId);
          
          // Check if this is a timeout or network error and allow retry
          const isTimeoutError = error?.message?.includes('timeout') || error?.code === 'ECONNABORTED';
          const isNetworkError = error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR';
          
          if (isTimeoutError || isNetworkError) {
            showToast.error("Connection timeout. Please check your internet connection and try again.", { 
              duration: 6000
            });
            return;
          }
          
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
            
            const message = errorResponse?.message || "Please verify your email. A verification code has been sent to your inbox.";
            showToast.info(`${message}`, { duration: 5000 });
            return;
          }
          
          // Check if this is an account lockout error
          const isAccountLocked = errorResponse?.message?.includes("temporarily locked") || 
                                errorResponse?.message?.includes("Account locked") ||
                                errorResponse?.error_code === "ACCOUNT_LOCKED" ||
                                errorResponse?.locked_until;
          
          if (isAccountLocked) {
            setAccountLockInfo({
              isLocked: true,
              lockedUntil: errorResponse?.locked_until,
              message: errorResponse?.message || "Account temporarily locked due to multiple failed login attempts"
            });
            showToast.error("Account temporarily locked for security reasons.", { duration: 6000 });
            return;
          }
          
          // Handle other login errors with enhanced messaging
          const enhancedError = getEnhancedErrorMessage(error);
          showToast.error(enhancedError, { duration: 6000 });
          setTimeout(() => emailInputRef.current?.focus(), 100);
        }
      });
    } catch (error: any) {
      console.error('Login submission error:', error);
      showToast.dismiss(loadingToastId);
      showToast.error("An unexpected error occurred. Please try again.", { duration: 5000 });
    }
  };

  // Handle MFA verification success
  const handleMFASuccess = (loginResponse: ILoginResponse): void => {
    if (loginResponse.success && loginResponse.data) {
      const userRole = getUserRoleFromToken(loginResponse.data.token);

      const loginResponseData: LoginResponseData = {
        id: loginResponse.data.user.id,
        email: loginResponse.data.user.email,
        full_name: loginResponse.data.user.full_name,
        role: userRole ? [userRole] : [], // Use the extracted role, ensure it's an array
        permissions: [],
        access_token: loginResponse.data.token,
        refresh_token: loginResponse.data.session_id,
        emailVerified: loginResponse.data.user.email_verified
      };

      completeLoginProcess(loginResponseData, undefined, undefined);
      setShowMFAVerification(false);
      setMFAVerificationState({
        isRequired: false,
        method: null,
        userId: '',
        phoneHint: '',
        tempSession: false
      });
    }
  };

  // Handle back from MFA
  const handleMFABack = (): void => {
    setShowMFAVerification(false);
    setMFAVerificationState({
      isRequired: false,
      method: null,
      userId: '',
      phoneHint: '',
      tempSession: false
    });
    setCurrentStep(1);
  };

  // Quick Login Handlers
  const handleQuickAccountSelect = (account: RememberedAccount): void => {
    setSelectedAccount(account);
    setQuickLoginError('');
    
    // Check if password is needed
    if (RememberedAccountsManager.needsPasswordEntry(account.email)) {
      setShowQuickPassword(true);
    } else {
      // Perform quick login without password
      performQuickLogin(account);
    }
  };

  const handleQuickPasswordSubmit = (password: string): void => {
    if (selectedAccount) {
      performQuickLogin(selectedAccount, password);
    }
  };

  const handleBackToQuickLogin = (): void => {
    setShowQuickPassword(false);
    setSelectedAccount(null);
    setQuickLoginError('');
  };

  const handleManualLogin = (): void => {
    setShowManualLoginOptions(true);
    setSelectedAccount(null);
    setShowQuickPassword(false);
    setShowEmailLogin(false);
    setQuickLoginError('');
  };

  const handleRemoveQuickAccount = (email: string): void => {
    try {
      RememberedAccountsManager.removeRememberedAccount(email);
      showToast.info('Account removed locally. To fully revoke the login key on the server, please do so from your dashboard after logging in.', { duration: 6000 });
      
      // If no more accounts, switch to manual login
      if (!hasRememberedAccounts()) {
        setShowQuickLogin(false);
      }
    } catch (error) {
      console.error('Error removing account:', error);
    }
  };

  // Perform quick login with retry logic
  const performQuickLogin = async (account: RememberedAccount, password?: string, retryCount = 0): Promise<void> => {
    const maxRetries = 2;
    const loadingToastId = showToast.loading(
      retryCount > 0 ? `Retrying login (${retryCount}/${maxRetries})...` : "Signing you in...", 
      { duration: 15000 }
    );
    
    try {
      let res: any;
      
      // Attempt quick login with quickLoginKey first if available and no password explicitly provided
      if (account.quickLoginKey && !password) {
        console.log('Attempting quick login with quickLoginKey for email:', account.email);
        console.log('QuickLoginKey being sent:', account.quickLoginKey); // Log the key being sent
        try {
          res = await postQuery({
            url: authAPI.local.quickLogin,
            postData: { email: account.email, quick_login_key: account.quickLoginKey },
            requireAuth: false, // Quick login endpoint is public
            isLoginRequest: true,
            disableToast: true, // Handle toasts manually for this specific flow
          });

          console.log('Quick login API response (res object):', res); // Add this log to inspect the full response
          console.log('--- Debugging Quick Login Condition ---');
          console.log('res.data:', res.data);
          console.log('res.data.access_token:', res.data?.access_token);
          console.log('res.data.token:', res.data?.token);
          console.log('--- End Debugging ---');

          // If quick login is successful, the response data will be similar to login
          // and should contain new access token and possibly new refresh token
          if (res && res.data && res.data.data && (res.data.data.access_token || res.data.data.token)) {
            showToast.dismiss(loadingToastId);
            showToast.success("Welcome back! Logged in with quick login key.", { duration: 2000 });
            
            const newQuickLoginKey = res.data.data.quick_login_key; // Corrected path

            // Update the remembered account's quickLoginKey if a new one is issued,
            // otherwise retain the old one since quick login was successful with it.
            RememberedAccountsManager.addRememberedAccount({
              email: account.email,
              fullName: account.fullName,
              role: account.role,
              quickLoginKey: newQuickLoginKey !== null ? newQuickLoginKey : account.quickLoginKey, // Preserve if null
              keyId: newQuickLoginKey !== null ? res.data.data.key_id : null // Add keyId
            });
            
            completeLoginProcess({
              id: res.data.data.user.id || '',
              email: res.data.data.user.email || '',
              full_name: res.data.data.user.full_name || '',
              role: res.data.data.user.role || [],
              permissions: res.data.data.user.permissions || [],
              access_token: res.data.data.access_token || res.data.data.token, // Corrected path
              refresh_token: res.data.data.refresh_token || res.data.data.session_id, // Corrected path
              emailVerified: res.data.data.user.email_verified
            }, newQuickLoginKey !== null ? newQuickLoginKey : account.quickLoginKey, newQuickLoginKey !== null ? res.data.data.key_id : null); // Pass the new or existing quickLoginKey and keyId
            return; // Exit after successful quick login
          } else {
            console.warn('Quick login key returned invalid data, falling back to password login.', res);
            setQuickLoginError("Quick login session expired or invalid. Please enter your password.");
            setShowQuickPassword(true); // Force password entry
            showToast.dismiss(loadingToastId);
            return; // Exit as we're now showing password input
          }
        } catch (quickLoginError: any) {
          console.error('Quick login failed, falling back to password login:', quickLoginError);
          console.log('Full quickLoginError object:', quickLoginError); // Log the full error object
          const errorMessage = getEnhancedErrorMessage(quickLoginError); // Reuse existing helper
                      showToast.error(`Quick login failed: ${errorMessage}`, { duration: 6000 }); // Show the error to the user
          setQuickLoginError("Quick login session expired or invalid. Please enter your password.");
          setShowQuickPassword(true); // Force password entry
          showToast.dismiss(loadingToastId);
          return; // Exit as we're now showing password input
        }
      }

      // If quick login key not available or failed, proceed with password-based login
      if (!password) {
        // If we reach here, it means no quick login key or quick login failed, so we MUST ask for password
        setQuickLoginError("Please enter your password to continue.");
        setShowQuickPassword(true); // Force password entry
        showToast.dismiss(loadingToastId);
        return; // Exit as we're now showing password input
      }

      // Conditionally include password in loginData (only if provided)
      const loginData: ILoginData = {
        email: account.email,
        password: password // Password is guaranteed to be here at this point
      };

      await postQuery({
        url: authAPI.local.login,
        postData: loginData,
        requireAuth: false, // Login endpoints are public and don't require authentication
        isLoginRequest: true, // Enable extended timeout for login operations
        onSuccess: (res: any) => {
          showToast.dismiss(loadingToastId);
          
          // Handle the same login success flow as regular login
          if (authUtils.isMFARequired(res)) {
            const mfaResponse = res as IMFALoginRequiredResponse;
            showToast.info("Multi-factor authentication required", { duration: 3000 });
            
            setMFAVerificationState({
              isRequired: true,
              method: mfaResponse.mfa_method,
              userId: mfaResponse.data.user_id,
              phoneHint: mfaResponse.data.phone_hint,
              tempSession: mfaResponse.data.temp_session
            });
            setShowMFAVerification(true);
            setShowQuickLogin(false);
            setShowQuickPassword(false);
            return;
          }
          
          if (!res || !res.data) {
                        showToast.error("Invalid response from server. Please try again.", { duration: 5000 });
          return;
        }
        
        const isNestedStructure = res.data && 'user' in res.data && res.data.user;
        const userData = isNestedStructure ? res.data.user : res.data;
        const token = isNestedStructure ? res.data.token : res.data.access_token;
        const refreshToken = isNestedStructure ? res.data.session_id : res.data.refresh_token;
        const quickLoginKey = res.data?.quick_login_key || null; // Capture quick_login_key from regular login as well
        const quickLoginKeyId = res.data?.quick_login_key_id || null;
        
        if (!userData || !userData.id || !userData.email) {
          showToast.error("Incomplete user data received. Please try again.", { duration: 5000 });
          return;
        }

          const loginResponseData: LoginResponseData = {
            id: userData.id || '',
            email: userData.email || '',
            full_name: userData.full_name || '',
            role: userData.role || [],
            permissions: userData.permissions || [],
            access_token: token || '',
            refresh_token: refreshToken || '',
            emailVerified: userData.email_verified
          };

          // Update last used account (and its quickLoginKey if a new one was issued)
          RememberedAccountsManager.setLastUsedAccount(account.email);
          if (quickLoginKey) {
            RememberedAccountsManager.addRememberedAccount({
              email: account.email,
              fullName: account.fullName,
              role: account.role,
              quickLoginKey: quickLoginKey, // Update with the new quickLoginKey from login
              keyId: quickLoginKeyId
            });
          } else {
            // If quickLoginKey is not present, remove any old one to ensure password prompt for next login
            RememberedAccountsManager.addRememberedAccount({
              email: account.email,
              fullName: account.fullName,
              role: account.role,
              quickLoginKey: undefined,
              keyId: undefined
            });
          }
          
          completeLoginProcess(loginResponseData, quickLoginKey, quickLoginKeyId); // Pass quickLoginKey to completeLoginProcess
        },
        onFail: async (error) => {
          showToast.dismiss(loadingToastId);
          console.error('Quick login error:', error);
          
          // Check if this is a timeout or network error and retry if possible
          const isTimeoutError = error?.message?.includes('timeout') || error?.code === 'ECONNABORTED';
          const isNetworkError = error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR';
          
          if ((isTimeoutError || isNetworkError) && retryCount < maxRetries) {
            console.log(`Retrying login due to ${isTimeoutError ? 'timeout' : 'network'} error (attempt ${retryCount + 1}/${maxRetries})`);
            showToast.info(`Connection issue detected. Retrying... (${retryCount + 1}/${maxRetries})`, { duration: 3000 });
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 + (retryCount * 1000)));
            
            // Retry the login
            await performQuickLogin(account, password, retryCount + 1);
            return;
          }
          
          const enhancedError = getEnhancedErrorMessage(error);
          setQuickLoginError(enhancedError);
          
          // If password was required but failed, show password form
          if (password) {
            // Stay on password form with error
          } else {
            // This case should ideally not be hit if quick login key path is taken first
            // but as a fallback, ensure password form is shown
            setShowQuickPassword(true);
          }
        }
      });
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      console.error('Quick login submission error:', error);
      setQuickLoginError("An unexpected error occurred. Please try again.");
    }
  };

  // Account Lockout Warning Component
  const AccountLockoutWarning = () => {
    const formatLockoutTime = (lockedUntil: string) => {
      try {
        const lockDate = new Date(lockedUntil);
        const now = new Date();
        const timeDiff = lockDate.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
          return "Your account should be unlocked now. Please try again.";
        }
        
        const minutes = Math.ceil(timeDiff / (1000 * 60));
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        
        if (minutes < 60) {
          return `Account will be unlocked in approximately ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
          return `Account will be unlocked in approximately ${hours} hour${hours !== 1 ? 's' : ''}`;
        }
      } catch (error) {
        return "Account is temporarily locked. Please try again later.";
      }
    };

    const handleTryAgain = () => {
      setAccountLockInfo({ isLocked: false });
      reset();
      setTimeout(() => emailInputRef.current?.focus(), 100);
    };

    const handleContactSupport = () => {
      window.open('mailto:support@medh.io?subject=Account Lockout Issue', '_blank');
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-300/30 dark:bg-red-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-orange-300/30 dark:bg-orange-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            
            {/* Header */}
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
              <Link href="/" className="inline-block mb-4">
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

            {/* Warning Content */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Warning Title */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Account Temporarily Locked
              </h2>

              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                      {accountLockInfo.message}
                    </p>
                    {accountLockInfo.lockedUntil && (
                      <div className="flex items-center text-xs text-red-700 dark:text-red-300">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatLockoutTime(accountLockInfo.lockedUntil)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Why was my account locked?
                </h3>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Multiple failed login attempts detected</li>
                  <li>• This is a security measure to protect your account</li>
                  <li>• Your account will be automatically unlocked after the timeout period</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleTryAgain}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </button>

                <Link
                  href="/forgot-password"
                  className="w-full flex items-center justify-center px-4 py-2.5 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Reset Password Instead
                </Link>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Link 
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Show account lockout warning if account is locked
  if (accountLockInfo.isLocked) {
    return <AccountLockoutWarning />;
  }

  // Show MFA verification if needed
  if (showMFAVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container */}
          <div className="login-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            
            {/* Header */}
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

            {/* Stepper UI for MFA */}
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
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">2FA</span>
                </div>
              </div>
            </div>
            
            {/* MFA Form */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <MFAVerificationStep
                mfaState={mfaVerificationState}
                onVerificationSuccess={handleMFASuccess}
                onBack={handleMFABack}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication or during login process
  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
          <p className="font-body text-gray-600 dark:text-gray-300">
            {isCheckingAuth ? "Checking authentication..." : "Signing you in..."}
          </p>
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

        /* Remove all scrolling */
        html, body {
          overflow: hidden;
          height: 100vh;
          position: fixed;
          width: 100%;
        }
      `}</style>
      
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container */}
          <div className="login-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 max-h-[85vh] overflow-y-auto">
            
            {/* Header area */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-2 text-center relative">
              {/* Back to Home link */}
              <Link 
                href="/"
                className="absolute left-4 top-4 sm:left-6 sm:top-6 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex items-center text-xs"
                aria-label="Back to homepage"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              
              <Link href="/" className="inline-block mb-2 sm:mb-3">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={100} 
                  height={32} 
                  className="mx-auto w-24 sm:w-32"
                  priority
                />
              </Link>
              
              {/* Show header only when not in quick login or when showing manual login options */}
              {(!showQuickLogin || showManualLoginOptions) && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    {isDemoScheduling ? 'Join Demo Class!' : 'Welcome Back!'}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {isDemoScheduling 
                      ? 'Sign in to schedule your free demo class' 
                      : 'Sign in to continue your learning journey'
                    }
                  </p>
                </>
              )}
              
              {/* Demo scheduling indicator */}
              {isDemoScheduling && (!showQuickLogin || showManualLoginOptions) && (
                <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-full text-xs font-medium text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  Free Demo Class Access
                </div>
              )}
            </div>
            
            {/* Form area */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-6">
              {/* Quick Login Interface - Show by default if accounts exist */}
              {showQuickLogin && !showQuickPassword && !showManualLoginOptions && !showEmailLogin ? (
                <div className="space-y-4">
                  <QuickLoginAccounts
                    onAccountSelect={handleQuickAccountSelect}
                    onManualLogin={() => setShowManualLoginOptions(true)}
                    onRemoveAccount={handleRemoveQuickAccount}
                    isLoading={loading}
                  />
                </div>
              ) : showQuickPassword && selectedAccount ? (
                <QuickLoginPassword
                  account={selectedAccount}
                  onSubmit={handleQuickPasswordSubmit}
                  onBack={handleBackToQuickLogin}
                  isLoading={loading}
                  error={quickLoginError}
                />
              ) : showManualLoginOptions ? (
                /* Manual Login Options */
                <div className="space-y-4">
                  {/* Back to saved accounts if available */}
                  {hasRememberedAccounts() && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setShowManualLoginOptions(false)}
                        className="w-full py-2.5 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium rounded-xl border border-dashed border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-solid transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back to saved accounts
                      </button>
                    </div>
                  )}

                                     {/* Login Options */}
                   <div className="space-y-3">
                     <h3 className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                       Choose your sign-in method
                     </h3>
                     
                     {/* Email Login Option */}
                     <button
                       type="button"
                       onClick={() => {
                         console.log('Email login button clicked');
                         setShowEmailLogin(true);
                         setShowManualLoginOptions(false);
                         setShowQuickLogin(false);
                       }}
                       className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                     >
                       <Mail className="w-5 h-5 mr-3" />
                       Sign in with Email
                     </button>
                    
                    {/* Google Login Option */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={isOAuthLoading.google}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isOAuthLoading.google ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-300" />
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Continue with Google
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                </div>
              ) : showEmailLogin ? (
                /* Email Login Form */
                <form 
                  onSubmit={handleSubmit(onSubmit)} 
                  className="space-y-4"
                  onKeyDown={handleKeyDown}
                >
                  {/* Back to options */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailLogin(false);
                        setShowManualLoginOptions(true);
                        // Restore quick login if accounts exist
                        if (hasRememberedAccounts()) {
                          setShowQuickLogin(true);
                        }
                      }}
                      className="w-full py-2.5 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium rounded-xl border border-dashed border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-solid transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to sign-in options
                    </button>
                  </div>

                  {/* Email field */}
                  <div>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                          errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11`}
                        {...register("email", {
                          required: true,
                          onChange: (e) => {
                            e.target.value = e.target.value.trimStart();
                            setTimeout(() => trigger("email"), 100);
                          },
                          onBlur: (e) => {
                            setValue("email", e.target.value.trim(), { shouldValidate: true });
                          }
                        })}
                        ref={emailInputRef}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
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
                        className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                          errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11`}
                        {...register("password")}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
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
                        className="h-4 w-4 rounded-md text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        onChange={handleRememberMeChange}
                        checked={rememberMe}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-right">
                      <a
                        href="/forgot-password"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  {/* Terms Checkbox */}
                  <div className="w-full">
                    <div
                      className={`w-full p-3 rounded-xl border transition-all duration-300 cursor-pointer select-none
                        ${errors.agree_terms 
                          ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                          : getValues('agree_terms')
                            ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30'
                        }`}
                      onClick={() => setValue('agree_terms', !getValues('agree_terms'), { shouldValidate: true })}
                    >
                      <div className="flex items-center space-x-3">
                        {getValues('agree_terms') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                        ) : errors.agree_terms ? (
                          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        ) : (
                          <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                        <span className={`text-sm ${
                          errors.agree_terms 
                            ? 'text-red-600 dark:text-red-400' 
                            : getValues('agree_terms')
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {errors.agree_terms 
                            ? 'Terms acceptance required' 
                            : getValues('agree_terms')
                              ? 'Agreed to Terms of Use and Privacy Policy'
                              : 'I agree to the Terms of Use and Privacy Policy'}
                        </span>
                      </div>
                    </div>
                    
                    <input
                      type="checkbox"
                      {...register("agree_terms")}
                      className="hidden"
                    />
                    
                    {errors.agree_terms && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span>Please accept our Terms of Use and Privacy Policy to continue</span>
                      </p>
                    )}
                  </div>

                                    {/* Custom ReCAPTCHA */}
                   <div className={`transition-all duration-200 ${
                     recaptchaError 
                       ? 'border-2 border-red-300 dark:border-red-500 rounded-lg bg-red-50/30 dark:bg-red-900/10 p-2' 
                       : ''
                   }`}>
                     <CustomReCaptcha onChange={handleRecaptchaChange} error={!!recaptchaError} />
                     {recaptchaError && (
                       <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                         <AlertCircle className="h-4 w-4 flex-shrink-0" />
                         <span>Please complete the verification to continue</span>
                       </div>
                     )}
                   </div>

                   {/* Terms agreement text */}
                   <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                     <span>By submitting this form, I agree to the{" "}
                       <a 
                         href="/terms-and-services" 
                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" 
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                         Terms of Use
                       </a>
                       {" "}and{" "}
                       <a 
                         href="/privacy-policy" 
                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" 
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                         Privacy Policy
                       </a>
                     </span>
                   </div>
                  
                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </form>
              ) : (
                                 /* No saved accounts - show manual login options directly */
                 <div className="space-y-4">
                   <div className="space-y-3">
                     <h3 className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                       Choose your sign-in method
                     </h3>
                     
                     {/* Email Login Option */}
                     <button
                       type="button"
                       onClick={() => {
                         console.log('Email login button clicked (no saved accounts)');
                         setShowEmailLogin(true);
                       }}
                       className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                     >
                       <Mail className="w-5 h-5 mr-3" />
                       Sign in with Email
                     </button>
                    
                    {/* Google Login Option */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={isOAuthLoading.google}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isOAuthLoading.google ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-300" />
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Continue with Google
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                </div>
              )}
            </div>
          </div>
          
          {/* Social proof */}
          <div className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
            <p>Trusted by students worldwide</p>
          </div>
          
          {/* Updated Copyright notice */}
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

