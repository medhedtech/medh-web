"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SignIn from "@/assets/images/log-sign/SignIn.png";
import { useForm, Resolver, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls, IRegisterData, IAuthResponse, IVerifyEmailData, IResendVerificationData } from "@/apis";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle, Loader2, Moon, Sun, UserCircle, ArrowRight, CheckCircle, RefreshCw, ChevronRight, Check, Shield } from "lucide-react";
import { Github } from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import FixedShadow from "../others/FixedShadow";
import Link from "next/link";
import { parsePhoneNumber, isValidPhoneNumber, formatNumber } from 'libphonenumber-js';
import { useTheme } from "next-themes";
import OTPVerification from './OTPVerification';
import PhoneNumberInput, { phoneNumberSchema } from './PhoneNumberInput';
import { authAPI, authUtils } from "@/apis/auth.api";
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void;
    };
  }
}

interface PhoneNumberFormat {
  international: string;
  national: string;
  e164: string;
  rfc3966: string;
  significant: string;
  countryCode: string;
  country: string | undefined;
  type: string | undefined;
}

interface PhoneCountryData {
  name?: string;
  iso2: string;
  dialCode: string;
  priority?: number;
  areaCodes?: string[];
  countryCode?: string;
  format?: string;
}

type AgeGroup = "Under 16" | "16-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";

interface PhoneData {
  number: string;
  country: string;
  countryCode: string;
  formattedNumber: string;
  isValid: boolean;
  type: string | null;
  nationalFormat: string;
  internationalFormat: string;
}

interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
  role: "student";
  age_group: AgeGroup;
  status: string;
  meta: {
    age_group?: AgeGroup;
  };
  phone_numbers?: {
    country: string;
    number: string;
  }[];
  recaptcha?: string;
  is_email_verified?: boolean;
}

type FormFields = {
  email: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
  role: "student";
  full_name: string;
  age_group: AgeGroup;
  phone_numbers: {
    country: string;
    number: string;
  }[];
  recaptcha: string;
  is_email_verified?: boolean;
};

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

const schema = yup
  .object({
    full_name: yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
    email: yup.string()
      .email("Please enter a valid email")
      .required("Email is required")
      .lowercase()
      .trim(),
    password: yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: yup.string()
      .required("Please confirm your password")
      .oneOf([yup.ref('password')], "Passwords must match"),
    agree_terms: yup.boolean()
      .oneOf([true], "You must accept the terms to proceed")
      .required(),
    role: yup.string()
      .oneOf(["student"])
      .required("Role is required"),
    age_group: yup.string()
      .oneOf(["Under 16", "16-24", "25-34", "35-44", "45-54", "55-64", "65+"])
      .required("Age group is required"),
    phone_numbers: yup.array()
      .of(
        yup.object({
          country: yup.string().required("Country code is required"),
          number: yup.string().required("Phone number is required")
        })
      )
      .required("Phone number is required"),
    recaptcha: yup.string()
      .required("Please verify that you are human"),
    is_email_verified: yup.boolean().default(false),
  })
  .required();

// Calculate password strength
const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, message: "", color: "gray" };
  
  let score = 0;
  let message = "";
  let color = "gray";

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/\d/.test(password)) score += 1; // number
  if (/[@$!%*?&]/.test(password)) score += 1; // special character

  // Determine strength message and color
  if (score < 3) {
    message = "Weak";
    color = "red";
  } else if (score < 5) {
    message = "Medium";
    color = "orange";
  } else {
    message = "Strong";
    color = "green";
  }

  return { score, message, color };
};

// Enhanced phone number validation using libphonenumber-js
const validatePhoneNumber = (phoneNumber: string, countryCode?: string): boolean => {
  if (!phoneNumber) return false;
  
  try {
    // Add + to the phone number if it doesn't have one
    const phoneNumberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Parse the phone number
    const parsedNumber = parsePhoneNumber(phoneNumberWithPlus);
    
    if (!parsedNumber) return false;

    // Less strict validation - just check if the number is valid
    return parsedNumber.isValid();
  } catch (error) {
    console.error('Phone validation error:', error);
    return false;
  }
};

