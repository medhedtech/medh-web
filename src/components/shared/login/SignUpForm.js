"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SignIn from "@/assets/images/log-sign/SignIn.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle, Loader2, Moon, Sun } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import FixedShadow from "../others/FixedShadow";

// Helper function to clean and normalize phone number
const cleanPhoneNumber = (value) => {
  if (!value) return '';
  // Remove all non-digit characters
  let cleaned = value.replace(/\D/g, '');
  // Remove leading zero if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  // Remove country code '91' if present and the number is longer than 10 digits
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
};

// Improved phone number validation function using cleanPhoneNumber
const validatePhoneNumber = (value) => {
  const number = cleanPhoneNumber(value);
  // Check if it's exactly 10 digits and starts with 6-9
  return /^[6-9]\d{9}$/.test(number);
};

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
    phone_number: yup
      .string()
      .required("Phone number is required")
      .test("phone", "Phone number must be exactly 10 digits and start with 6-9", validatePhoneNumber),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms to proceed"),
  })
  .required();

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { postQuery, loading } = usePostQuery();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Initialize theme based on user preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check system preference
    const systemPrefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  // Toggle theme function
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setApiError(null);
    try {
      // Clean and format phone number
      const cleanedNumber = cleanPhoneNumber(data.phone_number);
      if (cleanedNumber.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
      const formattedPhoneNumber = `+91${cleanedNumber}`;

      // Prepare the request data
      const requestData = {
        full_name: data.full_name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone_number: formattedPhoneNumber,
        agree_terms: data.agree_terms,
        recaptcha_token: recaptchaValue
      };

      // Make the API call
      const response = await postQuery({
        url: apiUrls?.user?.register,
        postData: requestData,
        onSuccess: (response) => {
          setRecaptchaError(false);
          setRecaptchaValue(null);
          
          // Store any necessary data from response
          if (response?.data?.token) {
            localStorage.setItem('auth_token', response.data.token);
          }
          
          toast.success("Registration successful! Redirecting to login...");
          
          // Delay redirect slightly to show success message
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        },
        onFail: (error) => {
          console.error("Registration Error:", error);

          // Handle specific error cases
          const errorResponse = error?.response?.data;
          const errorMessage = errorResponse?.message || errorResponse?.error;

          if (typeof errorMessage === 'string') {
            if (errorMessage.includes('already exists')) {
              toast.error("This email is already registered. Please try logging in instead.");
            } else if (errorMessage.toLowerCase().includes('validation')) {
              toast.error("Please check your input and try again.");
            } else if (errorMessage.toLowerCase().includes('phone')) {
              toast.error("Please enter a valid 10-digit phone number.");
            } else if (errorMessage.toLowerCase().includes('recaptcha')) {
              toast.error("ReCAPTCHA verification failed. Please try again.");
              setRecaptchaError(true);
            } else {
              toast.error(errorMessage || "Registration failed. Please try again.");
            }
          } else {
            toast.error("An unexpected error occurred. Please try again later.");
          }

          setApiError(errorMessage || "Registration failed. Please try again.");
          
          // Reset reCAPTCHA if it's expired or invalid
          if (errorMessage?.toLowerCase().includes('recaptcha')) {
            setRecaptchaValue(null);
          }
        },
      });
    } catch (error) {
      console.error("Registration Error:", error);
      setApiError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
          <p className="font-body text-gray-600 dark:text-gray-300">Creating your account...</p>
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
      `}</style>
      
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-16">
        {/* Theme toggle button - fixed position */}
        <button 
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-indigo-600" />
          )}
        </button>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4 opacity-70"></div>
        </div>
        
        <div className={`w-full max-w-[1100px] transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative mx-auto flex flex-col md:flex-row shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <FixedShadow align="left" color="primary" opacity={0.07} size="xl" />
            <FixedShadow align="right" color="secondary" opacity={0.05} size="lg" />
            
            {/* Left side - Image */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
              <div className="h-full flex items-center justify-center p-8">
                <div className="relative w-full max-w-lg transform transition-all duration-700 group hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <Image
                    src={SignIn}
                    alt="Sign up illustration"
                    className="w-full h-auto max-w-md object-contain relative z-10 dark:filter dark:brightness-90"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-white dark:bg-gray-900 transition-all duration-300 font-body">
              {/* Theme toggle button - mobile only (inside form) */}
              <div className="md:hidden flex justify-end mb-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <Sun size={18} className="text-yellow-500" />
                  ) : (
                    <Moon size={18} className="text-indigo-600" />
                  )}
                </button>
              </div>
              
              {/* Logo */}
              <div className="w-[180px] mx-auto mb-6 transition-transform duration-300 hover:scale-105">
                <a href="/" className="block">
                  <Image 
                    src={logo1} 
                    alt="Medh Logo" 
                    className="w-full h-auto dark:filter dark:brightness-110" 
                    priority
                  />
                </a>
              </div>
              
              {/* Heading */}
              <div className="text-center mb-6">
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-2 tracking-tight">Getting Started!</h1>
                <p className="text-gray-600 dark:text-gray-300 font-body">
                  Create an account to join our learning community
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <div className="relative">
                    <User 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                      size={18} 
                    />
                    <input
                      {...register("full_name")}
                      type="text"
                      id="full_name"
                      placeholder="Full Name"
                      className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 outline-none font-body placeholder-gray-500 dark:placeholder-gray-400"
                      aria-invalid={errors.full_name ? "true" : "false"}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.full_name?.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className="relative">
                    <Mail 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                      size={18} 
                    />
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 outline-none font-body placeholder-gray-500 dark:placeholder-gray-400"
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.email?.message}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <div className="relative">
                    <Phone 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                      size={18} 
                    />
                    <input
                      {...register("phone_number")}
                      type="tel"
                      id="phone_number"
                      placeholder="Phone Number"
                      className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 outline-none font-body placeholder-gray-500 dark:placeholder-gray-400"
                      aria-invalid={errors.phone_number ? "true" : "false"}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.phone_number?.message}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Lock 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                      size={18} 
                    />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 outline-none font-body placeholder-gray-500 dark:placeholder-gray-400"
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.password?.message}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="relative">
                    <Lock 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                      size={18} 
                    />
                    <input
                      {...register("confirm_password")}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_password"
                      placeholder="Confirm Password"
                      className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 outline-none font-body placeholder-gray-500 dark:placeholder-gray-400"
                      aria-invalid={errors.confirm_password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.confirm_password?.message}</span>
                    </p>
                  )}
                </div>

                {/* ReCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9"
                    onChange={handleRecaptchaChange}
                    theme={isDarkMode ? 'dark' : 'light'}
                  />
                </div>
                {recaptchaError && (
                  <p className="text-sm text-red-500 dark:text-red-400 text-center flex items-center justify-center font-body" role="alert">
                    <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>Please complete the ReCAPTCHA verification.</span>
                  </p>
                )}

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register("agree_terms")}
                      className="w-4 h-4 mt-0.5 rounded-md text-primary-500 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-body">
                      I accept the{" "}
                      <a
                        href="/terms-and-conditions"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline hover:no-underline transition-colors"
                      >
                        terms and conditions
                      </a>
                    </span>
                  </label>
                  {errors.agree_terms && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.agree_terms.message}</span>
                    </p>
                  )}
                </div>

                {/* API Error Display */}
                {apiError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>{apiError}</span>
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 dark:shadow-primary-900/30 hover:shadow-primary-500/30 dark:hover:shadow-primary-800/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-body"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 dark:text-gray-300 font-body">
                    Already have an account?{" "}
                    <a 
                      href="/login" 
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
