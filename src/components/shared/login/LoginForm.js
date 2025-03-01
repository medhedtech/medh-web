"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LogIn from "@/assets/images/log-sign/logIn.png";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import FixedShadow from "../others/FixedShadow";

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

  const secretKey = "secret-key-s3cUr3K3y$12345#";

  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Prefill email and password from localStorage
  useEffect(() => {
    const encryptedEmail = localStorage.getItem("email");
    const encryptedPassword = localStorage.getItem("password");

    if (encryptedEmail && encryptedPassword) {
      try {
        const decryptedEmail = CryptoJS.AES.decrypt(
          encryptedEmail,
          secretKey
        ).toString(CryptoJS.enc.Utf8);

        const decryptedPassword = CryptoJS.AES.decrypt(
          encryptedPassword,
          secretKey
        ).toString(CryptoJS.enc.Utf8);

        setPrefilledValues({
          email: decryptedEmail,
          password: decryptedPassword,
        });
        setRememberMe(true);
      } catch (error) {
        console.error("Failed to decrypt stored email or password:", error);
      }
    }
  }, []);

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
    // if (!recaptchaValue) {
    //   setRecaptchaError(true);
    //   return;
    // }
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
        try {
          const decoded = jwtDecode(res.token);
          console.log("Decoded token:", decoded); // Debug log
          
          // Try different possible paths for role in the token
          if (decoded.user && decoded.user.role) {
            // If role is an array, take the first one, otherwise use it directly
            userRole = Array.isArray(decoded.user.role) 
              ? decoded.user.role[0] 
              : decoded.user.role;
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

          console.log("Extracted userRole:", userRole); // Debug log
        } catch (error) {
          console.error("Error decoding token or extracting role:", error);
          // Fallback to using role from response if available
          userRole = res.role || '';
        }
        
        // Store role in localStorage for later use
        localStorage.setItem("role", userRole);

        if (rememberMe) {
          // Encrypt email and password
          const encryptedEmail = CryptoJS.AES.encrypt(
            data.email,
            secretKey
          ).toString();
          const encryptedPassword = CryptoJS.AES.encrypt(
            data.password,
            secretKey
          ).toString();

          // Save token in Cookies for 30 days
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.id);
          localStorage.setItem("email", encryptedEmail);
          localStorage.setItem("password", encryptedPassword);
          localStorage.setItem("permissions", JSON.stringify(res.permissions));
          Cookies.set("token", res.token, { expires: 30 });
          Cookies.set("userId", res.id, { expires: 30 });
        } else {
          // Save token in localStorage for session
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.id);
          // Still save permissions even for session login
          localStorage.setItem("permissions", JSON.stringify(res.permissions));
        }

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
          router.push(`/dashboards/${roleLower}-dashboard`);
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
      
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-16">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-500/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4 opacity-70"></div>
        </div>
        
        <div className={`w-full max-w-[1100px] transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative mx-auto flex flex-col md:flex-row shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <FixedShadow align="left" color="primary" opacity={0.07} size="xl" />
            <FixedShadow align="right" color="secondary" opacity={0.05} size="lg" />
            
            {/* Left side - Image */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
              <div className="h-full flex items-center justify-center p-8">
                <div className="relative w-full max-w-lg transform transition-all duration-700 group hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <Image
                    src={LogIn}
                    alt="Login illustration"
                    className="w-full h-auto max-w-md object-contain relative z-10"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-white dark:bg-gray-900 transition-all duration-300 font-body">
              {/* Logo */}
              <div className="w-[180px] mx-auto mb-8 transition-transform duration-300 hover:scale-105">
                <a href="/" className="block">
                  <Image 
                    src={logo1} 
                    alt="Medh Logo" 
                    className="w-full h-auto" 
                    priority
                  />
                </a>
              </div>
              
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back!</h1>
                <p className="text-gray-600 dark:text-gray-400 font-body">
                  Log in to access your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="Email address"
                      className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none font-body"
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.email?.message}</span>
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
                      className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none font-body"
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.password?.message}</span>
                    </p>
                  )}
                </div>

                {/* ReCAPTCHA */}
                <CustomReCaptcha
                  onChange={handleRecaptchaChange}
                  error={recaptchaError}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="remember_me"
                      onChange={handleRememberMeChange}
                      checked={rememberMe}
                      className="w-4 h-4 rounded-md text-primary-500 border-gray-300 focus:ring-primary-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-body">Remember Me</span>
                  </label>
                  <a 
                    href="/forgot-password" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register("agree_terms")}
                      className="w-4 h-4 mt-0.5 rounded-md text-primary-500 border-gray-300 focus:ring-primary-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-body">
                      I accept the{" "}
                      <a
                        href="/terms-and-conditions"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline hover:no-underline transition-colors"
                      >
                        terms of use
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline hover:no-underline transition-colors"
                      >
                        privacy policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.agree_terms && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-start font-body" role="alert">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.agree_terms.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-body"
                  >
                    Sign In
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 dark:text-gray-400 font-body">
                    Don't have an account?{" "}
                    <a 
                      href="/signup" 
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Sign Up
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

export default LoginForm;
