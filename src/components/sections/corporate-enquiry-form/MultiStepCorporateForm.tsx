"use client";
/**
 * Multi-Step Corporate Training Inquiry Form
 * 
 * This component implements a 3-step corporate training inquiry form with full integration
 * to the Universal Form Model backend system. Features step-by-step user guidance,
 * progressive validation, and enhanced user experience.
 * 
 * FORM STRUCTURE:
 * ==============
 * Step 1: Contact Info (full_name, email, country, phone_number)
 * Step 2: Organization Details (designation, company_name, company_website)
 * Step 3: Training Requirements (training_requirements, terms_accepted)
 * 
 * @author MEDH Development Team
 * @version 3.0.0 (Multi-Step Form)
 * @since 2024-01-15
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { apiClient } from "@/apis/apiClient";

// Icons
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Globe,
  MessageSquare,
  Send,
  MapPin,
  Award,
  Check,
  AlertCircle
} from "lucide-react";

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
// Remove static import and hardcoded options:
// import countriesData from "@/utils/countrycode.json";
// const countryOptions: CountryOption[] = [...];
import * as countryCodesList from 'country-codes-list';

// Phone Number Component
import PhoneNumberInput, { CountryOption } from '../../shared/login/PhoneNumberInput';

// Local Yup schema for phone number validation
const phoneNumberYupSchema = yup.object({
  country: yup.string().required('Country code is required'),
  number: yup.string()
    .matches(/^[0-9]+$/, 'Phone number must consist of digits only')
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .required('Phone number is required'),
});

// Add countriesData generation (place near top of component or file):
// const countriesData = React.useMemo(() => {
//   const allCountries = countryCodesList.all() as Record<string, any>;
//   const countryList = countryCodesList.customList('countryCode', '{countryNameEn}') as Record<string, string>;
//   return Object.entries(countryList).map(([code, name]: [string, string]) => {
//     const rawDialCode = allCountries[code]?.countryCallingCode;
//     const dial_code = rawDialCode ? `+${rawDialCode}` : undefined;
//     return {
//       code: code.toLowerCase(),
//       name,
//       dial_code,
//     };
//   });
// }, []);

// Toast notifications
import { toast } from 'react-toastify';

// Modify the form data interface to use a more flexible type
interface IFormData {
  full_name: string;
  email: string;
  country: string;
  phone_number: { country: string; number: string };
  
  // Step 2: Organization Details
  designation: string;
  company_name: string;
  company_website?: string | null;
  
  // Step 3: Training Requirements
  training_requirements: string;
  terms_accepted: boolean;
}

// Form step configuration
interface IFormStep {
  stepId: string;
  title: string;
  description: string;
  fields: string[];
  isValid?: boolean;
  isCompleted?: boolean;
}

// Autocomplete suggestions
const AUTOCOMPLETE_SUGGESTIONS = {
  designation: [
    "HR Manager",
    "Learning & Development Lead", 
    "Training Coordinator",
    "Chief People Officer",
    "Operations Manager",
    "Talent Acquisition Head",
    "Head of Training",
    "L&D Manager",
    "Training Specialist",
    "Organizational Development Manager"
  ],
  company_name: [
    "Infosys",
    "Accenture", 
    "TCS",
    "Wipro",
    "HCL Technologies",
    "Tech Mahindra",
    "Cognizant",
    "IBM",
    "Microsoft",
    "Google"
  ]
};

// Form steps configuration
const FORM_STEPS: IFormStep[] = [
  {
    stepId: "contact_info",
    title: "Contact Info",
    description: "Let's get your basic details.",
    fields: ["full_name", "email", "country", "phone_number"]
  },
  {
    stepId: "organization_info", 
    title: "Organization Details",
    description: "Tell us more about your company.",
    fields: ["designation", "company_name", "company_website"]
  },
  {
    stepId: "training_needs",
    title: "Training Requirements", 
    description: "Tell us what you're looking for.",
    fields: ["training_requirements", "terms_accepted"]
  }
];

// Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'corporate_training_inquiry',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
  MIN_MESSAGE_LENGTH: 20,
  MAX_MESSAGE_LENGTH: 2000,
} as const;

// Enhanced form response interfaces to match Universal Form Model
interface IUniversalFormResponse {
  success: boolean;
  message: string;
  required_fields?: string[];
  data?: {
    form_id?: string;
    submission_date?: string;
    status?: 'submitted' | 'under_review' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  [key: string]: any; // Allow additional properties
}

// Universal Form Model Utilities
const universalFormUtils = {
  transformToUniversalFormat: (data: IFormData) => {
    const phoneNumber = `+${data.phone_number.country}${data.phone_number.number}`;
    return {
      form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
      priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
      status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
      source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
      
      contact_info: {
        full_name: data.full_name.trim(),
        email: data.email.toLowerCase().trim(),
        phone_number: phoneNumber,
        country: data.country,
      },
      
      professional_info: {
        designation: data.designation.trim(),
        company_name: data.company_name.trim(),
        company_website: data.company_website?.trim() || '',
      },
      
      message: data.training_requirements.trim(),
      
      accept: data.terms_accepted,
      terms_accepted: data.terms_accepted,
      privacy_policy_accepted: data.terms_accepted,
      
      submission_metadata: {
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        timestamp: new Date().toISOString(),
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        form_version: '3.0',
        validation_passed: true,
      }
    };
  },

  isUniversalFormResponse: (response: any): response is IUniversalFormResponse => {
    return response && 
           typeof response.success === 'boolean' && 
           typeof response.message === 'string';
  },

  extractErrorMessages: (error: any): string[] => {
    const messages: string[] = [];
    
    if (error.message) {
      messages.push(error.message);
    }
    
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((fieldError: any) => {
        if (fieldError.message) {
          messages.push(`${fieldError.field}: ${fieldError.message}`);
        }
      });
    }
    
    return messages.length > 0 ? messages : ['An unexpected error occurred. Please try again.'];
  },

  storeSubmissionDetails: (response: IUniversalFormResponse, companyName: string) => {
    if (typeof window !== 'undefined' && response.success && response.data) {
      const submissionDetails = {
        form_id: response.data.form_id,
        submission_date: response.data.submission_date,
        status: response.data.status,
        priority: response.data.priority,
        company_name: companyName,
        form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
        stored_at: new Date().toISOString(),
      };
      
      localStorage.setItem('last_corporate_inquiry', JSON.stringify(submissionDetails));
      sessionStorage.setItem('current_form_submission', JSON.stringify(submissionDetails));
    }
  },
};

// Validation schema for each step
const stepValidationSchemas = {
  contact_info: yup.object({
    full_name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain alphabets, spaces, hyphens, and apostrophes")
      .required("Full name is required"),
      
    email: yup
      .string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid business email address")
      .required("Business email is required"),
      
    country: yup
      .string()
      .required("Country is required"),
      
    phone_number: phoneNumberYupSchema,
  }),
  
  organization_info: yup.object({
    designation: yup
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation cannot exceed 100 characters")
      .required("Job designation/title is required"),
      
    company_name: yup
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(150, "Company name cannot exceed 150 characters")
      .required("Company name is required"),
      
    company_website: yup
      .string()
      .trim()
      .matches(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/,
        "Please enter a valid company website URL"
      )
      .nullable()
      .transform(value => value === '' ? null : value),
  }),
  
  training_needs: yup.object({
    training_requirements: yup
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your training requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your corporate training requirements"),
      
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy to proceed")
      .required("Acceptance of terms is required"),
  }),
};

// Complete form validation schema
const completeFormSchema = yup.object().shape({
    full_name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain alphabets, spaces, hyphens, and apostrophes")
      .required("Full name is required"),
      
    email: yup
      .string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid business email address")
      .required("Business email is required"),
      
    country: yup
      .string()
      .required("Country is required"),
      
    phone_number: phoneNumberYupSchema,
  
    designation: yup
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation cannot exceed 100 characters")
      .required("Job designation/title is required"),
      
    company_name: yup
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(150, "Company name cannot exceed 150 characters")
      .required("Company name is required"),
      
    company_website: yup
      .string()
      .trim()
      .matches(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/,
        "Please enter a valid company website URL"
      )
      .nullable()
      .transform(value => value === '' ? null : value),
  
    training_requirements: yup
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your training requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your corporate training requirements"),
      
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy to proceed")
      .required("Acceptance of terms is required"),
});

// Reusable form components
interface IFormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  suggestions?: string[];
  [key: string]: any;
}

// Enhanced Form Components with Mobile-First Design
const FormInput: React.FC<IFormInputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  suggestions, 
  onChange, 
  type, 
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(e);
    
    if (suggestions && value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const syntheticEvent = {
      target: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-3"
    >
      <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500'
          }`} />
        </div>
        <input
          type={type}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
            font-medium text-sm sm:text-base
            min-h-[44px] sm:min-h-[48px]
            ${error 
              ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
            }
            focus:outline-none
            touch-manipulation
          `}
          {...props}
        />
        
        {/* Enhanced Mobile-Friendly Autocomplete */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-20 w-full mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl shadow-xl dark:shadow-slate-900/30 max-h-48 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 sm:px-4 py-3 sm:py-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-900 dark:text-white transition-colors duration-150 first:rounded-t-lg sm:first:rounded-t-xl last:rounded-b-lg sm:last:rounded-b-xl font-medium text-sm sm:text-base min-h-[44px] flex items-center touch-manipulation"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FormTextArea: React.FC<IFormInputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  rows = 4, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-3"
    >
      <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500'
          }`} />
        </div>
        <textarea
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
            bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
            text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
            font-medium resize-none text-sm sm:text-base
            min-h-[120px] sm:min-h-[140px]
            ${error 
              ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
            }
            focus:outline-none
            touch-manipulation
          `}
          {...props}
        />
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FormCheckbox: React.FC<{
  label: React.ReactNode;
  error?: string;
  [key: string]: any;
}> = ({ label, error, ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-3"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex items-center h-6 mt-0.5">
          <input
            type="checkbox"
            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-md sm:rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-200 touch-manipulation"
            {...props}
          />
        </div>
        <div className="text-sm sm:text-base flex-1">
          <label className="font-medium text-slate-700 dark:text-slate-200 leading-relaxed cursor-pointer">
            {label}
          </label>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium ml-8 sm:ml-10"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Minimal step progress
const StepProgress: React.FC<{
  steps: IFormStep[];
  currentStep: number;
  completedSteps: Set<number>;
}> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="mb-6 md:mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={step.stepId}>
              <div className="flex flex-col items-center space-y-2">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isCurrent ? 1.05 : 1, 
                    opacity: 1
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200
                    ${isCompleted 
                      ? 'bg-green-600 dark:bg-green-500 text-white shadow-sm' 
                      : isCurrent 
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <span className="text-xs md:text-sm">{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Step Label */}
                <div className="text-center max-w-24 md:max-w-32">
                  <p className={`text-xs md:text-sm font-medium transition-colors leading-tight text-center ${
                    isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : isCompleted 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 md:mx-4">
                  <div className={`h-0.5 md:h-1 rounded-full transition-all duration-300 ${
                    completedSteps.has(index) 
                      ? 'bg-green-600 dark:bg-green-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Main Multi-Step Form Component
const MultiStepCorporateForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { postQuery, loading } = usePostQuery();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a more flexible type for useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    trigger,
    getValues,
    setError
  } = useForm<IFormData>({
    resolver: yupResolver(completeFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'in',
      phone_number: { country: 'in', number: '' },
      designation: '',
      company_name: '',
      company_website: '',
      training_requirements: '',
      terms_accepted: false
    }
  });

  // Watch form values for validation
  const watchedFields = watch();

  // Auto-save form data to localStorage
  useEffect(() => {
    if (mounted) {
      const formData = getValues();
      localStorage.setItem('corporateFormDraft', JSON.stringify({
        ...formData,
        currentStep,
        completedSteps: Array.from(completedSteps),
        timestamp: Date.now()
      }));
    }
  }, [watchedFields, currentStep, completedSteps, mounted, getValues]);

  // Load saved form data on mount
  useEffect(() => {
    if (mounted) {
      try {
        const savedData = localStorage.getItem('corporateFormDraft');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Only restore if saved within last 24 hours
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            const { currentStep: savedStep, completedSteps: savedCompleted, timestamp, ...formData } = parsed;
            reset(formData);
            setCurrentStep(savedStep || 0);
            setCompletedSteps(new Set(savedCompleted || []));
            toast.info('Previous form data restored');
          }
        }
      } catch (error) {
        console.log('Could not restore form data:', error);
      }
    }
  }, [mounted, reset]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            handleNext();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            handlePrevious();
            break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentStep]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepFields = FORM_STEPS[currentStep].fields;
    const isValid = await trigger(currentStepFields as any);
    
    // Provide validation feedback
    if (!isValid) {
      toast.error(`Please complete all required fields in ${FORM_STEPS[currentStep].title}`);
    } else {
      toast.success(`${FORM_STEPS[currentStep].title} completed successfully!`);
    }
    
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Modify the form submission to handle the phone number structure
  const onSubmit = async (data: IFormData): Promise<void> => {
    try {
      // Normalize phone number
      const phoneNumber = typeof data.phone_number === 'string' 
        ? data.phone_number 
        : `+${data.phone_number.country}${data.phone_number.number}`;

      // Validate form data before submission
      const formattedData = {
        full_name: data.full_name,
        email: data.email,
        country: data.country,
        phone_number: phoneNumber,
        designation: data.designation,
        company_name: data.company_name,
        company_website: data.company_website || null,
        training_requirements: data.training_requirements,
        terms_accepted: data.terms_accepted
      };

      // Submit form data to the corporate training API
      const apiResponse = await apiClient.post<IUniversalFormResponse>('/corporate-training', formattedData);

      // Determine success based on API response
      const isSuccessful = 
        apiResponse.status === 'success' || 
        (apiResponse.data as any)?.success === true;

      if (isSuccessful) {
        // Handle successful submission: show modal and reset form for resubmit
        toast.success(apiResponse.message || 'Corporate training inquiry submitted successfully!');
        setShowSuccessModal(true);
        // Reset form and step state
        reset();
        setCurrentStep(0);
        setCompletedSteps(new Set());
        return;
      } else {
        // Handle submission error with detailed field validation
        const response = apiResponse.data as IUniversalFormResponse;

        // If backend returned specific field errors, highlight them
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(err => {
            setError(err.field as keyof IFormData, {
              type: 'manual',
              message: err.message,
            });
          });
          toast.error(response.message || 'Validation failed');
          return;
        }

        // Fallback: handle required_fields array if present
        const requiredFields = response.required_fields || [];
        if (requiredFields.length > 0) {
          requiredFields.forEach(field => {
            setError(field as keyof IFormData, {
              type: 'manual',
              message: 'This field is required',
            });
          });
          toast.error(response.message || 'Please fill in all required fields');
        } else {
          // Generic error handling
          toast.error(response.message || apiResponse.error || 'Failed to submit corporate training inquiry');
        }
      }
    } catch (error) {
      console.error('Corporate Training Form Submission Error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const countriesData = React.useMemo(() => {
    const allCountries = countryCodesList.all() as Record<string, any>;
    const countryList = countryCodesList.customList('countryCode', '{countryNameEn}') as Record<string, string>;
    return Object.entries(countryList).map(([code, name]: [string, string]) => {
      const rawDialCode = allCountries[code]?.countryCallingCode;
      const dial_code = rawDialCode ? `+${rawDialCode}` : undefined;
      return {
        code: code.toLowerCase(),
        name,
        dial_code,
      };
    });
  }, []);

  const renderStep = () => {
    const step = FORM_STEPS[currentStep];
    
    switch (step.stepId) {
      case 'contact_info':
        return (
          <div className="space-y-6">
            <FormInput
              label="Your Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Priya Verma"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            
            <FormInput
              label="Work Email"
              icon={Mail}
              type="email"
              placeholder="e.g., priya@yourcompany.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Country
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors shrink-0 inline-block align-middle" />
                  </div>
                  <select
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                    {...register("country")}
                  >
                    {countriesData.map((country: any) => (
                      <option key={country.code} value={country.code.toLowerCase()}>
                        {country.name}{country.dial_code ? ` (${country.dial_code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                )}
              </div>

              <Controller
                name="phone_number"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      value={{ 
                        country: watchedFields.country || 'in', 
                        number: typeof field.value === 'string' ? field.value : field.value.number || '' 
                      }}
                      onChange={val => field.onChange(val)}
                      placeholder="Enter your phone number"
                      error={fieldState.error?.message}
                      fixedCountry={watchedFields.country}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Country code is set based on your selected location.
                    </p>
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 'organization_info':
        return (
          <div className="space-y-6">
            <FormInput
              label="Your Designation"
              icon={Briefcase}
              type="text"
              placeholder="e.g., Talent Acquisition Head"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.designation}
              error={errors.designation?.message}
              {...register("designation")}
            />
            
            <FormInput
              label="Company Name"
              icon={Building2}
              type="text"
              placeholder="e.g., Infosys, Accenture, TCS"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.company_name}
              error={errors.company_name?.message}
              {...register("company_name")}
            />

            <FormInput
              label="Company Website (optional)"
              icon={Globe}
              type="url"
              placeholder="https://www.yourcompany.com"
              error={errors.company_website?.message}
              {...register("company_website")}
            />
          </div>
        );

      case 'training_needs':
        return (
          <div className="space-y-6">
            <FormTextArea
              label="Training Needs"
              icon={MessageSquare}
              placeholder="e.g., We need a 3-week online program on communication skills for 50 managers."
              rows={6}
              error={errors.training_requirements?.message}
              {...register("training_requirements")}
            />
            <p className="text-xs text-slate-500 -mt-4">
              Include skills, timeline, format (online/onsite), team size, and goals.
            </p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
              <FormCheckbox
                label={
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms-and-services">
                      <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                        Terms of Use
                      </span>
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy">
                      <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                        Privacy Policy
                      </span>
                    </Link>
                    .
                  </span>
                }
                error={errors.terms_accepted?.message}
                {...register("terms_accepted")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern matching corporateFaq.tsx */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements matching corporateFaq.tsx */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-8">
        
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 overflow-hidden"
        >
          {/* Enhanced Mobile-First Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight"
            >
            Corporate Training Inquiry
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
            >
            Let us help your team grow. Share your training requirements, and we'll tailor a solution for your organization.
            </motion.p>
      </div>

          {/* Enhanced Mobile-First Form Content */}
          <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="w-full">
          <StepProgress 
            steps={FORM_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 md:mt-10">
                {/* Enhanced Mobile-First Step Content Card */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
                  className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
            >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
                  
                  {/* Enhanced Mobile-First Step Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-slate-600/60"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-base sm:text-lg shadow-lg">
                        {currentStep + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  {FORM_STEPS[currentStep]?.title}
                </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {FORM_STEPS[currentStep]?.description}
                        </p>
                      </div>
                    </div>
              </motion.div>

              {/* Step Content */}
                  <div className="relative z-10">
              {renderStep()}
                  </div>
            </motion.div>
          </form>
        </div>
      </div>

          {/* Enhanced Mobile-First Navigation Footer */}
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-600/50 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            <div className="flex justify-between items-center gap-3">
          <motion.button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            suppressHydrationWarning
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 min-h-[44px] touch-manipulation ${
              currentStep === 0
                    ? 'bg-slate-100/60 text-slate-400 cursor-not-allowed dark:bg-slate-700/60 dark:text-slate-500'
                    : 'bg-slate-100/80 text-slate-700 dark:bg-slate-700/80 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 shadow-lg hover:shadow-xl'
            }`}
          >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base hidden xs:inline">Previous</span>
          </motion.button>

          {currentStep === FORM_STEPS.length - 1 ? (
            <motion.button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              suppressHydrationWarning
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation text-sm sm:text-base ${
                loading 
                      ? 'bg-slate-200/60 text-slate-500 cursor-not-allowed dark:bg-slate-700/60 dark:text-slate-400' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
              }`}
            >
              {loading ? (
                <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden xs:inline">Processing...</span>
                      <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">Submit Inquiry</span>
                      <span className="xs:hidden">Submit</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleNext}
              suppressHydrationWarning
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 min-h-[44px] touch-manipulation text-sm sm:text-base"
                >
                  <span className="hidden xs:inline">Next Step</span>
                  <span className="xs:hidden">Next</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          )}
        </div>
      </div>
        </motion.div>

      {/* Enhanced Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="text-white" size={40} />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  Request Submitted!
                </h2>
              </div>

              {/* Success Content */}
              <div className="p-8 text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Thank you for your interest! Our partnerships team will review your requirements and contact you within 24 hours.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Request received and being processed</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>You'll receive a confirmation email shortly</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setShowSuccessModal(false)}
                  suppressHydrationWarning
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  Continue Browsing
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
};

// Corporate Training CTA Component - Direct Form
const CorporateTrainingCTA: React.FC<{
  mainText?: string;
  subText?: string;
}> = ({ mainText, subText }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-96 w-full animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <MultiStepCorporateForm 
        isOpen={true}
        onClose={() => {}}
      />
    </section>
  );
};

export default CorporateTrainingCTA; 