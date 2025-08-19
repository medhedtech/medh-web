"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, ChevronLeft, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";
import CustomReCaptcha from '../../shared/ReCaptcha';
import { useTheme } from "next-themes";
import { useCurrentYear } from "@/utils/hydration";
import { showToast } from "@/utils/toastManager";

// Define form data interface
interface IForgotPasswordFormData {
  email: string;
  tempPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  token?: string;
}

// Define base validation schema - we'll handle step-specific validation manually
const schema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    tempPassword: yup.string().optional(),
    newPassword: yup.string().optional(),
    confirmPassword: yup.string().optional(),
    token: yup.string().optional(),
  })
  .required();

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [tempPasswordVerified, setTempPasswordVerified] = useState<boolean>(false);
  const { postQuery, loading } = usePostQuery();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<IForgotPasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch form values for conditional validation
  const emailValue = watch("email");
  const newPasswordValue = watch("newPassword");
  
  // Debug password value changes
  useEffect(() => {
    if (newPasswordValue !== undefined) {
      console.log('Password value changed:', newPasswordValue);
      console.log('Password length:', newPasswordValue?.length);
    }
  }, [newPasswordValue]);

  // Initialize theme to light if not set
  useEffect(() => {
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Effect to read token from URL and pre-fill if available
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      console.log('Token found in URL:', urlToken);
      setValue('token', urlToken);
      setTempPasswordVerified(true); 
    }
  }, [searchParams, setValue]);

  const handleRecaptchaChange = (value: string | null): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
    if (value) {
      showToast.success("✅ Human verification completed!", { duration: 2000 });
    }
  };

  // Enhanced error message handler
  const getEnhancedErrorMessage = (error: any): string => {
    const errorResponse = error?.response?.data;
    const status = error?.response?.status;
    const message = errorResponse?.message || error?.message || 'An unexpected error occurred';

    // Network and connection errors
    if (!navigator.onLine) {
      return "🌐 No internet connection. Please check your network and try again.";
    }

    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      return "🔌 Unable to connect to our servers. Please check your internet connection and try again.";
    }

    // HTTP status specific errors
    switch (status) {
      case 400:
        if (message.includes('email')) {
          return "📧 Please enter a valid email address.";
        }
        return `❌ ${message}`;
      
      case 401:
        return "🔒 Invalid credentials. Please check and try again.";
      
      case 404:
        return "❓ Account not found. Please check your email address.";
      
      case 429:
        return "🚦 Too many attempts. Please wait a few minutes before trying again.";
      
      case 500:
        return "🛠️ Our servers are experiencing issues. Please try again later.";
      
      default:
        return `❗ ${message}`;
    }
  };

  const onSubmit = async (data: IForgotPasswordFormData): Promise<void> => {
    if (isSubmitting) return;
    
    // Step-specific validation
    if (!emailSent) {
      // Step 1: Email validation
      if (!data.email) {
        showToast.error("❌ Please enter your email address.", { duration: 4000 });
        return;
      }
      if (!recaptchaValue) {
        setRecaptchaError(true);
        showToast.warning("🤖 Please complete the reCAPTCHA verification to continue.", { duration: 4000 });
        return;
      }
    } else if (!tempPasswordVerified) {
      // Step 2: Temporary password validation
      if (!data.tempPassword) {
        showToast.error("❌ Please enter the temporary password from your email.", { duration: 4000 });
        return;
      }
    } else {
      // Step 3: New password validation
      if (!data.newPassword) {
        showToast.error("❌ Please enter a new password.", { duration: 4000 });
        return;
      }
      if (!data.newPassword || data.newPassword.length === 0) {
        showToast.error("❌ Password cannot be empty.", { duration: 4000 });
        return;
      }
      
      if (!data.confirmPassword) {
        showToast.error("❌ Please confirm your new password.", { duration: 4000 });
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        showToast.error("❌ Passwords do not match.", { duration: 4000 });
        return;
      }
    }
    
    setIsSubmitting(true);
    const loadingToastId = showToast.loading("🔄 Processing your request...", { duration: 15000 });
    
    try {
      if (!emailSent) {
        // Step 1: Send temporary password email
        const response = await postQuery({
          url: apiUrls?.user?.sendResetEmail,
          postData: {
            email: data.email,
          },
          requireAuth: false,
          disableToast: true, // Handle toasts manually
        });

        if (response && response.data && (response.data as any).success) {
          showToast.dismiss(loadingToastId);
          showToast.success("📧 Password reset email sent! Please check your inbox.", { duration: 4000 });
          console.log('Setting emailSent to true...');
          setEmailSent(true);
          setRecaptchaError(false);
          console.log('Successfully moved to step 2, emailSent should now be:', true);
          
          // Force a re-render to ensure state update
          setTimeout(() => {
            console.log('Current emailSent state after timeout:', emailSent);
          }, 100);
        } else {
          showToast.dismiss(loadingToastId);
          const errorMessage = (response?.data as any)?.message || "Failed to send reset email";
          showToast.error(`❌ ${errorMessage}`, { duration: 6000 });
        }
      } else if (!tempPasswordVerified) {
        // Step 2: Verify temporary password
        const response = await postQuery({
          url: apiUrls?.user?.verfiySystemPassword,
          postData: {
            email: data.email,
            tempPassword: data.tempPassword,
          },
          requireAuth: false,
          disableToast: true,
        });

        if (response && response.data && (response.data as any).success) {
          showToast.dismiss(loadingToastId);
          showToast.success("✅ Password verified successfully!", { duration: 3000 });
          setTempPasswordVerified(true);
          console.log('Successfully moved to step 3, tempPasswordVerified:', true);
        } else {
          showToast.dismiss(loadingToastId);
          
          // Handle validation errors from API
          const apiResponse = response?.data as any;
          if (apiResponse?.errors && Array.isArray(apiResponse.errors)) {
            // Show the first validation error
            const firstError = apiResponse.errors[0];
            const errorMessage = firstError?.msg || "Validation failed";
            showToast.error(`❌ ${errorMessage}`, { duration: 6000 });
          } else {
            const errorMessage = apiResponse?.message || "Invalid password";
            showToast.error(`❌ ${errorMessage}`, { duration: 6000 });
          }
        }
      } else {
        // Step 3: Update to new password
        console.log('Step 3 - Form data received:', data);
        console.log('New password value:', data.newPassword);
        console.log('New password length:', data.newPassword?.length);
        
        const payload = {
          email: data.email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        };
        
        console.log('Payload being sent:', payload);
        
        const response = await postQuery({
          url: apiUrls?.user?.resetPassword,
          postData: payload,
          requireAuth: false,
          disableToast: true,
        });

        if (response && response.data && (response.data as any).success) {
          showToast.dismiss(loadingToastId);
          showToast.success("🎉 Password reset successful! You can now log in with your new password.", { duration: 5000 });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          showToast.dismiss(loadingToastId);
          
          // Handle validation errors from API
          const apiResponse = response?.data as any;
          if (apiResponse?.errors && Array.isArray(apiResponse.errors)) {
            // Show the first validation error
            const firstError = apiResponse.errors[0];
            const errorMessage = firstError?.msg || "Validation failed";
            showToast.error(`❌ ${errorMessage}`, { duration: 6000 });
          } else {
            const errorMessage = apiResponse?.message || "Failed to reset password";
            showToast.error(`❌ ${errorMessage}`, { duration: 6000 });
          }
        }
      }
    } catch (error) {
      showToast.dismiss(loadingToastId);
      const enhancedError = getEnhancedErrorMessage(error);
      showToast.error(enhancedError, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when email changes (but only if user is actually changing it)
  useEffect(() => {
    // Only reset if the email actually changed and we're not in the middle of a step
    const currentEmail = watch("email");
    if (currentEmail && emailSent && currentEmail !== emailValue) {
      console.log('Email changed, resetting form states');
      setEmailSent(false);
      setTempPasswordVerified(false);
      setValue("tempPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    }
  }, [emailValue, emailSent, setValue, watch]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
          <p className="font-body text-gray-600 dark:text-gray-300">
            Processing your request...
          </p>
        </div>
      </div>
    );
  }

  // Get current step info
  const getCurrentStepInfo = () => {
    if (!emailSent) {
      return {
        title: "Forget Password",
        step: 1,
        totalSteps: 3
      };
    } else if (!tempPasswordVerified) {
      return {
        title: "Verify Temporary Password",
        subtitle: "Enter the temporary password sent to your email",
        step: 2,
        totalSteps: 3
      };
    } else {
      return {
        title: "Create New Password",
        subtitle: "Create a strong new password for your account",
        step: 3,
        totalSteps: 3
      };
    }
  };

  const stepInfo = getCurrentStepInfo();

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
            overflow: auto;
            height: auto;
          }
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container with glass morphism effect */}
          <div className="forgot-password-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            
            {/* Header area with navigation */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 text-center relative">
              {/* Back to Login link */}
              <Link 
                href="/login"
                className="absolute left-4 top-4 sm:left-6 sm:top-6 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex items-center text-xs"
                aria-label="Back to login"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Back to Login</span>
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
                {stepInfo.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {stepInfo.subtitle}
              </p>
            </div>

            {/* Stepper UI */}
            <div className="px-4 sm:px-8 mb-4">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {[1, 2, 3].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        stepInfo.step > step 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                          : stepInfo.step === step
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      } flex items-center justify-center`}>
                        {stepInfo.step > step ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{step}</span>
                        )}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${
                        stepInfo.step >= step 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {step === 1 ? 'Email' : step === 2 ? 'Verify' : 'Reset'}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className="flex-1 mx-2">
                        <div className={`h-0.5 ${
                          stepInfo.step > step + 1 
                            ? 'bg-primary-500' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Form area */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-5">
                
                {/* Email field */}
                <div>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      disabled={emailSent && !tempPasswordVerified}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                        errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed`}
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

                {/* reCAPTCHA - only show for initial email step */}
                {!emailSent && (
                  <div className={`scale-90 sm:scale-100 origin-center transition-all duration-200 ${
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
                )}
                
                {/* Temporary Password Field */}
                {emailSent && !tempPasswordVerified && (
                  <div>
                    <div className="relative">
                      <input
                        {...register("tempPassword")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Temporary password from email"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                          errors.tempPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base`}
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
                    {errors.tempPassword && (
                      <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span>{errors.tempPassword.message}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* New Password Fields */}
                {tempPasswordVerified && (
                  <>
                    {/* New Password */}
                    <div>
                      <div className="relative">
                        <input
                          {...register("newPassword")}
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="New password"
                          onChange={(e) => {
                            console.log('Input onChange:', e.target.value);
                            console.log('Input onChange length:', e.target.value.length);
                            // Call the react-hook-form onChange
                            register("newPassword").onChange(e);
                          }}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                            errors.newPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                          <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                          <span>{errors.newPassword.message}</span>
                        </p>
                      )}
                      
                      {/* Password Requirements */}
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p className="font-medium">Password must contain:</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-2">
                          <li>At least 8 characters</li>
                          <li>One uppercase letter (A-Z)</li>
                          <li>One lowercase letter (a-z)</li>
                          <li>One number (0-9)</li>
                          <li>One special character (@$!%*?&)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <div className="relative">
                        <input
                          {...register("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm new password"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border ${
                            errors.confirmPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-start" role="alert">
                          <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                          <span>{errors.confirmPassword.message}</span>
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting || (!emailSent && recaptchaError)}
                    className="w-full py-2 sm:py-2.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {!emailSent
                            ? "Send Reset Email"
                            : !tempPasswordVerified
                            ? "Verify Password"
                            : "Reset Password"}
                          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center mt-2 sm:mt-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link 
                      href="/login" 
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Back to Login
                    </Link>
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

export default ForgotPassword;
