"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'sonner';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Send,
  ExternalLink,
  Award,
  Globe,
  X
} from "lucide-react";

// API imports
import { submitContactForm, IContactFormData } from '@/apis/form.api';
import countriesData from "@/utils/countrycode.json";
import PhoneNumberInput from '../../shared/login/PhoneNumberInput';

// Types
interface IJobApplicationData {
  fullName: string;
  email: string;
  country: string;
  mobile: {
    country: string;
    number: string;
  };
  experience?: string;
  skills?: string;
  portfolio?: string;
  linkedin?: string;
  resume: File | null;
  coverLetter: string;
  termsAccepted: boolean;
}

interface IFormStep {
  id: number;
  title: string;
  subtitle: string;
  fields: (keyof IJobApplicationData)[];
}

// Form steps
const FORM_STEPS: IFormStep[] = [
  {
    id: 1,
    title: "Personal Information",
    subtitle: "Tell us about yourself",
    fields: ["fullName", "email", "country", "mobile"]
  },
  {
    id: 2,
    title: "Professional Background",
    subtitle: "Share your experience and skills",
    fields: ["experience", "skills", "portfolio", "linkedin"]
  },
  {
    id: 3,
    title: "Documents & Cover Letter",
    subtitle: "Upload your resume and write a cover letter",
    fields: ["resume", "coverLetter"]
  },
  {
    id: 4,
    title: "Review & Submit",
    subtitle: "Review your application before submitting",
    fields: ["termsAccepted"]
  }
];

// Validation schemas
const phoneNumberSchema = yup.object({
  country: yup.string().required('Country code is required'),
  number: yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .required('Phone number is required'),
});

