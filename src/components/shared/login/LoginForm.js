"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogIn from "@/assets/images/log-sign/logIn.png";
import logo1 from "@/assets/images/logo/medh.png";
import logo2 from "@/assets/images/logo/logo_2.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import { useStorage } from "@/contexts/StorageContext";
import FixedShadow from "../others/FixedShadow";
import { events } from "@/utils/analytics";

const schema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
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
  const { postQuery, loading } = usePostQuery();
  const storageManager = useStorage();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefilledValues, setPrefilledValues] = useState({
    email: "",
    password: "",
  });
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: prefilledValues,
  });

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Prefill email and password from localStorage if previously stored with remember me
  useEffect(() => {
    // Check if rememberMe was set in previous sessions
    const rememberedUser = storageManager.getCurrentUser();
    const isRemembered = storageManager.getPreference(storageManager.STORAGE_KEYS.REMEMBER_ME, false);
    
    if (isRemembered && rememberedUser && rememberedUser.email) {
      setPrefilledValues({
        email: rememberedUser.email,
        password: "", // For security, don't prefill password in the form
      });
      setRememberMe(true);
    }
  }, [storageManager]);

  useEffect(() => {
    setValue("email", prefilledValues.email);
    setValue("password", prefilledValues.password);
  }, [prefilledValues, setValue]);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  // Update onChange handler
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    await postQuery({
      url: apiUrls?.user?.login,
      postData: {
        email: data.email,
        password: data.password,
        agree_terms: data?.agree_terms,
      },
      onSuccess: (res) => {
        // Decode token and extract user role with better error handling
        let userRole = '';
        let fullName = '';
        
        try {
          const decoded = jwtDecode(res.token);
          console.log("Decoded token:", decoded); // Debug log
          
          // Try different possible paths for role in the token
          if (decoded.user && decoded.user.role) {
            // If role is an array, take the first one, otherwise use it directly
            userRole = Array.isArray(decoded.user.role) 
              ? decoded.user.role[0] 
              : decoded.user.role;
            
            // Extract full name
            if (decoded.user.full_name) {
              fullName = decoded.user.full_name;
            }
          } else if (decoded.role) {
            // Alternative path: directly in the token
            userRole = Array.isArray(decoded.role) 
              ? decoded.role[0] 
              : decoded.role;
          }
          
          // Additional fallback: check if the role is returned directly in the response
          if (!userRole && res.role) {
            userRole = res.role;
          }

          // Store user's full name
          if (decoded.user && decoded.user.full_name) {
            fullName = decoded.user.full_name;
          } else if (res.full_name) {
            fullName = res.full_name;
          }
        } catch (error) {
          console.error("Error decoding token or extracting role:", error);
          // Fallback to using role from response if available
          userRole = res.role || '';
          
          // Still try to store full name from response if available
          if (res.full_name) {
            fullName = res.full_name;
          }
        }
        
        // Use our storage manager to store all auth data
        storageManager.login({
          token: res.token,
          userId: res.id,
          email: data.email,
          password: rememberMe ? data.password : undefined,
          role: userRole,
          fullName: fullName,
          permissions: res.permissions || [],
          rememberMe: rememberMe
        });

        // Track login event in Google Analytics
        events.login(userRole || 'user');

        // Handle routing based on role
        // Convert role to lowercase for case-insensitive comparison
        const roleLower = userRole.toLowerCase();
        if (
          roleLower === "admin" || roleLower === "super-admin" ||
          roleLower === "instructor" ||
          roleLower === "student" ||
          roleLower === "coorporate"
        ) {
          console.log(`Redirecting to /dashboards/${roleLower}-dashboard`);
          router.push(`/dashboards/${roleLower}`);
        } else if (roleLower === "coorporate-student") {
          console.log("Redirecting to /dashboards/coorporate-employee-dashboard");
          router.push(`/dashboards/coorporate-employee-dashboard`);
        } else {
          console.log("Role not recognized, redirecting to home page:", userRole);
          // Default case if the role doesn't match any predefined roles
          router.push("/");
        }
        toast.success("Login successful!");
        setRecaptchaError(false);
        setRecaptchaValue(null);
      },
      onFail: (error) => {
        toast.error("Invalid Credentials!");
        console.log(error);
      },
    });
  };

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

        /* Disable scrolling completely */
        html, body {
          overflow: hidden;
          height: 100%;
          position: fixed;
          width: 100%;
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>
          
          {/* Card container with glass morphism effect */}
          <div className="login-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            
            {/* Header area */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-3 sm:pb-4 text-center">
              <Link href="/" className="inline-block mb-4">
                <Image 
                  src={logo1} 
                  alt="Medh Logo" 
                  width={120} 
                  height={40} 
                  className="mx-auto"
                  priority
                />
              </Link>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey
              </p>
            </div>
            
            {/* Form area */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                {/* Email field */}
                <div>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                        errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11`}
                      {...register("email")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 mr-1.5 flex-shrink-0" />
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
                      className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                        errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11`}
                      {...register("password")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 mr-1.5 flex-shrink-0" />
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
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-md text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      onChange={handleRememberMeChange}
                      checked={rememberMe}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-right">
                    <a
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
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
                      className="rounded-md text-primary-600 focus:ring-primary-500 h-3.5 w-3.5 sm:h-4 sm:w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 mt-0.5 sm:mt-1"
                      {...register("agree_terms")}
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      I accept the{" "}
                      <a
                        href="/terms-and-services"
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        terms of use
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        privacy policy
                      </a>
                    </span>
                  </label>
                  {errors.agree_terms && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-start" role="alert">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.agree_terms.message}</span>
                    </p>
                  )}
                </div>
                
                {/* Custom ReCAPTCHA */}
                <div>
                  <CustomReCaptcha onChange={handleRecaptchaChange} error={!!recaptchaError} />
                </div>
                
                {/* Submit Button */}
                <div className="pt-1 sm:pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
                
                {/* Sign Up Link */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
          <div className="text-center mt-4 sm:mt-6 text-xxs sm:text-xs text-gray-500 dark:text-gray-400">
            <p>Trusted by students worldwide 🌎</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
