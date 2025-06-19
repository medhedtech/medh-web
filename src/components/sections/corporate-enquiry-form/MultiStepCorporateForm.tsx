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
import countriesData from "@/utils/countrycode.json";

// Phone Number Component
import PhoneNumberInput, { phoneNumberSchema } from '../../shared/login/PhoneNumberInput';

// Toast notifications
import { toast } from 'react-toastify';

// Multi-step form data structure
interface IFormData {
  // Step 1: Contact Info
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  
  // Step 2: Organization Details
  designation: string;
  company_name: string;
  company_website: string;
  
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
  data?: {
    form_id: string;
    submission_date: string;
    status: 'submitted' | 'under_review' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// Universal Form Model Utilities
const universalFormUtils = {
  transformToUniversalFormat: (data: IFormData) => {
    return {
      form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
      priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
      status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
      source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
      
      contact_info: {
        full_name: data.full_name.trim(),
        email: data.email.toLowerCase().trim(),
        phone_number: data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`,
        country: data.country,
      },
      
      professional_info: {
        designation: data.designation.trim(),
        company_name: data.company_name.trim(),
        company_website: data.company_website.trim(),
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
      
    phone_number: yup
      .string()
      .required("Phone number is required"),
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
const completeFormSchema = yup.object({
  ...stepValidationSchemas.contact_info.fields,
  ...stepValidationSchemas.organization_info.fields,
  ...stepValidationSchemas.training_needs.fields,
});

// Reusable form components
interface IFormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  suggestions?: string[];
  [key: string]: any;
}

// Enhanced Form Components with Consistent Design System
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
      className="relative space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'
          }`} />
        </div>
        <input
          type={type}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200
            bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            font-medium
            ${error 
              ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
            }
            focus:outline-none
          `}
          {...props}
        />
        
        {/* Enhanced Autocomplete */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-20 w-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-gray-900/30 max-h-48 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl font-medium"
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
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
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
      className="relative space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute top-4 left-4 pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'
          }`} />
        </div>
        <textarea
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200
            bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            font-medium resize-none
            ${error 
              ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
            }
            focus:outline-none
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
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
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
      className="relative space-y-2"
    >
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-6">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-200"
            {...props}
          />
        </div>
        <div className="text-sm">
          <label className="font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
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
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium ml-8"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    trigger,
    getValues
  } = useForm<IFormData>({
    resolver: yupResolver(completeFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'in',
      phone_number: '',
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

  const onSubmit = async (data: IFormData): Promise<void> => {
    try {
      const transformedData = universalFormUtils.transformToUniversalFormat(data);

      console.log('Submitting corporate training inquiry:', {
        form_type: transformedData.form_type,
        company: transformedData.professional_info.company_name,
        priority: transformedData.priority
      });

      await postQuery({
        url: apiUrls?.CorporateTraining?.addCorporate,
        postData: transformedData,
        onSuccess: (response: any) => {
          console.log('Corporate training inquiry submitted successfully:', response);
          
          if (universalFormUtils.isUniversalFormResponse(response)) {
            universalFormUtils.storeSubmissionDetails(response, data.company_name);
            console.log('Form submission tracking stored:', response.data?.form_id);
          }
          
          setShowSuccessModal(true);
          reset();
          setCurrentStep(0);
          setCompletedSteps(new Set());
          // Clear saved draft
          localStorage.removeItem('corporateFormDraft');
        },
        onFail: (error: any) => {
          console.error("Corporate training inquiry submission failed:", error);
          const errorMessages = universalFormUtils.extractErrorMessages(error);
          errorMessages.forEach(message => {
            toast.error(message);
          });
        },
      });
    } catch (error) {
      console.error("Unexpected error during corporate training form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

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
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <select
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
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
                        number: field.value || '' 
                      }}
                      onChange={val => field.onChange(val.number)}
                      placeholder="Enter your phone number"
                      error={fieldState.error?.message}
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
            <p className="text-xs text-gray-500 -mt-4">
              Include skills, timeline, format (online/onsite), team size, and goals.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <FormCheckbox
                label={
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms-and-services">
                      <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                        Terms of Service
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
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-xl md:rounded-2xl border-0 md:border border-gray-200 dark:border-gray-700 overflow-hidden min-h-screen md:min-h-0"
    >
      {/* Clean Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Corporate Training Inquiry
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Let us help your team grow. Share your training requirements, and we'll tailor a solution for your organization.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 dark:bg-gray-950 flex-1">
        <div className="px-4 md:px-8 py-6 md:py-8 pb-8 md:pb-12">
          <StepProgress 
            steps={FORM_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Current Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm mb-6 md:mb-8"
            >
              {/* Step Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                  {FORM_STEPS[currentStep]?.title}
                </h3>
              </motion.div>

              {/* Step Content */}
              {renderStep()}
            </motion.div>
          </form>
        </div>
      </div>

      {/* Clean Navigation Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 md:py-6">
        <div className="flex justify-between items-center">
          <motion.button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            suppressHydrationWarning
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          {currentStep === FORM_STEPS.length - 1 ? (
            <motion.button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              suppressHydrationWarning
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
                loading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit Inquiry</span>
                  <span className="sm:hidden">Submit</span>
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
              className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              <span className="hidden sm:inline">Next Step</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Enhanced Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
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
                  onClick={() => {
                    setShowSuccessModal(false);
                    onClose();
                  }}
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
    </motion.div>
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