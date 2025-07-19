"use client";
/**
 * Multi-Step Educator Registration Form
 * 
 * Comprehensive 4-step educator onboarding form with full integration
 * to the Universal Form Model backend system. Features step-by-step guidance,
 * progressive validation, and mobile-first design following the MEDH design system.
 * 
 * FORM STRUCTURE:
 * ==============
 * Step 1: Personal Info (full_name, email, country, phone_number)
 * Step 2: Professional Details (current_role, experience_years, expertise_areas, education_background)
 * Step 3: Teaching Preferences (preferred_subjects, teaching_mode, availability, portfolio_links)
 * Step 4: Terms & Review (terms_accepted, background_check_consent)
 * 
 * @author MEDH Development Team
 * @version 3.0.0 (Multi-Step Form)
 * @since 2024-01-15
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Icons
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  User,
  Briefcase,
  BookOpen,
  FileCheck,
  Phone,
  Mail,
  Calendar,
  Users,
  Globe,
  GraduationCap,
  MessageSquare,
  Send,
  MapPin,
  Award,
  Check,
  AlertCircle,
  Loader2,
  Video,
  FileText,
  Building2,
  Home // Add Home icon for navigation
} from 'lucide-react';

// Hooks and Utilities
import { toast } from 'react-toastify';
import countriesData from "@/utils/countrycode.json";

// Phone Number Component
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';
// Import the new educator registration API
import { submitEducatorRegistrationForm, IEducatorRegistrationFormData } from '@/apis/educatorForm.api';

// Form data interface - Flattened to simplify react-hook-form management
interface IEducatorFormData {
  // contact_info
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
  
  // professional_info
  current_role: string;
  experience_years: string;
  expertise_areas: string[];
  education_background: string;
  current_company?: string | null; // Allow null or undefined for optional fields
  
  // teaching_preferences
  preferred_subjects: string[];
  teaching_mode: string[];
  availability: string;
  portfolio_links?: string | null; // Allow null or undefined
  demo_video_url?: string | null; // Allow null or undefined
  has_resume: boolean; // Renamed from resume_upload to match backend
  
  // consent
  terms_accepted: boolean;
  background_check_consent: boolean;

  // additional_notes & message
  additional_notes?: string | null; // Allow null or undefined
  message?: string | null; // Allow null or undefined as it's optional in new schema
}

// Form step configuration
interface IFormStep {
  stepId: string;
  title: string;
  description: string;
  fields: Array<keyof IEducatorFormData>; // Use keyof IEducatorFormData for type safety
}

// Form steps configuration
const EDUCATOR_FORM_STEPS: IFormStep[] = [
  {
    stepId: "contact_info",
    title: "Personal & Contact Info",
    description: "Let's start with your basic details.",
    fields: ["full_name", "email", "phone_number", "country"]
  },
  {
    stepId: "professional_details", 
    title: "Professional Background",
    description: "Tell us about your experience.",
    fields: ["current_role", "experience_years", "expertise_areas", "education_background", "current_company"] // Added current_company
  },
  {
    stepId: "teaching_preferences",
    title: "Teaching Preferences & Assets", 
    description: "What would you like to teach and share?",
    fields: ["preferred_subjects", "teaching_mode", "availability", "portfolio_links", "demo_video_url", "has_resume"] // Updated fields
  },
  {
    stepId: "consent_review", // Renamed stepId for clarity
    title: "Consent & Final Notes",
    description: "Review terms and add any final notes.",
    fields: ["terms_accepted", "background_check_consent", "additional_notes", "message"] // Added message and additional_notes
  }
];

// Updated constants to match backend enum values precisely
const EXPERIENCE_YEARS_OPTIONS = [
  "0-1", "1-3", "3-5", "5-10", "10+"
];

const EXPERTISE_AREAS_OPTIONS = [
  "Software Development", "Data Science", "Artificial Intelligence", "Machine Learning",
  "Digital Marketing", "UI/UX Design", "Cloud Computing", "Cybersecurity",
  "Blockchain", "Project Management", "Business Analytics", "Vedic Mathematics",
  "Competitive Programming", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Other"
];

const TEACHING_MODES_OPTIONS = [
  "Online Live Sessions", "Recorded Content", "One-on-One Mentoring", "In-Person Workshops"
];

const AVAILABILITY_OPTIONS = [
  "weekdays", "weekends", "flexible", "evenings", "mornings"
];

const PREFERRED_SUBJECTS_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History",
  "Geography", "Economics", "Business Studies", "Accountancy", "English Language",
  "Literature", "Physical Education", "Art & Design", "Music", "Environmental Science",
  "Data Structures & Algorithms", "Web Development (Frontend)", "Web Development (Backend)",
  "Mobile App Development", "DevOps", "Cybersecurity Basics", "Cloud Platforms (AWS/Azure/GCP)",
  "Database Management (SQL/NoSQL)", "Digital Marketing Strategy", "SEO & SEM",
  "Social Media Marketing", "Content Marketing", "Email Marketing", "UI/UX Fundamentals",
  "Figma/Sketch/Adobe XD", "User Research", "Prototyping", "Machine Learning Algorithms",
  "Deep Learning", "Natural Language Processing", "Computer Vision", "Data Analysis with Python/R",
  "Statistics for Data Science", "Big Data Technologies", "Vedic Mathematics Shortcuts",
  "Mental Math Techniques", "Quantitative Aptitude", "Reasoning Ability", "Verbal Ability",
  "Interview Preparation", "Resume Building", "Communication Skills", "Public Speaking", "Other"
];

// Universal Form Model Constants
const UNIVERSAL_FORM_CONSTANTS = {
  FORM_TYPE: 'educator_registration',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
} as const;

// Unified validation schema for the entire flattened form data
const validationSchema: yup.ObjectSchema<IEducatorFormData> = yup.object({
  // Contact Info
    full_name: yup
      .string()
      .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Full name can only contain alphabets, spaces, hyphens, and apostrophes")
      .required("Full name is required"),
      
    email: yup
      .string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address")
      .required("Email is required"),
      
    phone_number: yup
      .string()
      .required("Phone number is required"),
  
  country: yup
    .string()
    .required("Country is required"),

  // Professional Info
    current_role: yup
      .string()
      .trim()
      .min(2, "Current role must be at least 2 characters")
      .max(100, "Current role cannot exceed 100 characters")
      .required("Current role is required"),
      
    experience_years: yup
      .string()
    .oneOf(EXPERIENCE_YEARS_OPTIONS, "Please select a valid experience range")
    .required("Years of experience is required"),
      
    expertise_areas: yup
      .array()
    .of(yup.string().max(100, "Expertise area cannot exceed 100 characters"))
    .min(1, "Please select at least one expertise area")
      .required("Areas of expertise are required"),
      
    education_background: yup
      .string()
      .trim()
    .min(5, "Educational background must be at least 5 characters")
    .max(200, "Educational background cannot exceed 200 characters")
    .required("Educational background is required"),
  
  current_company: yup
    .string()
    .trim()
    .max(200, "Company name cannot exceed 200 characters")
    .nullable() // Allow null
    .transform(value => (value === '' ? null : value)), // Transform empty string to null

  // Teaching Preferences
    preferred_subjects: yup
      .array()
      .of(yup.string())
    .min(1, "Please select at least one preferred subject")
    .required("Preferred subjects are required"),
      
    teaching_mode: yup
      .array()
    .of(yup.string().oneOf(TEACHING_MODES_OPTIONS, "Invalid teaching mode selected"))
      .min(1, "Please select at least one teaching mode")
    .required("Teaching mode is required"),
      
    availability: yup
      .string()
    .oneOf(AVAILABILITY_OPTIONS, "Please select a valid availability option")
    .required("Availability is required"),
  
  portfolio_links: yup
    .string()
    .trim()
    .url("Please enter a valid URL for portfolio links")
    .nullable() // Allow null
    .transform(value => (value === '' ? null : value)), // Transform empty string to null
  
  demo_video_url: yup
    .string()
    .trim()
    .url("Please enter a valid URL for demo video")
    .nullable() // Allow null
    .transform(value => (value === '' ? null : value)), // Transform empty string to null
  
  has_resume: yup
    .boolean()
    .oneOf([true], "Please confirm you have a resume to proceed.")
    .required("Resume confirmation is required."),

  // Consent & Additional
    terms_accepted: yup
      .boolean()
    .oneOf([true], "You must accept the terms to proceed")
    .required("Terms acceptance is required"),
      
    background_check_consent: yup
      .boolean()
    .oneOf([true], "You must consent to a background check to proceed.")
    .required("Background check consent is required."),
  
  additional_notes: yup
    .string()
    .trim()
    .max(2000, "Notes cannot exceed 2000 characters")
    .nullable() // Allow null
    .transform(value => (value === '' ? null : value)), // Transform empty string to null
  
  message: yup
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters")
    .nullable() // Allow null
    .transform(value => (value === '' ? null : value)), // Transform empty string to null
}) as yup.ObjectSchema<IEducatorFormData>; // Cast to ensure correct type

const MultiStepEducatorForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // Changed from showSuccessModal
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // Initialize useRouter

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
    setValue
  } = useForm<IEducatorFormData>({
    resolver: yupResolver(validationSchema), // Use the unified validation schema
    defaultValues: {
      full_name: '',
      email: '',
      country: 'IN',
      phone_number: '+91',
      current_role: '',
      experience_years: '',
      expertise_areas: [],
      education_background: '',
      current_company: null, // Default to null for optional string fields
      preferred_subjects: [],
      teaching_mode: [],
      availability: '',
      portfolio_links: null, // Default to null
      demo_video_url: null, // Default to null
      has_resume: false,
      terms_accepted: false,
      background_check_consent: false,
      additional_notes: null, // Default to null
      message: null, // Default to null
    }
  });

  // Watch for country changes to sync with phone input
  const watchedCountry = watch('country');
  const watchedPhoneNumber = watch('phone_number');

  // Debug current form values
  useEffect(() => {
    console.log('Current form values:', {
      country: watchedCountry,
      phone: watchedPhoneNumber,
      allValues: getValues()
    });
  }, [watchedCountry, watchedPhoneNumber, getValues]);

  // Sync phone input when country changes
  useEffect(() => {
    if (watchedCountry && watchedPhoneNumber) {
      // Trigger a re-render of the phone input with the new country
      setValue('phone_number', watchedPhoneNumber);
    }
  }, [watchedCountry, setValue]);

  // Remove auto-save functionality to prevent re-renders
  // Auto-save will only happen when user navigates between steps or submits

  // Load saved form data (simplified)
  useEffect(() => {
    if (mounted) {
      try {
        const savedData = localStorage.getItem('educatorFormDraft');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Only load if data is less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            const { currentStep: savedStep, completedSteps: savedCompleted, timestamp, ...formData } = parsed;
            // Ensure null for optional string fields when restoring
            const restoredData = {
              ...formData,
              current_company: formData.current_company === '' ? null : formData.current_company,
              portfolio_links: formData.portfolio_links === '' ? null : formData.portfolio_links,
              demo_video_url: formData.demo_video_url === '' ? null : formData.demo_video_url,
              additional_notes: formData.additional_notes === '' ? null : formData.additional_notes,
              message: formData.message === '' ? null : formData.message,
            };
            reset(restoredData);
            setCurrentStep(savedStep || 0);
            setCompletedSteps(new Set(savedCompleted || []));
          }
        }
      } catch (error) {
        console.log('Could not restore form data:', error);
      }
    }
  }, [mounted, reset]);

  // Initialize India as default country and phone number
  const initializeIndiaDefault = () => {
    const indiaData = countriesData.find((country: any) => country.code === 'IN');
    if (indiaData && indiaData.dial_code) {
      setValue('country', 'IN');
      setValue('phone_number', indiaData.dial_code);
    }
  };

  // Force India as default on mount
  useEffect(() => {
    if (mounted) {
      console.log('Setting India as default...');
      // Clear any existing localStorage to ensure fresh start
      localStorage.removeItem('educatorFormDraft');
      
      // Force reset with India defaults
      setTimeout(() => {
        console.log('Resetting form with India defaults...');
        reset({
          full_name: '',
          email: '',
          country: 'IN',
          phone_number: '+91',
          current_role: '',
          experience_years: '',
          expertise_areas: [],
          education_background: '',
          current_company: null,
          preferred_subjects: [],
          teaching_mode: [],
          availability: '',
          portfolio_links: null,
          demo_video_url: null,
          has_resume: false,
          terms_accepted: false,
          background_check_consent: false,
          additional_notes: null,
          message: null,
        });
        setCurrentStep(0);
        setCompletedSteps(new Set());
        console.log('Form reset complete with India defaults');
      }, 100);
    }
  }, [mounted, reset]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepFields = EDUCATOR_FORM_STEPS[currentStep].fields;
    const isValid = await trigger(currentStepFields);
    
    if (!isValid) {
      toast.error(`Please complete all required fields in ${EDUCATOR_FORM_STEPS[currentStep].title}`);
    } else {
      toast.success(`${EDUCATOR_FORM_STEPS[currentStep].title} completed successfully!`);
    }
    
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < EDUCATOR_FORM_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: IEducatorFormData): Promise<void> => {
    setLoading(true); // Set loading state
    try {
      console.log('Original form data:', data);

      // Transform flattened form data to nested IEducatorRegistrationFormData for backend
      const transformedData: IEducatorRegistrationFormData = {
        form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
        priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
        status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
        source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
        
        contact_info: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`,
          country: data.country,
        },
        
        professional_info: {
          current_role: data.current_role,
          experience_years: data.experience_years,
          expertise_areas: data.expertise_areas,
          education_background: data.education_background,
          current_company: data.current_company || '', // Ensure empty string if null
        },
        
        teaching_preferences: {
          preferred_subjects: data.preferred_subjects,
          teaching_mode: data.teaching_mode,
          availability: data.availability,
          portfolio_links: data.portfolio_links || null, // Ensure null if empty string
          demo_video_url: data.demo_video_url || null,   // Ensure null if empty string
          has_resume: data.has_resume,
        },
        
        consent: {
          terms_accepted: data.terms_accepted,
          background_check_consent: data.background_check_consent,
        },
        
        additional_notes: data.additional_notes || '', // Ensure empty string if null
        message: data.message || '', // Ensure empty string if null, as per new schema, message is optional
        
        submission_metadata: {
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString(),
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          form_version: '1.0', // Using 1.0 for this specific form implementation
          validation_passed: true, // Assuming client-side validation passes
        }
      };

      console.log('Submitting educator registration inquiry (transformed):', transformedData);
      console.log('Transformed Data Details:', JSON.stringify(transformedData, null, 2));

      const response = await submitEducatorRegistrationForm(transformedData);

      if (response.status === 'success') {
        console.log('Educator registration inquiry submitted successfully:', response);
        setIsSubmittedSuccessfully(true); // Set success state for inline message
          reset();
          setCurrentStep(0);
          setCompletedSteps(new Set());
          localStorage.removeItem('educatorFormDraft');
      } else {
        console.error("Educator registration inquiry submission failed:", response.error || response.message);
        toast.error(response.message || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Reusable Form Input Components - Standardized like MultiStepSchoolPartnershipForm.tsx
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

// Progress Indicator Component - Standardized like MultiStepSchoolPartnershipForm.tsx
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
        {EDUCATOR_FORM_STEPS.map((step, index) => (
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
            {index < EDUCATOR_FORM_STEPS.length - 1 && (
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
          style={{ width: `${(completedSteps.size / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

  // Helper function to render step content
  function renderStepContent() {
    const step = EDUCATOR_FORM_STEPS[currentStep];
    
    switch (step.stepId) {
      case 'contact_info':
        return (
          <div className="space-y-8">
            <FormInput
              label="Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Dr. Jane Doe"
              required
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            
            <FormInput
              label="Official Email"
              icon={Mail}
              type="email"
              placeholder="e.g., jane.doe@example.com"
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
                      block w-full pl-12 pr-4 border-2 rounded-xl shadow-sm text-base font-medium
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${errors.country
                        ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                      }
                      dark:text-white
                    `}
                    {...register("country")}
                    onChange={(e) => {
                      const selectedCountry = e.target.value;
                      // Update the country field
                      setValue('country', selectedCountry);
                      
                      // Get the current phone number
                      const currentPhone = getValues('phone_number');
                      
                      // Find the country data to get the dial code
                      const countryData = countriesData.find((country: any) => country.code === selectedCountry);
                      
                      if (countryData && countryData.dial_code) {
                        // If there's already a phone number, preserve the number part
                        if (currentPhone && currentPhone.startsWith('+')) {
                          // Extract the number part (remove existing country code)
                          const numberPart = currentPhone.replace(/^\+\d+\s*/, '');
                          // Add new country code (dial_code already includes the +)
                          const newPhoneNumber = `${countryData.dial_code} ${numberPart}`;
                          setValue('phone_number', newPhoneNumber);
                        } else if (currentPhone) {
                          // If phone number doesn't start with +, add country code
                          const newPhoneNumber = `${countryData.dial_code} ${currentPhone}`;
                          setValue('phone_number', newPhoneNumber);
                        } else {
                          // If no phone number, just add the country code
                          setValue('phone_number', `${countryData.dial_code}`);
                        }
                      }
                    }}
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
                render={({ field, fieldState }) => {
                  const selectedCountry = getValues('country') || 'IN';
                  const currentPhoneNumber = field.value || '';
                  
                  // Watch for country changes and update phone number accordingly
                  const watchedCountry = watch('country');
                  
                  return (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <PhoneNumberInput
                        value={{ 
                          country: watchedCountry || selectedCountry, 
                          number: currentPhoneNumber 
                        }}
                        onChange={val => {
                          field.onChange(val.number);
                          // Also update the country field if it changed in the phone input
                          if (val.country !== watchedCountry) {
                            setValue('country', val.country);
                          }
                        }}
                        placeholder="Enter your phone number"
                        error={fieldState.error?.message}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
        );

      case 'professional_details':
        return (
          <div className="space-y-8">
            <FormInput
              label="Current Role/Position"
              icon={Briefcase}
              type="text"
              placeholder="e.g., Senior Software Engineer, Data Scientist"
              required
              error={errors.current_role?.message}
              {...register("current_role")}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Award className={`h-5 w-5 ${errors.experience_years ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <select
                  className={`
                    block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                    focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                    ${errors.experience_years
                      ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                    }
                    dark:text-white
                  `}
                  {...register("experience_years")}
                >
                  <option value="">Select experience range</option>
                  {EXPERIENCE_YEARS_OPTIONS.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              {errors.experience_years && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.experience_years.message}</span>
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Areas of Expertise (Select all that apply) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {EXPERTISE_AREAS_OPTIONS.map(area => (
                  <label key={area} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={area}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      {...register("expertise_areas")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{area}</span>
                  </label>
                ))}
              </div>
              {errors.expertise_areas && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.expertise_areas.message}</span>
                </motion.div>
              )}
            </div>

            <FormTextArea
              label="Highest Educational Background"
              icon={GraduationCap}
              placeholder="e.g., Master's in Computer Science from XYZ University, PhD in Data Science from ABC Institute"
              rows={3}
              required
              error={errors.education_background?.message}
              {...register("education_background")}
            />

            <FormInput
              label="Current Company (Optional)"
              icon={Building2}
              type="text"
              placeholder="e.g., Google, Microsoft, Self-Employed"
              error={errors.current_company?.message}
              {...register("current_company")}
            />
          </div>
        );

      case 'teaching_preferences':
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Preferred Subjects to Teach (Select all that apply) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {PREFERRED_SUBJECTS_OPTIONS.map(subject => (
                  <label key={subject} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={subject}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      {...register("preferred_subjects")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{subject}</span>
                  </label>
                ))}
              </div>
              {errors.preferred_subjects && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.preferred_subjects.message}</span>
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Preferred Teaching Modes (Select all that apply) <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {TEACHING_MODES_OPTIONS.map(mode => (
                  <label key={mode} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={mode}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      {...register("teaching_mode")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{mode}</span>
                  </label>
                ))}
              </div>
              {errors.teaching_mode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.teaching_mode.message}</span>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Preferred Availability <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className={`h-5 w-5 ${errors.availability ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <select
                  className={`
                    block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                    focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                    ${errors.availability
                      ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
                    }
                    dark:text-white
                  `}
                  {...register("availability")}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {errors.availability && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.availability.message}</span>
                </motion.div>
              )}
            </div>

            <FormInput
              label="Portfolio/Personal Website Link (Optional)"
              icon={Globe}
              type="url"
              placeholder="https://www.yourportfolio.com"
              error={errors.portfolio_links?.message}
              {...register("portfolio_links")}
            />

            <FormInput
              label="Demo Video Link (Optional)"
              icon={Video}
              type="url"
              placeholder="https://www.youtube.com/watch?v=your-demo"
              error={errors.demo_video_url?.message}
              {...register("demo_video_url")}
            />

            <FormCheckbox
              label={
                <span className="text-base">
                  I confirm I have an up-to-date resume/CV.
                </span>
              }
              required
              error={errors.has_resume?.message}
              {...register("has_resume")}
            />
          </div>
        );

      case 'consent_review':
        return (
          <div className="space-y-8">
            <FormTextArea
              label="Additional Notes (Optional)"
              icon={MessageSquare}
              placeholder="Any specific questions, teaching philosophy, or needs you'd like to share?"
              rows={4}
              error={errors.additional_notes?.message}
              {...register("additional_notes")}
            />

            <FormTextArea
              label="Message / Cover Letter (Optional)"
              icon={FileText}
              placeholder="Write a brief message or cover letter (max 2000 characters)"
              rows={4}
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
                    I consent to a background check as part of the application process.
                  </span>
                }
                required
                error={errors.background_check_consent?.message}
                {...register("background_check_consent")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

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
          layout
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
                Thank you for your interest in joining Medh as an educator! Our team will review your application and contact you within 1–2 working days.
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
                  Educator Registration Application
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
                >
                  Join our team of expert educators and help shape the future of learning! We'll reach out within 1–2 working days.
                </motion.p>
              </div>

              {/* Enhanced Mobile-First Form Content */}
              <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
                <ProgressIndicator
                  currentStep={currentStep + 1}
                  totalSteps={EDUCATOR_FORM_STEPS.length}
                  completedSteps={completedSteps}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div
                    className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
                  >
                    {/* Step Header (Moved inside renderStepContent function for better control) */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
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
                              {currentStep + 1}
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                              {EDUCATOR_FORM_STEPS[currentStep]?.title}
                            </h2>
                          </div>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {EDUCATOR_FORM_STEPS[currentStep]?.description}
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
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className={`
                        flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base
                        ${currentStep === 0
                          ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Previous
                    </button>

                    {currentStep < EDUCATOR_FORM_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Next
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
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
};

export default MultiStepEducatorForm; 