"use client";

/**
 * Embedded Hire from Medh Inquiry Form
 * 
 * Enhanced multi-step form for hire from medh inquiries following
 * the hire.api.ts structure and existing embedded form patterns.
 * 
 * @author MEDH Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Select from "react-select";

// Icons
import { 
  User, Mail, Phone, Building2, Globe, Briefcase, Users, 
  Target, Calendar, DollarSign, CheckCircle, ArrowRight, 
  ArrowLeft, Loader2, AlertCircle, MapPin, Award, Send,
  BookOpen, TrendingUp, MessageSquare, Settings, Shield,
  Search, Handshake, Star
} from 'lucide-react';

// API and Types
import { 
  IHireFromMedhInquiryPayload,
  IContactInfo,
  IProfessionalInfo,
  IInquiryDetails,
  IConsent,
  TIndustry,
  TCompanySize,
  TExperienceLevel,
  TInquiryType,
  TContactMethod,
  TUrgencyLevel,
  TBudgetRange,
  TTimeline,
  THeardAboutUs,
  COURSE_INTEREST_OPTIONS,
  HireFormValidationService
} from '@/apis/hire.api';

// Hooks
import usePostQuery from '@/hooks/postQuery.hook';

// Phone Number Component
import PhoneNumberInput from '../shared/login/PhoneNumberInput';

// Form Steps Type
type TFormStep = 'contact' | 'professional' | 'inquiry' | 'consent';

// Form State Interface
interface IEmbeddedHireFormState {
  // Step management
  step: TFormStep;
  
  // Form data (complete API specification)
  formData: {
    // Contact Information
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
    facebookProfile: string;
    instagramProfile: string;
    portfolioUrl: string;
    
    // Professional Information
    designation: string;
    companyName: string;
    companyWebsite: string;
    industry: TIndustry | '';
    companySize: TCompanySize | '';
    department: string;
    experienceLevel: TExperienceLevel | '';
    
    // Inquiry Details
    inquiryType: TInquiryType | '';
    preferredContactMethod: TContactMethod | '';
    urgencyLevel: TUrgencyLevel | '';
    courseInterest: string[];
    companySizeInq: TCompanySize | '';
    budgetRange: TBudgetRange | '';
    timeline: TTimeline | '';
    heardAboutUs: THeardAboutUs | '';
    additionalRequirements: string;
    
    // Consent
    termsAndPrivacy: boolean;
    dataCollectionConsent: boolean;
    marketingConsent: boolean;
    
    // Captcha
    captchaToken: string;
  };
  
  // UI state
  errors: Record<string, string>;
  isSubmitting: boolean;
  isLoading: boolean;
}

// Component Props Interface
interface EmbeddedHireFormProps {
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  initialData?: any;
  className?: string;
}

// Form Options Configuration
const FORM_OPTIONS = {
  industries: [
    { label: 'Technology', value: 'technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Finance & Banking', value: 'finance' },
    { label: 'Education', value: 'education' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Retail & E-commerce', value: 'retail' },
    { label: 'Consulting', value: 'consulting' },
    { label: 'Government', value: 'government' },
    { label: 'Non-Profit', value: 'non_profit' },
    { label: 'Other', value: 'other' }
  ],
  companySizes: [
    { label: '1-10 employees', value: '1-10' },
    { label: '11-50 employees', value: '11-50' },
    { label: '51-200 employees', value: '51-200' },
    { label: '201-500 employees', value: '201-500' },
    { label: '500+ employees', value: '500+' },
    { label: 'Not Applicable', value: 'not_applicable' }
  ],
  experienceLevels: [
    { label: 'Entry Level', value: 'entry' },
    { label: 'Mid Level', value: 'mid' },
    { label: 'Senior Level', value: 'senior' },
    { label: 'Executive Level', value: 'executive' }
  ],
  inquiryTypes: [
    { label: 'Hiring Solutions', value: 'hiring_solutions' },
    { label: 'Partnership Opportunities', value: 'partnership_opportunities' },
    { label: 'General Inquiry', value: 'general_inquiry' },
    { label: 'Course Information', value: 'course_information' },
    { label: 'Other', value: 'feedback_complaint' }
  ],
  contactMethods: [
    { label: 'Email', value: 'email' },
    { label: 'Phone Call', value: 'phone' },
    { label: 'WhatsApp', value: 'whatsapp' }
  ],
  urgencyLevels: [
    { label: 'Low Priority', value: 'low' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'High Priority', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
  ],
  budgetRanges: [
    { label: 'Under ₹10K', value: 'under_10k' },
    { label: '₹10K - ₹50K', value: '10k_50k' },
    { label: '₹50K - ₹1 Lakh', value: '50k_1l' },
    { label: '₹1 - ₹5 Lakhs', value: '1l_5l' },
    { label: '₹5+ Lakhs', value: '5l_plus' },
    { label: 'Prefer not to disclose', value: 'not_disclosed' }
  ],
  timelines: [
    { label: 'Immediate (Within 1 week)', value: 'immediate' },
    { label: 'Within a week', value: 'within_week' },
    { label: 'Within a month', value: 'within_month' },
    { label: 'Within 3 months', value: 'within_quarter' },
    { label: 'Flexible timeline', value: 'flexible' }
  ],
  heardAboutUsOptions: [
    { label: 'Google Search', value: 'google_search' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Referral from Friend', value: 'referral_friend' },
    { label: 'Referral from Colleague', value: 'referral_colleague' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Blog Article', value: 'blog_article' },
    { label: 'Webinar/Event', value: 'webinar_event' },
    { label: 'Partner Institution', value: 'partner_institution' },
    { label: 'Other', value: 'other' }
  ],
  courseInterestOptions: [
    // AI and Data Science
    { label: 'AI & Data Science', value: 'ai_data_science', category: 'AI & Tech' },
    { label: 'AI for Professionals', value: 'ai_for_professionals', category: 'AI & Tech' },
    { label: 'AI in Finance', value: 'ai_in_finance', category: 'AI & Tech' },
    { label: 'AI in Healthcare', value: 'ai_in_healthcare', category: 'AI & Tech' },
    { label: 'AI in Manufacturing', value: 'ai_in_manufacturing', category: 'AI & Tech' },

    // Digital Marketing
    { label: 'Digital Marketing', value: 'digital_marketing', category: 'Marketing' },
    { label: 'Social Media Marketing', value: 'social_media_marketing', category: 'Marketing' },
    { label: 'Brand Management', value: 'brand_management', category: 'Marketing' },
    { label: 'Online Reputation Management', value: 'online_reputation_management', category: 'Marketing' },

    // Business & Management
    { label: 'Business Analysis & Strategy', value: 'business_analysis_strategy', category: 'Business' },
    { label: 'Entrepreneurship & Startup', value: 'entrepreneurship_startup', category: 'Business' },
    { label: 'Marketing & Sales Strategy', value: 'marketing_sales_strategy', category: 'Business' },

    // Technical Skills
    { label: 'Python Programming', value: 'programming_python', category: 'Programming' },
    { label: 'Scala Programming', value: 'programming_scala', category: 'Programming' },
    { label: 'R Programming', value: 'programming_r', category: 'Programming' },
    { label: 'Cloud Computing', value: 'cloud_computing', category: 'Programming' },
    { label: 'Cybersecurity', value: 'cybersecurity', category: 'Programming' },

    // Finance & Accounts
    { label: 'Finance for Startups', value: 'finance_startups', category: 'Finance' },
    { label: 'Financial Statement & MIS', value: 'financial_statement_mis', category: 'Finance' },
    { label: 'Tax Computation & Filing', value: 'tax_computation_filing', category: 'Finance' },

    // Personal Development
    { label: 'Personality Development', value: 'personality_development', category: 'Personal' },
    { label: 'Vedic Mathematics', value: 'vedic_mathematics', category: 'Personal' },
    { label: 'Emotional Intelligence', value: 'emotional_intelligence', category: 'Personal' },
    { label: 'Public Speaking', value: 'public_speaking', category: 'Personal' },
    { label: 'Time Management', value: 'time_management', category: 'Personal' },

    // Career Development
    { label: 'Job Search Strategies', value: 'job_search_strategies', category: 'Career' },
    { label: 'Personal Branding', value: 'personal_branding', category: 'Career' },
    { label: 'Resume & Interview Prep', value: 'resume_interview_prep', category: 'Career' },

    // Other categories
    { label: 'Business English', value: 'business_english', category: 'Language' },
    { label: 'French Language', value: 'french_language', category: 'Language' },
    { label: 'Mental Health Awareness', value: 'mental_health_awareness', category: 'Health' },
    { label: 'Healthcare Medical Coding', value: 'healthcare_medical_coding', category: 'Industry' },
    { label: 'Renewable Energy', value: 'renewable_energy', category: 'Environment' },
    { label: 'Other', value: 'other', category: 'Other' }
  ]
};

// Enhanced Country Options with comprehensive list
const countryOptions = [
  // Popular countries first
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sg', label: 'Singapore' },
  
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
  { value: 'kr', label: 'South Korea' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'sy', label: 'Syria' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'tj', label: 'Tajikistan' },
  { value: 'th', label: 'Thailand' },
  { value: 'tr', label: 'Turkey' },
  { value: 'tm', label: 'Turkmenistan' },
  { value: 'uz', label: 'Uzbekistan' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'ye', label: 'Yemen' },

  // Europe
  { value: 'al', label: 'Albania' },
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
  { value: 'va', label: 'Vatican City' },

  // North America
  { value: 'ag', label: 'Antigua and Barbuda' },
  { value: 'bs', label: 'Bahamas' },
  { value: 'bb', label: 'Barbados' },
  { value: 'bz', label: 'Belize' },
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
  { value: 'vu', label: 'Vanuatu' }
];

// Countries data for phone number mapping
const COUNTRIES = [
  { code: 'in', name: 'India', dial_code: '+91' },
  { code: 'us', name: 'United States', dial_code: '+1' },
  { code: 'gb', name: 'United Kingdom', dial_code: '+44' },
  { code: 'ca', name: 'Canada', dial_code: '+1' },
  { code: 'au', name: 'Australia', dial_code: '+61' },
  { code: 'ae', name: 'United Arab Emirates', dial_code: '+971' },
  { code: 'sg', name: 'Singapore', dial_code: '+65' },
  // ... (include more countries as needed)
];

// Validation Helper Functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (number: string, countryCode: string): boolean => {
  const cleanPhone = number.replace(/\D/g, '');
  return cleanPhone.length >= 7 && cleanPhone.length <= 15;
};

const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
  return nameRegex.test(name.trim());
};

const validateWebsite = (url: string): boolean => {
  if (!url.trim()) return true; // Optional field
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+([\/\w\.-]*)*\/?$/;
  return urlRegex.test(url);
};

// Main Component
const EmbeddedHireForm: React.FC<EmbeddedHireFormProps> = ({ 
  onSubmitSuccess, 
  onSubmitError,
  initialData,
  className = ""
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { postQuery, loading: submissionLoading } = usePostQuery();
  
  // Theme detection
  const isDark = theme === 'dark';

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

  // Initialize form state
  const [state, setState] = useState<IEmbeddedHireFormState>({
    step: 'contact',
    formData: {
      // Contact Information
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobileCountryCode: 'in',
      mobileNumber: '',
      city: '',
      country: 'in',
      address: '',
      linkedinProfile: '',
      facebookProfile: '',
      instagramProfile: '',
      portfolioUrl: '',
      
      // Professional Information
      designation: '',
      companyName: '',
      companyWebsite: '',
      industry: '',
      companySize: '',
      department: '',
      experienceLevel: '',
      
      // Inquiry Details
      inquiryType: '',
      preferredContactMethod: '',
      urgencyLevel: '',
      courseInterest: [],
      companySizeInq: '',
      budgetRange: '',
      timeline: '',
      heardAboutUs: '',
      additionalRequirements: '',
      
      // Consent
      termsAndPrivacy: false,
      dataCollectionConsent: false,
      marketingConsent: false,
      
      // Captcha
      captchaToken: ''
    },
    errors: {},
    isSubmitting: false,
    isLoading: false
  });

  useEffect(() => {
    setMounted(true);
    // Load initial data if provided
    if (initialData) {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, ...initialData }
      }));
    }
  }, [initialData]);

  // Auto-save functionality (client-side only)
  const autoSaveData = useCallback(async () => {
    if (!mounted || typeof window === 'undefined') return;
    
    try {
      const dataToSave = {
        step: state.step,
        formData: state.formData,
        timestamp: Date.now()
      };
      localStorage.setItem('hireFormDraft', JSON.stringify(dataToSave));
      console.log('📦 Form auto-saved to localStorage');
    } catch (error) {
      console.warn('Failed to auto-save form data:', error);
    }
  }, [mounted, state.step, state.formData]);

  // Load saved data on mount (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem('hireFormDraft');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Only restore data from the last 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setState(prev => ({
            ...prev,
            step: parsed.step || 'contact',
            formData: { ...prev.formData, ...parsed.formData }
          }));
          console.log('📂 Form data restored from localStorage');
        } else {
          localStorage.removeItem('hireFormDraft');
          console.log('🗑️ Old form data cleaned up');
        }
      }
    } catch (error) {
      console.warn('Could not restore form data:', error);
      try {
        localStorage.removeItem('hireFormDraft');
      } catch (cleanupError) {
        console.warn('Could not clean up corrupted form data:', cleanupError);
      }
    }
  }, [mounted]);

  // Auto-save when form data changes
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(autoSaveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [mounted, autoSaveData]);

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { formData } = state;

    switch (state.step) {
      case 'contact':
        if (!validateName(formData.firstName)) {
          newErrors.firstName = 'Please enter a valid first name (2-100 characters, letters only)';
        }
        if (!validateName(formData.lastName)) {
          newErrors.lastName = 'Please enter a valid last name (2-100 characters, letters only)';
        }
        if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!validatePhoneNumber(formData.mobileNumber, formData.mobileCountryCode)) {
          newErrors.mobileNumber = 'Please enter a valid phone number';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData.country || formData.country.trim() === '') {
          newErrors.country = 'Country selection is required';
        }
        if (formData.linkedinProfile && !validateWebsite(formData.linkedinProfile)) {
          newErrors.linkedinProfile = 'Please enter a valid LinkedIn URL';
        }
        break;

      case 'professional':
        // Professional info is optional, but validate if provided
        if (formData.companyWebsite && !validateWebsite(formData.companyWebsite)) {
          newErrors.companyWebsite = 'Please enter a valid website URL';
        }
        break;

      case 'inquiry':
        if (!formData.preferredContactMethod) {
          newErrors.preferredContactMethod = 'Please select preferred contact method';
        }
        if (!formData.urgencyLevel) {
          newErrors.urgencyLevel = 'Please select urgency level';
        }
        if (!formData.budgetRange) {
          newErrors.budgetRange = 'Please select budget range';
        }
        if (!formData.timeline) {
          newErrors.timeline = 'Please select timeline';
        }
        if (formData.courseInterest.length === 0) {
          newErrors.courseInterest = 'Please select at least one skill/area of interest';
        }
        if (!formData.additionalRequirements.trim() || formData.additionalRequirements.trim().length < 10) {
          newErrors.additionalRequirements = 'Please provide detailed requirements (minimum 10 characters)';
        }
        break;
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      const steps: TFormStep[] = ['contact', 'professional', 'inquiry', 'consent'];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex < steps.length - 1) {
        setState(prev => ({ ...prev, step: steps[currentIndex + 1] }));
        toast.success(`${state.step.charAt(0).toUpperCase() + state.step.slice(1)} information completed!`);
      }
    } else {
      toast.error('Please complete all required fields before continuing.');
    }
  };

  const handlePrevious = () => {
    const steps: TFormStep[] = ['contact', 'professional', 'inquiry', 'consent'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: steps[currentIndex - 1] }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!state.formData.termsAndPrivacy || !state.formData.dataCollectionConsent) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          termsAndPrivacy: !state.formData.termsAndPrivacy ? 'You must accept the terms and privacy policy' : '',
          dataCollectionConsent: !state.formData.dataCollectionConsent ? 'You must consent to data collection' : ''
        }
      }));
      toast.error('Please accept the required terms and consents.');
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Transform form data to API payload
      const payload = {
        // Root level form_type as required by the API
        form_type: 'hire_from_medh_inquiry',
        
        // Form configuration
        form_config: {
          form_type: 'hire_from_medh_inquiry',
          form_version: '1.0',
          submission_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        
        // Submission metadata
        submission_metadata: {
          timestamp: new Date().toISOString(),
          form_version: '1.0',
          device_info: {
            type: typeof window !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            os: typeof window !== 'undefined' ? navigator.platform : 'unknown',
            browser: typeof window !== 'undefined' ? 
              (navigator.userAgent.includes('Chrome') ? 'Chrome' : 
               navigator.userAgent.includes('Firefox') ? 'Firefox' : 
               navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown') : 'unknown',
            screen_resolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
            user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
          },
          validation_passed: true,
          referrer: typeof window !== 'undefined' ? document.referrer || undefined : undefined,
          utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || undefined : undefined,
          utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || undefined : undefined,
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || undefined : undefined
        },
        
        // Captcha token (development mode)
        captcha_token: 'development_token',
        
        contact_info: {
          first_name: state.formData.firstName,
          middle_name: state.formData.middleName || undefined,
          last_name: state.formData.lastName,
          full_name: `${state.formData.firstName} ${state.formData.middleName} ${state.formData.lastName}`.replace(/\s+/g, ' ').trim(),
          email: state.formData.email,
          mobile_number: {
            country_code: COUNTRIES.find(c => c.code === state.formData.mobileCountryCode)?.dial_code || '+91',
            number: state.formData.mobileNumber
          },
          city: state.formData.city,
          country: state.formData.country,
          address: state.formData.address || undefined,
          social_profiles: {
            linkedin: state.formData.linkedinProfile || undefined,
            facebook: state.formData.facebookProfile || undefined,
            instagram: state.formData.instagramProfile || undefined,
            portfolio: state.formData.portfolioUrl || undefined
          }
        },
        
        professional_info: state.formData.designation || state.formData.companyName ? {
          designation: state.formData.designation || undefined,
          company_name: state.formData.companyName || undefined,
          company_website: state.formData.companyWebsite || undefined,
          industry: state.formData.industry || undefined,
          company_size: state.formData.companySize || undefined,
          department: state.formData.department || undefined,
          experience_level: state.formData.experienceLevel || undefined
        } : undefined,
        
        inquiry_details: {
          inquiry_type: state.formData.inquiryType || 'hiring_solutions',
          preferred_contact_method: state.formData.preferredContactMethod,
          urgency_level: state.formData.urgencyLevel,
          course_interest: state.formData.courseInterest,
          company_size: state.formData.companySizeInq || undefined,
          budget_range: state.formData.budgetRange,
          timeline: state.formData.timeline,
          heard_about_us: state.formData.heardAboutUs || undefined,
          additional_requirements: state.formData.additionalRequirements || undefined
        },
        
        consent: {
          terms_and_privacy: state.formData.termsAndPrivacy,
          data_collection_consent: state.formData.dataCollectionConsent,
          marketing_consent: state.formData.marketingConsent
        }
      };

      console.log('🚀 Submitting Hire from Medh Inquiry:', payload);

      // Call the API using postQuery hook
      const response = await postQuery({
        url: '/forms/submit',
        postData: payload,
        requireAuth: false,
        enableToast: false,
        onSuccess: (data) => {
          console.log('✅ Hire from Medh Inquiry Submitted Successfully:', data);
          
          // Clean up localStorage (client-side only)
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('hireFormDraft');
              console.log('🔄 Form reset for next submission');
            } catch (error) {
              console.warn('Failed to clean up form data:', error);
            }
          }
          
          toast.success('🎉 Hire from Medh inquiry submitted successfully! Our partnerships team will contact you within 24 hours.');
          
          if (onSubmitSuccess) {
            onSubmitSuccess(data);
          }

          // Reset form
          setState(prev => ({
            ...prev,
            step: 'contact',
            formData: {
              ...prev.formData,
              firstName: '',
              lastName: '',
              email: '',
              mobileNumber: '',
              city: '',
              additionalRequirements: '',
              termsAndPrivacy: false,
              dataCollectionConsent: false
            }
          }));
        },
        onFail: (error) => {
          console.error('❌ Hire from Medh Inquiry Submission Failed:', error);
          
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit hire from medh inquiry';
          toast.error(`Submission failed: ${errorMessage}. Please try again.`);
          
          if (onSubmitError) {
            onSubmitError(error);
          }
        }
      });

      console.log('📡 API Response:', response);

    } catch (error) {
      console.error('❌ Hire from Medh Inquiry Submission Error:', error);
      toast.error('Failed to submit inquiry. Please try again.');
      
      if (onSubmitError) {
        onSubmitError(error);
      }
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Input component with consistent styling
  const inputClasses = (hasError: boolean) => 
    `w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
      hasError 
        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' 
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400'
    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20`;

  // Get step title
  const getStepTitle = (step: TFormStep) => {
    switch (step) {
      case 'contact': return 'Contact Information';
      case 'professional': return 'Professional Details';
      case 'inquiry': return 'Hiring Requirements';
      case 'consent': return 'Consent & Submission';
      default: return '';
    }
  };

  // Get step progress
  const getStepProgress = (step: TFormStep) => {
    const steps: TFormStep[] = ['contact', 'professional', 'inquiry', 'consent'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  // Render current step content
  const renderStepContent = () => {
    switch (state.step) {
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={state.formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={inputClasses(!!state.errors.firstName)}
                  placeholder="e.g., John"
                />
                {state.errors.firstName && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={state.formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={inputClasses(!!state.errors.lastName)}
                  placeholder="e.g., Smith"
                />
                {state.errors.lastName && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Email *
              </label>
              <input
                type="email"
                value={state.formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={inputClasses(!!state.errors.email)}
                placeholder="john.smith@company.com"
              />
              {state.errors.email && (
                <p className="text-red-600 text-xs mt-1">{state.errors.email}</p>
              )}
            </div>

            <div className="space-y-4">
              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(option => option.value === state.formData.country)}
                  onChange={(selected) => updateFormData('country', selected?.value || 'in')}
                  styles={selectStyles}
                  placeholder="Select your country"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                  menuPosition="fixed"
                  isSearchable={true}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {state.errors.country && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {state.errors.country}
                  </p>
                )}
              </div>

              {/* Contact Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number *
                </label>
                <PhoneNumberInput
                  value={{ 
                    country: state.formData.country.toUpperCase(), 
                    number: state.formData.mobileNumber,
                    formattedNumber: state.formData.mobileNumber,
                    isValid: validatePhoneNumber(state.formData.mobileNumber, state.formData.country)
                  }}
                  onChange={(val) => {
                    const isValid = validatePhoneNumber(val.number, val.country);
                    updateFormData('mobileNumber', val.number);
                    updateFormData('country', val.country.toLowerCase());
                    updateFormData('mobileCountryCode', COUNTRIES.find(c => c.code === val.country.toLowerCase())?.dial_code || '+91');
                    
                    // Clear mobile number error if validation passes
                    if (isValid && state.errors.mobileNumber) {
                      setState(prev => ({
                        ...prev,
                        errors: { ...prev.errors, mobileNumber: '' }
                      }));
                    }
                  }}
                  placeholder="Enter your contact number"
                  error={state.errors.mobileNumber}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                value={state.formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                className={inputClasses(!!state.errors.city)}
                placeholder="e.g., Mumbai"
              />
              {state.errors.city && (
                <p className="text-red-600 text-xs mt-1">{state.errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                value={state.formData.linkedinProfile}
                onChange={(e) => updateFormData('linkedinProfile', e.target.value)}
                className={inputClasses(!!state.errors.linkedinProfile)}
                placeholder="https://www.linkedin.com/in/yourprofile"
              />
              {state.errors.linkedinProfile && (
                <p className="text-red-600 text-xs mt-1">{state.errors.linkedinProfile}</p>
              )}
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Optional:</strong> Help us understand your organization better to match you with the right talent.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title / Designation
              </label>
              <input
                type="text"
                value={state.formData.designation}
                onChange={(e) => updateFormData('designation', e.target.value)}
                className={inputClasses(!!state.errors.designation)}
                placeholder="e.g., HR Manager, CTO, Hiring Lead"
              />
              {state.errors.designation && (
                <p className="text-red-600 text-xs mt-1">{state.errors.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={state.formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className={inputClasses(!!state.errors.companyName)}
                placeholder="e.g., Tech Solutions Pvt Ltd"
              />
              {state.errors.companyName && (
                <p className="text-red-600 text-xs mt-1">{state.errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Website
              </label>
              <input
                type="url"
                value={state.formData.companyWebsite}
                onChange={(e) => updateFormData('companyWebsite', e.target.value)}
                className={inputClasses(!!state.errors.companyWebsite)}
                placeholder="https://www.yourcompany.com"
              />
              {state.errors.companyWebsite && (
                <p className="text-red-600 text-xs mt-1">{state.errors.companyWebsite}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <select
                  value={state.formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className={inputClasses(!!state.errors.industry)}
                >
                  <option value="">Select Industry</option>
                  {FORM_OPTIONS.industries.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.industry && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Size
                </label>
                <select
                  value={state.formData.companySize}
                  onChange={(e) => updateFormData('companySize', e.target.value)}
                  className={inputClasses(!!state.errors.companySize)}
                >
                  <option value="">Select Company Size</option>
                  {FORM_OPTIONS.companySizes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.companySize && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.companySize}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={state.formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                className={inputClasses(false)}
                placeholder="e.g., Human Resources, IT, Operations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select
                value={state.formData.experienceLevel}
                onChange={(e) => updateFormData('experienceLevel', e.target.value)}
                className={inputClasses(false)}
              >
                <option value="">Select Experience Level</option>
                {FORM_OPTIONS.experienceLevels.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'inquiry':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Inquiry Type
                </label>
                <select
                  value={state.formData.inquiryType}
                  onChange={(e) => updateFormData('inquiryType', e.target.value)}
                  className={inputClasses(!!state.errors.inquiryType)}
                >
                  <option value="">Select Inquiry Type</option>
                  {FORM_OPTIONS.inquiryTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.inquiryType && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.inquiryType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Contact Method *
                </label>
                <select
                  value={state.formData.preferredContactMethod}
                  onChange={(e) => updateFormData('preferredContactMethod', e.target.value)}
                  className={inputClasses(!!state.errors.preferredContactMethod)}
                >
                  <option value="">Select Contact Method</option>
                  {FORM_OPTIONS.contactMethods.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.preferredContactMethod && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.preferredContactMethod}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Urgency Level *
                </label>
                <select
                  value={state.formData.urgencyLevel}
                  onChange={(e) => updateFormData('urgencyLevel', e.target.value)}
                  className={inputClasses(!!state.errors.urgencyLevel)}
                >
                  <option value="">Select Urgency</option>
                  {FORM_OPTIONS.urgencyLevels.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.urgencyLevel && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.urgencyLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Range *
                </label>
                <select
                  value={state.formData.budgetRange}
                  onChange={(e) => updateFormData('budgetRange', e.target.value)}
                  className={inputClasses(!!state.errors.budgetRange)}
                >
                  <option value="">Select Budget</option>
                  {FORM_OPTIONS.budgetRanges.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.budgetRange && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.budgetRange}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeline *
              </label>
              <select
                value={state.formData.timeline}
                onChange={(e) => updateFormData('timeline', e.target.value)}
                className={inputClasses(!!state.errors.timeline)}
              >
                <option value="">Select Timeline</option>
                {FORM_OPTIONS.timelines.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {state.errors.timeline && (
                <p className="text-red-600 text-xs mt-1">{state.errors.timeline}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills / Areas of Interest * (Select multiple)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                {FORM_OPTIONS.courseInterestOptions.map(skill => (
                  <label key={skill.value} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.formData.courseInterest.includes(skill.value)}
                      onChange={(e) => {
                        const currentSkills = state.formData.courseInterest;
                        if (e.target.checked) {
                          updateFormData('courseInterest', [...currentSkills, skill.value]);
                        } else {
                          updateFormData('courseInterest', currentSkills.filter(s => s !== skill.value));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {skill.label}
                      <span className="text-xs text-gray-500 ml-1">({skill.category})</span>
                    </span>
                  </label>
                ))}
              </div>
              {state.errors.courseInterest && (
                <p className="text-red-600 text-xs mt-1">{state.errors.courseInterest}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How did you hear about us?
              </label>
              <select
                value={state.formData.heardAboutUs}
                onChange={(e) => updateFormData('heardAboutUs', e.target.value)}
                className={inputClasses(false)}
              >
                <option value="">Select an option</option>
                {FORM_OPTIONS.heardAboutUsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detailed Hiring Requirements *
              </label>
              <textarea
                rows={4}
                value={state.formData.additionalRequirements}
                onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                className={inputClasses(!!state.errors.additionalRequirements)}
                placeholder="Please describe your hiring requirements, role specifications, required skills, experience level, any specific qualifications, work arrangement preferences, and any other important details..."
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {state.formData.additionalRequirements.length}/2000 characters
              </div>
              {state.errors.additionalRequirements && (
                <p className="text-red-600 text-xs mt-1">{state.errors.additionalRequirements}</p>
              )}
            </div>
          </div>
        );

      case 'consent':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center">
                <Handshake className="w-5 h-5 mr-2" />
                Ready to Connect with Top Talent
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm">
                Please review your information and accept the required terms before submitting your inquiry.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="termsAndPrivacy"
                  checked={state.formData.termsAndPrivacy}
                  onChange={(e) => updateFormData('termsAndPrivacy', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="termsAndPrivacy" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms-and-services" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  . *
                </label>
              </div>
              {state.errors.termsAndPrivacy && (
                <p className="text-red-600 text-xs ml-8">{state.errors.termsAndPrivacy}</p>
              )}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="dataCollectionConsent"
                  checked={state.formData.dataCollectionConsent}
                  onChange={(e) => updateFormData('dataCollectionConsent', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="dataCollectionConsent" className="text-sm text-gray-700 dark:text-gray-300">
                  I consent to the collection and processing of my data for the purpose of handling this hire from medh inquiry and providing relevant services. *
                </label>
              </div>
              {state.errors.dataCollectionConsent && (
                <p className="text-red-600 text-xs ml-8">{state.errors.dataCollectionConsent}</p>
              )}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={state.formData.marketingConsent}
                  onChange={(e) => updateFormData('marketingConsent', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="marketingConsent" className="text-sm text-gray-700 dark:text-gray-300">
                  I would like to receive updates about new talent pools and hiring solutions. (Optional)
                </label>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                What happens next?
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✅ You'll receive an instant confirmation email</li>
                <li>📞 Our partnerships specialist will contact you within 24 hours</li>
                <li>👥 We'll discuss your hiring requirements and identify suitable candidates</li>
                <li>🎯 Receive curated profiles of qualified MEDH-certified professionals</li>
                <li>🤝 Schedule interviews and connect with your ideal candidates</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className={`w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className}`}
      suppressHydrationWarning={true}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Hire from Medh
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with our talented pool of certified professionals. Tell us your requirements and we'll find the perfect match for your organization.
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {['contact', 'professional', 'inquiry', 'consent'].indexOf(state.step) + 1} of 4</span>
            <span>{Math.round(getStepProgress(state.step))}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress(state.step)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {getStepTitle(state.step)}
            </h3>
            
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with Navigation */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={state.step === 'contact'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            state.step === 'contact'
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {state.step === 'consent' ? (
          <button
            onClick={handleSubmit}
            disabled={submissionLoading || state.isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {(submissionLoading || state.isSubmitting) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EmbeddedHireForm; 