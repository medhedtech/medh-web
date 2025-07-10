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
  CheckCircle,
  User,
  School,
  Target,
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
  GraduationCap
} from 'lucide-react';

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';
import { toast } from 'react-toastify';

// Form data structure
interface ISchoolFormData {
  // Step 1: Contact Person Details
  full_name: string;
  designation: string;
  email: string;
  country: string;
  phone_number: string;
  
  // Step 2: School Information
  school_name: string;
  school_type: string;
  city_state: string;
  student_count: string;
  website?: string | null;
  
  // Step 3: Partnership Intent
  partnership_services: string[];
  additional_notes?: string;
  terms_accepted: boolean;
}

// Form step configuration
interface IFormStep {
  stepId: string;
  title: string;
  description: string;
  fields: string[];
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
    fields: ["partnership_services", "additional_notes", "terms_accepted"]
  }
];

// Partnership service options
const PARTNERSHIP_SERVICES = [
  "Student learning solutions",
  "Teacher training",
  "LMS / Digital infrastructure", 
  "Customized curriculum support",
  "Career guidance and assessments",
  "Other"
];

// School types
const SCHOOL_TYPES = [
  "CBSE",
  "ICSE", 
  "State Board",
  "IB (International Baccalaureate)",
  "Cambridge (IGCSE)",
  "Other"
];

