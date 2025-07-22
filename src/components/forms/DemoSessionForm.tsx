"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { 
  X, Calendar, Clock, MapPin, AlertCircle, CheckCircle, 
  Radio, Loader2, Phone, Mail, User, GraduationCap, 
  Building, Globe, Heart
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  IBookFreeDemoSessionPayload,
  IParentDetails,
  IStudentDetailsUnder16,
  IStudentDetails16AndAbove,
  IDemoSessionDetails,
  IConsent,
  ILiveCourse,
  DemoSessionAPI,
  FormValidation,
  TStudentGrade,
  THighestQualification,
  TKnowMedhFrom,
  IValidationError,
} from "@/apis/demo.api";
import { buildComponent, buildAdvancedComponent } from "@/utils/designSystem";
import Swal from "sweetalert2";
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../shared/login/PhoneNumberInput';
import Link from "next/link";

// Enhanced Form Step Type
type FormStep = 'age-selection' | 'parent-details' | 'student-details' | 'demo-consent' | 'complete-form';

// Form Field Styles with improved design
const getInputClasses = (hasError: boolean, isDark: boolean) => {
  const baseClasses = "w-full p-4 rounded-xl border transition-all duration-200 shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none";
  const errorClasses = hasError 
    ? "border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500 text-red-900 dark:text-red-100"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 dark:hover:border-gray-500";
  
  return `${baseClasses} ${errorClasses}`;
};

const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
const errorClasses = "flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium mt-2";
const radioGroupClasses = "flex flex-col sm:flex-row gap-4";
const radioLabelClasses = "flex items-center text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:text-primary-600 transition-colors";

// Enhanced Options Arrays
const gradeOptions: { value: TStudentGrade; label: string }[] = [
  { value: "Grade 1-2", label: "Grade 1-2 (Ages 6-8)" },
  { value: "Grade 3-4", label: "Grade 3-4 (Ages 8-10)" },
  { value: "Grade 5-6", label: "Grade 5-6 (Ages 10-12)" },
  { value: "Grade 7-8", label: "Grade 7-8 (Ages 12-14)" },
  { value: "Grade 9-10", label: "Grade 9-10 (Ages 14-16)" },
  { value: "Grade 11-12", label: "Grade 11-12 (Ages 16-18)" },
  { value: "Home Study", label: "Home Study/Homeschooled" },
];

const qualificationOptions: { value: THighestQualification; label: string }[] = [
  { value: "10th passed", label: "10th Standard Completed" },
  { value: "12th passed", label: "12th Standard/High School Completed" },
  { value: "Undergraduate", label: "Currently in College/University" },
  { value: "Graduate", label: "Bachelor's Degree Completed" },
  { value: "Post-Graduate", label: "Master's/PhD Completed" },
];

const knowMedhFromOptions: { value: TKnowMedhFrom; label: string }[] = [
  { value: "social_media", label: "Social Media (Facebook, Instagram, LinkedIn)" },
  { value: "friend", label: "Friend or Family Recommendation" },
  { value: "online_ad", label: "Online Advertisement" },
  { value: "school_event", label: "School Event or Workshop" },
  { value: "other", label: "Other Source" },
];

const preferredTimingsOptions = [
  { value: "morning(8am - 12pm)", label: "Morning (8:00 AM - 12:00 PM)" },
  { value: "afternoon(12pm - 5pm)", label: "Afternoon (12:00 PM - 5:00 PM)" },
  { value: "evening(5pm - 10pm)", label: "Evening (5:00 PM - 10:00 PM)" },
];

// Form State Interface
interface IFormState {
  step: FormStep;
  isStudentUnder16: boolean | null;
  parentDetails: IParentDetails;
  studentDetailsUnder16: IStudentDetailsUnder16;
  studentDetails16AndAbove: IStudentDetails16AndAbove;
  demoSessionDetails: IDemoSessionDetails;
  consent: IConsent;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  liveCourses: ILiveCourse[];
  isLoadingCourses: boolean;
}

interface DemoSessionFormProps {
  onClose: () => void;
}

