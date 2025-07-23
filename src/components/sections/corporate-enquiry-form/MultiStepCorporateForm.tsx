"use client";
/**
 * Multi-Step Corporate Training Inquiry Form
 * 
 * Enhanced form implementation following MEDH Comprehensive Forms JSON structure
 * with improved API integration, field organization, and validation patterns.
 * 
 * FORM STRUCTURE (Enhanced):
 * ==============
 * Step 1: Contact Information (full_name, email, phone_number, country)
 * Step 2: Organization Details (designation, company_name, company_website, industry, company_size)
 * Step 3: Training Requirements (training_type, training_topics, participants_count, budget_range, timeline, training_requirements)
 * 
 * @author MEDH Development Team
 * @version 4.0.0 (Enhanced JSON Structure)
 * @since 2024-01-15
 */
import React, { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  Target,
  BookOpen,
  TrendingUp
} from "lucide-react";

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import * as countryCodesList from 'country-codes-list';

// Phone Number Component
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';

// Toast notifications
import { toast } from 'react-toastify';

// Custom debounce utility to avoid lodash dependency
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Enhanced Form Data Interface following JSON structure
interface IFormData {
  // Step 1: Contact Information
  contact_info: {
  full_name: string;
  email: string;
  phone_number: { country: string; number: string };
    country: string;
  };
  
  // Step 2: Organization Details
  organization_info: {
  designation: string;
  company_name: string;
  company_website?: string | null;
    industry: string;
    company_size: string;
  };
  
  // Step 3: Training Requirements
  training_details: {
    training_type: string;
    training_topics: string[];
    participants_count: number;
    budget_range: string;
    timeline: string;
  training_requirements: string;
  };
  
  // Consent
  consent: {
  terms_accepted: boolean;
    data_collection_consent: boolean;
  };
}

// Enhanced Form Configuration following JSON structure
const FORM_CONFIG = {
  form_id: "corporate_training_v4",
  form_type: "corporate_training_inquiry",
  title: "Corporate Training Inquiry",
  description: "Tell us about your corporate training needs",
  category: "corporate_training",
  ui_theme: "corporate",
  layout: "vertical",
  steps: 3,
  auto_save: true,
  show_progress: true
};

// Enhanced Form Steps Configuration
interface IFormStep {
  step_id: number;
  title: string;
  description: string;
  fields: string[];
  section: string;
}

const FORM_STEPS: IFormStep[] = [
  {
    step_id: 1,
    title: "Contact Information",
    description: "Basic contact details and location",
    fields: ["contact_info.full_name", "contact_info.email", "contact_info.phone_number", "contact_info.country"],
    section: "contact_info"
  },
  {
    step_id: 2,
    title: "Organization Details",
    description: "About your organization and role",
    fields: ["organization_info.designation", "organization_info.company_name", "organization_info.company_website", "organization_info.industry", "organization_info.company_size"],
    section: "organization_info"
  },
  {
    step_id: 3,
    title: "Training Requirements", 
    description: "Your specific training needs and preferences",
    fields: ["training_details.training_type", "training_details.training_topics", "training_details.participants_count", "training_details.budget_range", "training_details.timeline", "training_details.training_requirements"],
    section: "training_details"
  }
];

