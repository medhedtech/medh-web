import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  Building,
  FileText,
  Globe,
  Calendar,
  Upload,
  X,
} from "lucide-react";
import {
  submitContactForm,
  submitFeedbackForm,
  submitSupportForm,
  submitEnrollmentForm,
  IContactFormData,
  IFeedbackFormData,
  ISupportFormData,
  IEnrollmentFormData,
  TFormType,
  TFormPriority,
} from "@/apis/form.api";

// Form field configuration interface
interface IFormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox" | "file" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  icon?: React.ElementType;
  validation?: any;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}

// Form configuration interface
interface IFormConfig {
  title: string;
  subtitle?: string;
  formType: TFormType;
  fields: IFormField[];
  submitButtonText?: string;
  successMessage?: string;
  theme?: {
    primaryColor?: string;
    borderRadius?: string;
    spacing?: string;
  };
}

// Universal form props
interface IUniversalFormProps {
  config: IFormConfig;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  className?: string;
  showProgress?: boolean;
  animated?: boolean;
}

// Default validation schemas for different form types
const getValidationSchema = (formType: TFormType, fields: IFormField[]) => {
  const schemaFields: any = {};

  fields.forEach((field) => {
    let validator = yup.string();

    if (field.type === "email") {
      validator = validator.email("Please enter a valid email");
    }

    if (field.type === "tel") {
      validator = validator.matches(/^[0-9+\-\s\(\)]*$/, "Please enter a valid phone number");
    }

    if (field.type === "number") {
      validator = yup.number();
    }

    if (field.type === "file") {
      validator = yup.mixed();
    }

    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    if (field.validation) {
      // Apply custom validation rules
      if (field.validation.min) {
        validator = validator.min(field.validation.min, `${field.label} must be at least ${field.validation.min} characters`);
      }
      if (field.validation.max) {
        validator = validator.max(field.validation.max, `${field.label} must not exceed ${field.validation.max} characters`);
      }
      if (field.validation.pattern) {
        validator = validator.matches(new RegExp(field.validation.pattern), field.validation.message || "Invalid format");
      }
    }

    schemaFields[field.name] = validator;
  });

  return yup.object().shape(schemaFields);
};

