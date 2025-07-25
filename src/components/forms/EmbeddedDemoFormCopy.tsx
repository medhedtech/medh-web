"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { 
  CheckCircle, AlertCircle, Loader2, Phone, Mail, User, 
  GraduationCap, MapPin, Clock, Calendar, Monitor, Wifi, 
  Languages, ChevronRight, ChevronLeft, Heart
} from "lucide-react";
import Select from "react-select";
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode } from 'libphonenumber-js';
import * as countryCodesList from 'country-codes-list';
import {
  IBookFreeDemoSessionPayload,
  DemoSessionAPIService as DemoSessionAPI,
  FormValidationService,
} from "@/apis/demoCopy.api";
import { usePostQueryCopy } from '@/hooks/postQueryCopy.hook';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Swal from "sweetalert2";
import PhoneNumberInput from '../shared/login/PhoneNumberInput';
import CustomReCaptchaCopy from '../shared/ReCaptchaCopy';
import Link from "next/link";

// ========== EMBEDDED FORM STATE ==========

type TFormStep = 'age-verification' | 'parent-details' | 'contact-details' | 'student-details' | 'demo-details' | 'consent';

interface IEmbeddedFormState {
  // Step management
  step: TFormStep;
  isStudentUnder16: boolean | null;
  
  // Form data (complete API specification)
  formData: {
    // Contact Info
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobileCountryCode: string;
    mobileNumber: string;
    city: string;
    country: string;
    address: string;
    linkedinProfile: string;
    portfolioUrl: string;
    
    // Parent Details (for under 16)
    parentRelationship: 'father' | 'mother' | 'guardian';
    parentPreferredTimings: string;
    
    // Student Details
    studentName: string;
    studentEmail: string; // for 16+
    grade: string; // for under 16
    schoolName: string;
    studentCity: string;
    studentState: string;
    studentCountry: string;
    parentMobileAccess: boolean; // for under 16
    learningStylePreference: 'visual' | 'auditory' | 'hands_on' | 'reading' | 'mixed';
    knowMedhFrom: 'social_media' | 'friends' | 'website' | 'advertisement' | 'other';
    
    // For 16+ students
    highestQualification: string;
    currentlyStudying: boolean;
    currentlyWorking: boolean;
    educationInstituteName: string;
    
    // Course preferences
    preferredCourses: string[];
    preferredTimings: string;
    
    // Demo session details
    preferredDate?: Date;
    preferredTimeSlot: string;
    preferredContactTime: string;
    timezone: string;
    sessionDurationPreference: '30min' | '45min' | '60min';
    previousDemoAttended: boolean;
    
    // Consent
    termsAndPrivacy: boolean;
    dataCollectionConsent: boolean;
    marketingConsent: boolean;
    gdprConsent: boolean;
    communicationConsent: boolean;
    
    // Marketing preferences
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappUpdates: boolean;
    courseRecommendations: boolean;
    
    // Captcha
    captchaToken: string;
  };
  
  // UI state
  errors: Record<string, string>;
  isSubmitting: boolean;
  liveCourses: Array<{id: string; title: string}>;
}

interface EmbeddedDemoFormCopyProps {
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  initialData?: any;
  className?: string;
}

// ========== PHONE VALIDATION & SMART PARSING ==========

const validatePhoneNumber = (number: string, countryCode: string): boolean => {
  if (!number) return false;
  
  // Clean the number first
  const cleanNumber = number.replace(/\D/g, '');
  
  try {
    // Try to validate with libphonenumber first
    // Make sure country code is uppercase
    const upperCountryCode = countryCode.toUpperCase();
    return isValidPhoneNumber(cleanNumber, upperCountryCode as any);
  } catch (error) {
    console.debug('libphonenumber validation failed:', error);
    // Fallback to legacy validation
    switch (countryCode.toUpperCase()) {
      case 'IN': // India
        return cleanNumber.length === 10 && /^[6-9]/.test(cleanNumber);
      case 'US': // United States
      case 'CA': // Canada
        return cleanNumber.length === 10;
      case 'GB': // United Kingdom
        return cleanNumber.length >= 10 && cleanNumber.length <= 11;
      case 'AU': // Australia
        return cleanNumber.length === 9 || cleanNumber.length === 10;
      default:
        return cleanNumber.length >= 7 && cleanNumber.length <= 15;
    }
  }
};



// ========== FORM OPTIONS ==========

const gradeOptions = [
  { value: "grade_1-2", label: "Grade 1-2 (Ages 6-8)" },
  { value: "grade_3-4", label: "Grade 3-4 (Ages 8-10)" },
  { value: "grade_5-6", label: "Grade 5-6 (Ages 10-12)" },
  { value: "grade_7-8", label: "Grade 7-8 (Ages 12-14)" },
  { value: "grade_9-10", label: "Grade 9-10 (Ages 14-16)" },
  { value: "grade_11-12", label: "Grade 11-12 (Ages 16-18)" },
  { value: "home_study", label: "Home Study/Homeschooling" },
];

