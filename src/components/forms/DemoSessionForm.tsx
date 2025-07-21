"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { X, Calendar, Clock, BookOpen, Users, Star, TrendingUp, ChevronDown, CheckCircle, Radio, Loader2, MapPin, AlertCircle } from "lucide-react";
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
  getLiveCourses,
  submitBookFreeDemoSessionForm,
  TStudentGrade,
  THighestQualification,
  TKnowMedhFrom,
} from "@/apis/demo.api";
import { buildComponent, buildAdvancedComponent, getResponsive, getEnhancedSemanticColor } from "@/utils/designSystem";
import Swal from "sweetalert2";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../shared/login/PhoneNumberInput';
import Link from "next/link";

// Helper for form field styles
const inputClasses = "w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 shadow-sm";
const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
const errorClasses = "text-red-500 text-xs mt-1";
const radioGroupClasses = "flex flex-col sm:flex-row gap-4";
const radioLabelClasses = "flex items-center text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer";

// Grade options
const gradeOptions: { value: TStudentGrade; label: string }[] = [
  { value: "Grade 1-2", label: "Grade 1-2" },
  { value: "Grade 3-4", label: "Grade 3-4" },
  { value: "Grade 5-6", label: "Grade 5-6" },
  { value: "Grade 7-8", label: "Grade 7-8" },
  { value: "Grade 9-10", label: "Grade 9-10" },
  { value: "Grade 11-12", label: "Grade 11-12" },
  { value: "Home Study", label: "Home Study" },
];

// Highest Qualification options
const qualificationOptions: { value: THighestQualification; label: string }[] = [
  { value: "10th passed", label: "10th passed" },
  { value: "12th passed", label: "12th passed" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Graduate", label: "Graduate" },
  { value: "Post-Graduate", label: "Post-Graduate" },
];

// How did you hear about Medh options
const knowMedhFromOptions: { value: TKnowMedhFrom; label: string }[] = [
  { value: "social_media", label: "Social Media" },
  { value: "friend", label: "Friend" },
  { value: "online_ad", label: "Online Ad" },
  { value: "school_event", label: "School Event" },
  { value: "other", label: "Other" },
];

// Hardcoded time slots for now, will be dynamic later
const timeSlotOptions = [
  { value: "09:00 AM - 10:00 AM", label: "09:00 AM - 10:00 AM" },
  { value: "10:00 AM - 11:00 AM", label: "10:00 AM - 11:00 AM" },
  { value: "11:00 AM - 12:00 PM", label: "11:00 AM - 12:00 PM" },
  { value: "02:00 PM - 03:00 PM", label: "02:00 PM - 03:00 PM" },
  { value: "04:00 PM - 05:00 PM", label: "04:00 PM - 05:00 PM" },
  { value: "06:00 PM - 07:00 PM", label: "06:00 PM - 07:00 PM" },
];

// Preferred timings options
const preferredTimingsOptions = [
  { value: "morning(8am - 12pm)", label: "Morning (8am - 12pm)" },
  { value: "afternoon(12pm - 5pm)", label: "Afternoon (12pm - 5pm)" },
  { value: "evening(5pm - 10pm)", label: "Evening (5pm - 10pm)" },
];

interface DemoSessionFormProps {
  onClose: () => void;
}

const DemoSessionForm: React.FC<DemoSessionFormProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State for form steps and data
  const [step, setStep] = useState(1); // 1: Age question, 2: Parent details (under 16), 3: Student details (under 16), 4: Demo & consent, 5: Form (16+)
  const [isStudentUnder16, setIsStudentUnder16] = useState<boolean | null>(null);
  const [parentDetails, setParentDetails] = useState<IParentDetails>({ name: "", email: "", mobile_no: "", city: "", preferred_timings_to_connect: "" });
  const [studentDetailsUnder16, setStudentDetailsUnder16] = useState<IStudentDetailsUnder16>({ name: "", grade: "Grade 1-2", city: "", state: "", preferred_course: [], know_medh_from: "social_media", email: "", school_name: "" });
  const [studentDetails16AndAbove, setStudentDetails16AndAbove] = useState<IStudentDetails16AndAbove>({ name: "", email: "", mobile_no: "", city: "", preferred_timings_to_connect: "", highest_qualification: "10th passed", currently_studying: false, currently_working: false, preferred_course: [], know_medh_from: "social_media", education_institute_name: "" });
  const [demoSessionDetails, setDemoSessionDetails] = useState<IDemoSessionDetails>({ preferred_date: undefined, preferred_time_slot: "" });
  const [consent, setConsent] = useState<IConsent>({ terms_accepted: false, privacy_policy_accepted: false, gdpr_consent: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [liveCourses, setLiveCourses] = useState<ILiveCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for direct intl-tel-input
  const parentPhoneInputRef = useRef<HTMLInputElement>(null);
  const studentPhoneInputRef = useRef<HTMLInputElement>(null);
  const parentItiRef = useRef<any>(null);
  const studentItiRef = useRef<any>(null);

  // State for selected countries
  const [parentSelectedCountry, setParentSelectedCountry] = useState("in");
  const [studentSelectedCountry, setStudentSelectedCountry] = useState("in");

  // Remove the old countryOptions array as we'll use countriesData from utils

  useEffect(() => {
    // Initialize parent phone input
    if (parentPhoneInputRef.current && !parentItiRef.current) {
      parentItiRef.current = intlTelInput(parentPhoneInputRef.current, {
        initialCountry: parentSelectedCountry,
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js",
        autoPlaceholder: "polite",
        formatOnDisplay: true,
        nationalMode: true,
        dropdownContainer: document.body
      });
    }

    // Initialize student phone input
    if (studentPhoneInputRef.current && !studentItiRef.current) {
      studentItiRef.current = intlTelInput(studentPhoneInputRef.current, {
        initialCountry: studentSelectedCountry,
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js",
        autoPlaceholder: "polite",
        formatOnDisplay: true,
        nationalMode: true,
        dropdownContainer: document.body
      });
    }

    // Cleanup on unmount
    return () => {
      if (parentItiRef.current) {
        parentItiRef.current.destroy();
        parentItiRef.current = null;
      }
      if (studentItiRef.current) {
        studentItiRef.current.destroy();
        studentItiRef.current = null;
      }
    };
  }, [step]);

  // Update intl-tel-input country when country selection changes
  useEffect(() => {
    if (parentItiRef.current) {
      parentItiRef.current.setCountry(parentSelectedCountry);
    }
  }, [parentSelectedCountry]);

  useEffect(() => {
    if (studentItiRef.current) {
      studentItiRef.current.setCountry(studentSelectedCountry);
    }
  }, [studentSelectedCountry]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      const response = await getLiveCourses();
      if (response.success && response.data) {
        setLiveCourses(response.data);
      } else {
        Swal.fire("Error", response.message || "Failed to load courses.", "error");
      }
      setIsLoadingCourses(false);
    };
    fetchCourses();
  }, []);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (isStudentUnder16 === null) {
      errors.isStudentUnder16 = "Please answer if the student is less than 16 years old.";
    }

    if (isStudentUnder16) {
      // Under 16 form validation
      if (!parentDetails.name.trim()) errors.parentName = "Parent's Name is required.";
      if (!parentDetails.email.trim()) {
        errors.parentEmail = "Parent's Email ID is required.";
      } else if (!/\S+@\S+\.\S+/.test(parentDetails.email)) {
        errors.parentEmail = "Invalid email format.";
      }
      if (!parentDetails.mobile_no || !parentItiRef.current?.isValidNumber()) errors.parentMobileNo = "Parent's Mobile No is required and valid.";
      if (!parentDetails.city?.trim()) errors.parentCity = "Parent's Current City is required.";

      if (!studentDetailsUnder16.name.trim()) errors.studentName = "Student's Name is required.";
      if (!studentDetailsUnder16.grade) errors.studentGrade = "Student's Grade is required.";
      if (!studentDetailsUnder16.city?.trim()) errors.studentCity = "Student's Current City is required.";
      if (!studentDetailsUnder16.state?.trim()) errors.studentState = "Student's State is required.";
      if (studentDetailsUnder16.preferred_course.length === 0) errors.studentPreferredCourse = "Preferred Course is required.";
      if (!studentDetailsUnder16.know_medh_from) errors.knowMedhFrom = "Please let us know how you heard about Medh.";
    } else if (isStudentUnder16 === false) {
      // 16 and above form validation
      if (!studentDetails16AndAbove.name.trim()) errors.studentName = "Student's Name is required.";
      if (!studentDetails16AndAbove.email.trim()) {
        errors.studentEmail = "Student's Email ID is required.";
      } else if (!/\S+@\S+\.\S+/.test(studentDetails16AndAbove.email)) {
        errors.studentEmail = "Invalid email format.";
      }
      if (!studentDetails16AndAbove.mobile_no || !studentItiRef.current?.isValidNumber()) errors.studentMobileNo = "Student's Mobile No is required and valid.";
      if (!studentDetails16AndAbove.city?.trim()) errors.studentCity = "Student's Current City is required.";
      if (studentDetails16AndAbove.preferred_course.length === 0) errors.studentPreferredCourse = "Preferred Course is required.";
      if (!studentDetails16AndAbove.highest_qualification) errors.highestQualification = "Highest Qualification is required.";
      if (studentDetails16AndAbove.currently_studying === null) errors.currentlyStudying = "Please select if you are currently studying.";
      if (studentDetails16AndAbove.currently_working === null) errors.currentlyWorking = "Please select if you are currently working.";
      if (!studentDetails16AndAbove.know_medh_from) errors.knowMedhFrom = "Please let us know how you heard about Medh.";
    }

    if (!consent.terms_accepted) errors.termsAccepted = "You must agree to the Terms of Use.";
    if (!consent.privacy_policy_accepted) errors.privacyPolicyAccepted = "You must agree to the Privacy Policy.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [isStudentUnder16, parentDetails, studentDetailsUnder16, studentDetails16AndAbove, consent, parentItiRef, studentItiRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire("Validation Error", "Please fill in all required fields correctly.", "error");
      return;
    }

    setIsSubmitting(true);
    const submissionTimestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;

    let payload: IBookFreeDemoSessionPayload;

    if (isStudentUnder16) {
      payload = {
        form_type: "book_a_free_demo_session",
        is_student_under_16: true,
        parent_details: {
          ...parentDetails,
          mobile_no: parentItiRef.current?.getNumber() || parentDetails.mobile_no, // Use intl-tel-input formatted number
        },
        student_details: studentDetailsUnder16,
        demo_session_details: demoSessionDetails,
        consent: consent,
        submission_metadata: {
          user_agent: userAgent,
          timestamp: submissionTimestamp,
          form_version: "1.0",
          validation_passed: true,
        },
      };
    } else {
      payload = {
        form_type: "book_a_free_demo_session",
        is_student_under_16: false,
        student_details: {
          ...studentDetails16AndAbove,
          mobile_no: studentItiRef.current?.getNumber() || studentDetails16AndAbove.mobile_no, // Use intl-tel-input formatted number
        },
        demo_session_details: demoSessionDetails,
        consent: consent,
        submission_metadata: {
          user_agent: userAgent,
          timestamp: submissionTimestamp,
          form_version: "1.0",
          validation_passed: true,
        },
      };
    }

    try {
      const response = await submitBookFreeDemoSessionForm(payload);
      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Your demo session request has been submitted. We will contact you shortly!",
          icon: "success",
          confirmButtonText: "Ok",
          customClass: {
            popup: isDark ? 'dark-mode-swal' : '',
            confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
          }
        }).then(() => {
          onClose(); // Close the modal on success
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "Failed to submit demo session request.",
          icon: "error",
          confirmButtonText: "Ok",
          customClass: {
            popup: isDark ? 'dark-mode-swal' : '',
            confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
          }
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: isDark ? 'dark-mode-swal' : '',
          confirmButton: isDark ? 'dark-mode-swal-confirm-button' : '',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for react-select
  const selectStyles = useMemo(() => ({
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#d1d5db',
      color: isDark ? '#ffffff' : '#1f2937',
      borderRadius: '0.75rem', // rounded-xl
      padding: '0.25rem', // py-1
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.5)' : 'none', // focus:ring-2 focus:ring-primary-500
      '&:hover': {
        borderColor: isDark ? '#4b5563' : '#9ca3af',
      },
      transition: 'all 0.2s ease-in-out',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#4a5568' : '#e0e7ff',
      color: isDark ? '#ffffff' : '#1f2937',
      borderRadius: '0.5rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDark ? '#ffffff' : '#1f2937',
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
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999, // Ensure it's above other elements
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? (isDark ? '#4a5568' : '#d1d5db')
        : state.isFocused
          ? (isDark ? '#374151' : '#e5e7eb')
          : (isDark ? '#1f2937' : '#ffffff'),
      color: isDark ? '#ffffff' : '#1f2937',
      '&:active': {
        backgroundColor: isDark ? '#4a5568' : '#d1d5db',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDark ? '#9ca3af' : '#6b7280',
    }),
  }), [isDark]);

  // Datepicker styles
  const datepickerCustomInput = useMemo(() => buildComponent.button(
    isDark ? "secondary" : "light",
    "lg"
  ) + " w-full flex items-center justify-between text-left", [isDark]);

  // Custom select component for consistency
  const CustomSelect = ({ options, value, onChange, placeholder, isMulti = false, isDisabled = false }: any) => {
    const selectedValue = isMulti
      ? options.filter((option: any) => value.includes(option.value))
      : options.find((option: any) => option.value === value);

    return (
        <Select
        options={options}
        value={selectedValue}
        onChange={isMulti ? (selected: any) => onChange(selected ? selected.map((s: any) => s.value) : []) : (selected: any) => onChange(selected ? selected.value : null)}
        isMulti={isMulti}
        isDisabled={isDisabled}
        styles={selectStyles}
        placeholder={placeholder}
          classNamePrefix="react-select"
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: (props: any) => (
            <ChevronDown size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
          ),
          ClearIndicator: (props: any) => (
            <X size={16} className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} onClick={props.innerProps.onClick} />
          )
        }}
      />
    );
  };

  const renderFormContent = () => {
      return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full p-6 sm:p-8 md:p-10 relative z-20 mx-4 my-8 max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 ease-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-30"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Book Your Free Demo Session
          </h2>
        
        {/* Age Question Step */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 text-center font-semibold">
            Is the student less than 16 years old?
          </p>
            <div className="flex gap-6 sm:gap-8">
            <button
                onClick={() => { setIsStudentUnder16(true); setStep(2); }}
                className={buildComponent.button("primary", "lg")}
              >
                Yes, Under 16
            </button>
            <button
                onClick={() => { setIsStudentUnder16(false); setStep(5); }}
                className={buildComponent.button("secondary", "lg")}
              >
                No, 16 and Above
            </button>
          </div>
            {formErrors.isStudentUnder16 && <p className={errorClasses}>{formErrors.isStudentUnder16}</p>}
        </div>
        )}

        {/* Parent Details Step (Under 16) */}
        {step === 2 && isStudentUnder16 && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Parent Details</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Student Details</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Session & Consent</span>
                </div>
              </div>
            </div>

              <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Parent/Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label htmlFor="parentName" className={labelClasses}>Parent's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="parentName"
                  className={inputClasses}
                  value={parentDetails.name}
                  onChange={(e) => setParentDetails({ ...parentDetails, name: e.target.value })}
                      placeholder="Enter parent's full name"
                />
                {formErrors.parentName && <p className={errorClasses}>{formErrors.parentName}</p>}
              </div>
              <div>
                    <label htmlFor="parentEmail" className={labelClasses}>Parent's Email ID <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="parentEmail"
                  className={inputClasses}
                  value={parentDetails.email}
                  onChange={(e) => setParentDetails({ ...parentDetails, email: e.target.value })}
                      placeholder="Enter parent's email address"
                />
                {formErrors.parentEmail && <p className={errorClasses}>{formErrors.parentEmail}</p>}
              </div>
            </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 ${formErrors.parentCountry ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <select
                    className={`
                      block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-sm text-base font-medium
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200
                      ${formErrors.parentCountry
                        ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 dark:border-gray-700'
                      }
                    `}
                    value={parentSelectedCountry}
                    onChange={(e) => {
                      const selectedCountry = e.target.value;
                      setParentSelectedCountry(selectedCountry);
                      
                      // Find the country data to get the dial code
                      const countryData = countriesData.find((country: any) => country.code === selectedCountry);
                      
                      if (countryData && countryData.dial_code) {
                        // Update phone number with new country code
                        setParentDetails({ ...parentDetails, mobile_no: countryData.dial_code });
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
                {formErrors.parentCountry && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{formErrors.parentCountry}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneNumberInput
                  value={{ 
                    country: parentSelectedCountry, 
                    number: parentDetails.mobile_no 
                  }}
                  onChange={val => {
                    setParentDetails({ ...parentDetails, mobile_no: val.number });
                    // Also update the country field if it changed in the phone input
                    if (val.country !== parentSelectedCountry) {
                      setParentSelectedCountry(val.country);
                    }
                  }}
                  placeholder="Enter phone number"
                  error={formErrors.parentMobileNo}
                />
              </div>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label htmlFor="parentCity" className={labelClasses}>Parent's Current City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="parentCity"
                  className={inputClasses}
                  value={parentDetails.city}
                  onChange={(e) => setParentDetails({ ...parentDetails, city: e.target.value })}
                      placeholder="e.g., New Delhi"
                />
                {formErrors.parentCity && <p className={errorClasses}>{formErrors.parentCity}</p>}
            </div>
            <div>
                    <label htmlFor="parentPreferredTimings" className={labelClasses}>Preferred Timings to Connect</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className={`h-5 w-5 ${formErrors.parentPreferredTimings ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <select
                        id="parentPreferredTimings"
                        className={inputClasses + " pl-12"}
                        value={parentDetails.preferred_timings_to_connect || ""}
                        onChange={(e) => setParentDetails({ ...parentDetails, preferred_timings_to_connect: e.target.value })}
                      >
                        <option value="">Select preferred timing</option>
                        {preferredTimingsOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
              </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={buildComponent.button("secondary", "lg")}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={buildComponent.button("primary", "lg")}
              >
                Next: Student Details
              </button>
          </div>
              </div>
            )}

        {/* Student Details Step (Under 16) */}
        {step === 3 && isStudentUnder16 && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Parent Details</span>
                </div>
                <div className="w-12 h-1 bg-primary-500"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Student Details</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Session & Consent</span>
                </div>
              </div>
            </div>

            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Student Details</h3>
                <div className="space-y-4">
              <div>
                    <label htmlFor="studentName" className={labelClasses}>Student's Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="studentName"
                      className={inputClasses}
                      value={studentDetailsUnder16.name}
                      onChange={(e) => setStudentDetailsUnder16({ ...studentDetailsUnder16, name: e.target.value })}
                      placeholder="Enter student's full name"
                    />
                    {formErrors.studentName && <p className={errorClasses}>{formErrors.studentName}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                      <label htmlFor="studentEmail" className={labelClasses}>Student's Email ID (Optional)</label>
                <input
                  type="email"
                        id="studentEmail"
                  className={inputClasses}
                        value={studentDetailsUnder16.email || ""}
                  onChange={(e) => setStudentDetailsUnder16({ ...studentDetailsUnder16, email: e.target.value })}
                        placeholder="Enter student's email address"
                />
              </div>
              <div>
                <label htmlFor="schoolName" className={labelClasses}>School Name (Optional)</label>
                <input
                  type="text"
                  id="schoolName"
                  className={inputClasses}
                        value={studentDetailsUnder16.school_name || ""}
                  onChange={(e) => setStudentDetailsUnder16({ ...studentDetailsUnder16, school_name: e.target.value })}
                        placeholder="Enter student's school name"
                />
              </div>
            </div>
            <div>
                    <label htmlFor="grade" className={labelClasses}>Student's Grade <span className="text-red-500">*</span></label>
                    <CustomSelect
                      options={gradeOptions}
                      value={studentDetailsUnder16.grade}
                      onChange={(value: TStudentGrade) => setStudentDetailsUnder16({ ...studentDetailsUnder16, grade: value })}
                      placeholder="Select student's grade"
                    />
                    {formErrors.studentGrade && <p className={errorClasses}>{formErrors.studentGrade}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="studentCity" className={labelClasses}>Student's Current City <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="studentCity"
                        className={inputClasses}
                        value={studentDetailsUnder16.city}
                        onChange={(e) => setStudentDetailsUnder16({ ...studentDetailsUnder16, city: e.target.value })}
                        placeholder="e.g., New Delhi"
                      />
                      {formErrors.studentCity && <p className={errorClasses}>{formErrors.studentCity}</p>}
                    </div>
                    <div>
                      <label htmlFor="studentState" className={labelClasses}>Student's State <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="studentState"
                className={inputClasses}
                value={studentDetailsUnder16.state}
                onChange={(e) => setStudentDetailsUnder16({ ...studentDetailsUnder16, state: e.target.value })}
                        placeholder="e.g., Delhi"
              />
              {formErrors.studentState && <p className={errorClasses}>{formErrors.studentState}</p>}
            </div>
          </div>
                  <div>
                    <label htmlFor="preferredCourse" className={labelClasses}>Preferred Course(s) <span className="text-red-500">*</span></label>
                    <CustomSelect
                      options={liveCourses.map(course => ({ value: course.title, label: course.title }))}
                      value={studentDetailsUnder16.preferred_course}
                      onChange={(value: string[]) => setStudentDetailsUnder16({ ...studentDetailsUnder16, preferred_course: value })}
                      placeholder={isLoadingCourses ? "Loading courses..." : "Select preferred course(s)"}
                      isMulti
                      isDisabled={isLoadingCourses}
                    />
                    {formErrors.studentPreferredCourse && <p className={errorClasses}>{formErrors.studentPreferredCourse}</p>}
                  </div>
                <div>
                  <label htmlFor="knowMedhFrom" className={labelClasses}>How did you hear about Medh? <span className="text-red-500">*</span></label>
                  <CustomSelect
                    options={knowMedhFromOptions}
                    value={studentDetailsUnder16.know_medh_from}
                    onChange={(value: TKnowMedhFrom) => setStudentDetailsUnder16({ ...studentDetailsUnder16, know_medh_from: value })}
                    placeholder="Select an option"
                  />
                  {formErrors.knowMedhFrom && <p className={errorClasses}>{formErrors.knowMedhFrom}</p>}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className={buildComponent.button("secondary", "lg")}
              >
                Back: Parent Details
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className={buildComponent.button("primary", "lg")}
              >
                Next: Demo Session & Consent
              </button>
            </div>
          </div>
        )}

        {/* Demo Session & Consent Step (Under 16) */}
        {step === 4 && isStudentUnder16 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Parent Details</span>
                </div>
                <div className="w-12 h-1 bg-primary-500"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Student Details</span>
                </div>
                <div className="w-12 h-1 bg-primary-500"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="ml-2 text-sm font-medium text-primary-500">Session & Consent</span>
                </div>
              </div>
            </div>

            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Demo Session Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className={labelClasses}>Preferred Date</label>
                  <DatePicker
                    selected={demoSessionDetails.preferred_date}
                    onChange={(date: Date | null) => setDemoSessionDetails({ ...demoSessionDetails, preferred_date: date || undefined })}
                    dateFormat="dd/MM/yyyy"
                    customInput={<input type="text" className={datepickerCustomInput} />}
                    minDate={new Date()}
                    className="w-full"
                    popperClassName="react-datepicker-popper-custom"
                    calendarClassName={isDark ? "react-datepicker-dark" : ""}
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                  />
                </div>
                <div>
                  <label htmlFor="preferredTimeSlot" className={labelClasses}>Preferred Time Slot</label>
                  <CustomSelect
                    options={preferredTimingsOptions}
                    value={demoSessionDetails.preferred_time_slot}
                    onChange={(value: string) => setDemoSessionDetails({ ...demoSessionDetails, preferred_time_slot: value })}
                    placeholder="Select a time slot"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Consent</h3>
              <div className="space-y-2">
                <label className={radioLabelClasses}>
                  <input
                    type="checkbox"
                    className={`form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    checked={consent.terms_accepted && consent.privacy_policy_accepted}
                    onChange={(e) => setConsent({ 
                      ...consent, 
                      terms_accepted: e.target.checked,
                      privacy_policy_accepted: e.target.checked 
                    })}
                  />
                  <span className="ml-2">
                    I agree to the <Link href="/terms-and-services" className="text-primary-500 hover:underline">Terms of Use</Link> and <Link href="/privacy-policy" className="text-primary-500 hover:underline">Privacy Policy</Link> <span className="text-red-500">*</span>
                  </span>
                </label>
                {(formErrors.termsAccepted || formErrors.privacyPolicyAccepted) && <p className={errorClasses}>{formErrors.termsAccepted || formErrors.privacyPolicyAccepted}</p>}

                <label className={radioLabelClasses}>
                  <input
                    type="checkbox"
                    className={`form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    checked={consent.gdpr_consent}
                    onChange={(e) => setConsent({ ...consent, gdpr_consent: e.target.checked })}
                  />
                  <span className="ml-2">I consent to the processing of my data in accordance with GDPR.</span>
                </label>
              </div>
            </div>

            {/* Navigation and Submit */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(3)}
                className={buildComponent.button("secondary", "lg")}
              >
                Back: Student Details
              </button>
              <button
                type="submit"
                className={buildComponent.button("primary", "lg")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </span>
                ) : (
                  "Book Your Demo Session Now"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Form for 16 and Above */}
        {step === 5 && !isStudentUnder16 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Student Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                      <label htmlFor="studentName" className={labelClasses}>Student's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="studentName"
                  className={inputClasses}
                  value={studentDetails16AndAbove.name}
                  onChange={(e) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, name: e.target.value })}
                        placeholder="Enter student's full name"
                />
                {formErrors.studentName && <p className={errorClasses}>{formErrors.studentName}</p>}
              </div>
              <div>
                      <label htmlFor="studentEmail" className={labelClasses}>Student's Email ID <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="studentEmail"
                  className={inputClasses}
                  value={studentDetails16AndAbove.email}
                  onChange={(e) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, email: e.target.value })}
                        placeholder="Enter student's email address"
                />
                {formErrors.studentEmail && <p className={errorClasses}>{formErrors.studentEmail}</p>}
              </div>
            </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 ${formErrors.studentCountry ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <select
                    className={`
                      block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-sm text-base font-medium
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200
                      ${formErrors.studentCountry
                        ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 dark:border-gray-700'
                      }
                    `}
                    value={studentSelectedCountry}
                    onChange={(e) => {
                      const selectedCountry = e.target.value;
                      setStudentSelectedCountry(selectedCountry);
                      
                      // Find the country data to get the dial code
                      const countryData = countriesData.find((country: any) => country.code === selectedCountry);
                      
                      if (countryData && countryData.dial_code) {
                        // Update phone number with new country code
                        setStudentDetails16AndAbove({ ...studentDetails16AndAbove, mobile_no: countryData.dial_code });
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
                {formErrors.studentCountry && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{formErrors.studentCountry}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneNumberInput
                  value={{ 
                    country: studentSelectedCountry, 
                    number: studentDetails16AndAbove.mobile_no 
                  }}
                  onChange={val => {
                    setStudentDetails16AndAbove({ ...studentDetails16AndAbove, mobile_no: val.number });
                    // Also update the country field if it changed in the phone input
                    if (val.country !== studentSelectedCountry) {
                      setStudentSelectedCountry(val.country);
                    }
                  }}
                  placeholder="Enter phone number"
                  error={formErrors.studentMobileNo}
                />
              </div>
            </div>
              <div>
                    <label htmlFor="highestQualification" className={labelClasses}>Highest Qualification <span className="text-red-500">*</span></label>
                    <CustomSelect
                      options={qualificationOptions}
                      value={studentDetails16AndAbove.highest_qualification}
                      onChange={(value: THighestQualification) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, highest_qualification: value })}
                      placeholder="Select highest qualification"
                    />
                    {formErrors.highestQualification && <p className={errorClasses}>{formErrors.highestQualification}</p>}
                  </div>
                  <div>
                    <label htmlFor="educationInstitute" className={labelClasses}>Education Institute Name (Optional)</label>
                <input
                  type="text"
                      id="educationInstitute"
                  className={inputClasses}
                      value={studentDetails16AndAbove.education_institute_name || ""}
                      onChange={(e) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, education_institute_name: e.target.value })}
                      placeholder="e.g., Delhi University"
                    />
              </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                      <label className={labelClasses}>Currently Studying? <span className="text-red-500">*</span></label>
                <div className={radioGroupClasses}>
                  <label className={radioLabelClasses}>
                          <Radio
                            className={`mr-2 h-5 w-5 ${studentDetails16AndAbove.currently_studying ? 'text-primary-600' : 'text-gray-400'}`}
                            onClick={() => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, currently_studying: true })}
                            fill={studentDetails16AndAbove.currently_studying ? 'currentColor' : 'none'}
                          />
                          Yes
                  </label>
                  <label className={radioLabelClasses}>
                          <Radio
                            className={`mr-2 h-5 w-5 ${!studentDetails16AndAbove.currently_studying ? 'text-primary-600' : 'text-gray-400'}`}
                            onClick={() => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, currently_studying: false })}
                            fill={!studentDetails16AndAbove.currently_studying ? 'currentColor' : 'none'}
                          />
                          No
                  </label>
                </div>
                {formErrors.currentlyStudying && <p className={errorClasses}>{formErrors.currentlyStudying}</p>}
              </div>
              <div>
                      <label className={labelClasses}>Currently Working? <span className="text-red-500">*</span></label>
                <div className={radioGroupClasses}>
                  <label className={radioLabelClasses}>
                          <Radio
                            className={`mr-2 h-5 w-5 ${studentDetails16AndAbove.currently_working ? 'text-primary-600' : 'text-gray-400'}`}
                            onClick={() => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, currently_working: true })}
                            fill={studentDetails16AndAbove.currently_working ? 'currentColor' : 'none'}
                          />
                          Yes
                  </label>
                  <label className={radioLabelClasses}>
                          <Radio
                            className={`mr-2 h-5 w-5 ${!studentDetails16AndAbove.currently_working ? 'text-primary-600' : 'text-gray-400'}`}
                            onClick={() => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, currently_working: false })}
                            fill={!studentDetails16AndAbove.currently_working ? 'currentColor' : 'none'}
                          />
                          No
                  </label>
                </div>
                {formErrors.currentlyWorking && <p className={errorClasses}>{formErrors.currentlyWorking}</p>}
              </div>
            </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                      <label htmlFor="studentCity" className={labelClasses}>Student's Current City <span className="text-red-500">*</span></label>
              <input
                type="text"
                        id="studentCity"
                className={inputClasses}
                        value={studentDetails16AndAbove.city}
                        onChange={(e) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, city: e.target.value })}
                        placeholder="e.g., New Delhi"
                      />
                      {formErrors.studentCity && <p className={errorClasses}>{formErrors.studentCity}</p>}
            </div>
                    <div>
                      <label htmlFor="studentPreferredTimings" className={labelClasses}>Preferred Timings to Connect</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock className={`h-5 w-5 ${formErrors.studentPreferredTimings ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        <select
                          id="studentPreferredTimings"
                          className={inputClasses + " pl-12"}
                          value={studentDetails16AndAbove.preferred_timings_to_connect || ""}
                          onChange={(e) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, preferred_timings_to_connect: e.target.value })}
                        >
                          <option value="">Select preferred timing</option>
                          {preferredTimingsOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
          </div>
                  </div>
                  <div>
                    <label htmlFor="preferredCourse" className={labelClasses}>Preferred Course(s) <span className="text-red-500">*</span></label>
                    <CustomSelect
                      options={liveCourses.map(course => ({ value: course.title, label: course.title }))}
                      value={studentDetails16AndAbove.preferred_course}
                      onChange={(value: string[]) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, preferred_course: value })}
                      placeholder={isLoadingCourses ? "Loading courses..." : "Select preferred course(s)"}
                      isMulti
                      isDisabled={isLoadingCourses}
                    />
                    {formErrors.studentPreferredCourse && <p className={errorClasses}>{formErrors.studentPreferredCourse}</p>}
                  </div>

              <div>
                <label htmlFor="knowMedhFrom" className={labelClasses}>How did you hear about Medh? <span className="text-red-500">*</span></label>
                <CustomSelect
                  options={knowMedhFromOptions}
                    value={studentDetails16AndAbove.know_medh_from}
                    onChange={(value: TKnowMedhFrom) => setStudentDetails16AndAbove({ ...studentDetails16AndAbove, know_medh_from: value })}
                  placeholder="Select an option"
                />
                {formErrors.knowMedhFrom && <p className={errorClasses}>{formErrors.knowMedhFrom}</p>}
                </div>
              </div>
            </div>

            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Demo Session Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className={labelClasses}>Preferred Date</label>
                  <DatePicker
                    selected={demoSessionDetails.preferred_date}
                    onChange={(date: Date | null) => setDemoSessionDetails({ ...demoSessionDetails, preferred_date: date || undefined })}
                    dateFormat="dd/MM/yyyy"
                    customInput={<input type="text" className={datepickerCustomInput} />}
                    minDate={new Date()}
                    className="w-full"
                    popperClassName="react-datepicker-popper-custom"
                    calendarClassName={isDark ? "react-datepicker-dark" : ""}
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                  />
                </div>
                <div>
                  <label htmlFor="preferredTimeSlot" className={labelClasses}>Preferred Time Slot</label>
                  <CustomSelect
                    options={preferredTimingsOptions}
                    value={demoSessionDetails.preferred_time_slot}
                    onChange={(value: string) => setDemoSessionDetails({ ...demoSessionDetails, preferred_time_slot: value })}
                    placeholder="Select a time slot"
                  />
                </div>
                </div>
              </div>

            <div className="glass-card-sm p-5 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Consent</h3>
              <div className="space-y-2">
                <label className={radioLabelClasses}>
                  <input
                    type="checkbox"
                    className={`form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    checked={consent.terms_accepted && consent.privacy_policy_accepted}
                    onChange={(e) => setConsent({ 
                      ...consent, 
                      terms_accepted: e.target.checked,
                      privacy_policy_accepted: e.target.checked 
                    })}
                  />
                  <span className="ml-2">
                    I agree to the <Link href="/terms-and-services" className="text-primary-500 hover:underline">Terms of Use</Link> and <Link href="/privacy-policy" className="text-primary-500 hover:underline">Privacy Policy</Link> <span className="text-red-500">*</span>
                  </span>
                  </label>
                {(formErrors.termsAccepted || formErrors.privacyPolicyAccepted) && <p className={errorClasses}>{formErrors.termsAccepted || formErrors.privacyPolicyAccepted}</p>}

                <label className={radioLabelClasses}>
                    <input
                      type="checkbox"
                    className={`form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                      checked={consent.gdpr_consent}
                      onChange={(e) => setConsent({ ...consent, gdpr_consent: e.target.checked })}
                    />
                  <span className="ml-2">I consent to the processing of my data in accordance with GDPR.</span>
                    </label>
                  </div>
              </div>

            {/* Navigation and Submit */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={buildComponent.button("secondary", "lg")}
              >
                Back
              </button>
                                  <button
                    type="submit"
                className={buildComponent.button("primary", "lg")}
                    disabled={isSubmitting}
                  >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </span>
                ) : (
                  "Book Your Demo Session Now"
                )}
                </button>
              </div>
        </form>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSubmitting ? 'cursor-wait opacity-100' : 'opacity-100'}`}>
      {renderFormContent()}
    </div>
  );
};

export default DemoSessionForm; 