"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { 
  CheckCircle, AlertCircle, Loader2, Phone, Mail, User, 
  GraduationCap, MapPin, Clock, Calendar, Monitor, Wifi, 
  Languages, ChevronRight, ChevronLeft, Heart
} from "lucide-react";
import Select from "react-select";
import {
  IBookFreeDemoSessionPayload,
  DemoSessionAPIService as DemoSessionAPI,
  FormValidationService,
} from "@/apis/demo.api";
import { usePostQuery } from '@/hooks/postQuery.hook';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Swal from "sweetalert2";
import PhoneNumberInput from '../shared/login/PhoneNumberInput';
import CustomReCaptcha from '../shared/ReCaptcha';
import Link from "next/link";

// ========== EMBEDDED FORM STATE ==========

type TFormStep = 'age' | 'parent-contact' | 'student-info' | 'course-preferences' | 'communication-preferences' | 'consent' | 'details' | 'preferences' | 'confirmation';

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

interface EmbeddedDemoFormProps {
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  initialData?: any;
  className?: string;
}

// ========== PHONE VALIDATION ==========

const validatePhoneNumber = (number: string, countryCode: string): boolean => {
  if (!number) return false;
  
  // Remove all non-digit characters
  const cleanNumber = number.replace(/\D/g, '');
  
  // Country-specific validation
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
      // General validation for other countries
      return cleanNumber.length >= 7 && cleanNumber.length <= 15;
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

const countryOptions = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sg', label: 'Singapore' },
  // Add more countries as needed
];

