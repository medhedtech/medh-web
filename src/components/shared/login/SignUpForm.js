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
import { Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle, Loader2, Moon, Sun, UserCircle, ArrowRight, CheckCircle } from "lucide-react";
import CustomReCaptcha from '../ReCaptcha';
import FixedShadow from "../others/FixedShadow";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import Link from "next/link";
import { parsePhoneNumber, isValidPhoneNumber, formatPhoneNumber as formatPhoneNumberIntl } from 'libphonenumber-js';

// Enhanced phone number validation using libphonenumber-js
const validatePhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return false;
  
  try {
    // Add + to the phone number if it doesn't have one
    const phoneNumberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Parse the phone number
    const parsedNumber = parsePhoneNumber(phoneNumberWithPlus);
    
    if (!parsedNumber) return false;

    // Check if the number is valid for the given country
    return parsedNumber.isValid() && 
           (!countryCode || parsedNumber.country === countryCode.toUpperCase());
  } catch (error) {
    console.error('Phone validation error:', error);
    return false;
  }
};

// Format phone number for display and storage
const formatPhoneNumber = (phoneNumber, countryCode) => {
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
    agree_terms: yup.boolean()
      .oneOf([true], "You must accept the terms to proceed")
      .required(),
    role: yup.array()
      .of(yup.string()
        .oneOf([
          "admin",
          "student",
          "instructor",
          "coorporate",
          "coorporate-student"
        ])
      )
      .default(["student"]),
    role_description: yup.string().nullable(),
    assign_department: yup.array()
      .of(yup.string())
      .default([]),
    permissions: yup.array()
      .of(yup.string()
        .oneOf([
          "course_management",
          "student_management",
          "instructor_management",
          "corporate_management",
          "generate_certificate",
          "get_in_touch",
          "enquiry_form",
          "post_job",
          "feedback_and_complaints",
          "placement_requests",
          "blogs"
        ])
      )
      .default([]),
    age: yup.string().nullable(),
    status: yup.string()
      .oneOf(["Active", "Inactive"])
      .default("Active"),
    facebook_link: yup.string().nullable(),
    instagram_link: yup.string().nullable(),
    linkedin_link: yup.string().nullable(),
    user_image: yup.string().nullable(),
    meta: yup.object({
      course_name: yup.string().nullable(),
      age: yup.string().nullable(),
      category: yup.string().nullable(),
      gender: yup.string()
        .oneOf(["Male", "Female", "Others"])
        .default("Male"),
      upload_resume: yup.array()
        .of(yup.string())
        .default([])
    }).default(() => ({
      gender: "Male",
      upload_resume: []
    })),
    admin_role: yup.string()
      .oneOf(["super-admin", "admin", "coorporate-admin"])
      .default("admin"),
    company_type: yup.string()
      .oneOf(["Institute", "University"])
      .nullable(),
    phone_numbers: yup.array()
      .of(yup.object({
        country: yup.string().required("Country code is required"),
        number: yup.string()
          .required("Phone number is required")
          .matches(
            /^\+?[1-9]\d{1,14}$/,
            "Phone number must be in international E.164 format"
          )
      }))
      .min(1, "At least one phone number is required")
      .required(),
    company_website: yup.string().nullable(),
    corporate_id: yup.string().nullable(),
    recaptcha: yup.string()
      .required("Please verify that you are human")
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [phoneData, setPhoneData] = useState({
    number: '',
    country: 'IN',
    countryCode: '91',
    formattedNumber: '',
    isValid: false,
    type: null,
    nationalFormat: '',
    internationalFormat: ''
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Initialize form values
  useEffect(() => {
    // Set default values
    setValue('phone_numbers', [{
      country: phoneData.country,
      number: phoneData.number
    }]);
  }, [setValue, phoneData.number, phoneData.country]);

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
    setValue('recaptcha', value);
    trigger('recaptcha');
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

  // Enhanced phone number change handler
  const handlePhoneChange = (value, country) => {
    try {
      // Remove any spaces or special characters from the phone number
      const cleanNumber = value.replace(/\s+/g, '');
      const phoneNumberWithPlus = cleanNumber.startsWith('+') ? cleanNumber : `+${cleanNumber}`;
      const parsedNumber = parsePhoneNumber(phoneNumberWithPlus);
      
      if (parsedNumber) {
        const formattedData = formatPhoneNumber(phoneNumberWithPlus);
        const e164Number = parsedNumber.format('E.164');
        
        setPhoneData({
          number: e164Number, // Store the E.164 format directly
          country: parsedNumber.country,
          countryCode: parsedNumber.countryCallingCode,
          formattedNumber: e164Number, // Store E.164 format here too
          isValid: parsedNumber.isValid(),
          type: parsedNumber.getType(),
          nationalFormat: formattedData.national,
          internationalFormat: formattedData.international
        });

        // Update form values with the new phone_numbers array format
        setValue('phone_numbers', [{
          country: parsedNumber.country,
          number: e164Number // Use E.164 format
        }]);
        trigger(['phone_numbers']);
      }
    } catch (error) {
      console.error('Phone parsing error:', error);
      setPhoneData(prev => ({
        ...prev,
        number: value,
        isValid: false
      }));
    }
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setApiError(null);

    try {
      // Validate phone number
      if (!phoneData.number || !phoneData.isValid) {
        toast.error("Please enter a valid phone number");
        return;
      }

      // Format phone number for API using E.164 format
      const formattedPhoneNumber = {
        country: phoneData.country,
        number: phoneData.number // Already in E.164 format from handlePhoneChange
      };

      // Prepare the request data with all required fields and their defaults
      const requestData = {
        full_name: data.full_name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone_numbers: [formattedPhoneNumber], // Ensure this is an array with at least one number
        agree_terms: data.agree_terms,
        role: ['student'],
        assign_department: [],
        permissions: [],
        status: "Active",
        meta: {
          gender: "Male",
          upload_resume: []
        },
        admin_role: "admin"
      };

      // Add optional fields only if they have values
      if (data.role_description?.trim()) {
        requestData.role_description = data.role_description.trim();
      }
      
      if (data.age?.trim()) {
        requestData.age = data.age.trim();
      }

      if (data.facebook_link?.trim()) {
        requestData.facebook_link = data.facebook_link.trim();
      }

      if (data.instagram_link?.trim()) {
        requestData.instagram_link = data.instagram_link.trim();
      }

      if (data.linkedin_link?.trim()) {
        requestData.linkedin_link = data.linkedin_link.trim();
      }

      if (data.user_image?.trim()) {
        requestData.user_image = data.user_image.trim();
      }

      if (data.company_type) {
        requestData.company_type = data.company_type;
      }

      if (data.company_website?.trim()) {
        requestData.company_website = data.company_website.trim();
      }

      if (data.corporate_id?.trim()) {
        requestData.corporate_id = data.corporate_id.trim();
      }

      // Handle meta object
      if (data.meta) {
        requestData.meta = {
          gender: data.meta.gender || "Male",
          upload_resume: data.meta.upload_resume || [],
          ...(data.meta.course_name?.trim() && { course_name: data.meta.course_name.trim() }),
          ...(data.meta.age?.trim() && { age: data.meta.age.trim() }),
          ...(data.meta.category?.trim() && { category: data.meta.category.trim() })
        };
      }

      // Log the request data for debugging
      console.log('Request Data:', JSON.stringify(requestData, null, 2));

      // Make the API call
      const response = await postQuery({
        url: apiUrls?.user?.register,
        postData: requestData,
        onSuccess: (response) => {
          console.log('Registration Success:', response); // Add success logging
          setRecaptchaError(false);
          setRecaptchaValue(null);
          setRegistrationSuccess(true);
          
          toast.success("Registration successful! Please check your email for login credentials.");
          
          // Reset form
          reset();
          
          // Delay redirect slightly to show success message
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onFail: (error) => {
          console.error("Registration Error:", error);
          console.log('Error Response:', error?.response?.data); // Detailed error logging
          setRegistrationSuccess(false);

          // Handle specific error cases
          const errorResponse = error?.response?.data;
          const errorMessage = errorResponse?.message || errorResponse?.error;

          if (typeof errorMessage === 'string') {
            if (errorMessage.includes('already exists')) {
              toast.error("This email is already registered. Please try logging in instead.");
            } else if (errorMessage.toLowerCase().includes('validation')) {
              toast.error("Please check your input and try again.");
            } else if (errorMessage.toLowerCase().includes('phone')) {
              toast.error("Please enter a valid phone number in international format (E.164).");
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
          
          if (errorMessage?.toLowerCase().includes('recaptcha')) {
            setRecaptchaValue(null);
          }
        },
      });
    } catch (error) {
      console.error("Registration Error:", error);
      setApiError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please check your connection and try again.");
      setRegistrationSuccess(false);
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

        /* Disable scrolling completely */
        html, body {
          overflow: hidden;
          height: 100%;
          position: fixed;
          width: 100%;
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
          @apply w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-16;
          font-size: 14px;
          letter-spacing: 0.025em;
        }
        
        .dark .phone-input-container .react-tel-input .form-control {
          background-color: rgba(31, 41, 55, 0.3);
          border-color: rgba(55, 65, 81, 0.5);
          color: #f9fafb;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown {
          @apply bg-transparent border-0 rounded-l-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors;
          min-width: 52px;
        }
        
        .dark .phone-input-container .react-tel-input .flag-dropdown {
          background-color: transparent;
          border: none;
        }
        
        .phone-input-container .react-tel-input .selected-flag {
          @apply bg-transparent rounded-l-xl pl-3 hover:bg-transparent;
          width: 52px;
        }

        .phone-input-container .react-tel-input .country-list {
          @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1;
          max-height: 260px;
          width: 300px;
        }

        .phone-input-container .react-tel-input .country-list .search {
          @apply bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-t-lg;
          padding: 10px;
          margin: 0;
        }

        .phone-input-container .react-tel-input .country-list .search-box {
          @apply w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm;
          padding-left: 30px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 8px center;
          background-size: 16px;
        }

        .phone-input-container .react-tel-input .country-list .country {
          @apply px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phone-input-container .react-tel-input .country-list .country.highlight {
          @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
        }

        .phone-input-container .react-tel-input .country-list .country-name {
          @apply text-sm text-gray-900 dark:text-gray-100;
          margin-right: 6px;
        }

        .phone-input-container .react-tel-input .country-list .dial-code {
          @apply text-sm text-gray-500 dark:text-gray-400;
        }

        .phone-input-container .react-tel-input .special-label {
          @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded absolute -top-2 left-2 z-10;
          display: none;
        }

        /* Phone input custom styles */
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus {
          background-color: transparent !important;
        }

        .react-tel-input .country-list {
          margin: 0;
          padding: 0;
          border-radius: 0.5rem;
        }

        .react-tel-input .country-list .country {
          padding: 0.5rem 0.75rem;
        }

        .react-tel-input .country-list .country:hover {
          background-color: rgba(var(--primary-500), 0.1);
        }

        .react-tel-input .country-list .country.highlight {
          background-color: rgba(var(--primary-500), 0.1);
        }

        .dark .react-tel-input .country-list {
          background-color: #1f2937;
          border-color: #374151;
        }

        .dark .react-tel-input .country-list .country.highlight {
          background-color: rgba(var(--primary-500), 0.2);
        }

        .dark .react-tel-input .country-list .country:hover {
          background-color: rgba(var(--primary-500), 0.2);
        }

        .dark .react-tel-input .country-list .country {
          color: #e5e7eb;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl hidden sm:block"></div>

          {/* Card container with glass morphism effect */}
          <div className="signup-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 flex flex-row">
            {/* Left side - Image */}
            <div className="hidden md:flex md:w-5/12 items-center justify-center p-8 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-l-3xl">
              <div className="relative w-full max-w-md transform transition-all duration-700 group hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image
                  src={SignIn}
                  alt="Sign up illustration"
                  className="w-full h-auto object-contain relative z-10 dark:filter dark:brightness-90"
                  priority
                />
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-7/12 p-6 sm:p-8">
              {/* Logo and Header */}
              <div className="text-center mb-6">
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
                  Create Your Account
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Join our learning community today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <div className="relative">
                    <input
                      {...register("full_name")}
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-start">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.full_name?.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-start">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.email?.message}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="phone-field-container">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneInput
                      country={'in'}
                      value={phoneData.number}
                      onChange={(value, country) => handlePhoneChange(value, country)}
                      enableSearch={true}
                      searchPlaceholder="Search countries..."
                      searchNotFound="No country found"
                      inputProps={{
                        name: 'phone_numbers',
                        required: true,
                        className: `
                          w-full pl-[4.5rem] pr-4 py-2.5 
                          bg-gray-50/50 dark:bg-gray-700/30 
                          border border-gray-200 dark:border-gray-600 
                          rounded-xl text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                          disabled:bg-gray-100 disabled:cursor-not-allowed
                          transition duration-150 ease-in-out
                          text-sm
                        `
                      }}
                      containerClass="phone-input-container"
                      buttonClass={`
                        absolute left-0 top-0 bottom-0 px-3
                        flex items-center justify-center
                        border-r border-gray-200 dark:border-gray-600
                        bg-transparent
                        rounded-l-xl
                        transition duration-150 ease-in-out
                        hover:bg-gray-50 dark:hover:bg-gray-700/30
                      `}
                      dropdownClass={`
                        country-dropdown
                        absolute z-50 mt-1
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        rounded-lg shadow-lg
                        overflow-hidden
                      `}
                      searchClass={`
                        search-box
                        w-full px-3 py-2
                        bg-gray-50 dark:bg-gray-700
                        border-b border-gray-200 dark:border-gray-600
                        text-gray-900 dark:text-gray-100
                        focus:outline-none
                      `}
                    />

                    {/* Formatted number display */}
                    {phoneData.isValid && (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {phoneData.nationalFormat}
                        </p>
                      </div>
                    )}

                    {/* Error message */}
                    {errors.phone_numbers && (
                      <p className="mt-1 text-xs text-red-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5" />
                        <span>{errors.phone_numbers?.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span>{errors.password?.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="relative">
                      <input
                        {...register("confirm_password")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 outline-none pl-11 pr-11"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span>{errors.confirm_password?.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Custom ReCAPTCHA */}
                <div>
                  <CustomReCaptcha
                    onChange={handleRecaptchaChange}
                    error={!!errors.recaptcha || recaptchaError}
                  />
                </div>

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      {...register("agree_terms")}
                      className="mt-1 h-4 w-4 rounded-md text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      I accept the{" "}
                      <a href="/terms-and-services" className="text-primary-600 hover:text-primary-500">
                        terms of use
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" className="text-primary-600 hover:text-primary-500">
                        privacy policy
                      </a>
                    </span>
                  </label>
                  {errors.agree_terms && (
                    <p className="mt-1 text-xs text-red-500 flex items-start">
                      <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{errors.agree_terms.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

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
          
          {/* Social proof */}
          <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Join thousands of students worldwide 🌎</p>
          </div>
        </div>
      </div>

      {registrationSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Registration Successful!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Please check your email for your login credentials.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
