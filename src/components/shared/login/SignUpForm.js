"use client";
import React, { useState } from "react";
import Image from "next/image";
import SignIn from "@/assets/images/log-sign/SignIn.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import FixedShadow from "../others/FixedShadow";

const schema = yup
  .object({
    full_name: yup.string().required("Name is required"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    phone_number: yup
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setApiError(null);
    try {
      await postQuery({
        url: apiUrls?.user?.register,
        postData: {
          full_name: data?.full_name,
          email: data?.email,
          password: data?.password,
          phone_number: data?.phone_number,
          agree_terms: data?.agree_terms,
        },
        onSuccess: () => {
          setRecaptchaError(false);
          setRecaptchaValue(null);
          router.push("/login");
          toast.success("Registration successful!");
        },
        onFail: (error) => {
          console.log("Full error object:", error);

          const errorMessage = error?.response?.data?.message;
          if (!errorMessage) {
            toast.error("An unexpected error occurred.");
            setApiError("An unexpected error occurred.");
            return;
          }

          if (errorMessage === "User already exists") {
            toast.error(
              "This email is already registered. Please try logging in."
            );
          } else if (errorMessage.toLowerCase().includes("validation")) {
            toast.error("Please check your input fields and try again.");
          } else {
            toast.error("Registration failed. Please try again.");
          }
          setApiError(errorMessage);
        },
      });
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="relative mx-auto md:flex md:justify-between h-auto max-w-[1064px] shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <FixedShadow align="left" color="purple" opacity={0.05} size="xl" />
      <FixedShadow align="right" color="teal" opacity={0.03} size="lg" />
      
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <div className="h-full flex items-center justify-center p-8">
          <Image
            src={SignIn}
            alt="Sign up illustration"
            className="w-full h-auto max-w-md object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-white dark:bg-gray-900 transition-all duration-300">
        {/* Logo */}
        <div className="w-[160px] mx-auto mb-6">
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
        <div className="text-center mb-6">
          <h1 className="font-semibold text-3xl text-gray-900 dark:text-white mb-2">Getting Started!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to see your content
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
                className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.full_name ? "true" : "false"}
              />
            </div>
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.full_name?.message}
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
                className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.email?.message}
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
                className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.phone_number ? "true" : "false"}
              />
            </div>
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.phone_number?.message}
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
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.password?.message}
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
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.confirm_password ? "true" : "false"}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.confirm_password?.message}
              </p>
            )}
          </div>

          {/* ReCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9"
              onChange={handleRecaptchaChange}
            />
          </div>
          {recaptchaError && (
            <p className="text-sm text-red-500 text-center" role="alert">
              Please complete the ReCAPTCHA verification.
            </p>
          )}

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="terms"
                {...register("agree_terms")}
                className="w-5 h-5 mt-0.5 rounded-md text-purple-500 border-gray-300 focus:ring-purple-500 transition-colors"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I accept the{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline hover:no-underline transition-colors"
                >
                  terms and conditions
                </a>
              </span>
            </label>
            {errors.agree_terms && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.agree_terms.message}
              </p>
            )}
          </div>

          {/* API Error Display */}
          {apiError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {apiError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
