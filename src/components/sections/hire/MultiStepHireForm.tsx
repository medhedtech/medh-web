"use client";
/**
 * Multi-Step Hire from Medh Inquiry Form
 *
 * This component implements a 4-step hiring inquiry form with full integration
 * to the Universal Form Model backend system. Features step-by-step user guidance,
 * progressive validation, and enhanced user experience.
 *
 * FORM STRUCTURE:
 * ==============
 * Step 1: Contact Info (full_name, email, country, phone_number)
 * Step 2: Company Details (company_name, company_website, department, team_size)
 * Step 3: Requirements (requirement_type, training_domain, detailed_requirements)
 * Step 4: Terms & Review (terms_accepted)
 *
 * @author MEDH Development Team
 * @version 3.0.0 (Multi-Step Form)
 * @since 2024-01-15
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { toast } from 'sonner';

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
  Users,
  Target,
  Calendar,
  DollarSign,
  Upload,
  AlertCircle,
  FileText
} from "lucide-react";

// Hooks and Utilities
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput, { CountryOption } from '../../shared/login/PhoneNumberInput';
import { apiClient } from '@/apis/apiClient';
import { submitContactForm, IContactFormData } from '@/apis/form.api';
import { createHireFromMedhInquiry, IHireFromMedhData } from '@/apis/hire-from-medh.api';

// Local Yup schema for phone number validation
const phoneNumberYupSchema = yup.object({
  country: yup.string().required('Country code is required'),
  number: yup.string()
    .matches(/^[0-9]+$/, 'Phone number must consist of digits only')
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .required('Phone number is required'),
});

// Form data interface
interface IFormData {
  full_name: string;
  email: string;
  country: string;
  phone_number: {
    country: string;
    number: string;
  };
  company_name: string;
  company_website: string | null;
  department: string;
  team_size: string;
  requirement_type: string;
  training_domain: string;
  detailed_requirements: string;
  terms_accepted: boolean;
}

// Step configuration
interface IFormStep {
  stepId: number;
  title: string;
  description?: string;
  fields?: (keyof IFormData)[];
}

// Autocomplete suggestions
const AUTOCOMPLETE_SUGGESTIONS = {
  department: [
    "Engineering", "Product Management", "Data Science", "Marketing", "Sales", 
    "Human Resources", "Operations", "Customer Success", "Design (UI/UX)", "Quality Assurance"
  ],
  company_name: [
    "Infosys", "Accenture", "TCS", "Wipro", "HCL Technologies", 
    "Tech Mahindra", "Cognizant", "IBM", "Microsoft", "Google"
  ],
  training_domain: [
    "Full Stack Development", "Data Science & Analytics", "UI/UX Design", 
    "Digital Marketing", "DevOps & Cloud", "Mobile App Development", 
    "Artificial Intelligence", "Cybersecurity", "Project Management", "Quality Assurance"
  ]
};

// Form steps configuration
const FORM_STEPS: IFormStep[] = [
  {
    stepId: 0,
    title: "Contact Info",
    description: "Let's start with your basic details.",
    fields: ["full_name", "email", "country", "phone_number"]
  },
  {
    stepId: 1,
    title: "Company Details",
    description: "Tell us about your organization.",
    fields: ["company_name", "company_website", "department", "team_size"]
  },
  {
    stepId: 2,
    title: "Requirements",
    description: "Share your hiring needs and preferences.",
    fields: ["requirement_type", "training_domain", "detailed_requirements"]
  },
  {
    stepId: 3,
    title: "Review & Submit",
    description: "Review your information before submission.",
    fields: ["terms_accepted"]
  }
];

// Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'hire_from_medh_inquiry',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
} as const;

// Backend-compatible enum values with fallbacks for old values
const BACKEND_REQUIREMENT_TYPES = {
  // New clean keys
  'hire-candidates': 'Hire Medh-trained Candidates',
  'corporate-training': 'Corporate Upskilling/Training',
  'both': 'Both',
  // Fallbacks for old values
  'full-time-hiring': 'Hire Medh-trained Candidates',
  'contract-hiring': 'Hire Medh-trained Candidates',
  'project-based': 'Corporate Upskilling/Training',
  'internship': 'Hire Medh-trained Candidates',
  'freelance': 'Hire Medh-trained Candidates',
  'training-partnership': 'Corporate Upskilling/Training',
  'skill-assessment': 'Corporate Upskilling/Training',
  'other': 'Both'
} as const;

const BACKEND_TEAM_SIZES = {
  // New clean keys
  'small': '1–5',
  'medium': '6–20', 
  'large': '21–50',
  'enterprise': '50+',
  // Fallbacks for old values
  '1-10': '1–5',
  '11-50': '6–20',
  '51-200': '21–50',
  '201-500': '50+',
  '501-1000': '50+',
  '1000+': '50+'
} as const;

// Enhanced form response interfaces
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
  [key: string]: any;
}

// Validation schema for each step
const stepValidationSchemas = {
  contact_info: yup.object({
    full_name: yup.string().trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain alphabets, spaces, hyphens, and apostrophes")
      .required("Full name is required"),
    email: yup.string().trim().lowercase()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid business email address")
      .required("Business email is required"),
    country: yup.string().required("Country is required"),
    phone_number: phoneNumberYupSchema,
  }),
  
  company_info: yup.object({
    company_name: yup.string().trim()
      .min(2, "Company name must be at least 2 characters")
      .max(150, "Company name cannot exceed 150 characters")
      .required("Company name is required"),
    company_website: yup.string().trim()
      .matches(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/, "Please enter a valid company website URL")
      .nullable()
      .transform(value => value === '' ? null : value),
    department: yup.string().trim()
      .min(2, "Department must be at least 2 characters")
      .max(100, "Department cannot exceed 100 characters")
      .required("Department is required"),
    team_size: yup.string().required("Team size is required"),
  }),
  
  requirements: yup.object({
    requirement_type: yup.string().required("Please select your requirement type"),
    training_domain: yup.string().trim()
      .min(2, "Training domain must be at least 2 characters")
      .max(100, "Training domain cannot exceed 100 characters")
      .required("Training domain is required"),
    detailed_requirements: yup.string().trim()
      .min(20, "Please provide at least 20 characters describing your requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your detailed requirements"),
  }),
  
  terms: yup.object({
    terms_accepted: yup.boolean()
      .oneOf([true], "You must accept the terms and privacy policy to proceed")
      .required("Acceptance of terms is required"),
  }),
};

// Complete form validation schema
const completeFormSchema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  country: yup.string().required('Country is required'),
  phone_number: yup.object({
    country: yup.string().required('Country code is required'),
    number: yup.string().required('Phone number is required')
  }).required('Phone number is required'),
  company_name: yup.string().required('Company name is required'),
  company_website: yup.string().transform((value) => value || null).nullable(),
  department: yup.string().required('Department is required'),
  team_size: yup.string().required('Team size is required'),
  requirement_type: yup.string().required('Requirement type is required'),
  training_domain: yup.string().required('Training domain is required'),
  detailed_requirements: yup.string().trim()
    .min(20, "Please provide at least 20 characters describing your requirements")
    .max(2000, "Message cannot exceed 2000 characters")
    .required('Detailed requirements are required'),
  terms_accepted: yup.boolean().required('You must accept the terms').oneOf([true], 'You must accept the terms')
}) as yup.ObjectSchema<IFormData>;

// Reusable form components
interface IFormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  suggestions?: string[];
  type?: string;
  [key: string]: any;
}

// Enhanced Form Components with Mobile-First Design
const FormInput: React.FC<IFormInputProps> = ({
  label,
  icon: Icon,
  error,
  suggestions,
  type,
  ...registerProps
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    registerProps.onChange?.(e);
    
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
    registerProps.onChange?.(syntheticEvent);
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
          {...registerProps}
          type={type || registerProps.type || 'text'}
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

const MultiStepHireForm: React.FC = () => {
  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    control,
    getValues,
    formState: { errors, isValid },
    reset
  } = useForm<IFormData>({
    resolver: yupResolver<IFormData>(completeFormSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      country: 'in',
      phone_number: { country: 'in', number: '' },
      company_name: '',
      company_website: null,
      department: '',
      team_size: '',
      requirement_type: 'hire-candidates', // Default to "Hire Medh-trained Candidates"
      training_domain: '',
      detailed_requirements: '',
      terms_accepted: false
    }
  });

  // Use the FORM_STEPS constant defined earlier
  const formSteps = FORM_STEPS;

  // State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

  // Form Data Watching
  const watchedFields = watch();

  // Step Validation
  const isCurrentStepValid = useCallback(() => {
    const currentFields = formSteps[currentStep]?.fields || [];
    const values = getValues();
    
    // Check if all required fields are filled and have no errors
    const allFieldsValid = currentFields.every(field => {
      const value = values[field];
      const hasError = errors[field];
      
      // Skip validation if field has errors
      if (hasError) {
        return false;
      }
      
      // Special handling for phone_number
      if (field === 'phone_number') {
        return value && typeof value === 'object' && value.country && value.number && value.number.length >= 6;
      }
      
      // company_website is optional
      if (field === 'company_website') {
        return true;
      }
      
      // Check if value exists and is not empty
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      
      return !!value;
    });
    
    return allFieldsValid;
  }, [currentStep, formSteps, getValues, errors, watchedFields]);

  // Handle Next Step
  const handleNext = useCallback(async () => {
    if (currentStep >= formSteps.length - 1) return;
    
    // Get current step fields and trigger validation
    const currentFields = formSteps[currentStep]?.fields || [];
    const isStepValid = await trigger(currentFields);
    
    if (isStepValid && isCurrentStepValid()) {
      setCurrentStep(prev => prev + 1);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, formSteps, trigger, isCurrentStepValid]);

  // Handle Previous Step
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Form Submission
  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Format data for Hire from Medh API (matching backend controller expectations)
      const hireInquiryData = {
        full_name: data.full_name,
        email: data.email,
        country: data.country,
        phone: (() => {
          // Get the dial code for the selected country
          const selectedCountry = countriesData.find(country => country.code.toLowerCase() === data.phone_number.country.toLowerCase());
          const dialCode = selectedCountry?.dial_code || '+91'; // Default to India
          return `${dialCode}${data.phone_number.number}`;
        })(),
        company_name: data.company_name,
        company_website: data.company_website,
        department: data.department,
        team_size: data.team_size && BACKEND_TEAM_SIZES[data.team_size as keyof typeof BACKEND_TEAM_SIZES] ? BACKEND_TEAM_SIZES[data.team_size as keyof typeof BACKEND_TEAM_SIZES] : '1–5', // Ensure we always have a valid team_size
        requirement_type: BACKEND_REQUIREMENT_TYPES[data.requirement_type as keyof typeof BACKEND_REQUIREMENT_TYPES] || 'Hire Medh-trained Candidates', // Default fallback
        training_domain: data.training_domain,
        detailed_requirements: data.detailed_requirements,
        message: data.detailed_requirements, // Backend expects 'message' field
        terms_accepted: data.terms_accepted
      };
      
      // Debug logging (can be removed in production)
      // console.log('Raw form data:', data);
      // console.log('Mapped form data being sent:', hireInquiryData);
      
      // Submit via dedicated Hire from Medh API (using direct API call to avoid TypeScript mismatch)
      const response = await apiClient.post('/hire-from-medh', hireInquiryData);
      
      if (response.status === 'success' && response.data) {
        setIsSubmissionSuccess(true);
        toast.success('Your inquiry has been submitted successfully!', {
          description: 'Our team will review your requirements and get back to you soon.'
        });
        reset();
      } else {
        toast.error('Failed to submit inquiry', {
          description: response.message || response.error || 'Please try again later.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Fallback: Try submitting as contact form
      try {
        const contactFormData: IContactFormData = {
          full_name: data.full_name,
          email: data.email,
          phone: (() => {
            const selectedCountry = countriesData.find(country => country.code.toLowerCase() === data.phone_number.country.toLowerCase());
            const dialCode = selectedCountry?.dial_code || '+91';
            return `${dialCode}${data.phone_number.number}`;
          })(),
          company: data.company_name,
          subject: `Hire from Medh Inquiry - ${data.training_domain}`,
          message: `
            Company: ${data.company_name}
            Department: ${data.department}
            Team Size: ${data.team_size}
            Requirement Type: ${data.requirement_type}
            Training Domain: ${data.training_domain}
            
            Detailed Requirements:
            ${data.detailed_requirements}
          `,
          inquiry_type: 'sales' as const,
          consent_terms: data.terms_accepted
        };
        
        const fallbackResponse = await submitContactForm(contactFormData);
        
        if (fallbackResponse.status === 'success' && fallbackResponse.data) {
          setIsSubmissionSuccess(true);
          toast.success('Your inquiry has been submitted successfully!', {
            description: 'Our team will review your requirements and get back to you soon.'
          });
          reset();
        } else {
          throw new Error('Fallback submission failed');
        }
      } catch (fallbackError) {
        console.error('Fallback submission error:', fallbackError);
        toast.error('Failed to submit inquiry', {
          description: 'An unexpected error occurred. Please try again later or contact us directly.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Methods
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
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

            <FormInput
              label="Full Name"
              icon={User}
              error={errors.full_name?.message}
              {...register('full_name')}
              placeholder="Enter your full name"
            />
            <FormInput
              label="Email Address"
              icon={Mail}
              type="email"
              error={errors.email?.message}
              {...register('email')}
              placeholder="Enter your work email"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative space-y-3"
              >
                <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
                  Country
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                      errors.country 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-slate-400 dark:text-slate-500'
                    }`} />
                  </div>
                  <select
                    className={`
                      w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                      bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                      text-slate-900 dark:text-white
                      font-medium text-sm sm:text-base
                      min-h-[44px] sm:min-h-[48px]
                      ${errors.country 
                        ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
                      }
                      focus:outline-none
                      touch-manipulation
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
                
                <AnimatePresence mode="wait">
                  {errors.country && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="leading-tight">{errors.country.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Controller
                name="phone_number"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      value={{ 
                        country: watchedFields.country || 'in', 
                        number: typeof field.value === 'string' ? field.value : field.value?.number || '' 
                      }}
                      onChange={val => field.onChange(val)}
                      placeholder="Enter your phone number"
                      error={fieldState.error?.message}
                    />
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Country code is automatically set based on your selected location.
                    </p>
                    <AnimatePresence mode="wait">
                      {fieldState.error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
                        >
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span className="leading-tight">{fieldState.error.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
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

            <FormInput
              label="Company Name"
              icon={Building2}
              error={errors.company_name?.message}
              suggestions={AUTOCOMPLETE_SUGGESTIONS.company_name}
              {...register('company_name')}
              placeholder="Enter your company name"
            />
            <FormInput
              label="Company Website (Optional)"
              icon={Globe}
              error={errors.company_website?.message}
              {...register('company_website')}
              placeholder="https://www.example.com"
              type="url"
            />
            <FormInput
              label="Department"
              icon={Briefcase}
              error={errors.department?.message}
              suggestions={AUTOCOMPLETE_SUGGESTIONS.department}
              {...register('department')}
              placeholder="e.g., HR, Engineering, Sales"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative space-y-3"
            >
              <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
                Team Size
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Users className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                    errors.team_size 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`} />
                </div>
                <select
                  className={`
                    w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                    bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                    text-slate-900 dark:text-white
                    font-medium text-sm sm:text-base
                    min-h-[44px] sm:min-h-[48px]
                    ${errors.team_size 
                      ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
                    }
                    focus:outline-none
                    touch-manipulation
                  `}
                  {...register('team_size')}
                >
                  <option value="">Select team size</option>
                  <option value="small">1–5 employees</option>
                  <option value="medium">6–20 employees</option>
                  <option value="large">21–50 employees</option>
                  <option value="enterprise">50+ employees</option>
                </select>
              </div>
              
              <AnimatePresence mode="wait">
                {errors.team_size && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="leading-tight">{errors.team_size.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
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

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative space-y-3"
            >
              <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
                Requirement Type
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Target className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                    errors.requirement_type 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`} />
                </div>
                <select
                  className={`
                    w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                    bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                    text-slate-900 dark:text-white
                    font-medium text-sm sm:text-base
                    min-h-[44px] sm:min-h-[48px]
                    ${errors.requirement_type 
                      ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
                    }
                    focus:outline-none
                    touch-manipulation
                  `}
                  {...register('requirement_type')}
                >
                  <option value="">Select requirement type</option>
                  <option value="hire-candidates">Hire Medh-trained Candidates</option>
                  <option value="corporate-training">Corporate Upskilling/Training</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              <AnimatePresence mode="wait">
                {errors.requirement_type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="leading-tight">{errors.requirement_type.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <FormInput
              label="Training Domain"
              icon={Briefcase}
              error={errors.training_domain?.message}
              suggestions={AUTOCOMPLETE_SUGGESTIONS.training_domain}
              {...register('training_domain')}
              placeholder="e.g., Full Stack Development, Data Science"
            />
            <FormTextArea
              label="Detailed Requirements"
              icon={FileText}
              error={errors.detailed_requirements?.message}
              {...register('detailed_requirements')}
              placeholder="Describe your specific hiring needs, required skills, and expectations..."
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
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

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200">
                Review Your Submission
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="font-medium text-slate-700 dark:text-slate-300">Full Name:</div>
                <div>{watchedFields.full_name}</div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Email:</div>
                <div>{watchedFields.email}</div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Company:</div>
                <div>{watchedFields.company_name}</div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Training Domain:</div>
                <div>{watchedFields.training_domain}</div>
              </div>
            </div>
            <FormCheckbox
              label={
                <span>
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and authorize Medh to contact me
                </span>
              }
              error={errors.terms_accepted?.message}
              {...register('terms_accepted')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Success Modal
  if (isSubmissionSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 sm:p-8"
      >
        <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-600 dark:text-green-400 mb-6" />
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Inquiry Submitted Successfully!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
          Thank you for your interest. Our team will review your requirements and get back to you soon.
        </p>
        <button
          onClick={() => {
            setIsSubmissionSuccess(false);
            setCurrentStep(0);
            setCompletedSteps(new Set());
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start New Inquiry
        </button>
      </motion.div>
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
        >
          {/* Enhanced Mobile-First Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight"
            >
              Hire from Medh
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
            >
              Connect with our talented pool of certified professionals. Share your requirements, and we'll help you find the perfect match for your organization.
            </motion.p>
          </div>

          {/* Enhanced Mobile-First Form Content */}
          <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="w-full">
              <StepProgress 
                steps={formSteps} 
                currentStep={currentStep} 
                completedSteps={completedSteps} 
              />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < formSteps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isCurrentStepValid()}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="ml-auto px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MultiStepHireForm; 