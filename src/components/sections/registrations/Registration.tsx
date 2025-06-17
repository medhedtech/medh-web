"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FileText, CheckCircle, X, ArrowRight, Info, Loader2, Phone, Mail, User, Upload, Globe, MessageSquare, Building, Briefcase } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import CustomReCaptcha from '../../shared/ReCaptcha';
import countriesData from "@/utils/countrycode.json";
import { useTheme } from "next-themes";
import DOMPurify from 'isomorphic-dompurify';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from "framer-motion";

// Define types
interface IRegistrationProps {
  showUploadField?: boolean;
  pageTitle?: string;
}

interface IFormValues {
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  message: string;
  accept: boolean;
  resume_image?: string;
  school_institute_name?: string;
  designation?: string;
  website?: string;
}

interface ICountry {
  name: string;
  dial_code: string;
  code: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Create dynamic validation schema based on page type
const createValidationSchema = (pageTitle?: string) => {
  const baseSchema = {
    full_name: yup
      .string()
      .trim()
      .matches(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain alphabets, spaces, hyphens, and apostrophes."
      )
      .required("Full name is required"),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address")
      .required("Email address is required"),
    country: yup
      .string()
      .required("Please select your country"),
    phone_number: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d+$/, "Phone number can only contain digits")
      .test("is-valid-phone", "Phone number must be 10 digits", function (value) {
        const { country } = this.parent;
        if (!value || !country) return false;

        // Remove any non-digit characters
        const cleanNumber = value.replace(/\D/g, '');
        
        // Ensure the phone number has exactly 10 digits
        if (cleanNumber.length !== 10) {
          return this.createError({
            message: "Phone number must be exactly 10 digits"
          });
        }

        // Validate full phone number with country code
        const selectedCountry = countriesData.find((c) => c.name === country) as ICountry;
        if (!selectedCountry) return false;

        const phoneWithCountryCode = selectedCountry.dial_code + cleanNumber;
        const phoneRegex = /^\+[1-9]\d{1,14}$/;

        return phoneRegex.test(phoneWithCountryCode);
      }),
    message: yup
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .required("Please tell us about your requirements"),
    accept: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy")
      .required(),
    resume_image: yup.string(),
  };

  // Add school-specific fields if it's the join_as_school page
  if (pageTitle === "join_as_school") {
    return yup.object({
      ...baseSchema,
      school_institute_name: yup
        .string()
        .trim()
        .required("School/Institute name is required"),
      designation: yup
        .string()
        .trim()
        .required("Designation is required"),
      website: yup
        .string()
        .trim()
        .url("Please enter a valid website URL")
        .required("Website is required"),
    });
  }

  return yup.object(baseSchema);
};

