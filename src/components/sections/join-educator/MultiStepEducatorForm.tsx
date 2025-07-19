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
import React, { useState, useEffect } from 'react';
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
      country: 'in',
      phone_number: '',
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

  const watchedFields = watch();

  // Auto-save form data
  useEffect(() => {
    if (mounted) {
      const formData = getValues();
      localStorage.setItem('educatorFormDraft', JSON.stringify({
        ...formData,
        currentStep,
        completedSteps: Array.from(completedSteps),
        timestamp: Date.now()
      }));
    }
  }, [watchedFields, currentStep, completedSteps, mounted, getValues]);

  // Load saved form data
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

  // Form Input Components (Reusing existing components, adjusted for new types/props if needed)
  interface IFormInputProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    error?: string;
    [key: string]: any;
  }
  
  const FormInput: React.FC<IFormInputProps> = ({ 
    label, 
    icon: Icon, 
    error, 
    type, 
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
              className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-md sm:rounded-lg focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-2 transition-all duration-200 touch-manipulation"
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

  // Helper function to render step content
  function renderStepContent() {
    const step = EDUCATOR_FORM_STEPS[currentStep];
    
    switch (step.stepId) {
      case 'contact_info':
        return (
                  <div className="space-y-6">
            <FormInput
              label="Full Name"
              icon={User}
                          type="text"
              placeholder="e.g., Dr. Jane Doe"
              error={errors.full_name?.message}
                          {...register("full_name")}
                        />
            
            <FormInput
              label="Official Email"
              icon={Mail}
                          type="email"
              placeholder="e.g., jane.doe@example.com"
              error={errors.email?.message}
                          {...register("email")}
                        />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          </div>
                        )}
                      />
              
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
            </div>
          </div>
        );

      case 'professional_details':
        return (
                  <div className="space-y-6">
            <FormInput
              label="Current Role/Position"
              icon={Briefcase}
                          type="text"
              placeholder="e.g., Senior Software Engineer, Data Scientist"
              error={errors.current_role?.message}
                          {...register("current_role")}
                        />

                    <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Years of Experience
                      </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                        <select
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.experience_years ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                          {...register("experience_years")}
                        >
                  <option value="">Select experience range</option>
                  {EXPERIENCE_YEARS_OPTIONS.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                        </select>
                      </div>
              {errors.experience_years && (
                <p className="text-red-500 text-xs mt-1">{errors.experience_years.message}</p>
              )}
                    </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Areas of Expertise (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {EXPERTISE_AREAS_OPTIONS.map(area => (
                  <label key={area} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={area}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                      {...register("expertise_areas")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{area}</span>
                  </label>
                ))}
              </div>
              {errors.expertise_areas && (
                <p className="text-red-500 text-sm mt-1">{errors.expertise_areas.message}</p>
              )}
            </div>

            <FormTextArea
              label="Highest Educational Background"
              icon={GraduationCap}
              placeholder="e.g., Master's in Computer Science from XYZ University, PhD in Data Science from ABC Institute"
                          rows={3}
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
                  <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred Subjects to Teach (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {PREFERRED_SUBJECTS_OPTIONS.map(subject => (
                  <label key={subject} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={subject}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                      {...register("preferred_subjects")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{subject}</span>
                  </label>
                ))}
              </div>
              {errors.preferred_subjects && (
                <p className="text-red-500 text-sm mt-1">{errors.preferred_subjects.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred Teaching Modes (Select all that apply)
              </label>
              <div className="space-y-3">
                {TEACHING_MODES_OPTIONS.map(mode => (
                  <label key={mode} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      value={mode}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                      {...register("teaching_mode")}
                    />
                    <span className="text-gray-900 dark:text-white text-sm leading-relaxed">{mode}</span>
                  </label>
                ))}
              </div>
              {errors.teaching_mode && (
                <p className="text-red-500 text-sm mt-1">{errors.teaching_mode.message}</p>
              )}
            </div>

                    <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Preferred Availability
                      </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                        <select
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.availability ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                          {...register("availability")}
                        >
                          <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                        </select>
                      </div>
              {errors.availability && (
                <p className="text-red-500 text-xs mt-1">{errors.availability.message}</p>
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
                <span className="text-sm">
                  I confirm I have an up-to-date resume/CV.
                </span>
              }
              error={errors.has_resume?.message}
              {...register("has_resume")}
            />
          </div>
        );

      case 'consent_review': // Updated stepId
        return (
          <div className="space-y-6">
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
              <FormCheckbox
                label={
                  <span className="text-sm">
                    I consent to a background check as part of the application process.
                  </span>
                }
                error={errors.background_check_consent?.message}
                          {...register("background_check_consent")}
                        />
                    </div>

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
                      </div>
        );

      default:
        return null;
    }
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
          {isSubmittedSuccessfully ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 text-center min-h-[400px]"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <CheckCircle className="text-white" size={48} strokeWidth={2.5} />
              </motion.div>
              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight"
              >
                Application Submitted Successfully!
              </motion.h2>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg mb-8 leading-relaxed"
              >
                Thank you for your interest in joining Medh as an educator! Our team will review your application and get in touch with you shortly.
              </motion.p>
              <motion.button
                onClick={() => router.push('/')} // Navigate to home page
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 min-h-[48px]"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                    Educator Registration Application
                  </h1>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
                >
                  Join our team of expert educators and help shape the future of learning!
                </motion.p>
                  </div>

              {/* Form Content */}
              <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
                {/* Step Progress */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center justify-between">
                    {EDUCATOR_FORM_STEPS.map((step, index) => {
                      const isCompleted = completedSteps.has(index);
                      const isCurrent = index === currentStep;
                      
                      return (
                        <React.Fragment key={step.stepId}>
                          <div className="flex flex-col items-center space-y-2">
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
                                    ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-sm' 
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

                            <div className="text-center max-w-24 md:max-w-32">
                              <p className={`text-xs md:text-sm font-medium transition-colors leading-tight text-center ${
                                isCurrent 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : isCompleted 
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-500 dark:text-gray-500'
                              }`}>
                                {step.title}
                              </p>
                            </div>
                          </div>
                          
                          {index < EDUCATOR_FORM_STEPS.length - 1 && (
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

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 md:mt-10">
                  {/* Step Content Card */}
                  <div
                    className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
                  >
                    {/* Step Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-slate-600/60"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg shadow-lg">
                          {currentStep + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                            {EDUCATOR_FORM_STEPS[currentStep]?.title}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {EDUCATOR_FORM_STEPS[currentStep]?.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep} // Only this inner div changes key, forcing re-render of step content only
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </form>
              </div>

              {/* Navigation Footer */}
              <div className="relative bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
                <div className="flex justify-between items-center gap-3">
                  <motion.button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
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

                {currentStep === EDUCATOR_FORM_STEPS.length - 1 ? (
                    <motion.button
                    type="submit"
                      onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation text-sm sm:text-base ${
                        loading 
                          ? 'bg-slate-200/60 text-slate-500 cursor-not-allowed dark:bg-slate-700/60 dark:text-slate-400' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25 hover:shadow-purple-500/40'
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
                          <span className="hidden xs:inline">Submit Application</span>
                          <span className="xs:hidden">Submit</span>
                      </>
                    )}
                    </motion.button>
                ) : (
                    <motion.button
                    type="button"
                    onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 min-h-[44px] touch-manipulation text-sm sm:text-base"
                    >
                      <span className="hidden xs:inline">Next Step</span>
                      <span className="xs:hidden">Next</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                )}
              </div>
          </div>
            </>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default MultiStepEducatorForm; 