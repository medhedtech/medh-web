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

// Icons
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
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
  Star,
  Clock,
  Video,
  FileText,
  Camera
} from 'lucide-react';

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import countriesData from "@/utils/countrycode.json";

// Phone Number Component
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';

// Toast notifications
import { toast } from 'react-toastify';

// Form data interface
interface IEducatorFormData {
  // Step 1: Personal Info
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  
  // Step 2: Professional Details
  current_role: string;
  experience_years: string;
  expertise_areas: string[];
  education_background: string;
  current_company?: string;
  
  // Step 3: Teaching Preferences
  preferred_subjects: string[];
  teaching_mode: string[];
  availability: string;
  portfolio_links?: string;
  demo_video_url?: string;
  resume_upload?: File | null;
  
  // Step 4: Terms & Background
  terms_accepted: boolean;
  background_check_consent: boolean;
  additional_notes?: string;
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

// Form steps configuration
const EDUCATOR_FORM_STEPS: IFormStep[] = [
  {
    stepId: "personal_info",
    title: "Personal Info",
    description: "Let's start with your basic details.",
    fields: ["full_name", "email", "country", "phone_number"]
  },
  {
    stepId: "professional_details", 
    title: "Professional Background",
    description: "Tell us about your experience.",
    fields: ["current_role", "experience_years", "expertise_areas", "education_background"]
  },
  {
    stepId: "teaching_preferences",
    title: "Teaching Preferences", 
    description: "What would you like to teach?",
    fields: ["preferred_subjects", "teaching_mode", "availability"]
  },
  {
    stepId: "terms_review",
    title: "Final Review",
    description: "Review and submit your application.",
    fields: ["terms_accepted", "background_check_consent"]
  }
];

// Autocomplete suggestions
const EDUCATOR_SUGGESTIONS = {
  expertise_areas: [
    "Full Stack Development",
    "Frontend Development", 
    "Backend Development",
    "Data Science & Analytics",
    "Machine Learning",
    "UI/UX Design",
    "Digital Marketing",
    "DevOps & Cloud",
    "Mobile App Development",
    "Cybersecurity",
    "Project Management",
    "Quality Assurance",
    "Database Management",
    "Business Analysis"
  ],
  preferred_subjects: [
    "JavaScript & React",
    "Python Programming",
    "Java Development",
    "Data Analytics",
    "UI/UX Design",
    "Digital Marketing",
    "AWS Cloud",
    "Mobile Development",
    "Machine Learning",
    "Cybersecurity",
    "Project Management",
    "Quality Testing",
    "Database Design",
    "API Development"
  ],
  current_role: [
    "Software Engineer",
    "Senior Developer",
    "Tech Lead",
    "Product Manager",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Business Analyst",
    "Project Manager",
    "Quality Analyst",
    "Consultant",
    "Freelancer",
    "Entrepreneur",
    "Academic Professor"
  ]
};

// Universal Form Model Constants
const EDUCATOR_FORM_CONSTANTS = {
  FORM_TYPE: 'educator_registration',
  DEFAULT_PRIORITY: 'high',
  DEFAULT_STATUS: 'submitted',
  SOURCE: 'website_form',
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
} as const;

// Validation schemas
const educatorValidationSchemas = {
  personal_info: yup.object({
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
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address")
      .required("Email is required"),
      
    country: yup
      .string()
      .required("Country is required"),
      
    phone_number: yup
      .string()
      .required("Phone number is required"),
  }),
  
  professional_details: yup.object({
    current_role: yup
      .string()
      .trim()
      .min(2, "Current role must be at least 2 characters")
      .max(100, "Current role cannot exceed 100 characters")
      .required("Current role is required"),
      
    experience_years: yup
      .string()
      .required("Experience level is required"),
      
    expertise_areas: yup
      .array()
      .of(yup.string())
      .min(1, "Please select at least one area of expertise")
      .required("Areas of expertise are required"),
      
    education_background: yup
      .string()
      .trim()
      .min(5, "Education background must be at least 5 characters")
      .max(500, "Education background cannot exceed 500 characters")
      .required("Education background is required"),
  }),
  
  teaching_preferences: yup.object({
    preferred_subjects: yup
      .array()
      .of(yup.string())
      .min(1, "Please select at least one subject you'd like to teach")
      .required("Preferred teaching subjects are required"),
      
    teaching_mode: yup
      .array()
      .of(yup.string())
      .min(1, "Please select at least one teaching mode")
      .required("Teaching mode preference is required"),
      
    availability: yup
      .string()
      .required("Please specify your availability"),
  }),
  
  terms_review: yup.object({
    terms_accepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions to proceed")
      .required("Acceptance of terms is required"),
      
    background_check_consent: yup
      .boolean()
      .oneOf([true], "Background check consent is required for educator positions")
      .required("Background check consent is required"),
  }),
};

// Complete form validation
const completeEducatorSchema = yup.object().shape({
  ...educatorValidationSchemas.personal_info.fields,
  ...educatorValidationSchemas.professional_details.fields,
  ...educatorValidationSchemas.teaching_preferences.fields,
  ...educatorValidationSchemas.terms_review.fields,
});

const MultiStepEducatorForm: React.FC = () => {
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
  } = useForm<IEducatorFormData>({
    resolver: yupResolver(completeEducatorSchema),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'in',
      phone_number: '',
      current_role: '',
      experience_years: '',
      expertise_areas: [],
      education_background: '',
      current_company: '',
      preferred_subjects: [],
      teaching_mode: [],
      availability: '',
      portfolio_links: '',
      demo_video_url: '',
      additional_notes: '',
      terms_accepted: false,
      background_check_consent: false
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
    const currentStepFields = EDUCATOR_FORM_STEPS[currentStep].fields;
    const isValid = await trigger(currentStepFields as any);
    
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
    try {
      console.log('Submitting educator registration:', data);
      
      // Transform data for Universal Form Model
      const transformedData = {
        form_type: EDUCATOR_FORM_CONSTANTS.FORM_TYPE,
        priority: EDUCATOR_FORM_CONSTANTS.DEFAULT_PRIORITY,
        status: EDUCATOR_FORM_CONSTANTS.DEFAULT_STATUS,
        source: EDUCATOR_FORM_CONSTANTS.SOURCE,
        
        personal_info: {
          full_name: data.full_name.trim(),
          email: data.email.toLowerCase().trim(),
          phone_number: data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`,
          country: data.country,
        },
        
        professional_info: {
          current_role: data.current_role.trim(),
          experience_years: data.experience_years,
          expertise_areas: data.expertise_areas,
          education_background: data.education_background.trim(),
          current_company: data.current_company?.trim() || '',
        },
        
        teaching_preferences: {
          preferred_subjects: data.preferred_subjects,
          teaching_mode: data.teaching_mode,
          availability: data.availability,
          portfolio_links: data.portfolio_links?.trim() || '',
          demo_video_url: data.demo_video_url?.trim() || '',
          has_resume: !!data.resume_upload,
        },
        
        consent: {
          terms_accepted: data.terms_accepted,
          background_check_consent: data.background_check_consent,
        },
        
        additional_notes: data.additional_notes?.trim() || '',
        
        submission_metadata: {
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString(),
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          form_version: '3.0',
          validation_passed: true,
        }
      };

      await postQuery({
        url: apiUrls?.registration?.addRegistration, // Using registration endpoint
        postData: transformedData,
        onSuccess: (response: any) => {
          console.log('Educator registration submitted successfully:', response);
          setShowSuccessModal(true);
          reset();
          setCurrentStep(0);
          setCompletedSteps(new Set());
          localStorage.removeItem('educatorFormDraft');
        },
        onFail: (error: any) => {
          console.error("Educator registration failed:", error);
          toast.error("Registration failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Unexpected error during educator registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Form Components
  const MultiSelectField: React.FC<{
    label: string;
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    error?: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = ({ label, options, selectedValues, onChange, error, icon: Icon }) => {
    const toggleOption = (option: string) => {
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
      onChange(newValues);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
          <Icon className="h-5 w-5 text-slate-500" />
          {label}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option) => (
            <label
              key={option}
              className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                selectedValues.includes(option)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm font-medium">{option}</span>
            </label>
          ))}
        </div>
        {error && (
          <p className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </motion.div>
    );
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
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2"
            >
              Join Medh as an Educator
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-lg"
            >
              Share your expertise and shape the next generation of professionals
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700">
            <div className="flex items-center justify-between">
              {EDUCATOR_FORM_STEPS.map((step, index) => (
                <div key={step.stepId} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    completedSteps.has(index) 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {completedSteps.has(index) ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < EDUCATOR_FORM_STEPS.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      completedSteps.has(index) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {EDUCATOR_FORM_STEPS[currentStep].title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {EDUCATOR_FORM_STEPS[currentStep].description}
                  </p>
                </div>

                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          {...register("full_name")}
                        />
                      </div>
                      {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                          <select
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            {...register("country")}
                          >
                            {countriesData.map((country: any) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                      </div>

                      <Controller
                        name="phone_number"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Phone Number
                            </label>
                            <PhoneNumberInput
                              value={{ 
                                country: watchedFields.country || 'in', 
                                number: field.value || '' 
                              }}
                              onChange={val => field.onChange(val.number)}
                              placeholder="Enter phone number"
                              error={fieldState.error?.message}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Current Role/Position
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g., Senior Software Engineer"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          {...register("current_role")}
                        />
                      </div>
                      {errors.current_role && <p className="text-red-500 text-sm mt-1">{errors.current_role.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <select
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          {...register("experience_years")}
                        >
                          <option value="">Select experience level</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-8">5-8 years</option>
                          <option value="8+">8+ years</option>
                        </select>
                      </div>
                      {errors.experience_years && <p className="text-red-500 text-sm mt-1">{errors.experience_years.message}</p>}
                    </div>

                    <Controller
                      name="expertise_areas"
                      control={control}
                      render={({ field, fieldState }) => (
                        <MultiSelectField
                          label="Areas of Expertise"
                          options={EDUCATOR_SUGGESTIONS.expertise_areas}
                          selectedValues={field.value || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          icon={Award}
                        />
                      )}
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Education Background
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <textarea
                          rows={3}
                          placeholder="e.g., B.Tech Computer Science from IIT Delhi, M.Tech from..."
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                          {...register("education_background")}
                        />
                      </div>
                      {errors.education_background && <p className="text-red-500 text-sm mt-1">{errors.education_background.message}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <Controller
                      name="preferred_subjects"
                      control={control}
                      render={({ field, fieldState }) => (
                        <MultiSelectField
                          label="Subjects You'd Like to Teach"
                          options={EDUCATOR_SUGGESTIONS.preferred_subjects}
                          selectedValues={field.value || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          icon={BookOpen}
                        />
                      )}
                    />

                    <Controller
                      name="teaching_mode"
                      control={control}
                      render={({ field, fieldState }) => (
                        <MultiSelectField
                          label="Preferred Teaching Mode"
                          options={["Online Live Sessions", "Recorded Content", "In-Person Workshops", "One-on-One Mentoring"]}
                          selectedValues={field.value || []}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          icon={Video}
                        />
                      )}
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Availability
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <select
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          {...register("availability")}
                        >
                          <option value="">Select availability</option>
                          <option value="weekdays">Weekdays Only</option>
                          <option value="weekends">Weekends Only</option>
                          <option value="flexible">Flexible Schedule</option>
                          <option value="part-time">Part-time (10-20 hrs/week)</option>
                          <option value="full-time">Full-time (30+ hrs/week)</option>
                        </select>
                      </div>
                      {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Portfolio/LinkedIn Links (Optional)
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <textarea
                          rows={2}
                          placeholder="Share your LinkedIn, GitHub, portfolio website, or other relevant links"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                          {...register("portfolio_links")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        What You'll Get as a Medh Educator
                      </h4>
                      <div className="space-y-3">
                        {[
                          "💰 Competitive compensation for your expertise",
                          "🎯 Teach motivated, career-focused students", 
                          "🚀 Platform to build your personal brand",
                          "📈 Analytics and feedback to improve teaching",
                          "🤝 Community of industry professionals",
                          "⏰ Flexible scheduling that fits your lifestyle"
                        ].map((benefit, index) => (
                          <p key={index} className="text-slate-700 dark:text-slate-300">
                            {benefit}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded mt-1"
                          {...register("terms_accepted")}
                        />
                        <label className="text-sm text-slate-700 dark:text-slate-300">
                          I agree to the{" "}
                          <Link href="/terms-and-services" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.terms_accepted && <p className="text-red-500 text-sm">{errors.terms_accepted.message}</p>}

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded mt-1"
                          {...register("background_check_consent")}
                        />
                        <label className="text-sm text-slate-700 dark:text-slate-300">
                          I consent to a background verification check as required for educator positions
                        </label>
                      </div>
                      {errors.background_check_consent && <p className="text-red-500 text-sm">{errors.background_check_consent.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <textarea
                          rows={3}
                          placeholder="Any additional information you'd like to share..."
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                          {...register("additional_notes")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep === EDUCATOR_FORM_STEPS.length - 1 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
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
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
                </div>
                <div className="p-8 text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Thank you for your interest in becoming a Medh educator! We'll review your application and get back to you within 48 hours.
                  </p>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MultiStepEducatorForm; 