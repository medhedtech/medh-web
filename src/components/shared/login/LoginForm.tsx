"use client";
import React, { useEffect, useState, useRef } from "react";
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
  role: string[];
  permissions: string[];
  access_token: string;
  refresh_token: string;
  emailVerified?: boolean; // Add email verification status
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
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
  
  // Define role-based redirects
  const getRoleBasedRedirectPath = (role: string): string => {
    const roleLower = role.toLowerCase();
    const roleMap: Record<string, string> = {
      "admin": "/dashboards/admin",
      "super-admin": "/dashboards/admin",
      "instructor": "/dashboards/instructor",
      "student": "/dashboards/student",
      "coorporate": "/dashboards/coorporate",
      "coorporate-student": "/dashboards/coorporate-employee-dashboard"
    };
    
    return roleMap[roleLower] || "/";
  };

  // Enhanced keyboard support for form navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow users to submit form with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(onSubmit)();
    }
  };

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
    // Prepare auth data with the exact structure
    const authData: AuthData = {
      token: loginData.access_token,
      refresh_token: loginData.refresh_token,
      id: loginData.id,
      full_name: loginData.full_name,
      email: loginData.email
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

    // Extract user role from the response
    const userRole = Array.isArray(loginData.role) ? loginData.role[0] : loginData.role;
    const fullName = loginData.full_name;

    // Store role and full name in localStorage
    if (userRole) {
      localStorage.setItem("role", userRole);
    }
    if (fullName) {
      localStorage.setItem("fullName", fullName);
    }

    // Store data in storage manager
    const storageData: StorageManagerLoginData = {
      token: loginData.access_token,
      refresh_token: loginData.refresh_token,
      userId: loginData.id,
      email: loginData.email,
      password: rememberMe ? getValues('password') : undefined,
      role: userRole,
      fullName: fullName,
      permissions: loginData.permissions,
      rememberMe: rememberMe
    };

    storageManager.login(storageData);

    // Track login event
    events.login(userRole || 'user');
    
    // Show success message and redirect
    toast.success("Login successful! Redirecting...");
    
    // Enhanced redirect logic to ensure proper URL handling
    if (redirectPath && redirectPath.startsWith('/')) {
      router.push(redirectPath);
    } else {
      const dashboardPath = getRoleBasedRedirectPath(userRole);
      router.push(dashboardPath);
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
  
  // Updated submit handler using the enhanced auth utilities
  const onSubmit = async (data: FormInputs): Promise<void> => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      setTimeout(() => emailInputRef.current?.focus(), 100);
      return;
    }
    
    try {
      await postQuery({
        url: apiUrls?.user?.login,
        postData: {
          email: data.email,
          password: data.password,
          agree_terms: data?.agree_terms,
        },
        onSuccess: (res: LoginResponse) => {
          console.log('Login response:', res);

          // Check if email verification is required (legacy check)
          if (res.data.emailVerified === false) {
            // User needs to verify email first
            setPendingLoginData(res.data);
            setVerificationEmail(res.data.email);
            setCurrentStep(2);
            setShowOTPVerification(true);
            
            // Send verification email
            postQuery({
              url: apiUrls?.user?.resendOTP,
              postData: { email: res.data.email },
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
          completeLoginProcess(res.data);
          
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
            
            // Create mock login data for verification flow
            const mockLoginData: LoginResponseData = {
              id: '', // Will be filled after verification
              email: email,
              full_name: '', // Will be filled after verification
              role: [],
              permissions: [],
              access_token: '', // Will be filled after verification
              refresh_token: '', // Will be filled after verification
              emailVerified: false
            };
            
            setPendingLoginData(mockLoginData);
            setVerificationEmail(email);
            setCurrentStep(2);
            setShowOTPVerification(true);
            
            // Show appropriate message
            toast.info(errorResponse?.message || "Please verify your email. A verification code has been sent to your inbox.");
            
            return;
          }
          
          // Handle other login errors
          toast.error(error?.message || "Login failed. Please check your credentials.");
          
          // Don't log sensitive information to console in production
          if (process.env.NODE_ENV !== 'production') {
            console.warn("Login error:", error);
          }
          
          setTimeout(() => emailInputRef.current?.focus(), 100);
        },
      });
    } catch (error) {
      // Gracefully handle unexpected errors
      toast.error("An unexpected error occurred. Please try again later.");
      
      // Only log error details in development
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