// Student count ranges
const STUDENT_COUNT_RANGES = [
  "Up to 100",
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

// Validation schemas
const stepValidationSchemas = {
  contact_details: yup.object({
    full_name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain alphabets, spaces, hyphens, and apostrophes")
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
  }),
  
  school_info: yup.object({
    school_name: yup
      .string()
      .trim()
      .min(2, "School name must be at least 2 characters")
      .max(200, "School name cannot exceed 200 characters")
      .required("School name is required"),
      
    school_type: yup
      .string()
      .required("School type is required"),
      
    city_state: yup
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location cannot exceed 100 characters")
      .required("City & State is required"),
      
    student_count: yup
      .string()
      .required("Student count is required"),
      
    website: yup
      .string()
      .trim()
      .matches(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/,
        "Please enter a valid website URL"
      )
      .nullable()
      .transform(value => value === '' ? null : value),
  }),
  
  partnership_intent: yup.object({
    partnership_services: yup
      .array()
      .of(yup.string())
      .min(1, "Please select at least one service")
      .required("Please select your areas of interest"),
      
    additional_notes: yup
      .string()
      .trim()
      .max(1000, "Notes cannot exceed 1000 characters")
      .nullable()
      .transform(value => value === '' ? null : value),
      
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms to proceed")
      .required("Acceptance of terms is required"),
  }),
};

// Complete form validation schema
const completeFormSchema = yup.object().shape({
  ...stepValidationSchemas.contact_details.fields,
  ...stepValidationSchemas.school_info.fields,
  ...stepValidationSchemas.partnership_intent.fields,
});

const MultiStepSchoolPartnershipForm: React.FC = () => {
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
    setValue
  } = useForm<ISchoolFormData>({
    resolver: yupResolver(completeFormSchema),
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
      terms_accepted: false
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
        completedSteps: Array.from(completedSteps),
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

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepFields = FORM_STEPS[currentStep].fields;
    const isValid = await trigger(currentStepFields as any);
    
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

  const onSubmit = async (data: ISchoolFormData): Promise<void> => {
    try {
      const transformedData = {
        form_type: UNIVERSAL_FORM_CONSTANTS.FORM_TYPE,
        priority: UNIVERSAL_FORM_CONSTANTS.DEFAULT_PRIORITY,
        status: UNIVERSAL_FORM_CONSTANTS.DEFAULT_STATUS,
        source: UNIVERSAL_FORM_CONSTANTS.SOURCE,
        
        contact_info: {
          full_name: data.full_name.trim(),
          designation: data.designation.trim(),
          email: data.email.toLowerCase().trim(),
          phone_number: data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`,
          country: data.country,
        },
        
        school_info: {
          school_name: data.school_name.trim(),
          school_type: data.school_type,
          city_state: data.city_state.trim(),
          student_count: data.student_count,
          website: data.website?.trim() || '',
        },
        
        partnership_info: {
          services_of_interest: data.partnership_services,
          additional_notes: data.additional_notes?.trim() || '',
        },
        
        terms_accepted: data.terms_accepted,
        
        submission_metadata: {
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString(),
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          form_version: '1.0',
        }
      };

      console.log('Submitting school partnership inquiry:', transformedData);

      await postQuery({
        url: apiUrls?.CorporateTraining?.addCorporate,
        postData: transformedData,
        onSuccess: (response: any) => {
          console.log('School partnership inquiry submitted successfully:', response);
          setShowSuccessModal(true);
          reset();
          setCurrentStep(0);
          setCompletedSteps(new Set());
          localStorage.removeItem('schoolPartnershipDraft');
        },
        onFail: (error: any) => {
          console.error("School partnership inquiry submission failed:", error);
          toast.error("Failed to submit application. Please try again.");
        },
      });
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                School/Institutes Partnership Application
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2"
            >
              Complete the form to begin your partnership journey with us. We'll reach out within 1–2 working days.
            </motion.p>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
            {/* Step Progress */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between">
                {FORM_STEPS.map((step, index) => {
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
                      
                      {index < FORM_STEPS.length - 1 && (
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
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg sm:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 sm:mb-8"
              >
                {/* Step Header */}
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

              {currentStep === FORM_STEPS.length - 1 ? (
                <motion.button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
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

        {/* Success Modal */}
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
                    Application Submitted!
                  </h2>
                </div>

                <div className="p-8 text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    Thank you for your interest in partnering with us! Our team will review your application and contact you within 1–2 working days.
                  </p>
                  
                  <motion.button
                    onClick={() => setShowSuccessModal(false)}
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

  // Helper function to render step content
  function renderStepContent() {
    const step = FORM_STEPS[currentStep];
    
    switch (step.stepId) {
      case 'contact_details':
        return (
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              icon={User}
              type="text"
              placeholder="e.g., Dr. Priya Sharma"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            
            <FormInput
              label="Designation / Role"
              icon={Award}
              type="text"
              placeholder="e.g., Principal, Academic Coordinator, Trustee"
              error={errors.designation?.message}
              {...register("designation")}
            />

            <FormInput
              label="Official Email"
              icon={Mail}
              type="email"
              placeholder="e.g., principal@yourschool.edu.in"
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
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 'school_info':
        return (
          <div className="space-y-6">
            <FormInput
              label="School Name"
              icon={School}
              type="text"
              placeholder="e.g., Delhi Public School, Bangalore"
              error={errors.school_name?.message}
              {...register("school_name")}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                School Type / Board
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <select
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.school_type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                  {...register("school_type")}
                >
                  <option value="">Select school type</option>
                  {SCHOOL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.school_type && (
                <p className="text-red-500 text-xs mt-1">{errors.school_type.message}</p>
              )}
            </div>

            <FormInput
              label="City & State"
              icon={MapPin}
              type="text"
              placeholder="e.g., Bangalore, Karnataka"
              error={errors.city_state?.message}
              {...register("city_state")}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Number of Students (approx.)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <select
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.student_count ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                  {...register("student_count")}
                >
                  <option value="">Select student count</option>
                  {STUDENT_COUNT_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              {errors.student_count && (
                <p className="text-red-500 text-xs mt-1">{errors.student_count.message}</p>
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What would you like to explore? (Select all that apply)
              </label>
              <div className="space-y-3">
                {PARTNERSHIP_SERVICES.map(service => (
                  <label key={service} className="flex items-start gap-3">
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
                <p className="text-red-500 text-sm mt-1">{errors.partnership_services.message}</p>
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
  }
};

// Form Input Components
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

export default MultiStepSchoolPartnershipForm; 