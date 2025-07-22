"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { 
  X, Calendar, Clock, MapPin, AlertCircle, CheckCircle, 
  Radio, Loader2, Phone, Mail, User, GraduationCap, 
  Building, Globe, Heart, ChevronRight, ChevronLeft
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

// Enhanced Form Step Type - Simplified
type FormStep = 'details' | 'preferences';

// Compact Form Field Styles
const getInputClasses = (hasError: boolean, isDark: boolean) => {
  const baseClasses = "w-full p-3 rounded-lg border transition-all duration-200 focus:ring-1 focus:ring-offset-0 focus:outline-none text-sm";
  const errorClasses = hasError 
    ? "border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500 text-red-900 dark:text-red-100"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 dark:hover:border-gray-500";
  
  return `${baseClasses} ${errorClasses}`;
};

const labelClasses = "block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1";
const errorClasses = "flex items-center gap-1 text-red-600 dark:text-red-400 text-xs mt-1";

// Compact Options Arrays
const gradeOptions: { value: TStudentGrade; label: string }[] = [
  { value: "Grade 1-2", label: "Grade 1-2" },
  { value: "Grade 3-4", label: "Grade 3-4" },
  { value: "Grade 5-6", label: "Grade 5-6" },
  { value: "Grade 7-8", label: "Grade 7-8" },
  { value: "Grade 9-10", label: "Grade 9-10" },
  { value: "Grade 11-12", label: "Grade 11-12" },
  { value: "Home Study", label: "Home Study" },
];

