"use client";

/**
 * Embedded Corporate Training Inquiry Form
 * 
 * Enhanced multi-step form for corporate training inquiries following
 * the corporate.api.ts structure and EmbeddedDemoForm.tsx patterns.
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
  BookOpen, TrendingUp, MessageSquare, Settings, Shield
} from 'lucide-react';

// API and Types
import { 
  ICorporateTrainingInquiryPayload,
  IContactInfo,
  IProfessionalInfo,
  ITrainingRequirements,
  IInquiryDetails,
  IConsent,
  TIndustry,
  TCompanySize,
  TExperienceLevel,
  TTrainingType,
  TTrainingMode,
  TDurationPreference,
  TBudgetRange,
  TTimeline,
  TContactMethod,
  TUrgencyLevel,
  CorporateFormValidationService
} from '@/apis/corporate.api';

// Hooks
import usePostQuery from '@/hooks/postQuery.hook';

// Phone Number Component
import PhoneNumberInput from '../shared/login/PhoneNumberInput';

// Form Steps Type
type TFormStep = 'contact' | 'professional' | 'training' | 'consent';

// Form State Interface
interface IEmbeddedCorporateFormState {
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
    
    // Training Requirements
    trainingType: TTrainingType | '';
    trainingMode: TTrainingMode | '';
    participantsCount: number;
    durationPreference: TDurationPreference | '';
    budgetRange: TBudgetRange | '';
    timeline: TTimeline | '';
    specificSkills: string[];
    customRequirements: string;
    hasExistingLms: boolean;
    lmsIntegrationNeeded: boolean;
    
    // Inquiry Details
    preferredContactMethod: TContactMethod | '';
    urgencyLevel: TUrgencyLevel | '';
    courseInterest: string[];
    heardAboutUs: string;
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
interface EmbeddedCorporateFormProps {
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
    { label: '500+ employees', value: '500+' }
  ],
  experienceLevels: [
    { label: 'Entry Level', value: 'entry' },
    { label: 'Mid Level', value: 'mid' },
    { label: 'Senior Level', value: 'senior' },
    { label: 'Executive Level', value: 'executive' }
  ],
  trainingTypes: [
    { label: 'Technical Skills Training', value: 'technical_skills' },
    { label: 'Soft Skills Development', value: 'soft_skills' },
    { label: 'Leadership Development', value: 'leadership' },
    { label: 'Compliance Training', value: 'compliance' },
    { label: 'Product Training', value: 'product_training' },
    { label: 'Sales Training', value: 'sales_training' },
    { label: 'Customer Service', value: 'customer_service' },
    { label: 'Digital Transformation', value: 'digital_transformation' },
    { label: 'Other', value: 'other' }
  ],
  trainingModes: [
    { label: 'Online Training', value: 'online' },
    { label: 'On-site Training', value: 'onsite' },
    { label: 'Hybrid Training', value: 'hybrid' },
    { label: 'Flexible Delivery', value: 'flexible' }
  ],
  durationPreferences: [
    { label: '1 Day Workshop', value: '1_day' },
    { label: '2-3 Days', value: '2-3_days' },
    { label: '1 Week', value: '1_week' },
    { label: '2-4 Weeks', value: '2-4_weeks' },
    { label: '1-3 Months', value: '1-3_months' },
    { label: 'Ongoing Program', value: 'ongoing' }
  ],
  budgetRanges: [
    { label: 'Under ₹1 Lakh', value: 'under_1l' },
    { label: '₹1-5 Lakhs', value: '1l_5l' },
    { label: '₹5-10 Lakhs', value: '5l_10l' },
    { label: '₹10-25 Lakhs', value: '10l_25l' },
    { label: '₹25-50 Lakhs', value: '25l_50l' },
    { label: '₹50+ Lakhs', value: '50l_plus' },
    { label: 'Prefer not to disclose', value: 'not_disclosed' }
  ],
  timelines: [
    { label: 'Immediate (Within 2 weeks)', value: 'immediate' },
    { label: 'Within a month', value: 'within_month' },
    { label: 'Within 3 months', value: 'within_quarter' },
    { label: 'Within 6 months', value: 'within_6months' },
    { label: 'Flexible timeline', value: 'flexible' }
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
  specificSkills: [
    'Python Programming',
    'Data Science & Analytics',
    'Machine Learning',
    'AI Implementation',
    'Digital Marketing',
    'Project Management',
    'Leadership Skills',
    'Communication Skills',
    'Team Building',
    'Customer Service Excellence',
    'Sales Techniques',
    'Time Management',
    'Cybersecurity Awareness',
    'Cloud Computing',
    'DevOps Practices',
    'Quality Management',
    'Change Management',
    'Strategic Planning'
  ]
};

// Enhanced Country Options with comprehensive list (matching demo form)
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

// Countries data for phone number mapping (enhanced)
const COUNTRIES = [
  { code: 'in', name: 'India', dial_code: '+91' },
  { code: 'us', name: 'United States', dial_code: '+1' },
  { code: 'gb', name: 'United Kingdom', dial_code: '+44' },
  { code: 'ca', name: 'Canada', dial_code: '+1' },
  { code: 'au', name: 'Australia', dial_code: '+61' },
  { code: 'ae', name: 'United Arab Emirates', dial_code: '+971' },
  { code: 'sg', name: 'Singapore', dial_code: '+65' },
  { code: 'de', name: 'Germany', dial_code: '+49' },
  { code: 'fr', name: 'France', dial_code: '+33' },
  { code: 'it', name: 'Italy', dial_code: '+39' },
  { code: 'nl', name: 'Netherlands', dial_code: '+31' },
  { code: 'jp', name: 'Japan', dial_code: '+81' },
  { code: 'kr', name: 'South Korea', dial_code: '+82' },
  { code: 'cn', name: 'China', dial_code: '+86' },
  { code: 'br', name: 'Brazil', dial_code: '+55' },
  { code: 'mx', name: 'Mexico', dial_code: '+52' },
  { code: 'za', name: 'South Africa', dial_code: '+27' },
  { code: 'eg', name: 'Egypt', dial_code: '+20' },
  { code: 'ng', name: 'Nigeria', dial_code: '+234' },
  { code: 'ke', name: 'Kenya', dial_code: '+254' },
  { code: 'pk', name: 'Pakistan', dial_code: '+92' },
  { code: 'bd', name: 'Bangladesh', dial_code: '+880' },
  { code: 'lk', name: 'Sri Lanka', dial_code: '+94' },
  { code: 'my', name: 'Malaysia', dial_code: '+60' },
  { code: 'th', name: 'Thailand', dial_code: '+66' },
  { code: 'ph', name: 'Philippines', dial_code: '+63' },
  { code: 'id', name: 'Indonesia', dial_code: '+62' },
  { code: 'vn', name: 'Vietnam', dial_code: '+84' },
  { code: 'tr', name: 'Turkey', dial_code: '+90' },
  { code: 'sa', name: 'Saudi Arabia', dial_code: '+966' },
  { code: 'qa', name: 'Qatar', dial_code: '+974' },
  { code: 'kw', name: 'Kuwait', dial_code: '+965' },
  { code: 'bh', name: 'Bahrain', dial_code: '+973' },
  { code: 'om', name: 'Oman', dial_code: '+968' },
  { code: 'jo', name: 'Jordan', dial_code: '+962' },
  { code: 'lb', name: 'Lebanon', dial_code: '+961' },
  { code: 'il', name: 'Israel', dial_code: '+972' },
  { code: 'ru', name: 'Russia', dial_code: '+7' },
  { code: 'ua', name: 'Ukraine', dial_code: '+380' },
  { code: 'pl', name: 'Poland', dial_code: '+48' },
  { code: 'es', name: 'Spain', dial_code: '+34' },
  { code: 'pt', name: 'Portugal', dial_code: '+351' },
  { code: 'ar', name: 'Argentina', dial_code: '+54' },
  { code: 'cl', name: 'Chile', dial_code: '+56' },
  { code: 'co', name: 'Colombia', dial_code: '+57' },
  { code: 'nz', name: 'New Zealand', dial_code: '+64' }
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
const EmbeddedCorporateForm: React.FC<EmbeddedCorporateFormProps> = ({ 
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

  // Select styles with high z-index (matching demo form)
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

  // Initialize form state
  const [state, setState] = useState<IEmbeddedCorporateFormState>({
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
      
      // Training Requirements
      trainingType: '',
      trainingMode: '',
      participantsCount: 1,
      durationPreference: '',
      budgetRange: '',
      timeline: '',
      specificSkills: [],
      customRequirements: '',
      hasExistingLms: false,
      lmsIntegrationNeeded: false,
      
      // Inquiry Details
      preferredContactMethod: '',
      urgencyLevel: '',
      courseInterest: [],
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
      localStorage.setItem('corporateFormDraft', JSON.stringify(dataToSave));
      console.log('📦 Form auto-saved to localStorage');
    } catch (error) {
      console.warn('Failed to auto-save form data:', error);
    }
  }, [mounted, state.step, state.formData]);

  // Load saved data on mount (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem('corporateFormDraft');
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
          localStorage.removeItem('corporateFormDraft');
          console.log('🗑️ Old form data cleaned up');
        }
      }
    } catch (error) {
      console.warn('Could not restore form data:', error);
      try {
        localStorage.removeItem('corporateFormDraft');
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
        if (!formData.designation.trim() || formData.designation.trim().length < 2) {
          newErrors.designation = 'Job designation is required (minimum 2 characters)';
        }
        if (!formData.companyName.trim() || formData.companyName.trim().length < 2) {
          newErrors.companyName = 'Company name is required (minimum 2 characters)';
        }
        if (formData.companyWebsite && !validateWebsite(formData.companyWebsite)) {
          newErrors.companyWebsite = 'Please enter a valid website URL';
        }
        if (!formData.industry) {
          newErrors.industry = 'Please select an industry';
        }
        if (!formData.companySize) {
          newErrors.companySize = 'Please select company size';
        }
        break;

      case 'training':
        if (!formData.trainingType) {
          newErrors.trainingType = 'Please select a training type';
        }
        if (!formData.trainingMode) {
          newErrors.trainingMode = 'Please select a training mode';
        }
        if (!formData.participantsCount || formData.participantsCount < 1) {
          newErrors.participantsCount = 'Number of participants must be at least 1';
        }
        if (!formData.durationPreference) {
          newErrors.durationPreference = 'Please select a duration preference';
        }
        if (!formData.budgetRange) {
          newErrors.budgetRange = 'Please select a budget range';
        }
        if (!formData.timeline) {
          newErrors.timeline = 'Please select a timeline';
        }
        if (formData.specificSkills.length === 0) {
          newErrors.specificSkills = 'Please select at least one specific skill';
        }
        if (!formData.customRequirements.trim() || formData.customRequirements.trim().length < 10) {
          newErrors.customRequirements = 'Please provide detailed training requirements (minimum 10 characters)';
        }
        if (!formData.preferredContactMethod) {
          newErrors.preferredContactMethod = 'Please select preferred contact method';
        }
        if (!formData.urgencyLevel) {
          newErrors.urgencyLevel = 'Please select urgency level';
        }
        break;
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      const steps: TFormStep[] = ['contact', 'professional', 'training', 'consent'];
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
    const steps: TFormStep[] = ['contact', 'professional', 'training', 'consent'];
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
    
    // Client-side validation before API call
    const validationResult = CorporateFormValidationService.validateCorporateTrainingForm({
      contact_info: {
        first_name: state.formData.firstName,
        last_name: state.formData.lastName,
        full_name: `${state.formData.firstName} ${state.formData.lastName}`.trim(),
        email: state.formData.email,
        mobile_number: {
          country_code: COUNTRIES.find(c => c.code === state.formData.mobileCountryCode)?.dial_code || '+91',
          number: state.formData.mobileNumber
        },
        city: state.formData.city,
        country: state.formData.country
      },
      professional_info: {
        designation: state.formData.designation,
        company_name: state.formData.companyName,
        company_website: state.formData.companyWebsite || undefined,
        industry: state.formData.industry as TIndustry,
        company_size: state.formData.companySize as TCompanySize
      },
      training_requirements: {
        training_type: state.formData.trainingType as TTrainingType,
        training_mode: state.formData.trainingMode as TTrainingMode,
        participants_count: state.formData.participantsCount,
        duration_preference: state.formData.durationPreference as TDurationPreference,
        budget_range: state.formData.budgetRange as TBudgetRange,
        timeline: state.formData.timeline as TTimeline,
        specific_skills: state.formData.specificSkills,
        custom_requirements: state.formData.customRequirements,
        has_existing_lms: state.formData.hasExistingLms,
        lms_integration_needed: state.formData.lmsIntegrationNeeded
      },
      inquiry_details: {
        inquiry_type: 'corporate_training',
        preferred_contact_method: state.formData.preferredContactMethod as TContactMethod,
        urgency_level: state.formData.urgencyLevel as TUrgencyLevel,
        course_interest: state.formData.courseInterest
      },
      consent: {
        terms_and_privacy: state.formData.termsAndPrivacy,
        data_collection_consent: state.formData.dataCollectionConsent,
        marketing_consent: state.formData.marketingConsent
      }
    } as any);

    if (!validationResult.isValid) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      const errorMessages = validationResult.errors.map(err => err.message).join(', ');
      toast.error(`Validation failed: ${errorMessages}`);
      return;
    }

    try {
      // Transform form data to API payload with form_type at root
      const payload = {
        // Root level form_type as required by the API
        form_type: 'corporate_training_inquiry',
        
        // Form configuration
        form_config: {
          form_type: 'corporate_training_inquiry',
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
        professional_info: {
          designation: state.formData.designation,
          company_name: state.formData.companyName,
          company_website: state.formData.companyWebsite || undefined,
          industry: state.formData.industry as TIndustry,
          company_size: state.formData.companySize as TCompanySize,
          department: state.formData.department || undefined,
          experience_level: state.formData.experienceLevel as TExperienceLevel
        },
        training_requirements: {
          training_type: state.formData.trainingType as TTrainingType,
          training_mode: state.formData.trainingMode as TTrainingMode,
          participants_count: state.formData.participantsCount,
          duration_preference: state.formData.durationPreference as TDurationPreference,
          budget_range: state.formData.budgetRange as TBudgetRange,
          timeline: state.formData.timeline as TTimeline,
          specific_skills: state.formData.specificSkills,
          custom_requirements: state.formData.customRequirements,
          has_existing_lms: state.formData.hasExistingLms,
          lms_integration_needed: state.formData.lmsIntegrationNeeded
        },
        inquiry_details: {
          inquiry_type: 'corporate_training',
          preferred_contact_method: state.formData.preferredContactMethod as TContactMethod,
          urgency_level: state.formData.urgencyLevel as TUrgencyLevel,
          course_interest: state.formData.courseInterest,
          heard_about_us: state.formData.heardAboutUs || undefined,
          additional_requirements: state.formData.additionalRequirements || undefined
        },
        consent: {
          terms_and_privacy: state.formData.termsAndPrivacy,
          data_collection_consent: state.formData.dataCollectionConsent,
          marketing_consent: state.formData.marketingConsent
        }
      };

      console.log('🚀 Submitting Corporate Training Inquiry:', payload);

      // Call the API using postQuery hook
      const response = await postQuery({
        url: '/forms/submit',
        postData: payload,
        requireAuth: false,
        enableToast: false, // We'll handle toasts manually for better control
        onSuccess: (data) => {
          console.log('✅ Corporate Training Inquiry Submitted Successfully:', data);
          
          // Clean up localStorage (client-side only)
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('corporateFormDraft');
              console.log('🔄 Form reset for next submission');
            } catch (error) {
              console.warn('Failed to clean up form data:', error);
            }
          }
          
          toast.success('🎉 Corporate training inquiry submitted successfully! Our team will contact you within 24 hours.');
          
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
              designation: '',
              companyName: '',
              trainingType: '',
              customRequirements: '',
              termsAndPrivacy: false,
              dataCollectionConsent: false
            }
          }));
        },
        onFail: (error) => {
          console.error('❌ Corporate Training Inquiry Submission Failed:', error);
          
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit corporate training inquiry';
          toast.error(`Submission failed: ${errorMessage}. Please try again.`);
          
          if (onSubmitError) {
            onSubmitError(error);
          }
        }
      });

      console.log('📡 API Response:', response);



    } catch (error) {
      console.error('❌ Corporate Training Inquiry Submission Error:', error);
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
      case 'training': return 'Training Requirements';
      case 'consent': return 'Consent & Submission';
      default: return '';
    }
  };

  // Get step progress
  const getStepProgress = (step: TFormStep) => {
    const steps: TFormStep[] = ['contact', 'professional', 'training', 'consent'];
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(option => option.value === state.formData.country)}
                  onChange={(selected) => updateFormData('country', selected?.value || 'in')}
                  styles={{
                    ...selectStyles,
                    control: (provided: any, state: any) => ({
                      ...provided,
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: state.isFocused ? '#6366f1' : isDark ? '#374151' : '#d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                      minHeight: '42px',
                      fontSize: '14px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: isDark ? '#4b5563' : '#9ca3af'
                      }
                    }),
                    placeholder: (provided: any) => ({
                      ...provided,
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontSize: '14px'
                    }),
                    singleValue: (provided: any) => ({
                      ...provided,
                      color: isDark ? '#ffffff' : '#1f2937',
                      fontSize: '14px',
                      fontWeight: '500'
                    })
                  }}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title / Designation *
              </label>
              <input
                type="text"
                value={state.formData.designation}
                onChange={(e) => updateFormData('designation', e.target.value)}
                className={inputClasses(!!state.errors.designation)}
                placeholder="e.g., Learning & Development Manager"
              />
              {state.errors.designation && (
                <p className="text-red-600 text-xs mt-1">{state.errors.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
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
                Company Website (Optional)
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
                  Industry *
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
                  Company Size *
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
                Department (Optional)
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
                Experience Level (Optional)
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

      case 'training':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training Type *
                </label>
                <select
                  value={state.formData.trainingType}
                  onChange={(e) => updateFormData('trainingType', e.target.value)}
                  className={inputClasses(!!state.errors.trainingType)}
                >
                  <option value="">Select Training Type</option>
                  {FORM_OPTIONS.trainingTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.trainingType && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.trainingType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training Mode *
                </label>
                <select
                  value={state.formData.trainingMode}
                  onChange={(e) => updateFormData('trainingMode', e.target.value)}
                  className={inputClasses(!!state.errors.trainingMode)}
                >
                  <option value="">Select Training Mode</option>
                  {FORM_OPTIONS.trainingModes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.trainingMode && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.trainingMode}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Participants Count *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={state.formData.participantsCount}
                  onChange={(e) => updateFormData('participantsCount', parseInt(e.target.value) || 1)}
                  className={inputClasses(!!state.errors.participantsCount)}
                  placeholder="e.g., 25"
                />
                {state.errors.participantsCount && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.participantsCount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration Preference *
                </label>
                <select
                  value={state.formData.durationPreference}
                  onChange={(e) => updateFormData('durationPreference', e.target.value)}
                  className={inputClasses(!!state.errors.durationPreference)}
                >
                  <option value="">Select Duration</option>
                  {FORM_OPTIONS.durationPreferences.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.durationPreference && (
                  <p className="text-red-600 text-xs mt-1">{state.errors.durationPreference}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specific Skills / Training Areas * (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                {FORM_OPTIONS.specificSkills.map(skill => (
                  <label key={skill} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.formData.specificSkills.includes(skill)}
                      onChange={(e) => {
                        const currentSkills = state.formData.specificSkills;
                        if (e.target.checked) {
                          updateFormData('specificSkills', [...currentSkills, skill]);
                        } else {
                          updateFormData('specificSkills', currentSkills.filter(s => s !== skill));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
              {state.errors.specificSkills && (
                <p className="text-red-600 text-xs mt-1">{state.errors.specificSkills}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detailed Training Requirements *
              </label>
              <textarea
                rows={4}
                value={state.formData.customRequirements}
                onChange={(e) => updateFormData('customRequirements', e.target.value)}
                className={inputClasses(!!state.errors.customRequirements)}
                placeholder="Please describe your specific training needs, learning objectives, preferred delivery format, duration expectations, and any other requirements..."
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {state.formData.customRequirements.length}/2000 characters
              </div>
              {state.errors.customRequirements && (
                <p className="text-red-600 text-xs mt-1">{state.errors.customRequirements}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasExistingLms"
                  checked={state.formData.hasExistingLms}
                  onChange={(e) => updateFormData('hasExistingLms', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasExistingLms" className="text-sm text-gray-700 dark:text-gray-300">
                  We have an existing Learning Management System (LMS)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lmsIntegrationNeeded"
                  checked={state.formData.lmsIntegrationNeeded}
                  onChange={(e) => updateFormData('lmsIntegrationNeeded', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="lmsIntegrationNeeded" className="text-sm text-gray-700 dark:text-gray-300">
                  We need LMS integration with the training program
                </label>
              </div>
            </div>
          </div>
        );

      case 'consent':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Ready to Submit Your Corporate Training Inquiry
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
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
                  I consent to the collection and processing of my data for the purpose of handling this corporate training inquiry and providing relevant services. *
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
                  I would like to receive updates about new training programs and special offers. (Optional)
                </label>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✅ You'll receive an instant confirmation email</li>
                <li>📞 Our corporate training specialist will contact you within 24 hours</li>
                <li>📋 We'll discuss your specific requirements and provide a customized proposal</li>
                <li>🎯 Schedule a demo session or consultation call based on your preferences</li>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Corporate Training Inquiry
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your training needs and we'll create a customized solution for your organization.
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {['contact', 'professional', 'training', 'consent'].indexOf(state.step) + 1} of 4</span>
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

export default EmbeddedCorporateForm; 