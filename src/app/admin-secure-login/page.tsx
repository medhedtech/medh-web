"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { 
  Eye, EyeOff, Mail, Lock, AlertCircle, 
  Loader2, ArrowRight, Shield, ChevronLeft, CheckCircle
} from "lucide-react";

// Assets
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";

// Components & Hooks
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080/api/v1' 
  : 'https://api.medh.co/api/v1';

// Types
interface FormInputs {
  email: string;
  password: string;
  agree_terms: boolean;
}

// Validation Schema
const schema = yup
  .object({
    email: yup.string().trim().email("Please enter a valid email").required("Email is required"),
    password: yup
      .string()
      .min(1, "Password is required")
      .required("Password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms to proceed"),
  })
  .required();

const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();

  // Form state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    trigger
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      agree_terms: false
    }
  });

  // Initialize theme and visibility
  useEffect(() => {
    if (!theme) setTheme('light');
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [theme, setTheme]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Try admin-auth login first (local or env base)
      let adminResp = await fetch(`${API_BASE_URL}/admin-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      let result = await adminResp.json().catch(() => ({}));

      // If admin route not found locally, retry against production API directly
      if (!adminResp.ok && adminResp.status === 404) {
        const PROD_BASE = 'https://api.medh.co/api/v1';
        adminResp = await fetch(`${PROD_BASE}/admin-auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        result = await adminResp.json().catch(() => ({}));
      }

      // If admin route not available, fallback to standard auth login
      if (!adminResp.ok && (adminResp.status === 404 || (result && result.message === 'Invalid route'))) {
        const userResp = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const userResult = await userResp.json();
        if (!userResp.ok) {
          const friendly = userResp.status === 401 ? 'Incorrect email or password' : (userResult.message || 'Login failed');
          throw new Error(friendly);
        }
        // Accept token formats { token } or { data: { access_token } }
        const token = userResult.token || userResult?.data?.access_token;
        if (token) {
          // Persist to both localStorage and sessionStorage for guard compatibility
          localStorage.setItem('admin_token', token);
          sessionStorage.setItem('admin_token', token);
          const adminLike = userResult.admin || userResult.user || userResult.data?.user || {};
          localStorage.setItem('admin_user', JSON.stringify(adminLike));
          localStorage.setItem('admin_data', JSON.stringify(adminLike));
          sessionStorage.setItem('admin_user', JSON.stringify(adminLike));
          sessionStorage.setItem('admin_data', JSON.stringify(adminLike));
        }
      } else {
        if (!adminResp.ok) {
          const friendly = adminResp.status === 401 ? 'Incorrect email or password' : (result?.message || 'Login failed');
          throw new Error(friendly);
        }
        if (result.token) {
          localStorage.setItem('admin_token', result.token);
          sessionStorage.setItem('admin_token', result.token);
          localStorage.setItem('admin_user', JSON.stringify(result.admin));
          localStorage.setItem('admin_data', JSON.stringify(result.admin));
          sessionStorage.setItem('admin_user', JSON.stringify(result.admin));
          sessionStorage.setItem('admin_data', JSON.stringify(result.admin));
        }
      }

      showToast.success("Login successful! Redirecting to admin dashboard...", { duration: 1500 });
      setTimeout(() => {
        // Force full navigation to ensure guard sees latest storage
        window.location.assign('/dashboards/admin');
      }, 800);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      showToast.error(errorMessage, { duration: 5000 });
    }
  };

  return (
    <>
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
              
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Portal
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Sign in to access the admin dashboard
              </p>
              
              {/* Admin indicator */}
              <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/20 rounded-full text-xs font-medium text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                Secure Admin Access
              </div>
            </div>
            
            {/* Form area */}
            <div className="px-4 sm:px-8 pb-4 sm:pb-6">
              {/* Email Login Form */}
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4"
              >
                {/* Email field */}
                <div>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Admin email address"
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
                      placeholder="Admin password"
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
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-right">
                    <Link
                      href="/admin-forgot-password"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
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
                            ? 'Agreed to Admin Terms and Security Policy'
                            : 'I agree to the Admin Terms and Security Policy'}
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
                      <span>Please accept our Admin Terms and Security Policy to continue</span>
                    </p>
                  )}
                </div>

                {/* Terms agreement text */}
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                  <span>By submitting this form, I agree to the{" "}
                    <Link 
                      href="/admin-terms" 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" 
                      target="_blank"
                    >
                      Admin Terms
                    </Link>
                    {" "}and{" "}
                    <Link 
                      href="/admin-security-policy" 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" 
                      target="_blank"
                    >
                      Security Policy
                    </Link>
                  </span>
                </div>
                
                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In to Admin Dashboard
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Need an admin account?{" "}
                    <Link 
                      href="/admin-secure-registration" 
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Request Access
                    </Link>
                  </p>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      🔒 This is a secure admin portal. All login attempts are monitored and logged for security purposes.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH Foundation. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              SECURE ADMIN PORTAL
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginForm;