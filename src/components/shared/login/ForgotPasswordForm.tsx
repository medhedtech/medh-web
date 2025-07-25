"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft, 
  Shield,
  RefreshCw,
  Check,
  Clock
} from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import { useTheme } from "next-themes";
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

interface ForgotPasswordFormInputs {
  email: string;
  tempPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ForgotPasswordFormProps {
  redirectPath?: string;
}

const emailSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email").required("Email is required"),
});

const tempPasswordSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email").required("Email is required"),
  tempPassword: yup.string().required("Temporary password is required"),
});

const newPasswordSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email").required("Email is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ redirectPath }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();
  const { postQuery, loading } = usePostQuery();

  // Form states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [tempPasswordVerified, setTempPasswordVerified] = useState<boolean>(false);
  const [showTempPassword, setShowTempPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Get current schema based on step
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1:
        return emailSchema;
      case 2:
        return tempPasswordSchema;
      case 3:
        return newPasswordSchema;
      default:
        return emailSchema;
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    reset,
    getValues,
    clearErrors,
    watch
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(getCurrentSchema() as any),
    defaultValues: {
      email: "",
      tempPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Initialize theme to light if not set
  useEffect(() => {
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Check for pre-filled email from URL params
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const reasonParam = searchParams.get('reason');
    
    if (emailParam) {
      setValue("email", emailParam, { shouldValidate: true });
      setUserEmail(emailParam);
      clearErrors("email");
    }

    // If this is MFA recovery, show appropriate message
    if (reasonParam === 'mfa_recovery') {
      showToast.info("Reset your password to regain access to your account", { duration: 5000 });
    }
  }, [searchParams, setValue, clearErrors, showToast]);

  const handleRecaptchaChange = (value: string): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
    if (value) {
      showToast.success("Human verification completed successfully", { duration: 2000 });
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
        if (message.includes('email')) {
          return "Please enter a valid email address.";
        }
        if (message.includes('password')) {
          return "Invalid password. Please check and try again.";
        }
        return `${message}`;
      
      case 401:
        return "Invalid credentials. Please check your information.";
      
      case 404:
        return "Account not found. Please check your email address.";
      
      case 429:
        return "Too many attempts. Please wait a few minutes before trying again.";
      
      case 500:
        return "Our servers are experiencing issues. Please try again later.";
      
      case 502:
      case 503:
      case 504:
        return "Our services are temporarily unavailable. Please try again in a few minutes.";
      
      default:
        return `${message}`;
    }
  };

  // Enhanced keyboard support for form navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow users to submit form with Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: ForgotPasswordFormInputs): Promise<void> => {
    if (isSubmitting) return;

    // Step-specific validation
    if (currentStep === 1) {
      if (!data.email) {
        showToast.error("Please enter your email address.", { duration: 4000 });
        return;
      }
      if (!recaptchaValue) {
        setRecaptchaError(true);
        showToast.warning("Please complete the reCAPTCHA verification to continue.", { duration: 4000 });
        return;
      }
    } else if (currentStep === 2) {
      if (!data.tempPassword) {
        showToast.error("Please enter the temporary password from your email.", { duration: 4000 });
        return;
      }
    } else if (currentStep === 3) {
      if (!data.newPassword) {
        showToast.error("Please enter a new password.", { duration: 4000 });
        return;
      }
      if (!data.confirmPassword) {
        showToast.error("Please confirm your new password.", { duration: 4000 });
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        showToast.error("Passwords do not match.", { duration: 4000 });
        return;
      }
    }

    setIsSubmitting(true);
    const loadingToastId = showToast.loading("Processing your request...", { duration: 15000 });

    try {
      if (currentStep === 1) {
        // Step 1: Send reset email
        await postQuery({
          url: apiUrls?.user?.sendResetEmail,
          postData: { email: data.email },
          requireAuth: false,
          onSuccess: (res: any) => {
            showToast.dismiss(loadingToastId);
            if (res?.data?.success) {
              showToast.success("Password reset email sent! Please check your inbox.", { duration: 4000 });
              setUserEmail(data.email);
              setEmailSent(true);
              setCurrentStep(2);
              setRecaptchaError(false);
            } else {
              const errorMessage = res?.data?.message || "Failed to send reset email";
              showToast.error(errorMessage, { duration: 6000 });
            }
          },
          onFail: (error) => {
            showToast.dismiss(loadingToastId);
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(enhancedError, { duration: 6000 });
          }
        });
      } else if (currentStep === 2) {
        // Step 2: Verify temporary password
        await postQuery({
          url: apiUrls?.user?.verfiySystemPassword,
          postData: {
            email: data.email,
            tempPassword: data.tempPassword,
          },
          requireAuth: false,
          onSuccess: (res: any) => {
            showToast.dismiss(loadingToastId);
            if (res?.data?.success) {
              showToast.success("Password verified successfully!", { duration: 3000 });
              setTempPasswordVerified(true);
              setCurrentStep(3);
            } else {
              const errorMessage = res?.data?.message || "Invalid temporary password";
              showToast.error(errorMessage, { duration: 6000 });
            }
          },
          onFail: (error) => {
            showToast.dismiss(loadingToastId);
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(enhancedError, { duration: 6000 });
          }
        });
      } else if (currentStep === 3) {
        // Step 3: Reset password
        await postQuery({
          url: apiUrls?.user?.resetPassword,
          postData: {
            email: data.email,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
          requireAuth: false,
          onSuccess: (res: any) => {
            showToast.dismiss(loadingToastId);
            if (res?.data?.success) {
              showToast.success("Password reset successful! You can now log in with your new password.", { duration: 5000 });
              setTimeout(() => {
                router.push(redirectPath || "/login");
              }, 2000);
            } else {
              const errorMessage = res?.data?.message || "Failed to reset password";
              showToast.error(errorMessage, { duration: 6000 });
            }
          },
          onFail: (error) => {
            showToast.dismiss(loadingToastId);
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(enhancedError, { duration: 6000 });
          }
        });
      }
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      console.error('Form submission error:', error);
      showToast.error("An unexpected error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step info
  const getCurrentStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Reset Password",
          subtitle: "Enter your email to receive reset instructions",
          step: 1,
          totalSteps: 3
        };
      case 2:
        return {
          title: "Verify Temporary Password",
          subtitle: `Enter the temporary password sent to ${userEmail}`,
          step: 2,
          totalSteps: 3
        };
      case 3:
        return {
          title: "Create New Password",
          subtitle: "Create a strong new password for your account",
          step: 3,
          totalSteps: 3
        };
      default:
        return {
          title: "Reset Password",
          subtitle: "Enter your email to receive reset instructions",
          step: 1,
          totalSteps: 3
        };
    }
  };

  const stepInfo = getCurrentStepInfo();

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setEmailSent(false);
      } else if (currentStep === 3) {
        setTempPasswordVerified(false);
      }
    }
  };

  // Show loading state
  if (loading && !isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
          <p className="font-body text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

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
          <div className="forgot-password-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 max-h-[85vh] overflow-y-auto">
            
            {/* Header area */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-2 text-center relative">
              {/* Back to Login link */}
              <Link 
                href="/login"
                className="absolute left-4 top-4 sm:left-6 sm:top-6 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex items-center text-xs"
                aria-label="Back to login"
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
              
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
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
                          <Check className="w-4 h-4" />
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
            <div className="px-4 sm:px-8 pb-4 sm:pb-6">
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4"
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
                      disabled={currentStep > 1}
                      className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                        errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 disabled:opacity-70 disabled:cursor-not-allowed`}
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

                {/* reCAPTCHA - only show for initial email step */}
                {currentStep === 1 && (
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
                )}
                
                {/* Temporary Password Field */}
                {currentStep === 2 && (
                  <div>
                    <div className="relative">
                      <input
                        id="tempPassword"
                        type={showTempPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Temporary password from email"
                        className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                          errors.tempPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11`}
                        {...register("tempPassword")}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTempPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showTempPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
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
                {currentStep === 3 && (
                  <>
                    {/* New Password */}
                    <div>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="New password"
                          className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.newPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11`}
                          {...register("newPassword")}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
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
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm new password"
                          className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.confirmPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11`}
                          {...register("confirmPassword")}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
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

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || (currentStep === 1 && !recaptchaValue)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {currentStep === 1
                            ? "Send Reset Email"
                            : currentStep === 2
                            ? "Verify Password"
                            : "Reset Password"}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* Back Button - show for steps 2 and 3 */}
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                </div>

                {/* Back to Login Link */}
                <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          <div className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
            <p>Trusted by students worldwide</p>
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

export default ForgotPasswordForm; 