const timeSlots = [
  { value: 'morning', label: 'Morning (9AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { value: 'evening', label: 'Evening (5PM-8PM)' },
];

// ========== MAIN COMPONENT ==========

const EmbeddedDemoForm: React.FC<EmbeddedDemoFormProps> = ({ 
  onSubmitSuccess, 
  onSubmitError,
  initialData,
  className = ""
}) => {
  const { theme } = useTheme();
  const { postQuery } = usePostQuery();
  const isDark = theme === "dark";

  // Form state
  const [formState, setFormState] = useState<IEmbeddedFormState>({
    step: 'age',
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

    if (step === 'age') {
      if (isStudentUnder16 === null) {
        errors.age = "Please select student's age group";
      }
    }

    if (step === 'parent-contact') {
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

    if (step === 'student-info') {
      if (!formData.studentName.trim()) errors.studentName = "Student name is required";
      if (!formData.grade) errors.grade = "Grade is required";
      if (!formData.studentCity.trim()) errors.studentCity = "Student city is required";
      if (!formData.studentState.trim()) errors.studentState = "Student state is required";
    }

    if (step === 'details') {
      if (!formData.studentName.trim()) errors.studentName = "Student name is required";
      
        if (isStudentUnder16) {
          if (!formData.firstName.trim()) errors.firstName = "First name is required";
          if (!formData.lastName.trim()) errors.lastName = "Last name is required";
          if (!FormValidationService.validateEmail(formData.email).isValid) errors.email = "Valid email is required";
          if (!formData.mobileNumber.trim()) {
            errors.mobileNumber = "Mobile number is required";
          } else if (!validatePhoneNumber(formData.mobileNumber, formData.country)) {
            errors.mobileNumber = "Please enter a valid mobile number";
          }
          if (!formData.city.trim()) errors.city = "City is required";
          if (!formData.grade) errors.grade = "Grade is required";
          if (!formData.studentCity.trim()) errors.studentCity = "Student city is required";
          if (!formData.studentState.trim()) errors.studentState = "Student state is required";
        } else {
          if (!FormValidationService.validateEmail(formData.studentEmail).isValid) errors.studentEmail = "Valid student email is required";
          if (!formData.mobileNumber.trim()) {
            errors.mobileNumber = "Mobile number is required";
          } else if (!validatePhoneNumber(formData.mobileNumber, formData.country)) {
            errors.mobileNumber = "Please enter a valid mobile number";
          }
          if (!formData.city.trim()) errors.city = "City is required";
          if (!formData.highestQualification) errors.qualification = "Qualification is required";
        }
    }

    if (step === 'course-preferences') {
      if (formData.preferredCourses.length === 0) errors.courses = "Please select at least one course";
      if (!formData.knowMedhFrom) errors.knowMedhFrom = "Please select how you heard about MEDH";
    }

    if (step === 'consent') {
      if (!formData.termsAndPrivacy) errors.terms = "Please accept terms and privacy policy";
      if (!formData.dataCollectionConsent) errors.dataConsent = "Data collection consent is required";
      if (!formData.captchaToken) errors.captcha = "Please complete the CAPTCHA verification";
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  // Navigation
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    
    const stepFlowUnder16 = ['age', 'parent-contact', 'student-info', 'course-preferences', 'communication-preferences', 'consent'];
    const stepFlow16Plus = ['age', 'details', 'course-preferences', 'communication-preferences', 'consent'];
    
    const currentStepFlow = formState.isStudentUnder16 ? stepFlowUnder16 : stepFlow16Plus;
    const currentIndex = currentStepFlow.indexOf(formState.step);
    
    if (currentIndex < currentStepFlow.length - 1) {
      setFormState(prev => ({ 
        ...prev, 
        step: currentStepFlow[currentIndex + 1] as any,
        errors: {}
      }));
    }
  }, [formState.step, formState.isStudentUnder16, validateCurrentStep]);

  const prevStep = useCallback(() => {
    const stepFlowUnder16 = ['age', 'parent-contact', 'student-info', 'course-preferences', 'communication-preferences', 'consent'];
    const stepFlow16Plus = ['age', 'details', 'course-preferences', 'communication-preferences', 'consent'];
    
    const currentStepFlow = formState.isStudentUnder16 ? stepFlowUnder16 : stepFlow16Plus;
    const currentIndex = currentStepFlow.indexOf(formState.step);
    
    if (currentIndex > 0) {
      setFormState(prev => ({ 
        ...prev, 
        step: currentStepFlow[currentIndex - 1] as any,
        errors: {}
      }));
    }
  }, [formState.step, formState.isStudentUnder16]);

  // Form submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const payload = {
        form_type: 'book_a_free_demo_session',
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
          form_type: 'book_a_free_demo_session',
          form_version: '2.1',
          submission_id: `embedded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
        url: '/forms/submit',
        postData: payload,
        requireAuth: false,
        enableToast: false,
        onSuccess: async (result) => {
          await Swal.fire({
            title: "🎉 Demo Booked Successfully!",
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

  // Helper functions for stepper
  const getStepTitle = (step: TFormStep, isUnder16: boolean | null) => {
    if (isUnder16 === true) {
      switch (step) {
        case 'age': return 'Age Selection'
        case 'parent-contact': return 'Parent/Guardian Information'
        case 'student-info': return 'Student Information'
        case 'course-preferences': return 'Course Preferences'
        case 'communication-preferences': return 'Demo Session Preferences'
        case 'consent': return 'Consent & Verification'
        default: return 'Demo Booking'
      }
    } else {
      switch (step) {
        case 'age': return 'Age Selection'
        case 'details': return 'Contact & Information'
        case 'course-preferences': return 'Course Preferences'
        case 'communication-preferences': return 'Demo Session Preferences'
        case 'consent': return 'Consent & Verification'
        default: return 'Demo Booking'
      }
    }
  };

  const getStepProgress = (step: TFormStep, isUnder16: boolean | null) => {
    if (isUnder16 === true) {
      const steps: TFormStep[] = ['age', 'parent-contact', 'student-info', 'course-preferences', 'communication-preferences', 'consent'];
      const currentIndex = steps.indexOf(step);
      return currentIndex >= 0 ? (currentIndex + 1) / steps.length : 0;
    } else {
      const steps: TFormStep[] = ['age', 'details', 'course-preferences', 'communication-preferences', 'consent'];
      const currentIndex = steps.indexOf(step);
      return currentIndex >= 0 ? (currentIndex + 1) / steps.length : 0;
    }
  };

  return (
    <div className={`h-full bg-background ${className}`}>
      <div className="h-full flex flex-col">
        {/* Progress Bar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{getStepTitle(formState.step, formState.isStudentUnder16)}</span>
            <span>{Math.round(getStepProgress(formState.step, formState.isStudentUnder16) * 100)}% Complete</span>
          </div>
          <Progress value={getStepProgress(formState.step, formState.isStudentUnder16) * 100} className="h-2" />
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 flex flex-col min-h-0">
          
          {/* Age Selection Step */}
          {formState.step === 'age' && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Is the student under 16 years old?</h2>
                <p className="text-muted-foreground text-sm">
                  This helps us customize the registration process
                </p>
              </div>
              
              <div className="max-w-sm mx-auto w-full space-y-3">
                <Card 
                  className={`cursor-pointer transition-all ${
                    formState.isStudentUnder16 === true ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setFormState(prev => ({ ...prev, isStudentUnder16: true }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Yes, Under 16</div>
                        <div className="text-sm text-muted-foreground">
                          Parent/guardian details required
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formState.isStudentUnder16 === true
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {formState.isStudentUnder16 === true && (
                          <div className="w-full h-full rounded-full bg-background scale-50"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all ${
                    formState.isStudentUnder16 === false ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setFormState(prev => ({ ...prev, isStudentUnder16: false }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">No, 16 & Above</div>
                        <div className="text-sm text-muted-foreground">
                          Direct registration
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formState.isStudentUnder16 === false
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {formState.isStudentUnder16 === false && (
                          <div className="w-full h-full rounded-full bg-background scale-50"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {formState.errors.age && (
                <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg max-w-sm mx-auto">
                  {formState.errors.age}
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex justify-center items-center pt-6 border-t mt-auto">
                <Button 
                  onClick={nextStep} 
                  disabled={formState.isStudentUnder16 === null || formState.isSubmitting}
                  className="px-8"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Parent Contact Step */}
            {formState.step === 'parent-contact' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Parent/Guardian Information</h2>
                <p className="text-muted-foreground text-sm">
                  We'll use this information to coordinate the demo session
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-4 max-w-2xl mx-auto w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="firstName"
                        value={formState.formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        placeholder="Parent/Guardian First Name *"
                        className={formState.errors.firstName ? 'border-destructive' : ''}
                      />
                      {formState.errors.firstName && (
                        <p className="text-sm text-destructive">{formState.errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="lastName"
                        value={formState.formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        placeholder="Parent/Guardian Last Name *"
                        className={formState.errors.lastName ? 'border-destructive' : ''}
                      />
                      {formState.errors.lastName && (
                        <p className="text-sm text-destructive">{formState.errors.lastName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="email"
                        type="email"
                        value={formState.formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        placeholder="Parent/Guardian Email Address *"
                        className={formState.errors.email ? 'border-destructive' : ''}
                      />
                      {formState.errors.email && (
                        <p className="text-sm text-destructive">{formState.errors.email}</p>
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
                        onChange={(val) => {
                          updateFormData({ 
                            mobileNumber: val.number,
                            country: val.country.toLowerCase(),
                            mobileCountryCode: val.country === 'IN' ? '+91' : '+1'
                          });
                        }}
                        placeholder="Parent/Guardian Mobile Number *"
                        defaultCountry="IN"
                        error={formState.errors.mobileNumber}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="city"
                        value={formState.formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                        placeholder="Your City *"
                        className={formState.errors.city ? 'border-destructive' : ''}
                      />
                      {formState.errors.city && (
                        <p className="text-sm text-destructive">{formState.errors.city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Select
                        options={countryOptions}
                        value={countryOptions.find(option => option.value === formState.formData.country)}
                        onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                        styles={selectStyles}
                        placeholder="Select Your Country *"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                    </div>
                  </div>
                  </div>
              
              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={formState.isSubmitting}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                </div>
              </div>
            )}

          {/* Student Info Step */}
            {formState.step === 'student-info' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
                <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Student Information</h2>
                <p className="text-muted-foreground text-sm">
                  Tell us about the student joining the demo session
                  </p>
                </div>

              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-4 max-w-2xl mx-auto w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="studentName"
                        value={formState.formData.studentName}
                        onChange={(e) => updateFormData({ studentName: e.target.value })}
                        placeholder="Student's Full Name *"
                        className={formState.errors.studentName ? 'border-destructive' : ''}
                      />
                      {formState.errors.studentName && (
                        <p className="text-sm text-destructive">{formState.errors.studentName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Select
                        options={gradeOptions}
                        value={gradeOptions.find(option => option.value === formState.formData.grade)}
                        onChange={(selected) => updateFormData({ grade: selected?.value || 'grade_1-2' })}
                        styles={selectStyles}
                        placeholder="Select Student's Current Grade *"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                      {formState.errors.grade && (
                        <p className="text-sm text-destructive">{formState.errors.grade}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="studentCity"
                        value={formState.formData.studentCity}
                        onChange={(e) => updateFormData({ studentCity: e.target.value })}
                        placeholder="Student's City *"
                        className={formState.errors.studentCity ? 'border-destructive' : ''}
                      />
                      {formState.errors.studentCity && (
                        <p className="text-sm text-destructive">{formState.errors.studentCity}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="studentState"
                        value={formState.formData.studentState}
                        onChange={(e) => updateFormData({ studentState: e.target.value })}
                        placeholder="Student's State/Province *"
                        className={formState.errors.studentState ? 'border-destructive' : ''}
                      />
                      {formState.errors.studentState && (
                        <p className="text-sm text-destructive">{formState.errors.studentState}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Input
                        id="schoolName"
                        value={formState.formData.schoolName}
                        onChange={(e) => updateFormData({ schoolName: e.target.value })}
                        placeholder="Student's School/Institution Name (Optional)"
                      />
                    </div>
                    </div>
                  </div>
                </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={formState.isSubmitting}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              </div>
            )}

                    {/* Course Preferences Step */}
            {formState.step === 'course-preferences' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Course Preferences</h2>
                <p className="text-muted-foreground text-sm">
                  Choose your areas of interest for the demo session
                  </p>
                </div>
                
              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-6 max-w-2xl mx-auto w-full">
                    <div className="space-y-2">
                      <Select
                        options={courseCategories.map(cat => ({ value: cat, label: cat }))}
                        value={formState.formData.preferredCourses.map(course => ({ value: course, label: course }))}
                        onChange={(selected) => updateFormData({ preferredCourses: selected ? selected.map((s: any) => s.value) : [] })}
                        styles={selectStyles}
                        placeholder="Select Course Categories of Interest *"
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                      {formState.errors.courses && (
                        <p className="text-sm text-destructive">{formState.errors.courses}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Select
                        options={[
                          { value: 'social_media', label: 'Social Media' },
                          { value: 'friends', label: 'Friends/Family' },
                          { value: 'website', label: 'Website/Search' },
                          { value: 'advertisement', label: 'Advertisement' },
                          { value: 'other', label: 'Other' }
                        ]}
                        value={{ value: formState.formData.knowMedhFrom, label: formState.formData.knowMedhFrom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                        onChange={(selected) => updateFormData({ knowMedhFrom: selected?.value as any || 'social_media' })}
                        styles={selectStyles}
                        placeholder="How did you hear about MEDH?"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </div>
                
              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={formState.isSubmitting}>
                    Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                </div>
              </div>
            )}

                    {/* Communication Preferences Step */}
          {formState.step === 'communication-preferences' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Demo Session Preferences</h2>
                <p className="text-muted-foreground text-sm">
                  Help us schedule the perfect demo session for you
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-6 max-w-2xl mx-auto w-full">
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
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Preferred Date (Optional) - Leave blank for flexible scheduling
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Select
                          options={timeSlots}
                          value={timeSlots.find(option => option.value === formState.formData.preferredTimeSlot)}
                          onChange={(selected) => updateFormData({ preferredTimeSlot: selected?.value || '' })}
                          styles={selectStyles}
                          placeholder="Select Your Preferred Time Slot"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Select
                          options={[
                            { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                            { value: 'America/New_York', label: 'America/New_York (EST)' },
                            { value: 'Europe/London', label: 'Europe/London (GMT)' },
                            { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
                          ]}
                          value={{ value: formState.formData.timezone, label: formState.formData.timezone }}
                          onChange={(selected) => updateFormData({ timezone: selected?.value || 'Asia/Kolkata' })}
                          styles={selectStyles}
                          placeholder="Select Your Timezone"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>
                    </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Marketing Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emailNotifications"
                          checked={formState.formData.emailNotifications}
                          onCheckedChange={(checked) => updateFormData({ emailNotifications: checked as boolean })}
                        />
                        <Label htmlFor="emailNotifications" className="text-sm">
                          Email notifications about courses and updates
                        </Label>
                  </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="whatsappUpdates"
                          checked={formState.formData.whatsappUpdates}
                          onCheckedChange={(checked) => updateFormData({ whatsappUpdates: checked as boolean })}
                        />
                        <Label htmlFor="whatsappUpdates" className="text-sm">
                          WhatsApp updates about session reminders
                        </Label>
                </div>
                
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="courseRecommendations"
                          checked={formState.formData.courseRecommendations}
                          onCheckedChange={(checked) => updateFormData({ courseRecommendations: checked as boolean })}
                        />
                        <Label htmlFor="courseRecommendations" className="text-sm">
                          Personalized course recommendations
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={formState.isSubmitting}>
                    Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                </div>
              </div>
            )}

          {/* Consent Step */}
            {formState.step === 'consent' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
                <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Consent & Verification</h2>
                <p className="text-muted-foreground text-sm">
                    Please complete the verification and accept the agreements
                  </p>
                </div>

              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-6 max-w-2xl mx-auto w-full">
                  <div className="mb-4">
                    <CustomReCaptcha
                      onChange={(value) => updateFormData({ captchaToken: value })}
                      error={!!formState.errors.captcha}
                    />
                    {formState.errors.captcha && (
                      <p className="text-sm text-destructive mt-2">{formState.errors.captcha}</p>
                    )}
              </div>
              
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Consent & Agreements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="termsAndPrivacy"
                          checked={formState.formData.termsAndPrivacy}
                          onCheckedChange={(checked) => updateFormData({ termsAndPrivacy: checked as boolean })}
                        />
                        <div className="text-sm">
                          <Label htmlFor="termsAndPrivacy">
                            I agree to the{" "}
                            <Link href="/terms-and-services" target="_blank" className="text-primary hover:underline">
                              Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                            <span className="text-destructive ml-1">*</span>
                          </Label>
                        </div>
                    </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="dataCollectionConsent"
                          checked={formState.formData.dataCollectionConsent}
                          onCheckedChange={(checked) => updateFormData({ dataCollectionConsent: checked as boolean })}
                        />
                        <div className="text-sm">
                          <Label htmlFor="dataCollectionConsent">
                            I consent to processing of my personal data for demo session purposes
                            <span className="text-destructive ml-1">*</span>
                          </Label>
                        </div>
                    </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="communicationConsent"
                          checked={formState.formData.communicationConsent}
                          onCheckedChange={(checked) => updateFormData({ communicationConsent: checked as boolean })}
                        />
                        <div className="text-sm">
                          <Label htmlFor="communicationConsent">
                            I consent to receive communication about my demo session via email/SMS
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Session reminders, meeting links, and follow-up communications
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
                          <Label htmlFor="marketingConsent">
                            Send me updates about courses and educational content (optional)
                          </Label>
                    </div>
                      </div>
                    </CardContent>
                  </Card>

                  {(formState.errors.terms || formState.errors.dataConsent) && (
                    <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                      Please accept the required agreements and complete CAPTCHA
                        </div>
                      )}
                </div>
                    </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking Demo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Book My Demo Session
                    </>
                  )}
                </Button>
                  </div>
                </div>
              )}

          {/* Details Step for 16+ */}
          {formState.step === 'details' && (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Contact & Information</h2>
                <p className="text-muted-foreground text-sm">
                  Help us personalize your demo experience
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto flex items-center">
                <div className="space-y-6 max-w-2xl mx-auto w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Fields */}
                    <div className="space-y-4 pb-2 border-b border-muted-foreground/10">
                      <Input
                        id="studentName"
                        value={formState.formData.studentName}
                        onChange={(e) => updateFormData({ studentName: e.target.value })}
                        placeholder="Your Full Name *"
                        className={formState.errors.studentName ? 'border-destructive' : ''}
                      />
                      {formState.errors.studentName && (
                        <p className="text-xs text-destructive mt-1">{formState.errors.studentName}</p>
                      )}
                      {!formState.isStudentUnder16 && (
                        <Input
                          id="studentEmail"
                          type="email"
                          value={formState.formData.studentEmail}
                          onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                          placeholder="Your Email Address *"
                          className={formState.errors.studentEmail ? 'border-destructive' : ''}
                        />
                      )}
                      {!formState.isStudentUnder16 && formState.errors.studentEmail && (
                        <p className="text-xs text-destructive mt-1">{formState.errors.studentEmail}</p>
                      )}
                      <PhoneNumberInput
                        value={{ 
                          country: formState.formData.country.toUpperCase(), 
                          number: formState.formData.mobileNumber,
                          formattedNumber: formState.formData.mobileNumber,
                          isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                        }}
                        onChange={(val) => {
                          updateFormData({ 
                            mobileNumber: val.number,
                            country: val.country.toLowerCase(),
                            mobileCountryCode: val.country === 'IN' ? '+91' : '+1'
                          });
                        }}
                        placeholder="Your Mobile Number *"
                        defaultCountry="IN"
                        error={formState.errors.mobileNumber}
                      />
                      <Input
                        id="city"
                        value={formState.formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                        placeholder="Your City *"
                        className={formState.errors.city ? 'border-destructive' : ''}
                      />
                      {formState.errors.city && (
                        <p className="text-xs text-destructive mt-1">{formState.errors.city}</p>
                      )}
                      {/* Country Field for 16+ */}
                      {!formState.isStudentUnder16 && (
                        <Select
                          options={countryOptions}
                          value={countryOptions.find(option => option.value === formState.formData.country)}
                          onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                          styles={selectStyles}
                          placeholder="Select Your Country *"
                          menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                          menuPosition="fixed"
                        />
                      )}
                    </div>

                    {/* Qualification & Status Fields */}
                    <div className="space-y-4 pt-2 border-b border-muted-foreground/10">
                      {!formState.isStudentUnder16 && (
                        <>
                          <Select
                            options={qualificationOptions}
                            value={qualificationOptions.find(option => option.value === formState.formData.highestQualification)}
                            onChange={(selected) => updateFormData({ highestQualification: selected?.value || '12th passed' })}
                            styles={selectStyles}
                            placeholder="Select Your Highest Qualification *"
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                            menuPosition="fixed"
                          />
                          {formState.errors.qualification && (
                            <p className="text-xs text-destructive mt-1">{formState.errors.qualification}</p>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="currentlyStudying"
                                checked={formState.formData.currentlyStudying}
                                onCheckedChange={(checked) => updateFormData({ currentlyStudying: checked as boolean })}
                              />
                              <Label htmlFor="currentlyStudying" className="text-sm">
                                Currently Studying
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="currentlyWorking"
                                checked={formState.formData.currentlyWorking}
                                onCheckedChange={(checked) => updateFormData({ currentlyWorking: checked as boolean })}
                              />
                              <Label htmlFor="currentlyWorking" className="text-sm">
                                Currently Working
                              </Label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Institution Field */}
                    {!formState.isStudentUnder16 && formState.formData.currentlyStudying && (
                      <div className="col-span-1 md:col-span-2 space-y-2 pt-6">
                        <Input
                          id="educationInstituteName"
                          value={formState.formData.educationInstituteName}
                          onChange={(e) => updateFormData({ educationInstituteName: e.target.value })}
                          placeholder="Educational Institution Name (e.g., University of Delhi, IIT Mumbai)"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={formState.isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} disabled={formState.isSubmitting}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmbeddedDemoForm; 