const DemoSessionForm: React.FC<DemoSessionFormProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Enhanced Form State
  const [formState, setFormState] = useState<IFormState>({
    step: 'age-selection',
    isStudentUnder16: null,
    parentDetails: { 
      name: "", 
      email: "", 
      mobile_no: "", 
      city: "", 
      preferred_timings_to_connect: "",
      country: "in" 
    },
    studentDetailsUnder16: { 
      name: "", 
      grade: "Grade 1-2", 
      city: "", 
      state: "", 
      preferred_course: [], 
      know_medh_from: "social_media", 
      email: "", 
      school_name: "",
      country: "in" 
    },
    studentDetails16AndAbove: { 
      name: "", 
      email: "", 
      mobile_no: "", 
      city: "", 
      preferred_timings_to_connect: "", 
      highest_qualification: "10th passed", 
      currently_studying: false, 
      currently_working: false, 
      preferred_course: [], 
      know_medh_from: "social_media", 
      education_institute_name: "",
      country: "in" 
    },
    demoSessionDetails: { 
      preferred_date: undefined, 
      preferred_time_slot: "",
      special_requirements: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    consent: { 
      terms_accepted: false, 
      privacy_policy_accepted: false, 
      gdpr_consent: false,
      marketing_consent: false
    },
    validationErrors: {},
    isSubmitting: false,
    liveCourses: [],
    isLoadingCourses: true
  });

  // Load courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setFormState(prev => ({ ...prev, isLoadingCourses: true }));
      
      try {
        const response = await DemoSessionAPI.getLiveCourses();
        if (response.success && response.data) {
          setFormState(prev => ({ 
            ...prev, 
            liveCourses: response.data || [],
            isLoadingCourses: false 
          }));
        } else {
          throw new Error(response.message || "Failed to load courses");
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        setFormState(prev => ({ ...prev, isLoadingCourses: false }));
        Swal.fire({
          title: "Warning",
          text: "Some course data couldn't be loaded, but you can still submit the form.",
          icon: "warning",
          confirmButtonText: "Continue",
          customClass: {
            popup: isDark ? 'dark-mode-swal' : '',
            confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
          }
        });
      }
    };
    
    fetchCourses();
  }, [isDark]);

  // Enhanced form validation with detailed error messages
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    switch (formState.step) {
      case 'age-selection':
        if (formState.isStudentUnder16 === null) {
          errors.age = "Please select whether the student is under 16 years old.";
        }
        break;

      case 'parent-details':
        if (!formState.parentDetails.name.trim()) {
          errors.parentName = "Parent's name is required.";
        } else if (formState.parentDetails.name.trim().length < 2) {
          errors.parentName = "Parent's name must be at least 2 characters.";
        }
        
        if (!formState.parentDetails.email.trim()) {
          errors.parentEmail = "Parent's email is required.";
        } else if (!FormValidation.validateEmail(formState.parentDetails.email)) {
          errors.parentEmail = "Please enter a valid email address.";
        }
        
        if (!formState.parentDetails.mobile_no.trim()) {
          errors.parentMobile = "Parent's mobile number is required.";
        }
        
        if (!formState.parentDetails.city.trim()) {
          errors.parentCity = "Parent's city is required.";
        }
        break;

      case 'student-details':
        if (formState.isStudentUnder16) {
          const studentDetails = formState.studentDetailsUnder16;
          if (!studentDetails.name.trim()) {
            errors.studentName = "Student's name is required.";
          }
          if (!studentDetails.city.trim()) {
            errors.studentCity = "Student's city is required.";
          }
          if (!studentDetails.state.trim()) {
            errors.studentState = "Student's state is required.";
          }
          if (studentDetails.preferred_course.length === 0) {
            errors.preferredCourse = "Please select at least one preferred course.";
          }
        }
        break;

      case 'complete-form':
        if (!formState.isStudentUnder16) {
          const studentDetails = formState.studentDetails16AndAbove;
          if (!studentDetails.name.trim()) {
            errors.studentName = "Student's name is required.";
          }
          if (!FormValidation.validateEmail(studentDetails.email)) {
            errors.studentEmail = "Please enter a valid email address.";
          }
          if (!studentDetails.mobile_no.trim()) {
            errors.studentMobile = "Student's mobile number is required.";
          }
          if (!studentDetails.city.trim()) {
            errors.studentCity = "Student's city is required.";
          }
          if (studentDetails.preferred_course.length === 0) {
            errors.preferredCourse = "Please select at least one preferred course.";
          }
        }
        
        if (!formState.consent.terms_accepted) {
          errors.termsAccepted = "You must accept the Terms of Use.";
        }
        if (!formState.consent.privacy_policy_accepted) {
          errors.privacyAccepted = "You must accept the Privacy Policy.";
        }
        break;
    }

    setFormState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  // Enhanced form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      // Focus on first error field
      const firstError = Object.keys(formState.validationErrors)[0];
      const errorElement = document.querySelector(`[data-field="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const submissionTimestamp = new Date();
      const userAgent = navigator.userAgent;

      let payload: IBookFreeDemoSessionPayload;

      if (formState.isStudentUnder16) {
        payload = {
          form_type: "book_a_free_demo_session",
          is_student_under_16: true,
          parent_details: formState.parentDetails,
          student_details: formState.studentDetailsUnder16,
          demo_session_details: formState.demoSessionDetails,
          consent: formState.consent,
          submission_metadata: {
            user_agent: userAgent,
            timestamp: submissionTimestamp.toISOString(),
            form_version: "2.0",
            validation_passed: true,
            device_info: {
              type: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop',
              os: navigator.platform,
              browser: navigator.userAgent.split(' ').pop() || 'Unknown'
            }
          },
        };
      } else {
        payload = {
          form_type: "book_a_free_demo_session",
          is_student_under_16: false,
          student_details: formState.studentDetails16AndAbove,
          demo_session_details: formState.demoSessionDetails,
          consent: formState.consent,
          submission_metadata: {
            user_agent: userAgent,
            timestamp: submissionTimestamp.toISOString(),
            form_version: "2.0",
            validation_passed: true,
            device_info: {
              type: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop',
              os: navigator.platform,
              browser: navigator.userAgent.split(' ').pop() || 'Unknown'
            }
          },
        };
      }

      const response = await DemoSessionAPI.submitBookFreeDemoSessionForm(payload);
      
      if (response.success) {
        await Swal.fire({
          title: "🎉 Success!",
          html: `
            <div class="text-center space-y-4">
              <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                Your demo session request has been submitted successfully!
              </div>
              ${response.data?.confirmation_number ? 
                `<div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <strong>Confirmation Number:</strong> ${response.data.confirmation_number}
                </div>` : ''
              }
              <div class="text-sm text-gray-600 dark:text-gray-400">
                We will contact you shortly to schedule your free demo session.
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonText: "Got it!",
          customClass: {
            popup: isDark ? 'dark-mode-swal' : '',
            confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
          }
        });
        onClose();
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      await Swal.fire({
        title: "Submission Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          popup: isDark ? 'dark-mode-swal' : '',
          confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
        }
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Navigation helpers
  const goToNextStep = () => {
    if (!validateCurrentStep()) return;

    const stepOrder: FormStep[] = ['age-selection', 'parent-details', 'student-details', 'demo-consent', 'complete-form'];
    const currentIndex = stepOrder.indexOf(formState.step);
    
    if (formState.step === 'age-selection') {
      const nextStep = formState.isStudentUnder16 ? 'parent-details' : 'complete-form';
      setFormState(prev => ({ ...prev, step: nextStep }));
    } else if (currentIndex < stepOrder.length - 1) {
      // Skip steps based on age selection
      if (formState.step === 'student-details' && formState.isStudentUnder16) {
        setFormState(prev => ({ ...prev, step: 'demo-consent' }));
      } else if (currentIndex + 1 < stepOrder.length) {
        setFormState(prev => ({ ...prev, step: stepOrder[currentIndex + 1] }));
      }
    }
  };

  const goToPreviousStep = () => {
    const stepOrder: FormStep[] = ['age-selection', 'parent-details', 'student-details', 'demo-consent', 'complete-form'];
    const currentIndex = stepOrder.indexOf(formState.step);
    
    if (formState.step === 'complete-form' && !formState.isStudentUnder16) {
      setFormState(prev => ({ ...prev, step: 'age-selection' }));
    } else if (formState.step === 'demo-consent') {
      setFormState(prev => ({ ...prev, step: 'student-details' }));
    } else if (currentIndex > 0) {
      setFormState(prev => ({ ...prev, step: stepOrder[currentIndex - 1] }));
    }
  };

  // Enhanced select styles
  const selectStyles = useMemo(() => ({
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: state.hasValue || state.isFocused ? '#6366f1' : isDark ? '#374151' : '#d1d5db',
      color: isDark ? '#ffffff' : '#1f2937',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      minHeight: '56px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#6366f1',
      },
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#4f46e5' : '#e0e7ff',
      color: isDark ? '#ffffff' : '#1f2937',
      borderRadius: '0.5rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
      fontWeight: '500',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
      '&:hover': {
        backgroundColor: isDark ? '#6b7280' : '#c7d2fe',
        color: isDark ? '#ffffff' : '#1f2937',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#6366f1'
        : state.isFocused
          ? (isDark ? '#374151' : '#f3f4f6')
          : (isDark ? '#1f2937' : '#ffffff'),
      color: state.isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#1f2937'),
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#6366f1',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontStyle: 'normal',
    }),
  }), [isDark]);

  // Progress indicator component
  const ProgressIndicator = ({ currentStep, isUnder16 }: { currentStep: FormStep; isUnder16: boolean | null }) => {
    const steps = isUnder16 
      ? ['age-selection', 'parent-details', 'student-details', 'demo-consent']
      : ['age-selection', 'complete-form'];
    
    const stepLabels = isUnder16 
      ? ['Age', 'Parent', 'Student', 'Session']
      : ['Age', 'Details'];
    
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                  ${index <= currentIndex 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {index < currentIndex ? <CheckCircle size={20} /> : index + 1}
                </div>
                <span className={`
                  ml-3 text-sm font-medium transition-colors duration-200
                  ${index <= currentIndex 
                    ? 'text-primary-500' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {stepLabels[index]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-1 rounded-full transition-colors duration-200
                  ${index < currentIndex 
                    ? 'bg-primary-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                  }
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Error display component
  const ErrorMessage = ({ error, field }: { error?: string; field?: string }) => {
    if (!error) return null;
    
    return (
      <div className={errorClasses} data-field={field}>
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  // Input wrapper component with enhanced styling
  const InputGroup = ({ 
    label, 
    required = false, 
    error, 
    field, 
    icon: Icon, 
    children 
  }: { 
    label: string; 
    required?: boolean; 
    error?: string; 
    field?: string;
    icon?: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <label className={labelClasses}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary-500" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      </label>
      {children}
      <ErrorMessage error={error} field={field} />
    </div>
  );

  const renderFormContent = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 md:p-10 relative z-20 mx-4 my-8 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={formState.isSubmitting}
          className="absolute top-4 right-4 p-3 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-30 disabled:opacity-50"
          aria-label="Close form"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Free Demo Session
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Experience our teaching methodology firsthand with a personalized demo session
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={formState.step} isUnder16={formState.isStudentUnder16} />

        {/* Age Selection Step */}
        {formState.step === 'age-selection' && (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Let's Get Started!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                Is the student less than 16 years old? This helps us customize the registration process.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => {
                  setFormState(prev => ({ 
                    ...prev, 
                    isStudentUnder16: true, 
                    step: 'parent-details',
                    validationErrors: {} 
                  }));
                }}
                className={buildComponent.button("primary", "lg") + " min-w-[200px] flex items-center justify-center gap-3"}
              >
                <Heart className="h-5 w-5" />
                Yes, Under 16
              </button>
              <button
                onClick={() => {
                  setFormState(prev => ({ 
                    ...prev, 
                    isStudentUnder16: false, 
                    step: 'complete-form',
                    validationErrors: {} 
                  }));
                }}
                className={buildComponent.button("secondary", "lg") + " min-w-[200px] flex items-center justify-center gap-3"}
              >
                <GraduationCap className="h-5 w-5" />
                No, 16 and Above
              </button>
            </div>
            
            <ErrorMessage error={formState.validationErrors.age} field="age" />
          </div>
        )}

        {/* Parent Details Step */}
        {formState.step === 'parent-details' && formState.isStudentUnder16 && (
          <div className="space-y-8">
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-6"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Parent/Guardian Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Parent's Full Name" required icon={User} error={formState.validationErrors.parentName} field="parentName">
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.parentName, isDark)}
                    value={formState.parentDetails.name}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { ...prev.parentDetails, name: e.target.value }
                    }))}
                    placeholder="Enter parent's full name"
                    data-field="parentName"
                  />
                </InputGroup>

                <InputGroup label="Parent's Email Address" required icon={Mail} error={formState.validationErrors.parentEmail} field="parentEmail">
                  <input
                    type="email"
                    className={getInputClasses(!!formState.validationErrors.parentEmail, isDark)}
                    value={formState.parentDetails.email}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { ...prev.parentDetails, email: e.target.value }
                    }))}
                    placeholder="Enter parent's email address"
                    data-field="parentEmail"
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Country" required icon={Globe} error={formState.validationErrors.parentCountry} field="parentCountry">
                  <select
                    className={getInputClasses(!!formState.validationErrors.parentCountry, isDark)}
                    value={formState.parentDetails.country}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { ...prev.parentDetails, country: e.target.value }
                    }))}
                    data-field="parentCountry"
                  >
                    {countriesData.map((country: any) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup label="Phone Number" required icon={Phone} error={formState.validationErrors.parentMobile} field="parentMobile">
                  <PhoneNumberInput
                    value={{ 
                      country: formState.parentDetails.country || 'in', 
                      number: formState.parentDetails.mobile_no 
                    }}
                    onChange={(val) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { 
                        ...prev.parentDetails, 
                        mobile_no: val.number,
                        country: val.country
                      }
                    }))}
                    placeholder="Enter phone number"
                    error={formState.validationErrors.parentMobile}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Current City" required icon={MapPin} error={formState.validationErrors.parentCity} field="parentCity">
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.parentCity, isDark)}
                    value={formState.parentDetails.city}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { ...prev.parentDetails, city: e.target.value }
                    }))}
                    placeholder="e.g., New Delhi, Mumbai, Bangalore"
                    data-field="parentCity"
                  />
                </InputGroup>

                <InputGroup label="Preferred Time to Connect" icon={Clock} error={formState.validationErrors.parentTiming} field="parentTiming">
                  <select
                    className={getInputClasses(!!formState.validationErrors.parentTiming, isDark)}
                    value={formState.parentDetails.preferred_timings_to_connect || ""}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      parentDetails: { ...prev.parentDetails, preferred_timings_to_connect: e.target.value }
                    }))}
                    data-field="parentTiming"
                  >
                    <option value="">Select preferred timing</option>
                    {preferredTimingsOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </InputGroup>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={goToPreviousStep}
                className={buildComponent.button("secondary", "lg")}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className={buildComponent.button("primary", "lg")}
              >
                Next: Student Details →
              </button>
            </div>
          </div>
        )}

        {/* Student Details Step (Under 16) */}
        {formState.step === 'student-details' && formState.isStudentUnder16 && (
          <div className="space-y-8">
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-6"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Student Details
                </h3>
              </div>

              <div className="space-y-6">
                <InputGroup label="Student's Full Name" required icon={User} error={formState.validationErrors.studentName} field="studentName">
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                    value={formState.studentDetailsUnder16.name}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { ...prev.studentDetailsUnder16, name: e.target.value }
                    }))}
                    placeholder="Enter student's full name"
                    data-field="studentName"
                  />
                </InputGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Student's Email (Optional)" icon={Mail}>
                    <input
                      type="email"
                      className={getInputClasses(false, isDark)}
                      value={formState.studentDetailsUnder16.email || ""}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetailsUnder16: { ...prev.studentDetailsUnder16, email: e.target.value }
                      }))}
                      placeholder="Enter student's email address"
                    />
                  </InputGroup>

                  <InputGroup label="School Name (Optional)" icon={Building}>
                    <input
                      type="text"
                      className={getInputClasses(false, isDark)}
                      value={formState.studentDetailsUnder16.school_name || ""}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetailsUnder16: { ...prev.studentDetailsUnder16, school_name: e.target.value }
                      }))}
                      placeholder="Enter student's school name"
                    />
                  </InputGroup>
                </div>

                <InputGroup label="Student's Grade" required icon={GraduationCap} error={formState.validationErrors.studentGrade} field="studentGrade">
                  <Select
                    options={gradeOptions}
                    value={gradeOptions.find(option => option.value === formState.studentDetailsUnder16.grade)}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { ...prev.studentDetailsUnder16, grade: selected?.value || "Grade 1-2" }
                    }))}
                    styles={selectStyles}
                    placeholder="Select student's grade"
                    isSearchable
                    data-field="studentGrade"
                  />
                </InputGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Current City" required icon={MapPin} error={formState.validationErrors.studentCity} field="studentCity">
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                      value={formState.studentDetailsUnder16.city}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetailsUnder16: { ...prev.studentDetailsUnder16, city: e.target.value }
                      }))}
                      placeholder="e.g., New Delhi, Mumbai, Bangalore"
                      data-field="studentCity"
                    />
                  </InputGroup>

                  <InputGroup label="State/Region" required icon={MapPin} error={formState.validationErrors.studentState} field="studentState">
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentState, isDark)}
                      value={formState.studentDetailsUnder16.state}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetailsUnder16: { ...prev.studentDetailsUnder16, state: e.target.value }
                      }))}
                      placeholder="e.g., Delhi, Maharashtra, Karnataka"
                      data-field="studentState"
                    />
                  </InputGroup>
                </div>

                <InputGroup label="Preferred Course(s)" required error={formState.validationErrors.preferredCourse} field="preferredCourse">
                  <Select
                    options={formState.liveCourses.map(course => ({ value: course.title, label: course.title }))}
                    value={formState.liveCourses
                      .filter(course => formState.studentDetailsUnder16.preferred_course.includes(course.title))
                      .map(course => ({ value: course.title, label: course.title }))}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { 
                        ...prev.studentDetailsUnder16, 
                        preferred_course: selected ? selected.map((s: any) => s.value) : [] 
                      }
                    }))}
                    styles={selectStyles}
                    placeholder={formState.isLoadingCourses ? "Loading courses..." : "Select preferred course(s)"}
                    isMulti
                    isDisabled={formState.isLoadingCourses}
                    isSearchable
                    data-field="preferredCourse"
                  />
                </InputGroup>

                <InputGroup label="How did you hear about Medh?" required error={formState.validationErrors.knowMedh} field="knowMedh">
                  <Select
                    options={knowMedhFromOptions}
                    value={knowMedhFromOptions.find(option => option.value === formState.studentDetailsUnder16.know_medh_from)}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { ...prev.studentDetailsUnder16, know_medh_from: selected?.value || "social_media" }
                    }))}
                    styles={selectStyles}
                    placeholder="Select an option"
                    isSearchable
                    data-field="knowMedh"
                  />
                </InputGroup>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={goToPreviousStep}
                className={buildComponent.button("secondary", "lg")}
              >
                ← Back: Parent Details
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className={buildComponent.button("primary", "lg")}
              >
                Next: Demo Session & Consent →
              </button>
            </div>
          </div>
        )}

        {/* Demo Session & Consent Step (Under 16) */}
        {formState.step === 'demo-consent' && formState.isStudentUnder16 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-6"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Demo Session Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Preferred Date (Optional)" icon={Calendar}>
                  <DatePicker
                    selected={formState.demoSessionDetails.preferred_date}
                    onChange={(date: Date | null) => setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_date: date || undefined }
                    }))}
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <input 
                        type="text" 
                        className={getInputClasses(false, isDark) + " cursor-pointer"}
                        placeholder="Select preferred date"
                        readOnly
                      />
                    }
                    minDate={new Date()}
                    className="w-full"
                    popperClassName="react-datepicker-popper-custom"
                    calendarClassName={isDark ? "react-datepicker-dark" : ""}
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                  />
                </InputGroup>

                <InputGroup label="Preferred Time Slot (Optional)" icon={Clock}>
                  <Select
                    options={preferredTimingsOptions}
                    value={preferredTimingsOptions.find(option => option.value === formState.demoSessionDetails.preferred_time_slot)}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_time_slot: selected?.value || "" }
                    }))}
                    styles={selectStyles}
                    placeholder="Select a time slot"
                    isClearable
                  />
                </InputGroup>
              </div>

              <InputGroup label="Special Requirements (Optional)">
                <textarea
                  className={getInputClasses(false, isDark) + " h-24 resize-none"}
                  value={formState.demoSessionDetails.special_requirements || ""}
                  onChange={(e) => setFormState(prev => ({ 
                    ...prev, 
                    demoSessionDetails: { ...prev.demoSessionDetails, special_requirements: e.target.value }
                  }))}
                  placeholder="Any specific topics you'd like to focus on or special requirements..."
                />
              </InputGroup>
            </div>

            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-4"}>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Consent & Agreements
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.terms_accepted && formState.consent.privacy_policy_accepted}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { 
                        ...prev.consent, 
                        terms_accepted: e.target.checked,
                        privacy_policy_accepted: e.target.checked 
                      }
                    }))}
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      I agree to the{" "}
                      <Link href="/terms-and-services" className="text-primary-500 hover:underline font-semibold">
                        Terms of Use
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" className="text-primary-500 hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.gdpr_consent}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { ...prev.consent, gdpr_consent: e.target.checked }
                    }))}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I consent to the processing of my data in accordance with GDPR regulations
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.marketing_consent}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { ...prev.consent, marketing_consent: e.target.checked }
                    }))}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I would like to receive updates about courses and educational content
                  </span>
                </label>
              </div>

              <ErrorMessage error={formState.validationErrors.termsAccepted || formState.validationErrors.privacyAccepted} />
            </div>

            {/* Navigation and Submit */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={formState.isSubmitting}
                className={buildComponent.button("secondary", "lg")}
              >
                ← Back: Student Details
              </button>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className={buildComponent.button("primary", "lg") + " min-w-[200px]"}
              >
                {formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" /> 
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    Book Demo Session
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Complete Form (16 and Above) */}
        {formState.step === 'complete-form' && !formState.isStudentUnder16 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-6"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Student Information
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" required icon={User} error={formState.validationErrors.studentName} field="studentName">
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                      value={formState.studentDetails16AndAbove.name}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, name: e.target.value }
                      }))}
                      placeholder="Enter your full name"
                      data-field="studentName"
                    />
                  </InputGroup>

                  <InputGroup label="Email Address" required icon={Mail} error={formState.validationErrors.studentEmail} field="studentEmail">
                    <input
                      type="email"
                      className={getInputClasses(!!formState.validationErrors.studentEmail, isDark)}
                      value={formState.studentDetails16AndAbove.email}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, email: e.target.value }
                      }))}
                      placeholder="Enter your email address"
                      data-field="studentEmail"
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Country" required icon={Globe} error={formState.validationErrors.studentCountry} field="studentCountry">
                    <select
                      className={getInputClasses(!!formState.validationErrors.studentCountry, isDark)}
                      value={formState.studentDetails16AndAbove.country}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, country: e.target.value }
                      }))}
                      data-field="studentCountry"
                    >
                      {countriesData.map((country: any) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>

                  <InputGroup label="Phone Number" required icon={Phone} error={formState.validationErrors.studentMobile} field="studentMobile">
                    <PhoneNumberInput
                      value={{ 
                        country: formState.studentDetails16AndAbove.country || 'in', 
                        number: formState.studentDetails16AndAbove.mobile_no 
                      }}
                      onChange={(val) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { 
                          ...prev.studentDetails16AndAbove, 
                          mobile_no: val.number,
                          country: val.country
                        }
                      }))}
                      placeholder="Enter your phone number"
                      error={formState.validationErrors.studentMobile}
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Highest Qualification" required icon={GraduationCap} error={formState.validationErrors.highestQualification} field="highestQualification">
                    <Select
                      options={qualificationOptions}
                      value={qualificationOptions.find(option => option.value === formState.studentDetails16AndAbove.highest_qualification)}
                      onChange={(selected) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, highest_qualification: selected?.value || "10th passed" }
                      }))}
                      styles={selectStyles}
                      placeholder="Select your highest qualification"
                      isSearchable
                      data-field="highestQualification"
                    />
                  </InputGroup>

                  <InputGroup label="Education Institute (Optional)" icon={Building}>
                    <input
                      type="text"
                      className={getInputClasses(false, isDark)}
                      value={formState.studentDetails16AndAbove.education_institute_name || ""}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, education_institute_name: e.target.value }
                      }))}
                      placeholder="e.g., Delhi University, IIT Delhi"
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className={labelClasses}>Currently Studying? <span className="text-red-500">*</span></label>
                    <div className={radioGroupClasses}>
                      <label className={radioLabelClasses}>
                        <input
                          type="radio"
                          name="currently_studying"
                          checked={formState.studentDetails16AndAbove.currently_studying === true}
                          onChange={() => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_studying: true }
                          }))}
                          className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className={radioLabelClasses}>
                        <input
                          type="radio"
                          name="currently_studying"
                          checked={formState.studentDetails16AndAbove.currently_studying === false}
                          onChange={() => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_studying: false }
                          }))}
                          className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    <ErrorMessage error={formState.validationErrors.currentlyStudying} />
                  </div>

                  <div className="space-y-4">
                    <label className={labelClasses}>Currently Working? <span className="text-red-500">*</span></label>
                    <div className={radioGroupClasses}>
                      <label className={radioLabelClasses}>
                        <input
                          type="radio"
                          name="currently_working"
                          checked={formState.studentDetails16AndAbove.currently_working === true}
                          onChange={() => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_working: true }
                          }))}
                          className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className={radioLabelClasses}>
                        <input
                          type="radio"
                          name="currently_working"
                          checked={formState.studentDetails16AndAbove.currently_working === false}
                          onChange={() => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_working: false }
                          }))}
                          className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    <ErrorMessage error={formState.validationErrors.currentlyWorking} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Current City" required icon={MapPin} error={formState.validationErrors.studentCity} field="studentCity">
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                      value={formState.studentDetails16AndAbove.city}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, city: e.target.value }
                      }))}
                      placeholder="e.g., New Delhi, Mumbai, Bangalore"
                      data-field="studentCity"
                    />
                  </InputGroup>

                  <InputGroup label="Preferred Time to Connect" icon={Clock}>
                    <select
                      className={getInputClasses(false, isDark)}
                      value={formState.studentDetails16AndAbove.preferred_timings_to_connect || ""}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, preferred_timings_to_connect: e.target.value }
                      }))}
                    >
                      <option value="">Select preferred timing</option>
                      {preferredTimingsOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </div>

                <InputGroup label="Preferred Course(s)" required error={formState.validationErrors.preferredCourse} field="preferredCourse">
                  <Select
                    options={formState.liveCourses.map(course => ({ value: course.title, label: course.title }))}
                    value={formState.liveCourses
                      .filter(course => formState.studentDetails16AndAbove.preferred_course.includes(course.title))
                      .map(course => ({ value: course.title, label: course.title }))}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetails16AndAbove: { 
                        ...prev.studentDetails16AndAbove, 
                        preferred_course: selected ? selected.map((s: any) => s.value) : [] 
                      }
                    }))}
                    styles={selectStyles}
                    placeholder={formState.isLoadingCourses ? "Loading courses..." : "Select your preferred course(s)"}
                    isMulti
                    isDisabled={formState.isLoadingCourses}
                    isSearchable
                    data-field="preferredCourse"
                  />
                </InputGroup>

                <InputGroup label="How did you hear about Medh?" required error={formState.validationErrors.knowMedh} field="knowMedh">
                  <Select
                    options={knowMedhFromOptions}
                    value={knowMedhFromOptions.find(option => option.value === formState.studentDetails16AndAbove.know_medh_from)}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, know_medh_from: selected?.value || "social_media" }
                    }))}
                    styles={selectStyles}
                    placeholder="Select an option"
                    isSearchable
                    data-field="knowMedh"
                  />
                </InputGroup>
              </div>
            </div>

            {/* Demo Session Details */}
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-6"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Demo Session Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Preferred Date (Optional)" icon={Calendar}>
                  <DatePicker
                    selected={formState.demoSessionDetails.preferred_date}
                    onChange={(date: Date | null) => setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_date: date || undefined }
                    }))}
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <input 
                        type="text" 
                        className={getInputClasses(false, isDark) + " cursor-pointer"}
                        placeholder="Select preferred date"
                        readOnly
                      />
                    }
                    minDate={new Date()}
                    className="w-full"
                    popperClassName="react-datepicker-popper-custom"
                    calendarClassName={isDark ? "react-datepicker-dark" : ""}
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                  />
                </InputGroup>

                <InputGroup label="Preferred Time Slot (Optional)" icon={Clock}>
                  <Select
                    options={preferredTimingsOptions}
                    value={preferredTimingsOptions.find(option => option.value === formState.demoSessionDetails.preferred_time_slot)}
                    onChange={(selected) => setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_time_slot: selected?.value || "" }
                    }))}
                    styles={selectStyles}
                    placeholder="Select a time slot"
                    isClearable
                  />
                </InputGroup>
              </div>

              <InputGroup label="Special Requirements (Optional)">
                <textarea
                  className={getInputClasses(false, isDark) + " h-24 resize-none"}
                  value={formState.demoSessionDetails.special_requirements || ""}
                  onChange={(e) => setFormState(prev => ({ 
                    ...prev, 
                    demoSessionDetails: { ...prev.demoSessionDetails, special_requirements: e.target.value }
                  }))}
                  placeholder="Any specific topics you'd like to focus on or special requirements..."
                />
              </InputGroup>
            </div>

            {/* Consent */}
            <div className={buildAdvancedComponent.glassCard({ variant: 'light' }) + " p-6 space-y-4"}>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Consent & Agreements
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.terms_accepted && formState.consent.privacy_policy_accepted}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { 
                        ...prev.consent, 
                        terms_accepted: e.target.checked,
                        privacy_policy_accepted: e.target.checked 
                      }
                    }))}
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      I agree to the{" "}
                      <Link href="/terms-and-services" className="text-primary-500 hover:underline font-semibold">
                        Terms of Use
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" className="text-primary-500 hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.gdpr_consent}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { ...prev.consent, gdpr_consent: e.target.checked }
                    }))}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I consent to the processing of my data in accordance with GDPR regulations
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                    checked={formState.consent.marketing_consent}
                    onChange={(e) => setFormState(prev => ({ 
                      ...prev, 
                      consent: { ...prev.consent, marketing_consent: e.target.checked }
                    }))}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I would like to receive updates about courses and educational content
                  </span>
                </label>
              </div>

              <ErrorMessage error={formState.validationErrors.termsAccepted || formState.validationErrors.privacyAccepted} />
            </div>

            {/* Navigation and Submit */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={formState.isSubmitting}
                className={buildComponent.button("secondary", "lg")}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className={buildComponent.button("primary", "lg") + " min-w-[200px]"}
              >
                {formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" /> 
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    Book Demo Session
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100">
      <div className="absolute inset-0" onClick={formState.isSubmitting ? undefined : onClose} />
      {renderFormContent()}
    </div>
  );
};

export default DemoSessionForm; 