"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle,
  User,
  Building,
  Target,
  FileText,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  Globe
} from 'lucide-react';

// Form data interface
interface FormData {
  // Step 1: Contact Info
  full_name: string;
  email: string;
  country: string;
  phone: string;
  
  // Step 2: Company Info
  company_name: string;
  company_website: string;
  department: string;
  team_size: string;
  
  // Step 3: Requirements
  requirement_type: string;
  training_domain: string;
  start_date: string;
  budget_range: string;
  detailed_requirements: string;
  document_upload?: File;
  
  // Step 4: Terms
  terms_accepted: boolean;
}

// Step configuration
const STEPS = [
  {
    stepId: "contact_info",
    title: "Step 1: Your Information",
    description: "Tell us who you are.",
    icon: User
  },
  {
    stepId: "company_info", 
    title: "Step 2: Company Details",
    description: "Tell us about your organization.",
    icon: Building
  },
  {
    stepId: "request_info",
    title: "Step 3: Your Requirements", 
    description: "What are you looking for?",
    icon: Target
  },
  {
    stepId: "terms",
    title: "Step 4: Final Review",
    description: "Agree to proceed.",
    icon: FileText
  }
];

const COUNTRIES = [
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'AE', name: 'UAE', dialCode: '+971' }
];

const MultiStepHireForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    country: '',
    phone: '',
    company_name: '',
    company_website: '',
    department: '',
    team_size: '',
    requirement_type: '',
    training_domain: '',
    start_date: '',
    budget_range: '',
    detailed_requirements: '',
    terms_accepted: false
  });

  // Auto-map dialing code when country changes
  useEffect(() => {
    const selectedCountry = COUNTRIES.find(c => c.code === formData.country);
    if (selectedCountry && !formData.phone.startsWith(selectedCountry.dialCode)) {
      setFormData(prev => ({
        ...prev,
        phone: selectedCountry.dialCode + ' '
      }));
    }
  }, [formData.country]);

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Contact Info
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;

      case 1: // Company Info
        if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.team_size) newErrors.team_size = 'Team size is required';
        if (formData.company_website && !/^https?:\/\/.+/.test(formData.company_website)) {
          newErrors.company_website = 'Please enter a valid URL (include http:// or https://)';
        }
        break;

      case 2: // Requirements
        if (!formData.requirement_type) newErrors.requirement_type = 'Please select your requirement type';
        if (!formData.training_domain.trim()) newErrors.training_domain = 'Training domain is required';
        if (!formData.detailed_requirements.trim()) newErrors.detailed_requirements = 'Detailed requirements are required';
        else if (formData.detailed_requirements.length < 20) newErrors.detailed_requirements = 'Please provide at least 20 characters';
        break;

      case 3: // Terms
        if (!formData.terms_accepted) newErrors.terms_accepted = 'You must accept the terms to proceed';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, document_upload: 'File size must be less than 5MB' }));
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, document_upload: 'Only PDF and DOCX files are allowed' }));
      return;
    }
    
    setFormData(prev => ({ ...prev, document_upload: file }));
    setErrors(prev => ({ ...prev, document_upload: '' }));
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You for Your Request!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          ✅ Thank you for submitting your request. Our partnerships team will contact you shortly.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <span>🔐</span>
          <span>We value your privacy and keep all submitted data secure and confidential.</span>
        </div>
      </motion.div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Contact Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g., Radhika Sharma"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.full_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., radhika@company.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter mobile number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        );

      case 1: // Company Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="e.g., TechNova Solutions"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.company_website}
                onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                placeholder="https://www.yourcompany.com"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company_website ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.company_website && <p className="text-red-500 text-sm mt-1">{errors.company_website}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department or Function *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Engineering, Marketing, HR"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size for Training or Hiring *
              </label>
              <select
                value={formData.team_size}
                onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.team_size ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <option value="">Select team size</option>
                <option value="1–5">1–5</option>
                <option value="6–20">6–20</option>
                <option value="21–50">21–50</option>
                <option value="50+">50+</option>
              </select>
              {errors.team_size && <p className="text-red-500 text-sm mt-1">{errors.team_size}</p>}
            </div>
          </div>
        );

      case 2: // Requirements
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What do you need? *
              </label>
              <div className="space-y-3">
                {['Hire Medh-trained Candidates', 'Corporate Upskilling/Training', 'Both'].map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="requirement_type"
                      value={option}
                      checked={formData.requirement_type === option}
                      onChange={(e) => setFormData(prev => ({ ...prev, requirement_type: e.target.value }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
              {errors.requirement_type && <p className="text-red-500 text-sm mt-1">{errors.requirement_type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Domain or Skills *
              </label>
              <input
                type="text"
                value={formData.training_domain}
                onChange={(e) => setFormData(prev => ({ ...prev, training_domain: e.target.value }))}
                placeholder="e.g., Full Stack Web Development, UI/UX, DevOps"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.training_domain ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.training_domain && <p className="text-red-500 text-sm mt-1">{errors.training_domain}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.budget_range}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                    placeholder="e.g., ₹50,000 – ₹1,00,000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Requirements *
              </label>
              <textarea
                value={formData.detailed_requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, detailed_requirements: e.target.value }))}
                placeholder="Share any additional info: timelines, interview preferences, project context, etc."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.detailed_requirements ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.detailed_requirements && <p className="text-red-500 text-sm">{errors.detailed_requirements}</p>}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.detailed_requirements.length}/20 min
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload JD or Document (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or DOCX (max 5MB)
                  </p>
                </label>
                {formData.document_upload && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-sm text-green-600">✓ {formData.document_upload.name}</span>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, document_upload: undefined }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {errors.document_upload && <p className="text-red-500 text-sm mt-1">{errors.document_upload}</p>}
            </div>
          </div>
        );

      case 3: // Terms
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What You'll Get
              </h4>
              <div className="space-y-3">
                {[
                  "✅ Pre-trained, job-ready talent",
                  "🎯 Custom training programs for your team", 
                  "🛠️ Hands-on project-based learning",
                  "📄 Certification from Medh",
                  "💬 Dedicated hiring/training support",
                  "🔁 Option to retrain or rehire as needed"
                ].map((benefit, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    {benefit}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.terms_accepted}
                onChange={(e) => setFormData(prev => ({ ...prev, terms_accepted: e.target.checked }))}
                className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 ${errors.terms_accepted ? 'border-red-500' : ''}`}
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                I agree to Medh's Terms & Privacy Policy. *
              </label>
            </div>
            {errors.terms_accepted && <p className="text-red-500 text-sm">{errors.terms_accepted}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Hire from Medh – Corporate Talent & Upskilling Inquiry
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with industry-ready professionals trained by Medh or request a custom training solution for your team.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.stepId} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index <= currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-2 transition-colors ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {STEPS[currentStep]?.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {STEPS[currentStep]?.description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepHireForm; 