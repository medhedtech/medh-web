"use client";
/**
 * Multi-Step School Partnership Form
 * 
 * This component implements a comprehensive 3-step school partnership application form
 * with full integration to the Universal Form Model backend system.
 * 
 * FORM STRUCTURE:
 * ==============
 * Step 1: Contact Person Details (full_name, designation, email, phone_number)
 * Step 2: School Information (school_name, school_type, location, student_count, website)
 * Step 3: Partnership Intent & Notes (partnership_services, additional_notes, terms_accepted)
 * 
 * @author MEDH Development Team
 * @version 1.0.0 (School Partnership Form)
 * @since 2024-01-15
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";
import { useForm, Controller, SubmitHandler } from "react-hook-form"; // Add SubmitHandler
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Icons
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  User,
  School,
  Phone,
  Mail,
  MapPin,
  Users,
  Globe,
  Briefcase,
  MessageSquare,
  Send,
  Award,
  Check,
  AlertCircle,
  Loader2,
  Building2,
  GraduationCap,
  Home
} from 'lucide-react';

// Hooks and Utilities
import { toast } from 'react-toastify';
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';
import { submitSchoolPartnershipForm, ISchoolPartnershipFormData } from '@/apis/schoolForm.api';

// Form data structure
interface ISchoolFormData {
  full_name: string;
  designation: string;
  email: string;
  country: string;
  phone_number: string;
  school_name: string;
  school_type: string;
  city_state: string;
  student_count: string;
  website?: string | null; // Mark as optional and allow null
  partnership_services: string[];
  additional_notes?: string; // Mark as optional
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  message: string;
}

// Form step configuration
interface IFormStep {
  stepId: string;
  title: string;
  description: string;
  fields: Array<keyof ISchoolFormData>;
}

// Form steps configuration
const FORM_STEPS: IFormStep[] = [
  {
    stepId: "contact_details",
    title: "Contact Person",
    description: "Tell us about the primary contact.",
    fields: ["full_name", "designation", "email", "country", "phone_number"]
  },
  {
    stepId: "school_info", 
    title: "School Information",
    description: "Basic details about your institution.",
    fields: ["school_name", "school_type", "city_state", "student_count", "website"]
  },
  {
    stepId: "partnership_intent",
    title: "Partnership Goals",
    description: "What would you like to explore with us?",
    fields: ["partnership_services", "additional_notes", "terms_accepted", "privacy_policy_accepted", "message"]
  }
];

// Partnership service options
const PARTNERSHIP_SERVICES = [
  "Student learning solutions",
  "Teacher training",
  "LMS / Digital infrastructure", 
  "Customized curriculum support",
  "Career guidance and assessments",
  "Parent engagement tools",
  "School management software",
  "Online course platform",
  "Assessment and evaluation tools",
  "Professional development programs"
];

// School types - Updated to precisely match backend enum
const SCHOOL_TYPES = [
  "CBSE",
  "ICSE", 
  "IB", // Changed from "IB (International Baccalaureate)"
  "State Board",
  "International", // Changed from "Cambridge (IGCSE)"
  "Other"
];

// Student count ranges - Updated to precisely match backend enum
const STUDENT_COUNT_RANGES = [
  "1-50", // Changed from "Up to 100" to match backend
  "51-100", // Added to match backend
  "101-300",
  "301-500", 
  "501-1000",
  "1000+"
];

// Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'school_partnership_inquiry',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
} as const;

// Unified validation schema for the entire form (flattened to match ISchoolFormData)
const validationSchema: yup.ObjectSchema<ISchoolFormData> = yup.object({
    full_name: yup
      .string()
      .trim()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Full name can only contain alphabets, spaces, hyphens, and apostrophes")
      .required("Full name is required"),
      
    designation: yup
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation cannot exceed 100 characters")
      .required("Designation/Role is required"),
      
    email: yup
      .string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address")
      .required("Official email is required"),
      
    country: yup
      .string()
      .required("Country is required"),
      
    phone_number: yup
      .string()
      .required("Phone number is required"),
  
    school_name: yup
      .string()
      .trim()
      .min(2, "School name must be at least 2 characters")
      .max(200, "School name cannot exceed 200 characters")
      .required("School name is required"),
      
    school_type: yup
      .string()
    .oneOf(SCHOOL_TYPES, "Please select a valid school type")
      .required("School type is required"),
      
    city_state: yup
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location cannot exceed 100 characters")
      .required("City & State is required"),
      
    student_count: yup
      .string()
    .oneOf(STUDENT_COUNT_RANGES, "Please select a valid student count range")
      .required("Student count is required"),
      
    website: yup
      .string()
      .trim()
    .url("Please enter a valid website URL") // Changed from matches to url for better validation
      .nullable()
    .transform(value => (value === '' ? null : value)), // Keep nullable() for now, adjust on backend if needed
  
    partnership_services: yup
      .array()
    .of(yup.string().oneOf(PARTNERSHIP_SERVICES, "Invalid service selected"))
      .min(1, "Please select at least one service")
      .required("Please select your areas of interest"),
      
    additional_notes: yup
      .string()
      .trim()
      .max(1000, "Notes cannot exceed 1000 characters")
    .transform(value => (value === null || value === undefined ? '' : value)), // Transform null/undefined to empty string
      
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms to proceed")
      .required("Acceptance of terms is required"),
    
  privacy_policy_accepted: yup
    .boolean()
    .oneOf([true], "You must accept the privacy policy to proceed")
    .required("Acceptance of privacy policy is required"),
    
  message: yup
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(2000, "Message cannot exceed 2000 characters")
    .required("A message describing your inquiry is required"),
}) as yup.ObjectSchema<ISchoolFormData>;

// Reusable Form Input Components - Standardized like MultiStepJobApply.tsx
interface FormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  placeholder,
  type = "text",
  required = false,
  ...props
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className={`
            block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
            text-base font-medium
            ${error
              ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
            }
            dark:text-white dark:placeholder-gray-400
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

const FormTextArea: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  placeholder,
  required = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute top-4 left-4 pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`
            block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
            text-base font-medium
            ${error
              ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
            }
            dark:text-white dark:placeholder-gray-400
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

const FormCheckbox: React.FC<{
  label: React.ReactNode;
  error?: string;
  [key: string]: any;
}> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-4">
        <div className="flex items-center h-6 mt-1">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
            {...props}
          />
        </div>
        <div className="text-base">
          <label className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
            {label}
          </label>
        </div>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2 ml-9"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

// Progress Indicator Component - Standardized like MultiStepJobApply.tsx
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
}) => {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        {FORM_STEPS.map((step, index) => (
          <React.Fragment key={step.stepId}>
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg
                  ${index + 1 === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800'
                    : completedSteps.has(index)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}
              >
                {completedSteps.has(index) ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`
                text-sm font-semibold text-center max-w-24 leading-tight
                ${index + 1 === currentStep
                  ? 'text-blue-600 dark:text-blue-400'
                  : completedSteps.has(index)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}>
                {step.title}
              </span>
            </div>
            {index < FORM_STEPS.length - 1 && (
              <div className="flex-1 mx-6">
                <div className={`
                  h-1 rounded-full transition-all duration-300
                  ${completedSteps.has(index)
                    ? 'bg-green-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                  }
                `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${(completedSteps.size / totalSteps) * 100}%` }} // Use size for Set
        />
      </div>
    </div>
  );
};

const MultiStepSchoolPartnershipForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Start from 1-indexed step
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // New state for success view
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, // Include isValid for submit button control
    reset,
    watch,
    control,
    trigger,
    getValues,
    setValue
  } = useForm<ISchoolFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Add mode: "onChange" for better UX
    defaultValues: {
      full_name: '',
      designation: '',
      email: '',
      country: 'in',
      phone_number: '',
      school_name: '',
      school_type: '',
      city_state: '',
      student_count: '',
      website: '',
      partnership_services: [],
      additional_notes: '',
      terms_accepted: false,
      privacy_policy_accepted: false,
      message: '',
    }
  });

  // Watch form values
  const watchedFields = watch();

  // Auto-save form data to localStorage
  useEffect(() => {
    if (mounted) {
      const formData = getValues();
      localStorage.setItem('schoolPartnershipDraft', JSON.stringify({
        ...formData,
        currentStep,
        completedSteps: Array.from(completedSteps), // Store as array for JSON serialization
        timestamp: Date.now()
      }));
    }
  }, [watchedFields, currentStep, completedSteps, mounted, getValues]);

  // Load saved form data on mount
  useEffect(() => {
    if (mounted) {
      try {
        const savedData = localStorage.getItem('schoolPartnershipDraft');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            const { currentStep: savedStep, completedSteps: savedCompleted, timestamp, ...formData } = parsed;
            reset(formData);
            setCurrentStep(savedStep || 1); // Default to 1 if not set
            setCompletedSteps(new Set(savedCompleted || []));
          }
        }
      } catch (error) {
        console.log('Could not restore form data:', error);
      }
    }
  }, [mounted, reset]);

  // Navigation handlers - Adjusted for 1-indexed steps and useCallback
  const goToNextStep = useCallback(async () => {
    const currentStepFields = FORM_STEPS[currentStep - 1].fields;
    const isValid = await trigger(currentStepFields);
    
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < FORM_STEPS.length) { // Use FORM_STEPS.length as max step
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error(`Please complete all required fields in ${FORM_STEPS[currentStep - 1].title}`);
    }
  }, [currentStep, trigger]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) { // Min step is 1
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const onSubmit: SubmitHandler<ISchoolFormData> = async (data) => {
    setLoading(true);
    try {
      const transformedData: ISchoolPartnershipFormData = {
        form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
        priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
        status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
        source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
        
        contact_info: {
          full_name: data.full_name,
          designation: data.designation,
          email: data.email,
          phone_number: data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`,
          country: data.country,
        },
        
        school_info: {
          school_name: data.school_name,
          school_type: data.school_type,
          city_state: data.city_state,
          student_count: data.student_count,
          website: data.website || '',
        },
        
        partnership_info: {
          services_of_interest: data.partnership_services,
          additional_notes: data.additional_notes || '',
        },
        
        terms_accepted: data.terms_accepted,
        privacy_policy_accepted: data.privacy_policy_accepted,
        message: data.message,
        
        submission_metadata: {
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString(),
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          form_version: '1.0',
        }
      };

      console.log('Submitting school partnership inquiry:', transformedData);
      console.log('Transformed Data Details:', JSON.stringify(transformedData, null, 2));

      const response = await submitSchoolPartnershipForm(transformedData);

      if (response.status === 'success') {
          console.log('School partnership inquiry submitted successfully:', response);
        setIsSubmittedSuccessfully(true);
          reset();
        setCurrentStep(1); // Reset to 1st step
          setCompletedSteps(new Set());
          localStorage.removeItem('schoolPartnershipDraft');
      } else {
        console.error("School partnership inquiry submission failed:", response.error || response.message);
        toast.error(response.message || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
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
          layout // Add layout prop here to ensure persistent identity
        >
          {isSubmittedSuccessfully ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 sm:p-8"
            >
              <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-600 dark:text-green-400 mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
                Thank you for your interest in partnering with us! Our team will review your application and contact you within 1–2 working days.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </button>
            </motion.div>
          ) : (
            <>
              {/* Enhanced Mobile-First Header */}
              <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight"
                >
                  School/Institutes Partnership Application
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
                >
                  Complete the form to begin your partnership journey with us. We'll reach out within 1–2 working days.
                </motion.p>
              </div>

              {/* Enhanced Mobile-First Form Content */}
              <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={FORM_STEPS.length}
                  completedSteps={completedSteps}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div
                    className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
                  >
                    {/* Step Header (Moved inside renderStepContent function for better control) */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep} // Only this inner div changes key, forcing re-render of step content only
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 space-y-6"
                      >
                         {/* Inner Step Header for each step */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative z-10 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-slate-600/60 text-center"
                        >
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-base sm:text-lg shadow-lg">
                              {currentStep}
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                              {FORM_STEPS[currentStep - 1]?.title}
                            </h2>
                          </div>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {FORM_STEPS[currentStep - 1]?.description}
                          </p>
                        </motion.div>
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6">
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      disabled={currentStep === 1}
                      className={`
                        flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base
                        ${currentStep === 1
                          ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Previous
                    </button>

                    {currentStep < FORM_STEPS.length ? (
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Next
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading || !isValid}
                        className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <Send className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );

  // Helper function to render step content
  function renderStepContent() {
    switch (FORM_STEPS[currentStep - 1]?.stepId) { // Adjust for 1-indexed step
      case 'contact_details':
        return (
          <div className="space-y-8">
            <FormInput
              label="Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Dr. Priya Sharma"
              required
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            
            <FormInput
              label="Designation / Role"
              icon={Award}
              type="text"
              placeholder="e.g., Principal, Academic Coordinator, Trustee"
              required
              error={errors.designation?.message}
              {...register("designation")}
            />

            <FormInput
              label="Official Email"
              icon={Mail}
              type="email"
              placeholder="e.g., principal@yourschool.edu.in"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 ${errors.country ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <select
                    className={`
                      block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${errors.country
                        ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                      }
                      dark:text-white
                    `}
                    {...register("country")}
                  >
                    {countriesData.map((country: any) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.country.message}</span>
                  </motion.div>
                )}
              </div>

              <Controller
                name="phone_number"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneNumberInput
                      value={{ 
                        country: watchedFields.country || 'in', 
                        number: field.value || '' 
                      }}
                      onChange={val => field.onChange(val.number)}
                      placeholder="Enter your phone number"
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 'school_info':
        return (
          <div className="space-y-8">
            <FormInput
              label="School Name"
              icon={School}
              type="text"
              placeholder="e.g., Delhi Public School, Bangalore"
              required
              error={errors.school_name?.message}
              {...register("school_name")}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                School Type / Board <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className={`h-5 w-5 ${errors.school_type ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <select
                  className={`
                    block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                    focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                    ${errors.school_type
                      ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                    }
                    dark:text-white
                  `}
                  {...register("school_type")}
                >
                  <option value="">Select school type</option>
                  {SCHOOL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.school_type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.school_type.message}</span>
                </motion.div>
              )}
            </div>

            <FormInput
              label="City & State"
              icon={MapPin}
              type="text"
              placeholder="e.g., Bangalore, Karnataka"
              required
              error={errors.city_state?.message}
              {...register("city_state")}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Number of Students (approx.) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className={`h-5 w-5 ${errors.student_count ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <select
                  className={`
                    block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                    focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                    ${errors.student_count
                      ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                    }
                    dark:text-white
                  `}
                  {...register("student_count")}
                >
                  <option value="">Select student count</option>
                  {STUDENT_COUNT_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              {errors.student_count && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.student_count.message}</span>
                </motion.div>
              )}
            </div>

            <FormInput
              label="Website (if any)"
              icon={Globe}
              type="url"
              placeholder="https://www.yourschool.edu.in"
              error={errors.website?.message}
              {...register("website")}
            />
          </div>
        );

      case 'partnership_intent':
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                What would you like to explore? (Select all that apply) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {PARTNERSHIP_SERVICES.map(service => (
                  <label
                    key={service}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      watchedFields.partnership_services.includes(service)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={service}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      {...register("partnership_services")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{service}</span>
                  </label>
                ))}
              </div>
              {errors.partnership_services && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.partnership_services.message}</span>
                </motion.div>
              )}
            </div>

            <FormTextArea
              label="Additional Notes (Optional)"
              icon={MessageSquare}
              placeholder="Any specific questions or needs you'd like to share?"
              rows={4}
              error={errors.additional_notes?.message}
              {...register("additional_notes")}
            />

            <FormTextArea
              label="Description of your inquiry"
              icon={MessageSquare}
              placeholder="Tell us more about your partnership needs and goals..."
              rows={4}
              required
              error={errors.message?.message}
              {...register("message")}
            />

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <FormCheckbox
                label={
                  <span className="text-base">
                    I agree to the{" "}
                    <Link href="/terms-and-services" className="text-blue-600 hover:underline font-semibold">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                }
                required
                error={errors.terms_accepted?.message}
                {...register("terms_accepted")}
              />
              <FormCheckbox
                label={
                  <span className="text-base">
                    I also acknowledge and agree to the {" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                }
                required
                error={errors.privacy_policy_accepted?.message}
                {...register("privacy_policy_accepted")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }
};

export default MultiStepSchoolPartnershipForm; 