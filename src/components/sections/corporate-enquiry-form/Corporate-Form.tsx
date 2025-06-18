"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useForm, FieldError } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import CustomReCaptcha from '../../shared/ReCaptcha';

// Icons
import { 
  FileText, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Info, 
  Loader2, 
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Globe,
  MessageSquare,
  Send,
  ExternalLink,
  Award
} from "lucide-react";

// Images
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import countriesData from "@/utils/countrycode.json";

interface ICountry {
  name: string;
  dial_code: string;
  code: string;
}

interface IFormData {
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  designation: string;
  company_name: string;
  company_website: string;
  message: string;
  accept: boolean;
}

interface IFormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  [key: string]: any;
}

interface IFormTextAreaProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  rows?: number;
  [key: string]: any;
}

interface IFormSelectProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  options: { value: string; label: string }[];
  [key: string]: any;
}

interface IFormToggleProps {
  label: React.ReactNode;
  description?: string;
  error?: string;
  [key: string]: any;
}

interface ICorporateJourneyFormProps {
  mainText?: string;
  subText?: string;
}

// Validation schema using yup
const schema = yup.object({
  full_name: yup
    .string()
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain alphabets, spaces, hyphens, and apostrophes."
    )
    .required("Name is required."),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address."
    )
    .required("Email is required."),
  country: yup.string().required("Country is required"),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      const { country } = this.parent;

      if (!value || !country) return false;

      // Remove any non-digit characters
      const cleanNumber = value.replace(/\D/g, '');
      
      // For India, enforce exactly 10 digits
      if (country === 'India') {
        if (cleanNumber.length !== 10) {
          return this.createError({
            message: "Phone number must be exactly 10 digits for India"
          });
        }
        // Additional validation for Indian mobile numbers (should start with 6, 7, 8, or 9)
        if (!/^[6-9]/.test(cleanNumber)) {
          return this.createError({
            message: "Indian mobile numbers must start with 6, 7, 8, or 9"
          });
        }
        return true;
      }
      
      // For other countries, ensure minimum 10 digits
      if (cleanNumber.length < 10) {
        return this.createError({
          message: "Phone number must be at least 10 digits"
        });
      }

      const selectedCountry = (countriesData as ICountry[]).find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + cleanNumber;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;

      return phoneRegex.test(phoneWithCountryCode);
    }),
  designation: yup.string().required("Designation is required"),
  company_name: yup.string().required("Company name is required"),
  company_website: yup
    .string()
    .matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*$/,
      "Invalid website URL"
    )
    .required("Website is required"),
  message: yup.string().required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