// Enhanced Options following JSON structure
const FORM_OPTIONS = {
  industries: [
    { label: "Technology", value: "technology" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Finance & Banking", value: "finance" },
    { label: "Education", value: "education" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Retail & E-commerce", value: "retail" },
    { label: "Consulting", value: "consulting" },
    { label: "Government", value: "government" },
    { label: "Non-Profit", value: "non_profit" },
    { label: "Other", value: "other" }
  ],
  company_sizes: [
    { label: "1-10 employees", value: "1-10" },
    { label: "11-50 employees", value: "11-50" },
    { label: "51-200 employees", value: "51-200" },
    { label: "201-500 employees", value: "201-500" },
    { label: "501-1000 employees", value: "501-1000" },
    { label: "1000+ employees", value: "1000+" }
  ],
  training_types: [
    { label: "Technical Skills Training", value: "technical_skills" },
    { label: "Soft Skills Development", value: "soft_skills" },
    { label: "Leadership Development", value: "leadership" },
    { label: "Digital Transformation", value: "digital_transformation" },
    { label: "Compliance Training", value: "compliance" },
    { label: "Sales & Marketing", value: "sales_marketing" },
    { label: "Project Management", value: "project_management" },
    { label: "Data Analytics", value: "data_analytics" },
    { label: "AI & Machine Learning", value: "ai_ml" },
    { label: "Custom Training Program", value: "custom" }
  ],
  training_topics: [
    { label: "Communication Skills", value: "communication" },
    { label: "Team Building", value: "team_building" },
    { label: "Time Management", value: "time_management" },
    { label: "Python Programming", value: "python" },
    { label: "Data Science", value: "data_science" },
    { label: "Machine Learning", value: "machine_learning" },
    { label: "Digital Marketing", value: "digital_marketing" },
    { label: "Project Management", value: "project_mgmt" },
    { label: "Leadership Skills", value: "leadership_skills" },
    { label: "Customer Service", value: "customer_service" },
    { label: "Sales Training", value: "sales_training" },
    { label: "Cybersecurity Awareness", value: "cybersecurity" }
  ],
  budget_ranges: [
    { label: "Under ₹1 Lakh", value: "under_1l" },
    { label: "₹1-5 Lakhs", value: "1l_5l" },
    { label: "₹5-10 Lakhs", value: "5l_10l" },
    { label: "₹10-25 Lakhs", value: "10l_25l" },
    { label: "₹25-50 Lakhs", value: "25l_50l" },
    { label: "₹50+ Lakhs", value: "50l_plus" },
    { label: "Prefer not to disclose", value: "not_disclosed" }
  ],
  timelines: [
    { label: "Immediate (Within 2 weeks)", value: "immediate" },
    { label: "Within a month", value: "within_month" },
    { label: "Within 3 months", value: "within_quarter" },
    { label: "Within 6 months", value: "within_half_year" },
    { label: "Flexible timeline", value: "flexible" }
  ]
};

// Enhanced Autocomplete Suggestions
const AUTOCOMPLETE_SUGGESTIONS = {
  designation: [
    "Chief Executive Officer (CEO)",
    "Chief Technology Officer (CTO)",
    "Chief Human Resources Officer (CHRO)",
    "VP of Learning & Development",
    "Learning & Development Manager",
    "Training & Development Manager",
    "HR Business Partner",
    "Talent Development Lead",
    "Organizational Development Manager",
    "People Operations Manager",
    "Training Coordinator",
    "HR Generalist",
    "Operations Manager",
    "Department Head",
    "Team Lead"
  ],
  company_name: [
    "Tata Consultancy Services (TCS)",
    "Infosys Limited",
    "Wipro Limited",
    "HCL Technologies",
    "Tech Mahindra",
    "Accenture",
    "IBM India",
    "Microsoft India",
    "Google India",
    "Amazon India",
    "Flipkart",
    "Reliance Industries",
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India"
  ]
};

// Enhanced Validation Schema following JSON patterns
const phoneNumberYupSchema = yup.object({
  country: yup.string().required('Country code is required'),
  number: yup.string()
    .test('phone-validation', 'Please enter a valid phone number', function(value) {
      if (!value) return false;
      
      // Remove any non-digit characters except + at the beginning
      const cleanedNumber = value.replace(/[^\d+]/g, '');
      
      // Basic validation for phone number length and format
      if (cleanedNumber.length < 6) {
        return this.createError({ message: 'Phone number must be at least 6 digits' });
      }
      
      if (cleanedNumber.length > 15) {
        return this.createError({ message: 'Phone number cannot exceed 15 digits' });
      }
      
      // Check if it starts with country code digits
      if (/^(\+?[1-9]\d{1,4})?[1-9]\d{5,14}$/.test(cleanedNumber)) {
        return true;
      }
      
      return this.createError({ message: 'Please enter a valid phone number' });
    })
    .required('Phone number is required'),
}).required();

const stepValidationSchemas = {
  contact_info: yup.object().shape({
    contact_info: yup.object().shape({
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
    }).required()
  }).required(),
  
  organization_info: yup.object().shape({
    organization_info: yup.object().shape({
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
        
      industry: yup
        .string()
        .required("Industry selection is required"),
        
      company_size: yup
        .string()
        .required("Company size selection is required"),
    }).required()
  }).required(),
  
  training_details: yup.object().shape({
    training_details: yup.object().shape({
      training_type: yup
        .string()
        .required("Training type selection is required"),
        
      training_topics: yup
        .array()
        .of(yup.string().required())
        .min(1, "Please select at least one training topic")
        .required("Training topics are required"),
        
      participants_count: yup
        .number()
        .min(1, "Participants count must be at least 1")
        .max(10000, "Participants count cannot exceed 10,000")
        .required("Number of participants is required"),
        
      budget_range: yup
        .string()
        .required("Budget range selection is required"),
        
      timeline: yup
        .string()
        .required("Timeline selection is required"),
        
    training_requirements: yup
      .string()
      .trim()
        .min(50, "Please provide at least 50 characters describing your training requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your corporate training requirements"),
    }).required(),
      
    consent: yup.object().shape({
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy to proceed")
      .required("Acceptance of terms is required"),
        
      data_collection_consent: yup
        .boolean()
        .oneOf([true], "You must consent to data collection for processing your inquiry")
        .required("Data collection consent is required"),
    }).required()
  }).required(),
};

// Complete form validation schema
const completeFormSchema = yup.object().shape({
  contact_info: yup.object().shape({
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
  }).required(),
  
  organization_info: yup.object().shape({
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
  
    industry: yup
      .string()
      .required("Industry selection is required"),
      
    company_size: yup
      .string()
      .required("Company size selection is required"),
  }).required(),
  
  training_details: yup.object().shape({
    training_type: yup
      .string()
      .required("Training type selection is required"),
      
    training_topics: yup
      .array()
      .of(yup.string().required())
      .min(1, "Please select at least one training topic")
      .required("Training topics are required"),
      
    participants_count: yup
      .number()
      .min(1, "Participants count must be at least 1")
      .max(10000, "Participants count cannot exceed 10,000")
      .required("Number of participants is required"),
      
    budget_range: yup
      .string()
      .required("Budget range selection is required"),
      
    timeline: yup
      .string()
      .required("Timeline selection is required"),
      
    training_requirements: yup
      .string()
      .trim()
      .min(50, "Please provide at least 50 characters describing your training requirements")
      .max(2000, "Message cannot exceed 2000 characters")
      .required("Please describe your corporate training requirements"),
  }).required(),
      
  consent: yup.object().shape({
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy to proceed")
      .required("Acceptance of terms is required"),
      
    data_collection_consent: yup
      .boolean()
      .oneOf([true], "You must consent to data collection for processing your inquiry")
      .required("Data collection consent is required"),
  }).required()
}).required();

// Enhanced Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'corporate_training_inquiry',
  FORM_VERSION: '4.0',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
  MIN_MESSAGE_LENGTH: 50,
  MAX_MESSAGE_LENGTH: 2000,
} as const;

// Enhanced API Response Interface
interface IUniversalFormResponse {
  success: boolean;
  message: string;
  data?: {
    application_id?: string;
    form_type?: string;
    status?: 'submitted' | 'under_review' | 'in_progress' | 'completed';
    submitted_at?: string;
    acknowledgment_sent?: boolean;
    estimated_response_time?: string;
  };
  errors?: Array<{
    field: string;
    message: string;
    code?: string;
    value?: any;
  }>;
  required_fields?: string[];
  error_code?: string;
  [key: string]: any;
}

// Enhanced Universal Form Model Utilities
const universalFormUtils = {
  transformToUniversalFormat: (data: IFormData) => {
    // Enhanced phone number formatting to handle country codes properly
    let phoneNumber = '';
    if (data.contact_info.phone_number) {
      const { country, number } = data.contact_info.phone_number;
      // Clean the number by removing any existing country code prefix
      const cleanNumber = number.replace(/^\+?[0-9]{1,4}/, '');
      // Get the country code based on the selected country
      const countryCode = country.toUpperCase();
      phoneNumber = `+${countryCode}${cleanNumber}`;
    }
    
    return {
      form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
      form_id: FORM_CONFIG.form_id,
      form_version: UNIVERSAL_FORM_CONSTANTS.FORM_VERSION,
      priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
      status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
      source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
      
      // Contact Information
      contact_info: {
        full_name: data.contact_info.full_name.trim(),
        email: data.contact_info.email.toLowerCase().trim(),
        phone_number: phoneNumber,
        country: data.contact_info.country,
      },
      
      // Organization Information
      organization_info: {
        designation: data.organization_info.designation.trim(),
        company_name: data.organization_info.company_name.trim(),
        company_website: data.organization_info.company_website?.trim() || '',
        industry: data.organization_info.industry,
        company_size: data.organization_info.company_size,
      },
      
      // Training Details
      training_details: {
        training_type: data.training_details.training_type,
        training_topics: data.training_details.training_topics,
        participants_count: data.training_details.participants_count,
        budget_range: data.training_details.budget_range,
        timeline: data.training_details.timeline,
        training_requirements: data.training_details.training_requirements.trim(),
      },
      
      // Consent Information
      consent: {
        terms_accepted: data.consent.terms_accepted,
        data_collection_consent: data.consent.data_collection_consent,
      },
      
      // Legacy fields for backward compatibility
      message: data.training_details.training_requirements.trim(),
      accept: data.consent.terms_accepted,
      terms_accepted: data.consent.terms_accepted,
      privacy_policy_accepted: data.consent.terms_accepted,
      
      // Enhanced Submission Metadata (SSR-safe)
      submission_metadata: {
        user_agent: typeof window !== 'undefined' ? window.navigator?.userAgent || '' : '',
        timestamp: new Date().toISOString(),
        referrer: typeof window !== 'undefined' ? document?.referrer || '' : '',
        form_version: UNIVERSAL_FORM_CONSTANTS.FORM_VERSION,
        form_config: FORM_CONFIG,
        validation_passed: true,
        session_id: typeof window !== 'undefined' ? sessionStorage?.getItem('session_id') || '' : '',
        page_url: typeof window !== 'undefined' ? window.location?.href || '' : '',
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
      try {
        const submissionDetails = {
          application_id: response.data.application_id,
          submitted_at: response.data.submitted_at,
          status: response.data.status,
          company_name: companyName,
          form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
          form_version: UNIVERSAL_FORM_CONSTANTS.FORM_VERSION,
          stored_at: new Date().toISOString(),
        };
        
        localStorage.setItem('last_corporate_inquiry', JSON.stringify(submissionDetails));
        sessionStorage.setItem('current_form_submission', JSON.stringify(submissionDetails));
        console.log('💾 Submission details stored successfully');
      } catch (error) {
        console.warn('Failed to store submission details:', error);
      }
    }
  },
};

// Enhanced Form Components with improved mobile-first design
interface IFormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  suggestions?: string[];
  [key: string]: any;
}

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
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          onChange={handleInputChange}
          className={`
            w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
            text-sm
            transition-colors
            ${error 
              ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400' 
              : 'focus:border-slate-900 dark:focus:border-white'
            }
            focus:outline-none focus:ring-0
          `}
          {...props}
        />
        
        <AnimatePresence>
          {showSuggestions && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

const FormSelect: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  options: Array<{ label: string; value: string }>;
  [key: string]: any;
}> = ({ label, icon: Icon, error, options, ...props }) => {
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
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500'
          }`} />
        </div>
        <select
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-0 rounded-lg sm:rounded-xl border-2 transition-all duration-200
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white
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
        >
          <option value="">Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

const FormMultiSelect: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  options: Array<{ label: string; value: string }>;
  value: string[];
  onChange: (value: string[]) => void;
}> = ({ label, icon: Icon, error, options, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
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
      <div className="relative">
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
            error 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-slate-400 dark:text-slate-500'
          }`} />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
            bg-white dark:bg-slate-800 text-left
            text-slate-900 dark:text-white
            font-medium text-sm sm:text-base
            min-h-[44px] sm:min-h-[48px]
            ${error 
              ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-400/10' 
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
            }
            focus:outline-none
            touch-manipulation
          `}
        >
          {value.length === 0 ? (
            <span className="text-slate-500 dark:text-slate-400">Select training topics...</span>
          ) : (
            <span>{value.length} topic{value.length > 1 ? 's' : ''} selected</span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-20 w-full mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl shadow-xl dark:shadow-slate-900/30 max-h-64 overflow-y-auto"
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center px-3 sm:px-4 py-3 sm:py-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors duration-150 first:rounded-t-lg sm:first:rounded-t-xl last:rounded-b-lg sm:last:rounded-b-xl min-h-[44px] touch-manipulation"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 mr-3"
                  />
                  <span className="text-slate-900 dark:text-white font-medium text-sm sm:text-base">
                    {option.label}
                  </span>
                </label>
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

const FormNumberInput: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  [key: string]: any;
}> = ({ label, icon: Icon, error, ...props }) => {
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
          type="number"
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
  const [charCount, setCharCount] = useState(0);
  const maxLength = props.maxLength || 2000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
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
          onChange={handleChange}
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
        <div className="absolute bottom-2 right-3 text-xs text-slate-500 dark:text-slate-400">
          {charCount}/{maxLength}
        </div>
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

// Minimal Step Progress Component
const StepProgress: React.FC<{
  steps: IFormStep[];
  currentStep: number;
  completedSteps: Set<number>;
}> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={step.step_id}>
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${isCompleted 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span>{step.step_id}</span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : isCompleted 
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-blue-400 dark:text-blue-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-px transition-colors ${
                    completedSteps.has(index) 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : 'bg-blue-200 dark:bg-blue-800'
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
    getValues,
    setError,
    setValue
  } = useForm<IFormData>({
    resolver: yupResolver(completeFormSchema),
    defaultValues: {
      contact_info: {
      full_name: '',
      email: '',
      country: 'in',
        phone_number: { country: 'in', number: '' }
      },
      organization_info: {
      designation: '',
      company_name: '',
      company_website: '',
        industry: '',
        company_size: ''
      },
      training_details: {
        training_type: '',
        training_topics: [],
        participants_count: 1,
        budget_range: '',
        timeline: '',
        training_requirements: ''
      },
      consent: {
        terms_accepted: false,
        data_collection_consent: false
      }
    }
  });

  const watchedFields = watch();

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

  // Enhanced debounced auto-save for better performance (client-side only)
  const debouncedAutoSave = React.useMemo(
    () => {
      if (typeof window === 'undefined') {
        // Return a no-op function for SSR
        return () => {};
      }
      
      return debounce((formData: IFormData, step: number, completed: Set<number>) => {
        if (mounted && typeof window !== 'undefined') {
          try {
            localStorage.setItem('corporateFormDraft', JSON.stringify({
              ...formData,
              currentStep: step,
              completedSteps: Array.from(completed),
              timestamp: Date.now()
            }));
            console.log('📦 Form auto-saved to localStorage');
          } catch (error) {
            console.warn('Failed to save form data to localStorage:', error);
          }
        }
      }, 1000);
    },
    [mounted]
  );

  // Auto-save form data to localStorage with debouncing (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const formData = getValues();
    debouncedAutoSave(formData, currentStep, completedSteps);
  }, [watchedFields, currentStep, completedSteps, debouncedAutoSave, getValues, mounted]);

  // Load saved form data on mount (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem('corporateFormDraft');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Only restore data from the last 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          const { currentStep: savedStep, completedSteps: savedCompleted, timestamp, ...formData } = parsed;
          reset(formData);
          setCurrentStep(savedStep || 0);
          setCompletedSteps(new Set(savedCompleted || []));
          console.log('📂 Form data restored from localStorage');
        } else {
          // Clean up old data
          localStorage.removeItem('corporateFormDraft');
          console.log('🗑️ Old form data cleaned up');
        }
      }
    } catch (error) {
      console.warn('Could not restore form data:', error);
      // Clean up corrupted data
      try {
        localStorage.removeItem('corporateFormDraft');
      } catch (cleanupError) {
        console.warn('Could not clean up corrupted form data:', cleanupError);
      }
    }
  }, [mounted, reset]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepData = FORM_STEPS[currentStep];
    const formValues = getValues();
    
    let isValid = true;
    let errorMessages: string[] = [];
    
    // Manual validation based on current step
    switch (currentStep) {
      case 0: // Contact Info
        if (!formValues.contact_info?.full_name?.trim()) {
          errorMessages.push('Full name is required');
          isValid = false;
        }
        if (!formValues.contact_info?.email?.trim()) {
          errorMessages.push('Email is required');
          isValid = false;
        }
        if (!formValues.contact_info?.country) {
          errorMessages.push('Country is required');
          isValid = false;
        }
        if (!formValues.contact_info?.phone_number?.number?.trim()) {
          errorMessages.push('Phone number is required');
          isValid = false;
        }
            break;
        
      case 1: // Organization Info
        if (!formValues.organization_info?.designation?.trim()) {
          errorMessages.push('Job designation is required');
          isValid = false;
        }
        if (!formValues.organization_info?.company_name?.trim()) {
          errorMessages.push('Company name is required');
          isValid = false;
        }
        if (!formValues.organization_info?.industry) {
          errorMessages.push('Industry selection is required');
          isValid = false;
        }
        if (!formValues.organization_info?.company_size) {
          errorMessages.push('Company size selection is required');
          isValid = false;
        }
            break;
        
      case 2: // Training Details
        if (!formValues.training_details?.training_type) {
          errorMessages.push('Training type is required');
          isValid = false;
        }
        if (!formValues.training_details?.training_topics?.length) {
          errorMessages.push('At least one training topic is required');
          isValid = false;
        }
        if (!formValues.training_details?.participants_count || formValues.training_details.participants_count < 1) {
          errorMessages.push('Number of participants must be at least 1');
          isValid = false;
        }
        if (!formValues.training_details?.budget_range) {
          errorMessages.push('Budget range is required');
          isValid = false;
        }
        if (!formValues.training_details?.timeline) {
          errorMessages.push('Timeline is required');
          isValid = false;
        }
        if (!formValues.training_details?.training_requirements?.trim() || formValues.training_details.training_requirements.trim().length < 50) {
          errorMessages.push('Training requirements must be at least 50 characters');
          isValid = false;
        }
        if (!formValues.consent?.terms_accepted) {
          errorMessages.push('You must accept the terms and conditions');
          isValid = false;
        }
        if (!formValues.consent?.data_collection_consent) {
          errorMessages.push('You must consent to data collection');
          isValid = false;
        }
        break;
        
      default:
        isValid = false;
    }
    
    // Also run form validation for UI error display
    await trigger();
    
    if (!isValid) {
      console.log('Validation failed for step:', currentStep);
      console.log('Current form values:', formValues);
      console.log('Error messages:', errorMessages);
      console.log('Current errors:', errors);
      
      toast.error(`Please complete all required fields in ${currentStepData.title}`);
    } else {
      toast.success(`${currentStepData.title} completed successfully!`);
    }
    
    return isValid;
  };

  const handleNext = async () => {
    console.log('🔄 HANDLE NEXT CLICKED - Current Step:', currentStep);
    console.log('📝 Current Form Values:', getValues());
    
    // Show processing feedback to user
    toast.info(`Validating ${FORM_STEPS[currentStep]?.title}...`, { autoClose: 1000 });
    
    const isValid = await validateCurrentStep();
    console.log('✅ Validation Result:', isValid);
    
    if (isValid) {
      console.log('✅ Step validation passed, proceeding to next step');
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Enhanced step progression with smooth animations
      if (currentStep < FORM_STEPS.length - 1) {
        console.log(`➡️ Moving from step ${currentStep} to step ${currentStep + 1}`);
        
        // Show step completion feedback
        toast.success(`✅ ${FORM_STEPS[currentStep]?.title} completed!`, { 
          autoClose: 2000,
          position: "bottom-right"
        });
        
        // Small delay for better UX
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 200);
      } else {
        console.log('🏁 Reached final step');
      }
    } else {
      console.log('❌ Step validation failed, staying on current step');
      // Enhanced error feedback is already handled in validateCurrentStep
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission handler - defined with useCallback to prevent re-renders
  const onSubmit = useCallback(async (data: IFormData): Promise<void> => {
    console.log('🚀 FORM SUBMISSION STARTED');
    console.log('📋 Form Data Received:', data);
    
    try {
      // Demo submission - simulate successful submission without API call
      console.log('✅ Demo Submission - Form Data:', JSON.stringify(data, null, 2));

      // Transform data for demo purposes
      const transformedData = universalFormUtils.transformToUniversalFormat(data);
      console.log('🔄 Demo Submission - Transformed Data:', JSON.stringify(transformedData, null, 2));
      
      // Show processing toast
      toast.info('Processing demo submission...');
      
      // Simulate API processing delay
      console.log('⏳ Simulating API processing delay...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo success response
      const demoResponse: IUniversalFormResponse = {
        success: true,
        message: 'Demo submission successful! Your corporate training inquiry has been received.',
        data: {
          application_id: `DEMO-${Date.now()}`,
          form_type: 'corporate_training_inquiry',
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          acknowledgment_sent: true,
          estimated_response_time: '24-48 hours'
        }
      };
      
      console.log('✅ Demo Response Generated:', demoResponse);
      
      // Enhanced success feedback with detailed information
      toast.success(`🎉 Demo submission completed successfully for ${data.organization_info.company_name}!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Store demo submission details
      universalFormUtils.storeSubmissionDetails(demoResponse, data.organization_info.company_name);
      console.log('💾 Demo submission details stored');
      
      // Show success modal with enhanced data
      setShowSuccessModal(true);
      console.log('🎊 Success modal displayed with enhanced feedback');
      
      // Reset form for next demo
      reset();
      setCurrentStep(0);
      setCompletedSteps(new Set());
      
      // Clean up localStorage (client-side only)
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('corporateFormDraft');
          console.log('🔄 Form reset for next demo');
        } catch (error) {
          console.warn('Failed to clean up form data:', error);
        }
      }
      
      console.log('🎯 Demo Submission Complete:', demoResponse);
      
    } catch (error) {
      console.error('❌ Demo Submission Error:', error);
      
      // Enhanced error feedback with specific error information
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Demo submission failed: ${errorMessage}. Please check your information and try again.`, {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Log detailed error information for debugging
      console.error('📊 Error Details:', {
        error: errorMessage,
        formData: JSON.stringify(data, null, 2),
        timestamp: new Date().toISOString(),
        currentStep,
        completedSteps: Array.from(completedSteps)
      });
    }
  }, [currentStep, completedSteps, handleSubmit, reset]);

  // Enhanced keyboard navigation support (client-side only)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when form is focused
      if (!event.target || !(event.target as Element).closest('.dynamic-form')) return;
      
      // Enter key on final step submits form
      if (event.key === 'Enter' && event.ctrlKey && currentStep === FORM_STEPS.length - 1) {
        event.preventDefault();
        handleSubmit(onSubmit)();
        return;
      }
      
      // Arrow keys for navigation (with Ctrl modifier to avoid conflicts)
      if (event.ctrlKey) {
        if (event.key === 'ArrowRight' && currentStep < FORM_STEPS.length - 1) {
          event.preventDefault();
          handleNext();
        } else if (event.key === 'ArrowLeft' && currentStep > 0) {
          event.preventDefault();
          handlePrevious();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, handleNext, handlePrevious, handleSubmit, onSubmit, mounted]);

  const renderStep = () => {
    const step = FORM_STEPS[currentStep];
    
    switch (step.step_id) {
      case 1: // Contact Information
        return (
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Priya Sharma"
              error={errors.contact_info?.full_name?.message}
              suggestions={[]}
              {...register("contact_info.full_name")}
            />
            
            <FormInput
              label="Business Email Address"
              icon={Mail}
              type="email"
              placeholder="e.g., priya.sharma@yourcompany.com"
              error={errors.contact_info?.email?.message}
              {...register("contact_info.email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Country"
                icon={MapPin}
                error={errors.contact_info?.country?.message}
                options={countriesData.map(country => ({
                  label: `${country.name}${country.dial_code ? ` (${country.dial_code})` : ''}`,
                  value: country.code
                }))}
                {...register("contact_info.country")}
              />

              <Controller
                name="contact_info.phone_number"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 mb-3">
                      Contact Number
                    </label>
                    <PhoneNumberInput
                      value={{ 
                        country: watchedFields.contact_info?.country || 'in', 
                        number: typeof field.value === 'string' ? field.value : field.value?.number || '' 
                      }}
                      onChange={val => {
                        console.log('📞 Phone number changed:', val);
                        field.onChange(val);
                      }}
                      placeholder="Enter your contact number"
                      error={fieldState.error?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Country code is automatically set based on your selected location.
                    </p>
                    {fieldState.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 2: // Organization Details
        return (
          <div className="space-y-6">
            <FormInput
              label="Job Title / Designation"
              icon={Briefcase}
              type="text"
              placeholder="e.g., Learning & Development Manager"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.designation}
              error={errors.organization_info?.designation?.message}
              {...register("organization_info.designation")}
            />
            
            <FormInput
              label="Company Name"
              icon={Building2}
              type="text"
              placeholder="e.g., Tata Consultancy Services"
              suggestions={AUTOCOMPLETE_SUGGESTIONS.company_name}
              error={errors.organization_info?.company_name?.message}
              {...register("organization_info.company_name")}
            />

            <FormInput
              label="Company Website (Optional)"
              icon={Globe}
              type="url"
              placeholder="https://www.yourcompany.com"
              error={errors.organization_info?.company_website?.message}
              {...register("organization_info.company_website")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Industry"
                icon={TrendingUp}
                error={errors.organization_info?.industry?.message}
                options={FORM_OPTIONS.industries}
                {...register("organization_info.industry")}
              />

              <FormSelect
                label="Company Size"
                icon={Users}
                error={errors.organization_info?.company_size?.message}
                options={FORM_OPTIONS.company_sizes}
                {...register("organization_info.company_size")}
              />
            </div>
          </div>
        );

      case 3: // Training Requirements
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Training Type"
                icon={BookOpen}
                error={errors.training_details?.training_type?.message}
                options={FORM_OPTIONS.training_types}
                {...register("training_details.training_type")}
              />

              <FormNumberInput
                label="Number of Participants"
                icon={Users}
                placeholder="e.g., 25"
                min={1}
                max={10000}
                error={errors.training_details?.participants_count?.message}
                {...register("training_details.participants_count", { valueAsNumber: true })}
              />
            </div>

            <Controller
              name="training_details.training_topics"
              control={control}
              render={({ field, fieldState }) => (
                <FormMultiSelect
                  label="Training Topics"
                  icon={Target}
                  error={fieldState.error?.message}
                  options={FORM_OPTIONS.training_topics}
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Budget Range"
                icon={DollarSign}
                error={errors.training_details?.budget_range?.message}
                options={FORM_OPTIONS.budget_ranges}
                {...register("training_details.budget_range")}
              />

              <FormSelect
                label="Training Timeline"
                icon={Calendar}
                error={errors.training_details?.timeline?.message}
                options={FORM_OPTIONS.timelines}
                {...register("training_details.timeline")}
              />
            </div>

            <FormTextArea
              label="Detailed Training Requirements"
              icon={MessageSquare}
              placeholder="Please describe your specific training needs, learning objectives, preferred delivery format (online/offline/hybrid), duration expectations, and any other requirements..."
              rows={6}
              maxLength={2000}
              error={errors.training_details?.training_requirements?.message}
              {...register("training_details.training_requirements")}
            />

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 space-y-4">
              <FormCheckbox
                label={
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms-and-services">
                      <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Terms of Service
                      </span>
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy">
                      <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Privacy Policy
                      </span>
                    </Link>
                    .
                  </span>
                }
                error={errors.consent?.terms_accepted?.message}
                {...register("consent.terms_accepted")}
              />

              <FormCheckbox
                label={
                  <span className="text-sm">
                    I consent to the collection and processing of my data for the purpose of handling this corporate training inquiry and providing relevant services.
                  </span>
                }
                error={errors.consent?.data_collection_consent?.message}
                {...register("consent.data_collection_consent")}
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
    <section className="min-h-screen w-full bg-white dark:bg-slate-900">
      <div className="w-full dynamic-form">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {/* Minimal Header */}
          <div className="w-full border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2"
              >
                {FORM_CONFIG.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 dark:text-slate-400 text-base sm:text-lg"
              >
                Tell us about your training needs
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm mt-2"
              >
                💡 Tip: Use Ctrl + ← → arrow keys to navigate between steps, Ctrl + Enter to submit on final step
              </motion.p>
            </div>
          </div>

          {/* Minimal Form Content */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <StepProgress 
                steps={FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8" noValidate>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {/* Minimal Step Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold">
                        {FORM_STEPS[currentStep]?.step_id}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {FORM_STEPS[currentStep]?.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {FORM_STEPS[currentStep]?.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Form Fields Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {renderStep()}
                  </motion.div>
                </motion.div>

                {/* Minimal Navigation Footer */}
                <div className="w-full border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        currentStep === 0
                          ? 'text-blue-300 dark:text-blue-600 cursor-not-allowed'
                          : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {currentStep === FORM_STEPS.length - 1 ? (
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors ${
                          loading 
                            ? 'bg-blue-200 dark:bg-blue-800 text-blue-500 dark:text-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                        } rounded-lg`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Demo</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 text-sm font-medium transition-colors rounded-lg"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
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

                <div className="p-8 text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    <strong>Demo Completed Successfully!</strong><br/>
                    This was a demonstration of our corporate training inquiry form. In a live environment, your request would be processed and our team would contact you within 24 hours.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Demo form validation completed successfully</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Form data processed and logged for demo purposes</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Ready for another demo submission</span>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setShowSuccessModal(false)}
                    suppressHydrationWarning
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    Try Another Demo
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

// Corporate Training CTA Component
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