// Form Input Component
const FormInput: React.FC<{
  id: string;
  type: string;
  placeholder: string;
  register?: any;
  error?: any;
  icon: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  prefix?: React.ReactNode;
}> = ({ id, type, placeholder, register, error, icon, onChange, value, prefix }) => (
  <div>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
        {React.isValidElement(icon) && React.cloneElement(icon, { 
          className: `${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`,
          size: 18 
        } as any)}
      </div>
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 z-10"
      >
        {placeholder}
      </label>
      <input
        {...(register || {})}
        id={id}
        type={type}
        placeholder=""
        onChange={onChange}
        value={value}
        className={`w-full h-[52px] pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
      />
      {prefix && (
        <span className="absolute left-10 sm:left-11 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 text-sm">
          {prefix}
        </span>
      )}
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Form Select Component
const FormSelect: React.FC<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ICountry[];
  error?: any;
  icon: React.ReactNode;
}> = ({ id, value, onChange, options, error, icon }) => (
  <div>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
        {React.isValidElement(icon) && React.cloneElement(icon, { 
          className: `${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`, 
          size: 18 
        } as any)}
      </div>
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 z-10"
      >
        Select Your Country
      </label>
      <select
        id={id}
        onChange={onChange}
        value={value}
        className={`w-full h-[52px] pl-10 sm:pl-12 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
        aria-invalid={error ? "true" : "false"}
      >
        <option value="" className="py-2">Select Your Country</option>
        {options.map((option) => (
          <option key={option.code} value={option.name} className="py-2">
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="p-1.5 bg-primary-100 dark:bg-primary-900/50 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
          <ArrowRight className="transform rotate-90 text-primary-500 dark:text-primary-400" size={16} />
        </div>
      </div>
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Phone Input Component with improved country code display
const PhoneInput: React.FC<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  countryCode: string;
}> = ({ id, value, onChange, error, countryCode }) => (
  <div>
    <div className="relative group">
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 z-10"
      >
        Mobile Number
      </label>
      <div className="flex w-full">
        <div className="flex-shrink-0 min-w-[70px] sm:min-w-[80px]">
          <div className="h-[52px] flex items-center justify-center px-2 sm:px-3 md:px-4 bg-primary-50 dark:bg-primary-900/30 border-2 border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl group-hover:border-primary-400 dark:group-hover:border-primary-500 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30 transition-all">
            <span className="text-primary-700 dark:text-primary-300 font-medium whitespace-nowrap text-sm sm:text-base">
              {countryCode}
            </span>
          </div>
        </div>
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className={`${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`} size={18} />
          </div>
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            onChange={onChange}
            value={value}
            placeholder="10-digit number"
            className={`w-full h-[52px] pl-10 pr-4 py-3 rounded-r-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-l-0 ${
              error 
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
          />
          {value && value.length > 0 && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <span className={`text-xs px-2 py-1 rounded-full ${value.length === 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                {value.length}/10
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Form Textarea Component
const FormTextarea: React.FC<{
  id: string;
  placeholder: string;
  register: any;
  error?: any;
  icon: React.ReactNode;
  value: string;
}> = ({ id, placeholder, register, error, icon, value }) => (
  <div>
    <div className="relative">
      <div className="absolute top-4 left-3 sm:left-4 pointer-events-none">
        {React.isValidElement(icon) && React.cloneElement(icon, { 
          className: `${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`, 
          size: 18 
        } as any)}
      </div>
      <textarea
        {...register}
        id={id}
        placeholder={placeholder}
        className={`w-full pl-10 sm:pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm h-32 resize-none hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
      />
      
      {/* Character Counter */}
      <div className="text-xs text-gray-400 absolute right-3 bottom-3">
        {(value?.length || 0)}/10+ characters
      </div>
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// File Upload Component
const FileUpload: React.FC<{
  register: any;
  fileName: string;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ register, fileName, handlePdfUpload }) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-500 group">
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
        <Upload className="text-primary-600 dark:text-primary-400" size={24} />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {fileName === "No file chosen" ? "Upload your document" : fileName}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PDF files only (max 5MB)
        </p>
      </div>
      <label
        htmlFor="fileInput"
        className="cursor-pointer py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
      >
        Select File
      </label>
      <input
        {...register}
        id="fileInput"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handlePdfUpload}
      />
    </div>
  </div>
);

// Success Modal Component
const SuccessModal: React.FC<{
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}> = ({ showModal, setShowModal }) => (
  <AnimatePresence>
    {showModal && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative"
        >
          {/* Close Icon */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Content */}
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <CheckCircle className="text-primary-600 dark:text-primary-400" size={40} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3" id="success-modal-title">
              Request Submitted!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Thank you for reaching out to us. Our team will review your request and contact you shortly.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
              >
                Close
              </button>
              <Link href="/courses">
                <button className="py-3 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Explore Courses
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Features Section Component
const FeaturesSection: React.FC = () => (
  <motion.div 
    variants={itemVariants}
    className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-8 lg:p-12 flex flex-col justify-center"
  >
    {/* Decorative elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
    </div>
    
    <div className="relative z-10">
      <span className="inline-block px-4 py-1.5 mb-6 bg-white/20 text-white text-sm font-medium rounded-full">
        Welcome to our community
      </span>
      
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
        CONNECT EXPLORE GROW with <span className="text-medhgreen">MEDH</span>
      </h2>
      
      <ul className="space-y-4 mb-8">
        {[
          "Industry-recognized certifications",
          "Expert instructors with real-world experience",
          "Flexible learning schedules",
          "Job placement assistance"
        ].map((feature, index) => (
          <li key={index} className="flex items-start text-white">
            <CheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-white" size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="flex flex-wrap gap-4 mt-8">
        <Link href="/courses" className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg transition-all shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:-translate-y-1">
          Explore Courses
          <ArrowRight size={18} className="ml-2" />
        </Link>
        <Link href="/about-us" className="inline-flex items-center px-6 py-3 bg-primary-700/30 hover:bg-primary-700/50 text-white font-medium rounded-lg transition-all backdrop-blur-sm">
          <Info size={18} className="mr-2" />
          Learn More
        </Link>
      </div>
    </div>
  </motion.div>
);

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mx-auto mb-8"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Registration: React.FC<IRegistrationProps> = ({ showUploadField = false, pageTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [fileName, setFileName] = useState("No file chosen");
  const [pdfBrochure, setPdfBrochure] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = theme === "dark";

  // Debounced file upload handler
  const debouncedUpload = useCallback(
    debounce(async (file: File) => {
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        setFileName("No file chosen");
        return;
      }

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result as string;
          const postData = { base64String: base64 };

          const result = await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            showToast: true,
            successMessage: "File uploaded successfully!",
            errorMessage: "Error uploading file",
          });
          
          if (result?.data) {
            setPdfBrochure(result.data?.data);
          } else {
            setFileName("No file chosen");
          }
        };
      } catch (error) {
        toast.error("Error processing file");
        setFileName("No file chosen");
      }
    }, 500),
    [postQuery]
  );

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setFormVisible(true), 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      debouncedUpload.cancel();
    };
  }, [debouncedUpload]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<IFormValues>({
    resolver: yupResolver(createValidationSchema(pageTitle)),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'India', // Set default country
      phone_number: '',
      message: '',
      accept: false,
      ...(pageTitle === "join_as_school" && {
        school_institute_name: '',
        designation: '',
        website: '',
      }),
    },
    mode: 'onChange',
  });

  // Watch form values for validation
  const watchedFields = watch();

  // Handle country change
  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setValue('country', country, { shouldValidate: true });
    // Trigger phone validation when country changes
    if (watchedFields.phone_number) {
      await trigger('phone_number');
    }
  };

  // Handle phone number input
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    // Limit to 10 digits
    value = value.slice(0, 10);
    setValue('phone_number', value, { shouldValidate: true });
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      debouncedUpload(file);
    } else {
      setFileName("No file chosen");
    }
  };

  // Sanitize form data
  const sanitizeData = (data: IFormValues) => {
    const sanitized: any = {
      ...data,
      full_name: DOMPurify.sanitize(data.full_name),
      email: DOMPurify.sanitize(data.email),
      message: DOMPurify.sanitize(data.message),
    };

    // Sanitize school-specific fields if they exist
    if (data.school_institute_name) {
      sanitized.school_institute_name = DOMPurify.sanitize(data.school_institute_name);
    }
    if (data.designation) {
      sanitized.designation = DOMPurify.sanitize(data.designation);
    }
    if (data.website) {
      sanitized.website = DOMPurify.sanitize(data.website);
    }

    return sanitized;
  };

  // Handle form submission
  const onSubmit = async (data: IFormValues) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const sanitizedData = sanitizeData(data);
      const selectedCountry = countriesData.find(
        (country) => country.name === sanitizedData.country
      ) as ICountry;

      const postData = {
        full_name: sanitizedData.full_name,
        country: sanitizedData.country,
        email: sanitizedData.email,
        phone_number: selectedCountry.dial_code + sanitizedData.phone_number,
        message: sanitizedData.message,
        accept: sanitizedData.accept,
        page_title: pageTitle,
        ...(pdfBrochure && { resume_image: pdfBrochure }),
        ...(sanitizedData.school_institute_name && { school_institute_name: sanitizedData.school_institute_name }),
        ...(sanitizedData.designation && { designation: sanitizedData.designation }),
        ...(sanitizedData.website && { website: sanitizedData.website }),
      };

      const result = await postQuery({
        url: apiUrls?.Contacts?.createContact,
        postData,
        showToast: true,
        successMessage: "Form submitted successfully!",
        errorMessage: "Error submitting form",
      });

      if (result?.data) {
        setShowModal(true);
        setRecaptchaError(false);
        setRecaptchaValue(null);
        setPdfBrochure(null);
        setFileName("No file chosen");
        reset();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not mounted yet, show loading skeleton
  if (!mounted) {
    return <LoadingSkeleton />;
  }

  // Get selected country dial code
  const selectedCountryDialCode = watchedFields.country 
    ? (countriesData.find(c => c.name === watchedFields.country) as ICountry)?.dial_code 
    : '';

  return (
    <AnimatePresence mode="wait">
      <motion.section 
        key="registration-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
      >
        <div className="container mx-auto px-4 sm:px-6 py-12 relative">
          {/* Floating background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-3xl"></div>
          </div>

          <motion.div 
            className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm transition-all relative z-10"
            variants={itemVariants}
          >
            <div className="grid md:grid-cols-2 h-full">
              {/* Left side - Feature Section */}
              <FeaturesSection />
              
              {/* Right side - Form Section */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-5 sm:p-8 lg:p-10 xl:p-12 transition-all duration-700"
              >
                <div className="mb-8 lg:mb-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                    Fill out the form below and our team will get back to you shortly.
                  </p>
                </div>
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 sm:space-y-7"
                  aria-label="Contact form"
                  noValidate
                >
                  <FormInput 
                    id="full_name"
                    type="text"
                    placeholder="Your Full Name"
                    register={register("full_name")}
                    error={errors.full_name}
                    icon={<User />}
                  />

                  <FormInput 
                    id="email"
                    type="email"
                    placeholder="Your Email Address"
                    register={register("email")}
                    error={errors.email}
                    icon={<Mail />}
                  />

                  {/* School-specific fields */}
                  {pageTitle === "join_as_school" && (
                    <>
                      <FormInput 
                        id="school_institute_name"
                        type="text"
                        placeholder="School/Institute Name"
                        register={register("school_institute_name")}
                        error={errors.school_institute_name}
                        icon={<Building />}
                      />

                      <FormInput 
                        id="designation"
                        type="text"
                        placeholder="Your Designation"
                        register={register("designation")}
                        error={errors.designation}
                        icon={<Briefcase />}
                      />

                      <FormInput 
                        id="website"
                        type="url"
                        placeholder="Website URL (e.g., https://www.example.com)"
                        register={register("website")}
                        error={errors.website}
                        icon={<Globe />}
                      />
                    </>
                  )}

                    <FormSelect 
                      id="country"
                      value={watchedFields.country}
                      onChange={handleCountryChange}
                      options={countriesData as ICountry[]}
                      error={errors.country}
                      icon={<Globe />}
                    />

                    <PhoneInput 
                      id="phone_number"
                      value={watchedFields.phone_number}
                      onChange={handlePhoneInput}
                      error={errors.phone_number}
                      countryCode={selectedCountryDialCode}
                    />

                  <FormTextarea 
                    id="message"
                    placeholder="How can we help you? Tell us about your learning goals or questions..."
                    register={register("message")}
                    error={errors.message}
                    icon={<MessageSquare />}
                    value={watchedFields.message || ''}
                  />

                  {showUploadField && (
                    <FileUpload 
                      register={register("resume_image")}
                      fileName={fileName}
                      handlePdfUpload={handlePdfUpload}
                    />
                  )}

                  <div className="flex justify-center mt-8">
                    <CustomReCaptcha
                      onChange={handleRecaptchaChange}
                      error={recaptchaError}
                    />
                  </div>
                  
                  <div className="flex items-start mt-6">
                    <div className="flex items-center h-5">
                      <input
                        {...register("accept")}
                        type="checkbox"
                        id="accept"
                        className="h-5 w-5 text-primary-600 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer hover:border-primary-400 dark:hover:border-primary-500"
                      />
                    </div>
                    <label
                      htmlFor="accept"
                      className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      I agree to the 
                      <Link href="/terms-and-services">
                        <span className="text-primary-600 dark:text-primary-400 hover:underline ml-1 font-medium">
                          Terms of Service
                        </span>
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy">
                        <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                          Privacy Policy
                        </span>
                      </Link>
                    </label>
                  </div>
                  {errors.accept && (
                    <div className="ml-8">
                      <span className="text-red-500 text-sm flex items-center">
                        <Info size={14} className="mr-1.5 flex-shrink-0" />
                        {errors.accept.message}
                      </span>
                    </div>
                  )}

                  <motion.div 
                    className="pt-4"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      className={`w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${
                        (!isDirty || !isValid) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={loading || isSubmitting || (!isDirty || !isValid)}
                    >
                      {(loading || isSubmitting) ? (
                        <motion.div
                          className="flex items-center"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Processing...
                        </motion.div>
                      ) : (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center"
                        >
                          Submit Request
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.span>
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Success Modal */}
      <SuccessModal key="success-modal" showModal={showModal} setShowModal={setShowModal} />
    </AnimatePresence>
  );
};

export default Registration;