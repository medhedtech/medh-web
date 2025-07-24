"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { 
  Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle, 
  Loader2, UserCircle, ArrowRight, CheckCircle, 
  Shield, Github, Check
} from "lucide-react";

// Assets
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";

// Components & Hooks
import CustomReCaptcha from '../ReCaptcha';
import OTPVerification from './OTPVerification';
import PhoneNumberInput from './PhoneNumberInput';
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

// APIs & Utils
import { authAPI, authUtils } from "@/apis/auth.api";
import usePostQuery from "@/hooks/postQuery.hook";
import { IRegisterData, IAuthResponse } from "@/apis";

// Types
type AgeGroup = "Under 16" | "16-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";

interface PhoneData {
  country: string;
  number: string;
  formattedNumber: string;
  isValid: boolean;
}

// Enhanced Zod Schema with better validation
const signUpSchema = z.object({
  full_name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .refine(name => name.trim().split(' ').length >= 2, "Please enter your full name"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .refine(email => !email.includes('+'), "Email addresses with '+' are not supported")
    .transform(email => email.toLowerCase().trim()),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine(password => /[a-z]/.test(password), "Password must contain at least one lowercase letter")
    .refine(password => /[A-Z]/.test(password), "Password must contain at least one uppercase letter")
    .refine(password => /\d/.test(password), "Password must contain at least one number")
    .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password), "Password must contain at least one special character"),
  
  confirm_password: z.string(),
  
  phone_data: z.object({
    country: z.string().min(2, "Please select a country"),
    number: z.string().min(5, "Phone number is too short"),
    formattedNumber: z.string(),
    isValid: z.boolean()
  }).refine(data => data.isValid, "Please enter a valid phone number"),
  
  age_group: z.string().min(1, "Please select your age group").refine(
    (value) => ["Under 16", "16-24", "25-34", "35-44", "45-54", "55-64", "65+"].includes(value),
    "Please select a valid age group"
  ),
  
  agree_terms: z.boolean().refine(val => val === true, "You must accept the terms and privacy policy"),
  
  recaptcha: z.string().min(1, "Please complete the reCAPTCHA verification")
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// Password strength calculation
interface PasswordStrength {
  score: number;
  message: string;
  color: string;
  suggestions: string[];
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, message: "", color: "gray", suggestions: [] };
  
  let score = 0;
  const suggestions: string[] = [];

  // Length checks
  if (password.length >= 8) score += 1;
  else suggestions.push("Use at least 8 characters");
  
  if (password.length >= 12) score += 1;
  else if (password.length >= 8) suggestions.push("Consider using 12+ characters");

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push("Add lowercase letters");
  
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push("Add uppercase letters");
  
  if (/\d/.test(password)) score += 1;
  else suggestions.push("Add numbers");
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) score += 1;
  else suggestions.push("Add special characters");

  // Determine strength
  let message = "";
  let color = "gray";
  
  if (score < 3) {
    message = "Weak";
    color = "red";
  } else if (score < 5) {
    message = "Fair";
    color = "yellow";
  } else if (score < 6) {
    message = "Good";
    color = "blue";
  } else {
    message = "Strong";
    color = "green";
  }

  return { score, message, color, suggestions: suggestions.slice(0, 2) };
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

  // HTTP status specific errors with emojis for better UX
  switch (status) {
    case 400:
      if (message.includes('email')) return "📧 Please enter a valid email address.";
      if (message.includes('phone')) return "📱 Please enter a valid phone number.";
      if (message.includes('password')) return "🔑 Password doesn't meet requirements.";
      return `❌ ${message}`;
    
    case 409:
      if (message.includes('already exists')) {
        return "👤 An account with this email already exists. Try logging in instead.";
      }
      return `⚠️ ${message}`;
    
    case 422:
      return "📝 Please check your input and try again. Some fields may be invalid.";
    
    case 429:
      return "🚦 Too many registration attempts. Please wait a few minutes before trying again.";
    
    case 500:
      return "🛠️ Our servers are experiencing issues. Please try again later.";
    
    case 502:
    case 503:
    case 504:
      return "⚙️ Our services are temporarily unavailable. Please try again in a few minutes.";
    
    default:
      return `❗ ${message}`;
  }
};

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();
  const { postQuery, loading } = usePostQuery();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isOAuthLoading, setIsOAuthLoading] = useState<{ [key: string]: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Form setup with Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    reset
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_data: {
        country: "IN",
        number: "",
        formattedNumber: "",
        isValid: false
      },
      age_group: "",
      agree_terms: false,
      recaptcha: ""
    }
  });

  // Watch form values
  const watchPassword = watch("password");
  const watchEmail = watch("email");
  const watchPhoneData = watch("phone_data");

  // Password strength calculation
  const passwordStrength = useMemo(() => 
    calculatePasswordStrength(watchPassword || ""), 
    [watchPassword]
  );

  // Initialize theme
  useEffect(() => {
    if (!theme) setTheme('light');
  }, [theme, setTheme]);

  // Handle reCAPTCHA change
  const handleRecaptchaChange = useCallback((value: string | null) => {
    if (value) {
      setValue('recaptcha', value, { shouldValidate: true });
      showToast.success("Human verification completed!", { duration: 2000 });
    }
  }, [setValue, showToast]);

  // Handle phone number change
  const handlePhoneChange = useCallback((phoneData: PhoneData) => {
    setValue('phone_data', phoneData, { shouldValidate: true });
  }, [setValue]);

  // OAuth signup handler
  const handleOAuthSignup = useCallback(async (provider: 'google' | 'github') => {
    try {
      setIsOAuthLoading(prev => ({ ...prev, [provider]: true }));
      
      showToast.info(`Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup...`, { duration: 3000 });
      
      const oauthUrl = authUtils.getOAuthLoginUrl(provider, window.location.origin + '/auth/callback');
      
      authUtils.openOAuthPopup(
        provider,
        // Success callback
        (data) => {
          if (data.access_token && data.id) {
            showToast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup successful! Welcome to Medh!`, { duration: 4000 });
            setTimeout(() => router.push("/login"), 2000);
          } else {
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup failed. Invalid response from server.`, { duration: 5000 });
          }
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        },
        // Error callback
        (error) => {
          console.error(`${provider} OAuth signup error:`, error);
          
          if (error.message && error.message.includes('already exists')) {
            showToast.error(
              `This ${provider} account is already registered. You can login instead.`,
              { duration: 10000 }
            );
          } else {
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup failed: ${enhancedError}`, { duration: 6000 });
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        }
      );
    } catch (error) {
      console.error(`${provider} OAuth signup error:`, error);
      showToast.error(`Failed to initiate ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup. Please try again.`, { duration: 5000 });
      setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
    }
  }, [showToast, router]);

  // Form submission handler
  const onSubmit: SubmitHandler<SignUpFormData> = useCallback(async (data) => {
    const loadingToastId = showToast.loading("Creating your account...", { duration: 20000 });
    setApiError(null);

    try {
      // Process phone number - ensure it matches the selected country
      const selectedCountry = data.phone_data.country.toUpperCase();
      let processedPhoneNumber = data.phone_data.number.replace(/\D/g, ''); // Remove all non-digits
      
      // Comprehensive country dial codes mapping
      const countryDialCodes: { [key: string]: string } = {
        'IN': '91', 'US': '1', 'GB': '44', 'CA': '1', 'AU': '61', 'AF': '93', 
        'AL': '355', 'DZ': '213', 'AS': '1684', 'AD': '376', 'AO': '244', 'AI': '1264',
        'AG': '1268', 'AR': '54', 'AM': '374', 'AW': '297', 'AT': '43', 'AZ': '994',
        'BS': '1242', 'BH': '973', 'BD': '880', 'BB': '1246', 'BY': '375', 'BE': '32',
        'BZ': '501', 'BJ': '229', 'BM': '1441', 'BT': '975', 'BO': '591', 'BA': '387',
        'BW': '267', 'BR': '55', 'IO': '246', 'BN': '673', 'BG': '359', 'BF': '226',
        'BI': '257', 'CV': '238', 'KH': '855', 'CM': '237', 'KY': '1345', 'CF': '236',
        'TD': '235', 'CL': '56', 'CN': '86', 'CX': '61', 'CC': '61', 'CO': '57',
        'KM': '269', 'CG': '242', 'CD': '243', 'CK': '682', 'CR': '506', 'CI': '225',
        'HR': '385', 'CU': '53', 'CW': '599', 'CY': '357', 'CZ': '420', 'DK': '45',
        'DJ': '253', 'DM': '1767', 'DO': '1', 'EC': '593', 'EG': '20', 'SV': '503',
        'GQ': '240', 'ER': '291', 'EE': '372', 'SZ': '268', 'ET': '251', 'FK': '500',
        'FO': '298', 'FJ': '679', 'FI': '358', 'FR': '33', 'GF': '594', 'PF': '689',
        'GA': '241', 'GM': '220', 'GE': '995', 'DE': '49', 'GH': '233', 'GI': '350',
        'GR': '30', 'GL': '299', 'GD': '1473', 'GP': '590', 'GU': '1671', 'GT': '502'
      };
      
      const expectedDialCode = countryDialCodes[selectedCountry];
      
      // If the number starts with the country code, remove it since we're sending country separately
      if (expectedDialCode && processedPhoneNumber.startsWith(expectedDialCode)) {
        processedPhoneNumber = processedPhoneNumber.substring(expectedDialCode.length);
      }
      
      // Clean final phone number (no + prefix needed since country is separate)
      const finalPhoneNumber = processedPhoneNumber;

      // Debug logging to help troubleshoot phone number issues
      console.log('Phone Number Processing Debug:', {
        originalNumber: data.phone_data.number,
        selectedCountry: selectedCountry,
        expectedDialCode: expectedDialCode,
        processedNumber: processedPhoneNumber,
        finalNumber: finalPhoneNumber
      });

      const requestData: IRegisterData = {
        full_name: data.full_name.trim(),
        email: data.email,
        password: data.password,
        phone_numbers: [{
          country: data.phone_data.country.toLowerCase(),
          number: finalPhoneNumber // Send number without country code
        }],
        agree_terms: data.agree_terms,
        role: ["student"],
        meta: {
          age_group: data.age_group,
        }
      };

      await postQuery({
        url: authAPI.local.register,
        postData: requestData,
        requireAuth: false,
        onSuccess: (response: IAuthResponse) => {
          if (response?.success === false) {
            const errorMessage = response?.message || "Registration failed";
            showToast.dismiss(loadingToastId);
            showToast.error(errorMessage, { duration: 5000 });
            setApiError(errorMessage);
            return;
          }
          
          showToast.dismiss(loadingToastId);
          showToast.success("Registration successful! Please verify your email with the code sent to your inbox.", { duration: 4000 });
          
          setVerificationEmail(data.email);
          setCurrentStep(2);
          setShowOTPVerification(true);
        },
        onFail: (error: any) => {
          showToast.dismiss(loadingToastId);
          
          const errorResponse = error?.response?.data;
          const errorMessage = errorResponse?.message || errorResponse?.error || 'Unknown error occurred';
          const isUserExists = errorMessage === "User already exists" || errorMessage?.includes("already exists");
          const isPhoneError = errorMessage?.includes("phone number") || errorMessage?.includes("phone_numbers");
          
          if (isUserExists) {
            setApiError("This email is already registered");
            showToast.error("This email is already registered. You can login instead.", { duration: 10000 });
          } else if (isPhoneError) {
            setApiError("Invalid phone number format. Please check your country selection and phone number.");
            showToast.error("Invalid phone number. Please ensure your country selection matches your phone number.", { duration: 8000 });
            
            // Log the phone error for debugging
            console.error('Phone validation error:', {
              error: errorMessage,
              requestData: requestData,
              phoneData: data.phone_data
            });
          } else {
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(enhancedError, { duration: 6000 });
            setApiError(enhancedError);
          }
        },
      });
    } catch (error) {
      showToast.dismiss(loadingToastId);
      const enhancedError = getEnhancedErrorMessage(error);
      showToast.error(enhancedError, { duration: 6000 });
    }
  }, [showToast, postQuery]);

  // Handle verification success
  const handleVerificationSuccess = useCallback(() => {
    setApiError(null);
    const completionToastId = showToast.loading("Finalizing your account setup...", { duration: 5000 });
    
    setTimeout(() => {
      showToast.dismiss(completionToastId);
      showToast.success("Email successfully verified! Welcome to Medh! You can now log in to your account.", { duration: 5000 });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1000);
  }, [showToast, router]);

  // OTP Verification Screen
  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
        <div className="w-full max-w-md relative">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
            {/* Logo */}
            <div className="text-center mb-3">
              <Link href="/" className="inline-block mb-2">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={90} 
                  height={30} 
                  className="mx-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Stepper */}
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">Registration</span>
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
            
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Email Verification</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to<br />
                <span className="font-medium text-gray-900 dark:text-white">{verificationEmail}</span>
              </p>
            </div>
            
            <OTPVerification
              email={verificationEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onBack={() => {
                setShowOTPVerification(false);
                setCurrentStep(1);
              }}
            />
          </div>
          
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">LEARN. UPSKILL. ELEVATE.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
      <div className="w-full max-w-4xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-16 h-16 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-lg hidden sm:block"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-lg hidden sm:block"></div>

        {/* Card container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-4">
              <Link href="/" className="inline-block mb-2">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={90} 
                  height={30} 
                  className="mx-auto"
                  priority
                />
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Join thousands of learners advancing their careers
              </p>
            </div>
            
            {/* Stepper */}
            <div className="mb-6">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">Registration</span>
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 font-medium">Verification</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.full_name 
                              ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm`}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.full_name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="email"
                          placeholder="Enter your email address"
                          className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.email || apiError?.includes("email")
                              ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm`}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                      {apiError && apiError.includes("email") && (
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-red-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Email already registered
                          </p>
                          <Link 
                            href="/login" 
                            className="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
                          >
                            Login
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <Controller
                  name="phone_data"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumberInput
                      value={field.value}
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      error={errors.phone_data?.message}
                    />
                  )}
                />

                {/* Age Group */}
                <Controller
                  name="age_group"
                  control={control}
                  render={({ field }) => (
                    <div>
                                             <div className="relative">
                         <select
                           {...field}
                           className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                             errors.age_group 
                               ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                               : 'border-gray-200 dark:border-gray-600'
                           } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none appearance-none text-sm ${
                             !field.value ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                           }`}
                         >
                           <option value="" disabled className="text-gray-400">
                             Select your age group
                           </option>
                           <option value="Under 16" className="text-gray-900 dark:text-white">Under 16</option>
                           <option value="16-24" className="text-gray-900 dark:text-white">16-24</option>
                           <option value="25-34" className="text-gray-900 dark:text-white">25-34</option>
                           <option value="35-44" className="text-gray-900 dark:text-white">35-44</option>
                           <option value="45-54" className="text-gray-900 dark:text-white">45-54</option>
                           <option value="55-64" className="text-gray-900 dark:text-white">55-64</option>
                           <option value="65+" className="text-gray-900 dark:text-white">65+</option>
                         </select>
                         <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                       </div>
                      {errors.age_group && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.age_group.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="w-full h-12 px-4 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {watchPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Strength:</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength.color === "red" ? 'text-red-500' : 
                              passwordStrength.color === "yellow" ? 'text-yellow-500' : 
                              passwordStrength.color === "blue" ? 'text-blue-500' :
                              passwordStrength.color === "green" ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {passwordStrength.message}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.color === "red" ? 'bg-red-500' : 
                                passwordStrength.color === "yellow" ? 'bg-yellow-500' : 
                                passwordStrength.color === "blue" ? 'bg-blue-500' :
                                passwordStrength.color === "green" ? 'bg-green-500' : 'bg-gray-400'
                              }`} 
                              style={{ width: `${Math.min(100, (passwordStrength.score / 6) * 100)}%` }}
                            />
                          </div>
                          {passwordStrength.suggestions.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Tip: {passwordStrength.suggestions[0]}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="w-full h-12 px-4 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* reCAPTCHA and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* reCAPTCHA */}
                <div>
                  <Controller
                    name="recaptcha"
                    control={control}
                    render={({ field }) => (
                      <CustomReCaptcha
                        onChange={handleRecaptchaChange}
                        error={!!errors.recaptcha}
                      />
                    )}
                  />
                  {errors.recaptcha && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.recaptcha.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <Controller
                  name="agree_terms"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                          errors.agree_terms 
                            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                            : field.value
                              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                              : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="flex items-center space-x-3">
                          {field.value ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                          ) : errors.agree_terms ? (
                            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                          ) : (
                            <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                          <span className={`text-sm ${
                            errors.agree_terms 
                              ? 'text-red-600 dark:text-red-400' 
                              : field.value
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {field.value
                              ? 'Terms accepted'
                              : (
                                <>
                                  I agree to the{' '}
                                  <Link href="/terms-and-services" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline" target="_blank" onClick={(e) => e.stopPropagation()}>
                                    Terms of Use
                                  </Link>
                                  {' '}and{' '}
                                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline" target="_blank" onClick={(e) => e.stopPropagation()}>
                                    Privacy Policy
                                  </Link>
                                </>
                              )}
                          </span>
                        </div>
                      </div>
                      {errors.agree_terms && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.agree_terms.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:max-w-xs md:mx-auto md:block py-3 px-6 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {/* OAuth Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleOAuthSignup('google')}
                  disabled={isOAuthLoading.google}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
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

export default SignUpForm;
