"use client";
/**
 * Multi-Step Hire from Medh Form
 * 
 * This component implements a comprehensive 4-step hiring inquiry form with full integration
 * to the Universal Form Model backend system. Features step-by-step user guidance,
 * progressive validation, and enhanced user experience with mobile-first design.
 * 
 * FORM STRUCTURE:
 * ==============
 * Step 1: Contact Info (full_name, email, country, phone_number)
 * Step 2: Company Details (company_name, company_website, department, team_size)
 * Step 3: Requirements (requirement_type, training_domain, detailed_requirements, document_upload)
 * Step 4: Terms & Review (terms_accepted)
 * 
 * @author MEDH Development Team
 * @version 3.0.0 (Multi-Step Form)
 * @since 2024-01-15
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";

// Icons
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle,
  User,
  Building,
  Target,
  FileText,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Briefcase,
  MessageSquare,
  Send,
  MapPin,
  Award,
  Check,
  AlertCircle,
  Loader2,
  Building2
} from 'lucide-react';

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
  
  // Step 2: Company Info
  company_name: string;
  company_website?: string | null;
  department: string;
  team_size: string;
  
  // Step 3: Requirements
  requirement_type: string;
  training_domain: string;
  start_date?: string | null;
  budget_range?: string | null;
  detailed_requirements: string;
  document_upload?: File | null;
  
  // Step 4: Terms
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
  department: [
    "Engineering",
    "Product Management", 
    "Data Science",
    "Marketing",
    "Sales",
    "Human Resources",
    "Operations",
    "Customer Success",
    "Design (UI/UX)",
    "Quality Assurance"
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
  ],
  training_domain: [
    "Full Stack Development",
    "Data Science & Analytics",
    "UI/UX Design",
    "Digital Marketing",
    "DevOps & Cloud",
    "Mobile App Development",
    "Artificial Intelligence",
    "Cybersecurity",
    "Project Management",
    "Quality Assurance"
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
    stepId: "company_info", 
    title: "Company Details",
    description: "Tell us about your organization.",
    fields: ["company_name", "company_website", "department", "team_size"]
  },
  {
    stepId: "requirements",
    title: "Your Requirements", 
    description: "What are you looking for?",
    fields: ["requirement_type", "training_domain", "detailed_requirements"]
  },
  {
    stepId: "terms",
    title: "Final Review",
    description: "Review and agree to proceed.",
    fields: ["terms_accepted"]
  }
];

// Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'hire_from_medh_inquiry',
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
      
      company_info: {
        company_name: data.company_name.trim(),
        company_website: data.company_website?.trim() || '',
        department: data.department.trim(),
        team_size: data.team_size,
      },
      
      requirements: {
        requirement_type: data.requirement_type,
        training_domain: data.training_domain.trim(),
        start_date: data.start_date || '',
        budget_range: data.budget_range || '',
        detailed_requirements: data.detailed_requirements.trim(),
        has_document: !!data.document_upload,
      },
      
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
      
      localStorage.setItem('last_hire_inquiry', JSON.stringify(submissionDetails));
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
  
  company_info: yup.object({
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
      
    department: yup
      .string()
      .trim()
      .min(2, "Department must be at least 2 characters")
      .max(100, "Department cannot exceed 100 characters")
      .required("Department is required"),
      
    team_size: yup
      .string()
      .required("Team size is required"),
  }),
  
  requirements: yup.object({
    requirement_type: yup
      .string()
      .required("Please select your requirement type"),
      
    training_domain: yup
      .string()
      .trim()
      .min(2, "Training domain must be at least 2 characters")
      .max(100, "Training domain cannot exceed 100 characters")
      .required("Training domain is required"),
      
    detailed_requirements: yup
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your detailed requirements"),
      
    start_date: yup
      .string()
      .nullable()
      .transform(value => value === '' ? null : value),
      
    budget_range: yup
      .string()
      .nullable()
      .transform(value => value === '' ? null : value),
  }),
  
  terms: yup.object({
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
    
  phone_number: yup
    .string()
    .required("Phone number is required"),

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
    
  department: yup
    .string()
    .trim()
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department cannot exceed 100 characters")
    .required("Department is required"),
    
  team_size: yup
    .string()
    .required("Team size is required"),

  requirement_type: yup
    .string()
    .required("Please select your requirement type"),
    
  training_domain: yup
    .string()
    .trim()
    .min(2, "Training domain must be at least 2 characters")
    .max(100, "Training domain cannot exceed 100 characters")
    .required("Training domain is required"),
    
  detailed_requirements: yup
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters describing your requirements")
    .max(2000, "Message cannot exceed 2000 characters")
    .required("Please describe your detailed requirements"),
    
  start_date: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value),
    
  budget_range: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value),
    
  terms_accepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy to proceed")
    .required("Acceptance of terms is required"),
});

const MultiStepHireForm: React.FC = () => {
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
      company_name: '',
      company_website: '',
      department: '',
      team_size: '',
      requirement_type: '',
      training_domain: '',
      start_date: '',
      budget_range: '',
      detailed_requirements: '',
      terms_accepted: false
    }
  });

  // Watch form values for validation
  const watchedFields = watch();

  // Auto-save form data to localStorage
  useEffect(() => {
    if (mounted) {
      const formData = getValues();
      localStorage.setItem('hireFormDraft', JSON.stringify({
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
        const savedData = localStorage.getItem('hireFormDraft');
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

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

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

      console.log('Submitting hire from Medh inquiry:', {
        form_type: transformedData.form_type,
        company: transformedData.company_info.company_name,
        priority: transformedData.priority
      });

      await postQuery({
        url: apiUrls?.CorporateTraining?.addCorporate, // Using corporate training endpoint
        postData: transformedData,
        onSuccess: (response: any) => {
          console.log('Hire from Medh inquiry submitted successfully:', response);
          
          if (universalFormUtils.isUniversalFormResponse(response)) {
            universalFormUtils.storeSubmissionDetails(response, data.company_name);
            console.log('Form submission tracking stored:', response.data?.form_id);
          }
          
          setShowSuccessModal(true);
          reset();
          setCurrentStep(0);
          setCompletedSteps(new Set());
          // Clear saved draft
          localStorage.removeItem('hireFormDraft');
        },
        onFail: (error: any) => {
          console.error("Hire from Medh inquiry submission failed:", error);
          const errorMessages = universalFormUtils.extractErrorMessages(error);
          errorMessages.forEach(message => {
            toast.error(message);
          });
        },
      });
    } catch (error) {
      console.error("Unexpected error during hire form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }
    
    // Handle file upload logic here
    console.log('File uploaded:', file.name);
    toast.success('File uploaded successfully');
  };

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
            bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
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

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];
    
    switch (step.stepId) {
      case 'contact_info':
        return (
          <div className="space-y-6">
            <FormInput
              label="Your Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Radhika Sharma"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            
            <FormInput
              label="Work Email"
              icon={Mail}
              type="email"
              placeholder="e.g., radhika@yourcompany.com"
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

      case 'company_info':
        return (
          <div className="space-y-6">
            <FormInput
              label="Company Name"
              icon={Building2}
              type="text"
              placeholder="e.g., TechNova Solutions"
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

            <FormInput
              label="Department or Function"
              icon={Briefcase}
              type="text"
              placeholder="e.g., Engineering, Marketing, HR"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.department}
              error={errors.department?.message}
              {...register("department")}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Team Size for Training or Hiring
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <select
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.team_size ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                  {...register("team_size")}
                >
                  <option value="">Select team size</option>
                  <option value="1–5">1–5</option>
                  <option value="6–20">6–20</option>
                  <option value="21–50">21–50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
              {errors.team_size && (
                <p className="text-red-500 text-xs mt-1">{errors.team_size.message}</p>
              )}
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What do you need?
              </label>
              <div className="space-y-3">
                {['Hire Medh-trained Candidates', 'Corporate Upskilling/Training', 'Both'].map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      value={option}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      {...register("requirement_type")}
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
              {errors.requirement_type && <p className="text-red-500 text-sm mt-1">{errors.requirement_type.message}</p>}
            </div>

            <FormInput
              label="Preferred Domain or Skills"
              icon={Target}
              type="text"
              placeholder="e.g., Full Stack Web Development, UI/UX, DevOps"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.training_domain}
              error={errors.training_domain?.message}
              {...register("training_domain")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Expected Start Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("start_date")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Budget Range (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="e.g., ₹50,000 – ₹1,00,000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("budget_range")}
                  />
                </div>
              </div>
            </div>

            <FormTextArea
              label="Detailed Requirements"
              icon={MessageSquare}
              placeholder="Share any additional info: timelines, interview preferences, project context, etc."
              rows={6}
              error={errors.detailed_requirements?.message}
              {...register("detailed_requirements")}
            />
            <p className="text-xs text-slate-500 -mt-4">
              Include skills, timeline, format preferences, team size, and specific goals.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload JD or Document (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or DOCX (max 5MB)
                  </p>
                </label>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What You'll Get
              </h4>
              <div className="space-y-3">
                {[
                  "✅ Pre-trained, job-ready talent",
                  "🎯 Custom training programs for your team", 
                  "🛠️ Hands-on project-based learning",
                  "📄 Certification from Medh",
                  "💬 Dedicated hiring/training support",
                  "🔁 Option to retrain or rehire as needed"
                ].map((benefit, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    {benefit}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
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
            Hire from Medh – Talent & Upskilling Inquiry
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
            >
            Connect with industry-ready professionals trained by Medh or request a custom training solution for your team.
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
                  className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
            >
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
              {renderStepContent()}
                  </div>
            </motion.div>
          </form>
        </div>
      </div>

          {/* Enhanced Mobile-First Navigation Footer */}
          <div className="relative bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
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

export default MultiStepHireForm; 