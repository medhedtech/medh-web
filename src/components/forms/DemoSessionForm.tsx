"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { 
  X, Calendar, Clock, MapPin, AlertCircle, CheckCircle, 
  Radio, Loader2, Phone, Mail, User, GraduationCap, 
  Building, Globe, Heart, ChevronRight, ChevronLeft, Save, Eye, EyeOff,
  Monitor, Smartphone, Tablet, Wifi, Languages, BookOpen, Target
} from "lucide-react";
import Select from "react-select";
import {
  IBookFreeDemoSessionPayload,
  IContactInfo,
  IParentDetails,
  IStudentDetailsUnder16,
  IStudentDetails16AndAbove,
  IDemoSessionDetails,
  IConsent,
  ILiveCourse,
  IValidationError,
  TStudentGrade,
  THighestQualification,
  TKnowMedhFrom,
  TPreferredTiming,
  TFormStep,
  IFormConfig,
  DemoSessionAPIService as DemoSessionAPI,
  FormValidationService,
} from "@/apis/demo.api";
import { usePostQuery } from '@/hooks/postQuery.hook';
// import { useGetQuery } from '@/hooks/getQuery.hook'; // Not needed for static time slots
import { buildComponent, buildAdvancedComponent } from "@/utils/designSystem";
import Swal from "sweetalert2";
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../shared/login/PhoneNumberInput';
import Link from "next/link";

// ========== CUSTOM CALENDAR COMPONENT ==========

interface CustomCalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  isDark?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selected, onSelect, disabled, isDark }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if date should be disabled
  const isDisabled = (date: Date) => {
    if (disabled && disabled(date)) return true;
    if (date < today) return true; // Past dates
    if (date.getDay() === 0) return true; // Sundays
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (date > maxDate) return true; // Beyond 30 days
    return false;
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const disabled = isDisabled(date);
    const selected = isSelected(date);
    const todayClass = isToday(date);

    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !disabled && onSelect(date)}
        disabled={disabled}
        className={`
          h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
          ${disabled 
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' 
            : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
          }
          ${selected 
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
            : isDark ? 'text-white' : 'text-gray-900'
          }
          ${todayClass && !selected 
            ? 'bg-gray-200 dark:bg-gray-700 font-bold ring-2 ring-blue-200 dark:ring-blue-800' 
            : ''
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        `}
      >
        {day}
      </button>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthName}
        </h3>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-10 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded opacity-50"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

// ========== FORM CONFIGURATION (Following formjson.md) ==========

const FORM_CONFIG = {
  form_id: "demo_booking_v2_1",
  form_type: "book_a_free_demo_session",
  title: "Book Your Free Demo Session",
  description: "Experience our teaching methodology with a personalized demo",
  category: "demo_booking",
  ui_theme: "educational",
  layout: "vertical",
  steps: 2,
  auto_save: true,
  show_progress: true,
  conditional_logic: true
};

// ========== ENHANCED FORM STATE TYPES ==========

interface IFormState {
  // Current step and UI state
  step: TFormStep;
  isStudentUnder16: boolean | null;
  
  // Form data - restructured to match backend expectations
  contactInfo: IContactInfo;
  parentDetails: {
    full_name: string;
    email: string;
    phone_number: string;
    city: string;
    country: string;
    relationship: 'father' | 'mother' | 'guardian';
    preferred_timings_to_connect: TPreferredTiming;
  };
  studentDetailsUnder16: IStudentDetailsUnder16;
  studentDetails16AndAbove: IStudentDetails16AndAbove;
  demoSessionDetails: IDemoSessionDetails;
  consent: IConsent;
  
  // Validation and submission
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved?: Date;
  
  // Dynamic data
  liveCourses: ILiveCourse[];
  isLoadingCourses: boolean;
  // Removed: availableTimeSlots and isLoadingTimeSlots - now handled by useGetQuery
  
  // Performance tracking
  formStartTime: Date;
  interactionCount: number;
}

interface DemoSessionFormProps {
  onClose: () => void;
  initialData?: Partial<IBookFreeDemoSessionPayload>;
  onSubmitSuccess?: (data: any) => void;
}

// ========== FORM OPTIONS & CONSTANTS ==========

const gradeOptions: { value: TStudentGrade; label: string; description: string }[] = [
  { value: "Grade 1-2", label: "Grade 1-2", description: "Ages 6-8" },
  { value: "Grade 3-4", label: "Grade 3-4", description: "Ages 8-10" },
  { value: "Grade 5-6", label: "Grade 5-6", description: "Ages 10-12" },
  { value: "Grade 7-8", label: "Grade 7-8", description: "Ages 12-14" },
  { value: "Grade 9-10", label: "Grade 9-10", description: "Ages 14-16" },
  { value: "Grade 11-12", label: "Grade 11-12", description: "Ages 16-18" },
  { value: "Home Study", label: "Home Study", description: "Homeschooled" },
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
  { value: "online_ad", label: "Online Advertisement" },
  { value: "school_event", label: "School Event" },
  { value: "other", label: "Other" },
];

const preferredTimingsOptions = [
  { value: "morning", label: "Morning (9AM-12PM)" },
  { value: "afternoon", label: "Afternoon (12PM-5PM)" },
  { value: "evening", label: "Evening (5PM-8PM)" },
  { value: "flexible", label: "Flexible" },
];

const sessionDurationOptions = [
  { value: "30min", label: "30 minutes (Quick overview)" },
  { value: "45min", label: "45 minutes (Detailed demo)" },
  { value: "60min", label: "1 hour (Comprehensive session)" },
];

