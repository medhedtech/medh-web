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
import { buildComponent } from "@/utils/designSystem";
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
  // Asia
  { value: 'af', label: 'Afghanistan' },
  { value: 'am', label: 'Armenia' },
  { value: 'az', label: 'Azerbaijan' },
  { value: 'bh', label: 'Bahrain' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'bt', label: 'Bhutan' },
  { value: 'bn', label: 'Brunei' },
  { value: 'kh', label: 'Cambodia' },
  { value: 'cn', label: 'China' },
  { value: 'cy', label: 'Cyprus' },
  { value: 'ge', label: 'Georgia' },
  { value: 'in', label: 'India' },
  { value: 'id', label: 'Indonesia' },
  { value: 'ir', label: 'Iran' },
  { value: 'iq', label: 'Iraq' },
  { value: 'il', label: 'Israel' },
  { value: 'jp', label: 'Japan' },
  { value: 'jo', label: 'Jordan' },
  { value: 'kz', label: 'Kazakhstan' },
  { value: 'kw', label: 'Kuwait' },
  { value: 'kg', label: 'Kyrgyzstan' },
  { value: 'la', label: 'Laos' },
  { value: 'lb', label: 'Lebanon' },
  { value: 'my', label: 'Malaysia' },
  { value: 'mv', label: 'Maldives' },
  { value: 'mn', label: 'Mongolia' },
  { value: 'mm', label: 'Myanmar' },
  { value: 'np', label: 'Nepal' },
  { value: 'kp', label: 'North Korea' },
  { value: 'om', label: 'Oman' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'ps', label: 'Palestine' },
  { value: 'ph', label: 'Philippines' },
  { value: 'qa', label: 'Qatar' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'kr', label: 'South Korea' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'sy', label: 'Syria' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'tj', label: 'Tajikistan' },
  { value: 'th', label: 'Thailand' },
  { value: 'tl', label: 'Timor-Leste' },
  { value: 'tr', label: 'Turkey' },
  { value: 'tm', label: 'Turkmenistan' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'uz', label: 'Uzbekistan' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'ye', label: 'Yemen' },

  // Europe
  { value: 'ad', label: 'Andorra' },
  { value: 'at', label: 'Austria' },
  { value: 'by', label: 'Belarus' },
  { value: 'be', label: 'Belgium' },
  { value: 'ba', label: 'Bosnia and Herzegovina' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'hr', label: 'Croatia' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'dk', label: 'Denmark' },
  { value: 'ee', label: 'Estonia' },
  { value: 'fi', label: 'Finland' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'gr', label: 'Greece' },
  { value: 'hu', label: 'Hungary' },
  { value: 'is', label: 'Iceland' },
  { value: 'ie', label: 'Ireland' },
  { value: 'it', label: 'Italy' },
  { value: 'xk', label: 'Kosovo' },
  { value: 'lv', label: 'Latvia' },
  { value: 'li', label: 'Liechtenstein' },
  { value: 'lt', label: 'Lithuania' },
  { value: 'lu', label: 'Luxembourg' },
  { value: 'mk', label: 'North Macedonia' },
  { value: 'mt', label: 'Malta' },
  { value: 'md', label: 'Moldova' },
  { value: 'mc', label: 'Monaco' },
  { value: 'me', label: 'Montenegro' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'no', label: 'Norway' },
  { value: 'pl', label: 'Poland' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ro', label: 'Romania' },
  { value: 'ru', label: 'Russia' },
  { value: 'sm', label: 'San Marino' },
  { value: 'rs', label: 'Serbia' },
  { value: 'sk', label: 'Slovakia' },
  { value: 'si', label: 'Slovenia' },
  { value: 'es', label: 'Spain' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'ua', label: 'Ukraine' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'va', label: 'Vatican City' },

  // North America
  { value: 'ag', label: 'Antigua and Barbuda' },
  { value: 'bs', label: 'Bahamas' },
  { value: 'bb', label: 'Barbados' },
  { value: 'bz', label: 'Belize' },
  { value: 'ca', label: 'Canada' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'cu', label: 'Cuba' },
  { value: 'dm', label: 'Dominica' },
  { value: 'do', label: 'Dominican Republic' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'gd', label: 'Grenada' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'ht', label: 'Haiti' },
  { value: 'hn', label: 'Honduras' },
  { value: 'jm', label: 'Jamaica' },
  { value: 'mx', label: 'Mexico' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'pa', label: 'Panama' },
  { value: 'kn', label: 'Saint Kitts and Nevis' },
  { value: 'lc', label: 'Saint Lucia' },
  { value: 'vc', label: 'Saint Vincent and the Grenadines' },
  { value: 'tt', label: 'Trinidad and Tobago' },
  { value: 'us', label: 'United States' },

  // South America
  { value: 'ar', label: 'Argentina' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'br', label: 'Brazil' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'gy', label: 'Guyana' },
  { value: 'py', label: 'Paraguay' },
  { value: 'pe', label: 'Peru' },
  { value: 'sr', label: 'Suriname' },
  { value: 'uy', label: 'Uruguay' },
  { value: 've', label: 'Venezuela' },

  // Africa
  { value: 'dz', label: 'Algeria' },
  { value: 'ao', label: 'Angola' },
  { value: 'bj', label: 'Benin' },
  { value: 'bw', label: 'Botswana' },
  { value: 'bf', label: 'Burkina Faso' },
  { value: 'bi', label: 'Burundi' },
  { value: 'cv', label: 'Cabo Verde' },
  { value: 'cm', label: 'Cameroon' },
  { value: 'cf', label: 'Central African Republic' },
  { value: 'td', label: 'Chad' },
  { value: 'km', label: 'Comoros' },
  { value: 'cg', label: 'Congo' },
  { value: 'cd', label: 'Democratic Republic of the Congo' },
  { value: 'dj', label: 'Djibouti' },
  { value: 'eg', label: 'Egypt' },
  { value: 'gq', label: 'Equatorial Guinea' },
  { value: 'er', label: 'Eritrea' },
  { value: 'sz', label: 'Eswatini' },
  { value: 'et', label: 'Ethiopia' },
  { value: 'ga', label: 'Gabon' },
  { value: 'gm', label: 'Gambia' },
  { value: 'gh', label: 'Ghana' },
  { value: 'gn', label: 'Guinea' },
  { value: 'gw', label: 'Guinea-Bissau' },
  { value: 'ci', label: 'Ivory Coast' },
  { value: 'ke', label: 'Kenya' },
  { value: 'ls', label: 'Lesotho' },
  { value: 'lr', label: 'Liberia' },
  { value: 'ly', label: 'Libya' },
  { value: 'mg', label: 'Madagascar' },
  { value: 'mw', label: 'Malawi' },
  { value: 'ml', label: 'Mali' },
  { value: 'mr', label: 'Mauritania' },
  { value: 'mu', label: 'Mauritius' },
  { value: 'ma', label: 'Morocco' },
  { value: 'mz', label: 'Mozambique' },
  { value: 'na', label: 'Namibia' },
  { value: 'ne', label: 'Niger' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'rw', label: 'Rwanda' },
  { value: 'st', label: 'Sao Tome and Principe' },
  { value: 'sn', label: 'Senegal' },
  { value: 'sc', label: 'Seychelles' },
  { value: 'sl', label: 'Sierra Leone' },
  { value: 'so', label: 'Somalia' },
  { value: 'za', label: 'South Africa' },
  { value: 'ss', label: 'South Sudan' },
  { value: 'sd', label: 'Sudan' },
  { value: 'tz', label: 'Tanzania' },
  { value: 'tg', label: 'Togo' },
  { value: 'tn', label: 'Tunisia' },
  { value: 'ug', label: 'Uganda' },
  { value: 'zm', label: 'Zambia' },
  { value: 'zw', label: 'Zimbabwe' },

  // Oceania
  { value: 'au', label: 'Australia' },
  { value: 'fj', label: 'Fiji' },
  { value: 'ki', label: 'Kiribati' },
  { value: 'mh', label: 'Marshall Islands' },
  { value: 'fm', label: 'Micronesia' },
  { value: 'nr', label: 'Nauru' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'pw', label: 'Palau' },
  { value: 'pg', label: 'Papua New Guinea' },
  { value: 'ws', label: 'Samoa' },
  { value: 'sb', label: 'Solomon Islands' },
  { value: 'to', label: 'Tonga' },
  { value: 'tv', label: 'Tuvalu' },
  { value: 'vu', label: 'Vanuatu' },
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
      termsAndPrivacy: false,
      dataCollectionConsent: false,
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
      // Parent contact validation for under-16 flow
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
      // Student info validation for under-16 flow
      if (!formData.studentName.trim()) errors.studentName = "Student name is required";
      if (!formData.grade) errors.grade = "Grade is required";
      if (!formData.studentCity.trim()) errors.studentCity = "Student city is required";
      if (!formData.studentState.trim()) errors.studentState = "Student state is required";
    }

    if (step === 'details') {
      // Student details validation
      if (!formData.studentName.trim()) errors.studentName = "Student name is required";
      
              // Conditional validation based on age
        if (isStudentUnder16) {
          // Contact Info validation for under 16 (parent details)
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
          // For 16+ students, only validate student contact and info
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

    if (step === 'communication-preferences') {
      // Optional validations for communication and demo preferences - most fields are optional
      // Could add specific validations here if needed
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
    
    // Different step flows based on age
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
    // Different step flows based on age
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
      // Build payload according to comprehensive API specification
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
          social_profiles: {
            linkedin: formState.formData.linkedinProfile || undefined,
            portfolio: formState.formData.portfolioUrl || undefined
          }
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
          preferred_date: formState.formData.preferredDate,
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
          form_interaction_time: Math.round((Date.now() - Date.now()) / 1000) // Will be calculated properly
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
          // Use custom error handler if provided, otherwise show SweetAlert
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

  // Select styles with high z-index
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
      zIndex: 99999, // Very high z-index to appear above footer
      position: 'absolute',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 99999, // Ensures portal menu appears above everything
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

  // Input classes
  const inputClasses = (hasError: boolean) => 
    `w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
      hasError
        ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500'
    } text-gray-900 dark:text-white focus:outline-none focus:ring-1`;

  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  // Helper functions for stepper
  const getStepTitle = (step: TFormStep, isUnder16: boolean | null) => {
    if (isUnder16 === true) {
      switch (step) {
        case 'age': return 'Step 1: Age Selection'
        case 'parent-contact': return 'Step 2: Parent/Guardian Contact Information'
        case 'student-info': return 'Step 3: Student Information'
        case 'course-preferences': return 'Step 4: Course Preferences'
        case 'communication-preferences': return 'Step 5: Communication & Demo Session Preferences'
        case 'consent': return 'Step 6: Consent & Agreements'
        default: return 'Demo Booking'
      }
    } else {
      switch (step) {
        case 'age': return 'Step 1: Age Selection'
        case 'details': return 'Step 2: Student Contact and Information'
        case 'course-preferences': return 'Step 3: Course Preferences'
        case 'communication-preferences': return 'Step 4: Demo Session Preferences'
        case 'consent': return 'Step 5: Consent & Agreements'
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
    <div className={`h-full bg-white dark:bg-gray-800 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Progress Bar with Step Names */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>{getStepTitle(formState.step, formState.isStudentUnder16)}</span>
            <span>{Math.round((getStepProgress(formState.step, formState.isStudentUnder16)) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress(formState.step, formState.isStudentUnder16) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content - No scrolling, fit to container */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col min-h-0">
          
          {/* Age Selection Step */}
          {formState.step === 'age' && (
            <div className="flex-1 flex flex-col justify-center text-center space-y-4">
              <div>
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Let's Get Started
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Is the student under 16 years old?
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={() => setFormState(prev => ({ ...prev, isStudentUnder16: true }))}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    formState.isStudentUnder16 === true
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium text-sm text-gray-900 dark:text-white">Yes, Under 16</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Parent details required</div>
                </button>
                
                <button
                  onClick={() => setFormState(prev => ({ ...prev, isStudentUnder16: false }))}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    formState.isStudentUnder16 === false
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                  <div className="font-medium text-sm text-gray-900 dark:text-white">No, 16 & Above</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Direct registration</div>
                </button>
              </div>
              
              {formState.errors.age && (
                <div className="text-red-600 text-sm flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formState.errors.age}
                </div>
              )}
            </div>
          )}

                      {/* Parent Contact Step (for under 16) */}
            {formState.step === 'parent-contact' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Contact Information
                    </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className={labelClasses}>First Name *</label>
                      <input
                        type="text"
                        value={formState.formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        className={inputClasses(!!formState.errors.firstName)}
                        placeholder="Enter first name"
                      />
                      {formState.errors.firstName && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className={labelClasses}>Last Name *</label>
                      <input
                        type="text"
                        value={formState.formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        className={inputClasses(!!formState.errors.lastName)}
                        placeholder="Enter last name"
                      />
                      {formState.errors.lastName && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.lastName}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClasses}>Email Address *</label>
                      <input
                        type="email"
                        value={formState.formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        className={inputClasses(!!formState.errors.email)}
                        placeholder="your@email.com"
                      />
                      {formState.errors.email && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.email}
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className={labelClasses}>Mobile Number *</label>
                      <PhoneNumberInput
                        value={{ 
                          country: formState.formData.country.toUpperCase(), 
                          number: formState.formData.mobileNumber,
                          formattedNumber: formState.formData.mobileNumber,
                          isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                        }}
                        onChange={(val) => {
                          const isValid = validatePhoneNumber(val.number, val.country);
                          updateFormData({ 
                            mobileNumber: val.number,
                            country: val.country.toLowerCase(),
                            mobileCountryCode: val.country === 'IN' ? '+91' : val.country === 'US' ? '+1' : val.country === 'GB' ? '+44' : '+91'
                          });
                          
                          // Clear mobile number error if validation passes
                          if (isValid && formState.errors.mobileNumber) {
                            setFormState(prev => ({
                              ...prev,
                              errors: { ...prev.errors, mobileNumber: '' }
                            }));
                          }
                        }}
                        placeholder="Enter mobile number"
                        defaultCountry="IN"
                        error={formState.errors.mobileNumber}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className={labelClasses}>City *</label>
                      <input
                        type="text"
                        value={formState.formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                        className={inputClasses(!!formState.errors.city)}
                        placeholder="Enter your city"
                      />
                      {formState.errors.city && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.city}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelClasses}>Country *</label>
                      <Select
                        options={countryOptions}
                        value={countryOptions.find(option => option.value === formState.formData.country)}
                        onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                        styles={selectStyles}
                        placeholder="Select country"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className={labelClasses}>Relationship to Student *</label>
                      <Select
                        options={[
                          { value: 'father', label: 'Father' },
                          { value: 'mother', label: 'Mother' },
                          { value: 'guardian', label: 'Guardian' },
                        ]}
                        value={{ value: formState.formData.parentRelationship, label: formState.formData.parentRelationship.charAt(0).toUpperCase() + formState.formData.parentRelationship.slice(1) }}
                        onChange={(selected) => updateFormData({ parentRelationship: selected?.value as any || 'father' })}
                        styles={selectStyles}
                        placeholder="Select relationship"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>

                    {/* Preferred Contact Time */}
                    <div>
                    <label className={labelClasses}>Preferred Contact Time</label>
                    <Select
                      options={[
                        { value: 'morning', label: '🌅 Morning (9AM - 12PM)' },
                        { value: 'afternoon', label: '☀️ Afternoon (12PM - 5PM)' },
                        { value: 'evening', label: '🌆 Evening (5PM - 8PM)' },
                        { value: 'flexible', label: '⏰ Flexible (Anytime)' }
                      ]}
                      value={[
                        { value: 'morning', label: '🌅 Morning (9AM - 12PM)' },
                        { value: 'afternoon', label: '☀️ Afternoon (12PM - 5PM)' },
                        { value: 'evening', label: '🌆 Evening (5PM - 8PM)' },
                        { value: 'flexible', label: '⏰ Flexible (Anytime)' }
                      ].find(option => option.value === formState.formData.preferredContactTime)}
                      onChange={(selected) => updateFormData({ preferredContactTime: selected?.value || 'flexible' })}
                      styles={selectStyles}
                      placeholder="Select contact time"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Student Info Step (for under 16) */}
            {formState.step === 'student-info' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Student Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Tell us about the student who will attend the demo
                  </p>
                </div>

                <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3">
                    Student Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Student Name */}
                    <div>
                      <label className={labelClasses}>Student Name *</label>
                      <input
                        type="text"
                        value={formState.formData.studentName}
                        onChange={(e) => updateFormData({ studentName: e.target.value })}
                        className={inputClasses(!!formState.errors.studentName)}
                        placeholder="Enter student's name"
                      />
                      {formState.errors.studentName && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.studentName}
                        </div>
                      )}
                    </div>

                    {/* Grade */}
                    <div>
                      <label className={labelClasses}>Current Grade *</label>
                      <Select
                        options={gradeOptions}
                        value={gradeOptions.find(option => option.value === formState.formData.grade)}
                        onChange={(selected) => updateFormData({ grade: selected?.value || 'grade_1-2' })}
                        styles={selectStyles}
                        placeholder="Select grade"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                      {formState.errors.grade && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.grade}
                        </div>
                      )}
                    </div>

                    {/* Student City */}
                    <div>
                      <label className={labelClasses}>Student City *</label>
                      <input
                        type="text"
                        value={formState.formData.studentCity}
                        onChange={(e) => updateFormData({ studentCity: e.target.value })}
                        className={inputClasses(!!formState.errors.studentCity)}
                        placeholder="Enter student's city"
                      />
                      {formState.errors.studentCity && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.studentCity}
                        </div>
                      )}
                    </div>

                    {/* Student State */}
                    <div>
                      <label className={labelClasses}>Student State *</label>
                      <input
                        type="text"
                        value={formState.formData.studentState}
                        onChange={(e) => updateFormData({ studentState: e.target.value })}
                        className={inputClasses(!!formState.errors.studentState)}
                        placeholder="Enter student's state"
                      />
                      {formState.errors.studentState && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.studentState}
                        </div>
                      )}
                    </div>

                    {/* School Name */}
                    <div className="md:col-span-2">
                      <label className={labelClasses}>School Name</label>
                      <input
                        type="text"
                        value={formState.formData.schoolName}
                        onChange={(e) => updateFormData({ schoolName: e.target.value })}
                        className={inputClasses(false)}
                        placeholder="Enter school name"
                      />
                    </div>
                  </div>
                </div>


              </div>
            )}

            {/* Course Preferences Step (for both under 16 and 16+) */}
            {formState.step === 'course-preferences' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="text-center mb-4 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Course Preferences
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Tell us about your learning interests
                  </p>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      Course Preferences
                    </h4>
                    
                    {/* Course Interest */}
                    <div className="mb-4">
                      <label className={labelClasses}>Course Categories of Interest *</label>
                      <Select
                        options={courseCategories.map(cat => ({ value: cat, label: cat }))}
                        value={formState.formData.preferredCourses.map(course => ({ value: course, label: course }))}
                        onChange={(selected) => updateFormData({ preferredCourses: selected ? selected.map((s: any) => s.value) : [] })}
                        styles={selectStyles}
                        placeholder="Select course categories"
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                      {formState.errors.courses && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.courses}
                        </div>
                      )}
                    </div>

                    {/* How did you hear about us */}
                    <div>
                      <label className={labelClasses}>How did you hear about MEDH?</label>
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
                        placeholder="Select source"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={formState.isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={formState.isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Communication & Demo Preferences Step (for under 16) */}
            {formState.step === 'communication-preferences' && formState.isStudentUnder16 && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                  
                  {/* Demo Session Preferences */}
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Demo Session Details
                    </h4>
                    
                    {/* Preferred Date */}
                    <div className="mb-4">
                      <label className={labelClasses}>Preferred Date (Optional)</label>
                      <input
                        type="date"
                        value={formState.formData.preferredDate ? formState.formData.preferredDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                          updateFormData({ preferredDate: selectedDate });
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className={inputClasses(false)}
                        placeholder="Select preferred date"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Leave blank for flexible scheduling within the next 30 days
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Preferred Time Slot */}
                      <div>
                        <label className={labelClasses}>Preferred Time Slot</label>
                        <Select
                          options={timeSlots}
                          value={timeSlots.find(option => option.value === formState.formData.preferredTimeSlot)}
                          onChange={(selected) => updateFormData({ preferredTimeSlot: selected?.value || '' })}
                          styles={selectStyles}
                          placeholder="Select time slot"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className={labelClasses}>Timezone</label>
                        <Select
                          options={[
                            { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                            { value: 'America/New_York', label: 'America/New_York (EST)' },
                            { value: 'Europe/London', label: 'Europe/London (GMT)' },
                            { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
                            { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
                            { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
                            { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST)' }
                          ]}
                          value={{ value: formState.formData.timezone, label: `${formState.formData.timezone} (${formState.formData.timezone.includes('Kolkata') ? 'IST' : formState.formData.timezone.includes('New_York') ? 'EST' : formState.formData.timezone.includes('London') ? 'GMT' : formState.formData.timezone.includes('Dubai') ? 'GST' : formState.formData.timezone.includes('Singapore') ? 'SGT' : formState.formData.timezone.includes('Sydney') ? 'AEST' : 'NZST'})` }}
                          onChange={(selected) => updateFormData({ timezone: selected?.value || 'Asia/Kolkata' })}
                          styles={selectStyles}
                          placeholder="Select timezone"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={formState.isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={formState.isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Consent Step (for under 16) */}
            {formState.step === 'consent' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Consent & Verification
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please complete the verification and accept the agreements
                  </p>
                </div>

                
              </div>
            )}

            {/* Details Step */}
            {formState.step === 'details' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-center mb-3 flex-shrink-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  Contact & Student Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Help us personalize your demo experience
                </p>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">

              {/* Contact Information Section - Only for under 16 */}
              {formState.isStudentUnder16 && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl mb-4">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className={labelClasses}>First Name *</label>
                      <input
                        type="text"
                        value={formState.formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        className={inputClasses(!!formState.errors.firstName)}
                        placeholder="Enter first name"
                      />
                      {formState.errors.firstName && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className={labelClasses}>Last Name *</label>
                      <input
                        type="text"
                        value={formState.formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        className={inputClasses(!!formState.errors.lastName)}
                        placeholder="Enter last name"
                      />
                      {formState.errors.lastName && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.lastName}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClasses}>Email Address *</label>
                      <input
                        type="email"
                        value={formState.formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        className={inputClasses(!!formState.errors.email)}
                        placeholder="your@email.com"
                      />
                      {formState.errors.email && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.email}
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className={labelClasses}>Mobile Number *</label>
                      <PhoneNumberInput
                        value={{ 
                          country: formState.formData.country.toUpperCase(), 
                          number: formState.formData.mobileNumber 
                        }}
                        onChange={(val) => {
                          updateFormData({ 
                            mobileNumber: val.number,
                            mobileCountryCode: '+91' // Will be set based on country later
                          });
                        }}
                        placeholder="Enter mobile number"
                        defaultCountry="IN"
                        error={formState.errors.mobileNumber}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className={labelClasses}>City *</label>
                      <input
                        type="text"
                        value={formState.formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                        className={inputClasses(!!formState.errors.city)}
                        placeholder="Enter your city"
                      />
                      {formState.errors.city && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.city}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelClasses}>Country *</label>
                      <Select
                        options={countryOptions}
                        value={countryOptions.find(option => option.value === formState.formData.country)}
                        onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                        styles={selectStyles}
                        placeholder="Select country"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Student Contact and Information Section */}
              <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl mb-4">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3">
                  Student Contact and Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className={labelClasses}>Student Name *</label>
                    <input
                      type="text"
                      value={formState.formData.studentName}
                      onChange={(e) => updateFormData({ studentName: e.target.value })}
                      className={inputClasses(!!formState.errors.studentName)}
                      placeholder="Enter student's name"
                    />
                    {formState.errors.studentName && (
                      <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formState.errors.studentName}
                      </div>
                    )}
                  </div>

                  {/* Student Email (for 16+ only) */}
                  {!formState.isStudentUnder16 && (
                    <div>
                      <label className={labelClasses}>Student Email *</label>
                      <input
                        type="email"
                        value={formState.formData.studentEmail}
                        onChange={(e) => updateFormData({ studentEmail: e.target.value })}
                        className={inputClasses(!!formState.errors.studentEmail)}
                        placeholder="Enter student's email address"
                      />
                      {formState.errors.studentEmail && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formState.errors.studentEmail}
                        </div>
                      )}
                    </div>
                  )}

                                  {/* Conditional Fields for Under 16 */}
                  {formState.isStudentUnder16 ? (
                    <>
                      {/* Grade */}
                      <div>
                        <label className={labelClasses}>Current Grade *</label>
                        <Select
                          options={gradeOptions}
                          value={gradeOptions.find(option => option.value === formState.formData.grade)}
                          onChange={(selected) => updateFormData({ grade: selected?.value || 'grade_1-2' })}
                          styles={selectStyles}
                          placeholder="Select grade"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                        {formState.errors.grade && (
                          <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {formState.errors.grade}
                          </div>
                        )}
                      </div>

                      {/* Student City */}
                      <div>
                        <label className={labelClasses}>Student City *</label>
                        <input
                          type="text"
                          value={formState.formData.studentCity}
                          onChange={(e) => updateFormData({ studentCity: e.target.value })}
                          className={inputClasses(!!formState.errors.studentCity)}
                          placeholder="Enter student's city"
                        />
                        {formState.errors.studentCity && (
                          <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {formState.errors.studentCity}
                          </div>
                        )}
                      </div>

                      {/* Student State */}
                      <div>
                        <label className={labelClasses}>Student State *</label>
                        <input
                          type="text"
                          value={formState.formData.studentState}
                          onChange={(e) => updateFormData({ studentState: e.target.value })}
                          className={inputClasses(!!formState.errors.studentState)}
                          placeholder="Enter student's state"
                        />
                        {formState.errors.studentState && (
                          <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {formState.errors.studentState}
                          </div>
                        )}
                      </div>

                      {/* School Name */}
                      <div>
                        <label className={labelClasses}>School Name</label>
                        <input
                          type="text"
                          value={formState.formData.schoolName}
                          onChange={(e) => updateFormData({ schoolName: e.target.value })}
                          className={inputClasses(false)}
                          placeholder="Enter school name"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile Number (for 16+) */}
                      <div>
                        <label className={labelClasses}>Mobile Number *</label>
                        <PhoneNumberInput
                          value={{ 
                            country: formState.formData.country.toUpperCase(), 
                            number: formState.formData.mobileNumber,
                            formattedNumber: formState.formData.mobileNumber,
                            isValid: validatePhoneNumber(formState.formData.mobileNumber, formState.formData.country)
                          }}
                                                      onChange={(val) => {
                              const isValid = validatePhoneNumber(val.number, val.country);
                              updateFormData({ 
                                mobileNumber: val.number,
                                country: val.country.toLowerCase(),
                                mobileCountryCode: val.country === 'IN' ? '+91' : val.country === 'US' ? '+1' : val.country === 'GB' ? '+44' : '+91'
                              });
                              
                              // Clear mobile number error if validation passes
                              if (isValid && formState.errors.mobileNumber) {
                                setFormState(prev => ({
                                  ...prev,
                                  errors: { ...prev.errors, mobileNumber: '' }
                                }));
                              }
                            }}
                          placeholder="Enter mobile number"
                          defaultCountry="IN"
                          error={formState.errors.mobileNumber}
                        />
                      </div>

                      {/* City (for 16+) */}
                      <div>
                        <label className={labelClasses}>City *</label>
                        <input
                          type="text"
                          value={formState.formData.city}
                          onChange={(e) => updateFormData({ city: e.target.value })}
                          className={inputClasses(!!formState.errors.city)}
                          placeholder="Enter your city"
                        />
                        {formState.errors.city && (
                          <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {formState.errors.city}
                          </div>
                        )}
                      </div>

                      {/* Country (for 16+) */}
                      <div>
                        <label className={labelClasses}>Country *</label>
                        <Select
                          options={countryOptions}
                          value={countryOptions.find(option => option.value === formState.formData.country)}
                          onChange={(selected) => updateFormData({ country: selected?.value || 'in' })}
                          styles={selectStyles}
                          placeholder="Select country"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      {/* Highest Qualification */}
                      <div>
                        <label className={labelClasses}>Highest Qualification *</label>
                        <Select
                          options={qualificationOptions}
                          value={qualificationOptions.find(option => option.value === formState.formData.highestQualification)}
                          onChange={(selected) => updateFormData({ highestQualification: selected?.value || '12th passed' })}
                          styles={selectStyles}
                          placeholder="Select qualification"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                        {formState.errors.qualification && (
                          <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {formState.errors.qualification}
                          </div>
                        )}
                      </div>

                      {/* Current Status */}
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Current Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.formData.currentlyStudying}
                              onChange={(e) => updateFormData({ currentlyStudying: e.target.checked })}
                            />
                            <span className="text-gray-700 dark:text-gray-300">Currently Studying</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.formData.currentlyWorking}
                              onChange={(e) => updateFormData({ currentlyWorking: e.target.checked })}
                            />
                            <span className="text-gray-700 dark:text-gray-300">Currently Working</span>
                          </label>
                        </div>
                      </div>

                      {/* Education Institute (if studying) */}
                      {formState.formData.currentlyStudying && (
                        <div className="md:col-span-2">
                          <label className={labelClasses}>Educational Institution</label>
                          <input
                            type="text"
                            value={formState.formData.educationInstituteName}
                            onChange={(e) => updateFormData({ educationInstituteName: e.target.value })}
                            className={inputClasses(false)}
                            placeholder="e.g., University of Delhi, IIT Mumbai"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>


                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={formState.isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={formState.isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
            </div>
          )}

          {/* Communication Preferences Step (16+ only) */}
          {formState.step === 'communication-preferences' && !formState.isStudentUnder16 && (
            <div className="flex-1 flex flex-col min-h-0">

              
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">

              {/* Demo Session Preferences */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl mb-4">

                
                {/* Preferred Date */}
                <div className="mb-4">
                  <label className={labelClasses}>Preferred Date (Optional)</label>
                  <input
                    type="date"
                    value={formState.formData.preferredDate ? formState.formData.preferredDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                      updateFormData({ preferredDate: selectedDate });
                    }}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 days from now
                    className={inputClasses(false)}
                    placeholder="Select preferred date"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave blank for flexible scheduling within the next 30 days
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preferred Time Slot */}
                  <div>
                    <label className={labelClasses}>Preferred Time Slot</label>
                    <Select
                      options={timeSlots}
                      value={timeSlots.find(option => option.value === formState.formData.preferredTimeSlot)}
                      onChange={(selected) => updateFormData({ preferredTimeSlot: selected?.value || '' })}
                      styles={selectStyles}
                      placeholder="Select preferred time"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className={labelClasses}>Timezone</label>
                  <Select
                    options={[
                      // Asia Pacific
                      { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +05:30)' },
                      { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +04:00)' },
                      { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT +08:00)' },
                      { value: 'Asia/Hong_Kong', label: 'Asia/Hong Kong (HKT +08:00)' },
                      { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST +09:00)' },
                      { value: 'Asia/Seoul', label: 'Asia/Seoul (KST +09:00)' },
                      { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST +08:00)' },
                      { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT +07:00)' },
                      { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB +07:00)' },
                      { value: 'Asia/Manila', label: 'Asia/Manila (PST +08:00)' },
                      { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala Lumpur (MYT +08:00)' },
                      { value: 'Asia/Dhaka', label: 'Asia/Dhaka (BST +06:00)' },
                      { value: 'Asia/Karachi', label: 'Asia/Karachi (PKT +05:00)' },
                      { value: 'Asia/Colombo', label: 'Asia/Colombo (SLST +05:30)' },
                      
                      // Australia/New Zealand
                      { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT +11:00)' },
                      { value: 'Australia/Melbourne', label: 'Australia/Melbourne (AEDT +11:00)' },
                      { value: 'Australia/Perth', label: 'Australia/Perth (AWST +08:00)' },
                      { value: 'Australia/Brisbane', label: 'Australia/Brisbane (AEST +10:00)' },
                      { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT +13:00)' },
                      
                      // Europe
                      { value: 'Europe/London', label: 'Europe/London (GMT +00:00)' },
                      { value: 'Europe/Paris', label: 'Europe/Paris (CET +01:00)' },
                      { value: 'Europe/Berlin', label: 'Europe/Berlin (CET +01:00)' },
                      { value: 'Europe/Rome', label: 'Europe/Rome (CET +01:00)' },
                      { value: 'Europe/Madrid', label: 'Europe/Madrid (CET +01:00)' },
                      { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET +01:00)' },
                      { value: 'Europe/Brussels', label: 'Europe/Brussels (CET +01:00)' },
                      { value: 'Europe/Zurich', label: 'Europe/Zurich (CET +01:00)' },
                      { value: 'Europe/Vienna', label: 'Europe/Vienna (CET +01:00)' },
                      { value: 'Europe/Prague', label: 'Europe/Prague (CET +01:00)' },
                      { value: 'Europe/Warsaw', label: 'Europe/Warsaw (CET +01:00)' },
                      { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET +01:00)' },
                      { value: 'Europe/Oslo', label: 'Europe/Oslo (CET +01:00)' },
                      { value: 'Europe/Copenhagen', label: 'Europe/Copenhagen (CET +01:00)' },
                      { value: 'Europe/Helsinki', label: 'Europe/Helsinki (EET +02:00)' },
                      { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK +03:00)' },
                      
                      // North America
                      { value: 'America/New_York', label: 'America/New York (EST -05:00)' },
                      { value: 'America/Chicago', label: 'America/Chicago (CST -06:00)' },
                      { value: 'America/Denver', label: 'America/Denver (MST -07:00)' },
                      { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST -08:00)' },
                      { value: 'America/Toronto', label: 'America/Toronto (EST -05:00)' },
                      { value: 'America/Vancouver', label: 'America/Vancouver (PST -08:00)' },
                      { value: 'America/Montreal', label: 'America/Montreal (EST -05:00)' },
                      
                      // South America
                      { value: 'America/Sao_Paulo', label: 'America/São Paulo (BRT -03:00)' },
                      { value: 'America/Buenos_Aires', label: 'America/Buenos Aires (ART -03:00)' },
                      { value: 'America/Lima', label: 'America/Lima (PET -05:00)' },
                      { value: 'America/Bogota', label: 'America/Bogotá (COT -05:00)' },
                      
                      // Africa
                      { value: 'Africa/Cairo', label: 'Africa/Cairo (EET +02:00)' },
                      { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST +02:00)' },
                      { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT +01:00)' },
                      { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT +03:00)' },
                      
                      // Middle East
                      { value: 'Asia/Riyadh', label: 'Asia/Riyadh (AST +03:00)' },
                      { value: 'Asia/Kuwait', label: 'Asia/Kuwait (AST +03:00)' },
                      { value: 'Asia/Qatar', label: 'Asia/Qatar (AST +03:00)' },
                      { value: 'Asia/Bahrain', label: 'Asia/Bahrain (AST +03:00)' },
                      { value: 'Asia/Tehran', label: 'Asia/Tehran (IRST +03:30)' },
                      { value: 'Asia/Jerusalem', label: 'Asia/Jerusalem (IST +02:00)' },
                      
                      // UTC
                      { value: 'UTC', label: 'UTC (Coordinated Universal Time +00:00)' },
                    ]}
                    value={{ value: formState.formData.timezone, label: formState.formData.timezone }}
                    onChange={(selected) => updateFormData({ timezone: selected?.value || 'Asia/Kolkata' })}
                    styles={selectStyles}
                    placeholder="Select timezone"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    isSearchable
                  />
                  </div>
                </div>

                {/* Previous Demo Checkbox */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.formData.previousDemoAttended}
                      onChange={(e) => updateFormData({ previousDemoAttended: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      I have attended a MEDH demo session before
                    </span>
                  </label>
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl mb-4">

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.formData.emailNotifications}
                      onChange={(e) => updateFormData({ emailNotifications: e.target.checked })}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Email notifications about courses and updates
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.formData.whatsappUpdates}
                      onChange={(e) => updateFormData({ whatsappUpdates: e.target.checked })}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      WhatsApp updates about session reminders
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.formData.courseRecommendations}
                      onChange={(e) => updateFormData({ courseRecommendations: e.target.checked })}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Personalized course recommendations
                    </span>
                  </label>
                </div>
              </div>


                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={formState.isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={formState.isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
            </div>
          )}

          {/* Consent Step (for both flows) */}
          {formState.step === 'consent' && (
            <div className="flex-1 flex flex-col min-h-0">

              
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                {/* ReCaptcha Section */}
                <div className="mb-4">
                  <CustomReCaptcha
                    onChange={(value) => updateFormData({ captchaToken: value })}
                    error={!!formState.errors.captcha}
                  />
                  {formState.errors.captcha && (
                    <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formState.errors.captcha}
                    </div>
                  )}
                </div>

                {/* Consent Section */}
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.formData.termsAndPrivacy}
                        onChange={(e) => updateFormData({ termsAndPrivacy: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          I agree to the{" "}
                          <Link href="/terms-and-services" target="_blank" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>
                          {" "}and{" "}
                          <Link href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.formData.dataCollectionConsent}
                        onChange={(e) => updateFormData({ dataCollectionConsent: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          I consent to processing of my personal data for demo session purposes
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.formData.communicationConsent}
                        onChange={(e) => updateFormData({ communicationConsent: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          I consent to receive communication about my demo session via email/SMS
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Session reminders, meeting links, and follow-up communications
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.formData.gdprConsent}
                        onChange={(e) => updateFormData({ gdprConsent: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          I acknowledge GDPR data protection rights and processing
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Right to access, rectify, erase, and port your personal data
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.formData.marketingConsent}
                        onChange={(e) => updateFormData({ marketingConsent: e.target.checked })}
                                                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          Send me updates about courses and educational content (optional)
                        </span>
                      </div>
                    </label>
                  </div>

                  {(formState.errors.terms || formState.errors.dataConsent || formState.errors.captcha) && (
                    <div className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please accept the required agreements and complete CAPTCHA
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={formState.isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={formState.isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Booking Demo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Book My Demo Session
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer - Only for steps without built-in navigation */}
        {!['details', 'course-preferences', 'communication-preferences', 'consent'].includes(formState.step) && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
            <div className="flex justify-between items-center">
              {/* Back Button - Show for all steps except 'age' */}
              {formState.step !== 'age' && (
                <button
                  onClick={prevStep}
                  disabled={formState.isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              {/* Continue Button */}
              <button
                onClick={nextStep}
                disabled={formState.isSubmitting || (formState.step === 'age' && formState.isStudentUnder16 === null)}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  formState.step === 'age' ? 'ml-auto' : ''
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.6);
        }
      `}</style>
    </div>
  );
};

export default EmbeddedDemoForm; 