// Format phone number for display and storage
const formatPhoneNumber = (phoneNumber: string, countryCode?: string): string | PhoneNumberFormat => {
  if (!phoneNumber) return '';
  
  try {
    // Add + to the phone number if it doesn't have one
    const phoneNumberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Parse and format the phone number
    const parsedNumber = parsePhoneNumber(phoneNumberWithPlus);
    
    if (!parsedNumber) return phoneNumber;

    return {
      international: parsedNumber.formatInternational(),
      national: parsedNumber.formatNational(),
      e164: parsedNumber.format('E.164'),
      rfc3966: parsedNumber.format('RFC3966'),
      significant: parsedNumber.formatNational().replace(/[^0-9]/g, ''),
      countryCode: parsedNumber.countryCallingCode,
      country: parsedNumber.country,
      type: parsedNumber.getType()
    };
  } catch (error) {
    console.error('Phone formatting error:', error);
    return phoneNumber;
  }
};

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { postQuery, loading } = usePostQuery();
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>("16-24");
  const [phoneData, setPhoneData] = useState<PhoneData>({
    number: '',
    country: '',
    countryCode: '',
    formattedNumber: '',
    isValid: false,
    type: null,
    nationalFormat: '',
    internationalFormat: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [showOTPVerification, setShowOTPVerification] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<{ [key: string]: boolean }>({});
  
  // Add new state for stepper
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 2;
  
  // Add state for password
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(calculatePasswordStrength(""));
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<FormFields>({
    resolver: yupResolver(schema) as Resolver<FormFields>,
    defaultValues: {
      role: "student",
      age_group: "16-24",
      agree_terms: true, // Pre-accept terms and privacy policy
      phone_numbers: [{
        country: "in",
        number: ""
      }]
    }
  });

  // Watch password for strength meter
  const watchPassword = watch("password");
  
  // Initialize theme to light if not set
  useEffect(() => {
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Watch password for strength meter
  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(calculatePasswordStrength(watchPassword));
    } else {
      setPasswordStrength({ score: 0, message: "", color: "gray" });
    }
  }, [watchPassword]);

  // Enhanced error message handler with more descriptive messages
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

    // Timeout errors
    if (error?.code === 'ECONNABORTED' || message.includes('timeout')) {
      return "⏱️ Request timed out. Our servers might be busy. Please try again in a few moments.";
    }

    // HTTP status specific errors
    switch (status) {
      case 400:
        if (message.includes('email')) {
          return "📧 Please enter a valid email address.";
        }
        if (message.includes('phone')) {
          return "📱 Please enter a valid phone number.";
        }
        if (message.includes('password')) {
          return "🔑 Password doesn't meet requirements. Please check and try again.";
        }
        return `❌ ${message}`;
      
      case 409:
        if (message.includes('already exists') || message.includes('User already exists')) {
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
        // Email verification scenarios
        if (message.includes('verify') || message.includes('verification')) {
          return "✉️ Please check your email for verification instructions.";
        }
        
        // Generic fallback with emoji for better UX
        return `❗ ${message}`;
    }
  };

  // Initialize form values
  useEffect(() => {
    // Set phone number data
    setValue('phone_numbers', [{
      country: phoneData.country,
      number: phoneData.number
    }], { shouldValidate: true });
    // Set default age group
    setValue('age_group', selectedAgeGroup);
  }, [setValue, phoneData.number, phoneData.country, selectedAgeGroup]);

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle email field blur
  const handleEmailBlur = async (): Promise<void> => {
    const email = watch('email');
    if (email && !errors.email) {
      await trigger('email');
      if (!errors.email) {
        setVerificationEmail(email);
        showToast.info("Email format looks good! We'll send a verification code here.", { duration: 2000 });
      }
    }
  };

  // OAuth signup handlers
  const handleOAuthSignup = async (provider: 'google' | 'github'): Promise<void> => {
    try {
      setIsOAuthLoading(prev => ({ ...prev, [provider]: true }));
      
      // Show informational toast
      showToast.info(`Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup...`, { duration: 3000 });
      
      // Get OAuth signup URL (same as login URL for OAuth)
      const oauthUrl = authUtils.getOAuthLoginUrl(provider, window.location.origin + '/auth/callback');
      
      // Open OAuth popup
      authUtils.openOAuthPopup(
        provider,
        // Success callback
        (data) => {
          console.log(`${provider} OAuth signup success:`, data);
          
          if (data.access_token && data.id) {
            // Show processing toast
            const processingToastId = showToast.loading("Setting up your account...", { duration: 8000 });
            
            // For OAuth signup, user is automatically verified
            setIsEmailVerified(true);
            setIsRegistered(true);
            setCurrentStep(2);
            
            showToast.dismiss(processingToastId);
            showToast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup successful! Welcome to Medh!`, { duration: 4000 });
            
            // Redirect to login or dashboard
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            const errorMsg = `${provider.charAt(0).toUpperCase() + provider.slice(1)} signup failed. Invalid response from server.`;
            showToast.error(errorMsg, { duration: 5000 });
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        },
        // Error callback
        (error) => {
          console.error(`${provider} OAuth signup error:`, error);
          
          // Check if user already exists
          if (error.message && error.message.includes('already exists')) {
            showToast.error(
              `This ${provider} account is already registered. You can login instead.`,
              {
                duration: 10000,
                id: 'oauth-user-exists-error'
              }
            );
            
            // Add a separate action toast for navigation
            setTimeout(() => {
              showToast.info(
                "You can go to the login page to sign in with this account",
                {
                  duration: 5000,
                  id: 'oauth-login-redirect'
                }
              );
            }, 1000);
          } else {
            const enhancedError = getEnhancedErrorMessage(error);
            showToast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup failed: ${enhancedError}`, { duration: 6000 });
          }
          
          setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
        }
      );
    } catch (error) {
      console.error(`${provider} OAuth signup error:`, error);
      const errorMsg = `Failed to initiate ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup. Please try again.`;
      showToast.error(errorMsg, { duration: 5000 });
      setIsOAuthLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Updated registration function to use new auth API
  const proceedToVerification = async (): Promise<void> => {
    // Validate required fields
    const isValid = await trigger(['email', 'full_name', 'password', 'confirm_password', 'agree_terms', 'phone_numbers']);
    console.log('Form validation result:', isValid);
    console.log('Form errors:', errors);
    console.log('Current phone_numbers value:', getValues('phone_numbers'));
    
    if (!isValid) {
      showToast.warning('Please fill in all required fields correctly', { duration: 4000 });
      return;
    }
    
    // Show loading toast
    const loadingToastId = showToast.loading("Creating your account...", { duration: 20000 });
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      console.log('Starting registration process...');
      showToast.info("Validating your information...", { duration: 2000 });
      
      const phoneNumbers = getValues('phone_numbers');
      const hasValidPhoneNumber = phoneNumbers && 
                               phoneNumbers[0] && 
                               phoneNumbers[0].number && 
                               phoneNumbers[0].number.length > 5;
      
      console.log('Phone number validation check:', { phoneNumbers, hasValidPhoneNumber });
      
      if (!hasValidPhoneNumber) {
        showToast.dismiss(loadingToastId);
        showToast.error("Please enter a valid phone number", { duration: 4000 });
        setIsSubmitting(false);
        return;
      }

      const requestData: IRegisterData = {
        full_name: watch('full_name').trim(),
        email: watch('email').toLowerCase().trim(),
        password: watch('password'),
        phone_numbers: [
          {
            country: phoneNumbers && phoneNumbers[0] ? phoneNumbers[0].country : 'in',
            number: phoneNumbers && phoneNumbers[0] ? 
              (phoneNumbers[0].number.startsWith('+') ? 
                phoneNumbers[0].number : 
                `+${phoneNumbers[0].country === 'in' ? '91' : 
                   phoneNumbers[0].country === 'us' ? '1' : 
                   phoneNumbers[0].country === 'gb' ? '44' : 
                   phoneNumbers[0].country === 'ca' ? '1' : 
                   phoneNumbers[0].country === 'au' ? '61' : '91'}${phoneNumbers[0].number}`) 
              : ''
          }
        ],
        agree_terms: watch('agree_terms'),
        role: ["student"],
        meta: {
          age_group: watch('age_group'),
        }
      };

      const response = await postQuery({
        url: authAPI.local.register,
        postData: requestData,
        requireAuth: false,
        onSuccess: (response: IAuthResponse) => {
          console.log('Registration API response:', response);
          
          if (response?.success === false) {
            const errorMessage = response?.message || "Registration failed";
            console.error('Registration error in onSuccess handler:', errorMessage);
            showToast.dismiss(loadingToastId);
            showToast.error(`${errorMessage}`, { duration: 5000 });
            setApiError(errorMessage);
            return;
          }
          
          console.log('Registration successful, proceeding to verification');
          showToast.dismiss(loadingToastId);
          showToast.success("Registration successful! Please verify your email with the code sent to your inbox.", { duration: 4000 });
          
          setIsRegistered(true);
          setCurrentStep(2);
          setShowOTPVerification(true);
        },
        onFail: (error: any) => {
          console.error('Registration onFail triggered with error:', error);
          showToast.dismiss(loadingToastId);
          
          const errorResponse = error?.response?.data;
          const statusCode = error?.response?.status;
          
          console.error('Detailed registration error:', { 
            statusCode,
            errorResponse,
            message: error?.message,
          });
          
          const isExactUserExistsFormat = 
            errorResponse?.success === false && 
            errorResponse?.message === "User already exists";
          
          const errorMessage = errorResponse?.message || errorResponse?.error || 'Unknown error occurred';
          const isUserExists = 
            isExactUserExistsFormat || 
            errorMessage === "User already exists" || 
            errorMessage?.includes("already exists") || 
            errorMessage?.includes("already registered");
            
          console.log("Registration error specifics:", { 
            status: statusCode,
            response: errorResponse,
            isUserExists,
            isExactFormat: isExactUserExistsFormat,
            errorMessage
          });

          setIsRegistered(false);
          setCurrentStep(1);
          setShowOTPVerification(false);
          
          if (isUserExists) {
            setApiError("This email is already registered");
            
            showToast.error(
              "This email is already registered. You can login instead.",
              {
                duration: 10000,
                id: 'user-exists-error'
              }
            );
            
            // Add a separate action toast for navigation
            setTimeout(() => {
              showToast.info(
                "You can go to the login page to sign in with this account",
                {
                  duration: 5000,
                  id: 'email-login-redirect'
                }
              );
            }, 1000);
            
            const emailField = document.getElementById('email-field');
            if (emailField) {
              emailField.classList.add('border-red-500', 'ring-red-400');
              emailField.focus();
            }
            
            return;
          } 
          
          // Handle other error types using enhanced error handler
          const enhancedError = getEnhancedErrorMessage(error);
          showToast.error(enhancedError, { duration: 6000, id: 'registration-error' });
          setApiError(enhancedError);
        },
      });
    } catch (error) {
      console.error("Client-side registration error:", error);
      showToast.dismiss(loadingToastId);
      
      setIsRegistered(false);
      setCurrentStep(1);
      setShowOTPVerification(false);
      
      const enhancedError = getEnhancedErrorMessage(error);
      showToast.error(`${enhancedError}`, { duration: 6000, id: 'client-error' });
      setError(enhancedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle verification success
  const handleVerificationSuccess = (): void => {
    try {
      // Clear any previous errors
      setApiError(null);
      setError(null);
      
      // Show loading toast for completion
      const completionToastId = showToast.loading("Finalizing your account setup...", { duration: 5000 });
      
      setIsEmailVerified(true);
      setShowOTPVerification(false);
      setValue('is_email_verified', true, { shouldValidate: false });
      
      // Dismiss loading and show success
      setTimeout(() => {
        showToast.dismiss(completionToastId);
        showToast.success("Email successfully verified! Welcome to Medh! You can now log in to your account.", { duration: 5000 });
        
        // Redirect to login page after verification
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }, 1000);
    } catch (err) {
      console.error('Error in handleVerificationSuccess:', err);
      showToast.error('Verification successful, but there was an issue completing setup. Please try logging in.');
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleRecaptchaChange = (value: string | null): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
    if (value) {
      setValue('recaptcha', value, { shouldValidate: true });
      showToast.success("Human verification completed!", { duration: 2000 });
    }
  };

  const togglePasswordVisibility = (): void => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = (): void =>
    setShowConfirmPassword((prev) => !prev);

  // Enhanced phone number change handler
  const handlePhoneChange = (value: string, country: any): void => {
    // Ensure we have the right country object structure
    const countryObj = typeof country === 'object' ? country : { iso2: '', dialCode: '' };
    
    console.log('handlePhoneChange called with:', { value, country: countryObj });
    
    try {
      // Format the phone number
      const phoneNumberWithPlus = value.startsWith('+') ? value : `+${countryObj.dialCode || ''}${value}`;
      console.log('Formatted phone number:', phoneNumberWithPlus);
      
      const isValid = validatePhoneNumber(phoneNumberWithPlus);
      console.log('Phone validation result:', isValid);
      
      const formattedNumber = formatPhoneNumber(phoneNumberWithPlus) as PhoneNumberFormat;
      
      setPhoneData({
        number: phoneNumberWithPlus,
        country: countryObj.iso2 || '',
        countryCode: countryObj.dialCode || '',
        formattedNumber: formattedNumber.international,
        isValid: isValid,
        type: formattedNumber.type || null,
        nationalFormat: formattedNumber.national,
        internationalFormat: formattedNumber.international
      });

      console.log('Updated phone data:', {
        number: phoneNumberWithPlus,
        country: countryObj.iso2 || '',
        isValid
      });

      // Update form value
      setValue('phone_numbers', [{
        country: countryObj.iso2 || '',
        number: phoneNumberWithPlus
      }], { shouldValidate: true });
      
      // Log current form values after update
      console.log('Current phone_numbers value:', getValues('phone_numbers'));

    } catch (error) {
      console.error('Phone formatting error:', error);
      setPhoneData({
        number: value,
        country: countryObj.iso2 || '',
        countryCode: countryObj.dialCode || '',
        formattedNumber: value,
        isValid: false,
        type: null,
        nationalFormat: value,
        internationalFormat: value
      });
      
      // Even on error, still update the form value to prevent validation issues
      setValue('phone_numbers', [{
        country: countryObj.iso2 || '',
        number: value.startsWith('+') ? value : `+${countryObj.dialCode || ''}${value}`
      }], { shouldValidate: true });
    }
  };

  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as AgeGroup;
    setSelectedAgeGroup(value);
    setValue('age_group', value);
  };

  const onSubmit = async (data: FormFields): Promise<void> => {
    // This function is no longer used directly since we're handling registration in proceedToVerification
    // Keeping it for reference or future modifications
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-16 h-16 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-lg hidden sm:block"></div>
          <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-lg hidden sm:block"></div>
          
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
            
            {/* Stepper UI */}
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
                <span className="font-medium text-gray-900 dark:text-white">{verificationEmail || watch('email')}</span>
              </p>
            </div>
            
            <OTPVerification
              email={verificationEmail || watch('email')}
              onVerificationSuccess={handleVerificationSuccess}
              onBack={() => {
                setShowOTPVerification(false);
                setCurrentStep(1);
              }}
            />
            
            {/* Footer */}
            <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Didn't receive the code? <button 
                  type="button" 
                  className="text-primary-600 hover:text-primary-500 font-medium"
                  onClick={() => {
                    // This would trigger resend OTP functionality
                    showToast.info("Verification code resent. Please check your email.");
                  }}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
          
          {/* Footer */}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
        <div className="w-full max-w-md p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center">
          <Link href="/" className="inline-block mb-3">
            <Image 
              src={theme === 'dark' ? logo1 : logo2} 
              alt="Medh Logo" 
              width={90} 
              height={30} 
              className="mx-auto"
              priority
            />
          </Link>
          <div className="relative w-16 h-16 mx-auto mb-3">
            <div className="absolute inset-0 bg-primary-400/20 dark:bg-primary-600/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={36} className="text-primary-500 animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Setting Up Your Account</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Please wait while we create your account</p>
          <div className="flex justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="animate-pulse delay-0">•</span>
            <span className="animate-pulse delay-150">•</span>
            <span className="animate-pulse delay-300">•</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Font imports */}
      <style jsx global>{`
        /* Import fonts from Google Fonts - in production, consider using next/font or hosting locally */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
        
        /* Font variables */
        :root {
          --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        /* No need to disable scrolling - optimized layout */
        @media (min-width: 641px) {
          html, body {
            overflow: auto;
            height: auto;
          }
        }
        
        /* Keep error messages more compact */
        .error-message {
          margin-top: -2px;
          font-size: 0.7rem;
          line-height: 1.2;
        }

        /* Custom styles for phone input */
        .phone-field-container {
          position: relative;
        }
        
        .phone-input-container {
          position: relative;
        }
        
        .phone-input-container .react-tel-input {
          width: 100%;
        }
        
        .phone-input-container .react-tel-input .form-control {
          @apply w-full h-10 px-3 py-0 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-12;
          font-size: 0.875rem;
          letter-spacing: 0;
        }
        
        .dark .phone-input-container .react-tel-input .form-control {
          background-color: rgba(31, 41, 55, 0.3);
          border-color: rgba(55, 65, 81, 0.5);
          color: #f9fafb;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown {
          @apply bg-transparent border-0 rounded-l-lg sm:rounded-l-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors h-10;
          min-width: 42px;
          border-right: 1px solid #e5e7eb;
        }
        
        .dark .phone-input-container .react-tel-input .flag-dropdown {
          border-right: 1px solid rgba(75, 85, 99, 0.5);
        }
        
        .phone-input-container .react-tel-input .selected-flag {
          @apply bg-transparent rounded-l-lg sm:rounded-l-xl pl-2 hover:bg-transparent;
          width: 42px;
          padding: 0 0 0 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone-input-container .react-tel-input .selected-flag .flag {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone-input-container .react-tel-input .selected-flag .arrow {
          left: 25px;
          border-top: 4px solid #666;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          transition: all 0.2s ease;
        }
        
        .dark .phone-input-container .react-tel-input .selected-flag .arrow {
          border-top: 4px solid #aaa;
        }

        .phone-input-container .react-tel-input .selected-flag .arrow.up {
          border-top: none;
          border-bottom: 4px solid #666;
        }
        
        .dark .phone-input-container .react-tel-input .selected-flag .arrow.up {
          border-bottom: 4px solid #aaa;
        }

        .phone-input-container .react-tel-input .country-list {
          @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg mt-1;
          max-height: 260px;
          width: 300px;
          margin-top: 8px;
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        /* Custom scrollbar for country list */
        .phone-input-container .react-tel-input .country-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .phone-input-container .react-tel-input .country-list::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .phone-input-container .react-tel-input .country-list::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        
        .dark .phone-input-container .react-tel-input .country-list::-webkit-scrollbar-thumb {
          background-color: rgba(107, 114, 128, 0.5);
        }

        .phone-input-container .react-tel-input .country-list .search {
          @apply bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 rounded-t-lg sm:rounded-t-xl;
          padding: 12px;
          margin: 0;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .phone-input-container .react-tel-input .country-list .search-box {
          @apply w-full h-9 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 text-sm;
          padding-left: 30px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 8px center;
          background-size: 16px;
        }
        
        .phone-input-container .react-tel-input .country-list .no-entries-message {
          @apply text-sm text-gray-500 dark:text-gray-400 py-4 px-3 text-center;
        }

        /* Improved styling for the countries list */
        .phone-input-container .react-tel-input .country-list .divider {
          @apply border-t border-gray-200 dark:border-gray-700 my-1;
        }
        
        .phone-input-container .react-tel-input .country-list .country {
          @apply px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .phone-input-container .react-tel-input .country-list .country.highlight {
          @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
        }
        
        .phone-input-container .react-tel-input .country-list .country:focus {
          @apply outline-none bg-gray-100 dark:bg-gray-700/50;
        }

        /* Improved flag display */
        .phone-input-container .react-tel-input .country-list .country .flag {
          @apply flex-shrink-0;
          display: inline-block;
          margin-right: 0;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
        }

        /* Improved country name and dial code */
        .phone-input-container .react-tel-input .country-list .country-name {
          @apply text-sm font-medium text-gray-900 dark:text-gray-100 flex-grow truncate;
          margin-right: 0;
        }

        .phone-input-container .react-tel-input .country-list .dial-code {
          @apply text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 font-mono;
          margin-left: auto;
        }
        
        /* Preferred countries section */
        .phone-input-container .react-tel-input .country-list .preferred {
          @apply border-b border-gray-200 dark:border-gray-700 pb-1 mb-1;
        }
        
        .phone-input-container .react-tel-input .country-list .preferred + .divider {
          display: none;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
        <div className="w-full max-w-4xl relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-16 h-16 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-lg hidden sm:block"></div>
          <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-lg hidden sm:block"></div>

          {/* Card container with glass morphism effect */}
          <div className="signup-card bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 overflow-hidden">
            
            {/* Form Container */}
            <div className="p-4 md:p-8">
              {/* Logo and Header */}
              <div className="text-center mb-2">
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
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Quick signup to start learning
                </p>
              </div>
              
              {/* Compact Stepper UI */}
              <div className="mb-3">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-primary-500 text-white' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'} flex items-center justify-center`}>
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : <span className="text-xs font-medium">1</span>}
                    </div>
                    <span className="text-xs mt-1 text-primary-600 dark:text-primary-400 font-medium">Registration</span>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className={`h-0.5 ${currentStep > 1 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'} flex items-center justify-center`}>
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 font-medium">Verification</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-1.5 md:space-y-2">
                {/* Two-column layout for personal info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
                  {/* Email - First column */}
                  <div className="form-group">
                    <div className="relative">
                      <input
                        {...register("email")}
                        id="email-field"
                        type="email"
                        aria-required="true"
                        aria-invalid={!!errors.email || apiError?.includes("email")}
                        autoComplete="email"
                        placeholder="Enter your email address"
                        className={`w-full h-10 px-3 py-0 ${apiError?.includes("email") ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800 ring-red-400/30' : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'} rounded-lg sm:rounded-xl border focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-9 text-sm`}
                        onBlur={handleEmailBlur}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-4 w-4 ${apiError?.includes("email") ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      {apiError?.includes("email") && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="error-message text-red-500 flex items-start" role="alert">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{errors.email?.message}</span>
                      </p>
                    )}
                    {apiError && apiError.includes("email") && (
                      <div className="error-message flex items-start justify-between" role="alert">
                        <p className="text-red-500 flex items-start">
                          <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                          <span>Email already registered</span>
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

                  {/* Full Name - Second column */}
                  <div className="form-group">
                    <div className="relative">
                      <input
                        {...register("full_name")}
                        type="text"
                        aria-required="true"
                        aria-invalid={!!errors.full_name}
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="w-full h-10 px-3 py-0 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-9 text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    {errors.full_name && (
                      <p className="error-message text-red-500 flex items-start" role="alert">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{errors.full_name?.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="form-section">
                  {/* Two-column layout for Phone and Age Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
                    {/* Phone Number Field */}
                    <Controller
                      name="phone_numbers"
                      control={control}
                      rules={{
                        validate: items => {
                          console.log('Validating phone_numbers:', items);
                          const item = Array.isArray(items) && items[0] ? items[0] : { country: '', number: '' };
                          console.log('Phone item to validate:', item);
                          // If number is present, validate it properly
                          if (!item.number || item.number === '+') {
                            console.log('Phone validation failed: number empty or just +');
                            return 'Phone number is required';
                          }
                          // Validate with Joi schema but handle empty state better
                          const { error } = phoneNumberSchema.validate(item);
                          console.log('Joi validation result:', { error: error?.message });
                          return error ? error.message : true;
                        }
                      }}
                      render={({ field, fieldState }) => (
                        <div className="form-group">
                          <PhoneNumberInput
                            value={{ country: field.value[0]?.country || 'in', number: field.value[0]?.number || '' }}
                            onChange={val => field.onChange([val])}
                            placeholder="Enter your phone number"
                            error={fieldState.error?.message}
                          />
                        </div>
                      )}
                    />

                    {/* Age Group Dropdown */}
                    <div className="form-group">
                      <div className="relative">
                        <select
                          {...register("age_group")}
                          onChange={handleAgeGroupChange}
                          value={selectedAgeGroup}
                          aria-required="true"
                          className="w-full h-10 px-2 py-0 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-8 appearance-none text-sm"
                        >
                          <option value="Under 16">Under 16</option>
                          <option value="16-24">16-24</option>
                          <option value="25-34">25-34</option>
                          <option value="35-44">35-44</option>
                          <option value="45-54">45-54</option>
                          <option value="55-64">55-64</option>
                          <option value="65+">65+</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <UserCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two-column layout for password fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
                  {/* Password with Strength Meter */}
                  <div>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full h-10 px-3 py-0 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-9 pr-9 text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="error-message text-red-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{errors.password?.message}</span>
                      </p>
                    )}
                    
                    {/* Password Strength Meter (Simplified) */}
                    {watchPassword && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.color === "red" ? 'text-red-500' : 
                            passwordStrength.color === "orange" ? 'text-yellow-500' : 
                            passwordStrength.color === "green" ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {passwordStrength.message}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              passwordStrength.color === "red" ? 'bg-red-500' : 
                              passwordStrength.color === "orange" ? 'bg-yellow-500' : 
                              passwordStrength.color === "green" ? 'bg-green-500' : 'bg-gray-400'
                            }`} 
                            style={{ width: `${Math.min(100, (passwordStrength.score / 6) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="relative">
                      <input
                        {...register("confirm_password")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full h-10 px-3 py-0 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none pl-9 pr-9 text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="error-message text-red-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{errors.confirm_password?.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced section for reCAPTCHA and Terms with centered layout */}
                <div className="mt-3 md:mt-4 space-y-1.5 md:space-y-2">
                  {/* Two-column layout for captcha and terms on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1.5 md:gap-y-2">
                    {/* reCAPTCHA */}
                    <div className="w-full mx-auto md:mx-0 max-w-md">
                      <CustomReCaptcha
                        onChange={handleRecaptchaChange}
                        error={!!errors.recaptcha || recaptchaError}
                      />
                    </div>

                    {/* Terms Checkbox - Styled like ReCaptcha */}
                    <div className="w-full mx-auto md:mx-0 max-w-md">
                      <div
                        className={`w-full p-4 rounded-lg sm:rounded-xl border transition-all duration-300 cursor-pointer select-none
                          ${errors.agree_terms 
                            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                            : watch('agree_terms')
                              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                              : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30'
                          }`}
                        onClick={() => setValue('agree_terms', !watch('agree_terms'), { shouldValidate: true })}
                      >
                        <div className="flex items-center space-x-3">
                          {watch('agree_terms') ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                          ) : errors.agree_terms ? (
                            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                          ) : (
                            <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                          <span className={`text-sm ${
                            errors.agree_terms 
                              ? 'text-red-600 dark:text-red-400' 
                              : watch('agree_terms')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {errors.agree_terms 
                              ? 'Terms acceptance required' 
                              : watch('agree_terms')
                                ? 'Terms of Use and Privacy Policy accepted'
                                : (
                                  <>
                                    I agree to the{' '}
                                    <a href="/terms-and-services" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" target="_blank" onClick={(e) => e.stopPropagation()}>
                                      Terms of Use
                                    </a>
                                    {' '}and{' '}
                                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" target="_blank" onClick={(e) => e.stopPropagation()}>
                                      Privacy Policy
                                    </a>
                                  </>
                                )}
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
                          <span>Please accept our Terms of use and Privacy Policy to continue</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Centered text below the two elements */}
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 mx-auto max-w-md">
                    <span>By accepting you agree to our <a href="/terms-and-services" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" target="_blank">Terms of Use</a> and <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" target="_blank">Privacy Policy</a></span>
                  </div>
                </div>
                
                {/* Submit Button - Register & Verify */}
                <div className="mt-3 md:mt-4">
                  <button
                    type="button"
                    onClick={proceedToVerification}
                    disabled={isSubmitting}
                    className="w-full md:max-w-xs md:mx-auto md:block py-2.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 relative overflow-hidden group text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Register & Verify
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </div>

                {/* OAuth Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Google OAuth Button */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignup('google')}
                    disabled={isOAuthLoading.google}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm"
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
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
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
          <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
        </div>
      </div>

      {registrationSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Registration Successful!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Please check your email for the verification code.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
