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
import lock from "@/assets/images/log-sign/lock.svg";
import Email from "@/assets/images/log-sign/Email.svg";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
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
        const decoded = jwtDecode(res.token);
        const userRole = decoded.user.role[0];
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
          localStorage.setItem("role", res.role);
          Cookies.set("token", res.token, { expires: 30 });
          Cookies.set("userId", res.id, { expires: 30 });
        } else {
          // Save token in localStorage for session
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.id);
        }
        if (
          userRole === "admin" ||
          userRole === "instructor" ||
          userRole === "student" ||
          userRole === "coorporate"
        ) {
          console.log("userrole: ", userRole);
          router.push(`/dashboards/${userRole}-dashboard`);
        } else if (userRole === "coorporate-student") {
          router.push(`/dashboards/coorporate-employee-dashboard`);
        } else {
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
    return <Preloader />;
  }

  return (
    <div className="relative mx-auto md:flex md:justify-between h-auto max-w-[1064px] shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <FixedShadow align="left" color="green" opacity={0.05} size="xl" />
      <FixedShadow align="right" color="blue" opacity={0.03} size="lg" />
      
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="h-full flex items-center justify-center p-8">
          <Image
            src={LogIn}
            alt="Login illustration"
            className="w-full h-auto max-w-md object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-white dark:bg-gray-900 transition-all duration-300">
        {/* Logo */}
        <div className="w-[160px] mx-auto mb-8">
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
          <h1 className="font-semibold text-3xl text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-400">
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
                className="w-full h-12 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.email?.message}
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
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
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
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.password?.message}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember_me"
                onChange={handleRememberMeChange}
                checked={rememberMe}
                className="w-5 h-5 rounded-md text-green-500 border-gray-300 focus:ring-green-500 transition-colors"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remember Me</span>
            </label>
            <a 
              href="/forgot-password" 
              className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors"
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
                className="w-5 h-5 mt-0.5 rounded-md text-green-500 border-gray-300 focus:ring-green-500 transition-colors"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I accept the{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 underline hover:no-underline transition-colors"
                >
                  terms of use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 underline hover:no-underline transition-colors"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>
            {errors.agree_terms && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.agree_terms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Sign In
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