// Reusable form components based on PlacementForm.tsx
const FormInput: React.FC<IFormInputProps> = ({ label, icon: Icon, error, onChange, type, ...props }) => {
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      let value = e.target.value;
      // Remove any non-digit characters
      value = value.replace(/\D/g, '');
      
      // For India, limit to exactly 10 digits
      if (props.country === 'India') {
        value = value.slice(0, 10);
      } else {
        // For other countries, allow up to 15 digits (international standard)
        value = value.slice(0, 15);
      }
      
      // Create new event with cleaned value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: value
        }
      };
      
      if (onChange) onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
    } else {
      if (onChange) onChange(e);
    }
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input
          type={type}
          onChange={handlePhoneInput}
          placeholder={type === 'tel' && props.country === 'India' ? '10-digit number' : props.placeholder}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
          {...props}
        />
        {type === 'tel' && props.value && props.value.length > 0 && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {props.country === 'India' ? (
              <span className={`text-xs px-2 py-1 rounded-full ${props.value.length === 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                {props.value.length}/10
              </span>
            ) : (
              <span className={`text-xs px-2 py-1 rounded-full ${props.value.length >= 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                {props.value.length} digits
              </span>
            )}
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormTextArea: React.FC<IFormTextAreaProps> = ({ label, icon: Icon, error, rows = 4, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute top-3 left-3 pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <textarea
        rows={rows}
        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none`}
        {...props}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const FormSelect: React.FC<IFormSelectProps> = ({ label, icon: Icon, error, options, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <select
        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const FormToggle: React.FC<IFormToggleProps> = ({ label, description, error, ...props }) => {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex items-center h-4">
          <input
            type="checkbox"
            className="w-3 h-3 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...props}
          />
        </div>
        <div className="ml-2 text-xs">
          <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>
          {description && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Corporate Training CTA Component
const CorporateTrainingCTA: React.FC<ICorporateJourneyFormProps> = ({ mainText, subText }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="bg-register bg-cover bg-center bg-no-repeat">
        <div className="overlay bg-gradient-to-br from-gray-800 to-gray-900 py-8 lg:py-16 relative z-0 overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 lg:pr-8">
                <div className="relative lg:my-12 h-40"></div>
              </div>
              <div className="lg:col-span-6 relative z-10">
                <div className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 bg-primary-100/20 text-primary-300 text-sm font-medium rounded-full">
              Corporate Training Solutions
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {mainText || "Transform Your Corporate Learning Journey"}
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {subText || "Elevate your team's skills with our comprehensive corporate training solutions tailored to your organization's needs"}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: <CheckCircle className="w-6 h-6" />, title: "Tailored Training Programs", desc: "Customized curricula designed for your industry" },
                { icon: <User className="w-6 h-6" />, title: "Expert Corporate Trainers", desc: "Industry leaders with proven track records" },
                { icon: <Award className="w-6 h-6" />, title: "Measurable Results", desc: "ROI-focused training with performance metrics" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <div className="text-primary-400 mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={() => setIsFormOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <Send className="w-5 h-5 mr-2" />
                Request Corporate Training
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              
              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Training Programs
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Full Screen Corporate Training Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <CorporateTrainingForm 
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Full Screen Corporate Training Form Component
const CorporateTrainingForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'India', // Set India as default
      phone_number: '',
      designation: '',
      company_name: '',
      company_website: '',
      message: '',
      accept: false
    }
  });

  // Watch form values
  const watchedFields = watch();

  const handleRecaptchaChange = (value: string | null): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const onSubmit = async (data: IFormData): Promise<void> => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    try {
      const selectedCountry = (countriesData as ICountry[]).find(
        (country) => country.name === data.country
      );
      await postQuery({
        url: apiUrls?.CorporateTraining?.addCorporate,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: selectedCountry?.dial_code + data?.phone_number,
          company_name: data?.company_name,
          designation: data?.designation,
          company_website: data?.company_website,
          message: data?.message,
          accept: data?.accept,
        },
        onSuccess: () => {
          setShowModal(true);
          setRecaptchaError(false);
          setRecaptchaValue(null);
          reset();
        },
        onFail: () => {
          console.error("Error submitting form.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full bg-white dark:bg-gray-800 overflow-hidden flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-primary-600/90 to-primary-500/90 p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Corporate Training Inquiry</h2>
            <p className="text-white/80 text-sm mt-1">Tell us about your corporate training needs</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-950">
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-8 h-full">
            {/* Clean Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Corporate Training Inquiry
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Tell us about your corporate training needs
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Personal Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Your Name"
                    icon={User}
                    type="text"
                    placeholder="Enter your full name"
                    error={errors.full_name?.message}
                    {...register("full_name")}
                  />
                  
                  <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    placeholder="Enter your email address"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <FormSelect
                    label="Country"
                    icon={Globe}
                    error={errors.country?.message}
                    options={[
                      { value: "", label: "Select your country" },
                      ...(countriesData as ICountry[]).map(country => ({
                        value: country.name,
                        label: `${country.name} (${country.dial_code})`
                      }))
                    ]}
                    {...register("country")}
                  />
                  
                  <FormInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    placeholder="Phone number"
                    error={errors.phone_number?.message}
                    country={watchedFields.country}
                    value={watchedFields.phone_number}
                    {...register("phone_number")}
                  />
                </div>
              </div>

              {/* Company Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Company Information</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Designation"
                    icon={Briefcase}
                    type="text"
                    placeholder="Your job title"
                    error={errors.designation?.message}
                    {...register("designation")}
                  />
                  
                  <FormInput
                    label="Company Name"
                    icon={Building2}
                    type="text"
                    placeholder="Your company"
                    error={errors.company_name?.message}
                    {...register("company_name")}
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      label="Company Website"
                      icon={Globe}
                      type="text"
                      placeholder="https://www.yourcompany.com"
                      error={errors.company_website?.message}
                      {...register("company_website")}
                    />
                  </div>
                </div>
              </div>

              {/* Training Requirements Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Training Requirements</h3>
                  </div>
                </div>
                
                <FormTextArea
                  label="Your Message"
                  icon={MessageSquare}
                  placeholder="Tell us about your training needs, team size, preferred timeline, and specific skills you want to develop"
                  rows={6}
                  error={errors.message?.message}
                  {...register("message")}
                />
              </div>

              {/* Verification Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    {mounted && (
                      <CustomReCaptcha
                        onChange={handleRecaptchaChange}
                        error={recaptchaError}
                      />
                    )}
                  </div>
                  {recaptchaError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      Please complete the reCAPTCHA
                    </motion.p>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <FormToggle
                      label={
                        <span className="text-sm">
                          By submitting this form, I accept{" "}
                          <Link href="/terms-and-services">
                            <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                              Terms of Service
                            </span>
                          </Link>{" "}
                          &{" "}
                          <Link href="/privacy-policy">
                            <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                              Privacy Policy
                            </span>
                          </Link>
                        </span>
                      }
                      error={errors.accept?.message}
                      {...register("accept")}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex justify-center items-center p-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-10 shadow-lg">
          <div className="flex gap-6">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <X className="w-5 h-5" />
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                loading || !isDirty 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Submit Inquiry
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 md:p-8 relative`}
            >
              <button
                onClick={() => setShowModal(false)}
                className={`absolute top-4 right-4 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center py-4">
                <div className={`w-16 h-16 ${
                  isDarkMode 
                    ? 'bg-green-900/30' 
                    : 'bg-green-100'
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <CheckCircle className={`${
                    isDarkMode ? 'text-green-400' : 'text-green-500'
                  }`} size={32} />
                </div>
                
                <h2 className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-2`}>
                  Success!
                </h2>
                
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } mb-6`}>
                  Your corporate training inquiry has been submitted successfully! We'll get back to you shortly.
                </p>
                
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CorporateTrainingCTA; 