const devicePreferenceOptions = [
  { value: "computer", label: "Desktop/Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "mobile", label: "Mobile Phone" },
];

// ========== UI COMPONENT STYLES ==========

const getInputClasses = (hasError: boolean, isDark: boolean, size: 'sm' | 'md' = 'md') => {
  const sizeClasses = size === 'sm' ? 'p-2.5 text-sm' : 'p-3 text-sm';
  const baseClasses = `w-full rounded-lg border transition-all duration-200 focus:ring-1 focus:ring-offset-0 focus:outline-none ${sizeClasses}`;
  const errorClasses = hasError 
    ? "border-red-400 bg-red-50/50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500 text-red-900 dark:text-red-100"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 dark:hover:border-gray-500";
  
  return `${baseClasses} ${errorClasses}`;
};

const labelClasses = "block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1";
const errorClasses = "flex items-center gap-1 text-red-600 dark:text-red-400 text-xs mt-1";
const sectionClasses = "rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700";

// ========== ENHANCED COMPONENTS ==========

const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  
  return (
    <div className={errorClasses}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

const InputGroup = ({ 
  label, 
  required = false, 
  error, 
  children,
  className = "",
  helpText,
  icon: Icon
}: { 
  label: string; 
  required?: boolean; 
  error?: string; 
  children: React.ReactNode;
  className?: string;
  helpText?: string;
  icon?: React.ElementType;
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className={labelClasses}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-primary-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
    </label>
    {children}
    {helpText && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</div>}
    <ErrorMessage error={error} />
  </div>
);

const ProgressIndicator = ({ currentStep, totalSteps = 2 }: { currentStep: TFormStep; totalSteps?: number }) => {
  const steps: TFormStep[] = ['details', 'preferences'];
  const stepLabels = ['Details', 'Preferences & Consent'];
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
              <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${index <= currentIndex 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                }
              `}>
              {index < currentIndex ? <CheckCircle size={16} /> : index + 1}
              </div>
              <span className={`
              text-xs font-medium transition-colors hidden sm:inline
              ${index <= currentIndex ? 'text-primary-500' : 'text-gray-400'}
              `}>
                {stepLabels[index]}
              </span>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-0.5 transition-colors
                ${index < currentIndex ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const AutoSaveIndicator = ({ lastSaved, isSaving }: { lastSaved?: Date; isSaving: boolean }) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
        <Save className="h-3 w-3 animate-pulse" />
        Saving...
      </div>
    );
  }
  
  if (lastSaved) {
    const timeAgo = Math.round((Date.now() - lastSaved.getTime()) / 1000);
    const timeText = timeAgo < 60 ? 'just now' : `${Math.round(timeAgo / 60)}m ago`;
    
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
        <CheckCircle className="h-3 w-3" />
        Saved {timeText}
      </div>
    );
  }
  
  return null;
};

// ========== MAIN COMPONENT ==========

const DemoSessionForm: React.FC<DemoSessionFormProps> = ({ 
  onClose, 
  initialData,
  onSubmitSuccess 
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // ✅ Use the established API request pattern
  const { postQuery } = usePostQuery();
  
  // Note: Time slots are now static - no longer need useGetQuery for time slots

  // Enhanced Form State with better initialization
  const [formState, setFormState] = useState<IFormState>({
    step: 'details',
    isStudentUnder16: null,
    contactInfo: {
      full_name: '',
      email: '',
      phone_number: '', // Keep existing field name for now
      city: '',
      country: 'in'
    },
    parentDetails: { 
      full_name: '',
      email: '',
      phone_number: '',
      city: '',
      country: 'in',
      relationship: 'father',
      preferred_timings_to_connect: 'flexible'
    },
    studentDetailsUnder16: { 
      name: '',
      grade: 'Grade 1-2' as TStudentGrade, // Keep existing for now
      city: '',
      state: '',
      country: 'in',
      preferred_course: [], 
      know_medh_from: 'social_media',
      school_name: '',
      parent_mobile_access: true,
      learning_style_preference: 'mixed',
      additional_notes: ''
    },
    studentDetails16AndAbove: { 
      name: '',
      email: '',
      mobile_no: '',
      city: '',
      state: '',
      country: 'in',
      highest_qualification: '12th passed',
      currently_studying: false, 
      currently_working: false, 
      preferred_course: [], 
      know_medh_from: 'social_media',
      school_name: '',
      preferred_timings_to_connect: 'flexible',
      additional_notes: ''
    },
    demoSessionDetails: { 
      preferred_date: undefined, 
      timezone: 'Asia/Kolkata',
      session_duration_preference: '45min',
      device_preference: 'computer',
      internet_quality: 'good',
      language_preference: 'english',
      previous_demo_attended: false
    },
    consent: { 
      terms_accepted: false, 
      privacy_policy_accepted: false, 
      data_processing_consent: false,
      marketing_consent: false,
      communication_consent: false,
      gdpr_consent: false
    },
    validationErrors: {},
    isSubmitting: false, // Use API loading state
    isDirty: false,
    liveCourses: [],
    isLoadingCourses: true,
    // Removed: availableTimeSlots and isLoadingTimeSlots - now handled by useGetQuery
    formStartTime: new Date(),
    interactionCount: 0
  });

  // ========== STATIC TIME SLOT OPTIONS ==========
  
  const staticTimeSlots = [
    { value: 'morning 9-12', label: 'Morning 9-12', available: true },
    { value: 'afternoon 12-5', label: 'Afternoon 12-5', available: true },
    { value: 'evening 5-10', label: 'Evening 5-10', available: true }
  ];

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await DemoSessionAPI.getLiveCourses();
        if (response.success && response.data) {
          const categories: ILiveCourse[] = Array.from(new Set(
            response.data
              .filter(course => course && course.category)
              .map(course => course.category)
              .filter(category => category)
          )).map(category => ({
            _id: category!,
            title: category!,
            description: `${category} courses`,
            category: category!,
            subcategory: undefined,
            duration: undefined,
            level: 'beginner' as const,
            format: 'live' as const,
            prerequisites: [],
            learning_outcomes: [],
            is_active: true,
            demo_available: true,
            enrollment_status: 'open' as const
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

  // Auto-save functionality
  useEffect(() => {
    if (formState.isDirty && !formState.isSubmitting) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(async () => {
        setIsAutoSaving(true);
        
        try {
          const payload = buildFormPayload();
          await DemoSessionAPI.autoSaveFormData('book_a_free_demo_session', payload);
          
    setFormState(prev => ({ 
      ...prev, 
            lastSaved: new Date(),
            isDirty: false 
          }));
        } catch (error) {
          console.warn('Auto-save failed:', error);
        } finally {
          setIsAutoSaving(false);
        }
      }, 3000); // Auto-save after 3 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formState.isDirty, formState.isSubmitting]);

  // Note: Time slots are now static - no need to fetch them dynamically

  // Initialize with provided data
  useEffect(() => {
    if (initialData) {
    setFormState(prev => ({ 
      ...prev, 
        ...initialData,
        isDirty: false
    }));
    }
  }, [initialData]);

  // ========== HELPER FUNCTIONS ==========

  const markAsDirty = useCallback(() => {
    setFormState(prev => ({ 
      ...prev, 
      isDirty: true,
      interactionCount: prev.interactionCount + 1
    }));
  }, []);

  const buildFormPayload = useCallback((): any => {
    // Helper function to split full name into first/last name
    const splitName = (fullName: string) => {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      return { firstName, lastName };
    };

    // Helper to convert grade format
    const convertGradeFormat = (grade: string) => {
      return grade.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    };

    const basePayload = {
      form_type: 'book_a_free_demo_session',
      form_config: {
        form_type: 'book_a_free_demo_session',
        form_version: '2.1',
        submission_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      is_student_under_16: formState.isStudentUnder16 || false,
      demo_session_details: {
        ...formState.demoSessionDetails,
        timezone: 'Asia/Kolkata' // ✅ Use standard timezone
      },
      // ✅ Backend expected consent format
      consent: {
        terms_and_privacy: formState.consent.terms_accepted && formState.consent.privacy_policy_accepted,
        data_collection_consent: formState.consent.data_processing_consent || formState.consent.terms_accepted,
        marketing_consent: formState.consent.marketing_consent || false
      },
      captcha_token: 'development_token',
      submission_metadata: {
        timestamp: new Date().toISOString(),
        form_version: '2.1',
        device_info: {
          type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' as const : 'desktop' as const,
          os: navigator.platform,
          browser: navigator.userAgent.split(' ').pop() || 'Unknown',
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`
        },
        validation_passed: false,
        form_interaction_time: Math.round((Date.now() - formState.formStartTime.getTime()) / 1000)
      }
    };

    if (formState.isStudentUnder16) {
      // ✅ For under-16: parent info goes to contact_info
      const parentName = splitName(formState.parentDetails.full_name || '');
      
      return {
        ...basePayload,
        contact_info: {
          first_name: parentName.firstName,
          last_name: parentName.lastName,
          full_name: formState.parentDetails.full_name || '',
          email: formState.parentDetails.email || '',
          mobile_number: {
            country_code: `+${formState.parentDetails.country === 'in' ? '91' : '1'}`,
            number: formState.parentDetails.phone_number || ''
          },
          city: formState.parentDetails.city || '',
          country: formState.parentDetails.country || 'in'
        },
        parent_details: {
          relationship: formState.parentDetails.relationship,
          preferred_timings_to_connect: formState.parentDetails.preferred_timings_to_connect
        },
        student_details: {
          ...formState.studentDetailsUnder16,
          grade: convertGradeFormat(formState.studentDetailsUnder16.grade || 'Grade 1-2')
        }
      };
    } else {
      // ✅ For 16+: student info goes to contact_info
      const studentName = splitName(formState.studentDetails16AndAbove.name || '');
      
      return {
        ...basePayload,
        contact_info: {
          first_name: studentName.firstName,
          last_name: studentName.lastName,
          full_name: formState.studentDetails16AndAbove.name || '',
          email: formState.studentDetails16AndAbove.email || '',
          mobile_number: {
            country_code: `+${formState.studentDetails16AndAbove.country === 'in' ? '91' : '1'}`,
            number: formState.studentDetails16AndAbove.mobile_no || ''
          },
          city: formState.studentDetails16AndAbove.city || '',
          country: formState.studentDetails16AndAbove.country || 'in'
        },
        student_details: {
          ...formState.studentDetails16AndAbove,
          // Remove contact info fields that are now in contact_info
          email: undefined,
          mobile_no: undefined,
          country: undefined
      }
      };
    }
  }, [formState]);

  const courseOptions = useMemo(() => {
    return formState.liveCourses
      .filter(course => course && course.title && course._id)
      .map(course => ({ 
        value: course._id, 
        label: course.title,
        description: course.description 
      }));
  }, [formState.liveCourses]);

  // ========== VALIDATION ==========

  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (formState.step === 'details') {
        if (formState.isStudentUnder16 === null) {
        errors.age = "Please select student's age group.";
      }
      
        if (formState.isStudentUnder16) {
        // Validate parent details
        if (!formState.parentDetails.full_name.trim()) errors.parentName = "Required";
        if (!FormValidationService.validateEmail(formState.parentDetails.email).isValid) errors.parentEmail = "Invalid email";
        if (!formState.parentDetails.phone_number.trim()) errors.parentMobile = "Required";
        if (!formState.parentDetails.city.trim()) errors.parentCity = "Required";
        
        // Validate student details
        if (!formState.studentDetailsUnder16.name.trim()) errors.studentName = "Required";
        if (!formState.studentDetailsUnder16.city.trim()) errors.studentCity = "Required";
        if (!formState.studentDetailsUnder16.state?.trim()) errors.studentState = "Required";
        if (formState.studentDetailsUnder16.preferred_course.length === 0) errors.preferredCourse = "Select at least one course";
      } else {
        // Validate 16+ student details
        if (!formState.studentDetails16AndAbove.name?.trim()) errors.studentName = "Required";
        if (!FormValidationService.validateEmail(formState.studentDetails16AndAbove.email || "").isValid) errors.studentEmail = "Invalid email";
        if (!formState.studentDetails16AndAbove.mobile_no?.trim()) errors.studentMobile = "Required";
        if (!formState.studentDetails16AndAbove.city?.trim()) errors.studentCity = "Required";
        if (formState.studentDetails16AndAbove.preferred_course.length === 0) errors.preferredCourse = "Select at least one course";
          }
        }
        
    if (formState.step === 'preferences') {
      if (!formState.consent.terms_accepted) errors.terms = "Required";
      if (!formState.consent.privacy_policy_accepted) errors.privacy = "Required";
      if (!formState.consent.data_processing_consent) errors.dataProcessing = "Required";
    }

    setFormState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  // ========== FORM SUBMISSION ==========

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;

    // ✅ Create backend-compatible payload
    const createBackendPayload = () => {
      const splitName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
      };

      if (formState.isStudentUnder16) {
        const parentName = splitName(formState.parentDetails.full_name || '');
        
        return {
          form_type: 'book_a_free_demo_session',
          captcha_token: 'development_token',
          contact_info: {
            first_name: parentName.firstName,
            last_name: parentName.lastName,
            full_name: formState.parentDetails.full_name || '',
            email: formState.parentDetails.email || '',
            mobile_number: {
              country_code: '+91',
              number: (formState.parentDetails.phone_number || '').replace(/\D/g, '') // ✅ Fixed: Clean phone number to digits only
            },
            city: formState.parentDetails.city || '',
            country: formState.parentDetails.country || 'in'
          },
          is_student_under_16: true,
          parent_details: {
            relationship: formState.parentDetails.relationship,
            preferred_timings: formState.parentDetails.preferred_timings_to_connect // ✅ Fixed: Use correct field name
          },
          student_details: {
            name: formState.studentDetailsUnder16.name,
            grade: formState.studentDetailsUnder16.grade.toLowerCase().replace(/\s+/g, '-'), // ✅ Fixed: Use hyphens, not underscores
            city: formState.studentDetailsUnder16.city,
            state: formState.studentDetailsUnder16.state,
            country: formState.studentDetailsUnder16.country,
            preferred_course: formState.studentDetailsUnder16.preferred_course,
            know_medh_from: formState.studentDetailsUnder16.know_medh_from,
            school_name: formState.studentDetailsUnder16.school_name,
            parent_mobile_access: true,
            learning_style_preference: 'mixed'
          },
          demo_session_details: {
            ...formState.demoSessionDetails,
            timezone: 'Asia/Kolkata'
          },
          consent: {
            terms_and_privacy: formState.consent.terms_accepted && formState.consent.privacy_policy_accepted,
            data_collection_consent: formState.consent.data_processing_consent || formState.consent.terms_accepted,
            marketing_consent: formState.consent.marketing_consent || false
          },
          form_config: {
            form_type: 'book_a_free_demo_session',
            form_version: '2.1',
            submission_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
            form_interaction_time: Math.round((Date.now() - formState.formStartTime.getTime()) / 1000)
          }
        };
      } else {
        const studentName = splitName(formState.studentDetails16AndAbove.name || '');
        
        return {
          form_type: 'book_a_free_demo_session',
          captcha_token: 'development_token',
          contact_info: {
            first_name: studentName.firstName,
            last_name: studentName.lastName,
            full_name: formState.studentDetails16AndAbove.name || '',
            email: formState.studentDetails16AndAbove.email || '',
            mobile_number: {
              country_code: '+91',
              number: formState.studentDetails16AndAbove.mobile_no || ''
            },
            city: formState.studentDetails16AndAbove.city || '',
            country: formState.studentDetails16AndAbove.country || 'in'
          },
          is_student_under_16: false,
          student_details: {
            ...formState.studentDetails16AndAbove,
            email: undefined, // Remove from student_details as it's in contact_info
            mobile_no: undefined,
            country: undefined
          },
          demo_session_details: {
            ...formState.demoSessionDetails,
            timezone: 'Asia/Kolkata'
          },
          consent: {
            terms_and_privacy: formState.consent.terms_accepted && formState.consent.privacy_policy_accepted,
            data_collection_consent: formState.consent.data_processing_consent || formState.consent.terms_accepted,
            marketing_consent: formState.consent.marketing_consent || false
          },
          form_config: {
            form_type: 'book_a_free_demo_session',
            form_version: '2.1',
            submission_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
            form_interaction_time: Math.round((Date.now() - formState.formStartTime.getTime()) / 1000)
          }
        };
      }
    };

    const backendPayload = createBackendPayload();
    console.log('🚀 Submitting payload:', backendPayload);

    // ✅ Use your established usePostQuery pattern instead of raw fetch
    const { data, error } = await postQuery({
      url: '/forms/submit',
      postData: backendPayload,
      requireAuth: false,
      enableToast: false, // We'll handle our own success/error messages
      onSuccess: async (result) => {
        await Swal.fire({
          title: "🎉 Demo Booked Successfully!",
          html: `
            <div class="text-center space-y-3">
              <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                Your demo session has been scheduled!
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
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
        onClose();
      },
      onFail: async (error) => {
        console.error('Demo booking error:', error);
        
        // Enhanced error handling for different types of errors
        let errorMessage = "Please try again or contact support.";
        let errorTitle = "Booking Failed";
        
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
          errorTitle = "Connection Error";
          errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
        } else if (error.code === 'VALIDATION_ERROR') {
          errorTitle = "Validation Error";
          errorMessage = "Please check your form details and try again.";
        } else if (error.response?.status === 429) {
          errorTitle = "Too Many Requests";
          errorMessage = "Please wait a moment before trying again.";
        } else if (error.response?.status >= 500) {
          errorTitle = "Server Error";
          errorMessage = "Our servers are experiencing issues. Please try again in a few minutes.";
        } else if (error.message) {
        errorMessage = error.message;
      }
      
      await Swal.fire({
          title: errorTitle,
        text: errorMessage,
        icon: "error",
          confirmButtonText: "Retry",
          footer: '<p style="font-size: 12px; color: #666;">Need immediate help? Contact our support team</p>'
        });
        }
      });
  };

  // ========== NAVIGATION ==========

  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    setFormState(prev => ({ ...prev, step: 'preferences', validationErrors: {} }));
  }, [validateCurrentStep]);

  const goToPreviousStep = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'details', validationErrors: {} }));
  }, []);

  // ========== SELECT STYLES ==========

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
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
      fontWeight: '500',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
      ':hover': {
        backgroundColor: isDark ? '#6b7280' : '#c7d2fe',
        color: isDark ? '#ffffff' : '#1f2937',
      },
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

  // ========== RENDER ==========

    return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={formState.isSubmitting ? undefined : onClose} />
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden relative z-20 border border-gray-200 dark:border-gray-700">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{FORM_CONFIG.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{FORM_CONFIG.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <AutoSaveIndicator lastSaved={formState.lastSaved} isSaving={isAutoSaving} />
        <button
          onClick={onClose}
          disabled={formState.isSubmitting}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
        >
              <X size={20} />
        </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <ProgressIndicator currentStep={formState.step} />
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="p-4 space-y-4">
            {/* Details Step */}
            {formState.step === 'details' && (
              <div className="space-y-4">
                {/* Age Selection */}
                {formState.isStudentUnder16 === null && (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
              </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Let's personalize your demo experience
              </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Is the student under 16 years old? This helps us customize the registration process and demo content.
              </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => {
                  setFormState(prev => ({ 
                    ...prev, 
                    isStudentUnder16: true, 
                    validationErrors: {} 
                  }));
                          markAsDirty();
                }}
                        className={buildComponent.button("primary", "md") + " flex items-center gap-2 flex-1"}
              >
                        <Heart className="h-4 w-4" />
                Yes, Under 16
              </button>
              <button
                onClick={() => {
                  setFormState(prev => ({ 
                    ...prev, 
                    isStudentUnder16: false, 
                    validationErrors: {} 
                  }));
                          markAsDirty();
                }}
                        className={buildComponent.button("secondary", "md") + " flex items-center gap-2 flex-1"}
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
                  <div className="space-y-6">
                    {/* Parent Details Section */}
                    <div className={`${sectionClasses} bg-blue-50/50 dark:bg-blue-900/10`}>
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-4">
                        <User className="h-4 w-4" />
                        Parent/Guardian Information
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Full Name" required icon={User} error={formState.validationErrors.parentName}>
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.parentName, isDark)}
                            value={formState.parentDetails.full_name}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { ...prev.parentDetails, full_name: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter full name"
                  />
                </InputGroup>

                        <InputGroup label="Relationship" required>
                          <select
                            className={getInputClasses(false, isDark)}
                            value={formState.parentDetails.relationship}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { ...prev.parentDetails, relationship: e.target.value as any }
                              }));
                              markAsDirty();
                            }}
                          >
                            <option value="father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="guardian">Guardian</option>
                          </select>
                        </InputGroup>

                        <InputGroup label="Email Address" required icon={Mail} error={formState.validationErrors.parentEmail}>
                  <input
                    type="email"
                    className={getInputClasses(!!formState.validationErrors.parentEmail, isDark)}
                    value={formState.parentDetails.email}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { ...prev.parentDetails, email: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter email address"
                  />
                </InputGroup>

                        <InputGroup label="Phone Number" required icon={Phone} error={formState.validationErrors.parentMobile}>
                  <PhoneNumberInput
                    value={{ 
                      country: formState.parentDetails.country || 'in', 
                              number: formState.parentDetails.phone_number 
                    }}
                            onChange={(val) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { 
                                  ...prev.parentDetails, 
                                  phone_number: val.number,
                                  country: val.country
                                }
                              }));
                              markAsDirty();
                            }}
                    placeholder="Enter phone number"
                    error={formState.validationErrors.parentMobile}
                  />
                </InputGroup>

                        <InputGroup label="City" required icon={MapPin} error={formState.validationErrors.parentCity}>
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.parentCity, isDark)}
                    value={formState.parentDetails.city}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { ...prev.parentDetails, city: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter your city"
                  />
                </InputGroup>

                        <InputGroup label="Preferred Contact Time" icon={Clock}>
                          <Select
                            options={preferredTimingsOptions}
                            value={preferredTimingsOptions.find(option => option.value === formState.parentDetails.preferred_timings_to_connect)}
                            onChange={(selected) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                parentDetails: { ...prev.parentDetails, preferred_timings_to_connect: selected?.value as TPreferredTiming || "flexible" }
                              }));
                              markAsDirty();
                            }}
                            styles={selectStyles}
                            placeholder="Select preferred time"
                            isClearable={false}
                          />
                </InputGroup>
              </div>
            </div>

                    {/* Student Details Section */}
                    <div className={`${sectionClasses} bg-green-50/50 dark:bg-green-900/10`}>
                      <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2 mb-4">
                        <GraduationCap className="h-4 w-4" />
                        Student Information
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Student's Name" required icon={User} error={formState.validationErrors.studentName}>
                  <input
                    type="text"
                    className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                    value={formState.studentDetailsUnder16.name}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                studentDetailsUnder16: { ...prev.studentDetailsUnder16, name: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter student's name"
                  />
                </InputGroup>

                        <InputGroup label="Current Grade" required icon={GraduationCap}>
                  <Select
                    options={gradeOptions}
                    value={gradeOptions.find(option => option.value === formState.studentDetailsUnder16.grade)}
                            onChange={(selected) => {
                              setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { ...prev.studentDetailsUnder16, grade: selected?.value || "Grade 1-2" }
                              }));
                              markAsDirty();
                            }}
                    styles={selectStyles}
                            placeholder="Select grade"
                            formatOptionLabel={(option: any) => (
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                            )}
                  />
                </InputGroup>

                        <InputGroup label="City" required icon={MapPin} error={formState.validationErrors.studentCity}>
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                      value={formState.studentDetailsUnder16.city}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                studentDetailsUnder16: { ...prev.studentDetailsUnder16, city: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter student's city"
                    />
                  </InputGroup>

                        <InputGroup label="State" required icon={MapPin} error={formState.validationErrors.studentState}>
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentState, isDark)}
                            value={formState.studentDetailsUnder16.state || ""}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                studentDetailsUnder16: { ...prev.studentDetailsUnder16, state: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter state/region"
                          />
                        </InputGroup>

                        <InputGroup label="School Name (Optional)" icon={Building} className="md:col-span-2">
                          <input
                            type="text"
                            className={getInputClasses(false, isDark)}
                            value={formState.studentDetailsUnder16.school_name || ""}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                                ...prev, 
                                studentDetailsUnder16: { ...prev.studentDetailsUnder16, school_name: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="Enter school name"
                    />
                  </InputGroup>
                </div>

                      <InputGroup 
                        label="Course Categories of Interest" 
                        required 
                        error={formState.validationErrors.preferredCourse}
                        helpText="Select the subject areas that interest the student most"
                      >
                  <Select
                    options={courseOptions}
                    value={formState.studentDetailsUnder16.preferred_course
                      .map(title => courseOptions.find(option => option.label === title))
                            .filter(option => option !== undefined)}
                          onChange={(selected) => {
                            setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { 
                        ...prev.studentDetailsUnder16, 
                        preferred_course: selected ? selected.map((s: any) => s.label) : [] 
                      }
                            }));
                            markAsDirty();
                          }}
                    styles={selectStyles}
                          placeholder={formState.isLoadingCourses ? "Loading courses..." : "Select course categories"}
                    isMulti
                          isDisabled={formState.isLoadingCourses}
                    isSearchable
                          formatOptionLabel={(option: any) => (
                            <div>
                              <div className="font-medium">{option.label}</div>
                              {option.description && <div className="text-xs text-gray-500">{option.description}</div>}
                            </div>
                          )}
                  />
                </InputGroup>

                      <InputGroup label="How did you hear about MEDH?" required>
                  <Select
                    options={knowMedhFromOptions}
                    value={knowMedhFromOptions.find(option => option.value === formState.studentDetailsUnder16.know_medh_from)}
                          onChange={(selected) => {
                            setFormState(prev => ({ 
                      ...prev, 
                      studentDetailsUnder16: { ...prev.studentDetailsUnder16, know_medh_from: selected?.value || "social_media" }
                            }));
                            markAsDirty();
                          }}
                    styles={selectStyles}
                          placeholder="Select source"
                  />
                </InputGroup>
            </div>
          </div>
        )}

                {/* 16+ Student Form */}
                {formState.isStudentUnder16 === false && (
                  <div className={`${sectionClasses} bg-indigo-50/50 dark:bg-indigo-900/10`}>
                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 mb-4">
                      <User className="h-4 w-4" />
                  Student Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup label="Full Name" required icon={User} error={formState.validationErrors.studentName}>
                    <input
                      type="text"
                      className={getInputClasses(!!formState.validationErrors.studentName, isDark)}
                      value={formState.studentDetails16AndAbove.name}
                          onChange={(e) => {
                            setFormState(prev => ({ 
                              ...prev, 
                              studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, name: e.target.value }
                            }));
                            markAsDirty();
                          }}
                      placeholder="Enter your full name"
                    />
                  </InputGroup>

                      <InputGroup label="Email Address" required icon={Mail} error={formState.validationErrors.studentEmail}>
                    <input
                      type="email"
                      className={getInputClasses(!!formState.validationErrors.studentEmail, isDark)}
                      value={formState.studentDetails16AndAbove.email}
                          onChange={(e) => {
                            setFormState(prev => ({ 
                              ...prev, 
                              studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, email: e.target.value }
                            }));
                            markAsDirty();
                          }}
                          placeholder="Enter your email"
                    />
                  </InputGroup>

                      <InputGroup label="Phone Number" required icon={Phone} error={formState.validationErrors.studentMobile}>
                    <PhoneNumberInput
                      value={{ 
                        country: formState.studentDetails16AndAbove.country || 'in', 
                        number: formState.studentDetails16AndAbove.mobile_no 
                      }}
                          onChange={(val) => {
                            setFormState(prev => ({ 
                              ...prev, 
                              studentDetails16AndAbove: { 
                                ...prev.studentDetails16AndAbove, 
                                mobile_no: val.number,
                                country: val.country
                              }
                            }));
                            markAsDirty();
                          }}
                          placeholder="Enter your phone"
                      error={formState.validationErrors.studentMobile}
                    />
                  </InputGroup>

                      <InputGroup label="City" required icon={MapPin} error={formState.validationErrors.studentCity}>
                        <input
                          type="text"
                          className={getInputClasses(!!formState.validationErrors.studentCity, isDark)}
                          value={formState.studentDetails16AndAbove.city}
                          onChange={(e) => {
                            setFormState(prev => ({ 
                              ...prev, 
                              studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, city: e.target.value }
                            }));
                            markAsDirty();
                          }}
                          placeholder="Enter your city"
                        />
                      </InputGroup>

                      <InputGroup label="Highest Qualification" required icon={GraduationCap}>
                    <Select
                      options={qualificationOptions}
                      value={qualificationOptions.find(option => option.value === formState.studentDetails16AndAbove.highest_qualification)}
                          onChange={(selected) => {
                            setFormState(prev => ({ 
                        ...prev, 
                        studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, highest_qualification: selected?.value || "10th passed" }
                            }));
                            markAsDirty();
                          }}
                      styles={selectStyles}
                          placeholder="Select qualification"
                    />
                  </InputGroup>

                      <InputGroup label="Current Status">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                    <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.studentDetails16AndAbove.currently_studying}
                              onChange={(e) => {
                                setFormState(prev => ({ 
                            ...prev, 
                                  studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_studying: e.target.checked }
                                }));
                                markAsDirty();
                              }}
                        />
                            <span className="text-gray-700 dark:text-gray-300">Currently Studying</span>
                      </label>
                          <label className="flex items-center gap-2 text-sm">
                        <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded"
                              checked={formState.studentDetails16AndAbove.currently_working}
                              onChange={(e) => {
                                setFormState(prev => ({ 
                            ...prev, 
                                  studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, currently_working: e.target.checked }
                                }));
                                markAsDirty();
                              }}
                        />
                            <span className="text-gray-700 dark:text-gray-300">Currently Working</span>
                      </label>
                    </div>
                      </InputGroup>

                      {formState.studentDetails16AndAbove.currently_studying && (
                        <InputGroup label="Educational Institution" icon={Building} className="md:col-span-2">
                        <input
                            type="text"
                            className={getInputClasses(false, isDark)}
                            value={formState.studentDetails16AndAbove.education_institute_name || ""}
                            onChange={(e) => {
                              setFormState(prev => ({ 
                            ...prev, 
                                studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, education_institute_name: e.target.value }
                              }));
                              markAsDirty();
                            }}
                            placeholder="e.g., Delhi University, IIT Delhi"
                    />
                  </InputGroup>
                      )}
                </div>

                    <InputGroup 
                      label="Course Categories of Interest" 
                      required 
                      error={formState.validationErrors.preferredCourse}
                      helpText="Select the subject areas that interest you most"
                    >
                  <Select
                    options={courseOptions}
                    value={formState.studentDetails16AndAbove.preferred_course
                        .map(title => courseOptions.find(option => option.label === title))
                          .filter(option => option !== undefined)}
                        onChange={(selected) => {
                          setFormState(prev => ({ 
                      ...prev, 
                      studentDetails16AndAbove: { 
                        ...prev.studentDetails16AndAbove, 
                        preferred_course: selected ? selected.map((s: any) => s.label) : [] 
                      }
                          }));
                          markAsDirty();
                        }}
                    styles={selectStyles}
                        placeholder={formState.isLoadingCourses ? "Loading courses..." : "Select course categories"}
                    isMulti
                        isDisabled={formState.isLoadingCourses}
                    isSearchable
                        formatOptionLabel={(option: any) => (
                          <div>
                            <div className="font-medium">{option.label}</div>
                            {option.description && <div className="text-xs text-gray-500">{option.description}</div>}
                          </div>
                        )}
                  />
                </InputGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup label="How did you hear about MEDH?" required>
                  <Select
                    options={knowMedhFromOptions}
                    value={knowMedhFromOptions.find(option => option.value === formState.studentDetails16AndAbove.know_medh_from)}
                          onChange={(selected) => {
                            setFormState(prev => ({ 
                      ...prev, 
                      studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, know_medh_from: selected?.value || "social_media" }
                            }));
                            markAsDirty();
                          }}
                    styles={selectStyles}
                          placeholder="Select source"
                        />
                      </InputGroup>

                      <InputGroup label="Preferred Contact Time" icon={Clock}>
                        <Select
                          options={preferredTimingsOptions}
                          value={preferredTimingsOptions.find(option => option.value === formState.studentDetails16AndAbove.preferred_timings_to_connect)}
                          onChange={(selected) => {
                            setFormState(prev => ({ 
                              ...prev, 
                              studentDetails16AndAbove: { ...prev.studentDetails16AndAbove, preferred_timings_to_connect: selected?.value as TPreferredTiming || "flexible" }
                            }));
                            markAsDirty();
                          }}
                          styles={selectStyles}
                          placeholder="Select preferred time"
                          isClearable={false}
                  />
                </InputGroup>
              </div>
            </div>
                )}

                {/* Next Button */}
                {formState.isStudentUnder16 !== null && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className={buildComponent.button("primary", "md") + " flex items-center gap-2"}
                    >
                      Next: Session Preferences <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                )}
              </div>
            )}

            {/* Preferences Step */}
            {formState.step === 'preferences' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enhanced Demo Session Preferences */}
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Demo Session Preferences
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Help us schedule the perfect demo session tailored for you
                    </p>
              </div>

                  {/* Calendar Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Preferred Date
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Select when you'd like to attend the demo (optional)
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                                 <CustomCalendar
                    selected={formState.demoSessionDetails.preferred_date}
                           onSelect={(date: Date | undefined) => {
                             setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_date: date || undefined }
                             }));
                             markAsDirty();
                           }}
                           isDark={isDark}
                         />
                      </div>
                    </div>
                    
                    {formState.demoSessionDetails.preferred_date && (
                      <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-800 dark:text-blue-200">
                              Selected Date
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {formState.demoSessionDetails.preferred_date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Session Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Time Slot */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">Time Slot</h6>
                          <p className="text-xs text-gray-500">Based on selected date</p>
                        </div>
                      </div>
                  <Select
                        options={staticTimeSlots.map(slot => ({
                          value: slot.value,
                          label: slot.label,
                          isDisabled: false // All static slots are available
                        }))}
                        value={staticTimeSlots.find(slot => slot.value === formState.demoSessionDetails.preferred_time_slot) 
                          ? { value: formState.demoSessionDetails.preferred_time_slot, label: formState.demoSessionDetails.preferred_time_slot }
                          : null}
                        onChange={(selected) => {
                          setFormState(prev => ({ 
                      ...prev, 
                      demoSessionDetails: { ...prev.demoSessionDetails, preferred_time_slot: selected?.value || "" }
                          }));
                          markAsDirty();
                        }}
                    styles={selectStyles}
                        placeholder="🕐 Choose time"
                    isClearable
                        isLoading={false}
                        noOptionsMessage={() => "Select your preferred time"}
                  />
              </div>

                    {/* Duration */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">Duration</h6>
                          <p className="text-xs text-gray-500">Session length</p>
                        </div>
                      </div>
                      <Select
                        options={sessionDurationOptions}
                        value={sessionDurationOptions.find(option => option.value === formState.demoSessionDetails.session_duration_preference)}
                        onChange={(selected) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            demoSessionDetails: { ...prev.demoSessionDetails, session_duration_preference: selected?.value as any || "45min" }
                          }));
                          markAsDirty();
                        }}
                        styles={selectStyles}
                        placeholder="⏱️ Select duration"
                        isClearable={false}
                      />
                    </div>
                  </div>

                  {/* Device & Connection Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Device Preference */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                          <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">Device</h6>
                          <p className="text-xs text-gray-500">Your preferred device</p>
                        </div>
                      </div>
                      <Select
                                                options={[
                           { value: 'computer', label: '💻 Desktop/Laptop' },
                           { value: 'tablet', label: '📱 Tablet' },
                           { value: 'mobile', label: '📱 Mobile' }
                         ]}
                        value={devicePreferenceOptions.find(option => option.value === formState.demoSessionDetails.device_preference)}
                        onChange={(selected) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            demoSessionDetails: { ...prev.demoSessionDetails, device_preference: selected?.value as any || "computer" }
                          }));
                          markAsDirty();
                        }}
                        styles={selectStyles}
                        placeholder="📱 Select device"
                        isClearable={false}
                      />
                    </div>

                    {/* Internet Quality */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">Connection</h6>
                          <p className="text-xs text-gray-500">Internet quality</p>
                        </div>
                      </div>
                      <select
                        className={getInputClasses(false, isDark)}
                        value={formState.demoSessionDetails.internet_quality || "good"}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            demoSessionDetails: { ...prev.demoSessionDetails, internet_quality: e.target.value as any }
                          }));
                          markAsDirty();
                        }}
                      >
                        <option value="excellent">🚀 Excellent (Fiber)</option>
                        <option value="good">✅ Good (Broadband)</option>
                        <option value="average">⚠️ Average (Mobile)</option>
                        <option value="poor">❌ Poor (Limited)</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg">
                          <Languages className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 dark:text-white">Language</h6>
                          <p className="text-xs text-gray-500">Demo language</p>
                        </div>
                      </div>
                      <select
                        className={getInputClasses(false, isDark)}
                        value={formState.demoSessionDetails.language_preference || "english"}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            demoSessionDetails: { ...prev.demoSessionDetails, language_preference: e.target.value as any }
                          }));
                          markAsDirty();
                        }}
                      >
                        <option value="english">🇺🇸 English</option>
                        <option value="hindi">🇮🇳 Hindi</option>
                        <option value="regional">🌏 Regional</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                        <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Special Requirements or Focus Areas
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let us know what you'd like to focus on during the demo
                        </p>
                      </div>
                    </div>
                <textarea
                      className={`${getInputClasses(false, isDark)} h-24 resize-none`}
                  value={formState.demoSessionDetails.special_requirements || ""}
                      onChange={(e) => {
                        setFormState(prev => ({ 
                    ...prev, 
                    demoSessionDetails: { ...prev.demoSessionDetails, special_requirements: e.target.value }
                        }));
                        markAsDirty();
                      }}
                      placeholder="✨ e.g., Focus on AI concepts, beginner-friendly explanation, project-based learning, specific technologies..."
                    />
            </div>

                  {/* Previous Demo Checkbox */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                        checked={formState.demoSessionDetails.previous_demo_attended || false}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            demoSessionDetails: { ...prev.demoSessionDetails, previous_demo_attended: e.target.checked }
                          }));
                          markAsDirty();
                        }}
                      />
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            I have attended a MEDH demo session before
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            This helps us tailor the session to your experience level
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Enhanced Consent Section */}
                <div className={`${sectionClasses} bg-gray-50/50 dark:bg-gray-800/50`}>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Consent & Legal Agreements
                  </h4>
              
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                    checked={formState.consent.terms_accepted && formState.consent.privacy_policy_accepted}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                      ...prev, 
                      consent: { 
                        ...prev.consent, 
                        terms_accepted: e.target.checked,
                        privacy_policy_accepted: e.target.checked 
                      }
                          }));
                          markAsDirty();
                        }}
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      I agree to the{" "}
                          <Link href="/terms-and-services" target="_blank" className="text-primary-500 hover:underline">
                            Terms of Service
                      </Link>
                      {" "}and{" "}
                          <Link href="/privacy-policy" target="_blank" className="text-primary-500 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                        checked={formState.consent.data_processing_consent}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                      ...prev, 
                            consent: { ...prev.consent, data_processing_consent: e.target.checked }
                          }));
                          markAsDirty();
                        }}
                  />
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          I consent to processing of my personal data for demo session purposes
                  </span>
                        <span className="text-red-500 ml-1">*</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Required to schedule and conduct your demo session
                        </div>
                      </div>
                </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                        checked={formState.consent.communication_consent}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            consent: { ...prev.consent, communication_consent: e.target.checked }
                          }));
                          markAsDirty();
                        }}
                      />
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          I consent to receive communication via email/SMS about my demo session
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Session reminders, meeting links, and follow-up communications
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                    checked={formState.consent.marketing_consent}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                      ...prev, 
                      consent: { ...prev.consent, marketing_consent: e.target.checked }
                          }));
                          markAsDirty();
                        }}
                  />
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Send me updates about courses, events, and educational content
                  </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Optional: Course recommendations, newsletters, and special offers
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
                        checked={formState.consent.gdpr_consent}
                        onChange={(e) => {
                          setFormState(prev => ({ 
                            ...prev, 
                            consent: { ...prev.consent, gdpr_consent: e.target.checked }
                          }));
                          markAsDirty();
                        }}
                      />
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          I acknowledge GDPR data protection rights and processing
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Right to access, rectify, erase, and port your personal data
                        </div>
                      </div>
                </label>
              </div>

                  <div className="mt-4">
                    <ErrorMessage error={formState.validationErrors.terms || formState.validationErrors.privacy || formState.validationErrors.dataProcessing} />
                  </div>
            </div>

            {/* Navigation and Submit */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={formState.isSubmitting}
                    className={buildComponent.button("secondary", "md") + " flex items-center gap-2"}
              >
                    <ChevronLeft className="h-4 w-4" /> Back to Details
              </button>
              <button
                type="submit"
                    disabled={formState.isSubmitting || (!formState.consent.terms_accepted || !formState.consent.privacy_policy_accepted || !formState.consent.data_processing_consent)}
                    className={buildComponent.button("primary", "md") + " flex items-center gap-2 min-w-[180px]"}
              >
                {formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> 
                        Booking Demo...
                      </>
                ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Book My Demo Session
                      </>
                )}
              </button>
            </div>

                {/* Form Footer Info */}
                <div className="text-center pt-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>🔒 Your information is secure and will only be used for demo session purposes</p>
                    <p>📧 You'll receive a confirmation email with meeting details within 24 hours</p>
                    <p>💬 Need help? Contact our support team anytime</p>
                  </div>
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