const qualificationOptions: { value: THighestQualification; label: string }[] = [
  { value: "10th passed", label: "10th Standard" },
  { value: "12th passed", label: "12th Standard" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Graduate", label: "Graduate" },
  { value: "Post-Graduate", label: "Post-Graduate" },
];

const knowMedhFromOptions: { value: TKnowMedhFrom; label: string }[] = [
  { value: "social_media", label: "Social Media" },
  { value: "friend", label: "Friend/Family" },
  { value: "online_ad", label: "Online Ad" },
  { value: "school_event", label: "School Event" },
  { value: "other", label: "Other" },
];

const preferredTimingsOptions = [
  { value: "morning(8am - 12pm)", label: "Morning (8AM-12PM)" },
  { value: "afternoon(12pm - 5pm)", label: "Afternoon (12PM-5PM)" },
  { value: "evening(5pm - 10pm)", label: "Evening (5PM-10PM)" },
];

// Form State Interface - Simplified
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

// Compact Error Message Component
const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  
  return (
    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs mt-1">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

// Compact Input Group Component
const InputGroup = ({ 
  label, 
  required = false, 
  error, 
  children,
  className = ""
}: { 
  label: string; 
  required?: boolean; 
  error?: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className={labelClasses}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    <ErrorMessage error={error} />
  </div>
);

// Compact Progress Indicator
const CompactProgressIndicator = ({ currentStep }: { currentStep: FormStep }) => {
  const steps: FormStep[] = ['details', 'preferences'];
  const stepLabels = ['Details', 'Preferences'];
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
              ${index <= currentIndex 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
              }
            `}>
              {index < currentIndex ? <CheckCircle size={14} /> : index + 1}
            </div>
            <span className={`
              text-xs font-medium transition-colors
              ${index <= currentIndex ? 'text-primary-500' : 'text-gray-400'}
            `}>
              {stepLabels[index]}
            </span>
            {index < steps.length - 1 && (
              <div className={`
                w-8 h-0.5 transition-colors
                ${index < currentIndex ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const DemoSessionForm: React.FC<DemoSessionFormProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Enhanced Form State
  const [formState, setFormState] = useState<IFormState>({
    step: 'details',
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
      try {
        const response = await DemoSessionAPI.getLiveCourses();
        if (response.success && response.data) {
          // Extract unique categories from live courses
          const categories = Array.from(new Set(
            response.data
              .filter(course => course && course.category)
              .map(course => course.category)
          )).map(category => ({
            _id: category,
            title: category,
            category: category
          }));
          
          setFormState(prev => ({ 
            ...prev, 
            liveCourses: categories,
            isLoadingCourses: false 
          }));
        }
      } catch (error) {
        setFormState(prev => ({ 
          ...prev, 
          liveCourses: [], 
          isLoadingCourses: false 
        }));
      }
    };
    
    fetchCourses();
  }, []);

  // Memoize course options
  const courseOptions = useMemo(() => {
    return formState.liveCourses
      .filter(course => course && course.title && course._id)
      .map(course => ({ 
        value: course._id, 
        label: course.title 
      }));
  }, [formState.liveCourses]);

  // Enhanced form validation
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (formState.step === 'details') {
      if (formState.isStudentUnder16 === null) {
        errors.age = "Please select student's age group.";
      }
      
      if (formState.isStudentUnder16) {
        // Validate parent details
        if (!formState.parentDetails.name.trim()) errors.parentName = "Required";
        if (!FormValidation.validateEmail(formState.parentDetails.email)) errors.parentEmail = "Invalid email";
        if (!formState.parentDetails.mobile_no.trim()) errors.parentMobile = "Required";
        if (!formState.parentDetails.city.trim()) errors.parentCity = "Required";
        
        // Validate student details
        if (!formState.studentDetailsUnder16.name.trim()) errors.studentName = "Required";
        if (!formState.studentDetailsUnder16.city.trim()) errors.studentCity = "Required";
        if (!formState.studentDetailsUnder16.state.trim()) errors.studentState = "Required";
        if (formState.studentDetailsUnder16.preferred_course.length === 0) errors.preferredCourse = "Select at least one course";
      } else {
        // Validate 16+ student details
        if (!formState.studentDetails16AndAbove.name.trim()) errors.studentName = "Required";
        if (!FormValidation.validateEmail(formState.studentDetails16AndAbove.email)) errors.studentEmail = "Invalid email";
        if (!formState.studentDetails16AndAbove.mobile_no.trim()) errors.studentMobile = "Required";
        if (!formState.studentDetails16AndAbove.city.trim()) errors.studentCity = "Required";
        if (formState.studentDetails16AndAbove.preferred_course.length === 0) errors.preferredCourse = "Select at least one course";
      }
    }
    
    if (formState.step === 'preferences') {
      if (!formState.consent.terms_accepted) errors.terms = "Required";
      if (!formState.consent.privacy_policy_accepted) errors.privacy = "Required";
    }

    setFormState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  // Enhanced form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;

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
            <div class="text-center space-y-3">
              <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                Demo session request submitted successfully!
              </div>
              ${response.data?.confirmation_number ? 
                `<div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                  <strong>Ref:</strong> ${response.data.confirmation_number}
                </div>` : ''
              }
              <div class="text-sm text-gray-600 dark:text-gray-400">
                We'll contact you shortly to schedule your session.
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonText: "Got it!",
        });
        onClose();
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error: any) {
      await Swal.fire({
        title: "Submission Error",
        text: error.message || "Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Navigation helpers
  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    setFormState(prev => ({ ...prev, step: 'preferences', validationErrors: {} }));
  }, [validateCurrentStep]);

  const goToPreviousStep = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'details', validationErrors: {} }));
  }, []);

  // Compact select styles
  const selectStyles = useMemo(() => ({
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: state.isFocused ? '#6366f1' : isDark ? '#374151' : '#d1d5db',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      minHeight: '40px',
      fontSize: '14px',
      boxShadow: state.isFocused ? '0 0 0 1px rgba(99, 102, 241, 0.2)' : 'none',
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
      fontSize: '14px',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#4f46e5' : '#e0e7ff',
      borderRadius: '0.375rem',
      fontSize: '12px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
      borderRadius: '0.5rem',
      fontSize: '14px',
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
      fontSize: '14px',
      cursor: 'pointer',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontSize: '14px',
    }),
  }), [isDark]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={formState.isSubmitting ? undefined : onClose} />
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden relative z-20 border border-gray-200 dark:border-gray-700">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Free Demo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Experience our teaching firsthand</p>
          </div>
          <button
            onClick={onClose}
            disabled={formState.isSubmitting}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
          <CompactProgressIndicator currentStep={formState.step} />
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-4">
            {/* Details Step */}
            {formState.step === 'details' && (
              <div className="space-y-4">
                {/* Age Selection */}
                {formState.isStudentUnder16 === null && (
                  <div className="text-center space-y-4 py-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Is the student under 16 years old?
                    </h3>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setFormState(prev => ({ 
                          ...prev, 
                          isStudentUnder16: true, 
                          validationErrors: {} 
                        }))}
                        className={buildComponent.button("primary", "md") + " flex items-center gap-2"}
                      >
                        <Heart className="h-4 w-4" />
                        Yes, Under 16
                      </button>
                      <button
                        onClick={() => setFormState(prev => ({ 
                          ...prev, 
                          isStudentUnder16: false, 
                          validationErrors: {} 
                        }))}
                        className={buildComponent.button("secondary", "md") + " flex items-center gap-2"}
                      >
                        <GraduationCap className="h-4 w-4" />
                        No, 16 & Above
                      </button>
                    </div>
                    <ErrorMessage error={formState.validationErrors.age} />
                  </div>
                )}

                {/* Form Fields Based on Age */}
                {formState.isStudentUnder16 === true && (
                  <div className="space-y-4">
                    {/* Parent Details */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Parent/Guardian Details
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputGroup label="Parent's Name" required error={formState.validationErrors.parentName}>
                          <input
                            type="text"
                            className={getInputClasses(!!formState.validationErrors.parentName, isDark)}
                            value={formState.parentDetails.name}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              parentDetails: { ...prev.parentDetails, name: e.target.value }
                            }))}
                            placeholder="Full name"
                          />
                        </InputGroup>

                        <InputGroup label="Parent's Email" required error={formState.validationErrors.parentEmail}>
                          <input
                            type="email"
                            className={getInputClasses(!!formState.validationErrors.parentEmail, isDark)}
                            value={formState.parentDetails.email}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              parentDetails: { ...prev.parentDetails, email: e.target.value }
                            }))}
                            placeholder="Email address"
                          />
                        </InputGroup>

                        <InputGroup label="Phone Number" required error={formState.validationErrors.parentMobile}>
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
                            placeholder="Phone number"
                            error={formState.validationErrors.parentMobile}
                          />
                        </InputGroup>

                        <InputGroup label="City" required error={formState.validationErrors.parentCity}>
                          <input
                            type="text"
                            className={getInputClasses(!!formState.validationErrors.parentCity, isDark)}
                            value={formState.parentDetails.city}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              parentDetails: { ...prev.parentDetails, city: e.target.value }
                            }))}
                            placeholder="Current city"
                          />
                        </InputGroup>
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student Details
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputGroup label="Student's Name" required error={formState.validationErrors.studentName}>
                          <input
                            type="text"
                            className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                            value={formState.studentDetailsUnder16.name}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              studentDetailsUnder16: { ...prev.studentDetailsUnder16, name: e.target.value }
                            }))}
                            placeholder="Student's full name"
                          />
                        </InputGroup>

                        <InputGroup label="Grade" required>
                          <Select
                            options={gradeOptions}
                            value={gradeOptions.find(option => option.value === formState.studentDetailsUnder16.grade)}
                            onChange={(selected) => setFormState(prev => ({ 
                              ...prev, 
                              studentDetailsUnder16: { ...prev.studentDetailsUnder16, grade: selected?.value || "Grade 1-2" }
                            }))}
                            styles={selectStyles}
                            placeholder="Select grade"
                            isSearchable
                          />
                        </InputGroup>

                        <InputGroup label="City" required error={formState.validationErrors.studentCity}>
                          <input
                            type="text"
                            className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                            value={formState.studentDetailsUnder16.city}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              studentDetailsUnder16: { ...prev.studentDetailsUnder16, city: e.target.value }
                            }))}
                            placeholder="Student's city"
                          />
                        </InputGroup>

                        <InputGroup label="State" required error={formState.validationErrors.studentState}>
                          <input
                            type="text"
                            className={getInputClasses(!!formState.validationErrors.studentState, isDark)}
                            value={formState.studentDetailsUnder16.state}
                            onChange={(e) => setFormState(prev => ({ 
                              ...prev, 
                              studentDetailsUnder16: { ...prev.studentDetailsUnder16, state: e.target.value }
                            }))}
                            placeholder="State/Region"
                          />
                        </InputGroup>
                      </div>

                      <InputGroup label="Preferred Course(s)" required error={formState.validationErrors.preferredCourse}>
                        <Select
                          options={courseOptions}
                          value={formState.studentDetailsUnder16.preferred_course
                            .map(title => courseOptions.find(option => option.label === title))
                            .filter(option => option !== undefined)}
                          onChange={(selected) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetailsUnder16: { 
                              ...prev.studentDetailsUnder16, 
                              preferred_course: selected ? selected.map((s: any) => s.label) : [] 
                            }
                          }))}
                          styles={selectStyles}
                          placeholder={formState.isLoadingCourses ? "Loading..." : "Select courses"}
                          isMulti
                          isDisabled={formState.isLoadingCourses}
                          isSearchable
                        />
                      </InputGroup>

                      <InputGroup label="How did you hear about Medh?" required>
                        <Select
                          options={knowMedhFromOptions}
                          value={knowMedhFromOptions.find(option => option.value === formState.studentDetailsUnder16.know_medh_from)}
                          onChange={(selected) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetailsUnder16: { ...prev.studentDetailsUnder16, know_medh_from: selected?.value || "social_media" }
                          }))}
                          styles={selectStyles}
                          placeholder="Select source"
                          isSearchable
                        />
                      </InputGroup>
                    </div>
                  </div>
                )}

                {/* 16+ Student Form */}
                {formState.isStudentUnder16 === false && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputGroup label="Full Name" required error={formState.validationErrors.studentName}>
                        <input
                          type="text"
                          className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                          value={formState.studentDetails16AndAbove.name}
                          onChange={(e) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, name: e.target.value }
                          }))}
                          placeholder="Your full name"
                        />
                      </InputGroup>

                      <InputGroup label="Email" required error={formState.validationErrors.studentEmail}>
                        <input
                          type="email"
                          className={getInputClasses(!!formState.validationErrors.studentEmail, isDark)}
                          value={formState.studentDetails16AndAbove.email}
                          onChange={(e) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, email: e.target.value }
                          }))}
                          placeholder="Your email"
                        />
                      </InputGroup>

                      <InputGroup label="Phone" required error={formState.validationErrors.studentMobile}>
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
                          placeholder="Your phone"
                          error={formState.validationErrors.studentMobile}
                        />
                      </InputGroup>

                      <InputGroup label="City" required error={formState.validationErrors.studentCity}>
                        <input
                          type="text"
                          className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                          value={formState.studentDetails16AndAbove.city}
                          onChange={(e) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, city: e.target.value }
                          }))}
                          placeholder="Your city"
                        />
                      </InputGroup>

                      <InputGroup label="Qualification" required>
                        <Select
                          options={qualificationOptions}
                          value={qualificationOptions.find(option => option.value === formState.studentDetails16AndAbove.highest_qualification)}
                          onChange={(selected) => setFormState(prev => ({ 
                            ...prev, 
                            studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, highest_qualification: selected?.value || "10th passed" }
                          }))}
                          styles={selectStyles}
                          placeholder="Select qualification"
                          isSearchable
                        />
                      </InputGroup>

                      <InputGroup label="Status" required>
                        <div className="flex gap-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.studentDetails16AndAbove.currently_studying}
                              onChange={(e) => setFormState(prev => ({ 
                                ...prev, 
                                studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_studying: e.target.checked }
                              }))}
                            />
                            <span className="text-gray-700 dark:text-gray-300">Studying</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.studentDetails16AndAbove.currently_working}
                              onChange={(e) => setFormState(prev => ({ 
                                ...prev, 
                                studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_working: e.target.checked }
                              }))}
                            />
                            <span className="text-gray-700 dark:text-gray-300">Working</span>
                          </label>
                        </div>
                      </InputGroup>
                    </div>

                    <InputGroup label="Preferred Course(s)" required error={formState.validationErrors.preferredCourse}>
                      <Select
                        options={courseOptions}
                        value={formState.studentDetails16AndAbove.preferred_course
                          .map(title => courseOptions.find(option => option.label === title))
                          .filter(option => option !== undefined)}
                        onChange={(selected) => setFormState(prev => ({ 
                          ...prev, 
                          studentDetails16AndAbove: { 
                            ...prev.studentDetails16AndAbove, 
                            preferred_course: selected ? selected.map((s: any) => s.label) : [] 
                          }
                        }))}
                        styles={selectStyles}
                        placeholder={formState.isLoadingCourses ? "Loading..." : "Select courses"}
                        isMulti
                        isDisabled={formState.isLoadingCourses}
                        isSearchable
                      />
                    </InputGroup>

                    <InputGroup label="How did you hear about Medh?" required>
                      <Select
                        options={knowMedhFromOptions}
                        value={knowMedhFromOptions.find(option => option.value === formState.studentDetails16AndAbove.know_medh_from)}
                        onChange={(selected) => setFormState(prev => ({ 
                          ...prev, 
                          studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, know_medh_from: selected?.value || "social_media" }
                        }))}
                        styles={selectStyles}
                        placeholder="Select source"
                        isSearchable
                      />
                    </InputGroup>
                  </div>
                )}

                {/* Next Button */}
                {formState.isStudentUnder16 !== null && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className={buildComponent.button("primary", "md") + " flex items-center gap-2"}
                    >
                      Next: Preferences <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Step */}
            {formState.step === 'preferences' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Demo Preferences */}
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Demo Session Preferences (Optional)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputGroup label="Preferred Date">
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
                            placeholder="Select date"
                            readOnly
                          />
                        }
                        minDate={new Date()}
                        popperClassName="react-datepicker-popper-custom"
                        calendarClassName={isDark ? "react-datepicker-dark" : ""}
                      />
                    </InputGroup>

                    <InputGroup label="Preferred Time">
                      <Select
                        options={preferredTimingsOptions}
                        value={preferredTimingsOptions.find(option => option.value === formState.demoSessionDetails.preferred_time_slot)}
                        onChange={(selected) => setFormState(prev => ({ 
                          ...prev, 
                          demoSessionDetails: { ...prev.demoSessionDetails, preferred_time_slot: selected?.value || "" }
                        }))}
                        styles={selectStyles}
                        placeholder="Select time slot"
                        isClearable
                      />
                    </InputGroup>
                  </div>

                  <InputGroup label="Special Requirements">
                    <textarea
                      className={getInputClasses(false, isDark) + " h-16 resize-none text-sm"}
                      value={formState.demoSessionDetails.special_requirements || ""}
                      onChange={(e) => setFormState(prev => ({ 
                        ...prev, 
                        demoSessionDetails: { ...prev.demoSessionDetails, special_requirements: e.target.value }
                      }))}
                      placeholder="Any specific topics or requirements..."
                    />
                  </InputGroup>
                </div>

                {/* Consent */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Consent & Agreements
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
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
                      <span className="text-gray-700 dark:text-gray-300">
                        I agree to the{" "}
                        <Link href="/terms-and-services" className="text-primary-500 hover:underline">
                          Terms of Use
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy-policy" className="text-primary-500 hover:underline">
                          Privacy Policy
                        </Link>
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                        checked={formState.consent.marketing_consent}
                        onChange={(e) => setFormState(prev => ({ 
                          ...prev, 
                          consent: { ...prev.consent, marketing_consent: e.target.checked }
                        }))}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Send me updates about courses and content
                      </span>
                    </label>
                  </div>

                  <ErrorMessage error={formState.validationErrors.terms || formState.validationErrors.privacy} />
                </div>

                {/* Navigation and Submit */}
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={formState.isSubmitting}
                    className={buildComponent.button("secondary", "md") + " flex items-center gap-2"}
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className={buildComponent.button("primary", "md") + " flex items-center gap-2 min-w-[140px]"}
                  >
                    {formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> 
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Book Demo
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSessionForm; 