// Form field component
const FormField: React.FC<{
  field: IFormField;
  register: any;
  errors: any;
  watch?: any;
  setValue?: any;
}> = ({ field, register, errors, watch, setValue }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const Icon = field.icon;
  const error = errors[field.name];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    if (setValue) {
      setValue(field.name, field.multiple ? files : files[0]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (setValue) {
      setValue(field.name, field.multiple ? newFiles : newFiles[0] || null);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "textarea":
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute top-4 left-3 pointer-events-none">
                <Icon className={`w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`} />
              </div>
            )}
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-lg border ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-none`}
            />
          </div>
        );

      case "select":
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none">
                <Icon className={`w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`} />
              </div>
            )}
            <select
              {...register(field.name)}
              className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-lg border ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  {...register(field.name)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-900 dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register(field.name)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="text-gray-900 dark:text-white">{field.label}</label>
          </div>
        );

      case "file":
        return (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                {...register(field.name)}
                accept={field.accept}
                multiple={field.multiple}
                onChange={handleFileUpload}
                className="hidden"
                id={`file-${field.name}`}
              />
              <label
                htmlFor={`file-${field.name}`}
                className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                  error
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="text-center">
                  <Upload className={`w-6 h-6 mx-auto mb-2 ${error ? "text-red-500" : "text-gray-400"}`} />
                  <p className={`text-sm ${error ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}>
                    {field.placeholder || "Click to upload files"}
                  </p>
                  {field.accept && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Accepted formats: {field.accept}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none">
                <Icon className={`w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`} />
              </div>
            )}
            <input
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-lg border ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Universal Form Component
export const UniversalForm: React.FC<IUniversalFormProps> = ({
  config,
  onSuccess,
  onError,
  className = "",
  showProgress = true,
  animated = true,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = getValidationSchema(config.formType, config.fields);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Calculate form progress
  const watchedFields = watch();
  const filledFields = Object.values(watchedFields).filter(
    (value) => value && value.toString().trim().length > 0
  ).length;
  const totalFields = config.fields.filter((field) => field.required).length;
  const formProgress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      let response;
      
      // Handle file uploads
      const formData = { ...data };
      const attachments: File[] = [];
      
      config.fields.forEach((field) => {
        if (field.type === "file" && formData[field.name]) {
          if (field.multiple && Array.isArray(formData[field.name])) {
            attachments.push(...formData[field.name]);
          } else if (formData[field.name] instanceof File) {
            attachments.push(formData[field.name]);
          }
          delete formData[field.name]; // Remove file from form data
        }
      });

      // Submit based on form type
      switch (config.formType) {
        case "contact":
          response = await submitContactForm(formData as IContactFormData, attachments);
          break;
        case "feedback":
          response = await submitFeedbackForm(formData as IFeedbackFormData, attachments);
          break;
        case "support":
          response = await submitSupportForm(formData as ISupportFormData);
          break;
        case "enrollment":
          response = await submitEnrollmentForm(formData as IEnrollmentFormData, attachments);
          break;
        default:
          throw new Error(`Unsupported form type: ${config.formType}`);
      }

      if (response.status === "success") {
        setIsSubmitted(true);
        reset();
        toast.success(config.successMessage || "Form submitted successfully!");
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Reset success state after 8 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 8000);
      } else {
        throw new Error(response.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast.error("Failed to submit form. Please try again later.");
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    const SuccessComponent = animated ? motion.div : "div";
    const successProps = animated ? {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 }
    } : {};

    return (
      <SuccessComponent {...successProps} className={`p-8 ${className}`}>
        <div className="text-center py-12">
          <motion.div
            initial={animated ? { scale: 0 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={animated ? { delay: 0.2, type: "spring", stiffness: 200 } : {}}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {config.successMessage || "Form Submitted Successfully!"}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Thank you for your submission. We'll get back to you soon.
          </p>
          
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium underline"
          >
            Submit Another Form
          </button>
        </div>
      </SuccessComponent>
    );
  }

  const FormComponent = animated ? motion.form : "form";
  const formProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <FormComponent
      {...formProps}
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {/* Header */}
      <div className="relative">
        {showProgress && (
          <div className="absolute top-0 right-0">
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {formProgress}% Complete
              </span>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {config.title}
        </h2>
        
        {config.subtitle && (
          <p className="text-gray-600 dark:text-gray-400">
            {config.subtitle}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <FormField
              field={field}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={animated ? { scale: isSubmitting ? 1 : 1.02 } : {}}
          whileTap={animated ? { scale: isSubmitting ? 1 : 0.98 } : {}}
          className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {config.submitButtonText || "Submit Form"}
            </>
          )}
        </motion.button>
      </div>
    </FormComponent>
  );
};

// Predefined form configurations
export const formConfigs = {
  contact: {
    title: "Get in Touch",
    subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    formType: "contact" as TFormType,
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text" as const,
        placeholder: "Enter your full name",
        required: true,
        icon: User,
        validation: { min: 2, max: 50 },
      },
      {
        name: "email",
        label: "Email Address",
        type: "email" as const,
        placeholder: "Enter your email address",
        required: true,
        icon: Mail,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel" as const,
        placeholder: "Enter your phone number",
        required: false,
        icon: Phone,
        validation: { min: 10 },
      },
      {
        name: "company",
        label: "Company",
        type: "text" as const,
        placeholder: "Enter your company name",
        required: false,
        icon: Building,
      },
      {
        name: "subject",
        label: "Subject",
        type: "text" as const,
        placeholder: "What is this regarding?",
        required: true,
        icon: MessageSquare,
        validation: { min: 5, max: 100 },
      },
      {
        name: "message",
        label: "Message",
        type: "textarea" as const,
        placeholder: "Tell us more about your inquiry...",
        required: true,
        icon: MessageSquare,
        rows: 4,
        validation: { min: 20, max: 1000 },
      },
    ],
    submitButtonText: "Send Message",
    successMessage: "Thank you for your message! We'll get back to you within 24 hours.",
  },

  feedback: {
    title: "Share Your Feedback",
    subtitle: "Help us improve by sharing your experience and suggestions.",
    formType: "feedback" as TFormType,
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text" as const,
        placeholder: "Enter your full name",
        required: false,
        icon: User,
      },
      {
        name: "email",
        label: "Email Address",
        type: "email" as const,
        placeholder: "Enter your email address",
        required: false,
        icon: Mail,
      },
      {
        name: "feedback_type",
        label: "Feedback Type",
        type: "select" as const,
        required: true,
        options: [
          { value: "course", label: "Course" },
          { value: "instructor", label: "Instructor" },
          { value: "platform", label: "Platform" },
          { value: "technical", label: "Technical" },
          { value: "general", label: "General" },
        ],
      },
      {
        name: "rating",
        label: "Rating",
        type: "select" as const,
        required: true,
        options: [
          { value: "5", label: "5 - Excellent" },
          { value: "4", label: "4 - Good" },
          { value: "3", label: "3 - Average" },
          { value: "2", label: "2 - Poor" },
          { value: "1", label: "1 - Very Poor" },
        ],
        icon: Star,
      },
      {
        name: "title",
        label: "Feedback Title",
        type: "text" as const,
        placeholder: "Brief title for your feedback",
        required: true,
        icon: MessageSquare,
        validation: { min: 5, max: 100 },
      },
      {
        name: "feedback_message",
        label: "Your Feedback",
        type: "textarea" as const,
        placeholder: "Share your detailed feedback...",
        required: true,
        icon: MessageSquare,
        rows: 4,
        validation: { min: 20, max: 1000 },
      },
      {
        name: "suggestions",
        label: "Suggestions for Improvement",
        type: "textarea" as const,
        placeholder: "Any suggestions for how we can improve?",
        required: false,
        icon: MessageSquare,
        rows: 3,
      },
    ],
    submitButtonText: "Submit Feedback",
    successMessage: "Thank you for your feedback! It helps us improve our services.",
  },

  support: {
    title: "Get Support",
    subtitle: "Having an issue? Let us know and we'll help you resolve it quickly.",
    formType: "support" as TFormType,
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text" as const,
        placeholder: "Enter your full name",
        required: true,
        icon: User,
        validation: { min: 2, max: 50 },
      },
      {
        name: "email",
        label: "Email Address",
        type: "email" as const,
        placeholder: "Enter your email address",
        required: true,
        icon: Mail,
      },
      {
        name: "issue_type",
        label: "Issue Type",
        type: "select" as const,
        required: true,
        options: [
          { value: "technical", label: "Technical Issue" },
          { value: "billing", label: "Billing Question" },
          { value: "course_access", label: "Course Access" },
          { value: "account", label: "Account Issue" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "priority",
        label: "Priority",
        type: "select" as const,
        required: true,
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ],
      },
      {
        name: "subject",
        label: "Subject",
        type: "text" as const,
        placeholder: "Brief description of the issue",
        required: true,
        icon: MessageSquare,
        validation: { min: 5, max: 100 },
      },
      {
        name: "description",
        label: "Issue Description",
        type: "textarea" as const,
        placeholder: "Please describe the issue in detail...",
        required: true,
        icon: MessageSquare,
        rows: 4,
        validation: { min: 20, max: 1000 },
      },
      {
        name: "steps_to_reproduce",
        label: "Steps to Reproduce",
        type: "textarea" as const,
        placeholder: "If applicable, describe the steps to reproduce the issue...",
        required: false,
        icon: MessageSquare,
        rows: 3,
      },
    ],
    submitButtonText: "Submit Support Request",
    successMessage: "Your support request has been submitted. We'll get back to you soon!",
  },
};

export default UniversalForm; 