const qualificationOptions = [
  { value: "10th passed", label: "10th Standard" },
  { value: "12th passed", label: "12th Standard" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Graduate", label: "Graduate" },
  { value: "Post-Graduate", label: "Post-Graduate" },
];

const courseCategories = [
  'AI & Data Science',
  'Digital Marketing',
  'Personality Development', 
  'Vedic Mathematics'
];

// Generate comprehensive country options from country-codes-list
const generateCountryOptions = () => {
  const allCountries = countryCodesList.all() as Record<string, any>;
  const countryList = countryCodesList.customList('countryCode', '{countryNameEn}') as Record<string, string>;
  
  // Priority countries to show at the top
  const priorityCountries = ['in', 'us', 'gb', 'ca', 'au', 'ae', 'sg'];
  
  const allOptions = Object.entries(countryList).map(([code, name]: [string, string]) => {
    return {
      value: code.toLowerCase(),
      label: name,
      dialCode: allCountries[code]?.countryCallingCode,
      isPriority: priorityCountries.includes(code.toLowerCase())
    };
  });
  
  // Sort: Priority countries first, then alphabetical
  return allOptions.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return a.label.localeCompare(b.label);
  });
};

const timeSlots = [
  { value: 'morning', label: 'Morning (9AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { value: 'evening', label: 'Evening (5PM-8PM)' },
];

// ========== MAIN COMPONENT ==========

const EmbeddedDemoFormCopy: React.FC<EmbeddedDemoFormCopyProps> = ({ 
  onSubmitSuccess, 
  onSubmitError,
  initialData,
  className = ""
}) => {
  const { theme } = useTheme();
  const { postQuery } = usePostQueryCopy();
  const isDark = theme === "dark";

  // Generate country options
  const countryOptions = useMemo(() => generateCountryOptions(), []);

  // Form state
  const [formState, setFormState] = useState<IEmbeddedFormState>({
    step: 'age-verification',
    isStudentUnder16: null,
    formData: {
      // Contact Info
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobileCountryCode: '+91',
      mobileNumber: '',
      city: '',
      country: 'in',
      address: '',
      linkedinProfile: '',
      portfolioUrl: '',
      
      // Parent Details
      parentRelationship: 'father',
      parentPreferredTimings: '',
      
      // Student Details
      studentName: '',
      studentEmail: '',
      grade: 'grade_1-2',
      schoolName: '',
      studentCity: '',
      studentState: '',
      studentCountry: 'India',
      parentMobileAccess: true,
      learningStylePreference: 'mixed',
      knowMedhFrom: 'social_media',
      
      // For 16+ students
      highestQualification: '12th passed',
      currentlyStudying: false,
      currentlyWorking: false,
      educationInstituteName: '',
      
      // Course preferences
      preferredCourses: [],
      preferredTimings: '',
      
      // Demo session details
      preferredDate: undefined,
          preferredTimeSlot: '',
    preferredContactTime: 'flexible',
    timezone: 'Asia/Kolkata',
      sessionDurationPreference: '45min',
      previousDemoAttended: false,
      
      // Consent
      termsAndPrivacy: true,
      dataCollectionConsent: true,
      marketingConsent: false,
      gdprConsent: false,
      communicationConsent: false,
      
      // Marketing preferences
      emailNotifications: true,
      smsNotifications: false,
      whatsappUpdates: true,
      courseRecommendations: true,
      
      // Captcha
      captchaToken: '',
    },
    errors: {},
    isSubmitting: false,
    liveCourses: []
  });

  // Initialize with provided data
  useEffect(() => {
    if (initialData) {
      setFormState(prev => ({
        ...prev,
        formData: { ...prev.formData, ...initialData }
      }));
    }
  }, [initialData]);

  // Update form data helper
  const updateFormData = useCallback((updates: Partial<IEmbeddedFormState['formData']>) => {
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
      errors: {} // Clear errors on update
    }));
  }, []);



  // Validation
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    const { formData, isStudentUnder16, step } = formState;

    if (step === 'age-verification') {
      // Age verification is mandatory
      if (isStudentUnder16 === null) {
        errors.age = "Please select whether the student is less than 16 years old";
      }
    }

    if (step === 'parent-details') {
      // Parent details validation for under 16
      if (!formData.firstName.trim()) errors.firstName = "Parent name is required";
      if (!formData.lastName.trim()) errors.lastName = "Parent last name is required"; 
      if (!FormValidationService.validateEmail(formData.email).isValid) errors.email = "Valid parent email is required";
      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = "Parent mobile number is required";
      } else if (!validatePhoneNumber(formData.mobileNumber, formData.country)) {
        errors.mobileNumber = "Please enter a valid mobile number";
      }
      if (!formData.city.trim()) errors.city = "Parent city is required";
    }

    if (step === 'contact-details') {
      // Contact details validation for 16+
      if (!FormValidationService.validateEmail(formData.studentEmail).isValid) errors.studentEmail = "Valid email is required";
      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = "Mobile number is required";
      } else if (!validatePhoneNumber(formData.mobileNumber, formData.country)) {
        errors.mobileNumber = "Please enter a valid mobile number";
      }
      if (!formData.city.trim()) errors.city = "City is required";
    }

    if (step === 'student-details') {
      // Student details validation
      if (!formData.studentName.trim()) errors.studentName = "Student name is required";
      
      if (isStudentUnder16) {
        // Under 16 specific validation
        if (!formData.grade) errors.grade = "Grade is required";
      } else {
        // 16+ specific validation (includes contact details)
        if (!formData.highestQualification) errors.qualification = "Qualification is required";
        if (!FormValidationService.validateEmail(formData.studentEmail).isValid) errors.studentEmail = "Valid email is required";
        if (!formData.mobileNumber.trim()) {
          errors.mobileNumber = "Mobile number is required";
        } else if (!validatePhoneNumber(formData.mobileNumber, formData.country)) {
          errors.mobileNumber = "Please enter a valid mobile number";
        }
        if (!formData.city.trim()) errors.city = "City is required";
      }
    }

    if (step === 'demo-details') {
      // Demo session details validation - now includes course selection
      if (formData.preferredCourses.length === 0) errors.courses = "Please select at least one course";
    }

    if (step === 'consent') {
      // Consent validation
      if (!formData.termsAndPrivacy) errors.terms = "Please accept terms and privacy policy";
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  // Navigation
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    
    if (formState.step === 'age-verification') {
      if (formState.isStudentUnder16) {
        setFormState(prev => ({ ...prev, step: 'parent-details', errors: {} }));
      } else {
        setFormState(prev => ({ ...prev, step: 'student-details', errors: {} }));
      }
    } else if (formState.step === 'parent-details') {
      setFormState(prev => ({ ...prev, step: 'student-details', errors: {} }));
    } else if (formState.step === 'student-details') {
      setFormState(prev => ({ ...prev, step: 'demo-details', errors: {} }));
    } else if (formState.step === 'demo-details') {
      setFormState(prev => ({ ...prev, step: 'consent', errors: {} }));
    }
  }, [formState.step, formState.isStudentUnder16, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (formState.step === 'parent-details') {
      setFormState(prev => ({ ...prev, step: 'age-verification', errors: {} }));
    } else if (formState.step === 'student-details') {
      if (formState.isStudentUnder16) {
      setFormState(prev => ({ ...prev, step: 'parent-details', errors: {} }));
      } else {
        setFormState(prev => ({ ...prev, step: 'age-verification', errors: {} }));
      }
    } else if (formState.step === 'demo-details') {
      setFormState(prev => ({ ...prev, step: 'student-details', errors: {} }));
    } else if (formState.step === 'consent') {
      setFormState(prev => ({ ...prev, step: 'demo-details', errors: {} }));
    }
  }, [formState.step, formState.isStudentUnder16]);

  // Form submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const payload = {
        form_type: 'book_a_free_demo_session_copy',
        captcha_token: formState.formData.captchaToken,
        is_student_under_16: formState.isStudentUnder16,
        contact_info: {
          first_name: formState.formData.firstName,
          middle_name: formState.formData.middleName || undefined,
          last_name: formState.formData.lastName,
          full_name: `${formState.formData.firstName} ${formState.formData.middleName} ${formState.formData.lastName}`.trim(),
          email: formState.formData.email,
          mobile_number: {
            country_code: formState.formData.mobileCountryCode,
            number: formState.formData.mobileNumber
          },
          city: formState.formData.city,
          country: formState.formData.country,
          address: formState.formData.address || undefined,
        },
        ...(formState.isStudentUnder16 && {
          parent_details: {
            relationship: formState.formData.parentRelationship,
            preferred_timings: formState.formData.parentPreferredTimings || undefined
          }
        }),
        student_details: {
          name: formState.formData.studentName,
          ...(formState.isStudentUnder16 ? {
            grade: formState.formData.grade,
            school_name: formState.formData.schoolName || undefined,
            city: formState.formData.studentCity || undefined,
            state: formState.formData.studentState || undefined,
            country: formState.formData.studentCountry || undefined,
            parent_mobile_access: formState.formData.parentMobileAccess,
            learning_style_preference: formState.formData.learningStylePreference,
            know_medh_from: formState.formData.knowMedhFrom
          } : {
            email: formState.formData.studentEmail,
            highest_qualification: formState.formData.highestQualification,
            currently_studying: formState.formData.currentlyStudying,
            currently_working: formState.formData.currentlyWorking,
            education_institute_name: formState.formData.educationInstituteName || undefined,
            know_medh_from: formState.formData.knowMedhFrom
          }),
          preferred_course: formState.formData.preferredCourses,
          preferred_timings: formState.formData.preferredTimings || undefined
        },
        demo_session_details: {
          preferred_date: formState.formData.preferredDate ? formState.formData.preferredDate.toISOString() : undefined,
          preferred_time_slot: formState.formData.preferredTimeSlot || undefined,
          timezone: formState.formData.timezone,
          session_duration_preference: formState.formData.sessionDurationPreference,
          previous_demo_attended: formState.formData.previousDemoAttended
        },
        consent: {
          terms_and_privacy: formState.formData.termsAndPrivacy,
          data_collection_consent: formState.formData.dataCollectionConsent,
          marketing_consent: formState.formData.marketingConsent,
          gdpr_consent: formState.formData.gdprConsent,
          communication_consent: formState.formData.communicationConsent
        },
        marketing_preferences: {
          email_notifications: formState.formData.emailNotifications,
          sms_notifications: formState.formData.smsNotifications,
          whatsapp_updates: formState.formData.whatsappUpdates,
          course_recommendations: formState.formData.courseRecommendations
        },
        form_config: {
          form_type: 'book_a_free_demo_session_copy',
          form_version: '2.1',
          submission_id: `embedded_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        submission_metadata: {
          timestamp: new Date().toISOString(),
          form_version: '2.1',
          device_info: {
            type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            os: navigator.platform,
            browser: navigator.userAgent.split(' ').pop() || 'Unknown',
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`
          },
          validation_passed: true,
          form_interaction_time: Math.round((Date.now() - Date.now()) / 1000)
        }
      };

      const { data, error } = await postQuery({
        url: '/forms/submit-copy',
        postData: payload,
        requireAuth: false,
        enableToast: false,
        onSuccess: async (result) => {
          await Swal.fire({
            title: "🎉 Demo Booked Successfully! (Copy Form)",
            html: `
              <div class="text-center space-y-3">
                <div class="text-lg font-semibold text-green-600">
                  Your demo session has been scheduled!
                </div>
                <div class="text-sm text-gray-600">
                  Check your email for session details and meeting link.
                </div>
              </div>
            `,
            icon: "success",
            confirmButtonText: "Perfect!",
          });
          
          if (onSubmitSuccess) {
            onSubmitSuccess(result);
          }
        },
        onFail: async (error) => {
          if (onSubmitError) {
            onSubmitError(error);
          } else {
            await Swal.fire({
              title: "Booking Failed",
              text: "Please try again or contact support.",
              icon: "error",
              confirmButtonText: "Retry",
            });
          }
        }
      });

    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Select styles
  const selectStyles = useMemo(() => ({
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: state.isFocused ? '#6366f1' : isDark ? '#374151' : '#d1d5db',
      borderRadius: '0.5rem',
      padding: '0.125rem',
      minHeight: '38px',
      fontSize: '14px',
      boxShadow: 'none',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#4f46e5' : '#e0e7ff',
      borderRadius: '0.25rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
      borderRadius: '0.5rem',
      zIndex: 99999,
      position: 'absolute',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 99999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#6366f1'
        : state.isFocused
          ? (isDark ? '#374151' : '#f3f4f6')
          : (isDark ? '#1f2937' : '#ffffff'),
      color: state.isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#1f2937'),
    }),
  }), [isDark]);

  return (
    <div className={`h-full bg-background ${className}`}>
      <div className="h-full flex flex-col relative">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-700">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ 
              width: `${
                formState.isStudentUnder16 
                  ? formState.step === 'age-verification' ? 20 : formState.step === 'parent-details' ? 40 : formState.step === 'student-details' ? 60 : formState.step === 'demo-details' ? 80 : 100
                  : formState.step === 'age-verification' ? 25 : formState.step === 'student-details' ? 50 : formState.step === 'demo-details' ? 75 : 100
              }%` 
            }}
          ></div>
        </div>

        {/* Stepper Navigation */}
        <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Stepper - Center Aligned Current Step */}
            <div className="block lg:hidden">
              {formState.isStudentUnder16 ? (
                /* Mobile Under 16 - 5 Step Flow */
                <div className="text-center">
                  {/* Step Counter */}
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      Step {
                        formState.step === 'age-verification' ? '1' :
                        formState.step === 'parent-details' ? '2' :
                        formState.step === 'student-details' ? '3' :
                        formState.step === 'demo-details' ? '4' : '5'
                      } of 5
                    </span>
                  </div>
                  
                  {/* Progress Dots */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((stepNum) => (
                      <div
                        key={stepNum}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          (stepNum === 1 && formState.step === 'age-verification') ||
                          (stepNum === 2 && formState.step === 'parent-details') ||
                          (stepNum === 3 && formState.step === 'student-details') ||
                          (stepNum === 4 && formState.step === 'demo-details') ||
                          (stepNum === 5 && formState.step === 'consent')
                            ? 'bg-blue-500 w-3 h-3'
                            : (stepNum === 1 && ['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step)) ||
                              (stepNum === 2 && ['student-details', 'demo-details', 'consent'].includes(formState.step)) ||
                              (stepNum === 3 && ['demo-details', 'consent'].includes(formState.step)) ||
                              (stepNum === 4 && formState.step === 'consent')
                                ? 'bg-blue-300'
                                : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Mobile 16+ - 4 Step Flow */
                <div className="text-center">
                  {/* Step Counter */}
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      Step {
                        formState.step === 'age-verification' ? '1' :
                        formState.step === 'student-details' ? '2' :
                        formState.step === 'demo-details' ? '3' : '4'
                      } of 4
                    </span>
                  </div>
                  
                  {/* Progress Dots */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <div
                        key={stepNum}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          (stepNum === 1 && formState.step === 'age-verification') ||
                          (stepNum === 2 && formState.step === 'student-details') ||
                          (stepNum === 3 && formState.step === 'demo-details') ||
                          (stepNum === 4 && formState.step === 'consent')
                            ? 'bg-blue-500 w-3 h-3'
                            : (stepNum === 1 && ['student-details', 'demo-details', 'consent'].includes(formState.step)) ||
                              (stepNum === 2 && ['demo-details', 'consent'].includes(formState.step)) ||
                              (stepNum === 3 && formState.step === 'consent')
                                ? 'bg-blue-300'
                                : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Stepper - Original Layout */}
            <div className="hidden lg:block">
              {formState.isStudentUnder16 ? (
                /* Desktop Under 16 - 5 Step Flow */
                <div className="flex items-center justify-between">
                {/* Step 1 - Age Verification */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'age-verification' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : ['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">1</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      formState.step === 'age-verification' || ['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Age Verification
                    </div>
                  </div>
                </div>

                {/* Connector Line 1 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  ['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step) ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 2 - Parent Details */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'parent-details' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : ['student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {['student-details', 'demo-details', 'consent'].includes(formState.step) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">2</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      ['parent-details', 'student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Parent Details
                    </div>
                  </div>
                </div>

                {/* Connector Line 2 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  ['student-details', 'demo-details', 'consent'].includes(formState.step) ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 3 - Student Details */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'student-details' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : ['demo-details', 'consent'].includes(formState.step)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {['demo-details', 'consent'].includes(formState.step) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">3</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      ['student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Student Details
                    </div>
                  </div>
                </div>

                {/* Connector Line 3 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  ['demo-details', 'consent'].includes(formState.step) ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 4 - Demo Session Details */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'demo-details' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : formState.step === 'consent'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {formState.step === 'consent' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">4</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      ['demo-details', 'consent'].includes(formState.step)
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Demo Session Details
                    </div>
                  </div>
                </div>

                {/* Connector Line 4 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  formState.step === 'consent' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 5 - Consent */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'consent' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      formState.step === 'consent'
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Consent
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 16+ - 4 Step Flow */
              <div className="flex items-center justify-between">
                {/* Step 1 - Age Verification */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'age-verification' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : ['student-details', 'demo-details', 'consent'].includes(formState.step)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {['student-details', 'demo-details', 'consent'].includes(formState.step) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">1</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      formState.step === 'age-verification' 
                        ? 'text-blue-600' 
                        : ['student-details', 'demo-details', 'consent'].includes(formState.step)
                          ? 'text-blue-600'
                          : 'text-gray-500'
                    }`}>
                      Age Verification
                    </div>
                  </div>
                </div>

                {/* Connector Line 1 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  ['student-details', 'demo-details', 'consent'].includes(formState.step) ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 2 - Student Details */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'student-details' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : ['demo-details', 'consent'].includes(formState.step)
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {['demo-details', 'consent'].includes(formState.step) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                    <span className="text-sm font-medium">2</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      ['student-details', 'demo-details', 'consent'].includes(formState.step) 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Student Details
                    </div>
                    </div>
                  </div>

                {/* Connector Line 2 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  ['demo-details', 'consent'].includes(formState.step) ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 3 - Demo Session Details */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'demo-details' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : formState.step === 'consent'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {formState.step === 'consent' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">3</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      ['demo-details', 'consent'].includes(formState.step) 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Demo Session Details
                    </div>
                  </div>
                </div>

                {/* Connector Line 3 */}
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  formState.step === 'consent' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>

                {/* Step 4 - Consent */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    formState.step === 'consent' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-medium ${
                      formState.step === 'consent' 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      Consent
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          
          {/* Age Verification Step */}
          {formState.step === 'age-verification' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Age Verification</h2>
                  <p className="text-muted-foreground">Please confirm the student's age to proceed</p>
                              </div>

                {/* Age Verification Section - Only this step */}
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-center mb-6 text-blue-900 dark:text-blue-100">
                      Is the student less than 16 years old?
                    </h3>
                    
                                        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setFormState(prev => ({
                            ...prev,
                            isStudentUnder16: true,
                            errors: {}
                          }));
                        }}
                        className={`flex-1 p-4 border-2 rounded-lg text-center transition-all ${
                          formState.isStudentUnder16 === true 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 hover:border-gray-400 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-1">Yes, Under 16</div>
                        <div className="text-sm text-muted-foreground">Parent/guardian details required</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setFormState(prev => ({
                            ...prev,
                            isStudentUnder16: false,
                            errors: {}
                          }));
                        }}
                        className={`flex-1 p-4 border-2 rounded-lg text-center transition-all ${
                          formState.isStudentUnder16 === false 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 hover:border-gray-400 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-1">No, 16 & Above</div>
                        <div className="text-sm text-muted-foreground">Direct registration</div>
                      </button>
                    </div>
                    
                    {formState.errors.age && (
                      <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">
                        {formState.errors.age}
                      </div>
                        )}
                      </div>
                </div>
              </div>
            )}

          {/* Contact Details Step - 16+ */}
          {formState.step === 'contact-details' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Your Contact Details</h2>
                <p className="text-muted-foreground">Please provide your contact information</p>
                  </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            id="studentEmailRequired"
                            type="email"
                            value={formState.formData.studentEmail}
                            onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                            placeholder="Your Email Address *"
                            className={formState.errors.studentEmail ? 'border-red-500' : ''}
                          />
                          {formState.errors.studentEmail && (
                            <p className="text-xs text-red-500">{formState.errors.studentEmail}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <PhoneNumberInput
                            value={{ 
                              country: formState.formData.country.toUpperCase(), 
                              number: formState.formData.mobileNumber,
                              formattedNumber: formState.formData.mobileNumber,
                              isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                            }}
                            onChange={(val: any) => {
                              updateFormData({ 
                                mobileNumber: val.number,
                                country: val.country.toLowerCase(),
                                mobileCountryCode: getCountryCallingCode(val.country) ? `+${getCountryCallingCode(val.country)}` : '+91'
                              });
                            }}
                            placeholder="Your Mobile Number *"
                            defaultCountry="IN"
                            error={formState.errors.mobileNumber}
                          />
                        </div>

                        <div className="space-y-2">
                          <Input
                            id="city16Plus"
                            value={formState.formData.city}
                            onChange={(e) => updateFormData({ city: e.target.value })}
                            placeholder="Your City *"
                            className={formState.errors.city ? 'border-red-500' : ''}
                          />
                          {formState.errors.city && (
                            <p className="text-xs text-red-500">{formState.errors.city}</p>
                          )}
                        </div>
                              </div>
              </div>
            </div>
          )}

          {/* Parent Details Step - Under 16 */}
          {formState.step === 'parent-details' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Parent's Details</h2>
                <p className="text-muted-foreground">Please provide parent/guardian information</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Input
                      id="parentFirstName"
                      value={formState.formData.firstName}
                      onChange={(e) => updateFormData({ firstName: e.target.value })}
                      placeholder="Parent First Name *"
                      className={`h-12 ${formState.errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {formState.errors.firstName && (
                      <p className="text-xs text-red-500">{formState.errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input
                      id="parentLastName"
                      value={formState.formData.lastName}
                      onChange={(e) => updateFormData({ lastName: e.target.value })}
                      placeholder="Parent Last Name *"
                      className={`h-12 ${formState.errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {formState.errors.lastName && (
                      <p className="text-xs text-red-500">{formState.errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === formState.formData.country)}
                      onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                      styles={{
                        ...selectStyles,
                        control: (provided: any, state: any) => ({
                          ...selectStyles.control(provided, state),
                          minHeight: '48px',
                        })
                      }}
                      placeholder="Select Your Country *"
                      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="space-y-3">
                    <PhoneNumberInput
                      value={{ 
                        country: formState.formData.country.toUpperCase(), 
                        number: formState.formData.mobileNumber,
                        formattedNumber: formState.formData.mobileNumber,
                        isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                      }}
                      onChange={(val: any) => {
                        updateFormData({ 
                          mobileNumber: val.number,
                          country: val.country.toLowerCase(),
                          mobileCountryCode: getCountryCallingCode(val.country) ? `+${getCountryCallingCode(val.country)}` : '+91'
                        });
                      }}
                      placeholder="Mobile No *"
                      defaultCountry="IN"
                      error={formState.errors.mobileNumber}
                    />
                  </div>

                  <div className="space-y-3">
                    <Input
                      id="parentCity"
                      value={formState.formData.city}
                      onChange={(e) => updateFormData({ city: e.target.value })}
                      placeholder="Current City *"
                      className={`h-12 ${formState.errors.city ? 'border-red-500' : ''}`}
                    />
                    {formState.errors.city && (
                      <p className="text-xs text-red-500">{formState.errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formState.formData.email}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      placeholder="Parent Email *"
                      className={`h-12 ${formState.errors.email ? 'border-red-500' : ''}`}
                    />
                    {formState.errors.email && (
                      <p className="text-xs text-red-500">{formState.errors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Student Details Step - 3rd Stepper */}
          {formState.step === 'student-details' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Student Details</h2>
                <p className="text-muted-foreground">Please provide student information and course preferences</p>
              </div>

                            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Input
                      id="studentName"
                      value={formState.formData.studentName}
                      onChange={(e) => updateFormData({ studentName: e.target.value })}
                      placeholder="Student Name *"
                      className={`h-12 ${formState.errors.studentName ? 'border-red-500' : ''}`}
                    />
                    {formState.errors.studentName && (
                      <p className="text-xs text-red-500">{formState.errors.studentName}</p>
                    )}
                  </div>

                  {formState.isStudentUnder16 ? (
                    <div className="space-y-3">
                      <Select
                        options={gradeOptions}
                        value={gradeOptions.find(option => option.value === formState.formData.grade)}
                        onChange={(selected) => updateFormData({ grade: selected?.value || 'grade_1-2' })}
                        styles={{
                          ...selectStyles,
                          control: (provided: any, state: any) => ({
                            ...selectStyles.control(provided, state),
                            minHeight: '48px',
                          })
                        }}
                        placeholder="Grade *"
                        isSearchable={false}
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                      />
                      {formState.errors.grade && (
                        <p className="text-xs text-red-500">{formState.errors.grade}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Select
                        options={qualificationOptions}
                        value={qualificationOptions.find(option => option.value === formState.formData.highestQualification)}
                        onChange={(selected) => updateFormData({ highestQualification: selected?.value || '12th passed' })}
                        styles={{
                          ...selectStyles,
                          control: (provided: any, state: any) => ({
                            ...selectStyles.control(provided, state),
                            minHeight: '48px',
                          })
                        }}
                        placeholder="Highest Qualification *"
                        isSearchable={false}
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                      />
                      {formState.errors.qualification && (
                        <p className="text-xs text-red-500">{formState.errors.qualification}</p>
                      )}
                    </div>
                  )}

                  {formState.isStudentUnder16 ? (
                    <>
                      <div className="space-y-3">
                        <Input
                          id="studentEmail"
                          type="email"
                          value={formState.formData.studentEmail}
                          onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                          placeholder="Student Email (Optional)"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-3">
                        <Input
                          id="schoolName"
                          value={formState.formData.schoolName}
                          onChange={(e) => updateFormData({ schoolName: e.target.value })}
                          placeholder="School Name (Optional)"
                          className="h-12"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Contact Details for 16+ */}
                      <div className="space-y-3">
                        <Input
                          id="studentEmailRequired"
                          type="email"
                          value={formState.formData.studentEmail}
                          onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                          placeholder="Your Email Address *"
                          className={`h-12 ${formState.errors.studentEmail ? 'border-red-500' : ''}`}
                        />
                        {formState.errors.studentEmail && (
                          <p className="text-xs text-red-500">{formState.errors.studentEmail}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <PhoneNumberInput
                          value={{ 
                            country: formState.formData.country.toUpperCase(), 
                            number: formState.formData.mobileNumber,
                            formattedNumber: formState.formData.mobileNumber,
                            isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                          }}
                          onChange={(val: any) => {
                            updateFormData({ 
                              mobileNumber: val.number,
                              country: val.country.toLowerCase(),
                              mobileCountryCode: getCountryCallingCode(val.country) ? `+${getCountryCallingCode(val.country)}` : '+91'
                            });
                          }}
                          placeholder="Your Mobile Number *"
                          defaultCountry="IN"
                          error={formState.errors.mobileNumber}
                        />
                      </div>

                      <div className="space-y-3">
                        <Input
                          id="city16Plus"
                          value={formState.formData.city}
                          onChange={(e) => updateFormData({ city: e.target.value })}
                          placeholder="Your City *"
                          className={`h-12 ${formState.errors.city ? 'border-red-500' : ''}`}
                        />
                        {formState.errors.city && (
                          <p className="text-xs text-red-500">{formState.errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Currently Studying</label>
                            <div className="flex gap-4 mt-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="currentlyStudying"
                                  checked={formState.formData.currentlyStudying === true}
                                  onChange={() => updateFormData({ currentlyStudying: true })}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="currentlyStudying"
                                  checked={formState.formData.currentlyStudying === false}
                                  onChange={() => updateFormData({ currentlyStudying: false })}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">No</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Currently Working</label>
                            <div className="flex gap-4 mt-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="currentlyWorking"
                                  checked={formState.formData.currentlyWorking === true}
                                  onChange={() => updateFormData({ currentlyWorking: true })}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="currentlyWorking"
                                  checked={formState.formData.currentlyWorking === false}
                                  onChange={() => updateFormData({ currentlyWorking: false })}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">No</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formState.formData.currentlyStudying && (
                        <div className="md:col-span-2 space-y-3">
                          <Input
                            id="educationInstituteName"
                            value={formState.formData.educationInstituteName}
                            onChange={(e) => updateFormData({ educationInstituteName: e.target.value })}
                            placeholder="Education Institute Name (Optional)"
                            className="h-12"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Demo Session Details Step */}
          {formState.step === 'demo-details' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Demo Session Details</h2>
                <p className="text-muted-foreground">Schedule your free demo session (Optional)</p>
              </div>

              <div className="space-y-6">
                {/* Preferred Course Section */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">Course Preferences</h4>
                  <div className="space-y-2">
                    <Select
                      options={courseCategories.map(cat => ({ value: cat, label: cat }))}
                      value={formState.formData.preferredCourses.map(course => ({ value: course, label: course }))}
                      onChange={(selected) => updateFormData({ preferredCourses: selected ? selected.map((s: any) => s.value) : [] })}
                      styles={selectStyles}
                      placeholder="Preferred Course *"
                      isMulti
                      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                      menuPosition="fixed"
                    />
                    {formState.errors.courses && (
                      <p className="text-xs text-red-500">{formState.errors.courses}</p>
                    )}
                  </div>
                </div>

                {/* Demo Session Scheduling */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">Session Scheduling</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formState.formData.preferredDate ? formState.formData.preferredDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                          updateFormData({ preferredDate: selectedDate });
                        }}
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        placeholder="Preferred Date"
                      />
                    </div>

                    <div className="space-y-2">
                      <Select
                        options={timeSlots}
                        value={timeSlots.find(option => option.value === formState.formData.preferredTimeSlot)}
                        onChange={(selected) => updateFormData({ preferredTimeSlot: selected?.value || '' })}
                        styles={selectStyles}
                        placeholder="Preferred Time Slot"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Select
                        options={timeSlots}
                        value={timeSlots.find(option => option.value === formState.formData.parentPreferredTimings)}
                        onChange={(selected) => updateFormData({ parentPreferredTimings: selected?.value || '' })}
                        styles={selectStyles}
                        placeholder="Preferred Timings to connect (Optional)"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Consent Step - Under 16 */}
          {formState.step === 'consent' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Consent & Agreements</h2>
                <p className="text-muted-foreground">Please review and accept our terms to complete your registration</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsAndPrivacy"
                      checked={formState.formData.termsAndPrivacy}
                      onCheckedChange={(checked) => updateFormData({ termsAndPrivacy: checked as boolean })}
                    />
                    <div className="text-sm">
                      <Label htmlFor="termsAndPrivacy" className="cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms-and-services" target="_blank" className="text-blue-600 hover:underline">
                          Terms of Uses
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        By accepting, you allow us to process your data for demo session purposes and contact you regarding your registration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataCollectionConsent"
                      checked={formState.formData.dataCollectionConsent}
                      onCheckedChange={(checked) => updateFormData({ dataCollectionConsent: checked as boolean })}
                    />
                    <div className="text-sm">
                      <Label htmlFor="dataCollectionConsent" className="cursor-pointer">
                        I consent to the collection and processing of my personal data for demo session coordination
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        This includes storing your contact information and educational details to provide personalized demo sessions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="communicationConsent"
                      checked={formState.formData.communicationConsent}
                      onCheckedChange={(checked) => updateFormData({ communicationConsent: checked as boolean })}
                    />
                    <div className="text-sm">
                      <Label htmlFor="communicationConsent" className="cursor-pointer">
                        I consent to receive communications about my demo session via email, SMS, or WhatsApp
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        This includes session reminders, meeting links, and follow-up communications about your demo experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingConsent"
                      checked={formState.formData.marketingConsent}
                      onCheckedChange={(checked) => updateFormData({ marketingConsent: checked as boolean })}
                    />
                    <div className="text-sm">
                      <Label htmlFor="marketingConsent" className="cursor-pointer">
                        I would like to receive updates about courses and educational content (Optional)
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Stay informed about new courses, educational resources, and special offers from MEDH.
                      </p>
                    </div>
                  </div>
                </div>

                {formState.errors.terms && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {formState.errors.terms}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Form Step - 16+ */}
          {formState.step === 'form' && formState.isStudentUnder16 === false && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">For Students 16 Years and Above</h2>
              </div>

              {/* Student's Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Student's Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Input
                        id="studentName"
                        value={formState.formData.studentName}
                        onChange={(e) => updateFormData({ studentName: e.target.value })}
                      placeholder="Name *"
                        className={formState.errors.studentName ? 'border-red-500' : ''}
                      />
                      {formState.errors.studentName && (
                      <p className="text-xs text-red-500">{formState.errors.studentName}</p>
                      )}
                  </div>

                  <div className="space-y-2">
                        <Input
                          id="studentEmail"
                          type="email"
                          value={formState.formData.studentEmail}
                          onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                      placeholder="Email ID *"
                          className={formState.errors.studentEmail ? 'border-red-500' : ''}
                        />
                    {formState.errors.studentEmail && (
                      <p className="text-xs text-red-500">{formState.errors.studentEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                      <PhoneNumberInput
                        value={{ 
                          country: formState.formData.country.toUpperCase(), 
                          number: formState.formData.mobileNumber,
                          formattedNumber: formState.formData.mobileNumber,
                          isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                        }}
                        onChange={(val: any) => {
                          updateFormData({ 
                            mobileNumber: val.number,
                            country: val.country.toLowerCase(),
                            mobileCountryCode: getCountryCallingCode(val.country) ? `+${getCountryCallingCode(val.country)}` : '+91'
                          });
                        }}
                      placeholder="Mobile No *"
                        defaultCountry="IN"
                        error={formState.errors.mobileNumber}
                      />
                  </div>

                  <div className="space-y-2">
                      <Input
                        id="city"
                        value={formState.formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                      placeholder="Current City *"
                        className={formState.errors.city ? 'border-red-500' : ''}
                      />
                      {formState.errors.city && (
                      <p className="text-xs text-red-500">{formState.errors.city}</p>
                      )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                        <Select
                      options={timeSlots}
                      value={timeSlots.find(option => option.value === formState.formData.preferredTimings)}
                      onChange={(selected) => updateFormData({ preferredTimings: selected?.value || '' })}
                          styles={selectStyles}
                      placeholder="Preferred Timings to connect (Optional)"
                          menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                          menuPosition="fixed"
                        />
                    </div>

                  <div className="space-y-2">
                          <Select
                            options={qualificationOptions}
                            value={qualificationOptions.find(option => option.value === formState.formData.highestQualification)}
                            onChange={(selected) => updateFormData({ highestQualification: selected?.value || '12th passed' })}
                            styles={selectStyles}
                      placeholder="Highest Qualification *"
                      isSearchable={false}
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                            menuPosition="fixed"
                          />
                          {formState.errors.qualification && (
                      <p className="text-xs text-red-500">{formState.errors.qualification}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Currently Studying</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="currentlyStudying"
                              checked={formState.formData.currentlyStudying === true}
                              onChange={() => updateFormData({ currentlyStudying: true })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="currentlyStudying"
                              checked={formState.formData.currentlyStudying === false}
                              onChange={() => updateFormData({ currentlyStudying: false })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">No</span>
                          </label>
                            </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Currently Working</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="currentlyWorking"
                              checked={formState.formData.currentlyWorking === true}
                              onChange={() => updateFormData({ currentlyWorking: true })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="currentlyWorking"
                              checked={formState.formData.currentlyWorking === false}
                              onChange={() => updateFormData({ currentlyWorking: false })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">No</span>
                          </label>
                            </div>
                          </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Select
                      options={courseCategories.map(cat => ({ value: cat, label: cat }))}
                      value={formState.formData.preferredCourses.map(course => ({ value: course, label: course }))}
                      onChange={(selected) => updateFormData({ preferredCourses: selected ? selected.map((s: any) => s.value) : [] })}
                      styles={selectStyles}
                      placeholder="Preferred Course *"
                      isMulti
                      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                      menuPosition="fixed"
                    />
                    {formState.errors.courses && (
                      <p className="text-xs text-red-500">{formState.errors.courses}</p>
                      )}
                    </div>

                  {formState.formData.currentlyStudying && (
                    <div className="md:col-span-2 space-y-2">
                        <Input
                          id="educationInstituteName"
                          value={formState.formData.educationInstituteName}
                          onChange={(e) => updateFormData({ educationInstituteName: e.target.value })}
                        placeholder="Education Institute Name (Optional)"
                        />
                      </div>
                    )}
                  </div>
                </div>

              {/* Demo Session Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Demo Session Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formState.formData.preferredDate ? formState.formData.preferredDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                        updateFormData({ preferredDate: selectedDate });
                      }}
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      placeholder="Preferred Date"
                    />
              </div>

                  <div className="space-y-2">
                    <Select
                      options={timeSlots}
                      value={timeSlots.find(option => option.value === formState.formData.preferredTimeSlot)}
                      onChange={(selected) => updateFormData({ preferredTimeSlot: selected?.value || '' })}
                      styles={selectStyles}
                      placeholder="Preferred Time Slot"
                      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                      menuPosition="fixed"
                    />
                  </div>
                </div>
              </div>

              {/* Form Submission Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="termsAndPrivacy"
                    checked={formState.formData.termsAndPrivacy}
                    onCheckedChange={(checked) => updateFormData({ termsAndPrivacy: checked as boolean })}
                  />
                  <div className="text-sm">
                    <Label htmlFor="termsAndPrivacy">
                      By clicking this button, you agree to our{" "}
                      <Link href="/terms-and-services" target="_blank" className="text-primary hover:underline">
                        Terms of Use
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                  </div>
                </div>
                {formState.errors.terms && (
                  <p className="text-sm text-destructive">{formState.errors.terms}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="flex justify-between items-center">
            {formState.step !== 'student-age-details' ? (
              <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {formState.step === 'consent' ? (
              <Button onClick={handleSubmit} disabled={formState.isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white">
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking Demo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Book My Free Demo
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={nextStep} 
                disabled={
                  formState.isSubmitting ||
                  (formState.step === 'age-verification' && formState.isStudentUnder16 === null)
                }
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
              >
                {formState.step === 'age-verification' && formState.isStudentUnder16 === null 
                  ? 'Please Select Age Group' 
                  : 'Continue'
                }
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedDemoFormCopy; 