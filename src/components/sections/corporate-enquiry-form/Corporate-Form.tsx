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
  Send
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
  country: string | null;
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
  country: yup.string().nullable(),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      const { country } = this.parent;

      if (!value || !country) return false;

      const isValidLength = /^\d{10}$/.test(value);
      if (!isValidLength) return false;

      const selectedCountry = (countriesData as ICountry[]).find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + value;
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
const FormInput: React.FC<IFormInputProps> = ({ label, icon: Icon, error, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <input
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
        {...props}
      />
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
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
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
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
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
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
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

const CorporateJourneyForm: React.FC<ICorporateJourneyFormProps> = ({ mainText, subText }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setFormVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      country: (countriesData as ICountry[])[0]?.name || '',
      phone_number: '',
      designation: '',
      company_name: '',
      company_website: '',
      message: '',
      accept: false
    }
  });

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

  // If not mounted yet, prevent theme-specific UI flash
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
      <section
        id="enroll-form"
        className="bg-register bg-cover bg-center bg-no-repeat"
      >
        <div className="overlay bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 py-8 lg:py-16 relative z-0 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
          
          <div>
            <Image
              className="absolute top-40 left-0 lg:left-[8%] 2xl:top-20 animate-move-hor block z-0 opacity-70"
              src={registrationImage1}
              alt="Decorative element"
            />
            <Image
              className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z-0 opacity-70"
              src={registrationImage2}
              alt="Decorative element"
            />
            <Image
              className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z-0 opacity-70"
              src={registrationImage3}
              alt="Decorative element"
            />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div
                className="lg:col-span-6 lg:pr-8"
                data-aos="fade-up"
              >
                <div className="relative lg:my-12">
                  <span className="inline-block px-4 py-1.5 mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                    Corporate Training Inquiry
                  </span>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {mainText || "Transform Your Corporate Learning Journey"}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                    <div>
                      <p className="text-lg md:text-xl font-medium text-gray-200">
                        {subText || "Elevate your team's skills with our comprehensive corporate training solutions"}
                      </p>
                      <div className="flex items-center mt-3 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-primary-400 mr-2" />
                        <span>Tailored Training Programs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form Section */}
              <div className={`lg:col-span-6 relative z-10 transition-all duration-700 transform ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6">
                    <h3 className="text-2xl text-white text-center font-semibold">
                      Corporate Training Inquiry
                    </h3>
                  </div>
                  
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 md:p-8 space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Info */}
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
                    </div>
                    
                    {/* Phone and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormSelect
                        label="Country"
                        icon={Globe}
                        error={errors.country?.message}
                        options={(countriesData as ICountry[]).map(country => ({
                          value: country.name,
                          label: `${country.name} (${country.dial_code})`
                        }))}
                        {...register("country")}
                      />
                      
                      <FormInput
                        label="Phone Number"
                        icon={Phone}
                        type="tel"
                        placeholder="10-digit number"
                        error={errors.phone_number?.message}
                        {...register("phone_number")}
                      />
                    </div>
                    
                    {/* Company Info */}
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
                    </div>
                    
                    <FormInput
                      label="Company Website"
                      icon={Globe}
                      type="text"
                      placeholder="https://www.yourcompany.com"
                      error={errors.company_website?.message}
                      {...register("company_website")}
                    />
                    
                    <FormTextArea
                      label="Your Message"
                      icon={MessageSquare}
                      placeholder="Tell us about your training needs"
                      rows={4}
                      error={errors.message?.message}
                      {...register("message")}
                    />
                    
                    {/* ReCAPTCHA */}
                    <div className="flex justify-center">
                      {mounted && (
                        <CustomReCaptcha
                          onChange={handleRecaptchaChange}
                          error={recaptchaError}
                        />
                      )}
                      {recaptchaError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          Please complete the reCAPTCHA
                        </motion.p>
                      )}
                    </div>
                    
                    {/* Terms and Conditions */}
                    <FormToggle
                      label={
                        <span>
                          By submitting this form, I accept
                          <Link href="/terms-and-services">
                            <span className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
                              Terms of Service
                            </span>
                          </Link>{" "}
                          &{" "}
                          <Link href="/privacy-policy">
                            <span className="text-primary-600 dark:text-primary-400 hover:underline">
                              Privacy Policy
                            </span>
                          </Link>
                        </span>
                      }
                      error={errors.accept?.message}
                      {...register("accept")}
                    />

                    {/* Submit Button */}
                    <div className="pt-3">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium 
                          ${loading || !isDirty 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'} 
                          transition-all`}
                        disabled={loading || !isDirty}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Inquiry
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
              {/* Close Icon */}
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

              {/* Modal Content */}
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
    </>
  );
};

export default CorporateJourneyForm; 