const validationSchema = yup.object({
  fullName: yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .required("Full name is required"),
  
  email: yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),
  
  country: yup.string().required("Country is required"),
  
  mobile: phoneNumberSchema,
  
  experience: yup.string()
    .trim()
    .max(500, "Experience description cannot exceed 500 characters")
    .optional(),
  
  skills: yup.string()
    .trim()
    .max(500, "Skills description cannot exceed 500 characters")
    .optional(),
  
  portfolio: yup.string()
    .trim()
    .url("Please enter a valid URL")
    .optional()
    .nullable()
    .transform(value => value === '' ? null : value),
  
  linkedin: yup.string()
    .trim()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .nullable()
    .transform(value => value === '' ? null : value),
  
  resume: yup.mixed<File>()
    .required("Resume is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only PDF, DOC, and DOCX files are allowed", (value) => {
      if (!value) return false;
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      return allowedTypes.includes(value.type);
    }),
  
  coverLetter: yup.string()
    .trim()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter cannot exceed 2000 characters")
    .required("Cover letter is required"),
  
  termsAccepted: yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

// Enhanced form components
interface FormInputProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  placeholder,
  type = "text",
  required = false,
  ...props
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className={`
            block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
            text-base font-medium
            ${error
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
            }
            dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

const FormTextArea: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  placeholder,
  required = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute top-4 left-4 pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`
            block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
            text-base font-medium
            ${error
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
            }
            dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

const FileUpload: React.FC<{
  label: string;
  error?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
}> = ({ label, error, file, onFileChange, accept = ".pdf,.doc,.docx", required = false }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const removeFile = () => {
    onFileChange(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer
              transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800
              ${error
                ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center py-8 px-6">
              <Upload className={`w-10 h-10 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              <p className="mb-2 text-base font-medium text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PDF, DOC, DOCX (MAX. 5MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            <div>
              <span className="text-base font-semibold text-green-800 dark:text-green-200 block">
                {file.name}
              </span>
              <span className="text-sm text-green-600 dark:text-green-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

// Progress indicator
const ProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}> = ({ currentStep, totalSteps, completedSteps }) => {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        {FORM_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg
                  ${index + 1 === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800'
                    : completedSteps.includes(index + 1)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}
              >
                {completedSteps.includes(index + 1) ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  step.id
                )}
              </div>
              <span className={`
                text-sm font-semibold text-center max-w-24 leading-tight
                ${index + 1 === currentStep
                  ? 'text-blue-600 dark:text-blue-400'
                  : completedSteps.includes(index + 1)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}>
                {step.title}
              </span>
            </div>
            {index < FORM_STEPS.length - 1 && (
              <div className="flex-1 mx-6">
                <div className={`
                  h-1 rounded-full transition-all duration-300
                  ${completedSteps.includes(index + 1)
                    ? 'bg-green-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                  }
                `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

// Main component
interface MultiStepJobApplyProps {
  jobId?: string;
  jobTitle?: string;
}

const MultiStepJobApply: React.FC<MultiStepJobApplyProps> = ({ jobTitle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm<IJobApplicationData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      country: "in",
      mobile: { country: "in", number: "" },
      experience: "",
      skills: "",
      portfolio: "",
      linkedin: "",
      resume: null,
      coverLetter: "",
      termsAccepted: false
    }
  });

  const watchedValues = watch();
  const resumeFile = watch("resume");

  // Navigation handlers
  const goToNextStep = useCallback(async () => {
    const currentStepData = FORM_STEPS[currentStep - 1];
    const fieldsToValidate = currentStepData.fields;
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Form submission
  const onSubmit: SubmitHandler<IJobApplicationData> = async (data) => {
    if (!data.resume) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      setIsSubmitting(true);

      // Format phone number
      const selectedCountry = countriesData.find(
        country => country.code.toLowerCase() === data.mobile.country.toLowerCase()
      );
      const dialCode = selectedCountry?.dial_code || '+91';
      const formattedPhone = `${dialCode}${data.mobile.number}`;

      // Prepare contact form data
      const contactFormData: IContactFormData = {
        full_name: data.fullName,
        email: data.email,
        phone: formattedPhone,
        company: data.country,
        subject: 'Career Application',
        message: `Cover Letter: ${data.coverLetter}\n\nExperience: ${data.experience || 'Not specified'}\n\nSkills: ${data.skills || 'Not specified'}\n\nPortfolio: ${data.portfolio || 'Not provided'}\n\nLinkedIn: ${data.linkedin || 'Not provided'}`,
        inquiry_type: 'general',
        preferred_contact_method: 'email',
        consent_marketing: false,
        consent_terms: data.termsAccepted
      };

      // Submit form with resume attachment
      const response = await submitContactForm(contactFormData, [data.resume]);

      if (response.status === 'success') {
        setIsSuccess(true);
        toast.success('Your application has been submitted successfully!');
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content renderer
  const renderStepContent = () => {
    const currentStepData = FORM_STEPS[currentStep - 1];

    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Step header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <FormInput
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              required
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            
            <FormInput
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="Enter your email address"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 ${errors.country ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <select
                    className={`
                      block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm text-base font-medium
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${errors.country
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
                      }
                      dark:bg-gray-800 dark:border-gray-600 dark:text-white
                    `}
                    {...register("country")}
                  >
                    {countriesData.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.country.message}</span>
                  </motion.div>
                )}
              </div>

              <Controller
                name="mobile"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneNumberInput
                      value={{
                        country: watchedValues.country || 'in',
                        number: field.value?.number || ''
                      }}
                      onChange={field.onChange}
                      placeholder="Enter your phone number"
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Professional Background */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <FormTextArea
              label="Experience"
              icon={Briefcase}
              placeholder="Briefly describe your work experience, skills, and expertise..."
              rows={4}
              error={errors.experience?.message}
              {...register("experience")}
            />

            <FormTextArea
              label="Skills"
              icon={Award}
              placeholder="List your key skills, technologies, and competencies..."
              rows={3}
              error={errors.skills?.message}
              {...register("skills")}
            />

            <FormInput
              label="Portfolio URL"
              icon={ExternalLink}
              type="url"
              placeholder="https://your-portfolio.com"
              error={errors.portfolio?.message}
              {...register("portfolio")}
            />

            <FormInput
              label="LinkedIn Profile"
              icon={Globe}
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              error={errors.linkedin?.message}
              {...register("linkedin")}
            />
          </div>
        )}

        {/* Step 3: Documents & Cover Letter */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <Controller
              name="resume"
              control={control}
              render={({ field, fieldState }) => (
                <FileUpload
                  label="Resume"
                  required
                  file={field.value}
                  onFileChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <FormTextArea
              label="Cover Letter"
              icon={FileText}
              placeholder="Write a compelling cover letter explaining why you're interested in this position and what makes you a great fit..."
              rows={6}
              required
              error={errors.coverLetter?.message}
              {...register("coverLetter")}
            />
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-8">
            {/* Application Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-100 dark:border-gray-700 rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Application Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Full Name:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{watchedValues.fullName}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{watchedValues.email}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Country:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {countriesData.find(c => c.code === watchedValues.country)?.name}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Resume:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {resumeFile?.name || 'Not uploaded'}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-6 mt-1">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                    {...register("termsAccepted")}
                  />
                </div>
                <div className="text-base">
                  <label className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-semibold">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline font-semibold">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              {errors.termsAccepted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm font-medium mt-4 ml-9"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.termsAccepted.message}</span>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto text-center py-16 px-8"
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-12">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Application Submitted Successfully!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Thank you for your interest in joining our team. We'll review your application and get back to you soon.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setCurrentStep(1);
              setCompletedSteps([]);
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Submit Another Application
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {jobTitle ? `Apply for ${jobTitle}` : 'Join Our Team'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Submit your application and be part of our innovative team
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={FORM_STEPS.length}
        completedSteps={completedSteps}
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-10">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base
              ${currentStep === 1
                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          {currentStep < FORM_STEPS.length ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepJobApply;